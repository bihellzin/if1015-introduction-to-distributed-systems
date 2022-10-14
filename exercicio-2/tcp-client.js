const net = require('net')
const client = net.connect(3001)

client.on('data', message => {
  console.log(message.toString())
})

client.on('connect', () => {
  console.log('Conectado')
})

process.stdin.on('data', input => {
  if (!input) return;
  const message = input.toString().replace(/\n/, '')
  client.write(message)
})