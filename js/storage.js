const STORAGE_URL = "https://joinapi.naueka.de/";
let taskToDeleteSub;


async function loadAllUsers() {

  const myHeaders = new Headers();
  myHeaders.append("Content-Type", "application/json");

  const requestOptions = {
    method: "GET",
    headers: myHeaders,
  }

  const url = "https://joinapi.naueka.de/login/";
  await fetch(url, requestOptions)
    .then(response => response.text())
    .then(data => {
      allUsersToCheck = JSON.parse(data)
    })
    .catch(error => {
      console.error("Fehler beim Abrufen der Daten:", error);
    })
}



/**
 * CONTACTS
 * 
 */

async function loadContacts() {

  const myHeaders = new Headers();
  myHeaders.append("Content-Type", "application/json");
  myHeaders.append('Authorization', 'Token ' + localStorage.getItem('token'))

  const requestOptions = {
    method: "GET",
    headers: myHeaders,
  }

  const url = "https://joinapi.naueka.de/contact/";
  await fetch(url, requestOptions)
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
  myHeaders.append('Authorization', 'Token ' + localStorage.getItem('token'))

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
      'Authorization': 'Token ' + localStorage.getItem('token'),
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
    headers: {
      'Authorization': 'Token ' + localStorage.getItem('token'),
    }
  })
    .then(async response => {
      await loadContacts();
      await renderContactList();
      renderEmptyContact();
    })
    .catch(error => {
      console.error('Fehler beim Löschen des Kontakts:', error);
    });
}



/**
 * CATEGORIES
 */


async function loadCategories() {
  const url = "https://joinapi.naueka.de/category/";

  const myHeaders = new Headers();
  myHeaders.append("Content-Type", "application/json");
  myHeaders.append('Authorization', 'Token ' + localStorage.getItem('token'))

  const requestOptions = {
    method: "GET",
    headers: myHeaders,
  }

  await fetch(url, requestOptions)
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
  myHeaders.append('Authorization', 'Token ' + localStorage.getItem('token'))

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

  fetch("https://joinapi.naueka.de/category/", requestOptions)
    .then((response) => response.text())
    .then(async () => loadCategoryDropdown())
    .catch((error) => console.error(error));
}


async function deleteCategoryInBackend(categoryName) {
  let category = findCategoryByName(categoryName);
  const catID = category.id;

  fetch(STORAGE_URL + `category/${catID}/`, {
    method: 'DELETE',
    headers: {
      'Authorization': 'Token ' + localStorage.getItem('token'),
    }
  })
    .then(async response => {
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

  const myHeaders = new Headers();
  myHeaders.append("Content-Type", "application/json");
  myHeaders.append('Authorization', 'Token ' + localStorage.getItem('token'))

  const requestOptions = {
    method: "GET",
    headers: myHeaders,
  }

  const url = "https://joinapi.naueka.de/task/";
  await fetch(url, requestOptions)
    .then(response => response.json())
    .then(data => {
      tasks = data
    })
    .catch(error => {
      console.error("Fehler beim Abrufen der Daten:", error);
    })
}


async function loadTask(id) {

  const myHeaders = new Headers();
  myHeaders.append("Content-Type", "application/json");
  myHeaders.append('Authorization', 'Token ' + localStorage.getItem('token'))

  const requestOptions = {
    method: "GET",
    headers: myHeaders,
  }

  const url = `https://joinapi.naueka.de/task/${id}`;
  await fetch(url, requestOptions)
    .then(response => response.json())
    .then(data => {
      taskToDeleteSub = data
    })
    .catch(error => {
      console.error("Fehler beim Abrufen der Daten:", error);
    })
}


async function updateTask(task ,id) {

  const url = `https://joinapi.naueka.de/task/${id}/`;
  newTask= makePks(task);

    fetch(url, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Token ' + localStorage.getItem('token'),
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
        await loadTasks();
        renderBoardCards();
      })
      .catch(error => {
        console.error('Fehler beim Aktualisieren:', error);
      });
}


async function deleteTask(taskID) {

  fetch(STORAGE_URL + `task/${taskID}/`, {
    method: 'DELETE',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': 'Token ' + localStorage.getItem('token'),
    },
  })
    .then(async response => {
      await loadTasks()
      renderBoardCards()
    })
    .catch(error => {
      console.error('Fehler beim Löschen des Kontakts:', error);
    });
}


function makePks(task){
  task['assigned_to'] = makePKArray(task['assigned_to'])
  task['category'] = task['category'].id
  task['subtasks'] = makePKArray(task['subtasks'])
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
  myHeaders.append('Authorization', 'Token ' + localStorage.getItem('token'))

  const raw = JSON.stringify(newSub);

  const requestOptions = {
    method: "POST",
    headers: myHeaders,
    body: raw,
    redirect: "follow"
  };

  try {
    let response = await fetch("https://joinapi.naueka.de/subtask/", requestOptions);
    let resp = await response.json();
    makeSubtasksPKArray(resp.id)
  } catch (error) {
    console.error("Error fetching JSON: ", error);
  }
}


async function changeSubtaskStatus(subtask, id, cardID) {
  

  const url = `https://joinapi.naueka.de/subtask/${id}/`;

    fetch(url, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Token ' + localStorage.getItem('token'),
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
        await loadTasks();
        renderBoardCards();
      })
      .catch(error => {
        console.error('Fehler beim Aktualisieren:', error);
      });
}


async function deleteSubtask(id) {

  fetch(STORAGE_URL + `subtask/${id}/`, {
    method: 'DELETE',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': 'Token ' + localStorage.getItem('token'),
    },
  })
    .then(async response => {
    })
    .catch(error => {
      console.error('Fehler beim Löschen des Kontakts:', error);
    });
}


async function createGuestUser() {

  const myHeaders = new Headers();
  myHeaders.append("Content-Type", "application/json");

  const raw = JSON.stringify({
    "username": "Guest",
    "password": "Klemens1",
    "email": "Guest"
  });

  const requestOptions = {
    method: "POST",
    headers: myHeaders,
    body: raw,
    redirect: "follow"
  };


  try {
    const response = await fetch("https://joinapi.naueka.de/register/", requestOptions);
    const result = await response.text();
  } catch (error) {
    console.error(error);
  }

}


/**
 * This help function finds the wanted contact.
 * @param {string} - @param {string} - the contact that should be found is taken as a parameter.
 */
function findCategoryByName(categoryName) {
  return categories.find((category) => category.name === categoryName);

}