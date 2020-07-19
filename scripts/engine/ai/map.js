/**
 * 地图分析类，将地图数据化 
 * 被用于sceneGame（mapsizeW、map等），同时也依靠sceneGame（rObjs等）
 */


//map专用边结构,双向边，x，y为标志，
class GraphEdge{
	constructor(fx,fy,tx,ty,v){
		this.fx=fx;
		this.fy=fy;
		this.tx=tx;
		this.ty=ty;
		this.v=v;
		//是否被遍历过
		this.hasView=false;
	}
	getFNode(){
		return "("+this.fx+","+this.fy+")";
	}
	getTNode(){
		return "("+this.tx+","+this.ty+")";
	}
	//返回其中点指向的另一点的名
	getNode(Node){
		if(Node.x==this.fx&&Node.y==this.fy)return this.getTNode();
		else if(Node.x==this.tx&&Node.y==this.ty)return this.getFNode();
		else return "error";
	}
	getNodeX(Node){
		if(Node.x==this.fx&&Node.y==this.fy)return this.tx;
		else if(Node.x==this.tx&&Node.y==this.ty)return this.fx;
		else return "error";
	}
	getNodeY(Node){
		if(Node.x==this.fx&&Node.y==this.fy)return this.ty;
		else if(Node.x==this.tx&&Node.y==this.ty)return this.fy;
		else return "error";
	}
	//可根据这个，判断两条边是否相同
	toString(){
		let str;
		if(this.fx<this.tx||(this.fx==this.tx&&this.fy<=this.ty))str=this.getFNode()+" to "+this.getTNode();
		else str=this.getTNode()+" to "+this.getFNode();
		return str;
	}
	// sameAs(e){
	// 	return (e.fx==this.fx&&e.fy==this.fy&&e.tx==this.tx&&e.ty==this.ty)||
	// 			(e.fx==this.tx&&e.fy==this.ty&&e.tx==this.fx&&e.ty==this.fy);
	// }
};

//map专用的节点，x，y为标志，,专门用来创建所有可行走的边
class GraphNode{
	//对应的x，y坐标
	x=null;
	y=null;
	//边，边的权值全是1
	edge=null;
	gn=null;
	//树结构的父指针，用来表明路径
	father=null;
	
	constructor(x,y,map){
		this.x=x;
		this.y=y;
		this.gn=0;
		this.edge=[];
		GraphNode.map = GraphNode.map||map;
		this._edgeAdd();
	}
	//点是否为可行走的区间
	_ifInWalk(x,y){
		return GraphNode.map[y][x]!=1;
	}
	//需要联合map来创建本节点的四条边
	_edgeAdd(){
		if(this.x-2>=0&&this._ifInWalk(this.x-2,this.y)&&this._ifInWalk(this.x-2,this.y-1)&&this._ifInWalk(this.x-2,this.y+1)){
			// this.edge.push(new GraphNode(this.x-1,this.y,GraphNode.maxX,GraphNode.maxY))
			this.edge.push(new GraphEdge(this.x,this.y,this.x-1,this.y,1));
		}
		if(this.x+2<=GraphNode.map[0].length-1&&this._ifInWalk(this.x+2,this.y)&&this._ifInWalk(this.x+2,this.y-1)&&this._ifInWalk(this.x+2,this.y+1)){
			// this.edge.push(new GraphNode(this.x+1,this.y,GraphNode.maxX,GraphNode.maxY))
			this.edge.push(new GraphEdge(this.x,this.y,this.x+1,this.y,1));
		}
		if(this.y-2>=0&&this._ifInWalk(this.x,this.y-2)&&this._ifInWalk(this.x-1,this.y-2)&&this._ifInWalk(this.x+1,this.y-2)){
			// this.edge.push(new GraphNode(this.x,this.y-1,GraphNode.maxX,GraphNode.maxY))
			this.edge.push(new GraphEdge(this.x,this.y,this.x,this.y-1,1));
		}
		if(this.y+2<=GraphNode.map.length-1&&this._ifInWalk(this.x,this.y+2)&&this._ifInWalk(this.x-1,this.y+2)&&this._ifInWalk(this.x+1,this.y+2)){
			// this.edge.push(new GraphNode(this.x,this.y+1,GraphNode.maxX,GraphNode.maxY))
			this.edge.push(new GraphEdge(this.x,this.y,this.x,this.y+1,1));
		}
		
		
	}
	
