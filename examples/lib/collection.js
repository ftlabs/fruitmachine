
/**
 * Module Dependencies
 */

var Model = fruitmachine.Model;
var events = fruitmachine.Events;

function Collection(items) {
	this.items = [];
	this._ids = {};
	items.forEach(this.add, this);
	this._updateLength();
}

Collection.prototype.add = function(item) {
	var id = item.id || item._id;
	item = (item instanceof Model) ? item : new Model(item);
	this.items.push(item);
	this._ids[id] = item;
	this._updateLength();
	this.fire('add', item);
};

Collection.prototype.remove = function(item) {
	var index = this.items.indexOf(item);
	if (!~index) return;
	this.items.splice(index, 1);
	this._updateLength();
	item.fire('remove');
	this.fire('remove', item);
};

Collection.prototype.id = function(id) {
	return this._ids[id];
};

Collection.prototype.forEach = function() {
	[].forEach.apply(this.items, arguments);
};

Collection.prototype.toJSON = function() {
	return this.items.map(function(model) {
		return model.toJSON();
	});
};

Collection.prototype._updateLength = function() {
	this.length = this.items.length;
};

events(Collection.prototype);