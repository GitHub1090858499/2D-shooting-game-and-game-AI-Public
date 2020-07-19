/**
 * Ai视线类，必须有map导航化的数据地图，作分析
 * 这里的实现只用简单两点之间是否有障碍物来实现,平行线的漏洞
 * 被用于sceneGame（mapsizeW、map等），同时也依靠sceneGame（rObjs等）
 */

class View{
	constructor(arg) {
	    this.scene=arg;
		
	}
	//判断x1,x2不在xr,yr组成的正方形内
	_jsinBlock(x1,y1,x2,y2,xr,yr,w,h){
	let hix=x1>x2?x1:x2,lwx=x1>x2?x2:x1;
	let hiy=y1>y2?y1:y2,lwy=y1>y2?y2:y1;
	
	// let inside1 = x1 >= xr && x1 <= xr + w  && y1 >= yr && y1 <= yr+h;	
	// let inside2 = x2 >= xr && x2 <= xr + w  && y2 >= yr && y2 <= yr+h;
	// return 	inside1||inside2;		
	return hix<xr||lwx>xr+w||hiy<yr||lwy>yr+h;		
	
	// return !((Math.abs(x1-xr)+Math.abs(xr-x2))==Math.abs(x1-x2)&&(Math.abs(y1-yr)+Math.abs(yr-y2))==Math.abs(y1-y2));
	}
	
	//圆外一点求两切点,x0,y0为圆外点，x1,y1为圆心
	findpoint(x0,y0,x1,y1,r){
		
		if(x0==x1+r||x0==x1-r){
			console.log("1");
			return {"x1":x1+r,"y1":y1,"x2":x1-r,"y2":y1};;
		}
		
		//有点到直线的距离为r，求得斜率k的二次方程
		let a=Math.pow(x1-x0,2)-Math.pow(r,2);
		let b=2*(x1-x0)*(y1-y0);
		let c=Math.pow(y1-y0,2)-Math.pow(r,2);
		
		//求得两切线
		let k1=-(-b+Math.sqrt(b*b-4*a*c))/(2*a);
		let k2=-(-b-Math.sqrt(b*b-4*a*c))/(2*a);
		let c1=y0-k1*x0;
		let c2=y0-k2*x0;
		
		//与上面的两切线联立,由切线的过圆心的两条垂直线求得切点
		let xx1 = ((x1/k1+y1)-(c1))/(k1+1/k1);
		let yy1 = xx1*k1+c1;		
		let xx2 = ((x1/k2+y1)-(c2))/(k2+1/k2);
		let yy2 = xx2*k2+c2;
		
		return {"x1":xx1,"y1":yy1,"x2":xx2,"y2":yy2};
	}
	
	//计算sx,sy与轨迹线的距离是否超过一定的值
	// fx,fy为起点,dx,dy为
	ifonLine(sx,sy,fx,fy,dx,dy,rang){
		let k,b,ky;
		//斜率不存在的情况
		if(dx==0){
			k=1;
			b=-fx;
			ky=0;
			//k*x+b-ky*y=0
		}else {
			k=dy/dx;
			ky=1;
			b=fy-k*fx;
			//k*x+b-ky*y=0
		}
		
		let d;
		
		d=Math.abs(k*sx+b-ky*sy)/Math.sqrt(Math.pow(k,2)+Math.pow(ky,2));
		if(d>=rang)return true;
		else return false;
	}
	
	//是否在可行走区域内(像素点)
	ifInWalk(sx,sy){
		
		let sw = this.scene.mapFind.mapsizeW;
		let sh = this.scene.mapFind.mapsizeH;
		let mapx = Math.floor(sx/sw);
		let mapy= Math.floor(sy/sh);
		if(mapy>this.scene.mapFind.map.length-1||mapx>this.scene.mapFind.map[0].length-1)return false;
		let sf;
		try {
			sf=!(mapy>this.scene.mapFind.map.length-1||mapx>this.scene.mapFind.map[0].length-1||this.scene.mapFind.map[mapy][mapx]==1);
		}catch(e){
			sf=false;
		}
		return sf;
		
	}
	
	
	//以scene.rObjs的Block为障碍物分析，检测两坐标之间是否可以直接面对
	//这两点不应该超过map结构坐标的最大最小值
	canSee(x1,y1,x2,y2){
		//构造直线方程
		//分为斜率不存在和存在的情况
		let k,b,ky;
		
		if(x1==x2){
			k=1;
			b=-x1;
			ky=0;
			//方程为 xk+b-ky*y=0
		}else{
			k=(y1-y2)/(x1-x2);
			b=y1-k*x1;
			ky=1;
			//方程为xk+b-ky*y=0
		}
		// k*x+b-ky*y=
		//遍历robjs判断其中robj是否与直线相交
		for(let robj of this.scene.rObjs){
			if(robj.classN=="Block"){
				//起始点
				// let xr=Math.floor(robj.x/this.scene.mapFind.mapsizeW);
				// let yr=Math.floor(robj.y/this.scene.mapFind.mapsizeH);
				// //map单位高和宽
				// let w=Math.floor(robj.w/this.scene.mapFind.mapsizeW)-1;
				// let h=Math.floor(robj.h/this.scene.mapFind.mapsizeH)-1;
				
				//起始点
				let xr=robj.x;
				let yr=robj.y;
				//map单位高和宽
				let w=robj.w;
				let h=robj.h;
				
				//若全部顶点都在同一边则不相交
				if(	(k*xr+b-ky*yr>0&&k*(xr+w)+b-ky*yr>0&&k*(xr+w)+b-ky*(yr+h)>0&&k*xr+b-ky*(yr+h)>0)||
					(k*xr+b-ky*yr<0&&k*(xr+w)+b-ky*yr<0&&k*(xr+w)+b-ky*(yr+h)<0&&k*xr+b-ky*(yr+h)<0)||
					this._jsinBlock(x1,y1,x2,y2,xr,yr,w,h)
				)
				{
				// if((k*xr+b+ky*yr>0&&k*(xr+w)+b+ky*yr>0&&k*(xr+w)+b+ky*(yr+h)>0&&k*xr+b+ky*(yr+h)>0)||
				// 	(k*xr+b+ky*yr<0&&k*(xr+w)+b+ky*yr<0&&k*(xr+w)+b+ky*(yr+h)<0&&k*xr+b+ky*(yr+h)<0))
				// {
					
				}else{
				//若有其中一顶点在直线上或分别两侧，则相切或相交	
				
				return false;
				}
				
			}
		}
		//遍历robjs的block全部都不与直线相交，则表明两点之间无障碍物
		return true;
	}
	
}