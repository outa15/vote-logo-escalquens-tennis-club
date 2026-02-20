async function vote(image) {
  const res = await fetch('/api/vote', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ image })
  });

  const data = await res.json();

  if (!res.ok) {
    document.getElementById("message").innerText = data.error;
    return;
  }

  document.getElementById("message").innerText = "✅ Merci pour ton vote !";
}