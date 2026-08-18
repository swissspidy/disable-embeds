/**
 * Internal dependencies
 */
import { test, expect } from '../fixtures';

interface RestError {
	code?: string;
	data?: { status?: number };
}

interface NamespaceIndex {
	routes: Record< string, unknown >;
}

/**
 * Runs a REST request and returns the error it responded with, if any.
 *
 * `requestUtils.rest()` throws the decoded error response for anything that is
 * not a successful request.
 *
 * @param request The REST request to run.
 * @return The error response, or `null` if the request succeeded.
 */
async function getRestError(
	request: Promise< unknown >
): Promise< RestError | null > {
	try {
		await request;
	} catch ( error ) {
		return error as RestError;
	}

	return null;
}

test.describe( 'REST API', () => {
	let permalink: string;

	test.beforeAll( async ( { requestUtils } ) => {
		await requestUtils.deleteAllPosts();

		const post = await requestUtils.createPost( {
			title: 'Disable Embeds REST API test post',
			content: 'This post should never be embeddable.',
			status: 'publish',
			date_gmt: new Date().toISOString(),
		} );

		permalink = post.link;
	} );

	test.afterAll( async ( { requestUtils } ) => {
		await requestUtils.deleteAllPosts();
	} );

	test( 'does not register the oembed/1.0/embed route', async ( {
		requestUtils,
	} ) => {
		const namespace = await requestUtils.rest< NamespaceIndex >( {
			path: '/oembed/1.0',
		} );
		const routes = Object.keys( namespace.routes );

		expect( routes ).not.toContain( '/oembed/1.0/embed' );

		// The proxy route is left in place, so this is a meaningful assertion.
		expect( routes ).toContain( '/oembed/1.0/proxy' );
	} );

	test( 'responds with a 404 for the oembed/1.0/embed route', async ( {
		requestUtils,
	} ) => {
		const error = await getRestError(
			requestUtils.rest( {
				path: '/oembed/1.0/embed',
				params: { url: permalink },
			} )
		);

		expect( error ).not.toBeNull();
		expect( error?.code ).toBe( 'rest_no_route' );
	} );

	test( 'does not proxy oEmbed requests for the site itself', async ( {
		requestUtils,
	} ) => {
		const error = await getRestError(
			requestUtils.rest( {
				path: '/oembed/1.0/proxy',
				params: { url: permalink },
			} )
		);

		expect( error ).not.toBeNull();
		expect( error?.data?.status ).toBe( 404 );
	} );
} );
