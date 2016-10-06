# mongoAdmin - a Node.js MongoDB Client

## Setup
- You need Node.js and MongoDB installed on your machine
- Clone the repo and inside run:
```sh
npm i
```
- Also do this in the electron folder
```sh
cd electron && npm i && cd ..
```
- After the dependencies are installed start the client via:
```sh
npm start
```
- After all the build tasks are completed you should have an instance of the electron app running.
- You can also open up <http://localhost:8080> -> Tested in Firefox and Chrome

## Compile
- make sure to run `npm run build` in case you haven't already
- go to ./electron folder `cd electron`
- make sure you have the dependencies met `npm i`
- then run the electron builder via `npm run dist`
- in the `dist` folder you should find the compiled app