	toString(){
		return "("+this.x+","+this.y+")";
	}
	
};
//寻路类
class MapFind {
	map = null;
	//构造函数，map为二维数组，其参数要考虑地图编辑的标准（即单位格子的大小）
	constructor(scene){
		this.scene = scene;
		this.walkLink=[];
		this.map=this.scene.map;				
		this.mapsizeW=10;
		this.mapsizeH=10;
		let swN = Math.floor(this.scene.w/this.mapsizeW);
		let shN = Math.floor(this.scene.h/this.mapsizeH);
		this.map=new Array();             //声明一维数组        
		for(var x=0;x<shN;x++){
		      this.map[x]=new Array();        //声明二维数组
		      for(var y=0;y<swN;y++){
		           this.map[x][y]=0;          //数组初始化为0
		      }
		}
	
	}

	//根据scene的w，h，，以及障碍物rObjs，将像素地图转换成栅格化的导航地图
	mapAnalyse(){
		let sw = this.mapsizeW;
		let sh = this.mapsizeH;
		let swN = Math.floor(this.scene.w/sw);
		let shN = Math.floor(this.scene.h/sh);
		//初始化地图数组
		for(var x=0;x<shN;x++){
		      for(var y=0;y<swN;y++){
		           this.map[x][y]=0;          
		      }
		}
		
		//遍历robj,改变map
		for( var i = 0;i<this.scene.rObjs.length;i++){
			let rO = this.scene.rObjs[i];
			let rOx = Math.floor(rO.x/sw);
			let rOy = Math.floor(rO.y/sh);
			switch(this.scene.rObjs[i].classN){
				case "Block":
					//降维遍历
					for(var j=0;j<rO.h/sh*rO.w/sw;j++){
						this.map[rOy+Math.floor(j/(rO.h/sh))][rOx+j%(rO.h/sh)]=1;
					}	
					break;
				case "Man":
					this.map[rOy][rOx]=2;
					this.map[rOy-1][rOx]=2;
					this.map[rOy+1][rOx]=2;
					this.map[rOy][rOx-1]=2;
					this.map[rOy][rOx+1]=2;
					break;
				case "BadMan":
					this.map[rOy][rOx]=3;
					this.map[rOy-1][rOx]=3;
					this.map[rOy+1][rOx]=3;
					this.map[rOy][rOx-1]=3;
					this.map[rOy][rOx+1]=3;
					break;
				case "Bullet":
					this.map[rOy][rOx]=4;
					break;
				default:
			}
		}
	}

