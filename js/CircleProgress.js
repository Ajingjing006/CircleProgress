class CircleProgress {
	constructor(options) {
		this.option = {};
		init.bind(this)(options, this.option);
	}
}

// let count = 0; //计数器
// let _ff; //一共绘制帧数
// let ff; //每帧变化角度数
const defaultOption = {
	ss: 180, //开始角
	tt: 180, //结束角
	interval: 5, //画面每帧时间间隔
	total: 2000, //动画总时间
	lW: 15, //线宽度
	bgColor: '#cccc',
	r: 100, //圆半径
	colors: {
		0: "#009",
		1: "#f00"
	},
	type: 'full', //画半圆或者圆，full｜half,
	precision: 2
}

function init(options, option) {
	const canvas = document.querySelector(`#${options.canvasId}`);
	if (canvas) {
		option.precision = options.precision || 2;
		option.precision = Math.min(Math.round(option.precision), 4);
		option.ctx = canvas.getContext('2d');
		option.palette = createPalette(options.colors || defaultOption.colors);
		canvas.width = options.w * option.precision;
		canvas.height = options.h * option.precision
		option.w = canvas.width;
		option.h = canvas.height;
		canvas.style.transform = `scale(${1/option.precision})`;
		canvas.style.width = `${option.precision}00%`;
		option.ss = options.startAngle || defaultOption.ss;
		option.type = options.type || defaultOption.type;
		option.tt = options.endAngle || defaultOption.tt;
		option.interval = options.interval || defaultOption.interval;
		option.total = options.duration || defaultOption.total;

		option.lW = (options.lineWidth || defaultOption.lW) * option.precision;
		option.bgColor = options.bgColor || defaultOption.bgColor;
		option.r = options.r || defaultOption.r;
		option._ff = option.total / option.interval;
		option.ff = (option.tt - option.ss) / option._ff;
		option.clockwise = (option.tt - option.ss > 0);
		setLineStyle.bind(this)();
		startDraw.bind(this)();
	}
}

function setLineStyle() {
	const ctx = this.option.ctx;
	ctx.lineWidth = this.option.lW; //线宽度
	ctx.globalAlpha = 1; //画布默认透明度
	ctx.lineCap = "round"; //线末端样式square，round butt(默认)
	ctx.lineJoin = "round"; //bevel round miter(默认)
}

function startDraw() {
	const option = this.option;
	option.count = 0;
	//开始绘制画面
	let drawFlag = true;
	let timer = setInterval(function() {
		drawFlag = true;
	}, option.interval);
	requestAnimationFrame(progress.bind(this));

	function progress() {
		if (drawFlag) {
			drawFlag = false;
			option.count++;
			drawArc.bind(this)(option.ss, option.ss + option.count * option.ff);
			if (option.count >= option._ff) {
				clearInterval(timer);
				drawFlag = false;
			}
		}
		requestAnimationFrame(progress.bind(this));
	}
}

//画出图形
function drawArc(start, end) {
	const option = this.option;
	const ctx = this.option.ctx;
	ctx.clearRect(0, 0, option.w, option.h);
	//画默认背景圆
	ctx.beginPath();
	ctx.strokeStyle = option.bgColor;
	let c = option.type == 'full' ? (2 * Math.PI) : (Math.PI);
	const d = option.ss / 180 * Math.PI;
	c = c + d;
	ctx.arc(option.w / 2, option.h / 2, option.r * option.precision, d, c, !option.clockwise);
	ctx.stroke();
	//画进度条
	if (false) {
		splitArc.bind(this)(option.w / 2, option.h / 2, option.r * option.precision, start, end);
	} else {
		start = start * Math.PI / 180; //使用弧度
		end = end * Math.PI / 180; //使用弧度
		splitArc2.bind(this)(option.w / 2, option.h / 2, option.r * option.precision, start, end);
	}
}

//设置笔触样式 
function setStrokeStyle(r, g, b, a) {
	const ctx = this.option.ctx;
	ctx.strokeStyle = `rgb(${r},${g},${b},${a/255})`;
	ctx.globalAlpha = a/255;
}

