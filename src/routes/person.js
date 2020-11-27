const express = require('express');
const { nanoid } = require('nanoid');
const router = express.Router();

const db = require('../middleware/db');

router.post('/', async (req, res) => {
  const { name } = req.body;
  if (!name) {
    return res.status(400).send();
  }

  const query = `CREATE (p:Person {id:$id, name: $name}) RETURN p`;
  const params = {
    id: nanoid(),
    name,
  };
  const result = await db.executeQuery(query, params);
  res.send(result);
});

router.get('/', async (req, res) => {
  const query = 'MATCH (p:Person) RETURN p LIMIT 100';
  const result = await db.executeQuery(query);
  res.send(result);
});

router.get('/:id', async (req, res) => {
  const { id } = req.params;
  const query = 'MATCH (p:Person {id: $id}) RETURN p LIMIT 100';
  const params = { id };
  const result = await db.executeQuery(query, params);
  res.send(result[0]);
});

router.delete('/:id', async (req, res) => {
  const { id } = req.params;
  const query = 'MATCH (p:Person {id: $id}) DELETE p';
  const params = { id };
  const result = await db.executeQuery(query, params);
  res.send(result);
});

module.exports = router;
