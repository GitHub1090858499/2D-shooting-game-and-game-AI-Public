/**
 * 状态类的父类,聚合在Badman中
 */
class State{
	//ControlState为输入
	constructor(controlState) {
		
		//模糊逻辑对象
		this.fl = new FuzzyLogic();
		
		this.controlState=controlState;
	   	this.ai=controlState.ai;
		this.theOne=controlState.ai.owner.getObjByName("TheOne");
		//寻路间隔，每个状态都有不同
		this.findwayFq=180;
		this.findwayFqT=0;
		//状态转换冷却，每个状态都有不同
		this.stateChangeCD=90;
		//攻击意向计算间隔
		this.attackwillCD=200;
		//寻路次数
		this.findTime=1;
		//射击次数
		this.hasShootA=20;
		//触发巡逻计数
		this.patrolCd=200;
	}
	//重置寻路间隔
	setInit(){
		//攻击意向计算频率控制
		this.attackwillCDT=0;
		//寻路频率
		this.findwayFqT=0;
		// 状态转换cd
		this.stateChangeCDT=this.stateChangeCD;
		//寻路次数
		this.findTimeT=this.findTime;
		//射击次数
		this.hasShoot=this.hasShootA;
		//上一帧的移动方向
		this.sx;
		this.sy;
		//触发巡逻计数
		this.patrolCdT=this.patrolCd;
		//关闭寻路
		this.ai.attackFindwayOff();
	}
	//接口，寻路
	findwayAsState(){
		
	}
	findwayAsStateOff(){
		this.ai.walkLink.length=0;
		this.ai.walking=null;
	}
	//接口，射击
	shootAsState(){
		
	}
	//接口，绘制状态
	renderRemindAsState(ctx){
			
	}
	//接口，状态改变
	changeState(input){
		
	}
	
