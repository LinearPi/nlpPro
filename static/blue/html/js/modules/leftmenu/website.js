var Website = {
	run: function(){
		for(var a=1;a<=$('.scrollMenu').length;a++){
			oScroll = $("#scrollbar"+a);
			if(oScroll.length > 0){
				oScroll.tinyscrollbar();
				oScroll.data("plugin_tinyscrollbar").update(offsetT_cur1);
			}	
		}		
					
	}
	
};
//Initialize
$(document).ready(function(){
	Website.run();
});