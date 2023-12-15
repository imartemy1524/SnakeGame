import Utils from "../../utils/Utils.js";
import Point from "../../utils/Point.js";

class BonusController {
    static ALL_BONUS = [Point.TYPE_BONUS_500];
    randomBonus(){
        const type =  BonusController.ALL_BONUS[Utils.randomInt(BonusController.ALL_BONUS.length)];
        return Utils.getRandomPoint(this.snake.blockWidth, this.snake.blockHeight,
            this.snake.isPointValid, type);
    }

    /**
     * @param {Snake} snake */
    constructor(snake){
        this.snake = snake;
        this.bonus = null;
        this.updateBonusTime()
    }
    //called each snake move
    update(){
        if(this.nextBonus && --this.nextBonus === 0){
            this.bonus = this.randomBonus();
            this.endBonus = Utils.randomInt(30,60);
        }
        if(this.endBonus && --this.endBonus === 0)
            this.deleteBonus();
    }
    deleteBonus(){
        this.bonus=null;
        this.updateBonusTime();
    }
    updateBonusTime(){
        this.nextBonus = Utils.randomInt(30,230)
    }
    /**@param {Point} head*/
    isBonusGrabbed(head){
        return this.bonus && this.bonus.equals(head)
    }
}

export default BonusController;