// document.write("<script language=javascript src='scripts/jquery-3.4.1.js'></script>");
// document.write("<script language=javascript src='scripts/xcore.js'></script>");

// //测试一：gameFrames、events
// document.write("<script language=javascript src='scripts/engine/gameFrames.js'></script>");
// document.write("<script language=javascript src='scripts/engine/listener.js'></script>");

// //测试二：
// document.write("<script language='JavaScript' src='scripts/engine/scene.js'></script>");
// document.write("<script language='JavaScript' src='scripts/engine/sceneManager.js'></script>");


// //测试三：
// document.write("<script language='JavaScript' src='scripts/engine/renderObj.js'></script>")
// document.write("<script language='JavaScript' src='scripts/engine/renderObjSon/renderObjBlock.js'></script>")

// //测试四：
// document.write("<script language='JavaScript' src='scripts/renderFunction.js'></script>")
// document.write("<script language='JavaScript' src='scripts/engine/renderObjSon/renderObjMan.js'></script>")
// document.write("<script language='JavaScript' src='scripts/engine/renderObjSon/renderObjBullet.js'></script>")
// document.write("<script language='JavaScript' src='scripts/engine/renderObjSon/renderObjBadMan.js'></script>")
// document.write("<script language='JavaScript' src='scripts/engine/listeners/listenerCrash.js'></script>")
// document.write("<script language='JavaScript' src='scripts/engine/renderObjSon/renderObjEndGame.js'></script>")
// document.write("<script language='JavaScript' src='scripts/engine/renderObjSon/renderObjMenu.js'></script>")
// document.write("<script language='JavaScript' src='scripts/engine/scenes/sceneGame.js'></script>")
// document.write("<script language='JavaScript' src='scripts/engine/scenes/sceneMenu.js'></script>")
// document.write("<script language='JavaScript' src='scripts/engine/scenes/SceneEnd.js'></script>")

// //测试五：
// document.write("<script language='JavaScript' src='scripts/engine/ai/map.js'></script>")
// document.write("<script language='JavaScript' src='scripts/engine/ai/view.js'></script>")
// document.write("<script language='JavaScript' src='scripts/engine/ai/avoid.js'></script>")




// document.write("<script language=javascript src='scripts/engine/game.js'></script>");

class SyLoadjs{
	
	constructor(arg) {
	   this.jsSrc=[]; 
	   this.jsCallBack={};
	}
	
	
	loadJS(url){
		let ss=this;
		var script = document.createElement('script'),

			fn = function(){
					ss.loadJS(ss.jsCallBack[url]);
				}||function(){};

		script.type = 'text/javascript';

		

		//IE
		if(script.readyState){

			script.onreadystatechange = function(){

				if( script.readyState == 'loaded' || script.readyState == 'complete' ){

					script.onreadystatechange = null;

					fn();

				}

			};

		}else{

			//其他浏览器

			script.onload = function(){

				fn();

			};

		}

		script.src = url;

		document.getElementsByTagName('head')[0].appendChild(script);

	}

	add(src){
		this.jsSrc.push(src);
	}
	
	clearJsSrc(){
		this.jsSrc.length=0;
	}
	
	loadJsSy(){
		for(let a=0;a<this.jsSrc.length-2;a++){
			this.jsCallBack[this.jsSrc[a]]=this.jsSrc[a+1];
		}
		this.jsCallBack[this.jsSrc[this.jsSrc.length-1]]=function(){};
		this.loadJS(this.jsSrc[0]);
	}
	
}



var syLoadjs = new SyLoadjs();




syLoadjs.add("scripts/xcore.js");

//测试一：gameFrames、events
syLoadjs.add("scripts/engine/gameFrames.js");
syLoadjs.add("scripts/engine/listener.js");

//测试二：
syLoadjs.add("scripts/engine/scene.js");
syLoadjs.add("scripts/engine/sceneManager.js");


//测试三：
syLoadjs.add("scripts/engine/renderObj.js");
syLoadjs.add("scripts/engine/renderObjSon/renderObjBlock.js");

//测试四：
syLoadjs.add("scripts/renderFunction.js");
syLoadjs.add("scripts/engine/renderObjSon/renderObjMan.js");
syLoadjs.add("scripts/engine/renderObjSon/renderObjBullet.js");
syLoadjs.add("scripts/engine/renderObjSon/renderObjBadMan.js");
syLoadjs.add("scripts/engine/listeners/listenerCrash.js");
syLoadjs.add("scripts/engine/renderObjSon/renderObjEndGame.js");
syLoadjs.add("scripts/engine/renderObjSon/renderObjMenu.js");
syLoadjs.add("scripts/engine/scenes/sceneGame.js");
syLoadjs.add("scripts/engine/scenes/sceneMenu.js");
syLoadjs.add("scripts/engine/scenes/SceneEnd.js");

//测试五：
syLoadjs.add("scripts/engine/ai/map.js");
syLoadjs.add("scripts/engine/ai/view.js");
syLoadjs.add("scripts/engine/ai/avoid.js");


syLoadjs.add("scripts/engine/game.js");
syLoadjs.add("scripts/main.js");


syLoadjs.loadJsSy();	