(function() {
  'use strict';

  define(['vendor/knockout', 'vendor/loglevel', 'models/account',
          'auth'],
         function(ko, logger, Account, Authenticator) {
    // Construct an AccountManager, which abstracts the process of
    // connecting and disconnecting accounts.
    var AccountManager = function() {
      this.accounts = ko.observableArray([]);
      this.active = ko.observable({});
    };

    // Connect an account of a particular service, then fire callbacks on init.
    AccountManager.prototype.addAccount = function(service, callbacks) {
      logger.debug('Starting authentication.');
      var popup = Authenticator.authenticate(service, function(data) {
        logger.debug('Authenticated for: ', data.service);
        var created = new Account(data, callbacks.on_account_ready,
            callbacks.on_fs_ready);
      });
    };

    // Remove an account by Account ID.
    AccountManager.prototype.removeAccount = function(account_id) {
      this.accounts.remove(function(account) {
        return account.account == account_id;
      });
    };

    // Retrieve an account by Account ID. Returns null if account not found.
    AccountManager.prototype.getByAccount = function(account_id) {
      return this.accounts().reduce(function(a, b) {
        if (b.account == account_id) {
          return b;
        }
        return a;
      }, null);
    };

    return AccountManager;
  });
})();