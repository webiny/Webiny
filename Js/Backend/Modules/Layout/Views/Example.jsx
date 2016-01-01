class Example extends Webiny.Ui.View {

	constructor(props){
		super(props);

		this.state = {
			name: ''
		};
	}

	componentDidMount(){
		this.watch('name', (data, prevData, e) => {
			this.setState({name: e.data.currentData});
		});
	}

    render() {

        return (
            <div>
                <h2>First Webiny view</h2>
				My name is "{this.state.name || 'Unknown'}"
            </div>
        );
    }
}

export default Example;
