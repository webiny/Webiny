Backup script to check for custom routes and access rules 

```php
$this->config->mergeWith($this->config()->yaml($this->rootDir . '/Configs/Platform/Router.yaml'));
// Configure router and check custom routes
Router::setConfig($this->config->get('Router'));

$result = $this->router()->match($this->requestUrl);
if ($result) {
    // Now we need to check if this route is under access control
    $accessRules = $this->config->get('Router.AccessRules');
    $accessRuleMatched = false;
    $user = User::getInstance()->getUser();
    $userHasAccess = false;

    if ($accessRules) {
        foreach ($accessRules->toArray() as $ar) {
            if ($this->requestUrl->getPath(true)->match($ar['Path'])) {
                $accessRuleMatched = true;
                $userHasAccess = $user ? $user->hasRole($ar['Role']) : false;
                break;
            }
        }
    }

    if ($accessRuleMatched && !$userHasAccess) {
        die('YOU ARE NOT ALLOWED TO ACCESS THIS ROUTE!');
    } else {
        $routeResult = $this->router()->execute($result);
        if ($routeResult instanceof View) {
            return $routeResult->httpResponse()->send();
        }
    }
}
```