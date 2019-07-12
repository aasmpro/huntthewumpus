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

export { GamePiece, GameBoard, Hero, Wumpus, Pit, Bats, Arrow }