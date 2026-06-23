# Eternal Arena: Warriors of Time

Complete browsergame prototype.

## Features
- Campaign mode met unlocks
- Free Battle 1v1 t/m 5v5
- 10 historical/mythic warriors
- Gegenereerde warrior-sprites verwerkt als game-assets
- Status effects: bleed, fear, stun, guard, taunt, curse, slow, rage, rally, cleanse
- Focus-systeem en ultimates
- Slimmere AI met difficulty-instellingen
- 5 arena-omgevingen met modifiers
- Team-cost systeem tegen overpowered teams
- LocalStorage save system

## Start
Open `index.html` direct in je browser.

## Bestanden
- `index.html` — game shell
- `styles.css` — next-level UI, animaties en responsive layout
- `game.js` — volledige battle engine en game logic
- `assets/sprites/` — losse warrior sprites
- `assets/arenas/` — arena achtergronden
- `data/` — losse data kopieën voor uitbreiding


## V2.2 update
- Battles zijn sneller gemaakt:
  - HP effectief lager
  - attack hoger
  - defense iets minder zwaar
  - damage formula agressiever
  - focus bouwt sneller op
  - ultimates zijn sneller bruikbaar
  - bleed/poison damage sterker
- Tactical grid toegevoegd:
  - Units staan op blokjes
  - Move command toegevoegd
  - Move range: 3 blokjes
  - Slash/blunt: close range
  - Spear/pierce: rechte of diagonale lijn
  - Arrows: lange range
  - Holy/shadow/fear/curse: medium/flex range
  - Enemy AI beweegt als doel buiten bereik staat


## V2.4 update
- Battle balance eerlijker gemaakt.
- Teams starten verder uit elkaar binnen hun eigen formatie, dus minder overlap.
- Startposities: echte front/back spread in plaats van een hoopje units.
- Move kost niet meer je hele beurt: je mag 1x bewegen en daarna nog aanvallen.
- Enemy AI kan ook move + attack doen, maar doet op Easy/Normal minder damage.
- Random Fair Teams is eerlijker: enemy gebruikt vergelijkbare/unlocked pool en respecteert team-cost.
- Enemy start met minder focus.
- Damage iets teruggetuned zodat je niet meteen wordt weggeblazen.


## V2.5 update
- Damage formula volledig opnieuw gebalanceerd.
- Defense gebruikt nu diminishing reduction in plaats van te harde subtraction.
- Basic attacks doen nu duidelijke schade.
- Offensive skills doen merkbaar meer schade.
- Ultimates zijn veel impactvoller.
- Verschillende skill powers zijn verhoogd.
- DoT/status damage is iets sterker.
- Focus bouwt sneller op.
- Balance notes toegevoegd in `BALANCE_NOTES_V2_5.md`.


## V2.6 update
- Facing/spiegeling van battle sprites gefixt.
- Teams kijken nu naar elkaar toe in plaats van van elkaar af.
- Dead/KO state blijft correct gespiegeld per zijde.


## V2.7 update
- Nieuwe Miyamoto Musashi sprite geïmplementeerd.
- Oude Musashi sprite vervangen door een nieuwe transparante PNG.
- Nieuwe sprite netjes uitgesneden, opgeschoond en ingepast in de bestaande battle-assetstijl.


## V2.8 update
- Nieuwe sprites geïmplementeerd voor:
  - Vlad
  - Joan of Arc
  - Viking Berserker
  - Mongol Archer
- Lichte achtergrond verwijderd en sprites netjes uitgesneden.
- Nieuwe sprites gestandaardiseerd naar de bestaande battle-assetstijl.


## V2.9 update
- Nieuwe Leonidas sprite geïmplementeerd.
- Baldwin IV toegevoegd als volledig nieuw speelbaar character.
- Baldwin IV sprite toegevoegd met masker/Kingdom of Heaven-achtige witte kruisridderstijl.
- Nieuwe Baldwin moves:
  - Royal Sword
  - King's Command
  - White Banner Guard
  - Battle of Montgisard
