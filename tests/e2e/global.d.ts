interface BlockVariation {
	name: string;
}

declare global {
	interface Window {
		wp: {
			blocks: {
				getBlockVariations: ( blockName: string ) => BlockVariation[];
			};
		};
	}
}

export {};
