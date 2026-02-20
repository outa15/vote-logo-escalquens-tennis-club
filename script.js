async function vote(image) {
  const pseudo = document.getElementById('pseudo').value.trim();
  if (!pseudo) {
    document.getElementById("message").innerText = "⚠️ Merci d’entrer ton pseudo";
    return;
  }

  const res = await fetch('/api/vote', {
    method: 'POST',
    headers: {'Content-Type': 'application/json'},
    body: JSON.stringify({ image, pseudo })
  });

  const data = await res.json();
  document.getElementById("message").innerText = data.error || "✅ Merci pour ton vote !";
}