const express = require('express');
const { nanoid } = require('nanoid');
const router = express.Router();

const db = require('../middleware/db');

router.post('/', async (req, res) => {
  const { name, brand, flavor, price } = req.body;
  if (!name || !brand || !flavor || !price) {
    return res.status(400).send();
  }

  const query = `CREATE (w:Wine {id:$id, name: $name, brand: $brand, flavor: $flavor, price: $price}) RETURN w`;
  const params = {
    id: nanoid(),
    name,
    brand,
    flavor,
    price,
  };
  const result = await db.executeQuery(query, params);
  res.send(result);
});

router.get('/', async (req, res) => {
  const query = 'MATCH (w:Wine) RETURN w LIMIT 100';
  const result = await db.executeQuery(query);
  res.send(result);
});

router.get('/:id', async function(req, res) {
  const { id } = req.params;
  const query = 'MATCH (w:Wine {id: $id}) RETURN w LIMIT 100';
  const params = { id };
  const result = await db.executeQuery(query, params);
  res.send(result);
});

router.delete('/:id', async (req, res) => {
  const { id } = req.params;
  const query = 'MATCH (w:Wine {id: $id}) DELETE w';
  const params = { id };
  const result = await db.executeQuery(query, params);
  res.send(result);
});

module.exports = router;
