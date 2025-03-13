import { Todo } from "../classes";
import { todoList } from "../index";

// Referencias HTML
const divTodoList = document.querySelector('.todo-list');
const txtInput = document.querySelector('.new-todo');
const inputFechaInicio = document.querySelector('#fecha-inicio');
const inputFechaFin = document.querySelector('#fecha-fin');
const btnBorrar = document.querySelector('.clear-completed');
const ulFiltros = document.querySelector('.filters');
const anchorFiltros = document.querySelectorAll('.filtro');
const btnAgregar = document.querySelector('#agregar-tarea');

export const crearTodoHtml = (todo) => {
    const htmlTodo = `
        <li class="${(todo.completado) ? 'completed' : ''}" data-id="${todo.id}">
            <div class="view">
                <input class="toggle" type="checkbox" ${(todo.completado) ? 'checked' : ''}>
                <label>${todo.tarea}</label>
                <p> Inicio: ${todo.fechaInicio} - ⏳ Fin: ${todo.fechaFin || 'No asignado'}</p>
                <button class="destroy"></button>
            </div>
            <input class="edit" value="${todo.tarea}">
        </li>
    `;

    const div = document.createElement('div');
    div.innerHTML = htmlTodo;
    divTodoList.append(div.firstElementChild);

    // Agregar evento al calendario
    agregarEventoCalendario(todo);

    return div.firstElementChild;
};

const agregarEventoCalendario = (todo) => {
    if (window.calendar && todo.fechaInicio) {
        const event = window.calendar.addEvent({
            title: todo.tarea,
            start: todo.fechaInicio,
            end: todo.fechaFin || todo.fechaInicio,
            backgroundColor: getColorAleatorio(),
            borderColor: getColorAleatorio()
        });
        todo.calendarEvent = event; // Guardar el objeto evento en el objeto tarea
    }
};

const getColorAleatorio = () => {
    const colores = ['#3788d8', '#16c79a', '#ff6b6b', '#f9ca24', '#9980fa'];
    return colores[Math.floor(Math.random() * colores.length)];
};

// Eventos
btnAgregar.addEventListener('click', () => {
    const tarea = txtInput.value.trim();
    const fechaInicio = inputFechaInicio.value || new Date().toISOString().split('T')[0];
    const fechaFin = inputFechaFin.value || "";

    if (tarea.length > 0) {
        const nuevoTodo = new Todo(tarea, fechaInicio, fechaFin);
        todoList.nuevoTodo(nuevoTodo);

        crearTodoHtml(nuevoTodo);
        txtInput.value = '';
        inputFechaInicio.value = '';
        inputFechaFin.value = '';
    }
});

divTodoList.addEventListener('click', (evento) => {
    const nombreElemento = evento.target.localName;
    const todoElemento = evento.target.closest('li');
    if (!todoElemento) return;

    const todoId = todoElemento.dataset.id;

    if (nombreElemento === 'input' && evento.target.type === 'checkbox') {
        todoList.marcarCompletado(todoId);
        todoElemento.classList.toggle('completed');
    } else if (nombreElemento === 'button') {
        if(todoList.todos[todoList.todos.findIndex(element => element.id == todoId)].calendarEvent){
            todoList.todos[todoList.todos.findIndex(element => element.id == todoId)].calendarEvent.remove();
        }
        todoList.eliminarTodo(todoId);
        divTodoList.removeChild(todoElemento);
    }
});

btnBorrar.addEventListener('click', () => {
    todoList.eliminarCompletados();
    for (let i = divTodoList.children.length - 1; i >= 0; i--) {
        const elemento = divTodoList.children[i];
        if (elemento.classList.contains('completed')) {
            divTodoList.removeChild(elemento);
        }
    }
});

ulFiltros.addEventListener('click', (evento) => {
    const filtro = evento.target.text;
    if (!filtro) { return; }

    anchorFiltros.forEach(elem => elem.classList.remove('selected'));
    evento.target.classList.add('selected');

    const tareasFiltradas = filtrarTareas(filtro); // Función para filtrar tareas
    todoList.actualizarCalendario(tareasFiltradas); // Actualizar calendario con tareas filtradas

    for (const elemento of divTodoList.children) {
        elemento.classList.remove('hidden');
        const completado = elemento.classList.contains('completed');

        switch (filtro) {
            case 'Pendientes':
                if (completado) {
                    elemento.classList.add('hidden');
                }
                break;
            case 'Completados':
                if (!completado) {
                    elemento.classList.add('hidden');
                }
                break;
        }
    }
});

const filtrarTareas = (filtro) => {
    let tareasFiltradas = todoList.todos;
    switch (filtro) {
        case 'Pendientes':
            tareasFiltradas = tareasFiltradas.filter(todo => !todo.completado);
            break;
        case 'Completados':
            tareasFiltradas = tareasFiltradas.filter(todo => todo.completado);
            break;
    }
    return tareasFiltradas;
};