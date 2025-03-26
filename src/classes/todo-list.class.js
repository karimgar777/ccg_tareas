import { Todo } from "./todo.class";

export class TodoList {
    constructor() {
        this.cargarLocalStorage();
    }

    nuevoTodo(todo) {
        this.todos.push(todo);
        this.guardarLocalStorage();
        this.actualizarCalendario(); // Actualizar calendario al agregar tarea
        console.log('Se creó la tarea con fecha inicio:', todo.fechaInicio, ' y fecha fin:', todo.fechaFin);
    }

    eliminarTodo(id) {
        this.todos = this.todos.filter(todo => todo.id != id);
        this.guardarLocalStorage();
        this.actualizarCalendario(); // Actualizar calendario al eliminar tarea
        console.log('Se borró la tarea');
    }

    marcarCompletado(id) {
        for (const todo of this.todos) {
            if (todo.id == id) {
                todo.completado = !todo.completado;
                this.guardarLocalStorage();
                this.actualizarCalendario(); // Actualizar calendario 
                console.log('Se completó la tarea');
                break;
            }
        }
    }

    eliminarCompletados() {
        this.todos = this.todos.filter(todo => !todo.completado);
        this.guardarLocalStorage();
        this.actualizarCalendario(); // Actualizar calendario al eliminar completadas
        console.log('Se borraron los completados');
    }

    guardarLocalStorage() {
        localStorage.setItem('todo', JSON.stringify(this.todos));
        console.log('Guardado en localStorage:', JSON.stringify(this.todos));
    }

    cargarLocalStorage() {
        this.todos = localStorage.getItem('todo')
            ? JSON.parse(localStorage.getItem('todo'))
            : [];
        
        // Se modifica para que se carguen correctamente las fechas
        this.todos = this.todos.map(todo => ({
            ...Todo.fromJson(todo),
            fechaInicio: todo.fechaInicio || '', // Si no tiene fecha, deja un string vacío
            fechaFin: todo.fechaFin || ''
        }));

        // Actualizar calendario con tareas cargadas
        this.actualizarCalendario();

        console.log('Se cargaron las tareas desde localStorage');
    }

    actualizarCalendario(tareas = this.todos) {
        if (window.calendar) {
            window.calendar.getEvents().forEach(event => event.remove()); 
            tareas.forEach(todo => {
                if (todo.fechaInicio) {
                    const event = window.calendar.addEvent({
                        title: todo.tarea,
                        start: todo.fechaInicio,
                        end: todo.fechaFin || todo.fechaInicio,
                        backgroundColor: getColorAleatorio(),
                        borderColor: getColorAleatorio()
                    });
                    todo.calendarEvent = event;
                }
            });
        }
    }
}

const getColorAleatorio = () => {
    const colores = ['#3788d8', '#16c79a', '#ff6b6b', '#f9ca24', '#9980fa'];
    return colores[Math.floor(Math.random() * colores.length)];
};