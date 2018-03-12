# What is this?

This package helps you setup `configuration` for your `node.js` applications. It enables you to have different configuration for different environments i.e. for local, development, staging, production etc. As it's name suggests, it's very tiny with no external dependencies and under 100 lines of code.

# How does it work?

It tries to follow a very simple and intuitive convention so that you don't have to do too much work.

1. It tries to figure out the directory where you might be keeping the config files. By default it searches for `config` directory in the root of your project, if that is not the place you want to keep config files then you can set `NODE_CONFIG_PATH` environment variable, which should be the path of your config directory relative to the root of your project.

2. All the files in the config directory should be JSON file with `.json` extension.

3. Sometimes the only reason you want to have a configuration system is to externalize values from your code, in this case all you need is to create a file named `default.json` in the config directory (as mentioned in #1) and put all the config settings in that file.

4. In cases where you want to override some of the config settings present in `default.json` or want to add some more settings based on the deployment environment, you need to create additional files in the config directory and name it whatever value you are going to set for `NODE_ENV` environment variable. For example if your deployment environment is `stating` then create `staging.json` under config directory.

5. You can override settings using env variable, for example if you have `process.env.connectionString` set, then it takes precedence and will be the effective value, overriding the value set in the config files.

## Example Setup

If you have following files in you configuration directory (i.e. either `config` or whatever path you have set in `NODE_CONFIG_PATH`):

```.
├── default.json
├── development.json
├── local.json
├── production.json
└── staging.json
```
and you have `NODE_ENV` env variale set to `staging` then all the settings present in the `default.json` will be taken first and then all the settings present in the `staging.json` would be applied on top of it, in which case additional settings will be added, settings with the same `key` would be overwritten and missing setting would be carried from the `default.json`.

# Quick Start

Add the dependency using `npm` :

```
npm install tiny-config --save
mkdir config
```

considering you have following `default.json`

```json
{
    "connectionString": "local_connection_string",
    "serviceConfig": {
        "retryConfig": {
            "maxAttempts": 3
        }
    },
    "logLevel": "debug",
    "author": "Nishant Chaturvedi"
}
```

and `production.json` is:

```json
{
    "connectionString": "prod_connection_string",
    "serviceConfig": {
        "retryConfig": {
            "maxAttempts": 5
        }
    },
    "logLevel": "error",
    "errors": {
        "enableStackTrace": true
    },
    "version": "1.2.0"
}
```
considering you have set `NODE_ENV` to `production`, you can access the setting as follows:

```javascript
var config = require('tiny-config');

var connectionString = config.get('connectionString');
//"prod_connection_string"

var isStackTraceEnabled = config.get('errors.enableStackTrace');
//true
var retryConfig = config.get('serviceConfig.retryConfig');
//{"maxAttempts": 5}

var retryAttempts = config.get('serviceConfig.retryConfig.maxAttempts');
//5

//considering you have set `version` env var to "2.0.0" 
var version = config.get("version")
//2.0.0

var all = config.getAll()
//Will return the map which has effective config settings

```


