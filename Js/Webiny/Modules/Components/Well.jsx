import Component from './../../Lib/Core/Component';

class Well extends Component {

    render() {
        var cssClass = 'well ';
        var sizesMap = {small: 'well-sm', large: 'well-lg'};
        cssClass += sizesMap[this.props.size] ? sizesMap[this.props.size] : sizesMap['small'];
        return <div {...this.props} className={cssClass}>{this.props.children}</div>;
    }
}

Well.defaultProps = {
    size: 'small'
};

export default Well;