async function vote(image) {
  const pseudoInput = document.getElementById('pseudo');
  const pseudo = pseudoInput.value.trim();
  if (!pseudo) {
    document.getElementById("message").innerText = "⚠️ Merci d’entrer ton pseudo";
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
      document.getElementById("message").innerText = data.error;
      return;
    }

    // ✅ Vote réussi → griser tous les boutons et le champ pseudo
    const buttons = document.querySelectorAll('.card button');
    buttons.forEach(btn => {
      btn.disabled = true;
      btn.style.backgroundColor = '#aaa'; // gris
      btn.style.cursor = 'not-allowed';
    });

    pseudoInput.disabled = true; // griser le champ pseudo
    pseudoInput.style.backgroundColor = '#eee';
    document.getElementById("message").innerText = "✅ Merci pour ton vote !";

  } catch (err) {
    console.error(err);
    document.getElementById("message").innerText = "Erreur serveur inattendue";
  }
}