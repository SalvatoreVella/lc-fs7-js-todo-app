import { Costants } from "./constants.mjs";
import { internalCache } from "./internalCache.mjs";

let state ={
    todos: [],
    _todos: [],
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
        internalCache.set("state", state);
    }catch(error){
        console.log(error);
    }
}

const init = async() => {
    await getMemoryState();
    console.log(state);
}

init();