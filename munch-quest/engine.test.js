/* ============================================================================
 * Munch Quest — Engine tests
 * Zero dependencies. Run:  node engine.test.js
 * Every game rule the kids touch is pinned here. The app loads the same
 * engine.js, so what passes here is what ships.
 * ==========================================================================*/
var E = require('./engine.js');

var pass = 0, fail = 0, fails = [];
function ok(cond, msg) {
  if (cond) { pass++; }
  else { fail++; fails.push(msg); }
}
function eq(a, b, msg) { ok(a === b, msg + '  (got ' + JSON.stringify(a) + ', want ' + JSON.stringify(b) + ')'); }
function deq(a, b, msg) { ok(JSON.stringify(a) === JSON.stringify(b), msg + '  (got ' + JSON.stringify(a) + ')'); }

/* ---- Catalog ---------------------------------------------------------- */
eq(E.FOODS.length, 30, 'catalog has 30 foods');
ok(E.FOODS.every(function (f) { return f.id && f.name && f.emoji && f.color && f.group; }), 'every food has id/name/emoji/color/group');
ok(E.FOODS.every(function (f) { return E.RAINBOW.indexOf(f.color) !== -1; }), 'every food color is a rainbow color');
ok(E.FOODS.every(function (f) { return E.GROUPS.indexOf(f.group) !== -1; }), 'every food group is valid');
(function () {
  var ids = {}, dup = false;
  E.FOODS.forEach(function (f) { if (ids[f.id]) dup = true; ids[f.id] = 1; });
  ok(!dup, 'food ids are unique');
})();
ok(E.getFood('broccoli') && E.getFood('broccoli').group === 'veg', 'getFood resolves a known food');
eq(E.getFood('rocket-ship'), null, 'getFood returns null for unknown');
ok(E.GROUPS.indexOf('veg') !== -1 && E.GROUPS.indexOf('fruit') !== -1 && E.GROUPS.indexOf('protein') !== -1, 'core groups present');
ok(E.RAINBOW.length === 7, 'rainbow has 7 colors');

/* ---- Tasting ladder --------------------------------------------------- */
deq(E.LADDER, ['look', 'smell', 'lick', 'taste'], 'ladder rungs are look->smell->lick->taste');
eq(E.LADDER_MAX, 4, 'ladder max is 4');
eq(E.ladderName(1), 'look', 'rung 1 is look');
eq(E.ladderName(2), 'smell', 'rung 2 is smell');
eq(E.ladderName(3), 'lick', 'rung 3 is lick');
eq(E.ladderName(4), 'taste', 'rung 4 is taste');
eq(E.ladderName(0), 'new', 'rung 0 is new');
eq(E.ladderName(9), 'taste', 'rung above max clamps to taste');
eq(E.ladderIndex('look'), 1, 'ladderIndex look = 1');
eq(E.ladderIndex('taste'), 4, 'ladderIndex taste = 4');
eq(E.ladderIndex('nope'), 0, 'ladderIndex unknown = 0');

/* ---- Levels ----------------------------------------------------------- */
eq(E.levelFor(0).level, 1, 'level 1 at 0 pts');
eq(E.levelFor(0).title, 'Rookie Taster', 'level 1 title');
eq(E.levelFor(99).level, 1, '99 pts still level 1');
eq(E.levelFor(100).level, 2, '100 pts -> level 2');
eq(E.levelFor(250).level, 3, '250 pts -> level 3');
eq(E.levelFor(699).level, 4, '699 pts -> level 4');
eq(E.levelFor(700).level, 5, '700 pts -> level 5');
eq(E.levelFor(1399).level, 6, '1399 pts -> level 6');
eq(E.levelFor(1400).level, 7, '1400 pts -> level 7 (max)');
eq(E.levelFor(1400).isMax, true, 'level 7 is max');
eq(E.levelFor(1400).next, null, 'no next beyond max');
eq(E.levelFor(1400).toNext, 0, 'toNext is 0 at max');
eq(E.levelFor(120).intoLevel, 20, 'intoLevel = pts - floor');
eq(E.levelFor(120).toNext, 130, 'toNext = next floor - pts');
eq(E.levelFor(-50).level, 1, 'negative pts clamps to level 1');
eq(E.levelFor('oops').level, 1, 'garbage pts clamps to level 1');

