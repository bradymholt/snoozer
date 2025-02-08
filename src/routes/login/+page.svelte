<script lang="ts">
  import google from "$lib/images/google.svg";
</script>

<div class="login-screen">
  <main class="login-content">
    <h1>Snoozer</h1>
    <button class="btn btn-google">
      <a href="/login/google">
        <img class="img-google" src={google} alt="Login with Google" />
        <span> Sign in with Google </span>
      </a>
    </button>
  </main>
</div>

<style>
  .login-screen {
    display: flex;
    justify-content: center;
    align-items: center;
    height: 100vh;
  }

  h1 {
    text-align: center;
  }

  .btn-google {
    color: #545454;
    background-color: #ffffff;
    box-shadow: 0 1px 2px 1px #ddd;
    width: 280px;
    padding: 0;
  }

  .btn-google a {
    padding: 10px;
    color: #000;
    text-decoration: none;
    display: inline-block;
    width: 100%;
  }

  .btn-google:hover {
    background-color: #f1f1f1;
  }

  .img-google {
    width: 24px;
  }
</style>
