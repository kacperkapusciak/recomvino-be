const express = require('express');
const router = express.Router();

const db = require('../middleware/db');

router.post('/', async (req, res) => {
  const { personId, wineId } = req.body;
  if (!personId || !wineId) {
    return res.status(400).send();
  }

  const query = `MATCH (p:Person {id:$personId}), (w:Wine {id:$wineId}) CREATE (p)-[:LIKES]->(w) RETURN p, w`;
  const params = {
    personId,
    wineId,
  };
  const result = await db.executeQuery(query, params);
  res.send(result);
});

router.get('/:personId', async (req, res) => {
  const { personId } = req.params;
  const query = 'MATCH (p:Person {id: $personId})-[:LIKES]-(w) RETURN w LIMIT 100';
  const params = { personId };
  const result = await db.executeQuery(query, params);
  res.send(result);
});

router.delete('/', async (req, res) => {
  const { personId, wineId } = req.body;
  if (!personId || !wineId) {
    return res.status(400).send();
  }
  const query = 'MATCH (p:Person {id:$personId})-[l:LIKES]-(w:Wine {id:$wineId}) DELETE l';
  const params = {
    personId,
    wineId,
  };
  const result = await db.executeQuery(query, params);
  res.send(result);
});

module.exports = router;