/* ---- Balance rule ----------------------------------------------------- */
deq(E.plateColors(['strawberry', 'broccoli']).sort(), ['green', 'red'], 'plateColors distinct');
eq(E.plateColors(['strawberry', 'apple', 'tomato']).length, 1, 'all-red plate = 1 color');
deq(E.plateGroups(['tomato', 'apple', 'egg']).sort(), ['fruit', 'protein', 'veg'], 'plateGroups distinct');
eq(E.isBalancedPlate(['broccoli', 'apple', 'egg']), true, 'veg+fruit+protein across 3 colors = balanced');
eq(E.isBalancedPlate(['tomato', 'apple', 'egg']), false, 'right groups but only 2 colors = not balanced');
eq(E.isBalancedPlate(['broccoli', 'cucumber', 'avocado']), false, 'all green veg = not balanced');
eq(E.isBalancedPlate([]), false, 'empty plate is not balanced');
eq(E.isBalancedPlate(['apple', 'orange', 'banana']), false, 'three fruits, no veg/protein = not balanced');
(function () {
  var m = E.missingForBalance(['apple']);
  deq(m.groups.sort(), ['protein', 'veg'], 'missing groups from a lone apple');
  eq(m.colorsShort, 2, 'one color short by 2');
})();
(function () {
  var m = E.missingForBalance(['broccoli', 'apple', 'egg']);
  eq(m.groups.length, 0, 'balanced plate misses no groups');
  eq(m.colorsShort, 0, 'balanced plate misses no colors');
})();

/* ---- scorePlate ------------------------------------------------------- */
(function () {
  var r = E.scorePlate(['broccoli', 'apple', 'egg']);
  eq(r.balanced, true, 'scorePlate flags balanced');
  eq(r.colors, 3, 'scorePlate counts 3 colors');
  eq(r.points, 3 * 5 + E.BALANCE_BONUS, 'balanced points = colors*5 + bonus');
})();
(function () {
  var r = E.scorePlate(['strawberry']);
  eq(r.balanced, false, 'single food not balanced');
  eq(r.points, 5, 'one color = 5 points, no bonus');
})();
eq(E.scorePlate([]).points, 0, 'empty plate scores 0');

/* ---- Streaks ---------------------------------------------------------- */
eq(E.nextStreak(0, null, 5), 1, 'first active day -> streak 1');
eq(E.nextStreak(3, 5, 5), 3, 'same day keeps streak');
eq(E.nextStreak(3, 5, 6), 4, 'consecutive day increments');
eq(E.nextStreak(3, 5, 8), 1, 'gap resets to 1');
eq(E.nextStreak(6, 10, 11), 7, 'streak rolls to 7');
eq(E.nextStreak(0, 5, 6), 1, 'consecutive from 0 -> 1');

/* ---- Badges ----------------------------------------------------------- */
eq(E.earnedBadges(E.newProfile('Test', 6)).length, 0, 'fresh profile earns no badges');
(function () {
  var s = E.newProfile('A', 9); s.conquered = ['apple'];
  ok(E.earnedBadges(s).indexOf('first_bite') !== -1, 'one conquered food earns first_bite');
})();
(function () {
  var s = E.newProfile('A', 9); s.conquered = ['apple', 'pear', 'egg', 'rice', 'milk'];
  var b = E.earnedBadges(s);
  ok(b.indexOf('first_bite') !== -1 && b.indexOf('five_foods') !== -1, '5 foods earns five_foods');
  ok(b.indexOf('ten_foods') === -1, 'under 10 does not earn ten_foods');
})();
(function () {
  var s = E.newProfile('A', 9); s.conquered = ['broccoli', 'carrot', 'cucumber'];
  ok(E.earnedBadges(s).indexOf('veggie_brave') !== -1, '3 conquered veg earns veggie_brave');
})();
(function () {
  var s = E.newProfile('A', 9);
  s.ladders = { a: 1, b: 1, c: 1, d: 1, e: 1, f: 1, g: 1, h: 1 };
  ok(E.earnedBadges(s).indexOf('explorer') !== -1, '8 foods started earns explorer');
})();
(function () {
  var s = E.newProfile('A', 9); s.streak = 3;
  ok(E.earnedBadges(s).indexOf('streak_3') !== -1, 'streak 3 earns streak_3');
  s.streak = 7;
  ok(E.earnedBadges(s).indexOf('streak_7') !== -1, 'streak 7 earns streak_7');
})();
eq(E.countGroup(['broccoli', 'carrot', 'apple'], 'veg'), 2, 'countGroup counts veg correctly');

