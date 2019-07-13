<style>
html {
    overflow-x: hidden;
}

body {
	font-family:Arial, Helvetica, sans-serif;
}

#board td {
    text-align: center;
	background-color:#ccc;
	height:50px;
	width:50px;
    border: 1px solid #fff;
}

#play-buttons {
    padding-top: 20px;
}

#play-buttons button {
    width: 40px;
    height: 40px;
    margin: 3px 22px;
}

textarea, textarea:focus, button:focus {
    border: none !important;
    box-shadow: none !important;
}
</style>

<template>
    <b-container class="my-5">
        <b-row align-h="center">
            <h2>Hunt The Wumpus</h2>
        </b-row>
        <b-row align-h="center">
            <table id="board" v-html="gameBoard()" v-on:click="show=!show">
                {{gameBoard()|html}}
            </table>
        </b-row>
        <b-row class="mt-3">
            <b-col md="4">
                <span>Arrows: {{arrowsLeft}}</span>
            </b-col>
            <b-col md="4">
                <span>Position: {{position}}</span>
            </b-col>
            <b-col md="4">
                <span>Sensors: {{sensors}}</span>
            </b-col>
        </b-row>
        <b-row class="mb-3">
            <b-col cols="12">
                <span>message: {{message}}</span>
            </b-col>
        </b-row>
        <b-row v-if="controls">
            <b-col cols="12">
                <b-tabs fill>
                    <b-tab title="Play" active>
                        <b-row id="play-buttons">
                            <b-col cols="6">
                                <b-row align-h="center">
                                    <b-button variant="primary" v-on:click="move('up')"><font-awesome-icon icon="chevron-up" /></b-button>
                                </b-row>
                                <b-row align-h="center" align-v="center">
                                    <b-button variant="primary" v-on:click="move('left')"><font-awesome-icon icon="chevron-up" rotation="270" /></b-button>
                                    <b-button variant="primary" v-on:click="move('right')"><font-awesome-icon icon="chevron-up" rotation="90" /></b-button>
                                </b-row>
                                <b-row align-h="center">
                                    <b-button variant="primary" v-on:click="move('down')"><font-awesome-icon icon="chevron-up" rotation="180" /></b-button>
                                </b-row>
                            </b-col>
                            <b-col cols="6">
                                <b-row align-h="center">
                                    <b-button variant="danger" v-on:click="shoot('up')"><font-awesome-icon icon="long-arrow-alt-up" /></b-button>
                                </b-row>
                                <b-row align-h="center" align-v="center">
                                    <b-button variant="danger" v-on:click="shoot('left')"><font-awesome-icon icon="long-arrow-alt-up" rotation="270" /></b-button>
                                    <b-button variant="danger" v-on:click="shoot('right')"><font-awesome-icon icon="long-arrow-alt-up" rotation="90" /></b-button>
                                </b-row>
                                <b-row align-h="center">
                                    <b-button variant="danger" v-on:click="shoot('down')"><font-awesome-icon icon="long-arrow-alt-up" rotation="180" /></b-button>
                                </b-row>
                            </b-col>
                        </b-row>
                        <b-row class="mt-3">
                            <b-col cols="12">
                                <p>You have 5 arrows to Hunt The Wumpus! an arrow can only hit the next square. there is an extra arrow left
                                on the map too. if you fall in a Pit or be eaten by Wumpus, you Lose. Bats will carry you to a random place 
                                that can be Wumpus or Pit too.<br>
                                You can sense Wumpus, Pit and Bats when you are in a square around them.<br>
                                Use <span class="text-primary">Blue</span> buttons for <span class="text-primary">moving</span> Hero, 
                                and <span class="text-danger">Red</span> buttons for <span class="text-danger">shooting</span> Arrows.<br>
                                <span class="text-danger">Cheat!</span> You can see items position by clicking map too. <code>H = Hero</code>, <code>W = Wumpus</code>,
                                <code>B = Bats</code>, <code>P = Pit</code> and <code>A = Extra Arrow</code></p>
                            </b-col>
                        </b-row>
                    </b-tab>
                    <b-tab title="Code">
                        <b-form-textarea
                            id="textarea-no-resize"
                            placeholder="Enter your code here"
                            rows="10"
                            no-resize
                            v-model="code"
                        ></b-form-textarea>
                        <b-button block variant="primary" v-on:click="runCode()">Run</b-button>
                        <div class="mt-3">
                            <p>You can write a JS code to play game too! For moving Hero:<br>
                            <code>game.obj.moveUp()</code><br>
                            <code>game.obj.moveRight()</code><br>
                            <code>game.obj.moveDown()</code><br>
                            <code>game.obj.moveLeft()</code><br>
                            For shooting Arrow:<br>
                            <code>game.obj.shootUp()</code><br>
                            <code>game.obj.shootRight()</code><br>
                            <code>game.obj.shootDown()</code><br>
                            <code>game.obj.shootLeft()</code><br>
                            And for getting Game Data:<br>
                            <code>game.obj.arrows</code><br>
                            <code>game.obj.sensors</code><br>
                            <code>game.obj.position</code><br>
                            <code>game.obj.message</code><br>
                            Also these functions and properties are accessible in browser console too.</p>
                        </div>
                    </b-tab>
                </b-tabs>
            </b-col>
        </b-row>
        <b-row v-if="!controls">
            <b-col cols="12">
                <b-button block variant="primary" v-on:click="reload()">Play Again</b-button>
            </b-col>
        </b-row>
    </b-container>
</template>

<script lang="ts">
import Vue from "vue";
import { GamePiece, GameBoard, Hero, Wumpus, Pit, Bats, Arrow } from "./game";

export default Vue.extend({
    data(){
        return {
            code: "" as string,
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
    },
    props: ['bus'],
    methods: {
        runCode: function(){
            eval(this.code);
        },

        gameBoard: function() {
            var table: string="";
            for(var i=0; i<this.width; i++){
                table += "<tr>";
                for(var j=0; j<this.height; j++){
                        if(this.board.space[j][i].includes('H')){
                            table += "<td style=\"background-color: #007bff;\">";
                        } else if(this.board.space[j][i].includes('X')){
                            table += "<td style=\"background-color: #dc3545;\">";
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
            this.message = "Win! You Hunted The Wumpus!";
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
                    this.message = "Out of arrows! But still there is one on map!";
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
