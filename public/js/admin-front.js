// Fonction pour basculer la vue des articles (mode horizontal/vertical)
function toggleView() {
  const adminArticlesContainer = document.getElementById(
    "admin-articles-container"
  );
  adminArticlesContainer.classList.toggle("flex-nowrap");
}

// Récupération du conteneur du formulaire d'article
const articleFormContainer = document.getElementById("article-form-container");

// Fonction pour préparer le formulaire d'édition avec les données de l'article
function showEditForm(event) {
  // Récupérer le bouton cliqué le plus proche
  const button = event.target.closest("button");
  if (!button) return;

  // Extraire les données de l'article à partir des attributs du bouton
  const articleData = {
    id: button.dataset.id,
    title: button.dataset.title,
    type: button.dataset.type,
    description: button.dataset.description,
    image: button.dataset.image,
    content: button.dataset.content,
  };

  // Afficher le formulaire en mode édition avec les données de l'article
  showForm("edit", articleData);
}

// Fonction principale pour afficher le formulaire d'ajout ou d'édition d'article
function showForm(type, article = {}) {
  // Déterminer si c'est un mode édition ou ajout
  const isEdit = type === "edit";
  const formTitle = isEdit ? "Modifier un article" : "Ajouter un article";
  const actionURL = isEdit ? `/admin/update/${article.id}` : "/admin/add";

  // Bloquer le défilement de la page et afficher le conteneur de formulaire
  document.body.classList.add("overflow-hidden");
  articleFormContainer.classList.remove("d-none");

  // Générer dynamiquement le HTML du formulaire
  articleFormContainer.innerHTML = `
  <form
    class="col-lg-6 bg-dark-subtle col-11 mx-auto p-2 rounded-2"
    action="${actionURL}"
    method="POST"
    id="article-form"
  >
    <fieldset>
      <legend>${formTitle}</legend>
      <!-- Champ de titre de l'article -->
      <div>
        <label for="titre-de-article" class="form-label mt-4">
          Titre de l'article :
        </label>
        <input
          type="text"
          class="form-control"
          placeholder="Le titre de l'article"
          id="titre-de-article"
          name="title"
          value="${article.title || ""}"
          required
        />
      </div>

      <!-- Sélection du type de handicap -->
      <div>
        <label for="disability-type" class="form-label mt-4"
          >Type de handicap :
        </label>
        <select class="form-select" name="type" id="disability-type" required>
          <option value="">Sélectionner le type de handicap</option>
          <option value="Malvoyant (Visuel)">Malvoyant (Visuel)</option>
          <option value="Handicap moteur">Handicap moteur</option>
          <option value="Handicap auditif">Handicap auditif</option>
          <option value="Handicap mental">Handicap mental</option>
          <option value="Autisme">Autisme</option>
          <option value="Handicap neuropsychologique">
            Handicap neuropsychologique
          </option>
          <option value="Trisomie 21">Trisomie 21</option>
          <option value="Trouble de santé mentale">
            Trouble de santé mentale
          </option>
          <option value="Autre">Autre</option>
        </select>
      </div>

      <!-- Champ de description avec compteur de caractères -->
      <div class="position-relative">
        <label for="description-de-article" class="form-label mt-4">
          Description de l'article
          <span class="text-danger">(50 caractères max) </span> :
        </label>
        <input
          type="text"
          name="description"
          class="form-control"
          placeholder="Le titre de l'article"
          id="description-de-article"
          style="padding-right: 25%"
          maxlength="50"
          required
        />
        <span
          class="position-absolute user-select-none"
          style="bottom: 10px; right: 10px"
          id="char-count-value"
          >0 / 50</span
        >
      </div>

      <!-- Champ d'URL de l'image -->
      <div>
        <label for="article-image-url" class="form-label mt-4"
          >Image de l'article :
        </label>
        <input
          class="form-control"
          type="url"
          name="image"
          id="article-image-url"
          value="${article.image || ""}"
          required
        />
      </div>

      <!-- Zone de texte pour le contenu de l'article -->
      <div class="mb-3">
        <label for="contenu-de-article" class="form-label mt-4"
          >Contenu de l'article :
        </label>
        <textarea
          name="content"
          class="form-control"
          id="contenu-de-article"
          rows="8"
          required
          value="${article.content || ""}"
        ></textarea>
      </div>

      <!-- Boutons de soumission et d'annulation -->
      <button type="submit" class="btn btn-success" id="action-button">
        <span class="bi bi-file-earmark-plus" id="action-button-text">Ajouter</span>
      </button>
      <button
        type="button"
        id="cancel-button"
        class="btn btn-danger"
        onclick="hideForm(event)"
      >
        <i class="bi bi-x-square"></i>
        Annuler
      </button>
    </fieldset>
  </form>`;

  // Gestion du compteur de caractères pour la description
  const inputField = document.getElementById("description-de-article");
  const charCountValue = document.getElementById("char-count-value");

  // Écouteur d'événement pour mettre à jour le compteur de caractères
  inputField.addEventListener("input", () => {
    const charCount = inputField.value.length;
    charCountValue.textContent = `${charCount} / 50`;

    // Coloration en rouge si la limite de caractères est atteinte
    if (charCount === 50) {
      inputField.classList.add("text-danger");
      charCountValue.classList.add("text-danger");
    } else {
      inputField.classList.remove("text-danger");
      charCountValue.classList.remove("text-danger");
    }
  });

  // Pré-remplissage des champs en mode édition
  inputField.value = article.description || "";
  inputField.dispatchEvent(new Event("input"));

  document.getElementById("disability-type").value = article.type || "";
  document.getElementById("contenu-de-article").value = article.content || "";

  // Mise à jour du texte et de l'icône du bouton selon le mode (ajout/édition)
  const actionButtonText = document.getElementById("action-button-text");

  if (isEdit) {
    actionButtonText.className = "bi bi-pencil-square me-1";
    actionButtonText.textContent = " Modifier";
  } else {
    actionButtonText.className = "bi bi-file-earmark-plus";
    actionButtonText.textContent = " Ajouter";
  }
}

// Fonction pour masquer le formulaire
function hideForm(event) {
  // Vérifier si le clic est sur le conteneur ou le bouton d'annulation
  if (
    (event.button === 0 && event.target === articleFormContainer) ||
    event.target.closest("#cancel-button")
  ) {
    // Réinitialiser la position de défilement et masquer le formulaire
    articleFormContainer.scrollTop = 0;
    document.body.classList.remove("overflow-hidden");
    articleFormContainer.classList.add("d-none");
    articleFormContainer.innerHTML = "";
  }
}
