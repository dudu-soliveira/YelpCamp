const mobile = document.querySelector("#mobile-menu");
const mobileBtn = document.querySelector("#mobile-menu-button");
const profile = document.querySelector("#user-menu");
const profileBtn = document.querySelector("#user-menu-button");

profileBtn.addEventListener("focusin", () => {
  profile.classList.remove("hidden");
  setTimeout(() => {
    profile.setAttribute("aria-hidden", "false");
  }, 50);
  profileBtn.setAttribute("aria-expanded", "true");
});

profileBtn.addEventListener("focusout", () => {
  profile.setAttribute("aria-hidden", "true");
  profileBtn.setAttribute("aria-expanded", "false");
});

profile.addEventListener("transitionend", () => {
  if (profile.ariaHidden === "true") {
    setTimeout(() => {
      profile.classList.add("hidden");
    }, 50);
  }
});

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
