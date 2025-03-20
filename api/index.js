const express = require('express');
const bookRoutes = require('./routes/bookRoutes');
const summonerRoutes = require('./routes/summonerRoutes');
const matchRoutes = require('./routes/matchRoutes');
const championRoutes = require('./routes/championRoutes');
const teamRoutes = require('./routes/teamRoutes');
require('dotenv').config();

const app= express();
app.use(express.json());

app.use('/books', bookRoutes);
app.use('/summoners', summonerRoutes);
app.use('/matches', matchRoutes);
app.use('/champion', championRoutes);
app.use('/teams', teamRoutes);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Serveur démarré sur le port ${PORT}`);
});
