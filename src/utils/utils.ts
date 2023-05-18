/**
 * 返回随机参数
 * @param {number}     min - 最小值
 * @param {number}     max - 最大值
 */
export const getRandomNumber = (min: number, max: number) => {
  return Math.floor(Math.random() * (max - min)) + min;
};
