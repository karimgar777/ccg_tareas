import './styles.css';
import { Todo, TodoList } from './classes';
import { crearTodoHtml } from './js/componentes';

console.log('index.js cargado');
export const todoList = new TodoList();
todoList.todos.forEach(crearTodoHtml);

