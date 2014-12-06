import BaseComponent from '/Core/Base/BaseComponent';

class Content extends BaseComponent {

	getDefaultProperties() {
		return {
			title: 'WebMongo-Layout-Content'
		}
	}

	getTemplate() {
		return '<div className="component col-sm-12"> \
					<h4>{this.props.title}</h4> \
					<w-if cond="this.props.title == \'Pavel\'">\
						Custom content instead of predefined inner HTML\
					<w-else>\
						{this.props.children}\
					</w-if>\
				</div>';
	}
}

export default Content;
