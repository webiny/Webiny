import Webiny from 'Webiny';
const Ui = Webiny.Ui.Components;

class Link extends Webiny.Ui.Component {

}

Link.defaultProps = {
    renderer() {
        const props = _.clone(this.props);
        const icon = props.icon ? <Ui.Icon icon={props.icon}/> : null;
        let link = <Ui.Link onClick={this.props.onClick}>{icon} {props.title}</Ui.Link>;

        if (props.children && !_.isString(props.children)) {
            link = this.props.children;
        }

        return (
            <li role="presentation">{link}</li>
        );
    }
};

export default Link;
