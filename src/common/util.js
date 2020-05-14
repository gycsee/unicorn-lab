/**
 * 生成 num 个区别较明显的颜色
 * 过滤浅色域 (0, 0, 0)~(127, 0, 0)、(0, 0, 0)~(0, 127, 0)、(0, 0, 0)~(0, 0, 127)
 * 深红(127, 0, 0) => 红(255, 0, 0) => 黄(255, 255, 0) => 绿(0, 255, 0) => darkGreen(0, 127, 0) | 青(0, 255, 255) => 蓝(0, 0, 255) => 深蓝(0, 0, 127)
 * @param {Number} num 颜色种类数
 */
export const getColorCategories = (num = 0) => {
	const defaultColors = ['#0000d6', '#008b00', '#880061', '#e54304', '#7e3ff2', '#aaf255', '#916eff', '#df55f2', '#ef4fa6', '#ffaf49'];
	if (num <= 10) {
		return defaultColors.slice(0, num);
	}
	const red 			= 128;
	const yellow 		= 128 + 255;
	const green 		= 128 + 255 + 255;
	const darkGreen = 128 + 255 + 255 + 128;
	const cyan 			= darkGreen;
	const blue 			= 128 + 255 + 255 + 128 + 255;
	const darkBlue 	= 128 + 255 + 255 + 128 + 255 + 128;
	const step = Number.parseInt(darkBlue / num);
	let colors = [];
	for (let i = 1; i <= num; i++) {
		const count = i * step; // count is always litter than darkBlue;
		if (count <= red) { // 深红(127, 0, 0) => 红(255, 0, 0)
			colors.push(`rgb(${127 + count}, 0, 0)`)
		}
		if (count > red && count <= yellow) { // 红(255, 0, 0) => 黄(255, 255, 0)
			colors.push(`rgb(255, ${count - red}, 0)`)
		}
		if (count > yellow && count <= green) { // 黄(255, 255, 0) => 绿(0, 255, 0)
			colors.push(`rgb(${255 - (count - yellow)}, 255, 0)`)
		}
		if (count > green && count <= darkGreen) { // 绿(0, 255, 0) => darkGreen(0, 127, 0)
			colors.push(`rgb(0, ${255 - (count - green)}, 0)`)
		}
		// 此处色域跳跃，跨过 (0, 0, 0)~(0, 127, 0)
		if (count > cyan && count <= blue) { // 青(0, 255, 255) => 蓝(0, 0, 255)
			colors.push(`rgb(0, ${255 - (count - cyan)}, 255)`)
		}
		if (count > blue && count <= darkBlue) { // 蓝(0, 0, 255) => 深蓝(0, 0, 127)
			colors.push(`rgb(0, 0, ${255 - (count - blue)})`)
		}
	}
	return colors;
}

/**
 * 计算字符串字节长度，Unicode 不在 0-128 范围内的 x2
 * @param {String} str 
 */
export const getByteLen = (str) => {
	var len = 0;
    for (var i = 0; i < str.length; i++) {
        var length = str.charCodeAt(i);
        if (length >= 0 && length <= 128) {
            len += 1;
        } else {
            len += 2;
        }
    }
    return len;
}