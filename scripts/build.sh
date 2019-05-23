#!/bin/bash

DEMOS=("01-hello-world" "02-ferris-says" "03-todo-list")

for demo in ${DEMOS[@]};
do
  cd "./$demo" > /dev/null
  echo "Build '$demo'..."
  wasm-pack build --release --target web
  rm ./pkg/.gitignore
  cd ..
done

cd ./04-bcrypt > /dev/null
echo "Build '04-bcrypt'..."
rustup run nightly wasm-pack build --release --target no-modules
rm ./pkg/.gitignore
cd ..

content=$(./node_modules/.bin/marked README.md)
json="{\"content\":\"${content//\"/\\\"}\"}"

echo $json > .content.json
yarn mustache .content.json index.template index.html
rm ./.content.json
