/**
*  Author:wzl
* 【模块】：舆情监测
* 【页面】：微博分析
*/

//公用部分：响应页面请求(全局变量)
scheme_id=$("input[name=scheme_id]").val();
post_time=$("input[name=posttime]").val();
begin_time=$("input[name=begin_time]").val();
end_time=$("input[name=end_time]").val();
from_controller="demo";
scheme_category=$("input[name=scheme_category]").val();
var time_flag_wbSentiment = false;
var time_flag_wbFollow = false;
var time_flag_wbQuality = false;
var time_flag_wbMap = false;
var time_flag_wbType = false;
//发布时间
$(".posttime .fl a").bind("click",function(){
        time_flag_wbSentiment = true;
        time_flag_wbFollow = true;
        time_flag_wbQuality = true;
        time_flag_wbMap = true;
        time_flag_wbType = true;
	$(".custom").hide();
	post_time=$(this).attr('data-rel');
	var type=$(".type").find(".aHver").attr('data-rel');
	getWbSentiment(scheme_id,post_time,'','',3);                //情感属性
	getFollowerType(scheme_id,post_time,'','',3);  //粉丝性别
	getAccountType(scheme_id,post_time,'','',3);  //认证类型
	getWbMap(scheme_id,post_time,'','',3); //地域分布
	getHotAccount(scheme_id,post_time,'','',3); //热门账号
	getFollowerQuality(scheme_id,post_time,'','',3); //粉丝质量
});

//自定义时间
$(".searchByCustomTime").bind("click",function(){
	post_time=$(".posttime").find(".aHver").attr('data-rel');
	begin_time=$("input[name=begin_time]").val();
	end_time=$("input[name=end_time]").val();
	if(checkTime(post_time,begin_time,end_time)){
                time_flag_wbSentiment = true;
                time_flag_wbFollow = true;
                time_flag_wbQuality = true;
                time_flag_wbMap = true;
                time_flag_wbType = true;
		getWbSentiment(scheme_id,post_time,begin_time,end_time,3);                //情感属性
		getFollowerType(scheme_id,post_time,begin_time,end_time,3);  //粉丝性别
		getAccountType(scheme_id,post_time,begin_time,end_time,3);  //认证类型
		getWbMap(scheme_id,post_time,begin_time,end_time,3); //地域分布
		getHotAccount(scheme_id,post_time,begin_time,end_time,3); //热门账号
		getFollowerQuality(scheme_id,post_time,begin_time,end_time,3); //粉丝质量
	}
});

//页面首次打开加载
getWbSentiment(scheme_id,post_time,begin_time,end_time,3); //情感属性 
getHotAccount(scheme_id,post_time,begin_time,end_time,3);  //热门账号
getFollowerType(scheme_id,post_time,begin_time,end_time,3); //账号性别
getFollowerQuality(scheme_id,post_time,begin_time,end_time,3); //粉丝质量
getWbMap(scheme_id,post_time,begin_time,end_time,3); //发布热区
getAccountType(scheme_id,post_time,begin_time,end_time,3); //认证类型

//显示加载效果
function data_loading(flag,id,msg)
{
	var loading = $('#'+id+'_loading');
        //这是加载页面数据
         var reload_info = '<div class="loading"><img src="' + scheme_theme_url + '/images/loading.gif" id="'+ id +'_loading" /><p>';
         reload_info += msg+'</p></div>';
         $('#'+id).html(reload_info);  
	if(flag){
		loading.show();
	}else{
		loading.hide();
	}
}

function data_loading_2(div_id,tip)
{
	$("#"+div_id).html('<div class="loading"><img src="../../../images/loading.gif"/*tpa=http://yuqing.gsdata.cn/themes/blue/html/images/loading.gif*/ id="'+div_id+'_loading"/><p>'+tip+'</p></div>');
}

