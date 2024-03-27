const inputs = document.querySelectorAll(
  'input[type="text"], input[type="password"], input[type="email"], textarea',
);

for (let input of inputs) {
  if (input.name === "campground[state]") {
    input.addEventListener("input", function () {
      this.value =
        this.value === " " ? this.value.trim() : this.value.toUpperCase();
    });
    continue;
  }
  input.addEventListener("input", function () {
    this.value = this.value === " " ? this.value.trim() : this.value;
  });
}
