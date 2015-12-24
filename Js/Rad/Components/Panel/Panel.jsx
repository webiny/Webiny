import Component from './../../Lib/Component';

class Panel extends Component {

    render() {
        var classes = this.classSet('panel green_d', this.props.className);
        return <div className={classes}>{this.props.children}</div>;
    }
}

export default Panel;