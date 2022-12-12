/**
 * Function that generates HTML for todo items
 * @param {string} options.id 
 * @param {string} options.title 
 * @param {boolean} options.completed 
 * @returns {string} html for todo items
 */
export const generateTodoItems = (options = {id, title, completed}) => `
<div>
    <span>${options.title} - ${options.completed ? "&#10004;" : "&#215;"}</span>
    <button class="update-completed-todo" data-id="${options.id}">${options.completed ? "Undo" : "Complete"}</button>
    <button class="delete-todo" data-id="${options.id}">Delete</button>
</div>
`