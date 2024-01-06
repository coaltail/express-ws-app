<script>
  import { onMount } from "svelte";
  import Header from "../components/Header.svelte";
  import Footer from "../components/Footer.svelte";
  onMount(() => {
    // Add any initialization logic here
  });
</script>

<Header></Header>
<main>
  <div class="flex flex-col items-center justify-center h-screen bg-gray-100">
    <h1 class="text-4xl font-bold mb-4">Welcome to Social Media App</h1>
    <p class="text-lg text-gray-600 mb-8">
      Connect with friends and share your moments
    </p>
    <button class="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
      >Get Started</button
    >
  </div>
</main>
<Footer></Footer>

<style>
  /* Add your custom styles here */
</style>
