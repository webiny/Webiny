import Webiny from 'Webiny';

class CodeHighlight extends Webiny.Ui.Component {
    constructor(props) {
        super(props);

        this.options = {
            innerHTML: false,
            className: this.props.language
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
        hljs.highlightBlock(ReactDOM.findDOMNode(this).querySelector('pre code'));
    }
}


CodeHighlight.defaultProps = {
    language: 'html',
    renderer() {
        return <pre><code className={this.options.className}>{this.props.children}</code></pre>;
    }
};

export default CodeHighlight;