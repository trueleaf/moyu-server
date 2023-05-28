import { ResponseWrapper } from '../types/response/common/common';

/**
 * 返回随机参数
 * @param {number}     min - 最小值
 * @param {number}     max - 最大值
 */
export const getRandomNumber = (min: number, max: number) => {
  return Math.floor(Math.random() * (max - min)) + min;
};

/**
 * 自定义错误返回
 */
export const throwError = (code: ResponseWrapper['code'], msg: string) => {
  const errorData = {
    code,
    msg,
  };
  Object.setPrototypeOf(errorData, {
    isCustomError: true,
  });
  return errorData;
};
