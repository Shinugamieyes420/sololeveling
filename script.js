// --- Globale Variabelen & Constanten ---
let currentScreen = 'intro';
let selectedTrainerData = null;
let tempSelectedStarter = null;
let isNewGameSetup = false;

let battleState = {
    playerTeam: [],
    opponentTeam: [],
    playerActiveIndex: 0,
    opponentActiveIndex: 0,
    playerTurn: true,
    currentActingPokemonIsPlayer: true,
    attackerUsedMoveFirstThisTurn: false,
    messageQueue: [],
    isProcessingMessage: false,
    onMessageComplete: null,
    switchingAfterFaint: false,
    isWildBattle: false,
    isGymBattle: false,
    currentGymLeaderKey: null,
    isEliteFourBattle: false,
    currentEliteFourMemberKey: null,
    isPokemonLeagueBattle: false,
    currentLeagueOpponentIndex: 0, // Wordt gesynchroniseerd met selectedTrainerData
    leagueBattlesWon: 0,          // Wordt gesynchroniseerd met selectedTrainerData
    pendingBattleStartFunction: null,
    selectedBattleTeamIndexes: []
};

const GAME_LEVEL = 50;
const SHINY_CHANCE = 0.1; // 10% kans
const CRITICAL_HIT_CHANCE_BASE = 1 / 24;
const CRITICAL_HIT_MULTIPLIER = 1.5;
const PARALYSIS_CHANCE_NO_MOVE = 0.25;
const FREEZE_THAW_CHANCE = 0.2;
const MAX_TEAM_SIZE = 6;
const MAX_PC_BOX_SIZE = 400;
const POKEMON_PER_PC_PAGE = 10;
let currentPcPage = 1;
const TCG_CARDS_PER_PAGE = 9;
let currentTcgPage = 1;
const TCG_CARDS_PER_PACK = 3;


const gameBody = document.getElementById('gameBody');
const screens = {
    intro: document.getElementById('introScreen'),
    characterSelect: document.getElementById('characterSelectScreen'),
    starterSelect: document.getElementById('starterSelectScreen'),
    confirmStarterDialog: document.getElementById('confirmStarterDialog'),
    confirmDialog: document.getElementById('confirmDialog'),
    resetConfirmDialog: document.getElementById('resetConfirmDialog'),
    mainMenu: document.getElementById('mainMenuScreen'),
    playMenu: document.getElementById('playMenuScreen'),
    optionsMenu: document.getElementById('optionsMenuScreen'),
    market: document.getElementById('marketScreen'),
    inventory: document.getElementById('inventoryScreen'),
    team: document.getElementById('teamScreen'),
    pcBox: document.getElementById('pcBoxScreen'),
    teamSelect: document.getElementById('teamSelectScreen'),
    gymLeaderSelect: document.getElementById('gymLeaderSelectScreen'),
    gymLeaderDetail: document.getElementById('gymLeaderDetailScreen'),
    eliteFourSelect: document.getElementById('eliteFourSelectScreen'),
    eliteFourDetail: document.getElementById('eliteFourDetailScreen'),
    pokemonLeague: document.getElementById('pokemonLeagueScreen'),
    myCards: document.getElementById('myCardsScreen'),
    tcgCards: document.getElementById('tcgCardsScreen'),
    tcgCardModal: document.getElementById('tcgCardModal'),
    tcgPackOpeningOverlay: document.getElementById('tcgPackOpeningOverlay'),
    battle: document.getElementById('battleScreen'),
    switchPokemon: document.getElementById('switchPokemonScreen'),
    password: document.getElementById('passwordScreen')
};
const chosenTrainerNameSpan = document.getElementById('chosenTrainerName');
const confirmYesButton = document.getElementById('confirmYes');
const confirmNoButton = document.getElementById('confirmNo');
const trainerCards = document.querySelectorAll('.trainer-card');
const chosenTrainerImageMainMenu = document.getElementById('chosenTrainerImageMainMenu');
const playerCoinsDisplayMainMenuEl = document.getElementById('playerCoinsDisplayMainMenu');

const btnPlay = document.getElementById('btnPlay');
const btnQuickBattlePlay = document.getElementById('btnQuickBattlePlay');
const btnGymBattlePlay = document.getElementById('btnGymBattlePlay');
const btnEliteBattlesPlay = document.getElementById('btnEliteBattlesPlay');
const btnPokemonLeaguePlay = document.getElementById('btnPokemonLeaguePlay');
const btnWildModePlay = document.getElementById('btnWildModePlay');
const btnBackToMainFromPlay = document.getElementById('btnBackToMainFromPlay');

const btnOptions = document.getElementById('btnOptions');
const btnSaveGameOpt = document.getElementById('btnSaveGameOpt');
const btnResetGameOpt = document.getElementById('btnResetGameOpt');
const btnDarkModeOpt = document.getElementById('btnDarkModeOpt');
const btnBackToMainOpts = document.getElementById('btnBackToMainOpts');
const resetConfirmYesButton = document.getElementById('resetConfirmYes');
const resetConfirmNoButton = document.getElementById('resetConfirmNo');

const opponentPokemonNameEl = document.getElementById('opponentPokemonName');
const opponentHpFillEl = document.getElementById('opponentHpFill');
const opponentHpNumbersEl = document.getElementById('opponentHpNumbers');
const opponentTeamStatusEl = document.getElementById('opponentTeamStatus');
const opponentPokemonSpriteEl = document.getElementById('opponentPokemonSprite');
const opponentStatusTagEl = document.getElementById('opponentStatusTag');
const playerPokemonNameEl = document.getElementById('playerPokemonName');
const playerHpFillEl = document.getElementById('playerHpFill');
const playerHpNumbersEl = document.getElementById('playerHpNumbers');
const playerTeamStatusEl = document.getElementById('playerTeamStatus');
const playerPokemonSpriteEl = document.getElementById('playerPokemonSprite');
const playerStatusTagEl = document.getElementById('playerStatusTag');
const battleTextboxEl = document.getElementById('battleTextbox');
const battleMessageEl = document.getElementById('battleMessage');
const actionMenuEl = document.getElementById('actionMenu');
const moveMenuEl = document.getElementById('moveMenu');
const itemMenuEl = document.getElementById('itemMenu');
const attackAnimationLayer = document.getElementById('attackAnimationLayer');
const switchGridEl = document.getElementById('switchGrid');
const switchCancelButton = document.getElementById('switchCancelButton');

const tabMarket = document.getElementById('tabMarket');
const tabInventory = document.getElementById('tabInventory');
const tabTeam = document.getElementById('tabTeam');
const tabMyCards = document.getElementById('tabMyCards');
const tabTcgCards = document.getElementById('tabTcgCards');
const tabMyPc = document.getElementById('tabMyPc');
const tabPassword = document.getElementById('tabPassword');

const marketCoinDisplayEl = document.getElementById('marketCoinDisplay');
const marketItemsGridEl = document.querySelector('#marketScreen .market-items-grid');
const btnBackToMainFromMarket = document.getElementById('btnBackToMainFromMarket');
const inventoryGridEl = document.getElementById('inventoryGrid');
const btnBackToMainFromInventory = document.getElementById('btnBackToMainFromInventory');
const teamGridEl = document.getElementById('teamGrid');
const btnBackToMainFromTeam = document.getElementById('btnBackToMainFromTeam');
const noInventoryItemsMsg = document.querySelector('#inventoryGrid .no-items');
const noTeamPokemonMsg = document.querySelector('#teamGrid .no-pokemon');

const teamSelectGridEl = document.getElementById('teamSelectGrid');
const teamSelectConfirmButton = document.getElementById('teamSelectConfirmButton');
const teamSelectTitleEl = document.getElementById('teamSelectTitle');

const gymLeaderGridEl = document.getElementById('gymLeaderGrid');
const btnBackToPlayMenuFromGymSelect = document.getElementById('btnBackToPlayMenuFromGymSelect');
const gymLeaderDetailNameEl = document.getElementById('gymLeaderDetailName');
const gymLeaderCardImageEl = document.getElementById('gymLeaderCardImage');
const gymLeaderDialogEl = document.getElementById('gymLeaderDialog');
const btnStartGymBattle = document.getElementById('btnStartGymBattle');
const btnBackToGymSelectFromDetail = document.getElementById('btnBackToGymSelectFromDetail');

const eliteFourGridEl = document.getElementById('eliteFourGrid');
const btnBackToPlayMenuFromEliteFourSelect = document.getElementById('btnBackToPlayMenuFromEliteFourSelect');
const eliteFourDetailNameEl = document.getElementById('eliteFourDetailName');
const eliteFourCardImageEl = document.getElementById('eliteFourCardImage');
const eliteFourDialogEl = document.getElementById('eliteFourDialog');
const btnStartEliteFourBattle = document.getElementById('btnStartEliteFourBattle');
const btnBackToEliteFourSelectFromDetail = document.getElementById('btnBackToEliteFourSelectFromDetail');

const pokemonLeagueProgressEl = document.getElementById('pokemonLeagueProgress');
const leagueOpponentNameEl = document.getElementById('leagueOpponentName');
const leagueOpponentCardEl = document.getElementById('leagueOpponentCard');
const btnStartLeagueBattle = document.getElementById('btnStartLeagueBattle');
const btnBackToPlayMenuFromLeague = document.getElementById('btnBackToPlayMenuFromLeague');

const displayedCardImageEl = document.getElementById('displayedCardImage');
const prevCardButton = document.getElementById('prevCardButton');
const nextCardButton = document.getElementById('nextCardButton');
const noCollectedCardsMsgEl = document.getElementById('noCollectedCardsMsg');
const btnBackToMainFromMyCards = document.getElementById('btnBackToMainFromMyCards');

const startersGridEl = document.querySelector('#starterSelectScreen .starters-grid');
const chosenStarterNameDialogSpan = document.getElementById('chosenStarterNameDialog');
const confirmStarterYesButton = document.getElementById('confirmStarterYes');
const confirmStarterNoButton = document.getElementById('confirmStarterNo');

const pcTeamGridEl = document.getElementById('pcTeamGrid');
const pcBoxGridEl = document.getElementById('pcBoxGrid');
const btnBackToMainFromPcBox = document.getElementById('btnBackToMainFromPcBox');
const pcTeamCountEl = document.getElementById('pcTeamCount');
const pcBoxCountEl = document.getElementById('pcBoxCount');
const pcBoxCapacityEl = document.getElementById('pcBoxCapacity');
const noPokemonPcTeamMsg = document.querySelector('#pcTeamGrid .no-pokemon-pc-team');
const noPokemonPcBoxMsg = document.querySelector('#pcBoxGrid .no-pokemon-pc-box');
const pcPrevButton = document.getElementById('pcPrevButton');
const pcNextButton = document.getElementById('pcNextButton');
const pcPageIndicatorEl = document.getElementById('pcPageIndicator');

const tcgCardsGridEl = document.getElementById('tcgCardsGrid');
const noTcgCardsMsgEl = document.getElementById('noTcgCardsMsg');
const btnBackToMainFromTcgCards = document.getElementById('btnBackToMainFromTcgCards');
const tcgSetFilterEl = document.getElementById('tcgSetFilter');
const tcgPrevPageButton = document.getElementById('tcgPrevPageButton');
const tcgNextPageButton = document.getElementById('tcgNextPageButton');
const tcgPageIndicatorEl = document.getElementById('tcgPageIndicator');
const modalTcgCardImageEl = document.getElementById('modalTcgCardImage');
const closeTcgCardModalButton = document.getElementById('closeTcgCardModalButton');

const tcgPackAnimationContainer = screens.tcgPackOpeningOverlay.querySelector('.tcg-pack-animation-container');
const revealedTcgCardContainer = screens.tcgPackOpeningOverlay.querySelector('#revealedTcgCardContainer');
const revealedTcgCardImageEl = document.getElementById('revealedTcgCardImage');
const revealedTcgCardNameEl = document.getElementById('revealedTcgCardName');
const closeTcgRevealButton = document.getElementById('closeTcgRevealButton');
const prevRevealedTcgCardButton = document.getElementById('prevRevealedTcgCardButton');
const nextRevealedTcgCardButton = document.getElementById('nextRevealedTcgCardButton');
const revealedTcgCardIndexIndicatorEl = document.getElementById('revealedTcgCardIndexIndicator');

const btnBackFromMoves = document.getElementById('btnBackFromMoves');

const btnGeneratePassword = document.getElementById('btnGeneratePassword');
const generatedPasswordArea = document.getElementById('generatedPasswordArea');
const inputPasswordArea = document.getElementById('inputPasswordArea');
const btnLoadFromPassword = document.getElementById('btnLoadFromPassword');
const btnBackToMainFromPassword = document.getElementById('btnBackToMainFromPassword');

// --- Audio Elementen & Controls ---
const battleMusicAudio1 = document.getElementById('battleMusic1');
const battleMusicAudio2 = document.getElementById('battleMusic2');
let currentBattleMusic = null;
let battleMusicPlaylist = [battleMusicAudio1, battleMusicAudio2];
let currentMusicIndex = 0;

function playNextBattleMusicTrack() {
    if (currentBattleMusic) {
        currentBattleMusic.pause();
        currentBattleMusic.currentTime = 0;
    }
    currentMusicIndex = (currentMusicIndex + 1) % battleMusicPlaylist.length;
    currentBattleMusic = battleMusicPlaylist[currentMusicIndex];
    if (currentBattleMusic && currentBattleMusic.HAVE_ENOUGH_DATA) { // Check if audio is ready
        currentBattleMusic.volume = 0.2; // Adjust volume as needed
        currentBattleMusic.play().catch(e => console.warn("Battle music play interrupted or failed:", e));
    } else if (currentBattleMusic) {
        // Wait for audio to be ready if it's not
        currentBattleMusic.addEventListener('canplaythrough', () => {
            if (currentBattleMusic === battleMusicPlaylist[currentMusicIndex]) { // Ensure it's still the current track
                 currentBattleMusic.volume = 0.2;
                 currentBattleMusic.play().catch(e => console.warn("Delayed battle music play failed:", e));
            }
        }, { once: true });
    }
}

function startBattleMusic() {
    stopBattleMusic(); // Stop any previous music first
    currentMusicIndex = Math.floor(Math.random() * battleMusicPlaylist.length); // Start with a random track
    currentBattleMusic = battleMusicPlaylist[currentMusicIndex];

    // Set up onended for both tracks to create a loop
    battleMusicPlaylist.forEach((audioTrack, index) => {
        if (audioTrack) {
            audioTrack.onended = playNextBattleMusicTrack;
        }
    });

    if (currentBattleMusic && currentBattleMusic.HAVE_ENOUGH_DATA) {
        currentBattleMusic.volume = 0.2;
        currentBattleMusic.play().catch(e => console.warn("Battle music play failed:", e));
    } else if (currentBattleMusic) {
         currentBattleMusic.addEventListener('canplaythrough', () => {
            if (currentBattleMusic === battleMusicPlaylist[currentMusicIndex]) {
                currentBattleMusic.volume = 0.2;
                currentBattleMusic.play().catch(e => console.warn("Delayed battle music play failed:", e));
            }
        }, { once: true });
    }
}

function stopBattleMusic() {
    battleMusicPlaylist.forEach(audio => {
        if (audio) {
            audio.pause();
            audio.currentTime = 0;
            audio.onended = null; // Remove onended listener to prevent auto-restart
        }
    });
    currentBattleMusic = null;
}


document.addEventListener('DOMContentLoaded', () => {
    const marketPokeballIcon = document.querySelector('.market-item[data-item-id="pokeball"] .item-icon');
    if (marketPokeballIcon) marketPokeballIcon.style.backgroundImage = 'var(--item-icon-pokeball)';

    const marketGreatballIcon = document.querySelector('.market-item[data-item-id="greatball"] .item-icon');
    if (marketGreatballIcon) marketGreatballIcon.style.backgroundImage = 'var(--item-icon-greatball)';

    const marketUltraballIcon = document.querySelector('.market-item[data-item-id="ultraball"] .item-icon');
    if (marketUltraballIcon) marketUltraballIcon.style.backgroundImage = 'var(--item-icon-ultraball)';

    const marketEvoStoneIcon = document.querySelector('.market-item[data-item-id="evolutionstone"] .item-icon');
    if (marketEvoStoneIcon) marketEvoStoneIcon.style.backgroundImage = 'var(--item-icon-evolutionstone)';

    const marketPermaEvoStoneIcon = document.querySelector('.market-item[data-item-id="permaevolutionstone"] .item-icon');
    if (marketPermaEvoStoneIcon) marketPermaEvoStoneIcon.style.backgroundImage = 'var(--item-icon-evolutionstone)';

    const marketTcgPackIcon = document.querySelector('.market-item[data-item-id="tcgpack"] .item-icon');
    if (marketTcgPackIcon) marketTcgPackIcon.style.backgroundImage = 'var(--item-icon-tcgpack)';
});

const trainersData = { "Bea": { name: "Bea", imageUrl: "https://www.pokemonkaart.nl/wp-content/uploads/Bea-TG25-Astral-Radiance.png" }, "Brock": { name: "Brock", imageUrl: "https://www.pokemonkaart.nl/wp-content/uploads/brocks-scouting-179-sv9-eng.png" }, "Giovanni": { name: "Giovanni", imageUrl: "https://www.pokemonkaart.nl/wp-content/uploads/Giovannis-Charisma-204-151.jpg" } };
const SAVE_KEY = 'blazingThunder_savedData_v3.1'; // Versie update voor save key

const typeChart = { "Normal": {"Rock": 0.5, "Ghost": 0, "Steel": 0.5}, "Fire": {"Fire": 0.5, "Water": 0.5, "Grass": 2, "Ice": 2, "Bug": 2, "Rock": 0.5, "Dragon": 0.5, "Steel": 2}, "Water": {"Fire": 2, "Water": 0.5, "Grass": 0.5, "Ground": 2, "Rock": 2, "Dragon": 0.5}, "Electric": {"Water": 2, "Electric": 0.5, "Grass": 0.5, "Ground": 0, "Flying": 2, "Dragon": 0.5}, "Grass": {"Fire": 0.5, "Water": 2, "Grass": 0.5, "Poison": 0.5, "Ground": 2, "Flying": 0.5, "Bug": 0.5, "Rock": 2, "Dragon": 0.5, "Steel": 0.5}, "Ice": {"Fire": 0.5, "Water": 0.5, "Grass": 2, "Ice": 0.5, "Ground": 2, "Flying": 2, "Dragon": 2, "Steel": 0.5}, "Fighting": {"Normal": 2, "Ice": 2, "Poison": 0.5, "Flying": 0.5, "Psychic": 0.5, "Bug": 0.5, "Rock": 2, "Ghost": 0, "Dark": 2, "Steel": 2, "Fairy": 0.5}, "Poison": {"Grass": 2, "Poison": 0.5, "Ground": 0.5, "Rock": 0.5, "Ghost": 0.5, "Steel": 0, "Fairy": 2}, "Ground": {"Fire": 2, "Electric": 2, "Grass": 0.5, "Poison": 2, "Flying": 0, "Bug": 0.5, "Rock": 2, "Steel": 2}, "Flying": {"Electric": 0.5, "Grass": 2, "Fighting": 2, "Bug": 2, "Rock": 0.5, "Steel": 0.5}, "Psychic": {"Fighting": 2, "Poison": 2, "Psychic": 0.5, "Dark": 0, "Steel": 0.5}, "Bug": {"Fire": 0.5, "Grass": 2, "Fighting": 0.5, "Poison": 0.5, "Flying": 0.5, "Psychic": 2, "Ghost": 0.5, "Dark": 2, "Steel": 0.5, "Fairy": 0.5}, "Rock": {"Fire": 2, "Ice": 2, "Fighting": 0.5, "Ground": 0.5, "Flying": 2, "Bug": 2, "Steel": 0.5}, "Ghost": {"Normal": 0, "Psychic": 2, "Ghost": 2, "Dark": 0.5}, "Dragon": {"Dragon": 2, "Steel": 0.5, "Fairy": 0}, "Steel": {"Fire": 0.5, "Water": 0.5, "Electric": 0.5, "Ice": 2, "Rock": 2, "Steel": 0.5, "Fairy": 2}, "Dark": {"Fighting": 0.5, "Psychic": 2, "Ghost": 2, "Dark": 0.5, "Fairy": 0.5}, "Fairy": {"Fire": 0.5, "Fighting": 2, "Poison": 0.5, "Dragon": 2, "Dark": 2, "Steel": 0.5} };
const statStageMultipliers = [1/4, 2/7, 1/3, 2/5, 1/2, 2/3, 1, 1.5, 2, 2.5, 3, 3.5, 4];
const accuracyStageMultipliers = [1/3, 3/8, 3/7, 1/2, 3/5, 3/4, 1, 4/3, 5/3, 2, 7/3, 8/3, 3];

