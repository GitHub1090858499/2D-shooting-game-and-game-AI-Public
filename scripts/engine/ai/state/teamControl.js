/**
*  团队控制，被新建于scene中,主要BadMan传递信息在此，其他BadMan接受其命令
*/
class TeamControl{
	//参数为scene
	constructor(arg) {
	    this.scene=arg;
		//下属
		this.teamlink=[];
		this.teamOb={};
		//正在命令中的下属
		this.orderTeamO={};
		//用于检测命令的下属是否还生存
		this.orderTeam=[];
		//下达的命令,字符类型
		this.order="not";
		//进攻人数
		this.num=1;
	}
	//指定头领
	setMainBadMan(ai){
		this.leader=ai;
	}
	//自动设置头领
	setLeaderAsScene(){
		for(let a of this.scene.rObjs){
			if(a.classN=="BadMan"&&a.leader==true){
				this.setMainBadMan(a);
				break;
			}
		}
	}
	//检测命令是否已经失败
	checkorderTeamO(){
		if(this.order=="not")return false;
		let ordt=this.orderTeam; 
		for(let a in ordt){
			if(ordt[a].isdie==false)return false;
		}
		// if(this.order!="not"&& ordt.length==0)return true;
		// else false;
		this.num++;
		return true;
	}
	//更新下属团队
	updateUnder(){
		//清除
		this.teamlink=[];
		this.teamOb={};
		//重新添加
		for(let a of this.scene.rObjs){
			if(a.classN=="BadMan"&&a.leader==false){
				this.teamlink.push(a);
				this.teamOb[a.name]=a;
			}
		}
	}
	//排序，距离 像素格式 x,y 最近的在前面
	_sortColseToXY(x,y){
		if(x>this.scene.w||y>this.scene.h||x<0||y<0)return false;
		
		
		let sw = this.scene.mapFind.mapsizeW;
		let sh = this.scene.mapFind.mapsizeH;
		
		let lmapx=Math.floor(x/sw);
		let lmapy=Math.floor(y/sw);
		
		let amapx;
		let amapy;
		
		let bmapx;
		let bmapy;
		let al;
		let bl;
		let thisclass=this;
		this.teamlink.sort(function(a,b){
			bmapx = Math.floor(b.x/sw);
			bmapy = Math.floor(b.y/sh);
			amapx = Math.floor(a.x/sw);
			amapy = Math.floor(a.y/sh);
			al=thisclass.scene.mapFind.findway(lmapx,lmapy,amapx,amapy);
			bl=thisclass.scene.mapFind.findway(lmapx,lmapy,bmapx,bmapy);
			if(al!=false&&(bl==false||al.length>bl.length))return -1;
			else if(bl!=false&&(al==false||bl.length>al.length))return 1;
			else return 0;
		});
	}
	//排序，离leader最近的在前面
	_sortColseTOLeader(){
		this._sortColseToXY(this.leader.x,this.leader.y);
		
	}
	//排序，离TheOne最近的在前面
	_sortColseTOTheOne(){
		let theone = this.scene.namedRObjs["TheOne"];
		this._sortColseToXY(theone.x,theone.y);
	}
	
	//排序，血量最多的在前面
	_sortHpH(){
		this.teamlink.sort(function(a,b){
			if(a.hp>b.hp)return -1;
			else if(a.hp==b.hp)return 0;
			else return 1;
		});
	}
	//排序，血量少的在前面
	_sortHpL(){
		this.teamlink.sort(function(a,b){
			if(a.hp<b.hp)return -1;
			else if(a.hp==b.hp)return 0;
			else return 1;
		});
	}
	//命令，血量最多的两个下属进攻
	orderHpHAttack(){
		//已经有命令则退出
		if(this.order!="not")return;
			
		this._sortHpH();
		let num=this.num;
		this.orderTeamO={};
		this.orderTeam=[];
		//取出
		for(let i=0;i<this.teamlink.length-1&&i<num;i++){
			this.orderTeam.push(this.teamlink[i]);
			this.orderTeamO[this.teamlink[i].name]=this.teamlink[i];
		};
		//设置命令
		this.order="attack";
		this._scendToMess();
		
		window.sendText.push({
			"name":"首领",
			"action":"下达命令",
			"C":num+"人刺杀TheONe",
			})
	}
	//命令，清空命令
	orderClear(){
		//清除任务命令指标
		for(let a in this.orderTeam){
			if(this.orderTeam[a].isdie==false)this.orderTeam[a].ifInMission=="not";
		}
		//设置中间插件的命令
		this.order="not";
		this.orderTeamO={};
		this.orderTeam=[];
		//发送命令
		this._scendToMess();
	}
	//传送命令到OrderMess
	_scendToMess(){
		this.scene.orderMess.setOrder(this.order);
		this.scene.orderMess.setUnder(this.orderTeamO);
	}
	//按照Mess发出命令
	orderAsMess(){
		let mess=this.scene.orderMess.getMess();
		if(mess["hasSeeTheOne"]>0){
			this.orderHpHAttack();
			// mess["hasSeeTheOne"]=0;
		}
		
	}
}

/**
 * 消息中间插件，被用在scene
 */
class OrderMess{
	constructor() {
		
		this.underO={};
		this.mess={};
	}
	setOrder(order){
		this.order=order;
	}
	setUnder(underO){
		this.underO=underO;
	}
	//获取命令
	getOrder(name){
		let ai=this.underO[name];
		if(ai==null)return "not";
		else {
			let order=this.order;
			return order;
			
		}
	}
	//上传信息
	uploadMess(mess){
		let ss=this.mess[mess]==null?1:this.mess[mess]+1;
		this.mess[mess]=ss;
	}
	//获得信息
	getMess(){
		return this.mess;
	}
}

/**
 * 命令听从程序，被用在BadMan中
 */
class OrderListener{
	constructor(under,orderMess){
		this.under=under;
		this.orderMess=orderMess;
	}
	//执行命令
	runOrder(name){
		let order=this.orderMess.getOrder(name);
		if(order=="avoid"){
			this.under.stateControl.state=this.under.stateControl.stateAvoid;
		}
		//手刀命令
		else if(order=="attack"||(order=="not"&&this.under.ifInMission=="attack"&&this.orderMess.mess["hasSeeTheOne"]>0)){
			if(this.under.stateControl.state!=this.under.stateControl.stateKnife){
				this.under.stateControl.state=this.under.stateControl.stateKnife;
				this.under.ifInMission="attack";
				this.under.stateControl.state.setInit();
				delete this.orderMess.underO[name];
			}
			window.sendText.push({
				"name":name,
				"action":"接收命令",
				"C":"刺杀TheONe",
				})
		}
	}
	
	//取消命令，进入状态
	clearOrder(){
		
		this.under.stateControl.state=this.under.stateControl.stateAlert;
	}
	//上传mess,字符类型
	uploadMess(mess){
		
		this.orderMess.uploadMess(mess);
	}
	
}