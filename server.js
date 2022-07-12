const net = require('net')
const readline = require('readline')
const { randomUUID } = require('crypto')

const clients = []

function date () {
  let ts = Date.now()
  let date_ob = new Date(ts)
  let date = date_ob.getDate()
  let month = date_ob.getMonth() + 1
  let year = date_ob.getFullYear()
  let hours = date_ob.getHours();
  let minutes = date_ob.getMinutes();
  let seconds = date_ob.getSeconds();

  // prints date & time in YYYY-MM-DD format
  return `[${hours}:${minutes}:${seconds} - ${date}/${month}/${year}]`
}

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
})

function broadcast (message, origin) {
  clients.forEach(client => {
    if (client === origin || !message) return;
    client.write(`${date()} ${message}`)
    console.log(`${date()} ${message}`)
  })
}

function isChangeUsernameCommand(message) {
  return message.indexOf('/username') === 0
}

net.createServer(connection => {
  connection.write('server> Bem vindo ao server')
  clients.push(connection)
  connection.on('data', input => {
    let message = input.toString()
    if (isChangeUsernameCommand(message)) {
      const newUsername = message.replace('/username ', '')

      connection.username
        ? broadcast(`server> Usuario ${connection.username} mudou o nome para ${newUsername}`)
        : broadcast(`server> Usuario ${connection.id.slice(0, 8)} adicionou o nome ${newUsername}`)

      connection.username = newUsername
      return
    }

    if (!connection.isConnected) {
      connection.id = randomUUID()
      connection.isConnected = true
      return
    }
    connection.username
      ? broadcast(`${connection.username}>${message}`, connection)
      : broadcast(`user ${connection.id.slice(0, 8)}>${message}`, connection)
  })

  rl.addListener('line', line => {
    connection.write(`server> ${line}`)
  })
}).listen(3000)