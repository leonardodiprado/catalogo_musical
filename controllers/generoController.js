const { Genero, Artista, Disco, Sequelize } = require('../models');
const Op = Sequelize.Op;

// Listar todos os gêneros
async function listarGeneros(req, res) {
    try {
        const generos = await Genero.findAll();
        console.log("Gêneros encontrados:", generos);
        res.render('generoIndex', { generos });
    } catch (error) {
        console.error('Erro ao listar gêneros:', error);
        res.status(500).send('Erro ao listar gêneros');
    }
}

// Buscar gêneros
async function buscarGeneros(req, res) {
    const { query } = req.query;
    try {
        const generos = await Genero.findAll({
            where: {
                nome: {
                    [Op.iLike]: `%${query}%`
                }
            }
        });
        res.render('generoIndex', { generos });
    } catch (error) {
        console.error('Erro ao buscar gêneros:', error);
        res.status(500).send('Erro ao buscar gêneros');
    }
}

// Mostrar detalhes de um gênero
async function mostrarDetalhesGenero(req, res) {
    try {
        const generoId = parseInt(req.params.id, 10);
        console.log("ID do gênero para detalhes:", generoId);

        if (isNaN(generoId)) {
            throw new Error(`ID inválido para Gênero: ${req.params.id}`);
        }

        const genero = await Genero.findByPk(generoId, {
            include: [
                {
                    model: Disco,
                    as: 'discos',
                    include: [{
                        model: Artista,
                        as: 'artista'
                    }]
                }
            ]
        });

        if (!genero) {
            return res.status(404).send('Gênero não encontrado');
        }

        console.log("Gênero encontrado:", genero);
        res.render('detalhesGenero', { genero });
    } catch (error) {
        console.error('Erro ao buscar detalhes do gênero:', error);
        res.status(500).send('Erro ao buscar detalhes do gênero');
    }
}

// Mostrar formulário de edição de gênero
async function mostrarFormularioEdicao(req, res) {
    try {
        const genero = await Genero.findByPk(req.params.id);
        res.render('editGenero', { genero });
    } catch (error) {
        console.error('Erro ao buscar gênero para edição:', error);
        res.status(500).send('Erro ao buscar gênero para edição');
    }
}

// Editar um gênero existente
async function editarGenero(req, res) {
    const { nome } = req.body;
    try {
        await Genero.update(
            { nome },
            { where: { id: req.params.id } }
        );
        res.redirect('/generos');
    } catch (error) {
        console.error('Erro ao editar gênero:', error);
        res.status(500).send('Erro ao editar gênero');
    }
}

// Remover um gênero
async function removerGenero(req, res) {
    try {
        await Genero.destroy({ where: { id: req.params.id } });
        res.redirect('/generos');
    } catch (error) {
        console.error('Erro ao remover gênero:', error);
        res.status(500).send('Erro ao remover gênero');
    }
}

module.exports = {
    listarGeneros,
    buscarGeneros,
    mostrarDetalhesGenero,
    mostrarFormularioEdicao,
    editarGenero,
    removerGenero
};
