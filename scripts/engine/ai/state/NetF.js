/**
 * 神经网络文件
 */

/**
 * 输出层细胞
 */
class Celly{
	constructor(arg) {
		this.W=new Array(5);
		this.X=new Array(5);
		this.y;
	}
	// 设置输入
	// arg:数组类型，对应x0~x4
	_setX(arg,x){
		if(arg instanceof Array&&arg.length==5){
			for(let i in arg){
				this.X[i]=arg[i];
			};
		}
		else if(typeof arg !=="number"&&arg<=4&&arg>=0&&x){
			this.X[arg]=x;
		}
		else return false;
		
	}
	//设置权值
	// arg:数组类型，对应w0~w4
	setW(arg,w){
		if(arg instanceof Array&&arg.length==5){
			for(let i in arg){
				this.W[i]=arg[i];
			};
		}
		else if(typeof arg !=="number"&&arg<=4&&arg>=0&&w){
			this.W[arg]=w;
		}
		else return false;
	}
	//获得权值
	// index:权值序号，对应w0~w4
	getW(index){
		if(typeof index !=="number"&&index<=4&&index>=0)return false;
		else return this.W[index];
	}
	//获得输入
	// index:输入序号，对应x0~x4
	getX(index){
		if(typeof index !=="number"&&index<=4&&index>=0)return false;
		else return this.X[index];
	}
	
	_daohanshu(x){
		return 1;
	}
	_hanshu(x){
		return x;
	}
	
	//根据wx和激励函数得到输出
	getY(X){
		let n=0;
		for(let i=0;i<this.W.length;i++){
			n=n+this.W[i]*X[i];
		}
		this.y=this._hanshu(n);
		return this.y;
	}
	getYWithoutf(X){
		let n=0;
		for(let i=0;i<this.W.length;i++){
			n=n+this.W[i]*X[i];
		}
		return n;
	}
}

/**
 * 隐藏层细胞,非线性_sigmoid
 */
class Celln{
	constructor(arg) {
		// this.w0;this.x0;
		// this.w1;this.x1;
		// this.w2;this.x2;
		// this.w3;this.x3;
		// this.w4;this.x4;
		// this.w5;this.x5;
		this.W=new Array(6);
		this.X=new Array(6);
		this.y;
	}
	
	// 设置输入
	// arg:数组类型，对应x0~x4
	_setX(arg,x){
		if(arg instanceof Array&&arg.length==6){
			for(let i in arg){
				this.X[i]=arg[i];
			};
		}
		else if(typeof arg !=="number"&&arg<=5&&arg>=0&&x){
			this.X[arg]=x;
		}
		else return false;
		
	}
	//设置权值
	// arg:数组类型，对应w0~w5
	setW(arg,w){
		if(arg instanceof Array&&arg.length==6){
			for(let i in arg){
				this.W[i]=arg[i];
			};
		}
		else if(typeof arg !=="number"&&arg<=5&&arg>=0&&w){
			this.W[arg]=w;
		}
		else return false;
	}
	//获得权值
	// index:权值序号，对应w0~w5
	getW(index){
		if(typeof index !=="number"&&index<=5&&index>=0)return false;
		else return this.W[index];
	}
	//获得输入
	// index:输入序号，对应x0~x5
	getX(index){
		if(typeof index !=="number"&&index<=5&&index>=0)return false;
		else return this.X[index];
	}
	
	_daohanshu(x){
		//左右伸缩变大100倍
		let s=1;
		//上下伸缩50倍
		let g=1;
		let yy=1/(1+Math.pow(Math.E,-x/s));
		return (g/s)*yy*(1-yy);
		// return (Math.pow(Math.E,-x/s)/Math.pow((1+Math.pow(Math.E,-x/s)),2));
	}
	_hanshu(x){
		//左右伸缩变大100倍
		let s=1;
		//上下伸缩50倍
		let g=1;
		// 0~1
		let yg=0;
		return (1/(1+Math.pow(Math.E,-x/s))-yg)*g;
	}
	
	//根据wx和激励函数得到输出
	getY(X){
		let n=0;
		for(let i=0;i<this.W.length;i++){
			n=n+this.W[i]*X[i];
		}
		this.y=this._hanshu(n);
		return this.y;
	}
	getYWithoutf(X){
		let n=0;
		for(let i=0;i<this.W.length;i++){
			n=n+this.W[i]*X[i];
		}
		return n;
	}
	
}


/**
 * 隐藏层细胞，线性
 */
class Celln0{
	constructor(arg) {
		// this.w0;this.x0;
		// this.w1;this.x1;
		// this.w2;this.x2;
		// this.w3;this.x3;
		// this.w4;this.x4;
		// this.w5;this.x5;
		this.W=new Array(6);
		this.X=new Array(6);
		this.y;
	}
	