- Nieuw Campaign Chapter 7 toegevoegd: The Leper King.
- Baldwin passive toegevoegd:
  - immune voor Fear
  - onder 40% HP activeert Leper King's Resolve: allies krijgen morale/resistance.


## V3.0 update
- Special Attack systeem toegevoegd.
- Leonidas krijgt nieuwe Special Attack: THIS IS SPARTA.
- Nieuwe Super Leonidas sprite toegevoegd: `assets/sprites/leonidas_super.png`.
- THIS IS SPARTA kost 100 Focus en kan 1x per battle.
- Bij activatie:
  - rode bloody SPECIAL ATTACK overlay
  - Leonidas transformeert naar Super Leonidas
  - HP, Attack en Defense +50%
  - Resistance +25%
  - Morale +25
  - Rage + Guard voor 3 turns
  - Spartan Shockwave damage op alle enemies
  - Front row enemies krijgen Fear


## V3.1 update
- Leonidas en Mongol Archer opnieuw beter uitgesneden.
- Witte/checker achtergrondresten uit deze sprites verwijderd.
- Transparantie van de roster/battle sprites verbeterd.


## V3.2 update
- Baldwin IV sprite opnieuw beter uitgesneden.
- Witte/checker achtergrondresten uit Baldwin verwijderd.
- Leonidas Special Attack UI verbeterd:
  - zichtbare Special meter in battle
  - extra Special knop in het command panel
  - Special bar zichtbaar in party HUD en mini battle HUD


## V3.3 update
- Battle facing system structureel verbeterd.
- Elke warrior/sprite heeft nu een eigen `spriteFacing`.
- Battle units draaien nu automatisch naar de correcte kant per side.
- Dit werkt nu ook beter voor chapters, team layouts en special/super forms.
- Leonidas battle-unit krijgt nu ook zijn Special metadata correct mee.
- Daardoor werkt de Special knop/meter logischer in battle.


## V3.4 update
- Grid alignment van battle-units gefixt.
- Units staan nu op het echte middelpunt van hun tactical tile.
- Dit verbetert de positionering voor alle chapters, alle rijen en specials/super forms.


## V3.5 update
- Click/knop-debug fix.
- Bottom UI krijgt harde z-index/pointer-events prioriteit boven battlefield/grid layers.
- Skills, Cancel, Back, Move en Target-selectie zijn robuuster gebonden met veilige event handlers.
- Extra fallback click-delegation toegevoegd aan action panel.
- 100 validatie-rondes uitgevoerd:
  - JavaScript syntax
  - required functions
  - UI markers
  - CSS click-layer markers
  - warrior/move/campaign data
  - sprite assets


## V3.6 update
- Special Attack bug gefixt.
- THIS IS SPARTA wordt nu atomair uitgevoerd:
  - geen normale target-flow meer
  - geen afhankelijkheid meer van overlay timing
  - Leonidas transformeert direct
  - overlay is alleen visueel
  - shockwave en end turn volgen daarna
- Special-knop roept direct `executeMove(actor, actor.specialMove, actor)` aan.
- 100 speciale validatie-rondes uitgevoerd op code/data/assets.


## V3.7 update
- Special Attack data bug gefixt.
- Foutmelding `Move not found: this_is_sparta` opgelost.
- `this_is_sparta` staat nu correct in:
  - data/moves.json
  - embedded `EMBEDDED_MOVES` in game.js
  - Leonidas warrior metadata
- 100 validatie-rondes uitgevoerd op embedded move-data, Leonidas special metadata en JS syntax.


## V3.8 update
- Battle unit positioning gefixt.
- Units staan weer goed in beeld en zijn afgestemd op de visuele tactical grid.
- Grid mapping gebruikt nu een veilige speelbare vertical band zodat top-row units niet uit beeld verdwijnen.
- Click/target grid-cells gebruiken dezelfde mapping als unit positions.
- Campaign enemies opgeschoond: Leonidas verschijnt niet meer als chapter-tegenstander.
- Chapter 3 vervangt enemy Leonidas door Achilles.
- 100 validatie-rondes uitgevoerd op syntax, campaign data, positioning markers en assets.


