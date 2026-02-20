async function vote(image) {
  const pseudoInput = document.getElementById('pseudo');
  const pseudo = pseudoInput.value.trim();
  const messageEl = document.getElementById('message');

  if (!pseudo) {
    messageEl.innerText = "⚠️ Merci d’entrer ton pseudo";
    messageEl.classList.remove('success');
    return;
  }

  try {
    const res = await fetch('/api/vote', {
      method: 'POST',
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify({ image, pseudo })
    });

    const data = await res.json();

    if (data.error) {
      messageEl.innerText = data.error;
      messageEl.classList.remove('success');
      return;
    }

    // Vote réussi
    messageEl.innerText = "✅ Merci pour ton vote !";
    messageEl.classList.add('success');

    // griser les boutons et le champ pseudo
    const buttons = document.querySelectorAll('.card button');
    buttons.forEach(btn => {
      btn.disabled = true;
      btn.style.backgroundColor = '#aaa';
      btn.style.cursor = 'not-allowed';
    });

    pseudoInput.disabled = true;
    pseudoInput.style.backgroundColor = '#eee';

  } catch (err) {
    console.error(err);
    messageEl.innerText = "Erreur serveur inattendue";
    messageEl.classList.remove('success');
  }
}