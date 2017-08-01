const child_process = require('child_process');
const notificationWorker = child_process.fork("src/bot/workers/notifications/notifications.js", { execPath: 'babel-node' } , []);	

notificationWorker.on('close', function (code) {
  console.log('child process exited with code ' + code);
});

export default notificationWorker;

