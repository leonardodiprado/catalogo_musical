const { Artista, Disco, Genero, Sequelize } = require('../models');
const Op = Sequelize.Op;

// Listar todos os artistas
async function listarArtistas(req, res) {
    try {
        const artistas = await Artista.findAll();
        console.log("Artistas encontrados:", artistas); // Log dos artistas encontrados
        res.render('artistaIndex', { artistas });
    } catch (error) {
        console.error('Erro ao listar artistas:', error);
        res.status(500).send('Erro ao listar artistas');
    }
}

// Buscar artistas
async function buscarArtistas(req, res) {
    const { query } = req.query;
    try {
        const artistas = await Artista.findAll({
            where: {
                nome: {
                    [Op.iLike]: `%${query}%`
                }
            }
        });
        res.render('artistaIndex', { artistas });
    } catch (error) {
        console.error('Erro ao buscar artistas:', error);
        res.status(500).send('Erro ao buscar artistas');
    }
}

// Mostrar detalhes de um artista
async function mostrarDetalhesArtista(req, res) {
    try {
        const artistaId = parseInt(req.params.id, 10);
        console.log("ID do artista para detalhes:", artistaId); // Log do ID do artista

        if (isNaN(artistaId)) {
            throw new Error(`ID inválido para Artista: ${req.params.id}`);
        }

        const artista = await Artista.findByPk(artistaId, {
            include: [{
                model: Disco,
                as: 'discos' // Certifique-se de usar o alias correto aqui
            }]
        });

        if (!artista) {
            console.error(`Artista com ID ${artistaId} não encontrado`);
            return res.status(404).send('Artista não encontrado');
        }

        console.log("Artista encontrado:", artista); // Log do artista encontrado
        res.render('detalhesArtista', { artista });
    } catch (error) {
        console.error('Erro ao buscar detalhes do artista:', error);
        res.status(500).send('Erro ao buscar detalhes do artista');
    }
}

// Mostrar formulário de criação de artista
async function mostrarFormularioCriacao(req, res) {
    try {
        const discos = await Disco.findAll();
        res.render('createArtista', { discos });
    } catch (error) {
        console.error('Erro ao mostrar formulário de criação de artista:', error);
        res.status(500).send('Erro ao mostrar formulário de criação de artista');
    }
}

// Criar um novo artista
async function criarArtista(req, res) {
    const { nome, generos, discos } = req.body;
    try {
        console.log("Dados recebidos:", req.body); // Log dos dados recebidos

        const artista = await Artista.create({ nome });

        // Associar discos ao artista
        if (discos && discos.length > 0) {
            await artista.setDiscos(discos);
        }

        // Processar gêneros e associar aos discos do artista
        if (generos && generos.length > 0) {
            const generoIds = [];
            for (const generoNome of generos.split(',')) {
                let [generoInstance, created] = await Genero.findOrCreate({
                    where: { nome: generoNome.trim() }
                });
                generoIds.push(generoInstance.id);
            }

            // Associar os gêneros aos discos do artista
            if (discos && discos.length > 0) {
                for (const discoId of discos) {
                    const disco = await Disco.findByPk(discoId);
                    if (disco) {
                        await disco.setGeneros(generoIds);
                    }
                }
            }
        }

        res.redirect('/artistas'); // Redirecionar para a lista de artistas
    } catch (error) {
        console.error('Erro ao criar artista:', error);
        res.status(500).send('Erro ao criar artista');
    }
}


// Mostrar formulário de edição de artista
async function mostrarFormularioEdicao(req, res) {
    try {
        const artista = await Artista.findByPk(req.params.id, {
            include: [{
                model: Disco,
                as: 'discos' // Certifique-se de usar o alias correto aqui
            }]
        });
        const discos = await Disco.findAll();
        res.render('editArtista', { artista, discos });
    } catch (error) {
        console.error('Erro ao buscar artista para edição:', error);
        res.status(500).send('Erro ao buscar artista para edição');
    }
}

// Editar um artista existente
async function editarArtista(req, res) {
    const { nome, genero, discos, generos } = req.body;
    try {
        await Artista.update(
            { nome, genero },
            { where: { id: req.params.id } }
        );

        // Associar discos ao artista
        const artista = await Artista.findByPk(req.params.id);
        if (discos && discos.length > 0) {
            await artista.setDiscos(discos);
        }

        // Processar gêneros e associar aos discos do artista
        if (generos && generos.length > 0) {
            const generoIds = [];
            for (const generoNome of generos.split(',')) {
                let [generoInstance, created] = await Genero.findOrCreate({
                    where: { nome: generoNome.trim() }
                });
                generoIds.push(generoInstance.id);
            }

            // Associar os gêneros aos discos do artista
            if (discos && discos.length > 0) {
                for (const discoId of discos) {
                    const disco = await Disco.findByPk(discoId);
                    await disco.setGeneros(generoIds);
                }
            }
        }

        res.redirect('/artistas'); // Redirecionar para a lista de artistas
    } catch (error) {
        console.error('Erro ao editar artista:', error);
        res.status(500).send('Erro ao editar artista');
    }
}

// Remover um artista
async function removerArtista(req, res) {
    try {
        await Artista.destroy({ where: { id: req.params.id } });
        res.redirect('/artistas');
    } catch (error) {
        console.error('Erro ao remover artista:', error);
        res.status(500).send('Erro ao remover artista');
    }
}

module.exports = {
    listarArtistas,
    buscarArtistas,
    mostrarDetalhesArtista,
    mostrarFormularioCriacao,
    criarArtista,
    mostrarFormularioEdicao,
    editarArtista,
    removerArtista
};
