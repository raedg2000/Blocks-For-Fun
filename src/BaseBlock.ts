import { Position } from "./Position";


export class BaseBlock {

    static WIDTH = 30;

    private _color: string;
    private _position: Position;
    private _visible : boolean;

    constructor(color: string){
        this._color = color;
        this._visible = false;
        this._position = new Position(-100,-100);
    }

    get visible(): boolean{
        return this._visible;
    }

    get position(): Position{
        return this._position;
    }

    set position(value: Position){
        this._position = value;
    }

    private drawImageBox(canvas:  HTMLCanvasElement, color: string){
        let ctx = canvas.getContext('2d');

        if (ctx){
            let img = document.getElementById("sapphire") as HTMLImageElement;
            ctx.beginPath();
            ctx.drawImage(img, BaseBlock.WIDTH*this.position.column, BaseBlock.WIDTH*this.position.row, BaseBlock.WIDTH, BaseBlock.WIDTH)
            ctx.closePath();
        }
    }

    private drawColorBox(canvas:  HTMLCanvasElement, color: string){
        let ctx = canvas.getContext('2d');

        if (ctx){
            ctx.beginPath();
            ctx.fillStyle = color;
            ctx.rect(BaseBlock.WIDTH*this.position.column, BaseBlock.WIDTH*this.position.row, BaseBlock.WIDTH, BaseBlock.WIDTH);
            ctx.fill();
            ctx.closePath();
        }
    }

    draw(canvas:  HTMLCanvasElement, position: Position){
        this._visible = true;
        this._position = position;
        this.drawImageBox(canvas, this._color);
    }

    hide(canvas:  HTMLCanvasElement){
        if (this.visible){
            let ctx = canvas.getContext('2d');

            if (ctx){
                ctx.save();

                ctx.beginPath();
                ctx.rect(BaseBlock.WIDTH*this.position.column, BaseBlock.WIDTH*this.position.row, BaseBlock.WIDTH, BaseBlock.WIDTH);
                ctx.clip();
                ctx.clearRect(BaseBlock.WIDTH*this.position.column, BaseBlock.WIDTH*this.position.row, BaseBlock.WIDTH, BaseBlock.WIDTH);
                this.drawColorBox(canvas, 'black');

                ctx.restore();
                this._visible = false;
            }
        }
    }

}