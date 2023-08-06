import { ResponseWrapper } from '../types/response/common/common';

/**
 * 返回随机参数
 * @param {number}     min - 最小值
 * @param {number}     max - 最大值
 */
export const getRandomNumber = (min: number, max: number) => {
  return Math.floor(Math.random() * (max - min)) + min;
};

export type CustomError = {
  isCustomError: boolean;
  msg: string;
}
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
  throw errorData;
};
/**
 * 将数组转换为树结构
 */
export const convertPlainArrayDataToTreeData = (plainArray: any[], options?: { id: string, pid: string }) => {
  const id = options?.id || '_id';
  const pid = options?.pid || 'pid';
  const temp = new Map();
  const result: { children: [] }[] = [];
  plainArray.forEach(item => {
    if (!item.children) {
      item.children = [];
    }
    temp.set(item[id].toString(), item)
  })
  plainArray.forEach(item => {
    if (!item[pid]) { //根元素
      result.push(item);
    } else {
      const parent = temp.get(item.pid);
      parent.children.push(item)
    }
  })
  return result;
};
/**
 * 遍历树形数据
 */

export const dfsForest = <T extends { children: T[], [propsName: string]: unknown }>(forestData: T[], fn: (item: T, level: number) => void) => {
  if (!Array.isArray(forestData)) {
    throw new Error('第一个参数必须为数组类型');
  }
  const foo = (forestData: T[], hook: (item: T, level: number) => void, level: number) => {
    for (let i = 0; i < forestData.length; i += 1) {
      const currentData = forestData[i];
      hook(currentData, level);
      if (!currentData['children']) {
        continue;
      }
      if (!Array.isArray(currentData['children'])) {
        continue;
      }
      if ((currentData['children']).length > 0) {
        foo(currentData['children'], hook, level + 1);
      }
    }
  };
  foo(forestData, fn, 1);
}
