require('dotenv').config();

module.exports = {
  jwtSecret:     process.env.JWT_SECRET     || 'dev-secret-change-in-production',
  adminPassword: process.env.ADMIN_PASSWORD || 'skylitho2024',
  port:          process.env.PORT           || 3000,
  nodeEnv:       process.env.NODE_ENV       || 'development',
  dataDir:       process.env.DATA_DIR        || null,
};
