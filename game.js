"use strict";

/* Eternal Arena V2 Full Game Script
   Complete standalone browser game logic:
   - Campaign
   - Free Battle 1v1 to 5v5
   - Unlocks/save
   - JRPG side-view battlefield
   - Command menu + skills + target selection
   - AI, status effects, focus, ultimates
   - matchup hints and role counters
*/

const EMBEDDED_WARRIORS = [{"id": "leonidas", "name": "Leonidas", "title": "King of Sparta", "faction": "Sparta", "role": "Tank Commander", "rarity": "Legendary", "cost": 4, "sprite": "assets/sprites/leonidas.png", "unlock": "start", "stats": {"hp": 1450, "attack": 86, "defense": 124, "speed": 45, "crit": 5, "resistance": 22, "morale": 92}, "passive": {"name": "Spartan King", "description": "When an ally drops below 35% HP, Leonidas gains Guard and +15 defense for 1 turn."}, "moves": ["spear_thrust", "shield_wall", "hold_the_line", "thermopylae_stand", "this_is_sparta"], "specialMove": "this_is_sparta", "superSprite": "assets/sprites/leonidas_super.png", "spriteFacing": "left", "superSpriteFacing": "left"}, {"id": "musashi", "name": "Miyamoto Musashi", "title": "Two-Sword Ronin", "faction": "Samurai", "role": "Duelist", "rarity": "Legendary", "cost": 4, "sprite": "assets/sprites/musashi.png", "unlock": "campaign_6", "stats": {"hp": 980, "attack": 124, "defense": 62, "speed": 91, "crit": 18, "resistance": 12, "morale": 78}, "passive": {"name": "Empty Mind", "description": "+10% crit against isolated or marked targets."}, "moves": ["katana_slash", "two_sword_cut", "empty_mind", "book_of_five_rings"], "spriteFacing": "right"}, {"id": "vlad", "name": "Vlad the Impaler", "title": "Prince of Terror", "faction": "Wallachia", "role": "Fear Control", "rarity": "Epic", "cost": 3, "sprite": "assets/sprites/vlad.png", "unlock": "campaign_11", "stats": {"hp": 1120, "attack": 101, "defense": 78, "speed": 67, "crit": 11, "resistance": 18, "morale": 84}, "passive": {"name": "Dread Lord", "description": "Enemies damaged by Vlad lose 6 morale."}, "moves": ["impaling_strike", "terror_aura", "cruel_example", "forest_of_stakes"], "spriteFacing": "right"}, {"id": "joan", "name": "Joan of Arc", "title": "Saint of the Banner", "faction": "France", "role": "Support Commander", "rarity": "Legendary", "cost": 4, "sprite": "assets/sprites/joan.png", "unlock": "campaign_4", "stats": {"hp": 1040, "attack": 72, "defense": 78, "speed": 58, "crit": 4, "resistance": 30, "morale": 98}, "passive": {"name": "Inspired Faith", "description": "All allies begin battle with +8 morale."}, "moves": ["banner_strike", "divine_rally", "martyrs_resolve", "saints_flame"], "spriteFacing": "right"}, {"id": "viking_berserker", "name": "Viking Berserker", "title": "Rage of the North", "faction": "Vikings", "role": "Berserker", "rarity": "Rare", "cost": 2, "sprite": "assets/sprites/viking_berserker.png", "unlock": "campaign_1", "stats": {"hp": 1180, "attack": 118, "defense": 56, "speed": 64, "crit": 14, "resistance": 10, "morale": 70}, "passive": {"name": "Blood Rage", "description": "+20 attack while below 50% HP, but -10 defense."}, "moves": ["rage_strike", "blood_frenzy", "reckless_charge", "last_breath"], "spriteFacing": "right"}, {"id": "mongol_archer", "name": "Mongol Archer", "title": "Steppe Predator", "faction": "Mongol Empire", "role": "Marksman", "rarity": "Rare", "cost": 2, "sprite": "assets/sprites/mongol_archer.png", "unlock": "campaign_2", "stats": {"hp": 860, "attack": 94, "defense": 46, "speed": 88, "crit": 16, "resistance": 8, "morale": 74}, "passive": {"name": "Horse Archer", "description": "Can target back row and gains +10 speed after using a ranged skill."}, "moves": ["quick_shot", "piercing_shot", "crippling_arrow", "arrow_storm"], "spriteFacing": "right"}, {"id": "roman_centurion", "name": "Roman Centurion", "title": "Iron Discipline", "faction": "Rome", "role": "Vanguard", "rarity": "Rare", "cost": 2, "sprite": "assets/sprites/roman_centurion.png", "unlock": "campaign_3", "stats": {"hp": 1260, "attack": 82, "defense": 105, "speed": 48, "crit": 5, "resistance": 18, "morale": 88}, "passive": {"name": "Legion Discipline", "description": "Takes 10% less damage while morale is above 60."}, "moves": ["gladius_cut", "testudo", "shield_bash", "legion_command"], "spriteFacing": "right"}, {"id": "anubis_warrior", "name": "Anubis Warrior", "title": "Jackal of the Dead", "faction": "Egyptian Myth", "role": "Mystic Bruiser", "rarity": "Mythic", "cost": 5, "sprite": "assets/sprites/anubis_warrior.png", "unlock": "campaign_23", "stats": {"hp": 1300, "attack": 112, "defense": 86, "speed": 61, "crit": 9, "resistance": 36, "morale": 90}, "passive": {"name": "Soul Weigher", "description": "Heals for 15% of damage dealt to cursed enemies."}, "moves": ["khopesh_slash", "soul_drain", "weigh_the_heart", "judgement_of_anubis"], "spriteFacing": "right"}, {"id": "valkyrie", "name": "Valkyrie", "title": "Chooser of the Fallen", "faction": "Norse Myth", "role": "Support Fighter", "rarity": "Mythic", "cost": 5, "sprite": "assets/sprites/valkyrie.png", "unlock": "campaign_5", "stats": {"hp": 1120, "attack": 92, "defense": 82, "speed": 76, "crit": 8, "resistance": 30, "morale": 96}, "passive": {"name": "Valhalla Oath", "description": "First ally to fall returns as a spirit for one extra action."}, "moves": ["spear_of_asgard", "choose_the_fallen", "winged_strike", "valhalla_call"], "spriteFacing": "right"}, {"id": "achilles", "name": "Achilles", "title": "Hero of Troy", "faction": "Greek Myth", "role": "Mythic Duelist", "rarity": "Mythic", "cost": 5, "sprite": "assets/sprites/achilles.png", "unlock": "campaign_7", "stats": {"hp": 1160, "attack": 136, "defense": 72, "speed": 84, "crit": 20, "resistance": 12, "morale": 82}, "passive": {"name": "Heel of Fate", "description": "Critical hits against Achilles deal +25% damage, but he gains +12 focus when crit. Godlike Assault is now his Special Move."}, "moves": ["heroic_slash", "spear_lunge", "wrath_of_achilles", "immortal_resolve"], "spriteFacing": "right", "specialMove": "godlike_assault"}, {"id": "minotaur_gladiator", "name": "Minotaur Gladiator", "title": "Labyrinth Juggernaut", "faction": "Greek Myth", "role": "Tank Berserker", "rarity": "Legendary", "cost": 4, "sprite": "assets/sprites/minotaur_gladiator.png", "unlock": "shop_1500", "stats": {"hp": 1360, "attack": 118, "defense": 96, "speed": 52, "crit": 9, "resistance": 18, "morale": 92}, "passive": {"name": "Bull Rush", "description": "Shop cost 1500 coins. Also unlockable through the Labyrinth Gladiator chapter. When you move onto an enemy with open space behind them, the Minotaur shoves them 1 tile away and deals a little damage. Shield Up blocks the first incoming hit, Blood Rage grants +15% attack power, and his Special throws the axe at range."}, "moves": ["minotaur_axe_cleave", "minotaur_shield_up", "minotaur_blood_rage", "minotaur_recover"], "specialMove": "minotaur_axe_throw", "spriteFacing": "right", "shopCost": 1500}, {"id": "baldwin_iv", "name": "Baldwin IV", "title": "The Leper King", "faction": "Crusader Kingdom", "role": "Holy Commander", "rarity": "Legendary", "cost": 4, "sprite": "assets/sprites/baldwin_iv.png", "unlock": "campaign_8", "stats": {"hp": 1120, "attack": 92, "defense": 102, "speed": 52, "crit": 7, "resistance": 34, "morale": 100}, "passive": {"name": "Leper King's Resolve", "description": "Immune to Fear. Once per battle below 40% HP, allies gain morale and resistance."}, "moves": ["royal_sword", "kings_command", "white_banner_guard", "battle_of_montgisard", "holy_guard_of_jerusalem"], "spriteFacing": "right", "specialMove": "holy_guard_of_jerusalem"}, {"id": "grutte_pier", "name": "Grutte Pier", "title": "Giant of Kimswerd", "faction": "Frisia", "role": "Vanguard Berserker", "rarity": "Legendary", "cost": 4, "sprite": "assets/sprites/grutte_pier.png", "unlock": "campaign_9", "stats": {"hp": 1540, "attack": 118, "defense": 92, "speed": 42, "crit": 8, "resistance": 16, "morale": 86}, "passive": {"name": "Frisian Giant", "description": "First time below 50% HP, Grutte Pier gains Rage and Guard for 2 turns."}, "moves": ["giants_cleave", "frisian_roar", "breaker_swing", "colossus_of_kimswerd"], "spriteFacing": "right"}, {"id": "napoleon", "name": "Napoleon", "title": "Emperor of the French", "faction": "France", "role": "Mounted Commander", "rarity": "Legendary", "cost": 4, "sprite": "assets/sprites/napoleon.png", "unlock": "campaign_10", "stats": {"hp": 1080, "attack": 98, "defense": 76, "speed": 72, "crit": 7, "resistance": 24, "morale": 98}, "passive": {"name": "Imperial Momentum", "description": "At battle start allies gain +8 morale. In round 1 Napoleon gains +18 speed."}, "moves": ["imperial_sabre", "cavalry_charge", "imperial_command", "grand_battery"], "spriteFacing": "left"}, {"id": "king_arthur", "name": "King Arthur", "title": "Once and Future King", "faction": "Camelot", "role": "Holy Tank Commander", "rarity": "Mythic", "cost": 5, "sprite": "assets/sprites/king_arthur.png", "unlock": "campaign_18", "stats": {"hp": 1420, "attack": 108, "defense": 116, "speed": 50, "crit": 8, "resistance": 34, "morale": 98}, "passive": {"name": "Camelot's Crown", "description": "At battle start allies gain +6 morale. Arthur takes 8% less damage while guarded."}, "moves": ["excalibur_cut", "round_table_oath", "lion_shield", "once_and_future_king"], "spriteFacing": "right"}, {"id": "james_bond", "name": "James Bond", "title": "Agent 007", "faction": "MI6", "role": "Spy Marksman", "rarity": "Legendary", "cost": 4, "sprite": "assets/sprites/james_bond.png", "unlock": "campaign_15", "stats": {"hp": 920, "attack": 116, "defense": 58, "speed": 96, "crit": 22, "resistance": 18, "morale": 86}, "passive": {"name": "Double-O Agent", "description": "+10% crit against slowed, feared, or vulnerable targets."}, "moves": ["silenced_pistol", "spy_gadget", "shaken_not_stirred", "license_to_kill"], "spriteFacing": "right"}, {"id": "adrian_carton_de_wiart", "name": "Adrian Carton de Wiart", "title": "The Unkillable Soldier", "faction": "Britain", "role": "War Veteran Gunslinger", "rarity": "Mythic", "cost": 4, "sprite": "assets/sprites/adrian_carton_de_wiart.png", "unlock": "campaign_15a", "stats": {"hp": 1180, "attack": 118, "defense": 84, "speed": 68, "crit": 11, "resistance": 32, "morale": 100}, "passive": {"name": "No Man Can Kill Me", "description": "Adrian takes 10% less damage below 50% HP and gains extra Focus when hit. Special: Unkillable Charge grants temporary damage reduction and ends with a revolver burst."}, "moves": ["webley_shot", "bayonet_advance", "iron_will", "suppressive_barrage"], "specialMove": "unkillable_charge", "spriteFacing": "right"}, {"id": "victor_wembanyama", "name": "Victor Wembanyama", "title": "Alien of the Paint", "faction": "NBA", "role": "Court Giant Duelist", "rarity": "Mythic", "cost": 5, "sprite": "assets/sprites/victor_wembanyama.png", "unlock": "campaign_15b", "stats": {"hp": 1080, "attack": 118, "defense": 74, "speed": 90, "crit": 14, "resistance": 28, "morale": 100}, "passive": {"name": "Full Court Reach", "description": "Victor can move anywhere on the field. Flying Dunk jumps to the target and returns. Hellfire Basketball roots the target so it cannot move for 1 turn."}, "moves": ["wemby_long_reach", "wemby_flying_dunk", "wemby_dribble_evasion", "wemby_recover"], "specialMove": "wemby_hellfire_basketball", "spriteFacing": "right"}, {"id": "the_pope", "name": "The Pope", "title": "Holy Pontiff", "faction": "Vatican", "role": "Support Commander", "rarity": "Mythic", "cost": 5, "sprite": "assets/sprites/the_pope.png", "unlock": "campaign_17", "stats": {"hp": 1080, "attack": 62, "defense": 88, "speed": 44, "crit": 3, "resistance": 48, "morale": 100}, "passive": {"name": "Sacred Authority", "description": "Allies with Resist heal a small amount at the start of their turn. Special: Holy Healing Rain restores all allies to 100% HP."}, "moves": ["papal_staff", "apostolic_blessing", "sanctuary", "divine_decree"], "spriteFacing": "right", "specialMove": "holy_healing_rain"}, {"id": "dark_sinterklaas", "name": "Dark Sinterklaas", "title": "Crimson Saint", "faction": "Dark Holiday", "role": "Summoner Healer", "rarity": "Mythic", "cost": 5, "sprite": "assets/sprites/dark_sinterklaas.png", "unlock": "campaign_17b", "stats": {"hp": 1120, "attack": 96, "defense": 92, "speed": 54, "crit": 6, "resistance": 48, "morale": 100}, "passive": {"name": "Crimson Procession", "description": "Can move the whole vertical column and up to 4 horizontal blocks. Special summons three Shadow Pieten who fight and move until they die."}, "moves": ["sinter_staff_bolt", "sinter_dark_blessing", "sinter_cane_strike", "sinter_nightmare_bell"], "specialMove": "summon_shadow_pieten", "spriteFacing": "right"}, {"id": "the_hooligan", "name": "The Hooligan", "title": "Street Enforcer", "faction": "Underground", "role": "Berserker Control", "rarity": "Epic", "cost": 3, "sprite": "assets/sprites/the_hooligan.png", "unlock": "campaign_14", "stats": {"hp": 1240, "attack": 112, "defense": 66, "speed": 70, "crit": 12, "resistance": 10, "morale": 74}, "passive": {"name": "No Rules", "description": "+12 attack against stunned, feared, or vulnerable targets."}, "moves": ["bat_swing", "street_charge", "crowd_intimidation", "riot_breaker"], "spriteFacing": "right"}, {"id": "battle_priest", "name": "Battle Priest", "title": "Warrior of the Sacred Flame", "faction": "Holy Order", "role": "Healer Commander", "rarity": "Legendary", "cost": 4, "sprite": "assets/sprites/battle_priest.png", "unlock": "campaign_16", "stats": {"hp": 1160, "attack": 74, "defense": 92, "speed": 46, "crit": 4, "resistance": 44, "morale": 100}, "passive": {"name": "Field Chaplain", "description": "Healing skills also grant extra morale. Allies with Guard receive small healing at turn start."}, "moves": ["blessed_mace", "battlefield_heal", "war_prayer", "divine_sanctum"], "spriteFacing": "right"}, {"id": "ronin", "name": "Ronin", "title": "Masterless Blade", "faction": "Samurai", "role": "Duelist Assassin", "rarity": "Legendary", "cost": 4, "sprite": "assets/sprites/ronin.png", "unlock": "campaign_13", "stats": {"hp": 990, "attack": 128, "defense": 60, "speed": 94, "crit": 20, "resistance": 14, "morale": 80}, "passive": {"name": "Masterless Fury", "description": "+12% damage against bleeding or feared targets."}, "moves": ["ronin_cut", "oni_mask_feint", "blood_moon_slash", "masterless_execution"], "spriteFacing": "right"}, {"id": "plague_doctor", "name": "Plague Doctor", "title": "Miasma Surgeon", "faction": "Black Apothecary", "role": "Poison Control", "rarity": "Epic", "cost": 3, "sprite": "assets/sprites/plague_doctor.png", "unlock": "campaign_12", "stats": {"hp": 980, "attack": 78, "defense": 70, "speed": 62, "crit": 5, "resistance": 38, "morale": 72}, "passive": {"name": "Contagion", "description": "Poisoned enemies also lose morale at the start of their turn."}, "moves": ["cane_strike", "toxic_vial", "miasma_cloud", "black_death"], "spriteFacing": "right"}, {"id": "attila_the_hun", "name": "Atilla the Hun", "title": "Scourge of the Steppe", "faction": "Hunnic Horde", "role": "Commander Berserker", "rarity": "Legendary", "cost": 4, "sprite": "assets/sprites/attila_the_hun.png", "unlock": "campaign_22", "stats": {"hp": 1390, "attack": 118, "defense": 86, "speed": 66, "crit": 11, "resistance": 22, "morale": 96}, "passive": {"name": "Scourge Instinct", "description": "+12% damage against wounded enemies below 50% HP."}, "moves": ["steppe_cleave", "hun_war_spear", "horde_command", "scourge_charge"], "spriteFacing": "right"}, {"id": "cleopatra", "name": "Cleopatra", "title": "Queen of the Nile", "faction": "Egypt", "role": "Mystic Commander", "rarity": "Legendary", "cost": 4, "sprite": "assets/sprites/cleopatra.png", "unlock": "campaign_19", "stats": {"hp": 1040, "attack": 88, "defense": 74, "speed": 72, "crit": 8, "resistance": 42, "morale": 100}, "passive": {"name": "Queen's Presence", "description": "While the Sphinx is alive, Cleopatra gains Guard and heals at the start of her turn."}, "moves": ["royal_khopesh", "asp_venom", "queen_decree", "nile_charm"], "specialMove": "summon_the_sphinx", "spriteFacing": "right"}, {"id": "african_tribe_warrior", "name": "African Tribe Warrior", "title": "Spear of the Savanna", "faction": "Savanna Tribe", "role": "Vanguard Commander", "rarity": "Legendary", "cost": 4, "sprite": "assets/sprites/african_tribe_warrior.png", "unlock": "campaign_20", "stats": {"hp": 1280, "attack": 106, "defense": 92, "speed": 68, "crit": 10, "resistance": 24, "morale": 96}, "passive": {"name": "Pride Bond", "description": "While the Lion King is alive, this warrior gains Guard and +10 morale at turn start."}, "moves": ["ancestral_spear", "shield_of_the_savanna", "tribal_war_cry", "lion_spear_lunge"], "specialMove": "summon_the_lion_king", "spriteFacing": "right"}, {"id": "cyclops_titan", "name": "The Cyclops", "title": "Raid Titan", "faction": "Titan", "role": "Titan Boss", "rarity": "Mythic", "cost": 9, "sprite": "assets/sprites/cyclops_titan.png", "unlock": "hidden", "stats": {"hp": 6200, "attack": 160, "defense": 145, "speed": 24, "crit": 4, "resistance": 35, "morale": 100}, "passive": {"name": "Colossal Body", "description": "Raid boss. Huge HP, attack and defense, but slow and limited reach."}, "moves": ["titan_chain_slam", "titan_ground_breaker", "titan_roar", "titan_rage", "titan_colossal_crush"], "spriteFacing": "right", "hidden": true, "isTitan": true}, {"id": "fire_dragon_titan", "name": "The Fire Dragon Titan", "title": "Raid Titan", "faction": "Titan", "role": "Fire Titan Boss", "rarity": "Mythic", "cost": 10, "sprite": "assets/sprites/fire_dragon_titan.png", "unlock": "hidden", "stats": {"hp": 6900, "attack": 172, "defense": 132, "speed": 30, "crit": 6, "resistance": 42, "morale": 100}, "passive": {"name": "Molten Scales", "description": "Raid boss. Massive HP and fire damage. Slow and limited reach, but punishes front-line stacking with burn."}, "moves": ["dragon_molten_claw", "dragon_fire_breath", "dragon_wing_quake", "dragon_inferno_roar", "dragon_apocalypse_flame"], "spriteFacing": "right", "hidden": true, "isTitan": true, "titanKind": "fire"}, {"id": "ground_dragon_titan", "name": "The Ground Dragon", "title": "Raid Titan", "faction": "Titan", "role": "Earth Titan Boss", "rarity": "Mythic", "cost": 10, "sprite": "assets/sprites/ground_dragon_titan.png", "unlock": "hidden", "stats": {"hp": 7300, "attack": 168, "defense": 154, "speed": 22, "crit": 5, "resistance": 46, "morale": 100}, "passive": {"name": "Bedrock Scales", "description": "Raid boss. Enormous HP and defense, with crystal-earth attacks that stun, slow and punish front-line pressure. Very slow and limited reach."}, "moves": ["ground_dragon_boulder_bite", "ground_dragon_tectonic_crash", "ground_dragon_crystal_spikes", "ground_dragon_earth_roar", "ground_dragon_worldsplitter"], "spriteFacing": "right", "hidden": true, "isTitan": true, "titanKind": "earth"}, {"id": "lucifer_demon_king", "name": "Lucifer the Demon King", "title": "Lord of the Infernal Throne", "faction": "Hell", "role": "Demon King", "rarity": "Mythic", "cost": 5, "sprite": "assets/sprites/lucifer_demon_king.png", "unlock": "campaign_24", "stats": {"hp": 1320, "attack": 126, "defense": 92, "speed": 78, "crit": 14, "resistance": 36, "morale": 100}, "passive": {"name": "Infernal Majesty", "description": "Burning enemies suffer -8 morale, and Lucifer gains +8 focus whenever he inflicts Fear or Burn."}, "moves": ["hellfire_blade", "abyssal_chains", "dread_coronation", "throne_of_hell"], "spriteFacing": "right"}, {"id": "the_amazon_girl", "name": "The Amazon Girl", "title": "Queen of the Wild Hunt", "faction": "Amazon Tribe", "role": "Huntress Duelist", "rarity": "Legendary", "cost": 4, "sprite": "assets/sprites/the_amazon_girl.png", "unlock": "campaign_21", "stats": {"hp": 980, "attack": 116, "defense": 66, "speed": 104, "crit": 16, "resistance": 18, "morale": 100}, "passive": {"name": "Wild Hunt", "description": "Against marked or bleeding enemies, Amazon Girl gains +10 crit and +8 speed."}, "moves": ["amazon_axe_cleave", "hunter_bow_shot", "predator_dash", "queen_of_the_wild"], "spriteFacing": "right"}, {"id": "merlin", "name": "Merlin", "title": "Archmage of the Crystal Storm", "faction": "Camelot", "role": "Long Range Mystic Healer", "rarity": "Mythic", "cost": 5, "sprite": "assets/sprites/merlin.png", "unlock": "shop_1000", "stats": {"hp": 980, "attack": 112, "defense": 62, "speed": 74, "crit": 10, "resistance": 48, "morale": 100}, "passive": {"name": "Arcane Wisdom", "description": "Long range magic user. Healing and magic attacks build focus quickly."}, "moves": ["arcane_bolt", "crystal_chain_lightning", "wizard_mend", "arcane_barrier"], "specialMove": "thunder_strike", "spriteFacing": "right", "shopCost": 1000}, {"id": "amelia_earhart", "name": "Amelia Earhart", "title": "Sky Ace", "faction": "Aviators", "role": "Fast Ranged Support", "rarity": "Mythic", "cost": 4, "sprite": "assets/sprites/amelia_earhart.png", "unlock": "shop_1000", "stats": {"hp": 880, "attack": 104, "defense": 54, "speed": 92, "crit": 11, "resistance": 42, "morale": 100}, "passive": {"name": "Aerial Instinct", "description": "Amelia has increased speed and a chance to dodge incoming attacks."}, "moves": ["flare_gun_shot", "warning_flash", "navigator_support", "tailwind_signal"], "specialMove": "sky_raid", "spriteFacing": "right", "shopCost": 1000}, {"id": "evil_gnome", "name": "Evil Gnome", "title": "Dark Crystal Trickster", "faction": "Dark Forest", "role": "Shop Mystic Healer", "rarity": "Mythic", "cost": 5, "sprite": "assets/sprites/evil_gnome.png", "unlock": "shop_1500", "stats": {"hp": 920, "attack": 108, "defense": 64, "speed": 86, "crit": 13, "resistance": 46, "morale": 100}, "passive": {"name": "Sneaky Little Menace", "description": "Can hide to dodge the next incoming attack. Special transforms him into a larger war form with +50% attack and defense."}, "moves": ["gnome_staff_bolt", "gnome_shadow_mend", "gnome_hide", "gnome_bite"], "specialMove": "gnome_dark_transformation", "superSprite": "assets/sprites/evil_gnome_transformed.png", "superSpriteFacing": "right", "spriteFacing": "right", "shopCost": 1500}, {"id": "medusa", "name": "Medusa", "title": "Gorgon Queen", "faction": "Greek Myth", "role": "Shop Control Duelist", "rarity": "Mythic", "cost": 5, "sprite": "assets/sprites/medusa.png", "unlock": "shop_1800", "stats": {"hp": 1040, "attack": 112, "defense": 78, "speed": 78, "crit": 12, "resistance": 44, "morale": 100}, "passive": {"name": "Gorgon Blood", "description": "Medusa controls tempo with poison, guard, stun and petrify. Her Special turns a chosen target to stone for 2 turns."}, "moves": ["medusa_snake_bite", "medusa_venom_bolt", "medusa_gorgon_guard", "medusa_hypnotic_gaze"], "specialMove": "medusa_petrifying_gaze", "spriteFacing": "right", "shopCost": 1800}];
const EMBEDDED_MOVES = {"spear_thrust": {"name": "Spear Thrust", "kind": "damage", "target": "enemy", "power": 105, "type": "pierce", "focus": 12, "cooldown": 0, "desc": "Reliable pierce damage."}, "shield_wall": {"name": "Shield Wall", "kind": "buff", "target": "all_allies", "status": "guard", "amount": 30, "duration": 2, "focus": 15, "cooldown": 3, "desc": "All allies gain Guard."}, "hold_the_line": {"name": "Hold the Line", "kind": "taunt", "target": "self", "status": "taunt", "amount": 35, "duration": 2, "focus": 18, "cooldown": 3, "desc": "Taunt enemies and gain defense."}, "thermopylae_stand": {"name": "Thermopylae Stand", "kind": "ultimate", "target": "self", "status": "counter", "amount": 45, "duration": 3, "cost": 100, "focus": 0, "cooldown": 0, "desc": "Massive defense and counter stance."}, "katana_slash": {"name": "Katana Slash", "kind": "damage", "target": "enemy", "power": 95, "type": "slash", "focus": 14, "cooldown": 0, "desc": "Fast slash damage."}, "two_sword_cut": {"name": "Two-Sword Cut", "kind": "multi_damage", "target": "enemy", "hits": 2, "power": 78, "type": "slash", "focus": 16, "cooldown": 2, "desc": "Two precise hits."}, "empty_mind": {"name": "Empty Mind", "kind": "buff", "target": "self", "status": "focus", "amount": 25, "duration": 2, "focus": 22, "cooldown": 3, "desc": "Gain crit and evasion rhythm."}, "book_of_five_rings": {"name": "Book of Five Rings", "kind": "ultimate", "target": "enemy", "power": 245, "type": "slash", "cost": 100, "focus": 0, "cooldown": 0, "desc": "Huge single target strike."}, "impaling_strike": {"name": "Impaling Strike", "kind": "damage_status", "target": "enemy", "power": 95, "type": "pierce", "status": "bleed", "amount": 55, "duration": 3, "focus": 14, "cooldown": 0, "desc": "Damage and bleed."}, "terror_aura": {"name": "Terror Aura", "kind": "debuff_all", "target": "all_enemies", "status": "fear", "amount": 22, "duration": 2, "focus": 18, "cooldown": 3, "desc": "All enemies lose morale and may falter."}, "cruel_example": {"name": "Cruel Example", "kind": "damage", "target": "enemy", "power": 145, "type": "shadow", "focus": 20, "cooldown": 2, "desc": "Heavy terror strike. Stronger on bleeding targets."}, "forest_of_stakes": {"name": "Forest of Stakes", "kind": "ultimate", "target": "enemy_front", "power": 170, "type": "pierce", "status": "fear", "amount": 30, "duration": 2, "cost": 100, "focus": 0, "cooldown": 0, "desc": "Crush the front row with fear."}, "banner_strike": {"name": "Banner Strike", "kind": "damage", "target": "enemy", "power": 88, "type": "holy", "focus": 14, "cooldown": 0, "desc": "Light holy strike."}, "divine_rally": {"name": "Divine Rally", "kind": "buff", "target": "all_allies", "status": "rally", "amount": 20, "duration": 2, "focus": 18, "cooldown": 3, "desc": "All allies gain attack and morale."}, "martyrs_resolve": {"name": "Martyr's Resolve", "kind": "heal", "target": "ally", "power": 230, "status": "resist", "amount": 20, "duration": 2, "focus": 22, "cooldown": 0, "desc": "Heal and resistance. Can be used every turn."}, "saints_flame": {"name": "Saint's Flame", "kind": "ultimate", "target": "all_allies", "power": 260, "status": "cleanse", "cost": 100, "focus": 0, "cooldown": 0, "desc": "Heal all and cleanse statuses."}, "rage_strike": {"name": "Rage Strike", "kind": "damage", "target": "enemy", "power": 120, "type": "slash", "focus": 15, "cooldown": 0, "desc": "Hard melee strike."}, "blood_frenzy": {"name": "Blood Frenzy", "kind": "buff", "target": "self", "status": "rage", "amount": 35, "duration": 3, "focus": 20, "cooldown": 3, "desc": "Gain attack, lose defense."}, "reckless_charge": {"name": "Reckless Charge", "kind": "damage_status", "target": "enemy", "power": 165, "type": "blunt", "status": "vulnerable", "amount": 20, "duration": 2, "focus": 18, "cooldown": 3, "desc": "Big damage but risky."}, "last_breath": {"name": "Last Breath", "kind": "ultimate", "target": "enemy", "power": 210, "type": "slash", "cost": 100, "focus": 0, "cooldown": 0, "desc": "Stronger when low HP."}, "quick_shot": {"name": "Quick Shot", "kind": "damage", "target": "enemy", "power": 92, "type": "pierce", "focus": 14, "cooldown": 0, "desc": "Fast ranged attack."}, "piercing_shot": {"name": "Piercing Shot", "kind": "damage", "target": "enemy", "power": 120, "type": "pierce", "focus": 17, "cooldown": 2, "desc": "Ignores part of defense."}, "crippling_arrow": {"name": "Crippling Arrow", "kind": "damage_status", "target": "enemy", "power": 115, "type": "pierce", "status": "slow", "amount": 25, "duration": 2, "focus": 18, "cooldown": 3, "desc": "Damage and slow."}, "arrow_storm": {"name": "Arrow Storm", "kind": "ultimate", "target": "all_enemies", "power": 95, "type": "pierce", "cost": 100, "focus": 0, "cooldown": 0, "desc": "Volley against all enemies."}, "gladius_cut": {"name": "Gladius Cut", "kind": "damage", "target": "enemy", "power": 82, "type": "slash", "focus": 12, "cooldown": 0, "desc": "Reliable Roman strike."}, "testudo": {"name": "Testudo", "kind": "buff", "target": "all_allies", "status": "guard", "amount": 22, "duration": 2, "focus": 16, "cooldown": 3, "desc": "Formation defense."}, "shield_bash": {"name": "Shield Bash", "kind": "damage_status", "target": "enemy", "power": 105, "type": "blunt", "status": "stun", "amount": 30, "duration": 1, "focus": 18, "cooldown": 3, "desc": "Chance to stun."}, "legion_command": {"name": "Legion Command", "kind": "ultimate", "target": "all_allies", "status": "rally", "amount": 35, "duration": 3, "cost": 100, "focus": 0, "cooldown": 0, "desc": "Allies gain offense and discipline."}, "khopesh_slash": {"name": "Khopesh Slash", "kind": "damage", "target": "enemy", "power": 110, "type": "slash", "focus": 14, "cooldown": 0, "desc": "Curved blade attack."}, "soul_drain": {"name": "Soul Drain", "kind": "damage_status", "target": "enemy", "power": 115, "type": "shadow", "status": "curse", "amount": 20, "duration": 3, "focus": 20, "cooldown": 2, "desc": "Damage, curse, self heal."}, "weigh_the_heart": {"name": "Weigh the Heart", "kind": "debuff", "target": "enemy", "status": "curse", "amount": 35, "duration": 3, "focus": 22, "cooldown": 3, "desc": "Heavy curse and resistance break."}, "judgement_of_anubis": {"name": "Judgement of Anubis", "kind": "ultimate", "target": "enemy", "power": 235, "type": "shadow", "cost": 100, "focus": 0, "cooldown": 0, "desc": "Massive soul execution."}, "spear_of_asgard": {"name": "Spear of Asgard", "kind": "damage", "target": "enemy", "power": 105, "type": "holy", "focus": 14, "cooldown": 0, "desc": "Holy spear strike."}, "choose_the_fallen": {"name": "Choose the Fallen", "kind": "buff", "target": "ally", "status": "chosen", "amount": 1, "duration": 4, "focus": 22, "cooldown": 4, "desc": "Ally returns once as spirit."}, "winged_strike": {"name": "Winged Strike", "kind": "damage", "target": "enemy", "power": 140, "type": "pierce", "focus": 17, "cooldown": 2, "desc": "Can hit backline."}, "valhalla_call": {"name": "Valhalla Call", "kind": "ultimate", "target": "all_allies", "status": "valhalla", "amount": 30, "duration": 2, "cost": 100, "focus": 0, "cooldown": 0, "desc": "Revive weakest fallen or buff team."}, "heroic_slash": {"name": "Heroic Slash", "kind": "damage", "target": "enemy", "power": 125, "type": "slash", "focus": 15, "cooldown": 0, "desc": "High heroic damage."}, "spear_lunge": {"name": "Spear Lunge", "kind": "damage", "target": "enemy", "power": 160, "type": "pierce", "focus": 18, "cooldown": 2, "desc": "Armor-piercing lunge."}, "wrath_of_achilles": {"name": "Wrath of Achilles", "kind": "buff", "target": "self", "status": "rage", "amount": 30, "duration": 3, "focus": 22, "cooldown": 3, "desc": "Gain heroic rage."}, "godlike_assault": {"name": "Godlike Assault", "kind": "special_damage", "target": "enemy", "power": 250, "type": "slash", "cost": 100, "focus": 0, "cooldown": 0, "desc": "Special Attack. A heavy single-target heroic assault. Recharges after use when Achilles builds Focus again."}, "royal_sword": {"name": "Royal Sword", "kind": "damage", "target": "enemy", "power": 125, "type": "holy", "focus": 18, "cooldown": 0, "desc": "A disciplined holy sword strike. Stronger into cursed or feared enemies."}, "kings_command": {"name": "King's Command", "kind": "buff", "target": "all_allies", "status": "rally", "amount": 24, "duration": 2, "focus": 20, "cooldown": 3, "desc": "Baldwin commands the line. All allies gain attack and morale."}, "white_banner_guard": {"name": "White Banner Guard", "kind": "buff", "target": "all_allies", "status": "guard", "amount": 30, "duration": 2, "focus": 18, "cooldown": 3, "desc": "Raises the white banner. Allies gain Guard and fear pressure is broken."}, "battle_of_montgisard": {"name": "Battle of Montgisard", "kind": "ultimate", "target": "enemy", "power": 255, "type": "holy", "cost": 80, "focus": 0, "cooldown": 0, "desc": "A desperate holy charge across the field. Stronger when Baldwin is wounded."}, "this_is_sparta": {"name": "THIS IS SPARTA", "kind": "super_transform", "target": "self", "power": 155, "type": "blunt", "cost": 100, "focus": 0, "cooldown": 0, "desc": "Special Attack. Leonidas transforms into Super Leonidas, gains +50% core stats, then unleashes a shockwave."}, "holy_guard_of_jerusalem": {"name": "Holy Guard of Jerusalem", "kind": "summon_guard", "target": "self", "power": 0, "type": "holy", "cost": 100, "focus": 0, "cooldown": 0, "desc": "Special Attack. Baldwin summons 3 Templar Knights to defend him, intercept damage and assist his attacks."}, "giants_cleave": {"name": "Giant's Cleave", "kind": "damage", "target": "enemy", "power": 132, "type": "slash", "focus": 14, "cooldown": 0, "desc": "Heavy greatsword strike."}, "frisian_roar": {"name": "Frisian Roar", "kind": "taunt", "target": "self", "status": "guard", "amount": 24, "duration": 2, "focus": 16, "cooldown": 3, "desc": "Pier roars, drawing attacks and gaining Guard."}, "breaker_swing": {"name": "Breaker Swing", "kind": "damage_status", "target": "enemy", "power": 118, "type": "blunt", "status": "vulnerable", "amount": 18, "duration": 2, "focus": 16, "cooldown": 2, "desc": "A crushing sweep that leaves the target exposed."}, "colossus_of_kimswerd": {"name": "Colossus of Kimswerd", "kind": "ultimate", "target": "enemy_front", "power": 168, "type": "blunt", "status": "stun", "amount": 1, "duration": 1, "cost": 100, "focus": 0, "cooldown": 0, "desc": "Devastating front-line smash that can stun enemies."}, "imperial_sabre": {"name": "Imperial Sabre", "kind": "damage", "target": "enemy", "power": 108, "type": "slash", "focus": 12, "cooldown": 0, "desc": "Precise sabre attack."}, "cavalry_charge": {"name": "Cavalry Charge", "kind": "damage_status", "target": "enemy", "power": 136, "type": "pierce", "status": "slow", "amount": 20, "duration": 1, "focus": 16, "cooldown": 2, "desc": "Mounted charge in a straight line, slowing the target."}, "imperial_command": {"name": "Imperial Command", "kind": "buff", "target": "all_allies", "status": "rally", "amount": 18, "duration": 2, "focus": 18, "cooldown": 3, "desc": "All allies gain attack and morale."}, "grand_battery": {"name": "Grand Battery", "kind": "ultimate", "target": "all_enemies", "power": 92, "type": "blunt", "cost": 100, "focus": 0, "cooldown": 0, "desc": "Coordinated artillery strike against the whole enemy team."}, "excalibur_cut": {"name": "Excalibur Cut", "kind": "damage", "target": "enemy", "power": 128, "type": "holy", "focus": 14, "cooldown": 0, "desc": "A noble sword strike empowered by Excalibur."}, "round_table_oath": {"name": "Round Table Oath", "kind": "buff", "target": "all_allies", "status": "rally", "amount": 22, "duration": 2, "focus": 18, "cooldown": 3, "desc": "All allies gain morale and attack."}, "lion_shield": {"name": "Lion Shield", "kind": "buff", "target": "all_allies", "status": "guard", "amount": 24, "duration": 2, "focus": 16, "cooldown": 3, "desc": "Arthur raises the royal shield. Allies gain Guard."}, "once_and_future_king": {"name": "Once and Future King", "kind": "ultimate", "target": "enemy", "power": 265, "type": "holy", "cost": 100, "focus": 0, "cooldown": 0, "desc": "A legendary holy strike. Stronger when Arthur is wounded."}, "silenced_pistol": {"name": "Silenced Pistol", "kind": "damage", "target": "enemy", "power": 104, "type": "pierce", "focus": 12, "cooldown": 0, "desc": "Precise ranged shot."}, "spy_gadget": {"name": "Spy Gadget", "kind": "damage_status", "target": "enemy", "power": 96, "type": "shadow", "status": "slow", "amount": 22, "duration": 2, "focus": 16, "cooldown": 2, "desc": "A hidden gadget disrupts and slows the target."}, "shaken_not_stirred": {"name": "Shaken, Not Stirred", "kind": "buff", "target": "self", "status": "focus", "amount": 22, "duration": 2, "focus": 20, "cooldown": 3, "desc": "Bond regains composure and gains focus and crit pressure."}, "license_to_kill": {"name": "License to Kill", "kind": "ultimate", "target": "enemy", "power": 248, "type": "pierce", "cost": 100, "focus": 0, "cooldown": 0, "desc": "High precision execution shot."}, "papal_staff": {"name": "Papal Staff", "kind": "damage", "target": "enemy", "power": 88, "type": "holy", "focus": 12, "cooldown": 0, "desc": "A holy staff strike."}, "apostolic_blessing": {"name": "Apostolic Blessing", "kind": "heal", "target": "ally", "power": 245, "status": "resist", "amount": 18, "duration": 2, "focus": 20, "cooldown": 0, "desc": "Heal an ally and grant resistance. No cooldown."}, "sanctuary": {"name": "Sanctuary", "kind": "buff", "target": "all_allies", "status": "guard", "amount": 20, "duration": 2, "focus": 18, "cooldown": 3, "desc": "All allies gain Guard under holy protection."}, "divine_decree": {"name": "Divine Decree", "kind": "ultimate", "target": "all_allies", "status": "resist", "amount": 35, "duration": 3, "cost": 100, "focus": 0, "cooldown": 0, "desc": "A powerful blessing. Allies gain resistance and protection."}, "bat_swing": {"name": "Bat Swing", "kind": "damage", "target": "enemy", "power": 116, "type": "blunt", "focus": 14, "cooldown": 0, "desc": "Heavy club strike."}, "street_charge": {"name": "Street Charge", "kind": "damage_status", "target": "enemy", "power": 122, "type": "blunt", "status": "stun", "amount": 1, "duration": 1, "focus": 15, "cooldown": 3, "desc": "Wild charge with a chance to stun."}, "crowd_intimidation": {"name": "Crowd Intimidation", "kind": "damage_status", "target": "enemy", "power": 72, "type": "shadow", "status": "fear", "amount": 24, "duration": 2, "focus": 16, "cooldown": 2, "desc": "Intimidates the target with fear pressure."}, "riot_breaker": {"name": "Riot Breaker", "kind": "ultimate", "target": "enemy_front", "power": 158, "type": "blunt", "status": "vulnerable", "amount": 24, "duration": 2, "cost": 100, "focus": 0, "cooldown": 0, "desc": "Crushes the front line and leaves enemies vulnerable."}, "blessed_mace": {"name": "Blessed Mace", "kind": "damage", "target": "enemy", "power": 96, "type": "holy", "focus": 12, "cooldown": 0, "desc": "Holy melee strike."}, "battlefield_heal": {"name": "Battlefield Heal", "kind": "heal", "target": "ally", "power": 270, "status": "resist", "amount": 16, "duration": 2, "focus": 20, "cooldown": 0, "desc": "Strong single-target heal and resistance."}, "war_prayer": {"name": "War Prayer", "kind": "buff", "target": "all_allies", "status": "rally", "amount": 18, "duration": 2, "focus": 18, "cooldown": 3, "desc": "All allies gain attack and morale."}, "divine_sanctum": {"name": "Divine Sanctum", "kind": "ultimate", "target": "all_allies", "power": 185, "type": "holy", "status": "guard", "amount": 28, "duration": 3, "cost": 100, "focus": 0, "cooldown": 0, "desc": "Ultimate team heal with Guard."}, "ronin_cut": {"name": "Ronin Cut", "kind": "damage", "target": "enemy", "power": 118, "type": "slash", "focus": 13, "cooldown": 0, "desc": "Fast katana strike."}, "oni_mask_feint": {"name": "Oni Mask Feint", "kind": "damage_status", "target": "enemy", "power": 86, "type": "shadow", "status": "fear", "amount": 20, "duration": 2, "focus": 16, "cooldown": 2, "desc": "A deceptive strike that can inflict fear."}, "blood_moon_slash": {"name": "Blood Moon Slash", "kind": "damage_status", "target": "enemy", "power": 124, "type": "slash", "status": "bleed", "amount": 34, "duration": 3, "focus": 16, "cooldown": 2, "desc": "Bleeding katana cut."}, "masterless_execution": {"name": "Masterless Execution", "kind": "ultimate", "target": "enemy", "power": 252, "type": "slash", "cost": 100, "focus": 0, "cooldown": 0, "desc": "High crit execution. Stronger against bleeding or feared enemies."}, "cane_strike": {"name": "Cane Strike", "kind": "damage", "target": "enemy", "power": 84, "type": "blunt", "focus": 12, "cooldown": 0, "desc": "Quick staff/cane strike."}, "toxic_vial": {"name": "Toxic Vial", "kind": "damage_status", "target": "enemy", "power": 78, "type": "poison", "status": "poison", "amount": 38, "duration": 3, "focus": 17, "cooldown": 2, "desc": "Throws a vial that poisons the target."}, "miasma_cloud": {"name": "Miasma Cloud", "kind": "debuff_all", "target": "all_enemies", "status": "vulnerable", "amount": 16, "duration": 2, "focus": 18, "cooldown": 3, "desc": "Weakens all enemies with plague mist."}, "black_death": {"name": "Black Death", "kind": "ultimate", "target": "all_enemies", "power": 76, "type": "poison", "status": "poison", "amount": 42, "duration": 3, "cost": 100, "focus": 0, "cooldown": 0, "desc": "Ultimate plague cloud. Damages and poisons all enemies."}, "steppe_cleave": {"name": "Steppe Cleave", "kind": "damage", "target": "enemy", "power": 114, "type": "slash", "focus": 14, "cooldown": 0, "desc": "Savage warblade strike."}, "hun_war_spear": {"name": "Hun War Spear", "kind": "damage_status", "target": "enemy", "power": 104, "type": "pierce", "status": "vulnerable", "amount": 18, "duration": 2, "focus": 16, "cooldown": 2, "desc": "Piercing spear thrust that leaves the target exposed."}, "horde_command": {"name": "Horde Command", "kind": "buff", "target": "all_allies", "status": "rally", "amount": 18, "duration": 2, "focus": 18, "cooldown": 3, "desc": "All allies gain attack and morale."}, "scourge_charge": {"name": "Scourge Charge", "kind": "ultimate", "target": "enemy_front", "power": 142, "type": "charge", "cost": 84, "focus": 0, "cooldown": 0, "desc": "Devastating front-line rush that crushes the enemy line."}, "royal_khopesh": {"name": "Royal Khopesh", "kind": "damage", "target": "enemy", "power": 98, "type": "slash", "focus": 14, "cooldown": 0, "desc": "Elegant but deadly curved-blade strike."}, "asp_venom": {"name": "Asp Venom", "kind": "damage_status", "target": "enemy", "power": 82, "type": "poison", "status": "poison", "amount": 34, "duration": 3, "focus": 18, "cooldown": 2, "desc": "Poisons the target with royal venom."}, "queen_decree": {"name": "Queen's Decree", "kind": "buff", "target": "all_allies", "status": "resist", "amount": 18, "duration": 2, "focus": 18, "cooldown": 3, "desc": "All allies gain resistance and morale."}, "nile_charm": {"name": "Nile Charm", "kind": "debuff", "target": "enemy", "status": "fear", "amount": 18, "duration": 2, "focus": 16, "cooldown": 2, "desc": "Mystic charm that can break enemy morale."}, "summon_the_sphinx": {"name": "Summon the Sphinx", "kind": "summon_sphinx", "target": "self", "power": 0, "type": "holy", "cost": 100, "focus": 0, "cooldown": 0, "desc": "Calls a Living Sphinx guardian to the battlefield."}, "claw_of_the_dunes": {"name": "Claw of the Dunes", "kind": "damage", "target": "enemy", "power": 108, "type": "slash", "focus": 15, "cooldown": 0, "desc": "Heavy clawing strike."}, "solar_pounce": {"name": "Solar Pounce", "kind": "damage_status", "target": "enemy", "power": 112, "type": "holy", "status": "stun", "amount": 1, "duration": 1, "focus": 18, "cooldown": 2, "desc": "Leaping holy impact that can stun."}, "pharaoh_roar": {"name": "Pharaoh's Roar", "kind": "debuff_all", "target": "all_enemies", "status": "fear", "amount": 14, "duration": 2, "focus": 18, "cooldown": 3, "desc": "A terrifying roar that shakes the enemy team."}, "desert_judgement": {"name": "Desert Judgement", "kind": "ultimate", "target": "enemy_front", "power": 132, "type": "holy", "cost": 82, "focus": 0, "cooldown": 0, "desc": "Massive divine strike against the enemy line."}, "ancestral_spear": {"name": "Ancestral Spear", "kind": "damage", "target": "enemy", "power": 112, "type": "pierce", "focus": 14, "cooldown": 0, "desc": "Precise spear strike with ancestral force."}, "shield_of_the_savanna": {"name": "Shield of the Savanna", "kind": "buff", "target": "all_allies", "status": "guard", "amount": 20, "duration": 2, "focus": 17, "cooldown": 3, "desc": "All allies gain Guard."}, "tribal_war_cry": {"name": "Tribal War Cry", "kind": "buff", "target": "all_allies", "status": "rally", "amount": 20, "duration": 2, "focus": 18, "cooldown": 3, "desc": "Raises morale and attack for the whole team."}, "lion_spear_lunge": {"name": "Lion Spear Lunge", "kind": "damage_status", "target": "enemy", "power": 122, "type": "pierce", "status": "vulnerable", "amount": 18, "duration": 2, "focus": 16, "cooldown": 2, "desc": "A fierce lunge that exposes the target."}, "summon_the_lion_king": {"name": "Summon the Lion King", "kind": "summon_lion", "target": "self", "power": 0, "type": "beast", "cost": 100, "focus": 0, "cooldown": 0, "desc": "Calls the Lion King into battle. The Lion King gets its own attack turns."}, "royal_claw": {"name": "Royal Claw", "kind": "damage", "target": "enemy", "power": 116, "type": "slash", "focus": 15, "cooldown": 0, "desc": "A brutal claw attack."}, "savanna_pounce": {"name": "Savanna Pounce", "kind": "damage_status", "target": "enemy", "power": 118, "type": "blunt", "status": "stun", "amount": 1, "duration": 1, "focus": 18, "cooldown": 2, "desc": "A leaping impact that can stun."}, "king_roar": {"name": "King Roar", "kind": "debuff_all", "target": "all_enemies", "status": "fear", "amount": 16, "duration": 2, "focus": 18, "cooldown": 3, "desc": "A terrifying roar that spreads fear."}, "pride_rampage": {"name": "Pride Rampage", "kind": "ultimate", "target": "enemy_front", "power": 138, "type": "blunt", "cost": 82, "focus": 0, "cooldown": 0, "desc": "A devastating beast charge through the front line."}, "titan_chain_slam": {"name": "Chain Slam", "kind": "damage", "target": "enemy", "power": 156, "type": "blunt", "focus": 16, "cooldown": 0, "desc": "Short range crushing chain attack."}, "titan_ground_breaker": {"name": "Ground Breaker", "kind": "damage_status", "target": "enemy_front", "power": 112, "type": "blunt", "status": "stun", "amount": 1, "duration": 1, "focus": 18, "cooldown": 3, "desc": "Smashes the nearest line and can stun."}, "titan_roar": {"name": "Titan Roar", "kind": "debuff_all", "target": "all_enemies", "status": "fear", "amount": 16, "duration": 2, "focus": 18, "cooldown": 3, "desc": "Low damage pressure through fear. Reach is global but not lethal."}, "titan_rage": {"name": "Titan Rage", "kind": "buff", "target": "self", "status": "rage", "amount": 20, "duration": 2, "focus": 22, "cooldown": 4, "desc": "The titan enrages, gaining attack."}, "titan_colossal_crush": {"name": "Colossal Crush", "kind": "ultimate", "target": "enemy_front", "power": 172, "type": "blunt", "status": "vulnerable", "amount": 24, "duration": 2, "cost": 100, "focus": 0, "cooldown": 0, "desc": "Raid ultimate. Massive short-range crush against the front line."}, "dragon_molten_claw": {"name": "Molten Claw", "kind": "damage", "target": "enemy", "power": 152, "type": "slash", "focus": 16, "cooldown": 0, "desc": "Short-range burning claw attack."}, "dragon_fire_breath": {"name": "Fire Breath", "kind": "damage_status", "target": "enemy_front", "power": 118, "type": "fire", "status": "burn", "amount": 40, "duration": 3, "focus": 20, "cooldown": 3, "desc": "Cone-like fire pressure against the front line. Applies burn."}, "dragon_wing_quake": {"name": "Wing Quake", "kind": "damage_status", "target": "enemy_front", "power": 104, "type": "blunt", "status": "slow", "amount": 18, "duration": 2, "focus": 18, "cooldown": 3, "desc": "Heavy wing shockwave that slows the front line."}, "dragon_inferno_roar": {"name": "Inferno Roar", "kind": "debuff_all", "target": "all_enemies", "status": "fear", "amount": 18, "duration": 2, "focus": 20, "cooldown": 4, "desc": "Raid roar that spreads fear. Global pressure, low direct lethality."}, "dragon_apocalypse_flame": {"name": "Apocalypse Flame", "kind": "ultimate", "target": "enemy_front", "power": 176, "type": "fire", "status": "burn", "amount": 50, "duration": 3, "cost": 100, "focus": 0, "cooldown": 0, "desc": "Raid ultimate. Devastating fire burst against the front line."}, "hellfire_blade": {"name": "Hellfire Blade", "kind": "damage_status", "target": "enemy", "power": 124, "type": "fire", "status": "burn", "amount": 34, "duration": 2, "focus": 16, "cooldown": 0, "desc": "A flaming sword strike that applies burn."}, "abyssal_chains": {"name": "Abyssal Chains", "kind": "damage_status", "target": "enemy", "power": 92, "type": "shadow", "status": "slow", "amount": 22, "duration": 2, "focus": 18, "cooldown": 2, "desc": "Infernal chains lash out, dealing damage and slowing the target."}, "dread_coronation": {"name": "Dread Coronation", "kind": "debuff_all", "target": "all_enemies", "status": "fear", "amount": 18, "duration": 2, "focus": 20, "cooldown": 3, "desc": "The Demon King spreads fear across the battlefield."}, "throne_of_hell": {"name": "Throne of Hell", "kind": "ultimate", "target": "all_enemies", "power": 142, "type": "fire", "status": "burn", "amount": 42, "duration": 2, "cost": 100, "focus": 0, "cooldown": 0, "desc": "Lucifer unleashes a battlefield-wide infernal eruption."}, "amazon_axe_cleave": {"name": "Amazon Axe Cleave", "kind": "damage", "target": "enemy", "power": 108, "type": "slash", "focus": 14, "cooldown": 0, "desc": "A brutal axe strike delivered at close range."}, "hunter_bow_shot": {"name": "Hunter Bow Shot", "kind": "damage_status", "target": "enemy", "power": 88, "type": "arrow", "status": "mark", "amount": 16, "duration": 2, "focus": 16, "cooldown": 1, "desc": "A precise ranged shot that marks the target for follow-up attacks."}, "predator_dash": {"name": "Predator Dash", "kind": "buff", "target": "self", "status": "evasion", "amount": 20, "duration": 2, "focus": 17, "cooldown": 2, "desc": "The Amazon dashes into a hunting rhythm, gaining evasion and speed."}, "queen_of_the_wild": {"name": "Queen of the Wild", "kind": "damage_status", "target": "enemy", "power": 126, "type": "slash", "status": "bleed", "amount": 38, "duration": 2, "focus": 20, "cooldown": 3, "desc": "A savage finishing sequence of axe and bow pressure that causes bleeding."}, "immortal_resolve": {"name": "Immortal Resolve", "kind": "heal", "target": "self", "power": 260, "status": "guard", "amount": 18, "duration": 2, "focus": 18, "cooldown": 3, "desc": "Achilles restores health and gains Guard."}, "holy_healing_rain": {"name": "Holy Healing Rain", "kind": "special_full_heal", "target": "all_allies", "power": 9999, "type": "holy", "cost": 100, "focus": 0, "cooldown": 0, "desc": "Special Attack. Healing rain restores all allies to 100% HP. Recharges after use when Focus is built again."}, "arcane_bolt": {"name": "Arcane Bolt", "kind": "damage", "target": "enemy", "power": 102, "type": "magic", "focus": 16, "cooldown": 0, "desc": "Long range magic bolt."}, "crystal_chain_lightning": {"name": "Crystal Chain Lightning", "kind": "damage_status", "target": "enemy", "power": 96, "type": "magic", "status": "slow", "amount": 18, "duration": 2, "focus": 18, "cooldown": 2, "desc": "Long range lightning magic that slows the target."}, "wizard_mend": {"name": "Wizard Mend", "kind": "heal", "target": "ally", "power": 235, "status": "resist", "amount": 14, "duration": 2, "focus": 18, "cooldown": 1, "desc": "Heals an ally and grants resistance."}, "arcane_barrier": {"name": "Arcane Barrier", "kind": "buff", "target": "all_allies", "status": "guard", "amount": 18, "duration": 2, "focus": 18, "cooldown": 3, "desc": "Protective magic barrier for all allies."}, "thunder_strike": {"name": "Thunder Strike", "kind": "special_damage", "target": "enemy", "power": 270, "type": "magic", "fx": "thunder_strike", "status": "stun", "amount": 1, "duration": 1, "cost": 100, "focus": 0, "cooldown": 0, "desc": "Special Attack. Merlin calls a massive long-range lightning strike. Recharges after use when he builds Focus again."}, "flare_gun_shot": {"name": "Flare Gun Shot", "kind": "damage_status", "target": "enemy", "power": 94, "type": "shot", "status": "vulnerable", "amount": 14, "duration": 2, "focus": 14, "cooldown": 1, "desc": "A quick ranged shot that exposes the target."}, "navigator_support": {"name": "Navigator Support", "kind": "heal", "target": "ally", "power": 210, "status": "resist", "amount": 12, "duration": 2, "focus": 16, "cooldown": 2, "desc": "Patches up an ally and grants extra resistance."}, "tailwind_signal": {"name": "Tailwind Signal", "kind": "buff", "target": "all_allies", "status": "rally", "amount": 16, "duration": 2, "focus": 18, "cooldown": 3, "desc": "Boosts the whole team with a confident signal run."}, "warning_flash": {"name": "Warning Flash", "kind": "damage_status", "target": "enemy", "power": 88, "type": "shot", "status": "slow", "amount": 18, "duration": 2, "focus": 15, "cooldown": 2, "desc": "A blinding signal flash that slows the enemy."}, "sky_raid": {"name": "Sky Raid", "kind": "special_damage", "target": "enemy", "power": 220, "type": "shot", "fx": "sky_raid", "status": "stun", "amount": 1, "duration": 1, "cost": 100, "focus": 0, "cooldown": 0, "desc": "Special Attack. Amelia calls in a fast bombing run that stuns the target. Recharges after use when Focus is built again."}, "ground_dragon_boulder_bite": {"name": "Boulder Bite", "kind": "damage", "target": "enemy", "power": 160, "type": "blunt", "focus": 16, "cooldown": 0, "desc": "Short-range crushing bite from the earth titan."}, "ground_dragon_tectonic_crash": {"name": "Tectonic Crash", "kind": "damage_status", "target": "enemy_front", "power": 118, "type": "blunt", "status": "stun", "amount": 1, "duration": 1, "focus": 20, "cooldown": 3, "desc": "Shatters the front line with a tectonic slam and can stun."}, "ground_dragon_crystal_spikes": {"name": "Crystal Spikes", "kind": "damage_status", "target": "enemy_front", "power": 110, "type": "pierce", "status": "slow", "amount": 20, "duration": 2, "focus": 18, "cooldown": 3, "desc": "Razor crystal spikes erupt under the front line, dealing damage and slowing targets."}, "ground_dragon_earth_roar": {"name": "Earth Roar", "kind": "debuff_all", "target": "all_enemies", "status": "fear", "amount": 18, "duration": 2, "focus": 20, "cooldown": 4, "desc": "A rumbling roar shakes the whole field and spreads fear."}, "ground_dragon_worldsplitter": {"name": "Worldsplitter", "kind": "ultimate", "target": "enemy_front", "power": 186, "type": "blunt", "status": "vulnerable", "amount": 26, "duration": 2, "cost": 100, "focus": 0, "cooldown": 0, "desc": "Raid ultimate. The Ground Dragon smashes the battlefield with a catastrophic earth-shock."}, "webley_shot": {"name": "Webley Shot", "kind": "damage", "target": "enemy", "power": 108, "type": "shot", "focus": 14, "cooldown": 0, "desc": "A disciplined revolver shot from long range."}, "bayonet_advance": {"name": "Bayonet Advance", "kind": "damage_status", "target": "enemy", "power": 104, "type": "pierce", "status": "vulnerable", "amount": 16, "duration": 2, "focus": 16, "cooldown": 2, "desc": "Adrian pushes through fire and exposes the target."}, "iron_will": {"name": "Iron Will", "kind": "buff", "target": "self", "status": "guard", "amount": 24, "duration": 2, "focus": 18, "cooldown": 3, "desc": "Temporary damage reduction through sheer grit."}, "suppressive_barrage": {"name": "Suppressive Barrage", "kind": "damage_status", "target": "enemy", "power": 98, "type": "shot", "status": "slow", "amount": 20, "duration": 2, "focus": 17, "cooldown": 2, "desc": "A precise burst that disrupts movement and aim."}, "unkillable_charge": {"name": "Unkillable Charge", "kind": "special_charge_burst", "target": "enemy", "power": 242, "type": "shot", "fx": "shot", "guardAmount": 34, "resistAmount": 18, "duration": 2, "cost": 100, "focus": 0, "cooldown": 0, "desc": "Special Attack. Adrian hardens himself with damage reduction, marches through the fire and finishes with a brutal revolver burst. Recharges after use when Focus is built again."}, "gnome_staff_bolt": {"name": "Red Crystal Bolt", "kind": "damage", "target": "enemy", "power": 112, "type": "shadow", "focus": 16, "cooldown": 0, "desc": "A ranged dark-magic blast from his red crystal staff."}, "gnome_shadow_mend": {"name": "Shadow Mend", "kind": "heal", "target": "ally", "power": 215, "status": "resist", "amount": 12, "duration": 2, "focus": 18, "cooldown": 2, "desc": "Heals an ally with corrupt gnome magic and grants resistance."}, "gnome_hide": {"name": "Vanish Under Hat", "kind": "buff", "target": "self", "status": "hidden", "amount": 1, "duration": 2, "focus": 20, "cooldown": 3, "desc": "The gnome hides. The first incoming attack against him misses."}, "gnome_bite": {"name": "Goblin Bite", "kind": "damage_status", "target": "enemy", "power": 106, "type": "slash", "status": "bleed", "amount": 24, "duration": 2, "focus": 15, "cooldown": 1, "desc": "A close-range bite that can cause bleeding."}, "gnome_dark_transformation": {"name": "Dark Gnome Transformation", "kind": "gnome_transform", "target": "self", "power": 0, "type": "shadow", "cost": 100, "focus": 0, "cooldown": 0, "desc": "Special Attack. Evil Gnome transforms into a larger war form, gaining +50% attack and +50% defense."}, "medusa_snake_bite": {"name": "Snake Bite", "kind": "damage_status", "target": "enemy", "power": 104, "type": "slash", "status": "poison", "amount": 36, "duration": 2, "focus": 15, "cooldown": 1, "desc": "Short-range bite from the snakes. Deals damage and poison."}, "medusa_venom_bolt": {"name": "Venom Bolt", "kind": "damage", "target": "enemy", "power": 110, "type": "shadow", "focus": 16, "cooldown": 0, "desc": "Ranged gorgon magic fired from distance."}, "medusa_gorgon_guard": {"name": "Gorgon Guard", "kind": "buff", "target": "self", "status": "guard", "amount": 28, "duration": 2, "focus": 18, "cooldown": 3, "desc": "Medusa raises her shield and hardens her scales."}, "medusa_hypnotic_gaze": {"name": "Hypnotic Gaze", "kind": "damage_status", "target": "enemy", "power": 72, "type": "shadow", "status": "stun", "amount": 1, "duration": 1, "focus": 20, "cooldown": 3, "desc": "A control move: the target misses its next turn."}, "medusa_petrifying_gaze": {"name": "Petrifying Gaze", "kind": "special_damage", "target": "enemy", "power": 55, "type": "shadow", "fx": "petrify", "status": "petrified", "amount": 1, "duration": 2, "cost": 100, "focus": 0, "cooldown": 0, "desc": "Special Attack. Low damage control finisher: Medusa turns the chosen target to stone for 2 turns with a grey petrify overlay."}, "sinter_staff_bolt": {"name": "Crimson Staff Bolt", "kind": "damage", "target": "enemy", "power": 112, "type": "shadow", "focus": 16, "cooldown": 0, "desc": "A ranged red-black magic bolt from the bishop staff."}, "sinter_dark_blessing": {"name": "Dark Blessing", "kind": "heal", "target": "ally", "power": 235, "status": "resist", "amount": 16, "duration": 2, "focus": 20, "cooldown": 2, "desc": "Heals an ally and grants resistance."}, "sinter_cane_strike": {"name": "Cane Strike", "kind": "damage", "target": "enemy", "power": 104, "type": "blunt", "focus": 14, "cooldown": 0, "desc": "Close-range staff/cane attack."}, "sinter_nightmare_bell": {"name": "Nightmare Bell", "kind": "debuff_all", "target": "all_enemies", "status": "fear", "amount": 24, "duration": 2, "focus": 22, "cooldown": 3, "desc": "A dark bell spreads fear through the enemy team."}, "summon_shadow_pieten": {"name": "Summon Shadow Pieten", "kind": "summon_shadow_pieten", "target": "self", "cost": 100, "focus": 0, "cooldown": 0, "desc": "Special Attack. Summons three Shadow Pieten. They have low defense but can move and attack until killed."}, "piet_dagger_slash": {"name": "Dagger Slash", "kind": "damage", "target": "enemy", "power": 86, "type": "slash", "focus": 14, "cooldown": 0, "desc": "Fast weak helper slash."}, "piet_lantern_hex": {"name": "Lantern Hex", "kind": "damage_status", "target": "enemy", "power": 76, "type": "shadow", "status": "fear", "amount": 10, "duration": 1, "focus": 16, "cooldown": 2, "desc": "Weak ranged dark helper magic with a fear chance."}, "wemby_long_reach": {"name": "Long Reach Swipe", "kind": "damage", "target": "enemy", "power": 106, "type": "blunt", "focus": 14, "cooldown": 0, "desc": "A quick short attack using Wembanyama's insane reach."}, "wemby_flying_dunk": {"name": "Flying Dunk", "kind": "wemby_dunk", "target": "enemy", "power": 136, "type": "blunt", "focus": 18, "cooldown": 2, "desc": "Victor flies at the target for a ranged dunk, then returns to his original position."}, "wemby_dribble_evasion": {"name": "Dribble Evasion", "kind": "buff", "target": "self", "status": "hidden", "amount": 1, "duration": 2, "focus": 20, "cooldown": 3, "desc": "Quick handles: the next incoming attack misses."}, "wemby_recover": {"name": "Recover", "kind": "heal", "target": "self", "power": 220, "status": "guard", "amount": 14, "duration": 1, "focus": 16, "cooldown": 3, "desc": "Rest a little: recover HP and gain a small Guard boost."}, "wemby_hellfire_basketball": {"name": "Hellfire Basketball", "kind": "special_damage", "target": "enemy", "power": 182, "type": "fire", "fx": "basketball_fire", "status": "rooted", "amount": 1, "duration": 1, "cost": 100, "focus": 0, "cooldown": 0, "desc": "Special Attack. Throws a flaming basketball that roots the target so it cannot move for 1 turn."}, "minotaur_axe_cleave": {"name": "Axe Cleave", "kind": "damage", "target": "enemy", "power": 114, "type": "slash", "focus": 14, "cooldown": 0, "desc": "Short attack. A brutal close-range cleave with the double axe."}, "minotaur_shield_up": {"name": "Shield Up", "kind": "buff", "target": "self", "status": "mino_block", "amount": 1, "duration": 2, "focus": 18, "cooldown": 3, "desc": "Raise the shield. The first incoming hit deals no damage."}, "minotaur_blood_rage": {"name": "Blood Rage", "kind": "buff", "target": "self", "status": "mino_rage", "amount": 15, "duration": 2, "focus": 18, "cooldown": 3, "desc": "Enter a rage for 2 turns and gain +15% attack power."}, "minotaur_recover": {"name": "Recover", "kind": "heal", "target": "self", "power": 160, "focus": 16, "cooldown": 3, "desc": "Little recover move. Patch yourself up and stay in the fight."}, "minotaur_axe_throw": {"name": "Axe Throw", "kind": "special_damage", "target": "enemy", "power": 176, "type": "slash", "fx": "minotaur_axe", "cost": 100, "focus": 0, "cooldown": 0, "desc": "Special Attack. Throw the chained gladiator axe at a distant target."}};
const EMBEDDED_CAMPAIGN = [{"id": "c1", "act": 1, "actName": "Act 1 — Basic Fighters", "difficulty": "Easy", "title": "First Blood", "arena": "colosseum", "size": 1, "enemy": ["viking_berserker"], "reward": "viking_berserker", "desc": "Defeat the first berserker and unlock the Viking Berserker.", "rewardCoins": 75, "rewardRank": 25}, {"id": "c2", "act": 1, "actName": "Act 1 — Basic Fighters", "difficulty": "Easy", "title": "Steppe Arrow", "arena": "colosseum", "size": 2, "enemy": ["mongol_archer", "viking_berserker"], "reward": "mongol_archer", "desc": "Learn ranged pressure against the Mongol Archer.", "rewardCoins": 75, "rewardRank": 25}, {"id": "c3", "act": 1, "actName": "Act 1 — Basic Fighters", "difficulty": "Easy", "title": "Roman Discipline", "arena": "colosseum", "size": 2, "enemy": ["roman_centurion", "mongol_archer"], "reward": "roman_centurion", "desc": "Break the Roman line and unlock the Roman Centurion.", "rewardCoins": 75, "rewardRank": 25}, {"id": "c4", "act": 1, "actName": "Act 1 — Basic Fighters", "difficulty": "Easy", "title": "Banner of Faith", "arena": "colosseum", "size": 2, "enemy": ["joan", "roman_centurion"], "reward": "joan", "desc": "Face your first support commander and unlock Joan of Arc.", "rewardCoins": 75, "rewardRank": 25}, {"id": "c5", "act": 2, "actName": "Act 2 — Strong Warriors", "difficulty": "Normal", "title": "Valkyrie's Trial", "arena": "frozen_fjord", "size": 3, "enemy": ["valkyrie", "joan", "viking_berserker"], "reward": "valkyrie", "desc": "A stronger fighter enters the arena.", "rewardCoins": 110, "rewardRank": 40}, {"id": "c6", "act": 2, "actName": "Act 2 — Strong Warriors", "difficulty": "Normal", "title": "The Samurai Gate", "arena": "samurai_shrine", "size": 3, "enemy": ["musashi", "roman_centurion", "mongol_archer"], "reward": "musashi", "desc": "Defeat the two-sword ronin master.", "rewardCoins": 110, "rewardRank": 40}, {"id": "c7", "act": 2, "actName": "Act 2 — Strong Warriors", "difficulty": "Normal", "title": "Wrath of Achilles", "arena": "colosseum", "size": 3, "enemy": ["achilles", "valkyrie", "roman_centurion"], "reward": "achilles", "desc": "Survive Achilles and unlock his heroic duelist style.", "rewardCoins": 110, "rewardRank": 40}, {"id": "c8", "act": 2, "actName": "Act 2 — Strong Warriors", "difficulty": "Normal", "title": "The Leper King", "arena": "desert_arena", "size": 3, "enemy": ["baldwin_iv", "joan", "roman_centurion"], "reward": "baldwin_iv", "desc": "Face Baldwin IV and his holy command.", "rewardCoins": 110, "rewardRank": 40}, {"id": "c9", "act": 2, "actName": "Act 2 — Strong Warriors", "difficulty": "Normal", "title": "The Frisian Giant", "arena": "colosseum", "size": 4, "enemy": ["grutte_pier", "viking_berserker", "roman_centurion", "mongol_archer"], "reward": "grutte_pier", "desc": "A heavy powerhouse joins the progression.", "rewardCoins": 110, "rewardRank": 40}, {"id": "c10", "act": 2, "actName": "Act 2 — Strong Warriors", "difficulty": "Normal", "title": "The Emperor's Gambit", "arena": "colosseum", "size": 4, "enemy": ["napoleon", "roman_centurion", "joan", "mongol_archer"], "reward": "napoleon", "desc": "Defeat the tactical emperor.", "rewardCoins": 110, "rewardRank": 40}, {"id": "c11", "act": 3, "actName": "Act 3 — Status Effects", "difficulty": "Hard", "title": "Prince of Terror", "arena": "underworld_gate", "size": 4, "enemy": ["vlad", "plague_doctor", "ronin", "roman_centurion"], "reward": "vlad", "desc": "Fear and bleed pressure begin here.", "rewardCoins": 150, "rewardRank": 55}, {"id": "c12", "act": 3, "actName": "Act 3 — Status Effects", "difficulty": "Hard", "title": "The Plague Court", "arena": "underworld_gate", "size": 4, "enemy": ["plague_doctor", "vlad", "joan", "mongol_archer"], "reward": "plague_doctor", "desc": "Learn to handle poison and vulnerable debuffs.", "rewardCoins": 150, "rewardRank": 55}, {"id": "c13", "act": 3, "actName": "Act 3 — Status Effects", "difficulty": "Hard", "title": "The Masterless Blade", "arena": "samurai_shrine", "size": 4, "enemy": ["ronin", "musashi", "vlad", "mongol_archer"], "reward": "ronin", "desc": "Fight speed, bleed and fear pressure.", "rewardCoins": 150, "rewardRank": 55}, {"id": "c14", "act": 3, "actName": "Act 3 — Status Effects", "difficulty": "Hard", "title": "Underground Riot", "arena": "underworld_gate", "size": 4, "enemy": ["the_hooligan", "ronin", "viking_berserker", "vlad"], "reward": "the_hooligan", "desc": "A brutal control fighter enters.", "rewardCoins": 150, "rewardRank": 55}, {"id": "c15", "act": 3, "actName": "Act 3 — Status Effects", "difficulty": "Hard", "title": "Operation 007", "arena": "colosseum", "size": 4, "enemy": ["james_bond", "ronin", "plague_doctor", "mongol_archer"], "reward": "james_bond", "desc": "Long range precision and control.", "rewardCoins": 150, "rewardRank": 55}, {"id": "c15a", "act": 3, "actName": "Act 3 — Status Effects", "difficulty": "Hard", "title": "The Unkillable Soldier", "arena": "colosseum", "size": 4, "enemy": ["adrian_carton_de_wiart", "james_bond", "the_hooligan", "roman_centurion"], "reward": "adrian_carton_de_wiart", "desc": "Face Adrian Carton de Wiart in the same act as James Bond and unlock the unkillable officer.", "rewardCoins": 175, "rewardRank": 60}, {"id": "c15b", "act": 3, "actName": "Act 3 — Status Effects", "difficulty": "Hard", "title": "The Alien of the Paint", "arena": "colosseum", "size": 5, "enemy": ["victor_wembanyama", "james_bond", "amelia_earhart", "the_hooligan", "battle_priest"], "reward": "victor_wembanyama", "desc": "Face Victor Wembanyama in his own chapter. He moves over the whole field, dunks from range, evades with dribbling, recovers, and locks movement with a flaming basketball.", "rewardCoins": 175, "rewardRank": 60}, {"id": "c16", "act": 4, "actName": "Act 4 — Healers / Commanders / Summons", "difficulty": "Elite", "title": "The Sacred Battlefield", "arena": "colosseum", "size": 5, "enemy": ["battle_priest", "joan", "baldwin_iv", "roman_centurion", "mongol_archer"], "reward": "battle_priest", "desc": "Stronger healing and team sustain starts here.", "rewardCoins": 190, "rewardRank": 70}, {"id": "c17", "act": 4, "actName": "Act 4 — Healers / Commanders / Summons", "difficulty": "Elite", "title": "The Vatican Trial", "arena": "colosseum", "size": 5, "enemy": ["the_pope", "battle_priest", "joan", "baldwin_iv", "roman_centurion"], "reward": "the_pope", "desc": "Face full sustain and holy protection.", "rewardCoins": 190, "rewardRank": 70}, {"id": "c17b", "act": 4, "actName": "Act 4 — Healers / Commanders / Summons", "difficulty": "Hard", "title": "The Crimson Saint", "arena": "underworld_gate", "size": 5, "enemy": ["dark_sinterklaas", "the_pope", "battle_priest", "the_hooligan", "plague_doctor"], "reward": "dark_sinterklaas", "desc": "A dark holiday summoner enters the arena. Survive his healing, fear magic and three Shadow Pieten.", "rewardCoins": 210, "rewardRank": 80}, {"id": "c18", "act": 4, "actName": "Act 4 — Healers / Commanders / Summons", "difficulty": "Elite", "title": "The Sword in the Stone", "arena": "colosseum", "size": 5, "enemy": ["king_arthur", "baldwin_iv", "joan", "roman_centurion", "valkyrie"], "reward": "king_arthur", "desc": "Defeat the holy tank commander.", "rewardCoins": 190, "rewardRank": 70}, {"id": "c19", "act": 4, "actName": "Act 4 — Healers / Commanders / Summons", "difficulty": "Elite", "title": "Queen of the Nile", "arena": "desert_arena", "size": 5, "enemy": ["cleopatra", "anubis_warrior", "battle_priest", "roman_centurion", "mongol_archer"], "reward": "cleopatra", "desc": "Survive Cleopatra and her Sphinx pressure.", "rewardCoins": 190, "rewardRank": 70}, {"id": "c20", "act": 4, "actName": "Act 4 — Healers / Commanders / Summons", "difficulty": "Elite", "title": "Pride of the Savanna", "arena": "desert_arena", "size": 5, "enemy": ["african_tribe_warrior", "cleopatra", "anubis_warrior", "attila_the_hun", "mongol_archer"], "reward": "african_tribe_warrior", "desc": "Fight the Lion King summon and unlock the Savanna warrior.", "rewardCoins": 190, "rewardRank": 70}, {"id": "c21", "act": 4, "actName": "Act 4 — Healers / Commanders / Summons", "difficulty": "Elite", "title": "Queen of the Wild Hunt", "arena": "desert_arena", "size": 5, "enemy": ["the_amazon_girl", "african_tribe_warrior", "mongol_archer", "viking_berserker", "ronin"], "reward": "the_amazon_girl", "desc": "Speed, mark and bleed pressure in a full team fight.", "rewardCoins": 190, "rewardRank": 70}, {"id": "c22", "act": 5, "actName": "Act 5 — Endgame", "difficulty": "Endgame", "title": "Scourge of the Steppe", "arena": "colosseum", "size": 5, "enemy": ["attila_the_hun", "grutte_pier", "napoleon", "mongol_archer", "viking_berserker"], "reward": "attila_the_hun", "desc": "Endgame commander pressure begins.", "rewardCoins": 240, "rewardRank": 90}, {"id": "c23", "act": 5, "actName": "Act 5 — Endgame", "difficulty": "Endgame", "title": "Judgement of Anubis", "arena": "underworld_gate", "size": 5, "enemy": ["anubis_warrior", "cleopatra", "plague_doctor", "vlad", "battle_priest"], "reward": "anubis_warrior", "desc": "A mythic control battle before the finale.", "rewardCoins": 240, "rewardRank": 90}, {"id": "c24", "act": 5, "actName": "Act 5 — Endgame", "difficulty": "Endgame", "title": "The Infernal Throne", "arena": "underworld_gate", "size": 5, "enemy": ["lucifer_demon_king", "vlad", "plague_doctor", "the_pope", "battle_priest"], "reward": "lucifer_demon_king", "desc": "Final campaign chapter. Defeat Lucifer the Demon King.", "rewardCoins": 240, "rewardRank": 90}];

