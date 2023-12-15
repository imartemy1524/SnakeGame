import Drawer from "./Drawer.js";
import LinkedList from "../utils/linkedList.js";
import PointsController from "./controller/PointsController.js";
import Point from "../utils/Point.js";
import BonusController from "./controller/BonusController.js";
class Snake{
    static DIRECTION_RIGHT=0;
    static DIRECTION_LEFT=1;
    static DIRECTION_TOP=2;
    static DIRECTION_BOTTOM=4;

    /**
     * @param {number} width
     * @param {number} height
     * @param {string} snakeColor
     * @param {number} timeForGettingFood
     * @param {Drawer} drawer
     * @param {LinkedList} bridges
     * */
    constructor(width,height,snakeColor,timeForGettingFood,drawer,bridges){
        this.isPointValid = point=>{
            const equals = p=>p.equals(point);
            return !this.dataSnake.any(equals) && !this.bridges.any(equals)
        };
        this.blockWidth = width;
        this.blockHeight = height;
        this.bridges = bridges.map(Point.fromData);
        this.lastDirection = Snake.DIRECTION_RIGHT;
        this.direction = new LinkedList();
        this.dataSnake = new LinkedList(
            new Point(0,0),
            new Point(1,0),
            new Point(2,0,Point.TYPE_HEAD)
        );
        this.drawer = drawer;
        this.pointsController = new PointsController(this,timeForGettingFood);
        this.bonusController = new BonusController(this);
    }
    move(mover){
        this.bonusController.update();
        const lastEl = this.dataSnake.pop(0),//removing the last element of the snake
            lastHead = this.dataSnake.at(-1).setType(Point.TYPE_BODY),//getting head
            newHead = new Point(lastHead.x,lastHead.y, Point.TYPE_HEAD);
        switch (this.lastDirection = this.direction.pop(0)??this.lastDirection) {
            case Snake.DIRECTION_RIGHT:
                newHead.x++;
                break;
            case Snake.DIRECTION_LEFT:
                newHead.x--;
                break;
            case Snake.DIRECTION_BOTTOM:
                newHead.y++;
                break;
            case Snake.DIRECTION_TOP:
                newHead.y--;
                break;
        }
        if(this.moveCheck(newHead,lastEl,mover)) {
            this.dataSnake.push(newHead);
            this.drawer.redraw(this);
            return true;
        }
    }
    moveCheck(head,lastEl,mover){
        if(this.isGameOver(head)) return Snake.gameOver();
        if(this.pointsController.ifFoodGrabbed(head)) {
            this.pointsController.addScore();
            this.addNewEl(lastEl);
            this.pointsController.spamNewFood();
        }
        if(this.bonusController.isBonusGrabbed(head)){
            const getScore = x=>17*x**3-145*x**2+235*x+417;
            this.pointsController.addScore(getScore(mover.timeout/100));
            this.bonusController.deleteBonus();
        }
        return true
    }
    isGameOver(checkEl){
        const equals = element => element.equals(checkEl);
        return this.dataSnake.any(equals) || this.bridges.any(equals)
            || checkEl.x<0 || checkEl.y<0
            || checkEl.x >= this.blockWidth || checkEl.y >= this.blockHeight;
    }
    setDirection(direction){
        let success = false;
        const lastDirection = this.direction.at(-1)??this.lastDirection;
        switch (direction) {
            case Snake.DIRECTION_TOP:
                if(lastDirection!==Snake.DIRECTION_BOTTOM)
                    success=true;
                break;
            case Snake.DIRECTION_BOTTOM:
                if(lastDirection!==Snake.DIRECTION_TOP)
                    success=true;
                break;
            case Snake.DIRECTION_LEFT:
                if(lastDirection!==Snake.DIRECTION_RIGHT)
                    success=true;
                break;
            case Snake.DIRECTION_RIGHT:
                if(lastDirection!==Snake.DIRECTION_LEFT)
                    success=true;
                break;
            default:throw `invalid direction, got ${direction}`;
        }
        if(success) this.direction.push(direction);
    }
    addNewEl(where) {
        this.dataSnake.pushForward(new Point(where.x,where.y))
    }
    start(){
        this.pointsController.start();
    }
    stop(){
        this.pointsController.stop();
    }

    *allObjects(){
        for(let i of this.bridges.iterator())yield i;
        for(let i of this.dataSnake.iterator())yield i;
        yield this.pointsController.foodPosition;
        if(this.bonusController.bonus)
            yield this.bonusController.bonus;
    }
    static gameOver(){
        $("#end-game,#start-btn").fadeIn();
        $("#pause-btn").css('display','none');
    }

}
export default Snake;