(() => {
  const container = document.querySelector('.ins-api-users');
  const API_URL = 'https://jsonplaceholder.typicode.com/users';
  const STORAGE_KEY = 'cachedUsers';
  const EXPIRY_KEY = 'cachedUsersExpiry';

  function injectStyles() {
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
      .user-card:hover{
        transform: scale(1.1);
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
      .delete-btn:hover{
        background-color: #710627;
      }

      .error-msg {
        padding: 1rem;
        color: red;
        font-weight: bold;
      }
    `;
    document.head.appendChild(style);
  }

  function fetchUsers() {
    return fetch(API_URL)
      .then(res => {
        if (!res.ok) throw new Error('API call failed.');
        return res.json();
      });
  }

  function createUserCard(user) {
    const card = document.createElement('div');
    card.className = 'user-card';
    card.dataset.id = user.id;

    card.innerHTML = `
      <h3>${user.name}</h3>
      <p><strong>Email:</strong> ${user.email}</p>
      <p><strong>Adress:</strong> ${user.address.street}, ${user.address.city}</p>
      <button class="delete-btn">Delete</button>
    `;

    card.querySelector('.delete-btn').addEventListener('click', () => {
      deleteUser(user.id);
    });

    return card;
  }

  function renderUsers(users) {
    container.innerHTML = '<div class="user-list"></div>';
    const list = container.querySelector('.user-list');

    users.forEach(user => {
      list.appendChild(createUserCard(user));
    });
  }

  function deleteUser(id) {
    const users = JSON.parse(localStorage.getItem(STORAGE_KEY)) || [];
    const filtered = users.filter(user => user.id !== id);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(filtered));
    renderUsers(filtered);
  }

  function isCacheValid() {
    const expiry = localStorage.getItem(EXPIRY_KEY);
    if (!expiry) return false;
    return new Date().getTime() < Number(expiry);
  }

  async function init() {
    injectStyles();

    try {
      let users;

      if (localStorage.getItem(STORAGE_KEY) && isCacheValid()) {
        users = JSON.parse(localStorage.getItem(STORAGE_KEY));
      } else {
        users = await fetchUsers();
        localStorage.setItem(STORAGE_KEY, JSON.stringify(users));
        localStorage.setItem(EXPIRY_KEY, (new Date().getTime() + 24 * 60 * 60 * 1000).toString());
      }

      renderUsers(users);
    } catch (err) {
      container.innerHTML = `<div class="error-msg">Error: ${err.message}</div>`;
    }
  }

  init();
})();
