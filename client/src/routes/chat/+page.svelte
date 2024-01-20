<script>
  import { onMount } from "svelte";
  import { io } from "socket.io-client";
  import Header from "../../components/Header.svelte";
  import Footer from "../../components/Footer.svelte";
  let socket;
  let room = "default";
  let message = "";
  let messages = [];

  onMount(async () => {
    // Make an HTTP request to get the authentication token
    const response = await fetch("http://localhost:3000/api/auth/token", {
      method: "GET",
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Content-Type": "application/json",
      },
      withCredentials: true,
      credentials: "include",
    });

    const { token } = await response.json();

    // Connect to the socket server and pass the token as a query parameter
    socket = io("http://localhost:3000", {
      auth: {
        token,
      },
    });

    // Join the default room
    socket.emit("joinRoom", room);

    // Listen for incoming chat messages
    socket.on("chatMessage", (data) => {
      console.log(data);
      messages = [...messages, data];
    });

    // Cleanup socket connection on component destroy
    return () => {
      socket.disconnect();
    };
  });

  function sendMessage() {
    if (message.trim() !== "") {
      // Send chat message to the server
      socket.emit("chatMessage", { room, message });

      // Clear the input field
      message = "";
    }
  }
</script>

<Header />
<main>
  <h1>Chat</h1>

  <div>
    <div>
      {#each messages as { username, message } (message)}
        <p>{username}: {message}</p>
      {/each}
    </div>
    <input bind:value={message} placeholder="Type a message..." />
    <button on:click={sendMessage}>Send</button>
  </div>
</main>
<Footer />

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
