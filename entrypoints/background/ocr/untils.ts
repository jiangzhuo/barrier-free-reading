export function int(num: number) {
    return num > 0 ? Math.floor(num) : Math.ceil(num);
}/**
 *
 * @param {ImageData} data 原图
 * @param {number} w 输出宽
 * @param {number} h 输出高
 */
export function resizeImg(data: ImageData, w: number, h: number) {
    const offscreenCanvas = data2canvas(data);
    const src = new OffscreenCanvas(w, h);
    const context = src.getContext("2d");
    if(context === null) throw new Error("Unable to get canvas context");
    context.scale(w / data.width, h / data.height);
    context.drawImage(offscreenCanvas, 0, 0);
    return context.getImageData(0, 0, w, h);
}
export function data2canvas(data: ImageData, w?: number, h?: number) {
    const width = w || data.width;
    const height = h || data.height;

    const offscreenCanvas = new OffscreenCanvas(width, height);
    const context = offscreenCanvas.getContext("2d");
    context?.putImageData(data, 0, 0);
    return offscreenCanvas;
}
export function toPaddleInput(image: ImageData, mean: number[], std: number[]) {
    const imageData = image.data;
    const redArray: number[][] = [];
    const greenArray: number[][] = [];
    const blueArray: number[][] = [];
    let x = 0, y = 0;
    for (let i = 0; i < imageData.length; i += 4) {
        if (!blueArray[y]) blueArray[y] = [];
        if (!greenArray[y]) greenArray[y] = [];
        if (!redArray[y]) redArray[y] = [];
        redArray[y][x] = (imageData[i] / 255 - mean[0]) / std[0];
        greenArray[y][x] = (imageData[i + 1] / 255 - mean[1]) / std[1];
        blueArray[y][x] = (imageData[i + 2] / 255 - mean[2]) / std[2];
        x++;
        if (x == image.width) {
            x = 0;
            y++;
        }
    }

    return [blueArray, greenArray, redArray];
}
export type AsyncType<T> = T extends Promise<infer U> ? U : never;
export type SessionType = AsyncType<ReturnType<typeof import("onnxruntime-common").InferenceSession.create>>;
