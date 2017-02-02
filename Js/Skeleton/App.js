import Webiny from 'Webiny';
import 'Assets/styles.scss';
import Layout from './Modules/Layout';

class Skeleton extends Webiny.App {
    constructor() {
        super('Core.Skeleton');
        this.modules = [
            new Layout(this)
        ];
    }
}

Webiny.registerApp(new Skeleton());
