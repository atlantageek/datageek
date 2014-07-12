var Client = require('node-rest-client').Client;
var LcdClient = require('lcdproc-client').LcdClient;

lc = new LcdClient(13666,'localhost');

function get_bitcoin()
{
  console.log("Get Bitcoin");
  client = new Client();
  client.registerMethod("jsonMethod", "http://blockchain.info/ticker", "GET");
  client.methods.jsonMethod(function(data, response){
            // parsed response body as js object
    var obj = JSON.parse(data);
            buy = obj.USD['buy'];
            sell = obj.USD['sell'];
        lc.widget_val("first_line",1,1,"BTC " );
        lc.widget_val("second_line",1,2,"B:" + buy + " S:" + sell);
        });
}


lc.on('init', function() {console.log("HI");});
lc.on('ready', function() {
  console.log("AAA");
  console.log("WIDTH: " + lc.width);
  console.log("HEIGHT: " + lc.height);
  lc.screen("bacon");
  lc.widget("first_line");
  lc.widget_val("first_line",1,1,"This is a line");
  lc.widget("second_line");
  lc.widget_val("second_line",1,2,"This is a second line");
  get_bitcoin();
  setInterval(get_bitcoin, 300000);
});
lc.init();


