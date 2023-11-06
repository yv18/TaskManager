document.addEventListener("DOMContentLoaded", () => {
  const taskList = document.getElementById("task-list");
  const searchInput = document.getElementById("search");
  const addTaskButton = document.getElementById("add-task");
  const taskHeadingInput = document.getElementById("task-heading");
  const taskDescriptionInput = document.getElementById("task-description");
  const assigneeInput = document.getElementById("assignee");
  const startdateInput = document.getElementById("startdate");
  const dueDateInput = document.getElementById("due-date");

  addTaskButton.addEventListener("click", addTask);
  searchInput.addEventListener("input", filterTasks);

  loadTasksFromLocalStorage();

  function addTask() {
    const heading = taskHeadingInput.value;
    const description = taskDescriptionInput.value;
    const assignee = assigneeInput.value;
    const startdate = startdateInput.value;
    const dueDate = dueDateInput.value;

    if (
      heading.trim() === "" ||
      description.trim() === "" ||
      assignee.trim() === "" ||
      startdate.trim() === "" ||
      dueDate.trim() === ""
    ) {
      alert("Please fill in all task details.");
      return;
    }

    const task = {
      heading,
      description,
      assignee,
      startdate,
      dueDate,
    };

    const tasks = getTasksFromLocalStorage();
    tasks.push(task);
    saveTasksToLocalStorage(tasks);

    taskHeadingInput.value = "";
    taskDescriptionInput.value = "";
    assigneeInput.value = "";
    startdateInput.value = "";
    dueDateInput.value = "";

    loadTasksFromLocalStorage();
  }

  function getTasksFromLocalStorage() {
    const tasksJSON = localStorage.getItem("tasks");
    return JSON.parse(tasksJSON) || [];
  }

  function loadTasksFromLocalStorage() {
    const tasks = getTasksFromLocalStorage();
    taskList.innerHTML = "";

    tasks.forEach((task, index) => {
      const taskElement = document.createElement("div");
      taskElement.classList.add("task");
      taskElement.innerHTML = `
                <h3>Task Heading: ${task.heading}</h3>
                <p class="task-description">Task Description: ${task.description}</p>
                <p>Assignee: ${task.assignee}</p>
                <p>Start Date: ${task.startdate}</p>
                <p>Due Date: ${task.dueDate}</p>
                <button id="editmain" onclick="editTask(${index})">Edit</button>
                <button id="deletemain" onclick="deleteTask(${index})">Delete</button>
            `;
      taskList.appendChild(taskElement);
    });
  }

  window.deleteTask = function (index) {
    const tasks = getTasksFromLocalStorage();
    tasks.splice(index, 1);
    saveTasksToLocalStorage(tasks);
    loadTasksFromLocalStorage();
  };

  window.editTask = function (index) {
    const tasks = getTasksFromLocalStorage();
    const task = tasks[index];

    const editForm = document.createElement("div");
    editForm.innerHTML = `
        <div class="edit">
            <h3>Edit Task</h3>
            <label for="edit-heading">Task Heading:</label>
            <input type="text" id="edit-heading" value="${task.heading}">
            <label for="edit-description">Task Description:</label>
            <input type="text" id="edit-description" value="${task.description}">
            <label for="edit-assignee">Assignee:</label>
            <input type="text" id="edit-assignee" value="${task.assignee}">
            <label for="edit-startdate">Start Date:</label>
            <input type="date" id="edit-startdate" value="${task.startdate}">
            <label for="edit-dueDate">Due Date:</label>
            <input type="date" id="edit-dueDate" value="${task.dueDate}">
            <button onclick="saveEdit(${index})">Save</button>
            <button onclick="Cancel(${index})">Cancel</button>
        </div>
        `;

    taskList.replaceChild(editForm, taskList.children[index]);
  };

  window.Cancel = function (index) {
    loadTasksFromLocalStorage();
  };

  window.saveEdit = function (index) {
    const tasks = getTasksFromLocalStorage();
    const editForm = taskList.children[index];
    const updatedHeading = editForm.querySelector("#edit-heading").value;
    const updatedDescription =
      editForm.querySelector("#edit-description").value;
    const updatedAssignee = editForm.querySelector("#edit-assignee").value;
    const updatedStartdate = editForm.querySelector("#edit-startdate").value;
    const updatedDueDate = editForm.querySelector("#edit-dueDate").value;

    tasks[index].heading = updatedHeading;
    tasks[index].description = updatedDescription;
    tasks[index].assignee = updatedAssignee;
    tasks[index].startdate = updatedStartdate;
    tasks[index].dueDate = updatedDueDate;

    saveTasksToLocalStorage(tasks);
    loadTasksFromLocalStorage();
  };

  function saveTasksToLocalStorage(tasks) {
    const tasksJSON = JSON.stringify(tasks);
    localStorage.setItem("tasks", tasksJSON);
  }

  function filterTasks() {
    const searchText = searchInput.value.toLowerCase();
    const tasks = getTasksFromLocalStorage();
    const filteredTasks = tasks.filter((task) =>
      task.heading.toLowerCase().includes(searchText)
    );

    taskList.innerHTML = "";

    filteredTasks.forEach((task, index) => {
      const taskElement = document.createElement("div");
      taskElement.classList.add("task");
      taskElement.innerHTML = `
                <h3>Task Heading: ${task.heading}</h3>
                <p class="task-description">Task Description: ${task.description}</p>
                <p>Assignee: ${task.assignee}</p>
                <p>Start Date: ${task.startdate}</p>
                <p>Due Date: ${task.dueDate}</p>
                <button id="editmain" onclick="editTask(${index})">Edit</button>
                <button id="deletemain" onclick="deleteTask(${index})">Delete</button>
            `;
      taskList.appendChild(taskElement);
    });
  }
});
