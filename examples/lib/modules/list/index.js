
var List = FruitMachine.define({
	module: 'list',
	template: templateList,

	initialize: function(options) {
		this.collection = options && options.collection;
		this.addItem = this.addItem.bind(this);
		this.removeItem = this.removeItem.bind(this);

		if (!this.collection) return;

		this.collection.forEach(this.addItem);
		this.collection.on('add', this.addItem);
		this.collection.on('remove', this.removeItem);
	},

	addItem: function(model) {
		this.add(new ListItem({
			id: model.get('id'),
			model: model
		}));
	},

	removeItem: function(model) {
		var listItem = this.id(model.get('id'));
		this.remove(listItem);
	}
});