//画渐变弧线
function splitArc(x, y, r, start, end) {
	const option = this.option;
	const ctx = option.ctx;
	const f = 0.8; //0.6;//柔和度
	const t = Math.abs(end - start) * f; //切分总数
	const _i = option.clockwise ? (1 / f) : (-1 / f);
	const _j = option.clockwise ? 1 : -1;
	let current = start;

	for (let i = 0; i < t; i++) {
		const color = option.palette.pickColor(Math.round(i * 255 / t));
		ctx.beginPath();
		setStrokeStyle.bind(this)(color[0], color[1], color[2], color[3]);
		ctx.arc(x, y, r, current / 180 * Math.PI, (current + _j) / 180 * Math.PI, !option.clockwise);
		ctx.stroke();
		current = current + _i;
	}
}

//画渐变弧线
//圆心(x,y) 半径r 弧线起始终止位置 start end
function splitArc2(x, y, r, start, end) {
	const ctx = this.option.ctx;
	const option = this.option;
	//根据传入的弧度值计算点坐标
	const getCirlePoint = (() => {
		return (angle) => {
			return getPoint(x, y, r, angle);
		}
	})();

	//柔和度 以多少度作为一个梯度;如果是角度值,使用0.6；使用弧度值，每100分之一个弧度作为间隔
	const f = 0.02;
	//切分总数
	const splitLength = Math.abs(end / f - start / f);

	//根据传入的位置提取对应的颜色值
	const getCirlColor = (() => {
		return (pos) => {
			return option.palette.pickColor(Math.round(pos * 255 / splitLength));
		}
	})();
	//每次变化的弧度值
	const _i = option.clockwise ? f : (0 - f);

	//存储当前弧度值，用来定位进度
	let current = start;

	//x1 y1 上次弧线终止位置;x_m y_m 弧线经过的位置; x2 y2弧线终止位置
	let x1, y1, x_m, y_m, x2, y2;

	//弧度值，中间值, 结束值
	let [angle_start, angle_m, angle_end] = [start];

	let _point_start = getCirlePoint(angle_start);
	x1 = _point_start[0];
	y1 = _point_start[1];

	for (let i = 0; i < splitLength; i++) {
		//根据百分比提取对应颜色
		const color = getCirlColor(i);
		//设置笔触描边颜色
		setStrokeStyle.bind(this)(color[0], color[1], color[2], color[3]);
		//过渡点弧度值
		angle_m = current + _i * 0.5;

		//结束点弧度值
		current += _i;
		angle_end = current;

		//中间过渡点坐标
		const _point_middle = getCirlePoint(angle_m);
		//结束点坐标
		const _point_end = getCirlePoint(angle_end);

		x_m = _point_middle[0];
		y_m = _point_middle[1];
		x2 = _point_end[0];
		y2 = _point_end[1];

		//绘制路径
		ctx.beginPath();
		ctx.moveTo(x1, y1);
		ctx.arcTo(x_m, y_m, x2, y2, r);
		ctx.stroke();
		x1 = x2;
		y1 = y2;
	}
}

//根据坐标(x0, y0) 半径r 角度angle 获取对应的点坐标
function getPoint(x0, y0, r, angle) {
	const x = Math.cos(angle) * r + x0;
	const y = Math.sin(angle) * r + y0;
	return [x, y];
}

//渐变色调色盘
function createPalette(colorStops) {
	const width = 256,
		height = 20;

	// 创建canvas
	const palatteCanvas = document.createElement("canvas");
	palatteCanvas.width = width;
	palatteCanvas.height = height;
	const ctx = palatteCanvas.getContext("2d");

	document.body.appendChild(palatteCanvas);
	// 创建线性渐变色
	const linearGradient = ctx.createLinearGradient(0, 0, width, 0);
	for (const key in colorStops) {
		linearGradient.addColorStop(key, colorStops[key])
	}

	// 绘制渐变色条
	ctx.fillStyle = linearGradient;
	ctx.fillRect(0, 0, width, height);

	// 读取像素值
	const imageData = ctx.getImageData(0, 0, width, 1).data

	return {
		canvas: palatteCanvas,
		// pickColor: position => imageData.slice(position * 4, position * 4 + 4)
		pickColor: function (pos) {
			return imageData.slice(pos * 4, pos * 4 + 4)
		}
	}
}

export default CircleProgress;
