/*

List of flags and their descriptions:

authentic: Ignores a target's substitute.
bite: Power is multiplied by 1.5 when used by a Pokemon with the Strong Jaw Ability.
bullet: Has no effect on Pokemon with the Bulletproof Ability.
charge: The user is unable to make a move between turns.
contact: Makes contact.
dance: When used by a Pokemon, other Pokemon with the Dancer Ability can attempt to execute the same move.
defrost: Thaws the user if executed successfully while the user is frozen.
distance: Can target a Pokemon positioned anywhere in a Triple Battle.
gravity: Prevented from being executed or selected during Gravity's effect.
heal: Prevented from being executed or selected during Heal Block's effect.
mirror: Can be copied by Mirror Move.
mystery: Unknown effect.
nonsky: Prevented from being executed or selected in a Sky Battle.
powder: Has no effect on Grass-type Pokemon, Pokemon with the Overcoat Ability, and Pokemon holding Safety Goggles.
protect: Blocked by Detect, Protect, Spiky Shield, and if not a Status move, King's Shield.
pulse: Power is multiplied by 1.5 when used by a Pokemon with the Mega Launcher Ability.
punch: Power is multiplied by 1.2 when used by a Pokemon with the Iron Fist Ability.
recharge: If this move is successful, the user must recharge on the following turn and cannot make a move.
reflectable: Bounced back to the original user by Magic Coat or the Magic Bounce Ability.
snatch: Can be stolen from the original user and instead used by another Pokemon using Snatch.
sound: Has no effect on Pokemon with the Soundproof Ability.

*/

