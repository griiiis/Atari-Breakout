import { Block } from "./block";
import Brain from "./brain";
import { Game } from "./game";
import { Paddle } from "./paddle";

export class Ball {
    public speed: number = -1;
    public intervalId: number | undefined = undefined;
    public released: boolean = false;

    public top: number = -1;
    public left: number = -1;
    readonly height: number = 20;
    readonly width: number = 20;

    public beforePauseLeftStep: number = -1;
    public beforePauseTopStep: number = -1;
    public leftStep: number = 0;
    public topStep: number = 0;

    moveBall(top: number, leftStep: number, topStep: number, borderThickness: number, paddle: Paddle, game: Game, brain: Brain) {
        this.top = top;
        this.leftStep = leftStep;
        this.topStep = topStep;
        this.speed = game.round!.roundSpeed;
        if (brain.gamePaused) {
            clearInterval(this.intervalId)
        }
        else if (this.leftStep !== 0 && this.topStep !== 0) {
            this.moveBallLoop(borderThickness, paddle, game, brain);
        }
    }

    moveBallLoop(borderThickness: number, paddle: Paddle, game: Game, brain: Brain) {
        this.released = true;
        this.intervalId = setInterval(() => {
            if (game.round!.cleared === game.round!.blocks!.length) { //Round completed
                game.newRoundOrGameCompleted(brain, this);
            }
            this.top -= this.topStep * this.speed * 8;
            this.left -= this.leftStep * this.speed * 8;
            this.validateAndFixPositionBall(borderThickness, paddle, game.round!.blocks!, game, brain);
        }, 20);
    }

    validateAndFixPositionBall(borderThickness: number, paddle: Paddle, blocks: Array<Block>, game: Game, brain: Brain) {
        //Blocks
        this.checkBlockCollision(blocks, game, paddle, borderThickness, brain)
        //Top
        if (this.top <= borderThickness) {
            this.topCanvasBallPosition(borderThickness);
        }
        //Low
        else if (this.top > (1000 - borderThickness)) {
            this.bottomCanvasBallPosition(game, brain, paddle)
        }
        //Left
        else if (this.left <= borderThickness) {
            this.leftCanvasBallPosition(borderThickness);
        }
        //Right
        else if (this.left + this.width >= (1000 - borderThickness)) {
            this.rightCanvasBallPosition(borderThickness);
        }
        //Paddle
        else if (this.top > paddle.top - paddle.height * 0.5 - this.height * 0.5 &&
            this.top < paddle.top &&
            this.left > paddle.left - paddle.width * 0.5 - this.width * 0.5 &&
            this.left < paddle.left + paddle.width * 0.5 - this.width * 0.5 && this.released) {
            this.top = paddle.top - paddle.height * 0.5 - this.height * 0.5;
            this.calculateBounceAngleOffPaddle(paddle);
        }
    }

    checkBlockCollision(blocks: Array<Block>, game: Game, paddle: Paddle, borderThickness: number, brain: Brain): void {
        for (let i = 0; i < blocks.length; i++) {
            let block = blocks[i];
            if (this.top + this.height >= block.top &&
                this.top <= block.top + block.height &&
                this.left + this.width >= block.left &&
                this.left <= block.left + block.width && block.isAlive) {
                this.blockCollision(block, game, paddle, borderThickness, brain)
            }
        }
    }

    blockCollision(block: Block, game: Game, paddle: Paddle, borderThickness: number, brain: Brain): void {
        if (block.lives == 1) {
            this.removeBlockAndAddScore(block, game, paddle, borderThickness, brain);
        }
        else {
            block.lives -= 1;
            block.opacity = (block.opacity as number / (game.currentRoundNum + 1)).toString();
        }
        this.calculateBounceAngleOffBlocks(block)
    }

    removeBlockAndAddScore(block: Block, game: Game, paddle: Paddle, borderThickness: number, brain: Brain): void {
        game.round!.cleared++;
        game.score += 10 * ((game.currentRoundNum + 1) * 2);
        block.isAlive = false;
        block.opacity = 0;
        if (block.powerUp != null) {
            this.powerUpDropped(block, paddle, borderThickness, brain);
        }
    }

    powerUpDropped(block: Block, paddle: Paddle, borderThickness: number, brain: Brain): void {
        block.powerUp!.left = block.left;
        block.powerUp!.top = block.top;
        block.powerUp!.launchPowerUp(paddle, borderThickness, brain);
    }

    calculateBounceAngleOffBlocks(block: Block): void {
        let ballRight = this.left + this.width;
        let ballBottom = this.top + this.height;
        let blockRight = block.left + block.width;
        let blockBottom = block.top + block.height;

        let overlapX = Math.min(ballRight, blockRight) - Math.max(this.left, block.left);
        let overlapY = Math.min(ballBottom, blockBottom) - Math.max(this.top, block.top);
        if (overlapX >= overlapY) { //topCollision && bottomCollision
            this.topStep *= -1;
        } else {                    //leftCollision && rightCollision
            this.leftStep *= -1;
        }
    }

    topCanvasBallPosition(borderThickness: number): void {
        this.top = borderThickness;
        this.topStep *= -1;
    }

    bottomCanvasBallPosition(game: Game, brain: Brain, paddle: Paddle) {
        clearInterval(this.intervalId);
        if (game.round!.balls.length === 1 && game.round!.cleared !== game.round!.blocks!.length) {
            game.lives--;
            if (game.lives === 0) {
                game.gameOver = true;
                brain.saveLastGame();
                game.removeAllBallsAndPowerUpsFromRound();
            } else {
                this.resetBallLocation();
                paddle.resetPaddleLocation();
            }
        } else {
            this.removeBallFromRound(game);
        }
    }

    removeBallFromRound(game: Game): void {
        let ballIdx = game.round!.balls.indexOf(this);
        game.round!.balls.splice(ballIdx, 1);
    }

    leftCanvasBallPosition(borderThickness: number): void {
        this.left = borderThickness;
        this.leftStep *= -1;
    }

    rightCanvasBallPosition(borderThickness: number): void {
        this.left = 1000 - borderThickness - this.width;
        this.leftStep *= -1;
    }

    calculateBounceAngleOffPaddle(paddle: Paddle): void {
        let distanceFromCenter = this.left + this.width / 2 - paddle.left;
        let angle = Math.atan(distanceFromCenter / (paddle.width / 2));
        let currentSpeed = Math.sqrt(this.leftStep * this.leftStep + this.topStep * this.topStep);
        this.topStep = Math.cos(angle) * currentSpeed;
        this.leftStep = -Math.sin(angle) * currentSpeed;
    }

    resetBallLocation() {
        this.released = false;
        this.top = 800.5;
    }
}