const $ = (sel) => document.querySelector(sel);
const $$ = (sel) => Array.from(document.querySelectorAll(sel));

const DATA = {
  warriors: EMBEDDED_WARRIORS,
  moves: EMBEDDED_MOVES,
  campaign: EMBEDDED_CAMPAIGN
};


const TEMPLAR_SUMMON_TEMPLATE = {
  id: "templar_knight",
  name: "Templar Knight",
  role: "Summoned Guard",
  faction: "Jerusalem",
  sprite: "assets/sprites/templar_knight.png",
  spriteFacing: "right",
  maxHp: 320,
  attack: 56,
  defense: 48,
  speed: 40,
  crit: 4,
  resistance: 20,
  morale: 100,
  armor: "Shielded"
};

const ArenaNames = {
  colosseum: "Roman Colosseum",
  frozen_fjord: "Frozen Fjord",
  desert_arena: "Desert Arena",
  samurai_shrine: "Samurai Shrine",
  underworld_gate: "Underworld Gate"
};

const TypeMods = {
  slash: { Light: 1.15, Medium: 1.03, Shielded: 0.90, Mystic: 1.0, Commander: 1.08 },
  pierce: { Light: 1.02, Medium: 1.08, Heavy: 1.18, Shielded: 0.96, Commander: 1.08 },
  blunt: { Light: 0.95, Medium: 1.06, Heavy: 1.12, Shielded: 1.22, Mystic: 0.94 },
  holy: { Shadow: 1.25, Mystic: 1.16, Commander: 1.02, Light: 1.0, Shielded: 1.0 },
  shadow: { Commander: 1.18, Support: 1.16, Mystic: 1.02, Shielded: 0.94, Holy: 0.82 },
  poison: { Shielded: 1.14, Heavy: 1.12, Mystic: 0.86, Light: 1.04 }
};

