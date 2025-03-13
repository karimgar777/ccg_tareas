export class Todo {
    static fromJson({ id, tarea, completado, creado, fechaInicio, fechaFin }) {
        const tempTodo = new Todo(tarea, fechaInicio, fechaFin);
        tempTodo.id = id;
        tempTodo.completado = completado;
        tempTodo.creado = creado;
        tempTodo.fechaInicio = fechaInicio || new Date().toISOString(); // Si no tiene, asigna la fecha actual
        tempTodo.fechaFin = fechaFin || ""; // Si no tiene fecha de finalización, deja vacío
        return tempTodo;
    }



    constructor(tarea, fechaInicio = new Date().toISOString(), fechaFin = "") {
        this.tarea = tarea;
        this.id = new Date().getTime();
        this.completado = false;
        this.creado = new Date().toISOString();
        this.fechaInicio = fechaInicio;
        this.fechaFin = fechaFin;
        this.calendarEvent = null;
    }
}
