import { Costants } from "./constants.mjs";
import { internalCache } from "./internalCache.mjs";
import { generateTodoItems } from "./dom.mjs";

const $todoList = document.querySelector("#todo-list");
const $form = document.querySelector("#form");
const $title = document.querySelector("#title");
const $completed = document.querySelector("#completed");

let state ={
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
        state = {...memoryTodos};
    } else {
        await fetchTodos();
    }
}

const fetchTodos = async () => {
    try{
        const results = await fetch(Costants.API_TODOS_URL);
        const _todos = await results.json();
        const todos = [..._todos].splice(0,5);
        state.todos = [...todos];
        state._todos = [...todos];
        saveStateOnMemory();
    }catch(error){
        console.log(error);
    }
}

const renderToDos = () => {
   const html =  state.todos.map((todo) => {
    return generateTodoItems(todo);
   }).join("");
  
   $todoList.innerHTML = html;
}

const createTodo = ({title, completed}) => {
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
    $completed.addEventListener('change', (event)=>{
        state.form.completed = event.target.value === 'true';
    })
    $form.addEventListener('submit', (event) => {
        event.preventDefault();
        createTodo(state.form);
        console.log(state);
    })
}

const init = async() => {
    await getMemoryState();
    renderToDos();
    setFormListeners();
}


init();