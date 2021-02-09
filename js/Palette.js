class Palette {
	constructor(colors) {
		this.imageData = getCanvasImageData(colors);
	}

	pickColor(pos) {
		return this.imageData.slice(pos * 4, pos * 4 + 4);
	}
}

function getCanvasImageData(colors) {
	// 创建canvas
	const palatteCanvas = document.createElement("canvas");
	const ctx = palatteCanvas.getContext("2d");
	// 绘制渐变色条
	ctx.fillStyle = getLinearGradient(palatteCanvas, colors);
	ctx.fillRect(0, 0, 256, 1);
	// 读取像素值
	return ctx.getImageData(0, 0, 256, 1).data;
}

function getLinearGradient(canvas, colors) {
	canvas.width = 256;
	canvas.height = 1;
	// 创建线性渐变色
	const linearGradient = canvas.getContext("2d").createLinearGradient(0, 0, canvas.width, 0);
	Object.keys(colors).forEach((key) => {
		linearGradient.addColorStop(key, colors[key]);
	})
	return linearGradient;
}

export default Palette;