## V3.9 update
- Joan of Arc move aangepast:
  - Martyr's Resolve heeft nu cooldown 0.
  - De heal + resistance skill kan nu elke beurt gebruikt worden.


## V4.0 update
- Nieuwe Roman Centurion sprite correct uitgesneden en in de game gezet.
- Nieuwe Achilles sprite correct uitgesneden en in de game gezet.
- Witte/checker achtergrondresten verwijderd.


## V4.1 update
- Free Battle scherm opnieuw ontworpen in een Tekken / Street Fighter character-select stijl.
- Nieuwe layout:
  - links battle setup
  - midden versus stage met team slots en grote fighter preview cards
  - rechts een stijlvolle roster grid met faction/role filters en search
- Team slots zijn nu selecteerbaar; warriors worden in de actieve slot geplaatst.
- Grote preview cards tonen naam, title, stats en passive.
- Start Battle controleert nu of alle slots echt gevuld zijn.


## V4.2 update
- Nieuwe Anubis Warrior sprite correct uitgesneden en in de game gezet.
- Transparantie opgeschoond zodat er geen witte vlakken / achtergrondresten zichtbaar zijn.
- Gecontroleerd dat warriors.json naar assets/sprites/anubis_warrior.png verwijst.


## V4.3 update
- Free Battle layout aangepast zodat de warrior-keuzes onder de grote preview staan.
- Meer fighting-game select screen structuur:
  - links setup panel
  - midden VS + grote character preview
  - onderaan compacte warrior select grid
- Roster cards compacter gemaakt zodat je veel keuzes tegelijk ziet.


## V4.4 update
- Warriors pagina staat iets hoger op het scherm.
- Linker navigatiemenu staat ook iets hoger.
- Bovenruimte op Warriors verkleind voor een strakker overzicht.


## V4.5 update
- Baldwin IV special toegevoegd: Holy Guard of Jerusalem.
- Baldwin kan nu 3 Templar Knights summoneren als special.
- Templar Knights worden correct uitgesneden gebruikt via assets/sprites/templar_knight.png.
- Summons beschermen Baldwin door damage te intercepten en helpen met assist-aanvallen.
- Summons blijven 3 Baldwin-turns actief en verdwijnen als Baldwin sterft.
- Special uitvoerig gedebugd en JavaScript syntax-check uitgevoerd.


## V4.6 update
- Nieuwe warriors toegevoegd: Grutte Pier en Napoleon.
- Beide sprites correct uitgesneden en toegevoegd aan de game.
- Beide hebben eigen stats, passive, moves en roster-integratie.
- Grutte Pier passive werkt: onder 50% HP krijgt hij Rage en Guard.
- Napoleon passive werkt: battle start morale buff en +18 speed in round 1.
- Save/load past start-unlocks automatisch aan, zodat nieuwe start-warriors direct beschikbaar zijn.


## V4.7 update
- Grutte Pier en Napoleon zijn nu campaign-locked in plaats van start-unlocked.
- Nieuwe campaign chapter toegevoegd:
  - Chapter 8: The Frisian Giant — reward: Grutte Pier
  - Chapter 9: The Emperor's Gambit — reward: Napoleon
- Save migration toegevoegd: als deze twee door de vorige build al unlocked waren, worden ze weer gelocked tenzij hun chapter completed is.


## V4.8 update
- Nieuwe locked warriors toegevoegd: King Arthur, James Bond, The Pope en The Hooligan.
- Alle 4 hebben eigen uitgesneden sprites, stats, passives en movesets.
- Nieuwe campaign chapters toegevoegd:
  - Chapter 10: The Sword in the Stone — reward: King Arthur
  - Chapter 11: Operation 007 — reward: James Bond
  - Chapter 12: The Vatican Trial — reward: The Pope
  - Chapter 13: Underground Riot — reward: The Hooligan
- Extra passive logic toegevoegd voor King Arthur, James Bond, The Pope en The Hooligan.
- JavaScript syntax-check en asset-check uitgevoerd.


