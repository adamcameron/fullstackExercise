<template>
  <div>
    <h1>{{ message }}</h1>
    <p>{{ message }}</p>
  </div>
</template>

<script>
export default {
  name: 'GreetingMessage',
  props : {
    message : {
      type: String,
      required: true
    }
  }
}
</script>
