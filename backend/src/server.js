const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const helmet = require('helmet');
const compression = require('compression');
require('dotenv').config();

const apiRoutes = require('./routes/api.js');
const dbConnect = require('./config/database.js');

const app = express();
const PORT = process.env.PORT || 3000;

//Configuração MONGO
dbConnect();

app.use(helmet()); //Proteção contra vulnerabilidades HTTP
app.use(cors());   //Permite requisições do frontend
app.use(compression()); //Compressão de respostas para otimização
app.use(express.json()); //Permite ler JSON 

app.use((req, res, next) => {
    console.log(`[LOG] ${new Date().toISOString()} - ${req.method} ${req.url}`);
    next();
});

//Rotas da API
app.use('/api/v1', apiRoutes);

//Rota de Teste 
app.get('/', (req, res) => {
    res.send('Backend funcionando!');
});

//Inicializar
app.listen(PORT, () => {
    console.log(`\nServidor rodando na porta ${PORT}`);
    console.log(`Conectado ao MongoDB.`);
    console.log('Rotas RESTful ativas em /api/v1');
});