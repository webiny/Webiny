import Webiny from 'Webiny';
const Ui = Webiny.Ui.Components;

class Toolbar extends Webiny.Ui.Component {
    componentDidMount() {
        super.componentDidMount();

        $(document).on('scroll', () => {
            const doc = $(document);
            const elem = $(ReactDOM.findDOMNode(this));
            if(doc.scrollTop() > 490) {
                elem.addClass('floating');
                elem.css({width: elem.closest('.rich-editor').width()});
            } else {
                elem.removeClass('floating');
                elem.css({width: 'auto'});
            }
        });
    }

    componentWillUnmount() {
        super.componentWillUnmount();
        $(document).off('scroll');
    }
}

Toolbar.defaultProps = {
    renderer() {
        return (
            <div className="editor-toolbar">
                {this.props.plugins.getToolbarActions().map((action, i) => {
                    return (
                        <span key={i} className="toolbar-action">
                        {React.isValidElement(action) ? React.cloneElement(action) : action()}
                    </span>
                    );
                })}
            </div>
        );
    }
};

export default Toolbar;