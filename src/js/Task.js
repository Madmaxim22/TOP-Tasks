export default class Task {
  constructor(id, name, pinned = false) {
    this.id = id;
    this.name = name;
    this.pinned = pinned;
  }
}