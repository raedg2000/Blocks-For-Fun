import { BaseBlock } from "./BaseBlock";
import { Block1 } from "./Block1";
import { Block10 } from "./Block10";
import { Block11 } from "./Block11";
import { Block12 } from "./Block12";
import { Block2 } from "./Block2";
import { Block3 } from "./Block3";
import { Block4 } from "./Block4";
import { Block5 } from "./Block5";
import { Block6 } from "./Block6";
import { Block7 } from "./Block7";
import { Block8 } from "./Block8";
import { Block9 } from "./Block9";
import { IBlock } from "./IBlock";
import { Position } from "./Position";


enum BlockMovementEventTye{
    Down ='Down',
    Left = 'Left',
    Right = 'Right',
    Rotate = 'Rotate'
}


export class Game{

    static readonly ROW_SIZE = 20;
    static readonly COL_SIZE = 10;
    static readonly SCORE_INCREMENT = 10;

    static readonly NUMBER_OF_COLORS = 10;
    static readonly NUMBER_OF_BlockTypes = 12;

    private _matrix : Array<Array<number>> = new Array<Array<number>>(Game.ROW_SIZE);
    
    private _currentBlock  : IBlock | undefined;
    private _nextBlock  : IBlock | undefined;
    private _score : number = 0;
    private _canvas : HTMLCanvasElement;
    private _nextItemCanvas : HTMLCanvasElement;

    private _speed : number = 1600;

    private _isPaused : boolean = false;
    private _hasStarted : boolean = false;
    private _hasEnded : boolean = false;

    private _colors : string[] ;
    private _blockTimerIntervalId: any | undefined;
    private _eventProcessingTimerIntervalId: any | undefined;

    private _eventQueue = new Array<BlockMovementEventTye>();

    private _scoreCell : HTMLTableCellElement;

    beepSoundPlayer : HTMLAudioElement;
    victorySoundPlayer : HTMLAudioElement;
    gameOverSoundPlayer : HTMLAudioElement;

    private _soundOn : boolean = false;

    locked : boolean = false;

    constructor(canvas : HTMLCanvasElement, nextItemCanvas : HTMLCanvasElement, soundOption : boolean){
        this._canvas = canvas;
        this._nextItemCanvas = nextItemCanvas;
        this._colors = this.initializeColorsArray();

        this._scoreCell = document.getElementById('scoreValue') as HTMLTableCellElement;
        this.beepSoundPlayer = document.getElementById('beepSound') as HTMLAudioElement;
        this.victorySoundPlayer = document.getElementById('victoerySound') as HTMLAudioElement;
        this.gameOverSoundPlayer = document.getElementById('gameOverSound') as HTMLAudioElement;

        this._soundOn = soundOption;

        this._currentBlock = this.getNextBlock();
        this._nextBlock = this.getNextBlock();

        for(let index = 0; index < Game.ROW_SIZE; ++index){
            this._matrix[index] = this.initialEmptyRow();
        }

        this.handleRightButtonEvent();
        this.handleLeftButtonEvent();
        this.handleDownButtonEvent();
        this.handleRotateButtonEvent();
        this.playGame();
        
    }

    get canvas():HTMLCanvasElement{
        return this._canvas;
    }

    get nextItemCanvas():HTMLCanvasElement{
        return this._nextItemCanvas;
    }

    get matrix():Array<Array<number>>{
        return this._matrix;
    }

    get hasEnded():boolean{
        return this._hasEnded;
    }

    set hasEnded(value : boolean){
        this._hasEnded = value;
    }

    get soundOn():boolean{
        return this._soundOn;
    }

    set soundOn(value : boolean){
        this._soundOn = value;
    }

    get hasStarted():boolean{
        return this._hasStarted;
    }

    set hasStarted(value : boolean){
        this._hasStarted = value;
    }

    get isPaused(): boolean{
        return this._isPaused
    }

    set isPaused(value : boolean){
        this._isPaused = value;
    }

