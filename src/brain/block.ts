import { PowerUp } from "./powerUp";

export class Block {
    public isAlive: boolean = true;
    public opacity: string | number = "1.0";
    public powerUp: PowerUp | undefined = undefined;

    constructor(private _width: number, private _height: number, private _left: number, private _top: number, public lives: number){
    }

    get width() : number{
        return this._width;
    }

    get height() : number{
        return this._height;
    }

    get left() : number{
        return this._left;
    }

    get top() : number{
        return this._top;
    }
}