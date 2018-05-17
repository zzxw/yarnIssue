// 时间格式YYYY-MM-DD HH:mm:ss 转化为YYYY-MM-DD
export function getDateTime(dataTime) {
	let time = dataTime;
	let str = time.substring(0, 10);
	return str;
}

export function unescape(html) {
  return html
    .replace(html ? /&(?!#?\w+;)/g : /&/g, '&amp;')
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, "\"")
    .replace(/&#39;/g, "\'");
}

// 判断发帖时间与现在时间的间隔
export function getLastTime(creatTime) {
	let oldtime = new Date(creatTime);
	let newtime = (new Date() - oldtime)/1000;
	let month = Math.floor(newtime/3600/24/30);
	let day = Math.floor(newtime/3600/24);
	let hours = Math.floor(newtime/3600);
	let mins = Math.floor(newtime/60);
	let str = '';
	if (hours === 0) {
		if (mins <= 3) {
			str = '刚刚';
		} else {
			str = mins + '分钟前';
		}
	} else if (day === 0){
		str = hours + '小时前';
	} else if (month === 0){
		str = day + '天前';
	} else {
		str = month + '月前';
	}
	return str;
}

export function slim(source, size){
  if(source.length > size){
    return source.substring(0,size-3) + '...';
  }else{
    return source;
  }
}

export function priority(source){
  let value = '';
  switch(source){
  case '40':
    value = 'Very High';
    break;
  case '30':
    value = 'High';
    break;
  case '20':
    value = 'Medium';
    break;
  case '10':
    value = 'Low';
    break;
  default:
    value = '';
  }
  return value;
}