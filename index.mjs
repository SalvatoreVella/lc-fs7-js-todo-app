import { Costants } from "./constants.mjs";

const state ={
    todos: [],
    _todos: [],
}

const fetchTodos = async () => {
    try{
        const results = await fetch(Costants.API_TODOS_URL);
        const _todos = await results.json();
        const todos = [..._todos].splice(0,10);
        state.todos = [...todos];
        state._todos = [...todos];
    }catch(error){
        console.log(error);
    }
}

const init = async() => {
    await fetchTodos();
    console.log(state);
}

init();