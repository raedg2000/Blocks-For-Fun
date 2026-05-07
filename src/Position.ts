export class Position{
    private _col : number = 0;
    private _row : number = 0;

    constructor(col : number, row: number){
        this._col = col;
        this._row = row;
    }

    get column():number{
        return this._col;
    }

    get row():number{
        return this._row;
    }
}