const grpc = require('@grpc/grpc-js');
const protoLoader = require('@grpc/proto-loader');
const packageDef = protoLoader.loadSync('../protos/calculator.proto', {});

const grpcObject = grpc.loadPackageDefinition(packageDef);
const calculatorPackage = grpcObject.calculatorPackage;

const server = new grpc.Server();
server.bindAsync(
  '0.0.0.0:42000',
  grpc.ServerCredentials.createInsecure(),
  (err, result) => !err ? server.start() : logger.error(err)
);

server.addService(calculatorPackage.Calculator.service, {
  "calculate": calculate
});

function calculate(call, callback) {
  const request = call.request;
  const { operation, firstNumber, secondNumber } = request;
  console.log(`resolving ${firstNumber} ${operation} ${secondNumber}`)

  const result = operations[operation](firstNumber, secondNumber);
  console.log(`${firstNumber} ${operation} ${secondNumber} = ${result}`)
  callback(null, {result});
}

const add = (a ,b) => a + b;
const sub = (a ,b) => a - b;
const mul = (a ,b) => a * b;
const div = (a ,b) => a / b;

const operations = {
  '+': add,
  '-': sub,
  'x': mul,
  '/': div
}
