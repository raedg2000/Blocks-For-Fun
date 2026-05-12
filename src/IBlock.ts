
export interface IBlock{

    get blocked():boolean;

    canMoveDown():boolean;

    canMoveLeft():boolean;

    canMoveRight():boolean;

    canPushDown():boolean;

    canRotate():boolean;

    moveDown():boolean;

    moveLeft():boolean;

    moveRight():boolean;

    pushDown():boolean;

    rotateCounterClockWise():boolean;

    drawOnNextItemCanvas():void;
}