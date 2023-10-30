import { createNewCanvas } from './util.js';
const getLinearGradient = (canvas, colors) => {
    // 创建线性渐变色
    const linearGradient = canvas
        .getContext('2d')
        .createLinearGradient(0, 0, canvas.width, 0);
    colors.forEach(([position, color]) => {
        linearGradient.addColorStop(position, color);
    });
    return linearGradient;
};

const getPalatteCanvasImageData = colors => {
    // 创建canvas
    const palatteCanvas = createNewCanvas();
    //拿到上下文
    const ctx = palatteCanvas.getContext('2d');
    // 绘制渐变色条
    ctx.fillStyle = getLinearGradient(palatteCanvas, colors);
    ctx.fillRect(0, 0, palatteCanvas.width, palatteCanvas.height);
    // 读取像素值
    return ctx.getImageData(0, 0, palatteCanvas.width, palatteCanvas.height)
        .data;
};

class Palette {
    constructor(
        colors = [
            [0, '#000'],
            [1, '#fff'],
        ]
    ) {
        this.imageData = getPalatteCanvasImageData(colors);
    }

    pickColor(pos) {
        return this.imageData.slice(pos * 4, pos * 4 + 4);
    }
}

export default Palette;
