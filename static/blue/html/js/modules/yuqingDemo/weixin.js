/**
* 
* 【模块】：舆情监测
* 【页面】：微信分析
*  Author: wzl
*/

//公用部分：响应页面请求
//方案id
scheme_id=$("input[name=scheme_id]").val();
post_time=$("input[name=posttime]").val();
begin_time=$("input[name=begin_time]").val();
end_time=$("input[name=end_time]").val();
from_controller="demo";
scheme_category=$("input[name=scheme_category]").val();
var time_flag_wxSentiment = false;
var time_flag_wxMap = false;
var time_flag_wxHeadline = false;
var time_flag_wxAuth = false;
var time_flag_wxWci = false;

//页面加载时调用, 时间：今天，媒体：微信
getWxSentimentData(scheme_id,post_time,begin_time,end_time);	//情感属性
getHotWxData(scheme_id,post_time,begin_time,end_time);	//热门公号
getWxMapData(scheme_id,post_time,begin_time,end_time);	//发布热区
getWCIData(scheme_id,post_time,begin_time,end_time);	//wci分布
getWxHeadlineData(scheme_id,post_time,begin_time,end_time);	//文章位置
getWxAuthTypeData(scheme_id,post_time,begin_time,end_time);	//账号类型

//发布时间
$(".posttime .fl a").bind("click",function(){
	$(".custom").hide();
        time_flag_wxSentiment = true;
        time_flag_wxMap = true;
        time_flag_wxHeadline = true;
        time_flag_wxAuth = true;
        time_flag_wxWci = true;
	post_time=$(this).attr('data-rel');
	getWxSentimentData(scheme_id,post_time,'','');
	getHotWxData(scheme_id,post_time,'',''); 
	getWxMapData(scheme_id,post_time,'','');
	getWCIData(scheme_id,post_time,'','');
	getWxHeadlineData(scheme_id,post_time,'','');
	getWxAuthTypeData(scheme_id,post_time,'','');
});
//自定义时间
$(".searchByCustomTime").bind("click",function(){
	post_time=$(".posttime").find(".aHver").attr('data-rel');
	begin_time=$("input[name=begin_time]").val();
	end_time=$("input[name=end_time]").val();
	if(checkTime(post_time,begin_time,end_time)){
                time_flag_wxSentiment = true;
                time_flag_wxMap = true;
                time_flag_wxHeadline = true;
                time_flag_wxAuth = true;
                time_flag_wxWci = true;
		getWxSentimentData(scheme_id,post_time,begin_time,end_time);
		getHotWxData(scheme_id,post_time,begin_time,end_time); 
		getWxMapData(scheme_id,post_time,begin_time,end_time);
		getWCIData(scheme_id,post_time,begin_time,end_time);
		getWxHeadlineData(scheme_id,post_time,begin_time,end_time);
		getWxAuthTypeData(scheme_id,post_time,begin_time,end_time);
	}
});

//显示加载效果
function data_loading(flag,div_id,msg)
{
	var loading = $('#'+div_id+'-loading');
        //这是加载页面数据
        var reload_info = '<div class="loading"><img src="' + scheme_theme_url + '/images/loading.gif" id="'+ div_id +'-loading" /><p>';
         reload_info += msg+'</p></div>';
         $('#'+div_id).html(reload_info);  
	if(flag){
		loading.show();
	}else{
		loading.hide();
	}
}

function data_loading_2(div_id,tip)
{
	$("#"+div_id).html('<div class="loading"><img src="../../../images/loading.gif"/*tpa=http://yuqing.gsdata.cn/themes/blue/html/images/loading.gif*/ id="'+div_id+'-loading"/><p>'+tip+'</p></div>');
}

