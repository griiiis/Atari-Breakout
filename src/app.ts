import Brain from "./brain/brain.js";
import UI from "./ui.js";

function main(){
    if(document.querySelectorAll("#app").length != 1){
        throw new Error("There can't be more than 1 app!")
    }
    let appDiv = document.querySelector("#app");

    let brain = new Brain();
    brain.loadGameResultsFromLocalStorage();
    let ui = new UI(brain, appDiv!);

    ui.drawStartNewGame("50%","50%");
    
    document.addEventListener("keydown", (e : KeyboardEvent) => {
        if (brain.paddle != null){
        if (e.key === 'a' && !brain.gamePaused || e.key === 'ArrowLeft' && !brain.gamePaused) {
                    brain.startMovePaddle(-1);
                }
        if (e.key === 'd' && !brain.gamePaused || e.key === 'ArrowRight' && !brain.gamePaused) {
                    brain.startMovePaddle(1);
                }
        if (e.key === 'Escape'){
                if(!brain.gamePaused){
                    brain.gamePaused = true;
                    brain.game!.round!.balls.forEach((ball) => {
                        ball.beforePauseLeftStep = ball.leftStep;
                        ball.beforePauseTopStep = ball.topStep;
                        brain.launchBall(ball.top, 0, 0, ball);
                    });
                    ui.uiRepeater();
                    ui.startPause();
                } else {
                    brain.gamePaused = false;
                    brain.game!.round!.balls.forEach((ball) => {
                        brain.launchBall(ball.top, ball.beforePauseLeftStep, ball.beforePauseTopStep, ball);
                    });
                    ui.uiRepeater();
                }
        }
    }
    }
    );

    document.addEventListener("keyup", (e : KeyboardEvent) => {
        if (brain.paddle != null){
        switch(e.key){
            case 'a':
            case "ArrowLeft":
                brain.stopMovePaddle();
                break;
            case 'd':
            case "ArrowRight":
                brain.stopMovePaddle();
                break;
        }
    }
    });

    document.addEventListener("keypress", (e : KeyboardEvent) => {
        switch(e.key){
            case ' ':
                if(brain.game!.round!.balls[0] != null && !brain.game!.round!.balls[0].released && brain.game != null){
                    brain.launchBall(800.5, -0.75, 1, brain.game.round!.balls[0]);
                }
                break;

        }
    });


    document.addEventListener("click", (e : MouseEvent) => {
        const target = e.target as HTMLElement;
        if (target.id === "startGame") {
            brain.startNewGame();
            ui.uiRepeater();
        }
    }); 
}

main();