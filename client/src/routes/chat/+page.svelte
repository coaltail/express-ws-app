<script>
  import { onMount, onDestroy } from "svelte";
  import io from "socket.io-client";

  let socket;
  let messages = [];
  let messageInput = "";

  const room = "exampleRoom";

  function sendMessage() {
    // Send chat message to the server
    socket.emit("chatMessage", { room, message: messageInput });
    messageInput = ""; // Clear the input field
  }

  onMount(() => {
    // Connect to the Socket.IO server
    socket = io("http://localhost:3000");

    // Join the room
    socket.emit("joinRoom", room);

    // Listen for chat messages
    socket.on("chatMessage", (data) => {
      messages = [...messages, data];
    });

    // Clean up the socket connection when the component is destroyed
    onDestroy(() => {
      socket.disconnect();
    });
  });
</script>

<main>
  <h1>Chat</h1>

  <div class="messages">
    {#each messages as message}
      <p>{message}</p>
    {/each}
  </div>

  <div class="input">
    <input
      type="text"
      bind:value={messageInput}
      placeholder="Type your message..."
    />
    <button on:click={sendMessage}>Send</button>
  </div>
</main>

<style>
  main {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    height: 100vh;
    padding: 20px;
    font-family: Arial, sans-serif;
  }

  .messages {
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    margin-bottom: 20px;
  }

  .messages p {
    background-color: #f2f2f2;
    padding: 10px;
    border-radius: 5px;
    margin-bottom: 10px;
  }

  .input {
    display: flex;
    align-items: center;
  }

  .input input {
    flex: 1;
    padding: 10px;
    border-radius: 5px;
    border: 1px solid #ccc;
    margin-right: 10px;
  }

  .input button {
    padding: 10px 20px;
    border-radius: 5px;
    background-color: #007bff;
    color: #fff;
    border: none;
    cursor: pointer;
  }
</style>
