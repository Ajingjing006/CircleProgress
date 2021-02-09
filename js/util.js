class Tool {
	static getDom(selector) {
		return document.querySelector(selector);
	}

	static log(...args) {
		console.log(...args.map(transferToStr));
	}

	static transferToStr(val) {
		if (isUndefined(val)) {
			return 'undefined';
		}
		return val;
	}

	static isObject(o) {
		return o && typeof o === 'object'; //加上o的判断，而不是只使用操作符typeof是因为null的特殊性
	}

	static isUndefined(val) {
		return typeof val === 'undefined';
	}

	static isNull(val) {
		return val === null;
	}

	static negate(func) {
		return function() {
			return !func.apply(null, arguments);
		}
	}

	static angleToRadian(angle) {
		return angle / 180 * Math.PI;
	}
}
export default Tool;
