# Conway's Game of Live

Rust -> WASM 的生命游戏.

## 构建

`wasm-pack build --target web`

## 运行

在根目录中启动一个 Http 服务器并访问 `/demo/index.html` 即可.

## 问题

wasm-pack 目前版本有一些问题，导致 wasm-opt 优化阶段出错，目前已在 `cargo.toml` 中关闭优化

```toml
[package.metadata.wasm-pack.profile.release]
wasm-opt = false
```

## Reference

https://rustwasm.github.io/docs/book/introduction.html
