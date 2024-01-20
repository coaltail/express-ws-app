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
<main class="flex flex-col items-center justify-center h-screen p-20 font-sans">
  <h1 class="text-2xl font-bold">Chat</h1>

  <div class="flex flex-col items-start mb-20">
    {#each messages as { username, message } (message)}
      <div class="flex flex-col items-start mb-4">
        <p class="bg-gray-200 p-2 rounded-lg">{username}: {message}</p>
      </div>
    {/each}
  </div>
  <div class="flex items-center">
    <input
      class="flex-1 p-2 rounded-lg border border-gray-300 mr-4"
      bind:value={message}
      placeholder="Type a message..."
    />
    <button
      class="p-2 px-4 rounded-lg bg-blue-500 text-white"
      on:click={sendMessage}>Send</button
    >
  </div>
</main>
<Footer />

<style>
  /* Your existing styles here */

  main {
    /* Additional styles for the chat container */
    background-color: #f2f2f2;
    border-radius: 10px;
    padding: 20px;
    max-width: 500px;
    margin: 0 auto;
  }
</style>
