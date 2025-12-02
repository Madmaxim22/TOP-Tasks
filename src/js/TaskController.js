import Task from './Task';

export default class TaskController {
  constructor(model, view) {
    this.model = model;
    this.view = view;

    this.addTaskBtn = document.getElementById('addTaskBtn');
    this.taskInput = document.getElementById('taskInput');
    this.container = document.querySelector('.container');

    this._addEventListeners();
  }

  _addEventListeners() {
    // Обработчик добавления задачи
    this.addTaskBtn.addEventListener('click', () => this._addTask());
    // Обработка нажатия Enter в поле ввода
    this.taskInput.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') {
        this._addTask();
      }
    });
    this.container.addEventListener('click', (e) => {
      if (e.target.classList.contains('toggle-pin')) {
        this._togglePinned(e.target.parentNode);
      }
    });

    this.taskInput.addEventListener('input', (e) => this._onFilter(e));
  }

  _addTask() {
    const text = this.taskInput.value.trim();
    if (text === '') {
      // Показывать сообщение об ошибке без alert
      this.view.error('Пожалуйста, введите задачу.');
      return;
    }

    // Проверка на дублирование
    const isDuplicate = this.model.tasks.some(
      (t) => t.name.trim().toLowerCase() === text.toLowerCase()
    );

    if(isDuplicate) {
      this.view.error('Задача с таким названием существует.');
      return;
    }

    this.view.error('');
    const newTask = new Task(this.model.taskIdCounter++, text);
    this.model.addTask(newTask);
    this._renderAll();
    this.taskInput.value = '';
  }

  _togglePinned(item) {
    const taskId = parseInt(item.getAttribute('data-task-id'));
    const task = this.model.tasks.find((t) => t.id === taskId);
    if (task) {
      task.pinned = !task.pinned;
      // this._renderAll();
      // Проверяем, есть ли в input текст фильтрации
      const filterText = this.taskInput.value.trim();

      if (filterText !== '') {
        const pinnedTask = this.model.tasks.filter((t) => t.pinned);
        this.view.render(pinnedTask, 'pinned', 'Закреплённых задач нет');
        // Если фильтр есть, вызываем фильтр заново, чтобы обновить отображение
        this._filterHandler(filterText.toLowerCase());
      } else {
        // Иначе просто перерисовываем все списки
        this._renderAll();
      }
    }
  }

  _renderAll() {
    const pinnedTask = this.model.tasks.filter((t) => t.pinned);
    const allTasks = this.model.tasks.filter((t) => !t.pinned);
    this.view.render(pinnedTask, 'pinned', 'Закреплённых задач нет');
    this.view.render(allTasks, 'all', 'Нет задач.');
  }

  _onFilter(e) {
    e.preventDefault();

    if (this.timeout) {
      clearTimeout(this.timeout);
    }

    const filterText = this.taskInput.value.trim().toLowerCase();
    this.timeout = setTimeout(() => this._filterHandler(filterText), 300);
  }

  _filterHandler(filterText) {
    if (this.model.tasks.length === 0) return;
    const filteredTasks = this.model.tasks.filter((t) => {
      if (t.pinned) return false;
      return t.name.toLowerCase().startsWith(filterText);
    });

    this.view.render(filteredTasks, 'all', 'Задачи не найдены');
  }
}
