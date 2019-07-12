<style>
</style>

<template>
    <div>
        <span>{{arrowsLeft}}</span>
        <table id="board">
            <tr v-for="i in width" :id="i-1">
                <td v-for="j in height"></td>
            </tr>
        </table>
        <span>{{feedback}}</span>
        <form id="movementControls" onsubmit="return false;">
            <p>Move</p>
            <table>
                <tr>
                    <td rowspan="3"><button v-on:click="move('left')">&lt;</button></td>
                    <td><button v-on:click="move('up')">^</button></td>
                    <td rowspan="3"><button v-on:click="move('right')">&gt;</button></td>
                </tr>
                <tr>
                    <td></td>
                </tr>
                <tr>
                    <td><button v-on:click="move('down')">v</button></td>
                </tr>
            </table>
        </form>
        <form id="arrowControls" onsubmit="return false;">
            <p>Shoot</p>
            <table>
                <tr>
                    <td rowspan="3"><button v-on:click="shoot('left')">&lt;</button></td>
                    <td><button v-on:click="shoot('up')">^</button></td>
                    <td rowspan="3"><button v-on:click="shoot('right')">&gt;</button></td>
                </tr>
                <tr>
                    <td></td>
                </tr>
                <tr>
                    <td><button v-on:click="shoot('down')">v</button></td>
                </tr>
            </table>
        </form>
    </div>
</template>

<script lang="ts">
import Vue from "vue";
import { GamePiece, GameBoard, Hero, Wumpus, Pit, Bats, Arrow, Feedback } from "./game"

export default Vue.extend({
    data(){
        return {
            width: 5 as number,
            height: 5 as number,
            arrowsLeft: 5 as number,
            feedback: "" as string,
            board: null as any,
            hero: null as any,
            pit: null as any,
            bats: null as any,
            wumpus: null as any,
            extraArrow: null as any,
        }
    },
    created(){
        this.init();
    },
    mounted() {
        // this.bus.$on('say', this.say),
        // this.bus.msg = this.msg
        this.move("standstill");
    },
    props: ['bus'],
    methods: {
        init(){
            this.width = 5;
            this.height = 5;
            this.arrowsLeft = 5;
            this.feedback = "";
            this.board = new GameBoard(this.width, this.height);
            this.hero = new Hero(this.board.getRandomEmptySpace());
            this.pit = new Pit(this.board.getRandomEmptySpace());
            this.bats = new Bats(this.board.getRandomEmptySpace());
            this.wumpus = new Wumpus(this.board.getRandomEmptySpace());
            this.extraArrow = new Arrow(this.board.getRandomEmptySpace());
            this.board.space[this.hero.x][this.hero.y] = this.hero.name;
        },

        updateArrows(amount: number) {
            this.arrowsLeft += amount;
        },

        end() {
            var dom: any = document.getElementById("movementControls")
            dom.style.display = "none";
            dom = document.getElementById("arrowControls")
            dom.style.display = "none";
        },

        win() {
            if (confirm("You WIN!!! New game?")) {
                this.init();
            } else {
                this.end();	
            }
        },

        lose() {
            this.feedback+="You are dead!";
            if (confirm("You lose! New game?")) {
                this.init();
            } else {
                this.end();
            }
        },

        checkTouch() {
            var isTouchingAnythingDangerous = false;
            if ( this.hero.isTouching(this.bats) ) {
                isTouchingAnythingDangerous = true;
                this.highlight(this.hero.x, this.hero.y);
                var point = this.board.getRandomSpace();
                this.hero.x = point.x;
                this.hero.y = point.y;
                
                this.move("standstill");
                this.feedback+=this.bats.touchingMessage;
            }
            if (this.hero.isTouching(this.pit)) {
                isTouchingAnythingDangerous = true;
                this.feedback+=this.pit.touchingMessage;
                this.lose();
            }
            if ( this.hero.isTouching(this.wumpus) ) {
                isTouchingAnythingDangerous = true;
                this.feedback+=this.wumpus.touchingMessage;
                this.lose();
            }
            if ( this.hero.isTouching(this.extraArrow) ) {
                this.updateArrows(1);
                this.extraArrow.x = -1;
                this.extraArrow.y = -1;
                this.feedback+=this.extraArrow.touchingMessage;
            }
            return isTouchingAnythingDangerous;
        },

        checkAdjacent() {
            if ( this.hero.isAdjacent(this.bats) ) this.feedback+=this.bats.adjacentMessage;
            if ( this.hero.isAdjacent(this.pit) ) this.feedback+=this.pit.adjacentMessage;
            if ( this.hero.isAdjacent(this.wumpus) ) this.feedback+=this.wumpus.adjacentMessage;
        },

        highlight(x: number, y:number, color: string = "pink") {
            var board: any = document.getElementById("board");
            var cells: any = board.getElementsByTagName("td");
            cells[x+y*board.getElementsByTagName("tr")[0].getElementsByTagName("td").length].style.backgroundColor=color;
        },

        shoot(dir: string) {
            if ( this.arrowsLeft > 0 ) {
                this.updateArrows(-1);
                var arrow = new Arrow({'x': this.hero.x, 'y': this.hero.y});
                arrow.move(dir, this.board);
                if ( arrow.isTouching(this.wumpus) ) {
                    this.feedback+="You WIN!!!";
                    this.win();
                } else {
                    this.wumpus.evade(this.randomDirection(), this);
                    this.move("standstill");
                    this.feedback+="Drats! Missed!";
                }
            } else {
                this.feedback+="Out of arrows!";	
            }
        },

        move(dir: string) {
            this.highlight(this.hero.x, this.hero.y);
            this.feedback = "";
            this.hero.move(dir, this);
            this.feedback+="You are at " + this.hero.x + "," + this.hero.y+"\n";
            this.highlight(this.hero.x, this.hero.y, "red");
            if (!this.checkTouch()) {
                this.checkAdjacent();
            }
        },

        randomDirection() {
            var dir: string = "standstill";
            var x = Math.ceil(Math.random()*5);
            switch (x) {
                case 1:
                    dir = "up";
                    break;
                case 2:
                    dir = "right";
                    break;
                case 3:
                    dir = "down";
                    break;
                case 4:
                    dir = "left";
                    break;
            }
            return dir;
        },


    },
});
</script>
