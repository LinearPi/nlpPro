//【模块】：舆情监测
//【页面】：内容分析
//【作者】：王泽林

//公用部分：响应页面请求(全局变量)
var scheme_id = $("input[name=scheme_id]").val();
var post_time = $("input[name=posttime]").val();
var begin_time = $("input[name=begin_time]").val();
var end_time = $("input[name=end_time]").val();
var type = $("input[name=type]").val();
var from_controller = "demo";
var scheme_category = $("input[name=scheme_category]").val();
var time_flag_sentiment = false; //表示当点击刷选条件时，都是重新加载动画显示
var time_flag_hotKeyword = false;
var time_flag_sensitive = false;
var time_flag_hotMonitor = false;
var time_flag_contentType = false;
var time_flag_contentSentiment = false;

//发布时间
$(".posttime .fl a").bind("click", function() {
	time_flag_sentiment = true;
	time_flag_hotKeyword = true;
	time_flag_sensitive = true;
	time_flag_hotMonitor = true;
	time_flag_contentType = true;
	time_flag_contentSentiment = true;
	$(".custom").hide();
	post_time = $(this).attr('data-rel');
	type = $(".type").find(".aHver").attr('data-rel');
	getSentimentData(scheme_id, post_time, '', '', type); 
	ajaxImportive(scheme_id, post_time, '', '', type, 4);    
	getContentSentimentTrendData(scheme_id, post_time, '', '', 0, type); 
	ajaxMonitorKeywords(scheme_id, post_time, '', '', type);   
	getContentTypeData(scheme_id, post_time, '', '', type, 0);
	ajaxHotwordsCloud(scheme_id, post_time, '', '', type); 
});

//自定义时间
$(".searchByCustomTime").bind("click", function() {
	post_time = $(".posttime").find(".aHver").attr('data-rel');
	begin_time = $("input[name=begin_time]").val();
	end_time = $("input[name=end_time]").val();
	type = $(".type").find(".aHver").attr('data-rel');
	if (checkTime(post_time, begin_time, end_time)) {
		time_flag_sentiment = true;
		time_flag_hotKeyword = true;
		time_flag_sensitive = true;
		time_flag_hotMonitor = true;
		time_flag_contentType = true;
		time_flag_contentSentiment = true;
		getSentimentData(scheme_id, post_time, begin_time, end_time, type);
		ajaxImportive(scheme_id, post_time, begin_time, end_time, type, 4); 
		getContentSentimentTrendData(scheme_id, post_time, begin_time, end_time, 0, type); 
		ajaxMonitorKeywords(scheme_id, post_time, begin_time, end_time, type);
		getContentTypeData(scheme_id, post_time, begin_time, end_time, type, 0); 
		ajaxHotwordsCloud(scheme_id, post_time, begin_time, end_time, type); 
	}
});

//媒体属性
$(".type>a").bind("click", function() {
	post_time = $(".posttime").find(".aHver").attr('data-rel');
	begin_time = $("input[name=begin_time]").val();
	end_time = $("input[name=end_time]").val();
	type = $(this).attr('data-rel');
	if (checkTime(post_time, begin_time, end_time)) {
		time_flag_sentiment = true;
		time_flag_hotKeyword = true;
		time_flag_sensitive = true;
		time_flag_hotMonitor = true;
		time_flag_contentType = true;
		time_flag_contentSentiment = true;
		getSentimentData(scheme_id, post_time, begin_time, end_time, type);
		ajaxImportive(scheme_id, post_time, begin_time, end_time, type, 0);
		getContentSentimentTrendData(scheme_id, post_time, begin_time, end_time, 0, type);
		ajaxMonitorKeywords(scheme_id, post_time, begin_time, end_time, type);
		getContentTypeData(scheme_id, post_time, begin_time, end_time, type, 0);
		ajaxHotwordsCloud(scheme_id, post_time, begin_time, end_time, type);
	}
});

//页面打开首次加载 默认今天、全部
getSentimentData(scheme_id, post_time, begin_time, end_time, 0);	//情感属性
ajaxImportive(scheme_id, post_time, begin_time, end_time, 0, 0);	//重要舆情
getContentSentimentTrendData(scheme_id, post_time, begin_time, end_time, 0, 0);		//情感走势
ajaxMonitorKeywords(scheme_id, post_time, begin_time, end_time, 0);	//监测词组
getContentTypeData(scheme_id, post_time, begin_time, end_time, 0, 0);		//文本类型
ajaxHotwordsCloud(scheme_id, post_time, begin_time, end_time, 0);	//热门主题词云

