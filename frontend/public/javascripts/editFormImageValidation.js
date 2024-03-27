const imageInputs = document.querySelectorAll('input[type="checkbox"]');
const newImages = document.querySelector("#images");
const form = document.querySelector("form");

form.addEventListener("submit", (e) => {
  const isDeleteAll = Array(...imageInputs).every((i) => i.checked);
  if (isDeleteAll && !images.files.length) {
    const missingImagesMessage = document.querySelector(
      "#missingImagesMessage",
    );
    missingImagesMessage.classList.remove("hidden");
    e.preventDefault();
  }
});
