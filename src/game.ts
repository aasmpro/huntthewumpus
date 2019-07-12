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

    move(dir: string, boardX: number, boardY:number) {
        switch(dir) {
            case "left":
                if ( this.x > 0 ) this.x--;
                break;
            case "up":
                if ( this.y > 0 ) this.y--;
                break;
            case "right":
                if ( this.x < boardX ) this.x++;
                break;
            case "down":
                if ( this.y < boardY ) this.y++;
                break;
            default:
                break;
        }
    }
}

class Wumpus extends GamePiece {
    constructor(point: {x:number, y:number}){
        super("Wumpus", point, "Wumpus, ", "Lose! The Wumpus hunted you! ")
    }
}

class Bats extends GamePiece {
    constructor(point: {x: number, y:number}){
        super("Bats", point, "Bats, ", "Bats carried you away! ")
    }
}

class Pit extends GamePiece {
    constructor(point: {x:number, y:number}){
        super("Pit", point, "Pit, ", "Lose! You fell down a pit! ")
    }
}

class Hero extends GamePiece {
    constructor(point: {x:number, y:number}){
        super("Hero",point,"","")
    }
}

class Arrow extends GamePiece {
    constructor(point: {x:number, y:number}){
        super("Arrow",point,"","You found an arrow! ")
    }
}

class GameBoard {
    space: Array<Array<string>>;

    constructor(x: number, y: number){
        this.space = new Array(x);
        for(var i = 0; i < y; i++) {
            this.space[i] = new Array(y);
            for(var j=0; j<x; j++){
                this.space[i][j] = "";
            }
        }
    }

    getRandomPoint() {
        return { "x":Math.floor(Math.random()*this.space.length), "y":Math.floor(Math.random()*this.space[0].length) };
    }

    getRandomSpace(value: string) {
        var point = this.getRandomPoint();
        this.space[point.x][point.y] = value;
        return point;
    }

    getRandomEmptySpace(value: string): any {
        var point = this.getRandomPoint();
        if ( this.space[point.x][point.y] === "" ) {
            this.space[point.x][point.y] = value;
            return { "x":point.x, "y":point.y };
        } else {
            return this.getRandomEmptySpace(value);
        }
    }
}

export { GamePiece, GameBoard, Hero, Wumpus, Pit, Bats, Arrow }