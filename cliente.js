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

const oClient = new DefinicaoTarefas.APIListaDeTarefas('localhost:50051', grpc.credentials.createInsecure())

oClient.ListarTodas({}, (error, tarefas) => {
   if (error) {
      throw error;
   }

   console.log('Lista de Tarefas:', tarefas.lista);
});

const novaTarefa = {
   id          : 2,
   descricao   : 'Apresentar TCC na Pré-Banca',
   data        : '24/06/2024',
   responsavel : 'Eduardo Pereira',
   realizado   : false
};

oClient.AdicionarTarefa(novaTarefa, (error, tarefa) => {
   if (error) {
      throw error;
   }

   console.log('Tarefa Adicionada:', tarefa);
});

oClient.ConcluirTarefa({id: 2}, (error, tarefa) => {
   if (error) {
      throw error
   }

  console.log('Tarefa Concluída:', tarefa);
});