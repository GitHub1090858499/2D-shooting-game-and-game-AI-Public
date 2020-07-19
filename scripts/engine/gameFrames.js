
/**
 * 游戏运行的参数类,gameFrames类
 * @param {Object} win 浏览器window对象
 * 源:主要借鉴于向峰的<html5游戏编程核心技术与实战>,仅做学习用处
 * 调用:John Resig http://ejohn.org/的Class.extend
 * 被调用:win.game的runGame
 */
(function(win){
	var gameFrames = win.GameFrames = new (Class.extend({
		//最大帧数
		maxFps : 0 ,
		//最小帧数
		minFps : 9999,
		//实时帧数
		currentFps : 0,	
		//当前时间
		currentTime:0,
		//每帧之间流失的时间
		eachFramesEscapeTime:0,
		//每次帧数结算开始的时间
		eachFramesCountStartTime:0,
		//统计每秒总帧数
		eachFpsCount:0,
		
		//启动帧状态检测器
		start:function(fps){
			this.fps=fps;
			//赋值当前时间和每次帧数结算开始的时间
			this.currentTime = this.eachFramesCountStartTime = new Date();
		},
		//更新和计算帧数,每帧开始前调用此方法
		update:function(){
			var fTime = new Date();
			//如果即时时间-每帧开始的时间>=一秒.这个情况表示一次帧数计算的结束,但不一定是一秒为间隔
			if(fTime - this.eachFramesCountStartTime >= 1000){
				//计算当前帧数
				this.currentFps = this.eachFpsCount;
				//计算最大帧数
				this.maxFps = (this.currentFps>this.maxFps)?this.currentFps:this.maxFps;
				//计算最小帧数
				this.minFps = (this.currentFps<this.minFps)?this.currentFps:this.minFps;
				//重置帧计算
				this.eachFpsCount = 0;
				//设置本次结算时间即下一次开始的帧数计算的时间
				this.eachFramesCountStartTime = fTime;
			}else{
				++this.eachFpsCount;
			};
			//上一帧和这一帧的间隔时间
			this.eachFramesEscapeTime = fTime - this.currentTime;
			this.currentTime = fTime;
		},
	}))();
})(window);