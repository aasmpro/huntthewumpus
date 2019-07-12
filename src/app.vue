<style>
body {
	font-family:Arial, Helvetica, sans-serif;
	font-size:small;
}

#board, #board1 {
	background-color:#999;
}

#board td, #board1 td {
    text-align: center;
	background-color:#ccc;
	height:50px;
	width:50px;
}

.red {
    backgroundColor: red !import;
}

.pink {
    backgroundColor: pink !import;
}
</style>

<template>
    <div>
        <table id="board1" v-html="gameBoard()">
            {{gameBoard()|html}}
        </table>
        <table id="board" :key="render">
            <tr v-for="i in width">
                <td v-for="j in height"></td>
            </tr>
        </table>
        <button v-on:click="help=!help">help</button>
        <p>Arrows Left : {{arrowsLeft}}</p>
        <span>{{feedback}}</span>
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
            help: true as boolean,
            render: 0 as number,
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
                        if(this.help){
                            table += this.board.space[j][i];
                        }
                    table += "</td>"
                }
                table += "</tr>";
            }
            return table
        },

        forceRender() {
            this.render += 1;
        },

        init(){
            this.width = 5;
            this.height = 5;
            this.arrowsLeft = 5;
            this.feedback = "";
            this.board = new GameBoard(this.width, this.height);
            this.hero = new Hero(this.board.getRandomEmptySpace("H"));
            this.pit = new Pit(this.board.getRandomEmptySpace("P"));
            this.bats = new Bats(this.board.getRandomEmptySpace("B"));
            this.wumpus = new Wumpus(this.board.getRandomEmptySpace("W"));
            this.extraArrow = new Arrow(this.board.getRandomEmptySpace("A"));
        },

        reload() {
            this.init();
            this.forceRender();
            this.move("standstill");
            this.controls = true;
        },

        win() {
            this.feedback = "Win! You Hunted The Wumpus :)";
            this.controls = false;
        },

        lose() {
            this.feedback = "Lose! The Wumpus Hunted You :(";
            this.controls = false;
        },

        checkTouch() {
            var isTouchingAnythingDangerous = false;
            if ( this.hero.isTouching(this.bats) ) {
                isTouchingAnythingDangerous = true;
                this.highlight(this.hero.x, this.hero.y);
                var point = this.board.getRandomEmptySpace();
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
                this.arrowsLeft += 1;
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
                this.arrowsLeft -= 1;
                var arrow = new Arrow({'x': this.hero.x, 'y': this.hero.y});
                arrow.move(dir, this.board);
                if ( arrow.isTouching(this.wumpus) ) {
                    this.win();
                } else {
                    this.move("standstill");
                    this.feedback+="Arrow Missed!";
                }
            } else {
                this.feedback+="Out of arrows!";	
            }
        },

        move(dir: string) {
            this.highlight(this.hero.x, this.hero.y);
            this.feedback = "";
            this.hero.move(dir, this.board);
            this.feedback+="You are at " + this.hero.x + "," + this.hero.y + "\n";
            this.board.space[this.hero.x][this.hero.y] = "H";
            this.highlight(this.hero.x, this.hero.y, "red");
            if (!this.checkTouch()) {
                this.checkAdjacent();
            }
        },
    },
});
</script>
