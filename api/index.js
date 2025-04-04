require('dotenv').config();
const express = require('express');
const cors = require('cors');
const path = require('path');
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
const itemparticipantRoutes = require('./routes/itemparticipantRoutes');
const runeparticipantRoutes = require('./routes/runeparticipantRoutes');
const summonerspellparticipantRoutes = require('./routes/summonerspellparticipantRoutes');
const runeRoutes = require('./routes/runeRoutes');

const app = express();

// ✅ CORS en premier
const corsOptions = {
  origin: 'http://localhost:3001',
  methods: 'GET,POST,PUT,DELETE',
  credentials: true,
};
app.use(cors(corsOptions));


// ✅ Puis les middlewares
app.use(express.json());
app.use(cors());
app.use('/img', express.static(path.join(__dirname, 'public/img')));

// ✅ Ensuite les routes
app.use('/books', bookRoutes);
app.use('/summoners', summonerRoutes);
app.use('/users', userRoutes);
app.use('/matches', matchRoutes);
app.use('/champion', championRoutes);
app.use('/teams', teamRoutes);
app.use('/items', itemRoutes);
app.use('/spells', spellRoutes);
app.use('/championmastery', ChampionMasteryRoutes);
app.use('/stats', statsRoutes);
app.use('/matchparticipant', matchparticipantRoutes);
app.use('/itemparticipant', itemparticipantRoutes);
app.use('/runeparticipant', runeparticipantRoutes);
app.use('/summonerspellparticipant', summonerspellparticipantRoutes);
app.use('/runes', runeRoutes);

const PORT = process.env.PORT ;
app.listen(PORT, () => {
  console.log(`Serveur démarré sur le port ${PORT}`);
});
