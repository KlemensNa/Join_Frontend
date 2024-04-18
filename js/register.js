
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


function resetForm() {
  username.value = "";
  email.value = "";
  confirm.value = "";
  password.value = "";
  confirmpassword.value = "";
  signup.disabled = false;
}
