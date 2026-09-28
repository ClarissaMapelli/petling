const express = require('express');

const animalController = require('../controllers/animalController');
const autenticar = require('../middlewares/authMiddleware');

const router = express.Router();

router.get('/', animalController.listar);
router.get('/:id', animalController.buscarPorId);

router.post('/', autenticar, animalController.criar);
router.put('/:id', autenticar, animalController.atualizar);
router.delete('/:id', autenticar, animalController.excluir);
router.patch('/:id/status', autenticar, animalController.atualizarStatus);

module.exports = router;