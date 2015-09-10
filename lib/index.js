/**
 * Created by Cyprien on 8/6/2015.
 */
/// <reference path="../typings/tsd.d.ts" />
var gutil = require('gulp-util');
var yargs = require('yargs');
var through = require('through2');
var PLUGIN_NAME = 'gulp-angular-translate';
function addTranslation(opt) {
    var newKey = yargs.argv.key;
    var defaultValue = '## ' + newKey;
    gutil.log("Adding key : " + newKey);
    return through.obj(function (file, enc, cb) {
        if (file.isNull()) {
            return cb(null, file);
        }
        var languageTag = /.*lang-(\w+).*/gi.exec(file.path)[1];
        if (file.isBuffer()) {
            var map = JSON.parse(file.contents.toString('utf-8'));
            if (map[newKey]) {
            }
            else {
                if (yargs.string(languageTag).argv[languageTag]) {
                    map[newKey] = yargs.argv[languageTag];
                }
                else {
                    map[newKey] = defaultValue;
                }
                var keys = Object.keys(map);
                keys = keys.sort(function (a, b) { return a < b ? -1 : 1; });
                file.contents = new Buffer(JSON.stringify(map, keys, 4), "utf-8");
            }
        }
        cb(null, file);
    });
}
exports.addTranslation = addTranslation;
function deleteTranslation(opt) {
    var newKey = yargs.argv.key;
    var defaultValue = '## ' + newKey;
    return through.obj(function (file, enc, cb) {
        if (file.isNull()) {
            return cb(null, file);
        }
        if (file.isBuffer()) {
            var map = JSON.parse(file.contents.toString('utf-8'));
            if (map[newKey]) {
                delete map[newKey];
                var keys = Object.keys(map);
                keys = keys.sort(function (a, b) { return a < b ? -1 : 1; });
                file.contents = new Buffer(JSON.stringify(map, keys, 4), "utf-8");
            }
        }
        cb(null, file);
    });
}
exports.deleteTranslation = deleteTranslation;
