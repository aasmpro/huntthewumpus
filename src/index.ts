import Vue from "vue";
import App from "./app.vue"

export let obj = new Vue({
    el:"#app",
    render: h => h(App)
})