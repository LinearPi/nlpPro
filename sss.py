import pymongo

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
print(all_words)
