import Webiny from 'Webiny';
const Ui = Webiny.Ui.Components;

class HelpModal extends Webiny.Ui.ModalComponent {
    renderDialog() {
        return (
            <Ui.Modal.Dialog>
                <Ui.Modal.Header title="System Monitor Help"/>
                <Ui.Modal.Body>
                    <h3>About</h3>
                    <p>
                        System Monitor is constantly creating snapshots of system resources: CPU usage, load average, memory
                        consumption and disk usage.
                    </p>
                    <p>
                        This background process is triggered via a cron job. This cron job can be configured via crontab
                        or via the Webiny Cron Manager app.
                    </p>
                    <p>
                        The cron should be configured so it executes the following script every minute:
                    </p>
                    <Ui.Copy.Input value={webinyApiPath + '/services/core/system-monitor/create-snapshot'}/>
                </Ui.Modal.Body>
                <Ui.Modal.Footer>
                    <Ui.Button type="secondary" label="Close" onClick={this.hide}/>
                </Ui.Modal.Footer>
            </Ui.Modal.Dialog>
        );
    }
}

export default HelpModal;