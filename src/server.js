const amqp = require("amqplib/callback_api");
const websocket = require("ws");

const server = new websocket.Server({
  port: 4200,
});

const orders = [
  {
    description: "Pedido 1",
  },
  {
    description: "Pedido 2",
  },
  {
    description: "Pedido 3",
  },
];

let connections = [];

server.on("connection", (connection) => {
  connections.push(connection);
  connection.send(JSON.stringify(orders));

  connection.on("message", (msg) => {
    orders.shift();
    console.log(msg.toString());
    connections.forEach((s) => s.send(JSON.stringify(orders)));
  });

  connection.on("close", () => {
    connections = connections.filter((s) => s !== connection);
  });

  setInterval(() => {
    connections.forEach((s) => s.send(JSON.stringify(orders)));
  }, 2000);
});

amqp.connect("amqp://localhost", function (error0, connection) {
  if (error0) {
    throw error0;
  }
  connection.createChannel(function (error1, channel) {
    if (error1) {
      throw error1;
    }

    const queue = "orders";

    channel.assertQueue(queue, {
      durable: true,
    });

    channel.consume(
      queue,
      (msg) => {
        console.log(`Novo pedido: ${msg.content.toString()}`);
        orders.push({
          description: msg.content.toString(),
        });
      },
      {
        noAck: true,
      }
    );
  });
});
