import Container from './Container';
var app = new Webiny.App('Backend');
app.setInitialElement(React.createElement(Container));
console.log("Backend App!!!");

export default app;
