stars = document.querySelectorAll('input[name="review[rating]"]');

stars[0].setCustomValidity("Invalid field.");

for (let star of stars) {
  star.addEventListener(
    "change",
    () => {
      stars[0].setCustomValidity("");
    },
    { once: true },
  );
}
