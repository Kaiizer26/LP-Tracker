const express = require('express');
const bookRoutes = require('./routes/bookRoutes');
const userRoutes = require('./routes/userRoutes');
const matchRoutes = require('./routes/matchRoutes');
require('dotenv').config();

const app= express();
app.use(express.json());

app.use('/books', bookRoutes);
app.use('/summoners', userRoutes);
app.use('/matches', matchRoutes);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Serveur démarré sur le port ${PORT}`);
});