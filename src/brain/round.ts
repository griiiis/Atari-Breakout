import { Ball } from "./ball.js";
import { Block } from "./block.js";
import { PowerUp } from "./powerUp.js";
import { Game } from "./game.js";

export class Round{
    public cleared: number = 0;
    public balls: Array<Ball> = new Array();
    public blocks: Array<Block> | undefined = undefined;

    public leftStart: number = -1;
    readonly blockWidth: number = 50;
    readonly blockHeight: number = 30;

    constructor(private rowCount: number, private topStart: number, private freeSpaceBetweenBlocks: number, public roundSpeed: number){
        let ball = new Ball();
        this.balls.push(ball);
    }

    generateblocks(width: number, borderThickness: number, game: Game) : void{
        this.blocks = new Array();

        let freeRoom = width - 2 * borderThickness;
        let blocksCountPerRow = Math.floor(freeRoom / (this.blockWidth + this.freeSpaceBetweenBlocks * 2));
        let freeRoomLeft = freeRoom - (this.blockWidth + this.freeSpaceBetweenBlocks * 2) * blocksCountPerRow;

        this.leftStart = borderThickness + freeRoomLeft / 2 + this.freeSpaceBetweenBlocks;

        this.generateEveryBlock(blocksCountPerRow, game, borderThickness, freeRoomLeft);
    }

    generateEveryBlock(blocksCountPerRow: number, game: Game, borderThickness: number, freeRoomLeft: number) : void{
        for (let i = 0; i < this.rowCount; i++) {
            for (let j = 0; j < blocksCountPerRow; j++) {
                this.generateNewBlock(game);
            }
            this.topStart += this.blockHeight + 20;
            this.leftStart = borderThickness + freeRoomLeft / 2 + this.freeSpaceBetweenBlocks;
        }
    }

    generateNewBlock(game: Game) : void{
        let block = new Block(this.blockWidth, this.blockHeight, this.leftStart, this.topStart, game.currentRoundNum + 1)
        let rand = Math.ceil(Math.random() * 3);
        if (rand == 1) {
            this.generateNewPowerUp(block);
        }
        this.blocks!.push(block);
        this.leftStart += this.blockWidth + this.freeSpaceBetweenBlocks * 2;
    }

    generateNewPowerUp(block: Block) : void {
        let rand = Math.floor(Math.random() * 4);
        switch (rand) {
            case 0:
                block.powerUp = new PowerUp("red", "extended");
                break;
            case 1:
                block.powerUp = new PowerUp("blue", "shrink");
                break;
            case 2:
                block.powerUp = new PowerUp("green", "multiply");
                break;
            case 3:
                block.powerUp = new PowerUp("yellow", "extra-life");
                break;
        }
    }

}