/**
 * 游戏的主体框架类,(说明在之后后完善)game类
 * @param {Object} win 浏览器window对象
 * 源:主要借鉴于向峰的<html5游戏编程核心技术与实战>,仅做学习用处
 * 外调用:John Resig http://ejohn.org/的Class.extend,gameFrames(帧数追踪),
 * 调用：sceneManager.js,events.js,gameFrames.js
 */
(function(win){
	var game = win.Game = Class.extend({
		//所有监听器的容器(字典类型或数组类型)
		listeners:[],
		//控制台显示
		showState:false,
		showFindway:false,
		showSearchway:false,
		showView:false,
		setBackG:false,
		setHHp:false,
		showNet:false,
		setNet:false,
		setteam:false,
		netupdata:false,
		nettrain:50,
		
		//添加监听器到容器
		addListener:function(ln){
			this.listeners.push(ln);
		},
		//删除容器内的所有监听器
		clearListeners:function(){
			this.listeners.length = 0;
		},
		//初始化游戏
		init:function(){
			this.paused = false ;
			//----场景管理类,里面的方法来自sceneManager.js
			this.sceneManager = new SceneManager();
			// 传输信息
			window.sendText=[];
			
		},
		//游戏主体循环
		loopGame:function(){
			
			//----监听器触发,里面的方法来自events.js
			let ltns = this.listeners;
			for(var i = 0; i<ltns.length;i++){
				ltns[i].enabled&&ltns[i].beforeRender();
			};
			
			//----scene渲染，来自sceneManager.js
			// let scene = this.sceneManager.getCurrentScene();
			// if(scene){
			// 	scene.update();
			// 	scene.render();
			// };
			
			let scenes = this.sceneManager.scenes;
			for(var i=0;i<scenes.length;i++){
				scenes[i].update();
				scenes[i].render();
			}
			
			//----监听器触发,里面的方法来自events.js
			for(var i = 0; i<ltns.length;i++){
				ltns[i].enabled&&ltns[i].afterRender();
			}
		},
		//游戏开始
		runGame:function(fps){
			//帧数
			fps = fps || 60 ;
			//保存本对象,以便进入新的对象可以操作
			let selfClass = this;
				//这个做法似乎可以保证spf有效的同时保证spf有对应1000/fps位数
				spf = (1000/fps)|0;
			
			//开始帧数追踪
			GameFrames.start(fps);		//----来自gameFrames.js
			//没spf秒执行一次,若selfClass.paused==false则执行selfClass.loopGame();
			self.timeInterval = setInterval(
				//帧数追踪更新				
				function(){
					GameFrames.update();  //----来自gameFrames.js
					if(!selfClass.paused){
						selfClass.loopGame();
					}
				},
				spf
			);
			console.log("runGame!");
		},
		//暂停游戏
		pauseGame:function(){
			this.paused = true;
		},
		//停止游戏
		stopGame:function(){
			//清除循环的计时器
			clearInterval(this.timeInterval);
		}
	});
})(window);