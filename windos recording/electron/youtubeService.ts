import { google } from 'googleapis';
import { OAuth2Client } from 'google-auth-library';
import http from 'http';
import { shell } from 'electron';
import Store from 'electron-store';

const store = new Store();

// IMPORTANT: Obtain real credentials from Google Cloud Console
const CLIENT_ID = process.env.GOOGLE_CLIENT_ID || 'PENDING';
const CLIENT_SECRET = process.env.GOOGLE_CLIENT_SECRET || 'PENDING';
const REDIRECT_URI = process.env.GOOGLE_REDIRECT_URI || 'http://localhost:3000/callback';

export class YouTubeService {
  private oauth2Client: OAuth2Client;
  public activeServer: http.Server | null = null;

  constructor() {
    this.oauth2Client = new google.auth.OAuth2(
      CLIENT_ID,
      CLIENT_SECRET,
      REDIRECT_URI
    );

    // Load persisted tokens
    const tokens = store.get('youtube_tokens') as any;
    if (tokens) {
      this.oauth2Client.setCredentials(tokens);
    }

    this.oauth2Client.on('tokens', (newTokens) => {
      const existingTokens = store.get('youtube_tokens') as any || {};
      const merged = { ...existingTokens, ...newTokens };
      store.set('youtube_tokens', merged);
      console.log('[YouTubeService] Tokens updated and persisted');
    });
  }

  async isAuthenticated(): Promise<boolean> {
    const tokens = this.oauth2Client.credentials;
    if (!tokens || !tokens.access_token) return false;
    
    // Simple check if expired
    if (tokens.expiry_date && tokens.expiry_date < Date.now()) {
      try {
        await this.oauth2Client.getAccessToken();
        return true;
      } catch (err) {
        console.error('[YouTubeService] Token refresh failed:', err);
        return false;
      }
    }
    return true;
  }

  async login(): Promise<any> {
    const authUrl = this.oauth2Client.generateAuthUrl({
      access_type: 'offline',
      scope: [
        'https://www.googleapis.com/auth/youtube',
        'https://www.googleapis.com/auth/youtube.upload',
        'https://www.googleapis.com/auth/youtube.readonly'
      ],
      prompt: 'consent'
    });

    return new Promise((resolve, reject) => {
      // Close any previously running login server
      if (this.activeServer) {
        this.activeServer.close();
        this.activeServer = null;
      }

      this.activeServer = http.createServer(async (req, res) => {
        if (req.url?.startsWith('/callback')) {
          const url = new URL(req.url, REDIRECT_URI);
          const code = url.searchParams.get('code');

          if (code) {
            try {
              const { tokens } = await this.oauth2Client.getToken(code);
              this.oauth2Client.setCredentials(tokens);
              store.set('youtube_tokens', tokens);
              
              res.end('Authentication successful! You can close this window.');
              if (this.activeServer) {
                this.activeServer.close();
                this.activeServer = null;
              }

              const userInfo = await this.getUserInfo();
              resolve(userInfo);
            } catch (err) {
              res.end('Authentication failed. Please check the logs.');
              reject(err);
            }
          }
        }
      }).listen(3000, () => {
        shell.openExternal(authUrl);
      });

      // Timeout after 5 minutes
      setTimeout(() => {
        if (this.activeServer) {
          this.activeServer.close();
          this.activeServer = null;
        }
        reject(new Error('Authentication timed out'));
      }, 300000);
    });
  }

  async logout(): Promise<void> {
    store.delete('youtube_tokens');
    this.oauth2Client.setCredentials({});
  }

  async getUserInfo(): Promise<any> {
    const youtube = google.youtube({ version: 'v3', auth: this.oauth2Client });
    const response = await youtube.channels.list({
      part: ['snippet', 'statistics'],
      mine: true
    });
    return response.data.items?.[0] || null;
  }

  /**
   * createBroadcast: Complete flow to get an RTMP stream key
   * 1. Insert Broadcast
   * 2. Insert Stream
   * 3. Bind Broadcast to Stream
   */
  async createBroadcast(title: string = `Krutanic Live - ${new Date().toLocaleString()}`): Promise<{ rtmpUrl: string, streamKey: string, broadcastId: string }> {
    const youtube = google.youtube({ version: 'v3', auth: this.oauth2Client });

    // 1. Create Broadcast
    const broadcastResp = await youtube.liveBroadcasts.insert({
      part: ['snippet', 'status', 'contentDetails'],
      requestBody: {
        snippet: {
          title,
          scheduledStartTime: new Date().toISOString(),
        },
        status: {
          privacyStatus: 'private', // Default to private as requested
          selfDeclaredMadeForKids: false,
        },
        contentDetails: {
          enableAutoStart: true,
          enableAutoStop: true,
          monitorStream: {
            enableMonitorStream: false
          }
        }
      }
    });

    const broadcastId = broadcastResp.data.id!;

    // 2. Create Stream
    const streamResp = await youtube.liveStreams.insert({
      part: ['snippet', 'cdn', 'status'],
      requestBody: {
        snippet: { title: `Stream for ${broadcastId}` },
        cdn: {
          frameRate: '30fps',
          ingestionType: 'rtmp',
          resolution: '1080p',
        }
      }
    });

    const streamId = streamResp.data.id!;
    const rtmpUrl = streamResp.data.cdn!.ingestionInfo!.ingestionAddress!;
    const streamKey = streamResp.data.cdn!.ingestionInfo!.streamName!;

    // 3. Bind
    await youtube.liveBroadcasts.bind({
      id: broadcastId,
      part: ['id', 'contentDetails'],
      streamId: streamId
    });

    return { rtmpUrl, streamKey, broadcastId };
  }
}