    private getNextBlock() : IBlock | undefined{

        let colorIndex = Math.floor(Math.random()*Game.NUMBER_OF_COLORS) + 1;
        let blockIndex = Math.floor(Math.random()*Game.NUMBER_OF_BlockTypes) + 1;

        //blockIndex = 5;

        switch(blockIndex){
            case 1:
                return new Block1(this, colorIndex, this._colors[colorIndex]);

            case 2:
                return new Block2(this, colorIndex, this._colors[colorIndex]);

            case 3:
                return new Block3(this, colorIndex, this._colors[colorIndex]);

            case 4:
                return new Block4(this, colorIndex, this._colors[colorIndex]);

            case 5:
                return new Block5(this, colorIndex, this._colors[colorIndex]);

            case 6:
                return new Block6(this, colorIndex, this._colors[colorIndex]);

            case 7:
                return new Block7(this, colorIndex, this._colors[colorIndex]);
            
            case 8:
                return new Block8(this, colorIndex, this._colors[colorIndex]);

            case 9:
                return new Block9(this, colorIndex, this._colors[colorIndex]);

            case 10:
                return new Block10(this, colorIndex, this._colors[colorIndex]);
            
            case 11:
                return new Block11(this, colorIndex, this._colors[colorIndex]);
            
            case 12:
                return new Block12(this, colorIndex, this._colors[colorIndex]);
                
            default :
                return new Block1(this, colorIndex, this._colors[colorIndex]);
        }

        return undefined;
    }

    private getNewBlock(){
        this._currentBlock = this._nextBlock;
        this._nextBlock = this.getNextBlock();
    }

    get score(): number{
        return this._score;
    }

    private initializeColorsArray(): Array<string>{
        let arr = new Array<string>(Game.NUMBER_OF_COLORS + 1);
        arr[0] = 'black';
        arr[1] = '#157DEC'; //Blue Dress
        arr[2] = 'green';
        arr[3] = 'yellow';
        arr[4] = 'white';
        arr[5] = '#000080'; //Navy Blue
        arr[6] = '#D4A017'; //Orange Gold
        arr[7] = '#810541'; //Marron
        arr[8] = '#FF00FF'; //Magenta
        arr[9] = '#F433FF'; //Bright Neon Pink
        arr[10] = '#7F38EC'; //Lovely Purple

        return arr;
    }


    private initialEmptyRow():Array<number>{
        let arr = new Array<number>(Game.COL_SIZE);
        for (let col= 0; col < Game.COL_SIZE; ++col){
            arr[col] = 0;
        }
       return arr;
    }

    private copyRowToAnotherRow(sourceRow: number, destinationRow : number){
        this._matrix[destinationRow] = this._matrix[sourceRow];
    }

    private returnFullRows():Array<number>{
        let completedRows = new Array<number>();
        for(let row = 0; row < Game.ROW_SIZE ; ++row){
            let count = 0;
            for(let col = 0; col < Game.COL_SIZE; ++col){
                if (this._matrix[row][col] !== 0){
                    ++count;
                }
            }
            if (count === Game.COL_SIZE){
                completedRows.push(row);
            }
        }

        return completedRows;
    }

    private updateGameScore(){
        
       
        this._score += Game.SCORE_INCREMENT;
        if (this._scoreCell){
            this._scoreCell.innerText = `${this.score}`;
        }
        if (this.score % 100 === 0){
            window.clearInterval(this._blockTimerIntervalId);
            if (this._speed >= 500){
                this._speed -= 100;
            }
            this._blockTimerIntervalId = window.setInterval(this.moveDownBlocks, this._speed, this);
        }
    }

    private updateGameMatrix(numberOfCompletedRows: Array<number>){
       
        for(let index = 0; index < numberOfCompletedRows.length ; ++ index){
            let destinationRow = numberOfCompletedRows[index];
            
            for (let sourceRow = destinationRow - 1 ; sourceRow >= 0; --sourceRow){
                this.copyRowToAnotherRow(sourceRow, destinationRow);
                --destinationRow;
            }
            if (destinationRow === 0){
                this._matrix[destinationRow] = this.initialEmptyRow();
                if (this.soundOn){
                    this.victorySoundPlayer.play();
                }
                this.updateGameScore();
            }
        }
    }

    private redrawGame(){
        if (this._canvas){
            this.clearCanvas();
            for(let row = 0; row < Game.ROW_SIZE; ++row){
                for(let col = 0; col < Game.COL_SIZE; ++ col){
                    if (this._matrix[row][col] !== 0){
                        let block = new BaseBlock(this._colors[this._matrix[row][col]])
                        block.draw(this._canvas, new Position(col, row));
                    }
                }
            }
        }
    }

    private updateGame(game: Game){
        let completedRows = this.returnFullRows();
        //console.log(`completed Rows: ${completedRows}`);
        if (completedRows.length > 0){
            game.updateGameMatrix(completedRows);
            game.redrawGame();
        }
       
    }



