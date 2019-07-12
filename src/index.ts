import Vue from "vue";
import App from "./app.vue"

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