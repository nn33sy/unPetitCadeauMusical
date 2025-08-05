async function fetchRadiosByTag(tag) {
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

let radiosCache = [];
let container = null;

async function displayRandomRadio() {
  const today = new Date();
  const isBreizhDay = today.getDate() === 27 && today.getMonth() === 8; // septembre = 8

  let tag = 'pop';
  if (isBreizhDay) {
    const breizhTags = ['breton', 'breizh', 'celtic'];
    tag = breizhTags[Math.floor(Math.random() * breizhTags.length)];
  }

  if (radiosCache.length === 0) {
    radiosCache = await fetchRadiosByTag(tag);
  }

  container = document.getElementById('radio-container');

  if (radiosCache.length === 0) {
    container.innerHTML = `<p>Impossible de charger les radios pour le tag "${tag}".</p>`;
    return;
  }

  const randomIndex = Math.floor(Math.random() * radiosCache.length);
  const radio = radiosCache[randomIndex];

  container.innerHTML = `
    <h2>${radio.name}</h2>
    <img src="${radio.favicon || 'https://via.placeholder.com/150'}" alt="Logo radio" />
    <audio controls autoplay id="audio-player">
      <source src="${radio.url_resolved}" type="audio/mpeg" />
      Votre navigateur ne supporte pas l'élément audio.
    </audio>
    <p><strong>Pays :</strong> ${radio.country || 'N/A'}</p>
    ${isBreizhDay ? '<p>🎶 Spécial Bretagne aujourd\'hui !</p>' : ''}
  `;

  const audio = document.getElementById('audio-player');

  audio.addEventListener('error', () => {
    console.warn(`Erreur avec la radio "${radio.name}", on essaie une autre...`);
    radiosCache.splice(randomIndex, 1);
    if (radiosCache.length === 0) {
      container.innerHTML = `<p>Toutes les radios ont échoué.</p>`;
      return;
    }
    displayRandomRadio();
  });
}

displayRandomRadio();
