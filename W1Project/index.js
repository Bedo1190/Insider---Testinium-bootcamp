function toggleMenu() {
  const navLinks = document.getElementById('nav-links');
  navLinks.classList.toggle('show');
}

document.getElementById("toggle-button").addEventListener("click", () => {
  const wrapper = document.getElementById("character-list-wrapper");
  const button = document.getElementById("toggle-button");

  wrapper.classList.toggle("expanded");

  if (wrapper.classList.contains("expanded")) {
    button.textContent = "Daha Az Göster ⬆";
    wrapper.scrollIntoView({ behavior: 'smooth', block: 'center' });
  } else {
    button.textContent = "Daha Fazla Göster ⬇";
    wrapper.scrollIntoView({ behavior: 'smooth', block: 'center' });

  }
});
document.querySelectorAll("button").forEach(button => {
  if (button.textContent.includes("Favorilere Ekle")) {
    button.addEventListener("click", () => {
      button.classList.toggle("favorited");

      const isFavorited = button.classList.contains("favorited");

      button.textContent = isFavorited
        ? "Favorilere Eklendi ❤️"
        : "Favorilere Ekle";

      button.style.background = isFavorited ? "crimson" : "#03254E";
    });
  }
});
window.addEventListener("scroll", () => {
  const header = document.querySelector("header");
  if (window.scrollY > 10) {
    header.classList.add("scrolled");
  } else {
    header.classList.remove("scrolled");
  }
});

