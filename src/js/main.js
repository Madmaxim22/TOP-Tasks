import '../css/style.css';
import TaskModel from './TaskModel';
import TaskView from './TaskView';
import TaskController from './TaskController';

const model = new TaskModel();
const view = new TaskView();
const controller = new TaskController(model, view);
