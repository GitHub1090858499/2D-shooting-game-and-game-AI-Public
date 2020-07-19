/**
 * 渲染对象类,RenderObj类的子类，障碍物类
 * 源:主要借鉴于向峰的<html5游戏编程核心技术与实战>,仅做学习用处
 * 调用:John Resig http://ejohn.org/的Class.extend
 * 被调用:win.Scene
 */

(function(){
	var block = RenderObj.extend({
		init:function(name,w,x,y){
			// console.log(arguments);
			// console.log(this._super);
			this._super(name);
			
			this.classN = "Block";
			this.moveTo(x,y);
			this.w = w;
			this.h = w;
			this.s  = this.w/15;
			// console.log(this);
			// console.log(this._super);
			this.color = "rgba(255, 255, 255, 1)";
			
		},
		update:function(){
			this._super();
			// this.();
			// console.log(this);
		},
		render:function(ctx){
			
			
			RenderFunction.drawBlock(ctx,this.x,this.y,this.w,this.s);
		},
		
	});
	
	block.ClassName = "Block";
	ClassFactory.regClass(block.ClassName,block);
	// console.log(new block());
})(window);