import { BaseBlock } from "./BaseBlock";
import { Game } from "./Game";
import { IBlock } from "./IBlock";
import { Position } from "./Position";

export class Block12 implements IBlock{

    private _row: number = 0;
    private _column: number = 0;

    private _topLeft : Position;
    private _topMiddle : Position;
    private _topRight: Position;
    private _bottomLeft : Position;
    private _bottomRight : Position;
   
    private _game : Game;
    private _color : string;
    private _colorIndex : number;

    private _block1 : BaseBlock;
    private _block2 : BaseBlock;
    private _block3 : BaseBlock;
    private _block4 : BaseBlock;
    private _block5 : BaseBlock;
    
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
        this._block5 = new BaseBlock(this._color);

        this._topLeft = new Position(Math.floor(Game.COL_SIZE/2), -2);
        this._topMiddle = new Position(Math.floor( 1 + Game.COL_SIZE/2), -2);
        this._topRight = new Position(Math.floor( 2 + Game.COL_SIZE/2), -2);
        this._bottomLeft = new Position(Math.floor(Game.COL_SIZE/2), -1);
        this._bottomRight = new Position(Math.floor(2 + Game.COL_SIZE/2), -1);
    }

    get blocked(): boolean {
        return this._cannotMove;
    }

    private showHide(){
        this._block1.hide(this._game.canvas);
        this._block2.hide(this._game.canvas);
        this._block3.hide(this._game.canvas);
        this._block4.hide(this._game.canvas);
        this._block5.hide(this._game.canvas);
        this._block1.draw(this._game.canvas, this._topLeft);
        this._block2.draw(this._game.canvas, this._bottomLeft);
        this._block3.draw(this._game.canvas, this._topMiddle);
        this._block4.draw(this._game.canvas, this._topRight);
        this._block5.draw(this._game.canvas, this._bottomRight);
    }

    private updateMatrix(value: number){
        if (this._topLeft.row >=0){
            this._game.matrix[this._topLeft.row][this._topLeft.column] = value;
            this._game.matrix[this._topMiddle.row][this._topMiddle.column] = value;
            this._game.matrix[this._bottomLeft.row][this._bottomLeft.column] = value;
            this._game.matrix[this._topRight.row][this._topRight.column] = value;
            this._game.matrix[this._bottomRight.row][this._bottomRight.column] = value;
        }
    }

    canMoveDown(): boolean {
        let temp1 = new Position(this._bottomLeft.column, this._bottomLeft.row + 1);
        let temp2 = new Position(this._topLeft.column, this._topLeft.row + 1);
        let temp3 = new Position(this._topMiddle.column, this._topMiddle.row + 1);
        let temp4 = new Position(this._topRight.column, this._topRight.row + 1);
        let temp5 = new Position(this._bottomRight.column, this._bottomRight.row + 1);
        
        if (this._topLeft.row == -2){
            temp1 = new Position(this._bottomLeft.column, this._bottomLeft.row + 2);
            temp2 = new Position(this._topLeft.column, this._topLeft.row + 2);
            temp3 = new Position(this._topMiddle.column, this._topMiddle.row + 2);
            temp4 = new Position(this._topRight.column, this._topRight.row + 2);
            temp5 = new Position(this._bottomRight.column, this._bottomRight.row + 2);
        }
       
        if (this._angleOfRotation === 0 && 
            temp1.row < Game.ROW_SIZE && 
            this._game.matrix[temp1.row][temp1.column] === 0 &&
            this._game.matrix[temp3.row][temp3.column] === 0  &&
            this._game.matrix[temp5.row][temp5.column] === 0){
            return true
        }

        if (this._angleOfRotation === 90 && 
            temp1.row < Game.ROW_SIZE && 
            this._game.matrix[temp1.row][temp1.column] === 0 &&
            this._game.matrix[temp2.row][temp2.column] === 0  &&
            this._game.matrix[temp5.row][temp5.column] === 0){
            return true;
        }

        if (this._angleOfRotation === 180  && temp2.row < Game.ROW_SIZE && 
            this._game.matrix[temp2.row][temp2.column] === 0 &&
            this._game.matrix[temp3.row][temp3.column] === 0  &&
            this._game.matrix[temp4.row][temp4.column] === 0){
            return true;
        }

        if (this._angleOfRotation === 270 && temp4.row < Game.ROW_SIZE && 
            this._game.matrix[temp1.row][temp1.column] === 0 &&
            this._game.matrix[temp4.row][temp4.column] === 0  &&
            this._game.matrix[temp5.row][temp5.column] === 0){
            return true;
        }

        if (this._topLeft.row === -2){
            this._cannotMove = true;
        }
        return false;
    }

    canMoveRight(): boolean {
        let temp1 = new Position(this._bottomLeft.column + 1, this._bottomLeft.row);
        let temp2 = new Position(this._topLeft.column + 1, this._topLeft.row);
        let temp3 = new Position(this._topMiddle.column + 1, this._topMiddle.row);
        let temp4 = new Position(this._topRight.column + 1, this._topRight.row);
        let temp5 = new Position(this._bottomRight.column + 1, this._bottomRight.row);
        
        if (this._angleOfRotation === 0 && temp4.column < Game.COL_SIZE &&  
            this._game.matrix[temp4.row][temp4.column] === 0 && 
            this._game.matrix[temp5.row][temp5.column] === 0 && 
            this._game.matrix[temp1.row][temp1.column] === 0){
            return true;
        }

        if (this._angleOfRotation === 90 && temp5.column < Game.COL_SIZE &&
            this._game.matrix[temp1.row][temp1.column] === 0 &&
            this._game.matrix[temp3.row][temp3.column] === 0 &&
            this._game.matrix[temp5.row][temp5.column] === 0){
            return true;
        }

        if (this._angleOfRotation === 180 && temp1.column < Game.COL_SIZE &&
            this._game.matrix[temp1.row][temp1.column] === 0 &&
            this._game.matrix[temp2.row][temp2.column] === 0){
            return true;
        }
        if (this._angleOfRotation === 270 && temp2.column < Game.COL_SIZE &&
            this._game.matrix[temp2.row][temp2.column] === 0 &&
            this._game.matrix[temp3.row][temp3.column] === 0 &&
            this._game.matrix[temp4.row][temp4.column] === 0){
            return true;
        }

        return false;
    }

    canMoveLeft(): boolean {
        let temp1 = new Position(this._bottomLeft.column - 1, this._bottomLeft.row);
        let temp2 = new Position(this._topLeft.column - 1, this._topLeft.row);
        let temp3 = new Position(this._topMiddle.column - 1, this._topMiddle.row);
        let temp4 = new Position(this._topRight.column - 1, this._topRight.row);
        let temp5 = new Position(this._bottomRight.column - 1, this._bottomRight.row);
        
        if (temp1.column >= 0 &&  this._game.matrix[temp1.row][temp1.column] === 0 && 
            this._game.matrix[temp2.row][temp2.column] === 0 && 
            this._game.matrix[temp5.row][temp5.column] === 0){
            return true;
        }
       
        if (this._angleOfRotation === 90 && temp2.column >= 0 &&
            this._game.matrix[temp2.row][temp2.column] === 0 &&
            this._game.matrix[temp3.row][temp3.column] === 0 &&
            this._game.matrix[temp4.row][temp4.column] === 0 ){
            return true;
        }

        if (this._angleOfRotation === 180 && temp4.column >= 0 &&
            this._game.matrix[temp4.row][temp4.column] === 0 &&
            this._game.matrix[temp5.row][temp4.column] === 0 &&
            this._game.matrix[temp1.row][temp1.column] === 0){
            return true;
        }
        if (this._angleOfRotation === 270 && temp1.column >= 0 &&
            this._game.matrix[temp1.row][temp1.column] === 0 &&
            this._game.matrix[temp3.row][temp3.column] === 0 &&
            this._game.matrix[temp5.row][temp5.column] === 0){
            return true;
        }

        return false;
    }

    canPushDown(): boolean {
        return this.canMoveDown();
    }

    canRoteate(): boolean {
        let col = Game.COL_SIZE;
        let angle = this._angleOfRotation + 90;
        if (angle=== 90 && this._topLeft.row >= 1 && 
            this._game.matrix[this._topLeft.row - 1][this._topLeft.column] === 0 &&
            this._game.matrix[this._topMiddle.row - 1][this._topMiddle.column] === 0 &&
            this._game.matrix[this._topRight.row - 1][this._topRight.column] === 0){
             
            return true;
        }
        else if (angle === 180 &&  this._bottomLeft.column  + 1 < col &&
            this._game.matrix[this._bottomLeft.row][this._bottomLeft.column + 1] === 0 &&
            this._game.matrix[this._bottomLeft.row - 1][this._bottomLeft.column + 1] === 0 ){

            return true;
        }
        else if (angle === 270 && 
            this._game.matrix[this._bottomLeft.row - 1][this._bottomLeft.column] === 0 &&
            this._game.matrix[this._bottomLeft.row - 1][this._bottomLeft.column - 1] === 0){

            return true;
        }
        else if (angle === 360 &&
            this._bottomLeft.column  - 1 >= 0 &&
            this._game.matrix[this._bottomLeft.row][this._bottomLeft.column -1] === 0 &&
            this._game.matrix[this._topMiddle.row][this._topMiddle.column -2] === 0){
            return true;
        }
        return false;
    }

    moveDown(): boolean {
        if (this.canMoveDown()){
            this.updateMatrix(0);
                          
            if (this._topLeft.row === -2){
                this._topLeft = new Position(this._topLeft.column, this._topLeft.row + 2);
                this._topMiddle = new Position(this._topMiddle.column, this._topMiddle.row + 2);
                this._bottomLeft = new Position(this._bottomLeft.column, this._bottomLeft.row + 2);
                this._topRight = new Position(this._topRight.column, this._topRight.row + 2);
                this._bottomRight = new Position(this._bottomRight.column, this._bottomRight.row + 2);
               }
            else{
                this._topLeft = new Position(this._topLeft.column, this._topLeft.row + 1);
                this._topMiddle = new Position(this._topMiddle.column, this._topMiddle.row + 1);
                this._bottomLeft = new Position(this._bottomLeft.column, this._bottomLeft.row + 1);
                this._topRight = new Position(this._topRight.column, this._topRight.row + 1);
                this._bottomRight = new Position(this._bottomRight.column, this._bottomRight.row + 1);
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
            
            this._topLeft = new Position(this._topLeft.column - 1, this._topLeft.row);
            this._topMiddle = new Position(this._topMiddle.column - 1, this._topMiddle.row);
            this._bottomLeft = new Position(this._bottomLeft.column - 1, this._bottomLeft.row);
            this._topRight = new Position(this._topRight.column - 1, this._topRight.row);
            this._bottomRight = new Position(this._bottomRight.column - 1, this._bottomRight.row);

            this.updateMatrix(this._colorIndex);

            this.showHide();

            return true;
        }
        
        return false;
    }

    moveRight(): boolean {
        if (this.canMoveRight()){

            this.updateMatrix(0);
            
            this._topLeft = new Position(this._topLeft.column + 1, this._topLeft.row);
            this._topMiddle = new Position(this._topMiddle.column + 1, this._topMiddle.row);
            this._bottomLeft = new Position(this._bottomLeft.column + 1, this._bottomLeft.row);
            this._topRight = new Position(this._topRight.column + 1, this._topRight.row);
            this._bottomRight = new Position(this._bottomRight.column + 1, this._bottomRight.row);

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
        if (this.canRoteate()){
            this._angleOfRotation = this._angleOfRotation + 90;

            this.updateMatrix(0);

            if (this._angleOfRotation === 90){
                this._bottomLeft = new Position(this._bottomLeft.column + 1, this._bottomLeft.row);
                this._topLeft = new Position(this._topLeft.column, this._topLeft.row + 1);
                this._topMiddle = new Position(this._topMiddle.column - 1, this._topMiddle.row);
                this._topRight = new Position(this._topRight.column -2, this._topRight.row -1);
                this._bottomRight =  new Position(this._bottomRight.column - 1, this._bottomRight.row -2);
            }
            else if (this._angleOfRotation === 180){
                this._bottomLeft = new Position(this._bottomLeft.column + 1, this._bottomLeft.row - 1);
                this._topLeft = new Position(this._topLeft.column + 2, this._topLeft.row);
                this._topMiddle = new Position(this._topMiddle.column + 1, this._topMiddle.row +1);
                this._topRight = new Position(this._topRight.column, this._topRight.row + 2);
                this._bottomRight =  new Position(this._bottomRight.column - 1, this._bottomRight.row + 1);
            }
            else if (this._angleOfRotation === 270){
                this._bottomLeft = new Position(this._bottomLeft.column - 1, this._bottomLeft.row - 1);
                this._topLeft = new Position(this._topLeft.column, this._topLeft.row -2);
                this._topMiddle = new Position(this._topMiddle.column + 1, this._topMiddle.row -1);
                this._topRight = new Position(this._topRight.column + 2, this._topRight.row);
                this._bottomRight =  new Position(this._bottomRight.column + 1, this._bottomRight.row + 1);
            }
            else if (this._angleOfRotation === 360){
                this._bottomLeft = new Position(this._bottomLeft.column - 1, this._bottomLeft.row + 2);
                this._topLeft = new Position(this._topLeft.column - 2, this._topLeft.row + 1);
                this._topMiddle = new Position(this._topMiddle.column -1, this._topMiddle.row);
                this._topRight = new Position(this._topRight.column, this._topRight.row - 1);
                this._bottomRight =  new Position(this._bottomRight.column + 1, this._bottomRight.row);
            }

            this.updateMatrix(this._colorIndex);

            this.showHide();

            this._angleOfRotation = this._angleOfRotation % 360;

            return true;
        }  
        return false;    
    }

    drawOnNextItemCanvas(){
        let nextItemCanvas = this._game.nextItemCanvas;
        let col = nextItemCanvas.width/BaseBlock.WIDTH;
        let row = nextItemCanvas.height/BaseBlock.WIDTH;
        let position = new Position(Math.floor(col/2) - 1, Math.floor(row/2) -1);
        let position1 = new Position(position.column + 1, position.row);
        let position2 = new Position(position.column + 2, position.row);
        let position3 = new Position(position.column, position.row + 1);
        let position4 = new Position(position.column + 2, position.row + 1);
        this._block1.draw(nextItemCanvas, position);
        this._block2.draw(nextItemCanvas, position1);
        this._block2.draw(nextItemCanvas, position2);
        this._block4.draw(nextItemCanvas, position3);
        this._block5.draw(nextItemCanvas, position4);
    }
}