//显示加载效果
function data_loading(flag, id, msg)
{
	var loading = $('#' + id + '_loading');
	//这是加载页面数据
	var reload_info = '<div class="loading"><img src="' + scheme_theme_url + '/images/loading.gif" id="' + id + '_loading" /><p>';
	reload_info += msg + '</p></div>';
	$('#' + id).html(reload_info);
	if (flag) {
		loading.show();
	} else {
		loading.hide();
	}
}

//显示加载效果 热门监测词
function data_loading_hot_monitor(flag, id, msg)
{
	var loading = $('#' + id);
	loading.html('<div class="loading"><img src="' + scheme_theme_url + '/images/loading.gif"   id="' + id + '_loading"  /><p>' + msg + '</p></div>');
	if (flag) {
		loading.show();
	} else {
		loading.hide();
	}
}
//显示刷新加载效果
function refresh_load(id_name) {
	$("#" + id_name).html("<div class='loading'><span class='nodataImg'><a href='javascript:void(0);' class='white_bg'><span   class='refresh_img'></span></a></span></div>");
}

//判断自定义时间筛选条件 自定义时间需控制在30天之内
function checkTime(post_time, begin_time, end_time)
{
	if (post_time == '-1')
	{
		if (begin_time == '' || end_time == '') {
			warning('开始时间和结束时间都不能为空');
			return false;
		} else if (begin_time >= end_time) {
			warning('开始时间不能大于结束时间');
			return false;
		}
	}
	return true;
}

/************************情感属性（环形图）********************************/
function showContentSentimentPieChart(data)
{
	var positive = "正面";
	var negative = "负面";
	var neutral = "中性";
	var box = echarts.init(document.getElementById('content_sentiment'));
	var option = {
		tooltip: {
			trigger: 'item',
			formatter: "{b} : {c} ({d}%)"
		},
		legend:
		{
			orient: 'horizontal',
			x: 'center',
			y: '255',
			textStyle:{
				color:'#777'
			},
			data: [positive, neutral, negative]
		},
		calculable: false,
		series: [
		{
			name: '',
			type: 'pie',
			radius: ['45%', '68%'],
			itemStyle: {
				normal: {
					label: {
						show: true,
						formatter: "{b} {d}%"

					},
					labelLine: {
						show: true,
						length: 10
					}
				},
				emphasis: {
					label: {
						show: false,
						position: 'center',
						textStyle: {
							fontSize: '30',
							fontWeight: 'bold'
						}
					}
				}
			},
			data: [
			{
				value: typeof (data.positive) == '' ? data_init : data.positive,
				name: positive,
				itemStyle:
				{
					normal: {color: '#73b6fa'}
				}
			},
			{
				value: typeof (data.neutral) == '' ? data_init : data.neutral,
				name: neutral,
				itemStyle:
				{
					normal: {color: '#f59d62'}
				}
			},
			{
				value: typeof (data.negative) == '' ? data_init : data.negative,
				name: negative,
				itemStyle:
				{
					normal: {color: '#f57175'}
				}
			}
			]
		}
		]
	};
	box.setOption(option);

	//图表点击事件
	function eConsole(param)
	{
		if(!echarts_click_tip()) return false;
		//获取当前的筛选条件
		var sentiment = getSentimentValue(param.name);
		var totalcount = param.value;
		if (totalcount == '0')
		{
			warning("暂无数据");
			return false;
		}
		var url = "/infolist/mcontent_sentiment?sid=" + scheme_id + "&type=" + type + "&sentiment=" + sentiment;
		if (begin_time && end_time)
		{
			//自定义时间
			url += "&post_time=-1" + "&begin_time=" + begin_time + "&end_time=" + end_time;
		} else
		{
			url += "&post_time=" + post_time;
		}
		//totalcount
		url += "&tc=" + totalcount;
		url += "&fc=" + from_controller + "&sc=" + scheme_category;
		window.open(url, "_blank");
	}
	box.on('click', eConsole);
}

