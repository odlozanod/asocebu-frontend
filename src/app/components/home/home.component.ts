import { Component, OnInit, ViewEncapsulation  } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Task, TaskService } from './../../services/task.service';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class HomeComponent implements OnInit {
  tasks: Task[] = [];
  newTaskTitle = '';
  editingTask: Task | null = null;

  constructor(private taskService: TaskService) {}

  ngOnInit(): void {
    this.loadTasks();
  }

  loadTasks() {
    this.taskService.getTasks().subscribe(data => {
      this.tasks = data.filter(task => !task.deleted_at);
    });
  }

  addTask() {
    if (this.newTaskTitle.trim()) {
      this.taskService.addTask({ title: this.newTaskTitle, completed: false }).subscribe(() => {
        this.newTaskTitle = '';
        this.loadTasks();
      });
    }
  }

  toggleTask(task: Task) {
    task.completed = !task.completed;
    this.taskService.updateTask(task).subscribe(() => {
      this.loadTasks();
    });
  }

  deleteTask(id: number) {
    if (id !== undefined) {
      this.taskService.deleteTask(id).subscribe(() => this.loadTasks());
    }
  }

  editTask(task: Task) {
    // Abre el modal con una copia del task
    this.editingTask = { ...task };
  }

  saveEdit() {
    if (this.editingTask) {
      this.taskService.updateTask(this.editingTask).subscribe(() => {
        this.editingTask = null;
        this.loadTasks();
      });
    }
  }

  cancelEdit() {
    this.editingTask = null;
  }
}
