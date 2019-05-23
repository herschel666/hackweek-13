import {
  h,
  html,
  Component,
  render,
} from 'https://unpkg.com/htm@2.1.1/preact/standalone.mjs';
import { TodoList } from './pkg/todo_list.js';

const Title = ({ count }) => {
  switch (count) {
    case 0:
      return html`
        <h2>Nothing to do.</h2>
      `;
    case 1:
      return html`
        <h2>One todo</h2>
      `;
    default:
      return html`
        <h2>${count} todos</h2>
      `;
  }
};

const Todo = ({ text, done, handleToggle }) => {
  const elem = done ? 'strike' : 'span';

  return html`
    <label class="todo">
      <input type="checkbox" class="toggle" checked=${done} onInput=${handleToggle} />
      <${elem}>${text}</${elem}>
    </label>
  `;
};

const ClearButton = ({ allCount, pendingCount, handleClick }) => html`
  <button
    type="button"
    class="clear-btn"
    onClick=${handleClick}
    disabled=${allCount === pendingCount}
  >
    Delete finished todos
  </button>
`;

class App extends Component {
  constructor() {
    super();

    this.list = TodoList.new('Todos');
    this.list.add('Buy a crate of bottled beverages');
    this.list.add('Fix the Rust compilation');
    this.list.toggle(1, true);

    this.state = {
      todos: this.list.items(),
      count: this.list.len(),
    };

    this.onSubmit = this.onSubmit.bind(this);
    this.deleteFinishedTodos = this.deleteFinishedTodos.bind(this);
  }

  sync() {
    this.setState({
      todos: this.list.items(),
      count: this.list.len(),
    });
  }

  onSubmit(evnt) {
    evnt.preventDefault();

    const form = evnt.target;
    const todo = form.elements.todo.value.trim();

    if (todo) {
      this.list.add(todo);
      this.sync();
      form.reset();
    }
  }

  onToggle(index) {
    return (evnt) => {
      this.list.toggle(index, evnt.target.checked);
      this.sync();
    };
  }

  deleteFinishedTodos() {
    this.list.clear();
    this.sync();
  }

  render(_, { todos, count }) {
    return html`
      <div>
        <form method="post" onSubmit=${this.onSubmit}>
          <fieldset>
            <legend>${this.list.title()}</legend>
            <input
              type="text"
              placeholder="What's to be done?"
              name="todo"
              class="input"
            />
          </fieldset>
        </form>
        <${ClearButton}
          allCount=${todos.length}
          pendingCount=${count}
          handleClick=${this.deleteFinishedTodos}
        />
        <${Title} count=${count} />
        <ul>
          ${todos.map(
            ({ text, done }, i) => html`
              <li class="list-item">
                <${Todo}
                  key=${text}
                  text=${text}
                  done=${done}
                  handleToggle=${this.onToggle(i)}
                />
              </li>
            `
          )}
        </ul>
      </div>
    `;
  }
}

export default function renderApp() {
  const mount = document.getElementById('todo-list');

  render(h(App), mount);
}
