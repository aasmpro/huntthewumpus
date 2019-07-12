<style>
body {
	font-family:Arial, Helvetica, sans-serif;
	font-size:small;
}

#board td {
    text-align: center;
	background-color:#ccc;
	height:50px;
	width:50px;
}
</style>

<template>
    <div>
        <table id="board" v-html="gameBoard()">
            {{gameBoard()|html}}
        </table>
        <button v-on:click="show=!show">
            <span v-if="!show">Show</span>
            <span v-if="show">Hide</span>
        </button>
        <p>Arrows: {{arrowsLeft}}</p>
        <p>Position: {{position}}</p>
        <p>Sensors: {{sensors}}</p>
        <p>message: {{message}}</p>
        <div v-if="controls">
            <form onsubmit="return false;">
                <table>
                    <tr>
                        <td rowspan="3"><button v-on:click="move('left')">&lt;</button></td>
                        <td><button v-on:click="move('up')">^</button></td>
                        <td rowspan="3"><button v-on:click="move('right')">&gt;</button></td>
                    </tr>
                    <tr>
                        <td style="text-align: center">Move</td>
                    </tr>
                    <tr>
                        <td><button v-on:click="move('down')">v</button></td>
                    </tr>
                </table>
            </form>
            <form onsubmit="return false;">
                <table>
                    <tr>
                        <td rowspan="3"><button v-on:click="shoot('left')">&lt;</button></td>
                        <td><button v-on:click="shoot('up')">^</button></td>
                        <td rowspan="3"><button v-on:click="shoot('right')">&gt;</button></td>
                    </tr>
                    <tr>
                        <td style="text-align: center">Shoot</td>
                    </tr>
                    <tr>
                        <td><button v-on:click="shoot('down')">v</button></td>
                    </tr>
                </table>
            </form>
        </div>
        <div v-if="!controls">
            <button v-on:click="reload()">Play Again</button>
        </div>
    </div>
</template>

<script lang="ts">
import Vue from "vue";
import { GamePiece, GameBoard, Hero, Wumpus, Pit, Bats, Arrow } from "./game"

export default Vue.extend({
    data(){
        return {
            controls: true as boolean,
            show: false as boolean,
            width: 5 as number,
            height: 5 as number,
            position: "" as string,
            sensors: "" as string,
            arrowsLeft: 5 as number,
            message: "" as string,
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
        this.bus.$on('move', this.move);
        this.bus.$on('shoot', this.shoot);
        this.bus.$on('message', () => { return this.message});
        this.bus.sensors = this.sensors;
        this.bus.position = this.position;
        this.bus.arrowsLeft = this.arrowsLeft;
    },
    props: ['bus'],
    methods: {
        gameBoard: function () {
            var table: string="";
            for(var i=0; i<this.width; i++){
                table += "<tr>";
                for(var j=0; j<this.height; j++){
                        if(this.board.space[j][i].includes('H')){
                            table += "<td style=\"background-color: red;\">";
                        } else if(this.board.space[j][i].includes('X')){
                            table += "<td style=\"background-color: pink;\">";
                        } else {
                            table += "<td>"
                        }
                        if(this.show){
                            table += this.board.space[j][i].replace("X", "");
                        }
                    table += "</td>"
                }
                table += "</tr>";
            }
            return table
        },

        init(){
            this.width = 5;
            this.height = 5;
            this.arrowsLeft = 5;
            this.message = "";
            this.position = "";
            this.sensors = "";
            this.board = new GameBoard(this.width, this.height);
            this.hero = new Hero(this.board.getRandomEmptySpace("H"));
            this.pit = new Pit(this.board.getRandomEmptySpace("P"));
            this.bats = new Bats(this.board.getRandomEmptySpace("B"));
            this.wumpus = new Wumpus(this.board.getRandomEmptySpace("W"));
            this.extraArrow = new Arrow(this.board.getRandomEmptySpace("A"));
            this.move("Stand");
        },

        reload() {
            this.init();
            this.controls = true;
        },

        win() {
            this.message = "Win! You Hunted The Wumpus :)";
            this.controls = false;
        },

        lose() {
            this.controls = false;
        },

        checkTouch() {
            var isTouchingAnythingDangerous = false;
            if ( this.hero.isTouching(this.bats) ) {
                isTouchingAnythingDangerous = true;
                this.board.space[this.hero.x][this.hero.y] = "BX";
                var point = this.board.getRandomSpace();
                this.hero.x = point.x;
                this.hero.y = point.y;
                this.move("standstill");
                this.message += this.bats.touchingMessage;
            }
            if (this.hero.isTouching(this.pit)) {
                isTouchingAnythingDangerous = true;
                this.message = this.pit.touchingMessage;
                this.lose();
            }
            if ( this.hero.isTouching(this.wumpus) ) {
                isTouchingAnythingDangerous = true;
                this.message = this.wumpus.touchingMessage;
                this.lose();
            }
            if ( this.hero.isTouching(this.extraArrow) ) {
                this.arrowsLeft += 1;
                this.extraArrow.x = -1;
                this.extraArrow.y = -1;
                this.message+=this.extraArrow.touchingMessage;
            }
            return isTouchingAnythingDangerous;
        },

        shoot(dir: string) {
            if( this.arrowsLeft > 0 ) {
                this.arrowsLeft -= 1;
                var arrow = new Arrow({'x': this.hero.x, 'y': this.hero.y});
                arrow.move(dir, this.width, this.height);
                if ( arrow.isTouching(this.wumpus) ) {
                    this.win();
                } else {
                    if( this.extraArrow.x == -1 && this.arrowsLeft == 0) {
                        this.message = "Lose! No more arrows for hunting Wumpus!";
                        this.lose();
                    } else {
                        this.message = "Arrow missed!";
                    }
                }
            } else {
                if( this.extraArrow.x == -1 ) {
                    this.message = "Lose! No more arrows for hunting Wumpus!";
                    this.lose();
                } else {
                    this.message = "Out of arrows! But still there is one on board!";
                }
            }
        },

        move(dir: string) {
            this.board.space[this.hero.x][this.hero.y] = "X";
            this.message = "";
            this.sensors = "";
            this.hero.move(dir, this.width, this.height);
            this.position = this.hero.x + "," + this.hero.y;
            this.board.space[this.hero.x][this.hero.y] = "H";
            if (!this.checkTouch()) {
                if ( this.hero.isAdjacent(this.bats) ) this.sensors+=this.bats.adjacentMessage;
                if ( this.hero.isAdjacent(this.pit) ) this.sensors+=this.pit.adjacentMessage;
                if ( this.hero.isAdjacent(this.wumpus) ) this.sensors+=this.wumpus.adjacentMessage;
            }
            this.$emit('updateData', this.arrowsLeft, this.position, this.sensors, this.message)
        },
    },
});
</script>
