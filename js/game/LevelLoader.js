import LinkedList from "../utils/linkedList.js";

class LevelLoader{
    constructor(number){this.number=number}
    getPath(){return `./levels/${this.number}.bmp`}
    /**@returns Promise*/
    load(){
        return new Promise(this.getImg.bind(this))
            .then(img =>{
                const w=img.width,
                    h=img.height,
                    canvas = $("<canvas>").attr({'width':w,'height':h}),
                    context = canvas[0].getContext('2d');
                context.drawImage(img,0,0);
                const imageData = context.getImageData(0,0,w,h).data;
                return this.toLinkedList(imageData,w,h)
            })
    }
    getImg(success,error){
        $('<img/>').attr('src',this.getPath(this.number))
            .on({'load':function () {success(this)},'error':error})
    }
    toLinkedList(imageData,w,h){
        let answer = new LinkedList();
        for(let x = 0;x<w;x++){
            for(let y=0;y<h;y++){
                if(!imageData[(x*w+y)*4]){
                    answer.push([x,y])
                }
            }
        }
        return [w,h,answer];
    }
}
export default LevelLoader;