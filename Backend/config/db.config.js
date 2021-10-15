module.exports = {
  HOST: 'ubereats.cgql3ic5bgoi.us-east-1.rds.amazonaws.com',
  USER: 'admin',
  PASSWORD: 'Spartan2021',
  DB: 'ubereats',
  dialect: 'mysql',
  pool: {
    max: 50,
    min: 0,
    acquire: 30000,
    idle: 10000,
  },
};
