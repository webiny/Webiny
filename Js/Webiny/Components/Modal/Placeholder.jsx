import Component from './../../Lib/Component';

class Placeholder extends Component {

	constructor() {
		super();
		this.state = {
			modal: null,
			onShown: _.noop,
			onHidden: _.noop
		};

		this.bindMethods('removeModal');
	}

	removeModal() {
		$(ReactDOM.findDOMNode(this)).modal('hide');
	}

	componentDidMount() {
		this.listen('Rad.Components.Modal.Create', state => {
			var newState = {
				modal: state,
				onShown: state.props.onShown || _.noop,
				onHidden: state.props.onHidden || _.noop
			};
			this.setState(newState);
		});

		this.listen('Rad.Components.Modal.Destroy', () => {
			this.removeModal();
		})
	}

	componentDidUpdate() {
		if (this.state.modal) {
			var el = $(ReactDOM.findDOMNode(this));
			el.modal({keyboard: true});

			el.on('hidden.bs.modal', (e) => {
				this.state.onHidden(e);
				this.setState({
					modal: null,
					onShown: _.noop,
					onHidden: _.noop
				});
				$('div.modal-backdrop').remove();
				$('body').removeClass('modal-open');
			});

			el.on('shown.bs.modal', (e) => {
				this.state.onShown(e);
			});
		}
	}

	render() {
		return (
			_.get(this, 'state.modal', null)
		);
	}
}

export default Placeholder;