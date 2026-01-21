// import {treaty} from "@elysiajs/eden"
// import { node } from "@elysiajs/node"
// import Elysia from "elysia"

// const webSocketApp = new Elysia({prefix: "/ws", adapter: node()}).ws("/messages", {
//   message(ws, message) {
//     ws.send(message)
//   }
// }).listen(3000, ({hostname, port}) => {
//   console.log(`Elysia is running at ${hostname}:${port}`)
// })

// export const edenClientWs = treaty<typeof webSocketApp>("localhost:3000").ws