	//根据map的坐标，自动寻路算法（一般图搜索）
	// sx,sy为起点,fx,fy为终点
	findway(sx,sy,fx,fy){
		//若坐标不合法或者map出错则退出
		let bool1=sx<0||sx>this.map[0].length-1||sy<0||sy>this.map.length-1;
		let bool2=(fx==undefined||fy==undefined)||fx<0||fx>this.map[0].length-1||fy<0||fy>this.map.length-1;
		if(bool1||bool2)return false;
		//创建open表，表示为待扩展的节点
		let open = [];
		let openO = {};
		//初始化open表
		open[0]=new GraphNode(sx,sy,this.map);
		//方便查找open表，存储这节点
		openO[open[0].toString()]=open[0];
		
		//open表作为已经遍历的边
		let openEdge=[];
		let openEdgeO={};
		
		// for(let e of open[0].edge){
		// 	if(openEdgeO[e.toString()]==null){
		// 		openEdge.push(e);
		// 		openEdgeO[e.toString()]=e;
		// 	}
		// }
		
		
		//创建colse表，表示为已经扩展的节点
		let close = [];
		//方便查找close表，存储close表的着序号
		let closeO = {}; 
		
		//当前的操作点
		let nNode;
		//nNode的父边
		let nEdge;
		
		let walkLink=[];
		
		//用于记录拓展点
		this.test=[];
		
		//循环直到open表为空
		while(open.length>0){
			//从open取出评估值最小的点，越小的在越后面
			nNode = open.pop();
			delete openO[nNode.toString()];
			
			this.test.push(nNode);
			
			//放入close中
			close.push(nNode);
			closeO[nNode.toString()] = nNode;
			
			//如果是目标节点则退出循环
			if(nNode.x==fx&&nNode.y==fy)break;
			
			else{
				//遍历扩展点的所有边
				for(let e of nNode.edge){
					//无重复的边则加入到openEdge，有重复边则表明此边已经被计算过，应该跳过
					if(openEdgeO[e.toString()]==null){
						openEdge.push(e);
						openEdgeO[e.toString()]=e;
					}else continue;
					
					//边指向的节点，若不在open和close中则放入open中
					let node1 =new GraphNode(e.getNodeX(nNode),e.getNodeY(nNode));
					//若node1本来就在open中则重新计算其gn，并更新其唯一父节点
					if(openO[node1.toString()]!=null){
					node1.gn=node1.gn>e.v+nNode.gn?e.v+nNode.gn:node1.gn;
					node1.father=nNode;
					}
					//边指向的节点，若不在open和close中则放入open中，计算其gn，并赋予其唯一父节点
					else if(openO[node1.toString()]==null&&closeO[node1.toString()]==null){
						open.push(node1);
						openO[node1.toString()]=node1;
						node1.gn=e.v+nNode.gn;
						node1.hn=Math.pow(nNode.x-0,2)+Math.pow(nNode.y-0,2);
						node1.father=nNode;
					}
				
				}
			}
			//按某种规矩排列open表，按照Dijkstra算法，将open表的各节点的看作一个整体，选择与这个整体权值最小的边的节点先扩展
			open.sort(this.sortway);
		}
		//查找失败
		if(open.length==0)return false;
		// 查找成功
		this.node=nNode;
		//清空walkLink
		walkLink.length=0;
		nNode=nNode.father;
		while(nNode!=null&&nNode.father!=null){
			// if(nNode.father.x<nNode.x)this.walkLink.push("left");
			// else if(nNode.father.x>nNode.x)this.walkLink.push("right");
			// else if(nNode.father.y<nNode.y)this.walkLink.push("up");
			// else if(nNode.father.y>nNode.y)this.walkLink.push("down");
			walkLink.push({"y":nNode.y,"x":nNode.x});
			nNode=nNode.father;
		};
		this.walkLink=walkLink;
		return walkLink;
	}
	
	//最近与TheOne视野外的寻路，需要读取this.scene.view（view.js），并且TheOne存在his.scene.namedRObjs中
	// sx,sy为起点寻找看不到TheOne的最近点
	findAvoidway(sx,sy){
		//若坐标不合法或者map出错则退出
		let bool1=sx<0||sx>this.map[0].length-1||sy<0||sy>this.map.length-1;
		//若模块不完整为假
		let bool2=this.scene.namedRObjs["TheOne"]&&this.scene.view;
		if(bool1||!bool2)return false;
		//创建open表，表示为待扩展的节点
		let open = [];
		let openO = {};
		//初始化open表
		open[0]=new GraphNode(sx,sy,this.map);
		//方便查找open表，存储这节点
		openO[open[0].toString()]=open[0];
		
		//open表作为已经遍历的边
		let openEdge=[];
		let openEdgeO={};		
	
		//创建colse表，表示为已经扩展的节点
		let close = [];
		//方便查找close表，存储close表的着序号
		let closeO = {}; 
		
		//当前的操作点
		let nNode;
		//nNode的父边
		let nEdge;
		let walkLink=[];
		
		
		
		//循环直到open表为空
		while(open.length>0){
			
			
			//从open取出评估值最小的点，越小的在越后面
			nNode = open.pop();
			delete openO[nNode.toString()];
			
			
			//放入close中
			close.push(nNode);
			closeO[nNode.toString()] = nNode;
			
			//像素上的xy
			let x = nNode.x*this.mapsizeW+5;
			let y = nNode.y*this.mapsizeH+5;
			let a1 = this.scene.view.findpoint(this.scene.namedRObjs["TheOne"].x,this.scene.namedRObjs["TheOne"].y,x,y,20);
			let v1 = this.scene.view.canSee(this.scene.namedRObjs["TheOne"].x,this.scene.namedRObjs["TheOne"].y,a1.x1,a1.y1);
			let vc = this.scene.view.canSee(this.scene.namedRObjs["TheOne"].x,this.scene.namedRObjs["TheOne"].y,x,y);
			let v2 = this.scene.view.canSee(this.scene.namedRObjs["TheOne"].x,this.scene.namedRObjs["TheOne"].y,a1.x2,a1.y2);
			//如果是目标节点不在TheOne的视线内则退出
			if(v1==false&&v2==false&&vc==false)break;
			
			else{
				//遍历扩展点的所有边
				for(let e of nNode.edge){
					//无重复的边则加入到openEdge，有重复边则表明此边已经被计算过，应该跳过
					if(openEdgeO[e.toString()]==null){
						openEdge.push(e);
						openEdgeO[e.toString()]=e;
					}else continue;
					
					//边指向的节点，若不在open和close中则放入open中
					let node1 =new GraphNode(e.getNodeX(nNode),e.getNodeY(nNode));
					//若node1本来就在open中则重新计算其gn，并更新其唯一父节点
					if(openO[node1.toString()]!=null){
					node1.gn=node1.gn>e.v+nNode.gn?e.v+nNode.gn:node1.gn;
					node1.father=nNode;
					}
					//边指向的节点，若不在open和close中则放入open中，计算其gn，并赋予其唯一父节点
					else if(openO[node1.toString()]==null&&closeO[node1.toString()]==null){
						open.push(node1);
						openO[node1.toString()]=node1;
						node1.gn=e.v+nNode.gn;
						node1.father=nNode;
					}
				
				}
			}
			//按某种规矩排列open表，按照Dijkstra算法，将open表的各节点的看作一个整体，选择与这个整体权值最小的边的节点先扩展
			open.sort(this.sortway);
		}
		//查找失败
		if(open.length==0)return false;
		// 查找成功
		this.node=nNode;
		//清空walkLink
		walkLink.length=0;
		nNode=nNode.father;
		while(nNode!=null&&nNode.father!=null){
			
			walkLink.push({"y":nNode.y,"x":nNode.x});
			nNode=nNode.father;
		};
		this.walkLink=walkLink;
		return walkLink;
	}
	
