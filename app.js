// Importation des modules nécessaires à l'application web
const express = require("express"); // Framework web Node.js pour la création rapide de serveurs et de routes
const bodyParser = require("body-parser"); // Middleware pour parser les données des requêtes HTTP (formulaires et JSON)
const db = require("./models/articles"); // Module personnalisé de gestion de la base de données SQLite

// Configuration de l'application Express
const app = express(); // Création de l'instance principale du serveur web
const PORT = 3000; // Port d'écoute du serveur pour les connexions entrantes

// ==============================
// CONFIGURATION DU SERVEUR
// ==============================

// Configuration du moteur de rendu des templates
app.set("view engine", "ejs");
/* EJS (Embedded JavaScript) permet de générer dynamiquement du HTML
 * avec insertion de données variables directement dans les templates.
 * Cela facilite la création de pages web dynamiques côté serveur. */

// Middleware de parsing des données de requête
app.use(bodyParser.urlencoded({ extended: true }));
/* Permet de convertir les données de formulaires HTML en objets JavaScript
 * Rend accessible les données postées via req.body
 * L'option extended:true permet de gérer des données plus complexes */

app.use(bodyParser.json());
/* Ajoute la capacité de traiter les données JSON
 * Utile pour les API et les requêtes front-end modernes */

app.use(express.static("public"));
/* Définition du dossier de ressources statiques
 * Tous les fichiers (CSS, JS, images) dans ce dossier seront
 * directement accessibles via l'URL du serveur */

// ==============================
//  CONFIGURATION DES ARTICLES PAR DÉFAUT
// ==============================

const defaultArticles = [
  // ... (contenu initial inchangé)
];

const insertDefaultArticles = () => {
  /* Fonction dédiée à l'insertion initiale des articles
   * Parcourt la liste des articles prédéfinis et les insère en base
   * Gère les erreurs potentielles lors de l'insertion */
  defaultArticles.forEach((article) => {
    const { title, type, image, description, content } = article;
    const sql =
      "INSERT INTO articles (title, type, image, description, content) VALUES (?, ?, ?, ?, ?)";

    db.run(sql, [title, type, image, description, content], function (err) {
      if (err) {
        console.error(
          "Erreur lors de l'insertion des articles par défaut: ",
          err.message
        );
      } else {
        console.log("Article ajouté avec succès : " + title);
      }
    });
  });
};

const checkAndInsertDefaultArticles = () => {
  /* Vérifie si la table articles est vide avant d'insérer des données
   * Permet d'éviter les doublons lors des redémarrages du serveur
   * Assure que la base de données contient toujours un jeu d'articles initial */
  db.get("SELECT COUNT (*) AS count FROM articles", [], (err, row) => {
    if (err) {
      console.error("Erreur lors de la vérification de la table", err.message);
      return;
    }
    if (row.count === 0) {
      insertDefaultArticles();
    }
  });
};

// ==============================
//             ROUTES
// ==============================

app.get("/", (req, res) => {
  /* Route principale gérant l'affichage paginé des articles
   * Implémente un système de pagination pour limiter le nombre d'articles par page
   * Calcule dynamiquement le nombre total de pages */
  const page = parseInt(req.query.page, 10) || 1;
  const limit = 3;
  const offset = (page - 1) * limit;

  db.all(
    "SELECT * FROM articles LIMIT ? OFFSET ?",
    [limit, offset],
    (err, row) => {
      if (err) {
        console.error("Erreur lors de la récupération des articles : ", err);
        return res.status(500).send("Erreur serveur !");
      } else {
        db.get("SELECT COUNT(*) AS total FROM articles", (err, countRes) => {
          if (err) {
            console.error("Erreur lors de la vérification de la table : ", err);
            return res.status(500).send("Erreur serveur !");
          } else {
            const totalArticles = countRes.total;
            const totalPages = Math.ceil(totalArticles / limit);

            res.render("index", {
              articles: row,
              currentPage: page,
              totalPages: totalPages,
            });
          }
        });
      }
    }
  );
});

app.get("/article/:id", (req, res) => {
  /* Route pour afficher un article spécifique par son identifiant
   * Gère les cas d'erreur : article non trouvé ou erreur serveur
   * Transmet les données de l'article au template de vue */
  const id = req.params.id;

  db.get("SELECT * FROM articles WHERE id = ?", [id], (err, row) => {
    if (err) {
      console.error("Erreur lors de la récupération de l'article :", err);
      res.status(500).send("Une erreur est survenue.");
    } else if (!row) {
      res.status(404).send("Article non trouvé.");
    } else {
      res.render("article", { articles: row });
    }
  });
});

app.get("/admin", (req, res) => {
  /* Route d'administration listant tous les articles
   * Permet la visualisation complète du contenu de la base de données
   * Transmet la liste des articles au template d'administration */
  db.all("SELECT * FROM articles", (err, rows) => {
    if (err) {
      console.error("Erreur lors de la récupération des articles : ", err);
      return res.status(500).send("Erreur serveur !");
    } else {
      res.render("admin", { articles: rows });
    }
  });
});

app.post("/admin/add", (req, res) => {
  /* Route de création d'un nouvel article
   * Reçoit les données du formulaire via req.body
   * Insère un nouvel article en base de données */
  const { title, type, description, image, content } = req.body;

  db.run(
    `INSERT INTO articles (title, type, description, image, content) VALUES (?, ?, ?, ?, ?)`,
    [title, type, description, image, content],
    function (err) {
      if (err) {
        console.error("Erreur lors de l'ajout de l'article : ", err);
        return res.status(500).send("Erreur serveur !");
      } else {
        res.redirect("/admin");
      }
    }
  );
});

app.post("/admin/update/:id", (req, res) => {
  /* Route de mise à jour d'un article existant
   * Utilise l'ID de l'article pour identifier l'enregistrement à modifier
   * Met à jour tous les champs de l'article */
  const id = req.params.id;
  const { title, type, description, image, content } = req.body;

  db.run(
    "UPDATE articles SET title = ?, type = ?, description = ?, image = ?, content = ? WHERE id = ?",
    [title, type, description, image, content, id],
    function (err) {
      if (err) {
        console.error("Erreur lors de la modification de l'article :", err);
        return res.status(500).send("Erreur serveur !");
      } else {
        res.redirect("/admin");
      }
    }
  );
});

app.post("/admin/delete/:id", (req, res) => {
  /* Route de suppression d'un article
   * Supprime l'article correspondant à l'ID fourni
   * Gère les erreurs potentielles lors de la suppression */
  const id = req.params.id;

  db.run("DELETE FROM articles WHERE id = ?", [id], function (err) {
    if (err) {
      console.error("Erreur lors de la suppression de l'article :", err);
      return res.status(500).send("Erreur serveur !");
    }
    res.redirect("/admin");
  });
});

// ==============================
//        DÉMARRAGE DU SERVEUR
// ==============================

// Lancement du serveur sur le port configuré
app.listen(PORT, () => {
  /* Démarre le serveur et affiche l'URL d'accès
   * Appelle la vérification et l'insertion des articles par défaut
   * Prépare l'application à recevoir des requêtes */
  console.log(`Le serveur est opérationnel : http://127.0.0.1:${PORT}`);
  checkAndInsertDefaultArticles();
});
