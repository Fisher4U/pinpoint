'use strict';

pinpointApp.service('WebSql', [ '$window', '$timeout', 'WebSqlMigrator', function WebSql($window, $timeout, oWebSqlMigrator) {
    // AngularJS will instantiate a singleton by calling "new" on this function
    var oDb;

    $timeout(function () {
        oDb = $window.openDatabase('pinpoint', '', 'PinPoint', 1024 * 1024 * 1024); // 1GB

        oWebSqlMigrator.migration(1, function (oTx) {
            oTx.executeSql('CREATE TABLE IF NOT EXISTS transactionData (ID INTEGER PRIMARY KEY ASC, name TEXT, data TEXT, add_date DATETIME)');
        });

        oWebSqlMigrator.doIt(oDb);
    });


    this.getDb = function () {
        return oDb;
    };

    this.executeSql = function (query, params, cb) {
        oDb.transaction(function (oTx) {
            oTx.executeSql(query, params, function (tx, results) {
                if (angular.isFunction(cb)) {
                    cb(results);
                }
            })
        });
    };

}]);
