/**
 * 场景类,SceneGame类，Scene类的子类
 * @param {Object} win 浏览器window对象
 * 源:主要借鉴于向峰的<html5游戏编程核心技术与实战>,仅做学习用处
 * 外调用:John Resig http://ejohn.org/的Class.extend
 * 调用：renderObj.js
 * 被调用:win.SceneManager的
 * 注：未精简与父类相同的内容是为了容易阅读
 */

(function(win){
	//场景类
	var sceneGame  =  Scene.extend({
		//初始化
		init:function(arg){
			arg = arg||{};
			//场景名称
			this.name = "game";
			//位置信息
			this.x = arg.x||0;
			this.y = arg.y||0;
			this.w = arg.w||600;
			this.h = arg.h||400;
			this.color = arg.color||"white";
			//每个场景的容器holder
			this.holder = $("<div id = 'sc_"+this.name+"' style = 'position:relative;overflow:hidden;left:0px;top:0px'></div>");
			//场景绑定的canvas元素,精灵也在这个元素绘制
			this.cvs = $("<canvas id = 'cv_"+this.name+"' style = 'z-index:-1;position:absolute;left:0px;top:0px'> </canvas>");
			//获得第一个cvs的画板
			this.ctx = this.cvs[0].getContext('2d');
			this.setPos();
			this.setSize();
			this.setColor();
			this.cvs.css("border","1px solid red");
			//在holder容器内添加canvas
			this.holder.append(this.cvs);
			//在body添加holder
			$(arg.hod).append(this.holder);
			
			//引入renderObj.js的内容
			//监听器
			this.listeners = [];
			//保存renderObj对象，数组形式,真正使用于渲染和数据更新
			this.rObjs = [];
			//保存renderObj对象，字典形式，方便查找
			this.namedRObjs = {};			
			//游戏暂停标志
			this.ispause=false;
			//游戏结束标志
			this.isEnd = true;
			//剩余敌人计算
			this.enemyN=20;
			//菜单塑造
			this.topMenu();
			
			//人物的map坐标，对应this.map，mapFind的格式
			this.manx=null;
			this.many=null;
			
			//视野类
			this.view = new View(this);
			
			//地图数据化类，包含寻路功能
			this.mapFind = new MapFind(this);
		
			
			//消息插件，用于团队控制
			this.orderMess=new OrderMess();
			
			
			//神经网络
			this.neuraNet = new NeuraNet();
		},		
		//将像素xy装换成this.map对应的xy
		TMapXy:function(){
			try{
				let sw = this.mapFind.mapsizeW;
				let sh = this.mapFind.mapsizeH;
				this.manx = Math.floor(this.getObjByName("TheOne").x/sw);
				this.many = Math.floor(this.getObjByName("TheOne").y/sh);
			}catch(e){
				// console.log("TMapXy TheOne Erro！");
			}
		},
		//地图方块划分（标准）
		mapAnalyse:function(){
			let sw = this.mapsizeW;
			let sh = this.mapsizeH;
			let swN = Math.floor(this.w/sw);
			let shN = Math.floor(this.h/sh);
			//初始化地图数组
			for(var x=0;x<shN;x++){
			      for(var y=0;y<swN;y++){
			           this.map[x][y]=0;          
			      }
			}
			
			//遍历robj,改变map
			for( var i = 0;i<this.rObjs.length;i++){
				let rO = this.rObjs[i];
				let rOx = Math.floor(rO.x/sw);
				let rOy = Math.floor(rO.y/sh);
				switch(this.rObjs[i].classN){
					case "Block":
						for(var j=0;j<rO.h/sh*rO.w/sw;j++){
							this.map[rOy+Math.floor(j/(rO.h/sh))][rOx+j%(rO.h/sh)]=1;
						}	
						break;
					case "Man":
						this.map[rOy][rOx]=2;
						this.map[rOy-1][rOx]=2;
						this.map[rOy+1][rOx]=2;
						this.map[rOy][rOx-1]=2;
						this.map[rOy][rOx+1]=2;
						break;
					case "BadMan":
						this.map[rOy][rOx]=3;
						this.map[rOy-1][rOx]=3;
						this.map[rOy+1][rOx]=3;
						this.map[rOy][rOx-1]=3;
						this.map[rOy][rOx+1]=3;
						break;
					case "Bullet":
						this.map[rOy][rOx]=4;
						break;
					default:
				}
			}
		},
		//设置holder容器的位置
		setPos:function(x,y){
			this.x = x||this.x;
			this.y = y||this.y;
			this.holder.css("left",this.x).css("top",this.y);
		},
		//设置holder容器和canvas的大小
		setSize:function(w,h){
			this.w = w||this.w;
			this.h = h||this.h;
			this.holder.css("width",this.w).css("height",this.h);
			this.cvs.attr("width",this.w).attr("height",this.h);
			
		},
		//设置holder容器的背景颜色
		setColor:function(color){
			this.color = color||this.color;
			this.holder.css("background-color",this.color);
		},
		//擦除这个cvs
		clear:function(){
			// console.log(this);
			this.ctx.clearRect(0,0,this.w,this.h);
					
		},
		//设置holder的display为显示
		show:function(){
			this.holder.show();
		},
		//设置holder的display为隐藏
		hide:function(){
			this.holder.hide();
		},
		//holder缓慢隐藏,fn为回调函数,time为时间
		fadeOut:function(time,fn){
			this.holder.fadeOut(time,fn);
		},
		//holder缓慢显示,fn为回调函数,time为时间
		fadeIn:function(time,fn){
			this.holder.fadeIn(time,fn);
		},
		//从Dom中删除canvas和holder元素
		clean:function(){
			this.cvs.remove();
			this.holder.remove();
			this.cvs = this.holder = this.ctx = null;
		},
		//碰撞处理函数
		//crashMain，遍历的rObj对象之一
		crashDeal:function(crashMain){
			//防止this.crash[crashMain.name]的异常
			this.crash[crashMain.name]=this.crash[crashMain.name]||[];
			//以下过程进行碰撞的处理，必须add碰撞监听器listenerCrash.js，否则出错
			let OneCArr = this.crash[crashMain.name];
			if(OneCArr.length>0){
				console.log(crashMain.name+"与"+OneCArr +"碰撞了");
				for( var j = 0 ;j<OneCArr.length;j++){
					//crashMain在scene外的判断与处理
					if(OneCArr[j] == "outOfScene"){
						if(crashMain.classN=="Bullet"){
							crashMain.canRemove = true;
						}else {
							crashMain.x = crashMain.lx;
							crashMain.y = crashMain.ly;
						}
					}
					else {
						let crashBe = this.namedRObjs[OneCArr[j]];
						//Bullet与Block的情况
						if(crashMain.classN=="Bullet" && crashBe.classN == "Block"){
							crashMain.canRemove = true;	
						
						}else 
						//Bullet与BadMan的情况
						if(crashMain.classN=="Bullet" && crashBe.classN == "BadMan"){
							if(crashBe.isdie==false && crashMain.shooter != crashBe.name)
								crashMain.canRemove = true;	
						}else 
						//Bullet与Man的情况
						if(crashMain.classN=="Bullet" && crashBe.classN == "Man"){
							if(crashBe.isdie==false && crashMain.shooter != crashBe.name){
								crashMain.canRemove = true;	
								//记录射击成功,输入缩小100倍
								let s=300;
								// let t={"tx":[-1,crashMain.L,crashMain.H,crashMain.speed,crashMain.Vx,crashMain.Vy],"ty1":crashBe.x-crashMain.fx,"ty2":crashBe.y-crashMain.fy}
								
								// let baol=10000;
								// let tl=Math.floor(crashMain.L/s*baol)/baol;
								// let th=Math.floor(crashMain.H/s*baol)/baol;
								// let ts=Math.floor(crashMain.speed/s*baol)/baol;
								// let tx=Math.floor(crashMain.Vx/s*baol)/baol;
								// let ty=Math.floor(crashMain.Vy/s*baol)/baol;
								// let tfx=Math.floor(crashBe.x-crashMain.fx*baol)/baol;
								// let tfy=Math.floor(crashBe.y-crashMain.fy*baol)/baol;
								// let t={"tx":[-1,tl,th,ts,tx,ty],"ty1":tfx,"ty2":tfy};
								
								let t={"tx":[-1,crashMain.L/s,crashMain.H/s,crashMain.speed/s,crashMain.Vx/s,crashMain.Vy/s],"ty1":crashBe.x-crashMain.fx,"ty2":crashBe.y-crashMain.fy}
								
								
								this.neuraNet.addTeach(t);
							
							}
							
						}else
						//Man与Block的情况
						if(crashMain.classN=="Man" && crashBe.classN == "Block"){
							crashMain.x = crashMain.lx;
							crashMain.y = crashMain.ly;
							// crashMain.dx = 0;
							// crashMain.dy = 0;
							// crashMain.vy = 0;
							// crashMain.vx = 0;
						
						}else 
						//Man与Bullet的情况	
						if(crashMain.classN=="Man" && crashBe.classN == "Bullet"){
							if(crashMain.name != crashBe.shooter && crashMain.isdie==false){
								//随机损失血量
								crashMain.hp=crashMain.hp-(20+Math.floor(Math.random()*10)+1);
							}
						
						}else 
						//Man与BadMan的情况
						if(crashMain.classN=="Man" && crashBe.classN == "BadMan"){
							if(crashMain.isdie==false)
								crashMain.hp=0;
							// crashMain.x = crashMain.lx;
							// crashMain.y = crashMain.ly;
							// crashMain.dx = 0;
							// crashMain.dy = 0;
							// crashMain.vy = 0;
							// crashMain.vx = 0;
						
						}else 
						//BadMan与Man的情况
						if(crashMain.classN=="BadMan" && crashBe.classN == "Man"){
							// crashMain.x = crashMain.lx;
							// crashMain.y = crashMain.ly;
							// crashMain.dx = 0;
							// crashMain.dy = 0;
							// crashMain.vy = 0;
							// crashMain.vx = 0;
						}else 
						//BadMan与Block的情况
						if(crashMain.classN=="BadMan" && crashBe.classN == "Block"){
							crashMain.x = crashMain.lx;
							crashMain.y = crashMain.ly;
							// crashMain.dx = 0;
							// crashMain.dy = 0;
							// crashMain.vy = 0;
							// crashMain.vx = 0;
						
						}else 
						//BadMan与Bullet的情况
						if(crashMain.classN=="BadMan" && crashBe.classN == "Bullet"){
							if(crashMain.name != crashBe.shooter && crashMain.isdie==false){
								crashMain.hp=crashMain.hp-(40+Math.floor(Math.random()*10)+1);
							}
						
						}else 
						//BadMan与BadMan的情况
						if(crashMain.classN=="BadMan" && crashBe.classN == "BadMan"){
							crashMain.x = crashMain.lx;
							crashMain.y = crashMain.ly;
							// crashMain.dx = 0;
							// crashMain.dy = 0;
							// crashMain.vy = 0;
							// crashMain.vx = 0;
						
						}
					}
			
				}
				
				// alert(crashMain.name+"与"+this.crash[crashMain.name] +"碰撞了");
			//记录本帧的位置x,y做为下一帧的的上一帧位置
			}else {
				crashMain.lx = crashMain.x;
				crashMain.ly = crashMain.y;
			}
			
		},
		//更新场景 ----引入renderObj.js后完善
		update:function(){
			
			
			
			//暂停则停更新
			if(this.ispause||this.isEnd)return;
			
			//死亡后的动作
			if(!this.getObjByName("TheOne").isVisable){
				this.endScene(false);
			}
			
			
			// 神经网络更新
			$("#netupdata>p").text("目前的训练集个数："+this.neuraNet.TT.length);
			if(this.neuraNet.TT.length>=window.thegame.nettrain&&window.thegame.netupdata==true){
				this.neuraNet.teach3();
				this.neuraNet.TTn.push(this.neuraNet.TT);
				this.neuraNet.TT.length=0;
			}
			
			
			
			//剩余敌人
			this.enemyN = 0;
			
			//更新前的监听器执行
			var ltns = this.listeners;
			for(var i = 0;i<ltns.length;i++){
				//内含碰撞监听器listenerCrash.js,此操作会修改this.crash
				ltns[i].enabled&&ltns[i].beforeUpdate(this);
			};
			//更新过程，遍历rObjs
			for( var i=this.rObjs.length-1;i>=0;i--){
				if(this.crash!=undefined)
				//碰撞处理
				this.crashDeal(this.rObjs[i]);
				//执行obj自身的update
				this.rObjs[i].update();
				this.rObjs[i].classN =="BadMan"&&this.enemyN++;
				
			};
			//心理描绘
			if(window.sendText&&window.sendText.length>0&&$("#mind>textarea")){
				let texts="";
				for(let i= window.sendText.length-1;i>=0;i--){
					
					texts+=" \n "+window.sendText[i].name +":" + window.sendText[i].action + ":"+window.sendText[i].C;
				}
				$("#mind>textarea").text(texts);
			}
			
			
			
			
			
			//胜利后的操作。因为js是单线程运行的，所以很多这种情况的都可以这样判断，而不理会开局时也满足这样的条件（敌人人数为0）
			if(this.enemyN==0&&this.isEnd==false){
				this.endScene(true);
			}
			this.removeAllCanRemove();
			//更新后的监听器执行
			for(var i = 0;i<ltns.length;i++){
				ltns[i].enabled&&ltns[i].afterUpdate(this);
			};
			//map地图更新
			this.mapFind.mapAnalyse();
				
			//排序rObjs
			this.sortRobjs();
			
			//修改主人物的Map坐标，以便ai使用，游戏结束后依然在运行中
			this.TMapXy();
			
			//
		},
		//按robj的x，y位置排序rObjs，此步与渲染顺序有关
		sortRobjs:function(){
			this.rObjs.sort(function(aa,bb){
				let aC=aa.classN , bC=bb.classN;
				let first=aa , second = bb,rt = 1;	
				//子弹排在最后
				if(aC=="Bullet"&&bC=="Bullet")return 0
				else if(aC=="Bullet")return 1;
				else if(bC=="Bullet")return -1;
				else 
				//"Block"与"Block"
				if(aC=="Block"&&bC=="Block"){
					if(first.y<second.y)return -1;
					else if(first.y==second.y){
						if(first.x<second.x)return -1;
						else if(first.x==second.x)return 0;
						else return 1;
					}
					else return 1;
				}
				else 
				//"Block"与Man或BadMan
				if(aC=="Block"||bC=="Block"){
					if(bC=="Block"){
						first=bb;
						second=aa;
						rt = -1;
					}	
					if(first.y+first.s>second.y+second.r)return rt;
					else if(first.y+first.s<second.y+second.r && first.y+first.h+first.s>second.y+second.r){
						if(first.x+first.s>second.x+second.r)return rt;
						else if(first.x+first.s+first.w<second.x)return -rt;
						else return 0;
					}
					else if(first.y+first.s+first.h<second.y-second.r)return -rt;
					else return 0;
				}else 
				//Man与BadMan
				if((aC=="Man"||aC=="BadMan")&&(bC=="Man"||bC=="BadMan")){
					if(first.y<second.y)return -1;
					else if(first.y>second.y)return 1;
					else if(first.x<second.x)return -1;
					else if(first.x>second.y)return 1;
					else return 0;
				};	
			})
		},
		//进行渲染 ----引入renderObj.js后完善
		render:function(){
			//暂停则停更新
			if(this.ispause||this.isEnd)return;
			//设置渲染前的监听器
			var ltns = this.listeners;
			for(var i = 0;i<ltns.length;i++){
				ltns[i].enabled&&ltns[i].beforeRender(this);
			};
			
			//清除画板
			this.clear();
			//渲染所有renderObj
			this.renderRObj();
			//设置渲染后的监听器
			for(var i =0 ; i<ltns.length;i++){
				ltns[i].enabled&&ltns[i].afterRender();
			};
			
		},
		//设置背景,自定义格式
		setBG0:function(){
			//未有想法
		},
		
		//-----引入renderObj.js
		//创建renderObj,以工厂形式创建
		createRObj:function(className,arg){
			className = className||"RenderObj";
			var obj = ClassFactory.newInstance(className,arg);
			this.addRObj(obj);
			//需要this传入，以触发按键、鼠标监听器
			obj.listenersON&&obj.listenersON(this);
			return obj;
		},
		//添加renderObj到rObjs和namedRObjs
		addRObj:function(obj){
			if(!this.namedRObjs[obj.name]){
				obj.owner = this;
				this.rObjs.push(obj);
				this.namedRObjs[obj.name] = obj;
			}
		},
		//根据名称来获得renderObj
		getObjByName:function(name){
			return this.namedRObjs[name];
		},
		//如果可移除则删除rObjs，namedRObjs中指定对象
		removeRObj:function(renderObj){
			if(renderObj.canRemove){
				delete this.namedRObjs[renderObj.name];
				var index = this.rObjs.indexOf(sc);
				if (index > -1) { 
				this.rObjs.splice(index, 1); 
				};
			}
		},
		//设置renderObj对象可移除标志
		setRemoveRObjByName:function(name){
			this.namedRObjs[name]&&(this.namedRObjs[name].canRemove=true||true);
		},
		//移除rObjs，namedRObjs中所有可以移除的renderObj对象
		removeAllCanRemove:function(){
			for(var ii = 0; ii<this.rObjs.length;ii++){				
				var o = this.rObjs[ii];
				if(o.canRemove == true){
				 this.rObjs.splice(ii,1);	
				 delete this.namedRObjs[o.name];
				};
			};
			// if(this.rObjs.length != Object.keys(this.namedRObjs).length)
			// console.log("ERROR");
		},
		//清空namedRObjs，rObjs
		clearRObj:function(){
			this.rObjs = [];
			this.namedRObjs = {};
		},
		//添加监听器
		addListener:function(ln){
			this.listeners.push(ln);
		},
		//清空监听器
		clearListeners:function(){
			this.listeners.length = 0;
		},
		//渲染所有在rObjs中的renderObj
		renderRObj:function(){
			for(var i = 0 , len = this.rObjs.length ; i<len;i++){
				this.ctx.save();
				this.rObjs[i].isVisable&&this.rObjs[i].render(this.ctx);
				this.ctx.restore();
			};
		},
		//重新加载游戏地图
		startGame:function(){
			
			let sc=this;
			//碰撞检测监听器
			sc.addListener(
				new ListenerCrash({
					"rObjs":sc.rObjs,
					"w":sc.w,
					"h":sc.h,
					})
			);
			
			
			if(Game.setBackG){
				let objMan= sc.createRObj("Man",["TheOne",300,300]);
				let objBadMan1= sc.createRObj("BadMan",["BadMan1",500,50]);
				
				let objBlock4 = sc.createRObj("Block",["Block4",70,310,140]);
			}else {
				
				//创建Man新人物
				let objMan= sc.createRObj("Man",["TheOne",300,300]);
				
				//创建Block
				let objBlock1 = sc.createRObj("Block",["Block1",70,100,140]);
				let objBlock2 = sc.createRObj("Block",["Block2",70,170,140]);
				let objBlock3 = sc.createRObj("Block",["Block3",70,240,140]);
				let objBlock4 = sc.createRObj("Block",["Block4",70,310,140]);
				let objBlock5 = sc.createRObj("Block",["Block5",70,380,140]);
				let objBlock6 = sc.createRObj("Block",["Block6",70,380,210]);
				let objBlock7 = sc.createRObj("Block",["Block7",70,380,280]);
				let objBlock8 = sc.createRObj("Block",["Block8",70,530,140]);
				let objBlock9 = sc.createRObj("Block",["Block9",70,530,210]);
				let objBlock10 = sc.createRObj("Block",["Block10",70,530,280]);
				
				
				let objBlock11 = sc.createRObj("Block",["Block11",70,130,300]);
				let objBlock12 = sc.createRObj("Block",["Block12",70,0,40]);
				let objBlock13 = sc.createRObj("Block",["Block13",70,0,230]);
				
				let objBlock14 = sc.createRObj("Block",["Block14",70,170,0]);
				let objBlock15 = sc.createRObj("Block",["Block15",70,350,0]);
				
				
				
				//创建BadMan1
				let objBadMan1= sc.createRObj("BadMan",["BadMan1",500,50]);		
				let objBadMan2= sc.createRObj("BadMan",["BadMan2",290,30,0,true]);
				let objBadMan3= sc.createRObj("BadMan",["BadMan3",20,20]);
					
				let objBadMan4= sc.createRObj("BadMan",["BadMan4",380,100]);	
				let objBadMan5= sc.createRObj("BadMan",["BadMan5",180,100]);
				let objBadMan6= sc.createRObj("BadMan",["BadMan6",560,100]);
				let objBadMan7= sc.createRObj("BadMan",["BadMan7",30,160]);
				// this.orderMess=new OrderMess();
			}
			
			
		
			// let dx = $("#dx"),vx = $("#vx"),dy = $("#dy"),vy = $("#vy");
			// let left = $("#left"),locoal = $("#locoal");
			//被objMan引用的信息数据显示监听器
			// objMan.addListener(
			// 	new ListenerEmpty({
			// 		"beforeRender":function(){
			// 			dx.text(objMan.dx);
			// 			vx.text(objMan.vx);
			// 			dy.text(objMan.dy);
			// 			vy.text(objMan.vy);
			// 			left.text(objMan.other);
			// 			locoal.text("x:"+objMan.x+ " y:"+objMan.y);
			// 		}
			// 	})
			;
			// );
			// //创建Man新人物
			// let objMan= sc.createRObj("Man",["TheOne",400,300]);
			
			// //创建Block
			// let objBlock1 = sc.createRObj("Block",["Block1",70,100,100]);
			// let objBlock2 = sc.createRObj("Block",["Block2",70,170,100]);
			// let objBlock3 = sc.createRObj("Block",["Block3",70,240,100]);
			// let objBlock4 = sc.createRObj("Block",["Block4",70,310,100]);
			// let objBlock5 = sc.createRObj("Block",["Block5",70,100,170]);
			// let objBlock6 = sc.createRObj("Block",["Block6",70,170,0]);
			// let objBlock7 = sc.createRObj("Block",["Block7",70,310,0]);
			
			// let objBlock8 = sc.createRObj("Block",["Block8",70,240,290]);
			// let objBlock9 = sc.createRObj("Block",["Block9",70,310,290]);
			// let objBlock10 = sc.createRObj("Block",["Block10",70,240,190]);
			
			// let objBlock11 = sc.createRObj("Block",["Block11",70,450,250]);
			// let objBlock12 = sc.createRObj("Block",["Block12",70,450,80]);
			
			// let objBlock13 = sc.createRObj("Block",["Block13",70,0,200]);
			// //创建BadMan1
			// let objBadMan= sc.createRObj("BadMan",["BadMan1",500,50]);		
			
			// objBadMan.addListener(
			// 	new ListenerEmpty({
			// 		"beforeRender":function(){
			// 			dx.text(objBadMan.dx);
			// 			vx.text(objBadMan.vx);
			// 			dy.text(objBadMan.dy);
			// 			vy.text(objBadMan.vy);
			// 			// left.text(objMan.other);
			// 			locoal.text("x:"+objBadMan.x+ " y:"+objBadMan.y);
			// 		}
			// 	})
			// );
			// objBadMan.shoot(180);
			
			//创建Man新人物
			// let objMan= sc.createRObj("Man",["TheOne",300,300]);
			
			//创建Block
			// let objBlock1 = sc.createRObj("Block",["Block1",70,100,140]);
			// let objBlock2 = sc.createRObj("Block",["Block2",70,170,140]);
			// let objBlock3 = sc.createRObj("Block",["Block3",70,240,140]);
			// let objBlock4 = sc.createRObj("Block",["Block4",70,310,140]);
			// let objBlock5 = sc.createRObj("Block",["Block5",70,380,140]);
			// let objBlock6 = sc.createRObj("Block",["Block6",70,380,210]);
			// let objBlock7 = sc.createRObj("Block",["Block7",70,380,280]);
			// let objBlock8 = sc.createRObj("Block",["Block8",70,530,140]);
			// let objBlock9 = sc.createRObj("Block",["Block9",70,530,210]);
			// let objBlock10 = sc.createRObj("Block",["Block10",70,530,280]);
			
			
			// let objBlock11 = sc.createRObj("Block",["Block11",70,130,300]);
			// let objBlock12 = sc.createRObj("Block",["Block12",70,0,40]);
			// let objBlock13 = sc.createRObj("Block",["Block13",70,0,230]);
			
			// let objBlock14 = sc.createRObj("Block",["Block14",70,170,0]);
			// let objBlock15 = sc.createRObj("Block",["Block15",70,350,0]);
			
			
			
			//创建BadMan1
			// let objBadMan1= sc.createRObj("BadMan",["BadMan1",500,50]);		
			// let objBadMan2= sc.createRObj("BadMan",["BadMan2",290,30,0,true]);
			// let objBadMan3= sc.createRObj("BadMan",["BadMan3",20,20]);
				
			// let objBadMan4= sc.createRObj("BadMan",["BadMan4",380,100]);	
			// let objBadMan5= sc.createRObj("BadMan",["BadMan5",180,100]);
			// let objBadMan6= sc.createRObj("BadMan",["BadMan6",560,100]);
			// let objBadMan7= sc.createRObj("BadMan",["BadMan7",30,160]);
			// objBadMan1.addListener(
			// 	new ListenerEmpty({
			// 		"beforeRender":function(){
			// 			dx.text(objBadMan1.dx);
			// 			vx.text(objBadMan1.vx);
			// 			dy.text(objBadMan1.dy);
			// 			vy.text(objBadMan1.vy);
			// 			// left.text(objMan.other);
			// 			locoal.text("x:"+objBadMan1.x+ " y:"+objBadMan1.y);
			// 		}
			// 	})
			// );
			
			
			// this.orderMess=new OrderMess();
			this.orderMess.underO={};
			this.orderMess.mess={};
			this.isEnd=false;
			this.ispause=false;
		},
		//游戏的菜单
		topMenu:function(){
			//cvs设置
			let cvs = this.cvs;
			cvs.css("position","relative");
			//div设置
			let holder = this.holder;	
			//按钮的高
			let buttonHeight = 30;
			//div的高改变
			let divH = holder.css("height");
			divH=divH.substring(0,divH.length-2);
			divH=parseInt(divH)+buttonHeight+2;
			holder.css("height",divH+"px");
			holder.css("width",this.w+2+"px");
			// alert(parseInt(divH)+buttonHeight);
			//添加按钮
			let button1 = $('<button id="gameScene_buttom1" style="position:relative">暂停</button>');
			button1.css("height",buttonHeight+"px");
			cvs.before(button1);
			let button2 = $('<button id="gameScene_buttom2" style="position:relative">运行</button>');
			button2.css("height",buttonHeight+"px");
			cvs.before(button2);
			let button3 = $('<button id="gameScene_buttom3" style="position:relative">菜单</button>');
			button3.css("height",buttonHeight+"px");
			cvs.before(button3);
			let button4 = $('<button id="gameScene_buttom3" style="position:relative">重新开始游戏</button>');
			button4.css("height",buttonHeight+"px");
			cvs.before(button4);
			// let button5 = $('<button id="gameScene_buttom3" style="position:relative">停止游戏</button>');
			// button5.css("height",buttonHeight+"px");
			// cvs.before(button5);
			
			let thisClass=this;
			//添加监听器
			button1.click(function(){
				thisClass.pause();
				// alert("ss");
			});
			button2.click(function(){
				thisClass.start();
			});
			button3.click(function(){
				thisClass.menu();
			});
			button4.click(function(){
				thisClass.restart();
			});
			// button5.click(function(){
			// 	thisClass.stopGame();
			// });
		},
		//胜利或失败的换scene操作
		endScene:function(pp){
			this.stopGame();
			let scM = this.Manager;
			if(scM.getIdx(scM.getScene("end"))==scM.scenes.length-1)return;			let sc = scM.getScene("game");
			scM.bringToTop(sc);
			sc = scM.getScene("end");
			sc.win=pp;
			sc.hide();
			scM.bringToTop(sc);
			sc.fadeIn(5000);
		},
		//暂停游戏
		pause:function(){
			this.ispause = true;
			this.cvs.css("cursor","default");
		},
		//运行游戏
		start:function(){
			this.ispause = false;
			this.cvs.css("cursor","none");
		},
		//回到菜单
		menu:function(){
			this.stopGame();	
			let scM = this.Manager;
			let menu = scM.getScene("menu");
			scM.bringToTop(menu);
		},
		
		//重新开始游戏
		restart:function(){
			this.stopGame();	
			this.startGame();
		},
		//停止游戏
		stopGame:function(){
			this.isEnd =true;
			this.cvs.css("cursor","default");
			let Man = this.getObjByName("TheOne");
			//清除监听器
			if(Man)Man.listenersClose();
			//清除Robj
			this.clearRObj();
			
			// this.cvs.css("cursor","default");
			
		},
	
	});
	//记录scene编号到scene变量中
	sceneGame.SID = 0;
	sceneGame.ClassName = "SceneGame";
	//注册scene类的构造函数到ClassFactory中
	ClassFactory.regClass(sceneGame.ClassName,sceneGame);
})(window)

