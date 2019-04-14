from django.shortcuts import render
from django.views import View
from django.core.paginator import Paginator
import pymongo
import datetime


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

        client = pymongo.MongoClient(host='localhost', port=27017)
        db = client.PubOpinionMonitoring
        collection = db.ChinaArticle
        ne = collection.find({"emotion": {"$lt": 0.33}}).count()
        po = collection.find({"emotion": {"$gt": 0.66}}).count()
        no = collection.find({"emotion": {"$gte": 0.33, "$lte": 0.66}}).count()
        total = collection.find().count()
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
        # sourceNameList = ["a", "v", "d", "e", "w", "sde"]
        # sourceNameCount = [8, 15, 10, 9, 12, 14]

        numy = {"ne": ne,
                "po": po,
                "no": no,
                "total": total,
                "sourceNameList": sourceNameList,
                "sourceNameCount": sourceNameCount,
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
