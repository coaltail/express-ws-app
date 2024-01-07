<script>
  import { onDestroy } from "svelte";
  import Footer from "../../components/Footer.svelte";
  import Header from "../../components/Header.svelte";
  import { user } from "../../stores/user.js";
  let email = "";
  let password = "";
  let err = "";
  let u_value;
  let unsubscribe = user.subscribe((u) => (u_value = u));
  user.subscribe((value) => {
    u_value = value;
  });
  const login = async () => {
    const response = await fetch("http://localhost:3000/api/auth/login", {
      method: "POST",
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email, password }),
      withCredentials: true,
      credentials: "include",
    });

    if (response.ok) {
      const userData = await response.json();
      console.log(userData.user);
      user.update((u) => {
        u = JSON.stringify(userData.user);
      });
    } else {
      err = "Login failed. Please try again.";
    }
  };
  onDestroy(() => {
    unsubscribe();
  });
</script>

<Header />
<main
  class="flex flex-col items-center justify-center min-h-screen bg-gray-100"
>
  <div class="max-w-md w-full px-6 py-8 bg-white shadow-md rounded-md">
    <h2 class="text-2xl font-semibold text-center">Login</h2>
    <form class="mt-8 space-y-6" on:submit|preventDefault={login}>
      <div>
        {#if err}
          <p class="text-red-500 text-xs italic">{{ err }}</p>
        {/if}
        <label
          for="username"
          class="block text-sm font-medium text-gray-700 float-left"
          >Email:</label
        >
        <input
          type="text"
          id="username"
          name="username"
          class="mt-1 focus:ring-indigo-500 focus:border-indigo-500 block w-full h-10 px-3 py-2 border-gray-300 rounded-md shadow-sm sm:text-sm"
          bind:value={email}
          required
        />
      </div>
      <div>
        <label
          for="password"
          class="block text-sm font-medium text-gray-700 float-left"
          >Password:</label
        >
        <input
          type="password"
          id="password"
          name="password"
          class="mt-1 focus:ring-indigo-500 focus:border-indigo-500 block w-full h-10 px-3 py-2 border-gray-300 rounded-md shadow-sm sm:text-sm"
          bind:value={password}
          required
        />
      </div>
      <div>
        <button
          type="submit"
          class="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
        >
          Login
        </button>
      </div>
    </form>
  </div>
</main>
<Footer />

<style>
  main {
    text-align: center;
    padding: 20px;
  }
</style>
