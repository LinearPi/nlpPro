/**
 * Created by dingzhen0725 on 2016/5/19.
 * 【模块】：舆情监测
 * 【页面】：传播分析
 */

//公用部分：响应页面请求(全局变量)
scheme_id = $("input[name=scheme_id]").val();
post_time = $("input[name=posttime]").val();
begin_time = $("input[name=begin_time]").val();
end_time = $("input[name=end_time]").val();
sentiment = 0;
from_controller = "demo";
scheme_category = $("input[name=scheme_category]").val();
var time_flag_trans_trend =false;
var time_flag_trans_distribute =false;
var time_flag_trans_active =false;
var time_flag_trans_map =false;
var time_flag_trans_content =false;
var time_flag_trans_focus =false;
//显示加载效果
function data_loading(flag, div_id, msg)
{
    var loading = $('#' + div_id + '-loading');
    //这是加载页面数据
    var reload_info = '<div class="loading"><img src="' + scheme_theme_url + '/images/loading.gif" id="' + div_id + '-loading" /><p>';
    reload_info += msg + '</p></div>';
    $('#' + div_id).html(reload_info);
    if (flag) {
        loading.show();
    } else {
        loading.hide();
    }
}

//显示刷新加载效果，这是加载失败；
function refresh_load(id_name) {
    $("#" + id_name).html("<div class='loading'><span class='nodataImg'><a href='javascript:void(0);' class='white_bg'><span   class='refresh_img'></span></a></span></div>");
}

//发布时间
$(".posttime .fl a").bind("click", function() {
     time_flag_trans_trend =true;
     time_flag_trans_distribute =true;
     time_flag_trans_active =true;
     time_flag_trans_map =true;
     time_flag_trans_content =true;
     time_flag_trans_focus =true;
     $(".custom").hide();
    post_time = $(this).attr('data-rel');
    sentiment = $(".sentiment").find(".aHver").attr('data-rel');
    //媒体活跃图表用到type
    var type = $(".type_active").find(".active").attr('data-rel');
    getTransYuqingTrendData(scheme_id, post_time, '', '', sentiment);
    getTransTypeDistributeData(scheme_id, post_time, '', '', sentiment);
    getTransTypeActiveData(scheme_id, post_time, '', '', sentiment, type);
    getTransTypeMapData(scheme_id, post_time, '', '', sentiment);
    getTransContentMapData(scheme_id, post_time, '', '', sentiment, 0);
    getTransFocusTrendData(scheme_id, post_time, '', '', sentiment, 0);
});
//自定义时间
$(".searchByCustomTime").bind("click", function() {
    post_time = $(".posttime").find(".aHver").attr('data-rel');
    sentiment = $(".sentiment").find(".aHver").attr('data-rel');
    begin_time = $("input[name=begin_time]").val();
    end_time = $("input[name=end_time]").val();
    var type = $(".type_active").find(".active").attr('data-rel');
    if (checkTime(post_time, begin_time, end_time)) {
        time_flag_trans_trend =true;
        time_flag_trans_distribute =true;
        time_flag_trans_active =true;
        time_flag_trans_map =true;
        time_flag_trans_content =true;
        time_flag_trans_focus =true;
        getTransYuqingTrendData(scheme_id, post_time, begin_time, end_time, sentiment);
        getTransTypeDistributeData(scheme_id, post_time, begin_time, end_time, sentiment);
        getTransTypeActiveData(scheme_id, post_time, begin_time, end_time, sentiment, type);
        getTransTypeMapData(scheme_id, post_time, begin_time, end_time, sentiment);
        getTransContentMapData(scheme_id, post_time, begin_time, end_time, sentiment, 0);
        getTransFocusTrendData(scheme_id, post_time, begin_time, end_time, sentiment, 0);
    }
});
//情感属性
$(".sentiment a").bind("click", function() {
    post_time = $(".posttime").find(".aHver").attr('data-rel');
    sentiment = $(this).attr('data-rel');
    begin_time = $("input[name=begin_time]").val();
    end_time = $("input[name=end_time]").val();
    //媒体活跃图表用到type
    var type = $(".type_active").find(".active").attr('data-rel');
    if (checkTime(post_time, begin_time, end_time)) {
        time_flag_trans_trend =true;
        time_flag_trans_distribute =true;
        time_flag_trans_active =true;
        time_flag_trans_map =true;
        time_flag_trans_content =true;
        time_flag_trans_focus =true;
        getTransYuqingTrendData(scheme_id, post_time, begin_time, end_time, sentiment);
        getTransTypeDistributeData(scheme_id, post_time, begin_time, end_time, sentiment);
        getTransTypeActiveData(scheme_id, post_time, begin_time, end_time, sentiment, type);
        getTransTypeMapData(scheme_id, post_time, begin_time, end_time, sentiment);
        getTransContentMapData(scheme_id, post_time, begin_time, end_time, sentiment, 0);
        getTransFocusTrendData(scheme_id, post_time, begin_time, end_time, sentiment, 0);
    }
});