function refresh_load(id_name){
	$("#"+id_name).html("<div class='loading'><span class='nodataImg'><a href='javascript:void(0);' class='white_bg'><span   class='refresh_img'></span></a></span></div>");
}
//判断自定义时间筛选条件，自定义时间需控制在30天内
function checkTime(post_time,begin_time,end_time)
{
	if(post_time=='-1')
	{
		if(begin_time=='' || end_time==''){
			warning('开始时间和结束时间都不能为空');
			return false;
		}else if(begin_time >= end_time){
			warning('开始时间不能大于结束时间');
			return false;
		}
	}
	return true;
}



/************************情感属性********************************/
function getWbSentiment(scheme_id,post_time,begin_time,end_time,type)
{
	if( $('#wb_sentiment_loading').length > 0 || time_flag_wbSentiment ){
		data_loading(true,'wb_sentiment','情感属性');
                time_flag_wbSentiment =false;
	}else{
		refresh_load('wb_sentiment');
	}
	var chart_refresh='javascript:eval(getWbSentiment(\"'+scheme_id+'\",\"'+post_time+'\",\"'+begin_time+'\",\"'+end_time+'\",\"'+type+'\"))';
	$.ajax({
		type: 'post',
		url:  '/demo/getEmotionAttrData',
		data: {'sid':scheme_id,'post_time':post_time,'begin_time':begin_time,'end_time':end_time,'type':type},
		async: true,
		dataType: 'json',
		success: function (res) {
			if(res.code=='1')
			{
				data_loading(false,'wb_sentiment','情感属性');
				WbSentiment(res.msg);
			}else
			{
				$("#wb_sentiment").html("<div class='loading' id='wb_sentiment_loading' >"+res.msg+"</div>");
			}
		},
		error: function (res)
		{
			$("#wb_sentiment").html("<div class='loading'><span class='nodataImg'><a href='javascript:void(0);' onclick='"+chart_refresh+"'></a></span></div>");
		}
	});
}