	//向着TheOne转头
	_JustRotateAtTheONe(){
		let theone = this.theOne;
		let tx=theone.x,ty=theone.y,txv=theone.dx,tyv=theone.dy;
		let x=this.ai.x,y=this.ai.y;
		let a = tx-x;
		let b = ty-y;
		let cos = (a)/Math.sqrt(Math.pow(a,2)+Math.pow(b,2));
		let tdeg = 180*Math.acos(cos)/Math.PI;
		if(b<0)
		tdeg= -tdeg;
		// this._JustRotate(tdeg);
		this.ai.rotate(tdeg);
	}
	//向着X,Y方向转头
	_JustRotateAtXY(tx,ty){
		
		let x=this.ai.x,y=this.ai.y;
		let a = tx-x;
		let b = ty-y;
		let cos = (a)/Math.sqrt(Math.pow(a,2)+Math.pow(b,2));
		let tdeg = 180*Math.acos(cos)/Math.PI;
		if(b<0)
		tdeg= -tdeg;
		this.ai.rotate(tdeg);
	}
	_shootAinet(){
		//元件
		let net = this.ai.owner.neuraNet;
		let ai=this.ai;
		let theone=this.theOne;
		//不可见则退出
		let a1 = this.ai.owner.view.findpoint(this.ai.x,this.ai.y,theone.x,theone.y,5);
		let v1=this.ai.owner.view.canSee(this.ai.x,this.ai.y,a1.x1,a1.y1);
		let vc=this.ai.owner.view.canSee(this.ai.x,this.ai.y,theone.x,theone.y);
		let v2=this.ai.owner.view.canSee(this.ai.x,this.ai.y,a1.x2,a1.y2);
		if(!v1&&!v2&&!vc)return ;
		
		if(this.ai.shootDelaying >0||this.ai.isdie==true)return ;
		//输入
		let L=theone.x-ai.x;
		let H=theone.y-ai.y;
		let Vx=theone.vx;
		let Vy=theone.vy;
		let V=350;
		// 输入缩小300倍
		let s=300;
		//输出
		// let baol=10000;
		// let tl=Math.floor(L/s*baol)/baol;
		// let th=Math.floor(H/s*baol)/baol;
		// let ts=Math.floor(V/s*baol)/baol;
		// let tx=Math.floor(Vx/s*baol)/baol;
		// let ty=Math.floor(Vy/s*baol)/baol;
		// let yy=net.getY([-1,tl,th,ts,tx,ty]);
		// let yy=net.getY([-1,L,H,V,Vx,Vy]);		
		let yy=net.getY([-1,L/s,H/s,V/s,Vx/s,Vy/s]); 
		
		
		// 加点延迟信息
		this.ai.shootXY(yy[0]+ai.x,yy[1]+ai.y);
		
		window.sendText.push({
			"name":this.ai.name,
			"action":"神经网络射击",
			"C":"("+Math.ceil(yy[0]+ai.x) +","+Math.ceil(yy[1]+ai.y)+")",
			})
	}
	
	
	//若THeone在视野内，则射击
	_shootView(){
		if(this.ai.shootDelaying >0||this.ai.isdie==true)return ;
		let theone=this.theOne;
		let a1 = this.ai.owner.view.findpoint(this.ai.x,this.ai.y,theone.x,theone.y,5);
		let v1=this.ai.owner.view.canSee(this.ai.x,this.ai.y,a1.x1,a1.y1);
		let vc=this.ai.owner.view.canSee(this.ai.x,this.ai.y,theone.x,theone.y);
		let v2=this.ai.owner.view.canSee(this.ai.x,this.ai.y,a1.x2,a1.y2);
		if(v1&&v2&&vc){
			this.ai.shootTheOne();
		}else if(v1){
			this.ai.shootXY(a1.x1,a1.y1);	
		}else if(v2){
			this.ai.shootXY(a1.x2,a1.y2);	
		}

	}
	//s秒后马上射击
	_shootAfterS(x,y,s){
		//若this._shootQueue已经存在，则表明已有预判射击的计划
		if(this._shootQueue!=null){
			//更新计时，每帧增加1000/GameFrames.fps
			this._shootQueue.Rs=this._shootQueue.Rs+1000/GameFrames.fps;
			//若到达时间则射击，并且清空_shootQueue
			if(this._shootQueue.Rs>=this._shootQueue.s){
				let a1 = this.ai.owner.view.findpoint(this.ai.x,this.ai.y,this._shootQueue.x,this._shootQueue.y,10);
				let v1=this.ai.owner.view.canSee(this.ai.x,this.ai.y,a1.x1,a1.y1);
				let vc=this.ai.owner.view.canSee(this.ai.x,this.ai.y,this._shootQueue.x,this._shootQueue.y);
				let v2=this.ai.owner.view.canSee(this.ai.x,this.ai.y,a1.x2,a1.y2);
				if(v1&&v2&&vc){
					this.ai.shootXY(this._shootQueue.x,this._shootQueue.y);
					window.sendText.push({
						"name":this.ai.name,
						"action":"预判射击",
						"C":"("+Math.ceil(this._shootQueue.x) +","+Math.ceil(this._shootQueue.y)+")",
						})
					this.hasShoot--;
					this._shootQueue=null;
					return true;
				}else if(v1){
					this.ai.shootXY(a1.x1,a1.y1);	
					window.sendText.push({
						"name":this.ai.name,
						"action":"预判射击",
						"C":"("+Math.ceil(a1.x1)+","+Math.ceil(a1.y1)+")",
						})
					this.hasShoot--;
					this._shootQueue=null;
					return true;
				}else if(v2){
					this.ai.shootXY(a1.x2,a1.y2);	
					window.sendText.push({
						"name":this.ai.name,
						"action":"预判射击",
						"C":"("+Math.ceil(a1.x2)+","+Math.ceil(a1.y2)+")",
						})
					this.hasShoot--;
					this._shootQueue=null;
					return true;
				}
				else{
					return false;
				}
			
				
			}			
			return false;
		}else return false;
	}
	//预判射击，取每300毫秒后预判的可视范围的
	_shootPre(){
		//得到的prex,prey,预计时间s,应该在s-aib后马上射击此处
		if(this._shootQueue!=null){
			this._shootAfterS(this._shootQueue.x,this._shootQueue.y,this._shootQueue.s);
			
		}
		
		
		//若当前不是正在运动，则不进行预测
		if(this.theOne.dx==0&&this.theOne.dy==0)return ;
		//若当前无_shootQueue,则进行预测
		if(this._shootQueue==null){
			//单位为毫秒
			let s=0,es=300,aib=s+1;
			let theone=this.theOne;
			let a1={},v1=false,vc=false,v2=false;	
			let prex=0,prey=0;
			let canSeepre=false;
			let tt=0;
			while((canSeepre==false||s-aib<0)&&tt<20){
				s=s+es;
				//计算s秒后的prex，prey
				prex=theone.x+(theone.dx/(Math.abs(theone.dx)+0.001)*(theone.maxDx-5))*(s/1000);
				prey=theone.y+(theone.dy/(Math.abs(theone.dy)+0.001)*(theone.maxDx-5))*(s/1000);
				a1=this.ai.owner.view.findpoint(this.ai.x,this.ai.y,prex,prey,5);
				v1=this.ai.owner.view.canSee(this.ai.x,this.ai.y,a1.x1,a1.y1);
				vc=this.ai.owner.view.canSee(this.ai.x,this.ai.y,prex,prey);
				v2=this.ai.owner.view.canSee(this.ai.x,this.ai.y,a1.x2,a1.y2);
				//是否在可行走路上
				let v3=this.ai.owner.view.ifInWalk(prex,prey);
				//判断prex,prey是否可见
				canSeepre=(v1||v2||vc)&&v3;
				//判断ai子弹射击prex,prey的时间
				aib=(Math.sqrt(Math.pow(prex-this.ai.x,2)+Math.pow(prey-this.ai.y,2))/350)*1000;
				tt++;
			}
		
			if(canSeepre==true){
				this.sx=theone.dx>0?1:theone.dx<0?-1:0;
				this.sy=theone.dy>0?1:theone.dy<0?-1:0;
				this._shootQueue={"x":prex,"y":prey,"s":s-aib,"Rs":0};
			}
		}
		
	}
	
