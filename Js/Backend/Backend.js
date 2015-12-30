import Container from './Container';

var app = new Webiny.App('Core.Backend');
app.setInitialElement(React.createElement(Container));

// Automate this part through API as modules can be read on server
app.addModules('Layout');

Webiny.Console.setEnabled(true);

export default app;