const FORMATIONS = {
  1: [
    { x: 22, y: 66, row: "front", scale: 1.10 }
  ],
  2: [
    { x: 20, y: 71, row: "front", scale: 1.05 },
    { x: 32, y: 57, row: "back", scale: .98 }
  ],
  3: [
    { x: 18, y: 76, row: "front", scale: 1.05 },
    { x: 30, y: 65, row: "front", scale: 1.00 },
    { x: 40, y: 52, row: "back", scale: .94 }
  ],
  4: [
    { x: 16, y: 78, row: "front", scale: 1.04 },
    { x: 28, y: 68, row: "front", scale: 1.00 },
    { x: 38, y: 56, row: "back", scale: .94 },
    { x: 47, y: 45, row: "back", scale: .90 }
  ],
  5: [
    { x: 14, y: 80, row: "front", scale: 1.04 },
    { x: 25, y: 72, row: "front", scale: 1.01 },
    { x: 36, y: 63, row: "front", scale: .97 },
    { x: 45, y: 51, row: "back", scale: .92 },
    { x: 53, y: 41, row: "back", scale: .88 }
  ]
};


const GRID = { cols: 10, rows: 5, moveRange: 2 };

const MOVE_PATTERNS = {
  slash:  { name: "Close", range: 1, shape: "adjacent" },
  blunt:  { name: "Close", range: 1, shape: "adjacent" },
  pierce: { name: "Line", range: 4, shape: "line" },
  holy:   { name: "Holy", range: 5, shape: "flex" },
  shadow: { name: "Arcane", range: 4, shape: "flex" },
  poison: { name: "Toxic", range: 4, shape: "flex" }
};

function gridToPercent(col, row, side){
  // V3.8: visible tactical grid mapping.
  // Units are bottom-anchored, so the first row needs enough headroom.
  // These values match the visual grid-cell layer below.
  const gridTop = 20;
  const gridHeight = 72;
  const x = ((col + .5) / GRID.cols) * 100;
  const y = gridTop + ((row + .5) / GRID.rows) * gridHeight;
  return { x, y };
}

function titanHitCells(unit){
  if(!unit || !unit.isTitanBoss){
    return unit ? [{col: unit.gridCol, row: unit.gridRow}] : [];
  }

  // Titans are huge raid bosses: they occupy 3 clickable/targetable grid blocks.
  // Center + upper + lower block makes them hittable even when the sprite is very large.
  return [
    {col: unit.gridCol, row: unit.gridRow - 1},
    {col: unit.gridCol, row: unit.gridRow},
    {col: unit.gridCol, row: unit.gridRow + 1}
  ].filter(c => inBounds(c.col, c.row));
}

function distanceToUnitCells(actor, target){
  if(!actor || !target) return 999;
  return Math.min(...titanHitCells(target).map(c => Math.abs(actor.gridCol - c.col) + Math.abs(actor.gridRow - c.row)));
}

function isStraightOrDiagonalToUnit(actor, target){
  if(!actor || !target) return false;
  return titanHitCells(target).some(c => {
    const dc = Math.abs(actor.gridCol - c.col);
    const dr = Math.abs(actor.gridRow - c.row);
    return actor.gridCol === c.col || actor.gridRow === c.row || dc === dr;
  });
}

function closestUnitCell(from, target){
  const cells = titanHitCells(target);
  if(!cells.length) return {col: target.gridCol, row: target.gridRow};
  return cells
    .map(c => ({...c, score: Math.abs(from.gridCol - c.col) + Math.abs(from.gridRow - c.row)}))
    .sort((a,b) => a.score - b.score)[0];
}

function occupiedCell(col, row, ignoreUid=null){
  if(!Battle) return false;
  return Battle.units.some(u => {
    if(!u.alive || u.uid === ignoreUid) return false;
    return titanHitCells(u).some(c => c.col === col && c.row === row);
  });
}

function inBounds(col, row){
  return col >= 0 && col < GRID.cols && row >= 0 && row < GRID.rows;
}

function gridDistance(a,b){
  return Math.abs(a.gridCol - b.gridCol) + Math.abs(a.gridRow - b.gridRow);
}

function isStraightLine(a,b){
  return a.gridCol === b.gridCol || a.gridRow === b.gridRow;
}

function isDiagonalLine(a,b){
  return Math.abs(a.gridCol - b.gridCol) === Math.abs(a.gridRow - b.gridRow);
}

function movePatternFor(mv){
  if(mv.kind === "super_transform" || mv.kind === "gnome_transform" || mv.kind === "summon_shadow_pieten" || mv.kind === "summon_guard" || mv.kind === "summon_sphinx" || mv.kind === "summon_lion") return { name: "Special", range: 0, shape: "global" };
  if(mv.kind === "special_damage" || mv.kind === "special_charge_burst") return { name: mv.fx === "thunder_strike" ? "Thunder Strike" : mv.fx === "sky_raid" ? "Sky Raid" : mv.fx === "summon_bear" ? "Spirit Bear" : mv.fx === "petrify" ? "Petrify" : mv.fx === "basketball_fire" ? "Hellfire Basketball" : mv.fx === "minotaur_axe" ? "Axe Throw" : mv.kind === "special_charge_burst" ? "Charge Burst" : "Special Strike", range: (mv.fx === "thunder_strike" || mv.fx === "sky_raid" || mv.fx === "summon_bear" || mv.fx === "petrify" || mv.fx === "basketball_fire" || mv.fx === "minotaur_axe") ? 7 : (mv.kind === "special_charge_burst" ? 5 : 1), shape: (mv.fx === "thunder_strike" || mv.fx === "sky_raid" || mv.fx === "summon_bear" || mv.fx === "petrify" || mv.fx === "basketball_fire" || mv.fx === "minotaur_axe" || mv.kind === "special_charge_burst") ? "line" : "adjacent" };
  if(mv.kind === "wemby_dunk") return { name: "Flying Dunk", range: 6, shape: "flex" };
  if(mv.kind === "special_full_heal") return { name: "Healing Rain", range: 0, shape: "global" };
  if(mv.target === "all_enemies" || mv.target === "enemy_front" || mv.target === "all_allies") {
    return { name: "Team", range: 99, shape: "global" };
  }
  if(mv.target === "ally" || mv.target === "self") {
    return { name: "Support", range: 5, shape: "flex" };
  }
  if(mv.name && /crimson staff bolt|lantern hex|venom bolt|hypnotic gaze|red crystal bolt|arcane bolt|chain lightning|thunder strike/i.test(mv.name)) return { name: "Long Range Magic", range: 6, shape: "line" };
  if(mv.name && /flare|signal|warning flash|sky raid|hellfire basketball/i.test(mv.name)) return { name: "Aerial Ranged", range: 7, shape: "line" };
  if(mv.name && /fire breath|wing quake|apocalypse flame/i.test(mv.name)) return { name: "Dragon Cone", range: 2, shape: "line" };
  if(mv.name && /cane strike|dagger slash|snake bite|goblin bite|molten claw|long reach swipe/i.test(mv.name)) return { name: "Melee", range: 1, shape: "melee" };
  if(mv.name && /chain slam|ground breaker|colossal crush/i.test(mv.name)) return { name: "Titan Short Reach", range: 1, shape: "melee" };
  if(mv.name && /webley|barrage|suppressive|spear|lunge|piercing|arrow|shot|storm/i.test(mv.name)) {
    if(/arrow|shot|storm/i.test(mv.name)) return { name: "Ranged", range: 7, shape: "flex" };
    return { name: "Line", range: 4, shape: "line" };
  }
  if(mv.name && /winged|soul|terror|curse|heart|aura|flame|judgement/i.test(mv.name)) {
    return { name: "Arcane", range: 5, shape: "flex" };
  }
  return MOVE_PATTERNS[mv.type] || { name: "Close", range: 1, shape: "adjacent" };
}

function inMoveRange(actor, target, mv){
  if(!actor || !target || !mv) return false;
  if(["all_enemies","enemy_front","all_allies","self"].includes(mv.target)) return true;
  const pat = movePatternFor(mv);
  const d = distanceToUnitCells(actor, target);
  if(pat.shape === "global") return true;
  if(pat.shape === "adjacent" || pat.shape === "melee") return d <= pat.range;
  if(pat.shape === "line") return d <= pat.range && isStraightOrDiagonalToUnit(actor, target);
  return d <= pat.range;
}

function legalMoveCells(unit){
  if(!unit || unit.noMoveThisTurn || hasStatus(unit, "rooted")) return [];
  const cells = [];
  for(let row=0; row<GRID.rows; row++){
    for(let col=0; col<GRID.cols; col++){
      if(!inBounds(col,row)) continue;
      if(occupiedCell(col,row,unit.uid)) continue;
      const d = Math.abs(unit.gridCol - col) + Math.abs(unit.gridRow - row);
      if(unit.id === "dark_sinterklaas"){
        const fullVertical = col === unit.gridCol;
        const fourHorizontal = row === unit.gridRow && Math.abs(unit.gridCol - col) <= 4;
        if(d > 0 && (fullVertical || fourHorizontal)) cells.push({col,row});
      } else if(unit.id === "victor_wembanyama") {
        if(d > 0) cells.push({col,row});
      } else if(d > 0 && d <= GRID.moveRange) {
        cells.push({col,row});
      }
    }
  }
  return cells;
}

function minotaurBullRushDestination(actor, target){
  if(!actor || !target) return null;
  const dx = Math.sign(target.gridCol - actor.gridCol);
  const dy = Math.sign(target.gridRow - actor.gridRow);
  if(dx === 0 && dy === 0) return null;
  const col = target.gridCol + dx;
  const row = target.gridRow + dy;
  if(!inBounds(col,row)) return null;
  if(occupiedCell(col,row,target.uid)) return null;
  return { col, row };
}

function minotaurBullRushCells(unit){
  if(!unit || unit.id !== "minotaur_gladiator" || unit.noMoveThisTurn || hasStatus(unit, "rooted")) return [];
  return enemiesOf(unit).filter(t => t.alive).map(t => {
    const d = Math.abs(unit.gridCol - t.gridCol) + Math.abs(unit.gridRow - t.gridRow);
    if(d <= 0 || d > GRID.moveRange) return null;
    const push = minotaurBullRushDestination(unit, t);
    if(!push) return null;
    return { col:t.gridCol, row:t.gridRow, bullRush:true, targetUid:t.uid, pushCol:push.col, pushRow:push.row };
  }).filter(Boolean);
}

function applyMinotaurBullRush(actor, target, pushCol, pushRow){
  if(!actor || !target || !actor.alive || !target.alive) return false;
  const oldCol = target.gridCol;
  const oldRow = target.gridRow;
  setUnitGrid(target, pushCol, pushRow);
  setUnitGrid(actor, oldCol, oldRow);
  actor.hasMovedThisTurn = true;
  actor.focus = clamp(actor.focus + 8, 0, 100);
  const rushMove = { id:"minotaur_bull_rush", name:"Bull Rush", kind:"damage", power:44, type:"blunt", focus:0 };
  const dealt = applyDamage(actor, target, rushMove);
  pop(target, "PUSH", "status");
  log(`<strong>${actor.name}</strong> bull-rushes <strong>${target.name}</strong>, shoving the target back 1 tile.`);
  return dealt;
}

function setUnitGrid(unit, col, row){
  unit.gridCol = col;
  unit.gridRow = row;
  const p = gridToPercent(col,row,unit.side);
  unit.x = p.x;
  unit.y = p.y;
  unit.row = (unit.side === "player" ? col >= 7 : col <= 2) ? "back" : "front";
}

function nearestLegalStepToward(actor, target){
  const cells = actor.id === "minotaur_gladiator" ? [...legalMoveCells(actor), ...minotaurBullRushCells(actor)] : legalMoveCells(actor);
  if(!cells.length) return null;
  return cells
    .map(c => {
      const score = Math.min(...titanHitCells(target).map(t => Math.abs(c.col - t.col) + Math.abs(c.row - t.row)));
      return {...c, score};
    })
    .sort((a,b) => a.score - b.score)[0];
}


function patternPreviewCells(actor, mv){
  const pat = movePatternFor(mv);
  const cells = [];
  const seen = new Set();

  function add(col,row,kind="range"){
    if(!inBounds(col,row)) return;
    const key = `${col},${row},${kind}`;
    if(seen.has(key)) return;
    seen.add(key);
    cells.push({ col, row, kind });
  }

  add(actor.gridCol, actor.gridRow, "origin");

  if(pat.shape === "global"){
    for(let row=0; row<GRID.rows; row++){
      for(let col=0; col<GRID.cols; col++){
        add(col,row,"range");
      }
    }
    return cells;
  }

  if(pat.shape === "adjacent"){
    for(let d=1; d<=pat.range; d++){
      [
        [actor.gridCol + d, actor.gridRow],
        [actor.gridCol - d, actor.gridRow],
        [actor.gridCol, actor.gridRow + d],
        [actor.gridCol, actor.gridRow - d],
      ].forEach(([c,r]) => add(c,r,"range"));
    }
    return cells;
  }

  if(pat.shape === "line"){
    const dirs = [
      [1,0],[-1,0],[0,1],[0,-1],
      [1,1],[1,-1],[-1,1],[-1,-1]
    ];
    dirs.forEach(([dx,dy]) => {
      for(let step=1; step<=pat.range; step++){
        add(actor.gridCol + dx * step, actor.gridRow + dy * step, "path");
      }
    });
    return cells;
  }

  // flex / ranged diamond-style preview
  for(let row=0; row<GRID.rows; row++){
    for(let col=0; col<GRID.cols; col++){
      const d = Math.abs(actor.gridCol - col) + Math.abs(actor.gridRow - row);
      if(d > 0 && d <= pat.range){
        add(col,row,"range");
      }
    }
  }

  return cells;
}

function tacticalRangeLabel(mv){
  const pat = movePatternFor(mv);
  if(pat.shape === "line") return `Line ${pat.range}`;
  if(pat.shape === "adjacent") return `Close ${pat.range}`;
  if(pat.shape === "global") return "All";
  return `Range ${pat.range}`;
}

const ROLE_COUNTERS = {
  Tank:       { strong: ["Assassin","Marksman","Light"], weak: ["Berserker","Mystic","Duelist","Poison"] },
  Vanguard:  { strong: ["Marksman","Light"], weak: ["Blunt","Curse","Mystic"] },
  Duelist:   { strong: ["Commander","Marksman","Support","Isolated"], weak: ["Tank","Stun","Taunt"] },
  Berserker: { strong: ["Tank","Support","Slow"], weak: ["Control","Fear","Stun","Marksman"] },
  Marksman:  { strong: ["Support","Backline","Slow"], weak: ["Shield","Assassin","Taunt"] },
  Commander: { strong: ["Mixed","Morale"], weak: ["Assassin","Fear","Silence"] },
  Support:   { strong: ["Fear","Bleed","Curse"], weak: ["Assassin","Burst","Silence"] },
  Mystic:    { strong: ["Tank","LowResistance","Shield"], weak: ["Holy","Cleanse","Burst"] }
};

let SAVE = null;
let Battle = null;

let UI = {
  playerTeam: [],
  enemyTeam: [],
  battleSize: 3,
  currentScreen: "home",
  pendingMove: null,
  playerActiveSlot: 0,
  enemyActiveSlot: 0,
  hoverWarriorId: null,
  campaignChapterId: null,
  campaignTeam: [],
  campaignActiveSlot: 0,
  titanTeam: [],
  titanActiveSlot: 0,
  selectedTitanId: "cyclops_titan",
  gauntletTeam: [],
  gauntletActiveSlot: 0,
  gauntletRun: null
};


const TITAN_META = {
  cyclops_titan: {
    reach: "Low",
    arena: "underworld_gate",
    note: "The Cyclops is traag en heeft weinig bereik. Gebruik movement, ranged units, shields, heals en summons om hem kapot te werken."
  },
  fire_dragon_titan: {
    reach: "Low / Cone",
    arena: "desert_arena",
    note: "The Fire Dragon Titan heeft enorme HP en vuurschade. Hij is traag en moet dichtbij komen, maar zijn fire breath straft front-line stacking hard af."
  },
  ground_dragon_titan: {
    reach: "Low / Sweep",
    arena: "underworld_gate",
    note: "The Ground Dragon is een zware earth titan met enorme defense. Hij is langzaam en heeft weinig bereik, maar zijn tectonic crashes, crystal spikes en earth roar kunnen je front line breken als je te dicht stacked."
  }
};

function warrior(id) { return DATA.warriors.find(w => w.id === id); }
function move(id) { return DATA.moves[id]; }
function clamp(v, min, max) { return Math.max(min, Math.min(max, v)); }
function rand(arr) { return arr[Math.floor(Math.random() * arr.length)]; }

function DefaultSave(){
  return {
    coins: 250,
    rankPoints: 0,
    unlocked: ["leonidas", "joan", "viking_berserker", "mongol_archer", "roman_centurion"],
    completedCampaign: [],
    wins: 0,
    losses: 0,
    gauntletBestFloor: 0
  };
}

