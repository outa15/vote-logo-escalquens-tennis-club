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