const express = require('express');
const router = express.Router();
const artistaController = require('../controllers/artistaController');

// Rota para listar artistas
router.get('/artistas', artistaController.listarArtistas);

// Rota para buscar artistas
router.get('/artistas/search', artistaController.buscarArtistas);

// Rota para mostrar o formulário de criação de artista - MOVIDO PARA O TOPO
router.get('/artista/create', artistaController.mostrarFormularioCriacao);

// Rota para mostrar os detalhes do artista
router.get('/artista/:id', artistaController.mostrarDetalhesArtista);

// Rota para criar um novo artista
router.post('/artista/create', artistaController.criarArtista);

// Rota para mostrar o formulário de edição de artista
router.get('/artista/edit/:id', artistaController.mostrarFormularioEdicao);

// Rota para editar um artista existente
router.post('/artista/edit/:id', artistaController.editarArtista);

// Rota para remover um artista
router.post('/artista/delete/:id', artistaController.removerArtista);

module.exports = router;
