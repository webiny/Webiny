import Action from './Action';

class Delete extends Action {

	constructor() {
		super();
		this.state = {
			showModal: false
		};
	}

	showModal() {
		this.setState({showModal: true});
	}

	hideConfirmation() {
		if (this.mounted) {
			this.setState({showModal: false});
		}
	}

	componentDidMount() {
		this.mounted = true;
	}

	componentWillUnmount() {
		this.mounted = false;
	}

	render() {
		var confirmation = null;
		if (this.state.showModal) {
			confirmation = (
				<Webiny.Components.Modal.Confirmation
					message="Are you sure you want to delete this record?"
					onHidden={this.hideConfirmation.bind(this)}
					confirm={this.emitAction.bind(this, this.props.data)}
					/>
			);
		}
		return (
			<span className="ml2 mr2">
                <Webiny.Components.Form.Button size="small" onClick={this.showModal.bind(this)} type="default" {...this.props}>
					{this.props.label ? this.props.label : 'Delete'}
				</Webiny.Components.Form.Button>
				{confirmation}
            </span>
		);
	}
}

export default Delete;