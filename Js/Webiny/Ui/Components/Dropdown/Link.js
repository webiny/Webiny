import Webiny from 'Webiny';

class Link extends Webiny.Ui.Component {

}

Link.defaultProps = {
    renderer() {
        const props = _.clone(this.props);
        const {Link, Icon} = props;
        const icon = props.icon ? <Icon icon={props.icon}/> : null;
        let link = <Link onClick={this.props.onClick}>{icon} {props.title}</Link>;

        if (props.children && !_.isString(props.children)) {
            link = this.props.children;
        }

        return (
            <li role="presentation">{link}</li>
        );
    }
};

export default Webiny.createComponent(Link, {modules: ['Link', 'Icon']});
