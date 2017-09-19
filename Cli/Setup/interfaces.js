const os = require('os');
const interfaces = os.networkInterfaces();

module.exports = () => {
    const addresses = [];
    Object.keys(interfaces).forEach(iname => {
        interfaces[iname].forEach(iface => {
            if ('IPv4' !== iface.family || iface.internal !== false) {
                // skip over internal (i.e. 127.0.0.1) and non-ipv4 addresses
                return;
            }
            addresses.push({
                name: iface.address + ' ' + iname,
                value: iface.address
            });
        });
    });
    return addresses;
};