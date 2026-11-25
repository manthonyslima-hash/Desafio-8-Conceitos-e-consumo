
// 1. SELECIONANDO ELEMENTOS DO HTML

const taskInput = document.getElementById("task-input");
const addButton = document.getElementById("add-btn");
const taskList = document.getElementById("task-list");
const searchInput = document.getElementById("search-input");
const filterSelect = document.getElementById("filter-select");
const emptyMessage = document.getElementById("empty-message");

// 2. ARRAY DE TAREFAS
// Recupera as tarefas salvas no navegador
let tasks = JSON.parse(localStorage.getItem("tasks")) || [];


// 3. SALVAR TAREFAS NO LOCALSTORAGE

function saveTasks() {
    localStorage.setItem("tasks", JSON.stringify(tasks));
}


// 4. ADICIONAR UMA NOVA TAREFA

function addTask() {

    const taskText = taskInput.value.trim();

    // Verifica se o campo está vazio
    if (taskText === "") {
        alert("Digite uma tarefa antes de adicionar!");
        return;
    }

    const newTask = {
        id: Date.now(),
        text: taskText,
        completed: false
    };

    tasks.push(newTask);

    saveTasks();

    taskInput.value = "";

    renderTasks();
}


// 5. CONCLUIR UMA TAREFA

function toggleTask(id) {

    tasks = tasks.map(task => {

        if (task.id === id) {
            return {
                ...task,
                completed: !task.completed
            };
        }

        return task;
    });

    saveTasks();

    renderTasks();
}


// 6. EXCLUIR UMA TAREFA

function deleteTask(id) {

    tasks = tasks.filter(task => task.id !== id);

    saveTasks();

    renderTasks();
}


// 7. EXIBIR AS TAREFAS NA TELA

function renderTasks() {

    taskList.innerHTML = "";

    const searchText = searchInput.value.toLowerCase();

    const filterValue = filterSelect.value;

    // Pesquisa e filtra as tarefas
    const filteredTasks = tasks.filter(task => {

        const matchesSearch = task.text
            .toLowerCase()
            .includes(searchText);

        const matchesFilter =
            filterValue === "all" ||
            (filterValue === "completed" && task.completed) ||
            (filterValue === "pending" && !task.completed);

        return matchesSearch && matchesFilter;
    });


    // Mensagem quando não existem resultados
    if (filteredTasks.length === 0) {

        emptyMessage.style.display = "block";

        if (tasks.length === 0) {
            emptyMessage.textContent =
                "Nenhuma tarefa cadastrada ainda.";
        } else {
            emptyMessage.textContent =
                "Nenhuma tarefa encontrada.";
        }

    } else {

        emptyMessage.style.display = "none";
    }


    // Criação dos elementos de cada tarefa
    filteredTasks.forEach(task => {

        const li = document.createElement("li");

        // Área do conteúdo
        const content = document.createElement("div");
        content.classList.add("task-content");

        // Checkbox
        const checkbox = document.createElement("input");
        checkbox.type = "checkbox";
        checkbox.checked = task.completed;

        checkbox.addEventListener("change", () => {
            toggleTask(task.id);
        });

        // Texto da tarefa
        const span = document.createElement("span");
        span.textContent = task.text;
        span.classList.add("task-text");

        if (task.completed) {
            span.classList.add("completed");
        }

        // Área dos botões
        const actions = document.createElement("div");
        actions.classList.add("task-actions");

        // Botão excluir
        const deleteButton = document.createElement("button");
        deleteButton.innerHTML =
            '<i class="fa-solid fa-trash"></i>';

        deleteButton.classList.add("delete-btn");

        deleteButton.title = "Excluir tarefa";

        deleteButton.addEventListener("click", () => {
            deleteTask(task.id);
        });


        // Organizando os elementos
        content.appendChild(checkbox);
        content.appendChild(span);

        actions.appendChild(deleteButton);

        li.appendChild(content);
        li.appendChild(actions);

        taskList.appendChild(li);

    });

}


// 8. EVENTOS DOS BOTÕES E CAMPOS
// Adicionar pelo botão
addButton.addEventListener("click", addTask);

// Adicionar pressionando Enter
taskInput.addEventListener("keydown", (event) => {

    if (event.key === "Enter") {
        addTask();
    }

});

// Pesquisa enquanto digita
searchInput.addEventListener("keyup", renderTasks);

// Filtro de tarefas
filterSelect.addEventListener("change", renderTasks);


// 9. CARREGAR TAREFAS AO ABRIR A PÁGINA
renderTasks();
