const express = require('express');
const { Pool } = require('pg');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const app = express();
const port = process.env.PORT || 3000;

// Configuration de la base de données PostgreSQL
const pool = new Pool({
  connectionString: 'postgresql://postgres:mVlHGCWJDTpZvnmZrBYndALANQEHcKVO@junction.proxy.rlwy.net:58509/railway',
  ssl: {
    rejectUnauthorized: false,
  },
});

app.use(express.json()); // Pour lire les requêtes POST avec des données JSON

// Route de test pour s'assurer que le serveur fonctionne
app.get('/', (req, res) => {
  res.send('Backend Node.js fonctionne avec PostgreSQL sur Railway!');
});

// Route pour l'authentification des utilisateurs
app.post('/login', async (req, res) => {
  const { username, password } = req.body;
  try {
    const user = await pool.query('SELECT * FROM users WHERE username = $1', [username]);
    if (user.rows.length > 0) {
      const validPassword = await bcrypt.compare(password, user.rows[0].password);
      if (validPassword) {
        const token = jwt.sign({ id: user.rows[0].id, role: user.rows[0].role }, 'secret_key');
        res.json({ token });
      } else {
        res.status(401).json({ error: 'Mot de passe incorrect' });
      }
    } else {
      res.status(404).json({ error: 'Utilisateur non trouvé' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Erreur serveur' });
  }
});

// Route pour obtenir les produits d'un magasin spécifique
app.get('/api/products/:store_id', async (req, res) => {
  const { store_id } = req.params;
  try {
    const products = await pool.query('SELECT * FROM products WHERE store_id = $1', [store_id]);
    res.json(products.rows);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Erreur serveur' });
  }
});

// Route pour ajouter un produit
app.post('/api/products', async (req, res) => {
  const { store_id, ean, quantity, expiration_date } = req.body;
  try {
    const newProduct = await pool.query(
      'INSERT INTO products (store_id, ean, quantity, expiration_date) VALUES ($1, $2, $3, $4) RETURNING *',
      [store_id, ean, quantity, expiration_date]
    );
    res.json(newProduct.rows[0]);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Erreur serveur' });
  }
});

// Route pour obtenir les informations d'un magasin
app.get('/api/store/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const store = await pool.query('SELECT * FROM stores WHERE id = $1', [id]);
    if (store.rows.length > 0) {
      res.json(store.rows[0]);
    } else {
      res.status(404).json({ error: 'Magasin non trouvé' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Erreur serveur' });
  }
});

// Route pour ajouter un magasin
app.post('/api/store', async (req, res) => {
  const { name, region, user_id } = req.body;
  try {
    const newStore = await pool.query(
      'INSERT INTO stores (name, region, user_id) VALUES ($1, $2, $3) RETURNING *',
      [name, region, user_id]
    );
    res.json(newStore.rows[0]);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Erreur serveur' });
  }
});

// Démarrer le serveur
app.listen(port, () => {
  console.log(`Serveur en écoute sur le port ${port}`);
});
