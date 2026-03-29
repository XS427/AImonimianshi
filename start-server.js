const { spawn } = require('child_process');

const child = spawn('bun', ['run', 'dev'], {
    detached: true,
    stdio: 'ignore',
    cwd: '/home/z/my-project'
});

child.unref();

console.log(`Server started with PID: ${child.pid}`);
