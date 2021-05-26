const AccessControl = require("accesscontrol");
const ac = new AccessControl();

exports.roles = (function() {
ac.grant("guest").readOwn("shop").updateOwn("shop")
ac.grant("client").extend("guest").readAny("shop")
ac.grant("admin").extend("guest").extend("client").updateAny("shop").deleteAny("shop")
return ac;
})();