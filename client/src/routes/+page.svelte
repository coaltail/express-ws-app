<script>
  let email = "";
  let password = "";

  function login() {
    // Perform login logic here
    console.log("Logging in...");
  }
</script>

<div class="container">
  <h1 class="logo">Login</h1>
  <form class="form" on:submit|preventDefault={login}>
    <input class="input" type="email" placeholder="Email" bind:value={email} />
    <input
      class="input"
      type="password"
      placeholder="Password"
      bind:value={password}
    />
    <button class="button" type="submit">Login</button>
    <button class="button" type="button" on:click={register}>Register</button>
  </form>
</div>

<style lang="postcss">
  :global(html) {
    background-color: theme(colors.gray.100);
  }

  .container {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    height: 100vh;
  }

  .logo {
    font-size: 3rem;
    font-weight: bold;
    margin-bottom: 2rem;
    color: #333;
    text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.3);
  }

  .form {
    display: flex;
    flex-direction: column;
    gap: 1.5rem;
    width: 350px;
    padding: 2rem;
    background-color: #f5f5f5;
    border-radius: 8px;
    box-shadow: 0px 2px 4px rgba(0, 0, 0, 0.1);
  }

  .input {
    padding: 1rem;
    border: none;
    border-radius: 4px;
    background-color: #f9f9f9;
    box-shadow: 0px 2px 4px rgba(0, 0, 0, 0.1);
  }

  .button {
    padding: 1rem 2rem;
    background-color: #007bff;
    color: white;
    border: none;
    border-radius: 4px;
    cursor: pointer;
    box-shadow: 0px 2px 4px rgba(0, 0, 0, 0.1);
  }
</style>
