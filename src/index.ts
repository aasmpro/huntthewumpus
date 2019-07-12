import Vue from "vue";
import App from "./app.vue"

import BootstrapVue from 'bootstrap-vue'
import 'bootstrap/dist/css/bootstrap.css'
import 'bootstrap-vue/dist/bootstrap-vue.css'

Vue.use(BootstrapVue)

import { library } from '@fortawesome/fontawesome-svg-core';
import { faChevronUp, faLongArrowAltUp, faEye, faEyeSlash } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';
library.add(faChevronUp, faLongArrowAltUp, faEye, faEyeSlash)
Vue.component('font-awesome-icon', FontAwesomeIcon)
Vue.config.productionTip = false

export let obj = new Vue({
    el:"#app",
    data:{
        bus: new Vue(),
        arrowsLeft: 0 as number,
        sensors: "" as string,
        position: "" as string,
        message: "" as string
    },
    template: `
    <App :bus="bus" @updateData="updateData" />
    `,
    components: {
        App,
    },
    methods: {
        moveUp(){this.bus.$emit('move', "up")},
        moveDown(){this.bus.$emit('move', "down")},
        moveLeft(){this.bus.$emit('move', "left")},
        moveRight(){this.bus.$emit('move', "right")},

        shootUp(){this.bus.$emit('shoot', "up")},
        shootDown(){this.bus.$emit('shoot', "down")},
        shootLeft(){this.bus.$emit('shoot', "left")},
        shootRight(){this.bus.$emit('shoot', "right")},

        updateData(arrowsLeft: number, position: string, sensors: string, message: string){
            this.arrowsLeft = arrowsLeft;
            this.position = position;
            this.sensors = sensors;
            this.message = message;
        }
    }
})