	// 设置输入
	// arg:数组类型，对应x0~x4
	_setX(arg,x){
		if(arg instanceof Array&&arg.length==6){
			for(let i in arg){
				this.X[i]=arg[i];
			};
		}
		else if(typeof arg !=="number"&&arg<=5&&arg>=0&&x){
			this.X[arg]=x;
		}
		else return false;
		
	}
	//设置权值
	// arg:数组类型，对应w0~w5
	setW(arg,w){
		if(arg instanceof Array&&arg.length==6){
			for(let i in arg){
				this.W[i]=arg[i];
			};
		}
		else if(typeof arg !=="number"&&arg<=5&&arg>=0&&w){
			this.W[arg]=w;
		}
		else return false;
	}
	//获得权值
	// index:权值序号，对应w0~w5
	getW(index){
		if(typeof index !=="number"&&index<=5&&index>=0)return false;
		else return this.W[index];
	}
	//获得输入
	// index:输入序号，对应x0~x5
	getX(index){
		if(typeof index !=="number"&&index<=5&&index>=0)return false;
		else return this.X[index];
	}
	
	_daohanshu(x){
		return 1;
	}
	_hanshu(x){
		return x;
	}
	
	//根据wx和激励函数得到输出
	getY(X){
		let n=0;
		for(let i=0;i<this.W.length;i++){
			n=n+this.W[i]*X[i];
		}
		this.y=this._hanshu(n);
		return this.y;
	}
	getYWithoutf(X){
		let n=0;
		for(let i=0;i<this.W.length;i++){
			n=n+this.W[i]*X[i];
		}
		return n;
	}
	
}



/**
 * 神经网络
 * 需要使用Vue
 */
