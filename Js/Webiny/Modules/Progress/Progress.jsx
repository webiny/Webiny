import Webiny from 'Webiny';

class Progress extends Webiny.Ui.Component {
    constructor(props){
        super(props);

        this.state = {
            value: props.value
        };

        this.bindMethods('setValue');
    }

    componentWillReceiveProps(props) {
        super.componentWillReceiveProps(props);
        this.setState({value: props.value});
    }

    setValue(value) {
        this.setState({value});
    }
}

Progress.defaultProps = {
    value: 0,
    renderer() {
        return (
            <div className="progress">
                <div className="progress__bar">
                    <div
                        className="progress__bar-inner"
                        role="progressbar"
                        aria-valuenow={this.state.value}
                        aria-valuemin="0"
                        aria-valuemax="100"
                        style={{width: this.state.value + '%'}}/>
                </div>
            </div>
        );
    }
};

export default Progress;