import Component from './../../../../Lib/Core/Component';

class GoogleMaps extends Component {

	constructor() {
		super();
		this.map = null;
		this.marker = null;
	}

	componentDidMount() {
		this.map = new google.maps.Map(ReactDOM.findDOMNode(this), {
			center: new google.maps.LatLng(this.props.lat, this.props.lng),
			zoom: this.props.zoom,
			mapTypeId: google.maps.MapTypeId.ROADMAP
		});

		this.marker = new google.maps.Marker({
			map: this.map,
			draggable: true,
			position: {lat: this.props.lat, lng: this.props.lng}
		});

		if (!this.props.readOnly) {
			google.maps.event.addListener(this.marker, 'dragend', () => {
				this.props.valueLink.requestChange({
					lat: this.marker.getPosition().lat(),
					lng: this.marker.getPosition().lng()
				})
			});
		}

	}

	shouldComponentUpdate(newProps) {
		if (!this.props.valueLink) {
			return false;
		}

		return !_.isEqual(this.props.valueLink.value, newProps.valueLink.value)
	}

	componentDidUpdate() {
		var lat = _.get(this, 'props.valueLink.value.lat');
		var lng = _.get(this, 'props.valueLink.value.lng');

		if (lat && lng) {
			var latLng = new google.maps.LatLng(lat, lng);
			this.map.panTo(latLng);
			this.map.setZoom(15);
			this.marker.setMap(this.map);
			this.marker.setPosition(latLng);
		}
	}

	render() {
		return (
			<div className="col-xs-12" {...this.props}>
				<div name="google-map"></div>
			</div>
		);
	}
}

GoogleMaps.defaultProps = {
	zoom: 4,
	lat: 0,
	lng: 0
};

export default GoogleMaps;