class NeuraNet{
	constructor(arg){
	    this.X=new Array(6);
		this.N=new Array(3);
		this.N[1]=new Array(5);
		this.N[2]=new Array(3);
		//隐藏层
		// this.n1=new Celln0();this.N[1][1]=this.n1;
		// this.n2=new Celln0();this.N[1][2]=this.n2;
		this.n1=new Celln();this.N[1][1]=this.n1;
		this.n2=new Celln();this.N[1][2]=this.n2;
		this.n3=new Celln();this.N[1][3]=this.n3;
		this.n4=new Celln();this.N[1][4]=this.n4;
		//输出层
		this.y1=new Celly();this.N[2][1]=this.y1;
		this.y2=new Celly();this.N[2][2]=this.y2;
		
		//权值初始化
		this.netWs=[];
		this._initW();
		
		
		//训练集
		this.TT=[];		
		// //初始化显示权值
		// this._showWInit2();
		// this._showWInit("850px","550px");
		// this._UpShowW();
		
		// //添加进度条
		// this._showtime();
		
	}
	
	
	//显示权值到body
	_showWInit(x,y){
		let div = $("<div id = 'net' class='nets'  style='position: absolute; left:"+x+"; top:"+y+"; width:900px; '></div>");
		$(document.body).append(div);
		
		
		
		let j,k,l;
		//显示输出层
		let table1= $("<table id ='table1'></table>")
		div.append(table1);
		let tr;
		let th;
		
		tr= $("<tr></tr");
		table1.append(tr);
		
		th = $("<th></th");
		th.text(" ");
		th.attr("colspan","1");
		tr.append(th);
		th = $("<th></th");
		th.text("y1");
		th.attr("colspan","5");
		tr.append(th);
		th = $("<th></th");
		th.text("y2");
		th.attr("colspan","5");
		tr.append(th);
		/*
		// tr= $("<tr></tr");
		// table1.append(tr);
		// th = $("<td></td");
		// th.text("权值索引");
		// tr.append(th);
		// for(k=1;k<this.N[2].length;k++){
		// 	for(l=0;l<this.N[2][1].W.length;l++){
		// 		th = $("<td></td");
		// 		th.text(l);
		// 		tr.append(th);
				
		// 	}
		// }
		
		// tr= $("<tr></tr");
		// table1.append(tr);
		// th = $("<td></td");
		// th.text("权值（四舍五入）");
		// tr.append(th);
		// for(k=1;k<this.N[2].length;k++){
		// 	for(l=0;l<this.N[2][1].W.length;l++){
		// 		th = $("<td></td");
		// 		// th.text(this.N[2][k].W[l]);
		// 		tr.append(th);
				
		// 	}
		// }
		*/
		//显示隐藏层
		let table2= $("<table id ='table2'></table>")
		div.append(table2);
		
		tr= $("<tr></tr");
		table2.append(tr);
		
		th = $("<th></th");
		th.text(" ");
		th.attr("colspan","1");
		tr.append(th);
		th = $("<th></th");
		th.text("n1");
		th.attr("colspan","6");
		tr.append(th);
		th = $("<th></th");
		th.text("n2");
		th.attr("colspan","6");
		tr.append(th);
		th = $("<th></th");
		th.text("n3");
		th.attr("colspan","6");
		tr.append(th);
		th = $("<th></th");
		th.text("n4");
		th.attr("colspan","6");
		tr.append(th);
		
		/*
		// tr= $("<tr></tr");
		// table2.append(tr);
		// th = $("<td></td");
		// th.text("权值索引");
		// tr.append(th);
		// for(k=1;k<this.N[1].length;k++){
		// 	for(l=0;l<this.N[1][1].W.length;l++){
		// 		th = $("<td></td");
		// 		th.text(l);
		// 		tr.append(th);
				
		// 	}
		// }
		
		// tr= $("<tr></tr");
		// table2.append(tr);
		// th = $("<td></td");
		// th.text("权值（四舍五入）");
		// tr.append(th);
		// for(k=1;k<this.N[1].length;k++){
		// 	for(l=0;l<this.N[1][1].W.length;l++){
		// 		th = $("<td></td");
		// 		// th.text(this.N[1][k].W[l]);
		// 		tr.append(th);
				
		// 	}
		// }
		*/
		
		//添加输入
		let table3= $("<table id ='table3'></table>")
		div.append(table3);
		tr = $("<tr></tr>");
		table3.append(tr);	
		th = $("<th></th>");
		th.text("L");
		tr.append(th);
		th = $("<th></th>");
		th.text("H");
		tr.append(th);
		th = $("<th></th>");
		th.text("V");
		tr.append(th);
		th = $("<th></th>");
		th.text("Vx");
		tr.append(th);
		th = $("<th></th>");
		th.text("Vy");
		tr.append(th);
			
	}
	
	
	//显示权值2
	_showWInit2(){
	
		let div = $("#net_show>ul>li>div");
		let w;
		let k,l;
		//显示输出层
		for(k=1;k<this.N[2].length;k++){
			for(l=0;l<this.N[2][1].W.length;l++){
				w=div.eq(k-1).children("ul").eq(0).children().eq(l);
				w.html("<span>w"+l+":</span>"+this.N[2][k].W[l]);
			}
		}
		
		//显示隐藏层
		for(k=1;k<this.N[1].length;k++){
			for(l=0;l<this.N[1][1].W.length;l++){
				w=div.eq(2+k-1).children("ul").eq(0).children().eq(l);
				w.html("<span>w"+l+":</span>"+this.N[1][k].W[l]);
			}
		}
		
	
			
	}
	
	
	_UpShowW(){
		let div = $("#net");
		let j,k,l;
		let table1=div.children("table").eq(0);
		let table2=div.children("table").eq(1);
		let tr;
		let td;
		tr=table1.find("tr").eq(2);
		for(k=1;k<this.N[2].length;k++){
			for(l=0;l<this.N[2][1].W.length;l++){
				td = tr.children("td").eq((k-1)*this.N[2][1].W.length+l+1);
				td.text(Math.ceil(this.N[2][k].W[l]));
			}
		}
		
		tr=table2.find("tr").eq(2);
		for(k=1;k<this.N[1].length;k++){
			for(l=0;l<this.N[1][1].W.length;l++){
				td = tr.children("td").eq((k-1)*this.N[1][1].W.length+l+1);
				td.text(Math.ceil(this.N[1][k].W[l]));
			}
		}
		
		
	}
	
	//设置输入
	_setX(arg,x){
		if(arg instanceof Array&&arg.length==6){
			for(let i in arg){
				this.X[i]=arg[i];
			};
		}
		else if(typeof index !=="number"&&index<=5&&index>=0&&x){
			this.X[index]=x;
		}
		else return false;
	}
	//求得隐藏层输出,X试为[-1,1,2,3,4,5]
	_getY1(X){
		//求得隐藏层输出
		let n1=this.n1.getY(X);
		let n2=this.n2.getY(X);
		let n3=this.n3.getY(X);
		let n4=this.n4.getY(X);
		return [-1,n1,n2,n3,n4];
	}
	//求输出层输出
	_getY2(NX){
		let y1=this.y1.getY(NX);
		let y2=this.y2.getY(NX);
		return [y1,y2];
	}
	//计算输出
	getY(X){
		
		//求得隐藏层输出
		let NX=this._getY1(X);

		//求输出层输出
		let Ny=this._getY2(NX);
		
		// //显示输出
		// let div = $("#net");
		// let j,k,l;
		// let table1=div.children("table").eq(0);
		// let table2=div.children("table").eq(1);
		// let table3=div.children("table").eq(2);
		// let tr;
		// let th;
		// //输入
		// let p=300;
		// tr=table3.find("tr").eq(0);
		// th=tr.find("th").eq(0);
		// th.text("L:"+X[1]);
		// th=tr.find("th").eq(1);
		// th.text("H:"+X[2]);
		// th=tr.find("th").eq(2);
		// th.text("V:"+X[3]);
		// th=tr.find("th").eq(3);
		// th.text("Vx:"+X[4]);
		// th=tr.find("th").eq(4);
		// th.text("Vy:"+X[5]);
		// //
		// // tr=table2.find("tr").eq(0);
		// // th=tr.find("th").eq(1);
		// // th.text("n1="+Math.ceil(NX[1]));
		// // th=tr.find("th").eq(2);
		// // th.text("n2="+Math.ceil(NX[2]));
		// // th=tr.find("th").eq(3);
		// // th.text("n3="+Math.ceil(NX[3]));
		// // th=tr.find("th").eq(4);
		// // th.text("n4="+Math.ceil(NX[4]));
		// tr=table2.find("tr").eq(0);
		// th=tr.find("th").eq(1);
		// th.text("n1="+NX[1]);
		// th=tr.find("th").eq(2);
		// th.text("n2="+NX[2]);
		// th=tr.find("th").eq(3);
		// th.text("n3="+NX[3]);
		// th=tr.find("th").eq(4);
		// th.text("n4="+NX[4]);
		// //
		// tr=table1.find("tr").eq(0);
		// th=tr.find("th").eq(1);
		// th.text("y1="+Math.ceil(Ny[0]));
		// th=tr.find("th").eq(2);
		// th.text("y2="+Math.ceil(Ny[1]));
		return Ny;
	}
	
