window.addEventListener("DOMContentLoaded", () => {
  document.querySelector("#theme-toggle").addEventListener("change", () => {
    document.body.classList.toggle("dark");
  });
});
