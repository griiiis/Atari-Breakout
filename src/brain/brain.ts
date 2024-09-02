import { Ball } from "./ball.js";
import { Game } from "./game.js";
import { Paddle } from "./paddle.js";

export default class Brain{
    readonly width: number = 1000;
    readonly height: number = 1000;
    readonly borderThickness: number = 0;

    public paddle: Paddle | undefined = undefined;
    public game: Game | undefined = undefined;
    public games: Array<Game> = new Array();

    public gamePaused: boolean = false;
    public highestScoreGame:Game | undefined  = undefined;

    startMovePaddle(step: number) : void{
        this.paddle?.movePaddle(step, this.borderThickness);
    }
    
    stopMovePaddle() : void{
        this.paddle?.stopPaddleMovement(this.borderThickness);
    }

    launchBall(top: number, leftStep: number, topStep: number, ball: Ball){
        ball.moveBall(top, leftStep, topStep, this.borderThickness, this.paddle!, this.game!, this);
    }

    startNewGame(){
        this.game = new Game();
        this.paddle = new Paddle();
        this.game.generateNewRound();
        this.game.round!.generateblocks(this.width,this.borderThickness, this.game!);
        this.findHighestScoreGame();
    }

    newRound(){
        this.game!.currentRoundNum++;
        this.paddle = new Paddle();
        this.game!.generateNewRound();
        this.game!.round!.generateblocks(this.width, this.borderThickness, this.game!);
        this.findHighestScoreGame();
    }

    saveLastGame(){
        this.games.push(this.game!);
        this.saveGameResultsToLocalStorage()
    }

    saveGameResultsToLocalStorage() {
        localStorage.setItem('gameResults', JSON.stringify(this.games));
    }

    loadGameResultsFromLocalStorage() {
        const savedGameResults = localStorage.getItem('gameResults');
        if (savedGameResults) {
            this.games = JSON.parse(savedGameResults);
        }
    }

    findHighestScoreGame(){
        const gamesWithScore = this.games.filter(game => game && typeof game.score !== 'undefined');
        if (gamesWithScore.length > 0) {
            this.highestScoreGame = gamesWithScore
                .sort((a, b) => b.score - a.score)[0];
        }
    }
}