	//寻路TheOne
	_findWayTheOne(){
		if(this.findwayFqT<=0){
			this.ai.attackFindwayOn();
			this.findwayFqT=this.findwayFq;
		}else{
			this.findwayFqT--;
		}
	}
	//寻路最近的block
	_findWayBlock(){
		//回避控制
		if(this.findwayFqT<=0){
			this.ai.avoidFindWayOn();
			this.findwayFqT=this.findwayFq;
		}else{
			this.findwayFqT--;
		}
	}
	//寻路巡逻
	_findWayPatrol(){
		//寻路控制
		if(this.findwayFqT<=0){
			this.ai.patrolFindwayOn();
			this.findwayFqT=this.findwayFq;
		}else{
			this.findwayFqT--;
		}
	}
	//寻路躲子弹
	_findWayAvoidBulleF(){
		//寻路控制
		if(this.findwayFqT<=0){
			this.ai.avoidBulleFindwayOn();
			this.findwayFqT=this.findwayFq;
		}else{
			this.findwayFqT--;
		}
	}
	
}

/**
 * 休息状态
 */
class StateRest extends State{
	constructor(controlState) {
	    super(controlState);
		this.findwayFq=600;
		this.stateChangeCD=10;
	}
	//不寻路
	findwayAsState(){
		
	}
	//不射击，不转头
	shootAsState(){
		
	}
	//瞌睡
	renderRemindAsState(ctx){
		ctx.fillStyle="red";
		ctx.font = "15px serif";
		ctx.fillText("休息",this.ai.x,this.ai.y-10);
	
	}
	
	//状态改变
	changeState(input){

	}
	
	//描述此刻状态：人物名+移动方案+射击
	toString(){
		return "stateRest:休息状态";
	}
	
}

/**
 * 警戒状态,
 */
class StateAlert extends State{
	//传入robj,classN=BadMan
	constructor(controlState){
		super(controlState);
		//寻路间隔，每秒寻路
		this.findwayFq=600;
		this.stateChangeCD=20;
		//未见TheONe太久，则巡逻
		this.patrolCd=250;
		
		//攻击意向计算间隔 
		this.attackwillCD=200;
	}
	//不寻路
	findwayAsState(){
		
	}
	//向TheOne转头，但不射击
	shootAsState(){
		this._JustRotateAtTheONe();
	}
	//感叹号
	renderRemindAsState(ctx){
		ctx.fillStyle="red";
		ctx.font = "15px serif";
		ctx.fillText("警戒",this.ai.x, this.ai.y-10);
	}
	setInit(){
		super.setInit();
	}
	//状态改变
	changeState(input){
		
	}
	//描述此刻状态：人物名+移动方案+射击
	toString(){
		return "StateAlert:警戒状态，发现敌人";
	}
}

