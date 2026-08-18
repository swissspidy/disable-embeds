/**
 * Internal dependencies
 */
import { test, expect } from '../fixtures';
import { getPostEmbedUrl } from '../fixtures/utils';

interface NamespaceIndex {
	routes: Record< string, unknown >;
}

/**
 * Guards against the rest of the suite passing for the wrong reasons: with the
 * plugin deactivated, WordPress should happily serve embeds again.
 */
test.describe.serial( 'Plugin deactivated', () => {
	let permalink: string;

	test.beforeAll( async ( { requestUtils } ) => {
		await requestUtils.deleteAllPosts();

		const post = await requestUtils.createPost( {
			title: 'Disable Embeds control post',
			content: 'This post should be embeddable.',
			status: 'publish',
			date_gmt: new Date().toISOString(),
		} );

		permalink = post.link;

		await requestUtils.deactivatePlugin( 'disable-embeds' );
	} );

	test.afterAll( async ( { requestUtils } ) => {
		await requestUtils.activatePlugin( 'disable-embeds' );
		await requestUtils.deleteAllPosts();
	} );

	test( 'WordPress adds oEmbed discovery links', async ( { page } ) => {
		await page.goto( permalink );

		await expect(
			page.locator( 'link[type="application/json+oembed"]' )
		).toHaveCount( 1 );
	} );

	test( 'WordPress serves the embed endpoint', async ( { page } ) => {
		await page.goto( getPostEmbedUrl( permalink ) );

		await expect( page.locator( '.wp-embed' ) ).toBeVisible();
	} );

	test( 'WordPress registers the oembed/1.0/embed route', async ( {
		requestUtils,
	} ) => {
		const namespace = await requestUtils.rest< NamespaceIndex >( {
			path: '/oembed/1.0',
		} );

		expect( Object.keys( namespace.routes ) ).toContain(
			'/oembed/1.0/embed'
		);
	} );

	test( 'WordPress registers the WordPress embed block variation', async ( {
		admin,
		page,
	} ) => {
		await admin.createNewPost();

		const variations = await page.evaluate( () =>
			window.wp.blocks
				.getBlockVariations( 'core/embed' )
				.map( ( variation ) => variation.name )
		);

		expect( variations ).toContain( 'wordpress' );
	} );
} );
