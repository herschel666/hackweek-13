extern crate ferris_says;

use std::str;
use wasm_bindgen::prelude::*;
use ferris_says::say;
use std::io::Cursor;

#[wasm_bindgen]
extern {
    #[wasm_bindgen(js_namespace = console)]
    fn log(s: &str);
}

fn ferris_str(s: &[u8], width: usize) -> String {
    let mut buff = Cursor::new(Vec::new());
    say(s, width, &mut buff).unwrap();
    str::from_utf8(&buff.get_ref()).unwrap().to_string()
}

#[wasm_bindgen]
pub fn ferris_log(s: &str, width: usize) {
    let msg = ferris_str(s.as_bytes(), width);
    log(msg.as_str());
}

#[wasm_bindgen]
pub fn ferris_dom(s: &str , width: usize, mount_id: &str) -> Result<(), JsValue> {
    let window = web_sys::window().expect("no global `window` available.");
    let document = window.document().expect("no `document` available.");
    let mount = document.get_element_by_id(&mount_id).expect("no mount element available.");
    let code = document.create_element("code")?;
    let msg = ferris_str(s.as_bytes(), width);

    code.set_inner_html(msg.as_str());
    mount.append_child(&code)?;

    Ok(())
}
