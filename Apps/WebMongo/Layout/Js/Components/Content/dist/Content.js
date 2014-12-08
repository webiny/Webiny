import BaseComponent from '/Core/Base/BaseComponent';

class Content extends BaseComponent {

	getDefaultProperties() {
		return {
			title: 'WebMongo-Layout-Content',
			count: 2
		}
	}

	getTemplate() {
		return 'React.createElement("div", {className: "component col-sm-12"}, React.createElement("h4", null, this.props.title),\
		function(){\
			if(this.props.title == \'Pavel\'){\
				return React.createElement("div", null, "Custom content instead of predefined inner HTML",\
					function(){\
						if(this.props.count == 2){\
							return React.createElement("div", null, React.createElement("h2", null, "Second level"))\
						} else {\
							return React.createElement("div", null, React.createElement("h3", null, "Third level"));\
						}\
					}.bind(this)()\
				)\
			} else {\
				return React.createElement("div", null, this.props.children);\
			}\
		}.bind(this)(),\
			function(){\
				if(this.props.count == 3){\
					return React.createElement("div", null, "Count: ", this.props.count)\
				} else {\
					return React.createElement("div", null, "No count!!");\
				}\
			}.bind(this)()\
	)';
	}
}

export default Content;
