const dismissFlashSuccess = document.querySelector("#dismissFlashSuccess");
const flashSuccess = document.querySelector("#flashSuccess");

dismissFlashSuccess.addEventListener("click", () => {
  flashSuccess.classList.add("opacity-0");
});

flashSuccess.addEventListener("transitionend", () => {
  flashSuccess.classList.add("hidden");
});
