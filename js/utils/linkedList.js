class Item{
    constructor(value,previous=null,next=null) {
        this.previous = previous;
        this.next = next;
        this.value = value;
    }
    remove(parentArray){
        this.previous?.setNext(this.next);
        this.next?.setPrevious(this.previous);
        if(parentArray.first === this)
            parentArray.first=this.next;
        else if(parentArray.last === this)
            parentArray.last=this.previous;
        parentArray.length--;
        return this;
    }
    setNext(v){this.next=v;}
    setPrevious(v){this.previous=v;}
}
class LinkedList{
    static CALLBACK_REMOVE = 1;
    static CALLBACK_BREAK = 2;
    static CALLBACK_REPLACE_WITH = 4;
    constructor(...args){
        this.length=0;
        this.push(...args)
    }
    push(...values){
        for(let i of values) {
            const item = new Item(i, this.last);
            if (this.length++ === 0) this.first = item;
            else this.last.setNext(item);
            this.last = item;
        }
    }
    pushForward(...values){
        for(let i=values.length;--i>=0;){
            const item = new Item(values[i],null,this.first);
            if(this.length++ === 0) this.last = item;
            else this.first.previous=item;
            this.first=item;
        }
    }
    pop(index=-1){
        if(this.length===0)return undefined;
        let ans;
        if((index=this._normalizeIndex(index)) === this.length-1) ans = this.last.remove(this).value;
        else if(index === 0) ans = this.first.remove(this).value;
        else if(index < this.length/2)
            for(let it=this.iterator(),item,i=0,q;!(item=it.next(q)).done;i++){
                if(i === index){
                    ans = item.value;
                    q=LinkedList.CALLBACK_REMOVE | LinkedList.CALLBACK_BREAK
                }
            }
        else for(let it=this.iteratorBackwards(),q,item,i=this.length-1; !(item=it.next(q)).done; i--){
                if(i === index){
                    ans = item.value;
                    q=LinkedList.CALLBACK_REMOVE | LinkedList.CALLBACK_BREAK
                }
            }
        return ans;
    }
    *iterator(){
        let item = this.first;
        while(item) {
            let ans = yield item.value,v;
            if (typeof ans == "number"||(
                Array.isArray(ans)&&(v=ans[1],typeof (ans=ans[0]) == "number"))) {
                if (ans & LinkedList.CALLBACK_REMOVE) item.remove(this);
                if (ans & LinkedList.CALLBACK_REPLACE_WITH) item.value = v;
                if (ans & LinkedList.CALLBACK_BREAK) break;
            }
            item = item.next;
        }
    }
    *iteratorBackwards(){
        let item = this.last;
        while(item) {
            const ans = yield item.value;
            if (typeof ans == "number") {
                if (ans & LinkedList.CALLBACK_REMOVE) item.remove(this);
                if (ans & LinkedList.CALLBACK_BREAK) break;
            }
            item = item.previous;
        }
    }
    iterateF(index,callback){
        for (let goingF = index < this.length/2,
                 it = goingF?this.iterator():this.iteratorBackwards(),
                 item, i = goingF?0:this.length-1,
                 q; !(item = it.next(q)).done; i+=goingF?1:-1)
            q = callback(item,i)
    }
    remove(value) {
        for (var it = this.iterator(), item,q,index=0; !(item = it.next(q)).done;index++)
            if (item.value === value)
                q=LinkedList.CALLBACK_REMOVE | LinkedList.CALLBACK_BREAK;

        return index;
    }
    toArray(){
        return Array.from(this.iterator())
    }
    toString(){
        return this.toArray().toString();
    }
    at(index){
        if(this.length!==0) {
            let ans;
            if ((index = this._normalizeIndex(index)) === 0) ans = this.first.value;
            else if (index === this.length - 1) ans = this.last.value;
            else this.iterateF(index, (item, i) => {
                    if (i === index) {
                        ans = item.value;
                        return LinkedList.CALLBACK_BREAK;
                    }
                });
            return ans;
        }
    }
    _normalizeIndex(index,_i){
        _i = index<0? index + this.length:index;
        if(_i >= this.length || _i<0 )throw new RangeError(`Out of bounds: array with length ${this.length} called with index ${index}`);
        return _i;
    }
    any(callbackFunction){
        for(let i of this.iterator())
            if(callbackFunction(i))return true;
        return false;
    }
    map(callbackF){
        for (let it = this.iterator(),item,i=0,q; !(item=it.next(q)).done ; i++) {
            const replaceWith = callbackF(item.value);
            q = replaceWith===undefined?LinkedList.CALLBACK_REMOVE:[LinkedList.CALLBACK_REPLACE_WITH,replaceWith]
        }
        return this
    }
}
export default LinkedList