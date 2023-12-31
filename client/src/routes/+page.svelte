<script>
  import { io } from "socket.io-client";
  import { onMount } from "svelte";
  import { createEventDispatcher } from "svelte";

  let socket;
  let room = "";
  let message = "";
  let token =
    "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI2NThiNWRlNWU1ZmNhNGQ0YmVjZTRmNGQiLCJpYXQiOjE3MDM5Nzk2NDUsImV4cCI6MTcwMzk4Njg0NX0.2bkSQ4-SvsmGVMCelYhCl6w-1LFEJe_EMkJgtjOeJr0";
  let sentMessage = "";

  const dispatch = createEventDispatcher();

  onMount(() => {
    // Listen for messages from the server
    socket.on("message", (message) => {
      console.log("Received message:", message);
    });
  });
  function connect() {
    socket = io("http://localhost:3000", {
      auth: {
        token: token,
      },
    });
  }
  function sendMessage() {
    // Send a message to the server
    socket.emit("message", message);
    sentMessage = message;
  }
  function joinRoom() {
    socket.emit("joinRoom", room);
    socket.on("joinedRoom", (room) => {
      socket.emit("message", "Hello from the client!");
      console.log("Joined room:", room);
    });
    console.log(room);
  }
</script>

<main>
  <h1>Socket.io Room Test</h1>

  <label for="room">Room:</label>
  <input type="text" id="room" bind:value={room} />
  <label for="text">Token</label>
  <input type="text" bind:value={token} />
  <label for="message">Message:</label>
  <input type="text" id="message" bind:value={message} />

  <button on:click={sendMessage}>Send Message</button><br />
  <button on:click={joinRoom}>Join room</button>
  <button on:click={connect}>Connect socket</button>
  {#if sentMessage}
    <p>Message sent: {sentMessage}</p>
  {/if}
</main>

<style>
  main {
    text-align: center;
    padding: 20px;
  }
</style>
