import Container from './Container';

var app = new Webiny.App('Core.Backend');
app.setInitialElement(React.createElement(Container));

Webiny.Console.setEnabled(true);

class Config {
    constructor() {
        console.log("Me being constructed!");
        this.name = 'UBER CONFIG';
    }
}

class Test {
    constructor(config) {
        console.log("TEST CONFIG", config.name);
        config.name = 'Pavel changed me!';
    }
}

Webiny.Injector.constant('Cmp', Config);
Webiny.Injector.service('Config', Config);
Webiny.Injector.service('Test', Test, 'Config');


export default app;
