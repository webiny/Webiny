import Webiny from 'Webiny';

class ChartBlock extends Webiny.Ui.Component {

}

ChartBlock.defaultProps = {
    title: '',
    description: '',
    renderer() {
        return (
            <div className="block chart-block">
                <div className="block-header">
                    <h4 className="block-title">{this.props.title}</h4>
                    <div className="block-period block-title-light">{this.props.description}</div>
                </div>
                <div className="chart-container">
                    {this.props.children}
                </div>
            </div>
        );
    }
};

export default Webiny.createComponent(ChartBlock);