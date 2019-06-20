<style>
.greeting {
    font-size: 20px;
    color: rgb(255, 0, 0);
}
</style>

<template>
    <div>
        <div class="greeting">{{msg}}{{exclamationMarks}}</div>
        <button @click="decrement">-</button>
        <span>{{enthusiasm}}</span>
        <button @click="increment">+</button>
    </div>
</template>

<script lang="ts">
import Vue from "vue";

export default Vue.extend({
    props: ['msg', 'initialEnthusiasm'],
    data() {
        return {
            enthusiasm: this.initialEnthusiasm,
        }
    },
    methods: {
        increment() { this.enthusiasm++; },
        decrement() {
            if (this.enthusiasm > 0) {
                this.enthusiasm--;
            }
        },
    },
    computed: {
        exclamationMarks(): string {
            return Array(this.enthusiasm + 1).join('!');
        }
    }
});
</script>
