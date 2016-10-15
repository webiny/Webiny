import Webiny from 'Webiny';
const Ui = Webiny.Ui.Components;
import Graph from './Graph';
import HelpModal from './HelpModal';

class Dashboard extends Webiny.Ui.View {
    constructor(props) {
        super(props);

        this.state = {
            realtime: [],
            history: [],
            historyRange: '1h'
        };
        this.interval = null;
        this.options = {
            '1h': 'Last hour',
            '2h': 'Last 2 hours',
            '6h': 'Last 6 hours',
            '24h': 'Last 24 hours',
            '7d': 'Last 7 days',
            '30d': 'Last 30 days'
        };
        this.bindMethods('loadRealtimeStats', 'loadHistoryStats', 'getCpuConfig', 'getMemoryConfig', 'getTimeline', 'getDiskConfig');
    }

    componentWillMount() {
        super.componentWillMount();
        this.loadRealtimeStats();
        this.loadHistoryStats();
    }

    componentWillUnmount() {
        super.componentWillUnmount();
        if (this.request) {
            this.request.abort();
        }

        clearInterval(this.interval);
    }

    loadRealtimeStats() {
        this.request = new Webiny.Api.Endpoint('/services/core/system-monitor').get('snapshot').then(apiResponse => {
            setTimeout(this.loadRealtimeStats, 5000);
            if (apiResponse.isError() || apiResponse.isAborted() || !this.isMounted()) {
                return null;
            }
            if (this.state.realtime.length >= 49) {
                this.state.realtime = this.state.realtime.slice(-49);
            }

            this.state.realtime.push(apiResponse.getData());
            this.setState({snapshots: this.state.realtime});
            this.request = null;
        });
    }

    loadHistoryStats(preset = '1h') {
        this.setState({loadingHistory: true});
        this.request = new Webiny.Api.Endpoint('/entities/core/system-snapshots').get('/preset/' + preset).then(apiResponse => {
            if (apiResponse.isError() || apiResponse.isAborted() || !this.isMounted()) {
                return null;
            }

            const state = this.state;
            state.history = apiResponse.getData('list');
            state.loadingHistory = false;
            state.historyRange = preset;
            // Set historic data to realtime state if realtime data has not yet been populated
            if (!state.realtime.length) {
                state.realtime = _.clone(state.history);
            }
            this.setState(state);
            this.request = null;
        });
    }

    getTimeline(snapshots) {
        return ['x'].concat(_.map(snapshots, s => new Date(s.createdOn)));
    }

    getLineChartConfig(snapshots, columns) {
        columns.unshift(this.getTimeline(snapshots));

        return {
            data: {
                x: 'x',
                columns
            },
            point: {
                show: false
            },
            zoom: {
                enabled: true
            },
            axis: {
                x: {
                    type: 'timeseries',
                    tick: {
                        format: '%H:%M',
                        count: 20
                    }
                },
                y: {
                    min: 0
                }
            },
            tooltip: {
                format: {
                    title: function (d) {
                        return d;
                    }
                }
            }
        };
    }

    getGaugeChartConfig(columns) {
        return {
            data: {
                columns: [columns],
                type: 'gauge'
            },
            color: {
                pattern: ['#60B044', '#F6C600', '#F97600', '#FF0000'],
                threshold: {
                    values: [30, 60, 90, 100]
                }
            },
            size: {
                height: 180
            }
        };
    }

    getDonutChartConfig(name, columns) {
        return {
            data: {
                columns,
                type: 'donut',
                colors: {
                    'Free': '#E0E0E0',
                    'Used': '#FA5722'
                }
            },
            donut: {
                title: name,
                width: 60
            }
        };
    }

    getCpuConfig(snapshots) {
        const userColumns = ['User'].concat(_.map(snapshots, x => x.stats.cpu.user));
        const systemColumns = ['System'].concat(_.map(snapshots, x => x.stats.cpu.system));

        return this.getLineChartConfig(snapshots, [userColumns, systemColumns]);
    }

    getMemoryConfig(snapshots) {
        const userColumns = ['Memory used'].concat(_.map(snapshots, s => {
            return Math.round((s.stats.memory.used / s.stats.memory.total) * 100);
        }));

        return this.getLineChartConfig(snapshots, [userColumns]);
    }

    getDiskConfig(disk) {
        if (!disk) {
            return null;
        }
        return this.getDonutChartConfig(disk.name, [
            ['Used', disk.percentage],
            ['Free', 100 - disk.percentage]
        ]);
    }

    getLoadAverageConfig(name, load) {
        if (!load) {
            return null;
        }
        return this.getGaugeChartConfig([name, Math.round(load * 100)]);
    }
}

