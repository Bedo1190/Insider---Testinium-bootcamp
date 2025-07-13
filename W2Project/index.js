const form = document.getElementById("task-form");
const taskList = document.getElementById("task-list");
const errorMessage = document.getElementById("error-message");
const filterBtn = document.getElementById("filter-completed");
const sortBtn = document.getElementById("sort-priority");
const emptyMessage = document.getElementById("empty-message");

const addBtn = document.getElementById("add-task-btn");
const modal = document.getElementById("modal");
const closeModal = document.getElementById("close-modal");

let tasks = [];

// Show/hide modal
addBtn.addEventListener("click", () => modal.classList.remove("hidden"));
closeModal.addEventListener("click", () => modal.classList.add("hidden"));

// Task adding
form.addEventListener("submit", function (e) {
  e.preventDefault();
  try {
    const title = document.getElementById("title").value.trim();
    const description = document.getElementById("description").value.trim();
    const priority = document.querySelector("input[name='priority']:checked");

    if (!title) {
      errorMessage.textContent = "Title is required!";
      return;
    }

    if (!priority) {
      errorMessage.textContent = "Please select a priority";
      return;
    }

    const task = {
      id: Date.now(),
      title,
      description,
      priority: priority.value,
      completed: false,
    };

    tasks.push(task);
    renderTasks(tasks);
    form.reset();
    modal.classList.add("hidden");
    errorMessage.textContent = "";
  } catch (err) {
    console.error("Failure to add the task:", err);
    errorMessage.textContent = "An unexpected error occured!";
  }
});

// Delete/complete actions
taskList.addEventListener("click", function (e) {
  const toggleBtn = e.target.closest(".toggle");
  const deleteBtn = e.target.closest(".delete");

  if (toggleBtn || deleteBtn) {
    const taskEl = e.target.closest(".task");
    if (!taskEl) return;

    const taskId = parseInt(taskEl.dataset.id);

    if (deleteBtn) {
      tasks = tasks.filter((task) => task.id !== taskId);
    } else if (toggleBtn) {
      tasks = tasks.map((task) =>
        task.id === taskId ? { ...task, completed: !task.completed } : task
      );
    }

    renderTasks(tasks);
  }
});


// Filters
filterBtn.addEventListener("click", () => {
  const completedTasks = tasks.filter((t) => t.completed);
  renderTasks(completedTasks);
});

sortBtn.addEventListener("click", () => {
  const priorityOrder = { High: 1, Mid: 2, Low: 3 };
  const sorted = [...tasks].sort((a, b) => priorityOrder[a.priority] - priorityOrder[b.priority]);
  renderTasks(sorted);
});

// Render Function
function renderTasks(taskArray) {
  taskList.innerHTML = "";

  if (taskArray.length === 0) {
    emptyMessage.style.display = "block";
  } else {
    emptyMessage.style.display = "none";
  }

  taskArray.forEach((task) => {
    const li = document.createElement("li");
    li.className = "task" + (task.completed ? " completed" : "");
    li.dataset.id = task.id;

    li.innerHTML = `
      <strong>${task.title}</strong>
      <p>${task.description || ""}</p>
      <p>Priority: ${task.priority}</p>
      <div class="actions">
        <button class="toggle"><i class="fas fa-check"></i></button>
        <button class="delete"><i class="fas fa-trash-alt"></i></button>
      </div>
    `;

    taskList.appendChild(li);
  });
}
const sortDateBtn = document.getElementById("sort-date");

let dateSortAsc = true; 

sortDateBtn.addEventListener("click", () => {
  const sorted = [...tasks].sort((a, b) => {
    return dateSortAsc ? a.id - b.id : b.id - a.id;
  });
  dateSortAsc = !dateSortAsc;
  renderTasks(sorted);
});

renderTasks(tasks);
