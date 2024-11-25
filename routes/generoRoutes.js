const express = require('express');
const router = express.Router();
const generoController = require('../controllers/generoController');

// Rota para listar gêneros
router.get('/generos', generoController.listarGeneros);

// Rota para buscar gêneros
router.get('/generos/search', generoController.buscarGeneros);

// Rota para mostrar detalhes de um gênero
router.get('/genero/:id', generoController.mostrarDetalhesGenero);

// Rota para mostrar o formulário de edição de gênero
router.get('/genero/edit/:id', generoController.mostrarFormularioEdicao);

// Rota para editar um gênero existente
router.post('/genero/edit/:id', generoController.editarGenero);

// Rota para remover um gênero
router.post('/genero/delete/:id', generoController.removerGenero);

module.exports = router;
