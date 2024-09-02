import Brain
 from "./brain/brain.js";

import { Block } from "./brain/block.js";
export default class UI {


    //real screen dimensions

    public width: number = -1;
    public height: number = -1;
    private scaleY: number = -1;
    private scaleX: number = -1;
    private timeoutId: number | undefined = undefined;

    constructor(private brain: Brain, private appContainer: Element){
        this.brain = brain;
        this.appContainer = appContainer;
    }

    setScreenDimensions() : void{

        this.width = document.documentElement.clientWidth;
        this.height = document.documentElement.clientHeight;

        this.scaleX = this.width / this.brain!.width;
        this.scaleY = this.height / this.brain!.height; 
    }

    calculateScaledX(x: number) : number{
        return x * this.scaleX | 0;
    }

    calculateScaledY(y: number) : number{
        return y * this.scaleY | 0;
    }
        

    drawPaddle() : void {
         let newPaddle = document.createElement('div');
        
        newPaddle.style.position = 'fixed';

        newPaddle.style.left = this.calculateScaledX(this.brain.paddle!.left - (this.brain.paddle!.width / 2)) + "px";
        newPaddle.style.top = this.calculateScaledY(this.brain.paddle!.top) + "px";
        newPaddle.style.width = this.calculateScaledX(this.brain.paddle!.width) + "px";
        newPaddle.style.height = this.calculateScaledY(this.brain.paddle!.height) + "px";

        newPaddle.style.background = this.brain.paddle!.color;
        this.appContainer.append(newPaddle);
    }


    drawSingleBorder(left: number, top: number, width: number, height: number, color: string) : void {
        let newBorder = document.createElement('div');

        newBorder.style.position = 'fixed';

        newBorder.style.left = left + "px";
        newBorder.style.top = top + "px";
        newBorder.style.width = width + "px";
        newBorder.style.height = height + "px";

        newBorder.style.background = color;

        this.appContainer.append(newBorder);
    }

    drawBorder() : void {
        this.drawSingleBorder(0, 0, this.width, this.calculateScaledY(this.brain.borderThickness), 'red')
        this.drawSingleBorder(0, 0, this.calculateScaledX(this.brain.borderThickness), this.height, 'red')
        this.drawSingleBorder(this.width - this.calculateScaledX(this.brain.borderThickness) , 0, this.calculateScaledX(this.brain.borderThickness), this.height, 'red')
        this.drawSingleBorder(0, this.height - this.calculateScaledY(this.brain.borderThickness), this.width, this.calculateScaledY(this.brain.borderThickness), 'red')
    }

    drawBall() : void {
        this.brain.game!.round!.balls.forEach(ball => {
            if(!ball.released && this.brain.game!.round!.balls.length === 1){
                ball.left = this.brain.paddle!.left - (ball.width / 2);
                ball.top = this.brain.paddle!.top - ball.height;
            }
            let newBall = document.createElement('div');
        
            newBall.style.position = 'fixed';
            newBall.style.left = this.calculateScaledX(ball.left) + "px";
            newBall.style.top = this.calculateScaledY(ball.top) + "px";
            newBall.style.width = this.calculateScaledX(ball.width) + "px";
            newBall.style.height = this.calculateScaledY(ball.height) + "px";
            newBall.style.background = 'grey';
            newBall.style.borderRadius = '50%';
            this.appContainer.append(newBall);
        });
    }

    drawBlocks() : void {
        this.brain.game!.round!.blocks!.forEach(element => {
            if(element.isAlive){
                let block = document.createElement('div');
                block.style.position = 'fixed';
                block.style.left = this.calculateScaledX(element.left) + "px";
                block.style.top = this.calculateScaledY(element.top) + "px";
                block.style.width = this.calculateScaledX(element.width) + "px";
                block.style.height = this.calculateScaledY(element.height) + "px";
                block.style.background = 'green';
                block.style.opacity = element.opacity.toString();
                this.appContainer.append(block);
            } else {
                this.drawPowerUps(element);
            }
        });
    }
    drawScoreBoard() : void {
        if(this.brain.games.length > 0){
            let score = this.brain.highestScoreGame!.score;
            if(this.brain.game!.score > this.brain.highestScoreGame!.score){
                score = this.brain.game!.score;
            }
            let highestScore = document.createElement('div');
            let highestScoreText = document.createTextNode("Highest Score: " + score);
            highestScore.style.zIndex = "10";
            highestScore.style.position = 'fixed';
            highestScore.style.left = this.calculateScaledX(50) + "px";
            highestScore.style.top = this.calculateScaledY(50) + "px";
            highestScore.style.width = this.calculateScaledX(100) + "px";
            highestScore.style.height = this.calculateScaledY(200) + "px";
            highestScore.style.whiteSpace = 'nowrap';

            highestScore.appendChild(highestScoreText)
            this.appContainer.append(highestScore);
        }
    
        let currentScore = document.createElement('div');
        let currentScoreText = document.createTextNode("Current Score: " + this.brain.game!.score);

        currentScore.style.zIndex = "10";
        currentScore.style.position = 'fixed';
        currentScore.style.left = this.calculateScaledX(50) + "px";
        currentScore.style.top = this.calculateScaledY(70) + "px";
        currentScore.style.width = this.calculateScaledX(100) + "px";
        currentScore.style.height = this.calculateScaledY(200) + "px";
        currentScore.style.whiteSpace = 'nowrap';

        currentScore.appendChild(currentScoreText)
        this.appContainer.append(currentScore);
    }

