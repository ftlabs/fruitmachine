
/**
 * Module Dependencies
 */

var Model = FruitMachine.Model;
var events = FruitMachine.Events;

function Collection(items) {
	this.items = [];
	items.forEach(this.add, this);
	this._updateLength();
}

Collection.prototype.add = function(item) {
	item = (item instanceof Model) ? item : new Model(item);
	this.items.push(item);
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

Collection.prototype.forEach = function() {
	[].forEach.apply(this.items, arguments);
};

Collection.prototype._updateLength = function() {
	this.length = this.items.length;
};

events(Collection.prototype);