var path = require('path');
var fs = require('fs');

var projectRootDir = (function () {
    var node_modules = path.sep + 'node_modules' + path.sep;
    var pos = __dirname.indexOf(node_modules);
    if (pos > -1)
        return __dirname.substring(0, pos);

    if (module === require.main)
        return path.join(__dirname, '..');
})();

var assignDeep = function (from, to) {
    Object.keys(from).forEach(function (k) {
        if (!to[k])
            to[k] = from[k];
        else if (typeof (from[k]) === 'object')
            assignDeep(from[k], to[k]);
        else
            to[k] = from[k];
    });
}

var configPath = path.join(projectRootDir, process.env.NODE_CONFIG_PATH || 'config');
var _baseConfig = {};

if (fs.existsSync(path.join(configPath, 'default.json')))
    _baseConfig = require(path.join(configPath, 'default.json'))

if (process.env.NODE_ENV) {
    configPath = path.join(configPath, process.env.NODE_ENV.toLowerCase() + '.json');
    if (fs.existsSync(configPath)) {
        var _config = require(configPath);
        assignDeep(_config, _baseConfig);
    }
}

var assignDeep = function (from, to) {
    Object.keys(from).forEach(function (k) {
        if (!to[k])
            to[k] = from[k];
        else if (typeof (from[k]) === 'object')
            assignDeep(from[k], to[k]);
        else
            to[k] = from[k];
    });
}

module.exports = {
    get: function (key) {
        if (!key)
            throw new Error("config is not valid");

        var keys = key.split('.');
        var result;
        for (var i = 0; i < keys.length; i++) {
            if (i === 0)
                result = __baseConfig[keys[i]];
            else if (result)
                result = result[keys[i]]
        }

        return result;
    }
}