/* ============================================================================
 * Munch Quest — Engine
 * Pure game logic. No DOM, no storage, no randomness. Same code runs in the
 * browser (window.MunchEngine) and in Node (module.exports), so the app ships
 * the exact engine the tests verify — 1:1.
 *
 * Core ideas, straight from how kids actually get braver with food:
 *   - Tasting ladder: look -> smell -> lick -> taste. One brave rung at a time.
 *   - Eat the rainbow: a plate is "balanced" when it spans groups + colors.
 *   - Reward the TRY, not the clean plate. Every rung earns points.
 * ==========================================================================*/
(function (root, factory) {
  var api = factory();
  if (typeof module === 'object' && module.exports) module.exports = api; // Node
  root.MunchEngine = api;                                                 // Browser
})(typeof self !== 'undefined' ? self : this, function () {
  'use strict';

  /* ---- Rainbow + food groups ------------------------------------------- */
  var RAINBOW = ['red', 'orange', 'yellow', 'green', 'blue', 'purple', 'white'];
  var GROUPS  = ['veg', 'fruit', 'protein', 'grain', 'dairy'];

  /* ---- Food catalog ----------------------------------------------------- */
  var FOODS = [
    { id: 'strawberry',  name: 'Strawberry',   emoji: '🍓', color: 'red',    group: 'fruit'   },
    { id: 'tomato',      name: 'Tomato',       emoji: '🍅', color: 'red',    group: 'veg'     },
    { id: 'watermelon',  name: 'Watermelon',   emoji: '🍉', color: 'red',    group: 'fruit'   },
    { id: 'apple',       name: 'Apple',        emoji: '🍎', color: 'red',    group: 'fruit'   },
    { id: 'carrot',      name: 'Carrot',       emoji: '🥕', color: 'orange', group: 'veg'     },
    { id: 'orange',      name: 'Orange',       emoji: '🍊', color: 'orange', group: 'fruit'   },
    { id: 'sweetpotato', name: 'Sweet Potato', emoji: '🍠', color: 'orange', group: 'veg'     },
    { id: 'mango',       name: 'Mango',        emoji: '🥭', color: 'orange', group: 'fruit'   },
    { id: 'banana',      name: 'Banana',       emoji: '🍌', color: 'yellow', group: 'fruit'   },
    { id: 'corn',        name: 'Corn',         emoji: '🌽', color: 'yellow', group: 'veg'     },
    { id: 'cheese',      name: 'Cheese',       emoji: '🧀', color: 'yellow', group: 'dairy'   },
    { id: 'lemon',       name: 'Lemon',        emoji: '🍋', color: 'yellow', group: 'fruit'   },
    { id: 'broccoli',    name: 'Broccoli',     emoji: '🥦', color: 'green',  group: 'veg'     },
    { id: 'avocado',     name: 'Avocado',      emoji: '🥑', color: 'green',  group: 'veg'     },
    { id: 'cucumber',    name: 'Cucumber',     emoji: '🥒', color: 'green',  group: 'veg'     },
    { id: 'kiwi',        name: 'Kiwi',         emoji: '🥝', color: 'green',  group: 'fruit'   },
    { id: 'pear',        name: 'Pear',         emoji: '🍐', color: 'green',  group: 'fruit'   },
    { id: 'peas',        name: 'Peas',         emoji: '🫛', color: 'green',  group: 'veg'     },
    { id: 'grapes',      name: 'Grapes',       emoji: '🍇', color: 'purple', group: 'fruit'   },
    { id: 'eggplant',    name: 'Eggplant',     emoji: '🍆', color: 'purple', group: 'veg'     },
    { id: 'plum',        name: 'Plum',         emoji: '🟣', color: 'purple', group: 'fruit'   },
    { id: 'blueberry',   name: 'Blueberry',    emoji: '🫐', color: 'blue',   group: 'fruit'   },
    { id: 'egg',         name: 'Egg',          emoji: '🥚', color: 'white',  group: 'protein' },
    { id: 'chicken',     name: 'Chicken',      emoji: '🍗', color: 'white',  group: 'protein' },
    { id: 'fish',        name: 'Fish',         emoji: '🐟', color: 'blue',   group: 'protein' },
    { id: 'beans',       name: 'Beans',        emoji: '🫘', color: 'white',  group: 'protein' },
    { id: 'milk',        name: 'Milk',         emoji: '🥛', color: 'white',  group: 'dairy'   },
    { id: 'yogurt',      name: 'Yogurt',       emoji: '🥣', color: 'white',  group: 'dairy'   },
    { id: 'rice',        name: 'Rice',         emoji: '🍚', color: 'white',  group: 'grain'   },
    { id: 'bread',       name: 'Bread',        emoji: '🍞', color: 'white',  group: 'grain'   }
  ];

  var FOOD_BY_ID = {};
  FOODS.forEach(function (f) { FOOD_BY_ID[f.id] = f; });

  function getFood(id) { return FOOD_BY_ID[id] || null; }

  /* ---- Tasting ladder --------------------------------------------------- */
  // One brave rung at a time. Reaching the top rung (taste) conquers the food.
  var LADDER = ['look', 'smell', 'lick', 'taste'];
  var LADDER_MAX = LADDER.length;            // 4
  var POINTS_PER_RUNG = 10;
  var CONQUER_BONUS   = 25;                  // bonus when a food hits 'taste'

  function ladderName(level) {               // 1->'look' ... 4->'taste'
    if (level < 1) return 'new';
    if (level > LADDER_MAX) return LADDER[LADDER_MAX - 1];
    return LADDER[level - 1];
  }
  function ladderIndex(name) { return LADDER.indexOf(name) + 1; } // 'look'->1, miss->0

  /* ---- Levels ----------------------------------------------------------- */
  var LEVELS = [
    { level: 1, title: 'Rookie Taster', at: 0 },
    { level: 2, title: 'Snack Scout',   at: 100 },
    { level: 3, title: 'Flavor Hunter', at: 250 },
    { level: 4, title: 'Plate Builder', at: 450 },
    { level: 5, title: 'Rainbow Ranger', at: 700 },
    { level: 6, title: 'Taste Boss',    at: 1000 },
    { level: 7, title: 'Munch Master',  at: 1400 }
  ];

  function levelFor(points) {
    if (typeof points !== 'number' || points < 0) points = 0;
    var cur = LEVELS[0];
    for (var i = 0; i < LEVELS.length; i++) {
      if (points >= LEVELS[i].at) cur = LEVELS[i];
    }
    var next = LEVELS[cur.level] || null;    // level N lives at index N-1, next at N
    return {
      level: cur.level,
      title: cur.title,
      floor: cur.at,
      next: next ? next.at : null,
      isMax: !next,
      intoLevel: points - cur.at,
      toNext: next ? next.at - points : 0
    };
  }

  /* ---- Balance rule ----------------------------------------------------- */
  // A plate is balanced when it covers the three building-block groups
  // (veg + fruit + protein) AND spans at least 3 rainbow colors.
  var MIN_COLORS = 3;
  var REQUIRED_GROUPS = ['veg', 'fruit', 'protein'];
  var BALANCE_BONUS = 50;

  function plateColors(foodIds) {
    var seen = {};
    (foodIds || []).forEach(function (id) {
      var f = getFood(id); if (f) seen[f.color] = true;
    });
    return Object.keys(seen);
  }
  function plateGroups(foodIds) {
    var seen = {};
    (foodIds || []).forEach(function (id) {
      var f = getFood(id); if (f) seen[f.group] = true;
    });
    return Object.keys(seen);
  }
  function missingForBalance(foodIds) {
    var groups = plateGroups(foodIds);
    var miss = REQUIRED_GROUPS.filter(function (g) { return groups.indexOf(g) === -1; });
    var colorGap = Math.max(0, MIN_COLORS - plateColors(foodIds).length);
    return { groups: miss, colorsShort: colorGap };
  }
  function isBalancedPlate(foodIds) {
    var m = missingForBalance(foodIds);
    return m.groups.length === 0 && m.colorsShort === 0;
  }
  function scorePlate(foodIds) {
    var balanced = isBalancedPlate(foodIds);
    var colors = plateColors(foodIds).length;
    // base: 5 per distinct color (eat-the-rainbow), +balance bonus if balanced.
    var points = colors * 5 + (balanced ? BALANCE_BONUS : 0);
    return { balanced: balanced, colors: colors, points: points, missing: missingForBalance(foodIds) };
  }

  /* ---- Streaks ---------------------------------------------------------- */
  // dayNumber = integer day index (e.g. floor(epochMs / 86400000)).
  function nextStreak(prevStreak, lastDay, today) {
    prevStreak = prevStreak || 0;
    if (lastDay == null) return 1;            // first ever active day
    if (today === lastDay) return prevStreak || 1; // already counted today
    if (today === lastDay + 1) return prevStreak + 1; // consecutive
    return 1;                                  // gap -> reset
  }

  /* ---- Badges ----------------------------------------------------------- */
  var BADGES = [
    { id: 'first_bite',  name: 'First Brave Bite', emoji: '🌟',
      test: function (s) { return s.conquered.length >= 1; } },
    { id: 'five_foods',  name: 'High Five',        emoji: '🖐️',
      test: function (s) { return s.conquered.length >= 5; } },
    { id: 'ten_foods',   name: 'Double Digits',    emoji: '🔟',
      test: function (s) { return s.conquered.length >= 10; } },
    { id: 'veggie_brave', name: 'Veggie Brave',    emoji: '🥦',
      test: function (s) { return countGroup(s.conquered, 'veg') >= 3; } },
    { id: 'rainbow_plate', name: 'Rainbow Plate',  emoji: '🌈',
      test: function (s) { return (s.platesBuilt || 0) >= 1; } },
    { id: 'explorer',    name: 'Brave Explorer',   emoji: '🧭',
      test: function (s) { return Object.keys(s.ladders || {}).length >= 8; } },
    { id: 'streak_3',    name: '3-Day Streak',     emoji: '🔥',
      test: function (s) { return (s.streak || 0) >= 3; } },
    { id: 'streak_7',    name: 'Week Warrior',     emoji: '⚡',
      test: function (s) { return (s.streak || 0) >= 7; } }
  ];

  function countGroup(ids, group) {
    return (ids || []).filter(function (id) {
      var f = getFood(id); return f && f.group === group;
    }).length;
  }
  function earnedBadges(state) {
    return BADGES.filter(function (b) { return b.test(state); }).map(function (b) { return b.id; });
  }

  /* ---- State ------------------------------------------------------------ */
  function newProfile(name, age) {
    return {
      name: name || 'Player',
      age: age || null,
      points: 0,
      ladders: {},        // foodId -> rung level (1..4)
      conquered: [],       // foodIds at 'taste'
      badges: [],
      streak: 0,
      lastDay: null,
      platesBuilt: 0
    };
  }

  function clone(s) {
    return {
      name: s.name, age: s.age, points: s.points,
      ladders: Object.assign({}, s.ladders),
      conquered: s.conquered.slice(),
      badges: s.badges.slice(),
      streak: s.streak, lastDay: s.lastDay,
      platesBuilt: s.platesBuilt || 0
    };
  }

  /* ---- Actions ---------------------------------------------------------- */
  // Advance one rung on a food's tasting ladder. Returns a NEW state plus
  // exactly what was earned, so the UI can celebrate the precise change.
  function advanceLadder(state, foodId, today) {
    if (!getFood(foodId)) throw new Error('Unknown food: ' + foodId);
    var s = clone(state);
    var cur = s.ladders[foodId] || 0;
    if (cur >= LADDER_MAX) {
      return { state: s, earned: 0, rung: LADDER_MAX, conquered: false,
               alreadyMax: true, newBadges: [] };
    }
    var lvl = cur + 1;
    s.ladders[foodId] = lvl;
    var earned = POINTS_PER_RUNG;
    var conquered = false;
    if (lvl === LADDER_MAX) {
      conquered = true;
      earned += CONQUER_BONUS;
      if (s.conquered.indexOf(foodId) === -1) s.conquered.push(foodId);
    }
    s.points += earned;
    if (today != null) {
      s.streak = nextStreak(s.streak, s.lastDay, today);
      s.lastDay = today;
    }
    var before = s.badges.slice();
    s.badges = unique(before.concat(earnedBadges(s)));
    var newBadges = s.badges.filter(function (b) { return before.indexOf(b) === -1; });
    return { state: s, earned: earned, rung: lvl, rungName: ladderName(lvl),
             conquered: conquered, alreadyMax: false, newBadges: newBadges };
  }

  // Lock in a built plate. Awards plate points; flags balance.
  function buildPlate(state, foodIds, today) {
    var s = clone(state);
    var res = scorePlate(foodIds);
    s.points += res.points;
    if (res.balanced) s.platesBuilt = (s.platesBuilt || 0) + 1;
    if (today != null) {
      s.streak = nextStreak(s.streak, s.lastDay, today);
      s.lastDay = today;
    }
    var before = s.badges.slice();
    s.badges = unique(before.concat(earnedBadges(s)));
    var newBadges = s.badges.filter(function (b) { return before.indexOf(b) === -1; });
    return { state: s, earned: res.points, balanced: res.balanced,
             colors: res.colors, missing: res.missing, newBadges: newBadges };
  }

  function unique(arr) {
    var out = [], seen = {};
    arr.forEach(function (x) { if (!seen[x]) { seen[x] = 1; out.push(x); } });
    return out;
  }

  function dayNumber(ms) { return Math.floor((ms == null ? Date.now() : ms) / 86400000); }

  /* ---- Public API ------------------------------------------------------- */
  return {
    RAINBOW: RAINBOW, GROUPS: GROUPS, FOODS: FOODS, LADDER: LADDER,
    LADDER_MAX: LADDER_MAX, LEVELS: LEVELS, BADGES: BADGES,
    POINTS_PER_RUNG: POINTS_PER_RUNG, CONQUER_BONUS: CONQUER_BONUS,
    BALANCE_BONUS: BALANCE_BONUS, MIN_COLORS: MIN_COLORS,
    getFood: getFood,
    ladderName: ladderName, ladderIndex: ladderIndex,
    levelFor: levelFor,
    plateColors: plateColors, plateGroups: plateGroups,
    missingForBalance: missingForBalance, isBalancedPlate: isBalancedPlate,
    scorePlate: scorePlate,
    nextStreak: nextStreak,
    countGroup: countGroup, earnedBadges: earnedBadges,
    newProfile: newProfile, clone: clone,
    advanceLadder: advanceLadder, buildPlate: buildPlate,
    dayNumber: dayNumber
  };
});
