import $ from './utils/jquery.min.js'
import Mover from "./game/Mover.js";
import Snake from "./game/Snake.js";
import Drawer from "./game/Drawer.js";
import LinkedList from "./utils/linkedList.js";
import LevelLoader from "./game/LevelLoader.js";
const maxLevel = 10,
    snakeColor = "red",
    timeForGettingFood=3500,
    drawer = new Drawer($("#drawer")[0]),
    defaultLevel = [15,15,new LinkedList()],
    initialize = async ()=>{
        const levelIndex = $("#level-container .selected").index(),
            bridges=levelIndex===0?defaultLevel:await (new LevelLoader(levelIndex).load());
        drawer.updateData(bridges[0],bridges[1],snakeColor);
        snake = new Snake(bridges[0],bridges[1],snakeColor,timeForGettingFood,drawer,bridges[2]);
        mover = new Mover(snake,speedFromEl());
        window['snake'] = snake;
    },
    speedFromEl = (el=$("#speed-container .selected")) => +el.prop('class').split('-')[1].split(' ')[0];

let snake,mover;
!function () {
    for(let i=0,curLevel=sessionStorage['level']??0;i<maxLevel;i++)
        $(`<div class='level${i==curLevel?' selected':''}'>Level ${i||"Nothing"}</div>`)
            .appendTo('#level-container');
    $("#start-btn").on('click',function(){
        $("#start-btn,#end-game").css('display','none');
        setTimeout(()=>$(this).text('Restart'),400);
        initialize().then(() => {
            if(snake.drawer.isReady) mover.start();
            else alert("Please wait until resources load.");
        });

    });
    $(`.speed-${sessionStorage['speed']??195}`).addClass('selected');
    $('.level,[class*=speed-]').on('click',function(th){
        const p = (th=$(this)).parent();
        p.find(".selected").removeClass('selected');
        th.addClass('selected');
        if(p[0].id==='level-container') sessionStorage['level'] = th.index();
        else sessionStorage['speed'] = speedFromEl(th)

    });
}();
