const appendLocation = '.ins-api-users';

(() => {
  const API_URL = 'https://jsonplaceholder.typicode.com/users';
  const STORAGE_KEY = 'cachedUsers';
  const SESSION_KEY = 'usersReloaded';
  const CACHE_DURATION = 24 * 60 * 60 * 1000;

  const container = document.querySelector(appendLocation);

  const injectStyles = () => {
    const style = document.createElement('style');
    style.textContent = `
      .user-list {
        display: grid;
        gap: 1rem;
        grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
        padding: 1rem;
        font-family: sans-serif;
      }

      .user-card {
        background: #f9f9f9;
        border: 1px solid #ddd;
        border-radius: 10px;
        padding: 1rem;
        box-shadow: 0 2px 5px rgba(0,0,0,0.1);
        position: relative;
        transition: 0.3s ease;
      }

      .user-card:hover {
        transform: scale(1.05);
        cursor: pointer;
      }

      .user-card h3 {
        margin: 0 0 0.5rem;
        font-size: 1.2rem;
      }

      .user-card p {
        margin: 0.3rem 0;
        font-size: 0.95rem;
        color: #555;
      }

      .delete-btn {
        background: crimson;
        color: white;
        border: none;
        padding: 5px 10px;
        border-radius: 5px;
        cursor: pointer;
        position: absolute;
        top: 10px;
        right: 10px;
        transition: 0.3s ease;
      }

      .delete-btn:hover {
        background-color: #710627;
      }

      .reload-btn {
        margin: 1rem;
        padding: 10px 20px;
        font-size: 1rem;
        background-color: #007bff;
        color: white;
        border: none;
        border-radius: 5px;
        cursor: pointer;
      }

      .reload-btn:disabled {
        background-color: #aaa;
        cursor: not-allowed;
      }
    `;
    document.head.appendChild(style);
  };

  const fetchUsers = () =>
    fetch(API_URL).then(res => {
      if (!res.ok) throw new Error('API call failed');
      return res.json();
    });

  const createUserCard = user => {
    const card = document.createElement('div');
    card.className = 'user-card';
    card.dataset.id = user.id;

    card.innerHTML = `
      <h3>${user.name}</h3>
      <p><strong>Email:</strong> ${user.email}</p>
      <p><strong>Adress:</strong> ${user.address.street}, ${user.address.city}</p>
      <button class="delete-btn">Sil</button>
    `;

    card.querySelector('.delete-btn').addEventListener('click', () => deleteUser(user.id));
    return card;
  };

  const renderUsers = users => {
    container.innerHTML = '<div class="user-list"></div>';
    const list = container.querySelector('.user-list');
    users.forEach(user => list.appendChild(createUserCard(user)));
  };

  const deleteUser = id => {
    const users = JSON.parse(localStorage.getItem(STORAGE_KEY))?.data || [];
    const filtered = users.filter(user => user.id !== id);
    localStorage.setItem(STORAGE_KEY, JSON.stringify({ data: filtered, timestamp: Date.now() }));
    renderUsers(filtered);
  };

  const isCacheValid = () => {
    const cached = JSON.parse(localStorage.getItem(STORAGE_KEY));
    if (!cached) return false;
    return Date.now() - cached.timestamp < CACHE_DURATION;
  };

  const addReloadButton = () => {
    if (document.querySelector('.reload-btn')) return;
    if (sessionStorage.getItem(SESSION_KEY)) return;

    const btn = document.createElement('button');
    btn.textContent = 'Reload users';
    btn.className = 'reload-btn';
    btn.addEventListener('click', async () => {
      try {
        btn.disabled = true;
        const users = await fetchUsers();
        localStorage.setItem(STORAGE_KEY, JSON.stringify({ data: users, timestamp: Date.now() }));
        sessionStorage.setItem(SESSION_KEY, 'true');
        renderUsers(users);
      } catch (err) {
        alert('Loading failed: ' + err.message);
        btn.disabled = false;
      }
    });

    container.appendChild(btn);
  };

  const observeUserList = () => {
    const observer = new MutationObserver(() => {
      const userCards = container.querySelectorAll('.user-card');
      if (userCards.length === 0) {
        addReloadButton();
      }
    });

    observer.observe(container, { childList: true, subtree: true });
  };

  const init = async () => {
    injectStyles();
    observeUserList();

    try {
      let users = [];

      if (isCacheValid()) {
        users = JSON.parse(localStorage.getItem(STORAGE_KEY)).data;
      } else {
        users = await fetchUsers();
        localStorage.setItem(STORAGE_KEY, JSON.stringify({ data: users, timestamp: Date.now() }));
      }

      renderUsers(users);
    } catch (err) {
      container.innerHTML = `<div style="color:red; padding:1rem;">Error: ${err.message}</div>`;
    }
  };

  init();
})();
