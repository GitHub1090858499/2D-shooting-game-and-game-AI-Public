/**
 * 渲染对象类,RenderObj类的子类，结束场景类，与主游戏不同的scene层
 * 源:主要借鉴于向峰的<html5游戏编程核心技术与实战>,仅做学习用处
 * 调用:John Resig http://ejohn.org/的Class.extend
 * 被调用:win.Scene
 */

(function(){
	let endGame = RenderObj.extend({
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
			this.bx1=this.sc2.w/4;
			this.by1=this.sc2.h*2/3;
			this.bx2=this.sc2.w*3/4-this.w ;
			this.by2=this.sc2.h*2/3
			let holder = this.owner.holder[0];
			holder.contentEditable=true;
			let thisClass = this;
			holder.addEventListener("click",function(event){
	
				let x = event.offsetX;
				let y = event.offsetY;		
				if(x>=thisClass.bx1&&x<=thisClass.bx1+thisClass.w&&
					y>=thisClass.by1&&y<=thisClass.by1+thisClass.h){
					thisClass.startButt();
					// alert("Restart");
				} else if(x>=thisClass.bx2&&x<=thisClass.bx2+thisClass.w&&
					y>=thisClass.by2&&y<=thisClass.by2+thisClass.h){
					thisClass.MenuButt();
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
			let text="?????!!!";
			if(this.sc2.win==false){
				text ="You were Dead !";
				this.sc2.holder.css("background-color","rgba(255, 1, 1, 0.5)")
			}
			else {
				text ="You survived !";
				this.sc2.holder.css("background-color","rgba(1, 1, 1, 0.2)")
			}
			let size = this.h;
			ctx.fillStyle = "black";               //设置填充颜色为紫色
			ctx.font = size+"px 微软雅黑";   		//设置字体     
			ctx.textBaseline = "bottom";            //设置字体底线对齐绘制基线
			ctx.textAlign = "center";    		 //设置字左右体对齐的方式
			ctx.fillText( text, this.sc2.w/2,this.sc2.h/2+size/2);			//绘制边缘
			//按钮
			ctx.fillStyle = "purple";
			ctx.fillRect(this.bx1, this.by1, this.w, this.h);
			ctx.fillRect(this.bx2, this.by2, this.w, this.h);
			//按钮字体
			ctx.fillStyle = "black";
			ctx.font = size*2/3+"px 微软雅黑";  
			ctx.textBaseline = "top";           
			ctx.textAlign = "start"; 
			ctx.fillText("Restart",this.bx1+size/3,this.by1+size/5,this.w);
			ctx.fillText("Menu",this.bx2+size/2,this.by2+size/5,this.w);
			
		},
		//开始游戏按钮
		startButt:function(){
			let scM = this.owner.Manager;
			let game = scM.getScene("game");
			scM.bringToTop(game);
			game.restart();
		},
		MenuButt:function(){
			let scM = this.owner.Manager;
			let menu = scM.getScene("menu");
			scM.bringToTop(menu);
		},
	});
	endGame.ClassName = "EndGame";
	ClassFactory.regClass(endGame.ClassName,endGame);
})(window);