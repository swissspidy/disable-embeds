/**
 * Internal dependencies
 */
import { test, expect } from '../fixtures';

test.describe( 'Block editor', () => {
	test.beforeEach( async ( { admin } ) => {
		await admin.createNewPost();
	} );

	test( 'unregisters the WordPress embed block variation', async ( {
		page,
	} ) => {
		const variations = await page.evaluate( () =>
			window.wp.blocks
				.getBlockVariations( 'core/embed' )
				.map( ( variation ) => variation.name )
		);

		// Other embed providers are left alone, so this is a meaningful assertion.
		expect( variations ).toContain( 'youtube' );
		expect( variations ).not.toContain( 'wordpress' );
	} );

	test( 'does not load the oEmbed host JavaScript', async ( { page } ) => {
		await expect( page.locator( 'script[src*="wp-embed"]' ) ).toHaveCount(
			0
		);
	} );
} );