    private handleRightButtonEvent(){
        let btnRight = document.getElementById("btnRight")
        if (btnRight){
            btnRight.addEventListener('click', (event)=>{
                event.preventDefault();
                event.stopPropagation();
                this._eventQueue.push(BlockMovementEventTye.Right);
            })
        }
    }

    private handleRotateButtonEvent(){
        let btnRotate = document.getElementById("btnRotate")
        if (btnRotate){
            btnRotate.addEventListener('click', (event)=>{
                event.preventDefault();
                event.stopPropagation();
                this._eventQueue.push(BlockMovementEventTye.Rotate);
            })
        }
    }

    private handleDownButtonEvent(){
        let btnDown = document.getElementById("btnDown")
        if (btnDown){
            btnDown.addEventListener('click', (event)=>{
                event.preventDefault();
                event.stopPropagation();
                this._eventQueue.push(BlockMovementEventTye.Down);
            })
        }

    }

    private handleLeftButtonEvent(){
        let btnLeft = document.getElementById("btnLeft")
        if (btnLeft){
            btnLeft.addEventListener('click', (event)=>{
                event.preventDefault();
                event.stopPropagation();
                this._eventQueue.push(BlockMovementEventTye.Left);
            })
        }
    }
    
    private moveDownBlocks(game: Game){
        if (!game.hasEnded && !game.isPaused){
            game._eventQueue.push(BlockMovementEventTye.Down);
        }
    }

    private handleBlockEevnts(game: Game){
        if (game._hasEnded){
            return;
        }
        if (!game.locked && !game._isPaused){
            game.locked = true;
            if (game._eventQueue.length > 0 ){
                if (game._currentBlock?.blocked){
                    game._eventQueue = new Array<BlockMovementEventTye>();
                    game._hasEnded = true;
                    window.clearInterval(this._blockTimerIntervalId);
                    window.clearInterval(this._eventProcessingTimerIntervalId);
                    game.printGameOver();
                    if (game.soundOn){
                        game.gameOverSoundPlayer.play();
                    }
                    return;
                }
                let event = game._eventQueue[0];
                if (event === BlockMovementEventTye.Down){
                    if (!game._currentBlock?.canMoveDown() && !game._currentBlock?.blocked){
                        
                        game._eventQueue = new Array<BlockMovementEventTye>();

                        game.updateGame(game);

                        game.getNewBlock(); 
                        game.clearNextItemCanvas()
                        game._nextBlock?.drawOnNextItemCanvas();
                        game._eventQueue.push(BlockMovementEventTye.Down);
                    }
                    else{
                       
                        if (game._currentBlock?.moveDown()){
                            game.playBeepSound();
                        }
                        game._eventQueue.splice(0,1);
                    }
                }
                else if (event === BlockMovementEventTye.Left){
                    // if (game.soundOn){
                    //     game.beepSoundPlayer.play();
                    // }
                    game._currentBlock?.moveLeft();
                    game._eventQueue.splice(0,1);
                }
                else if (event === BlockMovementEventTye.Right){
                    // if (game.soundOn){
                    //     game.beepSoundPlayer.play();
                    // };
                    game._currentBlock?.moveRight();
                    game._eventQueue.splice(0,1);
                }
                else if (event === BlockMovementEventTye.Rotate){
                    // if (game.soundOn){
                    //     game.beepSoundPlayer.play();
                    // };
                    game._currentBlock?.rotateCounterClockWise();
                    game._eventQueue.splice(0,1);
                }
            }
            game.locked = false;
        }
    }

    private playGame(){
        if (this._blockTimerIntervalId){
            window.clearInterval(this._blockTimerIntervalId);
        }
        this._eventQueue.push(BlockMovementEventTye.Down);
        this._nextBlock?.drawOnNextItemCanvas();
        this._blockTimerIntervalId = window.setInterval(this.moveDownBlocks, this._speed, this);
        this._eventProcessingTimerIntervalId = window.setInterval(this.handleBlockEevnts, 10, this);
       
    }