	//k层第j个细胞的第i个权值
	setW(k,j,i,w){
		this.N[k][j].setW(i,w);
	}
	
	//权值读取或者赋予初值
	_initW(){
		let g;
		// //空白的权值
		// let p=1/200;
		// this.n1.setW([p,p,p,p,p,p]);
		// this.n2.setW([p,p,p,p,p,p]);
		// this.n3.setW([p,p,p,p,p,p]);
		// this.n4.setW([p,p,p,p,p,p]);
		// this.y1.setW([1,1,1,1,1]);
		// this.y2.setW([1,1,1,1,1]);
		//空白的权值
		let p=1/200;
		g=new Array(6);
		g[0]=[p,p,p,p,p,p];
		g[1]=[p,p,p,p,p,p];
		g[2]=[p,p,p,p,p,p];
		g[3]=[p,p,p,p,p,p];
		g[4]=[1,1,1,1,1];
		g[5]=[1,1,1,1,1];
		this.netWs.push(g);
		
		g=new Array(6);
		g[0]=[0.11671495022731741,2.2862665451247848,0.1715344881983851,-0.22809809020998736,0.19778491161391692,-0.0047034261395257765];
		g[1]=[0.005,-0.49783738859089544,3.4037109052911423,0.005,0.005,0.24431062015518767];
		g[2]=[3.1373063973893647,11.895413953710221,-20.990036215262677,0.005,3.1115762745732405,-1.2280550577058165];
		g[3]=[0.6426635275655854,2.8816774878059235,0.5118587706156814,-1.6639195175902193,0.40503094480659274,0.7696380924933277];
		g[4]=[213.40219037968745,495.6184875750844,-4.69234301277643,12.060058560751175,97.4847316658931];
		g[5]=[225.6232321778078,71.7110999311765,389.2707441938667,5.003373819225533,3.0197165263761674];
		this.netWs.push(g);
		
		g=new Array(6);
		g[0]=[0.04612544148750001,-0.05084224230228817,2.2772820770941777,-0.18871448518486442,0.09615634676348486,0.06307110303012554];
		g[1]=[0.005,1.5081608072693165,0.0524221325544924,0.005,0.12434002602054944,-0.13409309615368725];
		g[2]=[0.37225423817728864,-6.412351246493248,2.5698410071978,-0.3858994206806452,-0.3203070281197236,3.911685314083208];
		g[3]=[0.7040578595976011,0.6300058003644554,3.0978613292340844,-1.8475012958213977,-0.009161053444934675,1.0106835562077703];
		g[4]=[506.18783778842607,-93.01882805743386,1037.804926193852,73.27808759615401,15.440431524920578];
		g[5]=[205.10899665296995,515.8817346403208,-46.558975097838726,-17.83379070612487,127.2882396725585];
		this.netWs.push(g);
		
		// //显示到#netupdata
		// for(let i in this.netWs){
		// 	$("#netupdata>select").append("<option value="+i+">"+i+"号</option>");
		// }
		
		
		//设置权值
		this._setWWs(this.netWs[0]);
	}
	
