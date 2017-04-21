import Webiny from 'Webiny';
import Field from './../Field';
import styles from '../../../styles.css';

class SelectRowField extends Field {

}

SelectRowField.defaultProps = _.merge({}, Field.defaultProps, {
    headerRenderer() {
        return (
            <th>
                <Webiny.Ui.LazyLoad modules={['Checkbox']}>
                    {({Checkbox}) => (
                        <Checkbox state={this.props.allRowsSelected} onChange={this.props.onSelectAll} className={styles.selectRow}/>
                    )}
                </Webiny.Ui.LazyLoad>
            </th>
        );
    },
    renderer() {
        const {rowSelected, rowDisabled, onSelect, Checkbox} = this.props;
        return (
            <td className={this.getTdClasses()}>
                <Checkbox disabled={rowDisabled} state={rowSelected} onChange={onSelect} className={styles.selectRow}/>
            </td>
        );
    }
});

export default Webiny.createComponent(SelectRowField, {modules: ['Checkbox'], styles});