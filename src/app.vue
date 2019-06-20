<style>
.text-green {
    color: #0f0;
}
</style>

<template>
    <div>
        <span class="text-green">message:</span> <input v-model="msg" type="text">
        <HelloComponent ref="hello" :msg="msg" :initialEnthusiasm="5" />
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
    components: {
        HelloComponent
    },
    methods: {
        say(){
            console.log(this.msg)
        }
    }
});
</script>