const pokemonPool = [
    // First 3 Kanto Starters
    {
        pokedexId: 1, name: "BULBASAUR", types: ["Grass", "Poison"], hp: 120, baseStats: { attack: 49, defense: 49, speed: 45 },
        moves: [ { name: "Tackle", type: "Normal", accuracy: 100, maxPp: 35, power: 40 }, { name: "Vine Whip", type: "Grass", accuracy: 100, maxPp: 25, power: 45 }, { name: "Poison Powder", type: "Poison", accuracy: 75, maxPp: 35, power: 0, effect: { type: "status", condition: "PSN", chance: 1 } }, { name: "Growth", type: "Normal", accuracy: 100, maxPp: 20, power: 0, effect: { type: "stat", stat: ["attack"], target: "self", stages: 1 }, alwaysHits: true } ],
        spriteFront: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/1.png", spriteBack: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/back/1.png", evolvesToPokedexId: 2
    },
    {
        pokedexId: 2, name: "IVYSAUR", types: ["Grass", "Poison"], hp: 135, baseStats: { attack: 62, defense: 63, speed: 60 },
        moves: [ { name: "Razor Leaf", type: "Grass", accuracy: 95, maxPp: 25, power: 55, highCritRatio: true }, { name: "Poison Powder", type: "Poison", accuracy: 75, maxPp: 35, power: 0, effect: { type: "status", condition: "PSN", chance: 1 } }, { name: "Sleep Powder", type: "Grass", accuracy: 75, maxPp: 15, power: 0, effect: { type: "status", condition: "SLP", chance: 1 } }, { name: "Take Down", type: "Normal", accuracy: 85, maxPp: 20, power: 90 } ],
        spriteFront: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/2.png", spriteBack: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/back/2.png", evolvesToPokedexId: 3
    },
    {
        pokedexId: 3, name: "VENUSAUR", types: ["Grass", "Poison"], hp: 155, baseStats: { attack: 82, defense: 83, speed: 80 },
        moves: [ { name: "Solar Beam", type: "Grass", accuracy: 100, maxPp: 10, power: 120 }, { name: "Sludge Bomb", type: "Poison", accuracy: 100, maxPp: 10, power: 90, effect: { type: "status", condition: "PSN", chance: 0.3 } }, { name: "Earthquake", type: "Ground", accuracy: 100, maxPp: 10, power: 100 }, { name: "Growth", type: "Normal", accuracy: 100, maxPp: 20, power: 0, effect: { type: "stat", stat: "attack", target: "self", stages: 1 }, alwaysHits: true } ],
        spriteFront: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/3.png", spriteBack: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/back/3.png", evolvesToPokedexId: null
    },

    // Legendaries
    {
        pokedexId: 383, name: "RAYQUAZA", types: ["Dragon", "Flying"], hp: 180, baseStats: { attack: 150, defense: 90, speed: 95 },
        moves: [ { name: "Dragon Ascent", type: "Flying", accuracy: 100, maxPp: 5, power: 120, effect: { type: "stat_self_multi", stats: ["defense"], target: "self", stages: [-1] } }, { name: "Dragon Claw", type: "Dragon", accuracy: 100, maxPp: 15, power: 80 }, { name: "Earthquake", type: "Ground", accuracy: 100, maxPp: 10, power: 100 }, { name: "Extreme Speed", type: "Normal", accuracy: 100, maxPp: 5, power: 80, priority: 2 } ],
        spriteFront: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/383.png", spriteBack: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/back/383.png", evolvesToPokedexId: null
    },
    {
        pokedexId: 384, name: "JIRACHI", types: ["Steel", "Psychic"], hp: 175, baseStats: { attack: 100, defense: 100, speed: 100 },
        moves: [ { name: "Iron Head", type: "Steel", accuracy: 100, maxPp: 15, power: 80, effect: { type: "flinch", chance: 0.3 } }, { name: "Zen Headbutt", type: "Psychic", accuracy: 90, maxPp: 15, power: 80, effect: { type: "flinch", chance: 0.2 } }, { name: "Fire Punch", type: "Fire", accuracy: 100, maxPp: 15, power: 75, effect: { type: "burn", chance: 0.1 } }, { name: "Wish", type: "Normal", accuracy: 100, maxPp: 10, power: 0, effect: { type: "wish" } } ],
        spriteFront: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/384.png", spriteBack: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/back/384.png", evolvesToPokedexId: null
    },
    {
        pokedexId: 385, name: "DEOXYS", types: ["Psychic"], hp: 125, baseStats: { attack: 150, defense: 50, speed: 150 },
        moves: [ { name: "Psycho Boost", type: "Psychic", accuracy: 90, maxPp: 5, power: 140, effect: { type: "stat_self_multi", stats: ["attack"], target: "self", stages: [-2] } }, { name: "Zen Headbutt", type: "Psychic", accuracy: 90, maxPp: 15, power: 80, effect: { type: "flinch", chance: 0.2 } }, { name: "Superpower", type: "Fighting", accuracy: 100, maxPp: 5, power: 120, effect: { type: "stat_self_multi", stats: ["attack", "defense"], target: "self", stages: [-1, -1] } }, { name: "Extreme Speed", type: "Normal", accuracy: 100, maxPp: 5, power: 80, priority: 2 } ],
        spriteFront: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/385.png", spriteBack: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/back/385.png", evolvesToPokedexId: null
    }
    // Voeg hier meer Pokémon toe zoals nodig
];

    const gymLeadersData = {
            "Misty": {
                name: "Misty",
                cardUrl: "https://www.pokemonkaart.nl/wp-content/uploads/Evolutions_Misty%E2%80%99s-Determination-1.jpg",
                badgeName: "Cascade Badge",
                badgeUrl: "https://archives.bulbagarden.net/media/upload/thumb/9/9c/Cascade_Badge.png/50px-Cascade_Badge.png",
                pokemonTeam: ["SEADRA", "GOLDUCK", "STARMIE"],
                dialog: "My water Pokémon are unbeatable!"
            },
    "Jasmine": {
        name: "Jasmine",
        cardUrl: "https://www.pokemonkaart.nl/wp-content/uploads/Team-Up_Jasmine.jpg",
        badgeName: "Mineral Badge",
        badgeUrl: "https://archives.bulbagarden.net/media/upload/thumb/1/11/Mineral_Badge.png/50px-Mineral_Badge.png",
        pokemonTeam: ["SKARMORY", "MAGNETON", "STEELIX"],
        dialog: "...You're a kind person. ...Allow me to see your Pokémon's power."
    }
        };
const eliteFourData = {
    "Bruno": {
        name: "Bruno",
        cardUrl: "https://www.pokemonkaart.nl/wp-content/uploads/Battle-Styles_Bruno-1.jpg",
        pokemonTeam: ["MACHAMP", "HITMONLEE", "HITMONCHAN", "ONIX", "GOLEM", "HERACROSS"], // Team van 6
        dialog: "Hahaha! I am Bruno of the Elite Four! I've lived and trained with my Fighting Pokémon! And I'm ready to take you on! Bring it!"
    },
    "Koga": {
        name: "Koga",
        cardUrl: "https://www.pokemonkaart.nl/wp-content/uploads/Unbroken-Bonds_Koga%E2%80%99s-Trap-1.jpg",
        pokemonTeam: ["MUK", "TENTACRUEL", "GOLBAT", "WEEZING", "ARBOK", "ARTICUNO"], // Team van 6
        dialog: "A ninja's duty is to misdirect and confuse. Prepare for a taste of poison and illusion!"
    }
};

// BELANGRIJK: Pas deze array aan met 3 trainers, elk met een team van 6 Pokémon (namen als strings)
const pokemonLeagueTrainers = [
    {
        name: "Lorelei (League)", // Voorbeeld, pas aan!
        cardUrl: "https://www.pokemonkaart.nl/wp-content/uploads/Lost-Origin_Lorelei.jpg", // Voorbeeld kaart
        pokemonTeam: ["DEWGONG", "CLOYSTER", "SLOWBRO", "JYNX", "LAPRAS", "ARTICUNO"], // VOORBEELD TEAM VAN 6
        dialog: "Welcome to the Pokémon League! No one can withstand my Ice-type Pokémon!"
    },
    {
        name: "Agatha (League)", // Voorbeeld, pas aan!
        cardUrl: "https://www.pokemonkaart.nl/wp-content/uploads/151_Agathas-Backup-1.jpg", // Voorbeeld kaart
        pokemonTeam: ["GENGAR", "GOLBAT", "HAUNTER", "ARBOK", "MISDREAVUS", "CROBAT"], // VOORBEELD TEAM VAN 6
        dialog: "I am Agatha of the Elite... No, the Pokémon League! My Ghost-type Pokémon will haunt you!"
    },
    {
        name: "Lance (Champion)", // Voorbeeld, pas aan!
        cardUrl: "https://www.pokemonkaart.nl/wp-content/uploads/Lance-Full-Art-silver-tempest-SWSH-192195.jpg",
        pokemonTeam: ["GYARADOS", "DRAGONAIR", "DRAGONITE", "AERODACTYL", "CHARIZARD", "RAYQUAZA"], // VOORBEELD TEAM VAN 6
        dialog: "You've made it this far, challenger. But this is where your journey ends! Face the might of dragons!"
    }
];
let currentLeagueOrder = []; // Wordt gevuld in showPokemonLeagueScreen
let displayedCardCollection = [];
let currentCardIndex = 0;
let currentFilteredTcgCards = [];
let revealedTcgCards = []; // Voor TCG pack opening
let currentRevealedTcgCardIndex = 0; // Voor TCG pack opening

// --- Functies voor wachtwoordbeheer ---
function generatePassword() {
    if (!selectedTrainerData) {
        alert("No game data to generate a password from.");
        return;
    }
    try {
        // Zorg ervoor dat selectedTrainerData up-to-date is
        // saveGame(); // Niet per se hier, maar zorg dat het recent is. De game autosaved na battles.

        const exportData = {
            name: selectedTrainerData.name,
            imageUrl: selectedTrainerData.imageUrl,
            coins: selectedTrainerData.coins,
            inventory: selectedTrainerData.inventory,
            team: selectedTrainerData.team.map(p => p ? { pokedexId: p.pokedexId, currentHP: p.currentHP, maxHP: p.maxHP, status: p.status, isShiny: p.isShiny, moves: p.moves.map(m => ({name: m.name, currentPp: m.currentPp})), id: p.id, originalEvolutionData: p.originalEvolutionData } : null).filter(p => p),
            pcBox: selectedTrainerData.pcBox.map(p => p ? { pokedexId: p.pokedexId, currentHP: p.currentHP, maxHP: p.maxHP, status: p.status, isShiny: p.isShiny, moves: p.moves.map(m => ({name: m.name, currentPp: m.currentPp})), id: p.id, originalEvolutionData: p.originalEvolutionData } : null).filter(p => p),
            defeatedGymLeaders: selectedTrainerData.defeatedGymLeaders,
            defeatedEliteFourMembers: selectedTrainerData.defeatedEliteFourMembers,
            collectedTcgCards: selectedTrainerData.collectedTcgCards.map(c => ({ id: c.id, pokemonGameName: c.pokemonGameName, pokedexId: c.pokedexId, spriteUrl: c.spriteUrl, tcgCardName: c.tcgCardName, tcgSet: c.tcgSet || null })),
            hasChosenStarter: selectedTrainerData.hasChosenStarter,
            // Pokémon League Progress
            currentLeagueOpponentIndex: selectedTrainerData.currentLeagueOpponentIndex || 0,
            leagueBattlesWon: selectedTrainerData.leagueBattlesWon || 0,
            defeatedPokemonLeague: selectedTrainerData.defeatedPokemonLeague || false
        };
        const jsonString = JSON.stringify(exportData);
        const base64String = btoa(jsonString);
        generatedPasswordArea.value = base64String;
        alert("Password generated and copied to the text area. Save it securely!");
    } catch (error) {
        console.error("Error generating password:", error);
        alert("Could not generate password. See console for details.");
        generatedPasswordArea.value = "Error generating password.";
    }
}

function loadFromPassword() {
    const base64String = inputPasswordArea.value.trim();
    if (!base64String) {
        alert("Please enter a password.");
        return;
    }
    try {
        const jsonString = atob(base64String);
        const importedData = JSON.parse(jsonString);

        if (!importedData || typeof importedData.name !== 'string' || !Array.isArray(importedData.team)) {
            throw new Error("Invalid password format.");
        }

        const baseTrainer = trainersData[importedData.name] || Object.values(trainersData)[0];
        selectedTrainerData = JSON.parse(JSON.stringify(baseTrainer)); // Start with a clean base

        // Overwrite with imported data
        selectedTrainerData.coins = parseInt(importedData.coins) || 0;
        selectedTrainerData.inventory = importedData.inventory || { "Poke Ball": 5, "Great Ball": 0, "Ultra Ball": 0, "Evolution Stone": 1, "Perma Evolution Stone": 0, "TCG Pack": 0 };
        if(importedData.inventory && typeof importedData.inventory["Ultra Ball"] !== 'undefined'){
             selectedTrainerData.inventory["Ultra Ball"] = importedData.inventory["Ultra Ball"];
        } else if (!selectedTrainerData.inventory["Ultra Ball"]) {
            selectedTrainerData.inventory["Ultra Ball"] = 0;
        }

        selectedTrainerData.defeatedGymLeaders = importedData.defeatedGymLeaders || [];
        selectedTrainerData.defeatedEliteFourMembers = importedData.defeatedEliteFourMembers || [];
        selectedTrainerData.collectedTcgCards = (importedData.collectedTcgCards || []).map(c => ({ ...c, tcgSet: c.tcgSet || "Unknown Set" }));
        selectedTrainerData.hasChosenStarter = typeof importedData.hasChosenStarter === 'boolean' ? importedData.hasChosenStarter : true; // Assume true if loading progress

        // Pokémon League Progress
        selectedTrainerData.currentLeagueOpponentIndex = importedData.currentLeagueOpponentIndex || 0;
        selectedTrainerData.leagueBattlesWon = importedData.leagueBattlesWon || 0;
        selectedTrainerData.defeatedPokemonLeague = importedData.defeatedPokemonLeague || false;


        selectedTrainerData.team = restoreFullPokemonList(importedData.team, false);
        selectedTrainerData.pcBox = restoreFullPokemonList(importedData.pcBox, false);


        if (chosenTrainerImageMainMenu && selectedTrainerData.imageUrl) {
            chosenTrainerImageMainMenu.src = selectedTrainerData.imageUrl;
            chosenTrainerImageMainMenu.alt = selectedTrainerData.name;
        }
        updateCoinDisplay();
        saveGame(); // Save the loaded state to localStorage
        alert("Game data loaded successfully from password!");
        switchScreen('mainMenu');
        inputPasswordArea.value = "";

    } catch (error) {
        console.error("Error loading from password:", error);
        alert("Invalid or corrupted password. Could not load game data. Error: " + error.message);
    }
}

function restoreFullPokemonList(listData, isOpponentTeam = false) {
    return (listData || []).map(savedPok => {
        if (!savedPok || typeof savedPok.pokedexId === 'undefined') return null;
        const baseData = pokemonPool.find(p => p.pokedexId === savedPok.pokedexId);
        if (!baseData) {
            console.warn(`Pokémon with PokedexID ${savedPok.pokedexId} not found in current pool. Skipping.`);
            return null;
        }

        // Pass savedPok.isShiny to createPokemonFromData
        let fullPokemon = createPokemonFromData({...baseData, isShiny: savedPok.isShiny}, isOpponentTeam, !isOpponentTeam);

        fullPokemon.id = savedPok.id || fullPokemon.id; // Keep original ID if present
        fullPokemon.currentHP = Math.min(savedPok.currentHP, fullPokemon.maxHP);
        // fullPokemon.maxHP is already set by createPokemonFromData via baseData.hp
        fullPokemon.status = savedPok.status || null;
        // fullPokemon.isShiny is set by createPokemonFromData
        fullPokemon.originalEvolutionData = savedPok.originalEvolutionData || null; // Restore this first

        if (fullPokemon.originalEvolutionData) { // If it was evolved temporarily, restore its original form's base stats/moves for consistency
             const originalBase = pokemonPool.find(p => p.pokedexId === fullPokemon.originalEvolutionData.pokedexId);
             if (originalBase) {
                 fullPokemon.moves = originalBase.moves.map(baseMove => {
                    const savedMoveData = savedPok.moves.find(sm => sm.name === baseMove.name);
                    return {
                        ...baseMove,
                        currentPp: (savedMoveData && typeof savedMoveData.currentPp !== 'undefined') ? savedMoveData.currentPp : baseMove.maxPp
                    };
                });
             }
        } else if (savedPok.moves && Array.isArray(savedPok.moves)) {
            fullPokemon.moves = baseData.moves.map(baseMove => {
                const savedMoveData = savedPok.moves.find(sm => sm.name === baseMove.name);
                return {
                    ...baseMove,
                    currentPp: (savedMoveData && typeof savedMoveData.currentPp !== 'undefined') ? savedMoveData.currentPp : baseMove.maxPp
                };
            });
        } else {
             fullPokemon.moves = baseData.moves.map(m => ({ ...m, currentPp: m.maxPp }));
        }

        // If it's an evolved form (no originalEvolutionData means it's "naturally" this form or permanently evolved)
        // ensure its sprites are correct for its current shiny state.
        // createPokemonFromData should handle this, but a double check:
        const shinyBaseUrl = "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon";
        const currentPokedexIdForSprite = fullPokemon.pokedexId;
        const currentBaseSpriteData = pokemonPool.find(p => p.pokedexId === currentPokedexIdForSprite) || {};

        fullPokemon.spriteFrontUrl = fullPokemon.isShiny ? `${shinyBaseUrl}/shiny/${currentPokedexIdForSprite}.png` : (currentBaseSpriteData.spriteFront || `${shinyBaseUrl}/${currentPokedexIdForSprite}.png`);
        fullPokemon.spriteBackUrl = fullPokemon.isShiny ? `${shinyBaseUrl}/back/shiny/${currentPokedexIdForSprite}.png` : (currentBaseSpriteData.spriteBack || `${shinyBaseUrl}/back/${currentPokedexIdForSprite}.png`);


        return fullPokemon;
    }).filter(p => p);
}


// --- Helper Functions ---
function createPokemon(name, types, hp, baseStats, moves, spriteFront, spriteBack, isShiny = false, pokedexIdInput = null) {
    const shinyBaseUrl = "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon";
    const idFromSprite = spriteFront ? spriteFront.split('/').pop().split('.')[0] : (pokedexIdInput || 0).toString(); // Fallback if spriteFront is empty
    const effectivePokedexId = pokedexIdInput !== null ? pokedexIdInput : parseInt(idFromSprite);

    const basePokemonData = pokemonPool.find(p => p.pokedexId === effectivePokedexId) || {};

    return {
        id: Date.now().toString(36) + Math.random().toString(36).substr(2),
        pokedexId: effectivePokedexId,
        name: name.toUpperCase(), types: types, maxHP: hp, currentHP: hp,
        baseStats: JSON.parse(JSON.stringify(baseStats)),
        stats: { attack: 0, defense: 0, speed: 0, accuracy: 0, evasion: 0 }, // Stat stages
        moves: moves.map(m => ({ ...m, currentPp: m.maxPp })),
        spriteFrontUrl: isShiny ? `${shinyBaseUrl}/shiny/${effectivePokedexId}.png` : (spriteFront || `${shinyBaseUrl}/${effectivePokedexId}.png`),
        spriteBackUrl: isShiny ? `${shinyBaseUrl}/back/shiny/${effectivePokedexId}.png` : (spriteBack || `${shinyBaseUrl}/back/${effectivePokedexId}.png`),
        status: null, isShiny: isShiny,
        sleepTurns: 0,
        flinch: false,
        originalEvolutionData: null, // For temporary evolutions
        evolvesToPokedexId: basePokemonData.evolvesToPokedexId || null
    };
}

function createPokemonFromData(data, isOpponent = false, forPlayerTeam = false) {
    let isShiny = false;
    // Prioritize data.isShiny if it exists (e.g., from saved game or specific event)
    if (typeof data.isShiny === 'boolean') {
        isShiny = data.isShiny;
    } else if ((isOpponent || (battleState.isWildBattle && !forPlayerTeam)) && Math.random() < SHINY_CHANCE) {
        // Original logic for random shiny for opponents/wild, but only if data.isShiny was not provided
        isShiny = true;
    }

    // Use the determined 'isShiny' status when creating the Pokémon
    const newPokemon = createPokemon(data.name, data.types, data.hp, data.baseStats, data.moves, data.spriteFront, data.spriteBack, isShiny, data.pokedexId);
    return newPokemon;
}

function calculateStatWithStage(baseStat, stage, statType) { const stageArray = (statType === 'accuracy' || statType === 'evasion') ? accuracyStageMultipliers : statStageMultipliers; const modifier = stageArray[stage + 6]; let finalStat = Math.floor(baseStat * modifier); if (statType === 'speed') { const pokemonToCheck = battleState.playerTurn ? (battleState.opponentTeam[battleState.opponentActiveIndex] || {}) : (battleState.playerTeam[battleState.playerActiveIndex] || {}); if (pokemonToCheck && pokemonToCheck.status === 'PAR' && baseStat === pokemonToCheck.baseStats?.speed) { finalStat = Math.floor(finalStat / 2); } } return finalStat; }
function calculateTypeEffectiveness(moveType, defenderTypes) { let totalEffectiveness = 1; if (!typeChart[moveType]) return 1; defenderTypes.forEach(defenderType => { if (typeChart[moveType][defenderType] !== undefined) { totalEffectiveness *= typeChart[moveType][defenderType]; }}); return totalEffectiveness; }
function getEffectivenessText(multiplier, defenderName) { if (multiplier >= 2) return "It's super effective!"; if (multiplier > 0 && multiplier < 1) return "It's not very effective..."; if (multiplier === 0) return `It doesn't affect foe ${defenderName.toUpperCase()}...`; return ""; }
function switchScreen(screenKey) { Object.keys(screens).forEach(key => { if (screens[key]) screens[key].style.display = 'none'; }); if (screens[screenKey]) { screens[screenKey].style.display = 'flex'; currentScreen = screenKey; } else { console.error(`Screen '${screenKey}' not found.`); } }
function typeMessage(message, callback) { if (battleState.isProcessingMessage && message) { battleState.messageQueue.push({ message, callback }); return; } battleState.isProcessingMessage = true; battleMessageEl.textContent = ''; actionMenuEl.style.display = 'none'; moveMenuEl.style.display = 'none'; itemMenuEl.style.display = 'none'; battleTextboxEl.style.display = 'block'; battleTextboxEl.style.visibility = 'visible'; let i = 0; const intervalId = setInterval(() => { if (i < message.length) { battleMessageEl.textContent += message.charAt(i); i++; } else { clearInterval(intervalId); battleState.isProcessingMessage = false; battleState.onMessageComplete = callback; processMessageQueue(); } }, 35); }
function processMessageQueue() { if (!battleState.isProcessingMessage && battleState.messageQueue.length > 0) { const next = battleState.messageQueue.shift(); typeMessage(next.message, next.callback); } }
if (battleTextboxEl && battleTextboxEl.parentElement) { battleTextboxEl.parentElement.addEventListener('click', (e) => { if (e.target.closest('.battle-menu') || e.target.closest('#switchPokemonScreen') || e.target.closest('#teamSelectScreen') || e.target.closest('.dialog-overlay')) return; if (!battleState.isProcessingMessage && battleState.onMessageComplete) { const callback = battleState.onMessageComplete; battleState.onMessageComplete = null; callback(); processMessageQueue(); } });}
function updateHpBar(hpFillElement, hpNumbersElement, currentHp, maxHp) { const p = Math.max(0, (currentHp / maxHp) * 100); hpFillElement.style.width = p + '%'; if (p > 50) hpFillElement.style.backgroundColor = 'var(--hp-high-color)'; else if (p > 20) hpFillElement.style.backgroundColor = 'var(--hp-medium-color)'; else hpFillElement.style.backgroundColor = 'var(--hp-low-color)'; if (hpNumbersElement) hpNumbersElement.textContent = `${Math.max(0, Math.floor(currentHp))}/${maxHp}`; }
function updateStatusTag(pokemon, tagElement) { if (pokemon.status) { tagElement.textContent = pokemon.status.toUpperCase(); tagElement.className = 'status-tag ' + pokemon.status.toUpperCase(); tagElement.style.display = 'inline-block'; } else { tagElement.style.display = 'none'; } }

