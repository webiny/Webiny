import Webiny from 'Webiny';

class ImageSet extends Webiny.Ui.Component {
    constructor(props) {
        super(props);

        this.state = {
            images: [],
            interval: null
        };

        this.bindMethods('getImages, checkOffset');
    }

    componentDidMount() {
        super.componentDidMount();

        setTimeout(() => {
            this.getImages();
        }, 100); // give the change for the dom to finish rendering
    }

    getImages() {
        const dom = $(ReactDOM.findDOMNode(this));
        const images = [];
        dom.find('img').map((i, img) => {
            if (img.hasAttribute('data-src')) {
                img.setAttribute('offset', img.offsetTop);
                images.push(img);
            }
        });

        if (images.length > 0) {
            this.setState({images});
            const interval = setInterval(this.checkOffset, 500);
            this.setState({interval});
        }
    }

    checkOffset() {
        const offset = window.scrollY + window.innerHeight + this.props.offset;

        const images = [];
        this.state.images.map(img => {
            if (offset >= img.getAttribute('offset')) {
                img.setAttribute('src', img.getAttribute('data-src'));
            } else {
                images.push(img);
            }
        });

        this.setState({images});

        if (images.length <= 0) {
            clearInterval(this.state.interval);
            this.setState({interval: null});
        }
    }

}

ImageSet.defaultProps = {
    offset: 0,
    renderer() {
        return this.props.children;
    }
};

export default ImageSet;
