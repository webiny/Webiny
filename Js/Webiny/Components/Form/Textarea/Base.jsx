import InputComponent from './../Base/InputComponent';

class Base extends InputComponent {

    getType() {
        return this.props.type;
    }
}

export default Base;
