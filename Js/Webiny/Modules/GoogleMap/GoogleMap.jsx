import Webiny from 'Webiny';

class GoogleMaps extends Webiny.Ui.Component {

    constructor(props) {
        super(props);

        this.map = null;
        this.marker = null;
        this.geoCoder = null;
        this.loading = null;

        if (!window.google) {
            WebinyBootstrap.includeScript('https://maps.googleapis.com/maps/api/js');
        }

        this.bindMethods('positionMarker,setupMap,search');
    }

    componentDidMount() {
        this.loading = setInterval(() => {
            if (window.google) {
                clearInterval(this.loading);
                this.loading = null;
                this.setupMap();
            }
        }, 50);
    }

    shouldComponentUpdate(newProps) {
        if (!this.props.valueLink) {
            return false;
        }

        return !_.isEqual(this.props.valueLink.value, newProps.valueLink.value);
    }

    componentDidUpdate() {
        if (!this.map) {
            return;
        }

        this.positionMarker();
    }

    setupMap() {
        this.map = new google.maps.Map($(ReactDOM.findDOMNode(this)).find('.google-map')[0], {
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
                });
            });
        }

        this.positionMarker();
    }

    positionMarker() {
        const lat = _.get(this, 'props.valueLink.value.lat');
        const lng = _.get(this, 'props.valueLink.value.lng');

        if (lat && lng) {
            const latLng = new google.maps.LatLng(parseFloat(lat), parseFloat(lng));
            this.map.panTo(latLng);
            this.marker.setMap(this.map);
            this.marker.setPosition(latLng);
        }
    }

    search(query) {
        if (!this.geoCoder) {
            this.geoCoder = new google.maps.Geocoder();
        }

        this.geoCoder.geocode({address: query}, results => {
            if (!_.isEmpty(results)) {
                const location = _.get(results[0], 'geometry.location');
                this.props.valueLink.requestChange({
                    lat: location.lat(),
                    lng: location.lng()
                });
            }
        });
    }
}

GoogleMaps.defaultProps = {
    zoom: 4,
    lat: 0,
    lng: 0,
    readOnly: false,
    renderer() {
        return (
            <div className="google-map--container">
                <div className="google-map" style={{width: '100%', height: '100%'}} {...this.props}></div>
            </div>
        );
    }
};

export default GoogleMaps;