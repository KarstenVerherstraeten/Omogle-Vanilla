const url = 'ws://localhost:8080';
const ws = new WebSocket(url);


// Handle WebSocket open event
ws.onopen = function() {
    console.log("Connected to WebSocket server");
};

// Handle the form submission to send a message
document.querySelector('#chatForm').addEventListener('submit', function(e) {
    e.preventDefault(); // Prevent default form submission

    let input = document.querySelector('#chatInput').value;
    document.querySelector('#chatInput').value = ''; // Clear the input field

    document.querySelector('#chatOutput').innerHTML += 'You: ' + input + '<br>'; // Show the message in the chat log

    // Only send the message if the WebSocket connection is open
    if (ws.readyState === WebSocket.OPEN) {
        ws.send(input); // Send the message through WebSocket
    } else {
        console.error("WebSocket is not open.");
    }
});

// Listen for messages from the server
ws.onmessage = function(event) {
    console.log("Message from server: ", event.data);
    document.querySelector('#chatOutput').innerHTML += 'Server: ' + event.data + '<br>'; // Show the message in the chat log
};
