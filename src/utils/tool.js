/*
* 方法名: 冻结对象
* 参数:
*      obj : 待冻结对象
* 返回值:
*       无
* */
function constantize(obj) {
  Object.freeze(obj);
  Object.keys(obj).forEach( (key, i) => {
    if ( typeof obj[key] === 'object' ) {
      constantize( obj[key] );
    }
  });
}

/*
* 方法名: 深拷贝
* 参数:
*      p : 要拷贝的对象
*      c : 目标对象(缺省 {})
* 返回值:
*      拷贝后生成的新对象
* */
function deepCopy(p, c) {
  var c = c || {};
  for (var i in p) {
    if (typeof p[i] === 'object') {
      c[i] = (p[i].constructor === Array) ? [] : {};
      deepCopy(p[i], c[i]);
    } else {
      c[i] = p[i];
    }
  }
  return c;
}


/*
* 方法名: 继承
* 参数:
*      Child : 子对象
*      Parent ：父对象
* 返回值:
*       无
* */
function myExtend(Child, Parent) {
  var F = function(){};
  F.prototype = Parent.prototype;
  Child.prototype = new F();
  Child.prototype.constructor = Child;
  Child.uber = Parent.prototype;
}

/*
* 方法名: 数组快速排序
* 参数:
*      arr : 待排序数组
* 返回值:
*       排序后的新数组
* */
function quickSort(arr) {
  if (arr.length <= 1) { return arr; }
  var pivotIndex = Math.floor(arr.length / 2);
  var pivot = arr.splice(pivotIndex, 1)[0];
  var left = [];
  var right = [];
  for (var i = 0; i < arr.length; i++){
    if (arr[i] < pivot) {
      left.push(arr[i]);
    } else {
      right.push(arr[i]);
    }
  }
  return quickSort(left).concat([pivot], quickSort(right));
}

/*
* 方法名: 获取url中的参数
* 参数:
*      name : 要获取的参数名
* 返回值:
*       要获取的参数值
* */
function getParam(name) {
  var search = document.location.search;
  var pattern = new RegExp("[?&]" + name + "\=([^&]+)", "g");
  var matcher = pattern.exec(search);
  var items = null;
  if (null != matcher) {
    try {
      items = decodeURIComponent(decodeURIComponent(matcher[1]));
    } catch (e) {
      try {
        items = decodeURIComponent(matcher[1]);
      } catch (e) {
        items = matcher[1];
      }
    }
  }
  return items;
}

/*
* 方法名: 日期格式化
* 参数:
*      date : 待转格式化日期对象（缺省 当前日期）
* 返回值:
*       格式化的日期对象
*       {
*         year : 年,
*         monthNoFill : 月（不补零）,
*         month : 月（补零）,
*         dayNoFill : 日（不补零）,
*         day : 日（补零）,
*         hourNoFill : 时（不补零 24小时制）,
*         hour : 时（补零 24小时制）,
*         hour12NoFill : 时（不补零 12小时制）,
*         hour12 : 时（补零 12小时制）,
*         minuteNoFill : 分（不补零）,
*         minute : 分（补零）,
*         secondNoFill : 秒（不补零）,
*         second : 秒（补零）,
*         state : AM/PM,
*         week : 星期 一/二/三/四/五/六/日
*       }
* */
function formatDate(date){
  //无参数 默认现在
  date = date ? date : new Date();
  //时间对象
  var dateObj = {};
  //年
  dateObj.year = date.getFullYear();

  dateObj.monthNoFill = date.getMonth() + 1;
  //月 补零
  dateObj.month = dateObj.monthNoFill >= 10 ? dateObj.monthNoFill : ("0" + dateObj.monthNoFill);

  dateObj.dayNoFill = date.getDate();
  //日 补零
  dateObj.day = dateObj.dayNoFill >= 10 ? dateObj.dayNoFill : ("0" + dateObj.dayNoFill);

  dateObj.hourNoFill = date.getHours();
  if(dateObj.hourNoFill > 12){
    dateObj.state = 'PM';
    dateObj.hour12NoFill = dateObj.hourNoFill - 12;
  }else{
    dateObj.state = 'AM';
    dateObj.hour12NoFill = dateObj.hourNoFill;
  }
  //时 补零
  dateObj.hour = dateObj.hourNoFill >= 10 ? dateObj.hourNoFill : ("0" + dateObj.hourNoFill);
  dateObj.hour12 = dateObj.hour12NoFill >= 10 ? dateObj.hour12NoFill : ("0" + dateObj.hour12NoFill);

  dateObj.minuteNoFill = date.getMinutes();
  //分 补零
  dateObj.minute = dateObj.minuteNoFill >= 10 ? dateObj.minuteNoFill : ("0" + dateObj.minuteNoFill);

  dateObj.secondNoFill = date.getSeconds();
  //秒 补零
  dateObj.second = dateObj.secondNoFill >= 10 ? dateObj.secondNoFill : ("0" + dateObj.secondNoFill);

  //星期
  var week = date.getDay();
  if (0 == week) {
    dateObj.week = "日";
  } else if (1 == week) {
    dateObj.week = "一";
  } else if (2 == week) {
    dateObj.week = "二";
  } else if (3 == week) {
    dateObj.week = "三";
  } else if (4 == week) {
    dateObj.week = "四";
  } else if (5 == week) {
    dateObj.week = "五";
  } else if (6 == week) {
    dateObj.week = "六";
  }

  return dateObj;
}

