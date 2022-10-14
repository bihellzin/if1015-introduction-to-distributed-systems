const dgram = require('dgram');
const client = dgram.createSocket('udp4');

client.on('message', (msg, rinfo) => {
  console.log(`server> ${msg.toString()}`);
});

process.stdin.on('data', input => {
  if (!input) return;
  const message = input.toString().replace(/\n/, '')
  client.send(message, 3000, 'localhost', err => {
    if (err) {
      client.close()
    }
  });
})
