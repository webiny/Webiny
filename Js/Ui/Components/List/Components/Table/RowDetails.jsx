import React from 'react';
import Webiny from 'webiny';
import styles from '../../styles.css';

class RowDetails extends Webiny.Ui.Component {

}

RowDetails.defaultProps = {
    fieldsCount: 0,
    className: null,
    renderer() {
        return (
            <tr className={this.classSet(this.props.className, styles.rowDetails)} style={{display: this.props.expanded ? 'table-row' : 'none'}}>
                <td colSpan={this.props.fieldsCount}>
                    {this.props.expanded ? this.props.children(this.props.data, this) : null}
                </td>
            </tr>
        );
    }
};

export default Webiny.createComponent(RowDetails, {styles});