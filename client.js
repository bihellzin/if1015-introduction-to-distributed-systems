const net = require('net')
const client = net.connect(3000)

client.on('data', message => {
  console.log(message.toString())
})

client.on('connect', () => {
  client.write('Novo usuario conectado')
})

process.stdin.on('data', input => {
  if (!input) return;
  const message = input.toString().replace(/\n/, '')
  client.write(message)
})
