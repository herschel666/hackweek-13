# Hackweek 13 "Rust & WebAssembly"

> Trying out WebAssembly with Rust to get an understanding of the possibilities and drawbacks of this technique.

Three times a year we're having a [Hackweek here at XING](https://www.xing.com/communities/groups/xing-hackweek-d579-1093367), where everybody has the opportunity to hack on a project to improve themselves and learn new things.

I choose to dive into the world of WebAssembly. As the origin language I decided to take Rust, because I liked the tooling, that I had seen so far and I was curious if it was really that good in practice.

As a prerequisite I had taken a few days in beforehand to learn Rust, since I'm not really familiar with that language nor with any other system programming language. As you would expect I didn't became a professional Rust programmer over the course of a few days. But it sufficed to do the Hackweek with a StackOverflow-driven approach. Please don't use my code as a reference, though!

## The tooling

All the demos are compiled with [`wasm-pack`](https://rustwasm.github.io/), which is an awesome tool that hides a lot of the tedious and painful tasks of writing Rust for Wasm and provides high-level interactions between Wasm modules and Javascript.

It also provides the code needed for loading and instantiating Wasm modules for different environments and module systems, which saves a lot of time.

## The demos

I came up with four more or less useful ideas that highlight different aspects of the tooling and the capabailities of WebAssembly. You can have a look at the code and try the versions compiled for the web. The first two demos I also compiled for Node, which worked, but which I can't provide as a here unfortunately.

### `Hello World!`

([Code](https:github.com/herschel666/hackweek-13/tree/master/01-hello-world/) | [Demo](https://herschel666.github.io/hackweek-13/01-hello-world/))

Here I just wanted to have the most basic WebAssembly app possible, while not only having anything to compile at all, but also call Javascript APIs from within the Rust code.

This is fairly easy when standing on the shoulders of [`wasm-pack`](https://rustwasm.github.io/). So this first demo is sporting an annoying `alert`- and a more amiable `console.log`-call.

### `Ferris says…`

([Code](https:github.com/herschel666/hackweek-13/tree/master/02-ferris-says/) | [Demo](https://herschel666.github.io/hackweek-13/02-ferris-says/))

Since working with `wasm-pack` and (some of) its features has been fun & joy, I wanted to go further and use a package from the Rust package registry [crates.io](https://crates.io/) and use this in my WebAssembly app.

I decided to go for Rust's answer to [`cowsay`](https://en.wikipedia.org/wiki/Cowsay): [`ferris-says`](https://crates.io/crates/ferris-says). This provided me with the opportunity to get my hands dirty with DOM manipulation from within Rust code. It also brought the challenge to intercept the output of `ferris-says`, which usually takes a [`BufWriter`](https://doc.rust-lang.org/std/io/struct.BufWriter.html) instance as an argument and thus directly writes to `stdout`. This is no option in the context of WebAssembly, so I rather pass in an instance of a [`Cursor`](https://doc.rust-lang.org/std/io/struct.Cursor.html) and am thereby able to get the output in the form of a list of `u8` chars which I can then convert into a `String`.

### `Todo list`

([Code](https:github.com/herschel666/hackweek-13/tree/master/03-todo-list/) | [Demo](https://herschel666.github.io/hackweek-13/03-todo-list/))

A todo list — boring, I know… But it's a good exercise in using structs to create `class`-like objects which I can then use in the Javascript code. The challenge here is to cross the boundary between Rust & Javascript. E.g. the `TodoList` struct holds a list of `Todo` instances and returns them from the method `items`. The result would usually be of type `Vec<Todo>`. But since the method is called from Javascriptland, this doesn't work. The result has to be serialized so it can cross the boundary. Hence the actual return type of this method is the more expressive `JsValue`.

Overall this example is pretty useless, to be honest. Both the `Todo` and the `TodoList` classes are automatically re-created in the JS code by `wasm-pack`, which is imho pure redundance, since I don't gain any benefits from having them defined in Rust in the first place.

Also — since I'm using [Preact](https://preactjs.com/) to build the frontend — I put a state management layer below the sufficient one that's provided the Preact's `Component`, which again doesn't bring any benefits, but rather makes things more complicated. On the other hand: who cares?! I'm just hacking around here anyways… 😅

### `Bcrypt`

([Code](https:github.com/herschel666/hackweek-13/tree/master/04-bcrypt/) | [Demo](https://herschel666.github.io/hackweek-13/04-bcrypt/))

In the last demo I wanted to use a bigger package and provide a functionality, that isn't usually available in the browser. I decided to go with [`bcrypter`](https://crates.io/crates/bcrypter) here.

This package requires Rust Nightly. Furthermore it didn't simply work out of the box, since `bcrypter` currently relies on an outdated version of [`rand`](https://crates.io/crates/rand), which doesn't support Wasm. So I cloned [`bcrypter`-repo](https://github.com/MitchellBerry/BCrypter), changed the `rand`-dependency and enabled the `"wasm-bindgen"`-feature for it. Then I pointed the depedency in the `Cargo.toml` to the local version of `bcrypter`.

As a result it's rather tedious to clone this repo and try to get the `Bcrypt` demo run locally. But I actually don't expect anybody to do this.

When you try the demo and set a somewhat higher cost, you will see that hashing the input takes quite some time. That's why I decided to outsource the process into a Web Worker, to not block the main thread for a minute or longer.

## Conclusion

Fiddling with WebAssembly was definitely fun. And the possibilities are quite fascinating. But I also have to admit that for the web apps and tools I mostly develop, Wasm doesn't bring much benefits.

Regarding web apps, I mostly use React. While there are projects like e.g. [`yew`](https://github.com/DenisKolodin/yew/), that let you write React-inspired web applications in Rust, this doesn't make sense for me as a Javascript developer. It won't be significantly faster and if I wanted type-safety, I'd rather introduce Typescript into my codebase.

When it comes to tooling, I'm usually good with Node. The benefits of Wasm here would rather come with Node packages that ship a Wasm module instead of doing a lengthy native binding in a postinstall step.

So Wasm won't replace Javascript. But if I was e.g. about to do some complicated image manipulation in the browser, I think I'd definitley benefit from having parts of the application being loaded as a Wasm module, that bring certain features I won't be able to write easily in Javascript.

---

&copy; 2019 [Emanuel Kluge](https://twitter.com/Herschel_R)
