import os
from poloniexwrapper import poloniex 

polo = poloniex.poloniex(os.environ['POLONIEX_APIKEY'], os.environ['POLONIEX_APISECRET'])

print(polo.returnTicker())
