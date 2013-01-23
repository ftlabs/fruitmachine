buster.testCase('Defaults', {
	"Invoking a view should trigger the 'beforeinitialize' event.'": function() {
		var spy = this.spy();
		
		FruitMachine.on("beforeinitialize", spy, null);
	
		var view = FruitMachine.View({});

		assert.called(spy);
	}	
});
