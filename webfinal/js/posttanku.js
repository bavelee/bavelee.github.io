//发送弹幕的js脚本

//弹幕集
let danmus = new Array('6666666666'
	, 'China NO.1'
	, '中国牛逼！！！'
	, 'We are Chinese.'
	, 'It is Chinese.'
	, 'Hold your fire'
	, '疯狂为吴京打call'
	, '一日为战狼，终身为战狼'
	, '逢敌必亮剑'
	, '此生无悔入华夏，来世还做种花家'
	, '666'
	, '心系人民群众的安危与和平就是中国军魂'
	, '中国军人是打不倒的'
	, '一日为战狼，终身为战狼'
	, '嗷嗷嗷嗷哦嗷嗷嗷嗷嗷嗷嗷嗷'
	, '犯我中华神威者，虽远必诛'
	, '我自豪身为中国人'
	, '中国加油，我爱中国'
	, '前方核能'
	, '祖国如有难，汝应作前锋'
	, '我们爱我们的民族'
	, '狭路相逢勇者胜'
	, '热血男儿当自强'
	, '红旗飘飘，军号响'
	, '剑已出鞘，雷鸣电闪'
	, '五星红旗迎风飘扬'
	, '胜利歌声多么响亮'
	, '狭路相逢勇者胜'
	, '从来都是狭路相逢勇者胜'
	, '向前进，向前进'
	, '中国军魂！'
	, '壮士一去不复返'
	, '和平时代也有激荡的风云'
	, '( ゜- ゜)つロ 乾杯~'
	, '(*°ω°*)ﾉ"非战斗人员请撤离！！'
	, '前方高能预警'
	, '制作良心'
	, '前面的别走'
	, '富强民主文明和谐'
	, '自由平等公正法治'
	, '爱国敬业诚信友善'
	, '开火!!!!!!');
//颜色集					 需要白色几率大一点，所以往数组里面多放几个白色,其次是红色、黄色、绿色
let colors = new Array( '#FF0000', '#FF0000', '#FF0000', '#FF0000', '#FF0000',
						'#FFFFFF', '#FFFFFF', '#FFFFFF', '#FFFFFF', '#FFFFFF',
						'#FFFFFF', '#FFFFFF', '#FFFFFF', '#FFFFFF', '#FFFFFF',
						'#FFFFFF', '#FFFFFF', '#FFFFFF', '#FFFFFF', '#FFFFFF', 
						'#FFFF00', '#FFFF00',
						'#008000');

//存储过去的弹幕位置,数组过大会导致弹幕出现间隔变长
var lastPos = new Array(10);
//是否是发送第一条弹幕，如果true则需要初始化lastPos数组
var isFirst = true;

//生成指定范围随机数的函数
function randomPos(min, max){
	var rand = Math.random();
	var range = max - min;
	return min + Math.round(rand * range); //四舍五入
}
//计算过去弹幕位置的最小值
//传入：弹幕记录数组和当前弹幕随机位置
function minAbs(lastPos, pos){
	//默认将第一个pos视为最小
	var min = Math.abs(lastPos[0] - pos);
	for(var i = 0; i < lastPos.length; i++){
		//比较绝对差值，更小的赋值给min
		var v = Math.abs(lastPos[i] - pos);
		if(v < min) min = v;
	}
	return min;
}
//生成弹幕函数
function postTanku(){
	//result数组分别存放 {Y轴的位置， 弹幕颜色， 弹幕内容}
	var result = new Array(3);
	//生成 1px - 651px 之间的随机位置
	var pos = randomPos(0, 65) * 10 + 1;
	//初始化弹幕记录数组
	if(isFirst){
		//遍历数组，将第一个pos的值赋给所有元素
		for(var i = 0; i < lastPos.length; i++){
			lastPos[i] = pos;
		}
		isFirst = false;
	}
	//计算当前弹幕位置与记录的弹幕的距离，如果距离过小则跳过这条弹幕
	//所以，弹幕记录数组越大，则计算时间越长，从而弹幕出现的频率更低
	var v = minAbs(lastPos, pos);
	//新弹幕和记录的弹幕在Y轴上的最短距离小于30，可能会导致弹幕叠在一起，所以跳过当前弹幕，会减少弹幕量
	if(v <= 30){
		return;
	}
	//将新的弹幕位置插入到数组最后面，数组元素前移
	for(var i = 1; i < lastPos.length; i++){
		lastPos[i - 1] = lastPos[i];
	}
	lastPos[lastPos.length - 1] = pos;

	result[0] = pos + 'px';
	//从弹幕集和颜色集中随机获取
	result[1] = colors[randomPos(0, colors.length - 1)];
	result[2] = danmus[randomPos(0, danmus.length - 1)];
	//将显示弹幕的工作交给主线程
	postMessage(result);
}
//每隔30ms发送一次弹幕
setInterval(function(){
		postTanku();
	}, 30);

