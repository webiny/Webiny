import Component from './../../Lib/Component';

class Row extends Component {
    render(){
        return <div {...this.props} className={this.classSet('row', this.props.className)}>{this.props.children}</div>;
    }
}

export default Row;