function refresh_load(id_name){
	$("#"+id_name).html("<div class='loading'><span class='nodataImg'><a href='javascript:void(0);' class='white_bg'><span   class='refresh_img'></span></a></span></div>");
}
//判断自定义时间筛选条件,自定义时间需控制在30听内
function checkTime(post_time,begin_time,end_time)
{
	if(post_time=='-1')
	{
		//var minute = 1000 * 60;  //2016-06-28 01:05
		//var bngDate = new Date(begin_time.substr(0,4),begin_time.substr(5,2)-1,begin_time.substr(8,2),begin_time.substr(11,2),begin_time.substr(14,2));
		//var endDate = new Date(end_time.substr(0,4),end_time.substr(5,2)-1,end_time.substr(8,2),end_time.substr(11,2),end_time.substr(14,2));
		//计算出相差天数
		//var diffValue = endDate.getTime()-bngDate.getTime();
		//var minC =diffValue/minute;
		if(begin_time=='' || end_time==''){
			warning('开始时间和结束时间都不能为空');
			return false;
		}else if(begin_time >= end_time){
			warning('开始时间不能大于结束时间');
			return false;
		}
		//else if(minC > 43200){
		//    warning('时间间隔不能超过30天');
		//    return false;
		//}
	}
	return true;
}

/************************情感属性********************************/

function getWxSentimentData(scheme_id,post_time,begin_time,end_time)
{
	if( $('#wx_sentiment-loading').length > 0 || time_flag_wxSentiment){
		data_loading(true,'wx_sentiment','情感属性');
                time_flag_wxSentiment =false;
	}else{
		refresh_load('wx_sentiment');
	}
	var chart_refresh='javascript:eval(getWxSentimentData(\"'+scheme_id+'\",\"'+post_time+'\",\"'+begin_time+'\",\"'+end_time+'\"))';
	$.ajax({
		type: 'get',
		url:  '/demo/getWxSentimentData',
		data: {'sid':scheme_id,'post_time':post_time,'begin_time':begin_time,'end_time':end_time,'type':1},		//微信分析：默认type=1
		async: true,
		dataType: 'json',
		success: function (res) {
			if(res.code=='1')
			{
				data_loading(false,'wx_sentiment','情感属性');
				showWxSentimentChart(res.msg);
			}else
			{	
				$("#wx_sentiment").html("<div class='loading' id='wx_sentiment-loading'>"+res.msg+"</div>");
			}
		},
		error: function (res)
		{
			$("#wx_sentiment").html("<div class='loading'><span class='nodataImg'><a href='javascript:void(0);' onclick='"+chart_refresh+"'></a></span></div>");
		}
	});
}

function showWxSentimentChart(ret_data)
{
	var box = echarts.init(document.getElementById('wx_sentiment'));
	var zm = '正面';
	var zx = '中性';
	var fm = '负面';

	option = {
		tooltip :
		{
			trigger: 'item',
			formatter: "{b} : {c} ({d}%)"
		},
		legend:
		{
			orient : 'horizontal',
			x : 'center',
			y :	'255',
			textStyle:{
				color:'#777'
			},
			data:[zm,zx,fm]
		},
		series : [
		{
			name:'情感比例',
			type:'pie',
			radius : ['45%', '68%'],
			itemStyle : {
				normal : {
					label : {
						show : true,
						formatter: "{b} {d}%"
					},
					labelLine : {
						show : true,
						length:10
					}
				},
				emphasis : {
					label : {
						show : false,
						position : 'center',
						textStyle : {
							fontSize : '30',
							fontWeight : 'bold'
						}
					}
				}
			},
			data:[
			{
				value:ret_data['positive']['value'],
				name:ret_data['positive']['name'],
				itemStyle:{
					normal:{color:'#73b6fa'
					}
				}

			},
			{
				value:ret_data['neutral']['value'],
				name:ret_data['neutral']['name'],
				itemStyle:{
					normal:{color:'#f59d62'
					}
				}

			},
			{
				value:ret_data['negative']['value'],
				name:ret_data['negative']['name'],
				itemStyle:{
					normal:{color:'#f57175'
					}
				}

			}
			]
		}
		]
	};
	box.setOption(option);

	box.on('click', function (param) {
		if(!echarts_click_tip()) return false;
		var sentiment=getSentimentValue(param.name);
		var type=1;	//只筛选微信
		var totalcount=param.value;
		if(totalcount=='0')
		{
			warning("暂无数据");
			return false;
		}
		var url="/infolist/mweixin_sentiment?sid="+scheme_id+"&sentiment="+sentiment+"&post_time="+post_time+"&type="+type;
		if(post_time=='-1')
		{
			//自定义时间
			url+="&begin_time="+begin_time+"&end_time="+end_time;
		}
		//totalcount
		url+="&tc="+totalcount;
		url+="&fc="+from_controller+"&sc="+scheme_category;
		window.open(url,"_blank");
	});
}





