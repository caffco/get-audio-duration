var assert = require( 'assert' ),
	path = require( 'path' );

var getDuration = require( '..' );

it( 'should get duration', function () {
	return getDuration( path.resolve( __dirname, './Rayman_2_music_sample.ogg' ) )
		.then( function ( duration ) {
			assert.equal( duration, 33.002676 );
		} );
} )