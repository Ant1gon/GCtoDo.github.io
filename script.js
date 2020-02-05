"use strict";
var toDoList = getToDoListFromStorage();
itemsSort();

document.querySelector('.addBTN').addEventListener('click', addToDoElement);

document.querySelector('.clearBTN').addEventListener('click', () => {
	var dialog = document.getElementById('dialog');
	dialog.querySelector('.dialogText').innerText = "Видалити всі збережені записи з пам'яті?"
	dialog.showModal();
	dialog.addEventListener('close', function (event) {
		if (dialog.returnValue === 'yes') {
			clearLockalStorage();
		}
	});
});

document.querySelector('.dateSort').addEventListener('click', () => {
	if (toDoList != null) {
		if (toDoList.sortBy == "importance") {
			toDoList.order = "asc";
			toDoList.sortBy = "date";
		} else {
			toDoList.order = toDoList.order == "asc" ? "desc" : "asc";
		}
		itemsSort();
		saveTODOList();
	}
});
document.querySelector('.importanceSort').addEventListener('click', () => {
	if (toDoList != null) {
		if (toDoList.sortBy == "date") {
			toDoList.order = "asc";
			toDoList.sortBy = "importance";
		} else {
			toDoList.order = toDoList.order == "asc" ? "desc" : "asc";
		}
		itemsSort();
		saveTODOList();
	}
});

class ElementToSave {
	constructor(id, importance = null, text = null, activeStatus = null) {
		this.id = id;
		this.importance = importance;
		this.text = text;
		this.activeStatus = activeStatus;
	}
};

var $dialog = document.getElementById('dialog');

function addEvents() {
	document.querySelectorAll('.importance button').forEach(e => e.addEventListener('click', (arg) => {
		let id = arg["path"][3]["id"];
		let type = arg["path"][1]["className"];
		let importanceNew = arg["path"][2].querySelector('.importanceValue').innerText;
		if (type == 'changeUp') {
			if (importanceNew == 8) {
				importanceNew = 1;
			} else {
				importanceNew++;
			}
		} else {
			if (importanceNew == 1) {
				importanceNew = 8;
			} else {
				importanceNew--;
			}
		}
		arg["path"][2].querySelector('.importanceValue').innerText = importanceNew;
		let elementToSave = new ElementToSave(id, importanceNew);
		saveEditedToDo(elementToSave);
		if (document.querySelector('.autoUpdate').checked) itemsSort()
	}));
	document.querySelectorAll('.deleteBtn').forEach(e => e.addEventListener('click', (arg) => {		
		let id = arg["path"][3]["id"];		
		$dialog.showModal();
		$dialog.addEventListener('close', function (event) {
			if ($dialog.returnValue === 'yes') {
				delete toDoList["elements"][id];
				saveTODOList(toDoList);
				itemsSort();
			}
		});
	}));
	document.querySelectorAll('.changeActiveStatus').forEach(e => e.addEventListener('click', (arg) => {
		let id = arg["path"][3]["id"];
		let status = arg["path"][3]["className"];
		let elementToSave = new ElementToSave(id, null, null, status.indexOf("inactive") != -1 ? true : false);
		saveEditedToDo(elementToSave);
		itemsSort();
	}));
	document.querySelectorAll('.toDoElement textarea').forEach(e => e.addEventListener('input', (arg) => {
		let id = arg["path"][1]["id"];
		let text = e.value;
		let elementToSave = new ElementToSave(id, null, text);
		if (text.length > 0) {
			saveEditedToDo(elementToSave);
			toDoList = getToDoListFromStorage();
		}else {
			$dialog.showModal();
			$dialog.addEventListener('close', function (event) {
				if ($dialog.returnValue === 'yes') {
					delete toDoList["elements"][id];
					saveTODOList(toDoList);
					itemsSort();
				}else {
					itemsSort();
				}
			});
		}
	}));
	document.querySelectorAll('.textFilter').forEach(e => e.addEventListener('input', (arg) => {
		let textFilter = e.value;
		itemsSort(textFilter);
	}));

}


function getToDoListFromStorage() {
	let temp = JSON.parse(localStorage.getItem("toDoList"));
	if (temp != null) return JSON.parse(localStorage.getItem("toDoList"))
	else document.querySelector('.toDoActiveSection').innerHTML = "Відсутні збережені завдання";
}

///
/*var dialog = document.getElementById('dialog');
dialog.showModal();
dialog.addEventListener('close', function (event) {
	if (dialog.returnValue === 'yes') {

	}
});*/
///

