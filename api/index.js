const express = require('express');
const cors = require('cors');
require('dotenv').config();

const bookRoutes = require('./routes/bookRoutes');
const summonerRoutes = require('./routes/summonerRoutes');
const userRoutes = require('./routes/userRoutes');
const matchRoutes = require('./routes/matchRoutes');
const championRoutes = require('./routes/championRoutes');
const teamRoutes = require('./routes/teamRoutes');
const itemRoutes = require('./routes/itemRoutes');
const spellRoutes = require('./routes/spellRoutes');
const ChampionMasteryRoutes = require('./routes/championmasteryRoutes');
const statsRoutes = require('./routes/statsRoutes');
const matchparticipantRoutes = require('./routes/matchparticipantRoutes');


const app = express();

// ✅ CORS en premier
const corsOptions = {
  origin: 'http://localhost:3000',
  methods: 'GET,POST,PUT,DELETE',
  credentials: true,
};
app.use(cors(corsOptions));

// ✅ Puis les middlewares
app.use(express.json());

// ✅ Ensuite les routes
app.use('/books', bookRoutes);
app.use('/summoners', summonerRoutes);
// app.use('/runes', runeRoutes); // PAS ENCORE UTILISE
app.use('/matches', matchRoutes);
app.use('/champion', championRoutes);
app.use('/teams', teamRoutes);
app.use('/items', itemRoutes);
app.use('/spells', spellRoutes);
app.use('/championmastery', ChampionMasteryRoutes);
app.use('/stats', statsRoutes);
app.use('/matchparticipant', matchparticipantRoutes);
app.use('/users', userRoutes);

// ✅ Enfin, démarrage du serveur
const PORT = process.env.PORT || 3002;
app.listen(PORT, () => {
  console.log(`Serveur démarré sur le port ${PORT}`);
});