//媒体活跃图表用到type
$(".type_active a").bind("click", function() {
    time_flag_trans_active =true;
    post_time = $(".posttime").find(".aHver").attr('data-rel');
    begin_time = $("input[name=begin_time]").val();
    end_time = $("input[name=end_time]").val();
    sentiment = $(".sentiment").find(".aHver").attr('data-rel');
    var type = $(this).parent().attr('data-rel');
    getTransTypeActiveData(scheme_id, post_time, begin_time, end_time, sentiment, type);
});


//第一次打开页面时执行,(时间：今天/2，情感：全部/0)
getTransYuqingTrendData(scheme_id, post_time, begin_time, end_time, 0); 	//舆情走势
getTransTypeDistributeData(scheme_id, post_time, begin_time, end_time, 0); 	//媒体分布
getTransFocusTrendData(scheme_id, post_time, begin_time, end_time, 0, 0); 	//热词走势
getTransTypeMapData(scheme_id, post_time, begin_time, end_time, 0); 		//发布热区
getTransTypeActiveData(scheme_id, post_time, begin_time, end_time, 0, 1);		//活跃媒体
getTransContentMapData(scheme_id, post_time, begin_time, end_time, sentiment, 0); 	//提及热区

//自定义时间判断，自定义时间范围需控制在30天内
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

/************************舆情走势开始********************************/
//舆情走势
function getTransYuqingTrendData(scheme_id, post_time, begin_time, end_time, sentiment)
{
    if ($('#trans_yuqing_trend-loading').length > 0 || time_flag_trans_trend) {
        data_loading(true, 'trans_yuqing_trend', '舆情走势');
        time_flag_trans_trend = false;
    } else {
        refresh_load('trans_yuqing_trend');
    }
    var chart_refresh = 'javascript:eval(getTransYuqingTrendData(\"' + scheme_id + '\",\"' + post_time + '\",\"' + begin_time + '\",\"' + end_time + '\",\"' + sentiment + '\"))';
    $.ajax({
        type: 'get',
        url: '/demo/getTransYuqingTrendData',
        data: {'sid': scheme_id, 'post_time': post_time, 'begin_time': begin_time, 'end_time': end_time, 'sentiment': sentiment},
        async: true,
        dataType: 'json',
        success: function(res) {
            if (res.code == '1')
            {
                var data = res.msg;
                data_loading(false, 'trans_yuqing_trend', '舆情走势');
                showTransYuqingTrendChart(data);
            } else
            {
                $("#trans_yuqing_trend").html("<div class='loading' id='trans_yuqing_trend-loading'>" + res.msg + "</div>");
            }
        },
        error: function(res)
        {
            $("#trans_yuqing_trend").html("<div class='loading'><span class='nodataImg'><a href='javascript:void(0);' onclick='" + chart_refresh + "'></a></span></div>");
        }
    });
}