## V4.9 update
- Campaign chapters starten nu niet meer direct met een automatisch gekozen team.
- Bij elk chapter opent nu eerst een Campaign Team Select scherm.
- Je mag per chapter je eigen team kiezen uit alleen je unlocked warriors.
- Team size volgt het chapter-formaat.
- Enemy team preview toegevoegd.
- Auto Fill, Clear Team en Start Chapter Battle toegevoegd.
- JavaScript syntax-check, campaign data check en asset-check uitgevoerd.


## V5.0 update
- Fixed campaign chapters for the last 4 characters.
- Chapters 8 through 13 are now bonus unlock chapters that open after Chapter 7 is completed.
- The last 4 unlock chapters no longer get stuck behind a strict bonus-chain.
- Campaign Team Select now pre-fills a valid unlocked team, but you can still change it manually.
- Save cleanup expanded for King Arthur, James Bond, The Pope and The Hooligan so they remain locked until their chapter is completed.
- JavaScript syntax-check, campaign data check and asset-check executed.


## V5.1 update
- Nieuwe locked warriors toegevoegd: Battle Priest, Ronin en Plague Doctor.
- Battle Priest heeft healer/support moves: Battlefield Heal, War Prayer en Divine Sanctum.
- Ronin is een snelle bleed/fear duelist.
- Plague Doctor is poison/vulnerable control.
- Nieuwe chapters toegevoegd:
  - Chapter 14: The Sacred Battlefield — reward: Battle Priest
  - Chapter 15: The Masterless Blade — reward: Ronin
  - Chapter 16: The Plague Court — reward: Plague Doctor
- Save cleanup uitgebreid zodat deze drie locked blijven tot hun chapter completed is.
- JavaScript syntax-check, campaign data check en asset-check uitgevoerd.


## V5.2 update
- Nieuwe locked warriors toegevoegd: Atilla the Hun en Cleopatra.
- Nieuwe chapters:
  - Chapter 17: Scourge of the Steppe — reward: Atilla the Hun
  - Chapter 18: Queen of the Nile — reward: Cleopatra
- Cleopatra heeft een echte special move via de Special knop:
  - Summon the Sphinx
  - Summont een Living Sphinx met eigen HP, eigen moveset en AI/turns op het veld.
- Living Sphinx moves:
  - Claw of the Dunes
  - Solar Pounce
  - Pharaoh's Roar
  - Desert Judgement
- Passives:
  - Atilla: bonus damage tegen wounded enemies
  - Cleopatra: start-turn bonus zolang de Sphinx leeft
- Assets opnieuw uitgesneden en embedded data + JS gecheckt.


## V5.3 update
- Fixed Living Sphinx turn behavior.
- Living Sphinx remains a summon for win-condition logic, but now counts as a turn-taking combat unit.
- When Cleopatra summons the Sphinx, it is inserted into the active turn queue so it can attack during battle.
- Templar Knights remain shield/bodyguard summons without full turns.
- JavaScript syntax-check and marker checks executed.


## V5.4 update
- Nieuwe locked warrior toegevoegd: African Tribe Warrior.
- Nieuwe chapter toegevoegd:
  - Chapter 19: Pride of the Savanna — reward: African Tribe Warrior
- Special move toegevoegd:
  - Summon the Lion King
- Lion King is een gevechtssummon met eigen HP, eigen moveset en eigen attack turns.
- Lion King moves:
  - Royal Claw
  - Savanna Pounce
  - King Roar
  - Pride Rampage
- Passive Pride Bond toegevoegd: zolang de Lion King leeft krijgt de warrior Guard en morale.
- Sprites opnieuw uitgesneden en JavaScript syntax-check uitgevoerd.


## V5.5 update
- Nieuwe spelmode toegevoegd: Titan Fights / Raid Mode.
- Nieuwe menu-knop: Titan Fights.
- Nieuwe boss: Cyclops Titan.
- Titan heeft extreem veel HP, hoge attack en defense, maar lage speed en korte melee reach.
- Je kiest 5 unlocked warriors tegen 1 raid boss.
- Titan krijgt eigen moves:
  - Chain Slam
  - Ground Breaker
  - Titan Roar
  - Titan Rage
  - Colossal Crush
