export const Items: {[itemid: string]: ItemData} = {
	mawilelite: {
		name: "Mawile-Lite",
		spritenum: 1,
		onStart(pokemon) {
			this.add('-ability', pokemon, 'Huge Power', '[from] ability: Intimidate', '[of] ' + pokemon);
			pokemon.setAbility('hugepower');
		},
		onTakeItem(item, source) {
			if (source.baseSpecies.baseSpecies === 'Mawile') return false;
			return true;
		},
		num: -1,
		gen: 8,
		shortDesc: "When held by Mawile, Changes Intimidate to Huge Power.",
	},
	earthplate: {
		inherit: true,
		isNonstandard: null,
	},
};