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
    mineNum = createMatrixMap();
    initEvent();
    render();
}

/**
 * 开始游戏
 */
function gameStart(){
    timer = setInterval(() => {
        time++;
    },1000);
}

/**
 * 游戏结束
 */
function gameOver(){
    time = 0;
    clearInterval(timer);
    rmEvents();
}

/**
 * 初始化state
 */
function initState(){
    mapW = cvs.width = w * col;
    mapH = cvs.height = h * row;
    mineNum = 0;
    exhibitNum = 0;
    time = 0;
}

/**
 * 统一的事件监听函数
 * @param el 元素
 * @param type 类型
 * @param listener 监听函数
 * @returns 
 */
function eventListener<T extends keyof HTMLElementEventMap>(el: HTMLElement,type: T,listener: (ev: HTMLElementEventMap[T]) => any){
    el.addEventListener(type,listener,false);
    return () => el.removeEventListener(type,listener,false);
}

/**
 * 初始化点击事件
 */
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
            setTimeout(() => {
                if(row * col - exhibitNum === mineNum && time){
                    // 赢了
                    alert(`此次游戏耗时: ${time}s`);
                    time = 0;
                }
            });
        }
        // console.log(`总数量: ${row * col},雷数量: ${mineNum},展开了: ${exhibitNum}`);
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

/**
 * 炸片雷
 * @param block 
 */
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



/**
 * 选关事件
 */
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