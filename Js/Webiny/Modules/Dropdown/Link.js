import Webiny from 'Webiny';

class Link extends Webiny.Ui.Component {

}

Link.defaultProps = {
    renderer() {
        const props = _.clone(this.props);

        return (<li role="presentation">
            <a {...props}>
                {props.title}
            </a>
        </li>);
    }
};

export default Link;
