// const STORAGE_TOKEN = "ISAI9QDR5MFJLJDA0HK4U4QK3WHMMDT89LA45TS6";
const STORAGE_URL = "http://127.0.0.1:8000/";

// async function setItem(key, value) {
//   const payload = { key, value, token: STORAGE_TOKEN };
//   return fetch(STORAGE_URL, {
//     method: "POST",
//     body: JSON.stringify(payload),
//   }).then((res) => res.json())

// }

async function getItem(key) {
  // const url = `${STORAGE_URL}?key=${key}&token=${STORAGE_TOKEN}`;
  // return fetch(url)
  //   .then((res) => res.json())
  //   .then((res) => {
  //     console.warn(res.data)
  //     // Verbesserter code
  //     if (res.data) {
  //       return res.data.value;
  //     }
  //     throw `Could not find data with key "${key}".`;
  //   });
}

//1WFL667576C47A9ZMOQ1CW3ATOK88WC8RT8II2Y1
//ISAI9QDR5MFJLJDA0HK4U4QK3WHMMDT89LA45TS6


/**
 * HTTP Requests GET, POST, PUT, DELETE Contacts
 * 
 */


async function loadContacts() {

  const url = "http://127.0.0.1:8000/contact/";
  await fetch(url)
    .then(response => response.text())
    .then(data => {
      contacts = JSON.parse(data)
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

  fetch(STORAGE_URL + "contact/", requestOptions)
    .then((response) => response.text())
    .then(async () => {  await loadContacts(), await renderContactList() })
    .then(resetAddContactsForm(), closeModal(id))
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

  fetch(STORAGE_URL + `contact/${contactId}/`, {
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
      await renderContactList()
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

  fetch(STORAGE_URL + `contact/${contactId}/`, {
    method: 'DELETE',
  })
    .then(async response => {
      console.log('Kontakt erfolgreich gelöscht');
      await loadContacts();
      await renderContactList();
      renderEmptyContact();
    })
    .catch(error => {
      console.error('Fehler beim Löschen des Kontakts:', error);
    });
}



/**
 * 
 */


async function loadCategories() {
  const url = "http://127.0.0.1:8000/category/";
  await fetch(url)
    .then(response => response.text())
    .then(data => {
      categories = JSON.parse(data)
    })
    .catch(error => {
      console.error("Fehler beim Abrufen der Daten:", error);
    })
}


async function addNewCategory() {
  const myHeaders = new Headers();
  myHeaders.append("Content-Type", "application/json");

  const raw = JSON.stringify({
    "color": newCategoryColor,
    "name": newCategoryName
  });

  const requestOptions = {
    method: "POST",
    headers: myHeaders,
    body: raw,
    redirect: "follow"
  };

  fetch("http://127.0.0.1:8000/category/", requestOptions)
    .then((response) => response.text())
    .then(async () => await loadCategories())
    .catch((error) => console.error(error));
}


async function deleteCategoryInBackend(categoryName) {
  let category = findCategoryByName(categoryName);
  const catID = category.id;

  fetch(STORAGE_URL + `category/${catID}/`, {
    method: 'DELETE',
  })
    .then(async response => {
      console.log('Category deleted');
      await loadContacts();
      await loadCategories();
    })
    .catch(error => {
      console.error('Fehler beim Löschen des Kontakts:', error);
    });
}


/**
 * TASKS
 */
async function loadTasks() {

  const url = "http://127.0.0.1:8000/task/";
  await fetch(url)
    .then(response => response.json())
    .then(data => {
      tasks = data
    })
    .catch(error => {
      console.error("Fehler beim Abrufen der Daten:", error);
    })
}

async function changeTask(task ,id) {

  const url = `http://127.0.0.1:8000/task/${id}/`;
  newTask= makePks(task);

    fetch(url, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(task),
    })
      .then(response => {
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        return response.json();
      })
      .then(async data => {
        console.log('Erfolgreich aktualisiert:', data);
        await loadTasks();
        renderBoardCards();
      })
      .catch(error => {
        console.error('Fehler beim Aktualisieren:', error);
      });
}


function makePks(task){
  console.log(task)
  task['assigned_to'] = makePKArray(task['assigned_to'])
  task['category'] = task['category'].id
  task['subtasks'] = makePKArray(task['subtasks'])
  console.log(task)
}


function makePKArray(array){
  let pkArray = [];
  array.forEach(element => {
    pkArray.push(element.id)
  });

  return pkArray
}



/**
 * SUBTASKS
 */
async function saveSubtasks() {
  const myHeaders = new Headers();
  myHeaders.append("Content-Type", "application/json");

  const raw = JSON.stringify(newSub);
  console.log(subTasksArray)
  console.warn(raw)

  const requestOptions = {
    method: "POST",
    headers: myHeaders,
    body: raw,
    redirect: "follow"
  };

  try {
    let response = await fetch("http://127.0.0.1:8000/subtask/", requestOptions);
    let resp = await response.json();
    makeSubtasksPKArray(resp.id)
  } catch (error) {
    console.error("Error fetching JSON: ", error);
  }
}


async function changeSubtaskStatus(subtask, id, cardID) {

  const url = `http://127.0.0.1:8000/subtask/${id}/`;

    fetch(url, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(subtask),
    })
      .then(response => {
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        return response.json();
      })
      .then(async data => {
        console.log('Erfolgreich aktualisiert:', data);
        await loadTasks();
        renderBoardCards();
      })
      .catch(error => {
        console.error('Fehler beim Aktualisieren:', error);
      });
}



/**
 * This help function finds the wanted contact.
 * @param {string} - @param {string} - the contact that should be found is taken as a parameter.
 */
function findCategoryByName(categoryName) {
  return categories.find((category) => category.name === categoryName);

}