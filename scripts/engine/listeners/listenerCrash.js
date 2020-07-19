/**
 * 碰撞检测
 * 被运用于：scene.js,和主运行的new ()
 * 内聚于：renderObjSon文件夹的所有类(已经存储在了window.renderObj={}里面)
 */

(function(win){
	var listenerCrash = win.ListenerCrash = Listener.extend({
		init:function(param){
			//监听器是否生效
			this.enabled = true;

			//与上一帧相对，移动过的renderObj，此结构作为碰撞记录的检索头
			this.move = [];
			//此帧碰撞的人员记录,结构为"name":["name1","name2"......]
			this.crash = {};
			
			//scene.js里面的渲染对象
			this.renderObj = param.rObjs||[];
			
			this.scene = param;
		},
		beforeRender:function(){
			
		},
		afterRender:function(){
			
		},
		beforeUpdate:function(cls){
			// this.scene = cls;
			let m = this.move;
			//一个二重循环,.
			let type;
			for(var i=0;i<m.length;i++){
				//判断m[i]的renderObj类型
				type = m[i].classN;
				//遍历renderObj
				
				if((type == "BadMan"||type=="Man"||type=="Bullet") && this.crashSceneEdge(m[i]) ){	
						
						this.crash[m[i].name]=this.crash[m[i].name]||[];
						this.crash[m[i].name].push("outOfScene");
						
				};
				for(var j = 0;j<this.renderObj.length;j++){
					//判断renderObj[j]的类型
					let type2 = this.renderObj[j].classN;
					let ifcrash = false;
					//进行碰撞检测
					if(type == "Bullet" && type2 == "Block"){
						ifcrash = this.crashTBlockBullet(this.renderObj[j],m[i]);
					}else 
					if(type=="Man" && type2=="Block"){
						ifcrash = this.crashTBlockMan(this.renderObj[j],m[i]);
					}else 
					if(type == "BadMan"&& type2=="Block"){
						ifcrash = this.crashTBlockBadMan(this.renderObj[j],m[i]);
					}else
					if((type == "BadMan"||type=="Man") && type2=="Bullet"){
						ifcrash = this.crashTBulletMan(this.renderObj[j],m[i]);
					}else 
					if((type == "BadMan" && type2=="Man")||(type == "Man" && type2=="BadMan")){
						ifcrash = this.crashTBadManMan(this.renderObj[j],m[i]);
					}else 
					if(type=="Bullet" && (type2 == "BadMan"||type2 =="Man")){
						ifcrash = this.crashTBulletMan(m[i],this.renderObj[j]);
					};
					
					
					
					//若碰撞了则添加到crash[m[i]]
					if(ifcrash==true){
						this.crash[m[i].name]=this.crash[m[i].name]||[];
						this.crash[m[i].name].push(this.renderObj[j].name);
					}
					
					
				};

			}
			//清空move
			this.move.length = 0;
			//赋予到scene.crash
			cls.crash = this.crash;
		},
		afterUpdate:function(cls){
			//将相对上一帧，移动过的obj放入move[]
			var objs = cls.rObjs;
			for( var i=0;i<objs.length;i++){
				if(objs[i].classN != "Block")
				this.move.push(objs[i]);
			};
			//清空crash
			delete this.crash;
			this.crash = {};
			
		},
		//renderObjBlock与renderObjMan的碰撞检测，正方形与头部圆形的接触
		//aa为block，bb为Man
		crashTBlockMan:function(aa,bb){
			let aax = aa.x, aay = aa.y, aaw = aa.w;
			let x = bb.x, y = bb.y, r = bb.r+2;
			//圆心在内的判断
			let inside = x >= aax-r && x <= aax + r + aaw && y >= aay-r && y <= aay + aaw+ r;
			//面积的圆相切情况判断
			// let onedge = (Math.abs(x-aax) <= r || Math.abs(x-aax-aaw) <= r)&&
			// 			 (Math.abs(y-aay) <= r || Math.abs(y-aay-aaw) <= r);
			
			return inside;
		},
		//renderObjBlock与renderObjBedMan的碰撞检测，正方形与头部圆形的接触
		//aa为block，bb为Man
		crashTBlockBadMan:function(aa,bb){
			let aax = aa.x, aay = aa.y, aaw = aa.w;
			let x = bb.x, y = bb.y, r = bb.r/2;
			//圆心在内的判断
			let inside = x >= aax-r && x <= aax + r + aaw && y >= aay-r && y <= aay + aaw+ r;
			//面积的圆相切情况判断
			// let onedge = (Math.abs(x-aax) <= r || Math.abs(x-aax-aaw) <= r)&&
			// 			 (Math.abs(y-aay) <= r || Math.abs(y-aay-aaw) <= r);
			
			return inside;
		},
		//renderObjBullet与renderObjMan和renderObjBedMan的碰撞检测，圆与圆的接触
		//aa为bullet，bb为Man或BadMan
		crashTBulletMan:function(aa,bb){
			let ax=aa.x , ay=aa.y , ar=aa.r; 
			let bx=bb.x , by=bb.y , br=bb.r-1;
			let isIn = Math.pow(ax-bx,2)+Math.pow(ay-by,2) <= Math.pow(ar+br,2);
			return isIn;
		},
		
		//renderObjBullet与renderObjBlock碰撞检测,正方形与子弹圆形的接触
		//aa为block，bb为bullet
		crashTBlockBullet:function(aa,bb){
			
			let aax = aa.x, aay = aa.y, aaw = aa.w;
			let x = bb.x, y = bb.y, r = bb.r;
			
		    let inside = x >= aax && x <= aax + aaw && y >= aay && y <= aay + aaw;
			let onedge = (Math.abs(x-aax) <= r || Math.abs(x-aax-aaw) <= r)&&
						 (Math.abs(y-aay) <= r || Math.abs(y-aay-aaw) <= r);
						 			 
			return inside||onedge;
		},
		//renderObjBadMan与renderObjMan碰撞检测，圆与圆的接触
		//aa,bb为相似的对象，BadMan和Man顺序不影响
		crashTBadManMan:function(aa,bb){
			let ax=aa.x , ay=aa.y , ar=aa.r;
			let bx=bb.x , by=bb.y , br=bb.r;
			let isIn = Math.pow(ax-bx,2)+Math.pow(ay-by,2) <= Math.pow(ar+br,2);
			return isIn;
		},
		//超过边缘的检测
		crashSceneEdge:function(aa){
			let x = aa.x, y = aa.y, r = aa.r+7;
			let h = this.scene.h, w = this.scene.w;
			let isIn = x<=r || x>=w-r || y<=r || y>=h-r;
			return isIn;
		},
		
	});
	
	
})(window);