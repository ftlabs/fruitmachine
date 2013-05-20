
var List2 = FruitMachine.define({
	name: 'list-2',
	template: templateList2,

	initialize: function(options) {
		this.collection = options.collection || [];
		this.setCollection = this.setCollection.bind(this);
		if (!this.collection) return;
		this.setCollection();

		this.collection.on('add', this.setCollection);
		this.collection.on('remove', this.setCollection);
	},

	setup: function() {
		var self = this;
		this.delegate = new Delegate(this.el);
		this.delegate.on('click', '.js-list_item', function(event, el) {
			var id = el.getAttribute('data-id');
			var model = self.collection.id(id);

			self.collection.remove(model);
			self
				.render()
				.setup();
		});
	},

	teardown: function() {
		this.delegate.off();
	},

	setCollection: function() {
		this.model.set('collection', this.collection.toJSON());
	}
});