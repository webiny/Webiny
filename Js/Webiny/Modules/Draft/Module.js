import Webiny from 'Webiny';
import Editor from './Editor';
import BasePlugin from './BasePlugins/BasePlugin';
import EntityPlugin from './BasePlugins/EntityPlugin';
import AtomicPlugin from './BasePlugins/AtomicPlugin';
import Utils from './Utils';
import InlineStyle from './Toolbar/InlineStyle';
import BlockType from './Toolbar/BlockType';
import Entity from './Toolbar/Entity';
import Atomic from './Toolbar/Atomic';

import Bold from './Plugins/Bold';
import Italic from './Plugins/Italic';
import Underline from './Plugins/Underline';
import Link from './Plugins/Link';
import Blockquote from './Plugins/Blockquote';
import CodeBlock from './Plugins/CodeBlock';
import ReactSandbox from './Plugins/ReactSandbox';
import ToJSON from './Plugins/ToJSON';
import SyntaxHighlight from './Plugins/SyntaxHighlight';


class Module extends Webiny.Module {

    init() {
        Webiny.Ui.Components.Draft = {
            Editor,
            Toolbar: {
                InlineStyle,
                BlockType,
                Entity,
                Atomic
            }
        };

        Webiny.Draft = {
            Utils,
            BasePlugin,
            EntityPlugin,
            AtomicPlugin,
            Plugins: {
                Bold,
                Italic,
                Underline,
                Link,
                Blockquote,
                CodeBlock,
                ReactSandbox,
                ToJSON,
                SyntaxHighlight
            }
        };
    }
}

export default Module;
