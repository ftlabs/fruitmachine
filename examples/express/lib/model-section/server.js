
var database = {
  home: {
    id: home,
    views: [
      {
        id: 'slot_1',
        module: 'apple',
        data: {
          title: 'Home'
        }
      }
    ]
  }
};


exports.get = function(id, callback) {
  // 1. Query server database
  // 2. Run callback passing data

  var data = database[id];
  if (!data) return callback('Not found');
  callback(null, data);
};