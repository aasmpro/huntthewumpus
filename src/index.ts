
import Vue from "vue";
import HelloComponent from "./components/hello";

let obj = new Vue({
    el: "#app",
    template: `
    <div>
        message: <input v-model="msg" type="text">
        <HelloComponent :msg="msg" :initialEnthusiasm="5" />
    </div>
    `,
    data: { msg: "Hello Word!" },
    components: {
        HelloComponent
    },
    methods: {
        say(){
            console.log(this.msg)
        }
    }
});

export {obj,}
