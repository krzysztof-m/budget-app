/* Budget App */

//Module that control Budget Data
var BudgetController = (function () {
  
    var Income = function(id, description, value) {
        this.id = id;
        this.description = description;
        this.value = value;
    }
    
    var Expense = function(id, description, value) {
        this.id = id;
        this.description = description;
        this.value = value;
    }
    
    // Basic data structure
    var data = {
        allItems: {
            inc: [],
            exp: []
        },
        totals: {
            inc: 0,
            exp: 0
        },
        budget: 0
    }
    
    var calculateTotal = function (type) {
        var total = 0;
        
        data.allItems[type].forEach(function (item) {
            total += item.value;
        });
        
        data.totals[type] = total;
    }
    
    return {
        addItem: function (type, desc, val) {
            var newItem, ID, lastItem;
            
            itemsArrLength = data.allItems[type].length;
            if (itemsArrLength > 0) {
                lastItem = data.allItems[type][itemsArrLength - 1];
                //Get last element id and add 1
                ID = lastItem.id + 1;
            } else {
                ID = 0;
            }
            
            
            
            if (type === 'inc') {
                newItem = new Income(ID, desc, val);
            } else if (type === 'exp') {
                newItem = new Expense(ID, desc, val);
            }
            
            data.allItems[type].push(newItem);
            
            return newItem;
        },
        removeItem: function (type, id) {
          
          data.allItems[type].forEach(function (item, index) {
            if (id === item.id) {
              data.allItems[type].splice(index, 1);
            }
          });
          
          
        },
        getBudget: function () {
            return {
                budget: data.budget,
                incomes: data.totals.inc,
                expenses: data.totals.exp
            };
        },
        calculateBudget: function () {
            calculateTotal('inc');
            calculateTotal('exp');
            
            data.budget = data.totals.inc - data.totals.exp;
        },
      getData: function () {
        return data;
      }
    }
    
    
})();




//Module that control User Interface
var UIController = (function () {
  
  
  
  var DOMStrings = {
    addForm: '.add-form',
    selectType: '.add-form__select',
    inputDescription: '.add-form__input--text',
    inputValue: '.add-form__input--number',
    addBtn: '.add-form__button',
    incomesList: '.budget-list--incomes',
    expensesList: '.budget-list--expenses',
    listsContainer: '.budget-lists',
    budgetLabel: '.total',
    incomeLabel: '.inc',
    expenseLabel: '.exp'
  }
  
  
  // dodać DOMElements
  
  
  return {
    getDOMStrings: function() {
      return DOMStrings;
    },
    getInput: function () {
      return {
        type: document.querySelector(DOMStrings.selectType).value,
        description: document.querySelector(DOMStrings.inputDescription).value,
        value: parseFloat(document.querySelector(DOMStrings.inputValue).value)
      }
    },
    clearInput: function () {
        document.querySelector(DOMStrings.inputDescription).value = '';
        value: document.querySelector(DOMStrings.inputValue).value = '';
    },
    addItem: function (obj, type) {
      
      var itemHTML = '<li class="budget-list__item" data-id="' + obj.id +'" data-type="' + type + '">' + obj.description + ' <span class="value">' + obj.value +'$</span><button class="btn btn--close"><span class="icon ion-close-round"></span></button></li>';
      //console.log(itemHTML);
      if (type === 'inc') {
        document.querySelector(DOMStrings.incomesList).insertAdjacentHTML('beforeend', itemHTML);
      } else if (type === 'exp') {
        document.querySelector(DOMStrings.expensesList).insertAdjacentHTML('beforeend', itemHTML);
      }
      
    },
      updateBudget: function (budget, inc, exp) {
          document.querySelector(DOMStrings.budgetLabel).textContent = budget;
          document.querySelector(DOMStrings.incomeLabel).textContent = inc;
          document.querySelector(DOMStrings.expenseLabel).textContent = exp;
      }
  }
  
  
})();




//Module that control data flow beetwen other modules
var Controller = (function (bgtCtrl, uiCtrl) {
  
  var setupEventListeners = function() {
    var DOM = uiCtrl.getDOMStrings();
    
    // 1. Add event when user adds new item
    document.querySelector(DOM.addForm).addEventListener('submit', function (e) {
      e.preventDefault();
      // 2. Get input data
      var userInput = uiCtrl.getInput();
        
        if (userInput.description !== '' && userInput.value > 0) {
            // 4. Add item to data structure
            var newItem = bgtCtrl.addItem(userInput.type, userInput.description, userInput.value);
            console.log(newItem);
          // 3. Add item to UI
            uiCtrl.addItem(newItem, userInput.type);
            uiCtrl.clearInput();
            
            
            
        }
        
        updateBudget();
        
      
      
    });
    
    document.querySelector(DOM.listsContainer).addEventListener('click', function (e) {

      var removeBtn;
      
      removeBtn = e.target.parentElement;//muszę uważać bo raz się klika ikona, raz button, trzeba przerobić HTML
      
      listItem = removeBtn.parentElement;
      
      bgtCtrl.removeItem(listItem.dataset.type, parseInt(listItem.dataset.id));
      
      // !!!!!! usuwanie przenieść do widoku!
      removeBtn.parentElement.parentElement.removeChild(listItem);
      
      //console.log(bgtCtrl.getData());
      
      
      updateBudget();
      
    });
  };
  
  
  var updateBudget = function () {
    // 5. Calculate budget
            bgtCtrl.calculateBudget();
  
            var budget = bgtCtrl.getBudget();
  
            // 6. Update UI
            uiCtrl.updateBudget(budget.budget, budget.incomes, budget.expenses);
  }
  
  
  return {
    init: function () {
      setupEventListeners();
        uiCtrl.updateBudget(bgtCtrl.getBudget().budget, bgtCtrl.getBudget().incomes, bgtCtrl.getBudget().expenses);
    }
  }
  
  
})(BudgetController, UIController);


Controller.init();