/**
 * 追击状态
 */
class StateTrace extends State{
	constructor(controlState){
		super(controlState);
		//寻路间隔，每秒寻路
		this.findwayFq=60;
		this.stateChangeCD=180;
		this.findTime=1;
	}
	//寻路TheOne
	findwayAsState(input){
		if(this.findTimeT>0){
			this._findWayTheOne();
			this.findTimeT--;
		}else if(input.canSeeTheOne==true){
			this.findTimeT=this.findTime;
		}
		
	}
	//向着THeone转头，并且射击
	shootAsState(){
		this._JustRotateAtTheONe();
		this._shootView();
	}
	//奋斗
	renderRemindAsState(ctx){
		ctx.fillStyle="red";
		ctx.font = "15px serif";
		ctx.fillText("追击",this.ai.x, this.ai.y-10);
	}
	//状态改变
	changeState(input){
	
	}
	setInit(){
		super.setInit();
	}
	//描述此刻状态：人物名+移动方案+射击
	toString(){
		return "StateTrace:追击状态，直面敌人";
	}
}

/**
 * 回避状态
 */
class StateAvoid extends State{
	constructor(arg){
		super(arg);
		//寻路间隔，每秒寻路
		this.findwayFq=30;
	}
	//寻路到最近的障碍物
	findwayAsState(){
		this._findWayBlock();
	}
	//转头向着walking方向，不射击
	shootAsState(){
		if(this.ai.walking){
			if(this.ai.walking.x>this.ai.mapx)
				this._JustRotateAtXY(this.ai.x+500,this.ai.y);
			else if(this.ai.walking.x<this.ai.mapx)
				this._JustRotateAtXY(this.ai.x-500,this.ai.y);
			else if(this.ai.walking.y>this.ai.mapy)
				this._JustRotateAtXY(this.ai.x,this.ai.y+500);
			else if(this.ai.walking.y<this.ai.mapy)
				this._JustRotateAtXY(this.ai.x,this.ai.y-500);
			
		}
		else {
			
		}
	}
	//怂
	renderRemindAsState(ctx){
		ctx.fillStyle="red";
		ctx.font = "15px serif";
		ctx.fillText("回避",this.ai.x, this.ai.y-10);
	}
	//状态改变
	changeState(input){
		
	}
	//描述此刻状态：人物名+移动方案+射击
	toString(){
		return "StateAvoid:回避状态";
	}
}

/**
 * 死亡状态
 */
class StateDead extends State{
	constructor(controlState){
		super(controlState);
		//寻路间隔，每秒寻路
		this.findwayFq=6000;
	}
	//不寻路
	findwayAsState(){
		
	}
	//不转头,不射击
	shootAsState(){
		
	}
	//毒药
	renderRemindAsState(ctx){
		ctx.fillStyle="red";
		ctx.font = "15px serif";
		ctx.fillText("死亡",this.ai.x, this.ai.y-10);
	}
	//状态改变
	changeState(input){
	}
	//描述此刻状态：人物名+移动方案+射击
	toString(){
		return "StateDie:死亡状态";
	}
}

/**
 * 狙击状态
 */
class StateSnipe extends State{
	constructor(controlState){
		super(controlState);
		//寻路间隔，每秒寻路
		this.findwayFq=6000;
		this.stateChangeCD=10;
		this.patrolCd=300;
	}
	
