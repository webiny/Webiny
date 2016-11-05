import Webiny from 'Webiny';
import Utils from './Utils';
const Ui = Webiny.Ui.Components;

class FloatingToolbar extends Webiny.Ui.Component {
    componentDidUpdate() {
        super.componentDidMount();
        if (this.props.show) {
            const sel = Utils.getSelectionCoords(ReactDOM.findDOMNode(this.props.editor));
            if (sel) {
                const toolbar = $(ReactDOM.findDOMNode(this.refs.toolbar));
                let left = sel.left - (toolbar.width() / 2);
                if (left < -90) {
                    left = -90;
                }

                toolbar.css({left});
                const offset = toolbar.offset();
                const right = offset.left + toolbar.width();
                if (right >= document.documentElement.clientWidth) {
                    toolbar.css({left: left - (right - document.documentElement.clientWidth + 30)});
                }
            }
        }
    }
}

FloatingToolbar.defaultProps = {
    renderer() {
        const mouse = {
            onMouseDown: e => e.stopPropagation(),
            onClick: e => e.stopPropagation()
        };

        return (
            <Webiny.Ui.Components.Animate
                trigger={this.props.show}
                show={{translateY: 25, opacity: 1, duration: 100}}
                hide={{translateY: -25, opacity: 0, duration: 100}}>
                <div className="editor-toolbar" ref="toolbar" {...mouse} style={{display: this.props.show ? 'flex' : 'none'}}>
                    {this.props.plugins.getToolbarActions().map((action, i) => {
                        return (
                            <span key={i} className="toolbar-action">
                                {React.cloneElement(action, {key: i})}
                            </span>
                        );
                    })}
                </div>
            </Webiny.Ui.Components.Animate>
        );
    }
};

export default FloatingToolbar;