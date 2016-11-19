import Webiny from 'Webiny';

class Toolbar extends Webiny.Ui.Component {

    constructor(props) {
        super(props);

        this.state = {
            'floatingToolbarInterval': null
        };
    }

    componentDidMount() {
        super.componentDidMount();

        const floatingToolbarInterval = setInterval(()=> {
            const doc = $(document);
            const elem = $(ReactDOM.findDOMNode(this));
            if (doc.scrollTop() > (elem.closest('.rich-editor').offset().top - 49)) {
                elem.addClass('floating');
                elem.css({width: elem.closest('.rich-editor').outerWidth() - 2});
                elem.css({left: elem.closest('.rich-editor').offset().left + 6});
                elem.closest('.rich-editor').addClass('toolbar-floated');
            } else {
                elem.closest('.rich-editor').removeClass('toolbar-floated');
                elem.removeClass('floating');
                elem.css({width: 'auto'});
                elem.css({left: '0'});
            }
        }, 150);

        this.setState({'floatingToolbarInterval': floatingToolbarInterval});
    }

    componentWillUnmount() {
        super.componentWillUnmount();
        clearInterval(this.state.floatingToolbarInterval);
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