- Titan Fight heeft eigen reward flow: +220 coins en +95 rank points bij winst.
- Titan sprite correct uitgesneden zonder witte achtergrond.
- JavaScript syntax-check, asset-check en marker-check uitgevoerd.


## V5.5 namefix
- Titan boss renamed from Cyclops Titan to The Cyclops everywhere in the game UI and data.


## V5.6 update
- Nieuwe Titan Fight boss toegevoegd: The Fire Dragon Titan.
- Titan Fights heeft nu boss selectie:
  - The Cyclops
  - The Fire Dragon Titan
- Fire Dragon Titan eigenschappen:
  - extreem veel HP
  - hoge attack
  - sterke fire/burn pressure
  - trage titan met beperkte reach
  - straft front-line stacking met Fire Breath en Apocalypse Flame
- Nieuwe boss moves:
  - Molten Claw
  - Fire Breath
  - Wing Quake
  - Inferno Roar
  - Apocalypse Flame
- Burn status tick toegevoegd.
- Fire Dragon sprite correct uitgesneden zonder witte achtergrond.
- JavaScript syntax-check, asset-check en marker-check uitgevoerd.


## V5.7 update
- Nieuw locked character toegevoegd: Lucifer the Demon King.
- Lucifer is unlockbaar via chapter C20: The Infernal Throne.
- Nieuwe moves: Hellfire Blade, Abyssal Chains, Dread Coronation, Throne of Hell.
- Sprite correct uitgesneden zonder witte achtergrond.


## V5.8 update
- Nieuw locked character toegevoegd: The Amazon Girl.
- Unlock via chapter C21: Queen of the Wild Hunt.
- Nieuwe moves: Amazon Axe Cleave, Hunter Bow Shot, Predator Dash, Queen of the Wild.
- Sprite correct uitgesneden zonder witte achtergrond.


## V5.9 update
- Fixed Titan targeting in Titan Fights.
- Titans now have a 3-block hitbox, so attacks can target any of the boss blocks.
- The Titan is placed lower on the battlefield.
- The Titan is visually larger.
- Titan hit blocks are highlighted with a BOSS label when selecting attack skills.
- JavaScript syntax-check executed.

## V5.10 update
- Re-cut The Pope, Cleopatra, and Napoleon sprites to stop body parts/robes from disappearing on cards.
- Used a more conservative background-removal pass with safer padding.


## V5.11 update
- Achilles balance changed.
- Godlike Assault removed from normal skill rotation and changed into Achilles' Special Move.
- Godlike Assault is now once per battle at 100 Focus and reduced in power.
- New normal Achilles skill added: Immortal Resolve, a self health restore + Guard buff.
- Special button now supports enemy-target special attacks.


## V5.12 update
- Titan visual placement fixed.
- The Titan still has the same 3-block BOSS hitbox, but the sprite is now anchored lower so it stands on those blocks.
- Titan visual scale increased slightly.
- JavaScript syntax-check executed.


## V5.13 update
- The Pope normal heal Apostolic Blessing confirmed as no-cooldown.
- The Pope now has a Special Move: Holy Healing Rain.
- Holy Healing Rain costs 100 Focus, is once per battle, and restores all living allies to 100% HP.
- Healing Rain also grants allies Resist, Guard and morale.
- Added new healing drop effect asset: assets/effects/holy_healing_drop.png.
- Added falling healing rain animation over the whole allied team.
- JavaScript syntax-check and asset checks executed.


## V5.14 update
- Fixed Warriors menu layout issue where another screen could leave a large blank panel above the Warriors collection.
- Added hard CSS and JS screen hiding so only the active menu page consumes layout space.
- Navigation now resets scroll to top after switching pages.
- JavaScript syntax-check executed.


