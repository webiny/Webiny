import Component from './../Lib/Component';

class Hide extends Component {

    render() {
        if(this.props.if === true){
			return null;
		}

		let children = React.Children.toArray(this.props.children);
		if(children.length == 1){
			return children[0];
		}

		return <hide-wrapper>{this.props.children}</hide-wrapper>;
    }
}

Hide.defaultProps = {
    if: false,
	return: null
};

export default Hide;