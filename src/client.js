const amqp = require("amqplib/callback_api");
const { randomUUID } = require('crypto');

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

    const description = `Pedido ${randomUUID()}`;

    channel.sendToQueue(queue, Buffer.from(description), {
      persistent: true,
    });
  });

  setTimeout(() => {
    connection.close();
    process.exit(0);
  }, 500);
});
