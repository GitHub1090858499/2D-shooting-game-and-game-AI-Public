


(function(win){
	/**
	 * @param {Object} win window
	 * 作用:父类监听器,需要被继承才能使用
	 */
	var EListener  = win.Listener = Class.extend({
		init:function(){
			throw Error("This class not been inherited");
			this.enabled = false;
		},
		
	});
	
	/**
	 * 具体的监听类:每次渲染前后执行的内容
	 * 用法:通过传递初始化时的对象参数更新beforeRender,afterRender
	 * 需要结合app.js 里面的game.addlsitener( Eventlistener对象 )来生效
	 */	
	var appEventlistener = win.ListenerEmpty = Listener.extend({
		init:function(param){
			//监听器是否生效
			this.enabled = true;
			this.beforeRender = param['beforeRender']||this.beforeRender;
			this.afterRender = param["afterRender"]||this.afterRender;
		},
		beforeRender:function(){
			
		},
		afterRender:function(){
			
		},
		
	});
})(window);



