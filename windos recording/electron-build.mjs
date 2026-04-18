import * as esbuild from 'esbuild';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const isWatch = process.argv.includes('--watch');

const baseConfig = {
  bundle: true,
  platform: 'node',
  format: 'cjs', // CJS is often more robust for Electron main/preload
  target: 'node22', 
  external: ['electron', 'ffmpeg-static', 'fluent-ffmpeg', 'electron-is-dev', 'electron-store', 'googleapis', 'dotenv'],
  sourcemap: true,
};

async function build() {
  const context = await esbuild.context({
    ...baseConfig,
    entryPoints: [
      { in: 'electron/main.ts', out: 'main' },
      { in: 'electron/preload.ts', out: 'preload' }
    ],
    outdir: 'dist-electron',
  });

  if (isWatch) {
    await context.watch();
    console.log('⚡ Electron build watching...');
  } else {
    await context.rebuild();
    await context.dispose();
    console.log('✨ Electron build complete');
  }
}

build().catch((err) => {
  console.error(err);
  process.exit(1);
});
