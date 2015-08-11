/**
 * Created by Cyprien on 8/6/2015.
 */
/// <reference path="typings/tsd.d.ts" />
var gutil = require('gulp-util');
var yargs = require('yargs');
var through = require('through2');
var PLUGIN_NAME = 'gulp-angular-translate';
function addTranslation(opt) {
    var newKey = yargs.argv.key;
    var defaultValue = '## ' + newKey;
    gutil.log("key : " + newKey);
    return through.obj(function (file, enc, cb) {
        if (file.isNull()) {
            // return empty file
            return cb(null, file);
        }
        gutil.log(file.path);
        var languageTag = /.*lang-(\w+).*/gi.exec(file.path)[1];
        gutil.log("processing " + languageTag + " file");
        if (file.isBuffer()) {
            var map = JSON.parse(file.contents.toString('utf-8'));
            if (map[newKey]) {
                gutil.log('key already exists in file : ' + file.path + ', use --force to override');
            }
            else {
                if (yargs.argv[languageTag]) {
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
        //if (file.isStream()) {
        //    file.contents = file.contents.pipe(prefixStream(prefixText));
        //}
        cb(null, file);
    });
}
exports.addTranslation = addTranslation;
function deleteTranslation(opt) {
    var newKey = yargs.argv.key;
    var defaultValue = '## ' + newKey;
    gutil.log("key : " + newKey);
    return through.obj(function (file, enc, cb) {
        if (file.isNull()) {
            // return empty file
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
        //if (file.isStream()) {
        //    file.contents = file.contents.pipe(prefixStream(prefixText));
        //}
        cb(null, file);
    });
}
exports.deleteTranslation = deleteTranslation;
//# sourceMappingURL=index.js.map