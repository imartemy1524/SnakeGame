import Point from "../../utils/Point.js";
import Utils from "../../utils/Utils.js";

class PointsController{
    constructor(snake,timeForGetting){
        this.snake=snake;
        this.foodPosition = null;
        this.spamNewFood();
        this._score = 0;
        this.sizesCount=5;
        this.timeForGetting=timeForGetting;
        this.foodSize = 1;
        this.updateElement = $("#score b");
        this.nullableScore();
    }
    addScore(score=100 * this.foodSize){
        this._score+=score;
        this.updateElement.text(Math.round(this._score))
    }
    nullableScore(){
        this.updateElement.text('0')
    }
    ifFoodGrabbed(head){
        return this.foodPosition.equals(head);
    }
    spamNewFood(){
        this.foodSize=1;
        this.foodPosition = Utils.getRandomPoint(this.snake.blockWidth,this.snake.blockHeight,
            this.snake.isPointValid,
            Point.TYPE_FOOD);
    }
    start(){
        const g = ()=>{
            if((this.foodSize -=.1) < 1e-8)
                this.spamNewFood();
            this.timeout = setTimeout(g,this.timeForGetting/this.sizesCount)
        };
        this.timeout = setTimeout(g,this.timeForGetting/this.sizesCount)
    }
    stop(){
        clearTimeout(this.timeout)
    }
}
export default PointsController;