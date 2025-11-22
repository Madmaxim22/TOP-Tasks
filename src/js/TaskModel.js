export default class TaskModel {
  constructor() {
    this._tasks = [];
    this.taskIdCounter = 0;
  }

  addTask(task) {
    this._tasks.push(task);
  }

  get tasks() {
    return this._tasks;
  }

}