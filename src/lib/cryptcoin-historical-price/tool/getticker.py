import os
import poloniex
import datetime
import pytz
import time

polo = poloniex.Poloniex(os.environ['POLONIEX_APIKEY'], os.environ['POLONIEX_APISECRET'])
jst = pytz.timezone('Japan')
start = datetime.datetime.strptime("2017-01-01 00:00:00", '%Y-%m-%d %H:%M:%S').replace(tzinfo=jst)
end = datetime.datetime.strptime("2017-03-31 23:59:59", '%Y-%m-%d %H:%M:%S').replace(tzinfo=jst)
ret = polo.returnChartData("BTC_LTC", 86400, 
        int(time.mktime(start.utctimetuple())),
        int(time.mktime(end.utctimetuple())))
print(ret)
