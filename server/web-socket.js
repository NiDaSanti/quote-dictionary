const WebSocket = require('ws')

let wss

function initWebSocket(server) {
  wss = new WebSocket.Server({server})

  wss.on('connection', (ws) => {
    console.log('Client connected')

    ws.on('message', (message) => {
      console.log(`Received message: ${message}`)
    })

    ws.on('close', () => {
      console.log('Client disconnected')
    })
  })
}

function broadcast(data) {
  wss.clients.forEach((client) => {
    if(client.readyState === WebSocket.OPEN) {
      client.send(data)
    }
  })
}

module.exports = {initWebSocket, broadcast}