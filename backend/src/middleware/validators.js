const { body, validationResult } = require('express-validator');

// Validação para registro de usuário
exports.validateRegistration = [
  body('name')
    .trim()
    .notEmpty().withMessage('Nome é obrigatório')
    .isLength({ min: 2 }).withMessage('Nome deve ter pelo menos 2 caracteres'),
  
  body('email')
    .trim()
    .notEmpty().withMessage('E-mail é obrigatório')
    .isEmail().withMessage('E-mail inválido')
    .normalizeEmail(),
  
  body('password')
    .trim()
    .notEmpty().withMessage('Senha é obrigatória')
    .isLength({ min: 6 }).withMessage('Senha deve ter pelo menos 6 caracteres'),
  
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        status: 'error',
        message: 'Erro de validação',
        errors: errors.array().map(error => ({
          field: error.param,
          message: error.msg
        }))
      });
    }
    next();
  }
];

// Validação para login de usuário
exports.validateLogin = [
  body('email')
    .trim()
    .notEmpty().withMessage('E-mail é obrigatório')
    .isEmail().withMessage('E-mail inválido')
    .normalizeEmail(),
  
  body('password')
    .trim()
    .notEmpty().withMessage('Senha é obrigatória'),
  
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        status: 'error',
        message: 'Erro de validação',
        errors: errors.array().map(error => ({
          field: error.param,
          message: error.msg
        }))
      });
    }
    next();
  }
];
