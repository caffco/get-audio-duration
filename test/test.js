var assert = require( 'assert' );

var getDuration = require( '..' );

it( 'should get duration', function () {
	return getDuration( 'Rayman_2_music_sample.ogg' )
		.then( function ( duration ) {
			assert.equal( duration, 33.002676 );
		} );
} )