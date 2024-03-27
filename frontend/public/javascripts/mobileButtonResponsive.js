const mobile = document.querySelector("#mobile-menu");
const mobileBtn = document.querySelector("#mobile-menu-button");

mobileBtn.addEventListener("click", () => {
  mobile.classList.toggle("hidden");

  if (mobileBtn.ariaExpanded) {
    mobileBtn.setAttribute("aria-expanded", "false");
    mobile.setAttribute("aria-hidden", "true");
  } else {
    mobileBtn.setAttribute("aria-expanded", "true");
    mobile.setAttribute("aria-hidden", "false");
  }

  for (let svg of mobileBtn.querySelectorAll("svg")) {
    svg.classList.toggle("hidden");
  }
});