export const Moves: {[moveid: string]: MoveData} = {
	selfdestruct: {
		num: 120,
		accuracy: 100,
		basePower: 251,
		category: "Physical",
		name: "Self-Destruct",
		pp: 5,
		priority: 0,
		flags: {protect: 1, mirror: 1},
		onTryHit(target, source) {
			if (source?.hasAbility('bombexpert')) {
				this.damage(Math.round(source.maxhp * 0.75), source, source, this.dex.conditions.get('Mind Blown'), true);
			} else if (!source?.hasAbility('bombexpert')) {
				this.damage(Math.round(source.maxhp), source, source, this.dex.conditions.get('Mind Blown'), true);
			}
		},
		secondary: null,
		target: "allAdjacent",
		type: "Normal",
		contestType: "Beautiful",
	},
	razorwind: {
		num: 13,
		accuracy: 100,
		basePower: 140,
		category: "Special",
		isNonstandard: "Past",
		name: "Razor Wind",
		pp: 10,
		priority: 0,
		flags: {charge: 1, protect: 1, mirror: 1},
		onTryMove(attacker, defender, move) {
			if (attacker.removeVolatile(move.id)) {
				return;
			}
			this.add('-prepare', attacker, move.name);
			if (!this.runEvent('ChargeMove', attacker, defender, move)) {
				return;
			}
			attacker.addVolatile('twoturnmove', defender);
			return null;
		},
		critRatio: 2,
		secondary: null,
		target: "allAdjacentFoes",
		type: "Normal",
		contestType: "Cool",
	},
	explosion: {
		num: 153,
		accuracy: 100,
		basePower: 250,
		category: "Physical",
		name: "Explosion",
		pp: 5,
		priority: 0,
		flags: {protect: 1, mirror: 1},
		onTryHit(target, source) {
			if (source?.hasAbility('bombexpert')) {
				this.damage(Math.round(source.maxhp * 0.75), source, source, this.dex.conditions.get('Mind Blown'), true);
			} else if (!source?.hasAbility('bombexpert')) {
				this.damage(Math.round(source.maxhp), source, source, this.dex.conditions.get('Mind Blown'), true);
			}
		},
		secondary: null,
		target: "allAdjacent",
		type: "Fire",
		contestType: "Beautiful",
	},
	inferno: {
		num: 517,
		accuracy: 65,
		basePower: 100,
		category: "Special",
		name: "Inferno",
		pp: 5,
		priority: 0,
		flags: {protect: 1, mirror: 1},
		secondary: {
			chance: 100,
			status: 'brn',
		},
		target: "normal",
		type: "Fire",
		contestType: "Beautiful",
	},
	zapcannon: {
		num: 192,
		accuracy: 65,
		basePower: 120,
		category: "Special",
		name: "Zap Cannon",
		pp: 5,
		priority: 0,
		flags: {bullet: 1, protect: 1, mirror: 1},
		secondary: {
			chance: 100,
			status: 'par',
		},
		target: "normal",
		type: "Electric",
		contestType: "Cool",
	},
	rapidspin: {
		num: 229,
		accuracy: 100,
		basePower: 50,
		category: "Physical",
		name: "Rapid Spin",
		pp: 40,
		priority: 0,
		flags: {contact: 1, protect: 1, mirror: 1},
		onAfterHit(target, pokemon) {
			if (pokemon.hp && pokemon.removeVolatile('leechseed')) {
				this.add('-end', pokemon, 'Leech Seed', '[from] move: Rapid Spin', '[of] ' + pokemon);
			}
			const sideConditions = ['spikes', 'toxicspikes', 'stealthrock', 'stickyweb', 'gmaxsteelsurge', 'secretseeds'];
			for (const condition of sideConditions) {
				if (pokemon.hp && pokemon.side.removeSideCondition(condition)) {
					this.add('-sideend', pokemon.side, this.dex.conditions.get(condition).name, '[from] move: Rapid Spin', '[of] ' + pokemon);
				}
			}
			if (pokemon.hp && pokemon.volatiles['partiallytrapped']) {
				pokemon.removeVolatile('partiallytrapped');
			}
		},
		onAfterSubDamage(damage, target, pokemon) {
			if (pokemon.hp && pokemon.removeVolatile('leechseed')) {
				this.add('-end', pokemon, 'Leech Seed', '[from] move: Rapid Spin', '[of] ' + pokemon);
			}
			const sideConditions = ['spikes', 'toxicspikes', 'stealthrock', 'stickyweb', 'gmaxsteelsurge', 'secretseeds'];
			for (const condition of sideConditions) {
				if (pokemon.hp && pokemon.side.removeSideCondition(condition)) {
					this.add('-sideend', pokemon.side, this.dex.conditions.get(condition).name, '[from] move: Rapid Spin', '[of] ' + pokemon);
				}
			}
			if (pokemon.hp && pokemon.volatiles['partiallytrapped']) {
				pokemon.removeVolatile('partiallytrapped');
			}
		},
		secondary: {
			chance: 100,
			self: {
				boosts: {
					spe: 1,
				},
			},
		},
		target: "normal",
		type: "Normal",
		contestType: "Cool",
	},
	defog: {
		num: 432,
		accuracy: true,
		basePower: 0,
		category: "Status",
		name: "Defog",
		pp: 15,
		priority: 0,
		flags: {protect: 1, reflectable: 1, mirror: 1, authentic: 1},
		onHit(target, source, move) {
			let success = false;
			if (!target.volatiles['substitute'] || move.infiltrates) success = !!this.boost({evasion: -1});
			const removeTarget = [
				'reflect', 'lightscreen', 'auroraveil', 'magmaaura', 'safeguard', 'mist', 'spikes', 'toxicspikes', 'stealthrock', 'stickyweb', 'gmaxsteelsurge', 'secretseeds', 'magiccircle',
			];
			const removeAll = [
				'spikes', 'toxicspikes', 'stealthrock', 'stickyweb', 'gmaxsteelsurge', 'secretseeds', 'magiccircle',
			];
			for (const targetCondition of removeTarget) {
				if (target.side.removeSideCondition(targetCondition)) {
					if (!removeAll.includes(targetCondition)) continue;
					this.add('-sideend', target.side, this.dex.conditions.get(targetCondition).name, '[from] move: Defog', '[of] ' + source);
					success = true;
				}
			}
			for (const sideCondition of removeAll) {
				if (source.side.removeSideCondition(sideCondition)) {
					this.add('-sideend', source.side, this.dex.conditions.get(sideCondition).name, '[from] move: Defog', '[of] ' + source);
					success = true;
				}
			}
			this.field.clearTerrain();
			return success;
		},
		secondary: null,
		target: "normal",
		type: "Flying",
		zMove: {boost: {accuracy: 1}},
		contestType: "Cool",
	},
	magmaaura: {
		accuracy: true,
		basePower: 0,
		category: "Status",
		name: "Magma Aura",
		id: "magmaaura",
		pp: 20,
		priority: 0,
		flags: {snatch: 1},
		sideCondition: 'magmaaura',
		condition: {
			duration: 5,
			durationCallback(target, source, effect) {
				if (source?.hasItem('lightclay')) {
					return 8;
				}
				return 5;
			},
			onTryHit(target, source, move) {
				if (target !== source && move.type === 'Water') {
					if (!this.boost({spa: 1})) {
						this.add('-immune', target, '[from] condition: Magma Aura');
					}
					return null;
				}
			},
			onAnyRedirectTarget(target, source, source2, move) {
				if (move.type !== 'Water' || ['firepledge', 'grasspledge', 'waterpledge'].includes(move.id)) return;
				const redirectTarget = ['randomNormal', 'adjacentFoe'].includes(move.target) ? 'normal' : move.target;
				if (this.validTarget(this.effectState.target, source, redirectTarget)) {
					if (move.smartTarget) move.smartTarget = false;
					if (this.effectState.target !== target) {
						this.add('-activate', this.effectState.target, 'condition: Magma Aura');
					}
					return this.effectState.target;
				}
			},
//			onAnyModifyDamage(damage, source, target, move) {
//				if (target !== source && target.side === this.effectState.target && this.getCategory(move) === 'Special') {
//					if (!target.getMoveHitData(move).crit && !move.infiltrates) {
//						this.debug('Light Screen weaken');
//						if (target.side.active.length > 1) return this.chainModify([0xAAC, 0x1000]);
//						return this.chainModify(0.5);
//					}
//				}
//			},
			onStart(side) {
				this.add('-sidestart', side, 'move: Magma Aura');
			},
			onResidualOrder: 21,
			onResidualSubOrder: 1,
			onEnd(side) {
				this.add('-sideend', side, 'move: Magma Aura');
			},
		},
		secondary: null,
		target: "allySide",
		type: "Fire",
	},
	oblivionwing: {
		num: 613,
		accuracy: 100,
		basePower: 70,
		category: "Special",
		name: "Oblivion Wing",
		pp: 10,
		priority: 0,
		flags: {protect: 1, mirror: 1, distance: 1, heal: 1},
		drain: [3, 4],
		secondary: null,
		target: "any",
		type: "Flying",
		contestType: "Cool",
	},
	ingrain: {
		num: 275,
		accuracy: true,
		basePower: 0,
		category: "Status",
		name: "Ingrain",
		pp: 20,
		priority: 0,
		flags: {snatch: 1, nonsky: 1},
		volatileStatus: 'ingrain',
		condition: {
			onStart(pokemon) {
				this.add('-start', pokemon, 'move: Ingrain');
			},
			onResidualOrder: 7,
			onResidual(pokemon) {
				this.heal(pokemon.baseMaxhp / 12);
			},
			onTrapPokemon(pokemon) {
				pokemon.tryTrap();
			},
			// groundedness implemented in battle.engine.js:BattlePokemon#isGrounded
			onDragOut(pokemon) {
				this.add('-activate', pokemon, 'move: Ingrain');
				return null;
			},
		},
		secondary: {
			chance: 100,
			self: {
				boosts: {
					spa: 1,
				},
			},
		},
		target: "self",
		type: "Grass",
		zMove: {boost: {spd: 1}},
		contestType: "Clever",
	},
	aquaring: {
		num: 392,
		accuracy: true,
		basePower: 0,
		category: "Status",
		name: "Aqua Ring",
		pp: 20,
		priority: 0,
		flags: {snatch: 1},
		volatileStatus: 'aquaring',
		condition: {
			onStart(pokemon) {
				this.add('-start', pokemon, 'Aqua Ring');
			},
			onResidualOrder: 6,
			onResidual(pokemon) {
				this.heal(pokemon.baseMaxhp / 16);
			},
		},
		secondary: {
			chance: 100,
			self: {
				boosts: {
					spd: 1,
				},
			},
		},
		target: "self",
		type: "Water",
		zMove: {boost: {def: 1}},
		contestType: "Beautiful",
	},
	doubleironbash: {
		num: 742,
		accuracy: 100,
		basePower: 60,
		category: "Physical",
		name: "Double Iron Bash",
		pp: 5,
		priority: 0,
		flags: {contact: 1, protect: 1, mirror: 1, punch: 1},
		multihit: 2,
		secondary: {
			chance: 15,
			volatileStatus: 'flinch',
		},
		target: "normal",
		type: "Steel",
		zMove: {basePower: 180},
		maxMove: {basePower: 140},
		contestType: "Clever",
	},
	spikes: {
		num: 191,
		accuracy: true,
		basePower: 0,
		category: "Status",
		name: "Spikes",
		pp: 20,
		priority: 0,
		flags: {reflectable: 1, nonsky: 1},
		sideCondition: 'spikes',
		condition: {
			// this is a side condition
			onSideStart(side) {
				this.add('-sidestart', side, 'Spikes');
				this.effectState.layers = 1;
			},
			onSideRestart(side) {
				if (this.effectState.layers >= 3) return false;
				this.add('-sidestart', side, 'Spikes');
				this.effectState.layers++;
			},
			onEntryHazard(pokemon) {
				if (!pokemon.isGrounded()) return;
				if (pokemon.hasItem('heavydutyboots')) return;
				if (pokemon.hasAbility('blowaway')) return;
				const damageAmounts = [0, 3, 4, 6]; // 1/8, 1/6, 1/4
				this.damage(damageAmounts[this.effectState.layers] * pokemon.maxhp / 24);
			},
		},
		secondary: null,
		target: "foeSide",
		type: "Ground",
		zMove: {boost: {def: 1}},
		contestType: "Clever",
	},
	stealthrock: {
		num: 446,
		accuracy: true,
		basePower: 0,
		category: "Status",
		name: "Stealth Rock",
		pp: 20,
		priority: 0,
		flags: {reflectable: 1},
		sideCondition: 'stealthrock',
		condition: {
			// this is a side condition
			onSideStart(side) {
				this.add('-sidestart', side, 'move: Stealth Rock');
			},
			onEntryHazard(pokemon) {
				if (pokemon.hasItem('heavydutyboots')) return;
				if (pokemon.hasAbility('blowaway')) return;
				const typeMod = this.clampIntRange(pokemon.runEffectiveness(this.dex.conditions.getActiveMove('stealthrock')), -6, 6);
				this.damage(pokemon.maxhp * Math.pow(2, typeMod) / 8);
			},
		},
		secondary: null,
		target: "foeSide",
		type: "Rock",
		zMove: {boost: {def: 1}},
		contestType: "Cool",
	},
	
	stickyweb: {
		num: 564,
		accuracy: true,
		basePower: 0,
		category: "Status",
		name: "Sticky Web",
		pp: 20,
		priority: 0,
		flags: {reflectable: 1},
		sideCondition: 'stickyweb',
		condition: {
			onSideStart(side) {
				this.add('-sidestart', side, 'move: Sticky Web');
			},
			onEntryHazard(pokemon) {
				if (!pokemon.isGrounded()) return;
				if (pokemon.hasItem('heavydutyboots')) return;
				if (pokemon.hasAbility('blowaway')) return;
				this.add('-activate', pokemon, 'move: Sticky Web');
				this.boost({spe: -1}, pokemon, this.effectState.source, this.dex.conditions.getActiveMove('stickyweb'));
			},
		},
		secondary: null,
		target: "foeSide",
		type: "Bug",
		zMove: {boost: {spe: 1}},
		contestType: "Tough",
	},
	toxicspikes: {
		num: 390,
		accuracy: true,
		basePower: 0,
		category: "Status",
		name: "Toxic Spikes",
		pp: 20,
		priority: 0,
		flags: {reflectable: 1, nonsky: 1},
		sideCondition: 'toxicspikes',
		condition: {
			// this is a side condition
			onSideStart(side) {
				this.add('-sidestart', side, 'move: Toxic Spikes');
				this.effectState.layers = 1;
			},
			onSideRestart(side) {
				if (this.effectState.layers >= 2) return false;
				this.add('-sidestart', side, 'move: Toxic Spikes');
				this.effectState.layers++;
			},
			onEntryHazard(pokemon) {
				if (!pokemon.isGrounded()) return;
				if (pokemon.hasType('Poison')) {
					this.add('-sideend', pokemon.side, 'move: Toxic Spikes', '[of] ' + pokemon);
					pokemon.side.removeSideCondition('toxicspikes');
				} else if (pokemon.hasType('Steel') || pokemon.hasItem('heavydutyboots') || pokemon.hasAbility('blowaway')) {
					return;
				} else if (this.effectState.layers >= 2) {
					pokemon.trySetStatus('tox', pokemon.side.foe.active[0]);
				} else {
					pokemon.trySetStatus('psn', pokemon.side.foe.active[0]);
				}
			},
		},
		secondary: null,
		target: "foeSide",
		type: "Poison",
		zMove: {boost: {def: 1}},
		contestType: "Clever",
	},
	secretseeds: {
		accuracy: true,
		basePower: 0,
		category: "Status",
		name: "Secret Seeds",
		shortDesc: "2 layers of seeds will cause the foe to be seeded.",
		pp: 20,
		priority: 0,
		flags: {reflectable: 1, nonsky: 1},
		sideCondition: 'secretseeds',
		condition: {
			// this is a side condition
			onSideStart(side) {
				this.add('-sidestart', side, 'move: Secret Seeds');
				this.effectState.layers = 1;
			},
			onSideRestart(side) {
				if (this.effectState.layers >= 2) return false;
				this.add('-sidestart', side, 'move: Secret Seeds');
				this.effectState.layers++;
			},
			onEntryHazard(pokemon) {
				if (!pokemon.isGrounded()) return;
				if (pokemon.hasType('Grass')) {
					this.add('-sideend', pokemon.side, 'move: Secret Seeds', '[of] ' + pokemon);
					pokemon.side.removeSideCondition('secretseeds');
				} else if (pokemon.hasType('Grass') || pokemon.hasItem('heavydutyboots') || pokemon.hasAbility('blowaway')) {
					return;
				} else if (this.effectState.layers >= 2) {
					pokemon.addVolatile('leechseed', pokemon.side.foe.active[0]);
				} else {
					return;
				}
			},
		},
		secondary: null,
		target: "foeSide",
		type: "Grass",
		zMove: {boost: {def: 1}},
		contestType: "Clever",
	},
	gmaxsteelsurge: {
		num: 1000,
		accuracy: true,
		basePower: 10,
		category: "Physical",
		isNonstandard: "Gigantamax",
		name: "G-Max Steelsurge",
		pp: 5,
		priority: 0,
		flags: {},
		isMax: "Copperajah",
		self: {
			onHit(source) {
				source.side.foe.addSideCondition('gmaxsteelsurge');
			},
		},
		condition: {
			onSideStart(side) {
				this.add('-sidestart', side, 'move: G-Max Steelsurge');
			},
			onEntryHazard(pokemon) {
				if (pokemon.hasItem('heavydutyboots')) return;
				if (pokemon.hasAbility('blowaway')) return;
				// Ice Face and Disguise correctly get typed damage from Stealth Rock
				// because Stealth Rock bypasses Substitute.
				// They don't get typed damage from Steelsurge because Steelsurge doesn't,
				// so we're going to test the damage of a Steel-type Stealth Rock instead.
				const steelHazard = this.dex.conditions.getActiveMove('Stealth Rock');
				steelHazard.type = 'Steel';
				const typeMod = this.clampIntRange(pokemon.runEffectiveness(steelHazard), -6, 6);
				this.damage(pokemon.maxhp * Math.pow(2, typeMod) / 8);
			},
		},
		secondary: null,
		target: "adjacentFoe",
		type: "Steel",
		contestType: "Cool",
	},
	infernoturno: {
		accuracy: 100,
		basePower: 45,
		category: "Physical",
		name: "Inferno Turno",
		shortDesc: "User switches out after attacking; 30% burn chance.",
		pp: 10,
		priority: 0,
		flags: {contact: 1, protect: 1, mirror: 1},
		secondary: {
			chance: 30,
			status: 'brn',
		},
		selfSwitch: true,
		target: "normal",
		type: "Fire",
	},
	celestialrocket: {
		accuracy: 90,
		basePower: 150,
		category: "Physical",
		name: "Celestial Rocket",
		shortDesc: "Lowers the user's Defense, Sp. Def, Speed by 1.",
		pp: 5,
		priority: 0,
		flags: {contact: 1, protect: 1, mirror: 1},
		self: {
			boosts: {
				spe: -1,
				def: -1,
				spd: -1,
			},
		},
		secondary: null,
		target: "normal",
		type: "Fairy",
	},
	celestialbeam: {
		accuracy: 100,
		basePower: 85,
		category: "Special",
		name: "Celestial Beam",
		id: "celestialbeam",
		shortDesc: "Eliminates all stat changes.",
		pp: 30,
		priority: 0,
		flags: {protect: 1, mirror: 1},
		onHitField() {
			this.add('-clearallboost');
			for (const pokemon of this.getAllActive()) {
				pokemon.clearBoosts();
			}
		},
		secondary: null,
		target: "normal",
		type: "Fairy",
	},
	buddybop: {
		accuracy: 90,
		basePower: 20,
		basePowerCallback(pokemon, target, move) {
			return 20 * move.hit;
		},
		category: "Physical",
		name: "Buddy Bop",
		pp: 10,
		priority: 0,
		shortDesc: "Hits 3 times. Each hit can miss, but power rises.",
		flags: {contact: 1, protect: 1, mirror: 1},
		multihit: 3,
		multiaccuracy: true,
		secondary: null,
		target: "normal",
		type: "Fairy",
	},
	thornstorm: {
		accuracy: 90,
		basePower: 30,
		category: "Physical",
		name: "Thorn Storm",
		shortDesc: "Hits 2-5 times. User: -1 Def, +1 Atk after last hit..",
		pp: 20,
		priority: 0,
		flags: {protect: 1, mirror: 1},
		multihit: [2, 5],
		selfBoost: {
			boosts: {
				def: -1,
				atk: 1,
			},
		},
		secondary: null,
		target: "normal",
		type: "Grass",
	},
	shoulderbash: {
		accuracy: 100,
		basePower: 100,
		category: "Physical",
		name: "Shoulder Bash",
		shortDesc: "High critical hit ratio.",
		pp: 10,
		priority: 0,
		flags: {contact: 1, protect: 1, mirror: 1},
		critRatio: 2,
		secondary: null,
		target: "normal",
		type: "Fighting",
	},
	beeswarm: {
		accuracy: 85,
		basePower: 100,
		category: "Physical",
		name: "Bee Swarm",
		shortDesc: "Traps and damages the target for 4-5 turns.",
		pp: 5,
		priority: 0,
		flags: {protect: 1, mirror: 1},
		volatileStatus: 'partiallytrapped',
		secondary: null,
		target: "normal",
		type: "Bug",
	},
	blazingseeds: {
		accuracy: 100,
		basePower: 80,
		category: "Special",
		name: "Blazing Seeds",
		shortDesc: "30% chance to set Leech Seed.",
		pp: 10,
		priority: 0,
		flags: {protect: 1, mirror: 1},
		secondary: {
			chance: 30,
			onHit(target, source) {
				if (target.hasType('Grass')) return null;
				target.addVolatile('leechseed', source);
			},
		},
		target: "normal",
		type: "Fire",
	},
	lavalunge: {
		accuracy: 95,
		basePower: 90,
		category: "Physical",
		name: "Lava Lunge",
		shortDesc: "30% chance to burn the target.",
		pp: 15,
		priority: 0,
		flags: {contact: 1, protect: 1, mirror: 1, defrost: 1},
		secondary: {
			chance: 30,
			status: 'brn',
		},
		target: "normal",
		type: "Dragon",
	},
	scorchslam: {
		accuracy: 100,
		basePower: 95,
		category: "Physical",
		name: "Scorch Slam",
		shortDesc: "20% chance to burn the target.",
		pp: 15,
		priority: 0,
		flags: {contact: 1, protect: 1, mirror: 1, defrost: 1},
		secondary: {
			chance: 20,
			status: 'brn',
		},
		target: "normal",
		type: "Fire",
	},
	leafcyclone: {
		accuracy: 100,
		basePower: 90,
		category: "Special",
		name: "Leaf Cyclone",
		shortDesc: "Free user from hazards/bind/Leech Seed; +1 Spe.",
		pp: 15,
		priority: 0,
		flags: {contact: 1, protect: 1, mirror: 1},
		onAfterHit(target, pokemon) {
			if (pokemon.hp && pokemon.removeVolatile('leechseed')) {
				this.add('-end', pokemon, 'Leech Seed', '[from] move: Leaf Cyclone', '[of] ' + pokemon);
			}
			const sideConditions = ['spikes', 'toxicspikes', 'stealthrock', 'stickyweb', 'gmaxsteelsurge', 'secretseeds'];
			for (const condition of sideConditions) {
				if (pokemon.hp && pokemon.side.removeSideCondition(condition)) {
					this.add('-sideend', pokemon.side, this.dex.conditions.get(condition).name, '[from] move: Leaf Cyclone', '[of] ' + pokemon);
				}
			}
			if (pokemon.hp && pokemon.volatiles['partiallytrapped']) {
				pokemon.removeVolatile('partiallytrapped');
			}
		},
		onAfterSubDamage(damage, target, pokemon) {
			if (pokemon.hp && pokemon.removeVolatile('leechseed')) {
				this.add('-end', pokemon, 'Leech Seed', '[from] move: Leaf Cyclone', '[of] ' + pokemon);
			}
			const sideConditions = ['spikes', 'toxicspikes', 'stealthrock', 'stickyweb', 'gmaxsteelsurge', 'secretseeds'];
			for (const condition of sideConditions) {
				if (pokemon.hp && pokemon.side.removeSideCondition(condition)) {
					this.add('-sideend', pokemon.side, this.dex.conditions.get(condition).name, '[from] move: Leaf Cyclone', '[of] ' + pokemon);
				}
			}
			if (pokemon.hp && pokemon.volatiles['partiallytrapped']) {
				pokemon.removeVolatile('partiallytrapped');
			}
		},
		secondary: {
			chance: 100,
			self: {
				boosts: {
					spe: 1,
				},
			},
		},
		target: "normal",
		type: "Grass",
	},
	pollutedwaters: {
		accuracy: 100,
		basePower: 90,
		category: "Special",
		name: "Polluted Waters",
		shortDesc: "30% chance to badly poison the target.",
		pp: 10,
		priority: 0,
		flags: {protect: 1, mirror: 1, defrost: 1},
		thawsTarget: true,
		secondary: {
			chance: 30,
			status: 'tox',
		},
		target: "normal",
		type: "Water",
		contestType: "Tough",
	},
	torturouslullaby: {
		accuracy: 100,
		basePower: 80,
		category: "Special",
		name: "Torturous Lullaby",
		shortDesc: "10% chance to put the target to sleep.",
		pp: 15,
		priority: 0,
		flags: {protect: 1, mirror: 1, sound: 1},
		secondary: {
			chance: 10,
			status: 'slp',
		},
		target: "allAdjacentFoes",
		type: "Fairy",
	},
	darkshuriken: {
		accuracy: 100,
		basePower: 15,
		category: "Physical",
		name: "Dark Shuriken",
		shortDesc: "Usually goes first. Hits 2-5 times in one turn.",
		pp: 20,
		priority: 1,
		flags: {protect: 1, mirror: 1},
		multihit: [2, 5],
		secondary: null,
		target: "normal",
		type: "Dark",
	},
	burningbubbles: {
		accuracy: 100,
		basePower: 95,
		category: "Special",
		name: "Burning Bubbles",
		shortDesc: "50% chance to burn the target. Thaws target.",
		pp: 15,
		priority: 0,
		flags: {protect: 1, mirror: 1, defrost: 1},
		thawsTarget: true,
		secondary: {
			chance: 50,
			status: 'brn',
		},
		target: "normal",
		type: "Water",
	},
	zapattack: {
		accuracy: 90,
		basePower: 40,
		basePowerCallback(pokemon, target, move) {
			let bp = move.basePower;
			if (pokemon.volatiles['rollout'] && pokemon.volatiles['rollout'].hitCount) {
				bp *= Math.pow(2, pokemon.volatiles['rollout'].hitCount);
			}
			if (pokemon.status !== 'slp') pokemon.addVolatile('rollout');
			if (pokemon.volatiles['defensecurl']) {
				bp *= 2;
			}
			this.debug("Rollout bp: " + bp);
			return bp;
		},
		category: "Physical",
		name: "Zap Attack",
		shortDesc: "Power doubles with each hit. Repeats for 5 turns.",
		pp: 25,
		priority: 0,
		flags: {contact: 1, protect: 1, mirror: 1},
		condition: {
			duration: 2,
			onLockMove: 'rollout',
			onStart() {
				this.effectState.hitCount = 1;
			},
			onRestart() {
				this.effectState.hitCount++;
				if (this.effectState.hitCount < 5) {
					this.effectState.duration = 2;
				}
			},
			onResidual(target) {
				if (target.lastMove && target.lastMove.id === 'struggle') {
					// don't lock
					delete target.volatiles['rollout'];
				}
			},
		},
		secondary: null,
		target: "normal",
		type: "Electric",
	},
	frostpulse: {
		accuracy: 100,
		basePower: 80,
		category: "Special",
		name: "Frost Pulse",
		shortDesc: "30% chance to cause Frostbite.",
		pp: 20,
		priority: 0,
		flags: {protect: 1, pulse: 1, mirror: 1},
		secondary: {
			chance: 30,
			status: 'fbt',
		},
		target: "normal",
		type: "Ice",
	},
	phantompunch: {
		accuracy: 100,
		basePower: 85,
		category: "Physical",
		name: "Phantom Punch",
		shortDesc: "Lowers the target's speed.",
		pp: 10,
		priority: 0,
		flags: {contact: 1, protect: 1, mirror: 1, punch: 1},
		secondary: {
			chance: 100,
			boosts: {
				spe: -1,
			},
		},
		target: "normal",
		type: "Ghost",
	},
	cursedcobble: {
		accuracy: 90,
		basePower: 90,
		category: "Special",
		name: "Cursed Cobble",
		shortDesc: "30% chance to lower the target's Special Attack.",
		pp: 15,
		priority: 0,
		flags: {bullet: 1, protect: 1, mirror: 1},
		secondary: {
			chance: 30,
			boosts: {
				spa: -1,
			},
		},
		target: "normal",
		type: "Rock",
	},
	dracotornado: {
		accuracy: 80,
		basePower: 90,
		category: "Special",
		name: "Draco Tornado",
		shortDesc: "Traps and damages the target for 4-5 turns.",
		pp: 5,
		priority: 0,
		flags: {protect: 1, mirror: 1},
		volatileStatus: 'partiallytrapped',
		secondary: null,
		target: "normal",
		type: "Dragon",
	},
	flyswatter: {
		accuracy: 100,
		basePower: 90,
		category: "Physical",
		name: "Fly Swatter",
		shortDesc: "30% chance to lower the target's Special Attack.",
		pp: 15,
		priority: 0,
		flags: {punch: 1, protect: 1, mirror: 1},
		secondary: {
			chance: 100,
			boosts: {
				atk: -1,
			},
		},
		target: "normal",
		type: "Bug",
	},
	flamelure: {
		accuracy: true,
		basePower: 0,
		category: "Status",
		name: "Flame Lure",
		shortDesc: "Protects from moves. Contact: burn.",
		pp: 10,
		priority: 4,
		flags: {},
		stallingMove: true,
		volatileStatus: 'flamelure',
		onTryHit(target, source, move) {
			return !!this.queue.willAct() && this.runEvent('StallMove', target);
		},
		onHit(pokemon) {
			pokemon.addVolatile('stall');
		},
		condition: {
			duration: 1,
			onStart(target) {
				this.add('-singleturn', target, 'move: Protect');
			},
			onTryHitPriority: 3,
			onTryHit(target, source, move) {
				if (!move.flags['protect']) {
					if (move.isZ || (move.isMax && !move.breaksProtect)) target.getMoveHitData(move).zBrokeProtect = true;
					return;
				}
				if (move.smartTarget) {
					move.smartTarget = false;
				} else {
					this.add('-activate', target, 'move: Protect');
				}
				const lockedmove = source.getVolatile('lockedmove');
				if (lockedmove) {
					// Outrage counter is reset
					if (source.volatiles['lockedmove'].duration === 2) {
						delete source.volatiles['lockedmove'];
					}
				}
				if (move.flags['contact']) {
					source.trySetStatus('brn', target);
				}
				return this.NOT_FAIL;
			},
			onHit(target, source, move) {
				if (move.isZOrMaxPowered && move.flags['contact']) {
					source.trySetStatus('brn', target);
				}
			},
		},
		secondary: null,
		target: "self",
		type: "Fire",
	},
	lifedrain: {
		accuracy: 100,
		basePower: 80,
		category: "Special",
		name: "Life Drain",
		shortDesc: "User recovers 50% of the damage dealt.",
		pp: 10,
		priority: 0,
		flags: {protect: 1, mirror: 1, heal: 1},
		drain: [1, 2],
		secondary: null,
		target: "normal",
		type: "Dark",
	},
	mysticburst: {
		accuracy: 100,
		basePower: 75,
		category: "Physical",
		name: "Mystic Burst",
		shortDesc: "Destroys screens, unless the target is immune.",
		pp: 15,
		priority: 0,
		flags: {contact: 1, protect: 1, mirror: 1},
		onTryHit(pokemon) {
			// will shatter screens through sub, before you hit
			if (pokemon.runImmunity('Fighting')) {
				pokemon.side.removeSideCondition('reflect');
				pokemon.side.removeSideCondition('lightscreen');
				pokemon.side.removeSideCondition('auroraveil');
			}
		},
		secondary: null,
		target: "normal",
		type: "Fairy",
	},
	rockfall: {
		accuracy: 100,
		basePower: 50,
		category: "Physical",
		name: "Rock Fall",
		shortDesc: "30% chance to paralyze the target.",
		pp: 25,
		priority: 0,
		flags: {contact: 1, protect: 1, mirror: 1},
		secondary: {
			chance: 30,
			status: 'par',
		},
		target: "normal",
		type: "Rock",
	},
	heavyfall: {
		accuracy: 70,
		basePower: 120,
		category: "Physical",
		name: "Heavy Fall",
		shortDesc: "30% chance to paralyze the target.",
		pp: 5,
		priority: 0,
		flags: {contact: 1, protect: 1, mirror: 1},
		secondary: {
			chance: 30,
			status: 'par',
		},
		target: "normal",
		type: "Rock",
	},
	thunderthrust: {
		accuracy: 100,
		basePower: 95,
		category: "Physical",
		name: "Thunder Thrust",
		shortDesc: "50% chance to paralyze the target.",
		pp: 5,
		priority: 0,
		flags: {contact: 1, protect: 1, mirror: 1},
		secondary: {
			chance: 50,
			status: 'par',
		},
		target: "normal",
		type: "Fighting",
	},
	spikeball: {
		accuracy: 85,
		basePower: 100,
		category: "Physical",
		name: "Spike Ball",
		shortDesc: "30% chance to flinch the target.",
		pp: 10,
		priority: 0,
		flags: {bullet: 1, protect: 1, mirror: 1},
		secondary: {
			chance: 30,
			volatileStatus: 'flinch',
		},
		target: "normal",
		type: "Steel",
	},
	venomleech: {
		accuracy: 90,
		basePower: 90,
		category: "Physical",
		name: "Venom Leech",
		shortDesc: "User recovers 50% of the damage dealt.",
		pp: 10,
		priority: 0,
		flags: {contact: 1, protect: 1, mirror: 1, heal: 1},
		drain: [1, 2],
		secondary: null,
		target: "normal",
		type: "Poison",
	},
	ironbash: {
		accuracy: 100,
		basePower: 60,
		category: "Physical",
		name: "Iron Bash",
		shortDesc: "30% chance to flinch the target.",
		pp: 35,
		priority: 0,
		flags: {contact: 1, protect: 1, mirror: 1},
		secondary: {
			chance: 30,
			volatileStatus: 'flinch',
		},
		target: "normal",
		type: "Steel",
	},
	obsidianblade: {
		accuracy: true,
		basePower: 75,
		category: "Physical",
		name: "Obsidian Blade",
		shortDesc: "Never misses. High critical hit ratio.",
		pp: 10,
		priority: 0,
		critRatio: 2,
		flags: {slicing: 1, protect: 1, mirror: 1},
		secondary: null,
		target: "normal",
		type: "Rock",
	},
	ironhammer: {
		accuracy: 100,
		basePower: 90,
		category: "Physical",
		name: "Iron Hammer",
		shortDesc: "No additional effect.",
		pp: 15,
		priority: 0,
		flags: {protect: 1, mirror: 1, hammer: 1},
		secondary: null,
		target: "normal",
		type: "Steel",
	},
	mistywind: {
		accuracy: 100,
		basePower: 60,
		category: "Special",
		name: "Misty Wind",
		shortDesc: "10% chance to raise all stats by 1 (not acc/eva).",
		pp: 10,
		priority: 0,
		flags: {protect: 1, mirror: 1},
		secondary: {
			chance: 10,
			self: {
				boosts: {
					atk: 1,
					def: 1,
					spa: 1,
					spd: 1,
					spe: 1,
				},
			},
		},
		target: "normal",
		type: "Fairy",
		contestType: "Tough",
	},
	supercannon: {
		accuracy: 100,
		basePower: 25,
		category: "Special",
		name: "Super Cannon",
		shortDesc: "Fires 1-3 shots. Each shot may lower the foes SPDEF.",
		pp: 20,
		priority: 0,
		flags: {bullet: 1, protect: 1, mirror: 1},
		multihit: [1, 3],
		secondary: {
			chance: 30,
			boosts: {
				spd: -1,
			},
		},
		target: "normal",
		type: "Normal",
	},
	electrogoop: {
		accuracy: 100,
		basePower: 95,
		category: "Special",
		name: "Electro Goop",
		shortDesc: "Lowers the target's speed.",
		pp: 10,
		priority: 0,
		flags: {protect: 1, mirror: 1},
		secondary: {
			chance: 100,
			boosts: {
				spe: -1,
			},
		},
		target: "normal",
		type: "Electric",
	},
	lasereye: {
		accuracy: 95,
		basePower: 100,
		category: "Special",
		name: "Laser Eye",
		shortDesc: "Increases the user's accuracy.",
		pp: 5,
		priority: 0,
		flags: {protect: 1, mirror: 1},
		secondary: {
			chance: 100,
			self: {
				boosts: {
					accuracy: 1,
				},
			},
		},
		target: "normal",
		type: "Dark",
	},
	spiritbomb: {
		accuracy: 85,
		basePower: 110,
		category: "Special",
		name: "Spirit Bomb",
		shortDesc: "10% chance to lower Special Defense.",
		pp: 10,
		priority: 0,
		flags: {bullet: 1, protect: 1, mirror: 1},
		secondary: {
			chance: 10,
			boosts: {
				spd: -1,
			},
		},
		target: "normal",
		type: "Ghost",
	},
	wickedlaugh: {
		accuracy: 100,
		basePower: 95,
		category: "Special",
		name: "Wicked Laugh",
		shortDesc: "No additional effect.",
		pp: 10,
		priority: 0,
		flags: {protect: 1, mirror: 1, sound: 1},
		secondary: null,
		target: "normal",
		type: "Dark",
	},
	piercingpoke: {
		accuracy: 100,
		basePower: 80,
		category: "Physical",
		name: "Piercing Poke",
		shortDesc: "Destroys screens, unless the target is immune.",
		pp: 15,
		priority: 0,
		flags: {contact: 1, protect: 1, mirror: 1},
		onTryHit(pokemon) {
			// will shatter screens through sub, before you hit
			if (pokemon.runImmunity('Fighting')) {
				pokemon.side.removeSideCondition('reflect');
				pokemon.side.removeSideCondition('lightscreen');
				pokemon.side.removeSideCondition('auroraveil');
			}
		},
		secondary: null,
		target: "normal",
		type: "Steel",
	},
	dragonboost: {
		accuracy: true,
		basePower: 0,
		category: "Status",
		name: "Dragon Boost",
		shortDesc: "Raises the user's Special Attack and Speed by 1.",
		pp: 20,
		priority: 0,
		flags: {snatch: 1, dance: 1},
		boosts: {
			spa: 1,
			spe: 1,
		},
		secondary: null,
		target: "self",
		type: "Dragon",
	},
	gravitycannon: {
		accuracy: 90,
		basePower: 100,
		category: "Special",
		name: "Gravity Cannon",
		shortDesc: "50% chance to lower the target's Special Attack.",
		pp: 5,
		priority: 0,
		flags: {protect: 1, mirror: 1},
		secondary: {
			chance: 10,
			boosts: {
				spa: -1,
			},
		},
		target: "normal",
		type: "Psychic",
	},
	gravitysmash: {
		accuracy: 85,
		basePower: 110,
		category: "Physical",
		name: "Gravity Smash",
		shortDesc: "30% chance to confuse the target.",
		pp: 5,
		priority: 0,
		flags: {contact: 1, protect: 1, mirror: 1, punch: 1},
		secondary: {
			chance: 100,
			volatileStatus: 'confusion',
		},
		target: "normal",
		type: "Psychic",
	},
	spikestorm: {
		accuracy: 90,
		basePower: 60,
		category: "Physical",
		name: "Spike Storm",
		shortDesc: "Sets up a layer of spikes.",
		pp: 10,
		priority: 0,
		flags: {protect: 1, mirror: 1},
		self: {
			onHit(source) {
				source.side.foe.addSideCondition('spikes');
			},
		},
		secondary: null,
		target: "normal",
		type: "Ground",
	},
	psychowhip: {
		accuracy: 95,
		basePower: 100,
		category: "Physical",
		name: "Psycho Whip",
		shortDesc: "No additional effect.",
		pp: 5,
		priority: 0,
		flags: {contact: 1, protect: 1, mirror: 1, punch: 1},
		multihit: 2,
		secondary: {
			chance: 15,
			volatileStatus: 'confusion',
		},
		target: "normal",
		type: "Psychic",
	},
	freezeblast: {
		accuracy: 100,
		basePower: 200,
		category: "Physical",
		name: "Freeze Blast",
		shortDesc: "Hits adjacent Pokemon. The user faints.", 
		pp: 5,
		priority: 0,
		flags: {protect: 1, mirror: 1},
		onTryHit(target, source) {
			if (source?.hasAbility('bombexpert')) {
				this.damage(Math.round(source.maxhp * 0.75), source, source, this.dex.conditions.get('Mind Blown'), true);
			} else if (!source?.hasAbility('bombexpert')) {
				this.damage(Math.round(source.maxhp), source, source, this.dex.conditions.get('Mind Blown'), true);
			}
		},
		secondary: null,
		target: "allAdjacent",
		type: "Ice",
		contestType: "Beautiful",
	},
	boulderbite: {
		accuracy: 90,
		basePower: 90,
		category: "Physical",
		name: "Boulder Bite",
		shortDesc: "30% chance to flinch the target.",
		pp: 10,
		priority: 0,
		flags: {bite: 1, contact: 1, protect: 1, mirror: 1},
		secondary: {
			chance: 30,
			volatileStatus: 'flinch',
		},
		target: "normal",
		type: "Rock",
	},
	cursedchomp: {
		accuracy: 95,
		basePower: 75,
		category: "Special",
		name: "Cursed Chomp",
		shortDesc: "20% chance to lower the target's speed.",
		pp: 15,
		priority: 0,
		flags: {bite: 1, protect: 1, mirror: 1},
		secondary: {
			chance: 30,
			boosts: {
				spe: -1,
			},
		},
		target: "normal",
		type: "Ghost",
	},
	seasurge: {
		accuracy: 100,
		basePower: 120,
		category: "Physical",
		name: "Sea Surge",
		shortDesc: "Has 33% recoil. Sea Surge is a cooler name than Wave Crash fuck you gamefreak.",
		pp: 15,
		priority: 0,
		flags: {contact: 1, protect: 1, mirror: 1, distance: 1},
		recoil: [33, 100],
		secondary: null,
		target: "any",
		type: "Water",
	},
	frigidbreeze: {
		accuracy: 85,
		basePower: 0,
		category: "Status",
		name: "Frigid Breeze",
		shortDesc: "Gives the target Frostbite.",
		pp: 15,
		priority: 0,
		flags: {protect: 1, reflectable: 1, mirror: 1},
		status: 'fbt',
		secondary: null,
		target: "normal",
		type: "Ice",
	},
	freeziewind: {
		accuracy: 30,
		basePower: 0,
		category: "Status",
		name: "Freezie Wind",
		shortDesc: "Freezes the target.",
		pp: 10,
		priority: 0,
		flags: {protect: 1, reflectable: 1, mirror: 1},
		status: 'frz',
		secondary: null,
		target: "normal",
		type: "Ice",
	},
	corruptclaws: {
		accuracy: 90,
		basePower: 80,
		category: "Physical",
		name: "Corrupt Claws",
		shortDesc: "30% chance to increase Attack.",
		pp: 15,
		priority: 0,
		flags: {slicing: 1, contact: 1, protect: 1, mirror: 1},
		secondary: {
			chance: 30,
			self: {
				boosts: {
					atk: 1,
				},
			},
		},
		target: "normal",
		type: "Dark",
		contestType: "Cool",
	},
	icebubble: {
		accuracy: 100,
		basePower: 80,
		category: "Special",
		name: "Ice Bubble",
		shortDesc: "30% chance to cause Frostbite to the target.",
		pp: 15,
		priority: 0,
		flags: {protect: 1, mirror: 1},
		secondary: {
			chance: 30,
			status: 'fbt',
		},
		target: "normal",
		type: "Water",
	},
	snowsquall: {
		accuracy: 95,
		basePower: 60,
		category: "Special",
		name: "Snow Squall",
		shortDesc: "Sets up snow.",
		pp: 10,
		priority: 0,
		flags: {protect: 1, mirror: 1},
		self: {
			weather: 'Snow',
		},
		target: "normal",
		type: "Ice",
	},
	snowslash: {
		accuracy: 100,
		basePower: 80,
		category: "Physical",
		name: "Snow Slash",
		shortDesc: "20% chance to cause frostbite.",
		pp: 20,
		priority: 0,
		flags: {contact: 1, protect: 1, mirror: 1, slicing: 1},
		secondary: {
			chance: 20,
			status: 'fbt',
		},
		target: "normal",
		type: "Ice",
	},
	moltenvenom: {
		accuracy: 100,
		basePower: 70,
		category: "Special",
		name: "Molten Venom",
		shortDesc: "Super-effective against Steel. 20% chance to burn the target.",
		pp: 15,
		priority: 0,
		flags: {contact: 1, protect: 1, mirror: 1},
		onEffectiveness(typeMod, target, type) {
			if (type === 'Steel') return 1;
		},
		secondary: {
			chance: 20,
			status: 'brn',
		},
		target: "normal",
		type: "Poison",
	},
	
	permafrost: {
		accuracy: 100,
		basePower: 80,
		category: "Special",
		name: "Permafrost",
		shortDesc: "30% chance to cause Frostbite to the target.",
		pp: 15,
		priority: 0,
		flags: {protect: 1, mirror: 1},
		secondary: {
			chance: 30,
			status: 'fbt',
		},
		target: "normal",
		type: "Ground",
	},
	dustdevil: {
		accuracy: 95,
		basePower: 60,
		category: "Special",
		name: "Dust Devil",
		id: "dustdevil",
		shortDesc: "Sets up a sandstorm.",
		type: "Ground",
		pp: 10,
		priority: 0,
		flags: {protect: 1, mirror: 1},
		self: {
			weather: 'Sandstorm',
		},
		target: "normal",
	},
	sunsquall: {
		accuracy: 95,
		basePower: 60,
		category: "Special",
		name: "Solar Storm",
		id: "sunsquall",
		shortDesc: "Sets up harsh sunlight.",
		type: "Fire",
		pp: 10,
		priority: 0,
		flags: {protect: 1, mirror: 1},
		self: {
			onHit(source) {
				this.field.setWeather('sunnyday');
				this.field.weatherState.duration = 3;
			},
		},
		target: "normal",
	},
	magiccircle: {
		accuracy: true,
		basePower: 0,
		category: "Status",
		name: "Magic Circle",
		id: "magiccircle",
		shortDesc: "Takes 2 turns to charge. Creates a magic circle which increases Sp. Atk on switch in.",
		pp: 10,
		priority: 0,
		flags: {charge: 1, snatch: 1},
		onTryMove(attacker, defender, move) {
				if (attacker.removeVolatile(move.id)) {
					return;
				}
				this.add('-prepare', attacker, move.name);
				if (!this.runEvent('ChargeMove', attacker, defender, move)) {
					return;
				}
				attacker.addVolatile('twoturnmove', defender);
				return null;
			},
		sideCondition: 'magiccircle',
		condition: {
			onStart(side) {
				this.add('-sidestart', side, 'move: Magic Circle');
			},
			onSwitchIn(pokemon) {
				this.add('-activate', pokemon, 'move: Magic Circle');
				this.boost({spa: +1}, pokemon, this.effectState.source, this.dex.conditions.getActiveMove('magiccircle'));
			},
		},
		secondary: null,
		target: "allySide",
		type: "Psychic",
	},
	swindle: {
		accuracy: 100,
		basePower: 80,
		category: "Special",
		name: "Swindle",
		shortDesc: "Power is multiplied by 1.5x if user is statused.",
		pp: 20,
		priority: 0,
		flags: {protect: 1, mirror: 1},
		onBasePower(basePower, pokemon) {
			if (pokemon.status && pokemon.status !== 'slp') {
				return this.chainModify(1.5);
			}
		},
		secondary: null,
		target: "normal",
		type: "Normal",
		contestType: "Cute",
	},
	facade: {
		num: 263,
		accuracy: 100,
		basePower: 80,
		category: "Physical",
		name: "Facade",
		shortDesc: "Power is multiplied by 1.5x if user is statused.",
		pp: 20,
		priority: 0,
		flags: {contact: 1, protect: 1, mirror: 1},
		onBasePower(basePower, pokemon) {
			if (pokemon.status && pokemon.status !== 'slp') {
				return this.chainModify(1.5);
			}
		},
		secondary: null,
		target: "normal",
		type: "Normal",
		contestType: "Cute",
	},
	
};
