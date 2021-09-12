// ****** SELECT ITEMS **********
const alert = document.querySelector('.alert');
const form = document.querySelector('.grocery-form');
const grocery = document.querySelector('#grocery');
const submitBtn = document.querySelector('.submit-btn');
const container = document.querySelector('.grocery-container');
const list = document.querySelector('.grocery-list');
const clearBtn = document.querySelector('.clear-btn');

// edit option
let editElement;
let editFlag = false;
let editId = "";

// ****** EVENT LISTENERS **********

// Submit Form

form.addEventListener('submit',addItem);

// Clear Items

clearBtn.addEventListener('click',clearItems);

// Load Items

window.addEventListener('DOMContentLoaded',setupItems);

// ****** FUNCTIONS **********

function addItem(e)
{
	e.preventDefault();
	const value = grocery.value;
	const id = new Date().getTime().toString(); // making a unique id for each item

	if(value && !editFlag)
	{
		createListItem(id,value);
            // Display Alert

            displayAlert('item added to the list', 'success');

            // Show Container

            container.classList.add("show-container");

            // Add to Local Storage

            addToLocalStorage(id,value);

            // Set Back To Default

            setBackToDefault();
	}
	else if(value && editFlag)
	{
		editElement.innerHTML = value;
		displayAlert('value changed', 'success');

		// Edit Local Storage
    
    editLocalStorage(editId,value);

		setBackToDefault();

	}
	else{
		displayAlert('please enter value', 'danger');
	}
}

// Display Alert

function displayAlert(text,action)
{
	alert.textContent = text;
	alert.classList.add(`alert-${action}`);

	// Remove Alert
	setTimeout(function()
	{
		alert.textContent = '';
	   alert.classList.remove(`alert-${action}`);

	},1000); // in milliseconds
}

// delete function

function deleteItem(e) {
	const element = e.currentTarget.parentElement.parentElement;
	const id = element.dataset.id;
	list.removeChild(element);

	if(list.children.length === 0)
	{
		container.classList.remove('show-container');
	}
	displayAlert('item deleted', 'danger');
	setBackToDefault();

	// Remove from Local Storage

	removeFromLocalStorage(id);
}

// delete function

function editItem(e) {
	const element = e.currentTarget.parentElement.parentElement;

	// Set Edit Item
	editElement = e.currentTarget.parentElement.previousElementSibling;

	// Set Form Value
	grocery.value = editElement.innerHTML;
	editFlag = true;
	editId = element.dataset.id;
	submitBtn.textContent = 'edit';
}


// Set Back To Default 

function setBackToDefault() {
	 grocery.value = "";
	 editFlag = false;
	 editId = '';
	 submitBtn.textContent = 'submit';
}

// Clear Items

function clearItems() {
	const items = document.querySelectorAll('.grocery-item');

	if(items.length >0)
	{
		items.forEach(function(item){
			list.removeChild(item);
		});
	}
	container.classList.remove("show-container");
	displayAlert('Empty List', 'danger');

  setBackToDefault();
	localStorage.removeItem('list');
}

// ****** LOCAL STORAGE **********

function addToLocalStorage(id,value){
	const grocery = {id, value}; // ES6 syntax shotcut for object if variable has same name as property name 
  let items = getLocalStorage();

  items.push(grocery);
  localStorage.setItem('list', JSON.stringify(items)); 
}

function removeFromLocalStorage(id)
{
	let items = getLocalStorage();
	
	items = items.filter(function(item)
	{
		if(item.id !== id)
		{
			return item;
		}
	});
	localStorage.setItem('list', JSON.stringify(items)); 
}

function editLocalStorage(id,value)
{
	let items = getLocalStorage();
	items = items.map(function(item)
	{
		if(item.id === id)
		{
			item.value = value;
		}
		return item;
	});
	localStorage.setItem('list', JSON.stringify(items)); 
}

function getLocalStorage()
{
	return localStorage.getItem('list') ? JSON.parse(localStorage.getItem('list')) : []; 
}


// ****** SETUP ITEMS **********

function setupItems()
{
	let items = getLocalStorage();

	if (items.length > 0) 
	{
		items.forEach(function(item){
			createListItem(item.id, item.value);
		});
		container.classList.add('show-container');
	}
}

function createListItem(id,value)
{
	const element = document.createElement('article');
		// Add Class
		element.classList.add('grocery-item');
		// Add Id
		const attr = document.createAttribute('data-id');
		attr.value = id;
		element.setAttributeNode(attr);
		element.innerHTML = `<p class="title">${value}</p>
            <div class="btn-container">
              <button type="button" class="edit-btn">
                <i class="fas fa-edit"></i>
              </button>
              <button type="button" class="delete-btn">
                <i class="fas fa-trash"></i>
              </button>
            </div>`
    const deleteBtn = element.querySelector('.delete-btn');
    const editBtn = element.querySelector('.edit-btn');
    
    deleteBtn.addEventListener('click',deleteItem);
    editBtn.addEventListener('click',editItem);
    

    // Append Child 

    list.appendChild(element);

}