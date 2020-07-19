/**
 * 模糊逻辑
 * 与controlState.js密切耦合,被其调用
 */

class FuzzyLogic{
	
	constructor(arg) {
	    
	}
	
	//可射击隶属度(x=0~1000)
	shootAllow(x){
		let y;
		if(x<=250)y=1;
		else if(x>250&&x<750){
			y=(-1/500)*(x-250)+1;
		}
		else if(x>=750){
			y=0;
		}
		return y;
	}
	//不可射击隶属度
	shootDeny(x){
		let y;
		if(x<=250)y=0;
		else if(x>250&&x<750){
			y=(1/500)*(x-750)+1;
		}
		else if(x>=750){
			y=1;
		}
		return y;
	}
	//hp虚弱的隶属度 范围0~100；
	hpLow(x){
		let y;
		if(x<=0){
			y=1
		}
		else if(x>0&&x<=20){
			y=0.8;
		}
		else if(x>20&&x<=80){
			y=(-1/75)*(x-20)+0.8;
		}
		else if(x>80){
			y=0;
		}
		return y;
	}
	
	//hp良好的隶属度 
	hpHight(x){
		let y;
		if(x<=40){
			y=0;
		}
		else  if(x>40&&x<=80){
			y=(1/40)*(x-80)+1;
		}
		else if(x>80){
			y=1;
		}
		return y;
	}
	
	
	//想攻击的隶属度 范围0~100
	attackWant(x){
		let y;
		if(x<=0){
			y=0;
		}
		else if(x>0&&x<=50){
			y=(1/50)*(x-50)+1;
		}
		else if(x>50){
			y=1;
		}
		return y;
	}
	//不想攻击的隶属度
	attackNot(x){
		let y;
		if(x<=25){
			y=1;
		}
		else if(x>25&&x<=50){
			y=(-1/25)*(x-25)+1;
		}
		else if(x>50){
			y=0;
		}
		return y;
	}
}