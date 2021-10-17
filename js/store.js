import { emptyItemQuery } from "./item.js";

export default class Store {
  constructor(name, callback) {
    const localStorage = window.localStorage;

    let liveTodos; //=this.getApiTodos();

    this.getLocalStorage = () => {
      return liveTodos || JSON.parse(localStorage.getItem(name) || "[]");
    };

    this.setLocalStorage = (todos) => {
      localStorage.setItem(name, JSON.stringify((liveTodos = todos)));
    };

    if (callback) {
      callback();
    }
  }

  // i started with this and wasted most of my time on it.
  // should have been simple
  async getApiTodos() {
    const res = await axios.get("https://jsonplaceholder.typicode.com/todos");
    console.log(res.data);
    return res.data;
  }

  find(query, callback) {
    const todos = this.getLocalStorage();

    callback(
      todos.filter((todo) => {
        for (let k in query) {
          if (query[k] !== todo[k]) {
            return false;
          }
        }
        return true;
      })
    );
  }

  update(update, callback) {
    const id = update.id;
    const todos = this.getLocalStorage();
    let i = todos.length;

    while (i--) {
      if (todos[i].id === id) {
        for (let k in update) {
          todos[i][k] = update[k];
        }
        break;
      }
    }

    this.setLocalStorage(todos);

    if (callback) {
      callback();
    }
  }

  insert(item, callback) {
    const todos = this.getLocalStorage();
    item.title=this.fixTitle(item.title)
    if (todos.find(({ title }) => title === item.title)) {
      return;
    }
    todos.push(item);

    this.setLocalStorage(todos);

    if (callback) {
      callback();
    }
  }

  fixTitle(title) {
	 if(title.includes('<') || title.includes('>')){
		 const firstReplace=title.replace('<','')
		 const secondReplace=firstReplace.replace('>','')
		 return secondReplace
	 }
    return title;
  }

  remove(query, callback) {
    const todos = this.getLocalStorage().filter((todo) => {
      for (let k in query) {
        if (query[k] === todo[k]) {
          return true;
        }
      }
      return false;
    });

    this.setLocalStorage(todos);

    if (callback) {
      callback(todos);
    }
  }

  count(callback) {
    this.find(emptyItemQuery, (data) => {
      const total = data.length;

      let i = total;
      let completed = 0;

      while (i--) {
        completed += data[i].completed;
      }
      callback(total, total - completed, completed);
    });
  }
}
