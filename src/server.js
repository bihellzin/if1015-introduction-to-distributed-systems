const grpc = require("@grpc/grpc-js");
const protoLoader = require("@grpc/proto-loader");

const server = new grpc.Server();

const grpcObject = grpc.loadPackageDefinition(
  protoLoader.loadSync("../protos/chat.proto", {
    keepCase: true,
    longs: String,
    enums: String,
    defaults: true,
    oneofs: true,
  })
);

const chatPackage = grpcObject.chatPackage;

const users = [];

function join(call, callback) {
  users.push(call);
  notifyChat({ user: "Server", text: "new user joined ..." });
}

function send(call, callback) {
  notifyChat(call.request);
}

function notifyChat(message) {
  users.forEach((user) => {
    user.write(message);
  });
}

server.bindAsync(
  "0.0.0.0:42000",
  grpc.ServerCredentials.createInsecure(),
  (err, result) => (!err ? server.start() : logger.error(err))
);
server.addService(chatPackage.Chat.service, { join: join, send: send });

console.log("Server started");
