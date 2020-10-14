from pymongo import MongoClient

client = MongoClient('localhost')

db = client['MattaDiazUrbano']

col = db['kudos']

