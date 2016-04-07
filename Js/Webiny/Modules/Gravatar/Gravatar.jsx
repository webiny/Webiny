import Webiny from 'Webiny';
const Ui = Webiny.Ui.Components;

class Gravatar extends Webiny.Ui.Component {

}

Gravatar.defaultProps = {
    size: 48,
    renderer: function renderer() {
        return (
            <img src={'http://www.gravatar.com/avatar/'+this.props.hash+'?s='+this.props.size} width={this.props.size} height={this.props.size}/>
        );
    }
};

export default Gravatar;