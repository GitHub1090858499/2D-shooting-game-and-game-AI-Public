/**
 * 渲染方法存储类
 * 作用：给renderObj提供render支持
 */
(function(win){
	var renderFunction = win.RenderFunction = {
		drawCharaster:function(ctx,x,y,ifdie,degress,movem,r){
			x = x||0;
			y = y||0;
			
			
			
			if(ifdie==true){
				//死时的动画
				//血迹
				ctx.setTransform(1,0,0,1.5,x,y+3*r);
				ctx.beginPath();
				ctx.fillStyle = "red";
				ctx.arc(0,0,1.2*r,0,360*Math.PI/180,true);
				ctx.fill();
				ctx.resetTransform();
				
				ctx.strokeStyle = "red";
				ctx.lineJoin = "round";
				ctx.lineWidth = 4;
				ctx.beginPath();
				ctx.moveTo(x,y);
				ctx.lineTo(x+2*r,y-1*r);
				
				ctx.lineTo(x+1.5*r,y-0*r);
				ctx.lineTo(x+2*r,y-0*r);
				ctx.lineTo(x+2*r,y+0.5*r);
				ctx.lineTo(x,y);
				// ctx.fill();
				ctx.stroke();
				
			}
			//在x,y以半径10px画圆
			ctx.beginPath();
			ctx.lineWidth = 1;
			ctx.fillStyle = "blue";
			ctx.strokeStyle = "blue";
			ctx.lineJoin = "round";
			ctx.moveTo(x,y);
			ctx.arc(x,y,r,0,360*Math.PI/180,true);
			ctx.fill();
			ctx.stroke();
			
			//手宽
			ctx.lineWidth = 2;
			ctx.lineCap = "round";
			//手旋转角度
			var degress = degress||0;
			//手旋转中心的位置
			var hx = x,hy = y+0.25*r;
			//手长
			var hl = 1.5*r;
			//手枪大小
			var gunl = 0.5*r;
			
			
			if(ifdie==true){
				//死时的动画
				//左右手，两条条直线
				let ddd = 0;
				ctx.beginPath();
				hy = y+1.5*r;		
				ctx.moveTo(hx,hy);
				ctx.lineTo(hx+hl*0.7*Math.cos(degress*Math.PI/180),hy+hl*Math.sin(degress*Math.PI/180)-0.5*r);
				ctx.moveTo(hx,hy);
				ctx.lineTo(hx-hl*0.7*Math.cos(ddd*Math.PI/180),hy+hl*Math.sin(ddd*Math.PI/180)-0.5*r);
				ctx.stroke();
				
				//手枪，两个线条
				ctx.beginPath();
				ctx.lineWidth = 6;
				ctx.moveTo(hx+hl*Math.cos(ddd*Math.PI/180),hy+hl*Math.sin((ddd-0)*Math.PI/180));
				ctx.lineTo(hx+hl*Math.cos(ddd*Math.PI/180),hy+(hl)*Math.sin((ddd)*Math.PI/180)+Math.abs(Math.cos(ddd*Math.PI/180))*gunl/2);
				ctx.stroke();	
				ctx.lineWidth = 4;
				ctx.moveTo(hx+hl*Math.cos(ddd*Math.PI/180),hy+hl*Math.sin((ddd-0)*Math.PI/180));
				ctx.lineTo(hx+(hl+gunl)*Math.cos(ddd*Math.PI/180),hy+(hl+gunl)*Math.sin((ddd-0)*Math.PI/180));
				ctx.stroke();
			}
			else{
				ctx.beginPath();
				ctx.resetTransform();
				// 左右手，一条直线，一条二次曲线
				ctx.moveTo(hx,hy);
				ctx.lineTo(hx+hl*Math.cos(degress*Math.PI/180),hy+hl*Math.sin(degress*Math.PI/180));
				ctx.stroke();
				ctx.moveTo(hx,hy);
				ctx.quadraticCurveTo(hx+hl/2*Math.cos(degress*Math.PI/180),hy+hl/2*(0.5+Math.sin(degress*Math.PI/180)),hx+hl*Math.cos(degress*Math.PI/180),hy+hl*Math.sin(degress*Math.PI/180));
				ctx.stroke();
			
				//手枪，两个线条
				ctx.beginPath();
				ctx.lineWidth = 6;
				ctx.moveTo(hx+hl*Math.cos(degress*Math.PI/180),hy+hl*Math.sin((degress-0)*Math.PI/180));
				ctx.lineTo(hx+hl*Math.cos(degress*Math.PI/180),hy+(hl)*Math.sin((degress)*Math.PI/180)+Math.abs(Math.cos(degress*Math.PI/180))*gunl/2);
				ctx.stroke();	
				ctx.lineWidth = 4;
				ctx.moveTo(hx+hl*Math.cos(degress*Math.PI/180),hy+hl*Math.sin((degress-0)*Math.PI/180));
				ctx.lineTo(hx+(hl+gunl)*Math.cos(degress*Math.PI/180),hy+(hl+gunl)*Math.sin((degress-0)*Math.PI/180));
				ctx.stroke();
			}
			
			if(ifdie==true){
				//死时的动画
				ctx.setTransform(1,0,0,1,x,y);
				
			}else{
				//变形大小,坐标
			ctx.setTransform(1,1/4,0,1/5,x,y);
			}	
			// ctx.transform(1,0,0,1,x,y);
			//身体，一条直线
			// 身体起点,终点
			var bx0=0,by0=0;
			//身体长度
			var bx1=0,by1=0+2*r;
			
			ctx.lineWidth = 5;
			ctx.beginPath();
			ctx.moveTo(bx0,by0);
			ctx.lineTo(bx1,by1);
			ctx.stroke();
			
			// ctx.setTransform(1,1/15,1/15,1/4,-60,5);
			
			ctx.lineWidth = 3;
			//脚的姿势序号
			movem = movem||0;
			legAction  = [
				[0,0,0,0],
				[0,0,0,-r],
				[0,-r,0,0],
				[0.25*r,0,0,0],
				[0,0,-0.25*r,0],
			]
			//腿长
			if(ifdie == true){
				var legx=bx1,legy=by1;
				var llegx =legx-1*r+legAction[movem][0],llegy =legy+1*r+legAction[movem][1],
					rlegx = legx+1*r+legAction[movem][2],rlegy = legy+1*r+legAction[movem][3];
				ctx.moveTo(legx,legy);
				ctx.lineTo(llegx,llegy);
				ctx.stroke();
				ctx.moveTo(legx,legy);
				ctx.lineTo(rlegx,rlegy);
				ctx.stroke();
				
			}else{
				
				var legx=bx1,legy=by1;
				var llegx =legx-0.25*r+legAction[movem][0],llegy =legy+4*r+legAction[movem][1],
					rlegx = legx+0.5*r+legAction[movem][2],rlegy = legy+4*r+legAction[movem][3];
				ctx.moveTo(legx,legy);
				ctx.lineTo(llegx,llegy);
				ctx.stroke();
				ctx.moveTo(legx,legy);
				ctx.lineTo(rlegx,rlegy);
				ctx.stroke();
			}
		
			//两条腿，两条直线
			//腿的起点终点
			ctx.resetTransform();
			ctx.closePath();
		},
		
		drawBlock:function(ctx,x,y,w,s){
			ctx.beginPath();
			ctx.fillStyle = "rgba(0, 0, 0, 0.7)"
			ctx.strokeStyle = "rgba(0, 0, 0, 1)";
			// ctx.fillRect(x,y,w,w);
			
			//正方形
			ctx.beginPath();
			ctx.moveTo(x,y);
			ctx.lineTo(x+w,y);
			ctx.lineTo(x+w,y+w);
			ctx.lineTo(x,y+w);
			ctx.lineTo(x,y);
			ctx.stroke();
			ctx.fill();
			ctx.closePath();
			
			//左上移正方形
			ctx.beginPath();
			let sA=0.6;
			ctx.fillStyle = "rgba(0, 0, 0, 0.7)"
			ctx.strokeStyle = "rgba(0, 0, 0, 1)";
			ctx.moveTo(x-sA*s,y-s);
			ctx.lineTo(x+w-sA*s,y-s);
			ctx.lineTo(x+w-sA*s,y+w-s);
			ctx.lineTo(x-sA*s,y+w-s);
			ctx.lineTo(x-sA*s,y-s);
			ctx.stroke();
			ctx.fill();
			ctx.closePath();
			
			//四条柱子
			ctx.strokeStyle = "rgba(0, 0, 0, 1)";
			ctx.beginPath();
			ctx.moveTo(x,y);
			ctx.lineTo(x-sA*s,y-s);
			ctx.stroke();
			ctx.closePath();
			ctx.beginPath();
			ctx.moveTo(x+w,y);
			ctx.lineTo(x+w-sA*s,y-s);
			ctx.stroke();
			ctx.closePath();
			ctx.beginPath();
			ctx.moveTo(x+w,y+w);
			ctx.lineTo(x+w-sA*s,y+w-s);
			ctx.stroke();
			ctx.closePath();
			ctx.beginPath();
			ctx.moveTo(x,y+w);
			ctx.lineTo(x-sA*s,y+w-s);
			ctx.stroke();
			ctx.closePath();
			// ctx.moveTo(x,y+w);
			// ctx.lineTo(x,y);
			// ctx.lineTo(x+w,y);
			// ctx.lineTo(x+w+s,y+s);
			// ctx.lineTo(x+w+s,y+w+s);
			// ctx.lineTo(x+w,y+w);
			// ctx.moveTo(x+w+s,y+w+s);
			// ctx.lineTo(x+s,y+w+s);
			// ctx.lineTo(x,y+w);
			// ctx.lineTo(x+w,y+w);
			// ctx.lineTo(x+w,y);
			// ctx.strokeStyle = "rgba(0, 0, 0, 0.2)";
			// ctx.fillStyle = "rgba(0, 0, 0, 0.5)"
			// ctx.fill();
			// ctx.stroke();
			// ctx.beginPath();
			// ctx.moveTo(x+s,y+w+s);
			// ctx.lineTo(x+s,y+s);
			// ctx.lineTo(x,y);
			// ctx.moveTo(x+s,y+s);
			// ctx.lineTo(x+w+s,y+s);
			// ctx.setLineDash([5,5])
			// ctx.stroke();
			// ctx.closePath();
		},
		
		drawBadCharaster:function(ctx,x,y,ifdie,degress,movem,r){
			x = x||0;
			y = y||0;
			//头的半径,重要的比例参数
				
			if(ifdie==true){
				//死时的动画
				//血迹
				ctx.setTransform(1,0,0,1.5,x,y+3*r);
				ctx.beginPath();
				ctx.fillStyle = "red";
				ctx.arc(0,0,1.2*r,0,360*Math.PI/180,true);
				ctx.fill();
				ctx.resetTransform();
				
				ctx.strokeStyle = "red";
				ctx.lineJoin = "round";
				ctx.lineWidth = 4;
				ctx.beginPath();
				ctx.moveTo(x,y);
				ctx.lineTo(x+2*r,y-1*r);
				
				ctx.lineTo(x+1.5*r,y-0*r);
				ctx.lineTo(x+2*r,y-0*r);
				ctx.lineTo(x+2*r,y+0.5*r);
				ctx.lineTo(x,y);
				// ctx.fill();
				ctx.stroke();
				
			}
			//在x,y以半径10px画圆
			ctx.beginPath();
			ctx.lineWidth = 1;
			ctx.fillStyle = "green";
			ctx.strokeStyle = "green";
			ctx.lineJoin = "round";
			ctx.moveTo(x,y);
			ctx.arc(x,y,r,0,360*Math.PI/180,true);
			ctx.fill();
			ctx.stroke();
			
			//手宽
			ctx.lineWidth = 2;
			ctx.lineCap = "round";
			//手旋转角度
			var degress = degress||0;
			//手旋转中心的位置
			var hx = x,hy = y+0.25*r;
			//手长
			var hl = 1.5*r;
			//手枪大小
			var gunl = 0.5*r;
			
			
			if(ifdie==true){
				//死时的动画
				//左右手，两条条直线
				let ddd = 0;
				ctx.beginPath();
				hy = y+1.5*r;		
				ctx.moveTo(hx,hy);
				ctx.lineTo(hx+hl*0.7*Math.cos(degress*Math.PI/180),hy+hl*Math.sin(degress*Math.PI/180)-0.5*r);
				ctx.moveTo(hx,hy);
				ctx.lineTo(hx-hl*0.7*Math.cos(ddd*Math.PI/180),hy+hl*Math.sin(ddd*Math.PI/180)-0.5*r);
				ctx.stroke();
				
				//手枪，两个线条
				ctx.beginPath();
				ctx.lineWidth = 6;
				ctx.moveTo(hx+hl*Math.cos(ddd*Math.PI/180),hy+hl*Math.sin((ddd-0)*Math.PI/180));
				ctx.lineTo(hx+hl*Math.cos(ddd*Math.PI/180),hy+(hl)*Math.sin((ddd)*Math.PI/180)+Math.abs(Math.cos(ddd*Math.PI/180))*gunl/2);
				ctx.stroke();	
				ctx.lineWidth = 4;
				ctx.moveTo(hx+hl*Math.cos(ddd*Math.PI/180),hy+hl*Math.sin((ddd-0)*Math.PI/180));
				ctx.lineTo(hx+(hl+gunl)*Math.cos(ddd*Math.PI/180),hy+(hl+gunl)*Math.sin((ddd-0)*Math.PI/180));
				ctx.stroke();
			}
			else{
				ctx.beginPath();
				ctx.resetTransform();
				// 左右手，一条直线，一条二次曲线
				ctx.moveTo(hx,hy);
				ctx.lineTo(hx+hl*Math.cos(degress*Math.PI/180),hy+hl*Math.sin(degress*Math.PI/180));
				ctx.stroke();
				ctx.moveTo(hx,hy);
				ctx.quadraticCurveTo(hx+hl/2*Math.cos(degress*Math.PI/180),hy+hl/2*(0.5+Math.sin(degress*Math.PI/180)),hx+hl*Math.cos(degress*Math.PI/180),hy+hl*Math.sin(degress*Math.PI/180));
				ctx.stroke();
			
				//手枪，两个线条
				ctx.beginPath();
				ctx.lineWidth = 6;
				ctx.moveTo(hx+hl*Math.cos(degress*Math.PI/180),hy+hl*Math.sin((degress-0)*Math.PI/180));
				ctx.lineTo(hx+hl*Math.cos(degress*Math.PI/180),hy+(hl)*Math.sin((degress)*Math.PI/180)+Math.abs(Math.cos(degress*Math.PI/180))*gunl/2);
				ctx.stroke();	
				ctx.lineWidth = 4;
				ctx.moveTo(hx+hl*Math.cos(degress*Math.PI/180),hy+hl*Math.sin((degress-0)*Math.PI/180));
				ctx.lineTo(hx+(hl+gunl)*Math.cos(degress*Math.PI/180),hy+(hl+gunl)*Math.sin((degress-0)*Math.PI/180));
				ctx.stroke();
			}
			
			if(ifdie==true){
				//死时的动画
				ctx.setTransform(1,0,0,1,x,y);
				
			}else{
				//变形大小,坐标
			ctx.setTransform(1,1/4,0,1/5,x,y);
			}	
			// ctx.transform(1,0,0,1,x,y);
			//身体，一条直线
			// 身体起点,终点
			var bx0=0,by0=0;
			//身体长度
			var bx1=0,by1=0+2*r;
			
			ctx.lineWidth = 5;
			ctx.beginPath();
			ctx.moveTo(bx0,by0);
			ctx.lineTo(bx1,by1);
			ctx.stroke();
			
			// ctx.setTransform(1,1/15,1/15,1/4,-60,5);
			
			ctx.lineWidth = 3;
			//脚的姿势序号
			movem = movem||0;
			legAction  = [
				[0,0,0,0],
				[0,0,0,-r],
				[0,-r,0,0],
				[0.25*r,0,0,0],
				[0,0,-0.25*r,0],
			]
			//腿长
			if(ifdie == true){
				var legx=bx1,legy=by1;
				var llegx =legx-1*r+legAction[movem][0],llegy =legy+1*r+legAction[movem][1],
					rlegx = legx+1*r+legAction[movem][2],rlegy = legy+1*r+legAction[movem][3];
				ctx.moveTo(legx,legy);
				ctx.lineTo(llegx,llegy);
				ctx.stroke();
				ctx.moveTo(legx,legy);
				ctx.lineTo(rlegx,rlegy);
				ctx.stroke();
				
			}else{
				
				var legx=bx1,legy=by1;
				var llegx =legx-0.25*r+legAction[movem][0],llegy =legy+4*r+legAction[movem][1],
					rlegx = legx+0.5*r+legAction[movem][2],rlegy = legy+4*r+legAction[movem][3];
				ctx.moveTo(legx,legy);
				ctx.lineTo(llegx,llegy);
				ctx.stroke();
				ctx.moveTo(legx,legy);
				ctx.lineTo(rlegx,rlegy);
				ctx.stroke();
			}
		
			//两条腿，两条直线
			//腿的起点终点
			ctx.resetTransform();
			ctx.closePath();
		},
		
		drawBadLeaderCharaster:function(ctx,x,y,ifdie,degress,movem,r){
			x = x||0;
			y = y||0;
			//头的半径,重要的比例参数
				
			if(ifdie==true){
				//死时的动画
				//血迹
				ctx.setTransform(1,0,0,1.5,x,y+3*r);
				ctx.beginPath();
				ctx.fillStyle = "red";
				ctx.arc(0,0,1.2*r,0,360*Math.PI/180,true);
				ctx.fill();
				ctx.resetTransform();
				
				ctx.strokeStyle = "red";
				ctx.lineJoin = "round";
				ctx.lineWidth = 4;
				ctx.beginPath();
				ctx.moveTo(x,y);
				ctx.lineTo(x+2*r,y-1*r);
				
				ctx.lineTo(x+1.5*r,y-0*r);
				ctx.lineTo(x+2*r,y-0*r);
				ctx.lineTo(x+2*r,y+0.5*r);
				ctx.lineTo(x,y);
				// ctx.fill();
				ctx.stroke();
				
			}
			//在x,y以半径10px画圆
			ctx.beginPath();
			ctx.lineWidth = 1;
			ctx.fillStyle = "red";
			ctx.strokeStyle = "red";
			ctx.lineJoin = "round";
			ctx.moveTo(x,y);
			ctx.arc(x,y,r,0,360*Math.PI/180,true);
			ctx.fill();
			ctx.stroke();
			
			//手宽
			ctx.lineWidth = 2;
			ctx.lineCap = "round";
			//手旋转角度
			var degress = degress||0;
			//手旋转中心的位置
			var hx = x,hy = y+0.25*r;
			//手长
			var hl = 1.5*r;
			//手枪大小
			var gunl = 0.5*r;
			
			
			if(ifdie==true){
				//死时的动画
				//左右手，两条条直线
				let ddd = 0;
				ctx.beginPath();
				hy = y+1.5*r;		
				ctx.moveTo(hx,hy);
				ctx.lineTo(hx+hl*0.7*Math.cos(degress*Math.PI/180),hy+hl*Math.sin(degress*Math.PI/180)-0.5*r);
				ctx.moveTo(hx,hy);
				ctx.lineTo(hx-hl*0.7*Math.cos(ddd*Math.PI/180),hy+hl*Math.sin(ddd*Math.PI/180)-0.5*r);
				ctx.stroke();
				
				//手枪，两个线条
				ctx.beginPath();
				ctx.lineWidth = 6;
				ctx.moveTo(hx+hl*Math.cos(ddd*Math.PI/180),hy+hl*Math.sin((ddd-0)*Math.PI/180));
				ctx.lineTo(hx+hl*Math.cos(ddd*Math.PI/180),hy+(hl)*Math.sin((ddd)*Math.PI/180)+Math.abs(Math.cos(ddd*Math.PI/180))*gunl/2);
				ctx.stroke();	
				ctx.lineWidth = 4;
				ctx.moveTo(hx+hl*Math.cos(ddd*Math.PI/180),hy+hl*Math.sin((ddd-0)*Math.PI/180));
				ctx.lineTo(hx+(hl+gunl)*Math.cos(ddd*Math.PI/180),hy+(hl+gunl)*Math.sin((ddd-0)*Math.PI/180));
				ctx.stroke();
			}
			else{
				ctx.beginPath();
				ctx.resetTransform();
				// 左右手，一条直线，一条二次曲线
				ctx.moveTo(hx,hy);
				ctx.lineTo(hx+hl*Math.cos(degress*Math.PI/180),hy+hl*Math.sin(degress*Math.PI/180));
				ctx.stroke();
				ctx.moveTo(hx,hy);
				ctx.quadraticCurveTo(hx+hl/2*Math.cos(degress*Math.PI/180),hy+hl/2*(0.5+Math.sin(degress*Math.PI/180)),hx+hl*Math.cos(degress*Math.PI/180),hy+hl*Math.sin(degress*Math.PI/180));
				ctx.stroke();
			
				//手枪，两个线条
				ctx.beginPath();
				ctx.lineWidth = 6;
				ctx.moveTo(hx+hl*Math.cos(degress*Math.PI/180),hy+hl*Math.sin((degress-0)*Math.PI/180));
				ctx.lineTo(hx+hl*Math.cos(degress*Math.PI/180),hy+(hl)*Math.sin((degress)*Math.PI/180)+Math.abs(Math.cos(degress*Math.PI/180))*gunl/2);
				ctx.stroke();	
				ctx.lineWidth = 4;
				ctx.moveTo(hx+hl*Math.cos(degress*Math.PI/180),hy+hl*Math.sin((degress-0)*Math.PI/180));
				ctx.lineTo(hx+(hl+gunl)*Math.cos(degress*Math.PI/180),hy+(hl+gunl)*Math.sin((degress-0)*Math.PI/180));
				ctx.stroke();
			}
			
			if(ifdie==true){
				//死时的动画
				ctx.setTransform(1,0,0,1,x,y);
				
			}else{
				//变形大小,坐标
			ctx.setTransform(1,1/4,0,1/5,x,y);
			}	
			// ctx.transform(1,0,0,1,x,y);
			//身体，一条直线
			// 身体起点,终点
			var bx0=0,by0=0;
			//身体长度
			var bx1=0,by1=0+2*r;
			
			ctx.lineWidth = 5;
			ctx.beginPath();
			ctx.moveTo(bx0,by0);
			ctx.lineTo(bx1,by1);
			ctx.stroke();
			
			// ctx.setTransform(1,1/15,1/15,1/4,-60,5);
			
			ctx.lineWidth = 3;
			//脚的姿势序号
			movem = movem||0;
			legAction  = [
				[0,0,0,0],
				[0,0,0,-r],
				[0,-r,0,0],
				[0.25*r,0,0,0],
				[0,0,-0.25*r,0],
			]
			//腿长
			if(ifdie == true){
				var legx=bx1,legy=by1;
				var llegx =legx-1*r+legAction[movem][0],llegy =legy+1*r+legAction[movem][1],
					rlegx = legx+1*r+legAction[movem][2],rlegy = legy+1*r+legAction[movem][3];
				ctx.moveTo(legx,legy);
				ctx.lineTo(llegx,llegy);
				ctx.stroke();
				ctx.moveTo(legx,legy);
				ctx.lineTo(rlegx,rlegy);
				ctx.stroke();
				
			}else{
				
				var legx=bx1,legy=by1;
				var llegx =legx-0.25*r+legAction[movem][0],llegy =legy+4*r+legAction[movem][1],
					rlegx = legx+0.5*r+legAction[movem][2],rlegy = legy+4*r+legAction[movem][3];
				ctx.moveTo(legx,legy);
				ctx.lineTo(llegx,llegy);
				ctx.stroke();
				ctx.moveTo(legx,legy);
				ctx.lineTo(rlegx,rlegy);
				ctx.stroke();
			}
		
			//两条腿，两条直线
			//腿的起点终点
			ctx.resetTransform();
			ctx.closePath();
		},
		
	};
	
})(window)