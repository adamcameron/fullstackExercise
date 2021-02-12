<template>
    <greeting-message :message="message"></greeting-message>
</template>

<script>
import GreetingMessage from './components/GreetingMessage.vue'

export default {
    name: 'App',
    components: {
        GreetingMessage
    },
    data () {
        return {
            message: "G'day world via Vue"
        };
    },
    created () {
        document.title = this.message;
    }
}
</script>
