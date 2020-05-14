/**
 * 生成 num 个区别较明显的颜色
 * 过滤浅色域 (0, 0, 0)~(127, 0, 0)、(0, 0, 0)~(0, 127, 0)、(0, 0, 0)~(0, 0, 127)
 * 深红(127, 0, 0) => 红(255, 0, 0) => 黄(255, 255, 0) => 绿(0, 255, 0) => darkGreen(0, 127, 0) | 青(0, 255, 255) => 蓝(0, 0, 255) => 深蓝(0, 0, 127)
 * @param {Number} num 颜色种类数
 */
export const getColorCategories = (num = 0) => {
	const defaultColors = [
		'#0000d6',
		'#008b00',
		'#880061',
		'#e54304',
		'#7e3ff2',
		'#1A237E',
		'#9E9D24',
		'#df55f2',
		'#5D4037',
		'#ffaf49',
		'#3F51B5',
		'#00C853',
		'#F50057',
		'#FFAB91',
		'#B388FF',
		'#7CB342',
		'#5C6BC0',
		'#ef4fa6',
		'#BDBDBD',
		'#A1887F',
		'#2196F3',
		'#1B5E20',
		'#B71C1C',
		'#F57C00',
		'#AA00FF',
		'#1DE9B6',
		'#9FA8DA',
		'#C2185B',
		'#757575',
		'#78909C',
		'#AEEA00',
	];
	if (num <= defaultColors.length) {
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