<style>
.text-green {
    color: #0f0;
}
</style>

<template>
    <div>
        <span class="text-green">message:</span> <input v-model="msg" type="text">
        <HelloComponent :msg="msg" :initialEnthusiasm="5" />
    </div>
</template>

<script lang="ts">
import Vue from "vue";
import HelloComponent from "./components/hello.vue";

export default Vue.extend({
    data(){ 
        return { 
            msg: "Hello Word!" 
        }
    },
    props: ['bus'],
    components: {
        HelloComponent
    },
    methods: {
        say(times: string){
            console.log(this.msg, times)
        }
    },
    mounted() {
        this.bus.$on('say', this.say)
    },
});
</script>