function WbSentiment(ret_data)
{
	var box = echarts.init(document.getElementById('wb_sentiment'));
	option = {
		tooltip : {
			trigger: 'item',
			formatter: "{b} : {c} ({d}%)"
		},
		legend: {
			x : 'center',
			y : '255',
			textStyle:{
				color:'#777'
			},
			data:['正面','中性','负面']
		},

		calculable : false,
		series : [
		{
			name:'访问来源',
			type:'pie',
			radius : ['45%', '68%'],
			itemStyle :
			{
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
				value:ret_data[0]['value'], name:ret_data[0]['name'],
				url:'index',
				itemStyle:{
					normal:{color:'#73b6fa'
					}
				}
			},
			{
				value:ret_data[1]['value'], name:ret_data[1]['name'],
				url:'index1',
				itemStyle:{
					normal:{color:'#f59d62'
					}
				}
			},
			{
				value:ret_data[2]['value'], name:ret_data[2]['name'],
				url:'index2',
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
		var type=3;	//只筛选微博
		var totalcount=param.value;
		if(totalcount=='0')
		{
			warning("暂无数据");
			return false;
		}
		var url="/infolist/mweibo_sentiment?sid="+scheme_id+"&sentiment="+sentiment+"&post_time="+post_time+"&type="+type;
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

/************************热门账号********************************/
function getHotAccount(scheme_id,post_time,begin_time,end_time,type){
	var chart_refresh='javascript:eval(getHotAccount(\"'+scheme_id+'\",\"'+post_time+'\",\"'+begin_time+'\",\"'+end_time+'\",\"'+type+'\"))';
	$.ajax({
		type: 'post',
		url:  '/demo/getHotAccountMonitor',
		data: {'sid':scheme_id,'post_time':post_time,'begin_time':begin_time,'end_time':end_time,'type':type},
		async: true,
		dataType: 'json',
		success: function (res) {
			if(res.count >0){
				var length = res.len;
				if(length > 0){
					var html = '<table class="table td_2" id="hot_account"><tr><td width="18%">'+'头像'+'</td><td width="25%">'+'名称'+'</td><td width="20%">'+'粉丝数'+'</td><td width="17%">'+'认证类型'
					+'</td><td width="20%">'+'相关博文数'+'</td></tr>';
					for(var i=0;i<length;i++){
						if(res.newsList[i]["mblog_uid"]==null){
							var blog_uid = 0;
						}else{
							var blog_uid = res.newsList[i]["mblog_uid"];
						}
						if(post_time=='-1')
						{
							res.newsList[i]['article_url']+="&begin_time="+begin_time+"&end_time="+end_time;
						}
						html += '<tr>'
						+'<td><a href="http://weibo.com/'+blog_uid+'" target="_blank">'+
						'<img src="http://tp2.sinaimg.cn/'+blog_uid+'/30/0">'+'</img></a></td>'
						+'<td><a href="http://weibo.com/'+blog_uid+'" target="_blank">'+res.newsList[i]['app_name']+'</a></td>'
						+'<td><span class="blue">'+res.newsList[i]['mblog_followers_count']+'</span></td>'
						+'<td><span class="blue">'+res.newsList[i]['mblog_verified_type']+'</span></td>';
						if(res.user_id){
							html += '<td><a href="'+res.newsList[i]['article_url']+'" target="_blank"><span class="blue">'+res.newsList[i]['article_num']+'</span></td>';
						}else
						{
							html += '<td><a href="javascript:void(0)" onclick="return echarts_click_tip();" target="_blank"><span class="blue">'+res.newsList[i]['article_num']+'</span></td>';
						}
						html += '</tr>';
					}
					html +='</table>';
					$("#hot_account").html(html);
				}else{
					html = '<div style="width:100%;height:100%; box-sizing:border-box;padding:10px;text-align: center">'+'暂无数据'+'</div>'
					$("#hot_account").html("<div class='loading'>暂无数据</div>");
				}
			}else{
				html = '<div style="width:100%;height:100%; box-sizing:border-box;padding:10px;text-align: center">'+'暂无数据'+'</div>'
				$("#hot_account").html("<div class='loading'>暂无数据</div>");
			}
		},
		error: function (res)
		{
			html = '<div style="width:100%;height:100%; box-sizing:border-box;padding:10px;text-align: center">'+'暂无数据'+'</div>'
			$("#hot_account").html("<div class='loading'><span class='nodataImg'><a href='javascript:void(0);' onclick='"+chart_refresh+"'></a></span></div>");
		}
	});
}

/***********************发布热区*********************************/
function getWbMap(scheme_id,post_time,begin_time,end_time,type){
	if( $('#wb_map_loading').length > 0  || time_flag_wbMap){
		data_loading(true,'wb_map','发布热区');
                time_flag_wbMap = false;
	}else{
		refresh_load('wb_map');
	}
	var chart_refresh='javascript:eval(getWbMap(\"'+scheme_id+'\",\"'+post_time+'\",\"'+begin_time+'\",\"'+end_time+'\",\"'+type+'\"))';
	$.ajax({
		type: 'post',
		url:  '/demo/getAreaAnalysisData',
		data: {'sid':scheme_id,'post_time':post_time,'begin_time':begin_time,'end_time':end_time,'type':type},
		async: true,
		dataType: 'json',
		success: function (res) {
			if(res.code=='1')
			{
				data_loading(false,'wb_map','发布热区');
				transMap(res.msg);	
			}else
			{
				$("#wb_map").html("<div class='loading' id='wb_map_loading'>暂无数据</div>");
			}
		},
		error: function (res)
		{
			$("#wb_map").html("<div class='loading'><span class='nodataImg'><a href='javascript:void(0);' onclick='"+chart_refresh+"'></a></span></div>");
		}
	});
}

function transMap(data){

	console.log(data)

	var box = echarts.init(document.getElementById('wb_map'));
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
	$("#weibo_order_tbody ").html(html);
	$("#monitor_weibo_order").show();

	box.on("click",function(param){
		if(!echarts_click_tip()) return false;
		var sentiment=0;
		var type=3;
		var totalcount=param.value;
		if(totalcount=='0')
		{
			warning("暂无数据");
			return false;
		}
		var url="/infolist/mweibo_map?sid="+scheme_id+"&np="+param.name+"&sentiment="+sentiment+"&post_time="+post_time+"&type="+type;
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

/************************认证类型********************************/
function getAccountType(scheme_id,post_time,begin_time,end_time,type){
	if( $('#account_type_loading').length > 0 || time_flag_wbType){
		data_loading(true,'account_type','认证类型');
                time_flag_wbType = false;
	}else{
		refresh_load('account_type');
	}
	var chart_refresh='javascript:eval(getAccountType(\"'+scheme_id+'\",\"'+post_time+'\",\"'+begin_time+'\",\"'+end_time+'\",\"'+type+'\"))';
	$.ajax({
		type: 'post',
		url:  '/demo/getAuthTypeData',
		data: {'sid':scheme_id,'post_time':post_time,'begin_time':begin_time,'end_time':end_time,'type':type},
		async: true,
		dataType: 'json',
		success: function (res) {
			if(res.code=='1')
			{
				data_loading(false,'account_type','认证类型');
				wxAccount(res.msg);
			}else
			{
				$("#account_type").html("<div class='loading' id='account_type_loading'>"+res.msg+"</div>");
			}
		},
		error: function (res)
		{
			$("#account_type").html("<div class='loading'><span class='nodataImg'><a href='javascript:void(0);' onclick='"+chart_refresh+"'></a></span></div>");
		}
	});

}

function wxAccount(ret_data)
{
	var box = echarts.init(document.getElementById('account_type'));
	option = {
		tooltip : {
			trigger: 'item',
			formatter: "{b} : {c} ({d}%)"
		},
		color:['#f57175', '#73b6fa','#f59d62','#fcd874','#73e0f0'],
		legend: {
			x : 'center',
			y : '255',
			textStyle:{
				color:'#777'
			},
			data:ret_data.authType
		},

		calculable : false,
		series : [
		{
			name:'访问来源',
			type:'pie',
			clickable: false,
			radius : ['45%', '68%'],
			itemStyle :
			{
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
			data:ret_data.count
		}
		]
	};
	box.setOption(option);
}

/************************粉丝性别********************************/
function getFollowerType(scheme_id,post_time,begin_time,end_time,type){
	if( $('#follow_type_loading').length > 0 || time_flag_wbFollow){
		data_loading(true,'follow_type','粉丝性别');
                time_flag_wbFollow = false;
	}else{
		refresh_load('follow_type');
	}
	var chart_refresh='javascript:eval(getFollowerType(\"'+scheme_id+'\",\"'+post_time+'\",\"'+begin_time+'\",\"'+end_time+'\",\"'+type+'\"))';
	$.ajax({
		type: 'post',
		url:  '/demo/getFansSexData',
		data: {'sid':scheme_id,'post_time':post_time,'begin_time':begin_time,'end_time':end_time,'type':type},
		async: true,
		dataType: 'json',
		success: function (res) {
			if(res.code=='1')
			{
				data_loading(false,'follow_type','粉丝性别');
				followerType(res.msg);
			}else
			{
				$("#follow_type").html("<div class='loading' id='follow_type_loading'>"+res.msg+"</div>");
			}
		},
		error: function (res)
		{
			$("#follow_type").html("<div class='loading'><span class='nodataImg'><a href='javascript:void(0);' onclick='"+chart_refresh+"'></a></span></div>");
		}
	});
}

function followerType(ret_data)
{
	var box = echarts.init(document.getElementById('follow_type'));
	var weizhi = {};
	var weizhiname = '';
	if(ret_data[2]['value'] >0){
		weizhi =   {value:ret_data[2]['value'], name:ret_data[2]['name'],
		itemStyle:{
			normal:{color:'#f59d62'
			}
		}
		}
		weizhiname = '未知';
	};
	option = {
		tooltip : {
			trigger: 'item',
			formatter: "{b} : {c} ({d}%)"
		},
		legend: {
			x : 'center',
			y : '255',
			textStyle:{
				color:'#777'
			},
			data:['男性','女性',weizhiname]
		},

		calculable : false,
		series : [
		{
			name:'访问来源',
			type:'pie',
			clickable: false,
			radius : ['45%', '68%'],
			itemStyle :
			{
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
			{value:ret_data[0]['value'], name:ret_data[0]['name'],
			itemStyle:{
				normal:{color:'#73b6fa'
				}
			}
			},
			{value:ret_data[1]['value'], name:ret_data[1]['name'],
			itemStyle:{
				normal:{color:'#f57175'
				}
			}
			},
			weizhi
			]
		}
		]
	};
	box.setOption(option);

}


/************************粉丝质量********************************/
function getFollowerQuality(scheme_id,post_time,begin_time,end_time,type){
    console.log('粉丝质量'+time_flag_wbQuality);
	if( $('#follow_quality_loading').length > 0 || time_flag_wbQuality ){
		data_loading(true,'follow_quality','粉丝质量');
                time_flag_wbQuality =false;
	}else{
		refresh_load('follow_quality');
	}
	var chart_refresh='javascript:eval(getFollowerQuality(\"'+scheme_id+'\",\"'+post_time+'\",\"'+begin_time+'\",\"'+end_time+'\",\"'+type+'\"))';
	$.ajax({
		type: 'post',
		url:  '/demo/getWeiboFansQuality',
		data: {'sid':scheme_id,'post_time':post_time,'begin_time':begin_time,'end_time':end_time,'type':type},
		async: true,
		dataType: 'json',
		success: function (res) {
			if(res.code=='1')
			{
				data_loading(false,'follow_quality','粉丝质量');
				followerQuality(res.msg);
				
				//Monitor.followerQuality(res.msg);
			}else
			{
				$("#follow_quality").html("<div class='loading' id='follow_quality_loading' >暂无数据</div>");
			}
		},
		error: function (res)
		{
			$("#follow_quality").html("<div class='loading'><span class='nodataImg'><a href='javascript:void(0);' onclick='"+chart_refresh+"'></a></span></div>");
		}
	});
}

function followerQuality(res_data)
{

	var tmp = res_data;
	var max = tmp[0];
	for(var i=1;i<tmp.length;i++){

		if(max<tmp[i])max=tmp[i];
	}
	var maxdata = max + Math.ceil(max/5);
	var box = echarts.init(document.getElementById('follow_quality'));
	var data =['1000w+','100w-1000w','10w-100w','1w-10w','1000-1w','100-1000','0-100']
	option = {

		grid: {
			borderWidth: 0,
			y : 20,
			x2 :65,
			x:2,
			y2:60
		},
		xAxis : [
		{
			name:'粉丝数量',

			type : 'category',
			axisLabel: {
				show: true,
				rotate:-30,
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
			data :data.reverse()

		}
		],
		yAxis : [
		{
			name:'微博个数',

			splitLine: {
				show: true
			},
			type : 'value',
			max:maxdata,
			axisLabel : {
				 show:false,
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
			name:'降水量',
			type:'bar',
			clickable: false,
			barWidth:30,
			itemStyle:{
				normal:{
					color:'#5bb0f0',
					label:{
						show:true
						// position:'inside'
					}
				},
				emphasis:{
					label:{
						show:true
						//position:'inside'
					}
				}
			},

			data:res_data.reverse()
		}
		]
	};

	box.setOption(option);

}