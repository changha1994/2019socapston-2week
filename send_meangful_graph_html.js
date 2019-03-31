var express = require('express')
var app = express()
var moment = require('moment');
var now = moment();
fs = require('fs');
mysql = require('mysql');
var connection = mysql.createConnection({
    host: 'localhost',
    user: 'me',
    password: 'mypassword',
    database: 'mydb'
})
connection.connect();

app.get('/graph', function (req, res) {
    console.log('got app.get(graph)');
    var html = fs.readFile('./graph.html', function (err, html) {
    html = " "+ html
    console.log('read file');
    var qstr = 'select * from sensors ';
    connection.query(qstr, function(err, rows, cols) {
      if (err) throw err;

      var data = "";
      var comma = ""
      for (var i=102; i< 178; i++) {
         r = rows[i];
         data += comma + "[new Date(2019,02,31,12,-10+"+r.id*2+"),"+ r.value +"]";
         comma = ",";
      }
      var header = "data.addColumn('date', 'Time');"
      header += "data.addColumn('number', 'Tempeature in my room');"
      html = html.replace("<%HEADER%>", header);
      html = html.replace("<%DATA%>", data);

      res.writeHeader(200, {"Content-Type": "text/html"});
      res.write(html);
      res.end();
    });
  });
})

var server = app.listen(9001, function () {
  var host = server.address().address
  var port = server.address().port
  console.log('listening at http://%s:%s', host, port)
});

