import Webiny from 'Webiny';

class Progress extends Webiny.Ui.Component {
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
                        aria-valuenow={this.props.value}
                        aria-valuemin="0"
                        aria-valuemax="100"
                        style={{width: this.props.value + '%'}}/>
                </div>
            </div>
        );
    }
};

export default Webiny.createComponent(Progress);