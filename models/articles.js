// Importation du module sqlite3 avec l'option "verbose" activée pour un meilleur débogage.
const sqlite3 = require("sqlite3").verbose();

// Création d'une instance de la base de données et spécification du fichier SQLite à utiliser.
const db = new sqlite3.Database("./db/articles.sqlite");

// Utilisation de la méthode serialize pour s'assurer que les opérations suivantes
// s'exécutent de manière séquentielle et non asynchrone.
db.serialize(() => {
  // Création de la table "articles" si elle n'existe pas déjà.
  // La table contiendra les colonnes suivantes :
  db.run(
    `CREATE TABLE IF NOT EXISTS articles (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        title TEXT NOT NULL,         -- "title" titre de l'article
        type TEXT NOT NULL,          -- "type" correspondant au type de handicap
        image TEXT NOT NULL,         -- "image" URL de la miniature
        description TEXT NOT NULL,   -- "description" description de l'article (max 50 caractères)
        content TEXT NOT NULL        -- "content" contenu détaillé de l'article
    )`,
    (err) => {
      if (err) {
        console.error(
          "Erreur lors de la création de la table 'articles'",
          err.message
        );
      } else {
        console.log("La table 'articles' est fait");
      }
    }
  );
});

// Exportation de l'instance de base de données pour permettre son utilisation
// dans d'autres fichiers de l'application.
module.exports = db;