function loadGame(){
  const defaults = DefaultSave();
  try {
    SAVE = JSON.parse(localStorage.getItem("eternalArenaSaveV2")) || null;
    if(!SAVE){
      const old = JSON.parse(localStorage.getItem("eternalArenaSaveV1")) || null;
      SAVE = old || defaults;
    }
  } catch(e) {
    SAVE = defaults;
  }

  // V5.33 hard runtime fix: older saves can miss newer fields.
  // Missing arrays used to crash init(), making the page look dead and unclickable.
  SAVE = SAVE && typeof SAVE === "object" ? SAVE : defaults;
  if(typeof SAVE.coins !== "number") SAVE.coins = defaults.coins;
  if(typeof SAVE.rankPoints !== "number") SAVE.rankPoints = defaults.rankPoints;
  if(typeof SAVE.wins !== "number") SAVE.wins = defaults.wins;
  if(typeof SAVE.losses !== "number") SAVE.losses = defaults.losses;
  if(typeof SAVE.gauntletBestFloor !== "number") SAVE.gauntletBestFloor = defaults.gauntletBestFloor;
  if(!Array.isArray(SAVE.unlocked)) SAVE.unlocked = defaults.unlocked.slice();
  if(!Array.isArray(SAVE.completedCampaign)) SAVE.completedCampaign = [];
  SAVE.unlocked = [...new Set(SAVE.unlocked.filter(Boolean))];
  SAVE.completedCampaign = [...new Set(SAVE.completedCampaign.filter(Boolean))];

  const startUnlocked = DATA.warriors.filter(w => w.unlock === "start").map(w => w.id);
  startUnlocked.forEach(id => { if(!SAVE.unlocked.includes(id)) SAVE.unlocked.push(id); });

  const campaignLockedRewards = {};
  DATA.campaign.forEach(c => {
    if(c.reward) campaignLockedRewards[c.reward] = c.id;
  });

  Object.entries(campaignLockedRewards).forEach(([id, chapterId]) => {
    const rw = warrior(id);
    const isShopWarrior = rw && String(rw.unlock || "").startsWith("shop_");
    if(!isShopWarrior && SAVE.unlocked.includes(id) && !SAVE.completedCampaign.includes(chapterId)){
      SAVE.unlocked = SAVE.unlocked.filter(x => x !== id);
    }
  });

  // V5.23 migration: preserve existing late-game progress after inserting the Wildmother chapter.
  if((SAVE.completedCampaign.includes("c21") || SAVE.completedCampaign.includes("c22") || SAVE.completedCampaign.includes("c23") || SAVE.completedCampaign.includes("c24") || SAVE.unlocked.includes("the_amazon_girl") || SAVE.unlocked.includes("attila_the_hun") || SAVE.unlocked.includes("lucifer_demon_king")) && !SAVE.completedCampaign.includes("c20b")) {
    SAVE.completedCampaign.push("c20b");
    if(!SAVE.unlocked.includes("wildmother_druid")) SAVE.unlocked.push("wildmother_druid");
  }

  // V5.34: keep Dark Sinterklaas as a real chapter between c17 and c18.
  // Previous builds could auto-complete c17b for old saves, which made it feel missing.
  if(!SAVE.sinterChapterVisibleV534){
    if(SAVE.completedCampaign.includes("c17b")){
      SAVE.completedCampaign = SAVE.completedCampaign.filter(x => x !== "c17b");
    }
    if(SAVE.unlocked.includes("dark_sinterklaas")){
      SAVE.unlocked = SAVE.unlocked.filter(x => x !== "dark_sinterklaas");
    }
    SAVE.sinterChapterVisibleV534 = true;
  }


  // V5.42: Minotaur is both chapter reward and shop warrior.
  if(SAVE.completedCampaign.includes("c7a") && !SAVE.unlocked.includes("minotaur_gladiator")){
    SAVE.unlocked.push("minotaur_gladiator");
  }

  SAVE.unlocked = [...new Set(SAVE.unlocked.filter(Boolean))];
  SAVE.completedCampaign = [...new Set(SAVE.completedCampaign.filter(Boolean))];
  saveGame();
}

function saveGame(){
  localStorage.setItem("eternalArenaSaveV2", JSON.stringify(SAVE));
  renderTop();
}

function isUnlocked(id){ return SAVE.unlocked.includes(id); }

function rankName(){
  const p = SAVE.rankPoints;
  if(p >= 1200) return "Eternal Arena Master";
  if(p >= 800) return "Mythic Arena Master";
  if(p >= 520) return "Diamond Arena Master";
  if(p >= 300) return "Gold Arena Master";
  if(p >= 120) return "Silver Arena Master";
  return "Bronze Arena Master";
}



function showHealingRainAnimation(targets){
  const layer = $("#effectLayer");
  if(!layer || !targets || !targets.length) return Promise.resolve();

  const rain = document.createElement("div");
  rain.className = "healing-rain-layer";

  targets.filter(t => t.alive).forEach((t, idx) => {
    const p = battlefieldPointForUnit(t);

    const aura = document.createElement("div");
    aura.className = "healing-rain-aura";
    aura.style.left = `${p.x - 54}px`;
    aura.style.top = `${p.y - 86}px`;
    rain.appendChild(aura);

    for(let i = 0; i < 7; i++){
      const drop = document.createElement("img");
      drop.className = "healing-rain-drop";
      drop.src = "assets/effects/holy_healing_drop.png";
      drop.style.left = `${p.x - 45 + (i * 15) + ((idx % 2) * 6)}px`;
      drop.style.top = `${p.y - 210 - (i * 18)}px`;
      drop.style.animationDelay = `${i * 0.11 + idx * 0.05}s`;
      drop.style.setProperty("--fall", `${120 + (i % 3) * 24}px`);
      rain.appendChild(drop);
    }
  });

  layer.appendChild(rain);
  return new Promise(resolve => {
    setTimeout(() => {
      rain.remove();
      resolve();
    }, 1550);
  });
}

function fullHealAllies(actor, moveName="Holy Healing Rain"){
  const targets = alliesOf(actor).filter(t => t.alive);
  targets.forEach(t => {
    const amount = Math.max(0, t.maxHp - t.hp);
    t.hp = t.maxHp;
    t.morale = Math.min(100, t.morale + 12);
    addStatus(t, "resist", 24, 2);
    addStatus(t, "guard", 18, 1);
    pop(t, amount > 0 ? `+${amount}` : "FULL", "heal");
    spawnFx("holy", t);
  });
  log(`<strong>${actor.name}</strong> calls ${moveName}. All allies are fully healed.`);
  return targets;
}

function spawnGodlikeSlashFx(attacker, target){
  const layer = $("#effectLayer");
  if(!layer || !target) return;
  const p = battlefieldPointForUnit(target);

  const arc = document.createElement("img");
  arc.className = "godlike-slash-fx";
  arc.src = "assets/effects/achilles_godlike_slash.png";
  arc.alt = "Godlike Assault";
  arc.style.left = `${p.x - 175}px`;
  arc.style.top = `${p.y - 165}px`;
  arc.style.setProperty("--flip", attacker && attacker.side === "enemy" ? -1 : 1);
  layer.appendChild(arc);

  const flare = document.createElement("div");
  flare.className = "godlike-flash-fx";
  flare.style.left = `${p.x}px`;
  flare.style.top = `${p.y - 6}px`;
  layer.appendChild(flare);

  setTimeout(() => {
    arc.remove();
    flare.remove();
  }, 900);
}


function spawnThunderStrikeFx(target){
  const layer = $("#effectLayer");
  if(!layer || !target) return;
  const p = battlefieldPointForUnit(target);

  const bolt = document.createElement("img");
  bolt.className = "thunder-strike-fx";
  bolt.src = "assets/effects/thunder_strike.png";
  bolt.style.left = `${p.x - 95}px`;
  bolt.style.top = `${p.y - 360}px`;
  layer.appendChild(bolt);

  const impact = document.createElement("div");
  impact.className = "thunder-impact-fx";
  impact.style.left = `${p.x}px`;
  impact.style.top = `${p.y - 8}px`;
  layer.appendChild(impact);

  screenShake();

  setTimeout(() => {
    bolt.remove();
    impact.remove();
  }, 1050);
}

function spawnSkyRaidFx(target, attacker=null){
  const layer = $("#effectLayer");
  if(!layer || !target) return;
  const p = battlefieldPointForUnit(target);
  const dir = attacker && attacker.side === "player" ? 1 : -1;

  const plane = document.createElement("img");
  plane.className = "sky-raid-plane-fx" + (dir < 0 ? " reverse" : "");
  plane.src = "assets/effects/amelia_plane.png";
  plane.style.top = `${Math.max(18, p.y - 210)}px`;
  plane.style.left = `${dir > 0 ? -420 : layer.clientWidth + 420}px`;
  layer.appendChild(plane);

  const bomb = document.createElement("img");
  bomb.className = "sky-raid-bomb-fx";
  bomb.src = "assets/effects/amelia_bomb.png";
  bomb.style.left = `${p.x - 26}px`;
  bomb.style.top = `${p.y - 190}px`;
  layer.appendChild(bomb);

  setTimeout(() => { bomb.classList.add("drop"); }, 260);

  setTimeout(() => {
    const blast = document.createElement("img");
    blast.className = "sky-raid-explosion-fx";
    blast.src = "assets/effects/amelia_explosion.png";
    blast.style.left = `${p.x - 155}px`;
    blast.style.top = `${p.y - 175}px`;
    layer.appendChild(blast);

    const flash = document.createElement("div");
    flash.className = "sky-raid-flash-fx";
    flash.style.left = `${p.x}px`;
    flash.style.top = `${p.y - 5}px`;
    layer.appendChild(flash);

    screenShake();

    setTimeout(() => {
      blast.remove();
      flash.remove();
    }, 900);
  }, 720);

  setTimeout(() => {
    plane.remove();
    bomb.remove();
  }, 1500);
}

function spawnSummonBearFx(target, attacker=null){
  const layer = $("#effectLayer");
  if(!layer || !target) return;
  const p = battlefieldPointForUnit(target);
  const dir = attacker && attacker.side === "player" ? 1 : -1;

  const bear = document.createElement("img");
  bear.className = "spirit-bear-charge-fx" + (dir < 0 ? " reverse" : "");
  bear.src = "assets/effects/spirit_bear_charge.png";
  bear.style.top = `${Math.max(18, p.y - 220)}px`;
  bear.style.left = `${dir > 0 ? -520 : layer.clientWidth + 520}px`;
  layer.appendChild(bear);

  const trail = document.createElement("div");
  trail.className = "spirit-bear-trail-fx";
  trail.style.left = `${p.x - 150}px`;
  trail.style.top = `${p.y - 40}px`;
  layer.appendChild(trail);

  requestAnimationFrame(() => {
    bear.style.opacity = "1";
    bear.style.left = `${dir > 0 ? p.x - 310 : p.x - 420}px`;
    bear.style.transform = `${dir < 0 ? "scaleX(-1) " : ""}scale(.92)`;
  });

  setTimeout(() => {
    const impact = document.createElement("div");
    impact.className = "spirit-bear-impact-fx";
    impact.style.left = `${p.x}px`;
    impact.style.top = `${p.y}px`;
    layer.appendChild(impact);
    screenShake();
    setTimeout(() => impact.remove(), 850);
  }, 520);

  setTimeout(() => {
    bear.remove();
    trail.remove();
  }, 980);
}

function showSpecialOverlay(mainText="SPECIAL ATTACK", subText="THIS IS SPARTA"){
  const overlay = $("#specialOverlay");
  if(!overlay) return Promise.resolve();
  const main = overlay.querySelector(".special-main");
  const sub = overlay.querySelector(".special-sub");
  if(main) main.textContent = mainText;
  if(sub) sub.textContent = subText;
  overlay.classList.remove("hidden");
  return new Promise(resolve => {
    setTimeout(() => {
      overlay.classList.add("hidden");
      resolve();
    }, 1750);
  });
}

function templarsOf(baldwin){
  if(!Battle || !baldwin) return [];
  return Battle.units.filter(u => u.alive && u.summonOnly && u.summonOwnerUid === baldwin.uid);
}

function makeTemplarSummon(baldwin, col, row, idx){
  const tpl = TEMPLAR_SUMMON_TEMPLATE;
  const p = gridToPercent(col, row, baldwin.side);
  return {
    uid: `${baldwin.uid}_templar_${idx}_${Date.now()}_${Math.floor(Math.random()*9999)}`,
    id: tpl.id,
    side: baldwin.side,
    index: 90 + idx,
    teamSize: baldwin.teamSize,
    gridCol: col,
    gridRow: row,
    x: p.x,
    y: p.y,
    scale: 0.88 - Math.abs(row - 2) * .02,
    row: (baldwin.side === "player" ? col >= 7 : col <= 2) ? "back" : "front",
    name: tpl.name,
    role: tpl.role,
    faction: tpl.faction,
    sprite: tpl.sprite,
    spriteFacing: tpl.spriteFacing,
    specialMove: null,
    superSprite: null,
    superSpriteFacing: tpl.spriteFacing,
    superForm: false,
    specialUsed: true,
    maxHp: tpl.maxHp,
    hp: tpl.maxHp,
    attack: tpl.attack,
    defense: tpl.defense,
    speed: tpl.speed,
    crit: tpl.crit,
    resistance: tpl.resistance,
    morale: tpl.morale,
    focus: 0,
    hasMovedThisTurn: false,
    moves: [],
    cooldowns: {},
    statuses: [{name:"guard", amount:18, duration:99}],
    alive: true,
    armor: tpl.armor,
    summonOnly: true,
    summonOwnerUid: baldwin.uid,
    summonTurns: baldwin.templarTurns || 3
  };
}

function holyGuardSpawnCells(baldwin, count=3){
  const forward = baldwin.side === "player" ? -1 : 1;
  const checks = [
    {col: baldwin.gridCol + forward, row: baldwin.gridRow},
    {col: baldwin.gridCol + forward, row: baldwin.gridRow - 1},
    {col: baldwin.gridCol + forward, row: baldwin.gridRow + 1},
    {col: baldwin.gridCol, row: baldwin.gridRow - 1},
    {col: baldwin.gridCol, row: baldwin.gridRow + 1},
    {col: baldwin.gridCol - forward, row: baldwin.gridRow},
    {col: baldwin.gridCol - forward, row: baldwin.gridRow - 1},
    {col: baldwin.gridCol - forward, row: baldwin.gridRow + 1}
  ];
  const res = [];
  for(const c of checks){
    if(res.length >= count) break;
    if(!inBounds(c.col,c.row)) continue;
    if(occupiedCell(c.col,c.row)) continue;
    if(res.some(x => x.col === c.col && x.row === c.row)) continue;
    res.push(c);
  }
  return res;
}

function updateTemplarDurations(baldwin){
  const guards = templarsOf(baldwin);
  if(!guards.length) return;
  if(typeof baldwin.templarTurns !== "number") baldwin.templarTurns = 0;
  baldwin.templarTurns = Math.max(0, baldwin.templarTurns - 1);
  guards.forEach(g => g.summonTurns = baldwin.templarTurns);
  if(baldwin.templarTurns <= 0){
    guards.forEach(g => { g.alive = false; g.hp = 0; });
    log(`<strong>Holy Guard fades.</strong> The Templar Knights vanish.`);
  }
}

function despawnTemplarsFor(baldwin){
  templarsOf(baldwin).forEach(g => { g.alive = false; g.hp = 0; });
  baldwin.templarTurns = 0;
}

function triggerTemplarAssist(baldwin, target){
  if(!baldwin || baldwin.id !== "baldwin_iv" || !target || !target.alive) return;
  const guards = templarsOf(baldwin).filter(g => gridDistance(g, target) <= 3).slice(0,3);
  guards.forEach((g, i) => {
    if(!target.alive) return;
    const mv = { id:"templar_assist", name:"Templar Assist", kind:"damage", target:"enemy", power:58, type:"slash", focus:0, __templarAssist:true };
    setTimeout(() => {
      if(!g.alive || !target.alive) return;
      animateHit(g, target, mv);
      applyDamage(g, target, mv);
      pop(g, "ASSIST", "status");
    }, 120 + i * 140);
  });
}

function sphinxesOf(cleo){
  if(!Battle || !cleo) return [];
  return Battle.units.filter(u => u.alive && u.id === "living_sphinx" && u.summonOnly && u.summonOwnerUid === cleo.uid);
}

function sphinxSpawnCell(cleo){
  const forward = cleo.side === "player" ? -1 : 1;
  const checks = [
    {col: cleo.gridCol + forward, row: cleo.gridRow},
    {col: cleo.gridCol + forward, row: cleo.gridRow - 1},
    {col: cleo.gridCol + forward, row: cleo.gridRow + 1},
    {col: cleo.gridCol, row: cleo.gridRow - 1},
    {col: cleo.gridCol, row: cleo.gridRow + 1},
    {col: cleo.gridCol - forward, row: cleo.gridRow}
  ];
  for(const c of checks){
    if(inBounds(c.col, c.row) && !occupiedCell(c.col, c.row)) return c;
  }
  return null;
}

function createSphinxUnit(cleo, cell){
  const p = gridToPercent(cell.col, cell.row);
  return {
    id: "living_sphinx",
    uid: "sphinx_" + Math.random().toString(36).slice(2,9),
    side: cleo.side,
    gridCol: cell.col,
    gridRow: cell.row,
    x: p.x,
    y: p.y,
    scale: 0.92 - Math.abs(cell.row - 2) * .02,
    row: (cleo.side === "player" ? cell.col >= 7 : cell.col <= 2) ? "back" : "front",
    name: "Living Sphinx",
    title: "Guardian of the Nile",
    role: "Mystic Beast",
    faction: "Egypt",
    sprite: "assets/sprites/living_sphinx.png",
    spriteFacing: "right",
    specialMove: null,
    maxHp: 920,
    hp: 920,
    attack: 112,
    defense: 86,
    speed: 63,
    crit: 8,
    resistance: 34,
    morale: 100,
    focus: 35,
    hasMovedThisTurn: false,
    moves: ["claw_of_the_dunes", "solar_pounce", "pharaoh_roar", "desert_judgement"],
    cooldowns: {},
    statuses: [],
    alive: true,
    armor: "Mystic",
    summonOnly: true,
    summonOwnerUid: cleo.uid,
    summonTurns: 0
  };
}

function shadowPietenOf(owner){
  if(!Battle || !owner) return [];
  return Battle.units.filter(u => u.alive && u.id === "shadow_piet" && u.summonOnly && u.summonOwnerUid === owner.uid);
}

function shadowPietSpawnCells(owner, count=3){
  const forward = owner.side === "player" ? -1 : 1;
  const checks = [
    {col: owner.gridCol + forward, row: owner.gridRow},
    {col: owner.gridCol + forward, row: owner.gridRow - 1},
    {col: owner.gridCol + forward, row: owner.gridRow + 1},
    {col: owner.gridCol, row: owner.gridRow - 1},
    {col: owner.gridCol, row: owner.gridRow + 1},
    {col: owner.gridCol - forward, row: owner.gridRow},
    {col: owner.gridCol - forward, row: owner.gridRow - 1},
    {col: owner.gridCol - forward, row: owner.gridRow + 1},
    {col: owner.gridCol + forward * 2, row: owner.gridRow},
    {col: owner.gridCol, row: owner.gridRow - 2},
    {col: owner.gridCol, row: owner.gridRow + 2}
  ];
  const res = [];
  for(const c of checks){
    if(res.length >= count) break;
    if(!inBounds(c.col,c.row)) continue;
    if(occupiedCell(c.col,c.row)) continue;
    if(res.some(x => x.col === c.col && x.row === c.row)) continue;
    res.push(c);
  }
  return res;
}

function createShadowPietUnit(owner, cell, idx=0){
  const p = gridToPercent(cell.col, cell.row, owner.side);
  return {
    id: "shadow_piet",
    uid: "piet_" + Math.random().toString(36).slice(2,9),
    side: owner.side,
    gridCol: cell.col,
    gridRow: cell.row,
    x: p.x,
    y: p.y,
    scale: 0.82 - Math.abs(cell.row - 2) * .018,
    row: (owner.side === "player" ? cell.col >= 7 : cell.col <= 2) ? "back" : "front",
    name: "Shadow Piet",
    title: "Dark Helper",
    role: "Weak Summon Fighter",
    faction: "Dark Holiday",
    sprite: "assets/sprites/shadow_piet.png",
    spriteFacing: "right",
    specialMove: null,
    maxHp: 620,
    hp: 620,
    attack: 76,
    defense: 36,
    speed: 64,
    crit: 9,
    resistance: 16,
    morale: 90,
    focus: 20,
    hasMovedThisTurn: false,
    moves: ["piet_dagger_slash", "piet_lantern_hex"],
    cooldowns: {},
    statuses: [],
    alive: true,
    armor: "Light",
    summonOnly: true,
    summonOwnerUid: owner.uid,
    summonTurns: 0
  };
}

async function activateSummonShadowPieten(owner){
  if(!owner || owner.id !== "dark_sinterklaas"){
    toast("This Special belongs to Dark Sinterklaas.");
    return false;
  }
  if(owner.focus < 100){
    toast("Need 100 Focus for Special Attack.");
    return false;
  }

  const existing = shadowPietenOf(owner).length;
  if(existing >= 3){
    toast("Three Shadow Pieten are already on the battlefield.");
    return false;
  }

  const missing = 3 - existing;
  const cells = shadowPietSpawnCells(owner, missing);
  if(!cells.length){
    toast("No space to summon Shadow Pieten.");
    return false;
  }

  owner.focus = 0;
  owner.specialUsed = false;
  addStatus(owner, "guard", 18, 2);
  addStatus(owner, "resist", 14, 2);

  await showSpecialOverlay("SPECIAL ATTACK", "SUMMON SHADOW PIETEN");

  cells.forEach((cell, idx) => {
    const piet = createShadowPietUnit(owner, cell, idx);
    Battle.units.push(piet);
    if(!Battle.queue.includes(piet.uid)) Battle.queue.push(piet.uid);
    setTimeout(() => {
      spawnFx("shadow", piet);
      pop(piet, "PIET", "status");
      renderBattle();
    }, 100 + idx * 130);
  });

  spawnFx("shadow", owner);
  spawnFx("shield", owner);
  pop(owner, `+${cells.length} PIETEN`, "status");
  log(`<strong>${owner.name}</strong> summons ${cells.length} <strong>Shadow Pieten</strong> to the field.`);
  renderBattle();
  return true;
}


async function activateSummonTheSphinx(cleo){
  if(!cleo || cleo.id !== "cleopatra"){
    toast("This Special belongs to Cleopatra.");
    return false;
  }
  if(cleo.focus < 100){
    toast("Need 100 Focus for Special Attack.");
    return false;
  }
  if(sphinxesOf(cleo).length){
    toast("The Sphinx is already on the battlefield.");
    return false;
  }

  const cell = sphinxSpawnCell(cleo);
  if(!cell){
    toast("No space to summon the Sphinx.");
    return false;
  }

  cleo.focus = 0;
  cleo.specialUsed = false;
  addStatus(cleo, "resist", 20, 3);
  addStatus(cleo, "rally", 12, 3);
  const ok = await showSpecialOverlay("SPECIAL ATTACK", "SUMMON THE SPHINX");
  if(ok !== undefined){}

  const sphinx = createSphinxUnit(cleo, cell);
  Battle.units.push(sphinx);

  // Give the Sphinx a real battle turn. It stays a summon for win-condition logic,
  // but it is inserted into the active turn queue as a combat unit.
  if(!Battle.queue.includes(sphinx.uid)){
    Battle.queue.push(sphinx.uid);
  }

  spawnFx("holy", sphinx);
  spawnFx("holy", cleo);
  pop(cleo, "SUMMON", "status");
  log(`<strong>Cleopatra</strong> summons the <strong>Living Sphinx</strong>!`);
  renderBattle();
  return true;
}



function lionsOf(owner){
  if(!Battle || !owner) return [];
  return Battle.units.filter(u => u.alive && u.id === "lion_king" && u.summonOnly && u.summonOwnerUid === owner.uid);
}

function lionSpawnCell(owner){
  const forward = owner.side === "player" ? -1 : 1;
  const checks = [
    {col: owner.gridCol + forward, row: owner.gridRow},
    {col: owner.gridCol + forward, row: owner.gridRow - 1},
    {col: owner.gridCol + forward, row: owner.gridRow + 1},
    {col: owner.gridCol, row: owner.gridRow - 1},
    {col: owner.gridCol, row: owner.gridRow + 1},
    {col: owner.gridCol - forward, row: owner.gridRow}
  ];
  for(const c of checks){
    if(inBounds(c.col, c.row) && !occupiedCell(c.col, c.row)) return c;
  }
  return null;
}

function createLionKingUnit(owner, cell){
  const p = gridToPercent(cell.col, cell.row);
  return {
    id: "lion_king",
    uid: "lion_" + Math.random().toString(36).slice(2,9),
    side: owner.side,
    gridCol: cell.col,
    gridRow: cell.row,
    x: p.x,
    y: p.y,
    scale: 0.93 - Math.abs(cell.row - 2) * .02,
    row: (owner.side === "player" ? cell.col >= 7 : cell.col <= 2) ? "back" : "front",
    name: "Lion King",
    title: "Pride Beast",
    role: "Beast Vanguard",
    faction: "Savanna Tribe",
    sprite: "assets/sprites/lion_king.png",
    spriteFacing: "right",
    specialMove: null,
    maxHp: 980,
    hp: 980,
    attack: 118,
    defense: 82,
    speed: 72,
    crit: 12,
    resistance: 24,
    morale: 100,
    focus: 35,
    hasMovedThisTurn: false,
    moves: ["royal_claw", "savanna_pounce", "king_roar", "pride_rampage"],
    cooldowns: {},
    statuses: [],
    alive: true,
    armor: "Beast",
    summonOnly: true,
    summonOwnerUid: owner.uid,
    summonTurns: 0
  };
}

async function activateSummonTheLionKing(owner){
  if(!owner || owner.id !== "african_tribe_warrior"){
    toast("This Special belongs to the African Tribe Warrior.");
    return false;
  }
  if(owner.focus < 100){
    toast("Need 100 Focus for Special Attack.");
    return false;
  }
  if(lionsOf(owner).length){
    toast("The Lion King is already on the battlefield.");
    return false;
  }

  const cell = lionSpawnCell(owner);
  if(!cell){
    toast("No space to summon the Lion King.");
    return false;
  }

  owner.focus = 0;
  owner.specialUsed = false;
  addStatus(owner, "guard", 18, 3);
  addStatus(owner, "rally", 14, 3);

  await showSpecialOverlay("SPECIAL ATTACK", "SUMMON THE LION KING");

  const lion = createLionKingUnit(owner, cell);
  Battle.units.push(lion);
  if(!Battle.queue.includes(lion.uid)){
    Battle.queue.push(lion.uid);
  }

  spawnFx("holy", lion);
  spawnFx("shield", owner);
  pop(owner, "LION KING", "status");
  log(`<strong>${owner.name}</strong> summons the <strong>Lion King</strong>!`);
  renderBattle();
  return true;
}


function activateHolyGuardOfJerusalem(baldwin){
  if(!baldwin || baldwin.id !== "baldwin_iv"){
    toast("This Special belongs to Baldwin IV.");
    return false;
  }
  if(baldwin.focus < 100){
    toast("Need 100 Focus for Special Attack.");
    return false;
  }

  baldwin.focus = 0;
  baldwin.specialUsed = false;
  baldwin.templarTurns = 3;

  addStatus(baldwin, "guard", 20, 3);
  addStatus(baldwin, "resist", 15, 3);
  addStatus(baldwin, "rally", 12, 3);
  baldwin.morale = Math.min(100, baldwin.morale + 12);

  const cells = holyGuardSpawnCells(baldwin, 3);
  cells.forEach((c, idx) => {
    const guard = makeTemplarSummon(baldwin, c.col, c.row, idx);
    Battle.units.push(guard);
    setTimeout(() => {
      renderBattle();
      spawnFx("templar", guard);
      spawnFx("shield", guard);
      pop(guard, "TEMPLAR", "status");
    }, 120 + idx * 120);
  });

  spawnFx("holy", baldwin);
  spawnFx("shield", baldwin);
  pop(baldwin, "HOLY GUARD", "status");
  log(`<strong>Holy Guard of Jerusalem!</strong> Baldwin IV summons ${cells.length} Templar Knights to protect the king.`);
  return true;
}


function activateEvilGnomeTransformation(gnome){
  if(!gnome || gnome.id !== "evil_gnome"){
    toast("This Special belongs to Evil Gnome.");
    return false;
  }
  if(gnome.superForm){
    toast("Evil Gnome is already transformed.");
    return false;
  }

  gnome.superForm = true;
  gnome.specialUsed = false;
  gnome.originalSprite = gnome.originalSprite || gnome.sprite;
  gnome.sprite = gnome.superSprite || "assets/sprites/evil_gnome_transformed.png";
  gnome.spriteFacing = gnome.superSpriteFacing || gnome.spriteFacing || "right";

  gnome.attack = Math.round(gnome.attack * 1.5);
  gnome.defense = Math.round(gnome.defense * 1.5);
  gnome.scale = Math.min(1.28, (gnome.scale || 1) * 1.20);
  gnome.morale = Math.min(100, gnome.morale + 15);

  addStatus(gnome, "rage", 24, 3);
  addStatus(gnome, "guard", 24, 3);

  log(`<strong>DARK GNOME TRANSFORMATION!</strong> Evil Gnome becomes larger and more dangerous. Attack and Defense rise by 50%.`);
  renderBattle();

  try {
    pop(gnome, "TRANSFORM", "status");
    spawnFx("shadow", gnome);
    spawnFx("shield", gnome);
    screenShake();
  } catch(e) {
    console.warn("Gnome transform FX skipped:", e);
  }

  return true;
}


function activateThisIsSparta(leonidas){
  if(!leonidas || leonidas.id !== "leonidas"){
    toast("This Special belongs to Leonidas.");
    return false;
  }
  if(leonidas.superForm){
    toast("Leonidas is already in Super Form.");
    return false;
  }

  leonidas.superForm = true;
  leonidas.specialUsed = true;
  leonidas.originalSprite = leonidas.originalSprite || leonidas.sprite;
  leonidas.sprite = leonidas.superSprite || "assets/sprites/leonidas_super.png";
  leonidas.spriteFacing = leonidas.superSpriteFacing || leonidas.spriteFacing || "left";

  leonidas.maxHp = Math.round(leonidas.maxHp * 1.5);
  leonidas.hp = Math.min(leonidas.maxHp, Math.max(1, Math.round(leonidas.hp * 1.5)));
  leonidas.attack = Math.round(leonidas.attack * 1.5);
  leonidas.defense = Math.round(leonidas.defense * 1.5);
  leonidas.resistance = Math.round(leonidas.resistance * 1.25);
  leonidas.morale = Math.min(100, leonidas.morale + 25);

  addStatus(leonidas, "rage", 35, 3);
  addStatus(leonidas, "guard", 35, 3);

  log(`<strong>THIS IS SPARTA!</strong> Leonidas transforms into Super Leonidas. HP, Attack and Defense rise by 50%.`);

  // Render once immediately so the new sprite is visible before shockwave damage.
  renderBattle();

  try {
    pop(leonidas, "SUPER FORM", "status");
    spawnFx("shadow", leonidas);
    spawnFx("shield", leonidas);
  } catch(e) {
    console.warn("Special visual FX skipped:", e);
  }

  const enemies = enemiesOf(leonidas);
  enemies.forEach(enemy => {
    const fakeMove = {
      id: "sparta_shockwave",
      name: "Spartan Shockwave",
      kind: "damage",
      target: "enemy",
      power: 155,
      type: "blunt",
      focus: 0
    };
    applyDamage(leonidas, enemy, fakeMove);
    if(enemy.alive && enemy.row === "front"){
      addStatus(enemy, "fear", 24, 2);
      pop(enemy, "FEAR", "status");
    }
  });

  screenShake();
  return true;
}

function toast(msg){
  const host = $("#toast");
  if(!host) return;
  const t = document.createElement("div");
  t.className = "toast-msg";
  t.textContent = msg;
  host.appendChild(t);
  setTimeout(() => t.remove(), 3500);
}

function renderTop(){
  const coin = $("#coinCount");
  const rank = $("#playerRank");
  if(coin) coin.textContent = SAVE ? SAVE.coins : 0;
  if(rank) rank.textContent = SAVE ? rankName() : "Bronze Arena Master";
}

function navTo(screen){
  $$(".screen").forEach(s => {
    s.classList.remove("active");
    s.style.display = "none";
    s.style.height = "0";
    s.style.overflow = "hidden";
  });

  const target = $("#" + screen);
  if(target){
    target.classList.add("active");
    target.style.display = "block";
    target.style.height = "auto";
    target.style.overflow = "visible";
  }

  $$(".nav-btn").forEach(b => b.classList.toggle("active", b.dataset.screen === screen));
  UI.currentScreen = screen;

  if(screen === "campaign") renderCampaign();
  if(screen === "freeBattle") renderBuilder();
  if(screen === "titanFights") renderTitanFights();
  if(screen === "gauntlet") renderGauntlet();
  if(screen === "shop") renderShop();
  if(screen === "warriors") renderWarriors();
  if(screen === "options") renderOptions();

  try { window.scrollTo({top: 0, left: 0, behavior: "auto"}); } catch(e) { window.scrollTo(0, 0); }
}