function playShakeAnimation(spriteElementContainer) {
    if (spriteElementContainer && typeof anime === 'function') {
        const baseScale = spriteElementContainer.classList.contains('player-sprite') ? 2.1 : 1.4;
        anime({
            targets: spriteElementContainer,
            translateX: [
                { value: -5, duration: 50, delay: 0 },
                { value: 5, duration: 100, delay: 0 },
                { value: -5, duration: 100, delay: 0 },
                { value: 5, duration: 100, delay: 0 },
                { value: 0, duration: 50, delay: 0 }
            ],
            scale: baseScale,
            easing: 'easeInOutSine',
            duration: 400
        });
    } else if (spriteElementContainer) {
         spriteElementContainer.classList.add('shake-anim');
         setTimeout(() => { spriteElementContainer.classList.remove('shake-anim'); }, 500);
    }
}

function playAttackAnimation(moveType, attackerSpriteEl, defenderSpriteEl, onComplete) {
    if (typeof anime !== 'function') {
        setTimeout(() => { if (onComplete) onComplete(); }, 500);
        return;
    }
    const animElement = document.createElement('div');
    animElement.classList.add('attack-animation');
    const attackerRect = attackerSpriteEl.getBoundingClientRect();
    const defenderRect = defenderSpriteEl.getBoundingClientRect();
    const layerRect = attackAnimationLayer.getBoundingClientRect();
    const startX = attackerRect.left + attackerRect.width / 2 - layerRect.left;
    const startY = attackerRect.top + attackerRect.height / 2 - layerRect.top;
    const endX = defenderRect.left + defenderRect.width / 2 - layerRect.left;
    const endY = defenderRect.top + defenderRect.height / 2 - layerRect.top;
    let animationProps = {};
    switch (moveType.toUpperCase()) {
        case 'FIRE': animElement.style.cssText = 'width:40px;height:40px;background-color:orangered;border-radius:50%;box-shadow:0 0 20px 10px darkorange, 0 0 30px 15px rgba(255,69,0,0.7);'; animationProps = { translateX: [startX - 20, endX - 20], translateY: [startY - 20, endY - 20], scale: [0.5, 1.8, 0.8], opacity: [0, 1, 0], duration: 600, easing: 'easeOutExpo' }; break;
        case 'WATER': animElement.style.cssText = 'width:50px;height:30px;background:radial-gradient(circle, rgba(173,216,230,1) 0%, rgba(0,119,182,1) 100%);border-radius:15px;border:3px solid cyan;box-shadow:0 0 15px 5px skyblue;'; animationProps = { translateX: [startX - 25, endX - 25], translateY: [startY - 15, endY - 15], scale: [0.8, 1.5, 0.7], opacity: [0, 1, 0], rotate: anime.random(300, 420), duration: 700, easing: 'easeInOutQuart' }; break;
        case 'ELECTRIC': animElement.style.cssText = `width:120px;height:120px;background-color:yellow;border-radius:50%;opacity:0;left:${endX - 60}px;top:${endY - 60}px;box-shadow:0 0 30px 20px gold, 0 0 40px 25px yellow, 0 0 60px 35px rgba(255,255,0,0.6);`; animationProps = { opacity: [0, 0.9, 0.6, 0.9, 0], scale: [1, 1.6, 1.2, 1.6, 1], duration: 350, easing: 'linear' }; break;
        case 'GRASS': animElement.style.cssText = `width:35px;height:70px;background-color:limegreen;border-radius:50% 50% 10px 10px / 80% 80% 20% 20%;left:${startX - 17}px;top:${startY - 35}px;box-shadow:0 0 10px 3px darkgreen;`; animationProps = { translateX: [0, endX - startX + anime.random(-10, 10)], translateY: [0, endY - startY + anime.random(-10, 10)], rotate: [0, anime.random(300, 420) + 'deg'], scale: [1, 0.3], opacity: [1, 0], duration: 600, easing: 'easeInSine' }; break;
        default: animElement.style.cssText = `width:70px;height:70px;background-color:rgba(220,220,220,0.9);border-radius:50%;left:${endX - 35}px;top:${endY - 35}px;box-shadow:0 0 10px 4px lightgrey;`; animationProps = { scale: [0.3, 1.3, 0.7], opacity: [0, 1, 0], duration: 450, easing: 'easeOutExpo' }; break;
    }
    attackAnimationLayer.appendChild(animElement);
    anime({ targets: animElement, ...animationProps, complete: () => { animElement.remove(); if (onComplete) onComplete(); }});
}

function updateBattleUI() {
    if(!battleState.playerTeam[battleState.playerActiveIndex] || (battleState.opponentTeam.length > 0 && !battleState.opponentTeam[battleState.opponentActiveIndex])) {
        return;
    }
    const pPok = battleState.playerTeam[battleState.playerActiveIndex];
    playerPokemonNameEl.textContent = pPok.name.toUpperCase();
    playerPokemonSpriteEl.src = pPok.spriteBackUrl; // Gebruik de up-to-date URL (shiny of niet)
    updateHpBar(playerHpFillEl, playerHpNumbersEl, pPok.currentHP, pPok.maxHP);
    updateStatusTag(pPok, playerStatusTagEl);
    updateTeamStatus(playerTeamStatusEl, battleState.playerTeam, battleState.isEliteFourBattle || battleState.isPokemonLeagueBattle ? MAX_TEAM_SIZE : 3);

    if (battleState.opponentTeam.length > 0 && battleState.opponentTeam[battleState.opponentActiveIndex]) {
        const oPok = battleState.opponentTeam[battleState.opponentActiveIndex];
        opponentPokemonNameEl.textContent = oPok.name.toUpperCase();
        opponentPokemonSpriteEl.src = oPok.spriteFrontUrl; // Gebruik de up-to-date URL
        updateHpBar(opponentHpFillEl, opponentHpNumbersEl, oPok.currentHP, oPok.maxHP);
        updateStatusTag(oPok, opponentStatusTagEl);
        updateTeamStatus(opponentTeamStatusEl, battleState.opponentTeam, battleState.isEliteFourBattle || battleState.isPokemonLeagueBattle ? MAX_TEAM_SIZE : 3);
    } else {
        opponentPokemonNameEl.textContent = "";
        opponentPokemonSpriteEl.src = "";
        opponentHpFillEl.style.width = '0%';
        opponentHpNumbersEl.textContent = "";
        opponentStatusTagEl.style.display = 'none';
        opponentTeamStatusEl.innerHTML = '';
    }

    if (actionMenuEl) {
        let visibleAndEnabledButtonsInActionMenu = 0;
        const buttons = actionMenuEl.querySelectorAll('button');
        buttons.forEach(b => {
            if (b.parentElement === actionMenuEl) {
                const style = window.getComputedStyle(b);
                if (style.display !== 'none' && !b.disabled) {
                    visibleAndEnabledButtonsInActionMenu++;
                }
            }
        });
        actionMenuEl.classList.toggle('extended', visibleAndEnabledButtonsInActionMenu === 4);
    }
}
function updateTeamStatus(containerElement, team, totalSlots = 3) {
    containerElement.innerHTML = '';
    for (let i = 0; i < totalSlots; i++) {
        const ball = document.createElement('span');
        ball.classList.add('status-ball');
        if (team[i]) {
            if (team[i].currentHP <= 0) {
                ball.classList.add('fainted');
            }
        } else {
            ball.style.opacity = '0.3'; // Lege slot
        }
        containerElement.appendChild(ball);
    }
}
function updateCoinDisplay() { const coins = selectedTrainerData ? (selectedTrainerData.coins || 0) : 0; if (playerCoinsDisplayMainMenuEl) playerCoinsDisplayMainMenuEl.textContent = `Coins: ${coins}`; if (marketCoinDisplayEl) marketCoinDisplayEl.textContent = `Coins: ${coins}`; }
function showMarketScreen() { if (!selectedTrainerData) { alert("Please select a trainer first."); switchScreen('characterSelect'); return; } updateCoinDisplay(); switchScreen('market'); }
function showInventoryScreen() {
    if (!selectedTrainerData) { alert("Please select a trainer first."); switchScreen('characterSelect'); return; }
    inventoryGridEl.innerHTML = '';
    const inventory = selectedTrainerData.inventory || {};
    let hasItems = false;
    Object.keys(inventory).forEach(itemName => {
        if (inventory[itemName] > 0) {
            hasItems = true;
            const itemDiv = document.createElement('div');
            itemDiv.classList.add('inventory-item');
            const itemIcon = document.createElement('img');
            itemIcon.classList.add('item-icon');
            if (itemName.toLowerCase().includes("ultra ball")) { itemIcon.style.backgroundImage = 'var(--item-icon-ultraball)'; itemIcon.alt = "Ultra Ball"; }
            else if (itemName.toLowerCase().includes("great ball")) { itemIcon.style.backgroundImage = 'var(--item-icon-greatball)'; itemIcon.alt = "Great Ball"; }
            else if (itemName.toLowerCase().includes("evolution stone")) { itemIcon.style.backgroundImage = 'var(--item-icon-evolutionstone)'; itemIcon.alt = "Evolution Stone"; }
            else if (itemName.toLowerCase().includes("tcg pack")) { itemIcon.style.backgroundImage = 'var(--item-icon-tcgpack)'; itemIcon.alt = "TCG Pack"; itemIcon.classList.add('tcgpack-icon'); }
            else { itemIcon.style.backgroundImage = 'var(--item-icon-pokeball)'; itemIcon.alt = "Poké Ball"; }
            itemIcon.src = "data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7"; // Transparante placeholder
            const itemDetails = document.createElement('div');
            itemDetails.classList.add('item-details');
            itemDetails.innerHTML = `<span class="item-name">${itemName}</span>: ${inventory[itemName]}`;
            itemDiv.appendChild(itemIcon);
            itemDiv.appendChild(itemDetails);
            inventoryGridEl.appendChild(itemDiv);
        }
    });
    if (!hasItems && noInventoryItemsMsg) { noInventoryItemsMsg.style.display = 'block'; }
    else if (noInventoryItemsMsg) { noInventoryItemsMsg.style.display = 'none'; }
    switchScreen('inventory');
}

function showTeamScreen() {
    if (!selectedTrainerData || !selectedTrainerData.team) {
        alert("Please select a trainer and have a team.");
        switchScreen('characterSelect');
        return;
    }
    teamGridEl.innerHTML = '';
    const currentTeam = selectedTrainerData.team.filter(p => p);
    if (currentTeam.length === 0 && noTeamPokemonMsg) {
        noTeamPokemonMsg.style.display = 'block';
    } else {
        if(noTeamPokemonMsg) noTeamPokemonMsg.style.display = 'none';
        currentTeam.forEach((pokemon, index) => {
            const pCard = document.createElement('div');
            pCard.classList.add('team-pokemon-card');
            pCard.dataset.pokemonId = pokemon.id;

            const orderControls = document.createElement('div');
            orderControls.classList.add('pokemon-order-controls');

            const upButton = document.createElement('button');
            upButton.classList.add('order-btn');
            upButton.innerHTML = '&#9650;';
            upButton.disabled = index === 0;
            upButton.addEventListener('click', (e) => { e.stopPropagation(); movePokemonInTeam(index, index - 1); });
            orderControls.appendChild(upButton);

            const downButton = document.createElement('button');
            downButton.classList.add('order-btn');
            downButton.innerHTML = '&#9660;';
            downButton.disabled = index === currentTeam.length - 1;
            downButton.addEventListener('click', (e) => { e.stopPropagation(); movePokemonInTeam(index, index + 1); });
            orderControls.appendChild(downButton);

            pCard.appendChild(orderControls);

            const pSprite = document.createElement('img');
            pSprite.classList.add('pokemon-list-sprite');
            pSprite.src = pokemon.spriteFrontUrl;
            pSprite.alt = pokemon.name.toUpperCase();
            if (pokemon.isShiny) pSprite.classList.add('shiny-sprite-indicator'); // Optionele class voor styling
            const pDetails = document.createElement('div');
            pDetails.classList.add('pokemon-details');
            pDetails.innerHTML = `<span class="pokemon-name">${pokemon.name.toUpperCase()}${pokemon.isShiny ? ' (Shiny)' : ''}</span> <br>HP: ${Math.floor(pokemon.currentHP)}/${pokemon.maxHP} ${pokemon.status ? '('+pokemon.status.toUpperCase()+')' : ''}`;
            pCard.appendChild(pSprite);
            pCard.appendChild(pDetails);
            teamGridEl.appendChild(pCard);
        });
    }
    switchScreen('team');
}

function movePokemonInTeam(currentIndex, newIndex) {
    if (!selectedTrainerData || !selectedTrainerData.team) return;
    if (newIndex < 0 || newIndex >= selectedTrainerData.team.length) return;

    const team = selectedTrainerData.team;
    const pokemonToMove = team.splice(currentIndex, 1)[0];
    team.splice(newIndex, 0, pokemonToMove);

    saveGame();
    showTeamScreen();
}

// --- Functies voor PC Box ---
function showPcBoxScreen() {
    if (!selectedTrainerData) {
        alert("Please select a trainer first.");
        switchScreen('characterSelect');
        return;
    }
    pcTeamGridEl.innerHTML = '';

    const team = selectedTrainerData.team.filter(p => p);

    pcTeamCountEl.textContent = team.length;
    pcBoxCountEl.textContent = selectedTrainerData.pcBox.length;
    pcBoxCapacityEl.textContent = MAX_PC_BOX_SIZE;

    if (team.length === 0 && noPokemonPcTeamMsg) noPokemonPcTeamMsg.style.display = 'block';
    else if (noPokemonPcTeamMsg) noPokemonPcTeamMsg.style.display = 'none';

    team.forEach((pokemon, index) => {
        const pCard = createPcPokemonCard(pokemon, 'team', index);
        pcTeamGridEl.appendChild(pCard);
    });

    currentPcPage = 1;
    renderCurrentPcPage();
    updatePcPaginationButtons();

    switchScreen('pcBox');
}

function createPcPokemonCard(pokemon, location, index) {
    const pCard = document.createElement('div');
    pCard.classList.add('pc-pokemon-card');
    pCard.dataset.pokemonId = pokemon.id;
    pCard.dataset.location = location;
    pCard.dataset.index = index;

    const pSprite = document.createElement('img');
    pSprite.classList.add('pokemon-list-sprite');
    pSprite.src = pokemon.spriteFrontUrl;
    pSprite.alt = pokemon.name.toUpperCase();
    if (pokemon.isShiny) pSprite.classList.add('shiny-sprite-indicator');
    pCard.appendChild(pSprite);

    const pDetails = document.createElement('div');
    pDetails.classList.add('pokemon-details');
    pDetails.innerHTML = `<span class="pokemon-name">${pokemon.name.toUpperCase()}${pokemon.isShiny ? ' (Shiny)' : ''}</span> <br>HP: ${Math.floor(pokemon.currentHP)}/${pokemon.maxHP} ${pokemon.status ? '('+pokemon.status.toUpperCase()+')' : ''}`;
    pCard.appendChild(pDetails);

    const moveButton = document.createElement('button');
    moveButton.classList.add('pc-move-button');
    if (location === 'team') {
        moveButton.textContent = 'To PC';
        moveButton.disabled = selectedTrainerData.pcBox.length >= MAX_PC_BOX_SIZE;
        moveButton.addEventListener('click', (e) => { e.stopPropagation(); movePokemonToPc(index); });
    } else {
        moveButton.textContent = 'To Team';
        moveButton.disabled = selectedTrainerData.team.length >= MAX_TEAM_SIZE;
        moveButton.addEventListener('click', (e) => { e.stopPropagation(); movePokemonToTeam(index); });
    }
    pCard.appendChild(moveButton);

    return pCard;
}

function renderCurrentPcPage() {
    pcBoxGridEl.innerHTML = '';
    const pcBox = selectedTrainerData.pcBox;
    const startIndex = (currentPcPage - 1) * POKEMON_PER_PC_PAGE;
    const endIndex = startIndex + POKEMON_PER_PC_PAGE;
    const pagePokemon = pcBox.slice(startIndex, endIndex);

    if (pcBox.length === 0 && noPokemonPcBoxMsg) {
        noPokemonPcBoxMsg.textContent = "PC Box is empty.";
        noPokemonPcBoxMsg.style.display = 'block';
    } else if (pagePokemon.length === 0 && noPokemonPcBoxMsg) {
        noPokemonPcBoxMsg.textContent = "This page is empty.";
        noPokemonPcBoxMsg.style.display = 'block';
    } else if (noPokemonPcBoxMsg) {
        noPokemonPcBoxMsg.style.display = 'none';
    }

    pagePokemon.forEach((pokemon, pageIndex) => {
        const globalIndex = startIndex + pageIndex;
        const pCard = createPcPokemonCard(pokemon, 'pc', globalIndex);
        pcBoxGridEl.appendChild(pCard);
    });

    const totalPages = Math.max(1, Math.ceil(pcBox.length / POKEMON_PER_PC_PAGE));
    pcPageIndicatorEl.textContent = `Page ${currentPcPage} / ${totalPages}`;
}

function updatePcPaginationButtons() {
    const pcBox = selectedTrainerData.pcBox;
    const totalPages = Math.max(1, Math.ceil(pcBox.length / POKEMON_PER_PC_PAGE));

    pcPrevButton.disabled = currentPcPage <= 1;
    pcNextButton.disabled = currentPcPage >= totalPages;
}

function movePokemonToPc(teamIndex) {
    if (!selectedTrainerData || !selectedTrainerData.team[teamIndex] || selectedTrainerData.pcBox.length >= MAX_PC_BOX_SIZE) {
        alert("Cannot move Pokémon to PC. PC might be full or Pokémon not found.");
        return;
    }
    if (selectedTrainerData.team.length <= 1 && selectedTrainerData.team[teamIndex]) {
         alert("You must keep at least one Pokémon in your team!");
         return;
    }

    const pokemonToMove = selectedTrainerData.team.splice(teamIndex, 1)[0];
    selectedTrainerData.pcBox.push(pokemonToMove);
    saveGame();

    renderCurrentPcPage(); // PC box might change page count
    updatePcPaginationButtons();

    // Re-render team in PC view
    pcTeamGridEl.innerHTML = '';
    selectedTrainerData.team.filter(p => p).forEach((pokemon, index) => {
        const pCard = createPcPokemonCard(pokemon, 'team', index);
        pcTeamGridEl.appendChild(pCard);
    });
    pcTeamCountEl.textContent = selectedTrainerData.team.length;
    pcBoxCountEl.textContent = selectedTrainerData.pcBox.length;
    if (selectedTrainerData.team.length === 0 && noPokemonPcTeamMsg) noPokemonPcTeamMsg.style.display = 'block';
    else if (noPokemonPcTeamMsg) noPokemonPcTeamMsg.style.display = 'none';
}

function movePokemonToTeam(globalPcIndex) {
    if (!selectedTrainerData || !selectedTrainerData.pcBox[globalPcIndex] || selectedTrainerData.team.length >= MAX_TEAM_SIZE) {
        alert("Cannot move Pokémon to team. Team might be full or Pokémon not found.");
        return;
    }
    const pokemonToMove = selectedTrainerData.pcBox.splice(globalPcIndex, 1)[0];
    selectedTrainerData.team.push(pokemonToMove);
    saveGame();

    const totalPages = Math.max(1, Math.ceil(selectedTrainerData.pcBox.length / POKEMON_PER_PC_PAGE));
    if (currentPcPage > totalPages && totalPages > 0) { // Only adjust if totalPages decreased and is not 0
        currentPcPage = totalPages;
    }
    renderCurrentPcPage();
    updatePcPaginationButtons();

    pcTeamGridEl.innerHTML = '';
    selectedTrainerData.team.filter(p => p).forEach((pokemon, index) => {
        const pCard = createPcPokemonCard(pokemon, 'team', index);
        pcTeamGridEl.appendChild(pCard);
    });
    pcTeamCountEl.textContent = selectedTrainerData.team.length;
    pcBoxCountEl.textContent = selectedTrainerData.pcBox.length;
    if (selectedTrainerData.team.length === 0 && noPokemonPcTeamMsg) noPokemonPcTeamMsg.style.display = 'block';
    else if (noPokemonPcTeamMsg) noPokemonPcTeamMsg.style.display = 'none';
}

// --- TCG Functies ---
function openTcgPackAnimation(cards) { // cards is een array van 3 TCG kaart objecten
    revealedTcgCards = cards || [];
    currentRevealedTcgCardIndex = 0;

    screens.tcgPackOpeningOverlay.style.display = 'flex';
    tcgPackAnimationContainer.style.display = 'block';
    revealedTcgCardContainer.style.display = 'none';
    tcgPackAnimationContainer.innerHTML = '<p>Opening Pack...</p>';

    setTimeout(() => {
        tcgPackAnimationContainer.style.display = 'none';
        revealedTcgCardContainer.style.display = 'flex';
        displayRevealedTcgCard(); // Toon de eerste kaart
    }, 2000);
}