/************************ 热门公号********************************/
function getHotWxData(scheme_id,post_time,begin_time,end_time)
{
	var chart_refresh='javascript:eval(getHotWxData(\"'+scheme_id+'\",\"'+post_time+'\",\"'+begin_time+'\",\"'+end_time+'\"))';
	$.ajax({
		type: 'get',
		url: '/demo/getHotWxData',
		data: {'sid':scheme_id,'post_time':post_time,'begin_time':begin_time,'end_time':end_time,'type':1},
		async: true,
		dataType: 'json',
		success: function (res)
		{
			if(res.code=='1')
			{
				var data=res.msg.newsList;
				var html = '<table class="table td_2"><tr><td width="25%">'+'头像'+'</td><td width="25%">'+'名称'+'</td><td width="25%">'+'WCI值'+'</td><td width="25%">'+'相关文章数'+'</td></tr>';
				for(var i=0;i<data.length;i++){
					if(data[i]['wx_name'] == ""){
						var src = "../../../images/new/default_wx.jpg"/*tpa=http://yuqing.gsdata.cn/themes/blue/html/images/new/default_wx.jpg*/;
					}else{
						var src = "http://open.weixin.qq.com/qr/code/?username="+data[i]['wx_name'];
					}
					if(data[i]['wx_wci'] == 0){
						var wci = 0;
					}else{
						var wci = data[i]['wx_wci'].toFixed(2);
					}
					if(post_time=='-1')
					{
						data[i]['article_url']+="&begin_time="+begin_time+"&end_time="+end_time;
					}
					html += '<tr>';
                     if(data[i]['is_url_to'] == 1 ){
                        html += '<td><a href="http://www.gsdata.cn/rank/wxdetail?wxname='+data[i]['wx_gsdata_url'];                      }else{                        html += '<td><a href="javascript:void(0)';
                    }
                                       html += '" style="width:26px;height:26px;overflow:hidden;display: inline-block;" target="_blank">'+
					'<img src="'+src+'" style="width:120px;height:120px;margin:-180% 0 0 -180%">'+'</img></a></td>';
					
                                        if(data[i]['is_url_to'] == 1 ){
                                            html += '<td><a href="http://www.gsdata.cn/rank/wxdetail?wxname='+data[i]['wx_gsdata_url'];                                          }else{                                              html += '<td><a href="javascript:void(0)';
                                        }
                                        html += '" target="_blank">'+data[i]['app_name']+'</td>';
					html += '<td><span class="blue">'+wci+'</span></td>';
					if(res.user_id){
						html += '<td><a href="'+data[i]['article_url']+'" target="_blank"><span class="blue">'+data[i]['article_num']+'</span></td>';
					}else{
						html += '<td><a href="javascript:void(0)" onclick="return echarts_click_tip();" target="_blank"><span class="blue">'+data[i]['article_num']+'</span></td>';
					}
					html += '</tr>';
				}
				html +='</table>';
				$("#hotwx").html(html);
			}
			else
			{

				$("#hotwx").html("<div class='loading' id='hotwx-loading'>"+res.msg+"</div>");
			}
		},
		error: function (res)
		{

			$("#hotwx").html("<div class='loading'><span class='nodataImg'><a href='javascript:void(0);' onclick='"+chart_refresh+"'></a></span></div>");
		}
	});
}