function playableWarriors(){
  return DATA.warriors.filter(w => !w.hidden && !w.isTitan && !w.summonOnly);
}

function gauntletPlayableUnlocked(){
  return playableWarriors().filter(w => isUnlocked(w.id));
}

function gauntletTeamFilled(){
  return Array.from({length:5}, (_,i) => !!UI.gauntletTeam[i]).every(Boolean);
}

function gauntletTeamSummary(team=UI.gauntletTeam){
  return team.filter(Boolean).map(id => warrior(id)?.name || id).join(", ");
}

function gauntletEnemyPresets(floor){
  const presets = {
    5: ["minotaur_gladiator","roman_centurion","viking_berserker","battle_priest","mongol_archer"],
    10: ["dark_sinterklaas","medusa","evil_gnome","plague_doctor","the_hooligan"],
    15: ["anubis_warrior","vlad","joan","ronin","battle_priest"],
    20: ["lucifer_demon_king","king_arthur","achilles","the_pope","merlin"],
    25: ["ground_dragon_titan"]
  };
  return (presets[floor] || []).filter(id => warrior(id));
}

function generateGauntletEnemies(floor){
  const preset = gauntletEnemyPresets(floor);
  if(preset.length) return preset.slice(0, 5);

  const count = Math.min(5, 2 + Math.floor((floor + 1) / 2));
  const maxCost = Math.min(6, 2 + Math.floor(floor / 3));
  const pool = playableWarriors()
    .filter(w => w.id !== "victor_wembanyama" || floor >= 8)
    .filter(w => w.id !== "dark_sinterklaas" || floor >= 9)
    .filter(w => w.id !== "lucifer_demon_king" || floor >= 12)
    .filter(w => w.cost <= maxCost + 1);

  const weighted = pool.slice().sort((a,b) => (Math.random() - .5) + ((b.cost - a.cost) * 0.08));
  const team = [];
  for(const w of weighted){
    if(team.length >= count) break;
    if(team.includes(w.id)) continue;
    if(w.cost > maxCost && Math.random() < .55) continue;
    team.push(w.id);
  }

  const fallback = ["viking_berserker","roman_centurion","mongol_archer","joan","battle_priest"].filter(id => warrior(id));
  for(const id of fallback){
    if(team.length >= count) break;
    if(!team.includes(id)) team.push(id);
  }
  return team.slice(0, count);
}

function newGauntletRun(team){
  const carry = {};
  team.forEach(id => {
    carry[id] = { hpRatio: 1, focus: 25 };
  });
  return {
    active: true,
    floor: 1,
    cleared: 0,
    team: team.slice(0,5),
    carry,
    buffs: { attackPct: 0, defensePct: 0 },
    revives: 0,
    awaitingReward: false,
    lastReward: null
  };
}

function livingGauntletIds(run=UI.gauntletRun){
  if(!run) return [];
  return run.team.filter(id => {
    const c = run.carry[id] || {hpRatio:1};
    return c.hpRatio > 0 || run.revives > 0;
  });
}

function gauntletCanContinue(){
  const run = UI.gauntletRun;
  if(!run) return false;
  return run.team.some(id => (run.carry[id]?.hpRatio ?? 1) > 0) || run.revives > 0;
}

function applyGauntletStartState(){
  if(!Battle || Battle.mode !== "gauntlet" || !UI.gauntletRun) return;
  const run = UI.gauntletRun;
  const floor = run.floor || 1;

  Battle.units.filter(u => u.side === "player" && !u.summonOnly).forEach(u => {
    const c = run.carry[u.id] || { hpRatio: 1, focus: 25 };
    if(c.hpRatio <= 0){
      if(run.revives > 0){
        run.revives--;
        c.hpRatio = .5;
        c.focus = Math.max(c.focus || 0, 35);
        run.carry[u.id] = c;
        toast(`${u.name} revived for the Gauntlet.`);
      } else {
        u.hp = 0;
        u.alive = false;
      }
    } else {
      u.hp = clamp(Math.round(u.maxHp * c.hpRatio), 1, u.maxHp);
      u.focus = clamp(c.focus ?? u.focus, 0, 100);
    }

    if(run.buffs.attackPct) u.attack = Math.round(u.attack * (1 + run.buffs.attackPct / 100));
    if(run.buffs.defensePct) u.defense = Math.round(u.defense * (1 + run.buffs.defensePct / 100));
  });

  Battle.units.filter(u => u.side === "enemy").forEach(u => {
    const hpMult = 1 + Math.min(.95, floor * .075);
    const atkMult = 1 + Math.min(.70, floor * .05);
    const defMult = 1 + Math.min(.55, floor * .035);
    u.maxHp = Math.round(u.maxHp * hpMult);
    u.hp = u.maxHp;
    u.attack = Math.round(u.attack * atkMult);
    u.defense = Math.round(u.defense * defMult);
    u.focus = clamp(u.focus + Math.min(38, floor * 3), 0, 100);
  });
}

function updateGauntletCarryFromBattle(){
  const run = UI.gauntletRun;
  if(!Battle || !run) return;
  run.team.forEach(id => {
    const u = Battle.units.find(x => x.side === "player" && x.id === id && !x.summonOnly);
    if(!u){
      run.carry[id] = run.carry[id] || { hpRatio: 0, focus: 0 };
      run.carry[id].hpRatio = 0;
      run.carry[id].focus = 0;
      return;
    }
    run.carry[id] = {
      hpRatio: u.alive ? clamp(u.hp / u.maxHp, 0, 1) : 0,
      focus: u.alive ? clamp(u.focus, 0, 100) : 0
    };
  });
}

function startGauntletRun(){
  if(!gauntletTeamFilled()){
    return toast("Fill 5 Gauntlet slots first.");
  }
  UI.gauntletRun = newGauntletRun(UI.gauntletTeam.slice(0,5));
  startGauntletFloor();
}

function startGauntletFloor(){
  const run = UI.gauntletRun;
  if(!run) return toast("Start a Gauntlet run first.");
  if(run.awaitingReward) return toast("Choose a reward first.");
  if(!gauntletCanContinue()){
    UI.gauntletRun = null;
    renderGauntlet();
    return toast("Gauntlet ended. Your team is down.");
  }

  const enemy = generateGauntletEnemies(run.floor);
  startBattle({
    mode: "gauntlet",
    title: `Gauntlet Floor ${run.floor}`,
    arena: run.floor % 5 === 0 ? "underworld_gate" : (run.floor % 3 === 0 ? "frozen_fjord" : "colosseum"),
    player: run.team.slice(0,5),
    enemy,
    difficulty: "gauntlet",
    gauntletFloor: run.floor
  });
}

function handleAfterGauntletBattle(won){
  const run = UI.gauntletRun;
  if(!run){
    Battle = null;
    navTo("gauntlet");
    return;
  }

  if(won){
    updateGauntletCarryFromBattle();
    run.cleared = Math.max(run.cleared || 0, Battle.gauntletFloor || run.floor);
    SAVE.wins++;
    SAVE.coins += 45 + Math.floor((Battle.gauntletFloor || run.floor) * 8);
    SAVE.rankPoints += 25 + Math.floor((Battle.gauntletFloor || run.floor) * 3);
    SAVE.gauntletBestFloor = Math.max(SAVE.gauntletBestFloor || 0, run.cleared);
    run.floor = run.cleared + 1;
    run.awaitingReward = true;
    toast(`Floor ${run.cleared} cleared. Choose a reward.`);
  } else {
    SAVE.losses++;
    SAVE.gauntletBestFloor = Math.max(SAVE.gauntletBestFloor || 0, run.cleared || 0);
    SAVE.coins += Math.max(20, (run.cleared || 0) * 15);
    SAVE.rankPoints += Math.max(0, (run.cleared || 0) * 5);
    UI.gauntletRun = null;
    toast("Gauntlet run ended.");
  }

  saveGame();
  Battle = null;
  renderAll();
  navTo("gauntlet");
}

function applyGauntletReward(type){
  const run = UI.gauntletRun;
  if(!run || !run.awaitingReward) return;
  const label = {
    heal25: "Team healed 25%",
    attack10: "+10% attack this run",
    defense10: "+10% defense this run",
    focus30: "+30 special meter",
    revive: "+1 revive"
  }[type] || "Reward";

  if(type === "heal25"){
    run.team.forEach(id => {
      const c = run.carry[id] || {hpRatio:0, focus:0};
      c.hpRatio = clamp((c.hpRatio || 0) + .25, 0, 1);
      run.carry[id] = c;
    });
  }
  if(type === "attack10") run.buffs.attackPct = (run.buffs.attackPct || 0) + 10;
  if(type === "defense10") run.buffs.defensePct = (run.buffs.defensePct || 0) + 10;
  if(type === "focus30"){
    run.team.forEach(id => {
      const c = run.carry[id] || {hpRatio:0, focus:0};
      if((c.hpRatio || 0) > 0) c.focus = clamp((c.focus || 0) + 30, 0, 100);
      run.carry[id] = c;
    });
  }
  if(type === "revive") run.revives = (run.revives || 0) + 1;

  run.lastReward = label;
  run.awaitingReward = false;
  saveGame();
  renderGauntlet();
  toast(label);
}

function renderGauntletSlots(){
  return Array.from({length:5}, (_,i) => {
    const id = UI.gauntletTeam[i];
    const w = id ? warrior(id) : null;
    return `
      <div class="fighter-slot ${id ? "" : "empty"} ${UI.gauntletActiveSlot === i ? "active" : ""}" data-gauntlet-slot="${i}">
        ${w ? `
          <div class="slot-name">${w.name}</div>
          <img src="${w.sprite}" alt="${w.name}">
          <div class="slot-index">${i + 1}</div>
          <button class="remove-slot-btn" type="button" data-gauntlet-remove="${i}">×</button>
        ` : `
          <div class="slot-plus">+</div>
          <div class="slot-index">${i + 1}</div>
        `}
      </div>
    `;
  }).join("");
}

function renderGauntletRoster(){
  const unlocked = gauntletPlayableUnlocked();
  return unlocked.map(w => {
    const chosen = UI.gauntletTeam.includes(w.id);
    return `
      <div class="fighter-pick-card ${chosen ? "in-player" : ""}" data-gauntlet-pick="${w.id}">
        <div class="pick-cost-badge">Cost ${w.cost}</div>
        <div class="pick-thumb"><img src="${w.sprite}" alt="${w.name}"></div>
        <div class="pick-info">
          <div class="pick-name">${w.name}</div>
          <div class="pick-tags">${w.faction} • ${w.role}</div>
          <div class="pick-status"><span>${w.rarity}</span>${chosen ? "<span>In Gauntlet Team</span>" : ""}</div>
          <div class="pick-card-actions"><button type="button">${chosen ? "Chosen" : "Add"}</button></div>
        </div>
      </div>
    `;
  }).join("");
}

function renderGauntletRunPanel(run){
  const carryHtml = run.team.map(id => {
    const w = warrior(id);
    const c = run.carry[id] || { hpRatio: 1, focus: 25 };
    const hpPct = Math.round((c.hpRatio || 0) * 100);
    return `
      <div class="gauntlet-carry-card ${hpPct <= 0 ? "dead" : ""}">
        <img src="${w.sprite}" alt="${w.name}">
        <div>
          <b>${w.name}</b>
          <span>HP ${hpPct}% • SP ${Math.round(c.focus || 0)}/100</span>
        </div>
      </div>
    `;
  }).join("");

  const rewardHtml = run.awaitingReward ? `
    <div class="gauntlet-rewards">
      <button data-gauntlet-reward="heal25">Heal team 25%</button>
      <button data-gauntlet-reward="attack10">+10% Attack</button>
      <button data-gauntlet-reward="defense10">+10% Defense</button>
      <button data-gauntlet-reward="focus30">Special meter +30</button>
      <button data-gauntlet-reward="revive">+1 Revive</button>
    </div>
  ` : `
    <button class="primary wide" id="gauntletNextFloorBtn">Start Floor ${run.floor}</button>
  `;

  return `
    <div class="gauntlet-status-card">
      <h3>Current Run</h3>
      <div class="gauntlet-big-number">Floor ${run.floor}</div>
      <p>Cleared: <b>${run.cleared || 0}</b> • Best: <b>${SAVE.gauntletBestFloor || 0}</b></p>
      <p>Attack Buff: <b>${run.buffs.attackPct || 0}%</b> • Defense Buff: <b>${run.buffs.defensePct || 0}%</b> • Revives: <b>${run.revives || 0}</b></p>
      ${run.lastReward ? `<p class="gauntlet-last">Last reward: ${run.lastReward}</p>` : ""}
      ${rewardHtml}
      <button class="secondary wide" id="gauntletEndRunBtn">End Run</button>
    </div>
    <div class="gauntlet-team-carry">${carryHtml}</div>
  `;
}

function renderGauntlet(){
  const panel = $("#gauntletPanel");
  if(!panel) return;

  const run = UI.gauntletRun;
  if(run && run.active){
    panel.innerHTML = renderGauntletRunPanel(run);
  } else {
    panel.innerHTML = `
      <div class="gauntlet-status-card">
        <h3>Start a Gauntlet Run</h3>
        <p>Kies 5 unlocked warriors. Je team blijft doorvechten door steeds sterkere floors. Na elke win kies je een reward.</p>
        <p>Best run: <b>Floor ${SAVE.gauntletBestFloor || 0}</b></p>
        <div class="gauntlet-slots">${renderGauntletSlots()}</div>
        <div class="gauntlet-actions">
          <button class="primary" id="gauntletStartBtn" ${gauntletTeamFilled() ? "" : "disabled"}>Start Gauntlet</button>
          <button class="secondary" id="gauntletRandomBtn">Random Team</button>
          <button class="secondary" id="gauntletClearBtn">Clear</button>
        </div>
      </div>
      <div class="gauntlet-roster">${renderGauntletRoster()}</div>
    `;
  }

  bindGauntletPanel();
}

function bindGauntletPanel(){
  const panel = $("#gauntletPanel");
  if(!panel) return;

  panel.querySelectorAll("[data-gauntlet-slot]").forEach(el => {
    el.addEventListener("click", () => {
      UI.gauntletActiveSlot = Number(el.dataset.gauntletSlot) || 0;
      renderGauntlet();
    });
  });

  panel.querySelectorAll("[data-gauntlet-remove]").forEach(btn => {
    btn.addEventListener("click", (ev) => {
      ev.preventDefault();
      ev.stopPropagation();
      const idx = Number(btn.dataset.gauntletRemove);
      UI.gauntletTeam[idx] = null;
      renderGauntlet();
    });
  });

  panel.querySelectorAll("[data-gauntlet-pick]").forEach(card => {
    card.addEventListener("click", () => {
      const id = card.dataset.gauntletPick;
      if(UI.gauntletTeam.includes(id)) return toast("Already in Gauntlet team.");
      UI.gauntletTeam[UI.gauntletActiveSlot || 0] = id;
      UI.gauntletActiveSlot = Math.min(4, (UI.gauntletActiveSlot || 0) + 1);
      renderGauntlet();
    });
  });

  panel.querySelectorAll("[data-gauntlet-reward]").forEach(btn => {
    btn.addEventListener("click", () => applyGauntletReward(btn.dataset.gauntletReward));
  });

  const start = $("#gauntletStartBtn");
  if(start) start.addEventListener("click", startGauntletRun);

  const next = $("#gauntletNextFloorBtn");
  if(next) next.addEventListener("click", startGauntletFloor);

  const random = $("#gauntletRandomBtn");
  if(random) random.addEventListener("click", () => {
    const pool = gauntletPlayableUnlocked().sort(() => Math.random() - .5).slice(0,5);
    UI.gauntletTeam = pool.map(w => w.id);
    UI.gauntletActiveSlot = 0;
    renderGauntlet();
  });

  const clear = $("#gauntletClearBtn");
  if(clear) clear.addEventListener("click", () => {
    UI.gauntletTeam = [];
    UI.gauntletActiveSlot = 0;
    renderGauntlet();
  });

  const end = $("#gauntletEndRunBtn");
  if(end) end.addEventListener("click", () => {
    if(confirm("End this Gauntlet run?")){
      UI.gauntletRun = null;
      renderGauntlet();
      toast("Gauntlet run ended.");
    }
  });
}

function initGauntlet(){
  renderGauntlet();
}


function allUnlockableWarriorIds(){
  return DATA.warriors
    .filter(w => !w.hidden && !w.isTitan && !w.summonOnly)
    .map(w => w.id);
}

function unlockAllCharactersFromCode(){
  const allIds = allUnlockableWarriorIds();
  allIds.forEach(id => {
    if(!SAVE.unlocked.includes(id)) SAVE.unlocked.push(id);
  });

  // Mark campaign chapters complete too, otherwise campaign-locked rewards could be removed by future migrations.
  DATA.campaign.forEach(c => {
    if(c.id && !SAVE.completedCampaign.includes(c.id)) SAVE.completedCampaign.push(c.id);
  });

  SAVE.unlocked = [...new Set(SAVE.unlocked.filter(Boolean))];
  SAVE.completedCampaign = [...new Set(SAVE.completedCampaign.filter(Boolean))];
  saveGame();
  renderAll();
  renderOptions();
  toast("Admin code accepted: all characters unlocked.");
}

function applyAdminCode(rawCode){
  const code = String(rawCode || "").trim().toLowerCase();
  const result = $("#codeResult");

  if(!code){
    if(result) result.textContent = "Enter a code first.";
    toast("Enter a code first.");
    return;
  }

  if(code === "admin01"){
    unlockAllCharactersFromCode();
    if(result) result.textContent = "admin01 accepted — all characters unlocked.";
    const input = $("#codeInput");
    if(input) input.value = "";
    return;
  }

  if(result) result.textContent = "Unknown code.";
  toast("Unknown code.");
}

function renderOptions(){
  const info = $("#optionsSaveInfo");
  if(info){
    const total = allUnlockableWarriorIds().length;
    const unlocked = allUnlockableWarriorIds().filter(id => SAVE.unlocked.includes(id)).length;
    info.innerHTML = `
      <div><b>Coins:</b> ${SAVE.coins}</div>
      <div><b>Rank:</b> ${rankName()} (${SAVE.rankPoints} pts)</div>
      <div><b>Unlocked:</b> ${unlocked}/${total} warriors</div>
      <div><b>Campaign:</b> ${SAVE.completedCampaign.length}/${DATA.campaign.length} chapters completed</div>
      <div><b>Wins/Losses:</b> ${SAVE.wins || 0}/${SAVE.losses || 0}</div>
    `;
  }

  const input = $("#codeInput");
  const apply = $("#applyCodeBtn");
  if(apply && !apply.dataset.bound){
    apply.dataset.bound = "true";
    apply.addEventListener("click", () => applyAdminCode(input ? input.value : ""));
  }
  if(input && !input.dataset.bound){
    input.dataset.bound = "true";
    input.addEventListener("keydown", (ev) => {
      if(ev.key === "Enter") applyAdminCode(input.value);
    });
  }

  const reset = $("#optionsResetBtn");
  if(reset && !reset.dataset.bound){
    reset.dataset.bound = "true";
    reset.addEventListener("click", () => {
      if(confirm("Reset je save, coins, wins en unlocks?")){
        SAVE = DefaultSave();
        saveGame();
        UI.playerTeam = [];
        UI.enemyTeam = [];
        renderAll();
        renderOptions();
        toast("Save reset.");
      }
    });
  }
}


function initNav(){
  $$(".nav-btn[data-screen]").forEach(btn => {
    btn.addEventListener("click", () => navTo(btn.dataset.screen));
  });

  $$("[data-go]").forEach(btn => {
    btn.addEventListener("click", () => navTo(btn.dataset.go));
  });

  const reset = $("#resetBtn");
  if(reset){
    reset.addEventListener("click", () => {
      if(confirm("Reset je save, coins, wins en unlocks?")) {
        SAVE = DefaultSave();
        saveGame();
        UI.playerTeam = [];
        UI.enemyTeam = [];
        renderAll();
        toast("Save reset.");
      }
    });
  }
}

function badge(text){ return `<span class="badge">${text}</span>`; }

function renderHome(){
  const pick = warrior("leonidas");
  const box = $("#featuredWarrior");
  if(!box || !pick) return;
  box.innerHTML = `
    <img src="${pick.sprite}" alt="${pick.name}">
    <div class="featured-info"><b>${pick.name}</b><br><small>${pick.role}</small></div>
  `;
}


function isCampaignChapterLocked(idx){
  if(idx <= 0) return false;
  return !SAVE.completedCampaign.includes(DATA.campaign[idx - 1].id);
}

function campaignLockedReason(idx){
  if(idx > 0 && !SAVE.completedCampaign.includes(DATA.campaign[idx - 1].id)){
    return `Complete ${DATA.campaign[idx - 1].title} first`;
  }
  return "";
}

function renderCampaign(){
  const list = $("#campaignList");
  if(!list) return;
  list.innerHTML = "";
  DATA.campaign.forEach((c, idx) => {
    const done = SAVE.completedCampaign.includes(c.id);
    const locked = isCampaignChapterLocked(idx);
    const reward = warrior(c.reward);
    const card = document.createElement("article");
    card.className = "campaign-card";
    card.style.backgroundImage = `url(assets/arenas/${c.arena}.svg)`;
    card.innerHTML = `
      <h3>${c.title}</h3>
      <div class="badges">
        ${badge(c.actName || ("Act " + (c.act || 1)))}
        ${badge(c.difficulty || "Normal")}
        ${badge(c.size + "v" + c.size)}
        ${badge(done ? "Completed" : locked ? "Locked" : "Open")}
      </div>
      <p>${c.desc}</p>
      <p><b>Reward:</b> ${reward ? reward.name : c.reward}</p>
      <p><b>Win:</b> +${c.rewardCoins || 150} coins, +${c.rewardRank || 70} rank</p>
      ${locked ? `<p><b>Locked:</b> ${campaignLockedReason(idx)}</p>` : ""}
      <button class="${locked ? "secondary" : "primary"} wide" ${locked ? "disabled" : ""}>${done ? "Replay / Choose Team" : "Choose Team"}</button>
    `;
    card.querySelector("button").addEventListener("click", () => openCampaignTeamSelect(c));
    list.appendChild(card);
  });
}

function factions(){
  return [...new Set(DATA.warriors.filter(w => !w.hidden && !w.isTitan).map(w => w.faction))].sort();
}

function roles(){
  return [...new Set(DATA.warriors.filter(w => !w.hidden && !w.isTitan).map(w => w.role))].sort();
}

function renderFilters(){
  const f = $("#filterFaction");
  const r = $("#filterRole");
  const s = $("#filterSearch");
  if(!f || !r) return;
  if(f.options.length <= 1){
    factions().forEach(x => f.insertAdjacentHTML("beforeend", `<option value="${x}">${x}</option>`));
    roles().forEach(x => r.insertAdjacentHTML("beforeend", `<option value="${x}">${x}</option>`));
    f.addEventListener("change", renderPickRoster);
    r.addEventListener("change", renderPickRoster);
    if(s) s.addEventListener("input", renderPickRoster);
  }
}

function syncSize(){
  const sel = $("#battleSize");
  UI.battleSize = sel ? Number(sel.value) : UI.battleSize;
  const limit = $("#teamLimit");
  if(limit) limit.textContent = teamLimit();
  UI.playerTeam = UI.playerTeam.slice(0, UI.battleSize);
  UI.enemyTeam = UI.enemyTeam.slice(0, UI.battleSize);
}

function teamLimit(){
  return 5 + UI.battleSize * 3;
}

function teamCost(team){
  return team.reduce((sum, id) => sum + (warrior(id)?.cost || 0), 0);
}

function teamFilled(team){
  return Array.from({length:UI.battleSize}, (_,i) => !!team[i]).every(Boolean);
}

function assignWarriorToSide(side, warriorId){
  const arr = side === "player" ? UI.playerTeam : UI.enemyTeam;
  const idx = side === "player" ? UI.playerActiveSlot : UI.enemyActiveSlot;
  if(idx >= UI.battleSize) return toast("No valid slot selected.");

  const existing = arr[idx] || null;
  if(arr.some((id, i) => i !== idx && id === warriorId)){
    return toast("No duplicate warriors in one team.");
  }

  const nextTeam = arr.slice(0, UI.battleSize);
  nextTeam[idx] = warriorId;

  if(side === "player" && teamCost(nextTeam.filter(Boolean)) > teamLimit()){
    return toast("Team cost too high. Use cheaper warriors.");
  }

  arr[idx] = warriorId;
  if(side === "player") UI.hoverWarriorId = warriorId;
  renderBuilder();
}

function previewWarriorId(side){
  const activeIdx = side === "player" ? UI.playerActiveSlot : UI.enemyActiveSlot;
  const team = side === "player" ? UI.playerTeam : UI.enemyTeam;
  return team[activeIdx] || team.find(Boolean) || UI.hoverWarriorId || null;
}

function buildPreviewCard(id, side){
  if(!id){
    return `<div class="preview-empty">
      <div>
        <h4>${side === "player" ? "Choose Your Fighter" : "Choose the Opponent"}</h4>
        <p>Select a warrior from the roster and place them into a team slot.</p>
      </div>
    </div>`;
  }

  const w = warrior(id);
  if(!w) return `<div class="preview-empty">No warrior data.</div>`;
  const bars = [
    ["Power", w.stats.attack],
    ["Speed", w.stats.speed],
    ["Defense", w.stats.defense],
    ["Skill", Math.round((w.stats.crit * 2) + w.stats.resistance + (w.stats.morale / 2))]
  ];
  const maxStat = 160;

  return `
    <div class="preview-title">
      <div>
        <h4>${w.title || w.name}</h4>
        <div class="preview-name">${w.name}</div>
        <div class="preview-sub">${w.faction} • ${w.role}</div>
      </div>
      <div class="preview-cost">Cost ${w.cost}</div>
    </div>
    <div class="preview-art"><img src="${w.sprite}" alt="${w.name}"></div>
    <div class="preview-bars">
      ${bars.map(([label,val]) => `
        <div class="preview-bar">
          <span>${label}</span>
          <div class="preview-bar-track"><div class="preview-bar-fill" style="width:${Math.min(100, (val / maxStat) * 100)}%"></div></div>
        </div>
      `).join("")}
    </div>
    <div class="preview-passive">
      <b>${w.passive?.name || "Warrior Passive"}</b>
      <div>${w.passive?.description || "No passive description."}</div>
    </div>
  `;
}

function renderPreviewPanels(){
  const playerCard = $("#playerPreviewCard");
  const enemyCard = $("#enemyPreviewCard");
  if(playerCard) playerCard.innerHTML = buildPreviewCard(previewWarriorId("player"), "player");
  if(enemyCard) enemyCard.innerHTML = buildPreviewCard(previewWarriorId("enemy"), "enemy");

  const arenaLabel = $("#builderArenaLabel");
  const sizeLabel = $("#builderSizeLabel");
  const diffLabel = $("#builderDifficultyLabel");
  const costLabel = $("#builderTeamCost");
  const limitLabel = $("#builderTeamLimit");
  const arenaSel = $("#arenaSelect");
  const diffSel = $("#difficulty");

  if(arenaLabel && arenaSel) arenaLabel.textContent = arenaSel.options[arenaSel.selectedIndex]?.textContent || "Roman Colosseum";
  if(sizeLabel) sizeLabel.textContent = `${UI.battleSize}v${UI.battleSize} ${UI.battleSize === 1 ? "Duel" : UI.battleSize === 2 ? "Skirmish" : UI.battleSize === 3 ? "Tactical" : UI.battleSize === 4 ? "Warband" : "Grand Arena"}`;
  if(diffLabel && diffSel) diffLabel.textContent = diffSel.options[diffSel.selectedIndex]?.textContent || "Normal";
  if(costLabel) costLabel.textContent = teamCost(UI.playerTeam.filter(Boolean));
  if(limitLabel) limitLabel.textContent = teamLimit();
}

function renderSlots(){
  const ps = $("#playerSlots");
  const es = $("#enemySlots");
  if(!ps || !es) return;
  ps.innerHTML = "";
  es.innerHTML = "";

  const makeSlot = (side, idx, id) => {
    const slot = document.createElement("div");
    const active = side === "player" ? UI.playerActiveSlot === idx : UI.enemyActiveSlot === idx;
    slot.className = "fighter-slot" + (id ? "" : " empty") + (active ? " active" : "") + (side === "enemy" && active ? " enemy-active" : "");
    slot.dataset.side = side;
    slot.dataset.index = idx;

    slot.addEventListener("click", () => {
      if(side === "player") UI.playerActiveSlot = idx;
      else UI.enemyActiveSlot = idx;
      UI.hoverWarriorId = id || null;
      renderBuilder();
    });

    if(!id){
      slot.innerHTML = `
        <div class="slot-plus">+</div>
        <div class="slot-index">${idx + 1}</div>
      `;
      return slot;
    }

    const w = warrior(id);
    slot.innerHTML = `
      <div class="slot-name">${w.name}</div>
      <img src="${w.sprite}" alt="${w.name}">
      <div class="slot-index">${idx + 1}</div>
      <button class="remove-slot-btn" type="button" title="Remove">×</button>
    `;

    slot.querySelector(".remove-slot-btn").addEventListener("click", (ev) => {
      ev.preventDefault();
      ev.stopPropagation();
      const arr = side === "player" ? UI.playerTeam : UI.enemyTeam;
      arr[idx] = null;
      while(arr.length && !arr[arr.length - 1]) arr.pop();
      renderBuilder();
    });

    return slot;
  };

  for(let i = 0; i < UI.battleSize; i++){
    ps.appendChild(makeSlot("player", i, UI.playerTeam[i]));
    es.appendChild(makeSlot("enemy", i, UI.enemyTeam[i]));
  }

  const cost = $("#teamCost");
  if(cost) cost.textContent = teamCost(UI.playerTeam.filter(Boolean));
}

function renderPickRoster(){
  const box = $("#pickRoster");
  if(!box) return;

  const faction = $("#filterFaction")?.value || "all";
  const role = $("#filterRole")?.value || "all";
  const search = ($("#filterSearch")?.value || "").trim().toLowerCase();
  box.innerHTML = "";

  DATA.warriors
    .filter(w => !w.hidden && !w.isTitan)
    .filter(w => faction === "all" || w.faction === faction)
    .filter(w => role === "all" || w.role === role)
    .filter(w => !search || [w.name, w.title, w.faction, w.role, w.rarity].join(" ").toLowerCase().includes(search))
    .forEach(w => {
      const locked = !isUnlocked(w.id);
      const inPlayer = UI.playerTeam.includes(w.id);
      const inEnemy = UI.enemyTeam.includes(w.id);

      const card = document.createElement("div");
      card.className = "fighter-pick-card" + (locked ? " locked" : "") + (inPlayer ? " in-player" : "") + (inEnemy ? " in-enemy" : "");
      card.innerHTML = `
        <div class="pick-cost-badge">Cost ${w.cost}</div>
        <div class="pick-thumb"><img src="${w.sprite}" alt="${w.name}"></div>
        <div class="pick-info">
          <div class="pick-name">${w.name}</div>
          <div class="pick-tags">${w.faction} • ${w.role}${locked ? " • Locked" : ""}</div>
          <div class="pick-status">
            <span>${w.rarity}</span>
            ${inPlayer ? `<span>On Your Team</span>` : ""}
            ${inEnemy ? `<span>Enemy Team</span>` : ""}
          </div>
          <div class="pick-card-actions">
            <button type="button" class="add-yours" ${locked ? "disabled" : ""}>Add Yours</button>
            <button type="button" class="add-enemy">Add Enemy</button>
          </div>
        </div>
      `;

      card.addEventListener("mouseenter", () => {
        UI.hoverWarriorId = w.id;
        const activeSide = document.activeElement?.dataset?.side;
        renderPreviewPanels();
      });

      const [btnPlayer, btnEnemy] = card.querySelectorAll("button");
      btnPlayer.addEventListener("click", (ev) => {
        ev.preventDefault();
        ev.stopPropagation();
        if(locked) return;
        assignWarriorToSide("player", w.id);
      });
      btnEnemy.addEventListener("click", (ev) => {
        ev.preventDefault();
        ev.stopPropagation();
        assignWarriorToSide("enemy", w.id);
      });

      box.appendChild(card);
    });
}

function renderBuilder(){
  renderFilters();
  syncSize();
  renderSlots();
  renderPickRoster();
  renderPreviewPanels();
}

function randomFairTeams(){
  syncSize();
  const unlocked = DATA.warriors.filter(w => isUnlocked(w.id));
  const fairPool = unlocked.length >= UI.battleSize ? unlocked : DATA.warriors.filter(w => w.cost <= 4);

  function pick(pool, enforceCost){
    const team = [];
    const shuffled = pool.slice().sort(() => Math.random() - .5);
    for(const w of shuffled){
      if(team.length >= UI.battleSize) break;
      if(team.includes(w.id)) continue;
      if(enforceCost && teamCost([...team, w.id]) > teamLimit()) continue;
      team.push(w.id);
    }
    return team;
  }

  UI.playerTeam = pick(unlocked, true);
  UI.enemyTeam = pick(fairPool, true);

  if(UI.enemyTeam.length < UI.battleSize){
    const fillers = fairPool.filter(w => !UI.enemyTeam.includes(w.id)).sort((a,b) => a.cost - b.cost);
    for(const w of fillers){
      if(UI.enemyTeam.length >= UI.battleSize) break;
      if(teamCost([...UI.enemyTeam, w.id]) <= teamLimit()) UI.enemyTeam.push(w.id);
    }
  }

  renderBuilder();
  toast("Fair teams generated: enemy now respects team cost and your unlocked tier.");
}

