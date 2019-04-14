from django.shortcuts import render
from django.views import View
from django.core.paginator import Paginator
import pymongo
import datetime
from collections import Counter


# Create your views here.
class IndexView(View):
    def get(self, request):
        client = pymongo.MongoClient(host='localhost', port=27017)
        db = client.PubOpinionMonitoring
        collection = db.ChinaArticle
        contents = collection.find()
        paginator = Paginator(contents, 10)
        page_num = request.GET.get('page', 1)  # 从url中获取页码参数
        pages = paginator.page(page_num)
        # contents = collection.find().limit(10)

        # all_count = len(contents['emotion'])

        contents = {
            'contents': contents,
            'pages': pages,
            # "all_count": all_count
        }

        return render(request, "index.htm", contents)


class Big_page(View):
    def get(self, request):
        return render(request, 'big_page.htm')


class Big(View):
    def get(self, request):
        sourceNameList = []
        sourceNameCount = []
        # allKeyWord = []
        # allKeyWordCount = []

        client = pymongo.MongoClient(host='localhost', port=27017)
        db = client.PubOpinionMonitoring
        collection = db.ChinaArticle
        ne = collection.find({"emotion": {"$lt": 0.33}}).count()
        po = collection.find({"emotion": {"$gt": 0.66}}).count()
        no = collection.find({"emotion": {"$gte": 0.33, "$lte": 0.66}}).count()

        collecttions = collection.find()
        total = collecttions.count()
        source = collection.aggregate([{"$group": {"_id": "$source", "count": {"$sum": 1}}}, {"$sort": {"count": -1}}])
        for sou in source:

            if sou["_id"] == None:
                sourceNameList.append("None")
                sourceNameCount.append(sou["count"])
            elif sou["_id"] == "":
                sourceNameList.append("None1")
                sourceNameCount.append(sou["count"])
            else:
                sourceNameList.append(sou["_id"])
                sourceNameCount.append(sou["count"])
        clasifer = ["军事", "经济", "投资", "产经", "汽车", "佛教", "电影", "游戏", "三农", "科技", "文史", "政务"]
        clasifernum = [180, 130, 80, 40, 202, 78, 153, 207, 273, 87, 253, 80, 94]

        allKeyWord = ["经济", "发展", "用户", "旅游", "健康", "马克思主义", "理论", "创新", "时尚", "AWE", "智慧", "热水器", "基层", "网络", "食品",
                      "食品安全", "涉事", "产品", "雪龙", "南极", "考古", "夜间", "游客", "消费", "夜游", "体验", "文化", "生态", "平台", "观众", "烟草",
                      "税价"]
        allKeyWordCount = [56, 53, 50, 47, 47, 43, 40, 40, 38, 36, 35, 33, 31, 30, 30, 28, 27, 26, 26, 25, 23, 22, 21,
                           21, 19, 18, 17, 17, 16, 15, 15, 14, 14, 14, 14, 13]
        # c = Counter()
        # for i in collecttions:
        #     if i["key_words"]:
        #         for word in i["key_words"]:
        #             c[word] += 1
        # for (k, v) in c.most_common(40):
        #     allKeyWord.append(k)
        #     allKeyWordCount.append(v)

        numy = {"ne": ne,
                "po": po,
                "no": no,
                "total": total,
                "sourceNameList": sourceNameList[:15],
                "sourceNameCount": sourceNameCount[:15],
                "clasifer": clasifer,
                "clasifernum": clasifernum,
                "allKeyWord": allKeyWord,
                "allKeyWordCount": allKeyWordCount,
                "time": datetime.datetime.now().strftime('%Y-%m-%d %H:%M:%S')}
        return render(request, 'big.html', {"num": numy})


class BII(View):
    def get(self, request):
        sourceNameList = ["a", "v", "d", "e", "w", "sde"]
        sourceNameCount = [8, 15, 10, 9, 12, 14]
        num = {"qa": 123,
               "sd": 234,
               "we": 345,
               "sourceNameList": sourceNameList,
               "sourceNameCount": sourceNameCount}
        return render(request, 'ini.html', {"num": num})
