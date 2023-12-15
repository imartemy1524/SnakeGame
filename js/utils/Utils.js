import Point from "./Point.js";

const Utils = {
    randomInt(min,max){
        //exclude max
        if(max===undefined)max=min,min=0;
        return ~~(Math.random()*(max-min))+min
    },
    inRange(el,min,max){
        if(max === undefined)max=min,min=0;
        return el<min?min:el>max?max:el;
    },
    overRange(el,max){
        //exclude max
        return el-max*~~(el/max);
    },
    /**
     * @param {number} width
     * @param {number} height
     * @param {function<Point, boolean>} isPointValid
     * @param {number} type
     * */
    getRandomPoint(width,height,isPointValid,type){
        const randomPoint = new Point(this.randomInt(width),this.randomInt(height),type),
            defX=randomPoint.x,
            defY=randomPoint.y;
        while(!isPointValid(randomPoint)){
            randomPoint.x = this.overRange(randomPoint.x+1,width);
            randomPoint.y = this.overRange(randomPoint.y+1,height);
            if(randomPoint.x === defX && defY === randomPoint.y)
                randomPoint.x++;
        }
        return randomPoint;
    }
};
export default Utils