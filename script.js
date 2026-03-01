async function vote(image, btn) {
  const pseudoInput = document.getElementById('pseudo');
  const pseudo = pseudoInput.value.trim(); // peut être vide
  const card = btn.closest('.card');
  const messageEl = card.querySelector('.message-btn');

  try {
    const res = await fetch('/api/vote', {
      method: 'POST',
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify({ image, pseudo }) // pseudo vide autorisé
    });

    const data = await res.json();

    if (data.error) {
      messageEl.innerText = data.error;
      messageEl.classList.remove('success');
      return;
    }

    // ✅ Vote réussi → griser tous les boutons et le champ pseudo
    messageEl.innerText = "✅ Merci pour ton vote !";
    messageEl.classList.add('success');

    const buttons = document.querySelectorAll('.card button');
    buttons.forEach(b => {
      b.disabled = true;
      b.style.backgroundColor = '#aaa';
      b.style.cursor = 'not-allowed';
    });

    pseudoInput.disabled = true; // même si vide, on bloque l’édition
    pseudoInput.style.backgroundColor = '#eee';

  } catch (err) {
    console.error(err);
    messageEl.innerText = "Erreur serveur inattendue";
    messageEl.classList.remove('success');
  }
}

document.getElementById("show-results").addEventListener("click", async (e) => {
  const btn = e.target;

  // 🔒 Cache la zone de vote
  const voteZone = document.querySelector(".vote-zone");
  if (voteZone) voteZone.style.display = "none";

  // Optionnel : cacher le message d'info
  const info = document.querySelector("p");
  if (info) info.style.display = "none";

  // UX bouton
  btn.disabled = true;
  btn.textContent = "Résultats affichés";
  document.getElementById("back-btn").style.display = "block";
  // Affichage des résultats
  const container = document.getElementById("results-container");
  container.innerHTML = "";

  const res = await fetch("/api/results");
  const results = await res.json();

  results.forEach((r, index) => {
    const card = document.createElement("div");
    card.className = "result-card";

    card.innerHTML = `
      <div class="result-info">
        <strong>#${index + 1}</strong>
        <img src="images/${r.image}.jpg" alt="Image ${r.image}">
      </div>
      <div class="vote-count">${r.count} votes</div>
    `;

    container.appendChild(card);
  });

  container.style.display = "flex";
});

document.getElementById("back-btn").addEventListener("click", () => {
  window.location.reload();
});