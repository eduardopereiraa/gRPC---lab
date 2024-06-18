const PROTO_PATH        = __dirname + '/lista_tarefas.proto';
const grpc              = require('@grpc/grpc-js');
const protoLoader       = require('@grpc/proto-loader');
const packageDefinition = protoLoader.loadSync(PROTO_PATH, 
   {
      keepCase: true,
      longs: String,
      enums: String,
      defaults: true,
      oneofs: true
   }
);
const DefinicaoTarefas = grpc.loadPackageDefinition(packageDefinition).DefinicaoTarefas;

const aTarefas = [
   {
      id          : 1,
      descricao   : 'Apresentação gRPC',
      data        : '28/06/2024',
      responsavel : 'Eduardo Pereira',
      realizado   : false,
   }
];

function ListarTodas(requisicao, callback) {
   return callback(null, {lista: aTarefas});
}
   
function AdicionarTarefa(requisicao, callback) {
   const {id, data, descricao, responsavel} = requisicao.request;
   
   const novaTarefa = {
      id,
      descricao,
      data,
      responsavel,
      realizado: false,
   };

   aTarefas.push(novaTarefa);

   return callback(null, novaTarefa)
}

function ConcluirTarefa(requisicao, callback) {
   const tarefaIndex = aTarefas.findIndex(tarefa => tarefa.id === requisicao.request.id);

   if (tarefaIndex === -1) {
     return callback({
       code: grpc.status.NOT_FOUND,
       details: 'A tarefa não existe'
     }, null);
   }
 
   aTarefas[tarefaIndex].realizado = true;
   return callback(null, aTarefas[tarefaIndex]);
}

const oServer = new grpc.Server();

oServer.addService(DefinicaoTarefas.APIListaDeTarefas.service, {ListarTodas, AdicionarTarefa, ConcluirTarefa});

oServer.bindAsync('127.0.0.1:50051', grpc.ServerCredentials.createInsecure(), (error, port) => {
   if (error) {
      console.log('Ocorreu um erro: ', error);
   } else {
      console.log('Servidor rodando na porta: ', port);
      oServer.start();
   }
});