const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const User = require('../models/user.model');

/**
 * Registra um novo usuário
 * @param {Object} req - Requisição Express
 * @param {Object} res - Resposta Express
 */
exports.register = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    // Verifica se o usuário já existe
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({
        status: 'error',
        message: 'Este e-mail já está em uso'
      });
    }

    // Cria o novo usuário
    const user = new User({
      name,
      email,
      password
    });

    // Salva o usuário no banco de dados
    await user.save();

    // Gera o token JWT
    const token = jwt.sign(
      { id: user._id, email: user.email },
      process.env.JWT_SECRET || 'seu_jwt_secret',
      { expiresIn: '24h' }
    );

    res.status(201).json({
      status: 'success',
      message: 'Usuário registrado com sucesso',
      data: {
        user: {
          id: user._id,
          name: user.name,
          email: user.email
        },
        token
      }
    });
  } catch (error) {
    console.error('Erro ao registrar usuário:', error);
    res.status(500).json({
      status: 'error',
      message: 'Erro ao registrar usuário'
    });
  }
};

/**
 * Autentica um usuário existente
 * @param {Object} req - Requisição Express
 * @param {Object} res - Resposta Express
 */
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Busca o usuário pelo e-mail
    const user = await User.findOne({ email }).select('+password');
    if (!user) {
      return res.status(401).json({
        status: 'error',
        message: 'E-mail ou senha inválidos'
      });
    }

    // Verifica a senha
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({
        status: 'error',
        message: 'E-mail ou senha inválidos'
      });
    }

    // Gera o token JWT
    const token = jwt.sign(
      { id: user._id, email: user.email },
      process.env.JWT_SECRET || 'seu_jwt_secret',
      { expiresIn: '24h' }
    );

    res.status(200).json({
      status: 'success',
      message: 'Login realizado com sucesso',
      data: {
        user: {
          id: user._id,
          name: user.name,
          email: user.email
        },
        token
      }
    });
  } catch (error) {
    console.error('Erro ao fazer login:', error);
    res.status(500).json({
      status: 'error',
      message: 'Erro ao fazer login'
    });
  }
};

/**
 * Obtém o perfil do usuário autenticado
 * @param {Object} req - Requisição Express
 * @param {Object} res - Resposta Express
 */
exports.getProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    
    if (!user) {
      return res.status(404).json({
        status: 'error',
        message: 'Usuário não encontrado'
      });
    }

    res.status(200).json({
      status: 'success',
      data: {
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          linkedinConnected: !!user.linkedinToken,
          createdAt: user.createdAt
        }
      }
    });
  } catch (error) {
    console.error('Erro ao obter perfil:', error);
    res.status(500).json({
      status: 'error',
      message: 'Erro ao obter perfil'
    });
  }
};
