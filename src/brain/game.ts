import { Ball } from "./ball.js";
import Brain from "./brain.js";
import { Round } from "./round.js";

export class Game {
    public lives: number= 3;
    public score: number = 0;
    public currentRoundNum: number = 0;
    public totalRounds: number = 5;
    public createdAt: string = this.formatted_date();
    public gameOver: boolean = false;
    public round: Round | undefined = undefined;

    generateNewRound() : void{
        switch(this.currentRoundNum){
            case 0:
                this.round = new Round(1, 200, 300, 1);
                break;
            case 1:
                this.round = new Round(1, 200, 50, 1.2);
                break;
            case 2:
                this.round = new Round(2, 200, 5, 1.3);
                break;
            case 3:
                this.round = new Round(1, 200, 10, 1.4);
                break;
            case 4:
                this.round = new Round(2, 200, 40, 1.5);
                break;
        }
    }

    formatted_date() : string{
        var result="";
        var d = new Date();
        result += d.getFullYear()+"/"+(d.getMonth()+1)+"/"+d.getDate() + 
                  " "+ d.getHours()+":"+d.getMinutes()+":"+
                  d.getSeconds();
        return result;
    }

    newRoundOrGameCompleted(brain: Brain, ball: Ball) {
        this.removeAllBallsAndPowerUpsFromRound();
        if (this.currentRoundNum + 1 === this.totalRounds) { //Game completed
            this.gameOver = true;
            brain.saveLastGame();
        }
        else {
            brain.newRound();
            ball.top = 0;
            ball.left = 0;
        }
    }

    removeAllBallsAndPowerUpsFromRound(){
        this.round!.balls.forEach(ball => clearInterval(ball.intervalId));
        this.round!.balls = [];
        this.round!.blocks!.forEach(block => {
            if (block.powerUp && block.powerUp.intervalId) {
                clearInterval(block.powerUp.intervalId);
            }
        });
    }
}