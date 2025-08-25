// Sélectionne les éléments principaux du DOM
const inputTarefa = document.getElementById("inputTarefa");
const btnAdicionar = document.getElementById("btnAdicionar");
const listaTarefas = document.getElementById("listaTarefas");
const btnLimparTudo = document.getElementById("btnLimparTudo");

// Bouton pour ajouter des tâches
btnAdicionar.addEventListener("click", function () {
  const textoTarefa = inputTarefa.value.trim();

  if (textoTarefa === "") return;

  // Vérifie si la tâche existe déjà
  const jaExiste = Array.from(listaTarefas.children).some(
    (li) =>
      li.querySelector(".texto-tarefa").textContent.toLowerCase() ===
      textoTarefa.toLowerCase()
  );

  if (jaExiste) {
    alert("Cette tâche existe déjà!");
    return;
  }

  criarTarefa(textoTarefa);
  inputTarefa.value = ""; // Réinitialise le champ de saisie
});

// Fonction pour créer/éditer/supprimer de nouvelles tâches
function criarTarefa(texto) {
  const novaTarefa = document.createElement("li");
  listaTarefas.appendChild(novaTarefa);

  // Span pour le texte de la tâche
  const spanTexto = document.createElement("span");
  spanTexto.textContent = texto;
  spanTexto.classList.add("texto-tarefa");
  novaTarefa.appendChild(spanTexto);

  // Bouton Supprimer
  const btnExcluir = document.createElement("button");
  btnExcluir.textContent = "❌ Supprimer";
  novaTarefa.appendChild(btnExcluir);

  btnExcluir.addEventListener("click", function () {
    if (confirm("Êtes-vous sûr de vouloir supprimer cette tâche ?")) {
      listaTarefas.removeChild(novaTarefa);
      salvarTarefas(); // Met à jour le localStorage
    }
  });

  // Bouton Éditer
  const btnEditar = document.createElement("button");
  btnEditar.textContent = "✏️ Éditer";
  novaTarefa.appendChild(btnEditar);

  // Fonction pour démarrer l'édition d'une tâche
  function iniciarEdicao() {
    // Évite d'ouvrir une autre édition si déjà en cours
    if (novaTarefa.querySelector(".input-edicao")) return;

    btnExcluir.style.display = "none";
    btnEditar.style.display = "none";

    // Crée le champ d'édition
    const inputEditar = document.createElement("input");
    inputEditar.type = "text";
    inputEditar.value = spanTexto.textContent;
    inputEditar.classList.add("input-edicao");

    novaTarefa.replaceChild(inputEditar, spanTexto);
    inputEditar.focus(); // Focus automatique sur le champ

    // Bouton Sauvegarder pour l'édition
    const btnSalvar = document.createElement("button");
    btnSalvar.textContent = "💾 Sauvegarder";
    novaTarefa.appendChild(btnSalvar);

    // Événements pour sauvegarder l'édition
    btnSalvar.addEventListener("click", salvarEdicao);
    inputEditar.addEventListener("keydown", function (e) {
      if (e.key === "Enter") salvarEdicao(); // Sauvegarder avec Entrée
    });
    inputEditar.addEventListener("blur", salvarEdicao); // Sauvegarder si perte de focus

    function salvarEdicao() {
      const novoTexto = inputEditar.value.trim();

      // Validation: la tâche ne peut pas être vide
      if (novoTexto === "") {
        alert("La tâche ne peut pas être vide!");
        return;
      }

      // Vérifie si la tâche existe déjà (hors l'actuelle en édition)
      const jaExiste = Array.from(listaTarefas.children).some(
        (li) =>
          li !== novaTarefa &&
          li.querySelector(".texto-tarefa").textContent.toLowerCase() ===
            novoTexto.toLowerCase()
      );

      if (jaExiste) {
        alert("Cette tâche existe déjà!");
        return;
      }

      // Met à jour le texte et restaure l'affichage normal
      spanTexto.textContent = inputEditar.value.trim();
      novaTarefa.insertBefore(spanTexto, btnExcluir);
      btnSalvar.remove();
      inputEditar.remove();

      btnExcluir.style.display = "";
      btnEditar.style.display = "";

      salvarTarefas(); // Sauvegarde dans le localStorage
    }
  }

  // Événements pour démarrer l'édition
  btnEditar.addEventListener("click", iniciarEdicao);
  spanTexto.addEventListener("dblclick", iniciarEdicao); // Double-clic sur le texte

  salvarTarefas(); // Sauvegarde la nouvelle tâche
}

// Sélectionner et marquer les tâches comme complétées
listaTarefas.addEventListener("click", function (e) {
  if (e.target.tagName === "SPAN") {
    e.target.parentElement.classList.toggle("feito"); // Ajoute/retire la classe "fait"
    salvarTarefas(); // Sauvegarde l'état
  }
});

// Bouton pour supprimer TOUTES les tâches
btnLimparTudo.addEventListener("click", function () {
  if (confirm("Êtes-vous sûr de vouloir supprimer toutes les tâches?")) {
    listaTarefas.innerHTML = "";
    localStorage.removeItem("tarefas"); // Vide le localStorage
  }
});

// Fonction pour sauvegarder les tâches dans le localStorage
function salvarTarefas() {
  const tarefas = Array.from(listaTarefas.children).map((li) => ({
    texte: li.querySelector(".texto-tarefa").textContent,
    feito: li.classList.contains("feito"), // État de complétion
  }));
  localStorage.setItem("tarefas", JSON.stringify(tarefas));
}

// Fonction pour charger les tâches depuis le localStorage
function carregarTarefas() {
  const data = localStorage.getItem("tarefas");
  if (!data) return; // Si aucune donnée, ne rien faire

  const tarefas = JSON.parse(data);
  tarefas.forEach((tarefa) => {
    criarTarefa(tarefa.texte);

    // Applique l'état "fait" si nécessaire
    const ultima = listaTarefas.lastElementChild;
    if (tarefa.feito) {
      ultima.classList.add("feito");
    }
  });
}

// Charge les tâches au démarrage de l'application
carregarTarefas();