    drawLives() : void {
        let lives = document.createElement('div');
        let livesText = document.createTextNode("Lives Count: " + this.brain.game!.lives);

        lives.style.zIndex = "10";
        lives.style.position = 'fixed';
        lives.style.left = this.calculateScaledX(50) + "px";
        lives.style.top = this.calculateScaledY(950) + "px";
        lives.style.width = this.calculateScaledX(100) + "px";
        lives.style.height = this.calculateScaledY(200) + "px";
        lives.style.whiteSpace = 'nowrap';

        lives.appendChild(livesText)
        this.appContainer.append(lives);
    }

    drawStartNewGame(left: string, top: string) : void{
        let startGameText = document.createTextNode("Start New Game");
        let startGame = document.createElement('div');
        startGame.setAttribute("id", "startGame");

        startGame.style.zIndex = "10";
        startGame.style.position = 'absolute';
        startGame.style.left = left;
        startGame.style.top = top;
        startGame.style.width = this.calculateScaledX(50) + "px";
        startGame.style.height = this.calculateScaledY(50) + "px";
        startGame.style.whiteSpace = 'nowrap';
        startGame.style.transform = 'translate(-50%, -50%)';
        startGame.style.width = "auto";
        startGame.style.display = "inline-block";
        startGame.style.cursor = 'pointer';

        startGame.style.fontSize = 40 + "px";
        startGame.style.fontFamily = 'Arial, sans-serif';

        startGame.addEventListener("mouseover", () => {
            startGame.style.color = 'blue';
            startGame.style.fontSize = 42 + "px";
        })

        startGame.addEventListener("mouseout", () => {
            startGame.style.color = 'black';
            startGame.style.fontSize = 40 + "px";
        })

        startGame.appendChild(startGameText);
        this.appContainer.append(startGame);
        this.drawAllResults();
    }

    drawGameOver() : void{
        let gameOverText = document.createTextNode("Game Over!");
        let gameOver = document.createElement('div');

        gameOver.style.zIndex = "10";
        gameOver.style.position = 'absolute';
        gameOver.style.left = '50%';
        gameOver.style.top = '50%';
        gameOver.style.width = this.calculateScaledX(50) + "px";
        gameOver.style.height = this.calculateScaledY(50) + "px";
        gameOver.style.whiteSpace = 'nowrap';
        gameOver.style.transform = 'translate(-50%, -50%)';
        gameOver.style.width = "auto";
        gameOver.style.display = "inline-block";

        gameOver.style.fontSize = 40 + "px";
        gameOver.style.fontFamily = 'Arial, sans-serif';

        gameOver.appendChild(gameOverText);
        this.appContainer.append(gameOver);
        this.drawRoundGameScore();
        this.drawStartNewGame("50%","70%");
    }

    drawRoundGameScore() : void{
        let score = document.createElement('div');
        let scoreText = document.createTextNode("Your Score: " + this.brain.game!.score);

        score.style.zIndex = "10";
        score.style.position = 'fixed';
        score.style.left = '50%';
        score.style.top = this.calculateScaledY(550) + "px";
        score.style.width = this.calculateScaledX(50) + "px";
        score.style.height = this.calculateScaledY(50) + "px";
        score.style.whiteSpace = 'nowrap';
        score.style.transform = 'translate(-50%, -50%)';
        score.style.width = "auto";
        score.style.display = "inline-block";
        score.style.fontSize = 25 + "px";
        score.style.fontFamily = 'Arial, sans-serif';

        score.appendChild(scoreText)
        this.appContainer.append(score);
    }

    uiRepeater() : void {
        if (this.brain.game!.gameOver || this.brain.gamePaused || this.brain.game!.currentRoundNum === this.brain.game!.totalRounds) {
            clearTimeout(this.timeoutId);
        } else {
            this.timeoutId = setTimeout(() => {
                this.draw();
                this.uiRepeater();
            }, 0);
        }
    }

    startPause() : void{
        let pauseScreen = document.createElement('div');
        pauseScreen.setAttribute("id", "pauseScreen");

        let pauseText = document.createElement('h1');
        pauseText.textContent = 'Game Paused';
        pauseScreen.appendChild(pauseText);
        this.appContainer.append(pauseScreen);
    }

