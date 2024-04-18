let currentUser;
let allUsersToCheck;
let allUserNames = []

function init() {
  loadCache();
  lookingForGuest()
}


/**
 * function to create a guest, wenn backend is empty
 * look for User Guest in allUsers --> if exists do nothing, else create newGuestUser
 * 
 * @returns 
 */
async function lookingForGuest(){
  await loadAllUsers()

  allUsersToCheck.forEach(element => {
    let nami = element['username']
    allUserNames.push(nami)
  });

  if(allUserNames.includes('Guest')){
    return
  } else {
    await createGuestUser()
  }
}

async function loadUser() {
  try {
    currentUser = localStorage.getItem("currentUser");
  } catch (e) {
    console.error("Loading error:", e);
  }
}

async function loginUser() {

  const myHeaders = new Headers();
  myHeaders.append("Content-Type", "application/json");

  const raw = JSON.stringify({
    "username": email.value,
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
    const response = await fetch("http://127.0.0.1:8000/login/", requestOptions);
    const result = await response.text();
    const tokenJson = JSON.parse(result)
    const token = tokenJson.token;
    const username = tokenJson.username;
    localStorage.setItem('token', token)
    localStorage.setItem('currentUser', username)
    localStorage.setItem(`loggedIn`, true);
    if (token) {
      window.location.href = "./summary.html";
    } else {

      if(email.value = "Guest"){
        alert("Bitte lege in den Django Users einen Gastuser an --> Passwort Klemens1; Name:Guest")
      } else {
        alert("Username oder Password falsch. Bitte versuche es nochmal")
      }



    }
  } catch (error) {
    console.error(error);
  }
}


async function guestUser(){
  email.value = "Guest"
  password.value = "Klemens1"
  
  await loginUser()
  
  
}


function checkLogIn() {
  let LogInStatus = localStorage.getItem(`loggedIn`);
  if (LogInStatus == 'false') {
    window.location.href = "index.html"
    alert('Please Log In to view this Page.');
  }
}

function cacheData() {
  let check = document.getElementById("remember");
  if (check.checked == true) {
    localStorage.setItem("email", `${email.value}`);
    localStorage.setItem(`password`, `${password.value}`);

  }
}

function loadCache() {
  let email = localStorage.getItem("email");
  let password = localStorage.getItem("password");
  document.getElementById("email").value = email;
  document.getElementById("password").value = password;
}