/************************发布热区********************************/
//发布热区
function getWxMapData(scheme_id,post_time,begin_time,end_time){

	if( $('#wx_map-loading').length > 0  || time_flag_wxMap ){
		data_loading(true,'wx_map','发布热区');
                time_flag_wxMap = false;
	}else{
		refresh_load('wx_map');
	}
	var chart_refresh='javascript:eval(getWxMapData(\"'+scheme_id+'\",\"'+post_time+'\",\"'+begin_time+'\",\"'+end_time+'\"))';
	$.ajax({
		type: 'get',
		url:  '/demo/getWxMapData',
		data: {'sid':scheme_id,'post_time':post_time,'begin_time':begin_time,'end_time':end_time,'type':1},
		async: true,
		dataType: 'json',
		success: function (res) {
			if(res.code=='1')
			{
				data_loading(false,'wx_map','发布热区');
				showWxMapChart(res.msg,res.maxValue);
			}else
			{
				$("#wx_map").html("<div class='loading' id='wx_map-loading' >暂无数据</div>");
			}
		},
		error: function (res)
		{
			$("#wx_map").html("<div class='loading'><span class='nodataImg'><a href='javascript:void(0);' onclick='"+chart_refresh+"'></a></span></div>");
		}
	});
}

function showWxMapChart(data){
	console.log(data);
	var box = echarts.init(document.getElementById('wx_map'));
	option = {
		tooltip : {
			trigger: 'item',
			formatter: "{b} : {c}"  //设置提示框内容格式
		},

		dataRange: {
			padding:2,
			itemHeight:5,
			itemWidth:15,
			min: data.minValue,
			max: data.maxValue,
			x: 10,
			y: 175,
			textStyle:{
				color:'#777'
			},
			text:['高','低'],           // 文本，默认为数值文本
			calculable : true
		},
		series : [
		{
			name: '地域分布',
			type: 'map',
			mapLocation: {
				x: '17',
				y: 'center'
			},
			mapType: 'china',
			roam: false,
			itemStyle:{

				emphasis:{label:{show:true}}
			},
			data:data.province

		},
		]
	};
	box.setOption(option);
	var nn = data.province.sort(function(x,y){
		return x.value > y.value ? -1:1;
	});

	var mm = nn.slice(0,10);
	var html = '';
	$.each(mm,function(index,item){
		html += '<tr><td>'+ item.name+ '</td><td>'+item.value+'</td></tr>'
	});
	$("#wx_order_tbody ").html(html);
	$("#monitor_wx_order").show();

	box.on("click",function(param){
		if(!echarts_click_tip()) return false;
		var sentiment=0;
		var type=1;
		var totalcount=param.value;
		if(totalcount=='0')
		{
			warning("暂无数据");
			return false;
		}
		var url="/infolist/mweixin_map?sid="+scheme_id+"&np="+param.name+"&sentiment="+sentiment+"&post_time="+post_time+"&type="+type;
		if(post_time=='-1')
		{
			//自定义时间
			url+="&begin_time="+begin_time+"&end_time="+end_time;
		}
		//totalcount
		url+="&tc="+totalcount;
		url+="&fc="+from_controller+"&sc="+scheme_category;
		window.open(url,"_blank");
	});
}




/************************WCI分布********************************/
function getWCIData(scheme_id,post_time,begin_time,end_time){
	if( $('#wx_wci-loading').length > 0 || time_flag_wxWci){
		data_loading(true,'wx_wci','WCI分布');
                time_flag_wxWci = false;
	}else{
		refresh_load('wx_wci');
	}
	var chart_refresh='javascript:eval(getWCIData(\"'+scheme_id+'\",\"'+post_time+'\",\"'+begin_time+'\",\"'+end_time+'\"))';
	$.ajax({
		type: 'get',
		url:  '/demo/getWCIData',
		data: {'sid':scheme_id,'post_time':post_time,'begin_time':begin_time,'end_time':end_time,'type':1},
		async: true,
		dataType: 'json',
		success: function (res) {
			if(res.code=='1')
			{
				data_loading(false,'wx_wci','WCI分布');
				showWCIChart(res.msg);
			}else
			{
				$("#wx_wci").html("<div class='loading' id='wx_wci-loading'>"+res.msg+"</div>");
			}
		},
		error: function (res)
		{
			$("#wx_wci").html("<div class='loading'><span class='nodataImg'><a href='javascript:void(0);' onclick='"+chart_refresh+"'></a></span></div>");
		}
	});
}