//获取情感属性图表数据
//情感属性
function getSentimentData(scheme_id, post_time, begin_time, end_time, type)
{
	//数据前端的信息提示  时间，媒体，自刷新，服务器失败刷新

	if ($('#content_sentiment_loading').length > 0 || time_flag_sentiment) {
		data_loading(true, 'content_sentiment', '情感属性');
		time_flag_sentiment = false;
	} else {
		refresh_load('content_sentiment');
	}
	var chart_refresh = 'javascript:eval(getSentimentData(\"' + scheme_id + '\",\"' + post_time + '\",\"' + begin_time + '\",\"' + end_time + '\",\"' + type + '\"))';
	$.ajax({
		type: 'post',
		url: '/demo/getContentEmotion',
		data: {'sid': scheme_id, 'post_time': post_time, 'type': type, 'begin_time': begin_time, 'end_time': end_time},
		async: true,
		dataType: 'json',
		success: function(res) {
			if (res.code == '1') {
				data_loading(false, 'content_sentiment', '情感属性');
				showContentSentimentPieChart(res.msg);
			} else {
				var no_info = '<div class="loading" id="content_sentiment_loading"><p>暂无数据</p></div>';
				$("#content_sentiment").html(no_info);
			}
		},
		error: function(res)
		{
			$("#content_sentiment").html("<div class='loading'><span class='nodataImg'><a href='javascript:void(0);' onclick='" + chart_refresh + "'></a></span></div>");
		}
	});
}

/************************ 热门主题词云********************************/
function ajaxHotwordsCloud(scheme_id, post_time, begin_time, end_time, type) {
	console.log('热门词云' + time_flag_hotMonitor);
	if ($('#content_hotWords_loading').length > 0 || time_flag_hotMonitor) {
		data_loading(true, 'content_hotWords', '热门主题词');
		time_flag_hotMonitor = false;
	} else {
		refresh_load('content_hotWords');
	}
	var chart_refresh = 'javascript:eval(ajaxHotwordsCloud(\"' + scheme_id + '\",\"' + post_time + '\",\"' + begin_time + '\",\"' + end_time + '\",\"' + type + '\"))';
	$.ajax({
		url: '/demo/getHotwordsCloud',
		type: 'post',
		data: {'sid': scheme_id, 'post_time': post_time, 'type': type, 'begin_time': begin_time, 'end_time': end_time},
		dataType: 'json',
		success: function(res) {
			if (res.code == '1') {
				hotWords(res.msg.hotwords)
			} else {
				var no_info = '<div class="loading" id="content_hotWords_loading"><p>暂无数据</p></div>';
				$("#content_hotWords").html(no_info);
			}
		},
		error: function() {
			$(".conNews").html("<div class='loading'><span class='nodataImg'><a href='javascript:void(0);' onclick='" + chart_refresh + "'></a></span></div>");
		}
	})
}

function hotWords(data)
{
	//设置文字显示的样式
	function createRandomItemStyle()
	{
		return {
			normal: {
				color: 'rgb(' + [
				Math.round(Math.random() * 200),
				Math.round(Math.random() * 200),
				Math.round(Math.random() * 200)
				].join(',') + ')'
			}
		};
	}

	data = data.sort(function(x, y) {
		return x.value > y.value ? -1 : 1;
	});
	var falg = false;

	if (data[9].value < 30) {
		$.each(data, function(index, val) {
			falg = true;
			val.value = val.value * 20;
			val.itemStyle = createRandomItemStyle()
		})
	} else {
		$.each(data, function(index, val) {
			val.itemStyle = createRandomItemStyle()
		})
	}

	var box = echarts.init(document.getElementById('content_hotWords'));
	option = {
		tooltip: {
			trigger: 'item',
			formatter: function(params, ticket, callback) {

				var res = '';
				if (falg) {
					res = params.name + ' ' + params.value / 20;
				} else {
					res = params.name + ' ' + params.value;
				}


				callback(ticket, res)
				setTimeout(function() {

					callback(ticket, res);//回调函数，这里可以做异步请求加载的一些代码
				}, 1);
				return 'loading';
			}
		},
		series: [{
			type: 'wordCloud',
			size: ['80%', '80%'],
			clickable: false,
			textRotation: [0, 45, -45],
			textPadding: 2,
			autoSize: {
				enable: true,
				minSize: 14
			},
			data: data
		}]
	};
	box.setOption(option);
}


