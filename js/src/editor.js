import { unregisterBlockType } from '@wordpress/blocks';

window._wpLoadGutenbergEditor = window._wpLoadGutenbergEditor || new Promise( () => {} );

window._wpLoadGutenbergEditor.then( function () {
	unregisterBlockType( 'core/separator' ); // Overridden by schilling/separator.
} );
