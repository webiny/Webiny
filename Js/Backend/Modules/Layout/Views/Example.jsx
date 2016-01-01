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
                <h2>Example view</h2>
				My name is {this.state.name}
            </div>
        );
    }
}

export default Example;
