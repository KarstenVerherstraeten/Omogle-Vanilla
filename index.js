import { WebSocketServer } from "ws";

const wss = new WebSocketServer({ port: 8080 });
const clients = new Map();
const Groups = new Map();

let groupId = 1;

function assignToGroup(clientId) {
    let assigned = false;
    Groups.forEach((group, id) => {
        if (group.size < 2) {
            group.add(clientId);
            assigned = true;
            return false; // Break the loop
        }
    });

    if (!assigned) {
        const newGroup = new Set();
        newGroup.add(clientId);
        Groups.set(groupId++, newGroup);
    }
}

wss.on('connection', function connection(ws) {
    const id = Date.now();
    clients.set(id, ws);
    assignToGroup(id);
    ws.send(JSON.stringify({
        type: 'info',
        groupId: groupId,
        clientId: id,
        activeGroups: [...Groups.keys()]
    }));
    ws.on("message", function message(data) {
        console.log("received: %s", data);

        let message = data.toString();
        // Broadcast the message to the other client in the same group
        Groups.forEach((group) => {
            if (group.has(id)) {
                group.forEach((clientId) => {
                    if (clientId !== id) {
                        clients.get(clientId).send(message);
                    }
                });
            }
        });
    });

    ws.on('close', () => {
        clients.delete(id);
        Groups.forEach((group, groupId) => {
            if (group.has(id)) {
                group.delete(id);
                if (group.size === 0) {
                    Groups.delete(groupId);
                }
            }
        });
    });
});