function displayRevealedTcgCard() {
    if (revealedTcgCards.length === 0) {
        revealedTcgCardImageEl.src = "";
        revealedTcgCardImageEl.alt = "No Card";
        revealedTcgCardNameEl.textContent = "NO CARD PULLED";
        if(revealedTcgCardIndexIndicatorEl) revealedTcgCardIndexIndicatorEl.textContent = "";
        if(prevRevealedTcgCardButton) prevRevealedTcgCardButton.style.display = 'none';
        if(nextRevealedTcgCardButton) nextRevealedTcgCardButton.style.display = 'none';
        return;
    }

    const cardToShow = revealedTcgCards[currentRevealedTcgCardIndex];
    revealedTcgCardImageEl.src = cardToShow.spriteUrl;
    revealedTcgCardImageEl.alt = cardToShow.tcgCardName + " TCG Card";
    revealedTcgCardNameEl.textContent = cardToShow.tcgCardName.toUpperCase();

    if(revealedTcgCardIndexIndicatorEl) {
        revealedTcgCardIndexIndicatorEl.textContent = `Card ${currentRevealedTcgCardIndex + 1} of ${revealedTcgCards.length}`;
        revealedTcgCardIndexIndicatorEl.style.display = revealedTcgCards.length > 1 ? 'block' : 'none';
    }

    if(prevRevealedTcgCardButton) {
        prevRevealedTcgCardButton.style.display = revealedTcgCards.length > 1 ? 'inline-block' : 'none';
        prevRevealedTcgCardButton.disabled = currentRevealedTcgCardIndex === 0;
    }
    if(nextRevealedTcgCardButton) {
        nextRevealedTcgCardButton.style.display = revealedTcgCards.length > 1 ? 'inline-block' : 'none';
        nextRevealedTcgCardButton.disabled = currentRevealedTcgCardIndex === revealedTcgCards.length - 1;
    }
}


function buyItem(itemName, price) {
    if (!selectedTrainerData) return;
    price = parseInt(price);

    if (selectedTrainerData.coins < price) {
        alert("Not enough coins!");
        return;
    }

    if (itemName === "TCG Pack") {
        selectedTrainerData.coins -= price;
        updateCoinDisplay();

        screens.tcgPackOpeningOverlay.style.display = 'flex';
        tcgPackAnimationContainer.style.display = 'block';
        revealedTcgCardContainer.style.display = 'none';
        tcgPackAnimationContainer.innerHTML = '<p>Searching the Pokémon TCG database...</p>';

        const fetchPromises = [];
        for (let i = 0; i < TCG_CARDS_PER_PACK; i++) {
            if (pokemonPool.length === 0) {
                 fetchPromises.push(Promise.resolve(null));
                 continue;
            }
            const randomPokemonForTcg = pokemonPool[Math.floor(Math.random() * pokemonPool.length)];
            if (randomPokemonForTcg) {
                const query = `nationalPokedexNumbers:${randomPokemonForTcg.pokedexId}`;
                const promise = fetch(`https://api.pokemontcg.io/v2/cards?q=${query}`)
                    .then(response => {
                        if (!response.ok) {
                            throw new Error(`PokemonTCG API request failed for PokedexID ${randomPokemonForTcg.pokedexId}: ${response.status}`);
                        }
                        return response.json();
                    })
                    .then(apiData => {
                        if (apiData.data && apiData.data.length > 0) {
                            const randomCardFromApi = apiData.data[Math.floor(Math.random() * apiData.data.length)];
                            return {
                                id: `tcg-${randomCardFromApi.id || Date.now()}-${i}`,
                                pokemonGameName: randomPokemonForTcg.name,
                                pokedexId: randomPokemonForTcg.pokedexId,
                                spriteUrl: randomCardFromApi.images.large,
                                tcgCardName: randomCardFromApi.name,
                                tcgSet: randomCardFromApi.set ? randomCardFromApi.set.name : "Unknown Set"
                            };
                        } else {
                            console.warn(`No TCG card found for ${randomPokemonForTcg.name} (ID: ${randomPokemonForTcg.pokedexId}) via API. Using fallback sprite.`);
                            return { // Fallback
                                id: `tcg-fallback-${Date.now()}-${Math.random().toString(36).substr(2)}-${i}`,
                                pokemonGameName: randomPokemonForTcg.name,
                                pokedexId: randomPokemonForTcg.pokedexId,
                                spriteUrl: `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${randomPokemonForTcg.pokedexId}.png`,
                                tcgCardName: randomPokemonForTcg.name.toUpperCase() + " (Card Art Not Found)",
                                tcgSet: "Fallback Set"
                            };
                        }
                    })
                    .catch(error => {
                        console.error("Error fetching TCG card:", error);
                        const fallbackPokemon = pokemonPool.length > 0 ? pokemonPool[Math.floor(Math.random() * pokemonPool.length)] : {name: "ErrorMon", pokedexId: 0, spriteFront: ""};
                        return { // Error fallback
                            id: `tcg-error-${Date.now()}-${Math.random().toString(36).substr(2)}-${i}`,
                            pokemonGameName: fallbackPokemon.name,
                            pokedexId: fallbackPokemon.pokedexId,
                            spriteUrl: fallbackPokemon.spriteFront || `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${fallbackPokemon.pokedexId || 0}.png`,
                            tcgCardName: fallbackPokemon.name.toUpperCase() + " (API Error)",
                            tcgSet: "Error Set"
                        };
                    });
                fetchPromises.push(promise);
            } else {
                fetchPromises.push(Promise.resolve(null)); // Should not happen if pokemonPool is not empty
            }
        }

        Promise.all(fetchPromises)
            .then(pulledCardsData => {
                const validPulledCards = pulledCardsData.filter(card => card);

                if (validPulledCards.length > 0) {
                    selectedTrainerData.collectedTcgCards = selectedTrainerData.collectedTcgCards || [];
                    validPulledCards.forEach(card => selectedTrainerData.collectedTcgCards.push(card));
                    openTcgPackAnimation(validPulledCards); // Geef alle getrokken kaarten mee
                } else {
                    // Dit gebeurt als alle fetches falen of null retourneren
                    alert(`Successfully bought 1 TCG Pack! However, no TCG cards could be found.`);
                    screens.tcgPackOpeningOverlay.style.display = 'none';
                }
                saveGame();
            })
            .catch(overallError => {
                console.error("Error in processing TCG pack promises:", overallError);
                alert("An error occurred while opening the TCG pack. The pack has been consumed.");
                screens.tcgPackOpeningOverlay.style.display = 'none';
                saveGame(); // Sla op, want de pack is verbruikt
            });

    } else { // Voor andere items
        selectedTrainerData.coins -= price;
        selectedTrainerData.inventory[itemName] = (selectedTrainerData.inventory[itemName] || 0) + 1;
        alert(`Successfully bought 1 ${itemName}!`);
        updateCoinDisplay();
        saveGame();
    }
}

// --- Battle Setup Functies ---
function getUniqueRandomPokemon(existingPokedexIds, fromPool) {
    const available = fromPool.filter(p => !existingPokedexIds.includes(p.pokedexId));
    if (available.length === 0) return null;
    return available[Math.floor(Math.random() * available.length)];
}

function startQuickBattle() {
    battleState.isWildBattle = false;
    battleState.isGymBattle = false;
    battleState.isEliteFourBattle = false;
    battleState.isPokemonLeagueBattle = false;
    screens.battle.style.backgroundImage = "url('https://pokemonrevolution.net/forum/uploads/monthly_2021_03/DVMT-6OXcAE2rZY.jpg.afab972f972bd7fbd4253bc7aa1cf27f.jpg')";

    battleState.playerTeam = [];
    battleState.opponentTeam = [];

    if (pokemonPool.length < 3) {
        alert("Error: Not enough unique Pokémon in the pool for a Quick Battle.");
        switchScreen('mainMenu');
        return;
    }

    let availableForPlayer = [...pokemonPool];
    let playerPokedexIds = [];
    for (let i = 0; i < 3; i++) {
        if (availableForPlayer.length === 0) break;
        let poolIdx = Math.floor(Math.random() * availableForPlayer.length);
        let chosenData = availableForPlayer.splice(poolIdx, 1)[0];
        battleState.playerTeam.push(createPokemonFromData(chosenData, false, true));
        playerPokedexIds.push(chosenData.pokedexId);
    }

    let availableForOpponent = pokemonPool.filter(p => !playerPokedexIds.includes(p.pokedexId));
    if (availableForOpponent.length < 3) {
        availableForOpponent = [...pokemonPool]; // Fallback if not enough unique opponents
    }


    for (let i = 0; i < 3; i++) {
        if (availableForOpponent.length === 0) {
             if (pokemonPool.length > 0) battleState.opponentTeam.push(createPokemonFromData(pokemonPool[Math.floor(Math.random()*pokemonPool.length)], true, false));
             else break;
        } else {
            let poolIdx = Math.floor(Math.random() * availableForOpponent.length);
            let chosenData = availableForOpponent.splice(poolIdx, 1)[0];
            battleState.opponentTeam.push(createPokemonFromData(chosenData, true, false));
        }
    }

    if (battleState.playerTeam.length === 0 || battleState.opponentTeam.length === 0) {
        alert("Error: Could not set up teams for Quick Battle. Pokemon pool might be too small or empty.");
        switchScreen('mainMenu');
        return;
    }

    battleState.playerActiveIndex = 0;
    battleState.opponentActiveIndex = 0;

    updateBattleUI();
    switchScreen('battle');
    startBattleMusic();
    const opponent = battleState.opponentTeam[0];
    const introMsg = opponent.isShiny ? `Opponent sent out SHINY ${opponent.name.toUpperCase()}!` : `Opponent sent out ${opponent.name.toUpperCase()}!`;
    typeMessage(introMsg, () => {
        battleState.onMessageComplete = () => {
            typeMessage(`Go ${battleState.playerTeam[0].name.toUpperCase()}!`, startTurnPhase);
        }
    });
}

function prepareBattle(battleFunction, isEliteFour = false, isLeague = false) {
    if (!selectedTrainerData || !selectedTrainerData.team || selectedTrainerData.team.length === 0) {
        alert("You have no Pokémon! Please choose a starter or catch one in Wild Mode.");
        switchScreen('mainMenu');
        return;
    }
    // Volledig herstel en reset voor elk Pokémon in het team van de speler
    selectedTrainerData.team.forEach(p => {
        if(p) {
            p.currentHP = p.maxHP; // Volledig HP
            p.status = null;
            p.sleepTurns = 0;
            p.flinch = false;
            p.stats = { attack: 0, defense: 0, speed: 0, accuracy: 0, evasion: 0 }; // Reset stat stages
            p.moves.forEach(m => m.currentPp = m.maxPp); // Herstel PP

            // Als de Pokémon tijdelijk geëvolueerd was, zet terug naar originele staat
            if (p.originalEvolutionData) {
                const oldMaxHPBeforeRevert = p.maxHP;
                const currentHPRatio = 1; // Start met vol HP

                p.pokedexId = p.originalEvolutionData.pokedexId;
                p.name = p.originalEvolutionData.name;
                p.types = [...p.originalEvolutionData.types];
                p.maxHP = p.originalEvolutionData.maxHP;
                p.currentHP = p.maxHP; // Vol HP na revert
                p.baseStats = JSON.parse(JSON.stringify(p.originalEvolutionData.baseStats));
                p.moves = p.originalEvolutionData.moves.map(m => ({ ...m, currentPp: m.maxPp }));
                // p.isShiny blijft de waarde die het had in originalEvolutionData, of de huidige als die er niet is.
                // createPokemonFromData handelt dit af, maar hier is het een directe revert.
                p.isShiny = p.originalEvolutionData.isShiny; // Zorg dat shiny status van origineel behouden blijft

                const shinyBaseUrl = "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon";
                const basePokemonForSprite = pokemonPool.find(baseP => baseP.pokedexId === p.pokedexId) || {};
                p.spriteFrontUrl = p.isShiny ? `${shinyBaseUrl}/shiny/${p.pokedexId}.png` : (basePokemonForSprite.spriteFront || `${shinyBaseUrl}/${p.pokedexId}.png`);
                p.spriteBackUrl = p.isShiny ? `${shinyBaseUrl}/back/shiny/${p.pokedexId}.png` : (basePokemonForSprite.spriteBack || `${shinyBaseUrl}/back/${p.pokedexId}.png`);

                p.originalEvolutionData = null; // Verwijder de tijdelijke evolutie data
            }
        }
    });

    let requiredTeamSize = 3; // Standaard voor Quick Battle, Wild Battle
    if (isEliteFour || isLeague) {
        requiredTeamSize = MAX_TEAM_SIZE; // Elite Four en League vereisen een vol team
    } else if (battleFunction === startGymBattleActual) {
        // Gym battles vereisen minimaal 1, maar team selectie voor 3 als je meer hebt
        requiredTeamSize = 1; // Minimaal 1 voor een gym battle
    }


    if (selectedTrainerData.team.filter(pk => pk && pk.currentHP > 0).length < requiredTeamSize && (isEliteFour || isLeague)) {
        alert(`You need at least ${requiredTeamSize} healthy Pokémon for this battle!`);
        switchScreen('playMenu');
        return;
    }
     if (battleFunction === startGymBattleActual && selectedTrainerData.team.filter(pk => pk && pk.currentHP > 0).length < 1) {
        alert(`You need at least 1 healthy Pokémon for a Gym Battle!`);
        switchScreen('playMenu');
        return;
    }


    if ( (isEliteFour || isLeague) && selectedTrainerData.team.length > 0 ) {
        // Elite Four en League gebruiken altijd team selectie voor 6 Pokémon
        battleState.pendingBattleStartFunction = battleFunction;
        battleState.isEliteFourBattle = isEliteFour;
        battleState.isPokemonLeagueBattle = isLeague;
        showTeamSelectScreen(true); // Forceer 6 selectie
    } else if (battleFunction !== startGymBattleActual && selectedTrainerData.team.length > 3) {
        // Voor Wild/Quick battles, als je meer dan 3 Pokémon hebt, laat kiezen.
        battleState.pendingBattleStartFunction = battleFunction;
        battleState.isEliteFourBattle = false;
        battleState.isPokemonLeagueBattle = false;
        showTeamSelectScreen(false); // Standaard 3 selectie
    } else if (battleFunction === startGymBattleActual && selectedTrainerData.team.length > 3) {
        // Voor Gym battles, als je meer dan 3 Pokémon hebt, laat kiezen (max 3 voor gym).
        battleState.pendingBattleStartFunction = battleFunction;
        battleState.isEliteFourBattle = false;
        battleState.isPokemonLeagueBattle = false;
        showTeamSelectScreen(false); // Standaard 3 selectie
    }
    else {
        // Anders, gebruik het huidige team (of de eerste N Pokémon)
        battleState.playerTeam = JSON.parse(JSON.stringify(selectedTrainerData.team.filter(p => p).slice(0, (isEliteFour || isLeague) ? MAX_TEAM_SIZE : 3)));
        battleState.isEliteFourBattle = isEliteFour;
        battleState.isPokemonLeagueBattle = isLeague;
        battleFunction();
    }
}

function showTeamSelectScreen(isEliteFourOrLeague = false) {
    teamSelectGridEl.innerHTML = '';
    battleState.selectedBattleTeamIndexes = [];
    teamSelectConfirmButton.disabled = true;

    const numToSelect = isEliteFourOrLeague ? MAX_TEAM_SIZE : 3;
    if (teamSelectTitleEl) {
        teamSelectTitleEl.textContent = `SELECT YOUR BATTLE TEAM (CHOOSE ${numToSelect})`;
    }


    selectedTrainerData.team.forEach((pokemon, index) => {
        if (!pokemon) return;
        const opt = document.createElement('div');
        opt.classList.add('team-select-option');
        opt.dataset.index = index;

        const sp = document.createElement('img');
        sp.src = pokemon.spriteFrontUrl;
        sp.alt = pokemon.name.toUpperCase();
        opt.appendChild(sp);

        const nfo = document.createElement('div');
        nfo.classList.add('team-select-info');
        nfo.innerHTML = `<span class="name">${pokemon.name.toUpperCase()}${pokemon.isShiny ? ' (S)' : ''}</span><div class="hp-bar-container"><div class="hp-bar-fill" style="width:${Math.max(0,(pokemon.currentHP/pokemon.maxHP)*100)}%; background-color:${pokemon.currentHP/pokemon.maxHP > 0.5 ? 'var(--hp-high-color)' : (pokemon.currentHP/pokemon.maxHP > 0.2 ? 'var(--hp-medium-color)' : 'var(--hp-low-color)')};"></div></div><div class="hp-numbers">${Math.max(0,Math.floor(pokemon.currentHP))}/${pokemon.maxHP}</div>`;
        opt.appendChild(nfo);

        if (pokemon.currentHP <= 0) {
            opt.classList.add('fainted', 'disabled');
        } else {
            opt.addEventListener('click', () => toggleTeamSelectOption(opt, index, numToSelect));
        }
        teamSelectGridEl.appendChild(opt);
    });
    switchScreen('teamSelect');
}

function toggleTeamSelectOption(optionElement, pokemonIndex, numToSelect) {
    if (optionElement.classList.contains('fainted')) return;

    const indexInSelection = battleState.selectedBattleTeamIndexes.indexOf(pokemonIndex);

    if (indexInSelection > -1) {
        battleState.selectedBattleTeamIndexes.splice(indexInSelection, 1);
        optionElement.classList.remove('selected');
    } else {
        if (battleState.selectedBattleTeamIndexes.length < numToSelect) {
            battleState.selectedBattleTeamIndexes.push(pokemonIndex);
            optionElement.classList.add('selected');
        } else {
            alert(`You can only select up to ${numToSelect} Pokémon.`);
        }
    }
    teamSelectConfirmButton.disabled = battleState.selectedBattleTeamIndexes.length !== numToSelect;
}

teamSelectConfirmButton.addEventListener('click', () => {
    const numRequired = battleState.isEliteFourBattle || battleState.isPokemonLeagueBattle ? MAX_TEAM_SIZE : 3;
    if (battleState.selectedBattleTeamIndexes.length === numRequired) {
        battleState.playerTeam = battleState.selectedBattleTeamIndexes.map(index => {
            // Maak een diepe kopie om originele teamdata niet te beïnvloeden tijdens battle
            return JSON.parse(JSON.stringify(selectedTrainerData.team[index]));
        });

        if (battleState.pendingBattleStartFunction) {
            battleState.pendingBattleStartFunction();
            battleState.pendingBattleStartFunction = null; // Reset na gebruik
        }
    } else {
        alert(`Please select exactly ${numRequired} Pokémon.`);
    }
});


function startWildBattleActual() {
    battleState.isWildBattle = true;
    battleState.isGymBattle = false;
    battleState.isEliteFourBattle = false;
    battleState.isPokemonLeagueBattle = false;
    screens.battle.style.backgroundImage = "url('https://pokemonrevolution.net/forum/uploads/monthly_2021_03/DVMT-6OXcAE2rZY.jpg.afab972f972bd7fbd4253bc7aa1cf27f.jpg')";

    battleState.opponentTeam = [];
    if (pokemonPool.length === 0) {
        alert("Error: Pokemon pool is empty, cannot start wild battle.");
        switchScreen('mainMenu');
        return;
    }
    const wildPokemonData = pokemonPool[Math.floor(Math.random() * pokemonPool.length)];
    battleState.opponentTeam.push(createPokemonFromData(wildPokemonData, true, false)); // isOpponent=true, forPlayerTeam=false

    battleState.playerActiveIndex = 0;
    battleState.opponentActiveIndex = 0;

    updateBattleUI();
    switchScreen('battle');
    startBattleMusic();
    const opponent = battleState.opponentTeam[0];
    const introMsg = opponent.isShiny ? `A wild SHINY ${opponent.name.toUpperCase()} appeared!` : `A wild ${opponent.name.toUpperCase()} appeared!`;
    typeMessage(introMsg, () => {
        battleState.onMessageComplete = () => {
            typeMessage(`Go ${battleState.playerTeam[0].name.toUpperCase()}!`, startTurnPhase);
        }
    });
}

function startGymBattleActual() {
    battleState.isWildBattle = false;
    battleState.isGymBattle = true;
    battleState.isEliteFourBattle = false;
    battleState.isPokemonLeagueBattle = false;
    screens.battle.style.backgroundImage = "url('https://archives.bulbagarden.net/media/upload/d/dd/Saffron_Gym_Battlefield.png')";


    const leaderData = gymLeadersData[battleState.currentGymLeaderKey];
    if (!leaderData) { alert("Error: Gym Leader data not found!"); switchScreen('playMenu'); return; }

    battleState.opponentTeam = leaderData.pokemonTeam.map(pokemonNameOrId => {
        const pokemonBase = pokemonPool.find(p => p.name.toUpperCase() === String(pokemonNameOrId).toUpperCase() || p.pokedexId === parseInt(pokemonNameOrId));
        if (!pokemonBase) {
            console.error(`Pokemon ${pokemonNameOrId} not found in pool for Gym Leader ${leaderData.name}`);
            return null;
        }
        return createPokemonFromData(pokemonBase, true, false); // isOpponent=true
    }).filter(p => p !== null);


    if (battleState.opponentTeam.length === 0) {
        alert(`Error: Could not set up Gym Leader ${leaderData.name}'s team. Check if Pokémon names/IDs in gymLeadersData are correct and exist in pokemonPool.`);
        switchScreen('playMenu');
        return;
    }
    // Gym leader teams zijn typisch 3-5, maar de UI toont er 3. Dit is OK.
    // Als de data meer bevat, zal de battle doorgaan tot ze allemaal verslagen zijn.

    battleState.playerActiveIndex = 0;
    battleState.opponentActiveIndex = 0;
    updateBattleUI();
    switchScreen('battle');
    startBattleMusic();
    const opponent = battleState.opponentTeam[0];
    const introMsg = `${leaderData.name} challenges you to a battle! ${leaderData.name} sent out ${opponent.name.toUpperCase()}!`;
    typeMessage(introMsg, () => {
        battleState.onMessageComplete = () => {
            typeMessage(`Go ${battleState.playerTeam[0].name.toUpperCase()}!`, startTurnPhase);
        }
    });
}

