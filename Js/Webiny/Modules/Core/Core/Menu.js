/**
 * Menu class holds the entire system menu structure.
 * Menu items are registered when app modules are initiated.
 */
class Menu {
    constructor() {
        this.menu = [];
    }

    /**
     * Add a single top-level menu to system menu
     * @param menu
     */
    add(menu) {
        // If top-level menu already exists...
        const menuIndex = _.findIndex(this.menu, {key: menu.key});
        if (menuIndex > -1) {
            // Get existing top-level menu
            const topLevelMenu = this.menu[menuIndex];
            // Assign new sub-menu items to existing top-level menu
            _.map(menu.route, subMenu => {
                const subMenuIndex = _.findIndex(topLevelMenu.route, {key: subMenu.key});
                if (subMenuIndex > -1) {
                    _.map(subMenu.route, subMenuItem => {
                        topLevelMenu.route[subMenuIndex].route.push(subMenuItem);
                    });
                } else {
                    topLevelMenu.route.push(subMenu);
                }
            });
        } else {
            // New top-level menu
            this.menu.push(menu);
        }

        // Sort 1st-level menu
        this.menu = _.sortBy(this.menu, ['label']);
        // Sort 2nd-level menu
        _.each(this.menu, sndMenu => {
            if (_.isArray(sndMenu.route)) {
                sndMenu.route = _.sortBy(sndMenu.route, ['label']);
                // Sort 3rd-level menu
                _.each(sndMenu.route, thrdMenu => {
                    if (_.isArray(thrdMenu.route)) {
                        thrdMenu.route = _.sortBy(thrdMenu.route, ['key']);
                    }
                });
            }
        });

        return this;
    }

    /**
     * Get entire system menu
     * @returns {{}|*}
     */
    getMenu() {
        return this.menu;
    }
}

export default new Menu;