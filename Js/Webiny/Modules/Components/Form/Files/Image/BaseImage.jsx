import ImageComponent from './../Base/ImageComponent';

class BaseImage extends ImageComponent {

	constructor(){
		super();
	}

}

BaseImage.defaultProps = {
	accept: ['image/jpg', 'image/jpeg', 'image/gif', 'image/png'],
	cropper: false,
	defaultImage: '',
	width: '100%'
};

export default BaseImage;