<script>
  // Add any necessary script logic here
  import { user } from "../stores/user.js";

  const logout = async () => {
    const response = await fetch("http://localhost:3000/api/auth/logout", {
      method: "POST",
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Content-Type": "application/json",
      },
      withCredentials: true,
      credentials: "include",
    });

    if (response.ok) {
      user.update((u) => {
        u = null;
      });
    }
  };
</script>

<header class="bg-gray-800 text-white p-4 flex justify-center items-center">
  <nav class="flex items-center justify-between w-[100%] m-0 p-0">
    <a class="text-2xl font-bold hover:text-gray-400" href="/">App</a>
    <div>
      <a href="/" class="text-sm mx-2">Home</a>
      <a href="#" class="text-sm mx-2">About</a>
      <a href="#" class="text-sm mx-2">Services</a>
      <a href="#" class="text-sm mx-2">Contact</a>
      {#if $user}
        <a on:click={logout} class="text-sm mx-2">Logout</a>
      {:else}
        <a href="/login" class="text-sm mx-2">Login</a>
        <a href="/register" class="text-sm mx-2">Register</a>
      {/if}
    </div>
  </nav>
</header>

<style>
  /* You can add additional styles here if needed */
  a {
    text-decoration: none;
  }
  a:hover {
    color: #ccccccaf;
  }
</style>