	//sx,sy为起点避开bullet的最近点
	//fx,fy为子弹起点，dx,dy为子弹速度
	findAvoidBulletway(sx,sy,fx,fy,dx,dy){
		//若坐标不合法或者map出错则退出
		let bool1=sx<0||sx>this.map[0].length-1||sy<0||sy>this.map.length-1;
		if(bool1)return false;
		//创建open表，表示为待扩展的节点
		let open = [];
		let openO = {};
		//初始化open表
		open[0]=new GraphNode(sx,sy,this.map);
		//方便查找open表，存储这节点
		openO[open[0].toString()]=open[0];
		
		//open表作为已经遍历的边
		let openEdge=[];
		let openEdgeO={};		
	
		//创建colse表，表示为已经扩展的节点
		let close = [];
		//方便查找close表，存储close表的着序号
		let closeO = {}; 
		
		//当前的操作点
		let nNode;
		//nNode的父边
		let nEdge;
		
		let walkLink=[];
		//循环直到open表为空
		while(open.length>0){
			//从open取出评估值最小的点，越小的在越后面
			nNode = open.pop();
			delete openO[nNode.toString()];
			
			//放入close中
			close.push(nNode);
			closeO[nNode.toString()] = nNode;
			
			let x = nNode.x*this.mapsizeW+5;
			let y = nNode.y*this.mapsizeH+5;
			
			let v1=this.scene.view.ifonLine(x,y,fx,fy,dx,dy,35);
			//如果是目标节点距离轨迹线的距离超过一定的值
			if(v1==true)break;
			
			else{
				//遍历扩展点的所有边
				for(let e of nNode.edge){
					//无重复的边则加入到openEdge，有重复边则表明此边已经被计算过，应该跳过
					if(openEdgeO[e.toString()]==null){
						openEdge.push(e);
						openEdgeO[e.toString()]=e;
					}else continue;
					
					//边指向的节点，若不在open和close中则放入open中
					let node1 =new GraphNode(e.getNodeX(nNode),e.getNodeY(nNode));
					//若node1本来就在open中则重新计算其gn，并更新其唯一父节点
					if(openO[node1.toString()]!=null){
					node1.gn=node1.gn>e.v+nNode.gn?e.v+nNode.gn:node1.gn;
					node1.father=nNode;
					}
					//边指向的节点，若不在open和close中则放入open中，计算其gn，并赋予其唯一父节点
					else if(openO[node1.toString()]==null&&closeO[node1.toString()]==null){
						open.push(node1);
						openO[node1.toString()]=node1;
						node1.gn=e.v+nNode.gn;
						node1.father=nNode;
					}
				
				}
			}
			//按某种规矩排列open表，按照Dijkstra算法，将open表的各节点的看作一个整体，选择与这个整体权值最小的边的节点先扩展
			open.sort(this.sortway);
		}
		//查找失败
		if(open.length==0)return false;
		// 查找成功
		this.node=nNode;
		//清空walkLink
		walkLink.length=0;
		nNode=nNode.father;
		while(nNode!=null&&nNode.father!=null){
			
			walkLink.push({"y":nNode.y,"x":nNode.x});
			nNode=nNode.father;
		};
		this.walkLink=walkLink;
		return walkLink;
	}
	
