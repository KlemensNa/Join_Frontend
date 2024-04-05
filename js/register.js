// let users = [];
// let username = document.getElementById("name");
// let email = document.getElementById("email");
// let confirm = document.getElementById("confirmpassword");
// let password = document.getElementById("password");
// let signup = document.getElementById("signup");

// const form = document.getElementById("forgot-form");
// const button = document.querySelector(".fly-in-button");
// const overlay = document.querySelector(".overlay");

// function delay(ms) {
//   return new Promise((resolve) => setTimeout(resolve, ms));
// }



async function signUp() {
  const myHeaders = new Headers();
  myHeaders.append("Content-Type", "application/json");

  const raw = JSON.stringify({
    "username": username.value,
    "password": password.value,
    "email": email.value
  });

  const requestOptions = {
    method: "POST",
    headers: myHeaders,
    body: raw,
    redirect: "follow"
  };


  try {
    const response = await fetch("http://127.0.0.1:8000/register/", requestOptions);
    const result = await response.text();
    resetForm();
    window.location.href = "./"; // Hier kannst du die Antwort verarbeiten
  } catch (error) {
    console.error(error);
  }
}

// form.addEventListener("submit", async (event) => {
//   event.preventDefault();
//   const passwordMatching = await addUser();
//   if (passwordMatching) {
//     document.body.classList.add("clicked");
//     button.classList.add("clicked");
//     await delay(1000);
//     form.submit();
//     window.location.href = "index.html";
//   }
// });

// async function addUser() {
//   confirm.classList.remove("border-red");
//   error.style = "display: none;";
//   if (
//     username.value.length >= 1 &&
//     email.value.length >= 1 &&
//     password.value.length >= 1 &&
//     password.value == confirm.value
//   ) {
//     users.push({
//       name: username.value,
//       email: email.value,
//       password: password.value,
//     });
//     await setItem("users", JSON.stringify(users));
//     resetForm();
//     return true;
//   } else {
//     confirm.classList.add("border-red");
//     error.style = "display: flex;";
//     confirm.value = "";
//     return false;
//   }
// }

function resetForm() {
  username.value = "";
  email.value = "";
  confirm.value = "";
  password.value = "";
  confirmpassword.value = "";
  signup.disabled = false;
}
