import CircleProgress from './CircleProgress.js';
doDraw();
// window.addEventListener('visibilitychange', e => {
//     if (document.visibilityState === 'visible') {
//         doDraw();
//     }
// });
function doDraw() {
    new CircleProgress({
        canvasId: 'canvas',
        r: 100, //默认100，半径
        width: 500, //画布宽，默认500
        height: 500, //画布高，默认500
        startAngle: 90, //起始角度，默认180
        endAngle: 270, //终止角度，必须传
        interval: 16, //帧间隔时间，默认5ms
        duration: 1000, //动画时间，默认2000
        lineWidth: 16, //描边线宽度，默认15
        bgColor: '#0dd5', //背景色，默认#cccc
        colors: [
            [0, 'red'],
            [1, 'blue'],
        ],
        useClip: false,
        type: 'half', //画半圆或者圆，full｜half。默认full[半圆指从起始角度向终止角度过渡的半个圆]
    });
    // new CircleProgress({
    //     canvasId: 'canvas02',
    //     r: 100, //默认100，半径
    //     width: 500, //画布宽，默认500
    //     height: 500, //画布高，默认500
    //     startAngle: 90, //起始角度，默认180
    //     endAngle: 300, //终止角度，必须传
    //     interval: 16, //帧间隔时间，默认5ms
    //     duration: 1000, //动画时间，默认2000
    //     lineWidth: 16, //描边线宽度，默认15
    //     bgColor: '#0dd5', //背景色，默认#cccc
    //     colors: [
    //         [0, 'red'],
    //         [1, 'blue'],
    //     ],
    //     type: 'half', //画半圆或者圆，full｜half。默认full[半圆指从起始角度向终止角度过渡的半个圆]
    // });

    new CircleProgress({
        canvasId: 'canvas02',
        r: 100, //默认100，半径
        width: 500, //画布宽，默认500
        height: 500, //画布高，默认500
        startAngle: 360, //起始角度，默认180
        endAngle: 0, //终止角度，必须传
        interval: 16, //帧间隔时间，默认5ms
        duration: 1300, //动画时间，默认2000
        lineWidth: 16, //描边线宽度，默认15
        bgColor: '#dddc', //背景色，默认#cccc
        colors: [
            [0, '#00f'],
            [0, '#f0f'],
            [1, '#00ff'],
        ],
        type: 'half', //画半圆或者圆，full｜half。默认full
    });

    new CircleProgress({
        canvasId: 'canvas03',
        r: 100, //默认100，半径
        width: 500, //画布宽，默认500
        height: 500, //画布高，默认500
        startAngle: 0, //起始角度，默认180
        endAngle: 340, //终止角度，必须传
        interval: 20, //帧间隔时间，默认5ms
        duration: 4000, //动画时间，默认2000
        lineWidth: 16, //描边线宽度，默认15
        bgColor: '#dddc', //背景色，默认#cccc
        colors: [
            [0, 'pink'],
            [1, 'black'],
        ],
        type: 'half', //画半圆或者圆，full｜half。默认full
    });
}
