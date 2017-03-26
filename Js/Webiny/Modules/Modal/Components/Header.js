import Webiny from 'Webiny';

class Header extends Webiny.Ui.Component {

}

Header.defaultProps = {
    onClose: _.noop,
    renderer() {

        let headerContent = '';
        if(_.get(this.props, 'title') && this.props.title!=''){
            headerContent = <h4>{this.props.title}</h4>;
        }else if(_.size(this.props.children)>0){
            headerContent = this.props.children;
        }

        return (
            <div className={this.classSet('modal-header', this.props.className)}>
                {headerContent}
                <button onClick={this.props.onClose} type="button" className="close md-close" data-dismiss="modal">×</button>
            </div>
        );
    }
};

export default Header;