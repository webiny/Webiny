import Webiny from 'Webiny';

class CodeHighlight extends Webiny.Ui.Component {
    constructor(props) {
        super(props);

        this.options = {
            innerHTML: false,
            className: _.get(this.props, 'language', 'html')
        };

        this.bindMethods('doHighlight');
    }

    componentDidMount() {
        this.doHighlight();
    }

    componentDidUpdate() {
        this.doHighlight();
    }

    doHighlight() {
        const nodes = ReactDOM.findDOMNode(this).querySelectorAll('pre code');
        hljs.highlightBlock(nodes[0]);
    }
}


CodeHighlight.defaultProps = {
    renderer() {
        return <pre><code className={this.options.className}>{this.props.children}</code></pre>;
    }
};

export default CodeHighlight;