//今天和昨天显示柱状图，其他的显示折线图
function showTransYuqingTrendChart(data)
{
    var time_len = data.datetime_seq.length;
    var data_init = new Array();
    for (i = 0; i < time_len; i++)
    {
        data_init.push(0);
    }
    var box = echarts.init(document.getElementById('trans_yuqing_trend'), 'macarons');
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
            data: ['全部', '微信', '微博', '网页', '报刊', '客户端', '论坛'],
            selected: {'全部': false}
        },
        grid: {
			borderWidth: 0,
            y: 15,
            x2:20,
            x:48,
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
                data: data.datetime_seq
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
                name: '全部',
                symbolSize: 2,
                type: 'line',
                smooth: true,
                itemStyle: {
                    normal: {
                        color: '#bfbfbf'
                    }
                },
                data: typeof (data.all) == 'undefined' ? data_init : data.all
            },
            {
                name: '微信',
                symbolSize: 2,
                type: 'line',
                smooth: true,
                itemStyle: {
                    normal: {
                        color: '#65db65'
                    }
                },
                data: typeof (data.wx) == 'undefined' ? data_init : data.wx
            },
            {
                name: '微博',
                symbolSize: 2,
                type: 'line',
                smooth: true,
                itemStyle: {
                    normal: {
                        color: '#f57175'
                    }
                },
                data: typeof (data.weibo) == 'undefined' ? data_init : data.weibo
            },
            {
                name: '网页',
                symbolSize: 2,
                type: 'line',
                smooth: true,
                itemStyle: {
                    normal: {
                        color: '#f59d62'
                    }
                },
                data: typeof (data.web) == 'undefined' ? data_init : data.web
            },
            {
                name: '报刊',
                symbolSize: 2,
                type: 'line',
                smooth: true,
                itemStyle: {
                    normal: {
                        color: '#fcd874'
                    }
                },
                data: typeof (data.journal) == 'undefined' ? data_init : data.journal
            },
            {
                name: '客户端',
                symbolSize: 2,
                type: 'line',
                smooth: true,
                itemStyle: {
                    normal: {
                        color: '#73b6fa'
                    }
                },
                data: typeof (data.app) == 'undefined' ? data_init : data.app
            },
            {
                name: '论坛',
                symbolSize: 2,
                type: 'line',
                smooth: true,
                itemStyle: {
                    normal: {
                        color: '#73e0f0'
                    }
                },
                data: typeof (data.forum) == 'undefined' ? data_init : data.forum
            }
        ]
    };
    box.setOption(option);

    box.on("click", function(param) {
    	if(!echarts_click_tip()) return false;
        //alert(param.name+"--"+param.value+"---"+param.seriesName);
        var type = getTypeValue(param.seriesName);
        var totalcount = param.value;
        if (totalcount == '0')
        {
            warning("暂无数据");
            return false;
        }
        var url = "/infolist/mtrans_yuqingtrend?sid=" + scheme_id + "&sentiment=" + sentiment + "&type=" + type;
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

/************************舆情走势结束********************************/


/****************************焦点走势开始**********************************/
//热词走势
function getTransFocusTrendData(scheme_id, post_time, begin_time, end_time, sentiment, type)
{
    if ($('#trans_focus_trend-loading').length > 0 || time_flag_trans_focus) {
        data_loading(true, 'trans_focus_trend', '热词走势');
        time_flag_trans_focus = false;
    } else {
        refresh_load('trans_focus_trend');
    }
    var chart_refresh = 'javascript:eval(getTransFocusTrendData(\"' + scheme_id + '\",\"' + post_time + '\",\"' + begin_time + '\",\"' + end_time + '\",\"' + sentiment + '\",\"' + type + '\"))';
    $.ajax({
        type: 'get',
        url: '/demo/getFocusTrendData',
        data: {'sid': scheme_id, 'post_time': post_time, 'begin_time': begin_time, 'end_time': end_time, 'sentiment': sentiment, 'type': type},
        async: true,
        dataType: 'json',
        success: function(res) {
            if (res.code == '1')
            {
                data_loading(false, 'trans_focus_trend', '热词走势');
                showTransFocusTrendChart(res.msg);
            } else
            {
                $("#trans_focus_trend").html("<div class='loading' id='trans_focus_trend-loading'>" + res.msg + "</div>");
            }
        },
        error: function(res)
        {
            $("#trans_focus_trend").html("<div class='loading'><span class='nodataImg'><a href='javascript:void(0);' onclick='" + chart_refresh + "'></a></span></div>");
        }
    });
}

//今天和昨天显示柱状图，其他的显示折线图
function showTransFocusTrendChart(data)
{
    var time_len = data.days.length;
    var data_init = new Array();
    for (i = 0; i < time_len; i++)
    {
        data_init.push(0);
    }
    var hotwords = data.hotwords;
    var hotword_0 = hotwords[0].substr(0, 4);
    var hotword_1 = hotwords[1].substr(0, 4);
    var hotword_2 = hotwords[2].substr(0, 4);
    var hotword_3 = hotwords[3].substr(0, 4);
    var hotword_4 = hotwords[4].substr(0, 4);
    var box = echarts.init(document.getElementById('trans_focus_trend'), 'macarons');
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
            data: hotwords
        },
        grid: {
			borderWidth: 0,
            y: 15,
            x2: 20,
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
                name: hotword_0,
                symbolSize: 2,
                type: 'line',
                smooth: true,
                itemStyle: {
                    normal: {
                        color: '#f59d62'
                    }
                },
                data: typeof (data[hotword_0]) == 'undefined' ? data_init : data[hotword_0]
            },
            {
                name: hotword_1,
                symbolSize: 2,
                type: 'line',
                smooth: true,
                itemStyle: {
                    normal: {
                        color: '#fcd874'
                    }
                },
                data: typeof (data[hotword_1]) == 'undefined' ? data_init : data[hotword_1]
            },
            {
                name: hotword_2,
                symbolSize: 2,
                type: 'line',
                smooth: true,
                itemStyle: {
                    normal: {
                        color: '#73b6fa'
                    }
                },
                data: typeof (data[hotword_2]) == 'undefined' ? data_init : data[hotword_2]
            },
            {
                name: hotword_3,
                symbolSize: 2,
                type: 'line',
                smooth: true,
                itemStyle: {
                    normal: {
                        color: '#73e0f0'
                    }
                },
                data: typeof (data[hotword_3]) == 'undefined' ? data_init : data[hotword_3]
            },
            {
                name: hotword_4,
                symbolSize: 2,
                type: 'line',
                smooth: true,
                itemStyle: {
                    normal: {
                        color: '#7f7ff5'
                    }
                },
                data: typeof (data[hotword_4]) == 'undefined' ? data_init : data[hotword_4]
            }
        ]
    };
    box.setOption(option);

    box.on("click", function(param) {
    	if(!echarts_click_tip()) return false;
        //alert(param.name+"--"+param.value+"---"+param.seriesName);
        var totalcount = param.value;
        if (totalcount == '0')
        {
            warning("暂无数据");
            return false;
        }
        var url = "/infolist/mtrans_focustrend?sid=" + scheme_id + "&sentiment=" + sentiment + "&type=0";
        url += "&post_time=" + post_time + "&ptv=" + param.name + "&hotword=" + param.seriesName;
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


/****************************焦点走势结束*********************************/

/******************************提及热区开始*************************************/
function getTransContentMapData(scheme_id, post_time, begin_time, end_time, sentiment, type) {
    if ($('#content_map-loading').length > 0 ||  time_flag_trans_content) {
        data_loading(true, 'content_map', '提及热区');
        time_flag_trans_content = false;
    } else {
        refresh_load('content_map');
    }
    var chart_refresh = 'javascript:eval(getTransContentMapData(\"' + scheme_id + '\",\"' + post_time + '\",\"' + begin_time + '\",\"' + end_time + '\",\"' + sentiment + '\",\"' + type + '\"))';
    $.ajax({
        type: 'get',
        url: '/demo/getTransContentMapData',
        data: {'sid': scheme_id, 'post_time': post_time, 'begin_time': begin_time, 'end_time': end_time, 'type': type, 'sentiment': sentiment},
        async: true,
        dataType: 'json',
        success: function(res) {
            if (res.code == '1')
            {
                data_loading(false, 'content_map', '提及热区');
                showContentMapChart(res.msg);
            } else
            {
                //$("#content_map").text(res.msg);
                $("#content_map").html("<div class='loading' id='content_map-loading'>暂无数据</div>");
            }
        },
        error: function(res)
        {
            $("#content_map").html("<div class='loading'><span class='nodataImg'><a href='javascript:void(0);' onclick='" + chart_refresh + "'></a></span></div>");
        }
    });
}

function showContentMapChart(data) {
    var box = echarts.init(document.getElementById('content_map'), 'dark');
    option = {
        tooltip: {
            trigger: 'item',
            formatter: "{b} : {c}"
        },
        dataRange: {
            padding: 2,
            itemHeight: 5,
            itemWidth: 15,
            min: data.minValue,
            max: data.maxValue,
            x: 10,
            y: 175,
			textStyle:{
				color:'#777'
			},
            text: ['高', '低'], // 文本，默认为数值文本
            calculable: true
        },
        series: [
            {
                name: 'iphone3',
                type: 'map',
                mapLocation: {
                    x: '17',
                    y: 'center'
                },
                mapType: 'china',
                roam: false,
                itemStyle: {
                    emphasis: {label: {show: true}}
                },
                data: data.province
            },
        ]
    };
    box.setOption(option);
    var ss = data.province;
    var nn = ss.sort(function(x, y) {
        return x.value > y.value ? -1 : 1;
    });

    var mm = nn.slice(0, 10);
    var html = '';
    $.each(mm, function(index, item) {
        html += '<tr><td>' + item.name + '</td><td>' + item.value + '</td></tr>'
    });
    $("#content_map_tbody ").html(html);
    $("#content_map_order").show();

    box.on("click", function(param) {
    	if(!echarts_click_tip()) return false;
        var totalcount = param.value;
        if (totalcount == '0')
        {
            warning("暂无数据");
            return false;
        }
        var url = "/infolist/mcontent_map?sid=" + scheme_id + "&cp=" + param.name + "&sentiment=" + sentiment + "&post_time=" + post_time + "&type=0";
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
/******************************提及热区结束***********************************/



/*************************媒体分布开始**********************************/
function getTransTypeDistributeData(scheme_id, post_time, begin_time, end_time, sentiment) {
    if ($('#trans_type_distribute-loading').length > 0 || time_flag_trans_distribute) {
        data_loading(true, 'trans_type_distribute', '媒体分布');
        time_flag_trans_distribute = false;
    } else {
        refresh_load('trans_type_distribute');
    }
    var chart_refresh = 'javascript:eval(getTransTypeDistributeData(\"' + scheme_id + '\",\"' + post_time + '\",\"' + begin_time + '\",\"' + end_time + '\",\"' + sentiment + '\"))';
    $.ajax({
        type: 'get',
        url: '/demo/getTransTypeDistributeData',
        data: {'sid': scheme_id, 'post_time': post_time, 'begin_time': begin_time, 'end_time': end_time, 'sentiment': sentiment},
        async: true,
        dataType: 'json',
        success: function(res) {
            if (res.code == '1')
            {
                data_loading(false, 'trans_type_distribute', '媒体分布');
                showTransTypeDistributeChart(res.msg);
            } else
            {
                $("#trans_type_distribute").html("<div class='loading' id='trans_type_distribute-loading' >" + res.msg + "</div>");
            }
        },
        error: function(res)
        {
            $("#trans_type_distribute").html("<div class='loading'><span class='nodataImg'><a href='javascript:void(0);' onclick='" + chart_refresh + "'></a></span></div>");
        }
    });
}

function showTransTypeDistributeChart(data)
{
    var box = echarts.init(document.getElementById('trans_type_distribute'));
    var wx = '微信';
    var app = '客户端';
    var weibo = '微博';
    var web = '网页';
    var forum = '论坛';
    var journal = '报刊';
    option = {
        title: {
        },
        tooltip:
                {
                    trigger: 'item',
                    formatter: "{b} : {c} ({d}%)"
                },
        legend: {
            orient: 'horizontal',
            x: 'center',
            y: '255',
			textStyle:{
				color:'#777'
			},
            data: [
                {
                    name: wx
                },
                {
                    name: weibo
                },
                {
                    name: web
                },
                {
                    name: journal
                },
                {
                    name: app
                },
                {
                    name: forum
                }
            ]
        },
        series: [
            {
                name: '',
                type: 'pie',
                radius: ['44%', '66%'],
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
                        value: typeof (data.app) == 'undefined' ? 0 : data.app,
                        name: app,
                        itemStyle:
                                {
                                    normal: {color: '#73b6fa'}
                                }
                    },
                    {
                        value: typeof (data.wx) == 'undefined' ? 0 : data.wx,
                        name: wx,
                        itemStyle:
                                {
                                    normal: {color: '#65db65'}
                                }
                    },
                    {
                        value: typeof (data.weibo) == 'undefined' ? 0 : data.weibo,
                        name: weibo,
                        itemStyle:
                                {
                                    normal: {color: '#f57175'}
                                }
                    },
                    {
                        value: typeof (data.web) == 'undefined' ? 0 : data.web,
                        name: web,
                        itemStyle:
                                {
                                    normal: {color: '#f59d62'}
                                }
                    },
                    {
                        value: typeof (data.journal) == 'undefined' ? 0 : data.journal,
                        name: journal,
                        itemStyle:
                                {
                                    normal: {color: '#fcd874'}
                                }
                    },
                    {
                        value: typeof (data.forum) == 'undefined' ? 0 : data.forum,
                        name: forum,
                        itemStyle:
                                {
                                    normal: {color: '#73e0f0'}
                                }
                    }

                ]
            }]
    };
    box.setOption(option);
    box.on("click", function(param) {
    	if(!echarts_click_tip()) return false;
        var type = getTypeValue(param.name);
        var totalcount = param.value;
        if (totalcount == '0')
        {
            warning("暂无数据");
            return false;
        }
        var url = "/infolist/mtrans_typedis?sid=" + scheme_id + "&sentiment=" + sentiment + "&type=" + type + "&post_time=" + post_time;
        ;
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
/*************************媒体分布结束**********************************/


/*************************发布热区开始******************************/
//发布热区
function getTransTypeMapData(scheme_id, post_time, begin_time, end_time, sentiment) {
    if ($('#trans_type_map-loading').length > 0 || time_flag_trans_map) {
        data_loading(true, 'trans_type_map', '发布热区');
        time_flag_trans_map = false;
    } else {
        refresh_load('trans_type_map');
    }
    var chart_refresh = 'javascript:eval(getTransTypeMapData(\"' + scheme_id + '\",\"' + post_time + '\",\"' + begin_time + '\",\"' + end_time + '\",\"' + sentiment + '\"))';
    $.ajax({
        type: 'get',
        url: '/demo/getTransTypeMapData',
        data: {'sid': scheme_id, 'post_time': post_time, 'begin_time': begin_time, 'end_time': end_time, 'sentiment': sentiment},
        async: true,
        dataType: 'json',
        success: function(res) {
            if (res.code == '1')
            {
                data_loading(false, 'trans_type_map', '发布热区');
                showTransTypeMapChart(res.msg);
            } else
            {
                //$("#trans_type_map").text(res.msg);
                $("#trans_type_map").html("<div class='loading' id='trans_type_map-loading'>暂无数据</div>");
            }
        },
        error: function(res)
        {
            $("#trans_type_map").html("<div class='loading'><span class='nodataImg'><a href='javascript:void(0);' onclick='" + chart_refresh + "'></a></span></div>");
        }
    });
}

function showTransTypeMapChart(data) {
    var box = echarts.init(document.getElementById('trans_type_map'), 'dark');
    option = {
        tooltip: {
            trigger: 'item',
            formatter: "{b} : {c}"
        },
        dataRange: {
            padding: 2,
            itemHeight: 5,
            itemWidth: 15,
            min: data.minValue,
            max: data.maxValue,
            x:10,
            y: 175,
			textStyle:{
				color:'#777'
			},
            text: ['高', '低'], // 文本，默认为数值文本
            calculable: true
        },
        series: [
            {
                name: 'iphone3',
                type: 'map',
                mapLocation: {
                    x: '17',
                    y: 'center'
                },
                mapType: 'china',
                roam: false,
                itemStyle: {
                    emphasis: {label: {show: true}}
                },
                data: data.province
            },
        ]
    };
    box.setOption(option);
    // console.log(data.province)

    var ss = data.province;
    var nn = ss.sort(function(x, y) {
        return x.value > y.value ? -1 : 1;
    });

    var mm = nn.slice(0, 10);
    var html = '';
    $.each(mm, function(index, item) {
        html += '<tr><td>' + item.name + '</td><td>' + item.value + '</td></tr>'
    });
    $("#trans_order_tbody ").html(html);
    $("#monitor_trans_order").show();

    box.on("click", function(param) {
    	if(!echarts_click_tip()) return false;
        var type = 0;
        var totalcount = param.value;
        if (totalcount == '0')
        {
            warning("暂无数据");
            return false;
        }
        var url = "/infolist/mtrans_map?sid=" + scheme_id + "&np=" + param.name + "&sentiment=" + sentiment + "&post_time=" + post_time + "&type=" + type;
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

/*************************发布热区结束******************************/

/**************************活跃媒体开始*************************************/
$('#mediaModal').on('show.bs.modal', function () {
	var indVal = $(".type_active").find(".active").index();
	$(".type_active").eq(1).find('li').eq(indVal).addClass('active').siblings('li').removeClass('active');
	sentiment = $(".sentiment").find(".aHver").attr('data-rel');
	var type = $(".type_active").find(".active").attr('data-rel');
	getTransTypeActiveData(scheme_id, post_time, begin_time, end_time, sentiment, type);
});
$('#mediaModal').on('hide.bs.modal', function () {
	var indVal = $(".type_active").eq(1).find(".active").index();
	$(".type_active").eq(0).find('li').eq(indVal).addClass('active').siblings('li').removeClass('active');
});
function getTransTypeActiveData(scheme_id, post_time, begin_time, end_time, sentiment, type)
{
    if ($('#trans_type_active-loading').length > 0 || time_flag_trans_active) {
        data_loading(true, 'trans_type_active', '活跃媒体');
        time_flag_trans_active = false;
    } else {
        refresh_load('trans_type_active');
    }
    var chart_refresh = 'javascript:eval(getTransTypeActiveData(\"' + scheme_id + '\",\"' + post_time + '\",\"' + begin_time + '\",\"' + end_time + '\",\"' + sentiment + '\",\"' + type + '\"))';
    $.ajax({
        type: 'get',
        url: '/demo/getTransTypeActiveData',
        data: {'sid': scheme_id, 'post_time': post_time, 'sentiment': sentiment, 'begin_time': begin_time, 'end_time': end_time, 'type': type},
        async: true,
        dataType: 'json',
        success: function(res) {
            if (res.code == '1')
            {
                data_loading(false, 'trans_type_active', '活跃媒体');
                showTransTypeActiveChart(res.msg,'trans_type_active');
            } else
            {
                $("#trans_type_active").html("<div class='loading' id='trans_type_active-loading'>" + res.msg + "</div>");
            }
        },
        error: function(res)
        {
            $("#trans_type_active").html("<div class='loading'><span class='nodataImg'><a href='javascript:void(0);' onclick='" + chart_refresh + "'></a></span></div>");
        }
    });
}

function showTransTypeActiveChart(data,eleId)
{
	var rotVal,yVal;
    var tmp = data.type_num;
    var max = tmp[0];
    for (var i = 1; i < tmp.length; i++) {

        if (max < tmp[i])
            max = tmp[i];
    }
   //var maxdata = max + Math.ceil(max/5);
	var maxdata = max;

    var box = echarts.init(document.getElementById(eleId));
	if(eleId=='trans_type_active'){
		yVal = 60;
		rotVal = 0;
	}else{
		yVal = 80;
		rotVal = -13;
	}
    option = {
		tooltip : {
			trigger: 'item',
			textStyle : {
				align:'left'
			},
			formatter: "{b}<br/>{a}:{c}篇"
		},
        grid: {
			borderWidth: 0,
            x2: 20,
            x:20,
			y:50,
			y2:yVal
        },
        xAxis: [
            {
               // name: '媒体',
                type: 'category',
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
                axisLabel: {
                    show: true,
                    rotate: rotVal,
                    textStyle: {
                        color: '#777',
                        fontFamily: "Microsoft Yahei"
                    },
					formatter : function(params){
						var newParams = "";
						var paramsNameNumber = params.toString().length;
						
						if(paramsNameNumber > 3){
							if(eleId=='trans_type_active'){
								newParams =  params.substring(0,2) + '..';
							}else{
								newParams = params;
							}
						} else{
							newParams = params;
						}
						return newParams;
					}
                },
                data: data.type_name

            }
        ],
        yAxis: [
            {
               // name: '发文数',
                type: 'value',
                max: maxdata,
                axisLabel: {
					show: false,
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
        series: [
            {
                name: '发文数',
                type: 'bar',
                barWidth: 30,
                itemStyle: {
                    normal: {
                        color: '#73b6fa',
                        label: {
                            show: true,
							formatter : function(params){
								var newParams = params.value + '篇';
								return newParams;
							}
                        }
                    }
                },
                data: data.type_num
            }
        ]
    };
    box.setOption(option);

    box.on('click', function(param) {
    	if(!echarts_click_tip()) return false;
       	var type = $(".type_active").children(".active").attr('data-rel');
        var totalcount = param.value;
        if (totalcount == '0')
        {
            warning("暂无数据");
            return false;
        }
        var url = "/infolist/mtrans_typeactive?sid=" + scheme_id + "&app=" + param.name + "&sentiment=" + sentiment + "&post_time=" + post_time + "&type=" + type;
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

/**************************媒体活跃结束******************************************/
