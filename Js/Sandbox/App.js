import Webiny from 'Webiny';
import Dashboard from './Modules/Dashboard';

class Sandbox extends Webiny.App {
    constructor(){
        super('Core.Sandbox');
        this.modules = [
            new Dashboard(this)
        ];
    }
}

Webiny.registerApp(new Sandbox());