
module.exports = {
  requireAdmin: function(req, res, next) {
    if (!req.user.admin) {
      next('admin privileges required');
    }
    else {
      next();
    }
  },
  requireMatchingXid: function(req, res, next) {
    if (req.user.admin) {
      next();
    }
    else if (!req.user.xid) {
      next('token has no valid user');
    }
    else if (req.user.xid != req.params.xid) {
      next('token user does not match requested user');
    }
    else {
      next();
    }
  }
};
