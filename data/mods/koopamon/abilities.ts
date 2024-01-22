/*

Ratings and how they work:

-1: Detrimental
	  An ability that severely harms the user.
	ex. Defeatist, Slow Start

 0: Useless
	  An ability with no overall benefit in a singles battle.
	ex. Color Change, Plus

 1: Ineffective
	  An ability that has minimal effect or is only useful in niche situations.
	ex. Light Metal, Suction Cups

 2: Useful
	  An ability that can be generally useful.
	ex. Flame Body, Overcoat

 3: Effective
	  An ability with a strong effect on the user or foe.
	ex. Chlorophyll, Sturdy

 4: Very useful
	  One of the more popular abilities. It requires minimal support to be effective.
	ex. Adaptability, Magic Bounce

 5: Essential
	  The sort of ability that defines metagames.
	ex. Imposter, Shadow Tag

*/
export const Abilities: {[abilityid: string]: AbilityData} = {
	disguise: {
		onDamagePriority: 1,
		onDamage(damage, target, source, effect) {
			if (
				effect && effect.effectType === 'Move' &&
				['mimikyu', 'mimikyutotem', 'uproot'].includes(target.species.id) && !target.transformed
			) {
				this.add('-activate', target, 'ability: Disguise');
				this.effectData.busted = true;
				return 0;
			}
		},
		onCriticalHit(target, source, move) {
			if (!target) return;
			if (!['mimikyu', 'uproot'].includes(target.species.id) || target.transformed) {
				return;
			}
			const hitSub = target.volatiles['substitute'] && !move.flags['authentic'] && !(move.infiltrates && this.gen >= 6);
			if (hitSub) return;

			if (!target.runImmunity(move.type)) return;
			return false;
		},
		onEffectiveness(typeMod, target, type, move) {
			if (!target) return;
			if (!['mimikyu', 'uproot'].includes(target.species.id) || target.transformed) {
				return;
			}
			const hitSub = target.volatiles['substitute'] && !move.flags['authentic'] && !(move.infiltrates && this.gen >= 6);
			if (hitSub) return;

			if (!target.runImmunity(move.type)) return;
			return 0;
		},
		onUpdate(pokemon) {
			if (['mimikyu', 'uproot'].includes(pokemon.species.id) && this.effectData.busted) {
				const speciesid = pokemon.species.id === 'uproot' ? 'Uproot-Busted' : 'Mimikyu-Busted';
				pokemon.formeChange(speciesid, this.effect, true);
				this.damage(pokemon.baseMaxhp / 8, pokemon, pokemon, this.dex.getSpecies(speciesid));
			}
		},
		isPermanent: true,
		name: "Disguise",
		rating: 3.5,
		num: 209,
	},
	icebody: {
		onWeather(target, source, effect) {
			if (effect.id === 'snow') {
				this.heal(target.baseMaxhp / 12);
			}
		},
		onImmunity(type, pokemon) {
			if (type === 'snow') return false;
		},
		name: "Ice Body",
		rating: 1,
		num: 115,
	},
	fearmonger: {
		id: "fearmonger",
		name: "Fearmonger",
		shortDesc: "Lower's the opponent's Speed upon switch-in.",
		onStart(pokemon) {
			let activated = false;
			for (const target of pokemon.adjacentFoes()) {
				if (!activated) {
					this.add('-ability', pokemon, 'Fearmonger', 'boost');
					activated = true;
				}
				if (target.volatiles['substitute']) {
					this.add('-immune', target);
				} else {
					this.boost({spe: -1}, target, pokemon, null, true);
				}
			}
		},
		rating: 3.5,
	},
	terrorize: {
		id: "terrorize",
		name: "Terrorize",
		shortDesc: "Lower's the opponent's Special Attack upon switch-in.",
		onStart(pokemon) {
			let activated = false;
			for (const target of pokemon.adjacentFoes()) {
				if (!activated) {
					this.add('-ability', pokemon, 'Terrorize', 'boost');
					activated = true;
				}
				if (target.volatiles['substitute']) {
					this.add('-immune', target);
				} else {
					this.boost({spa: -1}, target, pokemon, null, true);
				}
			}
		},
		rating: 3.5,
	},
	sunsprint: {
		id: "sunsprint",
		name: "Sun Sprint",
		shortDesc: "Speed is doubled during Harsh Sunlight.",
		onModifySpe(spe, pokemon) {
			if (['sunnyday', 'desolateland'].includes(pokemon.effectiveWeather())) {
				return this.chainModify(2);
			}
		},
		rating: 3,
	},
	fortitude: {
		id: "fortitude",
		name: "Fortitude",
		shortDesc: "Special Attack increases by one stage after earning a KO.",
		onSourceAfterFaint(length, target, source, effect) {
			if (effect && effect.effectType === 'Move') {
				this.boost({spa: length}, source);
			}
		},
		rating: 3,
	},
	snowforce: {
		id: "snowforce",
		name: "Snow Force",
		shortDesc: "During snow Ice moves deal 1.5x more damage and Accuracy increased by 30%.",
		onBasePowerPriority: 21,
		onBasePower(basePower, attacker, defender, move) {
			if (this.field.isWeather('snow')) {
				if (move.type === 'Ice') {
					return this.chainModify(1.5);
				}
			}
		},
		onSourceModifyAccuracyPriority: 9,
		onSourceModifyAccuracy(accuracy) {
			if (this.field.isWeather('snow')) {
				if (typeof accuracy !== 'number') return;
				this.debug('snowforce - enhancing accuracy');
				return accuracy * 1.3;
			}
		},
		onImmunity(type, pokemon) {
			if (type === 'snow') return false;
		},
		rating: 2,
	},
	aquaamplify: {
		name: "Aqua Amplify",
		id: "aquaamplify",
		shortDesc: "Special Defense is doubled during rain.",
		onModifySpD(spd, pokemon) {
			if (['raindance', 'primordialsea'].includes(pokemon.effectiveWeather())) {
				return this.chainModify(2);
			}
		},
		rating: 4,
	},
	starboost: {
		id: "starboost",
		name: "Star Boost",
		shortDesc: "Increases both Special Attack and Attack upon earning a KO.",
		onSourceAfterFaint(length, target, source, effect) {
			if (effect && effect.effectType === 'Move') {
				this.boost({atk: length}, source);
				this.boost({spa: length}, source);
			}
		},
		rating: 3,
	},
	starpetals: {
		id: "starpetals",
		name: "Star Petals",
		shortDesc: "Deals 50% more damage when the user is at full HP",
		onModifySpA(spa, pokemon) {
			if (pokemon.hp >= pokemon.maxhp) {
				this.debug('Multiscale weaken');
				return this.chainModify(1.5);
			}
		},
		onModifyAtk(atk, pokemon) {
			if (pokemon.hp >= pokemon.maxhp) {
				this.debug('Multiscale weaken');
				return this.chainModify(1.5);
			}
		},
		rating: 3.5,
	},
	starbubble: {
		name: "Star Bubble",
		id: "starbubble",
		shortDesc: "Water and Ice power is 1.5x, it can't be burned; Fire power against it is halved.",
		onSourceModifyAtkPriority: 5,
		onSourceModifyAtk(atk, attacker, defender, move) {
			if (move.type === 'Fire') {
				return this.chainModify(0.5);
			}
		},
		onSourceModifySpAPriority: 5,
		onSourceModifySpA(atk, attacker, defender, move) {
			if (move.type === 'Fire') {
				return this.chainModify(0.5);
			}
		},
		onModifyAtk(atk, attacker, defender, move) {
			if (move.type === 'Water' || move.type === 'Ice') {
				return this.chainModify(1.5);
			}
		},
		onModifySpA(atk, attacker, defender, move) {
			if (move.type === 'Water' || move.type === 'Ice') {
				return this.chainModify(1.5);
			}
		},
		onUpdate(pokemon) {
			if (pokemon.status === 'brn') {
				this.add('-activate', pokemon, 'ability: Star Bubble');
				pokemon.cureStatus();
			}
		},
		onSetStatus(status, target, source, effect) {
			if (status.id !== 'brn') return;
			if ((effect as Move)?.status) {
				this.add('-immune', target, '[from] ability: Star Bubble');
			}
			return false;
		},
		rating: 4.5,
	},
	
	voltaicenergy: {
		name: "Voltaic Energy",
		id: "voltaicenergy",
		shortDesc: "Electric power is 2x, contact moves may cause paralysis.",
		onModifyAtk(atk, attacker, defender, move) {
			if (move.type === 'Electric') {
				return this.chainModify(2.0);
			}
		},
		onModifySpA(atk, attacker, defender, move) {
			if (move.type === 'Electric') {
				return this.chainModify(2.0);
			}
		},
		onDamagingHit(damage, target, source, move) {
			if (move.flags['contact']) {
				if (this.randomChance(3, 10)) {
					source.trySetStatus('par', target);
				}
			}
		},
		rating: 2,
	},
	eternalflame: {
		name: "Eternal Flame",
		id: "eternalflame",
		shortDesc: "Fire power is 2x, it can't be frostbit; Water power against it is halved.",
		onSourceModifyAtkPriority: 5,
		onSourceModifyAtk(atk, attacker, defender, move) {
			if (move.type === 'Water') {
				return this.chainModify(0.5);
			}
		},
		onSourceModifySpAPriority: 5,
		onSourceModifySpA(atk, attacker, defender, move) {
			if (move.type === 'Water') {
				return this.chainModify(0.5);
			}
		},
		onModifyAtk(atk, attacker, defender, move) {
			if (move.type === 'Fire') {
				return this.chainModify(2.0);
			}
		},
		onModifySpA(atk, attacker, defender, move) {
			if (move.type === 'Fire') {
				return this.chainModify(2.0);
			}
		},
		onUpdate(pokemon) {
			if (pokemon.status === 'fbt') {
				this.add('-activate', pokemon, 'ability: Eternal Flame');
				pokemon.cureStatus();
			}
		},
		onSetStatus(status, target, source, effect) {
			if (status.id !== 'fbt') return;
			if ((effect as Move)?.status) {
				this.add('-immune', target, '[from] ability: Eternal Flame');
			}
			return false;
		},
		rating: 4.5,
	},
	starflame: {
		id: "starflame",
		name: "Star Flame",
		shortDesc: "Attacks have an extra 20% chance to burn.",
		onModifyMove(move) {
			if (!move.secondaries) {
				move.secondaries = [];
			}
			move.secondaries.push({
				chance: 20,
				status: 'brn',
			});
		},
		rating: 2,
	},
	starvenom: {
		id: "starvenom",
		name: "Star Venom",
		shortDesc: "Attacks have an extra 20% chance to badly poison.",
		onSourceDamagingHit(damage, target, source, move) {
			// Despite not being a secondary, Shield Dust / Covert Cloak block Poison Touch's effect
			if (target.hasAbility('shielddust') || target.hasItem('covertcloak')) return;
			if (this.checkMoveMakesContact(move, target, source)) {
				if (this.randomChance(2, 10)) {
					target.trySetStatus('tox', source);
				}
			}
		},
		rating: 2,
	},
	blowaway: {
		id: "blowaway",
		name: "Blow Away",
		shortDesc: "Removes harmful hazards upon entry.",
        onSwitchInPriority: 6,
        onSwitchIn(pokemon, target, source) {
         const sideConditions = ['spikes', 'toxicspikes', 'stealthrock', 'stickyweb', 'gmaxsteelsurge', 'secretseeds'];
         for (const condition of sideConditions) {
            if (pokemon.hp && pokemon.side.removeSideCondition(condition)) {
               this.add('-sideend', pokemon.side, this.dex.conditions.get(condition).name, '[from] ability: Blow Away', '[of] ' + pokemon);
            }
          }
        },
		rating: 3.5,
    },
	shadowsteal: {
		id: "shadowsteal",
		name: "Shadow Steal",
		shortDesc: "This Pokemon's Special Attack is raised by 1 stage if hit by a Dark move; Dark immunity.",
		onTryHit(target, source, move) {
			if (target !== source && move.type === 'Dark') {
				if (!this.boost({spa: 1})) {
					this.add('-immune', target, '[from] ability: Shadow Steal');
				}
				return null;
			}
		},
		rating: 3,
		num: 78,
	},
	blubberbody: {
		id: "blubberbody",
		name: "Blubber Body",
		shortDesc: "This Pokemon's Special Defense stat is doubled.",
		onModifySpDPriority: 6,
		onModifySpD(spd) {
			return this.chainModify(2);
		},
		rating: 4,
	},
	bombexpert: {
		id: "bombexpert",
		name: "Bomb Expert",
		shortDesc: "Explosive attacks will remove 3/4th's the Pokemon's total HP.",
		rating: 4,
	},
	poisonleech: {
		id: "poisonleech",
		name: "Poison Leech",
		shortDesc: "Heals the user based on Poison/Toxic damage the foe endures.",
		
		onResidualOrder: 26,
		onResidualSubOrder: 1,
		onResidual(pokemon) {
            if (!pokemon.hp) return;
            for (const target of pokemon.side.foe.active) {
                if (!target || !target.hp) continue;
					if (target.status === 'psn') {
						this.heal(target.baseMaxhp / 8);
					}
					else if (target.status === "tox") {
						this.heal((target.baseMaxhp / 16) * target.statusData.stage)
					}
            }
        },
		rating: 4,
	},
	starsword: {
		id: "starsword",
		name: "Star Sword",
		shortDesc: "Powers up slashing and cutting moves by 30%.",
		onBasePowerPriority: 19,
		onBasePower(basePower, attacker, defender, move) {
			if (move.flags['slicing']) {
				return this.chainModify(1.5);
			}
		},
	},
	chillout: {
		onDamagingHit(damage, target, source, move) {
			if (!move.flags['contact']) {
				if (this.randomChance(3, 10)) {
					source.trySetStatus('fbt', target);
				}
			}
		},
		id: "chillout",
		name: "Chill Out",
		shortDesc: "30% chance of a Koopamon not making contact with this Koopamon will be frostbit.",
		rating: 2,
	},
	goldarmor: {
		onSourceModifyDamage(damage, source, target, move) {
			if (target.getMoveHitData(move).typeMod > 0) {
				this.debug('Gold Armor neutralize');
				return this.chainModify(0.75);
			}
		},
		id: "goldarmor",
		name: "Gold Armor",
		shortDesc: "This Koopamon receives 3/4 damage from supereffective attacks.",
		rating: 3,
		num: 116,
	},
	sandboost: {
			onChangeBoost(boost, target, source, effect) {
			
				if (effect && effect.id === 'zpower') return;
				let i: BoostName;
				if (this.field.isWeather('sandstorm')) {
				for (i in boost) {
					boost[i]! *= 2;
				}
				}
			},
		id: "sandboost",
		name: "Sand Boost",
		shortDesc: "When this Koopamon's stat stages are raised or lowered, the effect is doubled in a sandstorm.",
		rating: 4,
	},
	oceansfavor: {
		onModifyAtkPriority: 5,
		onModifyAtk(atk, attacker, defender, move) {
			if (move.type === 'Water') {
				this.debug('Oceans Favor boost');
				return this.chainModify(1.5);
			}
		},
		onModifySpAPriority: 5,
		onModifySpA(atk, attacker, defender, move) {
			if (move.type === 'Water') {
				this.debug('Oceans Favor boost');
				return this.chainModify(1.5);
			}
		},
		id: "oceansfavor",
		name: "Oceans Favor",
		shortDesc: "This Koopamon's attacking stat is multiplied by 1.5 while using a Water-Type attack.",
		rating: 3.5,
	},
	starguard: {
		onTryHit(target, source, move) {
			if (target.runEffectiveness(move) > 0) {
				this.add('-immune', target, '[from] ability: Star Guard');
				return null;
			}
			
		},
		id: "starguard",
		name: "Star Guard",
		shortDesc: "This Koopamon cannot damaged by moves that are supereffective against it.",
		rating: 5,
	},
	hauntedhook: {
		onAnyEffectiveness(typeMod, target, type) {
			if (type === 'Ghost' && target?.hasType('Water')) return typeMod + 1;
		},
		id: "hauntedhook",
		name: "Haunted Hook",
		shortDesc: "Ghost-Type moves are supereffective against Water-Types.",
		rating: 5,
	},
	starshock: {
		onModifyCritRatio(critRatio, source, target) {
			if (target && ['par'].includes(target.status)) return 5;
		},
		id: "starshock",
		name: "Star Shock",
		shortDesc: "This Koopamon's attacks are critical hits if the target is paralyzed.",
		rating: 1.5,
	},
	starbat: {
		id: "starbat",
		name: "Star Bat",
		shortDesc: "Powers up bomb and ball moves by 30%.",
		onBasePowerPriority: 19,
		onBasePower(basePower, attacker, defender, move) {
			if (move.flags['bullet']) {
				return this.chainModify(1.3);
			}
		},
	},
	stardash: {
		onModifyPriority(priority, pokemon, target, move) {
			if (move.basePower <= 50) {
				this.debug('Star Dash boost');
				return priority + 1;
			}
		},
		id: "stardash",
		name: "Star Dash",
		shortDesc: "Moves with 50 BP or lower have priority raisoed by 1.",
	},
	frozenshell: {
		onModifyDefPriority: 5,
		onModifyDef(def, pokemon) {
			if (pokemon.hp <= pokemon.maxhp / 2) {
				return this.chainModify(2.5);
			}
		},
		onModifySpDPriority: 5,
		onModifySpD(spd, pokemon) {
			if (pokemon.hp <= pokemon.maxhp / 2) {
				return this.chainModify(2.5);
			}
		},
		id: "frozenshell",
		name: "Frozen Shell",
		shortDesc: "While this Koopamon has 1/2 or less of its max HP, its Def and Sp. Def are x2.5",
	},
	frostboost: {
		onModifySpAPriority: 5,
		onModifySpA(spa, pokemon) {
			if (pokemon.status === 'fbt') {
				return this.chainModify(1.5);
			}
		},
		id: "frostboost",
		name: "Frost Boost",
		shortDesc: "While this Koopamon is frostbit, its Sp. Atk is 1.5x; ignores frostbite halving damage.",
	},
	powerhammer: {
		id: "powerhammer",
		name: "Power Hammer",
		shortDesc: "Powers up hammer moves by 50%.",
		onBasePowerPriority: 19,
		onBasePower(basePower, attacker, defender, move) {
			if (move.flags['hammer']) {
				return this.chainModify(1.5);
			}
		},
	},
};