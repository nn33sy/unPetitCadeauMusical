async function fetchMusicalRadios() {
  // Ici on filtre par un tag musical général, par exemple "pop"
  // Tu peux changer "pop" par un autre style : rock, jazz, electronic, classical...
  const tag = 'pop';
  const url = `https://de1.api.radio-browser.info/json/stations/bytag/${encodeURIComponent(tag)}`;

  try {
    const response = await fetch(url);
    if (!response.ok) throw new Error('Erreur HTTP ' + response.status);
    const radios = await response.json();
    return radios;
  } catch (error) {
    console.error('Erreur lors du chargement des radios:', error);
    return [];
  }
}

async function displayRandomMusicalRadio() {
  const radios = await fetchMusicalRadios();
  const container = document.getElementById('radio-container');

  if (radios.length === 0) {
    container.innerHTML = "<p>Impossible de charger les radios musicales.</p>";
    return;
  }

  const randomIndex = Math.floor(Math.random() * radios.length);
  const radio = radios[randomIndex];

  container.innerHTML = `
    <h2>${radio.name}</h2>
    <img src="${radio.favicon || 'https://via.placeholder.com/150'}" alt="Logo radio" />
    <audio controls autoplay>
      <source src="${radio.url_resolved}" type="audio/mpeg" />
      Votre navigateur ne supporte pas l'élément audio.
    </audio>
    <p><strong>Pays :</strong> ${radio.country || 'N/A'}</p>
  `;
}

displayRandomMusicalRadio();