Dashboard.defaultProps = {
    renderer() {
        const change = (
            <Ui.Dropdown title={this.options[this.state.historyRange]} className="balloon">
                <Ui.Dropdown.Link title="Last hour" onClick={() => this.loadHistoryStats('1h')}/>
                <Ui.Dropdown.Link title="Last 6 hours" onClick={() => this.loadHistoryStats('6h')}/>
                <Ui.Dropdown.Link title="Last 24 hours" onClick={() => this.loadHistoryStats('24h')}/>
                <Ui.Dropdown.Link title="Last 7 days" onClick={() => this.loadHistoryStats('7d')}/>
                <Ui.Dropdown.Link title="Last 30 days" onClick={() => this.loadHistoryStats('30d')}/>
            </Ui.Dropdown>
        );

        const realtime = (
            <span><Ui.Icon icon="fa-exclamation-triangle"/>REAL-TIME</span>
        );

        const disk = _.get(_.last(this.state.realtime), 'stats.disks.0', _.get(_.last(this.state.history), 'stats.disks.0'));
        const loadAverage = _.get(_.last(this.state.realtime), 'stats.loadAverage', _.get(_.last(this.state.history), 'stats.loadAverage'));
        const realtimeLoader = this.state.realtime.length === 0 ? <Ui.Loader/> : null;
        return (
            <Ui.View.Dashboard>
                <Ui.View.Header title="System Monitor"
                                description="Here you can monitor your server stats in real-time and dig through historic data.">
                    <Ui.Link type="default" align="right" onClick={this.ui('helpModal:show')}>
                        <Ui.Icon icon="icon-info-circle"/>
                        Help
                    </Ui.Link>

                    <HelpModal ui="helpModal"/>
                </Ui.View.Header>
                <Ui.View.Body>
                    <Ui.Grid.Row>
                        <Ui.Grid.Col all={6}>
                            <Ui.View.ChartBlock title="CPU usage (%)" description={realtime}>
                                {realtimeLoader}
                                <Graph config={this.getCpuConfig(this.state.realtime)}/>
                            </Ui.View.ChartBlock>

                            <Ui.View.ChartBlock title="Memory usage (%)" description={realtime}>
                                {realtimeLoader}
                                <Graph config={this.getMemoryConfig(this.state.realtime)}/>
                            </Ui.View.ChartBlock>
                        </Ui.Grid.Col>
                        <Ui.Grid.Col all={6}>
                            <Ui.View.ChartBlock title="CPU usage (%)" description={change}>
                                {this.state.loadingHistory ? <Ui.Loader/> : null}
                                <Graph config={this.getCpuConfig(this.state.history)}/>
                            </Ui.View.ChartBlock>

                            <Ui.View.ChartBlock title="Memory usage (%)" description={change}>
                                {this.state.loadingHistory ? <Ui.Loader/> : null}
                                <Graph config={this.getMemoryConfig(this.state.history)}/>
                            </Ui.View.ChartBlock>
                        </Ui.Grid.Col>
                    </Ui.Grid.Row>
                    <Ui.Grid.Row>
                        <Ui.Grid.Col all={3}>
                            <Ui.View.ChartBlock title="Disk usage (%)" description={realtime}>
                                {realtimeLoader}
                                <Graph config={this.getDiskConfig(disk)}/>
                            </Ui.View.ChartBlock>
                        </Ui.Grid.Col>
                        <Ui.Grid.Col all={9}>
                            <Ui.View.ChartBlock title="System load averages" description={realtime}>
                                {realtimeLoader}
                                <Ui.Grid.Col all={4}>
                                    <h3 className="text-center">1 min</h3>
                                    <Graph config={this.getLoadAverageConfig('1 minute', _.get(loadAverage, 1))}/>
                                </Ui.Grid.Col>
                                <Ui.Grid.Col all={4}>
                                    <h3 className="text-center">5 min</h3>
                                    <Graph config={this.getLoadAverageConfig('5 minutes', _.get(loadAverage, 5))}/>
                                </Ui.Grid.Col>
                                <Ui.Grid.Col all={4}>
                                    <h3 className="text-center">15 min</h3>
                                    <Graph config={this.getLoadAverageConfig('15 minutes', _.get(loadAverage, 15))}/>
                                </Ui.Grid.Col>
                            </Ui.View.ChartBlock>
                        </Ui.Grid.Col>
                    </Ui.Grid.Row>
                </Ui.View.Body>
            </Ui.View.Dashboard>

        );
    }
};

export default Dashboard;