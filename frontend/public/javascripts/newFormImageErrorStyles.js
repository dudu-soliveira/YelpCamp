const imagesInput = document.querySelector("#images");
const imagesLabel = imagesInput.labels[0];
const imagesSpan = imagesLabel.nextElementSibling;

imagesInput.addEventListener(
  "focusout",
  () => {
    imagesInput.classList.add("invalid:border-red-600");
    imagesLabel.classList.add("peer-invalid:text-red-600");
    imagesSpan.classList.add("peer-invalid:block");
  },
  { once: true },
);
