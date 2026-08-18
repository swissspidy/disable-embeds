/**
 * Internal dependencies
 */
import { test, expect } from '../fixtures';
import { getPostEmbedUrl } from '../fixtures/utils';

const POST_TITLE = 'Disable Embeds test post';
const POST_CONTENT = 'This post should never be embeddable.';

test.describe( 'Front end', () => {
	let permalink: string;

	test.beforeAll( async ( { requestUtils } ) => {
		await requestUtils.deleteAllPosts();

		const post = await requestUtils.createPost( {
			title: POST_TITLE,
			content: POST_CONTENT,
			status: 'publish',
			date_gmt: new Date().toISOString(),
		} );

		permalink = post.link;
	} );

	test.afterAll( async ( { requestUtils } ) => {
		await requestUtils.deleteAllPosts();
	} );

	test( 'does not add oEmbed discovery links', async ( { page } ) => {
		await page.goto( permalink );

		await expect(
			page.locator( 'link[type="application/json+oembed"]' )
		).toHaveCount( 0 );
		await expect(
			page.locator( 'link[type="text/xml+oembed"]' )
		).toHaveCount( 0 );
	} );

	test( 'does not load the oEmbed host JavaScript', async ( { page } ) => {
		await page.goto( permalink );

		await expect( page.locator( 'script[src*="wp-embed"]' ) ).toHaveCount(
			0
		);
	} );

	test( 'removes the embed rewrite rules', async ( { page } ) => {
		await page.goto( getPostEmbedUrl( permalink ) );

		await expect( page.locator( '.wp-embed' ) ).toHaveCount( 0 );
		await expect(
			page.locator( 'script[src*="wp-embed-template"]' )
		).toHaveCount( 0 );
	} );

	test( 'removes the embed query variable', async ( { page } ) => {
		const url = new URL( permalink );
		url.searchParams.set( 'embed', 'true' );

		await page.goto( url.href );

		await expect( page.locator( '.wp-embed' ) ).toHaveCount( 0 );
		await expect( page.getByText( POST_CONTENT ) ).toBeVisible();
	} );
} );
