import Webiny from 'Webiny';
const Ui = Webiny.Ui.Components;

class InfoBlock extends Webiny.Ui.Component {

}

InfoBlock.defaultProps = {
    title: '',
    description: '',
    renderer() {
        return (
            <div className="block info-block">
                <div className="block-header">
                    <h4 className="block-title">{this.props.title}</h4>
                    <div className="block-period block-title-light">{this.props.description}</div>
                </div>
                <div className="block-content">
                    <div className="chart-container">
                        {this.props.children}
                    </div>
                </div>
            </div>
        );
    }
};

export default InfoBlock;