function showWCIChart(data)
{
	var tmp = data.count;
	var max = tmp[0];
	for(var i=1;i<tmp.length;i++){

		if(max<tmp[i])max=tmp[i];
	}
	var maxdata = max + Math.ceil(max/5);

	var box = echarts.init(document.getElementById('wx_wci'));
	option = {
		grid: {
			borderWidth: 0,
			y : 35,
			x2 :45,
			x:12,
			y2:30
		},
		xAxis : [
		{

			name:'WCI',
			type : 'category',
			axisLine: {
				lineStyle: {
					color: '#ccc',
					width: 1
				}
			},
			nameTextStyle:{
				color: '#73b6fa'
			},
			splitLine: {
				show: false
			},
			axisTick : {    // 轴标记
				show:false
			},
			splitArea: {
				show: false
			},
			axisLabel: {
				show: true,
				textStyle:{
					color: '#777',
					fontSize:12
				}
			},
			data :data.wci

		}
		],
		yAxis : [
		{
			name:'公号个数',
			type : 'value',
			nameLocation:'end',
			max:maxdata,
			axisLabel : {
				show: false,
				formatter : function(params){
					var newParams = "";
					var paramsNameNumber = params.toString().length;
					if(paramsNameNumber >= 5){
						newParams =  (params / 10000) + 'w';

					} else{
						newParams = params;
					}
					// alert(newParams);
					return newParams;
				}
			},
			axisLine: {
				lineStyle: {
					width: 0
				}
			},
			nameTextStyle:{
				align: 'left',
				color: '#73b6fa'
			},
			splitLine: {
				show: true,
				lineStyle: {
					color: '#ebebeb'
				}
			},
			splitArea: {
				show: false
			}

		}
		],
		series : [
		{
			name:'公号个数',
			type:'bar',
			clickable: false,
			barWidth:40,
			itemStyle:{
				normal:{
					color:'#5bb0f0',
					label:{
						show:true
					}
				}
			},

			data:data.count
		}
		]
	};
	box.setOption(option);

}


/************************头条统计********************************/
function getWxHeadlineData(scheme_id,post_time,begin_time,end_time){

	if( $('#wx_headline-loading').length > 0 || time_flag_wxHeadline){
		data_loading(true,'wx_headline','头条统计');
                time_flag_wxHeadline = false;
	}else{
		refresh_load('wx_headline');
	}
	var chart_refresh='javascript:eval(getWxHeadlineData(\"'+scheme_id+'\",\"'+post_time+'\",\"'+begin_time+'\",\"'+end_time+'\"))';
	$.ajax({
		type: 'get',
		url:  '/demo/getWxHeadlineData',
		data: {'sid':scheme_id,'post_time':post_time,'begin_time':begin_time,'end_time':end_time,'type':1},
		async: true,
		dataType: 'json',
		success: function (res) {
			if(res.code=='1')
			{
				data_loading(false,'wx_headline','头条统计');
				showWxHeadlineChart(res.msg);
			}else
			{
				$("#wx_headline").html("<div class='loading' id='wx_headline-loading' >"+res.msg+"</div>");
			}
		},
		error: function (res)
		{
			$("#wx_headline").html("<div class='loading'><span class='nodataImg'><a href='javascript:void(0);' onclick='"+chart_refresh+"'></a></span></div>");
		}
	});
}

