let user_name = document.getElementById("name");
let email = document.getElementById("email");
let phone = document.getElementById("phone");

let edit_email = document.getElementById("edit_email");
let edit_name = document.getElementById("edit_name");
let edit_phone = document.getElementById("edit_phone");
let edit_picture = document.getElementById("edit_avatar");

let contacts;
let currentUserName;
let editingContact;

/**
 * This function is used to first load the Templates, then it will load the Contacts from
 * the Backend.
 * After its loaded from the Backend. The Contactlist is getting rendered.
 */
async function init() {
  checkLogIn();
  await loadContacts();
  renderContactList()
}

/**
 * This function takes the ID of the Modal as a paramter and closes it.
 * @param {string} - id of the Modal
 */
function closeModal(id) {
  let modal = document.getElementById(id);
  modal.classList.remove("slideIn");
  modal.classList.add("slideOut");
}

/**
 * This function takes the ID of the Modal as a paramter and opens it.
 * @param {string} - id of the Modal
 */
function openModal(id) {
  let modal = document.getElementById(id);
  modal.style = "display: flex;";
  modal.className = "slideIn";
}

/**
 * This function calls another function that resets the input of the user
 * and closes the Modal with the given ID.
 * @param {string} - id of the Modal
 */
function cancelContact(id) {
  resetForm();
  closeModal(id);
}


function getRandomColor() {
  const letters = "0123456789ABCDEF";
  let color = "#";
  for (let i = 0; i < 6; i++) {
    color += letters[Math.floor(Math.random() * 16)];
  }
  return color;
}

/**
 * This help function resets the User Input.
 */
function resetForm() {
  user_name.value = "";
  email.value = "";
  phone.value = "";
}

/**
 * This function renders the Contact Details in the render Element ID.
 * @param {string} - the contact that should be rendered is taken as a parameter.
 */
function renderContact(username) {
  
  let contact = findContactByUserName(username);
  currentUserName = contact.name;
  let email = contact.email;
  let phone = contact.phone;
  let name = contact.name;
  let acronym = contact.acronym;
  let color = contact.color;
  content = document.getElementById("render");
  render.innerHTML = htmlUserTemplate(email, phone, name, acronym, color);
}

/**
 * This help function finds the wanted contact.
 * @param {string} - @param {string} - the contact that should be found is taken as a parameter.
 */
function findContactByUserName(userName) {
  return contacts.find((contact) => contact.name === userName);
}

/**
 * This function edits the Contact Info of the User.
 * @param {string} - the contact that should be found is taken as a parameter.
 */
function editContact(user) {
  openModal("edit_contact_modal");

  editingContact = findContactByUserName(user);
  edit_name.value = editingContact.name;
  edit_email.value = editingContact.email;
  edit_phone.value = editingContact.phone;
  edit_picture.innerHTML = editingContact.acronym;
  edit_picture.style.backgroundColor = editingContact.color;
}


/**
 * This function deletes the Contact inside of a Modal.
 * @param {string} - the Modal that should be closed.
 */
async function deleteContactInModal(id) {
  deleteContact(currentUserName); 
  closeModal("edit_contact_modal");  
}

/**
 * This help function deletes User Input inside the Edit Modal.
 */
function resetEditForm() {
  edit_name.value = "";
  edit_email.value = "";
  edit_phone.value = "";
}


function resetAddContactsForm(){
  document.getElementById("name").value = "";
  email.value = "";
  phone.value = "";
}

/**
 * This function is for highlighting the current chosen User
 */
function changeDisplay() {
  let container = document.getElementById("contact_container");
  container.style.display = "none";
  currentHighlightedDiv.classList.remove("highlighted");
}



/**
 * This function puts a upper case on the first and last Name as the user types
 */

function capitalizeName(modal) {
  let nameOnInput = document.getElementById(modal).value;
  let arr = nameOnInput.split(" ");
  for (let i = 0; i < arr.length; i++) {
    arr[i] = arr[i].charAt(0).toUpperCase() + arr[i].slice(1);
    let fullName = arr.join(" ");
    document.getElementById(modal).value = fullName;
  }
}