function startEliteFourBattleActual() {
    battleState.isWildBattle = false;
    battleState.isGymBattle = false;
    battleState.isEliteFourBattle = true;
    battleState.isPokemonLeagueBattle = false;
    screens.battle.style.backgroundImage = "url('https://pokemonrevolution.net/forum/uploads/monthly_2021_03/DVMT-6OXcAE2rZY.jpg.afab972f972bd7fbd4253bc7aa1cf27f.jpg')";

    const memberData = eliteFourData[battleState.currentEliteFourMemberKey];
    if (!memberData) { alert("Error: Elite Four Member data not found!"); switchScreen('playMenu'); return; }
    battleState.opponentTeam = memberData.pokemonTeam.map(pokemonNameOrId => {
        const pokemonBase = pokemonPool.find(p => p.name.toUpperCase() === String(pokemonNameOrId).toUpperCase() || p.pokedexId === parseInt(pokemonNameOrId));
        if (!pokemonBase) {
            console.error(`Pokemon ${pokemonNameOrId} not found in pool for Elite Four ${memberData.name}`);
            return null;
        }
        return createPokemonFromData(pokemonBase, true, false); // isOpponent=true
    }).filter(p => p !== null);

    if (battleState.opponentTeam.length === 0 || battleState.opponentTeam.length < MAX_TEAM_SIZE) {
        alert(`Error: Could not set up Elite Four ${memberData.name}'s team correctly (needs ${MAX_TEAM_SIZE} Pokémon). Check Pokémon names/IDs.`);
        switchScreen('playMenu');
        return;
    }
    battleState.playerActiveIndex = 0;
    battleState.opponentActiveIndex = 0;
    updateBattleUI();
    switchScreen('battle');
    startBattleMusic();
    const opponent = battleState.opponentTeam[0];
    const introMsg = `Elite Four ${memberData.name} challenges you! ${memberData.name} sent out ${opponent.name.toUpperCase()}!`;
    typeMessage(introMsg, () => {
        battleState.onMessageComplete = () => {
            typeMessage(`Go ${battleState.playerTeam[0].name.toUpperCase()}!`, startTurnPhase);
        }
    });
}

// --- Pokémon League Functies ---
function showPokemonLeagueScreen() {
    if (!selectedTrainerData || selectedTrainerData.team.filter(p=>p && p.currentHP > 0).length < MAX_TEAM_SIZE) {
        alert(`You need a full team of ${MAX_TEAM_SIZE} healthy Pokémon to challenge the Pokémon League!`);
        switchScreen('playMenu');
        return;
    }

    // Herstel league progressie van selectedTrainerData
    battleState.currentLeagueOpponentIndex = selectedTrainerData.currentLeagueOpponentIndex || 0;
    battleState.leagueBattlesWon = selectedTrainerData.leagueBattlesWon || 0;

    if (selectedTrainerData.defeatedPokemonLeague) { // Al gewonnen
        updatePokemonLeagueScreenUI();
        switchScreen('pokemonLeague');
        return;
    }

    // Alleen nieuwe order als de league opnieuw gestart wordt (index 0, 0 wins)
    // Of als er geen currentLeagueOrder is (bv. na een page refresh zonder save/load van de order zelf)
    if ((battleState.currentLeagueOpponentIndex === 0 && battleState.leagueBattlesWon === 0) || !currentLeagueOrder || currentLeagueOrder.length === 0) {
        currentLeagueOrder = [...pokemonLeagueTrainers].sort(() => 0.5 - Math.random());
        // TODO: Idealiter zou currentLeagueOrder ook opgeslagen en hersteld moeten worden in selectedTrainerData
        // om consistentie te garanderen na een save/load midden in een League run.
        // Voor nu: elke keer een nieuwe volgorde als je opnieuw start.
    }

    updatePokemonLeagueScreenUI();
    switchScreen('pokemonLeague');
}

function updatePokemonLeagueScreenUI() {
    if (selectedTrainerData.defeatedPokemonLeague || battleState.leagueBattlesWon >= currentLeagueOrder.length) {
        pokemonLeagueProgressEl.textContent = "YOU ARE THE CHAMPION!";
        leagueOpponentNameEl.textContent = "N/A";
        if(leagueOpponentCardEl) leagueOpponentCardEl.src = "https://www.serebii.net/pokemonmasters/syncpairs/sprites/Serena_Champion.png"; // Champion sprite
        if(leagueOpponentCardEl) leagueOpponentCardEl.alt = "Champion";
        btnStartLeagueBattle.style.display = 'none';
        // Beloning wordt al gegeven in handleOpponentFaint
    } else {
        const nextOpponent = currentLeagueOrder[battleState.currentLeagueOpponentIndex];
        pokemonLeagueProgressEl.textContent = `Battle ${battleState.leagueBattlesWon + 1} of ${currentLeagueOrder.length}`;
        leagueOpponentNameEl.textContent = nextOpponent.name.toUpperCase();
        if(leagueOpponentCardEl && nextOpponent.cardUrl) leagueOpponentCardEl.src = nextOpponent.cardUrl;
        else if(leagueOpponentCardEl) leagueOpponentCardEl.src = ""; // Fallback
        if(leagueOpponentCardEl) leagueOpponentCardEl.alt = nextOpponent.name + " Card";
        btnStartLeagueBattle.style.display = 'block';
        btnStartLeagueBattle.textContent = `START BATTLE VS ${nextOpponent.name.toUpperCase()}`;
    }
}

function startNextLeagueBattle() {
    battleState.isPokemonLeagueBattle = true;
    battleState.isGymBattle = false;
    battleState.isEliteFourBattle = false;
    battleState.isWildBattle = false;
    screens.battle.style.backgroundImage = "url('https://www.serebii.net/pokearth/maps/kanto/1-gym.png')"; // Placeholder, kan specifiek zijn

    // currentLeagueOpponentIndex is al bijgewerkt of start op 0
    const opponentData = currentLeagueOrder[battleState.currentLeagueOpponentIndex];
    if (!opponentData) {
        console.error("Error: League opponent data not found for index:", battleState.currentLeagueOpponentIndex);
        switchScreen('playMenu');
        return;
    }

    battleState.opponentTeam = opponentData.pokemonTeam.map(pokemonNameOrId => {
        const pokemonBase = pokemonPool.find(p => p.name.toUpperCase() === String(pokemonNameOrId).toUpperCase() || p.pokedexId === parseInt(pokemonNameOrId));
        if (!pokemonBase) {
            console.error(`Pokémon ${pokemonNameOrId} for League opponent ${opponentData.name} not in pool.`);
            return null;
        }
        return createPokemonFromData(pokemonBase, true, false); // isOpponent=true
    }).filter(p => p);

    if (battleState.opponentTeam.length < MAX_TEAM_SIZE) { // League trainers moeten vol team hebben
        alert(`Error: Could not set up ${opponentData.name}'s team correctly for the League (needs ${MAX_TEAM_SIZE} Pokémon).`);
        switchScreen('pokemonLeague');
        return;
    }

    battleState.playerActiveIndex = 0;
    battleState.opponentActiveIndex = 0;
    updateBattleUI();
    switchScreen('battle');
    startBattleMusic();
    const opponent = battleState.opponentTeam[0];
    const introMsg = `Pokémon League: ${opponentData.name} challenges you! ${opponentData.name} sent out ${opponent.name.toUpperCase()}!`;
    typeMessage(introMsg, () => {
        battleState.onMessageComplete = () => {
            typeMessage(`Go ${battleState.playerTeam[0].name.toUpperCase()}!`, startTurnPhase);
        }
    });
}


// --- Battle Logic ---
function startTurnPhase() { if(!battleState.playerTeam[battleState.playerActiveIndex] || !battleState.opponentTeam[battleState.opponentActiveIndex]) {console.warn("Attempted to start turn phase with undefined active Pokemon."); return;} battleState.playerTeam[battleState.playerActiveIndex].flinch = false; if (battleState.opponentTeam[battleState.opponentActiveIndex]) battleState.opponentTeam[battleState.opponentActiveIndex].flinch = false; battleState.attackerUsedMoveFirstThisTurn = false; determineMoveOrder(); }
function determineMoveOrder() { if(!battleState.playerTeam[battleState.playerActiveIndex] || !battleState.opponentTeam[battleState.opponentActiveIndex]) {console.warn("Attempted to determine move order with undefined active Pokemon."); return;} const playerPokemon = battleState.playerTeam[battleState.playerActiveIndex]; const opponentPokemon = battleState.opponentTeam[battleState.opponentActiveIndex]; const playerMoveCheck = checkCanMove(playerPokemon, true); if (playerMoveCheck.message) { typeMessage(playerMoveCheck.message, () => { if (!playerMoveCheck.canMove) { battleState.currentActingPokemonIsPlayer = false; opponentActionPhase(); } else { playerActionPhase(); } }); } else { playerActionPhase(); } }

function playerActionPhase() {
    if(!battleState.playerTeam[battleState.playerActiveIndex]) {
        console.warn("Attempted player action phase with undefined active Pokemon.");
        return;
    }
    battleState.playerTurn = true;
    battleState.currentActingPokemonIsPlayer = true;
    const activePlayerPokemon = battleState.playerTeam[battleState.playerActiveIndex];

    actionMenuEl.style.display = 'none';
    moveMenuEl.style.display = 'none';
    itemMenuEl.style.display = 'none';

    const itemButtonInActionMenu = actionMenuEl.querySelector('button[data-action="item"]');
    if (itemButtonInActionMenu) {
        itemButtonInActionMenu.style.display = 'block';
        let hasAnyUsableItem = false;
        if (selectedTrainerData && selectedTrainerData.inventory && activePlayerPokemon) {
            if ((selectedTrainerData.inventory["Evolution Stone"] > 0 || selectedTrainerData.inventory["Perma Evolution Stone"] > 0) && getEvolutionTarget(activePlayerPokemon.pokedexId)) {
                hasAnyUsableItem = true;
            }
            if (battleState.isWildBattle &&
               (selectedTrainerData.inventory["Poke Ball"] > 0 || selectedTrainerData.inventory["Great Ball"] > 0 || selectedTrainerData.inventory["Ultra Ball"] > 0)) {
                hasAnyUsableItem = true;
            }
        }
        itemButtonInActionMenu.disabled = !hasAnyUsableItem || battleState.isEliteFourBattle || battleState.isGymBattle || battleState.isPokemonLeagueBattle;
    }

    const runButtonInActionMenu = actionMenuEl.querySelector('button[data-action="run"]');
    if (runButtonInActionMenu) {
        runButtonInActionMenu.style.display = 'block';
        runButtonInActionMenu.disabled = battleState.isGymBattle || battleState.isEliteFourBattle || battleState.isPokemonLeagueBattle;
    }

    const pokemonButtonInActionMenu = actionMenuEl.querySelector('button[data-action="pokemon"]');
    if (pokemonButtonInActionMenu) {
        pokemonButtonInActionMenu.style.display = 'block';
        const switchablePokemon = battleState.playerTeam.filter((p, i) => p.currentHP > 0 && i !== battleState.playerActiveIndex);
        pokemonButtonInActionMenu.disabled = switchablePokemon.length === 0;
    }

    const fightButtonInActionMenu = actionMenuEl.querySelector('button[data-action="fight"]');
    if (fightButtonInActionMenu) {
        fightButtonInActionMenu.style.display = 'block';
        fightButtonInActionMenu.disabled = false;
    }

    typeMessage(`What will ${activePlayerPokemon.name.toUpperCase()} do?`, () => {
        actionMenuEl.style.display = 'grid';
        updateBattleUI();
    });
}

function opponentActionPhase() { if(!battleState.opponentTeam[battleState.opponentActiveIndex] || !battleState.playerTeam[battleState.playerActiveIndex]) {console.warn("Attempted opponent action phase with undefined active Pokemon."); return;} battleState.playerTurn = false; battleState.currentActingPokemonIsPlayer = false; const opponentPokemon = battleState.opponentTeam[battleState.opponentActiveIndex]; const opponentMoveCheck = checkCanMove(opponentPokemon, false); if (opponentMoveCheck.message) { typeMessage(opponentMoveCheck.message, () => { if (!opponentMoveCheck.canMove) { handleEndOfTurnStatusEffects(); } else { opponentChooseAndExecuteMove(); } }); } else { opponentChooseAndExecuteMove(); } }
function opponentChooseAndExecuteMove() { if(!battleState.opponentTeam[battleState.opponentActiveIndex] || !battleState.playerTeam[battleState.playerActiveIndex]) {console.warn("Attempted opponent move with undefined active Pokemon."); return;} const attacker = battleState.opponentTeam[battleState.opponentActiveIndex]; const defender = battleState.playerTeam[battleState.playerActiveIndex]; if (attacker.currentHP <= 0) { handleOpponentFaint(); return; } let availableMoves = attacker.moves.filter(m => m.currentPp > 0); if (availableMoves.length === 0) { typeMessage(`${attacker.name.toUpperCase()} has no moves left! It used Struggle!`, () => { /* Implement Struggle if desired, for now, just pass turn */ handleEndOfTurnStatusEffects(); }); return; } const move = availableMoves[Math.floor(Math.random() * availableMoves.length)]; executeMove(attacker, defender, move, false); }
function checkCanMove(pokemon, isPlayer) { if (!pokemon) return { canMove: false, message: null}; const name = pokemon.name.toUpperCase(); if (pokemon.flinch) { pokemon.flinch = false; return { canMove: false, message: `${name} flinched and couldn't move!` }; } if (pokemon.status === "SLP") { if (pokemon.sleepTurns > 0) { pokemon.sleepTurns--; return { canMove: false, message: `${name} is fast asleep.` }; } else { pokemon.status = null; updateStatusTag(pokemon, isPlayer ? playerStatusTagEl : opponentStatusTagEl); return { canMove: true, message: `${name} woke up!` }; } } if (pokemon.status === "FRZ") { if (Math.random() < FREEZE_THAW_CHANCE) { pokemon.status = null; updateStatusTag(pokemon, isPlayer ? playerStatusTagEl : opponentStatusTagEl); return { canMove: true, message: `${name} thawed out!` }; } else { return { canMove: false, message: `${name} is frozen solid!` }; } } if (pokemon.status === "PAR") { if (Math.random() < PARALYSIS_CHANCE_NO_MOVE) { return { canMove: false, message: `${name} is fully paralyzed!` }; } } return { canMove: true, message: null }; }
function showMoveMenu() { if(!battleState.playerTeam[battleState.playerActiveIndex]) {console.warn("Attempted to show move menu with undefined active Pokemon.");return;} actionMenuEl.style.display = 'none'; battleTextboxEl.style.display = 'none'; itemMenuEl.style.display = 'none'; const pPok = battleState.playerTeam[battleState.playerActiveIndex]; const moveBtns = moveMenuEl.querySelectorAll('button:not(.battle-menu-back-button)'); moveBtns.forEach(b => b.style.visibility = 'hidden'); pPok.moves.forEach((m, i) => { if (moveBtns[i]) { moveBtns[i].style.visibility = 'visible'; moveBtns[i].querySelector('.move-name').textContent = m.name.toUpperCase(); moveBtns[i].querySelector('.move-pp').textContent = `PP ${m.currentPp}/${m.maxPp}`; moveBtns[i].disabled = m.currentPp <= 0; } }); moveMenuEl.style.display = 'grid'; }
function applyStatChange(targetPokemon, stat, stages, targetName, isSelf) { const statNames = Array.isArray(stat) ? stat : [stat]; let messages = []; let anyChange = false; statNames.forEach(s => { const currentStage = targetPokemon.stats[s] || 0; let newStage = currentStage; if (stages > 0) newStage = Math.min(6, currentStage + stages); else if (stages < 0) newStage = Math.max(-6, currentStage + stages); if (newStage !== currentStage) { targetPokemon.stats[s] = newStage; anyChange = true; if (stages === 1) messages.push(`${targetName.toUpperCase()}'s ${s} rose!`); else if (stages > 1) messages.push(`${targetName.toUpperCase()}'s ${s} sharply rose!`); else if (stages === -1) messages.push(`${(isSelf ? targetName.toUpperCase() : "Foe " + targetName.toUpperCase())}'s ${s} fell!`); else if (stages < -1) messages.push(`${(isSelf ? targetName.toUpperCase() : "Foe " + targetName.toUpperCase())}'s ${s} harshly fell!`); } }); if (!anyChange) messages.push(`${targetName.toUpperCase()}'s ${statNames.join(' and ')} won't go any ${stages > 0 ? 'higher' : 'lower'}!`); return messages; }
function executeMove(attacker, defender, move, isPlayerAttacking) { battleState.currentActingPokemonIsPlayer = isPlayerAttacking; const attackerName = attacker.name.toUpperCase(); const defenderName = defender.name.toUpperCase(); let turnMessages = []; if (isPlayerAttacking) battleState.playerSelectedMove = move; else battleState.opponentSelectedMove = move; if (attacker.flinch) { attacker.flinch = false; typeMessage(`${attackerName} flinched!`, () => { if (isPlayerAttacking && battleState.opponentTeam[battleState.opponentActiveIndex]?.currentHP > 0) { opponentActionPhase(); } else if (!isPlayerAttacking && battleState.playerTeam[battleState.playerActiveIndex]?.currentHP > 0) { handleEndOfTurnStatusEffects(); } else { handleEndOfTurnStatusEffects(); } }); return; } move.currentPp--; if(isPlayerAttacking) updateBattleUI(); turnMessages.push({ message: `${attackerName} used ${move.name.toUpperCase()}!`, callback: () => { let hit = true; if (!move.alwaysHits) { const moveAccuracy = move.accuracy || 100; const attackerAccStage = attacker.stats.accuracy || 0; const defenderEvaStage = defender.stats.evasion || 0; const accModifier = calculateStatWithStage(100, attackerAccStage, 'accuracy') / 100; const evaModifier = calculateStatWithStage(100, defenderEvaStage, 'evasion') / 100; const finalAccuracy = moveAccuracy * (accModifier / evaModifier); if (Math.random() * 100 >= finalAccuracy) hit = false; } if (!hit) { turnMessages.push({ message: `${attackerName}'s attack missed!`, callback: () => { if (isPlayerAttacking && battleState.opponentTeam[battleState.opponentActiveIndex]?.currentHP > 0) { opponentActionPhase(); } else { handleEndOfTurnStatusEffects(); } }}); processTurnMessages(turnMessages); return; } playAttackAnimation(move.type, isPlayerAttacking ? playerPokemonSpriteEl.parentElement : opponentPokemonSpriteEl.parentElement, isPlayerAttacking ? opponentPokemonSpriteEl.parentElement : playerPokemonSpriteEl.parentElement, () => { playShakeAnimation(isPlayerAttacking ? opponentPokemonSpriteEl.parentElement : playerPokemonSpriteEl.parentElement); let effectivenessMultiplier = 1; let calculatedDamage = 0; let isCrit = false; if (move.power > 0) { effectivenessMultiplier = calculateTypeEffectiveness(move.type, defender.types); if (effectivenessMultiplier === 0) { calculatedDamage = 0; } else { let critChance = CRITICAL_HIT_CHANCE_BASE * (move.highCritRatio ? 2 : 1); if (Math.random() < critChance) isCrit = true; let effAttackerAttack = calculateStatWithStage(attacker.baseStats.attack, attacker.stats.attack, 'attack'); let effDefenderDefense = calculateStatWithStage(defender.baseStats.defense, defender.stats.defense, 'defense'); if (isCrit) { if (attacker.stats.attack < 0) effAttackerAttack = attacker.baseStats.attack; if (defender.stats.defense > 0) effDefenderDefense = defender.baseStats.defense; } calculatedDamage = Math.max(1, Math.floor((((((2 * GAME_LEVEL / 5 + 2) * effAttackerAttack * move.power) / effDefenderDefense) / 50) + 2) * effectivenessMultiplier * (isCrit ? CRITICAL_HIT_MULTIPLIER : 1))); } defender.currentHP -= calculatedDamage; } else if (move.effect && move.effect.type === "fixed_damage") { calculatedDamage = move.effect.damage; defender.currentHP -= calculatedDamage;} updateBattleUI(); if (isCrit) turnMessages.push({ message: "A critical hit!" }); const effText = getEffectivenessText(effectivenessMultiplier, defenderName); if (effText && move.power > 0) turnMessages.push({ message: effText }); if (move.effect) { const effect = move.effect; const canApplyEffect = effectivenessMultiplier > 0 || move.effect.type === "stat" || move.effect.type === "heal"; if (effect.type === "status" && defender.status === null && canApplyEffect && (!effect.chance || Math.random() < effect.chance)) { defender.status = effect.condition; if (effect.condition === "SLP") defender.sleepTurns = Math.floor(Math.random() * 3) + 2; else if (effect.condition === "FRZ" && defender.types.includes("Ice")) {} else turnMessages.push({ message: `${defenderName} was ${effect.condition === "BRN" ? "burned" : effect.condition === "PSN" ? "poisoned" : effect.condition === "PAR" ? "paralyzed" : effect.condition === "SLP" ? "put to sleep" : "frozen"}!` }); } else if (effect.type === "stat" && canApplyEffect && (!effect.chance || Math.random() < effect.chance)) { const target = effect.target === "self" ? attacker : defender; const targetN = effect.target === "self" ? attackerName : defenderName; const statMsgs = applyStatChange(target, effect.stat, effect.stages, targetN, effect.target === "self"); statMsgs.forEach(m => turnMessages.push({message: m})); } else if (effect.type === "heal" && effect.target === "self") { const healAmount = Math.floor(attacker.maxHP * effect.percentage); attacker.currentHP = Math.min(attacker.maxHP, attacker.currentHP + healAmount); turnMessages.push({ message: `${attackerName} recovered health!` }); } else if (effect.type === "switch" && effect.target === "opponent" && canApplyEffect) { const targetTeam = isPlayerAttacking ? battleState.opponentTeam : battleState.playerTeam; const currentActiveIdx = isPlayerAttacking ? battleState.opponentActiveIndex : battleState.playerActiveIndex; const availableSwitch = targetTeam.filter((p, i) => p.currentHP > 0 && i !== currentActiveIdx); if (availableSwitch.length > 0) { const oldTargetName = targetTeam[currentActiveIdx].name.toUpperCase(); const newTargetIdx = targetTeam.indexOf(availableSwitch[Math.floor(Math.random() * availableSwitch.length)]); if (isPlayerAttacking) battleState.opponentActiveIndex = newTargetIdx; else battleState.playerActiveIndex = newTargetIdx; turnMessages.push({ message: `${oldTargetName} was dragged out!` }); turnMessages.push({ message: `${(isPlayerAttacking ? "Opponent sent out " : "Go ")}${targetTeam[newTargetIdx].name.toUpperCase()}!`}); battleState.attackerUsedMoveFirstThisTurn = true; } else { turnMessages.push({ message: "But it failed!"}); } } else if (effect.type === "flinch" && canApplyEffect && (!effect.chance || Math.random() < effect.chance)) { if (battleState.attackerUsedMoveFirstThisTurn && !defender.flinch) { defender.flinch = true; } } updateBattleUI(); } processTurnMessages(turnMessages, isPlayerAttacking ? defender : attacker, isPlayerAttacking); }); }}); processTurnMessages(turnMessages, isPlayerAttacking ? defender : attacker, isPlayerAttacking); }
function processTurnMessages(messages, nextPokemonToActIfApplicable, isOriginalAttackerPlayer) { if (messages.length > 0) { const nextMsg = messages.shift(); typeMessage(nextMsg.message, nextMsg.callback || (() => processTurnMessages(messages, nextPokemonToActIfApplicable, isOriginalAttackerPlayer))); } else { if(!battleState.playerTeam[battleState.playerActiveIndex] || !battleState.opponentTeam[battleState.opponentActiveIndex]) {console.warn("Attempted to process turn end with undefined active Pokemon."); return;} const playerPokemon = battleState.playerTeam[battleState.playerActiveIndex]; const opponentPokemon = battleState.opponentTeam[battleState.opponentActiveIndex]; if (playerPokemon.currentHP <= 0) { handlePlayerFaint(); return; } if (opponentPokemon.currentHP <= 0) { handleOpponentFaint(); return; } if (isOriginalAttackerPlayer) { opponentActionPhase(); } else { handleEndOfTurnStatusEffects(); } } }
function playerAttack(moveIndex) { if(!battleState.playerTeam[battleState.playerActiveIndex] || !battleState.opponentTeam[battleState.opponentActiveIndex]) {console.warn("Attempted player attack with undefined active Pokemon."); return;} moveMenuEl.style.display = 'none'; const attacker = battleState.playerTeam[battleState.playerActiveIndex]; const defender = battleState.opponentTeam[battleState.opponentActiveIndex]; const move = attacker.moves[moveIndex]; if (!move || move.currentPp <= 0) { playerActionPhase(); return; } battleState.attackerUsedMoveFirstThisTurn = true; executeMove(attacker, defender, move, true); }
function handleEndOfTurnStatusEffects() { if(!battleState.playerTeam[battleState.playerActiveIndex] || !battleState.opponentTeam[battleState.opponentActiveIndex]) {console.warn("Attempted EOT effects with undefined active Pokemon."); return;} let turnEndMessages = []; let playerFaintedFromStatus = false; let opponentFaintedFromStatus = false; const playerPokemon = battleState.playerTeam[battleState.playerActiveIndex]; const opponentPokemon = battleState.opponentTeam[battleState.opponentActiveIndex]; const applyEOT = (pokemon, isPlayer) => { if (pokemon.currentHP > 0 && pokemon.status) { if (pokemon.status === "BRN" || pokemon.status === "PSN") { const damage = Math.floor(pokemon.maxHP / (pokemon.status === "PSN" ? 8 : 16)); pokemon.currentHP -= damage; turnEndMessages.push({ message: `${pokemon.name.toUpperCase()} was hurt by its ${pokemon.status === "BRN" ? "burn" : "poison"}!` }); if (pokemon.currentHP <= 0) isPlayer ? playerFaintedFromStatus = true : opponentFaintedFromStatus = true; } } }; applyEOT(playerPokemon, true); if (playerFaintedFromStatus) turnEndMessages.push({ message: `${playerPokemon.name.toUpperCase()} fainted!` }); if (opponentPokemon.currentHP > 0) { applyEOT(opponentPokemon, false); if (opponentFaintedFromStatus) turnEndMessages.push({ message: `${opponentPokemon.name.toUpperCase()} fainted!` }); } updateBattleUI(); const showEOTMessages = () => { if (turnEndMessages.length > 0) { const msg = turnEndMessages.shift(); typeMessage(msg.message, showEOTMessages); } else { if (playerPokemon.currentHP <= 0) handlePlayerFaint(); else if (opponentPokemon.currentHP <= 0) handleOpponentFaint(); else setTimeout(startTurnPhase, 800); } }; showEOTMessages(); }
function showSwitchScreen(isForced = false) { battleState.switchingAfterFaint = isForced; actionMenuEl.style.display = 'none'; moveMenuEl.style.display = 'none'; itemMenuEl.style.display = 'none'; battleTextboxEl.style.display = 'none'; switchGridEl.innerHTML = ''; battleState.playerTeam.forEach((p, i) => { const opt = document.createElement('div'); opt.classList.add('switch-option'); opt.dataset.index = i; const sp = document.createElement('img'); sp.src = p.spriteFrontUrl; sp.alt = p.name.toUpperCase(); opt.appendChild(sp); const nfo = document.createElement('div'); nfo.classList.add('switch-info'); nfo.innerHTML = `<span class="name">${p.name.toUpperCase()}${p.isShiny ? ' (S)' : ''} ${p.status ? '('+p.status.toUpperCase()+')' : ''}</span><div class="hp-bar-container"><div class="hp-bar-fill" style="width:${Math.max(0,(p.currentHP/p.maxHP)*100)}%; background-color:${p.currentHP/p.maxHP > 0.5 ? 'var(--hp-high-color)' : (p.currentHP/p.maxHP > 0.2 ? 'var(--hp-medium-color)' : 'var(--hp-low-color)')};"></div></div><div class="hp-numbers">${Math.max(0,Math.floor(p.currentHP))}/${p.maxHP}</div>`; opt.appendChild(nfo); if (p.currentHP <= 0) opt.classList.add('fainted'); else if (i === battleState.playerActiveIndex) opt.classList.add('active'); else opt.addEventListener('click', () => switchPokemonAction(i)); switchGridEl.appendChild(opt); }); switchCancelButton.style.display = isForced ? 'none' : 'block'; switchScreen('switchPokemon'); }
function switchPokemonAction(newIndex) { if(!battleState.playerTeam[battleState.playerActiveIndex] || !battleState.playerTeam[newIndex]) {console.warn("Attempted switch with undefined Pokemon."); return;} const oldPok = battleState.playerTeam[battleState.playerActiveIndex]; const newPok = battleState.playerTeam[newIndex]; if (newPok.currentHP <= 0 || newIndex === battleState.playerActiveIndex) return; battleState.playerActiveIndex = newIndex; updateBattleUI(); switchScreen('battle'); let msgs = []; if (!battleState.switchingAfterFaint) { msgs.push({ message: `Come back, ${oldPok.name.toUpperCase()}!`}); battleState.playerTurn = false; } msgs.push({ message: `Go, ${newPok.name.toUpperCase()}!`, callback: null }); const finalCb = () => { battleState.switchingAfterFaint = false; if (!battleState.playerTurn && battleState.opponentTeam[battleState.opponentActiveIndex] && battleState.opponentTeam[battleState.opponentActiveIndex].currentHP > 0) { opponentActionPhase(); } else { startTurnPhase(); } }; const showNxt = () => { if (msgs.length > 0) { const n = msgs.shift(); typeMessage(n.message, n.callback || showNxt); } else { setTimeout(finalCb, 500); } }; showNxt(); }

