import Webiny from 'Webiny';
import ReactDOMServer from 'react-dom/server';
import './styles.scss';

class Tooltip extends Webiny.Ui.Component {

    componentDidMount() {
        super.componentDidMount();
        this.initTooltip.call(this);
    }

    componentDidUpdate() {
        super.componentDidUpdate();
        this.initTooltip.call(this);
    }

    initTooltip() {
        $(ReactDOM.findDOMNode(this)).tooltip({
            html: true,
            placement: this.props.placement
        });
    }
}

Tooltip.defaultProps = {
    placement: 'right',
    renderer() {
        let html = this.props.children;
        if (!_.isString(html)) {
            html = ReactDOMServer.renderToStaticMarkup(this.props.children);
        }
        return (
            <span title={html}>
                {this.props.target}
            </span>
        );
    }
};

export default Webiny.createComponent(Tooltip);