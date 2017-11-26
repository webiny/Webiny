# API plugin
This plugin spawns an `express` server and allows you to interact with the `webiny-cli` via API calls.
 
To create your own API method, in your CLI plugin simply attach an event handler to Webiny instance:
```
Webiny.on('your.action', ({res, data}) => {
    // Do something
    res.end();
});
```

To register your own API middleware:
```
Webiny.on('api.middleware', ({req, res, next}) => {
    // Do something
});
```

Now you can trigger your handler by sending a request to: 
`http://your.app:8002/?action=your.action`