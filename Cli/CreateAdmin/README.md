# CreateAdmin plugin
This plugin simply creates a new admin user for your current project using given username and password.
The new admin user is assigned the following roles:

- `administrator` - identifies the user as an administrator. It carries no permissions.
- `webiny-administrator` - manages Webiny installation. It carries no permissions.
- `webiny-marketplace` - use Webiny Marketplace.
- `webiny-app-notifications` - access app notifications.
- `webiny-acl-api-token-manager` - manage API tokens.
- `webiny-logger-manager` - manage system error logger .
- `webiny-acl-user-manager` - manage users, roles and permissions.
- `webiny-i18n-manager` - manage languages and translations.
- `webiny-dashboard` - access the dashboard module.
- `webiny-api-discoverer` - discover API using Postman.

This is the set of roles included with the basic Webiny installation.
Roles from other apps must be enabled manually.