	_setWWs(g){
		this.n1.setW(g[0]);
		this.n2.setW(g[1]);
		this.n3.setW(g[2]);
		this.n4.setW(g[3]);
		this.y1.setW(g[4]);
		this.y2.setW(g[5]);
	}
	//权值读取或者赋予初值
	_initW2(){
		//训练了50个点，修正2000次，E=321所得到权值
		this.n1.setW([0.11671495022731741,2.2862665451247848,0.1715344881983851,-0.22809809020998736,0.19778491161391692,-0.0047034261395257765]);
		this.n2.setW([0.005,-0.49783738859089544,3.4037109052911423,0.005,0.005,0.24431062015518767]);
		this.n3.setW([3.1373063973893647,11.895413953710221,-20.990036215262677,0.005,3.1115762745732405,-1.2280550577058165]);
		this.n4.setW([0.6426635275655854,2.8816774878059235,0.5118587706156814,-1.6639195175902193,0.40503094480659274,0.7696380924933277]);
		this.y1.setW([213.40219037968745,495.6184875750844,-4.69234301277643,12.060058560751175,97.4847316658931]);
		this.y2.setW([225.6232321778078,71.7110999311765,389.2707441938667,5.003373819225533,3.0197165263761674]);
		
		this.netWs.push()
	}
	
	_initW3(){
		//训练了50个点，修正2000次，E=3604所得到权值
		this.n1.setW([0.04612544148750001,-0.05084224230228817,2.2772820770941777,-0.18871448518486442,0.09615634676348486,0.06307110303012554]);
		this.n2.setW([0.005,1.5081608072693165,0.0524221325544924,0.005,0.12434002602054944,-0.13409309615368725]);
		this.n3.setW([0.37225423817728864,-6.412351246493248,2.5698410071978,-0.3858994206806452,-0.3203070281197236,3.911685314083208]);
		this.n4.setW([0.7040578595976011,0.6300058003644554,3.0978613292340844,-1.8475012958213977,-0.009161053444934675,1.0106835562077703]);
		this.y1.setW([506.18783778842607,-93.01882805743386,1037.804926193852,73.27808759615401,15.440431524920578]);
		this.y2.setW([205.10899665296995,515.8817346403208,-46.558975097838726,-17.83379070612487,127.2882396725585]);
	}
	
	
	_readW_LS(){
		let storage=window.localStorage;
		let j,k,l;
		for(j=1;j<=2;j++){
			for(k=1;k<this.N[j].length;k++){
				for(l=0;l<this.N[j][1].W.length;l++){
					this.N[j][k].W[l]=Number(storage.getItem("W("+j+","+k+","+l+")"));					
				}
			}
		}	
		if(!storage.getItem("readN")){
			storage.setItem("readN",1);
		}
		else {
			storage.setItem("readN",storage.getItem("readN")+1);
		}

	}
	
	//保存W
	_saveW_LS(){
		let storage=window.localStorage;
		let j,k,l;
		for(j=1;j<=2;j++){
			for(k=1;k<this.N[j].length;k++){
				for(l=0;l<this.N[j][1].W.length;l++){
					storage.setItem("W("+j+","+k+","+l+")",this.N[j][k].W[l]);					
				}
			}
		}	
		if(!storage.getItem("saveN")){
			storage.setItem("saveN",1);
		}
		else {
			storage.setItem("saveN",storage.getItem("saveN")+1);
		}
	

		
	}
	
	//清除localStorage
	_clear_LS(){
		let storage=window.localStorage;
		storage.clear();
	}

	//添加训练点
	addTeach(arg){
		this.TT.push(arg);
	}
	//清空训练点
	clearTeach(arg){
		this.TT.length=0;
	}
	
