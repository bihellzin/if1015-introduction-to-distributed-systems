const dgram = require('dgram');
const server = dgram.createSocket('udp4');

const add = (a ,b) => a + b;
const sub = (a ,b) => a - b;
const mul = (a ,b) => a * b;
const div = (a ,b) => a / b;

const operations = {
  '+': add,
  '-': sub,
  '*': mul,
  '/': div
}

server.on('message', (msg, rinfo) => {
  const args = msg.toString().split(' ')

  const result = String(operations[args[2]](Number(args[0]), Number(args[1])))

  console.log(`server got: ${msg} from ${rinfo.address}:${rinfo.port}`)
  server.send(result, rinfo.port, rinfo.address)
});

server.bind(3000)
