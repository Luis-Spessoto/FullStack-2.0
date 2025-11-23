const express = require('express');
const { check, validationResult } = require('express-validator');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const NodeCache = require('node-cache');

const router = express.Router();
const Movie = require('../models/Movie');
const User = require('../models/User');

const movieCache = new NodeCache({ stdTTL: 60, checkperiod: 120 }); //Cache de 60 segundos (Requisito)

//Autenticação
const authenticateToken = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];
    
    if (token == null) {
        //Falha de autenticação
        return res.status(401).json({ message: 'Acesso negado: Token ausente!' });
    }

    jwt.verify(token, process.env.JWT_SECRET || 'fallback_secret', (err, user) => {
        if (err) {
            //Falha de autenticação: Token inválido (log de segurança)
            console.log(`[LOG] Tentativa de acesso com token inválido: ${token}`);
            return res.status(403).json({ message: 'Acesso negado: Token inválido.' });
        }
        req.user = user;
        next();
    });
};


//Rota 1: LOGIN (POST) - Cria login
router.post('/auth/login', [
    check('username').isEmail().withMessage('O username deve ser um email válido.'),
    check('password').isLength({ min: 6 }).withMessage('A senha deve ter no mínimo 6 caracteres.')
], async (req, res) => {
    //1. Verificação de preenchimento de campos no servidor (express-validator)
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
    const { username, password } = req.body;
    try {
        const user = await User.findOne({ username });
        if (!user) {
            return res.status(401).json({ message: 'Usuário ou senha inválidos.' });
        }
        const isMatch = await user.comparePassword(password);
        if (!isMatch) {
            console.log(`[LOG] Falha de login para o usuário: ${username}`);
            return res.status(401).json({ message: 'Usuário ou senha inválidos.' });
        }

        //Gera o Token JWT (Falhas de identificação e autenticação)
        const token = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET || 'fallback_secret', { expiresIn: '30m' });
        
        res.json({ token, username: user.username });

    } catch (error) {
        console.error('Erro no login:', error);
        res.status(500).json({ message: 'Erro interno do servidor.' });
    }
});


//ROTA 2: BUSCA (GET) - Requer login
router.get('/movies', authenticateToken, async (req, res) => {
    //Implementação do padrão REST
    const { search } = req.query; 

    //1. Estratégia de Cache no Back-end
    const cacheKey = `search:${search}`;
    const cachedResults = movieCache.get(cacheKey);

    if (cachedResults) {
        console.log(`[CACHE] Retornando resultados para "${search}" do cache.`);
        return res.json({ source: 'cache', movies: cachedResults });
    }

    try {
        //Implementação de regras de segurança: Prevenção de NoSQL Injection (Mongoose faz sanitização)
        const movies = await Movie.find({ 
            $text: { $search: search } 
        }).limit(20);

        //Armazena no cache antes de retornar
        movieCache.set(cacheKey, movies);
        console.log(`[CACHE] Armazenando resultados para "${search}" no cache.`);
        
        console.log(`[CACHE] Busca realizada por: ${req.user.username}`);

        res.json({ source: 'db', movies });

    } catch (error) {
        console.error('Erro na busca de filmes:', error);
        res.status(500).json({ message: 'Erro ao buscar filmes.' });
    }
});


// ROTA 3: INSERÇÃO (POST) 
router.post('/movies', authenticateToken, [
    check('title').notEmpty().withMessage('O título do filme é obrigatório.').escape().trim(),
    check('year').isLength({ min: 4, max: 4 }).withMessage('O ano deve ter 4 dígitos.').escape().trim(),
    check('imdbID').escape().trim(),
    check('posterUrl').optional({ checkFalsy: true }).isURL().withMessage('O Poster deve ser uma URL válida.').escape().trim(),
    //Implementação de regras de segurança: Uso de sanitizers para prevenir XSS/NoSQL inject
    check('director').escape().trim(),
    check('genre').escape().trim(),
], async (req, res) => {
    //1. Verificação de Preenchimento de Campos no Servidor
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
    
    //Express-validator já sanitizou director e genre (prevenção de injeção)
    const { title, year, director, genre, imdbID, posterUrl } = req.body;

    try {
        const newMovie = new Movie({
            title,
            year,
            director,
            genre,
            imdbID,
            userId: req.user.username,
            posterUrl
        });

        await newMovie.save();
        
        console.log(`[LOG] Filme inserido por: ${req.user.username} - ID: ${newMovie.imdbID}`);

        res.status(201).json({ message: 'Filme inserido com sucesso no banco de dados!', movie: newMovie });

    } catch (error) {
        //Erro 11000 = Duplicidade de imdbID
        if (error.code === 11000) {
            return res.status(409).json({ message: 'Este filme (ID) já existe no banco de dados.' });
        }
        console.error('Erro ao inserir filme:', error);
        res.status(500).json({ message: 'Erro interno ao salvar filme.' });
    }
});

module.exports = router;