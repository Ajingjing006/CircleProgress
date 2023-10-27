export const getDom = selector => document.querySelector(selector);
export const log = (...args) => console.log(...args.map(transferToStr));
export const transferToStr = val => (isUndefined(val) ? 'undefined' : val + '');
export const isObject = obj => obj && typeof obj === 'object';
export const isUndefined = val => typeof val === 'undefined';
export const isNull = val => val === null;
export const negate =
    fn =>
    (...args) =>
        !fn(...args);
//角度转弧度值
export const angleToRadian = angle => (angle / 180) * Math.PI;

export const getPureObject = () => Object.create(null);
