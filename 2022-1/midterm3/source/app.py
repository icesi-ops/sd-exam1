from flask import Flask
from redis import Redis
import os

app = Flask(__name__)
redis = Redis(host=os.environ['REDIS_HOST'], port=6379)

@app.route('/')
def hello():
    count = redis.incr('hits')
    return 'Hello World! I have been seen {} times.\n'.format(count)

@app.route('/liveness')
def liveness():
    return 'Everything works as we expected'

@app.route('/readiness')
def readiness():
    return 'Everything works as we expected'

if __name__ == "__main__":
    app.run(host="0.0.0.0", debug=True)