## V5.16 update
- Campaign Rebalance: chapters reordered into a weaker-to-stronger progression with 24 chapters.
- Campaign now uses strict chapter progression instead of opening all bonus chapters after Chapter 7.
- Every campaign win has simple rewards: character unlock, coins and rank points.
- Added Shop screen to spend coins.
- Added Merlin as a shop warrior for 1000 coins.
- Merlin is a long range magic attacker and healer.
- Merlin special move added: Thunder Strike.
- Thunder Strike uses the new lightning effect sprite and animation.
- Titans remain limited to The Cyclops and The Fire Dragon Titan.
- No stars, skins, or extra reward systems added.
- JavaScript syntax-check, data checks and asset checks executed.


## V5.17 update
- Added Amelia Earhart as a shop warrior for 1000 coins.
- Amelia role: fast ranged/support character.
- New passive: Aerial Instinct (bonus speed + dodge chance).
- New moves: Flare Gun Shot, Warning Flash, Navigator Support, Tailwind Signal.
- New special move: Sky Raid.
- Sky Raid uses airplane, bomb and explosion animation assets.


## V5.24 update
- Special moves now recharge after use: using a special sets Focus back to 0, then the character can earn Focus again and reuse it at 100.
- Removed the hard once-per-battle lock from normal special attacks and support specials.
- Summon specials can be earned again, while duplicate active summons are still prevented where applicable.
- Leonidas' Super Form still stays active after transformation, so it remains naturally limited by Super Form.
- Achilles' Godlike Assault power increased from 210 to 250.
- Merlin's Thunder Strike power increased from 230 to 270.
- JavaScript syntax-check executed.


## V5.25 update
- Added a new Titan Fight boss: **The Ground Dragon**.
- New titan selection button in Titan Fights.
- Added full titan stats, passive, and 5-move raid kit: Boulder Bite, Tectonic Crash, Crystal Spikes, Earth Roar, and Worldsplitter.
- Added cleaned transparent sprite for Ground Dragon Titan.
- Ground Dragon uses titan-specific reach, note, arena metadata, and tuned titan scale/placement in battle.
- JavaScript syntax-check executed.


## V5.26 update
- Fixed Ground Dragon Titan selection/fight start.
- Titan boss buttons now render dynamically from titan data and use delegated click handling.
- Start Titan Fight now validates the selected titan before starting, preventing silent click failures.
- Recut Ground Dragon into a normalized transparent 768x768 titan sprite so it displays correctly in UI and battle.
- Added Ground Dragon battle styling and 3-column titan selector layout.
- JavaScript syntax-check executed.


## V5.27 update
- Added Adrian Carton de Wiart as a new unlockable campaign warrior.
- Added transparent full-body sprite asset.
- Added Act 3 chapter "The Unkillable Soldier" after James Bond.
- Added special move "Unkillable Charge" with temporary damage reduction and revolver-burst.
- Added passive focus gain on hit and extra damage reduction under 50% HP.


## V5.28 update
- Fixed Adrian Carton de Wiart unlock chapter not appearing in Campaign.
- Re-embedded campaign data into game.js, including chapter c15a: The Unkillable Soldier.
- Adrian remains locked until you clear his campaign chapter.
- JavaScript syntax-check executed.


## V5.29 update
- Added Evil Gnome as a shop warrior for 1500 coins.
- Added normal and transformed Evil Gnome sprites.
- Moves: Red Crystal Bolt, Shadow Mend, Vanish Under Hat, Goblin Bite.
- Vanish Under Hat makes the first incoming attack miss.
- Special: Dark Gnome Transformation changes sprite and gives +50% Attack and +50% Defense.
- JavaScript syntax-check executed.


## V5.30 update
- Added Medusa as a shop warrior for 1800 coins.
- Added transparent Medusa sprite.
- Moves: Snake Bite, Venom Bolt, Gorgon Guard, Hypnotic Gaze.
- Hypnotic Gaze makes the target miss its next turn via stun.
- Special: Petrifying Gaze applies Petrified for 2 turns.
- Petrified units get a grey stone overlay and cannot act while petrified.
- JavaScript syntax-check executed.


