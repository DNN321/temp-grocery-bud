// ****** SELECT ITEMS **********

const alert = document.querySelector(".alert");
const form = document.querySelector(".grocery-form");
const grocery = document.getElementById("grocery");
const submitBtn = document.querySelector(".submit-btn");
const container = document.querySelector(".grocery-container");
const list = document.querySelector(".grocery-list");
const clearBtn = document.querySelector(".clear-btn");

console.log(window.documents);

// edit option

let editElement; // stores the element being edited
let editFlag = false; //indicates wheter editing is in progress
let editID = ""; //stores the ID of the item being edited

// ****** EVENT LISTENERS **********
// submit form
form.addEventListener("submit", addItem);
// clear items
clearBtn.addEventListener("click", clearItems);
// load Items
window.addEventListener("DOMContentLoaded", setupItems);

const deleteBtn = document.querySelector(".delete-btn");
// console.log(deleteBtn);
// ****** FUNCTIONS **********
function addItem(e) {
  //function that adds items to the grocery list
  e.preventDefault(); //prevents submission behaviour of reloading the page
  const value = grocery.value; //this is the value entered in the input field
  //console.log("grocery.value", value);

  const id = new Date().getTime().toString(); // uniquie id for each item
  //if statement that adds to the grocery-list when value is true and editFlag is false
  if (value && !editFlag) {
    //function with two parameters representing the value entered with its corresponding id
    createListItem(id, value);
    //display alert
    displayAlert("item added to the list", "success");
    // show container
    container.classList.add("show-container");
    // add to locaol storage
    addToLocalStorage(id, value);
    // set back to default
    setBackToDefault();
  } else if (value && editFlag) {
    editElement.innerHTML = value;
    displayAlert("value changed", "success");
    // edit local storage
    editLocalStorage(editID, value);
    setBackToDefault();
  } else {
    displayAlert("please enter value", `danger`);
  }
}
//display alert
function displayAlert(text, action) {
  alert.textContent = text;
  alert.classList.add("alert-", action);

  //remove alert
  setTimeout(function () {
    alert.textContent = "";
    alert.classList.remove(`alert-${action}`);
  }, 20000);
}
//clear Items
function clearItems() {
  const items = document.querySelectorAll(".grocery-item");

  if (items.length > 0) {
    items.forEach(function (item) {
      list.removeChild(item);
    });
  }
  container.classList.remove("show-container");
  displayAlert("empty list", "danger");
  setBackToDefault();
  localStorage.removeItem("list");
}
// delete function
function deleteItem(e) {
  const element = e.currentTarget.parentElement.parentElement;
  console.log(element);
  const id = element.dataset.id;
  console.log(id);
  list.removeChild(element);
  if (list.children.length === 0) {
    container.classList.remove("show-container");
  }
  displayAlert("item removed", "danger");
  setBackToDefault();
  //remove from local storage
  removeFromLocalStorage(id);
}
// edit function
function editItem(e) {
  const element = e.currentTarget.parentElement.parentElement;
  // set edit item
  editElement = e.currentTarget.parentElement.previousElementSibling;
  console.log(editElement);
  //set form value
  grocery.value = editElement.innerHTML;
  editFlag = true;
  editID = element.dataset.id;
  submitBtn.textContent = "edit";
}
// set back to default

function setBackToDefault() {
  grocery.value = "";
  editFlag = false;
  editID = "";
  submitBtn.textContent = "submit";
}

// ****** LOCAL STORAGE **********

function addToLocalStorage(id, value) {
  const grocery = { id, value };

  let items = getLocalStorage();
  console.log(items);
  items.push(grocery);
  localStorage.setItem("list", JSON.stringify(items));
  //   console.log("added to local storage");
}
function removeFromLocalStorage(id) {
  let items = getLocalStorage();
  items = items.filter(function (item) {
    if (item.id !== id) {
      return item;
    }
    console.log("item.id", item.id, "id", id);
  });

  localStorage.setItem("list", JSON.stringify(items));
}

function editLocalStorage(id, value) {
  let items = getfLocalStorage();
  items = items.map(function (item) {
    if (item.id === id) {
      item.value = value;
    }
    return item;
  });
}
function getLocalStorage() {
  return localStorage.getItem("list")
    ? JSON.parse(localStorage.getItem("list"))
    : [];
}
//////////////////////////////////////////////////////
localStorage.setItem("orange", JSON.stringify(["item", "item2"]));
localStorage.setItem("item4", "item5");

const oranges = JSON.parse(localStorage.getItem("orange"));
console.log(oranges);

// localStorage.removeItem("orange");

// ************* SETUP ITEMS **************
function setupItems() {
  let items = getLocalStorage();
  if (items.length > 0) {
    items.forEach(function (item) {
      createListItem(item.id, item.value);
    });
    container.classList.add("show-container");
  }
}

//this function reresents the dynamic html that will
//represent the Attributes that will be used in manipulating the
//items added to the grocerry-list
function createListItem(id, value) {
  const element = document.createElement("article"); //create element article
  //add class
  element.classList.add("grocery-item"); //adding class grocery-item to the element article
  //add id
  const attr = document.createAttribute("data-id"); //create a custom dataset using data-
  attr.value = id; //assigning the value of id to data-id
  element.setAttributeNode(attr); // attaches the data-id(the attribute) to the article(the element)
  element.innerHTML = `<p class="title">${value}</p>
            <div class="btn-container">
              <button type="button" class="edit-btn">
              <i class="fas fa-edit"></i>
              </button>
              <button type="button" class="delete-btn">
              <i class="fas fa-trash"></i>
            </div>`;
  const deleteBtn = element.querySelector(".delete-btn");

  const editBtn = element.querySelector(".edit-btn");

  deleteBtn.addEventListener("click", deleteItem);

  editBtn.addEventListener("click", editItem);

  // append child
  list.appendChild(element);
}
