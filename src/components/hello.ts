import Vue from "vue";

export default Vue.extend({
    template: `
        <div>
            <div>{{msg}}{{exclamationMarks}}</div>
            <button @click="decrement">-</button>
            <span>{{enthusiasm}}</span>
            <button @click="increment">+</button>
        </div>
    `,
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