	//巡逻
	//sx,sy为人物起点 ，rang为巡逻范围
	findPatroltway(sx,sy,rang){
		//若坐标不合法或者map出错则退出
		let bool1=sx<0||sx>this.map[0].length-1||sy<0||sy>this.map.length-1;
		//若模块不完整为假
		let bool2=this.scene.namedRObjs["TheOne"]&&this.scene.view;
		if(bool1||!bool2)return false;
		//创建open表，表示为待扩展的节点
		let open = [];
		let openO = {};
		//初始化open表
		open[0]=new GraphNode(sx,sy,this.map);
		//方便查找open表，存储这节点
		openO[open[0].toString()]=open[0];
		
		//open表作为已经遍历的边
		let openEdge=[];
		let openEdgeO={};		
	
		//创建colse表，表示为已经扩展的节点
		let close = [];
		//方便查找close表，存储close表的着序号
		let closeO = {}; 
		
		//当前的操作点
		let nNode;
		//nNode的父边
		let nEdge;
		let walkLink=[];
		//循环直到open表为空
		while(open.length>0){
			//从open取出评估值最小的点，越小的在越后面
			nNode = open.pop();
			delete openO[nNode.toString()];
			
			//放入close中
			close.push(nNode);
			closeO[nNode.toString()] = nNode;
			
			// if(nNode.x==fx&&nNode.y==fy)break;
			let x = nNode.x*this.mapsizeW+5;
			let y = nNode.y*this.mapsizeH+5;
			 
			
			let v1=Math.sqrt(Math.pow(x-sx*this.mapsizeH+5,2)+Math.pow(y-sy*this.mapsizeH+5,2))>=rang;
			
			//如果是目标节点不在sx,sy的rang范围内则退出
			if(v1==true)break;
			
			else{
				//遍历扩展点的所有边
				for(let e of nNode.edge){
					//无重复的边则加入到openEdge，有重复边则表明此边已经被计算过，应该跳过
					if(openEdgeO[e.toString()]==null){
						openEdge.push(e);
						openEdgeO[e.toString()]=e;
					}else continue;
					
					//边指向的节点，若不在open和close中则放入open中
					let node1 =new GraphNode(e.getNodeX(nNode),e.getNodeY(nNode));
					//若node1本来就在open中则重新计算其gn，并更新其唯一父节点
					if(openO[node1.toString()]!=null){
					node1.gn=node1.gn>e.v+nNode.gn?e.v+nNode.gn:node1.gn;
					node1.father=nNode;
					}
					//边指向的节点，若不在open和close中则放入open中，计算其gn，并赋予其唯一父节点
					else if(openO[node1.toString()]==null&&closeO[node1.toString()]==null){
						open.push(node1);
						openO[node1.toString()]=node1;
						node1.gn=e.v+nNode.gn;
						node1.father=nNode;
					}
				
				}
			}
			//按某种规矩排列open表，按照Dijkstra算法，将open表的各节点的看作一个整体，选择与这个整体权值最小的边的节点先扩展
			open.sort(this.sortway);
		}
		//查找失败
		if(open.length==0)return false;
		// 查找成功
		this.node=nNode;
		//清空walkLink
		walkLink.length=0;
		nNode=nNode.father;
		while(nNode!=null&&nNode.father!=null){
			
			walkLink.push({"y":nNode.y,"x":nNode.x});
			nNode=nNode.father;
		};
		this.walkLink=walkLink;
		return walkLink;
	}
	
	
	//A*算法
	findway2(sx,sy,fx,fy){
		//若坐标不合法或者map出错则退出
		let bool1=sx<0||sx>this.map[0].length-1||sy<0||sy>this.map.length-1;
		let bool2=(fx==undefined||fy==undefined)||fx<0||fx>this.map[0].length-1||fy<0||fy>this.map.length-1;
		if(bool1||bool2)return false;
		//创建open表，表示为待扩展的节点
		let open = [];
		let openO = {};
		//初始化open表
		open[0]=new GraphNode(sx,sy,this.map);
		open[0].gn=0;
		open[0].hn=0;
		let fist=open[0];
		//方便查找open表，存储这节点
		openO[open[0].toString()]=open[0];
		
		//open表作为已经遍历的边
		let openEdge=[];
		let openEdgeO={};
		
		// for(let e of open[0].edge){
		// 	if(openEdgeO[e.toString()]==null){
		// 		openEdge.push(e);
		// 		openEdgeO[e.toString()]=e;
		// 	}
		// }
		
		
		//创建colse表，表示为已经扩展的节点
		let close = [];
		//方便查找close表，存储close表的着序号
		let closeO = {}; 
		
		//当前的操作点
		let nNode;
		//nNode的父边
		let nEdge;
		
		let walkLink=[];
		
		//用于记录拓展点
		this.test=[];
		
		let go;
		
		
		//循环直到open表为空
		while(open.length>0){
			//从open取出评估值最小的点，越小的在越后面
			nNode = open.pop();
			delete openO[nNode.toString()];
			
			if(nNode.x==4&&nNode.y==16){
				nNode;
			}
			
			this.test.push(nNode);
			
			let mixnode={};
			mixnode.gn=100000;
			let e1={};
			e1.v=100;
			//遍历扩展点的所有边,求连接边
			for(let e of nNode.edge){	
				//边指向的节点，若不在open和close中则放入open中
				let node1 =new GraphNode(e.getNodeX(nNode),e.getNodeY(nNode));
				//若在close中,选择最小边作为连接边
				if(closeO[node1.toString()]!=null){
					if(closeO[node1.toString()].gn+e.v<mixnode.gn+e1.v){
						e1=e;
						mixnode=closeO[node1.toString()];
					}
				}else if(openO[node1.toString()]==null){
					//A*估价函数
					node1.hn=Math.pow(nNode.x-0,2)+Math.pow(nNode.y-0,2);
					open.push(node1);
					openO[node1.toString()]=node1;
				}
			}
			if(close.length!=0){
				nNode.gn=mixnode.gn+e1.v;
				nNode.father=mixnode;
			}
			else {
				nNode.gn=0;
				nNode.father=null;
			}
			
			
			//再遍历扩展点的所有边,修改边
			for(let e of nNode.edge){	
				//边指向的节点，若不在open和close中则放入open中
				let node1 =new GraphNode(e.getNodeX(nNode),e.getNodeY(nNode));
				//若在close中,选择最小边作为连接边
				if(closeO[node1.toString()]!=null&&nNode.father!=closeO[node1.toString()]){
					//若连接的代价大于目前，则修改其父节点
					if(closeO[node1.toString()].gn>=nNode.gn+e.v){
						closeO[node1.toString()].father=nNode;
						closeO[node1.toString()].gn=nNode.gn+e.v;
					}
				}
			}
		
			
			
			//放入close中
			close.push(nNode);
			closeO[nNode.toString()] = nNode;
			
			
			
			
			
			
			//按某种规矩排列open表，按照Dijkstra算法，将open表的各节点的看作一个整体，选择与这个整体权值最小的边的节点先扩展
			// open.sort(this.sortway2);
		}
		
		//查找失败
		// if(open.length==0)return false;
		// 查找成功
		nNode=closeO["("+fx+","+fy+")"];
		this.node=nNode;
		//清空walkLink
		walkLink.length=0;
		nNode=nNode.father;
		while(nNode!=null&&nNode.father!=null){
			// if(nNode.father.x<nNode.x)this.walkLink.push("left");
			// else if(nNode.father.x>nNode.x)this.walkLink.push("right");
			// else if(nNode.father.y<nNode.y)this.walkLink.push("up");
			// else if(nNode.father.y>nNode.y)this.walkLink.push("down");
			walkLink.push({"y":nNode.y,"x":nNode.x});
			nNode=nNode.father;
		};
		this.walkLink=walkLink;
		return walkLink;
	}
	
	
	sortway(a,b){
		if(a.gn>b.gn)return -1;
		else if(a.gn==b.gn)return 0;
		else return 1;
	}
	
	sortway2(a,b){
		if(a.gn+a.hn>b.gn+b.hn)return -1;
		else if(a.hn==b.hn)return 0;
		else return 1;
	}
	
}




