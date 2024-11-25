const express = require('express');
const router = express.Router();
const discoController = require('../controllers/discoController');

// Rota para listar discos
router.get('/discos', discoController.listarDiscos);

// Rota para buscar discos
router.get('/discos/search', discoController.buscarDiscos);

// Rota para mostrar o formulário de criação de disco
router.get('/disco/create', discoController.mostrarFormularioCriacao);

// Rota para criar um novo disco
router.post('/disco/create', discoController.criarDisco);

// Rota para mostrar o formulário de edição de disco
router.get('/disco/edit/:id', discoController.mostrarFormularioEdicao);

// Rota para editar um disco existente
router.post('/disco/edit/:id', discoController.editarDisco);

// Rota para remover um disco
router.post('/disco/delete/:id', discoController.removerDisco);

// Rota raiz
router.get('/', (req, res) => {
    res.redirect('/discos');
});

module.exports = router;
