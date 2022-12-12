import { Costants } from "./constants.mjs";
import { internalCache } from "./internalCache.mjs";
import { generateTodoItems } from "./dom.mjs";

const $todoList = document.querySelector("#todo-list");
const $form = document.querySelector("#form");
const $title = document.querySelector("#title");
const $completed = document.querySelector("#completed");
const $sync = document.querySelector("#sync");
const $sortBy = document.querySelector("#sort-by");

let state = {
    todos: [],
    _todos: [],
    form: {
        title: "",
        completed: false,
    },
}

const saveStateOnMemory = () => {
    internalCache.set("state", state);
}

const getMemoryState = async () => {
    const memoryTodos = internalCache.get("state");
    if (memoryTodos) {
        state = { ...memoryTodos };
    } else {
        await fetchTodos();
    }
}

const fetchTodos = async () => {
    try {
        const results = await fetch(Costants.API_TODOS_URL);
        const _todos = await results.json();
        const todos = [..._todos].splice(0, 5);
        state.todos = [...todos];
        state._todos = [...todos];
        saveStateOnMemory();
        getMemoryState();
    } catch (error) {
        console.log(error);
    }
}

const forceFetch = async () => {
    await fetchTodos();
    renderToDos();
}

const renderToDos = () => {
    const html = state.todos.map((todo) => {
        return generateTodoItems(todo);
    }).join("");

    $todoList.innerHTML = html;
}


const createTodo = ({ title, completed }) => {
    if (!$title.value || !$completed.value) {
        return;
    }

    const newTodo = {
        id: state._todos.length + 1,
        title,
        completed,
    }

    state.todos.push(newTodo);
    state._todos.push(newTodo);
    saveStateOnMemory();
    renderToDos();
}

const setFormListeners = () => {
    $title.addEventListener('input', (event) => {
        state.form.title = event.target.value;
    })
    $completed.addEventListener('change', (event) => {
        state.form.completed = event.target.value === 'true';
    })
    $form.addEventListener('submit', (event) => {
        event.preventDefault();
        createTodo(state.form);
        if ($completed.value && $title.value) {
            $completed.value = "";
            $title.value = "";
            state.form.title = $title.value;
            state.form.completed = $completed.value;
    }
    })
    $sync.addEventListener("click", () => {
         forceFetch(); 
    })
    $sortBy.addEventListener("change", (event) => {
       const value = event.target.value;

       switch (value) {
        case "TITLE_ASC": 
            state.todos.sort((a, b) =>  a.title < b.title ? -1 : 0)
            break;
        case "TITLE_DESC": 
            state.todos.sort((a, b) =>  b.title < a.title ? -1 : 0)
            break;
        default: 
            state.todos.sort((a, b) =>  a.title < b.title ? -1 : 0)
            break;
       }
       renderToDos();
    })
}

const setToDolisteners = () => {
    document.addEventListener("click", (event) => {
        if (event.target.classList.contains("delete-todo")) {
            const id = event.target.dataset.id;
            const targetIndex = state.todos.findIndex((todo) => {
                return todo.id == id;
            });

            state.todos.splice(targetIndex, 1);
            state._todos.splice(targetIndex, 1);
            saveStateOnMemory();
            renderToDos();
        } else if (event.target.classList.contains("update-completed-todo")) {
            const id = event.target.dataset.id;
            const targetIndex = state.todos.findIndex((todo) => {
                return todo.id == id;
            });
            state.todos[targetIndex].completed = !state.todos[targetIndex].completed;
            state._todos[targetIndex].completed = !state._todos[targetIndex].completed;
            saveStateOnMemory();
            renderToDos();
        }
    }) 

}

const init = async () => {
    await getMemoryState();
    renderToDos();
    setFormListeners();
    setToDolisteners();
}


init();