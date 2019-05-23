extern crate console_error_panic_hook;
extern crate bcrypter;

use bcrypter::password;
use wasm_bindgen::prelude::*;

#[wasm_bindgen]
extern "C" {
    #[wasm_bindgen(js_namespace = console)]
    fn log(s: &str);
}

#[wasm_bindgen]
pub fn hash_str(s: &str, cost: u8) -> Option<String> {
    console_error_panic_hook::set_once();
    log(&format!("hash('{}')", s));
    match password(s.to_string()).cost(cost).hash() {
        Ok(result) => Some(result.hash_string),
        Err(_)     => None
    }
}
