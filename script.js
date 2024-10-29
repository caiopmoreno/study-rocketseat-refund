// elementos do forms
const form = document.querySelector("form");
const amount = document.getElementById("amount");
const expense = document.getElementById("expense");
const category = document.getElementById("category");

// elementos da lista
const expenseList = document.querySelector("ul");
const expenseQuantity = document.querySelector("aside header p span");
const expenseTotal = document.querySelector("aside header h2");

amount.oninput = () => {
  let value = amount.value.replace(/\D/g, "");
  value = Number(value) / 100;
  amount.value = formatCurrencyBRL(value);
}

function formatCurrencyBRL(value){
  value = value.toLocaleString("pt-BR", {
    style: "currency",
    currency: "BRL",
  });
  return value;
}

form.onsubmit = (event) => {
  event.preventDefault();

  const newExpense = {
    id: new Date().getTime(),
    expense: expense.value,
    category_id: category.value,
    category_name: category.options[category.selectedIndex].text,
    amount: amount.value,
    created_at: new Date(),
  }
  expenseAdd(newExpense);

  function expenseAdd(newExpense) {
    try{
      const expenseItem = document.createElement("li") ; //cria uma nova li
      expenseItem.classList.add("expense"); //adiciona a classe nessa li

      const expenseIcon = document.createElement("img"); //cria uma nova img
      expenseIcon.setAttribute("src", `img/${newExpense.category_id}.svg`); //add a src
      expenseIcon.setAttribute("alt", newExpense.category_name); //add o alt

      const expenseInfo = document.createElement("div");
      expenseInfo.classList.add("expense-info");

      const expenseName = document.createElement("strong");
      expenseName.textContent = newExpense.expense;

      const expenseCategory = document.createElement("span");
      expenseCategory.textContent = newExpense.category_name;

      expenseInfo.append(expenseName, expenseCategory);


      // span do amount
      const expenseAmount = document.createElement("span");
      expenseAmount.classList.add("expense-amount");
      expenseAmount.innerHTML = `<small>R$</small>${newExpense.amount.toUpperCase().replace("R$", "")}`;

      // icone de remover
      const removeIcon = document.createElement("img");
      removeIcon.classList.add("remove-icon");
      removeIcon.setAttribute("src", "img/remove.svg");
      removeIcon.setAttribute("alt", "remove");

      // add elementos no li
      expenseItem.append(expenseIcon, expenseInfo, expenseAmount, removeIcon);
      expenseList.append(expenseItem); // add li no ul
    } catch (error) {
      alert("Não foi possível atualizar a lista de despesas.");
      console.log(error);
    }
  }

  // atualiza os totais
  updateTotals();
  formClear()
}

// atualizar os totais
function updateTotals(){
  try{
    // recupera todos os itens da ul
    const items = expenseList.children;

    // atualiza a quantidade de itens da lista
    expenseQuantity.textContent = `${items.length} ${items.length > 1 ? "despesas" : "despesa"}`;

    // incrementando o total
    let total = 0;

    for(let item = 0; item < items.length; item++){
      const itemAmount = items[item].querySelector(".expense-amount");
      let value = itemAmount.textContent.replace(/[^\d,]/g, "").replace(",", ".");

      value = parseFloat(value); // ocnverte o valor para float

      // verifica se é um número válido
      if(isNaN(value)) {
        return alert("Não foi possível calcular o total. O valor não é um número.")
      }

      total += Number(value);
    }

    // formata o R$ do total
    const symbolBRL = document.createElement("small");
    symbolBRL.textContent = "R$";
    total = formatCurrencyBRL(total).toUpperCase().replace("R$", "");

    expenseTotal.innerHTML = "";
    expenseTotal.append(symbolBRL, total);

  } catch (error){
    console.log(Error);
    alert("Não foi possível atualizar os totais");
  }
}

// evento que captura clique nos itens da lista
expenseList.addEventListener("click", function (event) {

  // verificar se o item cliclado é o ícone de remover
  if(event.target.classList.contains("remove-icon")){

    // obtem a li pai do elemento clicado
    const item = event.target.closest(".expense");
    item.remove(); // remove o item da li
  }

  updateTotals(); // atualiza os totais
})

function formClear(){
  expense.value = "";
  category.value = "";
  amount.value = "";

  expense.focus();
}