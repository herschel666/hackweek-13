use wasm_bindgen::prelude::*;

#[wasm_bindgen]
extern {
  fn alert(s: &str);

  #[wasm_bindgen(js_namespace = console)]
  fn log(s: &str);
}

#[wasm_bindgen]
pub fn greet(s: &str) {
  alert(&format!("Hello {}!", s));
}

#[wasm_bindgen]
pub fn print(s: &str) {
  log(s);
}
