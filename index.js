/**
 * Created by paipeng on 17.06.15.
 */


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

module.exports = {
    getLotto: function (year, id) {
        var json = [];
        if (year === undefined) {
            var this_year = new Date().getFullYear();
            for (var i = 1955; i <= this_year; i++) {
                json = json.concat(getLottoByYear(parseInt(i)));
            }
        } else if (year === 'last') {
            var this_year = new Date().getFullYear();
            json = getLottoByYear(year);
            json = json[json.length - 1];
        } else {
            var json_object = getLottoByYear(year);
            if (id === undefined) {
                json = json.concat(getLottoByYear(year));
            } else if (id < json_object.length) {
                json = json_object[id];
            } 
                
        }
        return json;
    }
};
