const express = require('express');
const router = express.Router();

const db = require('../middleware/db');

router.get('/:personId', async (req, res) => {
  const { personId } = req.params;
  const query = `
    MATCH (p:Person {id: $personId})-[l:LIKES]->(w:Wine),
    (w)-[:HAS_BRAND|:HAS_FLAVOR]->()<-[:HAS_BRAND|:HAS_FLAVOR]-(rec:Wine)
    WHERE NOT EXISTS( (p)-[:LIKES]->(rec) )
    WITH rec, COUNT(*) AS scores
    RETURN rec.name AS recommendation, rec.id AS id,
    COLLECT(scores) AS scoreComponents
    ORDER BY scoreComponents DESC LIMIT 10
  `;
  const params = { personId };
  const result = await db.executeQuery(query, params, 'table');
  res.send(result);
});

module.exports = router;
