const jwt = require('jsonwebtoken');

const authenticateToken = (req, res, next) => {
  // Vérification que le token est bien présent et qu'il commence par "Bearer "
  const token = req.headers['authorization']?.split(' ')[1];  // On récupère la partie du token après "Bearer"

  if (!token) {
    return res.status(403).json({ message: 'Accès refusé, token manquant' });
  }

  jwt.verify(token, 'secretKey', (err, user) => {
    if (err) {
      return res.status(403).json({ message: 'Accès refusé, token invalide' });
    }
    req.user = user;  // Attacher l'utilisateur au `req` pour qu'il soit accessible dans les routes suivantes
    next();  // Passer à la route suivante
  });



  
};

module.exports = authenticateToken;
