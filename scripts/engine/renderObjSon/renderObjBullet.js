/**
 * 渲染对象类,RenderObj类的子类，子弹类
 * 源:主要借鉴于向峰的<html5游戏编程核心技术与实战>,仅做学习用处
 * 调用:John Resig http://ejohn.org/的Class.extend
 * 被调用:win.Scene
 */

(function(){
	var renderObjBullet = RenderObj.extend({
		init:function(shooter,fx,fy,deg,handLong,theone){
			
			this.classN = "Bullet";
			this.shooter = shooter.name||"gm";
			//子弹的名字
			this._super(this.classN + shooter.bulletNum  +" from " +shooter.name);
			shooter.bulletNum++;
			//起点
			this.fx = fx||0;
			this.fy = fy||0;
			//子弹半径大小
			this.r = 1;
			//子弹角度
			this.deg = deg||0;
			//速度,若修改此处，与controlstate的计算子弹有关
			this.speed = 350;
			//位置
			this.x = fx+handLong*Math.cos(this.deg*Math.PI/180);
			this.y = fy+handLong*Math.sin(this.deg*Math.PI/180);
			//x，y轴的速度
			this.dx = this.speed*Math.cos(this.deg*Math.PI/180);
			this.dy = this.speed*Math.sin(this.deg*Math.PI/180);
			
			//记录敌人信息
			if(theone){
				this.L=theone.x-this.fx;
				this.H=theone.y-this.fy;
				this.Vx=theone.dx;
				this.Vy=theone.dy;
			}
			
		},
		update:function(){
			this._super();
			//超过移动距离后消失的判断
			if(Math.pow(this.x-this.fx,2)+Math.pow(this.y-this.fy,2)>360000)
			this.canRemove = true;
		},
		render:function(ctx){
			ctx.beginPath();
			ctx.fillStyle = this.color;
			// ctx.fillRect(this.x,this.y,50,50);
			ctx.arc(this.x,this.y,this.r,0,360*Math.PI/180,true);
			ctx.fill();
			ctx.stroke();
			
		},
		
	});
	renderObjBullet.ClassName = "Bullet";
	ClassFactory.regClass(renderObjBullet.ClassName,renderObjBullet);
})();