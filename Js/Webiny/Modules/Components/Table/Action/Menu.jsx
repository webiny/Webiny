import Action from './Action';

class Menu extends Action {

	onChangeSelectedItem(item) {
		this.emitAction({action: item, data: this.props.data});
	}

	render() {
		var [Dropdown,Grid] = this.inject('Dropdown,Grid');

		var options = [];
		React.Children.forEach(this.props.children, (item, index) => {
			if (_.has(item.props, 'hide') && item.props.hide(this.props.data)) {
				return;
			}

			if (_.has(item.props, 'show') && !item.props.show(this.props.data)) {
				return;
			}

			options.push(
				<Dropdown.Item default={item.props.default || false} key={index} label={item.props.children}
							   onClick={this.onChangeSelectedItem.bind(this, item.type)}/>
			)
		});

		return (
			<Dropdown.Menu caretLabel="More" size="small" valueLink={this.linkState('selectedItem')} name="selectedAction"
						   title="More">
				{options}
			</Dropdown.Menu>
		);
	}
}

export default Menu;