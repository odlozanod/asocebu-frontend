import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

export interface Task {
  id?: number;
  title: string;
  completed: boolean; // true o false
  created_at?: string;
  updated_at?: string;
  deleted_at?: string | null;
}

@Injectable({
  providedIn: 'root'
})
export class TaskService {
  private apiUrl = 'http://localhost:3000/tasks';

  constructor(private http: HttpClient) {}

  // GET: obtener todas las tareas activas (sin deleted_at)
  getTasks(): Observable<Task[]> {
    return this.http.get<Task[]>(this.apiUrl).pipe(
      map(tasks =>
        tasks.map(task => ({
          ...task,
          completed: !!task.completed // convierte 0/1 en booleano
        }))
      )
    );
  }

  // POST: agregar una nueva tarea
  addTask(task: Task): Observable<Task> {
    const newTask = {
      ...task,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };
    return this.http.post<Task>(this.apiUrl, newTask);
  }

  // PUT: actualizar tarea (título o estado completado)
  updateTask(task: Task): Observable<any> {
    return this.http.put(`${this.apiUrl}/${task.id}`, {
      title: task.title,
      completed: task.completed,
      updated_at: new Date().toISOString(),
    });
  }

  // PUT: marcar como eliminada
  deleteTask(id: number): Observable<any> {
    const deletedTask = { deleted_at: new Date().toISOString() };
    return this.http.put(`${this.apiUrl}/${id}`, deletedTask);
  }
}
