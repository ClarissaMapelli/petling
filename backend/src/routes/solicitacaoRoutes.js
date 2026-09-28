const express = require('express');
const solicitacaoController = require('../controllers/solicitacaoController');

const router = express.Router();

router.post('/', solicitacaoController.criar);

router.get('/', solicitacaoController.listar);

router.get('/:id', solicitacaoController.buscarPorId);

router.patch('/:id/status', solicitacaoController.atualizarStatus);

module.exports = router;