import { BaseBlock } from "./BaseBlock";
import { Game } from "./Game";
import { IBlock } from "./IBlock";
import { Position } from "./Position";

export class Block9 implements IBlock{

    private _row: number = 0;
    private _column: number = 0;

    private _topRight : Position;
    private _bottomMiddle : Position;
    private _topMiddle: Position;
    private _bottomLeft : Position;
   
 

    private _game : Game;
    private _color : string;
    private _colorIndex : number;

    private _block1 : BaseBlock;
    private _block2 : BaseBlock;
    private _block3 : BaseBlock;
    private _block4 : BaseBlock;
    
    private _width : number = BaseBlock.WIDTH;
    private _height : number = BaseBlock.WIDTH;

    private _cannotMove = false;
    private _angleOfRotation: number = 0;

    constructor(game : Game, colorIndex: number, color:string){
        this._colorIndex = colorIndex;
        this._game = game;
        this._color = color;

        this._block1 = new BaseBlock(this._color);
        this._block2 = new BaseBlock(this._color);
        this._block3 = new BaseBlock(this._color);
        this._block4 = new BaseBlock(this._color);

        this._topRight = new Position(Math.floor(2 + Game.COL_SIZE/2), -2);
        this._bottomMiddle = new Position(Math.floor(1 + Game.COL_SIZE/2), -1);
        this._topMiddle = new Position(Math.floor( 1 + Game.COL_SIZE/2), -2);
        this._bottomLeft = new Position(Math.floor(Game.COL_SIZE/2), -1);
    }

    get blocked(): boolean {
        return this._cannotMove;
    }

    private showHide(){
        this._block1.hide(this._game.canvas);
        this._block2.hide(this._game.canvas);
        this._block3.hide(this._game.canvas);
        this._block4.hide(this._game.canvas);
        this._block1.draw(this._game.canvas, this._topRight);
        this._block2.draw(this._game.canvas, this._bottomLeft);
        this._block3.draw(this._game.canvas, this._bottomMiddle);
        this._block4.draw(this._game.canvas, this._topMiddle);
    }

    private updateMatrix(value: number){
        if (this._topRight.row >=0){
            this._game.matrix[this._topRight.row][this._topRight.column] = value;
            this._game.matrix[this._bottomMiddle.row][this._bottomMiddle.column] = value;
            this._game.matrix[this._bottomLeft.row][this._bottomLeft.column] = value;
            this._game.matrix[this._topMiddle.row][this._topMiddle.column] = value;
        }
    }

    canMoveDown(): boolean {
        let temp = new Position(this._bottomMiddle.column, this._bottomMiddle.row + 1);
        let temp1 = new Position(this._topRight.column, this._topRight.row + 1);
        let temp2 = new Position(this._bottomLeft.column, this._bottomLeft.row + 1);
        let temp3 = new Position(this._topMiddle.column, this._topMiddle.row + 1);
        
        if (this._topRight.row == -2){
            temp = new Position(this._bottomMiddle.column, this._bottomMiddle.row + 2);
            temp1 = new Position(this._topRight.column, this._topRight.row + 2);
            temp2 = new Position(this._bottomLeft.column, this._bottomLeft.row + 2);
            temp3 = new Position(this._topMiddle.column, this._topMiddle.row + 2);
        }
       
        if (this._angleOfRotation === 0 && 
            (temp.row < Game.ROW_SIZE && this._game.matrix[temp.row][temp.column] === 0 ) &&
            (temp1.row < Game.ROW_SIZE && this._game.matrix[temp1.row][temp1.column] === 0 ) &&
            (temp2.row < Game.ROW_SIZE && this._game.matrix[temp2.row][temp2.column] === 0 )){
            return true
        }

        if (this._angleOfRotation === 90 && 
            (temp2.row < Game.ROW_SIZE && this._game.matrix[temp2.row][temp2.column] === 0 ) &&
            (this._game.matrix[temp3.row][temp3.column] === 0 )){
            return true
        }

        if (this._topRight.row === -2){
            this._cannotMove = true;
        }
        return false;
    }

    canMoveRight(): boolean {

        let temp = new Position(this._topRight.column + 1, this._topRight.row);
        let temp1 = new Position(this._bottomMiddle.column + 1, this._bottomMiddle.row);
        let temp2 = new Position(this._bottomLeft.column + 1, this._bottomLeft.row);
        
        if (this._angleOfRotation === 0 && temp.column <  Game.COL_SIZE && 
            this._game.matrix[temp.row][temp.column] === 0  && 
            this._game.matrix[temp1.row][temp1.column] === 0){
            return true;
        }

        if (this._angleOfRotation === 90 && temp1.column <  Game.COL_SIZE && 
            this._game.matrix[temp.row][temp.column] === 0  && 
            this._game.matrix[temp1.row][temp1.column] === 0 &&
            this._game.matrix[temp2.row][temp2.column] === 0){
            return true;
        }

        return false;
    }

    canMoveLeft(): boolean {
        let temp = new Position(this._topMiddle.column - 1, this._topMiddle.row);
        let temp1 = new Position(this._bottomLeft.column - 1, this._bottomLeft.row);
        let temp2 = new Position(this._topRight.column - 1, this._topRight.row);
       
        if (this._angleOfRotation === 0 && temp.column  >= 0 && 
            this._game.matrix[temp.row][temp.column] === 0 && 
            this._game.matrix[temp1.row][temp1.column] === 0 ){
            return true;
        }

        if (this._angleOfRotation === 90 && temp.column  >= 0 && 
            this._game.matrix[temp.row][temp.column] === 0 && 
            this._game.matrix[temp1.row][temp1.column] === 0 && 
            this._game.matrix[temp2.row][temp2.column] === 0 ){
            return true;
        }

        return false;
    }

