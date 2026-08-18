/**
 * Returns the URL of a post's embed endpoint.
 *
 * Mirrors `get_post_embed_url()` in WordPress core, which appends `embed/` to
 * pretty permalinks and falls back to the `embed` query argument otherwise.
 *
 * @param permalink Post permalink.
 * @return URL of the post's embed endpoint.
 */
export function getPostEmbedUrl( permalink: string ): string {
	const url = new URL( permalink );

	if ( url.search ) {
		url.searchParams.set( 'embed', 'true' );

		return url.href;
	}

	return `${ url.href.replace( /\/?$/, '/' ) }embed/`;
}
