import Webiny from 'Webiny';
import 'Assets/styles.scss';
import 'Assets/images/public/bg-login.png';
import 'Assets/images/public/preloader_2.png';
import 'Assets/images/public/favicon.ico';
import Layout from './Modules/Layout';

class Skeleton extends Webiny.App {
    constructor() {
        super('Webiny.Skeleton');
        this.modules = [
            new Layout(this)
        ];
    }
}

Webiny.registerApp(new Skeleton());
