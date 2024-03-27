const pictureDiv = document.querySelector("#picture");
const profileEditButton = document.querySelector("#profileEditButton");

const editEmailIcon = document.querySelector("#editEmailIcon");
const closeEmailIcon = document.querySelector("#closeEmailIcon");
const emailShow = document.querySelector("#emailShow");
const emailInput = document.querySelector("#emailInput");

const editPasswordIcon = document.querySelector("#editPasswordIcon");
const closePasswordIcon = document.querySelector("#closePasswordIcon");
const passwordShow = document.querySelector("#passwordShow");
const passwordInputs = [
  document.querySelector("#oldPassword"),
  document.querySelector("#newPassword"),
];

pictureDiv.addEventListener("click", () => {
  document.querySelector("#pictureForms").classList.toggle("hidden");
});

const toggleEdit = (show, inputs) => {
  show.classList.toggle("block");
  show.classList.toggle("hidden");

  for (let input of inputs) {
    input.classList.toggle("hidden");
    input.classList.toggle("block");
    input.required = !input.required;
    input.disabled = !input.disabled;

    for (let label of input.labels) {
      label.classList.toggle("hidden");
    }
  }
};

editEmailIcon.addEventListener("click", () => {
  toggleEdit(emailShow, [emailInput]);
  profileEditButton.classList.remove("hidden");
});

closeEmailIcon.addEventListener("click", () => {
  toggleEdit(emailShow, [emailInput]);
  if (passwordInputs[0].disabled) {
    profileEditButton.classList.add("hidden");
  }
});

editPasswordIcon.addEventListener("click", () => {
  toggleEdit(passwordShow, passwordInputs);
  profileEditButton.classList.remove("hidden");
});

closePasswordIcon.addEventListener("click", () => {
  toggleEdit(passwordShow, passwordInputs);
  if (emailInput.disabled) {
    profileEditButton.classList.add("hidden");
  }
});
