import pymongo
from snownlp import SnowNLP
import jieba
from bson import ObjectId
from collections import Counter
from wordcloud import WordCloud


client = pymongo.MongoClient(host='localhost', port=27017)
db = client.PubOpinionMonitoring
collection = db.ChinaArticle
# name = []
# count = []
all_words = []
# source = collection.aggregate([{"$group": {"_id": "$source", "count": {"$sum": 1}}}, {"$sort": {"count": -1}}])
# for ls in source:
#     name.append(ls["_id"])
#     count.append(ls["count"])
#     all_words.extend(ls['key_words'])

clo = collection.find()
for cl in clo:
    all_words.extend(cl['key_words'])
# print(name)
# print(count)
# print(all_words)


# c = Counter()
# for x in all_words:
#     if len(x)>1 and x != '\r\n':
#         c[x] += 1
# print('常用词频度统计结果')
# for (k,v) in c.most_common(40):
#     print('%s%s %s  %d' % ('  '*(5-len(k)), k, '*'*int(v/3), v))


wordcloudimg = WordCloud(font_path= '/nlpPro/static/ziti/ZhuLangXinSong.otf',background_color='white', max_font_size=80).generate(all_words)
# word_img = wordcloudimg.to_array()
wordcloudimg.to_file('word_loud.jpg')



#*****
# message = collection.find()
# # 情感处理的问题
# def emotion(mess):
#     return SnowNLP(mess).sentiments
# # 处理关键字
# def key_list(mess):
#     return jieba.analyse.extract_tags(mess, topK = 10, withWeight = False, withFlag = True)
#
# # 查询数据之后利用id进行情感分析之后，更新到后面
# for i in message:
# #     print(i['_id'])
#     collection.update_many({"_id":ObjectId(i['_id'])}, {"$set":{
#     "emotion": emotion(i['content']),
#     "key_words":key_list(i['content'])}})

