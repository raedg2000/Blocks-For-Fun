import { BaseBlock } from "./BaseBlock";
import { Game } from "./Game";
import { IBlock } from "./IBlock";
import { Position } from "./Position";

export class Block1 implements IBlock{

    private _row: number = 0;
    private _column: number = 0;

    private _topLeft : Position;
    private _topRight: Position;

    private _game : Game;
    private _color : string;
    private _colorIndex : number;

    private _block1 : BaseBlock;
    
    private _width : number = BaseBlock.WIDTH;
    private _height : number = BaseBlock.WIDTH;

    private _cannotMove = false;

    constructor(game : Game, colorIndex: number, color:string){
       
        this._colorIndex = colorIndex;
        this._game = game;
        this._color = color;
        this._block1 = new BaseBlock(this._color)

        this._topLeft = this._topRight = new Position(Math.floor(Game.COL_SIZE/2), -1);
    }

    get blocked(): boolean {
        return this._cannotMove;
    }

    private showHide(){
        this._block1.hide(this._game.canvas);
        this._block1.draw(this._game.canvas, this._topLeft)
    }

    private updateMatrix(value:number){
        if (this._topLeft.row !== -1){
            this._game.matrix[this._topLeft.row][this._topLeft.column] = value;
        }
    }

    canMoveDown(): boolean {
        let temp = new Position(this._topLeft.column, this._topLeft.row + 1);
       
        if (temp.row < Game.ROW_SIZE && this._game.matrix[temp.row][temp.column] === 0 ){
            return true;
        }
        if (this._topLeft.row === -1){
            this._cannotMove = true;
        }
        return false;
    }

    canMoveRight(): boolean {
        let temp = new Position(this._topLeft.column + 1, this._topLeft.row);
        
        if (temp.column < Game.COL_SIZE && this._game.matrix[temp.row][temp.column] === 0 ){
            return true;
        }

        return false;
    }

    canMoveLeft(): boolean {
        let temp = new Position(this._topLeft.column - 1, this._topLeft.row);
       
        if (temp.column >= 0 && this._game.matrix[temp.row][temp.column] === 0 ){
            return true;
        }

        return false;
    }

    canPushDown(): boolean {
        return this.canMoveDown();
    }

    canRotate(): boolean {
        return false;
    }

    moveDown(): boolean {
        if (this.canMoveDown()){
           
            this.updateMatrix(0);

            this._topLeft = this._topRight = new Position(this._topLeft.column, this._topLeft.row + 1)

            this.updateMatrix(this._colorIndex);

            this.showHide();

            return true;
        }
        
        return false;
    }
    
    moveLeft(): boolean {
        if (this.canMoveLeft()){

            this.updateMatrix(0);

            this._topLeft = this._topRight = new Position(this._topLeft.column - 1, this._topLeft.row)
            
            this.updateMatrix(this._colorIndex);

            this.showHide();

            return true;
        }

        return false;
       
    }

    moveRight(): boolean {
        if (this.canMoveRight()){

            this.updateMatrix(0);
            
            this._topLeft = this._topRight = new Position(this._topLeft.column + 1, this._topLeft.row)
            
            this.updateMatrix(this._colorIndex);

            this.showHide();

            return true;
        }

        return false;
    }

    pushDown(): boolean {
        return this.moveDown();
    }

    rotateCounterClockWise(): boolean {
        return true;
    }

    drawOnNextItemCanvas(){
        let nextItemCanvas = this._game.nextItemCanvas;
        let col = nextItemCanvas.width/BaseBlock.WIDTH;
        let row = nextItemCanvas.height/BaseBlock.WIDTH;
        let position = new Position(Math.floor(col/2), Math.floor(row/2) -1);
        this._block1.draw(nextItemCanvas, position);
    }
}