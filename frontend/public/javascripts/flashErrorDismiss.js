const dismissFlashError = document.querySelector("#dismissFlashError");
const flashError = document.querySelector("#flashError");

dismissFlashError.addEventListener("click", () => {
  flashError.classList.add("opacity-0");
});

flashError.addEventListener("transitionend", () => {
  flashError.classList.add("hidden");
});