function finalizeBattleState() {
    if (!selectedTrainerData || !selectedTrainerData.team) return;

    battleState.playerTeam.forEach(battlePok => {
        if(!battlePok) return;
        const trainerPok = selectedTrainerData.team.find(p => p && p.id === battlePok.id);
        if (trainerPok) {
            trainerPok.currentHP = Math.max(0, battlePok.currentHP); // Zorg dat HP niet negatief wordt
            trainerPok.status = battlePok.status;
            trainerPok.sleepTurns = battlePok.sleepTurns;
            trainerPok.flinch = false; // Reset flinch
            trainerPok.stats = { attack: 0, defense: 0, speed: 0, accuracy: 0, evasion: 0 }; // Reset stat stages

            // Herstel PP voor alle moves, ongeacht of ze in de battle gebruikt zijn
            trainerPok.moves.forEach(tpMove => {
                const baseMoveData = pokemonPool.find(p => p.pokedexId === trainerPok.pokedexId)?.moves.find(m => m.name === tpMove.name);
                if (baseMoveData) {
                    tpMove.currentPp = baseMoveData.maxPp;
                }
            });

            // Als de Pokémon tijdelijk geëvolueerd was, zet terug naar originele staat
            if (battlePok.originalEvolutionData) {
                // De HP ratio en revert logica wordt hieronder toegepast
                trainerPok.pokedexId = battlePok.originalEvolutionData.pokedexId;
                trainerPok.name = battlePok.originalEvolutionData.name;
                trainerPok.types = [...battlePok.originalEvolutionData.types];
                const oldMaxHPBeforeRevert = trainerPok.maxHP; // HP van de geëvolueerde vorm
                trainerPok.maxHP = battlePok.originalEvolutionData.maxHP; // HP van de originele vorm
                // HP ratio wordt nu berekend op basis van de originele vorm's maxHP
                // Echter, we willen het HP van de battle overnemen, maar gemaximaliseerd door de originele maxHP
                trainerPok.currentHP = Math.min(Math.max(0, battlePok.currentHP), trainerPok.maxHP);
                if (battlePok.currentHP <= 0) trainerPok.currentHP = 0; // Zeker zijn dat fainted blijft fainted

                trainerPok.baseStats = JSON.parse(JSON.stringify(battlePok.originalEvolutionData.baseStats));
                trainerPok.moves = battlePok.originalEvolutionData.moves.map(m => ({ ...m, currentPp: m.maxPp })); // Volle PP voor originele moveset
                trainerPok.isShiny = battlePok.originalEvolutionData.isShiny; // Behoud shiny status van origineel

                const shinyBaseUrl = "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon";
                const basePokemonForSprite = pokemonPool.find(baseP => baseP.pokedexId === trainerPok.pokedexId) || {};
                trainerPok.spriteFrontUrl = trainerPok.isShiny ? `${shinyBaseUrl}/shiny/${trainerPok.pokedexId}.png` : (basePokemonForSprite.spriteFront || `${shinyBaseUrl}/${trainerPok.pokedexId}.png`);
                trainerPok.spriteBackUrl = trainerPok.isShiny ? `${shinyBaseUrl}/back/shiny/${trainerPok.pokedexId}.png` : (basePokemonForSprite.spriteBack || `${shinyBaseUrl}/back/${trainerPok.pokedexId}.png`);

                trainerPok.originalEvolutionData = null; // Verwijder tijdelijke data
                battlePok.originalEvolutionData = null; // Ook uit battle state voor consistentie
            }
        }
    });
    saveGame();
}

function handlePlayerFaint() {
    if(!battleState.playerTeam[battleState.playerActiveIndex]) {
        console.warn("Attempted player faint with undefined Pokemon."); return;
    }
    const p = battleState.playerTeam[battleState.playerActiveIndex];
    const cb = () => {
        const rem = battleState.playerTeam.filter(pk => pk.currentHP > 0);
        if (rem.length === 0) {
            stopBattleMusic(); // Stop muziek bij verlies
            let coinsEarned = 0;
            let lossMessage = "You have no more Pokémon! You lost the battle!";
            if (battleState.isGymBattle) {
                coinsEarned = 10;
                lossMessage = `You lost to Gym Leader ${gymLeadersData[battleState.currentGymLeaderKey].name}! You earned ${coinsEarned} coins.`;
            } else if (battleState.isEliteFourBattle) {
                coinsEarned = 20;
                lossMessage = `You lost to Elite Four ${eliteFourData[battleState.currentEliteFourMemberKey].name}! You earned ${coinsEarned} coins.`;
            } else if (battleState.isPokemonLeagueBattle) {
                coinsEarned = 25;
                lossMessage = `You were defeated in the Pokémon League by ${currentLeagueOrder[battleState.currentLeagueOpponentIndex].name}! You earned ${coinsEarned} coins.`;
                // Reset league progress in selectedTrainerData voor een nieuwe poging
                if (selectedTrainerData) {
                    selectedTrainerData.currentLeagueOpponentIndex = 0;
                    selectedTrainerData.leagueBattlesWon = 0;
                    selectedTrainerData.defeatedPokemonLeague = false;
                }
            } else if (!battleState.isWildBattle) { // Quick Battle verlies
                coinsEarned = 5;
                lossMessage = `You lost the Quick Battle! You earned ${coinsEarned} coins.`;
            }
            if (selectedTrainerData && coinsEarned > 0) {
                selectedTrainerData.coins = (selectedTrainerData.coins || 0) + coinsEarned;
                updateCoinDisplay();
            }
            typeMessage(lossMessage, () => setTimeout(() => {
                finalizeBattleState();
                screens.battle.style.backgroundImage = "url('https://pokemonrevolution.net/forum/uploads/monthly_2021_03/DVMT-6OXcAE2rZY.jpg.afab972f972bd7fbd4253bc7aa1cf27f.jpg')";
                battleState.isWildBattle = false; battleState.isGymBattle = false; battleState.isEliteFourBattle = false; battleState.isPokemonLeagueBattle = false;
                battleState.currentGymLeaderKey = null; battleState.currentEliteFourMemberKey = null;
                // battleState.currentLeagueOpponentIndex en leagueBattlesWon worden gereset bij showPokemonLeagueScreen indien nodig
                switchScreen('mainMenu');
            }, 1000));
        } else {
            showSwitchScreen(true);
        }
    };
    if (battleState.isProcessingMessage) battleState.messageQueue.push({message: `${p.name.toUpperCase()} fainted!`, callback: cb});
    else typeMessage(`${p.name.toUpperCase()} fainted!`, cb);
    updateBattleUI();
}

function handleOpponentFaint() {
    if(!battleState.opponentTeam[battleState.opponentActiveIndex]) {
        console.warn("Attempted opponent faint with undefined Pokemon."); return;
    }
    const o = battleState.opponentTeam[battleState.opponentActiveIndex];
    let coinsEarned = 0;
    let winMessages = [];

    const addCoins = (amount) => {
        if (selectedTrainerData && amount > 0) {
            selectedTrainerData.coins = (selectedTrainerData.coins || 0) + amount;
            updateCoinDisplay();
        }
    };

    const cb = () => {
        const remOpponent = battleState.opponentTeam.filter(pk => pk.currentHP > 0);
        if (remOpponent.length === 0) { // Alle Pokémon van de huidige tegenstander zijn verslagen
            stopBattleMusic(); // Stop muziek bij winst van het gevecht/league
            if (battleState.isWildBattle) {
                coinsEarned = 3;
                winMessages.push(`The wild ${o.name.toUpperCase()} fainted! You earned ${coinsEarned} coins!`);
                addCoins(coinsEarned);
            } else if (battleState.isGymBattle) {
                coinsEarned = 30;
                const leaderData = gymLeadersData[battleState.currentGymLeaderKey];
                winMessages.push(`You defeated Gym Leader ${leaderData.name}!`);
                winMessages.push(`You earned the ${leaderData.name}'s Trainer Card and ${coinsEarned} coins!`);
                if (selectedTrainerData && !selectedTrainerData.defeatedGymLeaders.includes(battleState.currentGymLeaderKey)) {
                    selectedTrainerData.defeatedGymLeaders.push(battleState.currentGymLeaderKey);
                }
                addCoins(coinsEarned);
            } else if (battleState.isEliteFourBattle) {
                coinsEarned = 60; // Elite Four geeft meer
                const memberData = eliteFourData[battleState.currentEliteFourMemberKey];
                winMessages.push(`You defeated Elite Four ${memberData.name}!`);
                winMessages.push(`You earned the ${memberData.name}'s Trainer Card and ${coinsEarned} coins!`);
                 if (selectedTrainerData && !selectedTrainerData.defeatedEliteFourMembers.includes(battleState.currentEliteFourMemberKey)) {
                    selectedTrainerData.defeatedEliteFourMembers.push(battleState.currentEliteFourMemberKey);
                }
                addCoins(coinsEarned);
            } else if (battleState.isPokemonLeagueBattle) {
                selectedTrainerData.leagueBattlesWon = (selectedTrainerData.leagueBattlesWon || 0) + 1;
                battleState.leagueBattlesWon = selectedTrainerData.leagueBattlesWon; // Sync
                battleState.currentLeagueOpponentIndex++; // Voorbereiden op volgende of einde

                if (battleState.leagueBattlesWon >= currentLeagueOrder.length) { // Hele League verslagen
                    coinsEarned = 150;
                    winMessages.push(`You have defeated the Pokémon League!`);
                    winMessages.push(`YOU ARE THE POKéMON MASTER! You earned ${coinsEarned} coins!`);
                    selectedTrainerData.defeatedPokemonLeague = true;
                    addCoins(coinsEarned);
                } else { // Volgende League tegenstander komt
                    coinsEarned = 50; // Beloning per gewonnen League battle
                    const defeatedLeagueTrainerName = currentLeagueOrder[battleState.currentLeagueOpponentIndex - 1].name; // Index is al verhoogd
                    winMessages.push(`You defeated ${defeatedLeagueTrainerName}! You earned ${coinsEarned} coins!`);
                    addCoins(coinsEarned);
                }
            } else { // Quick Battle winst
                 coinsEarned = 15;
                 winMessages.push(`You defeated the opponent and earned ${coinsEarned} coins!`);
                 addCoins(coinsEarned);
            }
        }

        const processWinMessagesSequence = () => {
            if (winMessages.length > 0) {
                typeMessage(winMessages.shift(), processWinMessagesSequence);
            } else { // Alle winstberichten zijn getoond
                const stillOpponentsLeft = battleState.opponentTeam.filter(pk => pk.currentHP > 0).length > 0;
                if (!stillOpponentsLeft) { // Geen Pokémon meer bij de huidige tegenstander
                    if (battleState.isPokemonLeagueBattle && !selectedTrainerData.defeatedPokemonLeague) {
                        // Naar League scherm voor volgende battle of winstbericht
                        finalizeBattleState(); // Slaat ook updated league progress op
                        switchScreen('pokemonLeague');
                        updatePokemonLeagueScreenUI(); // Toont volgende opponent of champion status
                    } else { // Einde battle (Wild, Gym, E4, Quick, of gewonnen League)
                        setTimeout(() => {
                            finalizeBattleState();
                            screens.battle.style.backgroundImage = "url('https://pokemonrevolution.net/forum/uploads/monthly_2021_03/DVMT-6OXcAE2rZY.jpg.afab972f972bd7fbd4253bc7aa1cf27f.jpg')";
                            battleState.isWildBattle = false; battleState.isGymBattle = false; battleState.isEliteFourBattle = false; battleState.isPokemonLeagueBattle = false;
                            battleState.currentGymLeaderKey = null; battleState.currentEliteFourMemberKey = null;
                            // League state wordt gereset bij showPokemonLeagueScreen als nodig
                            switchScreen('mainMenu');
                        }, 1200);
                    }
                } else { // Tegenstander heeft nog Pokémon
                    let nxtIdx = battleState.opponentTeam.findIndex(p => p.currentHP > 0);
                    if (nxtIdx !== -1) {
                        battleState.opponentActiveIndex = nxtIdx;
                        const newOpp = battleState.opponentTeam[nxtIdx];
                        const opponentTrainerName = battleState.isGymBattle ? gymLeadersData[battleState.currentGymLeaderKey].name :
                                             battleState.isEliteFourBattle ? eliteFourData[battleState.currentEliteFourMemberKey].name :
                                             battleState.isPokemonLeagueBattle ? currentLeagueOrder[battleState.currentLeagueOpponentIndex].name : "Opponent"; // currentLeagueOpponentIndex is al verhoogd als we hier komen na een league win
                        typeMessage(`${opponentTrainerName} sent out ${newOpp.name.toUpperCase()}!`, () => {
                            updateBattleUI();
                            setTimeout(startTurnPhase, 800);
                        });
                    } else { // Zou niet moeten gebeuren als stillOpponentsLeft false was
                        console.error("Error: Opponent has no more Pokémon, but battle didn't end as expected.");
                        finalizeBattleState(); switchScreen('mainMenu');
                    }
                }
            }
        };
        typeMessage(`Foe's ${o.name.toUpperCase()} fainted!`, processWinMessagesSequence);
    };

    cb(); // Start de callback sequence direct na het fainen.
    updateBattleUI();
}


function getEvolutionTarget(currentPokedexId) {
    const currentPokemonData = pokemonPool.find(p => p.pokedexId === currentPokedexId);
    if (currentPokemonData && typeof currentPokemonData.evolvesToPokedexId === 'number') {
        return pokemonPool.find(p => p.pokedexId === currentPokemonData.evolvesToPokedexId);
    }
    return null;
}

