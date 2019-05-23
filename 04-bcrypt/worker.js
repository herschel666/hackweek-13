importScripts('./pkg/bcrypt.js');

const post = (name, payload) => postMessage(JSON.stringify({ name, payload }));

const handleMessage = ({ data }) => {
  const { name, payload } = JSON.parse(data);
  let error = `Unknown topic "${name}".`;

  switch (name) {
    case 'HASH': {
      try {
        const result = wasm_bindgen.hash_str(payload.value, payload.cost);
        post('RESULT', result);
        break;
      } catch (err) {
        error = err.message;
      }
    }
    default:
      post('ERR', error);
  }
};

const init = () => {
  post('READY');
  addEventListener('message', handleMessage);
};

wasm_bindgen('./pkg/bcrypt_bg.wasm').then(init, console.error);