	//权值训练T,数组[{tx:[t0,t1,t2,t3,t4,t5],ty1:ty1,ty2:ty2}]
	teach(){
		let T=this.TT;
		//训练集
		//方差导数集合
		let allE={};
		//方差
		let E=501;
		//步长
		let m=0.2;
		//计数
		let count=0;
		
		let hansE={};
		let j,k,l;
		
		//显示进度条
		// this._showtime2();
		
		//获得修正权值
		for(let i in T){
			E+=this._teachGetEl(T[i],allE,hansE);
		}
		let mE=E;
		self.postMessage({method: "tip", reply: [E,count,mE]});
		while(E>100&&count<2500){
			
			// //更新进度条
			// this._uptime(E,count,mE);
			
			
			// console.log(E);
			
			E=0;
			hansE={};
			allE={};
			//获得修正权值
			for(let i in T){
				E+=this._teachGetEl(T[i],allE,hansE);
				hansE;
			}
			
			let ifE=this._teachW2(T,allE,hansE,E);				
			/*
			// //寻找最大斜率的
			// let j1=1,k1=1,l1=0;
			// let maxEn="d("+j1+","+k1+","+l1+")";
			// let maxE=Math.abs(allE[maxEn]);
			// //计算方差
			// let ifNy;
			// let ifE=0;
			// for(let i in T){
			// 	ifNy=this._getY(T[i].tx);
			// 	ifE+=Math.pow(ifNy[0]-T[i].ty1,2)/2+Math.pow(ifNy[1]-T[i].ty2,2)/2
			// }
			// let minifE=ifE;
			// for(j=1;j<=2;j++){
			// 	for(k=1;k<this.N[j].length;k++){
			// 		for(l=0;l<this.N[j][1].W.length;l++){
			// 			//计算方差
			// 			ifNy;
			// 			ifE=0;
			// 			for(let i in T){
			// 				ifNy=this._getY(T[i].tx);
			// 				ifE+=Math.pow(ifNy[0]-T[i].ty1,2)/2+Math.pow(ifNy[1]-T[i].ty2,2)/2
			// 			}
			// 			minifE=ifE;
			// 			if(Math.abs(allE["d("+j+","+k+","+l+")"])>=maxE){
			// 			maxEn="d("+j+","+k+","+l+")";
			// 			maxE=Math.abs(allE[maxEn]);
			// 			j1=j;
			// 			k1=k;
			// 			l1=l;
			// 			}	
			// 		}
			// 	}
			// }
			// //修正影响力最大的权值,需要修改
			// if(j1==1){
			// 	m=Math.pow(0.1,Math.log10(maxE)/3); 
			// 	if(allE[maxEn]>0){
			// 	this.N[j1][k1].W[l1]+=(-1)*m;
			// 	}else 
			// 	if(allE[maxEn]<0){
			// 		this.N[j1][k1].W[l1]+=m;
			// 	}
			// }else if(j1==2){
			// 	m=-1*hansE["d("+j1+","+k1+","+l1+")"].b/hansE["d("+j1+","+k1+","+l1+")"].a;
			// 	this.N[j1][k1].W[l1]=m;
			// }
			
			
			
			
			
			//修正权值
			// for(j=1;j<=2;j++){
			// 	for(k=1;k<this.N[j].length;k++){
			// 		for(l=0;l<this.N[j][1].W.length;l++){
			// 			if(allE["d("+j+","+k+","+l+")"]>0){
			// 				this.N[j][k].W[l]+=(-1)*m;
			// 			}
			// 			else if(allE["d("+j+","+k+","+l+")"]<0){
			// 				this.N[j][k].W[l]+=m;
			// 			}
			// 			this.N[j][k].W[l]+=(-1)*m*allE["d("+j+","+k+","+l+")"];
			// 		}
			// 	}
			// }
			// this.N[1][1].W[1]+=(-1)*m*allE["d("+1+","+1+","+1+")"];	
			*/		   
			count++;
			self.postMessage({method: "tip", reply: [E,count,mE]});
		}
		// //更新进度条
		// this._uptime(E,count,mE);
		// alert("使用本次的训练集合，修正了"+count+"次,E="+E);
		// //关闭进度条
		// this._closetime();
		
		// this._saveW_LS();
		// this._showWInit2();
		// this._UpShowW();
		 self.postMessage({method: "result", reply: this.N,count:count,E:E,mE:mE});
	}
	//计算单独dEl,t={tx:[t0,t1,t2,t3,t4,t5],ty1:ty1,ty2:ty2},allE={"d("+j+","+k+","+"l"+")":Num}
	_teachGetEl(t,allE,hansE){
		//训练点
		let ty1=t.ty1;
		let ty2=t.ty2;
		let tx=t.tx;	
		//两层的计算过程
		let Nx=this._getY1(tx);
		let Ny=this._getY2(Nx);
		//循环求所有权值的导数
		//求权值W(j,k,l)的El
		//第j层的第k个细胞的第l个权值
		let j=1,k=1,l=0;	
		let dE;
		//对训练点计算方差
		let nn;
		let dn;
		for(j=1;j<=2;j++){
			for(k=1;k<this.N[j].length;k++){
				for(l=0;l<this.N[j][1].W.length;l++){
					//求输出层的El
					if(j==2&&k>=1&&k<=2&&l>=0&&l<=4){					
						if(k==1){
							dE=Nx[l]*(Ny[0]-ty1);
													
						}else {
							dE=Nx[l]*(Ny[1]-ty2);
							
						}
						
						//调试
						let A=Nx[l];
						let B=Ny[k-1]-A*this.N[2][k].W[l];
						let y;
						let C;
						if(k==1){
							y=ty1;
							C=Math.pow(Ny[0]-y,2)/2;
						}
						else {
							y=ty2;
							C=Math.pow(Ny[1]-y,2)/2;
						}
						
						
						if(!hansE["d("+j+","+k+","+l+")"]){
								hansE["d("+j+","+k+","+l+")"]={
								"A":A,
								"B":B,
								"y":y,
								"C":C,
								"a":A*A,
								"b":A*(B-y),
							}
						}
						else {
							hansE["d("+j+","+k+","+l+")"]["A"]=A;
							hansE["d("+j+","+k+","+l+")"]["B"]=B;
							hansE["d("+j+","+k+","+l+")"]["y"]=y;
							hansE["d("+j+","+k+","+l+")"]["C"]=C;
							hansE["d("+j+","+k+","+l+")"]["a"]+=A*A;
							hansE["d("+j+","+k+","+l+")"]["b"]+=A*(B-y);
						}
						
					}
					//求隐藏层的El
					else if(j==1&&k>=1&&k<=4&&l>=0&&l<=5){		
						//求出没有激励函数的原始输出
						nn=this.N[1][k].getYWithoutf(tx);
						//求导数的值
						dn=this.N[1][k]._daohanshu(nn);
						dE=tx[l]*dn*this.N[2][1].W[k]*(Ny[0]-ty1)+
							tx[l]*dn*this.N[2][2].W[k]*(Ny[1]-ty2);
							
						//调试
						let fab=this.N[1][k].getY(tx);
						let ab=nn;
						let d=dn;
						
						let dd1=this.N[2][1].W[k];
						let cc1=Ny[0]-dd1*fab;
						let y1=ty1;
						
						let dd2=this.N[2][2].W[k];
						let cc2=Ny[1]-dd2*fab;
						let y2=ty2;
						
						hansE["d("+j+","+k+","+l+")"]={
							"fab":fab,
							"ab":ab,
							"a":tx[l],
							"b":ab-tx[l]*this.N[j][k].W[l],
							"dfab":d,
							"A1":dd1,
							"B1":cc1,
							"y1":y1,
							"A2":dd2,
							"B2":cc2,
							"y2":y2,
						}
						
					}else{
						return false;
					}
					
					
					//得到dE(j,k,l)	
					allE["d("+j+","+k+","+l+")"]=allE["d("+j+","+k+","+l+")"]||0;
					allE["d("+j+","+k+","+l+")"]+=dE;
					
					
				}
			}
		}	
		
		return Math.pow(Ny[0]-ty1,2)/2+Math.pow(Ny[1]-ty2,2)/2;	
	}
	
	
	_teachW2(T,allE,hansE,E){

		
		//保存假设的方差	
		let allifE={};
		let m;
		//假设修正，保存原本的
		let ifm=this.N[1][1].W[0];
		m=Math.pow(0.1,Math.log10(Math.abs(allE["d("+1+","+1+","+0+")"]))/3); 
		if(allE["d("+1+","+1+","+0+")"]>0){
		this.N[1][1].W[0]+=(-1)*m;
		}else 
		if(allE["d("+1+","+1+","+0+")"]<0){
			this.N[1][1].W[0]+=m;
		}	
		//按假设计算方差，并且保存
		let ifNy;
		let ifE=0;
		for(let i in T){
			ifNy=this.getY(T[i].tx);
			ifE+=Math.pow(ifNy[0]-T[i].ty1,2)/2+Math.pow(ifNy[1]-T[i].ty2,2)/2
		}
		allifE["d("+1+","+1+","+0+")"]=ifE;
		//还原权值
		this.N[1][1].W[0]=ifm;
		//设为最大变化的方差
		let minifE=ifE;
		let minifEn="d("+1+","+1+","+0+")";
		let j1=1,k1=1,l1=0;
		for(let j=1;j<=2;j++){
			for(let k=1;k<this.N[j].length;k++){
				for(let l=0;l<this.N[j][1].W.length;l++){
					//假设修正，保存原本的
					ifm=this.N[j][k].W[l];
					if(j==1){
						m=Math.pow(0.1,Math.log10(Math.abs(allE["d("+j+","+k+","+l+")"]))/3); 
						if(allE["d("+j+","+k+","+l+")"]>0){
						this.N[j][k].W[l]+=(-1)*m;
						}else 
						if(allE["d("+j+","+k+","+l+")"]<0){
							this.N[j][k].W[l]+=m;
						}
					}else if(j==2){
						m=-1*hansE["d("+j+","+k+","+l+")"].b/hansE["d("+j+","+k+","+l+")"].a;
						this.N[j][k].W[l]=m;
					}
					//计算方差，保存方差
					ifNy;
					ifE=0;
					for(let i in T){
						ifNy=this.getY(T[i].tx);
						ifE+=Math.pow(ifNy[0]-T[i].ty1,2)/2+Math.pow(ifNy[1]-T[i].ty2,2)/2
					}
					allifE["d("+j+","+k+","+l+")"]=ifE;
					//还原权值
					this.N[j][k].W[l]=ifm;
					//设为最大变化的方差
					if(ifE<minifE){
						minifEn="d("+j+","+k+","+l+")";
						minifE=ifE;
						j1=j;
						k1=k;
						l1=l;
					}

				}
			}
		}
		//最后修改权值
		if(j1==1){
			m=Math.pow(0.1,Math.log10(Math.abs(allE["d("+j1+","+k1+","+l1+")"]))/3); 
			if(allE["d("+j1+","+k1+","+l1+")"]>0){
			this.N[j1][k1].W[l1]+=(-1)*m;
			}else 
			if(allE["d("+j1+","+k1+","+l1+")"]<0){
				this.N[j1][k1].W[l1]+=m;
			}
		}else if(j1==2){
			m=-1*hansE["d("+j1+","+k1+","+l1+")"].b/hansE["d("+j1+","+k1+","+l1+")"].a;
			this.N[j1][k1].W[l1]=m;
		}
		return allifE;
		
	}
	
