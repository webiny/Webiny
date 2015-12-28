import Component from './../../Lib/Component';

class Body extends Component {
    render() {
        var classes = this.classSet('modal-body panel-body', this.props.className);
        return <div className={classes}>
            <div>{this.props.children}</div>
        </div>;
    }
}

export default Body;