## V5.31 update
- Added universal attack visuals.
- Close weapon attacks now show a fast slash/smash effect on impact.
- Bite attacks now show a green bite-style slash.
- Arrow/bow attacks now fire an arrow projectile across the battlefield.
- Gun/revolver/shot attacks now fire a bullet tracer.
- Magic/holy/fire/shadow attacks now fire a beam/energy line to the target.
- Keeps existing special effects such as Achilles slash, Merlin thunder, Sky Raid, Bear charge and Medusa petrify.
- JavaScript syntax-check executed.


## V5.32 update
- Added Dark Sinterklaas as a new campaign unlockable warrior.
- Added full transparent sprites for Dark Sinterklaas and Shadow Piet helper summons.
- Added chapter: The Crimson Saint, in Act 4 after The Vatican Trial.
- Moves: Crimson Staff Bolt, Dark Blessing, Cane Strike, Nightmare Bell.
- Special: Summon Shadow Pieten, summoning up to four active helper units.
- Shadow Pieten have weak defense but can move and attack until killed.
- Dark Sinterklaas custom movement: full vertical column plus 4 blocks horizontally.
- Added save migration for users already past this new chapter.
- JavaScript syntax-check executed.


## V5.33 update
- Fixed a runtime-breaking stray async token from V5.32 that could stop the whole game from loading/clicking.
- Hardened save loading for older localStorage saves missing completedCampaign, wins, losses or rank fields.
- Safer nav scrolling to prevent browser-specific scrollTo issues.
- Added guarded init fallback so one old-save issue does not kill the whole UI.
- JavaScript syntax-check executed.
- Runtime save migration sanity checks executed.


## V5.34 update
- Dark Sinterklaas chapter is forced back into the campaign path between The Vatican Trial and The Sword in the Stone.
- Removed the old auto-complete behavior for c17b so the chapter appears as a real unlock chapter again.
- Existing saves from V5.32/V5.33 that auto-unlocked Dark Sinterklaas are relocked once so the player can unlock him properly through the chapter.
- Summon Shadow Pieten now summons 3 helpers instead of 4.
- Shadow Piet speed reduced from 78 to 64.
- JavaScript syntax-check executed.


## V5.36 update
- Rebuilt Victor Wembanyama on top of the last stable V5.34 build.
- Fixed runtime/click/sprite issue from V5.35.
- Added Victor Wembanyama chapter c15b after Adrian.
- Added full-field movement, Flying Dunk, Dribble Evasion, Recover and Hellfire Basketball root special.
- JavaScript syntax-check executed.


## V5.38 update
- Fixed enemy AI turn freeze caused by a ReferenceError in the universal attack FX classifier.
- Moved attack effect name parsing before any name-based checks.
- Added/verified Flying Dunk custom async execution so Wembanyama's dunk deals damage and returns correctly.
- JavaScript syntax-check executed.


## V5.39 update
- Added Options menu to the side navigation.
- Added code input system.
- Code `admin01` unlocks all playable characters and marks campaign chapters complete.
- Added save info panel and reset-save button inside Options.
- JavaScript syntax-check executed.


## V5.40 update
- Evil Gnome's Dark Gnome Transformation no longer ends the turn.
- After transforming, Evil Gnome immediately returns to the command panel and can still attack/use a move.
- Medusa's Petrifying Gaze damage reduced from 118 to 55 because the 2-turn petrify is already very strong.
- JavaScript syntax-check executed.


## V5.42 update
- Minotaur Gladiator is now visible in the Shop.
- Shop price set to 1500 coins.
- Minotaur still remains unlockable through the Labyrinth Gladiator chapter.
- Save cleanup changed so shop-bought warriors are not removed just because their campaign chapter is incomplete.
- JavaScript syntax-check executed.


## V5.43 update
- Added Gauntlet Mode as a new playable mode.
- Pick a 5-warrior team and climb floors with scaling enemy teams.
- Boss floors appear every 5 floors with stronger themed enemy teams.
- HP and Special meter carry between floors.
- After every win choose one reward: heal 25%, +10% attack, +10% defense, +30 special meter, or +1 revive.
- Added Best Floor tracking in the save file.
- JavaScript syntax-check executed.
