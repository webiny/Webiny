import React from 'react';
import Webiny from 'webiny';
import styles from './styles.css';

class Header extends Webiny.Ui.Component {

}

Header.defaultProps = {
    renderer() {
        const {styles} = this.props;

        let icon = null;
        if (this.props.icon) {
            icon = <div className="ico"><i className={this.props.icon}/></div>;
        }

        const classes = this.classSet(styles.header, this.props.className);
        return (
            <div className={classes} style={this.props.style || null}>
                {icon}
                <h3>{this.props.title}</h3>
                {this.props.children}
            </div>
        );
    }
};

export default Webiny.createComponent(Header, {styles});