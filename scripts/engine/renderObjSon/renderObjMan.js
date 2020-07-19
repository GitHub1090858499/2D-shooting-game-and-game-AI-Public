/**
 * 渲染对象类,RenderObj类的子类，主人物类
 * 源:主要借鉴于向峰的<html5游戏编程核心技术与实战>,仅做学习用处
 * 调用:John Resig http://ejohn.org/的Class.extend
 * 被调用:win.Scene
 */

(function(){
	var renderObjMan = RenderObj.extend({
		init:function(name,x,y){
			this._super(name);
			this.classN = "Man";
			this.moveTo(x,y);
			//是否死亡
			this.isdie = false;
			//死亡后消失时间
			this.dieBodyDispearTiem = 2000;
			//头的半径
			this.r = 10;
			//手的长度，用于开枪的参数
			this.handLong = this.r*1.5;
			//腿的动作编号0~4
			this.leg = 0;
			//子弹编号
			this.bulletNum = 0;
			//开枪延迟，毫秒
			this.shootDelay = 1000;
			this.shootDelaying = 0;
			//最大加速度
			this.maxVx = 500;
			//最大速度
			this.maxDx = 150;
			//摩擦力
			this.f = 600;
			//上一帧x，y的速度
			this.lastMove = null;
			this.lastMoveY = null;
			//属于scene,有利于调用其他信息
			this.owner=null;
			//其他信息，用于调试
			this.other = "";
			//鼠标位置
			this.mouseX=null;
			this.mouseY=null;
			//上一次的腿动作的位置，用作腿动作的变化的判断
			this.lastx = this.x;
			this.lasty = this.y;
			//事件监听
			this.listeners = [];
			//保存renderObj对象，数组形式
			this.canshoot=false;
			//最近射出的Bullet
			this.bullet={};
			//血量
			if(Game.setHHp)
			this.hp=1000;
			else this.hp=100;
		},
		//改变加速度，以此改变速度，很少用到
		changeVxy:function(vx,vy){
			this.vx = vx||this.vx;
			this.vy = vy||this.vy;
		},
		//在scene.js 被引用，按键监听
		listenersON:function(owner){
			this.listenersClose();
			this.owner = this.owner||owner;
			let thisClass = this;	
			let cvs = this.owner.cvs[0];
			//可编辑状态
			cvs.contentEditable=true;
			cvs.style.cursor = "none";
			//添加按键监听器
			this.kedownE=function(event){
				if(thisClass.isdie||thisClass.owner.ispause)return;
				
				if(event.keyCode == 68&&thisClass.dx<thisClass.maxDx){
					thisClass.vx = thisClass.maxVx;
				}
				else if(event.keyCode == 65&&thisClass.dx>-thisClass.maxDx){
					thisClass.vx = -thisClass.maxVx;
					// thisClass.tt +=1;
				}else if(event.keyCode ==83&&thisClass.dy<thisClass.maxDx){
					thisClass.vy = thisClass.maxVx;
				}else if(event.keyCode==87&&thisClass.dy>-thisClass.maxDx){
					thisClass.vy = -thisClass.maxVx;
				}
			}
			cvs.addEventListener("keydown",this.kedownE);
			this.keupE = function(event){
				if(thisClass.isdie||thisClass.owner.ispause)return;
				if(event.keyCode == 68){
					
					thisClass.vx = 0;
				
				}
				else if(event.keyCode == 65){
					thisClass.vx = 0;
				}else if(event.keyCode ==83){
					thisClass.vy = 0;
				}else if(event.keyCode==87){
					thisClass.vy=0;
				};
				
			};
			cvs.addEventListener("keyup",this.keupE);
			this.mousemoveE = function(event){
				//监听鼠标
				thisClass.other = "x:"+event.offsetX+" y:"+event.offsetY;
				thisClass.mouseX = event.offsetX;
				thisClass.mouseY = event.offsetY;		
			
			}
			cvs.addEventListener("mousemove",this.mousemoveE);
			this.clickE = function(event){
				if(thisClass.isdie||thisClass.owner.ispause)return;
				thisClass.canshoot=true;
			}
			cvs.addEventListener("click",this.clickE);
		},
		listenersClose:function(owner){
			this.owner = this.owner||owner;
			let thisClass = this;	
			let cvs = this.owner.cvs[0];
			cvs.contentEditable=false;
			cvs.style.cursor = "default";
			cvs.removeEventListener("keydown",this.kedownE);
			cvs.removeEventListener("keyup",this.keupE);
			cvs.removeEventListener("mousemove",this.mousemoveE);
			cvs.removeEventListener("click",this.clickE);
			
		},
		//向角度开枪
		shoot:function(deg){
			if(this.shootDelaying <=0&&this.isdie==false){
				this.shootDelaying = this.shootDelay;
				let sc = this.owner;
				this.rotate(deg);
				//创建子弹obj
				this.bullet=sc.createRObj("Bullet",[this,this.x,this.y+this.r*0.25,this.deg,this.handLong]);	
				this.canshoot=false;
			}
			// thisClass.canshoot=false;s
		},
		//数据改变!!!!待完成
		update:function(){	
			
			
			if(this.isdie==false&&this.hp<=0){
				this.die();
			}
		
			
			if(this.isdie==false)
			this._super();
			else {
				 if(GameFrames.currentTime-this.dieTime>=this.dieBodyDispearTiem)this.isVisable = false;
			}
			
			// this.rotate(this.deg);
			//开枪延迟更新
			this.shootDelaying =this.shootDelaying-this.fiyTiem;
			//是否开枪
			this.canshoot&&this.shoot(this.deg);
			//脚的姿势调整
			if(Math.sqrt(Math.pow(this.x-this.lastx,2)+Math.pow(this.y-this.lasty,2))>20){
				this.lastx = this.x;
				this.lasty = this.y;
				this.leg=(this.leg+1)%4+1;
			};
			if(this.dx==0&&this.dy==0){
				this.lastx = this.x;
				this.lasty = this.y;
				this.leg=0;
			};
			
			// this.tt = this.owner.cvs;
			//摩擦力以致静止的判断
			//若是上一帧和这一帧的运动方向相反，并且此时的加速度为单独摩擦力赋予时，判断为摩擦静止
			if(this.lastMove ==1&&this.dx<=0){
				if(this.vx == -this.f){
					this.vx = 0;
					this.dx = 0;
				}				
			};
			if(this.lastMove == -1&&this.dx>=0){
				if(this.vx ==this.f){
					this.vx = 0;
					this.dx = 0;
				}
			};
			if(this.lastMoveY ==1&&this.dy<=0){
				if(this.vy == -this.f){
					this.vy = 0;
					this.dy = 0;
				}				
			};
			if(this.lastMoveY == -1&&this.dy>=0){
				if(this.vy ==this.f){
					this.vy = 0;
					this.dy = 0;
				}
			};
			
			
			
			//摩擦力的赋予
			if(this.dx>0&&(this.vx==0||this.vx==-this.maxVx))this.vx = -this.f;
			if(this.dx<0&&(this.vx==0||this.vx==this.maxVx))this.vx = this.f;
			if(this.dy>0&&(this.vy==0||this.vy==-this.maxVx))this.vy = -this.f;
			if(this.dy<0&&(this.vy==0||this.vy==this.maxVx))this.vy = this.f;
			
			//限速
			let maxV = this.maxDx; 
			if(this.dx>maxV){this.dx=maxV;}
			if(this.dx<-maxV){this.dx=-maxV;}
			if(this.dy>maxV){this.dy=maxV;}
			if(this.dy<-maxV){this.dy=-maxV;}
		
			
			
			//本帧作为下一帧的上一帧运动状态存储
			if(this.dx>0)this.lastMove=1;
			if(this.dx==0)this.lastMove=0;
			if(this.dx<0)this.lastMove=-1;
			
			if(this.dy>0)this.lastMoveY=1;
			if(this.dy==0)this.lastMoveY=0;
			if(this.dy<0)this.lastMoveY=-1;
			
			//鼠标信息更新
			let thisClass = this;
			thisClass.other = "x:"+thisClass.mouseX+" y:"+thisClass.mouseY;
			let a = thisClass.mouseX-thisClass.x;
			let b = thisClass.mouseY-thisClass.y;
			let cos = (a)/Math.sqrt(Math.pow(a,2)+Math.pow(b,2));
			let deg = 180*Math.acos(cos)/Math.PI;
			if(b<0)
			deg= -deg;	
			thisClass.rotate(deg);
			thisClass.other = "cos:"+cos+ "  deg:"+deg;
		
			
			
		},
		//渲染人物
		render:function(ctx){
			//渲染前的监听器执行
			let ltns = this.listeners;
			for(var i = 0;i<ltns.length;i++){
				ltns[i].enabled&&ltns[i].beforeRender(this);
			};
			RenderFunction.drawCharaster(ctx,this.x,this.y,this.isdie,this.deg,this.leg,this.r);
			
			//添加鼠标点击
			let x = this.mouseX, y=this.mouseY;
			ctx.beginPath();
			ctx.lineWidth = 1;
			ctx.fillStyle = "red";
			ctx.strokeStyle = "red";
			ctx.lineJoin = "round";
			ctx.arc(x,y,2,0,360*Math.PI/180,true);
			ctx.fill();
			ctx.stroke();
			ctx.closePath();
		},
		die:function(){
			this.dieTime = GameFrames.currentTime;
			this.isdie = true;
		},
		//添加监听器
		addListener:function(ln){
			this.listeners.push(ln);
		},
		//清除监听器
		clearListeners:function(){
			this.listeners.length = 0;
		},
		
		
	});
	renderObjMan.ClassName = "Man";
	ClassFactory.regClass(renderObjMan.ClassName,renderObjMan);
	
})()