import Webiny from 'Webiny';

// These will be lazy loaded when first growl is performed
let GrowlComponents = null;

function getGrowler() {
    const growler = Webiny.Ui.Dispatcher.get('GrowlContainer');
    if (!growler) {
        document.body.appendChild(document.createElement('webiny-growler'));
        return new Promise((resolve) => {
            const growlContainer = (
                <Webiny.Ui.LazyLoad modules={['Growl']}>
                    {({Growl}) => {
                        GrowlComponents = Growl;
                        return <GrowlComponents.Container ui="GrowlContainer" onComponentDidMount={resolve}/>;
                    }}
                </Webiny.Ui.LazyLoad>
            );
            ReactDOM.render(growlContainer, document.querySelector('webiny-growler'));
        });
    }

    return Promise.resolve(growler);
}

function Growler(component) {
    return getGrowler().then(growler => growler.addGrowl(component));

}

_.assign(Growler, {
    async remove(growlId) {
        const growler = await getGrowler();

        if (!growler) {
            return null;
        }

        growler.removeById(growlId);
    },

    async info(message, title = 'Info', sticky = false, ttl = 3000) {
        const growler = await getGrowler();

        if (!growler) {
            return null;
        }

        return growler.addGrowl(<GrowlComponents.Info {...{message, title, sticky, ttl}}/>);
    },

    async success(message, title = 'Success', sticky = false, ttl = 3000) {
        const growler = await getGrowler();

        if (!growler) {
            return null;
        }

        return growler.addGrowl(<GrowlComponents.Success {...{message, title, sticky, ttl}}/>);
    },

    async danger(message, title = 'Danger', sticky = true, ttl = 3000) {
        const growler = await getGrowler();

        if (!growler) {
            return null;
        }

        return growler.addGrowl(<GrowlComponents.Danger {...{message, title, sticky, ttl}}/>);
    },

    async warning(message, title = 'Warning', sticky = true, ttl = 3000) {
        const growler = await getGrowler();

        if (!growler) {
            return null;
        }

        return growler.addGrowl(<GrowlComponents.Warning {...{message, title, sticky, ttl}}/>);
    }
});

export default Growler;