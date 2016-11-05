import Webiny from 'Webiny';
const Ui = Webiny.Ui.Components;

class FloatingToolbar extends Webiny.Ui.Component {
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
                <div className="editor-toolbar" ref="toolbar" {...mouse} style={{display: this.props.show ? 'block' : 'none'}}>
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