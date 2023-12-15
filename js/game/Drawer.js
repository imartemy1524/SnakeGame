import Snake from "./Snake.js"
import Point from "../utils/Point.js"
const coefficient = 20;
class Drawer{
    constructor(canvas){
        /**@const*/this.dataImagesSrc =['apple','wall','bonus'];
        this.dataImages = {};
        ///**@const*/this.foodItem = "./img/apple.png";
        ///**@const*/this.wallItem = "./img/wall.png";
        this.canvas = canvas;
        this.isReady = false;
        this.loadImages().then(()=>this.isReady=true)
            .catch(alert)
    }
    updateData(width,height,snakeColor){
        this.canvas.width=width*coefficient;
        this.canvas.height=height*coefficient;
        this.snakeColor = snakeColor;
        this.ctx = this.canvas.getContext("2d");
    }
    /**
     * @public
     * @param {Snake} snake
     * */
    redraw(snake){
        this.ctx.clearRect(0,0,snake.blockWidth * coefficient,snake.blockHeight*coefficient);
        const dataMethods = {
            [Point.TYPE_BODY]:this.drawBody,
            [Point.TYPE_HEAD]:this.drawHead,
            [Point.TYPE_FOOD]:this.drawApple.bind(this,snake),
            [Point.TYPE_WALL]:this.drawWall,
            [Point.TYPE_BONUS_500]:this.drawBonus,
        };
        for(let object of snake.allObjects()){
            const xPos = object.x*coefficient,
                yPos = object.y*coefficient;
            dataMethods[object.type].call(this,object,xPos,yPos);
            /*switch (object.type) {
                case Point.TYPE_BODY:
                    this.drawBody(object,xPos,yPos);
                    break;
                case Point.TYPE_HEAD:
                    this.drawHead(object,xPos,yPos);
                    break;
                case Point.TYPE_FOOD:
                    this.drawApple(snake,object,xPos,yPos);
                    break;
                case Point.TYPE_WALL:
                    this.drawWall(object,xPos,yPos);
                    break;
                case Point.TYPE_BONUS_AUTO:
                    this.drawBonus(object,xPos,yPos);
                    break;
            }*/
        }

        this.drawApple(snake)
    }
    drawBonus(point,xPos,yPos){
        //this.ctx.fillStyle = "black";
        //this.ctx.fillRect(xPos,yPos,coefficient,coefficient);
        this.ctx.drawImage(this.dataImages['bonus'],xPos,yPos,coefficient,coefficient)
    }
    drawWall(point,xPos,yPos){
        //this.ctx.fillStyle = "black";
        //this.ctx.fillRect(xPos,yPos,coefficient,coefficient);
        this.ctx.drawImage(this.dataImages['wall'],xPos,yPos,coefficient,coefficient)
    }
    drawBody(point,xPos,yPos){
        this.ctx.fillStyle = this.snakeColor;
        this.ctx.fillRect(xPos,yPos,coefficient,coefficient);
    }
    drawHead(point,xPos,yPos){
        this.drawBody(point,xPos,yPos);
        const borderSize = coefficient/3,
            size = coefficient - borderSize*2;
        this.ctx.clearRect(xPos + borderSize,yPos + borderSize,size,size);

    }
    drawApple(snake,apple,xPos,yPos){
        const sizePercent = (1/3) * (snake.pointsController.foodSize) + 1/3,
            widthHeight = coefficient*sizePercent,
            offset=coefficient*(1-sizePercent)/2;//from 1/3 to 2/3 of one square
        this.ctx.drawImage(this.dataImages['apple'],
            xPos+offset,
            yPos+offset,
            widthHeight, widthHeight)
            //this.ctx.fillStyle = this.foodItem;
            //from 1 to 1/3
            //this.ctx.fillRect()

    }
    loadImages(){
        return Promise.all(this.dataImagesSrc.map(
            title=>new Promise((success,fail)=>{
                const img = $(new Image).attr("src",`./img/${title}.png`);
                img.on({
                    'load' :()=>success(this.dataImages[title] = img[0]),
                    'error':fail
                })
            }))
        );
    }
}
export default Drawer;