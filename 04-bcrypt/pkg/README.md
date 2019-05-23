```bash
$ rustup install nightly
$ rustup override set nightly
$ rustup run nightly wasm-pack build --target no-modules
```

-> clone [`MitchellBerry/BCrypter`](https://github.com/MitchellBerry/BCrypter/tree/896befa63037281b976e4e302bc92304cf714c6c)
-> change the settings for the dependency `rand`:

```diff
- rand = "0.5.5"
+ rand = { version = "0.6.5", features = ["wasm-bindgen"] }
```

-> use the local version `BCrypter`
