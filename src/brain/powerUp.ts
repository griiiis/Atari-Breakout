import { Ball } from "./ball.js";
import Brain from "./brain.js";
import { Paddle } from "./paddle.js";

export class PowerUp {
    public top: number = -1;
    public left: number = -1;
    readonly height: number = 20;
    readonly width: number = 20;

    public topStep: number = -1;
    public clear: boolean = false;

    public intervalId: number | undefined = undefined;

    constructor(public color: string, public power: string) {
    }

    stopPowerUps() {
        clearInterval(this.intervalId);
    }

    launchPowerUp(paddle: Paddle, borderThickness: number, brain: Brain) {
        this.intervalId = setInterval(() => {
            if (this.top > (1000 - borderThickness)) {
                clearInterval(this.intervalId);
                this.clear = true;
            }
            this.top -= this.topStep * 3;
            this.checkPaddleCollision(paddle, brain);
        }, 20)
    }

    checkPaddleCollision(paddle: Paddle, brain: Brain) {
        if (this.top > paddle.top - paddle.height * 0.5 - this.height * 0.5 &&
            this.top < paddle.top &&
            this.left > paddle.left - paddle.width * 0.5 - this.width * 0.5 &&
            this.left < paddle.left + paddle.width * 0.5 - this.width * 0.5) {
            this.clear = true;
            clearInterval(this.intervalId);

            switch (this.power) {
                case "multiply":
                    this.multiplyPowerUp(brain);
                    break;
                case "extended":
                    brain.paddle!.width = brain.paddle!.width * 1.5;
                    break;
                case "shrink":
                    brain.paddle!.width = brain.paddle!.width / 1.5;
                    break;

                case "extra-life":
                    brain.game!.lives++;
                    break;

            }

        }
    }

    multiplyPowerUp(brain: Brain) {
        let extraBall1 = new Ball();
        let extraBall2 = new Ball();
        extraBall1.left = brain.game!.round!.balls[0].left;
        extraBall2.left = brain.game!.round!.balls[0].left;
        brain.game!.round!.balls.push(extraBall1, extraBall2);
        brain.launchBall(brain.game!.round!.balls[0].top, -1, 1, extraBall1);
        brain.launchBall(brain.game!.round!.balls[0].top, 1, 1, extraBall2);
    }
}