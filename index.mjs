import { Costants } from "./constants.mjs";
import { internalCache } from "./internalCache.mjs";
import { generateTodoItems } from "./dom.mjs";

const $todoList = document.querySelector("#todo-list");

let state ={
    todos: [],
    _todos: [],
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
}

const init = async() => {
    await getMemoryState();
    renderToDos();
    
}

init();