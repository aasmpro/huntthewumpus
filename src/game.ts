class GamePiece {
    name: string;
    adjacentMessage: string;
    touchingMessage: string;
    x: number;
    y: number;
    
    constructor(name: string, point: {x:number, y:number}, adjacentMessage: string, touchingMessage: string) {
        this.name = name;
        this.adjacentMessage = adjacentMessage;
        this.touchingMessage = touchingMessage;
        this.x = point.x;
        this.y = point.y;
    }

    isAdjacent(gamePiece: GamePiece) {
        if ( Math.abs(this.x - gamePiece.x) <=1 && Math.abs(this.y - gamePiece.y) <=1 ) {
            return true;
        } else {
            return false;
        }
    }

    isTouching(gamePiece: GamePiece) {
        if ( this.x == gamePiece.x &&  this.y == gamePiece.y ) {
            return true;
        } else {
            return false;
        }
    }

    move(dir: string, board: GameBoard) {
        switch(dir) {
            case "left":
                if ( this.x > 0 ) this.x--;
                break;
            case "up":
                if ( this.y > 0 ) this.y--;
                break;
            case "right":
                if ( this.x < board.space.length-1 ) this.x++;
                break;
            case "down":
                if ( this.y < board.space[0].length-1 ) this.y++;
                break;
            default:
                break;
        }
    }
}

class Wumpus extends GamePiece {
    constructor(point: {x:number, y:number}){
        super("Wumpus", point, "Wumpus", "You have been eaten by a wumpus!")
    }

    evade(dir: string, game: Game) {
        this.move(dir, game.board);
        if ( this.isTouching(game.hero) ) {
            this.evade(randomDirection(), game);
        }
    }
}

class Bats extends GamePiece {
    constructor(point: {x: number, y:number}){
        super("Bats", point, "Bats", "Bats carried you away!")
    }
}

class Pit extends GamePiece {
    constructor(point: {x:number, y:number}){
        super("Pit", point, "Pit", "You fell down a pit!")
    }
}

class Hero extends GamePiece {
    arrows: number = 5;
    constructor(point: {x:number, y:number}){
        super("Hero",point,"","")
    }
}

class Arrow extends GamePiece {
    constructor(point: {x:number, y:number}){
        super("Arrow",point,"","You found an arrow!")
    }
}

class Feedback {
    public message: string = "";
    
    addMessage(message: string) {
        this.message += message;
    }

    clear() {
        this.message = "";
    }
}

class GameBoard {
    space: Array<Array<string>>;

    constructor(x: number, y: number){
        this.space = new Array(x);
        for ( var i = 0; i < y; i++ ) {
            this.space[i] = new Array(y);
        }
    }

    getRandomPoint() {
        return { "x":Math.floor(Math.random()*this.space.length), "y":Math.floor(Math.random()*this.space[0].length) };
    }

    getRandomSpace() {
        var point = this.getRandomPoint();
        this.space[point.x][point.y] = "occupied";
        return point;
    }

    getRandomEmptySpace(): any {
        var point = this.getRandomPoint();
        if ( this.space[point.x][point.y] == undefined ) {
            this.space[point.x][point.y] = "occupied";
            return { "x":point.x, "y":point.y };
        } else {
            return this.getRandomEmptySpace();
        }
    }
}

export { GamePiece, GameBoard, Hero, Wumpus, Pit, Bats, Arrow, Feedback }

class Game {
    width: number;
    height: number;
    arrowsLeft: number;
    feedback: Feedback;
    board: GameBoard;
    hero: Hero;
    pit: Pit;
    bats: Bats;
    wumpus: Wumpus; 
    extraArrow: Arrow;
    
    constructor(){
        this.width = 5;
        this.height = 5;
        this.arrowsLeft = 5;
        this.feedback = new Feedback();
        this.board = buildBoard(this.width,this.height);
        this.hero = new Hero(this.board.getRandomEmptySpace());
        this.pit = new Pit(this.board.getRandomEmptySpace());
        this.bats = new Bats(this.board.getRandomEmptySpace());
        this.wumpus = new Wumpus(this.board.getRandomEmptySpace());
        this.extraArrow = new Arrow(this.board.getRandomEmptySpace());
        this.board.space[this.hero.x][this.hero.y] = this.hero.name;
        move("standstill", this);
    }

