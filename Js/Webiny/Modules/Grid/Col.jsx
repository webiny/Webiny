import Webiny from 'Webiny';

const propsMap = {
    xs: 'xs',
    xsOffset: 'xs-offset',
    xsPull: 'xs-pull',
    xsPush: 'xs-push',
    sm: 'sm',
    smOffset: 'sm-offset',
    smPull: 'sm-pull',
    smPush: 'sm-push',
    md: 'md',
    mdOffset: 'md-offset',
    mdPull: 'md-pull',
    mdPush: 'md-push',
    lg: 'lg',
    lgOffset: 'lg-offset',
    lgPull: 'lg-pull',
    lgPush: 'lg-push'
};

function getCssClass(key, val) {
    if (key === 'all') {
        return `${getCssClass('xs', val)}`;
    }
    return _.has(propsMap, key) ? `col-${propsMap[key]}-${val}` : false;
}

class Col extends Webiny.Ui.Component {
    // This component doesn't do anything beyond rendering itself
}

Col.defaultProps = {
    className: '',
    style: null,
    renderer() {
        let props = _.clone(this.props);
        let cssClasses = [];

        const cls = _.trim(props.className);
        if (cls !== '') {
            cssClasses = cls.split(' ');
        }
        delete props['className'];

        _.forEach(props, (cssClass, key) => {
            const newClass = getCssClass(key, cssClass);
            if (newClass) {
                cssClasses.push(newClass);
            }
        });

        props = _.omit(props, ['children', 'renderer', 'className', 'all', 'renderIf'].concat(Object.keys(propsMap)));

        return (
            <div className={this.classSet(cssClasses)} {...props}>
                {this.props.children}
            </div>
        );
    }
};

export default Col;
