const net = require('net');

const add = (a, b) => a + b;
const sub = (a, b) => a - b;
const mul = (a, b) => a * b;
const div = (a, b) => a / b;

const operations = {
  '+': add,
  '-': sub,
  '*': mul,
  '/': div
}

net.createServer(connection => {
  connection.write('server> Bem vindo ao server')
  connection.on('data', input => {
    const message = input.toString();
    
    console.log(`server got: ${message} from client`);
    const args = message.split(' ');
    const result = String(operations[args[2]](Number(args[0]), Number(args[1])));

    connection.write(`server> ${result}`);
  });
}).listen(3001)