export const w = 20,
    h = 20;

export let row = 10,
    col = 10;

export const setRowAndCol = (val: number) => (row = col = val);

export const cvs: HTMLCanvasElement = document.querySelector('canvas')!,
    ctx: CanvasRenderingContext2D = cvs.getContext('2d')!;
