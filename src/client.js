const parseArgs = require('minimist');
const grpc = require('@grpc/grpc-js');
const protoLoader = require('@grpc/proto-loader');
const packageDef = protoLoader.loadSync('../protos/calculator.proto', {});

const grpcObject = grpc.loadPackageDefinition(packageDef);
const calculatorPackage = grpcObject.calculatorPackage;

const client = new calculatorPackage.Calculator('localhost:42000', 
grpc.credentials.createInsecure());

const argv = parseArgs(process.argv.slice(2))
const [firstNumber, secondNumber, operation] = argv._;

client.calculate({
  firstNumber,
  secondNumber,
  operation
}, (err, response) => {
  console.log(response.result)
})
