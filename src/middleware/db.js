require('dotenv').config();

const neo4j = require('neo4j-driver');
const formatResponse = require('../utils/formatResponse');

const uri = process.env.NEO4J_URI;
const user = process.env.NEO4J_USER;
const password = process.env.NEO4J_PASS;

const driver = neo4j.driver(uri, neo4j.auth.basic(user, password));

const executeQuery = async (query, params = {}) => {
  const session = driver.session();
  try {
    const response = await session.run(query, params);
    return formatResponse(response);
  } catch (error) {
    console.error(error);
  } finally {
    await session.close();
  }
};

module.exports = { executeQuery };
