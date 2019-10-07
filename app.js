// BUDGET controller

var budgetController = (function () {
	// some code

})();


// UI controller
var UIController = (function () {

	var DOMstrings = {
		inputType: ".add_type",
		inputDescription: ".add_description",
		inputValue: ".add_value",
		inputBtn: ".add_btn",
	}

	return {
		getInput: function () {
			return {
				type: document.querySelector(DOMstrings.inputType).value, // Will be either inc or exp
				description: document.querySelector(DOMstrings.inputDescription).value,
				value: document.querySelector(DOMstrings.inputValue).value
			}
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

	var ctrlAddItem = function () {

		// 1. Get the field input data

		var input = UICtrl.getInput();

		// 2. Add the item to the budget controller.

		// 3. Add the item to the UI

		// 4. Calculate the budget

		// 5. Display  the budget on the UI

	}

	return {
		init: function () {
			console.log("Application has started.")
			setupEventListeners();
		}
	}

})(budgetController, UIController);


controller.init();