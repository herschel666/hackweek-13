import {
  h,
  html,
  Component,
  render,
} from 'https://unpkg.com/htm@2.1.1/preact/standalone.mjs';

const DEFAULT_COST = '4';

const costList = Array.from({ length: 28 }, (_, i) => i + 4);

const FormRow = ({ label, id, children }) => html`
  <div class="form-row">
    <label for=${id} class="form-label">${label}</label>
    ${children}
  </div>
`;

const Form = ({ disabled, handleSubmit }) => html`
  <form method="post" onSubmit=${handleSubmit}>
    <fieldset>
      <legend>Encrypt a string…</legend>
      <${FormRow} label="Input" id="string">
        <input
          type="text"
          name="string"
          id="string"
          placeholder="Gimme a string to encrypt…"
          disabled=${disabled}
          class="form-input"
        />
      </${FormRow}>
      <${FormRow} label="Cost" id="cost">
      <select name="cost" id="cost" disabled=${disabled}>
        <option value="">Choose a cost…</option>
        ${costList.map(
          (value) => html`
            <option value=${value}>
              ${value} ${value > 15 ? '*' : ''}
            </option>
          `
        )}
      </select>
      <small class="cost-hint">*: a cost value greater than 15 might take a decent amount of time.</small>
      </${FormRow}>
      <button disabled=${disabled}>Encrypt</button>
    </fieldset>
  </form>
`;

const Loader = ({ loading }) => {
  if (!loading) {
    return null;
  }

  return html`
    <p>
      Encrypting…
      <span class="loading"><span></span><span></span><span></span></span>
    </p>
  `;
};

const Result = ({ value, result, handleFocus, handleClear }) => {
  if (!value || !result) {
    return null;
  }

  return html`
    <p>
      <label class="result-label" for="result">
        Result for "<i>${value}</i>"
      </label>
      <textarea
        class="result-value"
        id="result"
        readonly="true"
        onFocus=${handleFocus}
      >
        ${result}
      </textarea
      >
      <button type="button" onClick=${handleClear}>Clear ×</button>
    </p>
  `;
};

class App extends Component {
  constructor(props) {
    super(props);

    this.worker = props.bcryptWorker;
    this.state = {
      initialized: false,
      loading: false,
      value: null,
      result: null,
    };
    this.handleMessage = this.handleMessage.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleFocus = this.handleFocus.bind(this);
    this.handleClear = this.handleClear.bind(this);
  }

  componentDidMount() {
    this.worker.addEventListener('message', this.handleMessage);
  }

  componentWillUnmount() {
    this.worker.removeEventListener('message', this.handleMessage);
    this.worker.terminate();
  }

  handleMessage({ data }) {
    const { name, payload } = JSON.parse(data);

    switch (name) {
      case 'READY':
        this.setState({
          initialized: true,
        });
        break;
      case 'RESULT':
        this.setState({
          loading: false,
          result: payload,
        });
        break;
      case 'ERR':
      default:
        throw new Error(payload || 'Something went wrong.');
    }
  }

  post(name, payload) {
    this.worker.postMessage(JSON.stringify({ name, payload }));
  }

  handleSubmit(evnt) {
    evnt.preventDefault();

    const form = evnt.target;
    const value = form.elements.string.value.trim();
    const cost = form.elements.cost.value.trim() || DEFAULT_COST;

    if (value) {
      this.post('HASH', { cost: Number(cost), value });
      this.setState({
        loading: true,
        value,
      });
      form.reset();
    }
  }

  handleFocus(evnt) {
    evnt.target.select();
  }

  handleClear() {
    this.setState({
      value: null,
      result: null,
    });
  }

  render(_, { initialized, loading, result, value }) {
    const wrapperClass = initialized ? '' : 'pending';
    const inputDisabled = loading || Boolean(result);

    return html`
      <div class=${wrapperClass}>
        <${Form} disabled=${inputDisabled} handleSubmit=${this.handleSubmit} />
        <${Loader} loading=${loading} />
        <${Result}
          value=${value}
          result=${result}
          handleFocus=${this.handleFocus}
          handleClear=${this.handleClear}
        />
      </div>
    `;
  }
}

const renderApp = (bcryptWorker) =>
  render(h(App, { bcryptWorker }), document.getElementById('bcryptify'));

export default renderApp;
