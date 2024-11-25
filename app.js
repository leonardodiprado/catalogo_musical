const express = require('express');
const bodyParser = require('body-parser');
const { sequelize } = require('./models');
const discoRoutes = require('./routes/discoRoutes');
const artistaRoutes = require('./routes/artistaRoutes');
const generoRoutes = require('./routes/generoRoutes');

const app = express();

app.set('view engine', 'ejs');
app.use(express.static('public'));
app.use(bodyParser.urlencoded({ extended: true }));

app.use('/', discoRoutes);
app.use('/', artistaRoutes);
app.use('/', generoRoutes);

const PORT = process.env.PORT || 3000;

sequelize.sync().then(() => {
    app.listen(PORT, () => {
        console.log(`Server is running on http://localhost:${PORT}`);
    });
}).catch(err => {
    console.error('Erro ao sincronizar o Sequelize com o banco de dados:', err);
});