    private printGameOver(){
        if (this.canvas){
            
            let ctx = this.canvas.getContext('2d');
            ctx?.beginPath();
            ctx!.font = '50px sans-serif';
            ctx!.strokeStyle = 'red';
            ctx!.fillStyle = 'red';
            let matrics = ctx?.measureText("Game Over!!");
            let x= this.canvas.width/2 - BaseBlock.WIDTH*4;
            let y= this.canvas.height/2;
            if (matrics){
                x= this.canvas.width/2 - matrics.width/2;
            }
            ctx?.fillText("Game Over!!", x, y);
            ctx?.stroke();
            ctx?.fill();
            ctx?.closePath();
        }
    }

    playBeepSound(){
        if (this.soundOn) {
            let sound = new Audio("data:audio/wav;base64,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qJrx4KOQjahZxWbcZgztj2c49nKmkId44S71j0c8eV9yDK6uPRzx5X18eDvjvQ6yKo9ZSS6l//8elePK/Lf//IInrOF/FvDoADYAGBMGb7FtErm5MXMlmPAJQVgWta7Zx2go+8xJ0UiCb8LHHdftWyLJE0QIAIsI+UbXu67dZMjmgDGCGl1H+vpF4NSDckSIkk7Vd+sxEhBQMRU8j/12UIRhzSaUdQ+rQU5kGeFxm+hb1oh6pWWmv3uvmReDl0UnvtapVaIzo1jZbf/pD6ElLqSX+rUmOQNpJFa/r+sa4e/pBlAABoAAAAA3CUgShLdGIxsY7AUABPRrgCABdDuQ5GC7DqPQCgbbJUAoRSUj+NIEig0YfyWUho1VBBBA//uQZB4ABZx5zfMakeAAAAmwAAAAF5F3P0w9GtAAACfAAAAAwLhMDmAYWMgVEG1U0FIGCBgXBXAtfMH10000EEEEEECUBYln03TTTdNBDZopopYvrTTdNa325mImNg3TTPV9q3pmY0xoO6bv3r00y+IDGid/9aaaZTGMuj9mpu9Mpio1dXrr5HERTZSmqU36A3CumzN/9Robv/Xx4v9ijkSRSNLQhAWumap82WRSBUqXStV/YcS+XVLnSS+WLDroqArFkMEsAS+eWmrUzrO0oEmE40RlMZ5+ODIkAyKAGUwZ3mVKmcamcJnMW26MRPgUw6j+LkhyHGVGYjSUUKNpuJUQoOIAyDvEyG8S5yfK6dhZc0Tx1KI/gviKL6qvvFs1+bWtaz58uUNnryq6kt5RzOCkPWlVqVX2a/EEBUdU1KrXLf40GoiiFXK///qpoiDXrOgqDR38JB0bw7SoL+ZB9o1RCkQjQ2CBYZKd/+VJxZRRZlqSkKiws0WFxUyCwsKiMy7hUVFhIaCrNQsKkTIsLivwKKigsj8XYlwt/WKi2N4d//uQRCSAAjURNIHpMZBGYiaQPSYyAAABLAAAAAAAACWAAAAApUF/Mg+0aohSIRobBAsMlO//Kk4soosy1JSFRYWaLC4qZBYWFRGZdwqKiwkNBVmoWFSJkWFxX4FFRQWR+LsS4W/rFRb/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////VEFHAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAU291bmRib3kuZGUAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAMjAwNGh0dHA6Ly93d3cuc291bmRib3kuZGUAAAAAAAAAACU=");
            sound.play();
        }
    }

    endGame(){
        clearInterval(this._eventProcessingTimerIntervalId);
        clearInterval(this._blockTimerIntervalId);
        this._blockTimerIntervalId  = undefined;
        this.hasEnded = true;
    }

    clearNextItemCanvas(){
        if (this._nextItemCanvas){
            let ctx =  this._nextItemCanvas.getContext('2d');
            if (ctx){
                ctx.beginPath();
                ctx.fillStyle="black";
                ctx.clearRect(0,0,  this._nextItemCanvas.width,  this._nextItemCanvas.height);
                ctx.rect(0,0,  this._nextItemCanvas.width,  this._nextItemCanvas.height);
                ctx.fill();
                ctx.closePath();
            }
        }
    }

    clearCanvas(){
        if (this._canvas){
            let ctx =  this._canvas.getContext('2d');
            if (ctx){
                ctx.beginPath();
                ctx.fillStyle="black";
                ctx.clearRect(0,0,  this._canvas.width,  this._canvas.height);
                ctx.rect(0,0,  this._canvas.width,  this._canvas.height);
                ctx.fill();
                ctx.closePath();
            }
        }
    }

}