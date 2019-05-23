# `Bcrypt`

To be able to build this project, clone the repo [`MitchellBerry/BCrypter`](https://github.com/MitchellBerry/BCrypter/tree/896befa63037281b976e4e302bc92304cf714c6c) to your local machine and change the dependency `rand` in the `Cargo.toml` like this:

```diff
- rand = "0.5.5"
+ rand = { version = "0.6.5", features = ["wasm-bindgen"] }
```

Then point the `bcrypter` entry of this project's `Cargo.toml` to your local clone of `MitchellBerry/BCrypter`.

After that you're ready to build the project by running the following command in your terminal…

```bash
$ rustup install nightly
$ rustup override set nightly
$ rustup run nightly wasm-pack build --target no-modules
```
