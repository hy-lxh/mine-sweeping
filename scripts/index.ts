import '../css/index.css';
enum BlockType {
    DEFAULT,
    MINE
}
interface Block {
    fillStyle?: string
    type: BlockType
    mineNum: number | string
    exhibit: boolean
    r: number
    c: number
    flag: boolean
}

let row = 10, col = 10,mineNum = 0,exhibitNum = 0,time = 0;
let timer: NodeJS.Timer;
const blockFillStyle = '#2D3E4A',txtFillStyle = '#171617',flagFillStyle = '#95DCED';
const w = 20, h = 20;
let mapW: number,mapH: number;
let matrixMap: (Block | null)[][];
let rmEvents: () => void;

const cvs: HTMLCanvasElement = document.querySelector('canvas')!, 
    ctx: CanvasRenderingContext2D = cvs.getContext('2d')!;
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
    matrixMap = new Array(row).fill(null).map(() => new Array(col).fill(null));
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
        const block: Block = matrixMap[r][c] as Block;
        const { type } = block;
        if (type == BlockType.MINE) {
            bomb(block);
        } else {
            if(exhibitNum === 0){
                // 游戏开始
                gameStart();
            }
            const map = new Map<string,boolean>();
            const dfs = (block: Block) => {
                if(!block.exhibit){
                    exhibitNum++;
                    block.exhibit = true;
                    block.flag = false;
                    const {mineNum,r,c} = block;
                    if(mineNum === 0){
                        [[-1, 0], [1, 0], [-1, -1], [0, -1], [1, -1], [-1, 1], [0, 1], [1, 1]].forEach(([x,y]) => {
                            const i = r + y,j = c + x,key = `${i}-${j}`;
                            if(i >= 0 && i < row && j >= 0 && j < col && !map.has(key)){
                                map.set(key,true);
                                dfs(matrixMap[i][j] as Block);
                            }
                        });
                    }
                }
            };
            dfs(block);
        }
        render();
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
        const block = matrixMap[r][c] as Block;
        if (block.exhibit) return false;
        block.flag = !block.flag;
        render();
    });
    rmEvents = () => {
        rmCtx();
        rmClick();
    };
}

function bomb(block: Block){
    block.fillStyle = '#A705ED';
    matrixMap.forEach(blocks => blocks.forEach((block) => {
        block = block as Block;
        const {type} = block;
        if(type === BlockType.MINE){
            block.exhibit = true;
            block.flag = false;
        }
    }));
    render();
    gameOver();
}
/**
 * 渲染函数
 */
function render() {
    ctx.clearRect(0, 0, mapW,mapH);
    for (let r = 0; r < row; ++r) {
        for (let c = 0; c < col; ++c) {
            drawBlock(matrixMap[r][c] as Block);
        }
    }
}

/**
 * 绘制单个块
 * @param block 单个块
 */
function drawBlock(block: Block) {
    const { r, c, mineNum: num, exhibit, flag,fillStyle } = block;
    const x = c * w, y = r * h;
    ctx.beginPath();
    ctx.strokeRect(x, y, w, h);
    if(exhibit && fillStyle){
        ctx.fillStyle = fillStyle;
        ctx.fillRect(x,y,w,h);
    }
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillStyle = txtFillStyle;
    if(num){
        ctx.fillText(String(num), x + w / 2, y + h / 2);
    }
    if (!exhibit) {
        ctx.fillStyle = fillStyle || blockFillStyle;
        ctx.fillRect(x, y, w, h);
    }
    if (flag) {
        ctx.fillStyle = flagFillStyle;
        ctx.fillRect(x, y, w, h);
    }
    ctx.closePath();
}

/**
 * 先布雷，再统计
 */
function createMatrixMap() {
    let num = mineNum = ~~(row * col / 10 + Math.random() * row * col / 10);
    while (num > 0) {
        const r = ~~(Math.random() * row), c = ~~(Math.random() * col);
        if (!matrixMap[r][c]) {
            matrixMap[r][c] = {
                r, c,
                exhibit: false,
                mineNum: '*',
                type: BlockType.MINE,
                flag: false
            };
            num--;
        }
    }
    for (let r = 0; r < row; ++r) {
        for (let c = 0; c < col; ++c) {
            if (!matrixMap[r][c]) {
                const mineNum = [[-1, 0], [1, 0], [-1, -1], [0, -1], [1, -1], [-1, 1], [0, 1], [1, 1]].filter(([dx, dy]) => {
                    const x: number = dx + c, y: number = dy + r;
                    return x >= 0 && y >= 0 && x < col && y < row && matrixMap[y][x] && (matrixMap[y][x] as Block).type === BlockType.MINE;
                }).length;
                matrixMap[r][c] = {
                    r, c, exhibit: false,
                    mineNum,
                    type: BlockType.DEFAULT,
                    flag: false
                };
            }
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
    col = row = level * 10;
    gameOver();
    init();
});




init();
