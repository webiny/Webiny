class Example extends Webiny.View {

	constructor(props){
		super(props);

		this.state = {
			name: ''
		};
	}

	componentDidMount(){
		Webiny.DataTree.watch('name', (data, prevData, e) => {
			this.setState({name: e.data.currentData});
		});
	}

    render() {

        return (
            <div>
                <h2>Example view</h2>
				{this.state.name}
            </div>
        );
    }
}

export default Example;
