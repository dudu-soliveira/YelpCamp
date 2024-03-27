const profile = document.querySelector("#user-menu");
const profileBtn = document.querySelector("#user-menu-button");

profileBtn.addEventListener("click", () => {
  profile.classList.remove("hidden");
  setTimeout(() => {
    profile.setAttribute("aria-hidden", "false");
  }, 50);
  profileBtn.setAttribute("aria-expanded", "true");
});

document.addEventListener("click", (e) => {
  if (!profileBtn.contains(e.target)) {
    profile.setAttribute("aria-hidden", "true");
    profileBtn.setAttribute("aria-expanded", "false");
  }
});

profile.addEventListener("transitionend", () => {
  if (profile.ariaHidden === "true") {
    setTimeout(() => {
      profile.classList.add("hidden");
    }, 50);
  }
});