	teach2(){
		let T=this.TT;
		//训练集
		//方差导数集合
		let allE={};
		//方差
		let E=501;

		//计数
		let count=0;
		
		
		let j=1,k=1,l=0;
		let dE;
		//对训练点计算方差
		let nn;
		let dn;
		//训练点
		let t;
		let ty1;
		let ty2;
		let tx;	
		//两层的计算过程
		let Nx;
		let Ny;	
		//修正步长
		let m=1;
		//方差
		let E1=999999,E2=999999+1,dnn;
		for(j=1;j<=2;j++){
			for(k=1;k<this.N[j].length;k++){
				for(l=0;l<this.N[j][1].W.length;l++){
					//设W的初始值
					// nn=this.N[1][k].getYWithoutf(tx);
					// this.N[j][k].W[l]=-nn/t[l]+this.N[j][k].W[l];
					//初始方差
					E1=999999,E2=999999+1;
					while(E1<E2){
					// while(1){	
						E2=E1;
						E1=0;
						dE=0;
						dnn=0;
						//计算所有训练点得到的指定的W的对输出方差，以及其导数
						for(let i in T){
							//训练点
							t=T[i];
							ty1=t.ty1;
							ty2=t.ty2;
							tx=t.tx;	
							//两层的计算过程
							Nx=this._getY1(tx);
							Ny=this._getY2(Nx);	
							//计算方差
							E1+=Math.pow(Ny[0]-ty1,2)/2+Math.pow(Ny[1]-ty2,2)/2
							//导数计算
								//求输出层的El
								if(j==2&&k>=1&&k<=2&&l>=0&&l<=4){					
										dE+=Nx[l]*(Ny[k-1]-ty1);						
								}
								//求隐藏层的El
								else if(j==1&&k>=1&&k<=4&&l>=0&&l<=5){		
									//求出没有激励函数的原始输出
									nn=this.N[1][k].getYWithoutf(tx);
									//求导数的值
									dn=this.N[1][k]._daohanshu(nn);
									dE+=tx[l]*dn*this.N[2][1].W[k]*(Ny[0]-ty1)+
										tx[l]*dn*this.N[2][2].W[k]*(Ny[1]-ty2);
									
									dnn+=nn;
									
								}
							
						}
						allE["d("+j+","+k+","+l+")"]=dE;
						//利用E1和dE修正权值
						
						// if(Math.abs(dE)<0.5)dE=0.5;
						// else dE=
						
						// this.N[j][k].W[l]+=(-1)*m*(Math.pow(-dE,2));
						if(dE>0){
							this.N[j][k].W[l]+=(-1)*m*dnn/T.length;
							
						}
						else if(dE<0){
							this.N[j][k].W[l]+=m*dnn/T.length;
						}
						
					}
				}
			}
		}
		this._saveW_LS();
		this._UpShowW();
	}
	
	
	
