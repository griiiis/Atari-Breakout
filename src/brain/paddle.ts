export class Paddle{
    public width: number = 80;
    public height: number = 30;
    public left: number = 500;
    public top: number = 850;
    public color: string = 'blue';

    private intervalId: number | undefined = undefined;

    movePaddle(step: number, borderThickness: number) : void{
        if(this.intervalId !== undefined) return;

        this.intervalId = setInterval(() => {
            this.left += 20 * step;
            this.validateAndFixPosition(borderThickness);
        }, 30);
    }

    validateAndFixPosition(borderThickness: number) : void {
        if(this.left - (this.width / 2)  < borderThickness){        //Left wall
            this.paddleLeftCanvasPosition(borderThickness);
        }

        if(this.left + (this.width / 2) > 1000 - borderThickness){  //Right wall
            this.paddleRightCanvasPosition(borderThickness);
        }
    }

    paddleLeftCanvasPosition(borderThickness: number){
        this.left = borderThickness + (this.width / 2) 
        clearInterval(this.intervalId);
        this.intervalId = undefined;
    }

    paddleRightCanvasPosition(borderThickness: number){
        this.left = (1000 - borderThickness) - (this.width / 2);
        clearInterval(this.intervalId);
        this.intervalId = undefined;
    }

    resetPaddleLocation(){
        this.left = 500;
        this.top = 850;
    };

    stopPaddleMovement(borderThickness: number) : void{
        if (!this.intervalId) return;
        clearInterval(this.intervalId);
        this.intervalId = undefined;
        this.validateAndFixPosition(borderThickness);
    }

}
