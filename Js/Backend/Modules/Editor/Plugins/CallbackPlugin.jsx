import Webiny from 'Webiny';
const Ui = Webiny.Ui.Components;

export default (props) => {
    return (
        <Ui.Button onClick={() => props.callback()} icon={props.icon}/>
    );
};