	//初始进度条
	_showtime(){
		
		$(function(){
			// alert("fuck");
			let processs=$("<div id='processs' z-index='1000' background-color='black'></div>");
			let p1=$("<div class='process'></div>");
			p1.append("<div></div>");
			p1.append("<span>0</span>");
			processs.append(p1);
	
			let p2=$("<div class='process'></div>");
			p2.append("<div></div>");
			p2.append("<span>0</span>");
			processs.append(p2);
	
			$(document.body).append(processs);
			
			$("#processs").hide();
		});
		

	}
	
	_showtime2(){
		
		$("#processs").show();
		
	}
	
	
	_closetime(){
		
		$("#processs").hide();
		
	}
	//更新进度条
	_uptime(ne,nt,me){
	
		let p1= $("#processs>.process").eq(0);
		let p2= $("#processs>.process").eq(1);
		let me0=Math.floor(me);
		let ne0=Math.floor(ne);
		p1.children("div").css("width",p1[0].clientWidth*(me0-ne0)/(me0-100));
		p1.children("span").eq(0).text("E比例："+(me0-ne0)+"/"+(me0-100));
		
		p2.children("div").css("width",p2[0].clientWidth*nt/2000);
		p2.children("span").eq(0).text("Count比例："+nt+"/2000");

		
	}
	
	
	
}



self.addEventListener('message', function(e){
	
  let net = new NeuraNet();
  net.TT=e.data;
  net.teach();
  // self.postMessage(e.data);
  // self.postMessage(net.N);
 
  self.close();
}, false);




