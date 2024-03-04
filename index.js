'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var baseIndexDb = function () {
  function baseIndexDb(dbName, storeName) {
    var _this = this;

    _classCallCheck(this, baseIndexDb);

    this.dbName = dbName;
    this.storeName = storeName;
    this.db = null;

    this.openDB = function () {
      return new Promise(function (resolve, reject) {
        var request = indexedDB.open(_this.dbName, 1);

        request.onupgradeneeded = function (event) {
          var db = event.target.result;
          if (!db.objectStoreNames.contains(_this.storeName)) {
            db.createObjectStore(_this.storeName, { keyPath: 'id', autoIncrement: true });
          }
        };

        request.onsuccess = function (event) {
          _this.db = event.target.result;
          resolve(_this.db);
        };

        request.onerror = function (event) {
          reject(event.target.error);
        };
      });
    };

    this.withDB = function (callback) {
      return new Promise(function () {
        var _ref = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee(resolve, reject) {
          var transaction, store;
          return regeneratorRuntime.wrap(function _callee$(_context) {
            while (1) {
              switch (_context.prev = _context.next) {
                case 0:
                  if (_this.db) {
                    _context.next = 10;
                    break;
                  }

                  _context.prev = 1;
                  _context.next = 4;
                  return _this.openDB();

                case 4:
                  _context.next = 10;
                  break;

                case 6:
                  _context.prev = 6;
                  _context.t0 = _context['catch'](1);

                  reject(_context.t0);
                  return _context.abrupt('return');

                case 10:
                  transaction = _this.db.transaction([_this.storeName], 'readwrite');
                  store = transaction.objectStore(_this.storeName);


                  transaction.oncomplete = function () {
                    resolve();
                  };

                  transaction.onerror = function (event) {
                    reject(event.target.error);
                  };

                  callback(store);

                case 15:
                case 'end':
                  return _context.stop();
              }
            }
          }, _callee, _this, [[1, 6]]);
        }));

        return function (_x, _x2) {
          return _ref.apply(this, arguments);
        };
      }());
    };
  }

  _createClass(baseIndexDb, [{
    key: 'add',
    value: function add(data) {
      return this.withDB(function (store) {
        return new Promise(function (resolve, reject) {
          var request = store.add(data);
          request.onsuccess = function () {
            resolve(request.result);
          };
          request.onerror = function (event) {
            reject(event.target.error);
          };
        });
      });
    }
  }, {
    key: 'getAll',
    value: function getAll() {
      return this.withDB(function (store) {
        return new Promise(function (resolve, reject) {
          var request = store.getAll();
          request.onsuccess = function () {
            resolve(request.result);
          };
          request.onerror = function (event) {
            reject(event.target.error);
          };
        });
      });
    }
  }, {
    key: 'getById',
    value: function getById(id) {
      return this.withDB(function (store) {
        return new Promise(function (resolve, reject) {
          var request = store.get(id);
          request.onsuccess = function () {
            resolve(request.result);
          };
          request.onerror = function (event) {
            reject(event.target.error);
          };
        });
      });
    }
  }, {
    key: 'update',
    value: function update(id, newData) {
      return this.withDB(function (store) {
        return new Promise(function (resolve, reject) {
          var getRequest = store.get(id);
          getRequest.onsuccess = function () {
            var existingData = getRequest.result;
            if (existingData) {
              var updatedData = _extends({}, existingData, newData);
              var updateRequest = store.put(updatedData, id);
              updateRequest.onsuccess = function () {
                resolve(updateRequest.result);
              };
              updateRequest.onerror = function (event) {
                reject(event.target.error);
              };
            } else {
              reject(new Error('Data with id ' + id + ' not found.'));
            }
          };
          getRequest.onerror = function (event) {
            reject(event.target.error);
          };
        });
      });
    }
  }, {
    key: 'remove',
    value: function remove(id) {
      return this.withDB(function (store) {
        return new Promise(function (resolve, reject) {
          var request = store.delete(id);
          request.onsuccess = function () {
            resolve();
          };
          request.onerror = function (event) {
            reject(event.target.error);
          };
        });
      });
    }
  }]);

  return baseIndexDb;
}();

exports.default = baseIndexDb;