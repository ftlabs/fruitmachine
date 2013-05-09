
buster.testCase('View#toHTML()', {
  "setUp": helpers.createView,

  "Should return a string": function() {
    var html = this.view.toHTML();
    assert.isTrue('string' === typeof html);
  },

  "Should print the child html into the corresponding slot": function() {
    var apple = new Apple({ slot: 1 });
    var layout = new Layout({
      children: [apple]
    });

    var appleHtml = apple.toHTML();
    var layoutHtml = layout.toHTML();

    assert(~layoutHtml.indexOf(appleHtml));
  },

  "Should print the child html by id if no slot is found (backwards compatable)": function() {
    var apple = new Apple({ id: 1 });
    var layout = new Layout({
      children: [apple]
    });

    var appleHtml = apple.toHTML();
    var layoutHtml = layout.toHTML();

    assert(~layoutHtml.indexOf(appleHtml));
  },

  "tearDown": helpers.destroyView
});