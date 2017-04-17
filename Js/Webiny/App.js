import Webiny from 'Webiny';
import 'Assets/styles.scss';

import './Modules/Core';
import './Ui/Components';
import './Vendors';
/*import Alert from './Modules/Alert';
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
 import Growl from './Modules/Growl';
 import HtmlEditor from './Modules/HtmlEditor';
 import I18N from './Modules/I18N';
 import Icon from './Modules/Icon';
 import Email from './Modules/Email';
 import ExpandableList from './Modules/ExpandableList';
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
 import ViewSwitcher from './Modules/ViewSwitcher';*/
import Validation from './Modules/Validation';
/*import View from './Modules/View';*/
import Logger from './Logger';
import Grid from './Modules/Grid';
import Input from './Modules/Input';

class Core extends Webiny.App {
    constructor() {
        super('Core.Webiny');
        Webiny.Logger = new Logger();
        this.modules = [
            new Input(this),
            new Grid(this),
            new Validation(this)
        ];

        this.modules.map(m => m.init());
    }
}

Webiny.registerApp(new Core());