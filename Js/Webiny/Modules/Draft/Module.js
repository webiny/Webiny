import Webiny from 'Webiny';
import Editor from './Editor';
import BasePlugin from './BasePlugins/BasePlugin';
import BlockTypePlugin from './BasePlugins/BlockTypePlugin';
import InlineStylePlugin from './BasePlugins/InlineStylePlugin';
import EntityPlugin from './BasePlugins/EntityPlugin';
import AtomicPlugin from './BasePlugins/AtomicPlugin';
import Utils from './Utils';
import InlineStyle from './Toolbar/InlineStyle';
import BlockType from './Toolbar/BlockType';
import Entity from './Toolbar/Entity';
import Atomic from './Toolbar/Atomic';

import Heading from './Plugins/Heading';
import Bold from './Plugins/Bold';
import Italic from './Plugins/Italic';
import Underline from './Plugins/Underline';
import UnorderedList from './Plugins/UnorderedList';
import OrderedList from './Plugins/OrderedList';
import AlignLeft from './Plugins/AlignLeft';
import AlignCenter from './Plugins/AlignCenter';
import AlignRight from './Plugins/AlignRight';
import Link from './Plugins/Link';
import Blockquote from './Plugins/Blockquote';
import Code from './Plugins/Code';
import CodeBlock from './Plugins/CodeBlock';
import ReactSandbox from './Plugins/ReactSandbox';
import Table from './Plugins/Table';
import ToJSON from './Plugins/ToJSON';


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
            BlockTypePlugin,
            InlineStylePlugin,
            EntityPlugin,
            AtomicPlugin,
            Plugins: {
                Heading,
                Bold,
                Italic,
                Underline,
                UnorderedList,
                OrderedList,
                AlignLeft,
                AlignCenter,
                AlignRight,
                Link,
                Blockquote,
                Code,
                CodeBlock,
                ReactSandbox,
                Table,
                ToJSON
            }
        };
    }
}

export default Module;
