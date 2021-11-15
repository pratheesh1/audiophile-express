window.addEventListener("DOMContentLoaded", () => {
  /* ----------- switch light/dark mode ----------- */
  // adapted from tailwindcss docs https://tailwindcss.com/docs/dark-mode
  const toggleTheme = document.querySelector("#theme-toggle");
  if (
    localStorage.theme === "dark" ||
    (!("theme" in localStorage) &&
      window.matchMedia("(prefers-color-scheme: dark)").matches)
  ) {
    document.body.classList.add("dark");
    toggleTheme.checked = true;
  } else {
    document.body.classList.remove("dark");
    toggleTheme.checked = false;
  }

  localStorage.removeItem("theme");
  toggleTheme.addEventListener("change", () => {
    localStorage.theme = "light" ? "dark" : "light";
    document.body.classList.toggle("dark");
  });
  /* ----------- end of switch light/dark mode ----------- */
});
