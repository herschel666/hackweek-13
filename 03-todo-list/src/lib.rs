use wasm_bindgen::prelude::*;

#[macro_use]
extern crate serde_derive;

#[wasm_bindgen]
extern {
    #[wasm_bindgen(js_namespace = console)]
    fn log(s: &str);
}

#[derive(Serialize, Debug, Clone, Eq, Ord, PartialEq, PartialOrd)]
pub struct Todo {
    text: String,
    done: bool,
}

impl Todo {
    pub fn new(text: &str) -> Todo {
        log(&format!("Todo::new('{}')", text));
        Todo { text: text.to_string(), done: false }
    }
    pub fn toggle(&mut self, done: bool) {
        log(&format!("Todo.toggle({})", done));
        self.done = done;
    }
}

#[wasm_bindgen]
pub struct TodoList {
    title: String,
    items: Vec<Todo>
}

#[wasm_bindgen]
impl TodoList {
    pub fn new(title: &str) -> TodoList {
        log(&format!("TodoList::new('{}')", title));
        let items: Vec<Todo> = Vec::new();
        TodoList {
            title: title.to_string(),
            items: items
        }
    }
    pub fn title(&self) -> String {
        log("TodoList.title()");
        self.title.to_string()
    }
    pub fn items(&self) -> JsValue {
        JsValue::from_serde(&self.items).unwrap()
    }
    pub fn len(&self) -> usize {
        log("TodoList.len()");
        self.items
            .iter()
            .filter(|todo| todo.done == false)
            .count()
    }
    pub fn get(&self, index: usize) -> JsValue {
        log(&format!("TodoList.get({})", index));
        if let Some(todo) = self.items.get(index) {
            JsValue::from_serde(&todo).unwrap()
        } else {
            panic!("No todo found for the given index.")
        }
    }
    pub fn add(&mut self, text: &str) {
        log(&format!("TodoList.add('{}')", text));
        self.items.push(Todo::new(&text));
        self.items.sort();
    }
    pub fn toggle(&mut self, index: usize, done: bool) {
        log(&format!("TodoList.toggle({}, {})", index, done));
        if let Some(todo) = self.items.get_mut(index) {
            todo.toggle(done);
        }
    }
    pub fn clear(&mut self) {
        log("TodoList.clear()");
        self.items = self.items
            .iter()
            .filter(|todo| todo.done == false)
            .map(|todo| todo.clone())
            .collect();
        self.items.sort();
    }
}
