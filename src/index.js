/**
 * WordPress dependencies
 */
import {
	unregisterBlockType,
	getBlockVariations,
	unregisterBlockVariation,
	getBlockType,
} from '@wordpress/blocks';

import domReady from '@wordpress/dom-ready';

domReady( () => {
	if ( getBlockVariations && getBlockVariations( 'core/embed' ) ) {
		unregisterBlockVariation( 'core/embed', 'wordpress' );
	} else if ( getBlockType( 'core-embed/wordpress' ) ) {
		unregisterBlockType( 'core-embed/wordpress' );
	}
} );
