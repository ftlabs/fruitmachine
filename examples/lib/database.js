
/**
 * Dummy Data Stores
 */

var database = {};

// Mock synchronous API
database.getSync = function() {
	return [
		{
			id: 'article1',
			title: 'Article 1'
		},
		{
			id: 'article2',
			title: 'Article 2'
		},
		{
			id: 'article3',
			title: 'Article 3'
		},
		{
			id: 'article4',
			title: 'Article 4'
		},
		{
			id: 'article5',
			title: 'Article 5'
		}
	];
};

// Mock asynchonous API
database.getAsync = function(id, callback) {
	var database = {
		article1: {
			date: '3rd May 2012',
			title: 'Article 1',
			body: "<p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nullam volutpat sem dictum, bibendum orci sed, auctor nulla. Nullam mauris eros, lobortis quis mi quis, commodo pellentesque dolor. Fusce purus odio, rutrum id malesuada in, volutpat ut augue. Vivamus in neque posuere, porta ipsum sed, lacinia sem. In tortor turpis, rhoncus consequat elit nec, condimentum accumsan ipsum. Vestibulum sed pellentesque urna. Duis rutrum pulvinar accumsan. Integer sagittis ante enim, ac porttitor ligula rutrum quis.</p>",
			author: 'John Smith'
		},
		article2: {
			date: '13th August 2012',
			title: 'Article 2',
			body: "<p>Orci varius natoque penatibus et magnis dis parturient montes, nascetur ridiculus mus. Integer vulputate aliquet quam at aliquam. Praesent pellentesque mauris ut augue congue, sit amet mattis sapien ultrices. Phasellus at semper massa. Pellentesque sollicitudin egestas enim ac rhoncus. Vestibulum quis vehicula turpis, hendrerit dapibus nunc. Etiam eget libero efficitur, vehicula risus id, efficitur neque. Maecenas accumsan tincidunt ultrices. Vestibulum sagittis, felis sed commodo pharetra, velit dolor congue velit, nec porta leo leo sit amet neque. Donec imperdiet porttitor neque, eget faucibus odio eleifend ut.</p>",
			author: 'John Smith'
		},
		article3: {
			date: '27th July 2012',
			title: 'Article 3',
			body: "<p>Curabitur eget feugiat leo. Nulla lorem nisl, malesuada vel erat eu, mattis viverra magna. Praesent facilisis ornare tristique. Sed congue accumsan lacus, non consequat augue hendrerit et. Maecenas imperdiet placerat leo, sed auctor neque suscipit eget. Aliquam a porttitor massa. Quisque porttitor sed urna eget auctor.</p>",
			author: 'John Smith'
		},
		article4: {
			date: '6th March 2013',
			title: 'Article 4',
			body: "<p>Vestibulum consectetur, nunc sit amet sodales pharetra, arcu diam molestie ante, ac viverra erat justo id velit. Maecenas consequat fringilla lectus, id pretium ipsum viverra quis. Sed tortor urna, tincidunt ac laoreet eu, finibus finibus sem. Pellentesque venenatis risus sem, eu lacinia neque fermentum eu. In at dui ut odio elementum venenatis at eu tortor. Curabitur vel dui felis. Maecenas sollicitudin, erat sit amet facilisis vehicula, dolor lectus mattis libero, in sagittis justo lorem et libero. Class aptent taciti sociosqu ad litora torquent per conubia nostra, per inceptos himenaeos. Vestibulum tincidunt ante eget ex gravida, vitae bibendum urna fermentum. Donec commodo magna vel malesuada volutpat. Etiam in ipsum nec est eleifend euismod. Mauris a justo justo. Aenean pulvinar aliquam ligula, at bibendum velit imperdiet at. Etiam euismod tristique ex quis placerat. Morbi mi lorem, cursus in tempus vitae, mollis in risus.</p>",
			author: 'John Smith'
		},
		article5: {
			date: '24th December 2012',
			title: 'Article 5',
			body: '<p>Lorem ipsum dolor sit amet, consectetuer adipiscing elit. Aenean commodo ligula eget dolor. Aenean massa. Cum sociis natoque penatibus et magnis dis parturient montes, nascetur ridiculus mus. Donec quam felis, ultricies nec, pellentesque eu, pretium quis, sem. Nulla consequat massa quis enim. Donec pede justo, fringilla vel, aliquet nec, vulputate eget, arcu. In enim justo, rhoncus ut, imperdiet a, venenatis vitae, justo. Nullam dictum felis eu pede mollis pretium.</p>',
			author: 'John Smith'
		}
	};

	setTimeout(function() {
		callback(database[id]);
	}, 100);
};