function evolvePokemon(pokemonToEvolve, evolvedFormData, isPermanentEvolution = false) {
    const originalName = pokemonToEvolve.name.toUpperCase();
    const originalPokedexId = pokemonToEvolve.pokedexId;
    const wasShiny = pokemonToEvolve.isShiny; // Belangrijk: onthoud shiny status

    if (!isPermanentEvolution && !pokemonToEvolve.originalEvolutionData) {
        pokemonToEvolve.originalEvolutionData = {
            pokedexId: originalPokedexId, name: pokemonToEvolve.name, types: [...pokemonToEvolve.types],
            maxHP: pokemonToEvolve.maxHP, baseStats: JSON.parse(JSON.stringify(pokemonToEvolve.baseStats)),
            moves: pokemonToEvolve.moves.map(m => ({ ...m })), // Kopieer moves
            isShiny: wasShiny, // Sla shiny status op
            spriteFrontUrl: pokemonToEvolve.spriteFrontUrl, // Sla huidige sprites op
            spriteBackUrl: pokemonToEvolve.spriteBackUrl,
            evolvesToPokedexId: pokemonToEvolve.evolvesToPokedexId
        };
    } else if (isPermanentEvolution) {
        pokemonToEvolve.originalEvolutionData = null; // Permanente evolutie, geen terugweg
    }

    pokemonToEvolve.pokedexId = evolvedFormData.pokedexId;
    pokemonToEvolve.name = evolvedFormData.name.toUpperCase();
    pokemonToEvolve.types = [...evolvedFormData.types];
    const oldMaxHP = pokemonToEvolve.maxHP;
    pokemonToEvolve.maxHP = evolvedFormData.hp;
    pokemonToEvolve.currentHP = Math.max(1, Math.floor((pokemonToEvolve.currentHP / oldMaxHP) * pokemonToEvolve.maxHP));
    pokemonToEvolve.baseStats = JSON.parse(JSON.stringify(evolvedFormData.baseStats));
    pokemonToEvolve.moves = evolvedFormData.moves.map(m => ({ ...m, currentPp: m.maxPp })); // Nieuwe moveset met volle PP
    pokemonToEvolve.evolvesToPokedexId = evolvedFormData.evolvesToPokedexId || null;
    pokemonToEvolve.isShiny = wasShiny; // Pas shiny status toe op de geëvolueerde vorm

    // Update sprite URLs gebaseerd op de (mogelijk nieuwe) shiny status
    const shinyBaseUrl = "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon";
    pokemonToEvolve.spriteFrontUrl = pokemonToEvolve.isShiny ? `${shinyBaseUrl}/shiny/${evolvedFormData.pokedexId}.png` : evolvedFormData.spriteFront;
    pokemonToEvolve.spriteBackUrl = pokemonToEvolve.isShiny ? `${shinyBaseUrl}/back/shiny/${evolvedFormData.pokedexId}.png` : evolvedFormData.spriteBack;


    if (isPermanentEvolution) {
        const teamPokemonInstance = selectedTrainerData.team.find(p => p && p.id === pokemonToEvolve.id);
        if (teamPokemonInstance) {
            Object.assign(teamPokemonInstance, {
                pokedexId: pokemonToEvolve.pokedexId,
                name: pokemonToEvolve.name.toUpperCase(),
                types: [...pokemonToEvolve.types],
                maxHP: pokemonToEvolve.maxHP,
                currentHP: pokemonToEvolve.currentHP,
                baseStats: JSON.parse(JSON.stringify(pokemonToEvolve.baseStats)),
                moves: pokemonToEvolve.moves.map(m => ({...m})), // Kopieer nieuwe moveset
                isShiny: pokemonToEvolve.isShiny, // Update shiny status
                spriteFrontUrl: pokemonToEvolve.spriteFrontUrl, // Update sprites
                spriteBackUrl: pokemonToEvolve.spriteBackUrl,
                evolvesToPokedexId: pokemonToEvolve.evolvesToPokedexId,
                originalEvolutionData: null // Permanente evolutie
            });
            saveGame(); // Sla de permanente wijziging op
        }
    }
    return originalName; // Return de naam van VOOR de evolutie
}

function useEvolutionItem(itemName) {
    const playerPokemon = battleState.playerTeam[battleState.playerActiveIndex];
    const evolutionTargetData = getEvolutionTarget(playerPokemon.pokedexId);
    const isPermanent = itemName === "Perma Evolution Stone";

    if (evolutionTargetData && selectedTrainerData.inventory[itemName] > 0) {
        selectedTrainerData.inventory[itemName]--;
        if (!isPermanent) saveGame(); // Sla verbruik van normale steen op

        itemMenuEl.style.display = 'none';
        typeMessage(`${selectedTrainerData.name} used a ${itemName}!`, () => {
            typeMessage(`${playerPokemon.name.toUpperCase()} is evolving!`, () => {
                playerPokemonSpriteEl.parentElement.classList.add('flash-anim');
                setTimeout(() => {
                    playerPokemonSpriteEl.parentElement.classList.remove('flash-anim');

                    const originalName = evolvePokemon(playerPokemon, evolutionTargetData, isPermanent); // Geef isPermanent mee
                    updateBattleUI(); // Update UI met nieuwe Pokémon info (incl. shiny sprite indien van toepassing)

                    typeMessage(`Congratulations! Your ${originalName} evolved into ${playerPokemon.name.toUpperCase()}!${isPermanent ? " (Permanently)" : ""}`, () => {
                        if (isPermanent) saveGame(); // saveGame wordt in evolvePokemon al gedaan voor permanent
                        opponentActionPhase();
                    });
                }, 1000);
            });
        });
    } else {
        typeMessage("It won't have any effect.", () => {
            playerActionPhase();
        });
    }
}


function throwPokeball(itemName) {
    if (!battleState.isWildBattle) {
        typeMessage("Can only use Poké Balls in wild battles!", playerActionPhase);
        return;
    }
    if (!selectedTrainerData || !selectedTrainerData.inventory || selectedTrainerData.inventory[itemName] <= 0) {
        typeMessage(`You don't have any ${itemName}s!`, playerActionPhase);
        return;
    }

    selectedTrainerData.inventory[itemName]--; // Verbruik bal
    saveGame(); // Sla inventariswijziging op

    const opponentPokemon = battleState.opponentTeam[battleState.opponentActiveIndex];
    typeMessage(`${selectedTrainerData.name} used a ${itemName}!`, () => {
        const pokeballAnim = document.createElement('div');
        pokeballAnim.classList.add('pokeball-throw-animation');

        const playerRect = playerPokemonSpriteEl.getBoundingClientRect();
        const opponentRect = opponentPokemonSpriteEl.getBoundingClientRect();
        const arenaRect = screens.battle.querySelector('.battle-arena').getBoundingClientRect();

        pokeballAnim.style.left = `${playerRect.left + playerRect.width / 2 - arenaRect.left - 15}px`;
        pokeballAnim.style.top = `${playerRect.bottom - arenaRect.top - 30 - 15}px`;

        pokeballAnim.style.setProperty('--target-x', `${opponentRect.left + opponentRect.width / 2 - (playerRect.left + playerRect.width / 2)}px`);
        pokeballAnim.style.setProperty('--target-y', `${opponentRect.top + opponentRect.height / 2 - (playerRect.bottom - 30)}px`);


        if (itemName === "Great Ball") pokeballAnim.style.backgroundImage = 'var(--item-icon-greatball)';
        else if (itemName === "Ultra Ball") pokeballAnim.style.backgroundImage = 'var(--item-icon-ultraball)';
        // Standaard is Poké Ball (var(--item-icon-pokeball)) via CSS


        attackAnimationLayer.appendChild(pokeballAnim);

        setTimeout(() => {
            pokeballAnim.remove();
            const catchRateBase = itemName === "Ultra Ball" ? 2 : (itemName === "Great Ball" ? 1.5 : 1);
            const maxHP = opponentPokemon.maxHP;
            const currentHP = opponentPokemon.currentHP;
            let catchChance = (((3 * maxHP - 2 * currentHP) * 45 * catchRateBase) / (3 * maxHP)) / 255;
            if (opponentPokemon.status && (opponentPokemon.status === "SLP" || opponentPokemon.status === "FRZ")) catchChance *= 2.5;
            else if (opponentPokemon.status && (opponentPokemon.status === "PAR" || opponentPokemon.status === "PSN" || opponentPokemon.status === "BRN")) catchChance *= 1.5;

            if (Math.random() < catchChance || opponentPokemon.currentHP <= 1) { // Vangen
                stopBattleMusic();
                typeMessage(`Gotcha! ${opponentPokemon.name.toUpperCase()} was caught!`, () => {
                    opponentPokemonSpriteEl.parentElement.classList.add('pokemon-caught-flash');
                    setTimeout(() => {
                        opponentPokemonSpriteEl.parentElement.classList.remove('pokemon-caught-flash');
                        const caughtPokemonData = pokemonPool.find(p => p.pokedexId === opponentPokemon.pokedexId);

                        // Belangrijk: geef de shiny status van de gevangen Pokémon mee
                        const newPlayerPokemon = createPokemonFromData(
                            {...caughtPokemonData, isShiny: opponentPokemon.isShiny},
                            false, // Niet isOpponent
                            true   // Wel forPlayerTeam
                        );
                        newPlayerPokemon.currentHP = Math.max(1, opponentPokemon.currentHP); // HP overnemen
                        newPlayerPokemon.status = opponentPokemon.status; // Status overnemen

                        if (selectedTrainerData.team.length < MAX_TEAM_SIZE) {
                            selectedTrainerData.team.push(newPlayerPokemon);
                            alert(`${newPlayerPokemon.name.toUpperCase()}${newPlayerPokemon.isShiny ? " (Shiny)" : ""} was added to your team!`);
                        } else if (selectedTrainerData.pcBox.length < MAX_PC_BOX_SIZE) {
                            selectedTrainerData.pcBox.push(newPlayerPokemon);
                            alert(`${newPlayerPokemon.name.toUpperCase()}${newPlayerPokemon.isShiny ? " (Shiny)" : ""} was sent to the PC!`);
                        } else {
                             alert(`Team and PC Box are full! Cannot catch ${newPlayerPokemon.name.toUpperCase()}.`);
                        }
                        finalizeBattleState(); // Slaat team/pc wijzigingen op
                        battleState.isWildBattle = false;
                        screens.battle.style.backgroundImage = "url('https://pokemonrevolution.net/forum/uploads/monthly_2021_03/DVMT-6OXcAE2rZY.jpg.afab972f972bd7fbd4253bc7aa1cf27f.jpg')";
                        switchScreen('mainMenu');
                    }, 600);
                });
            } else { // Niet gevangen
                typeMessage(`Oh no! The Pokémon broke free!`, opponentActionPhase);
            }
        }, 3500); // Duur van de animatie
    });
}


function showItemMenu() {
    if (!selectedTrainerData || !selectedTrainerData.inventory) {
        typeMessage("No items in inventory.", playerActionPhase);
        return;
    }
    itemMenuEl.innerHTML = '';
    const pPok = battleState.playerTeam[battleState.playerActiveIndex];
    let usableItemsFound = false;

    const evoStones = ["Evolution Stone", "Perma Evolution Stone"];
    evoStones.forEach(stoneName => {
        if (selectedTrainerData.inventory[stoneName] > 0) {
            const evoTarget = getEvolutionTarget(pPok.pokedexId);
            if (evoTarget) {
                const btn = document.createElement('button');
                btn.dataset.itemName = stoneName;
                btn.innerHTML = `<span class="item-icon-battle evolutionstone"></span><span class="item-name-battle">${stoneName}</span><span class="item-count-battle">x${selectedTrainerData.inventory[stoneName]}</span>`;
                itemMenuEl.appendChild(btn);
                usableItemsFound = true;
            }
        }
    });


    if (battleState.isWildBattle) {
        const balls = ["Poke Ball", "Great Ball", "Ultra Ball"];
        balls.forEach(ballName => {
            if (selectedTrainerData.inventory[ballName] > 0) {
                const btn = document.createElement('button');
                btn.dataset.itemName = ballName;
                let battleIconClass = "pokeball";
                if (ballName === "Great Ball") battleIconClass = "greatball";
                else if (ballName === "Ultra Ball") battleIconClass = "ultraball";

                btn.innerHTML = `<span class="item-icon-battle ${battleIconClass}"></span><span class="item-name-battle">${ballName}</span><span class="item-count-battle">x${selectedTrainerData.inventory[ballName]}</span>`;
                itemMenuEl.appendChild(btn);
                usableItemsFound = true;
            }
        });
    }

    if (!usableItemsFound) {
        typeMessage("No usable items for this situation.", playerActionPhase);
        return;
    }

    const backBtn = document.createElement('button');
    backBtn.dataset.action = "back-to-actions";
    backBtn.classList.add("battle-menu-back-button");
    backBtn.innerHTML = 'BACK';
    itemMenuEl.appendChild(backBtn);

    actionMenuEl.style.display = 'none';
    moveMenuEl.style.display = 'none';
    battleTextboxEl.style.display = 'none';
    itemMenuEl.style.display = 'grid';
}

function showGymLeaderSelectScreen() {
    gymLeaderGridEl.innerHTML = '';
    Object.keys(gymLeadersData).forEach(key => {
        const leader = gymLeadersData[key];
        const leaderButton = document.createElement('button');
        leaderButton.classList.add('gym-leader-button');
        leaderButton.textContent = leader.name.toUpperCase();
        leaderButton.dataset.leaderKey = key;
        leaderButton.addEventListener('click', () => showGymLeaderDetailScreen(key));
        gymLeaderGridEl.appendChild(leaderButton);
    });
    switchScreen('gymLeaderSelect');
}

function showGymLeaderDetailScreen(leaderKey) {
    const leader = gymLeadersData[leaderKey];
    if (!leader) {
        alert("Gym Leader not found!");
        switchScreen('gymLeaderSelect');
        return;
    }
    gymLeaderDetailNameEl.textContent = leader.name.toUpperCase();
    gymLeaderCardImageEl.src = leader.cardUrl;
    gymLeaderCardImageEl.alt = leader.name + " Card";
    gymLeaderDialogEl.textContent = leader.dialog || `Prepare to battle ${leader.name.toUpperCase()}!`;

    btnStartGymBattle.onclick = () => {
        battleState.currentGymLeaderKey = leaderKey;
        battleState.isEliteFourBattle = false;
        prepareBattle(startGymBattleActual, false, false);
    };
    switchScreen('gymLeaderDetail');
}

function showEliteFourSelectScreen() {
    eliteFourGridEl.innerHTML = '';
    Object.keys(eliteFourData).forEach(key => {
        const member = eliteFourData[key];
        const memberButton = document.createElement('button');
        memberButton.classList.add('elite-four-button');
        memberButton.textContent = member.name.toUpperCase();
        memberButton.dataset.memberKey = key;
        memberButton.addEventListener('click', () => showEliteFourDetailScreen(key));
        eliteFourGridEl.appendChild(memberButton);
    });
    switchScreen('eliteFourSelect');
}

function showEliteFourDetailScreen(memberKey) {
    const member = eliteFourData[memberKey];
    if (!member) {
        alert("Elite Four Member not found!");
        switchScreen('eliteFourSelect');
        return;
    }
    eliteFourDetailNameEl.textContent = `ELITE FOUR ${member.name.toUpperCase()}`;
    eliteFourCardImageEl.src = member.cardUrl;
    eliteFourCardImageEl.alt = member.name + " Card";
    eliteFourDialogEl.textContent = member.dialog || `Prepare to face Elite Four ${member.name.toUpperCase()}!`;

    btnStartEliteFourBattle.onclick = () => {
        battleState.currentEliteFourMemberKey = memberKey;
        battleState.isEliteFourBattle = true;
        prepareBattle(startEliteFourBattleActual, true, false); // isEliteFour = true
    };
    switchScreen('eliteFourDetail');
}

function showMyCardsScreen() {
    if (!selectedTrainerData) {
        alert("No trainer data found.");
        switchScreen('mainMenu');
        return;
    }

    displayedCardCollection = [];
    (selectedTrainerData.defeatedGymLeaders || []).forEach(leaderKey => {
        const leaderData = gymLeadersData[leaderKey];
        if (leaderData && leaderData.cardUrl) {
            displayedCardCollection.push({ name: leaderData.name, url: leaderData.cardUrl, type: 'Trainer' });
        }
    });
    (selectedTrainerData.defeatedEliteFourMembers || []).forEach(memberKey => {
        const memberData = eliteFourData[memberKey];
        if (memberData && memberData.cardUrl) {
            displayedCardCollection.push({ name: memberData.name, url: memberData.cardUrl, type: 'Trainer' });
        }
    });
    // League trainer kaarten, indien verslagen en gedefinieerd.
    // (Aanname: je houdt geen aparte lijst bij van 'defeatedPokemonLeagueTrainers')
    if (selectedTrainerData.defeatedPokemonLeague) {
        pokemonLeagueTrainers.forEach(leagueTrainer => {
             if (leagueTrainer.cardUrl) { // Toon alle League trainer kaarten als de League is verslagen
                displayedCardCollection.push({ name: leagueTrainer.name, url: leagueTrainer.cardUrl, type: 'League Trainer'});
             }
        });
    }


    currentCardIndex = 0;
    updateDisplayedCard();

    if (noCollectedCardsMsgEl) {
        noCollectedCardsMsgEl.style.display = displayedCardCollection.length === 0 ? 'block' : 'none';
    }
    const cardViewerControls = document.querySelector('#myCardsScreen .card-viewer-controls');
    if (cardViewerControls) {
        cardViewerControls.style.display = displayedCardCollection.length > 0 ? 'flex' : 'none';
    }

    switchScreen('myCards');
}

function updateDisplayedCard() {
    const cardViewerControls = document.querySelector('#myCardsScreen .card-viewer-controls');
    if (displayedCardCollection.length === 0) {
        if (displayedCardImageEl) {
            displayedCardImageEl.src = "";
            displayedCardImageEl.alt = "No cards collected";
        }
        if(prevCardButton) prevCardButton.disabled = true;
        if(nextCardButton) nextCardButton.disabled = true;
        if(cardViewerControls) cardViewerControls.style.display = 'none';
        if(noCollectedCardsMsgEl) noCollectedCardsMsgEl.style.display = 'block';
        return;
    }

    if(cardViewerControls) cardViewerControls.style.display = 'flex';
    if(noCollectedCardsMsgEl) noCollectedCardsMsgEl.style.display = 'none';

    const card = displayedCardCollection[currentCardIndex];
    if(displayedCardImageEl) {
        displayedCardImageEl.src = card.url;
        displayedCardImageEl.alt = `${card.name} Card`;
    }
    if(prevCardButton) prevCardButton.disabled = currentCardIndex === 0;
    if(nextCardButton) nextCardButton.disabled = currentCardIndex >= displayedCardCollection.length - 1;
}

function showTcgCardsScreen() {
    if (!selectedTrainerData) {
        alert("No trainer data found.");
        switchScreen('mainMenu');
        return;
    }
    populateTcgSetFilter();
    currentTcgPage = 1;
    filterAndDisplayTcgCards();
    switchScreen('tcgCards');
}

function populateTcgSetFilter() {
    tcgSetFilterEl.innerHTML = '<option value="all">All Sets</option>';
    const sets = new Set();
    (selectedTrainerData.collectedTcgCards || []).forEach(card => {
        if (card.tcgSet) sets.add(card.tcgSet);
    });
    const sortedSets = Array.from(sets).sort();
    sortedSets.forEach(set => {
        const option = document.createElement('option');
        option.value = set;
        option.textContent = set;
        tcgSetFilterEl.appendChild(option);
    });
}

function filterAndDisplayTcgCards() {
    const filterValue = tcgSetFilterEl.value;
    const allTcgCards = selectedTrainerData.collectedTcgCards || [];

    if (filterValue === "all") {
        currentFilteredTcgCards = [...allTcgCards];
    } else {
        currentFilteredTcgCards = allTcgCards.filter(card => card.tcgSet === filterValue);
    }
    currentTcgPage = 1; // Reset naar eerste pagina na filteren
    renderTcgCardsPage();
    updateTcgPagination();
}

function renderTcgCardsPage() {
    tcgCardsGridEl.innerHTML = '';
    const startIndex = (currentTcgPage - 1) * TCG_CARDS_PER_PAGE;
    const endIndex = startIndex + TCG_CARDS_PER_PAGE;
    const pageCards = currentFilteredTcgCards.slice(startIndex, endIndex);

    if (currentFilteredTcgCards.length === 0) {
        if (noTcgCardsMsgEl) {
            noTcgCardsMsgEl.textContent = "No TCG cards match the filter or your collection is empty.";
            noTcgCardsMsgEl.style.display = 'block';
        }
    } else {
        if (noTcgCardsMsgEl) noTcgCardsMsgEl.style.display = 'none';
        pageCards.forEach(tcgCard => {
            const cardItem = document.createElement('div');
            cardItem.classList.add('collected-card-item');
            cardItem.addEventListener('click', () => showTcgCardModal(tcgCard.spriteUrl, tcgCard.tcgCardName));

            const cardImg = document.createElement('img');
            cardImg.src = tcgCard.spriteUrl;
            cardImg.alt = (tcgCard.tcgCardName || tcgCard.pokemonGameName) + " TCG Card";
            cardItem.appendChild(cardImg);

            const nameP = document.createElement('p');
            nameP.textContent = (tcgCard.tcgCardName || tcgCard.pokemonGameName || "Unknown Card").toUpperCase();
            nameP.style.textAlign = 'center';
            nameP.style.fontSize = '0.8em';
            cardItem.appendChild(nameP);

            tcgCardsGridEl.appendChild(cardItem);
        });
    }
    const totalPages = Math.max(1, Math.ceil(currentFilteredTcgCards.length / TCG_CARDS_PER_PAGE));
    if (tcgPageIndicatorEl) tcgPageIndicatorEl.textContent = `Page ${currentTcgPage} / ${totalPages}`;
}

