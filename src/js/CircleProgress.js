import { getDom, angleToRadian } from './util.js';
import Palette from './Palette.js';
// currentFrameIndex = 0; //当前绘制到的帧次序
// totalFramesLength; //一共绘制帧数
// angleChangeForFrame; //每帧变化角度数
const fixClipWidth = 6; //进度条切片画法过程中，先将线画宽，然后通过画两个空白圆行，把多余的地方切掉
const precision = 2; //增长一倍，提升精细程度
//配置画布的显示样式
const setCanvasStyle = (option, canvas) => {
    canvas.width = option.width;
    canvas.height = option.height;
};

//设置填充描边颜色样式
const setStrokeStyle = (ctx, color) => {
    const [r, g, b, alpha] = color;
    ctx.strokeStyle = `rgb(${r},${g},${b},${alpha / 255})`;
};
//设置笔触
const setLineStyle = option => {
    const ctx = option.ctx;
    ctx.lineWidth = option.lineWidth + (option.useClip ? fixClipWidth : 0); //线宽度【当前先扩宽一部分，方便后续切边】
    ctx.globalAlpha = 1; //画布默认透明度
    ctx.lineCap = 'round'; //线末端样式square，round butt(默认)
    ctx.lineJoin = 'round'; //bevel round miter(默认)
};

//动态画图
const startDraw = option => {
    let currentFrameIndex = 0;
    //开始绘制画面
    let drawFlag = true;
    let unLockLoop = () => {
        drawFlag = true;
        setTimeout(unLockLoop, option.interval);
    };
    unLockLoop();
    requestAnimationFrame(progress);
    function progress() {
        if (drawFlag) {
            drawFlag = false;
            currentFrameIndex++;
            drawArc(option, currentFrameIndex);
            if (currentFrameIndex >= option.totalFramesLength) {
                unLockLoop = () => {
                    drawFlag = false;
                    unLockLoop = null;
                    return;
                };
                return; //终止绘制
            }
        }
        requestAnimationFrame(progress);
    }
};

//画出一帧图形
const drawArc = (option, currentFrameIndex) => {
    const {
        startAngle,
        width,
        height,
        ctx,
        bgColor,
        type,
        r,
        clockwise,
        angleChangeForFrame,
        useClip,
        lineWidth,
    } = option;
    const endAngle = startAngle + currentFrameIndex * angleChangeForFrame;
    ctx.clearRect(0, 0, width, height);

    //画默认背景圆
    ctx.beginPath();

    ctx.strokeStyle = bgColor;
    let c = type == 'full' ? Math.PI << 1 : Math.PI;
    const d = angleToRadian(startAngle);
    c = c + d;
    const x = width >> 1;
    const y = height >> 1;
    if (useClip) {
        const circlePath = new Path2D();
        circlePath.arc(x, y, r + lineWidth * 0.5, 0, Math.PI * 2);
        ctx.clip(circlePath);
    }
    ctx.arc(x, y, r, d, c, !clockwise);
    ctx.stroke();
    ctx.closePath();
    //画进度条
    splitArc(option, x, y, r, startAngle, endAngle);
    if (useClip) {
        clipCircle(option);
    }
};

//画渐变弧线队列
//x y 圆心，r半径， start end 起止角度值
const splitArc = (option, x, y, r, start, end) => {
    const { ctx, clockwise, palette, useClip, lineWidth } = option;
    const splitTotal = Math.abs(end - start); //切分总数【要画的小弧线总个数】每度一个
    const _j = clockwise ? 1 : -1; //根据绘制方向【逆时针、顺时针】增减
    if (useClip) {
        const circlePath = new Path2D();
        circlePath.arc(x, y, r + lineWidth * 0.5, 0, Math.PI * 2);
        ctx.clip(circlePath);
    }
    for (let i = 0; i < splitTotal; i++) {
        const color = palette.pickColor(Math.round((i * 255) / splitTotal));
        ctx.beginPath();
        setStrokeStyle(ctx, color);
        if (useClip && (i + 80 >= splitTotal || i < 80)) {
            ctx.lineWidth = lineWidth;
        }
        ctx.arc(
            x,
            y,
            r,
            angleToRadian(start + i * _j),
            angleToRadian(start + (i + 1) * _j),
            !clockwise
        );
        ctx.stroke();
    }
    if (useClip) {
        ctx.lineWidth = option.lineWidth + (option.useClip ? fixClipWidth : 0); //线宽度【当前先扩宽一部分，方便后续切边】
    }
};

//配置使用的数据参数
const buildConfig = (options, canvas) => {
    const option = {
        ...defaultConfig,
        ...options,
        ctx: canvas.getContext('2d'),
        palette: new Palette(options.colors || defaultConfig.colors),
    };
    option.width = option.width * precision;
    option.height = option.height * precision;
    option.lineWidth = option.lineWidth * precision;
    option.r = option.r * precision;
    return {
        ...option,
        totalFramesLength: option.duration / option.interval,
        angleChangeForFrame:
            ((option.endAngle - option.startAngle) * option.interval) /
            option.duration, //每画一帧，改变的角度值
        clockwise: option.endAngle - option.startAngle > 0,
    };
};

const defaultConfig = {
    startAngle: 180, //开始角
    endAngle: 180, //结束角
    interval: 5, //画面每帧时间间隔
    total: 2000, //动画总时间
    lineWidth: 15, //线宽度
    bgColor: '#cccc',
    r: 100, //圆半径
    useClip: true,
    colors: [
        [0, '#009'],
        [1, '#f00'],
    ],
    type: 'full', //画半圆或者圆，full｜half,
};

//绘制clip区域，使后续绘制的内容限定在剪切路径范围内
const clipCircle = option => {
    const { ctx, width, height, r, lineWidth } = option;
    ctx.beginPath();
    ctx.arc(
        width >> 1,
        height >> 1,
        r - (lineWidth - fixClipWidth) * 0.5,
        0,
        Math.PI * 2
    );
    ctx.fillStyle = '#fff';
    ctx.fill();
};

class CircleProgress {
    constructor(options) {
        const canvas = getDom(`#${options.canvasId}`);
        if (canvas) {
            const option = buildConfig(options, canvas);
            canvas.style.transform = 'scale(0.5)';
            canvas.style.width = option.width + 'px';
            canvas.style.height = option.height + 'px';
            canvas.style['transform-origin'] = 'left top';
            setCanvasStyle(option, canvas);
            setLineStyle(option);
            startDraw(option);
        }
    }
}

export default CircleProgress;