function showWxHeadlineChart(data)
{
	var tmp = data.wxcount;
	var max = tmp[0];
	for(var i=1;i<tmp.length;i++){

		if(max<tmp[i])max=tmp[i];
	}
	//var maxdata = max + Math.ceil(max/5);
	var maxdata = max;
	
	var box = echarts.init(document.getElementById('wx_headline'));
	option = {
		grid: {
			borderWidth: 0,
			y :25,
			x2 :20,
			x:12,
			y2:30
		},
		xAxis : [
		{
			//name:'文章位置',
			type : 'category',
			axisLabel: {
				show: true,
				textStyle:{
					color: '#777',
					fontSize:12
				}
			},
			axisLine: {
				lineStyle: {
					color: '#ccc',
					width: 1
				}
			},
			nameTextStyle:{
				color: '#73b6fa'
			},
			splitLine: {
				show: false
			},
			axisTick : {    // 轴标记
				show:false
			},
			splitArea: {
				show: false
			},
			data :data.position

		}
		],
		yAxis : [
		{
			//name:'公号个数',
			type : 'value',
			max:maxdata,
			axisLabel : {
				show: false,
				formatter : function(params){
					var newParams = "";
					var paramsNameNumber = params.toString().length;
					if(paramsNameNumber >= 5){
						newParams =  (params / 10000) + 'w';

					} else{
						newParams = params;
					}
					// alert(newParams);
					return newParams;
				}
			},
			axisLine: {
				lineStyle: {
					color: '#ebebeb',
					width: 0
				}
			},
			nameTextStyle:{
				align: 'left',
				color: '#73b6fa'
			},
			splitLine: {
				show: true,
				lineStyle: {
					color: '#ebebeb'
				}
			},
			splitArea: {
				show: false
			}
		}
		],
		series : [
		{
			name:'公号个数',
			type:'bar',
			barWidth:30,
			itemStyle:{
				normal:{
					color:'#5bb0f0',
					label:{
						show:true,
						formatter : function(params){
							var newParams = params.value + '篇';
							return newParams;
						}
					}
				}
			},

			data:data.wxcount
		}
		]
	};
	box.setOption(option);

	box.on("click",function(param){
		if(!echarts_click_tip()) return false;
		var sentiment=0;
		var type=1;
		var headline_value=getHeadlineValue(param.name);
		//浏览器会过滤掉+好，将+换成more 五条+ --> 五条more
		var headline_name=param.name.replace(/\+/,"more");
		var totalcount=param.value;
		if(totalcount=='0')
		{
			warning("暂无数据");
			return false;
		}
		var url="/infolist/mweixin_headline?sid="+scheme_id+"&hl="+headline_value+"&hlname="+headline_name+"&sentiment="+sentiment+"&post_time="+post_time+"&type="+type;
		if(post_time=='-1')
		{
			//自定义时间
			url+="&begin_time="+begin_time+"&end_time="+end_time;
		}
		//totalcount
		url+="&tc="+totalcount;
		url+="&fc="+from_controller+"&sc="+scheme_category;
		window.open(url,"_blank");
	});
}

/*********************************账号类型********************************/
function getWxAuthTypeData(scheme_id,post_time,begin_time,end_time){
	if( $('#wx_authType-loading').length > 0 || time_flag_wxAuth){
		data_loading(true,'wx_authType','账号类型');
                time_flag_wxAuth = false;
	}else{
		refresh_load('wx_authType');
	}
	var chart_refresh='javascript:eval(getWxAuthTypeData(\"'+scheme_id+'\",\"'+post_time+'\",\"'+begin_time+'\",\"'+end_time+'\"))';
	$.ajax({
		type: 'get',
		url:  '/demo/getWxAuthTypeData',
		data: {'sid':scheme_id,'post_time':post_time,'begin_time':begin_time,'end_time':end_time,'type':1},
		async: true,
		dataType: 'json',
		success: function (res) {
			if(res.code=='1')
			{
				data_loading(false,'wx_authType','账号类型');
				showWxAuthTypeChart(res.msg);
			}else
			{
				$("#wx_authType").html("<div class='loading' id='wx_authType-loading'>"+res.msg+"</div>");
			}
		},
		error: function (res)
		{
			$("#wx_authType").html("<div class='loading'><span class='nodataImg'><a href='javascript:void(0);' onclick='"+chart_refresh+"'></a></span></div>");
		}
	});
}

function showWxAuthTypeChart(data)
{
	var box = echarts.init(document.getElementById('wx_authType'));
	option = {
		title:{

		},
		tooltip :
		{
			trigger: 'item',
			formatter: "{b} : {c} ({d}%)"
		},
		color:['#f57175', '#73b6fa'],
		legend: {
			x : 'center',
			y : '255',
			textStyle:{
				color:'#777'
			},
			data:data.authType
		},
		series : [
		{
			name:'发文数',
			type:'pie',
			clickable: false,
			radius : ['45%', '68%'],
			itemStyle : {
				normal : {
					label : {
						show : true,
						formatter: "{b} {d}%"

					},
					labelLine : {
						show : true,
						length:10
					}
				},
				emphasis : {
					label : {
						show : false,
						position : 'center',
						textStyle : {
							fontSize : '30',
							fontWeight : 'bold'
						}
					}
				}
			},
			data:data.count
		}
		]
	};
	box.setOption(option);

}