import Webiny from 'Webiny';
import 'Assets/styles.scss';

import './Modules/Core';
import Alert from './Modules/Alert';
import Animate from './Modules/Animate';
import Auth from './Modules/Auth';
import Button from './Modules/Button';
import Carousel from './Modules/Carousel';
import ChangeConfirm from './Modules/ChangeConfirm';
import Checkbox from './Modules/Checkbox';
import ClickConfirm from './Modules/ClickConfirm';
import ClickSuccess from './Modules/ClickSuccess';
import CodeEditor from './Modules/CodeEditor';
import CodeHighlight from './Modules/CodeHighlight';
import Copy from './Modules/Copy';
import Data from './Modules/Data';
import DateTime from './Modules/DateTime';
import Downloader from './Modules/Downloader';
import Draft from './Modules/Draft';
import Dropdown from './Modules/Dropdown';
import Dynamic from './Modules/Dynamic';
import Fieldset from './Modules/Fieldset';
import Files from './Modules/Files';
import Filters from './Modules/Filters';
import Form from './Modules/Form';
import GoogleMap from './Modules/GoogleMap';
import Gravatar from './Modules/Gravatar';
import Grid from './Modules/Grid';
import Growl from './Modules/Growl';
import HtmlEditor from './Modules/HtmlEditor';
import I18N from './Modules/I18N';
import Icon from './Modules/Icon';
import Input from './Modules/Input';
import Email from './Modules/Email';
import Label from './Modules/Label';
import LazyImage from './Modules/LazyImage';
import Link from './Modules/Link';
import List from './Modules/List';
import Loader from './Modules/Loader';
import Logic from './Modules/Logic';
import MarkdownEditor from './Modules/MarkdownEditor';
import Modal from './Modules/Modal';
import Panel from './Modules/Panel';
import Password from './Modules/Password';
import Popover from './Modules/Popover';
import Progress from './Modules/Progress';
import Radio from './Modules/Radio';
import Search from './Modules/Search';
import Select from './Modules/Select';
import Settings from './Modules/Settings';
import Switch from './Modules/Switch';
import Tabs from './Modules/Tabs';
import Tags from './Modules/Tags';
import Textarea from './Modules/Textarea';
import Tile from './Modules/Tile';
import Tooltip from './Modules/Tooltip';
import Validation from './Modules/Validation';
import View from './Modules/View';
import ViewSwitcher from './Modules/ViewSwitcher';
import Logger from './Logger';

class Core extends Webiny.App {
    constructor() {
        super('Core.Webiny');
        Webiny.Logger = new Logger();
        this.modules = [
            new Alert(this),
            new Animate(this),
            new Auth(this),
            new Button(this),
            new Carousel(this),
            new ChangeConfirm(this),
            new Checkbox(this),
            new ClickConfirm(this),
            new ClickSuccess(this),
            new CodeEditor(this),
            new CodeHighlight(this),
            new Copy(this),
            new Data(this),
            new DateTime(this),
            new Downloader(this),
            new Draft(this),
            new Dropdown(this),
            new Dynamic(this),
            new Email(this),
            new Fieldset(this),
            new Files(this),
            new Filters(this),
            new Form(this),
            new GoogleMap(this),
            new Gravatar(this),
            new Grid(this),
            new Growl(this),
            new HtmlEditor(this),
            new I18N(this),
            new Icon(this),
            new Input(this),
            new Label(this),
            new LazyImage(this),
            new Link(this),
            new List(this),
            new Loader(this),
            new Logic(this),
            new MarkdownEditor(this),
            new Modal(this),
            new Panel(this),
            new Password(this),
            new Popover(this),
            new Progress(this),
            new Radio(this),
            new Search(this),
            new Select(this),
            new Settings(this),
            new Switch(this),
            new Tabs(this),
            new Tags(this),
            new Textarea(this),
            new Tile(this),
            new Tooltip(this),
            new Validation(this),
            new View(this),
            new ViewSwitcher(this)
        ];

        this.modules.map(m => m.init());
    }
}

Webiny.registerApp(new Core());