//发送弹幕的js脚本

//弹幕集
let danmus = new Array('6666666666', 'China NO.1', '中国牛逼！！！', '疯狂为吴京打CALL', '犯我中华者，虽远必诛', '此生无悔入华夏，来世还做中国人', '一日为战狼，终身为战狼', '逢敌必亮剑'
	, '此生无悔入华夏，来世还做种花家'
	, '666'
	, '中国军人是打不倒的'
	, '一日为战狼，终身为战狼'
	, '嗷嗷嗷嗷哦嗷嗷嗷嗷嗷嗷嗷嗷'
	, '犯我中华神威者，虽远必诛'
	, '我自豪身为中国人'
	, '中国加油，我爱中国'
	, '前方核能'
	, '( ゜- ゜)つロ 乾杯~'
	, '(*°ω°*)ﾉ"非战斗人员请撤离！！'
	, '前方高能预警'
	, '制作良心'
	, '前面的别走'
	, '富强民主文明和谐'
	, '自由平等公正法治'
	, '爱国敬业诚信友善'
	, '开火!!!!!!');
//颜色集					红色几率大一点,其次是黄色、白色、绿色
let colors = new Array('#FF0000', '#FF0000', '#FF0000', '#FF0000', '#FF0000', '#FF0000', '#FF0000', '#FF0000', '#FF0000', '#FF0000',
						'#FFFFFF', '#FFFFFF', '#FFFFFF', '#FFFFFF', '#FFFFFF',
						'#FFFF00', '#FFFF00',
						'#008000'
						);
//Y轴位置集
//let poset = new Array('10px', '40px', '70px', '100px', '130px', '160px', '190px', '220px', '250px', '280px', '330px', '310px', '350px', '370px', '400px', '418px', '430px', '460px', '440px', '500px', '', '', '', '', '');

//生成随机数的函数
function randomPos(Min, Max){
	var Rand = Math.random();
	var Range = Max - Min;
	return Min + Math.round(Rand * Range); //四舍五入
}
//计算过去弹幕位置的最小值
function minAbs(lastPos, pos){
	var min = Math.abs(lastPos[0] - pos);
	for(var i = 0; i < lastPos.length; i++){
		var v = Math.abs(lastPos[i] - pos);
		if(v < min) min = v;
	}
	return min;
}

//循环发送弹幕
var i = 0;
//存储过去的弹幕位置
var lastPos = new Array(10);
var isFirst = true;
function postTanku(){
	var result = new Array(3);
	//生成 1px - 651px 之间的随机位置
	var pos = randomPos(0, 65) * 10 + 1;
	//生成假的弹幕位置记录,且pos不可能为0
	if(isFirst){
		for(var i = 0; i < lastPos.length; i++){
			lastPos[i] = pos;
		}
		isFirst = false;
	}
	//计算当前弹幕位置与记录的弹幕的距离，如果距离过小则跳过这条弹幕
	var v = minAbs(lastPos, pos);
	if(v <= 30){
		return;
	}
	//将新的位置插入数组
	for(var i = 1; i < lastPos.length; i++){
		lastPos[i - 1] = lastPos[i];
	}
	lastPos[lastPos.length - 1] = pos;
	result[0] = pos + 'px';
	//从弹幕集和颜色集中随机获取
	result[1] = colors[randomPos(0, colors.length - 1)];
	result[2] = danmus[randomPos(0, danmus.length - 1)];
	//将增加弹幕的工作交给主线程
	postMessage(result)
}
//每隔30ms发送一次弹幕
setInterval(function(){
		postTanku();
	}, 30);