	//不寻路,转向TheOne
	findwayAsState(){
		this._JustRotateAtTheONe();
	}
	//预判射击
	shootAsState(){
		//如果在已经确定射击预判的情况改变了运动方向，或者预判的位置不可行走，则重新预判
		if(this._shootQueue!=null&&
		(this.sx!=(this.theOne.dx>0?1:this.theOne.dx<0?-1:0)||this.sy!=(this.theOne.dy>0?1:this.theOne.dy<0?-1:0))
		){
			this._shootQueue=null;
			this._shootPre();
		}
		//如果此状态没有进行攻击，则进攻
		if(this.hasShoot>0){
			this._shootPre();
		}
		 
	}
	//阴险
	renderRemindAsState(ctx){
		ctx.fillStyle="red";
		ctx.font = "15px serif";
		ctx.fillText("狙击",this.ai.x, this.ai.y-10);
	}
	setInit(){
		super.setInit();
		
	}
	//状态改变
	changeState(input){
	
	}
	//描述此刻状态：人物名+移动方案+射击
	toString(){
		return "StateSnipe:狙击状态";
	}
}

/**
 * 巡逻状态
 */
class StatePatrol extends State{
	constructor(controlState){
		super(controlState);
		//寻路间隔，每秒寻路
		this.findwayFq=90;
	}
	//寻路一定范围，***有随机性
	findwayAsState(){
		this._findWayPatrol();
	}
	//向着Walking方向，若在TheOne在ai前面则视野内射击
	shootAsState(){
		if(this.ai.walking){
			if(this.ai.walking.x>this.ai.mapx){
				this._JustRotateAtXY(this.ai.x+500,this.ai.y);
				//若在TheOne在ai前面,则视野内射击****
			}
			
			else if(this.ai.walking.x<this.ai.mapx){
				this._JustRotateAtXY(this.ai.x-500,this.ai.y);
			}
			else if(this.ai.walking.y>this.ai.mapy){
				this._JustRotateAtXY(this.ai.x,this.ai.y+500);
			}
			else if(this.ai.walking.y<this.ai.mapy){
				this._JustRotateAtXY(this.ai.x,this.ai.y-500);
			}
			
		}
		else {
			
		}
		
	}
	//巡逻
	renderRemindAsState(ctx){
		ctx.fillStyle="red";
		ctx.font = "15px serif";
		ctx.fillText("巡逻",this.ai.x, this.ai.y-10);
	}
	//状态改变
	changeState(input){
	
	}
	//描述此刻状态：人物名+移动方案+射击
	toString(){
		return "StatePatrol:巡逻状态";
	}
}

/**
 * 躲避状态
 */
class StateHide extends State{
	constructor(controlState) {
	    super(controlState);
		this.findwayFq=10;
		this.stateChangeCD=60;
	}
	//寻路躲子弹
	findwayAsState(){
		this._findWayAvoidBulleF();
	}
	//射击，转头
	shootAsState(){
		this._JustRotateAtTheONe();
		// this._shootView();
	}
	//惊恐
	renderRemindAsState(ctx){
		ctx.fillStyle="red";
		ctx.font = "15px serif";
		ctx.fillText("躲避",this.ai.x,this.ai.y-10);
	
	}
	//状态改变
	changeState(input){
		
	}
	
	//描述此刻状态：人物名+移动方案+射击
	toString(){
		return "StateHide:躲避状态";
	}
	
}

/**
 * 躲避并且射击状态
 */
class StateHideShoot extends State{
	constructor(controlState) {
	    super(controlState);
		this.findwayFq=10;
		this.stateChangeCD=60;
	}
	//寻路躲子弹
	findwayAsState(){
		this._findWayAvoidBulleF();
	}
	//射击，转头
	shootAsState(){
		this._JustRotateAtTheONe();
		this._shootView();
	}
	//惊恐
	renderRemindAsState(ctx){
		ctx.fillStyle="red";
		ctx.font = "15px serif";
		ctx.fillText("躲避并且射击",this.ai.x,this.ai.y-10);
	
	}
	//状态改变
	changeState(input){
		
	}
	
	//描述此刻状态：人物名+移动方案+射击
	toString(){
		return "StateHideShoot:躲避并且射击状态";
	}
	
}

/**
 * 警戒射击状态
 */
class StateStandShoot extends State{
	constructor(controlState) {
	    super(controlState);
		this.findwayFq=10;
		this.stateChangeCD=60;
	}
	//不寻路
	findwayAsState(){
		
	}
	//射击，转头
	shootAsState(){
		this._JustRotateAtTheONe();
		this._shootAinet();
		// this._shootView();
	}
	//惊恐
	renderRemindAsState(ctx){
		ctx.fillStyle="red";
		ctx.font = "15px serif";
		ctx.fillText("警戒射击",this.ai.x,this.ai.y-10);
	
	}
	//状态改变
	changeState(input){
		
	}
	
