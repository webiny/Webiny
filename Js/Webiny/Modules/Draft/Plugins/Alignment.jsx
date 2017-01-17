import Webiny from 'Webiny';
const Ui = Webiny.Ui.Components;
import BasePlugin from './../BasePlugins/BasePlugin';

class Alignment extends BasePlugin {
    constructor(config) {
        super(config);
        this.name = 'alignment';
    }

    getEditConfig() {
        return {
            toolbar: () => {
                const buttons = [
                    {
                        align: 'left',
                        tooltip: 'Align block to the left'
                    },
                    {
                        align: 'center',
                        tooltip: 'Align block to the center'
                    },
                    {
                        align: 'right',
                        tooltip: 'Align block to the right'
                    }
                ];

                return (
                    <actions>
                        {buttons.map(b => {
                            const block = this.getStartBlock();
                            let align = null;
                            if (block) {
                                align = block.getData().get('align');
                            }

                            const props = {
                                icon: 'fa-align-' + b.align,
                                tooltip: b.tooltip,
                                disabled: this.isDisabled(),
                                onClick: () => {
                                    if (align && align === b.align) {
                                        this.editor.updateBlockData(block, {align: null});
                                    } else {
                                        this.editor.updateBlockData(block, {align: b.align});
                                    }
                                },
                                type: align && align === b.align ? 'primary' : 'default',
                                key: b.align,
                                plugin: this
                            };
                            return <Ui.Button {...props}/>
                        })}
                    </actions>
                );
            },
            blockStyleFn: (contentBlock) => {
                const data = contentBlock.getData().toJS();
                if (data.align) {
                    return 'alignment--' + data.align;
                }
            }
        };
    }
}

export default Alignment;