
/** 
 * 作用:在myCanvas内绘制人物
 * @param {number} x	x坐标
 * @param {number} y    y坐标
 * @param {Object} myCanvas  文档流中的canvas元素
 * @param {bollean} ifdie    是否死亡动作,等于true时,degress,movem无效
 * @param {number} degress	 持枪的角度
 * @param {number} movem	 脚的动作,有0~4四个动作
 */
function drawCharaster(myCanvas,x,y,ifdie,degress,movem){
	
	x = x||0;
	y = y||0;
	var ctx = myCanvas.getContext("2d");
	//头的半径,重要的比例参数
	var r = 10;	
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
	ctx.fillStyle = "black";
	ctx.strokeStyle = "black";
	ctx.lineJoin = "round";
	ctx.moveTo(x,y);
	ctx.arc(x,y,r,0,360*Math.PI/180,true);
	ctx.fill();
	ctx.stroke();
	
	//手宽
	ctx.lineWidth = 3;
	ctx.lineCap = "round";
	//手旋转角度
	var degress = degress||0;
	//手旋转中心的位置
	var hx = x,hy = y+0.25*r;
	//手长
	var hl = 3*r;
	//手枪大小
	var gunl = r;
	
	
	if(ifdie==true){
		//死时的动画
		//左右手，两条条直线
		ctx.beginPath();
		hy = y+1.5*r;		
		ctx.moveTo(hx,hy);
		ctx.lineTo(hx+hl*0.7*Math.cos(degress*Math.PI/180),hy+hl*Math.sin(degress*Math.PI/180)-0.5*r);
		ctx.moveTo(hx,hy);
		ctx.lineTo(hx-hl*0.7*Math.cos(degress*Math.PI/180),hy+hl*Math.sin(degress*Math.PI/180)-0.5*r);
		ctx.stroke();
		
		
	}
	else{
		ctx.beginPath();
		ctx.resetTransform();
		//左右手，一条直线，一条二次曲线
		ctx.moveTo(hx,hy);
		ctx.lineTo(hx+hl*Math.cos(degress*Math.PI/180),hy+hl*Math.sin(degress*Math.PI/180));
		ctx.stroke();
		ctx.moveTo(hx,hy);
		ctx.quadraticCurveTo(hx+hl/2*Math.cos(degress*Math.PI/180),hy+hl/2*(0.5+Math.sin(degress*Math.PI/180)),hx+hl*Math.cos(degress*Math.PI/180),hy+hl*Math.sin(degress*Math.PI/180));
		ctx.stroke();
	}
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
	
	
	if(ifdie==true){
		//死时的动画
		ctx.setTransform(1,0,0,1,x,y);
		
	}else{
		//变形大小,坐标
	ctx.setTransform(1,1/2,0,1/3,x,y);
	}	
	// ctx.transform(1,0,0,1,x,y);
	//身体，一条直线
	// 身体起点,终点
	var bx0=0,by0=0;
	var bx1=0,by1=0+3*r;
	ctx.lineWidth = 10;
	ctx.beginPath();
	ctx.moveTo(bx0,by0);
	ctx.lineTo(bx1,by1);
	ctx.stroke();
	
	// ctx.setTransform(1,1/15,1/15,1/4,-60,5);
	
	ctx.lineWidth = 4;
	//脚的姿势序号
	movem = movem||0;
	legAction  = [
		[0,0,0,0],
		[0,0,0,-r],
		[0,-r,0,0],
		[0.25*r,0,0,0],
		[0,0,-0.25*r,0],
	]
	if(ifdie == true){
		var legx=bx1,legy=by1;
		var llegx =legx-1.5*r+legAction[movem][0],llegy =legy+2*r+legAction[movem][1],
			rlegx = legx+1.5*r+legAction[movem][2],rlegy = legy+2*r+legAction[movem][3];
		ctx.moveTo(legx,legy);
		ctx.lineTo(llegx,llegy);
		ctx.stroke();
		ctx.moveTo(legx,legy);
		ctx.lineTo(rlegx,rlegy);
		ctx.stroke();
		
	}else{
		
		var legx=bx1,legy=by1;
		var llegx =legx-0.5*r+legAction[movem][0],llegy =legy+4*r+legAction[movem][1],
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
	
	
}


/**
 * 作用 直线子弹轨迹
 * @param {Object} x   发射源x
 * @param {Object} y	发射源y
 * @param {Object} degrees 角度
 * @param {Object} speed 速度 
 */
function bulletAction(x,y,degrees,speed){
	
}








var myCanvas = document.getElementById("myCanvas");
//设置myCanvas大小，有兼容性问题
myCanvas.width = 600;
myCanvas.height = 600;

drawCharaster(myCanvas,300,300,false,0,3);

