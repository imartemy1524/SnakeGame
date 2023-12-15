import Snake from "./Snake.js" ;
class Mover{
    /**
     * @param {number} timeout
     * @param {Snake} snake*/
    constructor(snake,timeout) {
        this.timeout=timeout;
        this.snake = snake;
        this.pauseBtn = $("#pause-btn").fadeIn();
        $(window).on('keydown',ev=>{
            switch (ev.key) {
                case "ArrowUp":
                    snake.setDirection(Snake.DIRECTION_TOP);
                    break;
                case "ArrowDown":
                    snake.setDirection(Snake.DIRECTION_BOTTOM);
                    break;
                case "ArrowRight":
                    snake.setDirection(Snake.DIRECTION_RIGHT);
                    break;
                case "ArrowLeft":
                    snake.setDirection(Snake.DIRECTION_LEFT);
                    break;
                case " ":
                    this.pauseBtn.click();
            }
        })
    }
    start(){
        const stop = ()=>{
            clearInterval(this.interval);
            this.snake.stop();
        };
        this.snake.start();
        this.interval = setInterval(()=>{
            if(!this.snake.move(this)) stop();
        },this.timeout);
        this.waitForPause().then(()=>{
            stop();
            return this.waitForPause();
        }).then(this.start.bind(this))
    }
    waitForPause(){
        return new Promise(success=>this.pauseBtn.on('click',()=> {
            this.pauseBtn.off('click');
            this.pauseBtn.text(this.pauseBtn.text()==='Pause'?'Resume':'Pause');
            success();
        }))
    }

}
export default Mover;