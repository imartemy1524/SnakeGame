class Point{
    static TYPE_BONUS_500=4;
    static TYPE_WALL=3;
    static TYPE_HEAD=2;
    static TYPE_FOOD=1;
    static TYPE_BODY=0;
    constructor(x,y,type=Point.TYPE_BODY){
        this.x=x;
        this.y=y;
        this.type=type;
    }
    equals(other){
        return other.x===this.x && other.y===this.y;
    }
    toString(){
        return `{x: ${this.x}, y: ${this.y}, type: ${this.type}}`
    }
    setType(type){this.type=type;return this}
    static fromData(data){
        return data instanceof Point?data:
            new Point(data.x??data[0],data.y??data[1],data.type??data[2]??Point.TYPE_WALL)
    }
}
export default Point;