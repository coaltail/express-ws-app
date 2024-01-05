<script>
  import Footer from "../../components/Footer.svelte";
  import Header from "../../components/Header.svelte";
  let email = "";
  let password = "";
  let err = "";
  const login = async () => {
    await fetch("http://localhost:3000/api/auth/login", {
      method: "POST",
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email, password }),
      withCredentials: true,
      credentials: "include",
    });
  };
</script>

<Header />
<main class="flex flex-col items-center justify-center min-h-screen">
  <section class="bg-gray-100 p-8 rounded-md shadow-md w-96">
    <h2 class="text-2xl font-bold mb-4">Login</h2>

    <!-- Your login form goes here -->
    <form on:submit={login}>
      <!-- Add your form fields, labels, and buttons here -->
      <div class="mb-4">
        {#if err}
          <p class="text-red-500 text-xs italic">{{ err }}</p>
        {/if}
        <label for="username" class="block text-sm font-medium text-gray-600"
          >Email:</label
        >
        <input
          type="text"
          id="username"
          name="username"
          class="mt-1 p-2 border rounded-md w-full"
          bind:value={email}
        />
      </div>

      <div class="mb-4">
        <label for="password" class="block text-sm font-medium text-gray-600"
          >Password:</label
        >
        <input
          type="password"
          id="password"
          name="password"
          class="mt-1 p-2 border rounded-md w-full"
          bind:value={password}
        />
      </div>

      <button
        type="submit"
        class="bg-blue-500 text-white p-2 rounded-md hover:bg-blue-600"
        >Login</button
      >
    </form>
  </section>
</main>
<Footer />

<style>
  main {
    text-align: center;
    padding: 20px;
  }
</style>
