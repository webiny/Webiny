import Component from './../../Core/Core/Component';

class Body extends Component {

    render() {
        var classes = this.classSet('panel-content', this.props.className);
        return <div {...this.props} className={classes}>{this.props.children}</div>;
    }
}

export default Body;