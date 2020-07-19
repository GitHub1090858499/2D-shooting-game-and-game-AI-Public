/**
 * Ai回避寻路类，必须有map.js导航化的数据地图和view.js，作分析
 * 这里的实现只用简单两点之间是否有障碍物来实现,平行线的漏洞
 * 被用于sceneGame（mapsizeW、map等），同时也依靠sceneGame（rObjs等）
 */
class Avoid{
	map = null;
	//构造函数，map为二维数组，其参数要考虑地图编辑的标准（即单位格子的大小）
	constructor(scene){
		this.scene = scene;
		this.walkLink=[];
		this.map=scene.mapFind.map;
		this.view=scene.view;
	}

	
	
	//最近视野外的寻路，
	findway(sx,sy){
		//若坐标不合法或者map出错则退出
		let bool1=sx<0||sx>this.map[0].length-1||sy<0||sy>this.map.length-1;
		// let bool2=(fx==undefined||fy==undefined)||fx<0||fx>this.map[0].length-1||fy<0||fy>this.map.length-1;
		if(bool1)return "error";
		//创建open表，表示为待扩展的节点
		let open = [];
		let openO = {};
		//初始化open表
		open[0]=new GraphNode1(sx,sy,this.map);
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
		
		//循环直到open表为空
		while(open.length>0){
			//从open取出评估值最小的点，越小的在越后面
			nNode = open.pop();
			delete openO[nNode.toString()];
			
			//放入close中
			close.push(nNode);
			closeO[nNode.toString()] = nNode;
			
			
			// if(nNode.x==fx&&nNode.y==fy)break;
			let x = nNode.x*this.scene.mapFind.mapsizeW+5;
			let y = nNode.y*this.scene.mapFind.mapsizeH+5;
			let a1 = this.scene.view.findpoint(this.scene.namedRObjs["TheOne"].x,this.scene.namedRObjs["TheOne"].y,x,y,20);
			let v1=this.view.canSee(this.scene.namedRObjs["TheOne"].x,this.scene.namedRObjs["TheOne"].y,a1.x1,a1.y1);
			let vc=this.view.canSee(this.scene.namedRObjs["TheOne"].x,this.scene.namedRObjs["TheOne"].y,x,y);
			let v2=this.view.canSee(this.scene.namedRObjs["TheOne"].x,this.scene.namedRObjs["TheOne"].y,a1.x2,a1.y2);
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
					let node1 =new GraphNode1(e.getNodeX(nNode),e.getNodeY(nNode));
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
		this.walkLink.length=0;
		nNode=nNode.father;
		while(nNode!=null&&nNode.father!=null){
			// if(nNode.father.x<nNode.x)this.walkLink.push("left");
			// else if(nNode.father.x>nNode.x)this.walkLink.push("right");
			// else if(nNode.father.y<nNode.y)this.walkLink.push("up");
			// else if(nNode.father.y>nNode.y)this.walkLink.push("down");
			this.walkLink.push({"y":nNode.y,"x":nNode.x});
			nNode=nNode.father;
		};
		return this.walkLink;
	}
	sortway(a,b){
		if(a.gn>b.gn)return -1;
		else if(a.gn==b.gn)return 0;
		else return 1;
	}
}


//map专用的节点，x，y为标志，,专门用来创建所有可行走的边
class GraphNode1{
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
		GraphNode1.map = GraphNode1.map||map;
		this._edgeAdd();
	}
	//点是否为可行走的区间
	_ifInWalk(x,y){
		return GraphNode1.map[y][x]==0||GraphNode1.map[y][x]==2;
	}
	//需要联合map来创建边
	_edgeAdd(){
		if(this.x-2>=0&&this._ifInWalk(this.x-2,this.y)&&this._ifInWalk(this.x-2,this.y-1)&&this._ifInWalk(this.x-2,this.y+1)){
			// this.edge.push(new GraphNode1(this.x-1,this.y,GraphNode1.maxX,GraphNode1.maxY))
			this.edge.push(new GraphEdge(this.x,this.y,this.x-1,this.y,1));
		}
		if(this.x+2<=GraphNode1.map[0].length-1&&this._ifInWalk(this.x+2,this.y)&&this._ifInWalk(this.x+2,this.y-1)&&this._ifInWalk(this.x+2,this.y+1)){
			// this.edge.push(new GraphNode1(this.x+1,this.y,GraphNode1.maxX,GraphNode1.maxY))
			this.edge.push(new GraphEdge(this.x,this.y,this.x+1,this.y,1));
		}
		if(this.y-2>=0&&this._ifInWalk(this.x,this.y-2)&&this._ifInWalk(this.x-1,this.y-2)&&this._ifInWalk(this.x+1,this.y-2)){
			// this.edge.push(new GraphNode1(this.x,this.y-1,GraphNode1.maxX,GraphNode1.maxY))
			this.edge.push(new GraphEdge(this.x,this.y,this.x,this.y-1,1));
		}
		if(this.y+2<=GraphNode1.map.length-1&&this._ifInWalk(this.x,this.y+2)&&this._ifInWalk(this.x-1,this.y+2)&&this._ifInWalk(this.x+1,this.y+2)){
			// this.edge.push(new GraphNode1(this.x,this.y+1,GraphNode1.maxX,GraphNode1.maxY))
			this.edge.push(new GraphEdge(this.x,this.y,this.x,this.y+1,1));
		}
		
		
	}
	
	toString(){
		return "("+this.x+","+this.y+")";
	}
	
};