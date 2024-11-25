const { Disco, Artista, Genero, Sequelize } = require('../models');
const Op = Sequelize.Op;

// Listar todos os discos
async function listarDiscos(req, res) {
    try {
        const discos = await Disco.findAll({
            include: [
                { model: Artista, as: 'artista' },
                { model: Genero, as: 'generos' }
            ]
        });
        res.render('discoIndex', { discos });
    } catch (error) {
        console.error('Erro ao listar discos:', error);
        res.status(500).send('Erro ao listar discos');
    }
}

// Buscar discos
async function buscarDiscos(req, res) {
    const { query } = req.query;
    try {
        const discos = await Disco.findAll({
            where: {
                titulo: {
                    [Op.iLike]: `%${query}%`
                }
            },
            include: [
                { model: Artista, as: 'artista' },
                { model: Genero, as: 'generos' }
            ]
        });
        res.render('discoIndex', { discos });
    } catch (error) {
        console.error('Erro ao buscar discos:', error);
        res.status(500).send('Erro ao buscar discos');
    }
}

// Mostrar formulário de criação de disco
function mostrarFormularioCriacao(req, res) {
    res.render('createDisco');
}

// Criar um novo disco
async function criarDisco(req, res) {
    const { titulo, anoLancamento, capa, faixas, artistaId, generos } = req.body;
    try {
        console.log("Dados recebidos:", req.body); // Log dos dados recebidos

        const disco = await Disco.create({ 
            titulo, 
            anoLancamento, 
            capa, 
            faixas: JSON.parse(faixas), 
            artistaId 
        });

        if (generos && generos.length > 0) {
            const generoIds = [];
            for (const generoNome of generos.split(',')) {
                let [generoInstance, created] = await Genero.findOrCreate({
                    where: { nome: generoNome.trim() }
                });
                generoIds.push(generoInstance.id);
            }
            await disco.setGeneros(generoIds); // Corrige a associação de gêneros
        }
        
        res.redirect('/discos');
    } catch (error) {
        console.error('Erro ao criar disco:', error);
        res.status(500).send('Erro ao criar disco');
    }
}

// Mostrar formulário de edição de disco
async function mostrarFormularioEdicao(req, res) {
    try {
        const discoId = req.params.id;
        console.log("ID do disco para edição:", discoId); // Log do ID do disco

        const disco = await Disco.findByPk(discoId, {
            include: [
                { model: Artista, as: 'artista' },
                { model: Genero, as: 'generos' }
            ]
        });

        if (!disco) {
            console.error(`Disco com ID ${discoId} não encontrado`);
            return res.status(404).send('Disco não encontrado');
        }

        console.log("Disco encontrado para edição:", disco); // Log do disco encontrado

        res.render('editDisco', { disco });
    } catch (error) {
        console.error('Erro ao buscar disco para edição:', error);
        res.status(500).send('Erro ao buscar disco para edição');
    }
}

// Editar um disco existente
async function editarDisco(req, res) {
    const { titulo, anoLancamento, capa, faixas, artistaId, generos } = req.body;
    const discoId = req.params.id;
    try {
        console.log("Dados recebidos para edição:", req.body); // Log dos dados recebidos
        console.log("ID do disco para edição:", discoId); // Log do ID do disco

        const [updated] = await Disco.update(
            { titulo, anoLancamento, capa, faixas: JSON.parse(faixas), artistaId },
            { where: { id: discoId } }
        );

        if (updated) {
            const disco = await Disco.findByPk(discoId);
            if (generos && generos.length > 0) {
                const generoIds = [];
                for (const generoNome of generos.split(',')) {
                    let [generoInstance, created] = await Genero.findOrCreate({
                        where: { nome: generoNome.trim() }
                    });
                    generoIds.push(generoInstance.id);
                }
                await disco.setGeneros(generoIds); // Corrige a associação de gêneros
            }
            console.log("Disco atualizado:", disco); // Log do disco atualizado
            res.redirect('/discos');
        } else {
            console.error(`Disco com ID ${discoId} não encontrado para atualização`);
            res.status(404).send('Disco não encontrado para atualização');
        }
    } catch (error) {
        console.error('Erro ao editar disco:', error);
        res.status(500).send('Erro ao editar disco');
    }
}

// Remover um disco
async function removerDisco(req, res) {
    try {
        await Disco.destroy({ where: { id: req.params.id } });
        res.redirect('/discos');
    } catch (error) {
        console.error('Erro ao remover disco:', error);
        res.status(500).send('Erro ao remover disco');
    }
}

module.exports = {
    listarDiscos,
    buscarDiscos,
    mostrarFormularioCriacao,
    criarDisco,
    mostrarFormularioEdicao,
    editarDisco,
    removerDisco
};
