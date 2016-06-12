/**
 * Menu class holds the entire system menu structure.
 * Menu items are registered when app modules are initiated.
 */
class Menu {
    constructor() {
        this.menu = {};
    }

    /**
     * Add a single top-level menu to system menu
     * @param menu
     */
    add(menu) {
        const key = menu.key;
        // If top-level menu already exists...
        if (key in this.menu) {
            // Get existing top-level menu
            const topLevelMenu = this.menu[key];
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
            return this;
        }

        // New top-level menu
        this.menu[key] = menu;
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