	setInit(){
		super.setInit();
		this.ai.attackFindwayOff();
	}
	//描述此刻状态：人物名+移动方案+射击
	toString(){
		return "StateStandShoot:警戒射击状态";
	}
	
}

/**
 * 刺杀状态
 */
class StateKnife extends State{
	constructor(controlState) {
	    super(controlState);
		this.findwayFq=10;
		this.stateChangeCD=60;
	}
	//寻路TheOne
	findwayAsState(input){
		let view = this.controlState.ai.owner.view;
		let ai= this.controlState.ai;
		let bullet=input.theOneBullet;
		if(this.findTimeT>0){
			this._findWayTheOne();
			this.findTimeT--;
		}else if(input.canSeeTheOne==true){
			this.findTimeT=this.findTime;
		}

	}
	//不射击，转头
	shootAsState(){
		this._JustRotateAtTheONe();
		// this._shootView();
	}
	//惊恐
	renderRemindAsState(ctx){
		ctx.fillStyle="red";
		ctx.font = "15px serif";
		ctx.fillText("刺杀",this.ai.x,this.ai.y-10);
	
	}
	//状态改变
	changeState(input){
		
	}
	setInit(){
		super.setInit();
	}
	//描述此刻状态：人物名+移动方案+射击
	toString(){
		return "StateKnife:刺杀状态";
	}
}	

