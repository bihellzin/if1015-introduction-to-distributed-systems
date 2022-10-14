const readline = require('readline')
const dgram = require('dgram');
const server = dgram.createSocket('udp4');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
})

const connections = {}

server.on('message', (msg, rinfo) => {
  if (!connections[`${rinfo.address}:${rinfo.port}`]) {
    connections[`${rinfo.address}:${rinfo.port}`] = rinfo
  }
  console.log(`server got: ${msg} from ${rinfo.address}:${rinfo.port}`)
});

rl.addListener('line', line => {
  Object.keys(connections).forEach(key => {
    server.send(`server> ${line}`, connections[key].port, connections[key].address);
  })
})

server.bind(3000)
