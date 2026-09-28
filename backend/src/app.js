const express = require('express');
const cors = require('cors');

const animalRoutes = require('./routes/animalRoutes');
const solicitacaoRoutes = require('./routes/solicitacaoRoutes');
const authRoutes = require('./auth/authRoutes');

const app = express();

app.use(cors());
app.use(express.json());

app.get('/', (req, res) => {
    res.json({
        mensagem: 'Petling API funcionando!'
    });
});

app.use('/animais', animalRoutes);
app.use('/solicitacoes', solicitacaoRoutes);
app.use('/', authRoutes);

module.exports = app;