function updateTcgPagination() {
    const totalPages = Math.max(1, Math.ceil(currentFilteredTcgCards.length / TCG_CARDS_PER_PAGE));
    if(tcgPrevPageButton) tcgPrevPageButton.disabled = currentTcgPage <= 1;
    if(tcgNextPageButton) tcgNextPageButton.disabled = currentTcgPage >= totalPages;
}

function showTcgCardModal(imageUrl, cardName) {
    modalTcgCardImageEl.src = imageUrl;
    modalTcgCardImageEl.alt = cardName + " - Enlarged";
    screens.tcgCardModal.style.display = 'flex';
}


function showStarterSelectScreen() {
    startersGridEl.innerHTML = '';
    const starterPokedexIds = [1, 4, 7, 152, 155, 158,252,255,258]; // Voorbeeld starters
    starterPokedexIds.forEach(pokedexId => {
        const pokemonData = pokemonPool.find(p => p.pokedexId === pokedexId);
        if (pokemonData) {
            const card = document.createElement('div');
            card.classList.add('starter-card');
            card.dataset.starterId = pokedexId;

            const img = document.createElement('img');
            img.src = pokemonData.spriteFront;
            img.alt = pokemonData.name.toUpperCase();
            card.appendChild(img);

            const nameP = document.createElement('p');
            nameP.textContent = pokemonData.name.toUpperCase();
            card.appendChild(nameP);

            card.addEventListener('click', () => {
                tempSelectedStarter = pokemonData;
                chosenStarterNameDialogSpan.textContent = pokemonData.name.toUpperCase();
                screens.confirmStarterDialog.style.display = 'flex';
            });
            startersGridEl.appendChild(card);
        }
    });
    switchScreen('starterSelect');
}


function saveGame() {
    if (selectedTrainerData) {
        localStorage.setItem(SAVE_KEY, JSON.stringify(selectedTrainerData));
        console.log("Game Saved!");
        if (currentScreen === 'optionsMenu') { // Alleen alert als handmatig via options menu
            alert("Game progress has been saved!");
        }
    } else {
        console.warn("No trainer selected to save!");
    }
}
function loadGame() {
    const sd = localStorage.getItem(SAVE_KEY);
    if (sd) {
        try {
            const loadedData = JSON.parse(sd);
            selectedTrainerData = loadedData; // Wijs direct toe

            // Initialiseer ontbrekende velden indien nodig
            selectedTrainerData.coins = selectedTrainerData.coins || 0;
            selectedTrainerData.inventory = selectedTrainerData.inventory || { "Poke Ball": 5, "Great Ball": 0, "Ultra Ball": 0, "Evolution Stone": 1, "Perma Evolution Stone": 0, "TCG Pack": 0 };
            const defaultItems = { "Poke Ball": 0, "Great Ball": 0, "Ultra Ball": 0, "Evolution Stone": 0, "Perma Evolution Stone": 0, "TCG Pack": 0 };
            for (const item in defaultItems) {
                if (typeof selectedTrainerData.inventory[item] === 'undefined') {
                    selectedTrainerData.inventory[item] = defaultItems[item];
                }
            }
            selectedTrainerData.team = selectedTrainerData.team || [];
            selectedTrainerData.pcBox = selectedTrainerData.pcBox || [];
            selectedTrainerData.defeatedGymLeaders = selectedTrainerData.defeatedGymLeaders || [];
            selectedTrainerData.defeatedEliteFourMembers = selectedTrainerData.defeatedEliteFourMembers || [];
            selectedTrainerData.collectedTcgCards = (selectedTrainerData.collectedTcgCards || []).map(c => ({ ...c, tcgSet: c.tcgSet || "Unknown Set" }));
            selectedTrainerData.hasChosenStarter = typeof selectedTrainerData.hasChosenStarter !== 'undefined' ? selectedTrainerData.hasChosenStarter : false; // Kan false zijn als nog geen starter gekozen

            // Pokémon League Progress
            selectedTrainerData.currentLeagueOpponentIndex = selectedTrainerData.currentLeagueOpponentIndex || 0;
            selectedTrainerData.leagueBattlesWon = selectedTrainerData.leagueBattlesWon || 0;
            selectedTrainerData.defeatedPokemonLeague = selectedTrainerData.defeatedPokemonLeague || false;


            selectedTrainerData.team = restoreFullPokemonList(selectedTrainerData.team, false);
            selectedTrainerData.pcBox = restoreFullPokemonList(selectedTrainerData.pcBox, false);

            if (chosenTrainerImageMainMenu && selectedTrainerData.imageUrl) {
                chosenTrainerImageMainMenu.src = selectedTrainerData.imageUrl;
                chosenTrainerImageMainMenu.alt = selectedTrainerData.name;
            }
            updateCoinDisplay();
            const dm = localStorage.getItem('blazingThunder_darkMode');
            if (dm === 'true') gameBody.classList.add('dark-mode');
            console.log("Game Loaded");
            return true;
        } catch (e) {
            console.error('Load error:', e);
            localStorage.removeItem(SAVE_KEY); // Verwijder corrupte save
            selectedTrainerData = null; // Reset selectedTrainerData
            return false;
        }
    }
    selectedTrainerData = null; // Geen save data, reset
    return false;
}
function performResetGame() {
    localStorage.removeItem(SAVE_KEY);
    localStorage.removeItem('blazingThunder_darkMode');
    selectedTrainerData = null;
    tempSelectedStarter = null;
    isNewGameSetup = false;
    gameBody.classList.remove('dark-mode');
    if(playerCoinsDisplayMainMenuEl) playerCoinsDisplayMainMenuEl.textContent = "Coins: 0";
    if(marketCoinDisplayEl) marketCoinDisplayEl.textContent = "Coins: 0";
    generatedPasswordArea.value = "";
    inputPasswordArea.value = "";
    currentLeagueOrder = []; // Reset league order
    battleState.currentLeagueOpponentIndex = 0;
    battleState.leagueBattlesWon = 0;
    stopBattleMusic(); // Stop eventuele muziek
    alert("Game Reset! Select a new trainer.");
    screens.resetConfirmDialog.style.display = 'none';
    switchScreen('intro');
}

document.addEventListener('DOMContentLoaded', () => {
    const cyEl = document.getElementById('currentYear'); if (cyEl) cyEl.textContent = new Date().getFullYear();
    const gsBtn = document.getElementById('gameStartButton');
    function setupEvtLstnrs() {
        const hS = (e) => { e.preventDefault(); if (loadGame() && selectedTrainerData.hasChosenStarter) { switchScreen('mainMenu'); } else { isNewGameSetup = true; switchScreen('characterSelect'); } };
        if (gsBtn) { gsBtn.addEventListener('click', hS); gsBtn.addEventListener('touchend', hS, {passive: false}); } else console.error("gsBtn not found!");

        trainerCards.forEach(c => { c.addEventListener('click', () => { const tn = c.dataset.trainer; selectedTrainerData = JSON.parse(JSON.stringify(trainersData[tn])); chosenTrainerNameSpan.textContent = selectedTrainerData.name; screens.confirmDialog.style.display = 'flex'; }); });

        if(confirmYesButton) confirmYesButton.addEventListener('click', () => {
            if (selectedTrainerData) {
                selectedTrainerData.coins = 0;
                selectedTrainerData.inventory = { "Poke Ball": 5, "Great Ball": 0, "Ultra Ball": 0, "Evolution Stone": 1, "Perma Evolution Stone": 0, "TCG Pack": 0 };
                selectedTrainerData.team = [];
                selectedTrainerData.pcBox = [];
                selectedTrainerData.defeatedGymLeaders = [];
                selectedTrainerData.defeatedEliteFourMembers = [];
                selectedTrainerData.collectedTcgCards = [];
                selectedTrainerData.hasChosenStarter = false;
                // Pokémon League Progress reset
                selectedTrainerData.currentLeagueOpponentIndex = 0;
                selectedTrainerData.leagueBattlesWon = 0;
                selectedTrainerData.defeatedPokemonLeague = false;
                currentLeagueOrder = []; // Reset league order for new game

                if (isNewGameSetup) {
                    showStarterSelectScreen();
                } else { // Dit pad zou minder vaak moeten voorkomen als 'isNewGameSetup' correct wordt beheerd
                    saveGame();
                    switchScreen('mainMenu');
                }
            } else switchScreen('characterSelect');
            screens.confirmDialog.style.display = 'none';
        });
        if(confirmNoButton) confirmNoButton.addEventListener('click', () => { selectedTrainerData = null; screens.confirmDialog.style.display = 'none'; switchScreen('characterSelect'); });

        if(confirmStarterYesButton) confirmStarterYesButton.addEventListener('click', () => {
            if (selectedTrainerData && tempSelectedStarter) {
                selectedTrainerData.team.push(createPokemonFromData(tempSelectedStarter, false, true));
                selectedTrainerData.hasChosenStarter = true;
                tempSelectedStarter = null;
                isNewGameSetup = false; // Setup is voltooid

                if (chosenTrainerImageMainMenu && selectedTrainerData.imageUrl) {
                    chosenTrainerImageMainMenu.src = selectedTrainerData.imageUrl;
                    chosenTrainerImageMainMenu.alt = selectedTrainerData.name;
                }
                updateCoinDisplay();
                saveGame(); // Sla direct op na starterkeuze
                screens.confirmStarterDialog.style.display = 'none';
                switchScreen('mainMenu');
            } else {
                screens.confirmStarterDialog.style.display = 'none';
                switchScreen('starterSelect');
            }
        });
        if(confirmStarterNoButton) confirmStarterNoButton.addEventListener('click', () => { tempSelectedStarter = null; screens.confirmStarterDialog.style.display = 'none'; switchScreen('starterSelect'); });


        if(btnPlay) btnPlay.addEventListener('click', () => switchScreen('playMenu'));
        if(btnQuickBattlePlay) btnQuickBattlePlay.addEventListener('click', () => prepareBattle(startQuickBattle, false, false));
        if(btnWildModePlay) btnWildModePlay.addEventListener('click', () => prepareBattle(startWildBattleActual, false, false));
        if(btnGymBattlePlay) btnGymBattlePlay.addEventListener('click', showGymLeaderSelectScreen);
        if(btnEliteBattlesPlay) btnEliteBattlesPlay.addEventListener('click', showEliteFourSelectScreen);
        if(btnPokemonLeaguePlay) btnPokemonLeaguePlay.addEventListener('click', () => prepareBattle(showPokemonLeagueScreen, false, true)); // isLeague = true
        if(btnBackToMainFromPlay) btnBackToMainFromPlay.addEventListener('click', () => switchScreen('mainMenu'));

        if(btnOptions) btnOptions.addEventListener('click', () => switchScreen('optionsMenu'));
        if(tabMyCards) tabMyCards.addEventListener('click', showMyCardsScreen);
        if(tabTcgCards) tabTcgCards.addEventListener('click', showTcgCardsScreen);
        if(tabTeam) tabTeam.addEventListener('click', showTeamScreen);
        if(tabMyPc) tabMyPc.addEventListener('click', showPcBoxScreen);
        if(tabPassword) tabPassword.addEventListener('click', () => {
            generatedPasswordArea.value = ""; // Leegmaken bij openen
            inputPasswordArea.value = "";
            switchScreen('password');
        });
        if(tabMarket) tabMarket.addEventListener('click', showMarketScreen);
        if(tabInventory) tabInventory.addEventListener('click', showInventoryScreen);
        if(marketItemsGridEl) { marketItemsGridEl.addEventListener('click', (e) => { const buyButton = e.target.closest('.buy-button'); if (buyButton) { const itemName = buyButton.dataset.itemName; const price = buyButton.dataset.price; buyItem(itemName, price); } }); }
        if(btnBackToMainFromMarket) btnBackToMainFromMarket.addEventListener('click', () => switchScreen('mainMenu'));
        if(btnBackToMainFromInventory) btnBackToMainFromInventory.addEventListener('click', () => switchScreen('mainMenu'));
        if(btnBackToMainFromTeam) btnBackToMainFromTeam.addEventListener('click', () => switchScreen('mainMenu'));
        if(btnBackToMainFromPcBox) btnBackToMainFromPcBox.addEventListener('click', () => switchScreen('mainMenu'));
        if(btnBackToMainFromTcgCards) btnBackToMainFromTcgCards.addEventListener('click', () => switchScreen('mainMenu'));
        if(btnSaveGameOpt) btnSaveGameOpt.addEventListener('click', saveGame); // Save knop roept nu saveGame() aan

        if(btnResetGameOpt) btnResetGameOpt.addEventListener('click', () => {
            screens.resetConfirmDialog.style.display = 'flex';
        });
        if(resetConfirmYesButton) resetConfirmYesButton.addEventListener('click', () => {
            performResetGame();
        });

        if(btnDarkModeOpt) btnDarkModeOpt.addEventListener('click', () => { gameBody.classList.toggle('dark-mode'); localStorage.setItem('blazingThunder_darkMode', gameBody.classList.contains('dark-mode')); });
        if(btnBackToMainOpts) btnBackToMainOpts.addEventListener('click', () => switchScreen('mainMenu'));
        if(resetConfirmNoButton) resetConfirmNoButton.addEventListener('click', () => {screens.resetConfirmDialog.style.display = 'none'; switchScreen('optionsMenu');});

        if(btnGeneratePassword) btnGeneratePassword.addEventListener('click', generatePassword);
        if(btnLoadFromPassword) btnLoadFromPassword.addEventListener('click', loadFromPassword);
        if(btnBackToMainFromPassword) btnBackToMainFromPassword.addEventListener('click', () => switchScreen('mainMenu'));


        if(btnBackToPlayMenuFromGymSelect) btnBackToPlayMenuFromGymSelect.addEventListener('click', () => switchScreen('playMenu'));
        if(btnBackToGymSelectFromDetail) btnBackToGymSelectFromDetail.addEventListener('click', showGymLeaderSelectScreen);

        if(btnBackToPlayMenuFromEliteFourSelect) btnBackToPlayMenuFromEliteFourSelect.addEventListener('click', () => switchScreen('playMenu'));
        if(btnBackToEliteFourSelectFromDetail) btnBackToEliteFourSelectFromDetail.addEventListener('click', showEliteFourSelectScreen);

        if(btnStartLeagueBattle) btnStartLeagueBattle.addEventListener('click', () => prepareBattle(startNextLeagueBattle, false, true)); // isLeague = true
        if(btnBackToPlayMenuFromLeague) btnBackToPlayMenuFromLeague.addEventListener('click', () => switchScreen('mainMenu'));


        if(prevCardButton) prevCardButton.addEventListener('click', () => {
            if (currentCardIndex > 0) {
                currentCardIndex--;
                updateDisplayedCard();
            }
        });
        if(nextCardButton) nextCardButton.addEventListener('click', () => {
            if (currentCardIndex < displayedCardCollection.length - 1) {
                currentCardIndex++;
                updateDisplayedCard();
            }
        });
        if(btnBackToMainFromMyCards) btnBackToMainFromMyCards.addEventListener('click', () => switchScreen('mainMenu'));


        if(tcgSetFilterEl) tcgSetFilterEl.addEventListener('change', filterAndDisplayTcgCards);
        if(tcgPrevPageButton) tcgPrevPageButton.addEventListener('click', () => {
            if (currentTcgPage > 1) {
                currentTcgPage--;
                renderTcgCardsPage();
                updateTcgPagination();
            }
        });
        if(tcgNextPageButton) tcgNextPageButton.addEventListener('click', () => {
            const totalPages = Math.max(1, Math.ceil(currentFilteredTcgCards.length / TCG_CARDS_PER_PAGE));
            if (currentTcgPage < totalPages) {
                currentTcgPage++;
                renderTcgCardsPage();
                updateTcgPagination();
            }
        });
        if(closeTcgCardModalButton) closeTcgCardModalButton.addEventListener('click', () => {
            screens.tcgCardModal.style.display = 'none';
        });

        // TCG Pack Opening Navigatie
        if(prevRevealedTcgCardButton) {
            prevRevealedTcgCardButton.addEventListener('click', () => {
                if (currentRevealedTcgCardIndex > 0) {
                    currentRevealedTcgCardIndex--;
                    displayRevealedTcgCard();
                }
            });
        }
        if(nextRevealedTcgCardButton) {
            nextRevealedTcgCardButton.addEventListener('click', () => {
                if (currentRevealedTcgCardIndex < revealedTcgCards.length - 1) {
                    currentRevealedTcgCardIndex++;
                    displayRevealedTcgCard();
                }
            });
        }
        if(closeTcgRevealButton) closeTcgRevealButton.addEventListener('click', () => { screens.tcgPackOpeningOverlay.style.display = 'none'; });


        if(actionMenuEl) actionMenuEl.addEventListener('click', (e) => {
            if (!battleState.playerTurn || battleState.isProcessingMessage) return;
            const buttonTarget = e.target.closest('button');
            if (buttonTarget && buttonTarget.parentElement === actionMenuEl) {
                const act = buttonTarget.dataset.action;
                actionMenuEl.style.display='none';
                switch(act){
                    case 'fight': showMoveMenu(); break;
                    case 'item': showItemMenu(); break;
                    case 'pokemon': showSwitchScreen(false); break;
                    case 'run':
                        if (battleState.isWildBattle) {
                            stopBattleMusic();
                            typeMessage("Got away safely!", () => {
                                finalizeBattleState();
                                battleState.isWildBattle = false;
                                battleState.playerTeam = []; battleState.opponentTeam = [];
                                // Reset alle battle-specifieke state
                                screens.battle.style.backgroundImage = "url('https://pokemonrevolution.net/forum/uploads/monthly_2021_03/DVMT-6OXcAE2rZY.jpg.afab972f972bd7fbd4253bc7aa1cf27f.jpg')";
                                switchScreen('mainMenu');
                            });
                        } else if (battleState.isGymBattle || battleState.isEliteFourBattle || battleState.isPokemonLeagueBattle) {
                             typeMessage("You can't run from this important battle!", playerActionPhase);
                        } else { // Quick Battle forfeit
                            stopBattleMusic();
                            typeMessage("You chose to forfeit the Quick Battle.", () => {
                                finalizeBattleState();
                                selectedTrainerData.coins = Math.max(0, (selectedTrainerData.coins || 0) - 2); // Kleine penalty
                                updateCoinDisplay();
                                saveGame();
                                battleState.isWildBattle = false; battleState.isGymBattle = false; battleState.isEliteFourBattle = false; battleState.isPokemonLeagueBattle = false;
                                battleState.playerTeam = []; battleState.opponentTeam = [];
                                screens.battle.style.backgroundImage = "url('https://pokemonrevolution.net/forum/uploads/monthly_2021_03/DVMT-6OXcAE2rZY.jpg.afab972f972bd7fbd4253bc7aa1cf27f.jpg')";
                                switchScreen('mainMenu');
                            });
                        }
                        break;
                }
            }
        });

        if(itemMenuEl) itemMenuEl.addEventListener('click', (e) => {
            if (!battleState.playerTurn || battleState.isProcessingMessage) return;
            const btn = e.target.closest('button');
            if (btn && btn.parentElement === itemMenuEl) {
                const itemName = btn.dataset.itemName;
                const action = btn.dataset.action;

                itemMenuEl.style.display = 'none';

                if (action === 'back-to-actions') {
                    playerActionPhase();
                    return;
                }

                if (itemName === "Evolution Stone" || itemName === "Perma Evolution Stone") {
                    useEvolutionItem(itemName);
                } else if (itemName === "Poke Ball" || itemName === "Great Ball" || itemName === "Ultra Ball") {
                    if (battleState.isWildBattle) {
                        throwPokeball(itemName);
                    } else {
                        typeMessage("Can only use Poke Balls in wild battles!", playerActionPhase);
                    }
                }
            }
        });

        if(moveMenuEl) {
            moveMenuEl.addEventListener('click', (e) => {
                if (!battleState.playerTurn || battleState.isProcessingMessage) return;
                const btn = e.target.closest('button');
                if (btn && btn.parentElement === moveMenuEl && !btn.disabled && !btn.classList.contains('battle-menu-back-button')) {
                    const mIdx = parseInt(btn.dataset.moveIndex);
                    playerAttack(mIdx);
                }
            });
        }
        if(btnBackFromMoves) {
            btnBackFromMoves.addEventListener('click', () => {
                if (currentScreen === 'battle' && !battleState.isProcessingMessage && battleState.playerTurn) {
                    moveMenuEl.style.display = 'none';
                    playerActionPhase();
                }
            });
        }

        if(switchCancelButton) switchCancelButton.addEventListener('click', () => { if (currentScreen === 'switchPokemon' && !battleState.switchingAfterFaint) { switchScreen('battle'); playerActionPhase(); }});


        if(pcPrevButton) {
            pcPrevButton.addEventListener('click', () => {
                if (currentPcPage > 1) {
                    currentPcPage--;
                    renderCurrentPcPage();
                    updatePcPaginationButtons();
                }
            });
        }
        if(pcNextButton) {
            pcNextButton.addEventListener('click', () => {
                const totalPages = Math.max(1, Math.ceil((selectedTrainerData.pcBox || []).length / POKEMON_PER_PC_PAGE));
                if (currentPcPage < totalPages) {
                    currentPcPage++;
                    renderCurrentPcPage();
                    updatePcPaginationButtons();
                }
            });
        }

    } // End of setupEvtLstnrs

    setupEvtLstnrs();
    if (loadGame()) { // Probeer eerst te laden
        if (selectedTrainerData.hasChosenStarter) {
            switchScreen('mainMenu');
        } else { // Geladen, maar geen starter -> ga naar starterkeuze
            isNewGameSetup = true; // Technically, setup is still in progress
             showStarterSelectScreen();
        }
    } else { // Geen save data gevonden of laadfout -> start nieuw spel flow
        isNewGameSetup = true;
         switchScreen('intro');
    }
    updateCoinDisplay();
    // Zorg dat intro scherm getoond wordt als er geen save is of de huidige screen niet correct is.
    if (currentScreen === 'intro' && !isNewGameSetup && !localStorage.getItem(SAVE_KEY)) { // Dubbelcheck
        screens.intro.style.display = 'flex';
    }
});