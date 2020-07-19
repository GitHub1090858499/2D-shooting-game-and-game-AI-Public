/**
 * 渲染对象类,RenderObj类的子类，敌对人物类
 * 源:主要借鉴于向峰的<html5游戏编程核心技术与实战>,仅做学习用处
 * 调用:John Resig http://ejohn.org/的Class.extend、renderObjBullet.js
 * 被调用:win.Scene
 */

(function(){
	var renderObjBadMan = RenderObj.extend({
		//初始化
		init:function(name,x,y,attackWill,isLeader){
			//对象名
			this._super(name);
			//类名
			this.classN = "BadMan";
			//移动到x，y
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
			//最大加速度
			this.maxVx = 500;
			//最大速度
			this.maxDx = 100;
			//摩擦力
			this.f = 600;
			//子弹编号
			this.bulletNum = 0;
			//开枪延迟，毫秒
			this.shootDelay = 1000;
			//小于0或等于0才能允许射击
			this.shootDelaying = 0;
			//上一帧x，y的速度
			this.lastMoveX = null;
			this.lastMoveY = null;
			//属于scene,有利于调用其他信息
			this.owner=null;
			//上一次的腿动作的位置，用作腿动作的变化的判断
			this.lastx = this.x;
			this.lasty = this.y;
			//事件监听
			this.listeners = [];
			//人物的map格式的xy
			this.mapx=null;
			this.mapy=null;			
			//最基本行为链
			//行走链，以最后为当前动作
			this.walkLink=[];
			//当前行走动作
			this.walking=null;
			//射击链，以最后为当前动作
			this.shootLink=[];
			//进攻频率,例如过了600帧后进行新的经过
			this.attackFQ=6000;
			this.attackFQT=6000;
			//回避频率
			this.avoidFQ=180;
			this.avoidFQT=180;
			
			//寻路间隔
			this.findwayFqT=0;
			//Stateinput信息
			this.stateInput={};
			//状态控制
			this.stateControl;
			//攻击意向，控制状态转换的条件，最高为50，越高越有几率转换成激进的状态
			this.attackWill=attackWill||25;
			//血量
			this.hp=100;
			//是否领导
			this.leader=isLeader||false;
			//是否正在命令中
			this.ifInMission="not";
			
			
			
			
		},
		//二次初始化
		listenersON:function(){
			//ControlState，状态控制
			this.stateControl=this.stateControl||new ControlState(this);
			//是否leader，团队控制
			if(this.leader==false)
			this.orderListener =new OrderListener(this,this.owner.orderMess);
			else {
				this.teamControl =new TeamControl(this.owner);
				this.teamControl.orderClear();
			}
		},
		//信息收集,更新在每帧结尾，用于State的输入
		stateInputCollect:function(){
			//能否看见
			let a1 = this.owner.view.findpoint(this.x,this.y,this.owner.namedRObjs["TheOne"].x,this.owner.namedRObjs["TheOne"].y,15);
			let v1=this.owner.view.canSee(this.x,this.y,a1.x1,a1.y1);
			let vc=this.owner.view.canSee(this.x,this.y,this.owner.namedRObjs["TheOne"].x,this.owner.namedRObjs["TheOne"].y);
			let v2=this.owner.view.canSee(this.x,this.y,a1.x2,a1.y2);
			let canSeeTheOne=v1||v2||vc;
			this.stateInput["canSeeTheOne"]=canSeeTheOne;
			//是否死亡
			let isdie=this.isdie;
			this.stateInput["isdie"]=isdie;
			//下一步位置
			let nextWalkX;
			let nextWalkY;
			if(this.walking!=null){
				let nextWalkX=this.walking.x*this.owner.mapFind.mapsizeW+5;
				let nextWalkY=this.walking.y*this.owner.mapFind.mapsizeH+5;
				this.stateInput["nextWalkX"]=nextWalkX;
				this.stateInput["nextWalkY"]=nextWalkY;
			}else {
				this.stateInput["nextWalkX"]=NaN;
				this.stateInput["nextWalkY"]=NaN;
			}
			//攻击意向
			let attackWill=this.attackWill;
			this.stateInput["attackWill"]=attackWill;
			//开枪延迟
			let shootDelaying=this.shootDelaying;
			this.stateInput["shootDelaying"]=shootDelaying;
			//预判的TheOne的信息,加上时间，预判信息的生成要另外的算法
			let TheOneFuture={
				"x":0,
				"y":0,
				"shootDelaying":0,
				"time":0,
			};
			this.stateInput["TheOneFuture"]=TheOneFuture;
			//TheOne的子弹方向、速度、以及位置（若同时存在多个子弹，选最近发射的）
			let theOneBullet=null;
			if(this.owner.namedRObjs[this.owner.namedRObjs["TheOne"].bullet.name])
				theOneBullet=this.owner.namedRObjs["TheOne"].bullet;
			this.stateInput["theOneBullet"]=theOneBullet;
			//TheOne的位置，方向，速度，射击延迟
			let theOne=this.owner.namedRObjs["TheOne"];
			this.stateInput["theOne"]=theOne;
			//血量
			this.stateInput["hp"]=this.hp;
			//是否命令中
			this.stateInput["ifInMission"]=this.ifInMission;
			return this.stateInput;
		},
		//将像素型的x,y换算成单位型的x，y,在map[][]结构需要使用到
		TMapXy:function(){
			let sw = this.owner.mapFind.mapsizeW;
			let sh = this.owner.mapFind.mapsizeH;
			this.mapx = Math.floor(this.x/sw);
			this.mapy= Math.floor(this.y/sh);
		},
		//向着TheOne射击
		shootTheOne:function(){
			let theone = this.owner.getObjByName("TheOne");
			let tx=theone.x,ty=theone.y,txv=theone.dx,tyv=theone.dy;
			let x=this.x,y=this.y;
			let a = tx-x;
			let b = ty-y;
			let cos = (a)/Math.sqrt(Math.pow(a,2)+Math.pow(b,2));
			let tdeg = 180*Math.acos(cos)/Math.PI;
			if(b<0)
			tdeg= -tdeg;
			this.shoot(tdeg);
		},
		//向着XY射击
		shootXY:function(tx,ty){
			let x=this.x,y=this.y;
			let a = tx-x;
			let b = ty-y;
			let cos = (a)/Math.sqrt(Math.pow(a,2)+Math.pow(b,2));
			let tdeg = 180*Math.acos(cos)/Math.PI;
			if(b<0)
			tdeg= -tdeg;
			this.shoot(tdeg);
		},		
		//改变加速度，以此改变速度
		changeVxy:function(vx,vy){
			this.vx = vx||this.vx;
			this.vy = vy||this.vy;
		},	
		//置x轴加速度this.maxVx,直至行走了m个像素，实际只是改变了标志，在update才是真正的实现
		moveXForM:function(m,where){
			//left或right 或 no ，字符串类型
			this.moveXForMWhere = where;
			//距离计数
			this.moveXForMNm = this.x;
			//距离判断
			this.moveXForMTm = m;
			//行走的启动标志
			this.moveXForMOn = true;
		},
		//停止x轴加速度
		stopXV:function(){
			this.moveXForMWhere = "no";
			this.vx = 0;
			this.moveXForMOn = false;
			this.moveXForMTm = 0;
			this.moveXForMNm = 0;
		},
		//置y轴加速度this.maxVx,直至行走了m个像素，实际只是改变了标志，在update才是真正的实现
		moveYForM:function(m,where){
			//up或down 或 no ，字符串类型
			this.moveYForMWhere = where;
			//距离计数
			this.moveYForMNm = this.y;
			//距离判断
			this.moveYForMTm = m;
			//行走的启动标志
			this.moveYForMOn = true;
		},
		//停止y轴加速度
		stopYV:function(){
			this.moveYForMWhere = "no";
			this.vy = 0;
			this.moveYForMOn = false;
			this.moveYForMTm = 0;
			this.moveYForMNm = 0;
		},
		//向上下左右，走一个map的单位（其定义在this.owner中）
		moveOne:function(where){
			if(where=="left"||where=="right")this.moveXForM(1,where);
			else if(where=="up"||where=="down")this.moveYForM(1,where);
		},
		//按照行走链移动
		moveAsWalkLink:function(){
			//walkLink为空则退出
			if(this.walkLink.length==0&&this.walking==null)return;
			
			//有行走动作，表明本次动作还未完成
			if(this.walking!=null){				
				let where="";
				if(this.walking.x<this.mapx)where="left";
				else if(this.walking.x>this.mapx)where="right";
				else if(this.walking.y<this.mapy)where="up";
				else if(this.walking.y>this.mapy)where="down";
				this.moveOne(where);
				
			}else{
			//无行走动作，表明本次动作已完成，进行下一动作
				this.walking=this.walkLink.pop();
			}
			
			
		},
		//向deg角度开枪
		shoot:function(deg){
			if(this.shootDelaying <=0&&this.isdie==false){
				this.shootDelaying = this.shootDelay;
				let sc = this.owner;
				this.rotate(deg);
				//创建子弹obj
				let theone = this.owner.getObjByName("TheOne");
				sc.createRObj("Bullet",[this,this.x,this.y,this.deg,this.handLong,theone]);	
			}
	
		},
		//数据改变!!!!待完成
		update:function(){			
			//血量死亡检测
			if(this.isdie==false&&this.hp<=0){
				this.die();
			}
			
			
			// return ;
			// this.shootTheOne();			
			//行走判断和更新
			let moveX = this.moveXForMOn == true && Math.abs(this.moveXForMNm-this.x)<=this.moveXForMTm &&
						(this.moveXForMWhere=="left"||this.moveXForMWhere=="right");
				if(moveX){
					if(this.moveXForMWhere == "left")this.vx = -this.maxVx;
					if(this.moveXForMWhere == "right")this.vx = this.maxVx;
				}else if(this.moveXForMOn == true){
					this.stopXV();
				};
			let moveY = this.moveYForMOn == true && Math.abs(this.moveYForMNm-this.y)<=this.moveYForMTm &&
						(this.moveYForMWhere=="up"||this.moveYForMWhere=="down");
				if(moveY){
					if(this.moveYForMWhere == "up")this.vy = -this.maxVx;
					if(this.moveYForMWhere == "down")this.vy = this.maxVx;
				}else if(this.moveYForMOn == true){
					this.stopYV();
				};
				
			
			
			
			//更新死亡动作
			if(this.isdie==false)
			this._super();
			else {
				 if(GameFrames.currentTime-this.dieTime>=this.dieBodyDispearTiem)this.canRemove = true;
			}
			
			//开枪延迟计时更新
			this.shootDelaying =this.shootDelaying-this.fiyTiem;
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
			
		
			//摩擦力以致静止的判断
			//若是上一帧和这一帧的运动方向相反，并且此时的加速度为单独摩擦力赋予时，判断为摩擦静止
			if(this.lastMoveX ==1&&this.dx<=0){
				if(this.vx == -this.f){
					this.vx = 0;
					this.dx = 0;
				}				
			};
			if(this.lastMoveX == -1&&this.dx>=0){
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
			if(this.dx>0)this.lastMoveX=1;
			if(this.dx==0)this.lastMoveX=0;
			if(this.dx<0)this.lastMoveX=-1;	
			if(this.dy>0)this.lastMoveY=1;
			if(this.dy==0)this.lastMoveY=0;
			if(this.dy<0)this.lastMoveY=-1;
			
			
			//this.walking有效并且若this.walking已经完成
			if(this.walking!=null&&this.walking.x==this.mapx&&this.walking.y==this.mapy){
				// this.x=this.lastWalking.x*this.owner.mapsizeW;
				// this.y=this.lastWalking.y*this.owner.mapsizeH;
				// this.lastWalking=this.walking;
				this.walking=null;
			}
			
			
			//更新map坐标
			this.TMapXy();
			
			//寻路类
			//walkLink大于0则执行寻路链的内容
			if(this.walkLink.length>0||this.walking!=null)this.moveAsWalkLink();
			else {
			//否则置walking无效（因为要this.walkLink和walking同步，所以要有此举）
				this.walking=null;
			};
			//团控
			if(this.leader==false){
				//上传信息
				if(this.stateInput.canSeeTheOne==true&&this.isdie==false&&!this.owner.orderMess.mess["hasSeeTheOne"]){
					let test = this.owner.orderMess.mess;
					this.orderListener.uploadMess("hasSeeTheOne");
					window.sendText.push({
						"name":this.name,
						"action":"报告首领",
						"C":"看见TheONe",
						})
				}
				// 接收命令
				if(this.ifInMission!="attack")
				this.orderListener.runOrder(this.name);
			}else if(Game.setteam){
				 //命令执行情况检测
				 if(this.teamControl.checkorderTeamO()){
					 //清空命令，以执行下一命令
					 this.teamControl.orderClear();
				 };
				 //更新下属
				 this.teamControl.updateUnder();
				 //按照上传的信息下达命令
				 this.teamControl.orderAsMess();
			}
			//个人状态
			let input=this.stateInputCollect();
			
			this.stateControl.findWayAsState(input);
			
			this.stateControl.shootAsState(input);
			
			
			this.stateControl.changeState(input);

		},
		//回避动作寻路开启
		avoidFindWayOn:function(){
			//需要复制
			this.avoidFindWayOff();
			this.walkLink=this.owner.mapFind.findAvoidway(this.mapx,this.mapy);
		},
		//回避动作寻路关闭
		avoidFindWayOff:function(){
			this.walkLink.length=0;
			this.walking=null;
		},
		//进攻寻路开启,作用于updata的walklink
		attackFindwayOn:function(){
			this.attackFindwayOff();
			this.walkLink=this.owner.mapFind.findway(this.mapx,this.mapy,this.owner.manx,this.owner.many);
		},
		//进攻寻路关闭
		attackFindwayOff:function(){
			this.walkLink.length=0;
			this.walking=null;
		},
		//巡逻寻路
		patrolFindwayOn:function(){
			this.patrolFindwayOff();
			this.walkLink=this.owner.mapFind.findPatroltway(this.mapx,this.mapy,100+Math.floor(Math.random()*200));
		},
		//巡逻寻路关闭
		patrolFindwayOff:function(){
			this.walkLink.length=0;
			this.walking=null;
		},
		//躲避子弹寻路
		avoidBulleFindwayOn:function(){
			if(this.stateInput.theOneBullet!=null){
				let bl=this.stateInput.theOneBullet;
				this.avoidBulleFindwayOff();
				this.walkLink=this.owner.mapFind.findAvoidBulletway(this.mapx,this.mapy,bl.x,bl.y,bl.dx,bl.dy);
			}
		},
		//躲避子弹关闭
		avoidBulleFindwayOff:function(){
			this.walkLink.length=0;
			this.walking=null;
		},
		//渲染人物
		render:function(ctx){
			//渲染前的监听器执行
			let ltns = this.listeners;
			for(var i = 0;i<ltns.length;i++){
				ltns[i].enabled&&ltns[i].beforeRender(this);
			};
			if(this.leader==false)
				RenderFunction.drawBadCharaster(ctx,this.x,this.y,this.isdie,this.deg,this.leg,this.r);
			else RenderFunction.drawBadLeaderCharaster(ctx,this.x,this.y,this.isdie,this.deg,this.leg,this.r);
			
			//显示寻路扩展点
			if(this.owner.mapFind.test&&Game.showSearchway){
				for(let a in this.owner.mapFind.test){
					ctx.fillStyle="rgba(0, 255, 0, 0.3)";
					ctx.fillRect(this.owner.mapFind.test[a].x*this.owner.mapFind.mapsizeW,this.owner.mapFind.test[a].y*this.owner.mapFind.mapsizeH,10,10);
				}
			}
			
			
			//显示寻路路径
			if(this.walking!=null&&Game.showFindway){
				ctx.fillStyle="rgba(0, 0, 0, 0.4)";
				for(let a of this.walkLink){
					ctx.fillRect(a.x*this.owner.mapFind.mapsizeW,a.y*this.owner.mapFind.mapsizeH,10,10);
				}
				//显示下一步位置
				ctx.fillStyle="rgba(0, 0, 0, 0.4)";
				ctx.fillRect(this.walking.x*this.owner.mapFind.mapsizeW,this.walking.y*this.owner.mapFind.mapsizeH,10,10);
				//显示本身位置
				ctx.fillStyle="rgba(255, 43, 15, 0.4)";
				ctx.fillRect(this.mapx*this.owner.mapFind.mapsizeW,this.mapy*this.owner.mapFind.mapsizeH,10,10);	
			}	
			//显示视线
			if(this.owner.namedRObjs["TheOne"]&&Game.showView){
				//ai视线
				ctx.strokeStyle="rgba(1,1,1,0.1)"
				let a = this.owner.view.findpoint(this.x,this.y,this.owner.namedRObjs["TheOne"].x,this.owner.namedRObjs["TheOne"].y,14);
				ctx.beginPath();
				ctx.moveTo(this.x,this.y);
				ctx.lineTo(a.x1,a.y1);
				ctx.moveTo(this.x,this.y);
				ctx.lineTo(a.x2,a.y2);
				// ctx.moveTo(this.x,this.y);
				// ctx.lineTo(this.owner.namedRObjs["TheOne"].x,this.owner.namedRObjs["TheOne"].y);
				ctx.stroke();
				ctx.closePath();
				delete a;
				//TheOne视线
				ctx.strokeStyle="rgba(255,1,1,0.1)"
				let b = this.owner.view.findpoint(this.owner.namedRObjs["TheOne"].x,this.owner.namedRObjs["TheOne"].y,this.x,this.y,14);
				ctx.beginPath();
				ctx.moveTo(this.owner.namedRObjs["TheOne"].x,this.owner.namedRObjs["TheOne"].y);
				ctx.lineTo(b.x1,b.y1);
				ctx.moveTo(this.owner.namedRObjs["TheOne"].x,this.owner.namedRObjs["TheOne"].y);
				ctx.lineTo(b.x2,b.y2);
				ctx.stroke();
				ctx.closePath();
				delete b;
			}
			
			//显示状态
			if(Game.showState){
				this.stateControl.renderRemindAsState(ctx);
			}
			
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
			}
			
	});
	renderObjBadMan.ClassName = "BadMan";
	ClassFactory.regClass(renderObjBadMan.ClassName,renderObjBadMan);
		
})();