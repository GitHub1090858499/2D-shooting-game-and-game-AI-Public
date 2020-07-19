/**
 * 渲染对象类,RenderObj类的子类，主菜单类，与主游戏不同的scene层
 * 源:主要借鉴于向峰的<html5游戏编程核心技术与实战>,仅做学习用处
 * 调用:John Resig http://ejohn.org/的Class.extend
 * 被调用:win.Scene
 */

(function(){
	let Menu = RenderObj.extend({
		init:function(name){
			this._super(name);	
		},
		//被scene.js使用
		listenersON:function(cls){
			this.owner = cls;
			//按钮的起点				
			this.sc2=this.owner;
			this.h=this.sc2.h/10;
			this.w = this.h*3;
			this.bx1=this.sc2.w/2-this.w;
			this.by1=this.sc2.h*1/4;
			this.bx2=this.sc2.w/2-this.w;
			this.by2=this.sc2.h*2/4;
			let holder = this.owner.holder[0];
			holder.contentEditable=true;
			let thisClass = this;
			holder.addEventListener("click",function(event){
				let x = event.offsetX;
				let y = event.offsetY;		
				if(x>=thisClass.bx1&&x<=thisClass.bx1+thisClass.w&&
					y>=thisClass.by1&&y<=thisClass.by1+thisClass.h){
					thisClass.startButt();
					// alert("Start");
				} else if(x>=thisClass.bx2&&x<=thisClass.bx2+thisClass.w&&
					y>=thisClass.by2&&y<=thisClass.by2+thisClass.h){
					alert("未完成");
				}
						
			});
			holder.addEventListener("mousemove",function(event){
				holder.style.cursor = "default";
				let x = event.offsetX;
				let y = event.offsetY;		
				if(x>=thisClass.bx1&&x<=thisClass.bx1+thisClass.w&&
					y>=thisClass.by1&&y<=thisClass.by1+thisClass.h){
					holder.style.cursor = "pointer";
				}else if(x>=thisClass.bx2&&x<=thisClass.bx2+thisClass.w&&
					y>=thisClass.by2&&y<=thisClass.by2+thisClass.h){
					holder.style.cursor = "pointer";
				}
						
			});
		},
		update:function(){
			
		},
		render:function(ctx){	
			if(this.sc2==undefined)return;
			let size = this.h;
			//按钮
			ctx.fillStyle = "blue";
			ctx.fillRect(this.bx1, this.by1, this.w, this.h);
			ctx.fillRect(this.bx2, this.by2, this.w, this.h);
			//按钮字体
			ctx.fillStyle = "black";
			ctx.font = size*2/3+"px 微软雅黑";  
			ctx.textBaseline = "top";           
			ctx.textAlign = "start"; 
			ctx.fillText("Start",this.bx1+size/3,this.by1+size/5,this.w);
			ctx.fillText("About",this.bx2+size/2,this.by2+size/5,this.w);
			
		},
		//开始游戏按钮
		startButt:function(){
			let scM = this.owner.Manager;
			let game = scM.getScene("game");
			scM.bringToTop(game);
			game.restart();
		},
		
	});
	Menu.ClassName = "Menu";
	ClassFactory.regClass(Menu.ClassName,Menu);
})(window);