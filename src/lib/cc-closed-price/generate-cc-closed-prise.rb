#! /usr/bin/env ruby

require 'net/http'
require 'date'
require 'uri'
require 'json'

OUT_FILE = 'index.js'

data = {};
getDate = Date.new(2017, 1, 1)
toDate = Date.new(2018, 1, 1)

while getDate <= toDate do
  url = 'https://coincheck.com/ja/exchange/closing_prices/list?month=%s&year=%s' % [ getDate.month, getDate.year ]
  uri = URI.parse(url)
  req = Net::HTTP.new(uri.host, uri.port)
  req.use_ssl = true
  json = Net::HTTP.get uri
  tmp = JSON.parse(json)
  data.merge! tmp['closing_prices']
  getDate = getDate >> 1
end

File.open(OUT_FILE, "w") do |f|
  js =<<EOF
let data = JSON.parse('%s');
function formatDate (date, format) {
  format = format.replace(/yyyy/g, date.getFullYear());
  format = format.replace(/MM/g, ('0' + (date.getMonth() + 1)).slice(-2));
  format = format.replace(/dd/g, ('0' + date.getDate()).slice(-2));
  format = format.replace(/HH/g, ('0' + date.getHours()).slice(-2));
  format = format.replace(/mm/g, ('0' + date.getMinutes()).slice(-2));
  format = format.replace(/ss/g, ('0' + date.getSeconds()).slice(-2));
  format = format.replace(/SSS/g, ('00' + date.getMilliseconds()).slice(-3));
  return format;
};

module.exports.fetchClosedPrice = function fetchClosedPrice(date, ccy) {
  ccy = ccy.toLowerCase();
  return data[formatDate(date, 'yyyy-MM-dd')][ccy][1];
}
EOF
  f.puts(js % [JSON.generate(data)])
end
