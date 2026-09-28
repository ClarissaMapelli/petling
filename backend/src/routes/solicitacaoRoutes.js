const express = require('express');

const solicitacaoController = require('../controllers/solicitacaoController');
const autenticar = require('../middlewares/authMiddleware');

const router = express.Router();

// Público: enviar interesse em adoção
router.post('/', solicitacaoController.criar);

// Administrativo: consultar e gerenciar solicitações
router.get('/', autenticar, solicitacaoController.listar);
router.get('/:id', autenticar, solicitacaoController.buscarPorId);
router.patch('/:id/status', autenticar, solicitacaoController.atualizarStatus);

module.exports = router;