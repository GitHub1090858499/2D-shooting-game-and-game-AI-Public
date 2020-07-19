/**
 * 渲染对象类,RenderObj类
 * 源:主要借鉴于向峰的<html5游戏编程核心技术与实战>,仅做学习用处
 * 调用:John Resig http://ejohn.org/的Class.extend
 * 被调用:win.Scene
 */
(function(win){
	var renderObj = win.RenderObj = Class.extend({
		init:function(name){
			this.name = name||("Unnamed_"+(renderObj.SID++));
			//指定renderObj所属的scene
			this.owner = null;
			//位置，大小
			this.x = 0;
			this.y = 0;
			this.w = 10;
			this.h = 10;
			//x,y方向的速度
			this.dx = 0;
			this.dy = 0;
			//x，y方向的加速度
			this.vx = 0;
			this.vy = 0;
			//角度
			this.deg = 0;
			//z-index,覆盖层数
			this.zIdx = 0;
			//是否可见
			this.isVisable = true;
			//是否可移除
			this.canRemove = false;
			// this.fiyTiem = GameFrames.eachFramesEscapeTime;
			this.fiyTiem =1/GameFrames.fps
			//以下用于子类(rObjMan)的唯一性
			this.TheOneifON = false;
			//用于快速识别子类的类别
			this.classN = this.classN||null;
		},
		//改变位置
		moveTo:function(x,y){
			this.x = x||this.x;
			this.y = y||this.y;
			
		},
		//移动指定长度
		move:function(xL,yL){
			this.x += xL;
			this.y += yL;
		},
		//按照速度移动一步
		moveStep:function(){
			// console.log(this.flyTime);
			// this.flyTime = GameFrames.eachFramesEscapeTime;
			// this.dx += this.vx*this.flyTime/1000;
			// this.dy += this.vy*this.flyTime/1000;
			// this.x += this.dx*this.flyTime/1000;
			// this.y += this.dy*this.flyTime/1000;
			//每帧过了1/60秒
			// this.dx += Math.ceil(this.vx/GameFrames.fps);
			// this.dy += Math.ceil(this.vy/GameFrames.fps);
			// this.x += Math.ceil(this.dx/GameFrames.fps);
			// this.y += Math.ceil(this.dy/GameFrames.fps);
			
			this.dx += this.vx/GameFrames.fps;
			this.dy += this.vy/GameFrames.fps;
			this.x += this.dx/GameFrames.fps;
			this.y += this.dy/GameFrames.fps;
		},
		//改变角度 
		rotate:function(deg){
			this.deg = deg;
		},
		//数据改变!!!!待完成
		update:function(){
			this.moveStep();
			this.fiyTiem = GameFrames.eachFramesEscapeTime;
		},
		//渲染!!!!待完成
		render:function(ctx){
			
		},
		
	});
	renderObj.SID = 0;
	renderObj.ClassName = "RenderObj";
	ClassFactory.regClass(renderObj.ClassName,renderObj);
})(window)