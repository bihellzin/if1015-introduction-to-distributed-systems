const readline = require("readline");
const grpc = require('@grpc/grpc-js');
const protoLoader = require('@grpc/proto-loader');

var rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});


const packageDef = protoLoader.loadSync('../protos/chat.proto', {});

const grpcObject = grpc.loadPackageDefinition(packageDef);
const chatPackage = grpcObject.chatPackage;

let username;

//Create gRPC client
let client = new chatPackage.Chat(
  '0.0.0.0:42000',
  grpc.credentials.createInsecure()
);

function startChat() {
  let channel = client.join({ user: username });

  channel.on("data", onData);

  rl.on("line", function(text) {
    client.send({ user: username, text: text }, res => {});
  });
}

//When server send a message
function onData(message) {
  if (message.user == username) {
    return;
  }
  console.log(`${message.user}: ${message.text}`);
}

//Ask user name than start the chat
rl.question("What's ur name? ", answer => {
  username = answer;

  startChat();
});