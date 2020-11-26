# recomvino-be

## Enviormental variables

```
NEO4J_URI=
NEO4J_USER=
NEO4J_PASS=
```

# Database view

```Cypher
MATCH p=()-[r:HAS_FLAVOR|:HAS_BRAND]->() RETURN p LIMIT 100
```

![database](./screenshots/db.png)

**red: flavor, blue: brand, orange: wines**

---

```Cypher
MATCH p=()-[r:LIKES]->() RETURN p LIMIT 20
```

![likes](./screenshots/likes.png)

**yellow: people, orange: wines**

---
