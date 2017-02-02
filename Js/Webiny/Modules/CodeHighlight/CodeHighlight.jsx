import Webiny from 'Webiny';
import hljs from 'highlight.js';

class CodeHighlight extends Webiny.Ui.Component {
    constructor(props) {
        super(props);

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
        return <pre><code className={this.props.language}>{this.props.children}</code></pre>;
    }
};

export default CodeHighlight;