    drawRound() : void {
        let round = document.createElement('div');
        let roundText = document.createTextNode("Round: " + (this.brain.game!.currentRoundNum + 1) + "/" + this.brain.game!.totalRounds);

        round.style.zIndex = "10";
        round.style.position = 'fixed';
        round.style.left = this.calculateScaledX(800) + "px";
        round.style.top = this.calculateScaledY(70) + "px";
        round.style.width = this.calculateScaledX(100) + "px";
        round.style.height = this.calculateScaledY(200) + "px";
        round.style.whiteSpace = 'nowrap';

        round.appendChild(roundText)
        this.appContainer.append(round);

    }

    drawRoundCompleted() : void{
        let round = document.createElement('div');
        let roundText = document.createTextNode("Round " + this.brain.game!.currentRoundNum + " Completed!");

        round.style.zIndex = "10";
        round.style.position = 'absolute';
        round.style.left = '50%';
        round.style.top = '50%';
        round.style.width = this.calculateScaledX(50) + "px";
        round.style.height = this.calculateScaledY(50) + "px";
        round.style.whiteSpace = 'nowrap';
        round.style.transform = 'translate(-50%, -50%)';
        round.style.width = "auto";
        round.style.display = "inline-block";

        round.style.fontSize = 40 + "px";
        round.style.fontFamily = 'Arial, sans-serif';
        round.appendChild(roundText)
        this.appContainer.append(round);
    }

    drawPowerUps(block: Block) : void{
        if(block.powerUp != null && !block.powerUp.clear){
            let powerUp = document.createElement('div');
            powerUp.style.position = 'fixed';
            powerUp.style.left = this.calculateScaledX(block.powerUp.left) + "px";
            powerUp.style.top = this.calculateScaledY(block.powerUp.top) + "px";
            powerUp.style.width = this.calculateScaledX(block.powerUp.width) + "px";
            powerUp.style.height = this.calculateScaledY(block.powerUp.height) + "px";
            powerUp.style.background = block.powerUp.color;
            powerUp.style.borderRadius = '50%';
            powerUp.style.opacity = "1";
            this.appContainer.append(powerUp);
        }
    };

    drawWonGame() : void{
        let gameWon = document.createElement('div');
        let gameWonText = document.createTextNode("Game Completed!");

        gameWon.style.zIndex = "10";
        gameWon.style.position = 'absolute';
        gameWon.style.left = '50%';
        gameWon.style.top = '50%';
        gameWon.style.width = this.calculateScaledX(50) + "px";
        gameWon.style.height = this.calculateScaledY(50) + "px";
        gameWon.style.whiteSpace = 'nowrap';
        gameWon.style.transform = 'translate(-50%, -50%)';
        gameWon.style.width = "auto";
        gameWon.style.display = "inline-block";

        gameWon.style.fontSize = 40 + "px";
        gameWon.style.fontFamily = 'Arial, sans-serif';
        gameWon.appendChild(gameWonText)
        this.appContainer.append(gameWon);

        this.drawStartNewGame("50%","70%");
        this.drawRoundGameScore();
    }

    drawAllResults() : void{
        let resultsContainer = document.createElement('div');
        resultsContainer.style.zIndex = "10";
        resultsContainer.style.position = 'fixed';
        resultsContainer.style.left = '10px'; 
        resultsContainer.style.top = '10px'; 
        resultsContainer.style.textAlign = 'left'; 
        resultsContainer.style.fontSize = '15px';
        resultsContainer.style.fontFamily = 'Arial, sans-serif';
        resultsContainer.style.backgroundColor = 'rgba(255, 255, 255, 0.7)';
        resultsContainer.style.padding = '10px';
        resultsContainer.style.borderRadius = '5px';

        this.brain.games.sort((a, b) => b.score - a.score);
    
            this.brain.games.forEach((game, index) => {
                let gameResult = document.createElement('div');
                gameResult.textContent = `Game ${index + 1}: Score - ${game.score}, Lives - ${game.lives}, Round - ${game.currentRoundNum + 1}, Start - ${game.createdAt}`;
                resultsContainer.appendChild(gameResult);
            });
    
            this.appContainer.append(resultsContainer);
    }



    draw() : void{
        // clear previous render
        this.appContainer.innerHTML = '';
        this.setScreenDimensions();
        if(this.brain.game!.currentRoundNum === this.brain.game!.totalRounds){
            this.drawWonGame();
            this.drawAllResults();
        }
        else
        {
            if(this.brain.game!.gameOver){
                this.drawGameOver();
                this.drawAllResults();
            }   
            else if(this.brain.game!.currentRoundNum !== 0 && !this.brain.game!.round!.balls[0].released && this.brain.game?.round?.cleared === 0){
            this.drawRoundCompleted();

        }
        if (!this.brain.game!.gameOver) {
            this.drawBorder();
            this.drawPaddle();
            this.drawBall();
            this.drawBlocks();
            this.drawScoreBoard();
            this.drawLives();
            this.drawRound();
        }
}
}

}