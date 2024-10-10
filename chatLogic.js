const url = 'ws://localhost:8080';
const ws = new WebSocket(url);

ws.onopen = function() {
    console.log("Connected to WebSocket server");
};


//Group information
ws.addEventListener('message', (event) => {
    // Step 3: Parse the incoming message
    const data = JSON.parse(event.data);

    // Step 4: Use the extracted information
    if (data.type === 'info') {
        const groupId = data.groupId;
        const clientId = data.clientId;

        // Handle the information as needed
        console.log('Group ID:', groupId);
        console.log('Client ID:', clientId);
        document.querySelector('#ChatIndex').innerHTML = ` <h1>Chatroom ${groupId}</h1>`;
    }

    

});



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
    document.querySelector('#chatOutput').innerHTML += 'Other: ' + event.data + '<br>'; // Show the message in the chat log
};

// Handle any errors that occur.
ws.onerror = function(error) {
    console.error("WebSocket Error: ", error);
};

// Handle the close event
ws.onclose = function() {
    console.log("WebSocket connection closed");
};
