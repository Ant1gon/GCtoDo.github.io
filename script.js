"use strict";
var toDoList = JSON.parse(localStorage.getItem("toDoList"));
getAllItems();

document.querySelector('.addBTN').addEventListener('click', addToDoElement);
document.querySelector('.getBTN').addEventListener('click', getAllItems);

document.querySelector('.clearBTN').addEventListener('click', clearSection);
document.querySelector('.clearBTN').addEventListener('dblclick', clearLockalStorage);


document.querySelector('.dateSort').addEventListener('click', () => {
	if (toDoList != null) {
		if (toDoList.sortBy == "important") {
			toDoList.order = "asc";
			toDoList.sortBy = "date";
		}
		else {
			toDoList.order = toDoList.order == "asc" ? "desc" : "asc";
		}
	}
	//console.log(toDoList);
	getAllItems();
	saveTODOList();
});
document.querySelector('.importanceSort').addEventListener('click', () => {
	//console.log("dateSort");
	if (toDoList != null) {
		if (toDoList.sortBy == "date") {
			toDoList.order = "asc";
			toDoList.sortBy = "important";
		}
		else {
			toDoList.order = toDoList.order == "asc" ? "desc" : "asc";
		}
	}
	getAllItems();
	saveTODOList();
});


///
var dialog = document.getElementById('dialog');
//dialog.showModal();
dialog.addEventListener('close', function (event) {
	if (dialog.returnValue === 'yes') { /* ... */ }
});
///

function addToDoElement() {
	let value = document.querySelector('.text').value;
	if (value != "") {
		if (toDoList == null) {
			toDoList = {
				name: "toDoList",
				sortBy: "date",//"date", //important
				order: "asc",//"asc", desc
				language: navigator.language,
				elements: {}
			}
		}
		//let _id = Date.now();		
		toDoList.elements[Date.now()] = {
			//createdTime: Date.now(),
			text: value,
			activeStatus: true,
			importance: 1,
		};
		localStorage.setItem(toDoList.name, JSON.stringify(toDoList));
		document.querySelector('.text').value = "";
		getAllItems();
	}
	else {
		alert("Помилка: неможливо додати заплановану дію не ввівши її опис.\r\nВведіть будь ласка опис і натисніть кнопку Додати")
	}
}

function getAllItems() {
	clearSection();
	if (toDoList != null) {
		//console.log(toDoList)
		let toDoListEl = JSON.parse(localStorage.getItem("toDoList")).elements;
		var itemsKeys = Object.keys(toDoListEl);
		if (toDoList.sortBy == "date") {
			itemsKeys = itemsKeys.sort();
			//console.log(itemsKeys)
			if (toDoList.order == "desc") {
				itemsKeys = itemsKeys.sort().reverse()
				//console.log(itemsKeys);
			};
		}
		itemsKeys.forEach(item => {
			let el = toDoListEl[String(item)];
			let date = new Date(Number(item));
			addElementsToSection(item, date, el)
		});
		document.querySelector('.changeText') != null ?
			document.querySelector('.changeText').addEventListener('click', changeElement) : "";
	}
	else {
		document.querySelector('.toDoSection').innerHTML = "Відсутні збережені завдання"
	}
}

function addElementsToSection(item, date, el) {
	document.querySelector('.toDoSection').innerHTML +=
		`<div class="toDoElement" id="${item}">` +
			`<div class="date">${date.toLocaleDateString()} <br> ${date.toLocaleTimeString()}</div>` +
			`<div class="importance">${el.importance}</div>` +
			`<div class="activeStatus">${el.activeStatus}</div>` +
			`<textarea class="text"wrap="soft" placeholder="Текст події">${el.text}</textarea>` +
			`<button class="changeText">` +
				`<img src="https://cdn0.iconfinder.com/data/icons/ikooni-outline-seo-web/128/seo2-26-512.png" alt="Змінити текст">` +
			`</button>` +
			`<button class="changeImportance">` +
				`<img src="https://cdn1.iconfinder.com/data/icons/alerts-notifications/48/58-512.png" alt="Змінити важливість">` +
			`</button>` +
			`<button class="changeActiveStatus">` +
				`<img src="https://cdn1.iconfinder.com/data/icons/solid-icons-part-3/128/check-512.png" alt="Змінити статус">` +
			`</button>` +
		`</div>`;
}



function clearSection() {
	document.querySelector('.toDoSection').innerHTML = "";
}

function clearLockalStorage() {
	localStorage.clear();
	getAllItems();
}

function saveTODOList(){
	localStorage.setItem(toDoList.name, JSON.stringify(toDoList));
}
function changeElement() {

}
