import Vue from "vue";
import App from "./app.vue"

export let obj = new Vue({
    el:"#app",
    data:{
        bus: new Vue(),
    },
    template: `
    <App :bus="bus" />
    `,
    components: {
        App,
    },
    methods: {
        say(times: string){
            this.bus.$emit('say', times);
        }
    }
})