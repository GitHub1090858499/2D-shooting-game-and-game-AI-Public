
let holder = document.getElementById("gameHolder")||document.body;

let g = new Game();
window.thegame=g;

g.runGame();
let scManager = g.sceneManager;
//创建场景sc game
let sc = scManager.createScene("SceneGame",[
	{
		"x"	:0,
		"y"	:0,
		"w"	:600,
		"h"	:400,
		"color":"white",
		"hod":holder,
	}
]);		
sc.startGame();

//创建新的场景sc2 Menu
let sc2 = scManager.createScene("SceneMenu",
	[{
		"x"	:0,
		"y"	:0,
		"w"	:600,
		"h"	:430,
		"color":"rgba(255, 240, 230, 1)",
		"hod":holder,
	}]
);	

//创建新的场景结束场景sc3 End
let sc3 = scManager.createScene("SceneEnd",[
	{
		"x"	:0,
		"y"	:0,
		"w"	:600,
		"h"	:430,
		"color":"rgba(255, 1,1 , 0.5)",
		"hod":holder,
	}
]);	
		

scManager.bringToTop(sc);