function addToDoElement() {
	let value = document.querySelector('.text').value.replace(/\s+/g, '');
	let maxLength = 100;
	if (value != "") {
		if (value.length < maxLength) {
			if (toDoList == null) {
				toDoList = {
					name: "toDoList",
					sortBy: "importance", //"date", //importance
					order: "asc", //"asc", desc
					language: navigator.language,
					elements: {}
				}
			}
			toDoList.elements[Date.now()] = {
				text: value,
				activeStatus: true,
				importance: 1,
			};
			localStorage.setItem(toDoList.name, JSON.stringify(toDoList));
			document.querySelector('.text').value = "";
			document.querySelector('.text').focus();
			itemsSort();
		}
		else {
			alert(`Помилка: Перевищено допустиму кількість символів\r\n
					Поточна довжина рядка складає: ${value.length}. Обмеження встановлене на рівні: ${maxLength}\r\n
					Скоротіть будь ласка опис і натисніть кнопку Додати`);
		}
	} else {
		alert("Помилка: неможливо додати заплановану дію не ввівши її опис.\r\nВведіть будь ласка опис і натисніть кнопку Додати");
		document.querySelector('.text').value = '';
	}
}

function itemsSort(textFilter) {
	if (toDoList != null) {
		let toDoListEl = toDoList.elements;
		if (toDoList.sortBy == "date") {
			let itemsKeys = Object.keys(toDoListEl);
			itemsKeys = itemsKeys.sort();
			if (toDoList.order == "desc") {
				itemsKeys = itemsKeys.reverse();
			}
			clearSection();
			itemsKeys.forEach(item => {
				let el = toDoListEl[String(item)];
				if(textFilter == null){
					addElementToSection(item, el);
				}
				else if(el.text.indexOf(textFilter) !== -1){
					addElementToSection(item, el);
				}
			});
		} else if (toDoList.sortBy == "importance") {
			var sortable = [];
			for (let element in toDoListEl) {
				sortable.push([element, toDoListEl[element]["importance"]]);
			}
			sortable.sort(function (a, b) {
				return a[1] - b[1];
			});
			if (toDoList.order == "desc") {
				sortable.reverse();
			}
			clearSection();
			for (let i = 0; i < sortable.length; i++) {
				let el = toDoListEl[sortable[i][0]];
				if(textFilter == null){
					addElementToSection(sortable[i][0], el);
				}
				else if(el.text.indexOf(textFilter) !== -1){
					addElementToSection(sortable[i][0], el);
				}
			}
		}
		addEvents();

		document.querySelector('.changeText') != null ?
			document.querySelector('.changeText').addEventListener('click', changeElement) : "";
	} else {
		document.querySelector('.toDoActiveSection').innerHTML = "Відсутні збережені завдання"
	}
}

function addElementToSection(id, el) {
	let date = new Date(Number(id));
	let toBlock = el.activeStatus ? document.querySelector('.toDoActiveSection') : document.querySelector('.toDoInActiveSection');
	toBlock.innerHTML +=
		`<div class="toDoElement  ${el.activeStatus ? "active" : "inactive"}" id="${id}">` +
		`<div class="date">${date.toLocaleDateString()} <br> ${date.toLocaleTimeString()}</div>` +
		`<div class="importance">` +
		`<button class="changeUp">
					<img src="https://cdn2.iconfinder.com/data/icons/picol-vector/32/arrow_sans_up-512.png" alt="Збільшити важливість"  title="Збільшити важливість">
				</button>` +
		`<div class="importanceValue">${el.importance}</div>` +
		`<button class="changeDown">
					<img src="https://cdn2.iconfinder.com/data/icons/picol-vector/32/arrow_sans_down-512.png" alt="Зменшити важливість" title="Зменшити важливість">
				</button>` +
		`</div>` +
		`<textarea class="text"wrap="soft" placeholder="Текст події">${el.text}</textarea>` +
		`<div class="toDoControls">` +
		`<button class="changeActiveStatus">` +
		`<img src="https://cdn1.iconfinder.com/data/icons/material-core/20/check-circle-512.png" alt="Змінити статус">` +
		`</button>` +
		`<button class="deleteBtn":"inactive"}">` +
		`<img src="https://cdn2.iconfinder.com/data/icons/basic-ui-elements-round/700/010_trash-2-512.png" alt="Змінити статус">` +
		`</button>` +
		`</div>` +
		`</div>`;
}

function clearSection() {
	document.querySelector('.toDoActiveSection').innerHTML = "";
	document.querySelector('.toDoInActiveSection').innerHTML = "";
}

function clearLockalStorage() {
	localStorage.clear();
	toDoList = getToDoListFromStorage();
	itemsSort();
}

function saveEditedToDo(elemToSave) {
	let editedElement = toDoList.elements[elemToSave.id];
	if (elemToSave.importance != null) editedElement.importance = elemToSave.importance;
	if (elemToSave.text != null && elemToSave.text.length != 0) editedElement.text = elemToSave.text;
	if (elemToSave.activeStatus != null) editedElement.activeStatus = elemToSave.activeStatus;
	toDoList.elements[elemToSave.id] = editedElement;
	saveTODOList();
}


function saveTODOList() {
	localStorage.setItem(toDoList.name, JSON.stringify(toDoList));
}


function changeElement() {

}