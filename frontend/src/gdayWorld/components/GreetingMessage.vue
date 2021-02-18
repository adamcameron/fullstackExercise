<template>
    <h1>{{ message }}</h1>
    <p>{{ message }}</p>
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
