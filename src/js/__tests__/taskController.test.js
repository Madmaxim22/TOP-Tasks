import TaskController from '../TaskController';
import Task from '../Task';

describe('TaskController', () => {
  let mockModel;
  let mockView;
  let controller;
  let addBtn;
  let input;
  let container;

  beforeEach(() => {
    // Мокаем DOM элементы
    document.body.innerHTML = `
      <div class="container">
        <button id="addTaskBtn"></button>
        <input id="taskInput" />
      </div>
    `;
    addBtn = document.getElementById('addTaskBtn');
    input = document.getElementById('taskInput');

    // Мокаем модель
    mockModel = {
      taskIdCounter: 0,
      _tasks: [],
      addTask: jest.fn(function(task) {
        this._tasks.push(task);
      }),
      get tasks() {
        return this._tasks;
      }
    };

    // Мокаем представление
    mockView = {
      render: jest.fn(),
      error: jest.fn()
    };

    // Создаём контроллер
    controller = new TaskController(mockModel, mockView);

    // Мокаем события
    jest.spyOn(addBtn, 'addEventListener');
    jest.spyOn(input, 'addEventListener');

    // Воспроизведём вызовы
    controller._addEventListeners();
  });

  test('Добавление задачи по клику', () => {
    input.value = 'Новая задача';

    // Мокаем клик по кнопке
    addBtn.click();

    expect(mockView.error).toHaveBeenCalledWith('');
    expect(mockModel.addTask).toHaveBeenCalled();
    const taskArg = mockModel.addTask.mock.calls[0][0];
    expect(taskArg.name).toBe('Новая задача');
    expect(taskArg.id).toBe(0);
  });

  test('Добавление задачи при нажатии Enter', () => {
    input.value = 'Задача при Enter';

    // Симуляция нажатия Enter
    const event = new KeyboardEvent('keydown', { key: 'Enter' });
    input.dispatchEvent(event);

    expect(mockView.error).toHaveBeenCalledWith('');
    expect(mockModel.addTask).toHaveBeenCalled();
    const taskArg = mockModel.addTask.mock.calls[0][0];
    expect(taskArg.name).toBe('Задача при Enter');
    expect(taskArg.id).toBe(0);
  });

  test('Проброс ошибки при пустом вводе', () => {
    input.value = '';
    // Вызов метода
    controller._addTask();

    expect(mockView.error).toHaveBeenCalledWith('Пожалуйста, введите задачу.');
    expect(mockModel.addTask).not.toHaveBeenCalled();
  });

  test('Переключение закрепления задачи', () => {
    const task = new Task(1, 'Test task');
    mockModel._tasks.push(task);

    // Мокаем элемент DOM
    const taskDiv = document.createElement('div');
    taskDiv.setAttribute('data-task-id', '1');
    taskDiv.className = 'task-item';

    // Вызов метода
    controller._togglePinned(taskDiv);

    expect(task.pinned).toBe(true);
    // Еще раз — отключить
    controller._togglePinned(taskDiv);
    expect(task.pinned).toBe(false);
  });

  test('Рендер вызывается с правильными параметрами', () => {
    const tasks = [
      new Task(1, 'T1', true), new Task(2, 'T2')
    ];
    controller._renderAll();

    expect(mockView.render).toHaveBeenCalledWith(
      expect.any(Array),
      'pinned',
      'Закреплённых задач нет'
    );
    expect(mockView.render).toHaveBeenCalledWith(
      expect.any(Array),
      'all',
      'Нет задач.'
    );
  });

  test('Фильтрация задач', () => {
    // Добавим задачи
    mockModel._tasks.push(new Task(1, 'Alpha'));
    mockModel._tasks.push(new Task(2, 'Beta', true));
    mockModel._tasks.push(new Task(3, 'Alpine'));

    // Вызываем фильтр
    controller._filterHandler('Al');

    // Проверяем, что вызвано рендер с правильными задачами
    expect(mockView.render).toHaveBeenCalled();
    const filteredTasks = mockView.render.mock.calls[0][0];

    // Все задачи начинаются с 'Al' и не закреплены
    filteredTasks.forEach(task => {
      expect(task.name.toLowerCase().startsWith('al')).toBe(true);
      expect(task.pinned).toBe(false);
    });
  });
});