    init(){
        this.width = 5;
        this.height = 5;
        this.arrowsLeft = 5;
        this.feedback = new Feedback();
        this.board = buildBoard(this.width,this.height);
        this.hero = new Hero(this.board.getRandomEmptySpace());
        this.pit = new Pit(this.board.getRandomEmptySpace());
        this.bats = new Bats(this.board.getRandomEmptySpace());
        this.wumpus = new Wumpus(this.board.getRandomEmptySpace());
        this.extraArrow = new Arrow(this.board.getRandomEmptySpace());
        this.board.space[this.hero.x][this.hero.y] = this.hero.name;
        move("standstill", this);
    }

    updateArrows(amount: number) {	
        this.arrowsLeft += amount;
        var dom: any = document.getElementById("arrowsLeft")
        dom.innerHTML = this.arrowsLeft.toString();
    }

    win() {
        if (confirm("You WIN!!! New game?")) {
            this.init();
        } else {
            this.end();	
        }
    }

    lose() {
        this.feedback.addMessage("You are dead!");
        if (confirm("You lose! New game?")) {
            this.init();
        } else {
            this.end();
        }
    }
    
    end() {
        var dom: any = document.getElementById("movementControls")
        dom.style.display = "none";
        dom = document.getElementById("arrowControls")
        dom.style.display = "none";
    }
}

function checkTouch(game: Game) {
	var isTouchingAnythingDangerous = false;
	if ( game.hero.isTouching(game.bats) ) {
		isTouchingAnythingDangerous = true;
		highlight(game.hero.x,game.hero.y);
		var point = game.board.getRandomSpace();
		game.hero.x = point.x;
		game.hero.y = point.y;
		
		move("standstill", game);
		game.feedback.addMessage(game.bats.touchingMessage);
	}
	if ( game.hero.isTouching(game.pit) ) {
		isTouchingAnythingDangerous = true;
		game.feedback.addMessage(game.pit.touchingMessage);
		game.lose();
	}
	if ( game.hero.isTouching(game.wumpus) ) {
		isTouchingAnythingDangerous = true;
		game.feedback.addMessage(game.wumpus.touchingMessage);
		game.lose();
	}
	if ( game.hero.isTouching(game.extraArrow) ) {
		game.updateArrows(1);
		game.extraArrow.x = -1;
		game.extraArrow.y = -1;
		game.feedback.addMessage(game.extraArrow.touchingMessage);
	}
	return isTouchingAnythingDangerous;
}

function checkAdjacent(game: Game) {
	if ( game.hero.isAdjacent(game.bats) ) game.feedback.addMessage(game.bats.adjacentMessage);
	if ( game.hero.isAdjacent(game.pit) ) game.feedback.addMessage(game.pit.adjacentMessage);
	if ( game.hero.isAdjacent(game.wumpus) ) game.feedback.addMessage(game.wumpus.adjacentMessage);
}

function highlight(x: number, y:number, color: string = "pink") {
    var board: any = document.getElementById("gameBoard");
    var cells: any = board.getElementsByTagName("td");
	cells[x+y*board.getElementsByTagName("tr")[0].getElementsByTagName("td").length].style.backgroundColor=color;
}

function shoot(dir: string, game: Game) {
	if ( game.arrowsLeft > 0 ) {
		game.updateArrows(-1);
		var arrow = new Arrow({'x': game.hero.x, 'y': game.hero.y});
		arrow.move(dir, game.board);
		if ( arrow.isTouching(game.wumpus) ) {
			game.feedback.addMessage("You WIN!!!");
			game.win();
		} else {
			game.wumpus.evade(randomDirection(), game);
			move("standstill", game);
			game.feedback.addMessage("Drats! Missed!");
		}
	} else {
		game.feedback.addMessage("Out of arrows!");	
	}
}

function move(dir: string, game: Game) {
	highlight(game.hero.x,game.hero.y);
	game.feedback.clear();
	game.hero.move(dir, game.board);
	game.feedback.addMessage("You are at " + game.hero.x + "," + game.hero.y);
	highlight(game.hero.x,game.hero.y,"red");
	if ( !checkTouch(game) ) {
		checkAdjacent(game);
	}
}

function randomDirection() {
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
}

function buildBoard(x: number, y:number) {
	var boardHTML = '<table id="board">';
	for ( var i = 0; i < x; i++ ) {
		boardHTML += '<tr id="' + x + '">';
			for ( var j = 0; j < y; j++ ) {
				boardHTML += '<td></td>';
			}
		boardHTML += '</tr>';
	}
	
	boardHTML += '</table>';
    var dom: any = document.getElementById("gameBoard")
    dom.innerHTML = boardHTML;	
	
	return new GameBoard(x, y);
}