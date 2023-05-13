import { col, ctx, h, row, w } from './config';

export let matrix: Block[][];
export enum BlockType {
    DEFAULT,
    MINE,
}
    const defaultFillStyle = '#2D3E4A';
    export class Block {
    fillStyle?: string;
    color: string;
    flagFillStyle: string;
    type: BlockType;
    mineNum: number | string;
    exhibit: boolean;
    r: number;
    c: number;
    flag: boolean;
    constructor(
        type: BlockType,
        mineNum: number | string,
        r: number,
        c: number,
    ) {
        this.type = type;
        this.mineNum = mineNum;
        this.r = r;
        this.c = c;
        this.exhibit = this.flag = false;
        this.color = '#171617';
        this.flagFillStyle = '#95DCED';
    }
    show(exhibitNum: number): number {
        const { exhibit, mineNum, r, c } = this;
        if (!exhibit) {
            exhibitNum++;
            this.exhibit = true;
            this.flag = false;
            if (mineNum === 0) {
                [
                    [-1, 0],
                    [1, 0],
                    [-1, -1],
                    [0, -1],
                    [1, -1],
                    [-1, 1],
                    [0, 1],
                    [1, 1],
                ].forEach(([x, y]) => {
                    const i = r + y,
                        j = c + x;
                    if (matrix[i]?.[j] && !matrix[i][j].exhibit) {
                        exhibitNum = matrix[i][j].show(exhibitNum);
                    }
                });
            }
            this.draw();
        }
        return exhibitNum;
    }
    draw() {
        const {
            r,
            c,
            mineNum: num,
            exhibit,
            flag,
            fillStyle,
            color,
            flagFillStyle,
        } = this;
        const x = c * w,
            y = r * h;
        ctx.beginPath();
        ctx.clearRect(x, y, w, h);
        ctx.strokeRect(x, y, w, h);
        if (exhibit && fillStyle) {
            ctx.fillStyle = fillStyle;
            ctx.fillRect(x, y, w, h);
        }
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillStyle = color;
        if (num) {
            ctx.fillText(String(num), x + w / 2, y + h / 2);
        }
        if (!exhibit) {
            ctx.fillStyle = defaultFillStyle;
            ctx.fillRect(x, y, w, h);
        }
        if (flag) {
            ctx.fillStyle = flagFillStyle;
            ctx.fillRect(x, y, w, h);
        }
        ctx.closePath();
    }
}

/**
 * 先布雷，再统计
 * @param row
 * @param col
 * @returns mineNum
 */
export function createMatrixMap(): number {
    matrix = Array.from(new Array(row), () => []);
    let num = ~~((row * col) / 10 + (Math.random() * row * col) / 10);
    const mineNum = num;
    while (num > 0) {
        const r = ~~(Math.random() * row),
            c = ~~(Math.random() * col);
        if (!matrix[r][c]) {
            matrix[r][c] = new Block(BlockType.MINE, '*', r, c);
            num--;
        }
    }
    for (let r = 0; r < row; ++r) {
        for (let c = 0; c < col; ++c) {
            if (!matrix[r][c]) {
                const mineNum = [
                    [-1, 0],
                    [1, 0],
                    [-1, -1],
                    [0, -1],
                    [1, -1],
                    [-1, 1],
                    [0, 1],
                    [1, 1],
                ].filter(([dx, dy]) => {
                    const x: number = dx + c,
                        y: number = dy + r;
                    return (
                        x >= 0 &&
                        y >= 0 &&
                        x < col &&
                        y < row &&
                        matrix[y][x] &&
                        matrix[y][x].type === BlockType.MINE
                    );
                }).length;
                matrix[r][c] = new Block(BlockType.DEFAULT, mineNum, r, c);
            }
        }
    }
    return mineNum;
}