/************************ 监测词组 ********************************/
function ajaxMonitorKeywords(scheme_id, post_time, begin_time, end_time, type) {
	if ($('#hotkeywords_loading').length > 0 || time_flag_hotKeyword) {
		data_loading_hot_monitor(true, 'hotkeywords', '热门监测词组');
		time_flag_hotKeyword = false;
	} else {
		refresh_load('hotkeywords');
	}
	var chart_refresh = 'javascript:eval(ajaxMonitorKeywords(\"' + scheme_id + '\",\"' + post_time + '\",\"' + begin_time + '\",\"' + end_time + '\",\"' + type + '\"))';
	$.ajax({
		url: '/demo/getMonitorKeywords',
		type: 'post',
		data: {'sid': scheme_id, 'post_time': post_time, 'begin_time': begin_time, 'end_time': end_time, 'type': type},
		dataType: 'json',
		success: function(res) {
			if (res.status == 1) {
				var length = res.list.length;
				if (length > 0) {
					var html = '<ul class="nav keyWord">';
					for (var i = 0; i < length; i++) {
						html += '<a href="javascript:void(0)"><li class="words">'
						+ res.list[i]['value'] + '<span class="orange">' + '（' + res.list[i]['num'] + '）' + '</span></li></a>';
					}
					html += '</ul>';
					$('.hotkeywords').html(html);
				} else {
					var no_info = '<div class="loading" id="hotkeywords_loading"><p>暂无数据</p></div>';
					$(".hotkeywords").html(no_info);
				}
			} else {
				var no_info = '<div class="loading" id="hotkeywords_loading"><p>暂无数据</p></div>';
				$(".hotkeywords").html(no_info);
			}
		},
		error: function() {
			$(".conNews").html("<div class='loading'><span class='nodataImg'><a href='javascript:void(0);' onclick='" + chart_refresh + "'></a></span></div>");
		}
	})
}

$(".hotkeywords").on("click", ".words", function() {
	if(!echarts_click_tip()) return false;
	//获取当前的筛选条件
	var sentiment = 0;
	var text = filterHtmltags($(this).html());
	//+号浏览器会自动过滤掉，所以换成英文逗号
	var text = text.split("+").join(",");
	var totalcount = $(this).children(".orange").html().replace("（", "").replace("）", "");
	if (totalcount == '0')
	{
		warning("暂无数据");
		return false;
	}
	var url = "/infolist/mcontent_monitorwords?sid=" + scheme_id + "&words=" + text + "&type=" + type + "&sentiment=" + sentiment;
	if (begin_time && end_time)
	{
		//自定义时间
		url += "&post_time=-1" + "&begin_time=" + begin_time + "&end_time=" + end_time;
	} else
	{
		url += "&post_time=" + post_time;
	}
	//totalcount
	url += "&tc=" + totalcount;
	url += "&fc=" + from_controller + "&sc=" + scheme_category;
	window.open(url, "_blank");
});

/************************情感走势开始********************************/
//情感走势
function getContentSentimentTrendData(scheme_id, post_time, begin_time, end_time, sentiment, type) {
	console.log('情感走势' + time_flag_contentSentiment);
	if ($('#content_sentimenttrend_loading').length > 0 || time_flag_contentSentiment) {
		data_loading(true, 'content_sentimenttrend', '情感走势');
		time_flag_contentSentiment = false;
	} else {
		refresh_load('content_sentimenttrend');
	}

	var chart_refresh = 'javascript:eval(getContentSentimentTrendData(\"' + scheme_id + '\",\"' + post_time + '\",\"' + begin_time + '\",\"' + end_time + '\",\"' + sentiment + '\",\"' + type + '\"))';
	$.ajax({
		type: 'get',
		url: '/demo/getContentSentimentTrendData',
		data: {'sid': scheme_id, 'post_time': post_time, 'begin_time': begin_time, 'end_time': end_time, 'sentiment': sentiment, 'type': type},
		async: true,
		dataType: 'json',
		success: function(res) {
			if (res.code == '1')
			{
				data_loading(false, 'content_sentimenttrend', '情感走势');
				showContentSentimentTrendChart(res.msg);
			} else
			{
				var no_info = '<div class="loading" id="content_sentimenttrend_loading"><p>暂无数据</p></div>';
				$("#content_sentimenttrend").html(no_info);

			}
		},
		error: function(res)
		{
			$("#content_sentimenttrend").html("<div class='loading'><span class='nodataImg'><a href='javascript:void(0);' onclick='" + chart_refresh + "'></a></span></div>");
		}
	});
}

