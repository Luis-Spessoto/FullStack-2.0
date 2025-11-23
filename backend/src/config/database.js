const mongoose = require('mongoose');

// Padrão de Pool de Conexões (Requisito: Mongoose gerencia o pool por padrão, mas configuramos)
const options = {
    minPoolSize: 5,  // Mínimo de 5 conexões abertas
    maxPoolSize: 10, // Máximo de 10 conexões no pool
    serverSelectionTimeoutMS: 5000 // Tenta conectar por 5 segundos
};

const dbConnect = async () => {
    try {
        const uri = process.env.MONGO_URI || 'mongodb://localhost:27017/FullStack';
        
        await mongoose.connect(uri);
        
        //Inserção de usuário de teste (para garantir o Login)
        const User = require('../models/User');
        const userCount = await User.countDocuments();
         
        if (userCount === 0) {
            await User.create({ 
                username: 'admin@site.com', 
                password: 'senha123', //Senha será hasheada pelo pre-save do Mongo
                role: 'admin'
            });
            console.log('>>> Usuário de teste criado (admin@site.com / senha123)');
        }
        console.log('Conexão com MongoDB estabelecida com sucesso.'); 

    } catch (err) {
        console.error('ERRO FATAL NA CONEXÃO COM O MONGODB:', err.message);
        process.exit(1);
    }
};

module.exports = dbConnect;