/**
 * This help function is used for the HTML Template to render Contact Details.
 * @param {string} - email - email of Contact
 * @param {string} - phone - phone of Contact
 * @param {string} - name - name of Contact
 * @param {string} - acronym - acronym of Contact
 * @param {string} - color - color of Contact
 */

function htmlUserTemplate(email, phone, name, acronym, color) {
  return /*html*/ `<div class="user_container">
  <div class="user">
  <div class="user_icon" style="background-color: ${color}">${acronym}</div>
  <div class="user_edit_container">
  <div class="username">${name}</div>
  
  <div class="edit_user">
  <div id="edit_contact" onclick="editContact('${name}')">
    <img src="assets/img/edit.png">
    <span>Edit</span>
    </div>
    <div id="delete_contact" onclick="deleteContact('${name}')">
    <img src="assets/img/delete.png">
    <span>Delete</span>
    </div>
  </div>
  <div class="dropdown_for_mobile">
    <img src="assets/img/more_vert.png">
    <div class="dropdown-content">
    <div id="edit_contact" onclick="editContact('${name}')">
    <img src="assets/img/edit.png">
    <span>Edit</span>
    </div>
    <div id="delete_contact" onclick="deleteContact('${name}')">
    <img src="assets/img/delete.png">
    <span>Delete</span>
    </div>
</div>
</div>
</div>
</div>

</div>
<div class="contact_information">
    <span class="information">Contact Information</span>
  </div>
  <div class="user_details">
    <div class="details_container">
        <div class="email">
        
            <h3>Email</h3>
            <a href="mailto: ${email}">${email}</a>
            </div>
        
        <div class="phone">
            <h3>Phone</h3>
            <a href="tel: ${phone}">${phone}</a>
        </div>
    </div>
  </div>
</div>`;
}




/**
 * HTTP Requests GET, POST, PUT, DELETE
 * 
 */


async function loadContacts() {

  const url = "http://127.0.0.1:8000/contact/";
  await fetch(url)
    .then(response => response.json())
    .then(data => {
      contacts = data
      renderContactList()
    })
    .catch(error => {
      console.error("Fehler beim Abrufen der Daten:", error);
    })
}


/**
 *
 * This function loads the Contacts from the Backend.
 *
 */
async function createContact(id) {
  const myHeaders = new Headers();
  myHeaders.append("Content-Type", "application/json");

  let acronym = createAcronym(user_name.value);

  const raw = JSON.stringify({
    "name": user_name.value,
    "email": email.value,
    "phone": +phone.value,
    "acronym": acronym,
    "color": getRandomColor()
  });

  const requestOptions = {
    method: "POST",
    headers: myHeaders,
    body: raw,
    redirect: "follow"
  };

  fetch("http://127.0.0.1:8000/contact/", requestOptions)
    .then((response) => response.text())
    .then(() => {resetAddContactsForm(), loadContacts(), renderContactList()})
    .then(closeModal(id))
    .catch((error) => console.error(error));
}



async function saveEditedContact() {
  const contactId = editingContact.id;
  let acronym = createAcronym(edit_name.value);

  const updatedContactData = {
    name: edit_name.value,
    email: edit_email.value,
    phone: edit_phone.value,
    acronym: acronym,
    color: editingContact.color
  };

  fetch(`http://127.0.0.1:8000/contact/${contactId}/`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(updatedContactData),
  })
    .then(response => {
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      return response.json();
    })
    .then(async data => {
      console.log('Erfolgreich aktualisiert:', data);
      closeModal("edit_contact_modal");
      await loadContacts();
      renderContact(edit_name.value)
    })
    .catch(error => {
      console.error('Fehler beim Aktualisieren:', error);
    });
}


/**
 *
 * This function deletes the Contact and saves the Contactlist in the Backend again.
 * @param {string} - the contact that should be deleted is taken as a parameter.
 */

async function deleteContact(username) {
  let contact = findContactByUserName(username);
  const contactId = contact.id;

  fetch(`http://127.0.0.1:8000/contact/${contactId}/`, {
    method: 'DELETE',
  })
    .then(response => {
      console.log('Kontakt erfolgreich gelöscht');
      loadContacts()
    })
    .catch(error => {
      console.error('Fehler beim Löschen des Kontakts:', error);
    });
}