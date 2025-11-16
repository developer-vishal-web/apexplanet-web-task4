// === DARK MODE TOGGLE ===
document.getElementById('themeBtn').onclick = function () {
  document.body.classList.toggle('dark-mode');
}

// === CONTACT FORM FEEDBACK ===
const contactForm = document.getElementById('contactForm');
contactForm.addEventListener('submit', function (e) {
  e.preventDefault();
  const name = contactForm.name.value.trim();
  const email = contactForm.email.value.trim();
  const message = contactForm.message.value.trim();
  const status = document.getElementById('formStatus');

  if (!name || !email || !message) {
    status.textContent = "Please fill in all fields!";
    status.style.color = "#e44";
    return;
  }

  // Simulate success (demo only)
  status.textContent = "Thanks, your message was sent (demo only)!";
  status.style.color = "#1a90ff";
  contactForm.reset();
  setTimeout(() => status.textContent = "", 2600);
});

// === TO-DO APP ===
const todoForm = document.getElementById('todoForm');
const todoInput = document.getElementById('todoInput');
const todoList = document.getElementById('todoList');
const todoCount = document.getElementById('todoCount');
const clearCompleted = document.getElementById('clearCompleted');
const clearAll = document.getElementById('clearAll');

let todos = JSON.parse(localStorage.getItem('vishu_todos') || '[]');

function renderTodos() {
  todoList.innerHTML = '';
  if (!todos.length) {
    todoList.innerHTML = '<li class="muted">No tasks yet. Add one!</li>';
    todoCount.textContent = "0 tasks";
    return;
  }
  todos.forEach((todo, idx) => {
    const li = document.createElement('li');
    li.className = todo.completed ? "completed" : "";

    // Text and edit
    const label = document.createElement('span');
    label.textContent = todo.text;
    label.onclick = () => editTodo(idx);

    // Checkbox
    const cb = document.createElement('input');
    cb.type = "checkbox";
    cb.checked = !!todo.completed;
    cb.style.marginRight = "12px";
    cb.onclick = () => toggleCompleted(idx);

    // Delete
    const delBtn = document.createElement('button');
    delBtn.textContent = "❌";
    delBtn.className = "small-btn";
    delBtn.onclick = () => deleteTodo(idx);

    li.append(cb, label, delBtn);
    todoList.appendChild(li);
  });
  todoCount.textContent = `${todos.length} task${todos.length !== 1 ? "s" : ""}`;
  localStorage.setItem('vishu_todos', JSON.stringify(todos));
}
function addTodo(e) {
  e.preventDefault();
  let val = todoInput.value.trim();
  if (!val) return;
  todos.push({ text: val, completed: false });
  todoInput.value = '';
  renderTodos();
}
function deleteTodo(idx) {
  todos.splice(idx, 1);
  renderTodos();
}
function toggleCompleted(idx) {
  todos[idx].completed = !todos[idx].completed;
  renderTodos();
}
function editTodo(idx) {
  let newText = prompt("Edit this task:", todos[idx].text);
  if (newText !== null && newText.trim()) {
    todos[idx].text = newText.trim();
    renderTodos();
  }
}
clearCompleted.onclick = () => {
  todos = todos.filter(todo => !todo.completed);
  renderTodos();
};
clearAll.onclick = () => {
  todos = [];
  renderTodos();
};
todoForm.addEventListener('submit', addTodo);
renderTodos();

// === PRODUCTS DEMO (List/Filter/Sort/Search/Reset) ===
const productsData = [
  { name: "Headphones", category: "Electronics", price: 41, rating: 4.8, image: "Images/headphones.jpg" },
  { name: "Notebook", category: "Stationery", price: 11, rating: 4.4, image: "Images/notebook.jpg" },
  { name: "Backpack", category: "Accessories", price: 34, rating: 4.5, image: "Images/backpack.jpg" },
  { name: "Mouse", category: "Electronics", price: 14, rating: 4.2, image: "Images/mouse.jpg" },
  { name: "Bottle", category: "Accessories", price: 18, rating: 4.7, image: "Images/bottle.jpg" }
];

const productsGrid = document.getElementById('productsGrid');
const filterCategory = document.getElementById('filterCategory');
const sortBy = document.getElementById('sortBy');
const searchProduct = document.getElementById('searchProduct');
const resetFilter = document.getElementById('resetFilter');

// Fill category filter (auto from data)
const categories = ["All categories"].concat(
  [...new Set(productsData.map(p => p.category))]
);
filterCategory.innerHTML = categories.map(cat =>
  `<option value="${cat}">${cat}</option>`
).join('');

// Render products as .product-card in grid
function renderProducts() {
  let products = [...productsData];
  // Filter by category
  let cat = filterCategory.value;
  if (cat && cat !== "All categories")
    products = products.filter(p => p.category === cat);

  // Search
  let search = searchProduct.value.trim().toLowerCase();
  if (search)
    products = products.filter(p =>
      p.name.toLowerCase().includes(search)
      || p.category.toLowerCase().includes(search)
    );

  // Sort
  switch (sortBy.value) {
    case "price-asc": products.sort((a, b) => a.price - b.price); break;
    case "price-desc": products.sort((a, b) => b.price - a.price); break;
    case "rating-desc": products.sort((a, b) => b.rating - a.rating); break;
    // default: skip
  }
  productsGrid.innerHTML = '';
  if (!products.length) {
    productsGrid.innerHTML = `<div class="product-card muted">No products found.</div>`;
    return;
  }
  products.forEach(p => {
  let card = document.createElement('div');
  card.className = "product-card";
  let imgSrc = p.image;
  card.innerHTML = `
    <img src="${imgSrc}" alt="${p.name}">
    <h3>${p.name}</h3>
    <p class="muted">${p.category}</p>
    <p>₹${p.price} &nbsp; | &nbsp; <span title="Rating">⭐ ${p.rating}</span></p>
  `;
  productsGrid.appendChild(card);
});


}

// Events
filterCategory.onchange = renderProducts;
sortBy.onchange = renderProducts;
searchProduct.oninput = renderProducts;
resetFilter.onclick = () => {
  filterCategory.value = "All categories";
  sortBy.value = "default";
  searchProduct.value = "";
  renderProducts();
};
renderProducts();
