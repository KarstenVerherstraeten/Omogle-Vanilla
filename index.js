import { WebSocketServer } from "ws";

const wss = new WebSocketServer({ port: 8080 });
const clients = new Map();

wss.on('connection', function connection(ws) {
    const id = Date.now();
    clients.set(id, ws);

    ws.on("message", function message(data) {
        console.log("received: %s", data);


        let message = data.toString();
        // Broadcast the message to all other clients
        clients.forEach((client, clientId) => {
            if (clientId !== id) {
                client.send(message);
            }
        });
    });

    ws.on('close', () => {
        clients.delete(id);
    });

    ws.send("Welcome to the WebSocket server!");
});