class ControlState{
	//badMan为输入
	constructor(ai){
		//ai对象
		this.ai=ai;	
		//条件输入
		this.Input;
		
		
		//状态
		this.stateRest=new StateRest(this);
		this.stateAlert=new StateAlert(this);
		this.stateTrace = new StateTrace(this);
		this.stateAvoid = new StateAvoid(this);
		this.stateDead = new StateDead(this);
		this.stateSnipe = new StateSnipe(this);
		this.statePatrol = new StatePatrol(this);
		this.stateHide = new StateHide(this);
		this.stateStandShoot = new StateStandShoot(this);
		this.stateHideShoot = new StateHideShoot(this);
		this.stateKnife = new StateKnife(this);
		this.init();
		this.state=this.stateRest;
		// this.state=this.stateHide;
		this.state.setInit();
	}
	//设置状态转换关系
	init(){
		//休息
		this.stateRest.changeState=function(input){
			let state=this;
			if(input.isdie==true){
				state = this.controlState.stateDead;
			}
			else if(input.canSeeTheOne==true){
				state=this.controlState.stateAlert;
			}
			else {
				state=this;
			}
			
			if(state!=this){
				state.setInit();
			}
			return state;
		}
		
		//警戒
		this.stateAlert.changeState=function(input){
			//一旦看到TheONe则重新计算this.patrolCd
			if(input.canSeeTheOne==false){
				this.patrolCdT--;
			}else{
				this.patrolCdT=this.patrolCd;
			}
			//攻击意向的计算
			if(this.attackwillCDT<=0){
				this.attacktrue=(input.attackWill+Math.floor(Math.random()*100))>60;
				this.attackwillCDT=this.attackwillCD;
				
			}else{
				this.attackwillCDT--;
			}
			this.attacktrue=this.attacktrue||(input.attackWill+Math.floor(Math.random()*100))>60;
			let attacktrue=this.attacktrue;
			
			let state=this;
			//死亡
			if(input.isdie==true){
				state = this.controlState.stateDead;
			}
			//躲避子弹并且射击
			else if(input.canSeeTheOne==true&&input.theOneBullet!=null&&this.fl.attackNot(this.ai.attackWill)>=0.2){
				state = this.controlState.stateHideShoot;
			}
			//直立攻击
			else if(input.canSeeTheOne==true&&this.fl.attackWant(this.ai.attackWill)>=0.4&&this.fl.hpHight(this.ai.hp)>=0.5){
				state = this.controlState.stateStandShoot;
			}
			// 回避
			else if(input.canSeeTheOne==true&&this.fl.hpLow(this.ai.hp)>=0.5){
				state = this.controlState.stateAvoid;
			}
			//追击
			else if(input.canSeeTheOne==false&&this.fl.hpHight(this.ai.hp)>=0.5&&this.fl.attackWant(this.ai.attackWill)>=0.4){
				state = this.controlState.stateTrace;
			}
			//狙击
			else if(input.canSeeTheOne==false&&this.fl.hpHight(this.ai.hp)>=0.5&&this.fl.attackNot(this.ai.attackWill)>=0.2){
				state = this.controlState.stateSnipe;
			}
			//巡逻
			else if(this.patrolCdT<=0){
				state = this.controlState.statePatrol;
			}
			else {
				state=this;
			}
			
			if(state!=this){
				state.setInit();
			}
			return state;
		}
	
		//追击
		this.stateTrace.changeState=function(input){
			//攻击意向的计算
			if(this.attackwillCDT<=0){
				this.attacktrue=(input.attackWill+Math.floor(Math.random()*100))>60;
				this.attackwillCDT=this.attackwillCD;
				
			}else{
				this.attackwillCDT--;
			}
			this.attacktrue=this.attacktrue||(input.attackWill+Math.floor(Math.random()*100))>60;
			let attacktrue=this.attacktrue;
			//死亡
			let state=this;
			if(input.isdie==true){
				state = this.controlState.stateDead;
			}
			//躲避射击
			else if(input.canSeeTheOne==true&&this.fl.hpHight(this.ai.hp)>=0.5&&
			input.theOneBullet!=null&&this.fl.attackNot(this.ai.attackWill)>=0.2){
				state = this.controlState.stateHideShoot;
			}
			//直立射击
			else if(input.canSeeTheOne==true&&this.fl.hpHight(this.ai.hp)>=0.5&&
			input.theOneBullet!=null&&this.fl.attackWant(this.ai.attackWill)>=0.4){
				state = this.controlState.stateStandShoot;
			}
			//巡逻
			else if(input.canSeeTheOne==false&&isNaN(input.nextWalkX)){
				state = this.controlState.statePatrol;
			}
			//回避
			else if(input.canSeeTheOne==true&&this.fl.hpLow(this.ai.hp)>=0.5&&this.fl.attackNot(this.ai.attackWill)>=0.2){
				state = this.controlState.stateAvoid;
			}
			//刺杀
			else if(input.canSeeTheOne==true&&this.fl.hpLow(this.ai.hp)>=0.5&&this.fl.attackWant(this.ai.attackWill)>=0.7){
				state = this.controlState.stateKnife;
			}
			else {
				state=this;
			}
			
			if(state!=this){
				 state.setInit();
			}
			 return state;
		}
	
		//回避
		this.stateAvoid.changeState=function(input){
			//攻击意向的计算
			if(this.attackwillCDT<=0){
				this.attacktrue=(input.attackWill+Math.floor(Math.random()*100))>60;
				this.attackwillCDT=this.attackwillCD;
				
			}else{
				this.attackwillCDT--;
			}
			this.attacktrue=this.attacktrue||(input.attackWill+Math.floor(Math.random()*100))>60;
			let attacktrue=this.attacktrue;
			
			let state=this;
			//死亡
			if(input.isdie==true){
				state= this.controlState.stateDead;
			}
			//狙击
			else if(input.canSeeTheOne==false){
				state =  this.controlState.stateSnipe;
			} 
			//直立射击
			else if(input.canSeeTheOne==true&&this.fl.hpLow(input.theOne.hp)>=0.5&&this.fl.attackWant(this.ai.attackWill)>=0.2){
				state = this.controlState.stateStandShoot;
			}else{
				state=this;
			}
			
			if(state!=this){
				state.setInit();
			}
			return state;
		}
	
		//死亡
		this.stateDead.changeState=function(input){
			return this;
		}
		
		//狙击
		this.stateSnipe.changeState=function(input){
			
			if(this.hasShoot>0){
				this.patrolCdT--;
			}else{
				this.patrolCdT=this.patrolCd;
			}
			let state=this;
			//死亡
			if(input.isdie==true){
				state = this.controlState.stateDead;
			}
			//回避
			else if(this.hasShoot<=0&&input.canSeeTheOne==true){
				state = this.controlState.stateAvoid;
			}
			//警戒
			else if(this.hasShoot<=0&&input.canSeeTheOne==false){
				state = this.controlState.stateAlert;
			}
			//巡逻
			else if(input.canSeeTheOne==false&&this.patrolCdT<=0){
				state = this.controlState.statePatrol;
			}
			else {
				state=this;
			};
			if(state!=this){
				state.setInit();
			}
			return state;
		}
	
		//躲避
		this.stateHide.changeState=function(input){
			let state=this;
			//死亡
			if(input.isdie==true){
				state = this.controlState.stateDead;
			}
			//警戒
			else if(input.shootDelaying<=0&&input.theOne.shootDelaying>0){
				state = this.controlState.stateAlert;
			}
			else {
				state=this;
			}
			
			if(state!=this){
				state.setInit();
			}
			
			return state;
		}
	
		//躲避同时射击
		this.stateHideShoot.changeState=function(input){
			let state=this;
			//死亡
			if(input.isdie==true){
				state = this.controlState.stateDead;
			}
			//警戒
			else if(input.canSeeTheOne==false){
				state = this.controlState.stateAlert;
			}
			//回避
			else if(input.canSeeTheOne==true&&this.fl.hpLow(this.ai.hp)>=0.5){
				state = this.controlState.stateAvoid;
			}
			else {
				state=this;
			}
			
			if(state!=this){
				state.setInit();
			}
			
			return state;
		}
		
		//巡逻
		this.statePatrol.changeState=function(input){
			let state=this;
			if(input.isdie==true){
				state = this.controlState.stateDead;
			}
			
			else if(input.canSeeTheOne==true){
				state = this.controlState.stateAlert;
			}
			
			else {
				state=this;
			}
			
			if(state!=this){
				state.setInit();
			}
			return state;
		}
		
		//直立射击
		this.stateStandShoot.changeState=function(input){
			let state=this;
			if(input.isdie==true){
				state = this.controlState.stateDead;
			}
			//警戒
			else if(input.canSeeTheOne==false){
				state = this.controlState.stateAlert;
			}
			//回避
			else if(input.canSeeTheOne==true&&this.fl.hpLow(this.ai.hp)>=0.5){
				state = this.controlState.stateAvoid;
			}
			else {
				state=this;
			}
			
			if(state!=this){
				state.setInit();
			}
			
			return state;
		}

		//刺杀
		this.stateKnife.changeState=function(input){
			//攻击意向的计算
			if(this.attackwillCDT<=0){
				this.attacktrue=(input.attackWill+Math.floor(Math.random()*100))>60;
				this.attackwillCDT=this.attackwillCD;
				
			}else{
				this.attackwillCDT--;
			}
			this.attacktrue=this.attacktrue||(input.attackWill+Math.floor(Math.random()*100))>60;
			let attacktrue=this.attacktrue;
			
			let state=this;
			if(input.isdie==true){
				state = this.controlState.stateDead;
			}
			//巡逻
			else if(input.canSeeTheOne==false&&this.findTimeT<=0&&isNaN(input.nextWalkX)){
					state = this.controlState.statePatrol;
			}
			else {
				state=this;
			}
			
			if(state!=this){
				state.setInit();
			}
			
			return state;
		}
	
		//
	}
	//设置当前状态
	setState(state){
		this.state=state;
	}
	//返回当前状态
	getState(){
		return this.state;
	}
	
	//根据输入和状态，得到下一状态
	changeState(Input){
		//根据状态转换延迟
		if(this.state.stateChangeCDT<=0){
			this.state.stateChangeCDT=this.state.stateChangeCD;
			this.setState(this.state.changeState(Input));
		}else {
			this.state.stateChangeCDT--;
		}
		
	}
	
	//根据输入和状态，进行寻路
	findWayAsState(input){
		this.state.findwayAsState(input);
	}
	
	//根据输入和状态，进行射击
	shootAsState(input){
		this.state.shootAsState(input);
	}
	
	//根据输入和状态，进行绘制
	renderRemindAsState(ctx){
		this.state.renderRemindAsState(ctx);
	}
	
	
}