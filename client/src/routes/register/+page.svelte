<script>
  import Header from "../../components/Header.svelte";
  import Footer from "../../components/Footer.svelte";
  let username = "";
  let email = "";
  let password = "";
  let data;
  let errs = [];
  async function register() {
    const res = await fetch("http://localhost:3000/api/auth/register", {
      method: "POST",
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ username, email, password }),
      withCredentials: true,
      credentials: "include",
    })
      .catch((err) => console.log("Errors are: ", err))
      .then((res) => (data = res.json()))
      .finally(window.location.replace("/"));
    errs = res.errors;
  }
  console.log(data);
</script>

<Header></Header>
<main
  class="flex flex-col items-center justify-center min-h-screen bg-gray-100"
>
  <div class="max-w-md w-full px-6 py-8 bg-white shadow-md rounded-md">
    <h2 class="text-2xl font-semibold text-center">Register</h2>
    <form class="mt-8 space-y-6" on:submit|preventDefault={register}>
      {#if errs}
        {#each errs as err}
          <p class="text-red-500 text-xs italic">{err.msg}</p>
        {/each}
      {/if}
      <div>
        <label for="username" class="block text-sm font-medium text-gray-700"
          >Username</label
        >
        <input
          type="text"
          id="username"
          class="mt-1 focus:ring-indigo-500 focus:border-indigo-500 block w-full h-10 px-3 py-2 border-gray-300 rounded-md shadow-sm sm:text-sm"
          bind:value={username}
          required
        />
      </div>
      <div>
        <label for="email" class="block text-sm font-medium text-gray-700"
          >Email</label
        >
        <input
          type="email"
          id="email"
          class="mt-1 focus:ring-indigo-500 focus:border-indigo-500 block w-full h-10 px-3 py-2 border-gray-300 rounded-md shadow-sm sm:text-sm"
          bind:value={email}
          required
        />
      </div>
      <div>
        <label for="password" class="block text-sm font-medium text-gray-700"
          >Password</label
        >
        <input
          type="password"
          id="password"
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
          Register
        </button>
      </div>
    </form>
  </div>
</main>
<Footer></Footer>
