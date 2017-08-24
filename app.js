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
    
    var findItem = function (type, id) {
        var foundItem;
        data.allItems[type].forEach(function (item, index) {
          if (id === item.id) {
            foundItem = item;
          }
        });
        
        return foundItem;
      };
    
    
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
      findItem: function (type, id) {
        return findItem(type, id);
      },
      editItem: function (type, id, description, value) {
        // find item & change its content if nessesery
        var foundItem = findItem(type, id);
        
        
        if (description !== foundItem.description) {
          foundItem.description = description;
        }
        if (value !== foundItem.value) {
          foundItem.value = value;
        }
        
        return foundItem;
        
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
    expenseLabel: '.exp',
    editDescription: '.edit-form__input--text',
    editValue: '.edit-form__input--number'
  }
  
  
  // dodać DOMElements
  var DOMElements = {
    addForm: document.querySelector(DOMStrings.addForm),
    selectType: document.querySelector(DOMStrings.selectType),
    inputDescription: document.querySelector(DOMStrings.inputDescription),
    inputValue: document.querySelector(DOMStrings.inputValue),
    addBtn: document.querySelector(DOMStrings.addBtn),
    incomesList: document.querySelector(DOMStrings.incomesList),
    expensesList: document.querySelector(DOMStrings.expensesList),
    listsContainer: document.querySelector(DOMStrings.listsContainer),
    budgetLabel: document.querySelector(DOMStrings.budgetLabel),
    incomeLabel: document.querySelector(DOMStrings.incomeLabel),
    expenseLabel: document.querySelector(DOMStrings.expenseLabel)
  }
  
  return {
    getDOMElements: function() {
      return DOMElements;
    },
    getInput: function () {
      return {
        type: DOMElements.selectType.value,
        description: DOMElements.inputDescription.value,
        value: parseFloat(DOMElements.inputValue.value)
      }
    },
    clearInput: function () {
        DOMElements.inputDescription.value = '';
        DOMElements.inputValue.value = '';
    },
    addItem: function (obj, type) {
      
      var itemHTML = '<li class="budget-list__item" data-id="' + obj.id +'" data-type="' + type + '">' + obj.description + ' <span class="value">' + obj.value +'$</span><button class="btn btn--item"><span class="icon ion-edit"></span></button><button class="btn btn--item"><span class="icon ion-close-round"></span></button></li>';
      //console.log(itemHTML);
      
      if (type === 'inc') {
        DOMElements.incomesList.insertAdjacentHTML('beforeend', itemHTML);
      } else if (type === 'exp') {
        DOMElements.expensesList.insertAdjacentHTML('beforeend', itemHTML);
      }
      
    },
    removeItem: function (item, parent) {
      parent.removeChild(item);
    },
    updateBudget: function (budget, inc, exp) {
        DOMElements.budgetLabel.textContent = budget;
        DOMElements.incomeLabel.textContent = inc;
        DOMElements.expenseLabel.textContent = exp;
    },
    editItem: function (item, element) {
      var editForm = '<input class="edit-form__input edit-form__input--text" type="text" value="' + item.description +'"/><input class="edit-form__input edit-form__input--number" type="number" value="' + item.value +'" /><button class="btn btn--save">Save</button>';
      
      element.innerHTML = editForm;
    },
    saveItem: function (item, element) {
      var savedItem = item.description + '<span class="value">' + item.value + '$</span><button class="btn btn--item"><span class="icon ion-edit"></span></button><button class="btn btn--item"><span class="icon ion-close-round"></span></button>';
      
      element.innerHTML = savedItem;
          
    },
    getItemInput: function (itemElement) {
      return {
        description: document.querySelector(DOMStrings.editDescription).value,
        value: parseFloat(document.querySelector(DOMStrings.editValue).value)
      }
    },
    changeFormType: function () {
      var type = DOMElements.selectType.value;
      
      if (type === 'inc') {
        DOMElements.inputDescription.placeholder = 'Add income';
        DOMElements.addForm.classList.remove('add-form--exp');
        DOMElements.addForm.classList.add('add-form--inc');
      } else if (type === 'exp') {
        DOMElements.inputDescription.placeholder = 'Add expense';
        DOMElements.addForm.classList.remove('add-form--inc');
        DOMElements.addForm.classList.add('add-form--exp');
      }
    }
  }
  
  
})();




//Module that control data flow beetwen other modules
var Controller = (function (bgtCtrl, uiCtrl) {
  
  var setupEventListeners = function() {
    var DOM = uiCtrl.getDOMElements();
    
    // 1. Add event when user adds new item
    DOM.addForm.addEventListener('submit', function (e) {
      ctrlAddItem(e);
    });
    
    DOM.selectType.addEventListener('change', function (e) {
      uiCtrl.changeFormType();
      
    });
    
    // Listeners on lists container
    DOM.listsContainer.addEventListener('click', function (e) {
      
      var elClassName = e.target.className;
      // jakiś lepszy sposób trzeba na to znaleźć
      if (elClassName.indexOf('ion-close') > -1) {
        ctrlRemoveItem(e);
      } else if (elClassName.indexOf('ion-edit') > -1) {
        ctrlEditItem(e);
      } else if (elClassName.indexOf('save') > -1) {
        ctrlSaveItem(e);
      }
      
    });
  };
  
  
  var updateBudget = function () {
    // 5. Calculate budget
    bgtCtrl.calculateBudget();

    var budget = bgtCtrl.getBudget();

    // 6. Update UI
    uiCtrl.updateBudget(budget.budget, budget.incomes, budget.expenses);
  }
  
  var ctrlAddItem = function (e) {
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
  }
  
  
  var ctrlRemoveItem = function (e) {
    var removeBtn;
      
      removeBtn = e.target.parentElement;//muszę uważać bo raz się klika ikona, raz button, trzeba przerobić HTML
      
      listItem = removeBtn.parentElement;
      
      bgtCtrl.removeItem(listItem.dataset.type, parseInt(listItem.dataset.id));
      
      uiCtrl.removeItem(listItem, listItem.parentElement);
      
      updateBudget();
  }
  
  
  var ctrlEditItem = function (e) {
    
    var listItem = e.target.parentElement.parentElement;
    var listItemIndex = parseInt(listItem.dataset.id);
    var listItemType = listItem.dataset.type;
    
    // 1. Find item in data structure (budget)
    var editItem = bgtCtrl.findItem(listItemType, listItemIndex);
    
    // 2. Turn on edit mode (ui)
    uiCtrl.editItem(editItem, e.target.parentElement.parentElement);
    
  }
  
  var ctrlSaveItem = function (e) {
    var listItem = e.target.parentElement;
    var listItemIndex = parseInt(listItem.dataset.id);
    var listItemType = listItem.dataset.type;
    
    
    // 1. Get input data
    var editInput = uiCtrl.getItemInput();
    // 3. Update budget
    
    var savedItem = bgtCtrl.editItem(listItemType, listItemIndex, editInput.description, editInput.value);
    
    // 2. Update item UI
    uiCtrl.saveItem(savedItem, listItem);
    // 4. Calculate Budget
    // 5. Update UI
    updateBudget();
  }
  
  
  return {
    init: function () {
      setupEventListeners();
        uiCtrl.updateBudget(bgtCtrl.getBudget().budget, bgtCtrl.getBudget().incomes, bgtCtrl.getBudget().expenses);
    }
  }
  
  
})(BudgetController, UIController);


Controller.init();
