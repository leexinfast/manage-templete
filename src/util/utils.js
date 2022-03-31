import { history } from 'umi';
import lodash from 'lodash';
import miniTypeList from '@/util/miniType';

const notAuthPath = '/403';
//判断传入的数字是正数还是负数
export function judgmentNumber(num) {
  if (!num) {
    return false;
  }
  if (num > 0) {
    return 'up';
  } else {
    return 'down';
  }
}
//取数字的绝对值
export function mathAbsPercentage(num) {
  if (!num) {
    return '-';
  } else {
    return Math.abs(num) + '%';
  }
}
// 获取miniType值
export function getMiniTypeStr(value) {
  let miniName = '';
  for (let i = 0; i < miniTypeList.length; i++) {
    let item = miniTypeList[i];
    if (item.type == value) {
      miniName = item.name;
      break;
    }
  }
  return miniName;
}
//下载blod文件
export function downLoad(data, fileName = '文件.xls') {
  // let blob = new Blob(["\ufeff",data]);
  let blob = new Blob([data]);
  // 获取heads中的filename文件名
  let downloadElement = document.createElement('a');
  // 创建下载的链接
  let href = window.URL.createObjectURL(blob);
  downloadElement.href = href;
  // 下载后文件名
  downloadElement.download = fileName;
  document.body.appendChild(downloadElement);
  // 点击下载
  downloadElement.click();
  // 下载完成移除元素
  document.body.removeChild(downloadElement);
  // 释放掉blob对象
  window.URL.revokeObjectURL(href);
}

//获取url参数
export function GetUrlParams(paraName) {
  var url = window.document.location.href;
  var arrObj = url.split('?');
  if (arrObj.length > 1) {
    var arrPara = arrObj[1].split('&');
    var arr;
    for (var i = 0; i < arrPara.length; i++) {
      arr = arrPara[i].split('=');
      if (arr != null && arr[0] == paraName) {
        return arr[1];
      }
    }
    return '';
  } else {
    return '';
  }
}
export function recursionRoutes(menuData) {
  if (!menuData) {
    return [];
  }
  const routes = menuData;
  for (let i = 0; i < routes.length; i++) {
    if (routes[i].meta && routes[i].meta.icon) {
      routes[i].icon = routes[i].meta.icon;
    }
    if (routes[i].children) {
      routes[i].routes = routes[i].children;
      recursionRoutes(routes[i].children);
    }
    routes[i].hideInMenu = routes[i].hidden;
  }
  return routes;
}
export function routeAccess(pathname, menuData) {
  let canRoute = false;
  const verifyRoute = (routes) => {
    for (let i = 0; i < routes.length; i++) {
      const { path } = routes[i];
      if (path === pathname) {
        canRoute = true;
        break;
      }
      if (!canRoute && routes[i]?.routes?.length) {
        verifyRoute(routes[i].routes || []);
      }
    }
  };
  verifyRoute(menuData);
  if (!canRoute) {
    history.push(notAuthPath);
  }
}
// 千分位
export function thousandsNum(num) {
  return (num + '').replace(/(\d{1,3})(?=(\d{3})+(?:$|\.))/g, '$1,');
}
// 过万处理
export function judgmentAllLevel(value) {
  if (!value || isNaN(value)) {
    return;
  }
  if (value < 10000) {
    return thousandsNum(value);
  }
  if (value >= 10000 && value < 10000000) {
    return lodash.round(value / 10000, 2) + '万';
  }
  if (value > 10000000) {
    return lodash.round(value / 10000, 1) + '万';
  }
}