/* ---- advanceLadder ---------------------------------------------------- */
(function () {
  var s0 = E.newProfile('Leo', 6);
  var r1 = E.advanceLadder(s0, 'broccoli', 10);
  eq(r1.rung, 1, 'first advance -> rung 1');
  eq(r1.rungName, 'look', 'first advance is look');
  eq(r1.earned, 10, 'first rung earns 10');
  eq(r1.conquered, false, 'not conquered at rung 1');
  eq(r1.state.points, 10, 'points add to 10');
  eq(r1.state.streak, 1, 'streak starts at 1');
  eq(s0.points, 0, 'original state is untouched (immutability)');

  var r2 = E.advanceLadder(r1.state, 'broccoli', 11);
  var r3 = E.advanceLadder(r2.state, 'broccoli', 12);
  var r4 = E.advanceLadder(r3.state, 'broccoli', 13);
  eq(r4.rung, 4, 'fourth advance -> rung 4 (taste)');
  eq(r4.conquered, true, 'rung 4 conquers the food');
  eq(r4.earned, E.POINTS_PER_RUNG + E.CONQUER_BONUS, 'taste earns rung + conquer bonus');
  eq(r4.state.points, 10 + 10 + 10 + 35, 'cumulative points after conquering broccoli');
  ok(r4.state.conquered.indexOf('broccoli') !== -1, 'broccoli added to conquered list');
  ok(r4.newBadges.indexOf('first_bite') !== -1, 'conquering first food unlocks first_bite');
  eq(r4.state.streak, 4, 'streak grew over 4 consecutive days');

  var r5 = E.advanceLadder(r4.state, 'broccoli', 14);
  eq(r5.alreadyMax, true, 'advancing a conquered food is a no-op');
  eq(r5.earned, 0, 'no points past taste');
  eq(r5.state.conquered.length, 1, 'no duplicate in conquered list');
})();
(function () {
  var threw = false;
  try { E.advanceLadder(E.newProfile('x'), 'not-a-food', 1); } catch (e) { threw = true; }
  ok(threw, 'advanceLadder throws on unknown food');
})();

/* ---- buildPlate ------------------------------------------------------- */
(function () {
  var s0 = E.newProfile('Max', 9);
  var r = E.buildPlate(s0, ['broccoli', 'apple', 'egg'], 20);
  eq(r.balanced, true, 'buildPlate flags a balanced plate');
  eq(r.earned, 3 * 5 + E.BALANCE_BONUS, 'balanced plate awards rainbow + bonus');
  eq(r.state.platesBuilt, 1, 'balanced plate increments platesBuilt');
  ok(r.newBadges.indexOf('rainbow_plate') !== -1, 'first balanced plate unlocks rainbow_plate');
  eq(s0.platesBuilt, 0, 'original state untouched by buildPlate');

  var r2 = E.buildPlate(s0, ['apple', 'strawberry'], 20);
  eq(r2.balanced, false, 'unbalanced plate flagged false');
  eq(r2.state.platesBuilt, 0, 'unbalanced plate does not increment platesBuilt');
})();

/* ---- dayNumber + clone ------------------------------------------------ */
eq(E.dayNumber(0), 0, 'dayNumber(0) = 0');
eq(E.dayNumber(86400000), 1, 'dayNumber one day later = 1');
eq(E.dayNumber(86400000 * 10 + 5), 10, 'dayNumber floors within a day');
(function () {
  var s = E.newProfile('C', 6); s.conquered.push('apple');
  var c = E.clone(s); c.conquered.push('pear');
  eq(s.conquered.length, 1, 'clone does not mutate source arrays');
  eq(c.conquered.length, 2, 'clone is independently mutable');
})();

/* ---- Report ----------------------------------------------------------- */
console.log('Munch Quest engine — ' + pass + ' passed, ' + fail + ' failed  (of ' + (pass + fail) + ')');
if (fail) { fails.forEach(function (m) { console.log('  ✗ ' + m); }); process.exit(1); }
console.log('All assertions green. The engine the app ships is the engine these tests pin.');
