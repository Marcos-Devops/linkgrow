const passport = require('passport');
const { Strategy: JwtStrategy, ExtractJwt } = require('passport-jwt');
const LinkedInStrategy = require('passport-linkedin-oauth2').Strategy;
const User = require('../models/user.model');

// Configuração da estratégia JWT
const jwtOptions = {
  jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
  secretOrKey: process.env.JWT_SECRET || 'seu_jwt_secret'
};

passport.use(new JwtStrategy(jwtOptions, async (payload, done) => {
  try {
    // Busca o usuário pelo ID do payload
    const user = await User.findById(payload.id);
    
    if (!user) {
      return done(null, false);
    }
    
    return done(null, user);
  } catch (error) {
    return done(error, false);
  }
}));

// Configuração da estratégia LinkedIn OAuth2
passport.use(new LinkedInStrategy({
  clientID: process.env.LINKEDIN_CLIENT_ID || 'seu_linkedin_client_id',
  clientSecret: process.env.LINKEDIN_CLIENT_SECRET || 'seu_linkedin_client_secret',
  callbackURL: process.env.LINKEDIN_CALLBACK_URL || 'http://localhost:5000/api/auth/linkedin/callback',
  scope: ['r_emailaddress', 'r_liteprofile', 'w_member_social'],
  state: true
}, async (accessToken, refreshToken, profile, done) => {
  try {
    // Verifica se já existe um usuário com este ID do LinkedIn
    let user = await User.findOne({ linkedinId: profile.id });
    
    if (user) {
      // Atualiza o token do LinkedIn
      user.linkedinToken = accessToken;
      user.linkedinRefreshToken = refreshToken;
      user.linkedinTokenExpiry = new Date(Date.now() + 60 * 60 * 1000); // 1 hora
      await user.save();
      return done(null, user);
    }
    
    // Verifica se existe um usuário com o mesmo e-mail
    const email = profile.emails[0].value;
    user = await User.findOne({ email });
    
    if (user) {
      // Vincula a conta do LinkedIn ao usuário existente
      user.linkedinId = profile.id;
      user.linkedinToken = accessToken;
      user.linkedinRefreshToken = refreshToken;
      user.linkedinTokenExpiry = new Date(Date.now() + 60 * 60 * 1000); // 1 hora
      await user.save();
      return done(null, user);
    }
    
    // Cria um novo usuário com os dados do LinkedIn
    const newUser = new User({
      name: `${profile.name.givenName} ${profile.name.familyName}`,
      email,
      password: Math.random().toString(36).slice(-8), // Senha aleatória
      linkedinId: profile.id,
      linkedinToken: accessToken,
      linkedinRefreshToken: refreshToken,
      linkedinTokenExpiry: new Date(Date.now() + 60 * 60 * 1000) // 1 hora
    });
    
    await newUser.save();
    return done(null, newUser);
  } catch (error) {
    return done(error, false);
  }
}));

module.exports = passport;
