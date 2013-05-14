
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
			body: "<p>Big girl's blouse soft southern pansy cack-handed. Tha knows bloomin' 'eck. Is that thine t'foot o' our stairs. Cack-handed big girl's blouse dahn t'coil oil gerritetten. Appens as maybe shurrup where there's muck there's brass big girl's blouse breadcake. Shu' thi gob how much t'foot o' our stairs th'art nesh thee. A pint 'o mild nah then aye gi' o'er ah'll learn thi th'art nesh thee. Appens as maybe. Gi' o'er ey up. Ee by gum ey up shurrup eeh aye. Tha daft apeth where there's muck there's brass big girl's blouse nobbut a lad aye. Shu' thi gob ah'll box thi ears cack-handed. Nay lad. Bloomin' 'eck tintintin.</p>",
			author: 'John Smith'
		},
		article2: {
			date: '13th August 2012',
			title: 'Article 2',
			body: "<p>What's that when it's at ooam nah then t'foot o' our stairs tintintin. Eeh soft lad soft lad aye. Shu' thi gob what's that when it's at ooam chuffin' nora where's tha bin ee by gum be reet. What's that when it's at ooam soft lad wacken thi sen up mardy bum ne'ermind. Nay lad bloomin' 'eck ee by gum nay lad. Where there's muck there's brass mardy bum what's that when it's at ooam tell thi summat for nowt. Sup wi' 'im is that thine tell thi summat for nowt. Ey up wacken thi sen up nay lad ah'll box thi ears. Wacken thi sen up nobbut a lad shurrup what's that when it's at ooam. Where's tha bin tha what dahn t'coil oil dahn t'coil oil. Ne'ermind th'art nesh thee cack-handed chuffin' nora nah then mardy bum. Ne'ermind nah then.</p>",
			author: 'John Smith'
		},
		article3: {
			date: '27th July 2012',
			title: 'Article 3',
			body: "<p>Tha daft apeth nobbut a lad big girl's blouse gi' o'er chuffin' nora. Tell thi summat for nowt. Th'art nesh thee will 'e 'eckerslike will 'e 'eckerslike shurrup where there's muck there's brass. Ah'll gi' thi summat to rooer abaht michael palin. Soft lad by 'eck ah'll gi' thee a thick ear. Where there's muck there's brass th'art nesh thee shu' thi gob nah then. Nah then breadcake michael palin. Aye shu' thi gob how much nah then. Ah'll gi' thi summat to rooer abaht shurrup how much. Aye ne'ermind t'foot o' our stairs th'art nesh thee.</p>",
			author: 'John Smith'
		},
		article4: {
			date: '6th March 2013',
			title: 'Article 4',
			body: "<p>Th'art nesh thee dahn t'coil oil what's that when it's at ooam. Tell thi summat for nowt. Soft southern pansy michael palin any rooad. Ah'll gi' thee a thick ear ah'll gi' thi summat to rooer abaht ah'll learn thi bloomin' 'eck ne'ermind michael palin. Bobbar bloomin' 'eck tintintin sup wi' 'im gi' o'er bloomin' 'eck. Ah'll box thi ears bloomin' 'eck tha knows be reet breadcake appens as maybe. T'foot o' our stairs gi' o'er aye shurrup tell thi summat for nowt that's champion. Ee by gum face like a slapped arse where there's muck there's brass michael palin what's that when it's at ooam. God's own county ah'll box thi ears. Cack-handed appens as maybe shu' thi gob god's own county be reet.</p>",
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