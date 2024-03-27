const campgroundsContainer = document.querySelector("#campgroundsContainer");
let currentCampground =
  campgroundsContainer.children.length && campgroundsContainer.children[0];

for (let i = 0; i < 15; i++) {
  if (currentCampground && !currentCampground.classList.contains("hidden")) {
    currentCampground = currentCampground.nextElementSibling;
  }
}

const showCampgrounds = () => {
  for (let i = 0; i < 15; i++) {
    if (currentCampground) {
      currentCampground.classList.remove("hidden");
      currentCampground = currentCampground.nextElementSibling;
    }
  }
};

window.addEventListener("scroll", () => {
  if (
    currentCampground &&
    window.scrollY + window.innerHeight >= document.documentElement.scrollHeight
  ) {
    showCampgrounds();
  }
});
