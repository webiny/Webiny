import Component from './../../Lib/Core/Component';

class Loader extends Component {

	constructor() {
		super();
	}

	render() {
		return (
            <div className="preloader small" style={{display:'block'}}>
                <span className="loader"><span className="loader-inner"></span></span>
                <i className="demo-icon icon-hkt-icon"></i>
            </div>
		);
	}
}

export default Loader;