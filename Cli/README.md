# CLI plugins

This folder contains CLI plugins that will be picked up by the `webiny-cli`.
If you develop your own plugins, you need to enable them in `webiny.json` file in the root of your app:

```
{
    "cli": {
        "plugins": [
            "./Path/To/Your/Plugin"
        ]
    }
}
```

`webiny-cli` will go through all Webiny apps and look for `webiny.json` file in the root of each app.
If found, the file will be read and plugins will be loaded into the cli.

## Plugin hooks
Plugins can define hooks to allow hooking into the process and modify data from outside of the plugin itself
In our built-in plugins we are already exposing a couple of hooks to allow developers to modify webpack configurations, for example. 
To register a handler for a particular hook use the following syntax in the `webiny.json` file: 

```
{
    "cli": {
        "hooks": {
            "before-webpack-apps": [
               "./Path/To/Your/Hook"
            ]
        }
    }
}
```

Hook handlers are simple functions that take an object containing data from the plugin as the only parameter and returns a Promise.
When the promise is resolved - a hook handler is considered as done. A simple example:
 
 ```
 module.exports = ({configs}) => {
     return new Promise((resolve, reject) => {
        // Do something with `configs`
        resolve();
     });
 };
 ```