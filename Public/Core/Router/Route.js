class Route {
	/**
	 * @param state This is passed from History.getState()
	 */
	constructor(state){
		this.state = state;
	}

	getUrl(){
		return this.state.data.url;
	}
}

export default Route;