const passport = require('passport');
const { Strategy: JwtStrategy, ExtractJwt } = require('passport-jwt');
const User = require('../models/user.model');

/**
 * Configuração do Passport para autenticação JWT
 */
module.exports = (passport) => {
  const options = {
    jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
    secretOrKey: process.env.JWT_SECRET || 'linkgrow-secret-key'
  };

  passport.use(
    new JwtStrategy(options, async (payload, done) => {
      try {
        // Buscar o usuário pelo ID no payload do token
        const user = await User.findById(payload.id);

        if (user) {
          return done(null, user);
        }
        
        return done(null, false);
      } catch (error) {
        return done(error, false);
      }
    })
  );
};
