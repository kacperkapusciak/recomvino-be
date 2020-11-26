const express = require('express');
const { nanoid } = require('nanoid');
const router = express.Router();

const db = require('../middleware/db');

router.post('/', async (req, res) => {
  const { name, brand, flavor, price } = req.body;
  if (!name || !brand || !flavor || !price) {
    return res.status(400).send();
  }

  const wineId = nanoid();

  const newWine = {
    query: `CREATE (w:Wine {id:$id, name: $name, price: $price}) RETURN w`,
    params: { id: wineId, name, price },
  };
  const newBrand = {
    query: `MERGE (b:Brand {name: $brand})`,
    params: { brand },
  };
  const newFlavor = {
    query: `MERGE (f:Flavor {name: $flavor})`,
    params: { flavor },
  };
  const wineHasBrand = {
    query: `
      MATCH (w:Wine {id: $wineId}), (b:Brand {name: $brand})
      CREATE (w)-[:HAS_BRAND]->(b)
    `,
    params: { brand, wineId },
  };
  const wineHasFlavor = {
    query: `
      MATCH (w:Wine {id: $wineId}), (f:Flavor {name: $flavor})
      CREATE (w)-[:HAS_FLAVOR]->(f)
      RETURN f
    `,
    params: { flavor, wineId },
  };

  const result = await db.executeQuery(newWine.query, newWine.params);
  await db.executeQuery(newBrand.query, newBrand.params);
  await db.executeQuery(newFlavor.query, newFlavor.params);
  await db.executeQuery(wineHasBrand.query, wineHasBrand.params);
  await db.executeQuery(wineHasFlavor.query, wineHasFlavor.params);

  res.send(result);
});

router.get('/', async (req, res) => {
  const query = `
    MATCH (f:Flavor)<-[:HAS_FLAVOR]-(w: Wine)-[:HAS_BRAND]->(b:Brand)
    RETURN w.id as id, w.name as name, w.price as price, f.name as flavor, b.name as brand
  `;
  const result = await db.executeQuery(query, {}, 'array');
  res.send(result);
});

router.get('/:id', async (req, res) => {
  const { id } = req.params;
  const query = `
    MATCH (f:Flavor)<-[:HAS_FLAVOR]-(w: Wine {id: $id})-[:HAS_BRAND]->(b:Brand)
    RETURN w.id as id, w.name as name, w.price as price, f.name as flavor, b.name as brand
  `;
  const params = { id };
  const result = await db.executeQuery(query, params, 'array');
  res.send(result);
});

// router.delete('/:id', async (req, res) => {
//   const { id } = req.params;
//   const query = 'MATCH (w:Wine {id: $id}) DELETE w';
//   const params = { id };
//   const result = await db.executeQuery(query, params);
//   res.send(result);
// });

module.exports = router;
