/**
 * 场景类,Scene类
 * @param {Object} win 浏览器window对象
 * 源:主要借鉴于向峰的<html5游戏编程核心技术与实战>,仅做学习用处
 * 外调用:John Resig http://ejohn.org/的Class.extend
 * 调用：renderObj.js
 * 被调用:win.SceneManager的
 */

(function(win){
	//场景类
	var scene = win.Scene =  Class.extend({
		//初始化
		init:function(arg){
			arg = arg||{};
			//场景名称
			this.name = arg.name||("Unnamed"+(++scene.SID))
			//位置信息
			this.x = arg.x||0;
			this.y = arg.y||0;
			this.w = arg.w||320;
			this.h = arg.h||200;
			this.color = arg.color||"black";
			//每个场景的容器holder
			this.holder = $("<div id = 'sc_"+this.name+"' style = 'position:relative;overflow:hidden;left:0px;top:0px'></div>");
			//场景绑定的canvas元素,精灵也在这个元素绘制
			this.cvs = $("<canvas id = 'cv_"+this.name+"' style = 'z-index:-1;position:absolute;left:0px;top:0px'> </canvas>");
			this.cvs.css("border","1px solid red");
			//获得第一个cvs的画板
			this.ctx = this.cvs[0].getContext('2d');
			this.setPos();
			this.setSize();
			this.holder.css("width",this.w+2).css("height",this.h+2);
			this.setColor();
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
		//设置背景,imgUrl:图片url地址,pattern:0居中,1拉伸,2平铺
		setBGImg:function(imgUrl,pattern){
			this.holder.css("background-image","url("+imgUrl+")");
			switch(pattern){
				case 0:
					this.holder.css("background-repeat","no-repeat");
					this.holder.css("background-position","center");
					break;
				case 1:
					this.holder.css("background-size",this.w+"px "+this.h+"px");
					break;
			}
		},
		//从Dom中删除canvas和holder元素
		clean:function(){
			this.cvs.remove();
			this.holder.remove();
			this.cvs = this.holder = this.ctx = null;
		},
		//更新场景 ----引入renderObj.js后完善
		update:function(){
			
			//更新前的监听器执行
			var ltns = this.listeners;
			for(var i = 0;i<ltns.length;i++){
				//内含碰撞监听器listenerCrash.js,此操作会修改this.crash
				ltns[i].enabled&&ltns[i].beforeUpdate(this);
			};
			//更新过程，遍历rObjs
			for( var i=this.rObjs.length-1;i>=0;i--){
				//执行obj自身的update
				this.rObjs[i].update();
			};
			this.removeAllCanRemove();
			//更新后的监听器执行
			for(var i = 0;i<ltns.length;i++){
				ltns[i].enabled&&ltns[i].afterUpdate(this);
			};
				
			
		},
		//进行渲染 ----引入renderObj.js后完善
		render:function(){
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
			
		},
		
		//-----引入renderObj.js
		
		//创建renderObj,以工厂形式创建
		createRObj:function(className,arg){
			className = className||"RenderObj";
			var obj = ClassFactory.newInstance(className,arg);
			//需要this传入，以触发按键、鼠标监听器
			obj.listenersON&&obj.listenersON(this);
			this.addRObj(obj);
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
	});
	//记录scene编号到scene变量中
	scene.SID = 0;
	scene.ClassName = "Scene";
	//注册scene类的构造函数到ClassFactory中
	ClassFactory.regClass(scene.ClassName,scene);
})(window)

