/**
 * 场景类,SceneMenu类，Scene类的子类
 * @param {Object} win 浏览器window对象
 * 源:主要借鉴于向峰的<html5游戏编程核心技术与实战>,仅做学习用处
 * 外调用:John Resig http://ejohn.org/的Class.extend
 * 调用：renderObj.js
 * 被调用:win.SceneManager的
 * 注：未精简与父类相同的内容是为了容易阅读
 */

(function(win){
	//场景类
	var sceneMenu  =  Scene.extend({
		//初始化
		init:function(arg){
			arg.name = "menu";
			this._super(arg);
			let menu =this.createRObj("Menu",["Menu"]);
		},
	});	
	//记录scene编号到scene变量中
	sceneMenu.SID = 0;
	sceneMenu.ClassName = "SceneMenu";
	//注册scene类的构造函数到ClassFactory中
	ClassFactory.regClass(sceneMenu.ClassName,sceneMenu);
})(window)

