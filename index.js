// Para armazenar as transações será  criada variável no escopo global.

let transactions = [];

// Funções auxiliares para criação dos elementos do DOM

function createTransactionContainer(id) {
  const container = document.createElement("div");
  container.classList.add("transaction");
  container.id = `transaction-${id}`;
  return container;
}

function createTransactionTitle(name) {
  const title = document.createElement("span");
  title.classList.add("transaction-title");
  title.textContent = name;
  return title;
}

// Esta função é a que cria um elemento para o valor da transação. Utilizando a API de internacionalização do navegador para formatar valores numéricos em moedas através do Intl.NumberFormat(). Essa função tambérm irá criar um span para o valor da transação e formatá-lo para a moeda brasileira (BRL)

function createTransactionAmount(amount) {
  const span = document.createElement("span");
  span.classList.add("transaction-amount");
  const formater = Intl.NumberFormat("pt-BR", {
    compactDisplay: "long",
    currency: "BRL",
    style: "currency",
  });
  const formatedAmount = formater.format(amount);
  if (amount > 0) {
    span.textContent = `${formatedAmount} C`;
    span.classList.add("credit");
  } else {
    span.textContent = `${formatedAmount} D`;
    span.classList.add("debit");
  }
  return span;
}

// Para realizar a edição de uma transação vamos ter um botão na lista de transações que carregará os dados dela para o formulário onde poderão ser editadas e enviadas. Vamos criar uma função para criar o elemento do botão e então renderizar um botão para cada transação na tela:

function createEditTransactionBtn(transaction) {
  const editBtn = document.createElement("button");
  editBtn.classList.add("edit-btn");
  editBtn.textContent = "Editar";
  editBtn.addEventListener("click", () => {
    document.querySelector("#id").value = transaction.id;
    document.querySelector("#name").value = transaction.name;
    document.querySelector("#amount").value = transaction.amount;
  });
  return editBtn;
}

//  Exclusão das transações - Criando um botão na tela para cada transação que ficará responsável pela exclusão da mesma. Depois de criado só precisamos renderizá-lo junto com as transações.

function createDeleteTransactionButton(id) {
  const deleteBtn = document.createElement("button");
  deleteBtn.classList.add("delete-btn");
  deleteBtn.textContent = "Excluir";
  deleteBtn.addEventListener("click", async () => {
    await fetch(`http://localhost:3000/transactions/${id}`, {
      method: "DELETE",
    });
    deleteBtn.parentElement.remove();
    const indexToRemove = transactions.findIndex((t) => t.id === id);
    transactions.splice(indexToRemove, 1);
    updateBalance();
  });
  return deleteBtn;
}

// Função que renderiza uma transação na tela.

function renderTransaction(transaction) {
  const container = createTransactionContainer(transaction.id);
  const title = createTransactionTitle(transaction.name);
  const amount = createTransactionAmount(transaction.amount);
  const editBtn = createEditTransactionBtn(transaction);
  const deleteBtn = createDeleteTransactionButton(transaction.id);

  document.querySelector("#transactions").append(container);
  container.append(title, amount, editBtn, deleteBtn);
}

// Função específica para fazer a requisição GET que obtém todas as transações do backend.

async function fetchTransactions() {
  return await fetch("http://localhost:3000/transactions").then((res) =>
    res.json()
  );
}

// Função para exibir na tela (no elemento específico) o saldo total calculado com base nos valores de transações nesse array.

function updateBalance() {
  const balanceSpan = document.querySelector("#balance");
  const balance = transactions.reduce(
    (sum, transaction) => sum + transaction.amount,
    0
  );
  const formater = Intl.NumberFormat("pt-BR", {
    compactDisplay: "long",
    currency: "BRL",
    style: "currency",
  });
  balanceSpan.textContent = formater.format(balance);
}

//  Função setup() será responsável por cuidar do carregamento inicial da página, obtendo as transações, renderizando-as na tela e exibindo o saldo.

async function setup() {
  const results = await fetchTransactions();
  transactions.push(...results);
  transactions.forEach(renderTransaction);
  updateBalance();
}

document.addEventListener("DOMContentLoaded", setup);

// Criação de uma nova transação ... Função, que ficará responsável por obter os valores do formulário, fazer a requisição POST e renderizar a transação devolvida na resposta.

//  Ao fim da função também limpamos o formulário e atualizamos o saldo.
// Precisamos criar um event listener para o form.

async function saveTransaction(ev) {
  ev.preventDefault();

  const id = document.querySelector("#id").value;
  const name = document.querySelector("#name").value;
  const amount = parseFloat(document.querySelector("#amount").value);

  //  Atualizando a função saveTransaction() para que faça uma requisição PUT se o input id estiver presente.
  if (id) {
    // Editar a transação com o id
    const response = await fetch(`http://localhost:3000/transactions/${id}`, {
      method: "PUT",
      body: JSON.stringify({ name, amount }),
      headers: {
        "Content-Type": "application/json",
      },
    });
    const transaction = await response.json();
    const indexToRemove = transactions.findIndex((t) => t.id === id);
    transactions.splice(indexToRemove, 1, transaction);
    document.querySelector(`#transaction-${id}`).remove();
    renderTransaction(transaction);
  } else {
    // criar nova transação
    const response = await fetch("http://localhost:3000/transactions", {
      method: "POST",
      body: JSON.stringify({ name, amount }),
      headers: {
        "Content-Type": "application/json",
      },
    });

    const transaction = await response.json();
    transactions.push(transaction);
    renderTransaction(transaction);
  }

  ev.target.reset();
  updateBalance();
}

document.addEventListener("DOMContentLoaded", setup);
document.querySelector("form").addEventListener("submit", saveTransaction);
