/**
 * WordPress dependencies
 */
import { unregisterBlockType } from '@wordpress/blocks';
import domReady from '@wordpress/dom-ready';

domReady( () => {
	unregisterBlockType( 'core-embed/wordpress' );
} );
