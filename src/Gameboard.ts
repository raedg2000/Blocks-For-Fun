import { BaseBlock } from "./BaseBlock";
import { Game } from "./Game";
import { Position } from "./Position";

export class Gameboard{

    private _canvas : HTMLCanvasElement | undefined;
    private _nextItemCanvas : HTMLCanvasElement | undefined;

    private _game : Game | undefined;

    constructor(){
        this.setBlockSize();
        this.handleSoundOption();
        this.initializeGameCanvas();
        this.initializeNextBlockCanvas();

        this.handleNewGameEvent();
        this.handlePauseGameEvent();
        
        this.handleAbout();
    }

    private setBlockSize(){
        if( screen.width <= 500 ){
            BaseBlock.WIDTH = 15;
        }
    }

    private getSoundOnValue():boolean{
        let soundOnControl = document.getElementById('soundOn') as HTMLInputElement;
        if (soundOnControl){
            
            return soundOnControl.checked;
        }
        return false;
    }

    private initializeGameCanvas(){
        let element : any = document.getElementById("game_canvas");
        this._canvas = element as HTMLCanvasElement;
        if (this._canvas){
            this._canvas.width = Game.COL_SIZE*BaseBlock.WIDTH;
            this._canvas.height = Game.ROW_SIZE*BaseBlock.WIDTH;

            let ctx =  this._canvas.getContext('2d');
            if (ctx){
                ctx.beginPath();

                ctx.rect(0,0,  this._canvas.width,  this._canvas.height);
                ctx.fillStyle="black";
                ctx.fill();
                ctx.closePath();
            }
        }
    }

    private initializeNextBlockCanvas(){
        let element = document.getElementById("next_piece_canvas");
        if (element ){
            this._nextItemCanvas = element  as HTMLCanvasElement;
            this._nextItemCanvas.width = 6*BaseBlock.WIDTH;
            this._nextItemCanvas.height = 6*BaseBlock.WIDTH;
            let ctx = this._nextItemCanvas.getContext('2d');
            if (ctx){
                ctx.beginPath();

                ctx.rect(0,0,this._nextItemCanvas.width,this._nextItemCanvas.height);
                ctx.fillStyle="black";
                ctx.fill();
                ctx.closePath();
            }
        }
    }

    private newGame(){
        if (this._game && this._canvas && this._nextItemCanvas){
            this.initializeGameCanvas();
            this.initializeNextBlockCanvas();
            this._game?.endGame();
            this._game = new Game(this._canvas, this._nextItemCanvas, this.getSoundOnValue());
            this.updatePauseButtonText("Pause Game");
            let scoreCell = document.getElementById('scoreValue') as HTMLTableCellElement;
            if (scoreCell){
                scoreCell.innerText = `${this._game.score}`;
            }
        }
    }

    private updatePauseButtonText(value: string){
        let btnPauseGame = document.getElementById('btnPauseGame');
        if (btnPauseGame !== null){
            btnPauseGame.innerText = value;
        }
    }

    private handleSoundOption(){
        let soundOnControl = document.getElementById('soundOn') as HTMLInputElement;
        if (soundOnControl){
            soundOnControl.addEventListener('change', () =>{
                if (this._game){
                    this._game.soundOn = soundOnControl.checked;
                }
            });
        }
    }

    private handleNewGameEvent(){
        let btnNewGame = document.getElementById('btnNewGame');
        if (btnNewGame !== null){
            btnNewGame.addEventListener('click', (event) => {
                event.stopPropagation();
                if (!this._game && this._canvas && this._nextItemCanvas){
                    this._game = new Game(this._canvas, this._nextItemCanvas, this.getSoundOnValue());
                }
                else{
                    if (this._game?.hasEnded && this._canvas && this._nextItemCanvas){
                        this.newGame();
                        return;
                    }

                    if (!this._game?.hasEnded && this._canvas && this._nextItemCanvas){
                        this._game!.isPaused = true;
                        let dialog = document.getElementById('newGameDialog') as HTMLDialogElement;
                        dialog.addEventListener('close', ()=>{
                            if (dialog.returnValue === 'Yes'){
                                this.newGame();
                            }
                            else{
                                this._game!.isPaused = false;
                            }
                        }, { once: true })
                        dialog.showModal();
                        return;
                    }
                }
            });
        }
    }

    private handlePauseGameEvent(){
        let btnPauseGame = document.getElementById('btnPauseGame');
        if (btnPauseGame !== null){
            btnPauseGame.addEventListener('click', (event) => {
                event.stopPropagation();
                if (this._game && !this._game.hasEnded){

                    if (this._game.isPaused){
                        this._game.isPaused = false;
                        this.updatePauseButtonText("Pause Game");
                    }else{
                        this._game.isPaused = true;
                        this.updatePauseButtonText("Continue");
                    }
                }

            });
        }
    }

    private handleAbout(){
        let btnAbout = document.getElementById('btnAbout');
        let aboutDialog = document.getElementById('aboutDialog') as HTMLDialogElement;
        let btnPauseGame = document.getElementById('btnPauseGame');
        aboutDialog.addEventListener('close', ()=>{
            if (this._game && btnPauseGame?.innerText !== "Continue"){
                this._game.isPaused = false;
            }           
        })
        if (btnAbout !== null){
            btnAbout.addEventListener('click', (event) => {
                event.stopPropagation();
                if (aboutDialog){
                    if (this._game){
                        this._game.isPaused = true;
                    }
                    aboutDialog.showModal();
                 }
            });
        }
    }
}