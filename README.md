# mongoAdmin - a Node.js MongoDB Client

## Setup
- You need Node.js and MongoDB installed on your machine
- Clone the repo and inside run:
```sh
npm i
```
- Also do this in the electron app folder
```sh
cd electron && npm i && cd ..
```
- After the dependencies are installed start the client via:
```sh
npm start
```
- After all the build tasks are completed you should have an instance of the electron app running.
- You can also open up <http://localhost:8080> -> Tested in Firefox and Chrome

## Compile and Pack
- make sure to run `npm run build` in case you haven't already
- then run the electron packager via `npm run pack`
- in the `dist` folder you should find the compiled app (confirmed for linux so far)
