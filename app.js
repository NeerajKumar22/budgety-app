// BUDGET controller

var budgetController = (function () {

	var Expense = function (id, description, value) {
		this.id = id;
		this.description = description;
		this.value = value;
	};

	var Income = function (id, description, value) {
		this.id = id;
		this.description = description;
		this.value = value;
	};

	var calculateTotal = function (type) {
		var sum = 0;
		data.allItems[type].forEach(function (cur) {
			sum = sum + cur.value
		})
		data.totals[type] = sum;
	}

	var data = {
		allItems: {
			exp: [],
			inc: [],
		},
		totals: {
			exp: 0,
			inc: 0,
		},
		budget: 0,
		percentage: -1,
	};

	return {
		addItem: function (type, des, val) {
			var newItem, ID;

			// [1,2,3,4,5], next ID = 6
			// ID = last ID + 1;

			// Create new ID
			if (data.allItems[type].length > 0) {
				ID = data.allItems[type][data.allItems[type].length - 1].id + 1;
			} else {
				ID = 0;
			}

			// Create new item based on "inc" or "exp" type
			if (type === "exp") {
				newItem = new Expense(ID, des, val);
			} else if (type === "inc") {
				newItem = new Income(ID, des, val);
			}

			// Push it into our data structure.
			data.allItems[type].push(newItem);

			// Return the new element
			return newItem;
		},

		calculateBudget: function () {

			// Calculate total income and expenses

			calculateTotal("exp");
			calculateTotal("inc")

			// Calculate the budget: income - expense

			data.budget = data.totals.inc - data.totals.exp;

			// Calculate the percentage of income that we spent

			if (data.totals.inc > 0) {
				data.percentage = Math.round((data.totals.exp / data.totals.inc) * 100);
			} else {
				data.percentage = -1;
			}


			// Expense = 100 and income 300, spent 33.333% = 100/300 = 0.3333 * 100;
		},

		getBudget: function () {
			return {
				budget: data.budget,
				totalInc: data.totals.inc,
				totalExp: data.totals.exp,
				percentage: data.percentage,
			}
		},

		testing: function () {
			console.log(data)
		}
	}


})();


// UI controller
var UIController = (function () {

	var DOMstrings = {
		inputType: ".add_type",
		inputDescription: ".add_description",
		inputValue: ".add_value",
		inputBtn: ".add_btn",
		incomeContainer: ".income_list",
		expensesContainer: ".expenses_title"
	}

	return {
		getInput: function () {
			return {
				type: document.querySelector(DOMstrings.inputType).value, // Will be either inc or exp
				description: document.querySelector(DOMstrings.inputDescription).value,
				value: parseFloat(document.querySelector(DOMstrings.inputValue).value)
			}
		},

		addListItem: function (obj, type) {

			var html, newHtml, element;

			// Create HTML string with placeholder text

			if (type === "inc") {
				element = DOMstrings.incomeContainer;
				html = '<div class="item clearfix" id="income-%id%"><div class="item_description">%description%</div><div class="right clearfix"><div class="item_value">%value%</div><div class="item_delete"><button class="item_delete--btn"><i class="ion-ios-close-outline"></i></button></div></div></div>';
			} else if (type === "exp") {
				element = DOMstrings.expensesContainer;
				html = '<div class="item clearfix" id="expense-%id%"><div class="item_description">%description%</div><div class="right clearfix"><div class="item_value">%value%</div><div class="item_percentage">21%</div><div class="item_delete"><button class="item_delete--btn"><i class="ion-ios-close-outline"></i></button></div></div></div>';
			}

			// Replace the placeholder text with some actual data.
			newHtml = html.replace("%id%", obj.id);

			newHtml = newHtml.replace("%description%", obj.description);

			newHtml = newHtml.replace("%value%", obj.value);

			// Insert the HTML into the DOM

			document.querySelector(element).insertAdjacentHTML("beforeend", newHtml);

		},

		clearFields: function () {
			var fields, fieldsArr;

			fields = document.querySelectorAll(DOMstrings.inputDescription + ", " + DOMstrings.inputValue);
			fieldsArr = Array.prototype.slice.call(fields);

			fieldsArr.forEach(function (current, index, array) {
				current.value = "";
			});

			fieldsArr[0].focus();
		},

		displayBudget: function (obj) {

		},

		getDOMstrings: function () {
			return DOMstrings;
		}
	}

})();


// GLOBAL App controller
var controller = (function (budgetCtrl, UICtrl) {

	var setupEventListeners = function () {

		var DOM = UICtrl.getDOMstrings();

		document.querySelector(DOM.inputBtn).addEventListener("click", ctrlAddItem);

		document.addEventListener("keypress", function (event) {
			if (event.keyCode === 13 || event.which === 13) {
				ctrlAddItem();
			}
		})

	};

	var updateBudget = function () {

		// 1. Calculate the budget
		budgetCtrl.calculateBudget();

		// 2. Return the budget
		var budget = budgetCtrl.getBudget();

		// 3. Display  the budget on the UI
		console.log(budget);

	}

	var ctrlAddItem = function () {

		var input, newItem;

		// 1. Get the field input data

		input = UICtrl.getInput();

		if (input.description !== "" && !isNaN(input.value) && input.value > 0) {

			// 2. Add the item to the budget controller.

			newItem = budgetCtrl.addItem(input.type, input.description, input.value)

			// 3. Add the item to the UI

			UICtrl.addListItem(newItem, input.type);

			// 4. Clear the fields

			UICtrl.clearFields();

			// 5. Calculate and update budget
			updateBudget();
		}
	}

	return {
		init: function () {
			console.log("Application has started.")
			setupEventListeners();
		}
	}

})(budgetController, UIController);


controller.init();