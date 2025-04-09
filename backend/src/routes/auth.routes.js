const express = require('express');
const router = express.Router();
const passport = require('passport');
const { register, login, getProfile } = require('../controllers/auth.controller');
const { validateRegistration, validateLogin } = require('../middleware/validators');

// Rota de registro
router.post('/register', validateRegistration, register);

// Rota de login
router.post('/login', validateLogin, login);

// Rota para obter perfil do usuário (protegida)
router.get('/profile', passport.authenticate('jwt', { session: false }), getProfile);

// Rota para iniciar autenticação com LinkedIn
router.get('/linkedin', passport.authenticate('linkedin', {
  scope: ['r_emailaddress', 'r_liteprofile', 'w_member_social']
}));

// Callback para autenticação com LinkedIn
router.get('/linkedin/callback',
  passport.authenticate('linkedin', { session: false, failureRedirect: '/login' }),
  (req, res) => {
    // Gerar token JWT e redirecionar para o frontend com o token
    const token = req.user.generateToken();
    res.redirect(`${process.env.FRONTEND_URL}/auth/callback?token=${token}`);
  }
);

module.exports = router;