    canPushDown(): boolean {
        return this.canMoveDown();
    }

    canRotate(): boolean {
        let angle = this._angleOfRotation + 90;
        if (angle === 90 && this._topRight.row > 0 && this._topRight.row + 2 < Game.ROW_SIZE &&
            this._game.matrix[this._topRight.row -1][this._topRight.column] === 0 &&
            this._game.matrix[this._topMiddle.row -1][this._topMiddle.column] === 0 &&
            this._game.matrix[this._bottomMiddle.row][this._bottomMiddle.column + 1] === 0){
            
            return true;

        }
        
        if (angle === 180 && this._topRight.row > 0 && this._topRight.column - 1 >= 0 && 
            this._game.matrix[this._topRight.row ][this._topRight.column -1 ] === 0 &&
            this._game.matrix[this._topMiddle.row -1][this._topMiddle.column - 1] === 0 &&
            this._game.matrix[this._bottomLeft.row][this._bottomLeft.column  -1] === 0 &&
            this._game.matrix[this._bottomLeft.row][this._bottomLeft.column  -2 ] === 0){
            
            return true;

        }
        return false;
    }

    moveDown(): boolean {
        if (this.canMoveDown()){
            this.updateMatrix(0);
                          
            if (this._topRight.row === -2){
                this._topRight = new Position(this._topRight.column, this._topRight.row + 2);
                this._bottomMiddle = new Position(this._bottomMiddle.column, this._bottomMiddle.row + 2);
                this._bottomLeft = new Position(this._bottomLeft.column, this._bottomLeft.row + 2);
                this._topMiddle = new Position(this._topMiddle.column, this._topMiddle.row + 2);
            }
            else{
                this._topRight = new Position(this._topRight.column, this._topRight.row + 1);
                this._bottomMiddle = new Position(this._bottomMiddle.column, this._bottomMiddle.row + 1);
                this._bottomLeft = new Position(this._bottomLeft.column, this._bottomLeft.row + 1);
                this._topMiddle = new Position(this._topMiddle.column, this._topMiddle.row + 1);
            }

            this.updateMatrix(this._colorIndex);

            this.showHide();

            return true;
        } 
        
        return false;
    }
    
    moveLeft(): boolean {
        if (this.canMoveLeft()){
            
            this.updateMatrix(0);
            
            this._topRight = new Position(this._topRight.column - 1, this._topRight.row);
            this._bottomMiddle = new Position(this._bottomMiddle.column - 1, this._bottomMiddle.row);
            this._bottomLeft = new Position(this._bottomLeft.column - 1, this._bottomLeft.row);
            this._topMiddle = new Position(this._topMiddle.column - 1, this._topMiddle.row);

            this.updateMatrix(this._colorIndex);

            this.showHide();

            return true;
        }

        return false;       
    }

    moveRight(): boolean {
        if (this.canMoveRight()){
            
            this.updateMatrix(0);
            
            this._topRight = new Position(this._topRight.column + 1, this._topRight.row);
            this._bottomMiddle = new Position(this._bottomMiddle.column + 1, this._bottomMiddle.row);
            this._bottomLeft = new Position(this._bottomLeft.column + 1, this._bottomLeft.row);
            this._topMiddle = new Position(this._topMiddle.column + 1, this._topMiddle.row);

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
        if (this.canRotate()){
            this._angleOfRotation = this._angleOfRotation + 90;

            this.updateMatrix(0);

            if (this._angleOfRotation === 90){
                this._topRight = new Position(this._topRight.column -1, this._topRight.row - 1);
                this._bottomMiddle  = new Position(this._bottomMiddle.column + 1, this._bottomMiddle.row - 1);
                this._bottomLeft  = new Position(this._bottomLeft.column + 2, this._bottomLeft.row);
            }
            else if (this._angleOfRotation === 180){
                this._topRight = new Position(this._topRight.column + 1, this._topRight.row + 1);
                this._bottomMiddle  = new Position(this._bottomMiddle.column - 1, this._bottomMiddle.row + 1);
                this._bottomLeft  = new Position(this._bottomLeft.column - 2, this._bottomLeft.row);
            }
            

            this.updateMatrix(this._colorIndex);

            this.showHide();

            this._angleOfRotation = this._angleOfRotation % 180;

            return true;
        }
        
        return false;
    }

    drawOnNextItemCanvas(){
        let nextItemCanvas = this._game.nextItemCanvas;
        let col = nextItemCanvas.width/BaseBlock.WIDTH;
        let row = nextItemCanvas.height/BaseBlock.WIDTH;
        let position = new Position(Math.floor(col/2) + 1, Math.floor(row/2) -1);
        let position1 = new Position(position.column - 1, position.row);
        let position2 = new Position(position.column - 1, position.row + 1);
        let position3 = new Position(position.column - 2, position.row + 1);
        this._block1.draw(nextItemCanvas, position);
        this._block2.draw(nextItemCanvas, position1);
        this._block3.draw(nextItemCanvas, position2);
        this._block4.draw(nextItemCanvas, position3);
    }
}