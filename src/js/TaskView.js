export default class TaskView {
  constructor() {

    this.errorMsg = document.getElementById('errorMsg');
    this.allTasksContainer = document.getElementById('allTasks');
    this.pinnedTasksContainer = document.getElementById('pinnedTasks');
    this.noPinnedMsg = document.getElementById('noPinnedMsg');
    this.noTasksMsg = document.getElementById('noTasksMsg');
  }

  error(message) {
    this.errorMsg.innerText = message;
  }

  createTaskElement(newTask) {
    const pinnedBadge = newTask.pinned ? '&#128204;' : '&#128205;';
    const title = newTask.pinned ? 'Открепить' : 'Закрепить';
    return `
      <div class="task-item" data-task-id=${newTask.id}>
        <span class="task-name">${newTask.name}</span>
        <div class="toggle-pin" title=${title}>${pinnedBadge}</div>
      </div>
    `;
  }

  render(tasks, pin, message) {
    if(pin === 'pinned') {
      this.renderTaskList(tasks, this.pinnedTasksContainer, this.noPinnedMsg, message);
    }

    if(pin === 'all') {
      this.renderTaskList(tasks, this.allTasksContainer, this.noTasksMsg, message);
    }
  }

  renderTaskList(taskList, container, emptyMsgEl, emptyMsgText) {
    container.innerHTML = '';
    if (taskList.length === 0) {
      emptyMsgEl.innerText = emptyMsgText;
    } else {
      emptyMsgEl.innerText = '';
      const html = taskList.map(task => this.createTaskElement(task)).join('');
      container.insertAdjacentHTML('beforeend', html);
    }
  }
}