//情感走势
function showContentSentimentTrendChart(data)
{
	var time_len = data.days.length;
	var data_init = new Array();
	for (i = 0; i < time_len; i++)
	{
		data_init.push(0);
	}

	var positive = "正面";
	var negative = "负面";
	var neutral = "中性";
	var box = echarts.init(document.getElementById('content_sentimenttrend'), 'macarons');
	option = {
		tooltip: {
			trigger: 'axis',
			axisPointer:{
				lineStyle: {
					color: '#e0e0e0',
					width: 1
				}
			}
		},
		legend: {
			x: 'center',
			y: '235',
			textStyle:{
				color:'#777'
			},
			data: [positive, neutral, negative]
		},
		grid: {
			borderWidth: 0,
			y: 15,
			x2:25,
			x: 48,
			y2: 70
		},
		calculable: false,
		xAxis: [
		{
			show: true,
			type: 'category',
			axisLine: {
				lineStyle: {
					color: '#ccc',
					width: 1
				}
			},
			axisLabel: {
				textStyle: {
					color: '#777'
				}
			},
			splitLine: {
				show: false
			},
			axisTick : {    // 轴标记
				show:true,
				lineStyle: {
					color: '#ccc'
				}
			},
			splitArea: {
				show: false
			},
			boundaryGap: false,
			data: data.days
		}
		],
		yAxis: [
		{
			type: 'value',
			axisLabel: {
				formatter: function(params) {
					var newParams = "";
					var paramsNameNumber = params.toString().length;
					if (paramsNameNumber >= 5) {
						newParams = (params / 10000) + 'w';
					} else {
						newParams = params;
					}
					// alert(newParams);
					return newParams;
				},
				textStyle: {
					color: '#b8b8b8'
				}
			},
			axisLine: {
				show: false
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
		series: [
		{
			name: positive,
			symbolSize: 2,
			type: 'line',
			smooth: true,
			itemStyle: {
				normal: {
					color: '#73b6fa',
					lineStyle: {
						color: '#73b6fa'
					}
				}
			},
			data: typeof (data.positive) == 'undefined' ? data_init : data.positive
		},
		{
			name: neutral,
			symbolSize: 2,
			type: 'line',
			smooth: true,
			itemStyle: {
				normal: {
					color: '#f59d62',
					lineStyle: {
						color: '#f59d62'
					}
				}
			},
			data: typeof (data.neutral) == 'undefined' ? data_init : data.neutral
		},
		{
			name: negative,
			symbolSize: 2,
			type: 'line',
			smooth: true,
			itemStyle: {
				normal: {
					color: '#f57175',
					lineStyle: {
						color: '#f57175'
					}
				}
			},
			data: typeof (data.negative) == 'undefined' ? data_init : data.negative
		}
		]
	};
	box.setOption(option);

	box.on("click", function(param) {
		if(!echarts_click_tip()) return false;
		//alert(param.name+"--"+param.value+"---"+param.seriesName);
		var sentiment = getSentimentValue(param.seriesName);
		var totalcount = param.value;
		if (totalcount == '0')
		{
			warning("暂无数据");
			return false;
		}
		var url = "/infolist/mcontent_sentimenttrend?sid=" + scheme_id + "&sentiment=" + sentiment + "&type=" + type;
		url += "&post_time=" + post_time + "&ptv=" + param.name;
		if (post_time == '-1')
		{
			//自定义时间
			url += "&begin_time=" + begin_time + "&end_time=" + end_time;
		}
		//totalcount
		url += "&tc=" + totalcount + "&flag=qb";
		url += "&fc=" + from_controller + "&sc=" + scheme_category;
		window.open(url, "_blank");
	});

}

/************************情感走势结束********************************/

/*******************************文本类型开始**********************************/
//文章类型
function getContentTypeData(scheme_id, post_time, begin_time, end_time, type, sentiment) {
	console.log('文章类型' + time_flag_contentType);
	if ($('#content_type_loading').length > 0 || time_flag_contentType) {
		data_loading(true, 'content_type', '文章类型');
		time_flag_contentType = false;
	} else {
		refresh_load('content_type');
	}
	var chart_refresh = 'javascript:eval(getContentTypeData(\"' + scheme_id + '\",\"' + post_time + '\",\"' + begin_time + '\",\"' + end_time + '\",\"' + type + '\",\"' + sentiment + '\"))';
	$.ajax({
		type: 'post',
		url: '/demo/getContentTypeData',
		data: {'sid': scheme_id, 'post_time': post_time, 'begin_time': begin_time, 'end_time': end_time, 'type': type, 'sentiment': sentiment},
		async: true,
		dataType: 'json',
		success: function(res) {
			if (res.code == '1')
			{
				data_loading(false, 'content_type', '文章类型');
				showContentTypeChart(res.msg);
			} else
			{
				var no_info = '<div class="loading" id="content_type_loading"><p>暂无数据</p></div>';
				$("#content_type").html(no_info);
			}
		},
		error: function(res)
		{
			$("#content_type").html("<div class='loading'><span class='nodataImg'><a href='javascript:void(0);' onclick='" + chart_refresh + "'></a></span></div>");
		}
	});
}

function showContentTypeChart(data) {
	var box = echarts.init(document.getElementById('content_type'), 'macarons');
	var tp_name = data.type_name;
	tp_name[0].axisLabel = {show: true, textStyle: {fontSize: 10, color: '#afc5db'}};
	option = {
		title: {
		},
		tooltip: {
			trigger: 'axis',
			formatter: "{d}：{c}"
		},
		polar: [
		{
			name:{
				textStyle:{
					color:'#777'
				}
			},
			splitArea : {
				show : false
			},
			splitLine : {
				lineStyle : {
					width : 1,
					color : '#ebebeb'
				}
			},
			axisLine : {
				lineStyle : {
					color : '#ebebeb'
				}
			},
			indicator: data.type_name
		}
		],
		calculable: false,
		series: [
		{
			name: '文本类型',
			type: 'radar',
			//symbol: 'none',
			symbolSize:2,
			itemStyle: {
				normal: {
					label: {
						show: false,
						formatter: "{d}：{c}"

					},
					labelLine: {
						show: true,
						length: 10
					},
					color: '#2f9ff3',
					areaStyle: {
						color: 'rgba(47,159,243,0.3)'
					}

				},
				emphasis: {
					label: {
						show: false,
						position: 'center',
						textStyle: {
							fontSize: '30',
							fontWeight: '400'
						}
					}
				}
			},
			data: data.type_value
		}
		]
	};
	box.setOption(option);

	box.on("click", function(param) {
		if(!echarts_click_tip()) return false;
		var totalcount = param.value[param.special];
		if (totalcount == '0')
		{
			warning("暂无数据");
			return false;
		}
		var url = "/infolist/mcontent_type?sid=" + scheme_id + "&ct=" + param.name + "&sentiment=0&post_time=" + post_time + "&type=" + type;
		if (post_time == '-1')
		{
			//自定义时间
			url += "&begin_time=" + begin_time + "&end_time=" + end_time;
		}
		//totalcount
		url += "&tc=" + totalcount;
		url += "&fc=" + from_controller + "&sc=" + scheme_category;
		window.open(url, "_blank");
	});
}


/*******************************文本类型结束********************************/



/************************ 敏感舆情改成了重要舆情 ********************************/
function ajaxImportive(scheme_id, post_time, begin_time, end_time, type, sentiment)
{
	if ($('#sensitive_loading').length > 0 ||    time_flag_sensitive) {
		data_loading_hot_monitor(true, 'sensitive', '重要舆情');
		time_flag_sensitive = false;
	} else {
		refresh_load('sensitive');
	}
	var chart_refresh = 'javascript:eval(ajaxImportive(\"' + scheme_id + '\",\"' + post_time + '\",\"' + begin_time + '\",\"' + end_time + '\",\"' + type + '\",\"' + sentiment + '\"))';
	$.ajax({
		url: '/demo/getImportive',
		type: 'post',
		data: {'sid': scheme_id, 'post_time': post_time, 'begin_time': begin_time, 'end_time': end_time, 'type': type, 'sentiment': sentiment},
		dataType: 'json',
		success: function(res) {
			if (res.code == '1') {
				var data = res.msg.newsList;
				var html = '<table class="table td_1">';
				for (var i = 0; i < data.length; i++)
				{
					html += '<tr>'
					html += '<td width="8%"><input type="checkbox" class="sen_checkbox" value="' + data[i]['hash_code'] + '" disabled/>' + '</td>'
					html += '<td width="65%" style="text-align: left">';
					html += '<a href="'+data[i]['news_url']+ '" target="_blank">'+ data[i]['news_title'] + '</a>';
					html += '</td>'
					html += '<td width="27%" style="text-align: right">相似文章:' + data[i]['sim_num'] + '</td>'
					html += '</tr>';
				}
				html += '</table>';
				$(".table-responsive").html(html);
			} else {
				$(".table-responsive").html("");
				var no_info = '<div class="loading" id="sensitive_loading"><p>暂无数据</p></div>';
				$(".table-responsive").html(no_info);
			}
		},
		error: function() {
			$(".table-responsive").html("<div class='loading'><span class='nodataImg'><a href='javascript:void(0);' onclick='" + chart_refresh + "'></a></span></div>");
		}
	})
}