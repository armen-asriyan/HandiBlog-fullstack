# HandiBlog

HandiBlog est un projet de blog dédié à la publication d'articles et de ressources sur les différents types de handicaps. Il propose une interface simple pour les utilisateurs et une gestion complète via un tableau de bord administratif.

# Fonctionnalités

- Affichage des articles sur la page d'accueil.
- Tableau de bord administrateur pour gérer les articles (ajouter, modifier, supprimer).
- Stockage des données dans une base SQLite.
- Design accessible et adapté pour les personnes en situation de handicap.

## Technologies utilisées

- **Backend** : Node.js, Express.js
- **Frontend** : EJS, CSS
- **Base de données** : SQLite
- **Autres** : JavaScript, HTML
- **Outils de développement** : Nodemon

## Structure du projet

HandiBlog-fullstack/
┣ db/
┃ ┗ articles.sqlite
┣ models/
┃ ┗ articles.js
┣ public/
┃ ┣ css/
┃ ┃ ┗ styles.css
┃ ┣ images/
┃ ┃ ┗ 600x400.svg
┃ ┗ js/
┃ ┗ admin-front.js
┣ routes/
┃ ┣ admin.js
┃ ┗ index.js
┣ views/
┃ ┣ admin.ejs
┃ ┣ article.ejs
┃ ┣ form.ejs
┃ ┗ index.ejs
┣ app.js
┣ package-lock.json
┣ package.json
┗ README.md

## Installation et configuration

1.  **Cloner le dépôt** :

        `git clone https://github.com/armen-asriyan/HandiBlog-fullstack.git`

2.  **Installer les dépendances** :

        `npm install`

3.  **Lancer l'application** :

         `npm start`

4.  **Accéder à l'application** :

        Ouvrez votre navigateur et rendez-vous sur `http://localhost:3000`.

## Utilisation

- **Page d'accueil** : Affiche tous les articles publiés.
- **Tableau de bord admin** : Accessible à `/admin` pour gérer les articles :

  - Ajouter un nouvel article.
  - Modifier un article existant.
  - Supprimer un article.

## Code Clé : Gestion des Articles (CRUD)

Ces routes permettent la gestion complète des articles via des requêtes HTTP. Elles illustrent comment l'application gère la création, la mise à jour et la suppression d'articles dans la base de données.

```javascript
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
```

# Crédits

- [Documentation Node.js](https://nodejs.org/docs/latest/api/)
- [Documentation Express.js](https://expressjs.com/en/guide/routing.html)
- [Documentation SQLite](https://www.sqlite.org/docs.html)