/*
* 方法名: 日期转字符串（格式化）
* 参数:
*      dateType : 要格式化的日期类型（1 日, 2 月, 3年, 4时, 5分）
*      str ： 格式化拼接符（缺省 /）
*      date : 待转日期对象（缺省 当前日期）
* 返回值:
*       格式化的日期字符串
* eg: dateToFormatString(1,'-') =>  '2018-01-01'
*     dateToFormatString(2,'/') =>  '2018/01'
*     dateToFormatString(3) =>  '2018'
* */
function dateToFormatString(dateType, str, date){
  dateType = dateType ? Number(dateType) : 1;
  str = str ? str : '/';
  date = date ? date : new Date();

  var dateObj = formatDate(date);
  var res = dateObj.year + str + dateObj.month + str + dateObj.day + " " + dateObj.hour + ":" + dateObj.minute + ":" + dateObj.second;

  switch (dateType){
    case 1 :
      res = dateObj.year + str + dateObj.month + str + dateObj.day;
      break;
    case 2 :
      res = dateObj.year + str + dateObj.month;
      break;
    case 3 :
      res = dateObj.year;
      break;
    case 4 :
      res = dateObj.year + str + dateObj.month + str + dateObj.day + ' ' + dateObj.hour;
      break;
    case 5 :
      res = dateObj.year + str + dateObj.month + str + dateObj.day + ' ' + dateObj.hour + ':' + dateObj.minute ;
      break;
  }
  return res;
}

/*
* 方法名: 数据处理（格式化）
* 参数:
*      val : 要格式化的数据 （val | arr）
*      str ： 格式化提替代符（缺省 --）
* 返回值:
*       格式化后的新数据
* eg: dealData("") => "--"
*     dealData([undefined, null, '', 0],'') => ['', '', '', 0]
* */
function dealData(val, str){
  var str = str ? str : "--";
  var isArr = Array.isArray(val);
  if(isArr){
    var newArr = deepCopy(val);
    var leg = 0;
    for( i in newArr){
      ++leg;
    }
    newArr.length = leg;
    newArr = Array.prototype.slice.call(newArr);
    for(var i = 0; i < newArr.length; ++i){
      if(undefined == newArr[i] || null == newArr[i] || '' == newArr[i]){
        newArr[i] = str;
      }
    }
    return newArr;
  }else{
    if(undefined == val || null == val || '' == val){
      return str;
    }
  }
}

function toDecimal2(x) {
  var f = parseFloat(x);
  if (isNaN(f)) {
    return '--';
  }
  var f = Math.round(x*100)/100;
  var s = f.toString();
  var rs = s.indexOf('.');
  if (rs < 0) {
    rs = s.length;
    s += '.';
  }
  while (s.length <= rs + 2) {
    s += '0';
  }
  return s;
}
//echarts 千分符
/*item = {
  name: barOption.legend.data[1],
  type: "line",
  data: yData[1],
  yAxisIndex: 1,
  itemStyle : {
    normal:{
      lineStyle:{
        width:3
      },
      label : {
        show: true,
        position:'bottom',
        //-----------------------------------------------
        formatter:function(obj){
          var c = obj['value'];
          return (c || 0).toString().replace(/(\d)(?=(?:\d{3})+$)/g, '$1,');
        },
        //-----------------------------------------------------------
        offset:[0,10]
      }
    }
  }
};*/

/*
*
* */
function getParamsDate(type, date){
  type = type ? type : 'day'
  //无参数 默认现在
  date = date ? date : new Date();

  var dateObj = formatDate(date);
  var dateStr = '';
  switch(type){
    case 'day':{
      dateStr = '' + dateObj.year + dateObj.month + dateObj.day + '000000'
      break;
    }
    case 'month':{
      dateStr = '' + dateObj.year + dateObj.month + '00000000'
      break;
    }
    case 'year':{
      dateStr = '' + dateObj.year  + '0000000000'
      break;
    }
    case 'second':{
      dateStr = '' + dateObj.year + dateObj.month + dateObj.day + dateObj.hour + dateObj.minute + dateObj.second;
      break;
    }
  }
  return dateStr;
}

//s20是代表20秒
//h是指小时，如12小时则是：h12
//d是天数，30天则：d30
function setCookie(name, value, time) {
  time = time ? time : 'd30';
  var strsec = getsec(time);
  var exp = new Date();
  exp.setTime(exp.getTime() + strsec*1);
  document.cookie = name + "="+ escape (value) + ";expires=" + exp.toGMTString();
}

function getsec(str){
  var str1=str.substring(1,str.length)*1;
  var str2=str.substring(0,1);
  if (str2=="s"){
    return str1*1000;
  }else if (str2=="h"){
    return str1*60*60*1000;
  }else if (str2=="d"){
    return str1*24*60*60*1000;
  }
}

//获得coolie 的值
function getCookie(name){
  var arr,reg=new RegExp("(^| )"+name+"=([^;]*)(;|$)");
  if(arr=document.cookie.match(reg)) return unescape(arr[2]);
  else return null;
}

//删除cookie
function delCookie(name) {
  var exp = new Date();
  exp.setTime(exp.getTime() - 1);
  var cval=getCookie(name);
  if(cval!=null) document.cookie= name + "="+cval+";expires="+exp.toGMTString();
}

export default {
  constantize,
  deepCopy,
  myExtend,
  quickSort,
  getParam,
  formatDate,
  dateToFormatString,
  dealData,
  toDecimal2,
  getParamsDate,
  setCookie,
  getCookie,
  delCookie,

}
