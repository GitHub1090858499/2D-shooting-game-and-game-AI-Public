/**
*
* 作用:游戏胜利或失败的监听器
*/
(function(){
	var appEventlistener =  Listener.extend({
		init:function(param){
			//监听器是否生效
			this.enabled = true;
			this.beforeRender = param.beforeRender||this.beforeRender;
			this.afterRender = param.afterRender||this.afterRender;
			this.beforeUpdate = param.beforeUpdate||this.beforeUpdate;
			this.afterUpdate = param.afterUpdate||this.afterUpdate;
		},
		beforeRender:function(){
			
		},
		afterRender:function(){
			
		},
		beforeUpdate:function(){
			
		},
		afterUpdate:function(){
			
		}
		
		
	});
	
	
})();