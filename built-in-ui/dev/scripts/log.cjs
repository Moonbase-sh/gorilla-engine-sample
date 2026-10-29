const { spawn } = require('node:child_process');
const { createWriteStream } = require('node:fs');

const script = process.argv[2];
if (!['start', 'deploy'].includes(script)) {
  console.error('Usage: node dev/scripts/log.cjs <start|deploy>');
  process.exit(1);
}

const log = createWriteStream(script === 'start' ? 'standalone.log' : 'deploy.log', { flags: 'w' });
const child = spawn(process.execPath, [process.env.npm_execpath, 'run', script], {
  stdio: ['inherit', 'pipe', 'pipe'],
});

child.stdout.pipe(process.stdout);
child.stderr.pipe(process.stderr);
child.stdout.pipe(log, { end: false });
child.stderr.pipe(log, { end: false });

for (const signal of ['SIGINT', 'SIGTERM']) {
  process.on(signal, () => child.kill(signal));
}

log.on('error', (error) => {
  console.error(error);
  child.kill();
  process.exitCode = 1;
});

child.on('error', (error) => {
  console.error(error);
  log.end();
  process.exitCode = 1;
});

child.on('close', (code, signal) => {
  log.end();
  process.exitCode = process.exitCode || code || (signal ? 1 : 0);
});