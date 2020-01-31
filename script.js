"use strict";
var toDoList = getToDoListFromStorage();
itemsSort();

document.querySelector('.addBTN').addEventListener('click', addToDoElement);
document.querySelector('.getBTN').addEventListener('click', itemsSort());

document.querySelector('.clearBTN').addEventListener('click', clearSection);
document.querySelector('.clearBTN').addEventListener('dblclick', clearLockalStorage);


document.querySelector('.dateSort').addEventListener('click', () => {
	if (toDoList != null) {
		if (toDoList.sortBy == "importance") {
			toDoList.order = "asc";
			toDoList.sortBy = "date";
		}
		else {
			toDoList.order = toDoList.order == "asc" ? "desc" : "asc";
		}
		console.log("dateSort  " + toDoList.sortBy + " " + toDoList.order)
		itemsSort();
		saveTODOList();
	}
});
document.querySelector('.importanceSort').addEventListener('click', () => {
	if (toDoList != null) {
		if (toDoList.sortBy == "date") {
			toDoList.order = "asc";
			toDoList.sortBy = "importance";
		}
		else {
			toDoList.order = toDoList.order == "asc" ? "desc" : "asc";
		}
		console.log("importanceSort  " + toDoList.sortBy + " " + toDoList.order)
		itemsSort();
		saveTODOList();
	}
});

function getToDoListFromStorage(){
	let temp = JSON.parse(localStorage.getItem("toDoList"));
	if(temp != null) return JSON.parse(localStorage.getItem("toDoList"))
	else document.querySelector('.toDoSection').innerHTML = "Відсутні збережені завдання";
}

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
				sortBy: "date",//"date", //importance
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
		itemsSort();
	}
	else {
		alert("Помилка: неможливо додати заплановану дію не ввівши її опис.\r\nВведіть будь ласка опис і натисніть кнопку Додати")
	}
}

function itemsSort() {
	if (toDoList != null) {
		//console.log(toDoList)
		let toDoListEl = toDoList.elements;		
		console.log(toDoListEl)
		if (toDoList.sortBy == "date") {
			let itemsKeys = Object.keys(toDoListEl);
			itemsKeys = itemsKeys.sort();
			if (toDoList.order == "desc") {
				itemsKeys = itemsKeys.reverse();
			}

			clearSection();
			itemsKeys.forEach(item => {
				let el = toDoListEl[String(item)];
				addElementsToSection(item, el);
			});
		}
		else if(toDoList.sortBy == "importance"){
			console.log("sort by imp");
			var sortable = [];
			for (let element in toDoListEl) {
				sortable.push([element, toDoListEl[element]["importance"]]);				
			}
			sortable.sort(function(a, b) {					
				return a[1] - b[1];
			});
			//console.log(sortable);
			/*var objSorted = {}
				sortable.forEach(function(item){
					objSorted[item[0]]=item[1]
				})*/
			//console.log(objSorted);
			if (toDoList.order == "desc"){
				sortable.reverse();
			}

			clearSection();
			for(let i=0; i < sortable.length; i++){
				//console.log(toDoListEl[sortable[i][0]]);
				let el = toDoListEl[sortable[i][0]];
				let date = new Date(Number(sortable[i][0]));
				addElementsToSection(sortable[i][0], el);
			}
		}
		
		document.querySelector('.changeText') != null ?
		document.querySelector('.changeText').addEventListener('click', changeElement) : "";
	}
	else {
		document.querySelector('.toDoSection').innerHTML = "Відсутні збережені завдання"
	}
}

//function addElementsToSection(item, date, el) {
function addElementsToSection(id, el) {
	let date = new Date(Number(id));
	document.querySelector('.toDoSection').innerHTML +=
		`<div class="toDoElement" id="${id}">` +
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
	itemsSort();
}

function saveTODOList(){
	localStorage.setItem(toDoList.name, JSON.stringify(toDoList));
}


function changeElement() {

}
