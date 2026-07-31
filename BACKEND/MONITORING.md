# MongoDB Production Best Practices & Monitoring

## Connection Management
### Connection Caching
We've implemented a **Singleton Connection Pattern** in `config/db.js`. This is critical for serverless environments (like Vercel) to prevent creating a new connection for every request, which leads to:
- Connection pool limits being exhausted.
- "Buffering timed out" errors during cold starts.

### Connection Options
The following options have been tuned for production:
- `maxPoolSize: 10`: Limits the number of concurrent connections. adequate for most free-tier/SMB apps.
- `serverSelectionTimeoutMS: 5000`: Fails fast (5s) if DB is unreachable, rather than hanging for default 30s.
- `socketTimeoutMS: 45000`: closes inactive sockets to prevent stale connection issues.

## Monitoring Recommendations

### 1. MongoDB Atlas Alerts (Free)
Enable these alerts in your MongoDB Atlas dashboard:
- **Connections**: Alert if connections > 80% of limit (Free tier limit is usually 500).
- **Network**: Alert on significant spike in Network In/Out.
- **CPU**: Alert if CPU usage > 80% (indicates unindexed queries).

### 2. Application Logging
We added event listeners in `db.js`. In production, consider integrating a logging service like **Sentry** or **LogRocket** to capture:
- `mongoose.connection.on('error')` events.
- Uncaught exceptions related to DB connectivity.

For Vercel integration:
1. Add `winston` or `pino` for structured logging.
2. Stream logs to a persistent storage (e.g., Datadog, or Vercel's built-in logs).

## Free-Tier Specifics
- **Cold Starts**: The `await connectDB()` middleware ensures requests don't fail during cold starts, but it will add latency to the *first* request.
- **Atlas Free Tier**: It has strict limits on IOPS and connection counts. Ensure your indexes are optimized (`explain()` your queries).
- **Network Access**: distinct "Whitelist all IPs" (`0.0.0.0/0`) is often required for serverless platforms with dynamic IPs, but try to restrict this if your platform supports static IPs (Vercel Enterprise only).

## Error Handling Checklist
- [x] Application waits for DB connection before handling requests.
- [x] Connection errors result in 500 responses, not infinite hangs.
- [ ] Ensure `MONGO_URI` in production includes the correct database name (e.g., `.../myDatabase?retryWrites=true&w=majority`).