function initBuilder(){
  const battleSize = $("#battleSize");
  if(battleSize) battleSize.addEventListener("change", () => {
    syncSize();
    UI.playerActiveSlot = Math.min(UI.playerActiveSlot, UI.battleSize - 1);
    UI.enemyActiveSlot = Math.min(UI.enemyActiveSlot, UI.battleSize - 1);
    renderBuilder();
  });

  const arena = $("#arenaSelect");
  if(arena) arena.addEventListener("change", renderBuilder);

  const diff = $("#difficulty");
  if(diff) diff.addEventListener("change", renderBuilder);

  const randomBtn = $("#randomTeamsBtn");
  if(randomBtn) randomBtn.addEventListener("click", randomFairTeams);

  const clearBtn = $("#clearTeamsBtn");
  if(clearBtn) clearBtn.addEventListener("click", () => {
    UI.playerTeam = [];
    UI.enemyTeam = [];
    UI.playerActiveSlot = 0;
    UI.enemyActiveSlot = 0;
    UI.hoverWarriorId = null;
    renderBuilder();
  });

  const start = $("#startFreeBattleBtn");
  if(start) start.addEventListener("click", () => {
    syncSize();
    if(!teamFilled(UI.playerTeam) || !teamFilled(UI.enemyTeam)) {
      return toast("Fill every slot on both teams first.");
    }
    startBattle({
      mode: "free",
      title: `Free Battle ${UI.battleSize}v${UI.battleSize}`,
      arena: $("#arenaSelect")?.value || "colosseum",
      player: UI.playerTeam.slice(0, UI.battleSize),
      enemy: UI.enemyTeam.slice(0, UI.battleSize),
      difficulty: $("#difficulty")?.value || "normal"
    });
  });
}

function renderWarriors(){
  const grid = $("#warriorGrid");
  if(!grid) return;
  grid.innerHTML = "";

  DATA.warriors.filter(w => !w.hidden && !w.isTitan).forEach(w => {
    const locked = !isUnlocked(w.id);
    const movesHtml = w.moves.map(m => {
      const mv = move(m);
      return `<div><b>${mv.name}</b> — ${mv.desc}</div>`;
    }).join("");

    const role = broadRoleFromText(w.role);
    const counters = ROLE_COUNTERS[role] || { strong: [], weak: [] };

    const card = document.createElement("article");
    card.className = "warrior-card" + (locked ? " locked" : "");
    card.innerHTML = `
      <div class="portrait"><img src="${w.sprite}" alt="${w.name}"></div>
      <h3>${locked ? "Locked Warrior" : w.name}</h3>
      <div class="badges">${badge(w.rarity)}${badge(w.faction)}${badge("Cost " + w.cost)}${badge(role)}</div>
      <p>${w.title} — ${w.role}</p>
      <div class="mini-stats">
        <span>HP ${w.stats.hp}</span><span>ATK ${w.stats.attack}</span><span>DEF ${w.stats.defense}</span>
        <span>SPD ${w.stats.speed}</span><span>CRIT ${w.stats.crit}%</span><span>RES ${w.stats.resistance}</span>
      </div>
      <small><b>Strong vs:</b> ${counters.strong.join(", ") || "Neutral"}</small><br>
      <small><b>Weak vs:</b> ${counters.weak.join(", ") || "Neutral"}</small><br>
      <small><b>Passive:</b> ${w.passive.name} — ${w.passive.description}</small>
      <div class="move-list">${locked ? "<div>Unlock through Campaign.</div>" : movesHtml}</div>
    `;
    grid.appendChild(card);
  });
}

function campaignChapterById(id){
  return DATA.campaign.find(c => c.id === id);
}

function openCampaignTeamSelect(chapter){
  if(!chapter) return;
  UI.campaignChapterId = chapter.id;
  UI.campaignActiveSlot = 0;
  UI.campaignTeam = UI.campaignTeam.filter(id => isUnlocked(id)).slice(0, chapter.size);

  const unlocked = DATA.warriors
    .filter(w => isUnlocked(w.id))
    .sort((a,b) => (b.cost - a.cost) || ((b.stats.hp/20 + b.stats.attack + b.stats.defense) - (a.stats.hp/20 + a.stats.attack + a.stats.defense)))
    .map(w => w.id);

  if(UI.campaignTeam.filter(Boolean).length < chapter.size){
    UI.campaignTeam = unlocked.slice(0, chapter.size);
  }

  if(unlocked.length < chapter.size){
    toast(`You need ${chapter.size} unlocked warriors for this chapter.`);
  }

  const panel = $("#campaignTeamSelect");
  if(panel) panel.classList.remove("hidden");

  renderCampaignTeamSelect();
}

function closeCampaignTeamSelect(){
  const panel = $("#campaignTeamSelect");
  if(panel) panel.classList.add("hidden");
  UI.campaignChapterId = null;
  UI.campaignTeam = [];
  UI.campaignActiveSlot = 0;
}

function campaignTeamFilled(chapter){
  return Array.from({length: chapter.size}, (_,i) => !!UI.campaignTeam[i]).every(Boolean);
}

function autoFillCampaignTeam(){
  const chapter = campaignChapterById(UI.campaignChapterId);
  if(!chapter) return;
  const unlocked = DATA.warriors
    .filter(w => isUnlocked(w.id))
    .sort((a,b) => (b.cost - a.cost) || (b.stats.attack + b.stats.defense + b.stats.hp/20) - (a.stats.attack + a.stats.defense + a.stats.hp/20))
    .map(w => w.id);
  UI.campaignTeam = unlocked.slice(0, chapter.size);
  UI.campaignActiveSlot = Math.min(UI.campaignActiveSlot, chapter.size - 1);
  renderCampaignTeamSelect();
}

function assignCampaignWarrior(id){
  const chapter = campaignChapterById(UI.campaignChapterId);
  if(!chapter) return;
  if(!isUnlocked(id)) return toast("This warrior is locked.");
  if(UI.campaignTeam.some((x,i) => x === id && i !== UI.campaignActiveSlot)){
    return toast("No duplicate warriors in one team.");
  }
  UI.campaignTeam[UI.campaignActiveSlot] = id;
  renderCampaignTeamSelect();
}

function removeCampaignSlot(idx){
  UI.campaignTeam[idx] = null;
  while(UI.campaignTeam.length && !UI.campaignTeam[UI.campaignTeam.length - 1]) UI.campaignTeam.pop();
  UI.campaignActiveSlot = idx;
  renderCampaignTeamSelect();
}

function renderCampaignTeamSelect(){
  const chapter = campaignChapterById(UI.campaignChapterId);
  if(!chapter) return;

  const title = $("#campaignSelectTitle");
  const desc = $("#campaignSelectDesc");
  const size = $("#campaignSelectSize");
  const arena = $("#campaignSelectArena");
  const reward = $("#campaignSelectReward");
  const playerSlots = $("#campaignPlayerSlots");
  const enemyPreview = $("#campaignEnemyPreview");
  const roster = $("#campaignUnlockedRoster");

  if(title) title.textContent = chapter.title;
  if(desc) desc.textContent = chapter.desc;
  if(size) size.textContent = `${chapter.size}v${chapter.size}`;
  if(arena) arena.textContent = ArenaNames[chapter.arena] || chapter.arena;
  if(reward) reward.textContent = warrior(chapter.reward)?.name || chapter.reward;

  if(playerSlots){
    playerSlots.innerHTML = "";
    for(let i=0;i<chapter.size;i++){
      const id = UI.campaignTeam[i];
      const w = id ? warrior(id) : null;
      const slot = document.createElement("div");
      slot.className = "campaign-slot" + (id ? "" : " empty") + (UI.campaignActiveSlot === i ? " active" : "");
      slot.addEventListener("click", () => {
        UI.campaignActiveSlot = i;
        renderCampaignTeamSelect();
      });
      if(w){
        slot.innerHTML = `
          <img src="${w.sprite}" alt="${w.name}">
          <b>${w.name}</b>
          <button class="remove-slot-btn" type="button">×</button>
        `;
        slot.querySelector("button").addEventListener("click", (ev) => {
          ev.preventDefault();
          ev.stopPropagation();
          removeCampaignSlot(i);
        });
      }
      playerSlots.appendChild(slot);
    }
  }

  if(enemyPreview){
    enemyPreview.innerHTML = chapter.enemy.slice(0, chapter.size).map(id => {
      const w = warrior(id);
      if(!w) return "";
      return `
        <div class="campaign-enemy-card">
          <img src="${w.sprite}" alt="${w.name}">
          <b>${w.name}</b>
          <small>${w.role} • Cost ${w.cost}</small>
        </div>
      `;
    }).join("");
  }

  if(roster){
    roster.innerHTML = DATA.warriors
      .filter(w => isUnlocked(w.id))
      .map(w => {
        const selected = UI.campaignTeam.includes(w.id);
        return `
          <div class="campaign-pick-card ${selected ? "selected" : ""}" data-id="${w.id}">
            <span>Cost ${w.cost}</span>
            <img src="${w.sprite}" alt="${w.name}">
            <b>${w.name}</b>
            <small>${w.faction} • ${w.role}</small>
          </div>
        `;
      }).join("");

    roster.querySelectorAll("[data-id]").forEach(card => {
      card.addEventListener("click", () => assignCampaignWarrior(card.dataset.id));
    });
  }
}

function startCampaignBattle(chapter){
  if(!chapter) return;

  if(!campaignTeamFilled(chapter)){
    autoFillCampaignTeam();
  }

  const team = UI.campaignTeam.slice(0, chapter.size).filter(Boolean);

  if(team.length < chapter.size || !campaignTeamFilled(chapter)){
    return toast(`Choose ${chapter.size} unlocked warriors for this chapter.`);
  }

  if(team.some(id => !isUnlocked(id))){
    return toast("Your team contains locked warriors.");
  }

  closeCampaignTeamSelect();

  startBattle({
    mode: "campaign",
    chapterId: chapter.id,
    reward: chapter.reward,
    title: chapter.title,
    arena: chapter.arena,
    player: team,
    enemy: chapter.enemy.slice(0, chapter.size),
    difficulty: chapter.id === "c6" || chapter.id === "c9" || chapter.id === "c13" ? "hard" : "normal"
  });
}

function broadRoleFromText(role){
  const r = role || "";
  if(r.includes("Tank")) return "Tank";
  if(r.includes("Vanguard")) return "Vanguard";
  if(r.includes("Duelist")) return "Duelist";
  if(r.includes("Berserker")) return "Berserker";
  if(r.includes("Marksman")) return "Marksman";
  if(r.includes("Commander")) return "Commander";
  if(r.includes("Support")) return "Support";
  if(r.includes("Mystic")) return "Mystic";
  if(r.includes("Mounted")) return "Commander";
  if(r.includes("Spy")) return "Marksman";
  if(r.includes("Beast")) return "Berserker";
  if(r.includes("Healer")) return "Support";
  if(r.includes("Poison")) return "Mystic";
  if(r.includes("Assassin")) return "Duelist";
  if(r.includes("Holy")) return "Commander";
  if(r.includes("Control")) return "Commander";
  return "Fighter";
}

function broadRole(unit){
  return broadRoleFromText(unit.role);
}

function matchupText(attacker, defender, mv){
  if(!attacker || !defender || !mv) return "Select a target to see matchup.";
  const a = broadRole(attacker);
  const d = broadRole(defender);
  const table = ROLE_COUNTERS[a] || { strong: [], weak: [] };
  let adv = 0;
  let reasons = [];

  if(table.strong.some(x => d.includes(x) || defender.role.includes(x) || defender.armor.includes(x))) {
    adv += 10;
    reasons.push(`${a} pressures ${d}`);
  }
  if(table.weak.some(x => d.includes(x) || defender.role.includes(x) || defender.armor.includes(x))) {
    adv -= 10;
    reasons.push(`${d} can counter ${a}`);
  }

  const tm = TypeMods[mv.type] || {};
  if(tm[defender.armor]) {
    const percent = Math.round((tm[defender.armor] - 1) * 100);
    adv += percent;
    reasons.push(`${mv.type} vs ${defender.armor} ${percent >= 0 ? "+" : ""}${percent}%`);
  }

  if(mv.type === "holy" && defender.faction && defender.faction.includes("Myth")) {
    adv += 8;
    reasons.push("holy pressures mythic");
  }

  if(mv.status === "fear" && defender.morale > 88) {
    adv -= 10;
    reasons.push("high morale resists fear");
  }

  const label = adv > 7 ? "Advantage" : adv < -7 ? "Disadvantage" : "Neutral";
  return `${label} ${adv >= 0 ? "+" : ""}${adv}% — ${reasons.length ? reasons.join(", ") : "no major counter"}`;
}

function makeUnit(id, side, index, teamSize){
  const w = warrior(id);

  const enemyFormations = {
    1: [{col:3,row:2}],
    2: [{col:3,row:1},{col:2,row:3}],
    3: [{col:3,row:0},{col:3,row:2},{col:2,row:4}],
    4: [{col:3,row:0},{col:3,row:3},{col:2,row:1},{col:2,row:4}],
    5: [{col:3,row:0},{col:3,row:2},{col:3,row:4},{col:2,row:1},{col:2,row:3}]
  };

  const playerFormations = {
    1: [{col:6,row:2}],
    2: [{col:6,row:1},{col:7,row:3}],
    3: [{col:6,row:0},{col:6,row:2},{col:7,row:4}],
    4: [{col:6,row:0},{col:6,row:3},{col:7,row:1},{col:7,row:4}],
    5: [{col:6,row:0},{col:6,row:2},{col:6,row:4},{col:7,row:1},{col:7,row:3}]
  };

  const isTitan = !!w.isTitan || w.role.includes("Titan");
  const form = side === "player" ? playerFormations : enemyFormations;
  let pos = (form[teamSize] || form[5])[index] || (form[5][index % 5]);

  if(isTitan && side === "enemy"){
    // Logical boss hitbox = 3 blocks at rows 2/3/4.
    // Visual anchor stays on the same 3 BOSS blocks, but is pushed lower so the feet/body
    // clearly stand on the boss tiles instead of floating above them.
    pos = {col:1, row:3};
  }

  const col = pos.col;
  const row = pos.row;
  const p = gridToPercent(col, row, side);
  // Titans use a lowered visual anchor so they clearly stand on the 3 BOSS tiles.
  // Keep logical hit cells on rows 2/3/4, but push the large sprite down roughly one grid block.
  const titanVisualY = w.id === "fire_dragon_titan" ? 110.8 : (w.id === "ground_dragon_titan" ? 112.5 : 112.8);

  const hpScale = isTitan ? 1 : 0.88;
  const sideFocus = isTitan ? 45 : (side === "enemy" ? 20 : 25);

  return {
    uid: side + "_" + index + "_" + id,
    id: w.id,
    side,
    index,
    teamSize,
    gridCol: col,
    gridRow: row,
    x: isTitan ? p.x + 0.6 : p.x,
    y: isTitan ? titanVisualY : p.y,
    scale: isTitan ? (w.id === "fire_dragon_titan" ? 1.88 : (w.id === "ground_dragon_titan" ? 2.08 : 1.76)) : (0.96 - Math.abs(row - 2) * .025),
    row: isTitan ? "front" : ((side === "player" ? col >= 7 : col <= 2) ? "back" : "front"),
    name: w.name,
    role: w.role,
    faction: w.faction,
    sprite: w.sprite,
    spriteFacing: w.spriteFacing || "right",
    specialMove: w.specialMove || null,
    superSprite: w.superSprite || null,
    superSpriteFacing: w.superSpriteFacing || w.spriteFacing || "right",
    superForm: false,
    specialUsed: false,
    isTitanBoss: isTitan,
    maxHp: Math.round(w.stats.hp * hpScale),
    hp: Math.round(w.stats.hp * hpScale),
    attack: Math.round(w.stats.attack * (isTitan ? 1 : 1.06)),
    defense: Math.round(w.stats.defense * (isTitan ? 1 : .96)),
    speed: w.stats.speed,
    crit: w.stats.crit,
    resistance: w.stats.resistance,
    morale: w.stats.morale,
    focus: sideFocus,
    hasMovedThisTurn: false,
    moves: w.moves.slice(),
    cooldowns: {},
    statuses: [],
    alive: true,
    armor: isTitan ? "Titan" : (w.role.includes("Tank") || w.role.includes("Vanguard") ? "Shielded"
      : w.role.includes("Mystic") ? "Mystic"
      : w.role.includes("Commander") ? "Commander"
      : "Light"),
    summonOnly: false,
    summonOwnerUid: null,
    summonTurns: 0
  };
}

function alive(side){
  return Battle.units.filter(u => u.side === side && u.alive);
}

function enemiesOf(unit){
  return alive(unit.side === "player" ? "enemy" : "player");
}

function alliesOf(unit){
  return alive(unit.side);
}

function lowestHp(arr){
  return arr.slice().sort((a,b) => (a.hp/a.maxHp) - (b.hp/b.maxHp))[0];
}

function hasStatus(u, name){
  return u.statuses.some(s => s.name === name && s.duration > 0);
}

function getStatus(u, name){
  return u.statuses.find(s => s.name === name && s.duration > 0);
}

function addStatus(u, name, amount=0, duration=1){
  if(u && u.id === "baldwin_iv" && name === "fear"){
    pop(u, "FEAR IMMUNE", "status");
    return;
  }
  if(name === "cleanse"){
    u.statuses = u.statuses.filter(s => ["guard","rally","resist","rage","focus","chosen","counter","valhalla"].includes(s.name));
    pop(u, "CLEANSE", "status");
    return;
  }

  const existing = getStatus(u, name);
  if(existing){
    existing.amount = Math.max(existing.amount, amount);
    existing.duration = Math.max(existing.duration, duration);
  } else {
    u.statuses.push({ name, amount, duration });
  }
}

function statusIcon(s){
  const map = {
    bleed:"BLEED", poison:"POI", fear:"FEAR", guard:"GRD", taunt:"TAUNT",
    focus:"FOC", rally:"RLY", resist:"RES", rage:"RAGE", mino_rage:"RAGE+", mino_block:"BLOCK", slow:"SLOW",
    stun:"STUN", curse:"CURSE", vulnerable:"VULN", counter:"CTR",
    chosen:"CHOSEN", valhalla:"VAL", hidden:"HIDE", petrified:"STONE", rooted:"ROOT"
  };
  return map[s.name] || s.name.toUpperCase();
}

function effectiveAttack(u){
  let v = u.attack;
  if(hasStatus(u, "rally")) v += getStatus(u, "rally").amount;
  if(hasStatus(u, "rage")) v += getStatus(u, "rage").amount;
  if(u.id === "viking_berserker" && u.hp < u.maxHp * .5) v += 20;
  return v;
}

function effectiveDefense(u){
  let v = u.defense;
  if(hasStatus(u, "guard")) v += getStatus(u, "guard").amount;
  if(hasStatus(u, "resist")) v += getStatus(u, "resist").amount;
  if(hasStatus(u, "counter")) v += getStatus(u, "counter").amount;
  if(hasStatus(u, "rage")) v -= 10;
  if(u.id === "viking_berserker" && u.hp < u.maxHp * .5) v -= 10;
  if(hasStatus(u, "vulnerable")) v -= getStatus(u, "vulnerable").amount;
  return Math.max(0, v);
}

function effectiveSpeed(u){
  let v = u.speed;
  if(hasStatus(u, "slow")) v -= getStatus(u, "slow").amount;
  if(u.id === "napoleon" && Battle && Battle.round === 1) v += 18;
  if(u.id === "amelia_earhart") v += 12;
  return Math.max(1, v);
}

function coreAlive(side){
  return Battle.units.filter(u => u.side === side && u.alive && !u.summonOnly);
}

function isBattleOver(){
  return coreAlive("player").length === 0 || coreAlive("enemy").length === 0;
}

function currentActor(){
  if(!Battle || !Battle.queue.length) return null;
  return Battle.units.find(u => u.uid === Battle.queue[0] && u.alive) || null;
}

function log(msg){
  const box = $("#battleLog");
  if(box) box.insertAdjacentHTML("afterbegin", `<p>${msg}</p>`);
  const message = $("#battleMessage");
  if(message) message.textContent = msg.replace(/<[^>]*>/g, "");
}

function unitEl(u){
  return document.querySelector(`[data-uid="${u.uid}"]`);
}

function pop(u, text, kind="damage"){
  const el = unitEl(u);
  if(!el) return;
  const d = document.createElement("div");
  d.className = "damage-pop" + (kind === "heal" ? " heal-pop" : kind === "status" ? " status-pop" : "");
  d.textContent = text;
  el.appendChild(d);
  setTimeout(() => d.remove(), 950);
}

function battlefieldPointForUnit(u){
  const field = $("#battlefield");
  const el = unitEl(u);
  if(!field || !el) return { x: 0, y: 0 };
  const f = field.getBoundingClientRect();
  const e = el.getBoundingClientRect();
  return {
    x: e.left - f.left + e.width / 2,
    y: e.top - f.top + e.height * .45
  };
}


function spawnPetrifyFx(target){
  const layer = $("#effectLayer");
  if(!layer || !target) return;
  const p = battlefieldPointForUnit(target);
  const fx = document.createElement("div");
  fx.className = "petrify-fx";
  fx.style.left = `${p.x - 105}px`;
  fx.style.top = `${p.y - 125}px`;
  layer.appendChild(fx);
  setTimeout(() => fx.remove(), 1050);
}


function spawnFx(type, target, attacker=null){
  const layer = $("#effectLayer");
  if(!layer || !target) return;
  if(type === "godlike_slash"){
    spawnGodlikeSlashFx(attacker, target);
    return;
  }
  if(type === "thunder_strike"){
    spawnThunderStrikeFx(target);
    return;
  }
  if(type === "sky_raid") {
    spawnSkyRaidFx(target, attacker);
    return;
  }
  if(type === "summon_bear") {
    spawnSummonBearFx(target, attacker);
    return;
  }
  if(type === "petrify") {
    spawnPetrifyFx(target);
    return;
  }
  if(type === "dunk_impact") {
    const p = battlefieldPointForUnit(target);
    const fx = document.createElement("div");
    fx.className = "dunk-impact-fx";
    fx.style.left = `${p.x - 70}px`;
    fx.style.top = `${p.y - 70}px`;
    layer.appendChild(fx);
    setTimeout(() => fx.remove(), 760);
    return;
  }
  if(type === "basketball_fire") {
    const p = battlefieldPointForUnit(target);
    const fx = document.createElement("div");
    fx.className = "basketball-fire-impact-fx";
    fx.style.left = `${p.x - 56}px`;
    fx.style.top = `${p.y - 56}px`;
    layer.appendChild(fx);
    setTimeout(() => fx.remove(), 760);
    return;
  }
  const p = battlefieldPointForUnit(target);
  const fx = document.createElement("div");
  let cls = "slash-fx";
  if(type === "pierce") cls = "pierce-fx";
  if(type === "holy") cls = "holy-fx";
  if(type === "shadow" || type === "curse" || type === "fear") cls = "shadow-fx";
  if(type === "shield" || type === "guard") cls = "shield-fx";
  if(type === "templar") cls = "templar-fx";
  fx.className = cls;
  fx.style.left = `${p.x - 60}px`;
  fx.style.top = `${p.y - 45}px`;
  layer.appendChild(fx);
  setTimeout(() => fx.remove(), 900);
}

function attackFxCategory(attacker, target, mv){
  if(!mv) return "melee_slash";
  const name = (mv.name || "").toLowerCase();
  const type = (mv.type || "").toLowerCase();
  if(["godlike_slash","thunder_strike","sky_raid","summon_bear","petrify"].includes(mv.fx)) return "special";
  if(mv.id === "wemby_flying_dunk" || /flying dunk/.test(name)) return "dunk";
  if(mv.fx === "basketball_fire" || /basketball/.test(name)) return "basketball_fire";
  if(mv.fx === "minotaur_axe") return "minotaur_axe";
  const pat = movePatternFor(mv);

  if(/arrow|bow/.test(name)) return "arrow";
  if(/pistol|gun|shot|webley|flare|bullet|revolver|barrage|suppressive|license/.test(name) || type === "shot") return "bullet";
  if(/bolt|beam|magic|arcane|lightning|thunder|venom|gaze|curse|soul|shadow|flame|fire|holy|crystal/.test(name) || ["magic","shadow","holy","curse","fear","fire"].includes(type)) return type === "holy" ? "holy_beam" : type === "fire" ? "fire_beam" : "magic_beam";
  if(/bite|fang/.test(name)) return "bite";
  if(/mace|bash|claw|slam|crush|breaker|blunt|charge/.test(name) || type === "blunt") return pat.range <= 2 ? "melee_slam" : "shockwave";
  if(/spear|lunge|pierce|impal|khopesh|katana|slash|sword|cut|axe|blade|gladius|machete|staff|thrust/.test(name) || ["slash","pierce"].includes(type)) {
    return pat.range <= 2 || pat.shape === "melee" || pat.shape === "adjacent" ? "melee_slash" : "thrown_weapon";
  }
  return pat.range >= 4 || pat.shape === "line" ? "magic_beam" : "melee_slash";
}

function spawnAttackMotionFx(attacker, target, mv){
  const layer = $("#effectLayer");
  if(!layer || !attacker || !target || !mv) return 120;
  const category = attackFxCategory(attacker, target, mv);
  if(category === "special") return 120;

  const a = battlefieldPointForUnit(attacker);
  const t = battlefieldPointForUnit(target);
  const dx = t.x - a.x;
  const dy = t.y - a.y;
  const dist = Math.max(1, Math.hypot(dx, dy));
  const angle = Math.atan2(dy, dx) * 180 / Math.PI;

  if(category === "basketball_fire"){
    const proj = document.createElement("div");
    proj.className = "travel-projectile-fx basketball_fire";
    proj.style.left = `${a.x}px`;
    proj.style.top = `${a.y}px`;
    proj.style.setProperty("--dx", `${dx}px`);
    proj.style.setProperty("--dy", `${dy}px`);
    proj.style.setProperty("--angle", `${angle}deg`);
    layer.appendChild(proj);
    setTimeout(() => proj.remove(), 620);
    return 300;
  }

  if(category === "dunk"){
    const wave = document.createElement("div");
    wave.className = "wemby-dunk-trail";
    wave.style.left = `${a.x}px`;
    wave.style.top = `${a.y}px`;
    wave.style.width = `${dist}px`;
    wave.style.setProperty("--angle", `${angle}deg`);
    wave.style.transform = `rotate(${angle}deg)`;
    layer.appendChild(wave);
    setTimeout(() => wave.remove(), 620);
    return 220;
  }

  if(category === "arrow" || category === "bullet" || category === "thrown_weapon" || category === "minotaur_axe"){
    const proj = document.createElement("div");
    proj.className = `travel-projectile-fx ${category}`;
    proj.style.left = `${a.x}px`;
    proj.style.top = `${a.y}px`;
    proj.style.setProperty("--dx", `${dx}px`);
    proj.style.setProperty("--dy", `${dy}px`);
    proj.style.setProperty("--angle", `${angle}deg`);
    layer.appendChild(proj);
    setTimeout(() => proj.remove(), 520);
    return 260;
  }

  if(category === "magic_beam" || category === "holy_beam" || category === "fire_beam"){
    const beam = document.createElement("div");
    beam.className = `beam-attack-fx ${category}`;
    beam.style.left = `${a.x}px`;
    beam.style.top = `${a.y}px`;
    beam.style.width = `${dist}px`;
    beam.style.setProperty("--angle", `${angle}deg`);
    beam.style.transform = `rotate(${angle}deg)`;
    layer.appendChild(beam);

    const spark = document.createElement("div");
    spark.className = `beam-impact-spark ${category}`;
    spark.style.left = `${t.x - 42}px`;
    spark.style.top = `${t.y - 42}px`;
    layer.appendChild(spark);

    setTimeout(() => { beam.remove(); spark.remove(); }, 620);
    return 240;
  }

  if(category === "shockwave"){
    const wave = document.createElement("div");
    wave.className = "shockwave-line-fx";
    wave.style.left = `${a.x}px`;
    wave.style.top = `${a.y}px`;
    wave.style.width = `${dist}px`;
    wave.style.setProperty("--angle", `${angle}deg`);
    wave.style.transform = `rotate(${angle}deg)`;
    layer.appendChild(wave);
    setTimeout(() => wave.remove(), 620);
    return 220;
  }

  const p = battlefieldPointForUnit(target);
  const melee = document.createElement("div");
  melee.className = `melee-weapon-fx ${category}`;
  melee.style.left = `${p.x - 72}px`;
  melee.style.top = `${p.y - 82}px`;
  melee.style.setProperty("--flip", attacker.side === "player" ? "1" : "-1");
  layer.appendChild(melee);
  setTimeout(() => melee.remove(), 520);
  return 150;
}

function animateHit(attacker, target, mv=null){
  const a = unitEl(attacker);
  const t = unitEl(target);
  const hitDelay = mv ? spawnAttackMotionFx(attacker, target, mv) : 120;

  if(a){
    a.classList.add("attack-lunge");
    setTimeout(() => a.classList.remove("attack-lunge"), 460);
  }
  if(t){
    setTimeout(() => {
      t.classList.add("hit");
      setTimeout(() => t.classList.remove("hit"), 350);
    }, hitDelay);
  }
  if(mv) setTimeout(() => spawnFx(mv.fx || mv.type || mv.status || "slash", target, attacker), hitDelay);
}

function screenShake(){
  const field = $("#battlefield");
  if(!field) return;
  field.classList.add("screen-shake");
  setTimeout(() => field.classList.remove("screen-shake"), 340);
}

function calcDamage(attacker, target, mv){
  const power = mv.power || 80;
  const atk = effectiveAttack(attacker);
  const def = effectiveDefense(target);

  // V2.5 damage model:
  // Old formula subtracted defense too hard, so basic attacks and skills felt useless.
  // New formula uses diminishing defense: defense reduces damage but cannot flatten it.
  // Target result:
  // - basic attacks: meaningful chip
  // - skills: 1.5x-2.2x basic damage
  // - ultimates: scary and fight-ending when timed well
  const defenseFactor = 100 / (100 + def * 0.42);
  const raw = (atk * (power / 45)) + (power * 0.82);
  const floor = power * 0.92;
  let base = Math.max(floor, raw * defenseFactor);

  let mod = 1;
  const tm = TypeMods[mv.type] || {};
  mod *= tm[target.armor] || 1;

  const aRole = broadRole(attacker);
  const dRole = broadRole(target);
  const counters = ROLE_COUNTERS[aRole] || { strong: [], weak: [] };

  if(counters.strong.some(x => dRole.includes(x) || target.role.includes(x) || target.armor.includes(x))) mod *= 1.10;
  if(counters.weak.some(x => dRole.includes(x) || target.role.includes(x) || target.armor.includes(x))) mod *= .90;

  if(mv.type === "shadow" && hasStatus(target, "curse")) mod *= 1.15;
  if(mv.id === "royal_sword" && (hasStatus(target, "curse") || hasStatus(target, "fear"))) mod *= 1.20;
  if(mv.id === "battle_of_montgisard" && attacker.hp <= attacker.maxHp * .50) mod *= 1.25;
  if(mv.id === "once_and_future_king" && attacker.hp <= attacker.maxHp * .50) mod *= 1.20;
  if(attacker.id === "james_bond" && (hasStatus(target, "slow") || hasStatus(target, "fear") || hasStatus(target, "vulnerable"))) mod *= 1.12;
  if(attacker.id === "the_hooligan" && (hasStatus(target, "stun") || hasStatus(target, "fear") || hasStatus(target, "vulnerable"))) mod *= 1.12;
  if(attacker.id === "ronin" && (hasStatus(target, "bleed") || hasStatus(target, "fear"))) mod *= 1.12;
  if(attacker.id === "attila_the_hun" && target.hp / Math.max(1, target.maxHp) < 0.5) mod *= 1.12;
  if(target.id === "king_arthur" && hasStatus(target, "guard")) mod *= .92; // Camelot damage reduction
  if(target.id === "adrian_carton_de_wiart" && target.hp < target.maxHp * .5) mod *= .90;
  if(attacker.id === "musashi" && (hasStatus(target, "mark") || enemiesOf(attacker).length === 1)) mod *= 1.10;
  if(attacker.id === "vlad" && hasStatus(target, "bleed")) mod *= 1.16;
  if(mv.name === "Last Breath" && attacker.hp < attacker.maxHp * .45) mod *= 1.45;
  if(Battle.arena === "desert_arena" && mv.type === "pierce") mod *= 1.05;
  if(Battle.arena === "samurai_shrine" && attacker.role.includes("Duelist")) mod *= 1.05;

  // Tactical/risk reward: close attacks and line attacks should pay off.
  const pat = movePatternFor(mv);
  if(pat.shape === "adjacent") mod *= 1.08;
  if(pat.shape === "line") mod *= 1.12;
  if(mv.kind === "ultimate") mod *= 1.18;

  const critChance = clamp(attacker.crit + (hasStatus(attacker, "focus") ? getStatus(attacker, "focus").amount : 0), 0, 65);
  const crit = Math.random() * 100 < critChance;
  if(crit) mod *= 1.55;
  if(target.id === "achilles" && crit) mod *= 1.25;

  let sideMod = 1;
  if(attacker.side === "enemy" && Battle){
    if(Battle.difficulty === "easy") sideMod = .68;
    else if(Battle.difficulty === "normal") sideMod = .78;
    else if(Battle.difficulty === "hard") sideMod = .93;
    else sideMod = 1.03;
  }
  if(attacker.side === "player" && Battle){
    if(Battle.difficulty === "easy") sideMod = 1.18;
    else if(Battle.difficulty === "normal") sideMod = 1.10;
  }

  return {
    amount: Math.max(1, Math.round(base * mod * sideMod * (.92 + Math.random() * .16))),
    crit
  };
}

