class Example extends Webiny.Ui.View {

	constructor(props){
		super(props);

		this.state = {
			name: '',
			domains: []
		};

		Webiny.Model.set({
			Core: {
				Layout: {
					name: 'Unknown',
					domains: [
						'selecto.app',
						'huckletree.app',
						'webiny.app'
					]
				}
			}
		});
	}

	componentDidMount(){
		this.watch('Core.Layout', (data) => {
			this.setState(data);
		});
	}

    render() {

        return (
            <div>
                <h2>First Webiny view</h2>
				My name is "{this.state.name || 'Unknown'}"
				<ul>
					{this.state.domains.map((item, i) => <li key={i}>{item}</li>)}
				</ul>
            </div>
        );
    }
}

export default Example;
