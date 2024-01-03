<script>
  let email = "";
  let password = "";
  let isLogin = true; // To toggle between login and signup forms

  const handleSubmit = async () => {
    // You would implement actual authentication logic here
    if (isLogin) {
      // Login logic
      console.log(`Logging in with email: ${email} and password: ${password}`);
    } else {
      // Signup logic
      console.log(`Signing up with email: ${email} and password: ${password}`);
    }
  };
</script>

<main>
  <h1>{isLogin ? "Login" : "Sign Up"}</h1>

  <form on:submit|preventDefault={handleSubmit}>
    <label>
      Email:
      <input type="email" bind:value={email} />
    </label>

    <label>
      Password:
      <input type="password" bind:value={password} />
    </label>

    <button type="submit">{isLogin ? "Login" : "Sign Up"}</button>
  </form>

  <button on:click={() => (isLogin = !isLogin)}>
    {isLogin
      ? "Don't have an account? Sign up!"
      : "Already have an account? Log in!"}
  </button>
</main>

<style>
  main {
    max-width: 400px;
    margin: 0 auto;
    padding: 2rem;
    text-align: center;
  }

  form {
    display: flex;
    flex-direction: column;
    gap: 1rem;
  }

  label {
    display: block;
  }

  button {
    padding: 0.5rem;
    cursor: pointer;
  }

  p {
    color: #0070f3;
    cursor: pointer;
  }
</style>
