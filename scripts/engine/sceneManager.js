/**
 * 场景管理类,SceneManager类
 * 源:主要借鉴于向峰的<html5游戏编程核心技术与实战>,仅做学习用处
 * 外调用:John Resig http://ejohn.org/的Class.extend
 * 调用：scene.js
 * 被调用:win.game使用
 */

(function(win){
	//场景管理类，Scene的管理
	var sceneManager = win.SceneManager = Class.extend({
		init:function(param){
			//用于保存场景scene,以字典的方式
			this.namedScenes = {};
			//用于保存场景scene,以栈的方式
			this.scenes = [];
			
		},
		//根据名称从namedScenes获取scene
		getScene:function(name){
			return this.namedScenes[name];
		},
		//创建新的scene，通过类名（字符串）和参数（数组类型,由ClassFactiry规定）创建，
		createScene:function(sceneClass,args){
			let sc = null;
			//只有一个参数，默认为新建的类为"Scene"
			if(arguments.length ==1){
				if(typeof arguments[0]=="string")
				sc = ClassFactory.newInstance(arguments[0],[]);
				else
				sc = ClassFactory.newInstance("Scene",arguments[0]);
				
			}
			//有两个参数
			else{
				sceneClass = sceneClass||"Scene";
				sc = ClassFactory.newInstance(sceneClass,args);
			}
			//保存到栈scenes
			this.push(sc);
			return sc;
		},
		//按scenes排序其在holder的上下顺序
		sortSceneIdx:function(){
			for(var i =0 ;i<this.scenes.length;i++){
				let sc = this.scenes[i];
				sc.holder.css("z-index",i);
			};
		},
		//将scene压入到scenes和namedScenes
		push:function(scene){
			if(!this.getScene(scene.name)){
				this.scenes.push(scene);
				this.namedScenes[scene.name] = scene;
				this.sortSceneIdx();
				scene.Manager = this;
			}else console.log("创建scene时在sceneManager遇到重复的scene.name，无法导入");
		},
		//从Dom和namedScenes、scenes中移除最顶部的scene
		pop:function(){
			let sc = this.scenes.pop();
			if(sc!=null){
				sc.clean();
				delete this.namedScenes[sc.name];
				this.sortSceneIdx();
			}
		},
		//按名字删除scene
		remove:function(name){
			let sc = this.getScene(name);
			if(sc!=null){
				sc.clean();
				delete this.namedScenes[sc.name];
				let index = this.scenes.indexOf(sc); 
				if (index > -1) { 
				this.scenes.splice(index, 1); 
				}
			}
		},
		//获得scene的索引，从holder的css中获得其索引
		getIdx:function(scene){
			return scene.holder.css("z-index");
		},
		//交换scenes中的位置，并更新scenes对应的holder层叠关系
		swap:function(fro,to){
			let ifInRange = fro>=0&&fro<=this.scenes.length-1&&to>=0&&to<=this.scenes.length-1;
			if(ifInRange){
				let sc = this.scenes[fro];
				this.scenes[fro] = this.scenes[to];
				this.scenes[to] = sc;
				this.sortSceneIdx();
			};
		},
		//将scene带到scenes的末尾，并更新所有css的z-index
		bringToTop:function(scene){
			let idx = this.getIdx(scene);
			if(idx != this.scenes.length-1){
				this.scenes.splice(idx,1);
				// this.scenes[this.scenes.length -1] = scene;
				this.scenes.push(scene);
				this.sortSceneIdx();
			};
			for(let ss of this.scenes){
				//设置隐藏
				if(ss!=scene){
					ss.holder.hide();
				}else{
				//设置可见
					ss.holder.show();
				}
			}
		},
		//将scene带到scenes的最前面，并更新所有css的z-index
		bringToLast:function(scene){
			let idx = this.getIdx(scene);
			if(idx != 0){
				this.scenes.splice(idx,1);
				this.scenes.splice(0,0,scene);
				this.sortSceneIdx();
			}
		},
		//将scene在scenes内的顺序提前，即在z-index中后移
		backWord:function(scene){
			let idx = this.getIdx(scene);
			if(idx > 0){
				this.swap(idx,idx-1);
			}
		},
		//将scene在scenes内的顺序后移，即在z-index中提前
		forword:function(scene){
			let idx = this.getIdx(scene);
			if(idx < this.scenes.length){
				this.swap(idx,idx+1);
			}
		},
		//获取在scenes中最后的场景，即z-index的顶部场景
		getCurrentScene:function(){
			return this.scenes[this.scenes.length-1];
		},
		//清除所有
		clearAll:function(){
			for( var i in this.scenes){
				this.scenes[i].clean();
			}
			this.namedScenes = {};
			this.scenes = [];
		},
	});
	
})(window)