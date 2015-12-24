import InputComponent from './../Base/InputComponent';

class Base extends InputComponent {

    getList() {
        var list = _.get(this, 'props.valueLink.value', []);

        if (list.length) {
            return (
                <ul className="list-group mt5">
                    {list.map((item, index) => {
                        return (
                            <li className="animated flipInX list-group-item" key={'list-item-' + item}>
                                {item}
                                <button onClick={this.removeItem.bind(this, index)} type="button"
                                        className="close">×
                                </button>
                            </li>
                        );
                    })}
                </ul>
            );
        }

        return (
            <ul className="list-group mt5">
                <li className="animated flipInX list-group-item">
                    {this.props.emptyMessage}
                </li>
            </ul>
        );

    }

    removeItem(index) {
        var list = this.props.valueLink.value;
        list.splice(index, 1);
        this.props.valueLink.requestChange(list);
    }

    clearInput() {
        ReactDOM.findDOMNode(this.refs.input).value = '';
    }

    addItem() {
        var value = ReactDOM.findDOMNode(this.refs.input).value;
        if (value) {

            if (!_.isArray(this.props.valueLink.value)) {
                this.props.valueLink.requestChange([value]);
                this.clearInput();
                return;
            }

            if (this.props.unique && this.props.valueLink.value.indexOf(value) > -1) {
                return;
            }

            var list = this.props.valueLink.value;
            list.unshift(ReactDOM.findDOMNode(this.refs.input).value);
            this.props.valueLink.requestChange(list);
            this.clearInput();
        }
    }

    onKeyDown(e) {
        this.key = e.key;

        switch (this.key) {
            case 'Enter':
				e.stopPropagation();
				e.preventDefault();
                this.addItem();
                break;
            case 'Escape':
				e.stopPropagation();
				e.preventDefault();
                this.clearInput();
                break;
        }
    }
}

export default Base;