function applyDamage(attacker, target, mv, customPower=null){
  if(!target || !target.alive) return 0;

  const m = customPower ? {...mv, power: customPower} : mv;

  if(hasStatus(target, "mino_block")) {
    target.statuses = target.statuses.filter(s => s.name !== "mino_block");
    pop(target, "BLOCK", "status");
    spawnFx("shield", target);
    log(`<strong>${target.name}</strong> blocks the hit with Shield Up.`);
    return 0;
  }

  if(hasStatus(target, "hidden") && !m.__undodgeable){
    target.statuses = target.statuses.filter(s => s.name !== "hidden");
    attacker.focus = clamp(attacker.focus + 6, 0, 100);
    pop(target, "MISS", "status");
    spawnFx("shadow", target);
    log(`<strong>${target.name}</strong> vanishes under the hat. ${attacker.name}'s attack misses.`);
    return 0;
  }

  const d = calcDamage(attacker, target, m);

  if(target.id === "baldwin_iv" && !m.__templarAssist){
    const guards = templarsOf(target).filter(g => alive(g.side).includes(g) && gridDistance(g, target) <= 2);
    if(guards.length){
      const guard = guards.sort((a,b) => a.hp - b.hp)[0];
      const blocked = Math.max(1, Math.round(d.amount * 0.60));
      const passed = Math.max(0, d.amount - blocked);
      guard.hp = Math.max(0, guard.hp - blocked);
      target.hp = Math.max(0, target.hp - passed);
      attacker.focus = clamp(attacker.focus + (mv.focus || 10) + 12, 0, 100);
      target.focus = clamp(target.focus + 16, 0, 100);
      animateHit(attacker, target, mv);
      spawnFx("shield", guard);
      pop(guard, `-${blocked}`);
      pop(target, `-${passed}`, "status");
      log(`<strong>${guard.name}</strong> intercepts for Baldwin, blocking ${blocked} damage.`);
      if(guard.hp <= 0) killUnit(guard, attacker);
      checkBaldwinResolve(target);
      if(target.hp <= 0) killUnit(target, attacker);
      return d.amount;
    }
  }

  if(target.id === "amelia_earhart" && !m.__skyRaidSplash && !m.__undodgeable){
    const dodgeChance = 17 + Math.max(0, effectiveSpeed(target) - effectiveSpeed(attacker)) * 0.08;
    if(Math.random() * 100 < Math.min(35, dodgeChance)) {
      attacker.focus = clamp(attacker.focus + 6, 0, 100);
      pop(target, "DODGE", "status");
      log(`<strong>${target.name}</strong> evades the attack with Aerial Instinct.`);
      return 0;
    }
  }

  target.hp = Math.max(0, target.hp - d.amount);
  attacker.focus = clamp(attacker.focus + (mv.focus || 10) + 12, 0, 100);
  target.focus = clamp(target.focus + 16, 0, 100);
  if(target.id === "adrian_carton_de_wiart") target.focus = clamp(target.focus + 6, 0, 100);

  animateHit(attacker, target, mv);
  pop(target, `${d.crit ? "CRIT " : ""}-${d.amount}`);
  if(d.amount > 160 || mv.kind === "ultimate") screenShake();

  log(`<strong>${attacker.name}</strong> uses ${mv.name} on <strong>${target.name}</strong> for ${d.amount}${d.crit ? " CRIT" : ""}.`);

  if(attacker.id === "vlad") target.morale = Math.max(0, target.morale - 6);

  if(attacker.id === "anubis_warrior" && hasStatus(target, "curse")) {
    const heal = Math.round(d.amount * .15);
    attacker.hp = Math.min(attacker.maxHp, attacker.hp + heal);
    pop(attacker, `+${heal}`, "heal");
  }

  checkBaldwinResolve(target);
  checkGruttePierPassive(target);
  if(target.hp <= 0) killUnit(target, attacker);

  if(attacker.id === "baldwin_iv" && !m.__templarAssist && ["damage","multi_damage","damage_status","ultimate","special_damage","special_charge_burst"].includes(m.kind) && target.alive){
    triggerTemplarAssist(attacker, target);
  }

  return d.amount;
}


function checkBaldwinResolve(unit){
  if(!unit || unit.id !== "baldwin_iv" || unit.baldwinResolveUsed || !unit.alive) return;
  if(unit.hp > 0 && unit.hp <= unit.maxHp * .40){
    unit.baldwinResolveUsed = true;
    alliesOf(unit).forEach(ally => {
      addStatus(ally, "rally", 15, 2);
      addStatus(ally, "resist", 15, 2);
      ally.morale = Math.min(100, ally.morale + 15);
      pop(ally, "RESOLVE", "status");
      spawnFx("holy", ally);
    });
    log(`<strong>Baldwin's Resolve</strong> inspires the army. Allies gain morale and resistance.`);
  }
}

function killUnit(target, killer){
  target.alive = false;
  target.hp = 0;
  if(target.id === "baldwin_iv") despawnTemplarsFor(target);
  if(killer) killer.focus = clamp(killer.focus + 20, 0, 100);

  log(`<strong>${target.name}</strong> falls.`);

  const chosen = getStatus(target, "chosen");
  if(chosen && !target.spiritUsed){
    target.alive = true;
    target.spiritUsed = true;
    target.hp = Math.round(target.maxHp * .30);
    target.statuses = [];
    pop(target, "RETURN", "heal");
    log(`<strong>${target.name}</strong> is chosen by fate and returns with 30% HP!`);
    return;
  }

  const valk = Battle.units.find(u => u.side === target.side && u.id === "valkyrie" && u.alive);
  if(valk && !Battle.valhallaUsed[target.side]){
    Battle.valhallaUsed[target.side] = true;
    target.alive = true;
    target.hp = Math.round(target.maxHp * .20);
    pop(target, "VALHALLA", "heal");
    log(`<strong>Valhalla Oath</strong> returns ${target.name} for one more stand.`);
  }
}

function healUnit(caster, target, amount){
  if(!target || !target.alive) return;
  const heal = Math.round(amount + caster.morale * .8);
  target.hp = Math.min(target.maxHp, target.hp + heal);
  caster.focus = clamp(caster.focus + 16, 0, 100);
  pop(target, `+${heal}`, "heal");
  spawnFx("holy", target);
  log(`<strong>${caster.name}</strong> heals <strong>${target.name}</strong> for ${heal}.`);
}


function finishMoveFlow(actor, moveId, mv){
  if(mv.cooldown) actor.cooldowns[moveId] = mv.cooldown;
  Object.keys(actor.cooldowns).forEach(k => {
    if(actor.cooldowns[k] > 0 && k !== moveId) actor.cooldowns[k]--;
  });
}

function animateWembyDunk(actor, target){
  const attackerEl = unitEl(actor);
  const targetEl = unitEl(target);
  const layer = $("#effectLayer");
  const a = battlefieldPointForUnit(actor);
  const t = battlefieldPointForUnit(target);
  const dx = (t.x - a.x) * 0.72;
  const dy = (t.y - a.y) * 0.72 - 36;

  if(layer){
    const trail = document.createElement("div");
    trail.className = "wemby-dunk-trail";
    trail.style.left = `${a.x}px`;
    trail.style.top = `${a.y}px`;
    trail.style.width = `${Math.max(60, Math.hypot(t.x - a.x, t.y - a.y))}px`;
    const angle = Math.atan2(t.y - a.y, t.x - a.x) * 180 / Math.PI;
    trail.style.setProperty("--angle", `${angle}deg`);
    trail.style.transform = `rotate(${angle}deg)`;
    layer.appendChild(trail);
    setTimeout(() => trail.remove(), 620);
  }

  return new Promise(resolve => {
    if(attackerEl){
      attackerEl.style.transition = "transform .22s cubic-bezier(.2,.82,.24,1)";
      attackerEl.style.transform = `translate(${dx}px, ${dy}px) scale(1.08)`;
      attackerEl.style.zIndex = "120";
    }

    setTimeout(() => {
      if(targetEl){
        targetEl.classList.add("hit");
        setTimeout(() => targetEl.classList.remove("hit"), 320);
      }
      spawnFx("dunk_impact", target, actor);
      screenShake();
    }, 190);

    setTimeout(() => {
      if(attackerEl) attackerEl.style.transform = "translate(0px, 0px) scale(1)";
    }, 240);

    setTimeout(() => {
      if(attackerEl){
        attackerEl.style.transition = "";
        attackerEl.style.transform = "";
        attackerEl.style.zIndex = "";
      }
      resolve(true);
    }, 470);
  });
}

function chooseTargets(actor, mv, explicitTarget){
  if(explicitTarget) return [explicitTarget].filter(Boolean);

  const enemies = enemiesOf(actor);
  const allies = alliesOf(actor);

  switch(mv.target){
    case "self": return [actor];
    case "all_allies": return allies;
    case "ally": return [lowestHp(allies.filter(t => inMoveRange(actor, t, mv))) || lowestHp(allies)];
    case "all_enemies": return enemies;
    case "enemy_front": {
      const front = enemies.filter(u => u.row === "front");
      return front.length ? front : enemies;
    }
    case "enemy":
    default: {
      const inRange = enemies.filter(t => inMoveRange(actor, t, mv));
      return [inRange[0] || enemies[0]].filter(Boolean);
    }
  }
}

function executeMove(actor, moveId, target){
  if(!actor || !actor.alive) return false;

  const baseMove = move(moveId);
  if(!baseMove){
    toast("Move not found: " + moveId);
    return false;
  }

  const mv = {...baseMove, id: moveId};

  if(mv.kind === "wemby_dunk"){
    if(actor.cooldowns[moveId] > 0){
      toast("Move is on cooldown.");
      return false;
    }
    if(!target || !target.alive){
      toast("Choose a target for Flying Dunk.");
      return false;
    }

    animateWembyDunk(actor, target).then(() => {
      applyDamage(actor, target, mv);
      finishMoveFlow(actor, moveId, mv);
      renderBattle();
      setTimeout(endTurn, 380);
    });
    return "async";
  }

  // V5.32: Dark Sinterklaas summons four active Shadow Pieten.
  if(mv.kind === "summon_shadow_pieten"){
    const ok = activateSummonShadowPieten(actor);
    if(ok && typeof ok.then === "function"){
      ok.then(done => {
        if(done){
          renderBattle();
          setTimeout(endTurn, 450);
        }
      });
      return "async";
    }
    return ok ? "async" : false;
  }

  // V5.40: Evil Gnome transformation uses the Special meter, but does NOT end the turn.
  // After transforming, the player can still choose an attack/skill/move in the same turn.
  if(mv.kind === "gnome_transform"){
    if(actor.superForm){
      toast("Already transformed.");
      return false;
    }
    if(actor.focus < 100){
      toast("Need 100 Focus for Special Attack.");
      return false;
    }

    actor.focus = 0;
    const didTransform = activateEvilGnomeTransformation(actor);
    renderBattle();

    showSpecialOverlay("SPECIAL ATTACK", "DARK GNOME TRANSFORMATION").then(() => {
      renderBattle();
      renderCommandPanel(actor);
      toast("Evil Gnome transformed. Choose your attack.");
      const message = $("#battleMessage");
      if(message) message.textContent = "Evil Gnome transformed. Choose your attack.";
    });

    return "async";
  }

  // V3.6: Special transformations are handled atomically before any target logic.
  // This prevents the normal skill/target/overlay flow from breaking the transformation.
  if(mv.kind === "super_transform"){
    if(actor.specialUsed || actor.superForm){
      toast("Special already used.");
      return false;
    }
    if(actor.focus < 100){
      toast("Need 100 Focus for Special Attack.");
      return false;
    }

    actor.focus = 0;

    const didTransform = activateThisIsSparta(actor);
    renderBattle();

    showSpecialOverlay("SPECIAL ATTACK", "THIS IS SPARTA").then(() => {
      renderBattle();
      setTimeout(endTurn, 450);
    });

    return "async";
  }

  if(mv.kind === "summon_guard"){
    if(actor.specialUsed){
      toast("Special already used.");
      return false;
    }
    if(actor.focus < 100){
      toast("Need 100 Focus for Special Attack.");
      return false;
    }

    const ok = activateHolyGuardOfJerusalem(actor);
    renderBattle();
    showSpecialOverlay("SPECIAL ATTACK", "HOLY GUARD OF JERUSALEM").then(() => {
      renderBattle();
      setTimeout(endTurn, 450);
    });
    return ok ? "async" : false;
  }

  if(mv.kind === "summon_sphinx"){
    const ok = activateSummonTheSphinx(actor);
    if(ok && typeof ok.then === "function"){
      ok.then(done => {
        if(done){
          renderBattle();
          setTimeout(endTurn, 450);
        }
      });
      return "async";
    }
    return ok ? "async" : false;
  }

  if(mv.kind === "summon_lion"){
    const ok = activateSummonTheLionKing(actor);
    if(ok && typeof ok.then === "function"){
      ok.then(done => {
        if(done){
          renderBattle();
          setTimeout(endTurn, 450);
        }
      });
      return "async";
    }
    return ok ? "async" : false;
  }

  if(mv.kind === "special_full_heal"){
    if(actor.focus < 100){
      toast("Need 100 Focus for Special Attack.");
      return false;
    }
    actor.focus = 0;
    actor.specialUsed = false;

    showSpecialOverlay("SPECIAL ATTACK", mv.name.toUpperCase()).then(() => {
      const healedTargets = fullHealAllies(actor, mv.name);
      renderBattle();
      showHealingRainAnimation(healedTargets).then(() => {
        renderBattle();
        setTimeout(endTurn, 450);
      });
    });

    return "async";
  }

  if(mv.kind === "special_damage"){
    if(actor.focus < 100){
      toast("Need 100 Focus for Special Attack.");
      return false;
    }
    if(!target || !target.alive){
      toast("Choose a target for the Special Attack.");
      return false;
    }

    actor.focus = 0;
    actor.specialUsed = false;
    const specialMv = {...mv, fx: mv.fx || (actor.id === "achilles" ? "godlike_slash" : (mv.type || "slash"))};

    showSpecialOverlay("SPECIAL ATTACK", mv.name.toUpperCase()).then(() => {
      const dealt = applyDamage(actor, target, specialMv);
      if(target.alive && dealt > 0 && mv.status){
        addStatus(target, mv.status, mv.amount, mv.duration);
        pop(target, mv.status.toUpperCase(), "status");
        log(`<strong>${target.name}</strong> gains ${mv.status}.`);
      }
      setTimeout(() => {
        renderBattle();
        endTurn();
      }, mv.fx === "sky_raid" ? 1200 : mv.fx === "summon_bear" ? 980 : mv.fx === "petrify" ? 1050 : mv.fx === "basketball_fire" ? 850 : 650);
    });

    return "async";
  }

  if(mv.kind === "special_charge_burst"){
    if(actor.focus < 100){
      toast("Need 100 Focus for Special Attack.");
      return false;
    }
    if(!target || !target.alive){
      toast("Choose a target for the Special Attack.");
      return false;
    }

    actor.focus = 0;
    actor.specialUsed = false;
    addStatus(actor, "guard", mv.guardAmount || 30, mv.duration || 2);
    addStatus(actor, "resist", mv.resistAmount || 16, mv.duration || 2);
    pop(actor, "UNSTOPPABLE", "status");
    spawnFx("shield", actor);

    const burstMv = {...mv, kind:"damage", name: mv.name, focus:0, __undodgeable:true};
    showSpecialOverlay("SPECIAL ATTACK", mv.name.toUpperCase()).then(() => {
      const dealt = applyDamage(actor, target, burstMv);
      if(target.alive && dealt > 0){
        addStatus(target, "vulnerable", 12, 1);
        pop(target, "BURST", "status");
      }
      setTimeout(() => {
        renderBattle();
        endTurn();
      }, 700);
    });

    return "async";
  }

  if(mv.kind === "ultimate"){
    if(actor.focus < Math.min((mv.cost || 100), 80)){
      toast("Not enough focus.");
      return false;
    }
    actor.focus = 0;
  }

  if(actor.cooldowns[moveId] > 0){
    toast("Move is on cooldown.");
    return false;
  }

  const targets = chooseTargets(actor, mv, target);

  if(["damage","multi_damage","damage_status","special_damage","special_charge_burst"].includes(mv.kind)){
    targets.forEach(t => {
      if(mv.kind === "multi_damage"){
        for(let i=0;i<(mv.hits || 2);i++) {
          if(t.alive) applyDamage(actor, t, mv);
        }
      } else {
        applyDamage(actor, t, mv);
      }

      if(mv.kind === "damage_status" && t.alive){
        const chance = clamp(82 - t.resistance * .35 + (mv.status === "fear" ? (70 - t.morale) * .25 : 0), 12, 92);
        if(Math.random() * 100 < chance){
          addStatus(t, mv.status, mv.amount, mv.duration);
          pop(t, mv.status.toUpperCase(), "status");
          log(`<strong>${t.name}</strong> gains ${mv.status}.`);
        }
      }
    });
  }

  else if(mv.kind === "buff" || mv.kind === "taunt"){
    targets.forEach(t => {
      addStatus(t, mv.status, mv.amount, mv.duration);
      spawnFx(mv.status === "guard" || mv.status === "taunt" ? "shield" : "holy", t);
      pop(t, mv.status.toUpperCase(), "status");
    });
    actor.focus = clamp(actor.focus + (mv.focus || 12), 0, 100);
    log(`<strong>${actor.name}</strong> uses ${mv.name}.`);
  }

  else if(mv.kind === "debuff" || mv.kind === "debuff_all"){
    targets.forEach(t => {
      addStatus(t, mv.status, mv.amount, mv.duration);
      spawnFx(mv.status || "shadow", t);
      pop(t, mv.status.toUpperCase(), "status");
    });
    actor.focus = clamp(actor.focus + (mv.focus || 12), 0, 100);
    log(`<strong>${actor.name}</strong> spreads ${mv.status}.`);
  }

  else if(mv.kind === "heal"){
    targets.forEach(t => {
      healUnit(actor, t, mv.power);
      if(mv.status) addStatus(t, mv.status, mv.amount, mv.duration);
      if(actor.id === "battle_priest"){
        t.morale = Math.min(100, t.morale + 8);
        pop(t, "+MORALE", "status");
      }
    });
  }

  if(mv.kind === "ultimate"){
    log(`<strong>${actor.name}</strong> unleashes ${mv.name}!`);

    if(mv.power && (mv.target === "enemy" || mv.target === "all_enemies" || mv.target === "enemy_front")) {
      targets.forEach(t => applyDamage(actor, t, mv));
    } else if(mv.power && mv.target === "all_allies") {
      targets.forEach(t => healUnit(actor, t, mv.power));
    }

    if(mv.status){
      targets.forEach(t => {
        addStatus(t, mv.status, mv.amount || 25, mv.duration || 2);
        spawnFx(mv.status === "counter" || mv.status === "guard" ? "shield" : "holy", t);
        pop(t, mv.status.toUpperCase(), "status");
      });
    }
  }

  if(mv.cooldown) actor.cooldowns[moveId] = mv.cooldown;

  Object.keys(actor.cooldowns).forEach(k => {
    if(actor.cooldowns[k] > 0 && k !== moveId) actor.cooldowns[k]--;
  });

  return true;
}

function processStartTurn(unit){
  if(!unit || !unit.alive) return true;

  if(unit.id === "baldwin_iv" && unit.templarTurns > 0){
    updateTemplarDurations(unit);
  }

  unit.focus = clamp(unit.focus + 12, 0, 100);
  unit.hasMovedThisTurn = false;
  unit.noMoveThisTurn = false;
  let skip = false;

  for(const s of [...unit.statuses]){
    if(s.name === "bleed" || s.name === "poison" || s.name === "burn"){
      const dmg = Math.round(s.amount * 1.35);
      unit.hp = Math.max(0, unit.hp - dmg);
      pop(unit, `-${dmg}`);
      log(`<strong>${unit.name}</strong> suffers ${dmg} ${s.name}.`);
      if(unit.hp <= 0) killUnit(unit, null);
    }

    if(s.name === "stun"){
      skip = true;
      log(`<strong>${unit.name}</strong> is stunned.`);
    }

    if(s.name === "petrified"){
      skip = true;
      pop(unit, "STONE", "status");
      log(`<strong>${unit.name}</strong> is petrified and cannot act.`);
    }

    if(s.name === "rooted"){
      unit.noMoveThisTurn = true;
      pop(unit, "ROOT", "status");
      log(`<strong>${unit.name}</strong> is rooted and cannot move this turn.`);
    }

    if(s.name === "fear" && Math.random() * 100 < 22){
      skip = true;
      log(`<strong>${unit.name}</strong> falters in fear.`);
    }
  }

  unit.statuses.forEach(s => s.duration--);
  unit.statuses = unit.statuses.filter(s => s.duration > 0);

  return !skip;
}

function isTurnTakingUnit(u){
  // Templar guards are protective summons and do not get full turns.
  // Living Sphinx is a combat summon and must get attack turns.
  return u && u.alive && (!u.summonOnly || u.id === "living_sphinx" || u.id === "lion_king" || u.id === "shadow_piet");
}

function buildTurnQueue(){
  return Battle.units
    .filter(u => isTurnTakingUnit(u))
    .map(u => ({ u, score: effectiveSpeed(u) + Math.random() * 18 }))
    .sort((a,b) => b.score - a.score)
    .map(x => x.u.uid);
}

function applyArenaRoundEffect(){
  if(Battle.round > 1 && Battle.arena === "frozen_fjord"){
    Battle.units
      .filter(u => u.alive && !["Vikings","Norse Myth"].includes(u.faction))
      .forEach(u => addStatus(u, "slow", 5, 1));
  }

  if(Battle.round > 1 && Battle.round % 3 === 0 && Battle.arena === "colosseum"){
    const pHp = alive("player").reduce((s,u) => s + u.hp, 0);
    const eHp = alive("enemy").reduce((s,u) => s + u.hp, 0);
    const side = pHp >= eHp ? "player" : "enemy";
    alive(side).forEach(u => addStatus(u, "rally", 8, 1));
    log(`<strong>The crowd roars!</strong> ${side} gains morale.`);
  }
}

function nextTurn(){
  clearTargetMode();

  if(isBattleOver()) return finishBattle();

  if(!Battle.queue.length || !currentActor()){
    Battle.queue = buildTurnQueue();
    Battle.round++;
    applyArenaRoundEffect();
  }

  const actor = currentActor();
  renderBattle();

  const canAct = processStartTurn(actor);
  renderBattle();

  if(isBattleOver()) return finishBattle();

  if(!canAct){
    Battle.queue.shift();
    setTimeout(nextTurn, 700);
    return;
  }

  if(actor.side === "enemy"){
    renderEnemyThinking(actor);
    setTimeout(() => enemyAct(actor), 850);
  } else {
    renderCommandPanel(actor);
  }
}

function endTurn(){
  Battle.queue.shift();
  setTimeout(nextTurn, 500);
}

function targetableFor(actor, mv){
  if(["all_allies","self","all_enemies","enemy_front"].includes(mv.target)) return [];
  const pool = mv.target === "ally" ? alliesOf(actor) : enemiesOf(actor);
  return pool.filter(t => inMoveRange(actor, t, mv));
}

function renderEnemyThinking(actor){
  const panel = $("#actionPanel");
  if(panel) {
    panel.innerHTML = `
      <div class="command-title"><span>${actor.name}</span><small>Enemy Turn</small></div>
      <div class="matchup-tip">Enemy is choosing a command...</div>
    `;
  }
}

function renderCommandPanel(actor){
  const panel = $("#actionPanel");
  if(!panel || !actor) return;
  UI.pendingMove = null;
  clearGridCells();

  const hasSpecial = !!actor.specialMove;
  const specialReady = hasSpecial && actor.focus >= 100 && !actor.superForm;
  const specialText = hasSpecial
    ? (actor.superForm ? "Super form active" : `Special ${actor.focus}/100`)
    : `Focus ${actor.focus}/100`;

  panel.innerHTML = `
    <div class="command-title"><span>${actor.name}</span><small>${specialText}</small></div>
    <div class="command-grid">
      <button type="button" class="command-btn" data-command="attack">Attack</button>
      <button type="button" class="command-btn" data-command="skills">Skills</button>
      ${hasSpecial ? `<button type="button" class="command-btn super-skill" data-command="special" ${specialReady ? "" : "disabled"}>${specialReady ? "Special Ready" : "Special"}</button>` : ""}
      <button type="button" class="command-btn" data-command="move" ${(actor.hasMovedThisTurn || actor.noMoveThisTurn || hasStatus(actor, "rooted")) ? "disabled" : ""}>Move</button>
      <button type="button" class="command-btn" data-command="guard">Guard</button>
      <button type="button" class="command-btn" data-command="wait">Wait</button>
      <button type="button" class="command-btn" data-command="scan">Scan</button>
      <div class="matchup-tip">Special uses 100 meter and can recharge. Evil Gnome transform keeps the turn active.</div>
    </div>
  `;

  const bind = (selector, handler) => {
    const el = panel.querySelector(selector);
    if(el) el.addEventListener("click", (ev) => {
      ev.preventDefault();
      ev.stopPropagation();
      handler();
    });
  };

  bind('[data-command="attack"]', () => {
    const mvId = actor.moves[0];
    beginTargetOrExecute(actor, mvId);
  });

  bind('[data-command="skills"]', () => renderSkillPanel(actor));

  bind('[data-command="special"]', () => {
    if(!actor.specialMove) return;
    const sp = move(actor.specialMove);
    if(sp && ["self","all_allies","all_enemies","enemy_front"].includes(sp.target)){
      const ok = executeMove(actor, actor.specialMove, null);
      if(ok === "async") return;
      if(ok){
        renderBattle();
        endTurn();
      }
    } else {
      beginTargetOrExecute(actor, actor.specialMove);
    }
  });

  bind('[data-command="move"]', () => setMoveMode(actor));

  bind('[data-command="guard"]', () => {
    addStatus(actor, "guard", 22, 1);
    actor.focus = clamp(actor.focus + 18, 0, 100);
    pop(actor, "GUARD", "status");
    spawnFx("shield", actor);
    log(`<strong>${actor.name}</strong> guards.`);
    renderBattle();
    endTurn();
  });

  bind('[data-command="wait"]', () => {
    actor.focus = clamp(actor.focus + 24, 0, 100);
    log(`<strong>${actor.name}</strong> waits and gathers focus.`);
    renderBattle();
    endTurn();
  });

  bind('[data-command="scan"]', () => {
    const enemy = lowestHp(enemiesOf(actor));
    const tip = enemy ? matchupText(actor, enemy, move(actor.moves[0])) : "No enemy.";
    const m = $("#battleMessage");
    if(m) m.textContent = tip;
    toast(tip);
  });
}

function renderSkillPanel(actor){
  const panel = $("#actionPanel");
  if(!panel || !actor) return;
  clearGridCells();

  const skills = actor.moves.map(id => {
    const mv = move(id);
    if(!mv) return "";
    const cd = actor.cooldowns[id] || 0;
    const disabled = (mv.kind === "ultimate" && actor.focus < Math.min((mv.cost || 100), 80))
      || (mv.kind === "super_transform" && (actor.focus < 100 || actor.superForm))
      || (mv.kind === "gnome_transform" && (actor.focus < 100 || actor.superForm))
      || (mv.kind === "summon_shadow_pieten" && actor.focus < 100)
      || (mv.kind === "summon_guard" && actor.focus < 100)
      || (mv.kind === "summon_sphinx" && actor.focus < 100)
      || (mv.kind === "summon_lion" && actor.focus < 100)
      || cd > 0;
    const note = mv.kind === "super_transform" ? `SPECIAL • ${actor.focus}/100 Focus`
      : mv.kind === "gnome_transform" ? `SPECIAL • ${actor.focus}/100 Focus • +50% ATK/DEF`
      : mv.kind === "summon_shadow_pieten" ? `SPECIAL • ${actor.focus}/100 Focus • Summons 3 helpers`
      : mv.kind === "summon_guard" ? `SPECIAL • ${actor.focus}/100 Focus • Summons 3 guards`
      : mv.kind === "summon_sphinx" ? `SPECIAL • ${actor.focus}/100 Focus • Summons Living Sphinx`
      : mv.kind === "summon_lion" ? `SPECIAL • ${actor.focus}/100 Focus • Summons Lion King`
      : mv.kind === "ultimate" ? `Ultimate • ${actor.focus}/80 Focus`
      : cd > 0 ? `Cooldown ${cd}`
      : `${mv.type || mv.status || "skill"} • ${mv.desc}`;
    return `
      <button type="button" class="skill-btn ${["super_transform","gnome_transform","summon_shadow_pieten","summon_guard","summon_sphinx","summon_lion"].includes(mv.kind) ? "super-skill" : ""}" data-move="${id}" ${disabled ? "disabled" : ""}>
        <b>${mv.name} <span class="range-badge">${tacticalRangeLabel(mv)}</span></b>
        <small>${note}</small>
      </button>
    `;
  }).join("");

  panel.innerHTML = `
    <div class="command-title"><span>Skills</span><small>${actor.name}</small></div>
    <div class="command-grid">
      ${skills}
      <button type="button" class="back-btn" data-action="back">Back</button>
      <div class="matchup-tip">Choose a skill, or press Back. V3.5 prevents grid layers from blocking these buttons.</div>
    </div>
  `;

  const back = panel.querySelector('[data-action="back"]');
  if(back) back.addEventListener("click", (ev) => {
    ev.preventDefault();
    ev.stopPropagation();
    clearGridCells();
    renderCommandPanel(actor);
  });

  panel.querySelectorAll("[data-move]").forEach(btn => {
    btn.addEventListener("click", (ev) => {
      ev.preventDefault();
      ev.stopPropagation();
      beginTargetOrExecute(actor, btn.dataset.move);
    });
  });
}

function beginTargetOrExecute(actor, moveId){
  const mv = move(moveId);
  const targets = targetableFor(actor, mv);

  if(targets.length > 0){
    setTargetMode(actor, moveId, targets);
  } else if(["self","all_allies","all_enemies","enemy_front"].includes(mv.target)){
    const ok = executeMove(actor, moveId, null);
    if(ok === "async") return;
    if(ok){
      renderBattle();
      endTurn();
    }
  } else {
    setTargetMode(actor, moveId, []);
  }
}


function setMoveMode(actor){
  clearTargetMode();

  if(actor.hasMovedThisTurn){
    toast("This warrior already moved this turn.");
    renderCommandPanel(actor);
    return;
  }

  if(actor.noMoveThisTurn || hasStatus(actor, "rooted")){
    toast("This warrior is rooted and cannot move this turn.");
    renderCommandPanel(actor);
    return;
  }

  renderBattle();
  const cells = legalMoveCells(actor);
  const layer = $("#gridCellLayer");
  if(!layer) return;

  const el = unitEl(actor);
  if(el) el.classList.add("moving-unit");

  const panel = $("#actionPanel");
  if(panel){
    panel.innerHTML = `
      <div class="command-title"><span>Move</span><small>${actor.name}</small></div>
      <div class="command-grid">
        <button type="button" class="back-btn" data-action="cancel-move">Cancel</button>
        <div class="matchup-tip">Choose a blue grid cell. Moving does <strong>not</strong> end your turn. You can move once, then attack.</div>
      </div>
    `;

    const cancel = panel.querySelector('[data-action="cancel-move"]');
    if(cancel) cancel.addEventListener("click", (ev) => {
      ev.preventDefault();
      ev.stopPropagation();
      clearGridCells();
      renderCommandPanel(actor);
    });
  }

  cells.forEach(c => {
    const cell = makeGridCell(c.col, c.row, c.bullRush ? "valid-target bull-rush-cell" : "valid-move");
    cell.onclick = (ev) => {
      ev.preventDefault();
      ev.stopPropagation();
      if(c.bullRush){
        const target = Battle.units.find(u => u.uid === c.targetUid);
        if(!target || !target.alive){
          toast("Bull Rush target is no longer there.");
          clearGridCells();
          renderCommandPanel(actor);
          return;
        }
        clearGridCells();
        applyMinotaurBullRush(actor, target, c.pushCol, c.pushRow);
        renderBattle();
        renderCommandPanel(actor);
        return;
      }
      setUnitGrid(actor, c.col, c.row);
      actor.hasMovedThisTurn = true;
      actor.focus = clamp(actor.focus + 8, 0, 100);
      clearGridCells();
      log(`<strong>${actor.name}</strong> moves to block ${c.col + 1},${c.row + 1}.`);
      renderBattle();
      renderCommandPanel(actor);
    };
    layer.appendChild(cell);
  });
}

