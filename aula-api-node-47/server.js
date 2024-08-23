const express = require("express");
const cors = require("cors");

const app = express();

var corsOptions = {
  origin: "*"
};

const TOKEN = '1a2b3c4d';

app.use(cors(corsOptions));
// parse requests of content-type - application/json
app.use(express.json()); 
// parse requests of content-type - application/x-www-form-urlencoded
app.use(express.urlencoded({ extended: true }));  
// middleware
app.use(function (req, res, next) {
  if (req.headers.token === TOKEN) {
    next();
  } else {
    res.status(400).send({
      messagem: 'Token inexistente ou inválido'
    });
  }
});
// FRONTEND => API (middleware) => API => BANCO DE DADOS
// FRONTEND TOKEN INVALIDO <= API (middleware)

// route config
// simple route
var bancoDeDados = [
  {
    id: 1,
    nome: 'Lucas',
    cidade: 'Manaus',
    deletedAt: null,
  },
  {
    id: 2,
    nome: 'João',
    cidade: 'São Paulo',
    deletedAt: null,
  },
  {
    id: 3,
    nome: 'Gabriela',
    cidade: 'Rio de Janeiro',
    deletedAt: '22/08/2024 19:00',
  }
];

app.get("/clientes", (req, res) => {
  res.status(200).send({
    lista: bancoDeDados.filter(item => item.deletedAt == null)
  });
});

app.get("/cliente/:id", (req, res) => {
  var idRequest = req.params.id;
  var usuario = bancoDeDados.find(i => i.id == idRequest);

  if (usuario) {
    res.status(200).send({
      usuario: usuario
    });
  } else {
    res.status(400).send({
      messagem: 'Não existe esse usuário'
    });
  }
});

app.post("/criar/cliente", (req, res) => {
  if (!req.body.nome) {
    res.status(400).send({
      messagem: 'Nome é obrigatório'
    });
  } else {
    var novoId = bancoDeDados[bancoDeDados.length-1].id + 1;
    var novoElemento = {
      id: novoId,
      nome: req.body.nome,
      cidade: req.body.cidade
    };
    bancoDeDados.push(novoElemento);

    res.status(200).send({
      novoElemento: novoElemento
    });
  }
});

app.put("/atualizar/cliente/:id", (req, res) => {
  var idRequest = req.params.id;
  var usuarioIndex = bancoDeDados.findIndex(i => i.id == idRequest);

  if (usuarioIndex >= 0) {
    var novoNome = req.body.nome || bancoDeDados[usuarioIndex].nome;
    var novaCidade = req.body.cidade || bancoDeDados[usuarioIndex].cidade;

    bancoDeDados[usuarioIndex] = {
      id: bancoDeDados[usuarioIndex].id,
      nome: novoNome,
      cidade: novaCidade,
    };

    res.status(200).send({
      lista: bancoDeDados.filter(item => item.deletedAt == null)
    });
  } else {
    res.status(400).send({
      messagem: 'Usuário não existente'
    });
  }
});

// deletar a linha do banco (não recomendado)
app.delete("/deletar-linha/cliente/:id", (req, res) => {
  // banco de dados
  // tabela chamada cliente
  // Id | Nome | Nascimento | Cidade | Email | CreatedAt | UpdatedAt | DeletedAt
  //  1 | Posto ABC ************************************************ | 22/08/2024 19:00 
  //  2 | Posto ABCDEF 

  var idRequest = req.params.id;
  var usuarioIndex = bancoDeDados.findIndex(i => i.id == idRequest);

  if (usuarioIndex >= 0) {
    var bancoAtualizado = [];
    console.log('usuarioIndex', usuarioIndex);
    bancoDeDados.forEach((item, index) => {
      if (index !== usuarioIndex) {
        bancoAtualizado.push(item);
      }
    });

    res.status(200).send({
      lista: bancoAtualizado
    });
  } else {
    res.status(400).send({
      messagem: 'Usuário não existente'
    });
  }
});

// CRUD
// Create Read Update Delete

// adicionar um valor na coluna DeletedAt (recomendado)
app.delete("/deletar/cliente/:id", (req, res) => {
  // banco de dados
  // tabela chamada cliente
  // Id | Nome | Nascimento | Cidade | Email | CreatedAt | UpdatedAt | DeletedAt
  //  1 | Posto ABC ************************************************ | 22/08/2024 19:00 
  //  2 | Posto ABCDEF 
  
  var idRequest = req.params.id;
  var usuarioIndex = bancoDeDados.findIndex(i => i.id == idRequest);

  if (usuarioIndex >= 0) {
    bancoDeDados[usuarioIndex].deletedAt = '22/08/2024 20:00';

    res.status(200).send({
      listaSemOsDeletados: bancoDeDados.filter(item => item.deletedAt == null),
      listaComOsDeletados: bancoDeDados,
      listaSomenteOsDeletados: bancoDeDados.filter(item => item.deletedAt != null),
    });
  } else {
    res.status(400).send({
      messagem: 'Usuário não existente'
    });
  }
});

// set port, listen for requests
app.listen(9000);
