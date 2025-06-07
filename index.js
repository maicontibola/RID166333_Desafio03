function tasksExample() {
  const tasks = getTasksFromLocalStorage();

  if (!tasks.length) {
    const updatedTasks = [
      ...tasks,
      {
        id: 1,
        nameTask: "Implementar tela de listagem de tarefas",
        etiquetaTask: "frontend",
        data: "21/08/2024",
        checked: false,
      },
      ...tasks,
      {
        id: 2,
        nameTask: "Criar endpoint para cadastro de tarefas",
        etiquetaTask: "backend",
        data: "21/08/2024",
        checked: false,
      },
    ];
    setTasksInLocalStorage(updatedTasks);
  }
}
const getTasksFromLocalStorage = () => {
  const localTasks = JSON.parse(window.localStorage.getItem("tasks"));
  return localTasks ? localTasks : [];
};

const setTasksInLocalStorage = (tasks) => {
  window.localStorage.setItem("tasks", JSON.stringify(tasks));
};

const dataAtual = () => {
  const hoje = new Date();
  const dia = hoje.getDate().toString().padStart(2, "0");
  const mes = (hoje.getMonth() + 1).toString().padStart(2, "0");
  const ano = hoje.getFullYear();

  const dataFormatada = `${dia}/${mes}/${ano}`;

  return dataFormatada;
};

const updateStatus = (taskId) => {
  const tasks = getTasksFromLocalStorage();

  const updatedTasks = tasks.map((task) => {
    if (parseInt(task.id) === parseInt(taskId)) {
      const status = !task.checked;

      const list = document.getElementById(taskId);
      const title = list.getElementsByTagName("h2")[0];
      const btnConcluded = list.getElementsByTagName("button")[0];
      const imgChecked = list.getElementsByTagName("img")[0];

      if (status) {
        title.style.textDecoration = "line-through";
        imgChecked.removeAttribute("hidden");
        btnConcluded.setAttribute("hidden", true);
      } else {
        title.style.textDecoration = "none";
        imgChecked.setAttribute("hidden", true);
        btnConcluded.removeAttribute("hidden");
      }

      return { ...task, checked: status };
    }
    return task;
  });

  setTasksInLocalStorage(updatedTasks);
  taskCount();
};

const taskCount = () => {
  const tasks = getTasksFromLocalStorage();
  const qtd = document.getElementById("concluded-tasks");

  const tasksChecked = tasks.filter(({ checked }) => checked);

  qtd.textContent =
    tasksChecked.length > 1
      ? `${tasksChecked.length} tarefas concluídas`
      : tasksChecked.length == 1
      ? `${tasksChecked.length} tarefa concluída`
      : `${tasksChecked.length} tarefas concluídas`;
};

const getNewTaskData = (event) => {
  const tasks = getTasksFromLocalStorage();

  const lastId = tasks[tasks.length - 1]?.id;

  const id = lastId ? lastId + 1 : 1;
  const nameTask = event.target.elements.nameTask.value;
  const etiquetaTask = event.target.elements.etiquetaTask.value;
  const data = dataAtual();

  return { id, nameTask, etiquetaTask, data };
};

const createTask = (event) => {
  event.preventDefault();

  const tasks = getTasksFromLocalStorage();
  const newTaskData = getNewTaskData(event);

  createTaskListItem(newTaskData);
  const updatedTasks = [
    ...tasks,
    {
      id: newTaskData.id,
      nameTask: newTaskData.nameTask,
      etiquetaTask: newTaskData.etiquetaTask,
      data: newTaskData.data,
      checked: false,
    },
  ];
  setTasksInLocalStorage(updatedTasks);

  document.getElementById("nameTask").value = "";
  document.getElementById("etiquetaTask").value = "";

  taskCount();
};

const createTaskListItem = (task) => {
  const list = document.getElementById("todo-list");
  const toDo = document.createElement("li");

  if (task.nameTask.length >= 1 && task.etiquetaTask.length >= 1) {
    const textName = document.createElement("h2");
    const textEtiqueta = document.createElement("span");
    const textData = document.createElement("p");
    const textContainer = document.createElement("div");
    const containerEtiqueta = document.createElement("div");
    const concludedBtn = document.createElement("button");
    const checkImg = document.createElement("img");

    checkImg.className = "checked";
    checkImg.src = "./imgs/checked.png";
    checkImg.setAttribute("hidden", true);
    checkImg.onclick = () => updateStatus(task.id);

    toDo.id = task.id;
    concludedBtn.id = task.id;
    concludedBtn.ariaLabel = "Concluir Tarefa";
    concludedBtn.textContent = "Concluir";
    concludedBtn.className = "btnConcluir";

    concludedBtn.onclick = () => updateStatus(task.id);

    textName.textContent = task.nameTask;

    textEtiqueta.textContent = task.etiquetaTask;
    textData.textContent = `Criado em ${task.data}`;

    containerEtiqueta.id = "containerEtiqueta";
    containerEtiqueta.appendChild(textEtiqueta);
    containerEtiqueta.appendChild(textData);

    textContainer.id = "container";
    textContainer.appendChild(textName);
    textContainer.appendChild(containerEtiqueta);

    toDo.appendChild(textContainer);
    toDo.appendChild(concludedBtn);
    toDo.appendChild(checkImg);

    if (task.checked) {
      textName.style.textDecoration = "line-through";
      checkImg.removeAttribute("hidden");
      concludedBtn.setAttribute("hidden", true);
    }
    list.appendChild(toDo);
  }

  return toDo;
};

window.onload = function () {
  // tasksExample();
  const form = document.getElementById("inputs");
  form.addEventListener("submit", createTask);
  const tasks = getTasksFromLocalStorage();
  tasks.forEach((task) => {
    createTaskListItem(task);
  });

  taskCount();
};