function clearGridCells(){
  const layer = $("#gridCellLayer");
  if(layer) layer.innerHTML = "";
  $$(".battle-unit").forEach(el => el.classList.remove("moving-unit"));
}

function makeGridCell(col,row,cls){
  const cell = document.createElement("div");
  cell.className = `grid-cell ${cls}`;
  const gridTop = 20;
  const gridHeight = 72;
  cell.style.left = `${(col / GRID.cols) * 100}%`;
  cell.style.top = `${gridTop + (row / GRID.rows) * gridHeight}%`;
  cell.style.width = `${100 / GRID.cols}%`;
  cell.style.height = `${gridHeight / GRID.rows}%`;
  cell.dataset.col = col;
  cell.dataset.row = row;
  return cell;
}

function setTargetMode(actor, moveId, targets){
  clearTargetMode();
  clearGridCells();
  UI.pendingMove = moveId;
  const mv = move(moveId);
  if(!actor || !mv) return;
  const pat = movePatternFor(mv);

  const panel = $("#actionPanel");
  if(panel){
    panel.innerHTML = `
      <div class="command-title"><span>Select Target</span><small>${mv.name} <span class="range-badge">${tacticalRangeLabel(mv)}</span></small></div>
      <div class="command-grid">
        <button type="button" class="back-btn" data-action="cancel-target">Cancel</button>
        <div class="matchup-tip" id="matchupTip"><strong>Preview:</strong> orange = attack range, red = valid targets. ${mv.desc}</div>
      </div>
    `;

    const cancel = panel.querySelector('[data-action="cancel-target"]');
    if(cancel) cancel.addEventListener("click", (ev) => {
      ev.preventDefault();
      ev.stopPropagation();
      clearTargetMode();
      clearGridCells();
      renderSkillPanel(actor);
    });
  }

  const layer = $("#gridCellLayer");
  if(layer){
    const previewCells = patternPreviewCells(actor, mv);
    previewCells.forEach(c => {
      const cls = c.kind === "origin" ? "origin-cell" : c.kind === "path" ? "path-preview" : "range-preview";
      layer.appendChild(makeGridCell(c.col, c.row, cls));
    });
  }

  const performAttack = (target) => {
    clearTargetMode();
    clearGridCells();
    const ok = executeMove(actor, moveId, target);
    if(ok === "async") return;
    if(ok){
      renderBattle();
      endTurn();
    }
  };

  targets.forEach(t => {
    if(layer){
      titanHitCells(t).forEach(hit => {
        const cell = makeGridCell(hit.col, hit.row, t.isTitanBoss ? "valid-target titan-target-cell" : "valid-target");
        cell.onmouseenter = () => {
          const tip = $("#matchupTip");
          if(tip) tip.textContent = matchupText(actor, t, mv);
        };
        cell.onclick = (ev) => {
          ev.preventDefault();
          ev.stopPropagation();
          performAttack(t);
        };
        layer.appendChild(cell);
      });
    }

    const el = unitEl(t);
    if(!el) return;
    el.classList.add("targetable");
    el.onmouseenter = () => {
      const tip = $("#matchupTip");
      if(tip) tip.textContent = matchupText(actor, t, mv);
    };
    el.onclick = (ev) => {
      ev.preventDefault();
      ev.stopPropagation();
      performAttack(t);
    };
  });

  if(!targets.length){
    const tip = $("#matchupTip");
    if(tip) tip.innerHTML = `<strong>No target in range.</strong> Orange cells show where ${mv.name} can reach. Move closer or use another skill.`;
    toast("No targets in range. Orange cells show the attack reach.");
  }

  log(`<strong>${actor.name}</strong> prepares ${mv.name} (${pat.name}). Orange cells show reach. Red cells are valid targets.`);
}

function clearTargetMode(){
  $$(".battle-unit").forEach(el => {
    el.classList.remove("targetable");
    el.classList.remove("moving-unit");
    el.onclick = null;
    el.onmouseenter = null;
  });
  const layer = $("#gridCellLayer");
  if(layer) layer.innerHTML = "";
  UI.pendingMove = null;
}

function chooseEnemyMove(actor){
  if(actor.isTitanBoss){
    const possible = actor.moves.filter(id => {
      const mv = move(id);
      if((actor.cooldowns[id] || 0) > 0) return false;
      if(mv.kind === "ultimate" && actor.focus < 80) return false;
      return true;
    });

    const inRange = possible
      .filter(id => {
        const mv = move(id);
        return ["damage","damage_status","ultimate"].includes(mv.kind)
          && enemiesOf(actor).some(t => inMoveRange(actor, t, mv));
      })
      .sort((a,b) => (move(b).power || 0) - (move(a).power || 0));

    if(inRange.length) return inRange[0];

    const roar = possible.find(id => id === "titan_roar");
    if(roar) return roar;

    return possible[0] || actor.moves[0];
  }

  if(actor.specialMove){
    const sp = move(actor.specialMove);
    if(sp && actor.focus >= 100 && !actor.superForm && Math.random() < .45) return actor.specialMove;
  }

  const possible = actor.moves.filter(id => {
    const mv = move(id);
    if((actor.cooldowns[id] || 0) > 0) return false;
    if(mv.kind === "ultimate" && actor.focus < Math.min((mv.cost || 100), 80)) return false;
    return true;
  });

  if(!possible.length) return actor.moves[0];

  const dif = Battle.difficulty;
  const lowAlly = alliesOf(actor).find(u => u.hp / u.maxHp < .45);
  const heal = possible.find(id => move(id).kind === "heal");
  if(lowAlly && heal) return heal;

  const inRangeDamage = possible
    .filter(id => {
      const mv = move(id);
      return ["damage","multi_damage","damage_status","ultimate"].includes(mv.kind)
        && enemiesOf(actor).some(t => inMoveRange(actor,t,mv));
    })
    .sort((a,b) => (move(b).power || 0) - (move(a).power || 0));

  const ultimate = inRangeDamage.find(id => move(id).kind === "ultimate");
  if(ultimate && (dif === "hard" || dif === "nightmare")) return ultimate;

  const control = possible.find(id => ["damage_status","debuff","debuff_all"].includes(move(id).kind));
  if(control && Math.random() < (dif === "normal" ? .35 : .58)) return control;

  if(inRangeDamage.length) return inRangeDamage[0];

  const longest = possible
    .filter(id => ["damage","multi_damage","damage_status"].includes(move(id).kind))
    .sort((a,b) => movePatternFor(move(b)).range - movePatternFor(move(a)).range)[0];

  if(dif === "easy") return rand(possible);
  return longest || possible[0];
}

function chooseEnemyTarget(actor, mv){
  if(mv.target === "ally") return lowestHp(alliesOf(actor));
  if(["self","all_allies","all_enemies","enemy_front"].includes(mv.target)) return null;

  const enemies = enemiesOf(actor);
  const taunter = enemies.find(u => hasStatus(u, "taunt"));
  if(taunter) return taunter;

  if(Battle.difficulty === "hard" || Battle.difficulty === "nightmare"){
    const support = enemies
      .filter(u => u.role.includes("Support") || u.role.includes("Commander"))
      .sort((a,b) => a.hp - b.hp)[0];

    if(support && Math.random() < .55) return support;
    return lowestHp(enemies);
  }

  if(Battle.difficulty === "normal") {
    return Math.random() < .65 ? lowestHp(enemies) : rand(enemies);
  }

  return rand(enemies);
}

function enemyAct(actor){
  let moveId = chooseEnemyMove(actor);
  let mv = move(moveId);
  let target = chooseEnemyTarget(actor, mv);

  if(target && !inMoveRange(actor, target, mv)){
    const step = nearestLegalStepToward(actor, target);
    if(step){
      setUnitGrid(actor, step.col, step.row);
      actor.hasMovedThisTurn = true;
      actor.focus = clamp(actor.focus + 5, 0, 100);
      log(`<strong>${actor.name}</strong> ${actor.isTitanBoss ? "lumbers forward" : "advances across the grid"}.`);
      renderBattle();

      // After moving, try again. If still out of range, the enemy turn ends.
      target = chooseEnemyTarget(actor, mv);
      if(!target || !inMoveRange(actor, target, mv)){
        endTurn();
        return;
      }
    }
  }

  if(!target && !["self","all_allies","all_enemies","enemy_front"].includes(mv.target)){
    const enemies = enemiesOf(actor);
    target = enemies.find(t => inMoveRange(actor,t,mv)) || lowestHp(enemies);
  }

  const ok = executeMove(actor, moveId, target);
  if(ok === "async") return;
  renderBattle();
  endTurn();
}


function desiredFacingForSide(side){
  return side === "player" ? "left" : "right";
}

function naturalFacingForUnit(u){
  if(u.superForm && u.superSpriteFacing) return u.superSpriteFacing;
  return u.spriteFacing || "right";
}

function facingScaleX(u){
  const desired = desiredFacingForSide(u.side);
  const natural = naturalFacingForUnit(u);
  return desired === natural ? 1 : -1;
}

function renderUnit(u){
  const actor = currentActor();
  const hpPct = clamp(Math.round((u.hp / u.maxHp) * 100), 0, 100);
  const active = actor && actor.uid === u.uid;
  const sideClass = u.side === "player" ? "player-side" : "enemy-side";
  const dead = u.alive ? "" : "dead";
  const statusHtml = u.statuses.map(s => `<span class="status">${statusIcon(s)}</span>`).join("");
  const specialInfo = u.isTitanBoss ? "RAID BOSS" : (u.summonOnly ? (u.id === "shadow_piet" ? "Helper" : `Guard ${u.summonTurns || 0}`) : (u.specialMove ? (u.superForm ? "Super" : `SP ${u.focus}/100`) : `${u.row}`));
  const flipX = facingScaleX(u);

  return `
    <div class="battle-unit ${sideClass} ${dead} ${active ? "active" : ""} ${u.superForm ? "super-form" : ""} ${hasStatus(u, "petrified") ? "petrified-unit" : ""} ${u.isTitanBoss ? "titan-boss" : ""}"
      data-uid="${u.uid}"
      style="left:${u.x}%; top:${u.y}%; scale:${u.scale}; z-index:${Math.round(u.y)}; --flipX:${flipX};">
      <div class="unit-shadow"></div>
      <img class="unit-sprite" src="${u.sprite}" alt="${u.name}">
      <div class="unit-mini-hud">
        <div class="unit-name"><span>${u.name}</span><small>${specialInfo}</small></div>
        <div class="hpbar"><div class="hpfill" style="width:${hpPct}%"></div></div>
        <div class="focusbar"><div class="focusfill" style="width:${u.focus}%"></div></div>
        ${u.specialMove ? `<div class="specialbar"><div class="specialfill" style="width:${u.focus}%"></div></div>` : ""}
        <div class="statuses">${statusHtml}</div>
      </div>
    </div>
  `;
}

function renderPartyHud(){
  const hud = $("#partyHud");
  if(!hud || !Battle) return;

  const actor = currentActor();
  hud.innerHTML = Battle.units.filter(u => u.side === "player" && !u.summonOnly).map(u => {
    const hpPct = clamp(Math.round((u.hp / u.maxHp) * 100), 0, 100);
    const hasSpecial = !!u.specialMove;
    const specialLabel = hasSpecial
      ? (u.superForm ? "SUPER ACTIVE" : `SP ${u.focus}/100`)
      : `FOC ${u.focus}`;
    return `
      <div class="party-member ${actor && actor.uid === u.uid ? "active" : ""} ${u.alive ? "" : "dead"}">
        <img src="${u.sprite}" alt="">
        <div>
          <b>${u.name}</b>
          <small>HP ${Math.round(u.hp)}/${u.maxHp} • ${specialLabel}</small>
          <div class="hpbar"><div class="hpfill" style="width:${hpPct}%"></div></div>
          <div class="focusbar"><div class="focusfill" style="width:${u.focus}%"></div></div>
          ${hasSpecial ? `<div class="specialbar"><div class="specialfill" style="width:${u.specialUsed ? 100 : u.focus}%"></div></div>` : ""}
        </div>
      </div>
    `;
  }).join("");
}

function renderTurnOrder(){
  const order = $("#turnOrder");
  if(!order || !Battle) return;

  order.innerHTML = Battle.queue
    .map(uid => Battle.units.find(u => u.uid === uid))
    .filter(Boolean)
    .slice(0, 12)
    .map(u => `
      <div class="turn-chip ${u.side === "player" ? "player-turn" : "enemy-turn"}" title="${u.name}">
        <img src="${u.sprite}" alt="">
      </div>
    `).join("");
}


function ensureGridLayer(){
  const field = $("#battlefield");
  if(!field) return;
  let layer = $("#gridCellLayer");
  if(!layer){
    layer = document.createElement("div");
    layer.id = "gridCellLayer";
    layer.className = "grid-cell-layer";
    field.appendChild(layer);
  }
}

function renderBattle(){
  if(!Battle) return;

  const arena = $("#arena");
  if(arena) arena.style.backgroundImage = `url(assets/arenas/${Battle.arena}.svg)`;

  const field = $("#battlefield");
  if(field) field.classList.add("grid-mode");

  const title = $("#battleTitle");
  if(title) title.textContent = Battle.title;

  const subtitle = $("#arenaSubtitle");
  if(subtitle) subtitle.textContent = (ArenaNames[Battle.arena] || "Arena") + " • Tactical Grid";

  const round = $("#turnPill");
  if(round) round.textContent = `Round ${Battle.round}`;

  const enemyBoard = $("#enemyBoard");
  const playerBoard = $("#playerBoard");

  if(enemyBoard) enemyBoard.innerHTML = Battle.units.filter(u => u.side === "enemy").map(renderUnit).join("");
  if(playerBoard) playerBoard.innerHTML = Battle.units.filter(u => u.side === "player").map(renderUnit).join("");

  ensureGridLayer();
  renderPartyHud();
  renderTurnOrder();
}

function applyOpeningPassives(){
  if(!Battle) return;
  Battle.units.forEach(unit => {
    if(!unit.alive) return;
    if(unit.id === "joan") {
      alliesOf(unit).forEach(ally => ally.morale = Math.min(100, ally.morale + 8));
      log(`<strong>Inspired Faith</strong> lifts ${unit.side} morale.`);
    }
    if(unit.id === "napoleon") {
      alliesOf(unit).forEach(ally => ally.morale = Math.min(100, ally.morale + 8));
      pop(unit, "EMPEROR", "status");
      log(`<strong>Imperial Momentum</strong> steadies ${unit.side} morale.`);
    }
    if(unit.id === "king_arthur") {
      alliesOf(unit).forEach(ally => ally.morale = Math.min(100, ally.morale + 6));
      pop(unit, "CAMELOT", "status");
      log(`<strong>Camelot's Crown</strong> strengthens ${unit.side} morale.`);
    }
  });
}

function checkGruttePierPassive(unit){
  if(!unit || unit.id !== "grutte_pier" || unit.pierPassiveUsed || !unit.alive) return;
  if(unit.hp > 0 && unit.hp <= unit.maxHp * .50){
    unit.pierPassiveUsed = true;
    addStatus(unit, "rage", 24, 2);
    addStatus(unit, "guard", 24, 2);
    pop(unit, "FRISIAN GIANT", "status");
    spawnFx("shield", unit);
    spawnFx("shadow", unit);
    log(`<strong>Frisian Giant</strong> awakens in Grutte Pier. Rage and Guard rise.`);
  }
}

function startBattle(opts){
  const size = opts.player.length;

  Battle = {
    mode: opts.mode,
    chapterId: opts.chapterId,
    reward: opts.reward,
    title: opts.title,
    arena: opts.arena,
    difficulty: opts.difficulty || "normal",
    units: [],
    queue: [],
    round: 1,
    valhallaUsed: { player: false, enemy: false },
    gauntletFloor: opts.gauntletFloor || 0
  };

  opts.player.forEach((id, i) => Battle.units.push(makeUnit(id, "player", i, size)));
  opts.enemy.forEach((id, i) => Battle.units.push(makeUnit(id, "enemy", i, size)));

  applyGauntletStartState();
  applyOpeningPassives();
  Battle.queue = buildTurnQueue();

  const logBox = $("#battleLog");
  if(logBox) logBox.innerHTML = "";

  const msg = $("#battleMessage");
  if(msg) msg.textContent = "The arena opens...";

  const effects = $("#effectLayer");
  if(effects) effects.innerHTML = "";

  navTo("battle");
  log(`<strong>${opts.title}</strong> begins in ${ArenaNames[opts.arena]}. Tactical grid active. Battles are faster in V2.2.`);
  renderBattle();
  setTimeout(nextTurn, 550);
}

function finishBattle(){
  const won = coreAlive("player").length > 0;
  renderBattle();
  clearTargetMode();

  const isTitan = Battle.mode === "titan";
  const panel = $("#actionPanel");
  if(panel){
    panel.innerHTML = `
      <div class="command-title"><span>${won ? "Victory" : "Defeat"}</span><small>${Battle.title}</small></div>
      <div class="command-grid">
        <div class="matchup-tip">${won
          ? (isTitan ? "Raid clear! Your 5-man team brought down the Titan." : "Your warband wins the arena.")
          : (isTitan ? "Raid failed. The Titan still stands." : "Your team was defeated, but gains a small reward.")
        }</div>
        <button class="command-btn" id="afterBattleBtn">${won ? "Claim Rewards" : "Return"}</button>
      </div>
    `;
  }

  log(`<strong>${won ? "Victory!" : "Defeat."}</strong>`);

  const btn = $("#afterBattleBtn");
  if(btn){
    btn.addEventListener("click", () => {
      if(Battle.mode === "gauntlet"){
        handleAfterGauntletBattle(won);
        return;
      }
      const returnScreen = Battle.mode === "free" ? "freeBattle" : Battle.mode === "titan" ? "titanFights" : "campaign";

      if(won){
        SAVE.wins++;
        SAVE.coins += Battle.mode === "campaign" ? 150 : Battle.mode === "titan" ? 220 : 60;
        SAVE.rankPoints += Battle.mode === "campaign" ? 70 : Battle.mode === "titan" ? 95 : 35;

        if(Battle.mode === "campaign"){
          if(!SAVE.completedCampaign.includes(Battle.chapterId)) SAVE.completedCampaign.push(Battle.chapterId);
          if(Battle.reward && !SAVE.unlocked.includes(Battle.reward)){
            SAVE.unlocked.push(Battle.reward);
            toast(`${warrior(Battle.reward).name} unlocked!`);
          }
        }

        if(Battle.mode === "titan"){
          toast("Titan Raid cleared! +220 coins, +95 rank points.");
        }
      } else {
        SAVE.losses++;
        SAVE.coins += Battle.mode === "titan" ? 30 : 15;
        SAVE.rankPoints = Math.max(0, SAVE.rankPoints - (Battle.mode === "titan" ? 5 : 10));
      }

      saveGame();
      Battle = null;
      renderAll();
      navTo(returnScreen);
    });
  }
}

function initBattleButtons(){
  const quit = $("#quitBattleBtn");
  if(quit){
    quit.addEventListener("click", () => {
      Battle = null;
      navTo("freeBattle");
    });
  }

  const toggle = $("#toggleCombatLog");
  if(toggle){
    toggle.addEventListener("click", () => {
      const logBox = $("#battleLog");
      if(logBox) logBox.classList.toggle("collapsed");
    });
  }
  // V3.5 fallback actionPanel click delegation.
  // If a re-render or overlay ever breaks direct handlers, this keeps core buttons responsive.
  const actionPanel = $("#actionPanel");
  if(actionPanel && !actionPanel.dataset.v35Delegated){
    actionPanel.dataset.v35Delegated = "true";
    actionPanel.addEventListener("click", (ev) => {
      const btn = ev.target.closest("button");
      if(!btn || btn.disabled || !Battle) return;
      const actor = currentActor();
      if(!actor || actor.side !== "player") return;

      // Only handle if the button has no direct custom context or the direct handler did not stop propagation.
      const cmd = btn.dataset.command;
      const moveId = btn.dataset.move;
      const action = btn.dataset.action;

      if(cmd){
        ev.preventDefault();
        ev.stopPropagation();
        if(cmd === "attack") return beginTargetOrExecute(actor, actor.moves[0]);
        if(cmd === "skills") return renderSkillPanel(actor);
        if(cmd === "special" && actor.specialMove) return executeMove(actor, actor.specialMove, actor);
        if(cmd === "move") return setMoveMode(actor);
        if(cmd === "guard"){
          addStatus(actor, "guard", 22, 1);
          actor.focus = clamp(actor.focus + 18, 0, 100);
          pop(actor, "GUARD", "status");
          spawnFx("shield", actor);
          log(`<strong>${actor.name}</strong> guards.`);
          renderBattle();
          return endTurn();
        }
        if(cmd === "wait"){
          actor.focus = clamp(actor.focus + 24, 0, 100);
          log(`<strong>${actor.name}</strong> waits and gathers focus.`);
          renderBattle();
          return endTurn();
        }
        if(cmd === "scan"){
          const enemy = lowestHp(enemiesOf(actor));
          const tip = enemy ? matchupText(actor, enemy, move(actor.moves[0])) : "No enemy.";
          const m = $("#battleMessage");
          if(m) m.textContent = tip;
          return toast(tip);
        }
      }

      if(moveId){
        ev.preventDefault();
        ev.stopPropagation();
        return beginTargetOrExecute(actor, moveId);
      }

      if(action === "back"){
        ev.preventDefault();
        ev.stopPropagation();
        clearGridCells();
        return renderCommandPanel(actor);
      }
      if(action === "cancel-target" || action === "cancel-move"){
        ev.preventDefault();
        ev.stopPropagation();
        clearTargetMode();
        clearGridCells();
        return renderSkillPanel(actor);
      }
    });
  }

}



function titanTeamFilled(){
  return Array.from({length:5}, (_,i) => !!UI.titanTeam[i]).every(Boolean);
}

function autoFillTitanTeam(){
  const unlocked = DATA.warriors
    .filter(w => isUnlocked(w.id) && !w.hidden && !w.isTitan)
    .sort((a,b) => (b.cost - a.cost) || ((b.stats.hp/20 + b.stats.attack + b.stats.defense) - (a.stats.hp/20 + a.stats.attack + a.stats.defense)))
    .map(w => w.id);
  UI.titanTeam = unlocked.slice(0, 5);
  UI.titanActiveSlot = Math.min(UI.titanActiveSlot, 4);
  renderTitanFights();
}

function assignTitanWarrior(id){
  if(!isUnlocked(id)) return toast("This warrior is locked.");
  const w = warrior(id);
  if(!w || w.hidden || w.isTitan) return toast("Cannot use this unit.");
  if(UI.titanTeam.some((x,i) => x === id && i !== UI.titanActiveSlot)){
    return toast("No duplicate warriors in one raid team.");
  }
  UI.titanTeam[UI.titanActiveSlot] = id;
  renderTitanFights();
}

function removeTitanSlot(idx){
  UI.titanTeam[idx] = null;
  while(UI.titanTeam.length && !UI.titanTeam[UI.titanTeam.length - 1]) UI.titanTeam.pop();
  UI.titanActiveSlot = idx;
  renderTitanFights();
}


function titanBosses(){
  return DATA.warriors.filter(w => w.isTitan).sort((a,b) => {
    const order = {cyclops_titan: 1, fire_dragon_titan: 2, ground_dragon_titan: 3};
    return (order[a.id] || 99) - (order[b.id] || 99);
  });
}

function ensureValidSelectedTitan(){
  const bosses = titanBosses();
  if(!bosses.some(w => w.id === UI.selectedTitanId)){
    UI.selectedTitanId = bosses[0]?.id || "cyclops_titan";
  }
}

function renderTitanBossOptions(){
  const select = document.querySelector(".titan-boss-select");
  if(!select) return;
  ensureValidSelectedTitan();
  select.innerHTML = titanBosses().map(w => `
    <button type="button" class="titan-boss-option ${w.id === UI.selectedTitanId ? "active" : ""}" data-titan-id="${w.id}">
      ${w.id === "cyclops_titan" ? "The Cyclops" : w.id === "fire_dragon_titan" ? "Fire Dragon" : "Ground Dragon"}
    </button>
  `).join("");
}

function renderTitanFights(){
  renderTitanBossOptions();
  const slots = $("#titanPlayerSlots");
  const roster = $("#titanUnlockedRoster");
  if(!slots || !roster) return;
  ensureValidSelectedTitan();
  const boss = warrior(UI.selectedTitanId || "cyclops_titan");
  if(boss){
    const meta = TITAN_META[boss.id] || TITAN_META.cyclops_titan;
    const name = $("#titanBossName");
    const art = $("#titanBossArt");
    const hp = $("#titanBossHp");
    const atk = $("#titanBossAtk");
    const def = $("#titanBossDef");
    const reach = $("#titanBossReach");
    const note = $("#titanBossNote");
    if(name) name.textContent = boss.name;
    if(art){ art.src = boss.sprite; art.alt = boss.name; }
    if(hp) hp.textContent = boss.stats.hp;
    if(atk) atk.textContent = boss.stats.attack;
    if(def) def.textContent = boss.stats.defense;
    if(reach) reach.textContent = meta.reach;
    if(note) note.textContent = meta.note;
  }

  $$(".titan-boss-option").forEach(btn => {
    btn.classList.toggle("active", btn.dataset.titanId === (UI.selectedTitanId || "cyclops_titan"));
  });


  if(UI.titanTeam.filter(Boolean).length === 0){
    autoFillTitanTeam();
    return;
  }

  slots.innerHTML = "";
  for(let i=0;i<5;i++){
    const id = UI.titanTeam[i];
    const w = id ? warrior(id) : null;
    const slot = document.createElement("div");
    slot.className = "campaign-slot" + (id ? "" : " empty") + (UI.titanActiveSlot === i ? " active" : "");
    slot.addEventListener("click", () => {
      UI.titanActiveSlot = i;
      renderTitanFights();
    });
    if(w){
      slot.innerHTML = `
        <img src="${w.sprite}" alt="${w.name}">
        <b>${w.name}</b>
        <button class="remove-slot-btn" type="button">×</button>
      `;
      slot.querySelector("button").addEventListener("click", (ev) => {
        ev.preventDefault();
        ev.stopPropagation();
        removeTitanSlot(i);
      });
    }
    slots.appendChild(slot);
  }

  roster.innerHTML = DATA.warriors
    .filter(w => isUnlocked(w.id) && !w.hidden && !w.isTitan)
    .map(w => {
      const selected = UI.titanTeam.includes(w.id);
      return `
        <div class="campaign-pick-card ${selected ? "selected" : ""}" data-id="${w.id}">
          <span>Cost ${w.cost}</span>
          <img src="${w.sprite}" alt="${w.name}">
          <b>${w.name}</b>
          <small>${w.faction} • ${w.role}</small>
        </div>
      `;
    }).join("");

  roster.querySelectorAll("[data-id]").forEach(card => {
    card.addEventListener("click", () => assignTitanWarrior(card.dataset.id));
  });
}

function initTitanFights(){
  const bossSelect = document.querySelector(".titan-boss-select");
  if(bossSelect && !bossSelect.dataset.delegated){
    bossSelect.dataset.delegated = "true";
    bossSelect.addEventListener("click", (ev) => {
      const btn = ev.target.closest(".titan-boss-option");
      if(!btn) return;
      ev.preventDefault();
      UI.selectedTitanId = btn.dataset.titanId || "cyclops_titan";
      renderTitanFights();
    });
  }

  const auto = $("#titanAutoFillBtn");
  if(auto) auto.addEventListener("click", autoFillTitanTeam);

  const clear = $("#titanClearTeamBtn");
  if(clear) clear.addEventListener("click", () => {
    UI.titanTeam = [];
    UI.titanActiveSlot = 0;
    renderTitanFights();
  });

  const start = $("#titanStartBtn");
  if(start) start.addEventListener("click", () => {
    if(!titanTeamFilled()){
      autoFillTitanTeam();
    }
    if(!titanTeamFilled()){
      return toast("Choose 5 unlocked warriors for Titan Fight.");
    }

    ensureValidSelectedTitan();
    const titanId = UI.selectedTitanId || "cyclops_titan";
    const boss = warrior(titanId);
    if(!boss || !boss.isTitan){
      return toast("Titan boss data missing. Reload the game build.");
    }
    const titanMeta = TITAN_META[titanId] || TITAN_META.cyclops_titan;
    startBattle({
      mode: "titan",
      title: `Titan Fight: ${boss.name}`,
      arena: titanMeta.arena || "underworld_gate",
      player: UI.titanTeam.slice(0,5),
      enemy: [titanId],
      difficulty: "titan"
    });
  });
}


function initCampaignTeamSelect(){
  const close = $("#campaignSelectClose");
  if(close) close.addEventListener("click", closeCampaignTeamSelect);

  const auto = $("#campaignAutoFillBtn");
  if(auto) auto.addEventListener("click", autoFillCampaignTeam);

  const clear = $("#campaignClearTeamBtn");
  if(clear) clear.addEventListener("click", () => {
    UI.campaignTeam = [];
    UI.campaignActiveSlot = 0;
    renderCampaignTeamSelect();
  });

  const start = $("#campaignStartBtn");
  if(start) start.addEventListener("click", () => {
    const chapter = campaignChapterById(UI.campaignChapterId);
    startCampaignBattle(chapter);
  });
}


function shopItems(){
  return DATA.warriors.filter(w => w.unlock && String(w.unlock).startsWith("shop_") && !w.hidden && !w.isTitan);
}

function renderShop(){
  const grid = $("#shopGrid");
  if(!grid) return;

  const items = shopItems();
  if(!items.length){
    grid.innerHTML = `<div class="glass">No shop items yet.</div>`;
    return;
  }

  grid.innerHTML = items.map(w => {
    const cost = Number(String(w.unlock).replace("shop_", "")) || w.shopCost || 1000;
    const unlocked = isUnlocked(w.id);
    const canBuy = SAVE.coins >= cost && !unlocked;
    return `
      <article class="shop-card ${unlocked ? "owned" : ""}">
        <div class="shop-art"><img src="${w.sprite}" alt="${w.name}"></div>
        <div class="shop-info">
          <span class="eyebrow">${unlocked ? "Unlocked" : "Shop Warrior"}</span>
          <h3>${w.name}</h3>
          <p>${w.title}</p>
          <div class="badges">
            ${badge(w.rarity)}
            ${badge(w.faction)}
            ${badge(w.role)}
          </div>
          <p><b>Moves:</b> ${w.moves.map(id => move(id)?.name || id).join(", ")}</p>
          <p><b>Special:</b> ${move(w.specialMove)?.name || "None"}</p>
          <button class="${unlocked ? "secondary" : "primary"} wide shop-buy-btn" data-shop-id="${w.id}" ${unlocked || !canBuy ? "disabled" : ""}>
            ${unlocked ? "Owned" : `Unlock for ${cost} coins`}
          </button>
          ${!unlocked && !canBuy ? `<small class="shop-warning">Need ${cost - SAVE.coins} more coins.</small>` : ""}
        </div>
      </article>
    `;
  }).join("");

  $$(".shop-buy-btn").forEach(btn => {
    btn.addEventListener("click", () => buyShopWarrior(btn.dataset.shopId));
  });
}

function buyShopWarrior(id){
  const w = warrior(id);
  if(!w) return;
  if(isUnlocked(id)) return toast(`${w.name} already unlocked.`);
  const cost = Number(String(w.unlock).replace("shop_", "")) || w.shopCost || 1000;
  if(SAVE.coins < cost) return toast(`Not enough coins. Need ${cost}.`);

  SAVE.coins -= cost;
  SAVE.unlocked.push(id);
  saveGame();
  renderShop();
  renderWarriors();
  renderBuilder();
  toast(`${w.name} unlocked!`);
}

function renderAll(){
  renderTop();
  renderHome();
  renderCampaign();
  renderBuilder();
  renderShop();
  renderWarriors();
  renderOptions();
}

function init(){
  loadGame();
  initNav();
  initBuilder();
  initBattleButtons();
  initCampaignTeamSelect();
  initTitanFights();
  initGauntlet();
  renderAll();
  navTo("home");
}

window.addEventListener("DOMContentLoaded", () => {
  try {
    init();
  } catch(e) {
    console.error("Eternal Arena init failed:", e);
    try {
      SAVE = SAVE || DefaultSave();
      renderTop();
      initNav();
      const msg = $("#battleMessage") || $("#toast");
      if(msg) msg.textContent = "Runtime fixed fallback loaded. Try Reset Save if old progress blocks UI.";
    } catch(inner) {
      console.error("Fallback init failed:", inner);
    }
  }
});
