import '../css/index.css';
import { Block, BlockType, createMatrixMap, matrix } from './block';
import { col, ctx, cvs, h, row, setRowAndCol, w } from './config';

let mineNum = 0,exhibitNum = 0,time = 0;
let timer: NodeJS.Timer;

let mapW: number,mapH: number;
let rmEvents: () => void;

/**
 * 主函数
 */
function init() {
    initState();
    createMatrixMap();
    initEvent();
    render();
}

function gameStart(){
    timer = setInterval(() => {
        time++;
    },1000);
}

function gameOver(){
    time = 0;
    clearInterval(timer);
    rmEvents();
}


function initState(){
    mapW = cvs.width = w * col;
    mapH = cvs.height = h * row;
    mineNum = 0;
    exhibitNum = 0;
    time = 0;
}

function eventListener<T extends keyof HTMLElementEventMap>(el: HTMLElement,type: T,listener: (ev: HTMLElementEventMap[T]) => any){
    el.addEventListener(type,listener,false);
    return () => el.removeEventListener(type,listener,false);
}
function initEvent() {
    const rmClick = eventListener(cvs,'click',ev => {
        const { clientX: x, clientY: y } = ev, { offsetLeft: l, offsetTop: t } = cvs;
        const r = ~~((y - t) / h), c = ~~((x - l) / w);
        const block = matrix[r][c];
        const { type } = block;
        if (type == BlockType.MINE) {
            bomb(block);
        } else {
            if(exhibitNum === 0){
                // 游戏开始
                gameStart();
            }
            exhibitNum = matrix[r][c].show(exhibitNum);
        }
        if(row * col - exhibitNum === mineNum){
            // 赢了
            alert(`此时游戏耗时: ${time}s`);
            time = 0;
        }
    });
    const rmCtx = eventListener(cvs,'contextmenu',ev => {
        ev.preventDefault();
        const { clientX: x, clientY: y } = ev, { offsetLeft: l, offsetTop: t } = cvs;
        const r = ~~((y - t) / h), c = ~~((x - l) / w);
        const block = matrix[r][c];
        if (block.exhibit) return false;
        block.flag = !block.flag;
        block.draw();
    });
    rmEvents = () => {
        rmCtx();
        rmClick();
    };
}

function bomb(block: Block){
    block.fillStyle = '#A705ED';
    matrix.forEach(blocks => blocks.forEach((block) => {
        const {type} = block;
        if(type === BlockType.MINE){
            block.exhibit = true;
            block.flag = false;
            block.draw();
        }
    }));
    gameOver();
}

/**
 * 渲染函数
 */
function render() {
    ctx.clearRect(0, 0, mapW,mapH);
    for (let r = 0; r < row; ++r) {
        for (let c = 0; c < col; ++c) {
            matrix[r][c].draw();
        }
    }
}




eventListener(document.querySelector('.mine-sweeping')!,'click',({target}) => {
    let level = Number((target as HTMLElement).dataset.level);
    if(!level)return;
    if(time){
        if(!confirm('游戏正在进行中,是否弃掉?')){
            return;
        }
    }
    level = Math.max(Math.min(level,3),1);
    setRowAndCol(level * 10);
    gameOver();
    init();
});


init();
