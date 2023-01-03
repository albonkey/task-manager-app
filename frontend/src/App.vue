<template>
  <div class="container bg-2">
    <Header />
    <div class="main bg-2">
      <RouterView />
    </div>
    
  </div> 
</template>

<script>
  import Header from './components/Header.vue'

  export default {
    name: 'App',
    components: {
      Header
    }
  }
</script>

<style>
  .container{
    font-family: sans-serif;
    padding-bottom: 50px;
  }
  .main{
    min-height: 92vh;
    padding: 15px 25px;
  }
  @media (min-width: 60rem) {
    .main{
      padding: 30px 50px;
    }
    
  }
</style>