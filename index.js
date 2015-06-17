/**
 * Created by paipeng on 17.06.15.
 */


var express = require('express');
var cors = require('cors');

var app = express();
app.use(cors());


function convertLottoToJson(html, div_name, row_offset) {
    var divtojson = require('html-div2json-js');
    return divtojson.convert(html, div_name, row_offset);
}


function getLottoByYear(year) {
    //console.log("getLottoByYear " + year + " " + end);
    var url = "http://www.lottozahlenonline.de/statistik/beide-spieltage/lottozahlen-archiv.php?j=" + year;

    var request = require('sync-request');
    var res = request('GET', url);
    var json_object = convertLottoToJson(res.body, "gewinnzahlen", 1);
    //json_object.splice(0, 2);
    //console.log("write http response " + res.body);
    return json_object;
}

function getLotto(server_res, year) {
    server_res.writeHead(200, {'Content-Type': 'application/json'});
    var json = [];
    if (year === undefined) {
        var this_year = new Date().getFullYear();
        for (var i = 1955; i <= this_year; i++) {
            json = json.concat(getLottoByYear(parseInt(i)));
        }
    } else {
        json = json.concat(getLottoByYear(year));
    }
    server_res.write(JSON.stringify(json));
    server_res.end();
}

app.get('/lotto/:name', function (req, res) {
    var year = req.params.name;

    getLotto(res, year);
});

app.get('/lotto', function (req, res) {
    getLotto(res, undefined);
});


app.listen(3004);