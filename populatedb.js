#! /usr/bin/env node

var async = require('async');
var Item = require('./models/item');
var ItemInstance = require('./models/iteminstance');
var Category = require('./models/category');

var mongoose = require('mongoose');
var mongoDB =
  'mongodb+srv://stevo5563:urmom123@cluster0.k91vh.mongodb.net/enchanted_emporium?retryWrites=true&w=majority'; // Populate to new collections without callbacks
mongoose.connect(mongoDB, { useNewUrlParser: true, useUnifiedTopology: true });
mongoose.Promise = global.Promise;
var db = mongoose.connection;
db.on('error', console.error.bind(console, 'MongoDB connection error:'));

var items = [];
var iteminstances = [];
var categories = [];

function categoryCreate(name, cb) {
  var category = new Category({ name: name });

  category.save(function (err) {
    if (err) {
      cb(err, null);
      return;
    }
    console.log('New Category: ' + category);
    categories.push(category);
    cb(null, category);
  });
}

function itemCreate(name, description, price, category, cb) {
  iteminfo = {
    name: name,
    description: description,
    price: price,
    category: category,
  };

  var item = new Item(iteminfo);
  item.save(function (err) {
    if (err) {
      cb(err, null);
      return;
    }
    console.log('New Item: ' + item);
    items.push(item);
    cb(null, item);
  });
}

function itemInstanceCreate(item, qty) {
  iteminstanceinfo = {
    item: item,
  };

  for (let i = 0; i < qty; i++) {
    var iteminstance = new ItemInstance(iteminstanceinfo);
    iteminstance.save(function (err) {
      if (err) {
        console.log('ERROR CREATING ItemInstance: ' + iteminstance);

        return;
      }
      console.log('New ItemInstance: ' + iteminstance);
      iteminstances.push(iteminstance);
    });
  }
}

function createCategories(cb) {
  async.series(
    [
      function (callback) {
        categoryCreate('Weapons', callback);
      },
      function (callback) {
        categoryCreate('Armor', callback);
      },
      function (callback) {
        categoryCreate('Potions', callback);
      },
      function (callback) {
        categoryCreate('Rings', callback);
      },
      function (callback) {
        categoryCreate('Misc.', callback);
      },
    ],
    // optional callback
    cb
  );
}

function createItems(cb) {
  async.parallel(
    [
      function (callback) {
        itemCreate(
          "Thori'dal, the Stars' Fury",
          "Thori'dal, the Stars' Fury is a legendary bow of mysterious origins, infused with power from the Sunwell.",
          775,
          categories[0],
          callback
        );
      },
      function (callback) {
        itemCreate(
          "Val'anyr, Hammer of Ancient Kings",
          'A legendary mace that was created by the titans and gifted to the first Earthen king to create and bestow life to more Earthen. During the first war between the Earthen and the Iron Dwarves, the weapon was shattered into fragments, which were believed to be lost for many millennia.',
          1100,
          categories[0],
          callback
        );
      },
      function (callback) {
        itemCreate(
          'Thunderfury, Blessed Blade of the Windseeker',
          "The legendary sword once wielded by Thunderaan, Prince of Air. The prince, son of Al'Akir the Windlord, was attacked by Ragnaros the Firelord, in an attempt to heighten the already impressive power that the fire elemental held. Ragnaros succeeded; however, Thunderaan's power could not be completely taken into his form. What remained of Thunderaan was placed in a talisman of elemental binding, which was broken into two pieces.",
          949,
          categories[0],
          callback
        );
      },
      function (callback) {
        itemCreate(
          'Sword of a Thousand Truths',
          'Long ago, when the World of Warcraft was created, one of the programmers put a sword called The Sword of a Thousand Truths into the game inventory. But the sword was considered to be too powerful for anyone to possess, so it was removed from the game and stored on a one gig flash drive. But it was foretold that one day players who could wield the sword might reveal themselves.',
          1337,
          categories[0],
          callback
        );
      },
      function (callback) {
        itemCreate(
          'Boomerang',
          "The boomerang is a ranged weapon, and any creature proficient with the javelin is also proficient with this weapon. On a miss, a boomerang returns to the thrower's hand.",
          49,
          categories[0],
          callback
        );
      },
      function (callback) {
        itemCreate(
          'Sunblade',
          'This item appears to be a longsword hilt. While grasping the hilt, you can use a bonus action to cause a blade of pure radiance to spring into existence, or make the blade disappear. While the blade exists, this magic longsword has the finesse property. If you are proficient with shortswords or longswords, you are proficient with the sun blade.',
          325,
          categories[0],
          callback
        );
      },
      function (callback) {
        itemCreate(
          'Berserker Axe',
          'Curse. This axe is cursed, and becoming attuned to it extends the curse to you. As long as you remain cursed, you are unwilling to part with the axe, keeping it within reach at all times. You also have disadvantage on attack rolls with weapons other than this one, unless no foe is within 60 feet of you that you can see or hear. Whenever a hostile creature damages you while the axe is in your possession, you must succeed on a DC 15 Wisdom saving throw or go berserk. While berserk, you must use your action each round to attack the creature nearest to you with the axe. If you can make extra attacks as part of the Attack action, you use those extra attacks, moving to attack the next nearest creature after you fell your current target. If you have multiple possible targets, you attack one at random. You are berserk until you start your turn with no creatures within 60 feet of you that you can see or hear.',
          449,
          categories[0],
          callback
        );
      },
      function (callback) {
        itemCreate(
          'Armor of Invulnerability',
          "You have resistance to nonmagical damage while you wear this armor. Additionally, you can use an action to make yourself immune to nonmagical damage for 10 minutes or until you are no longer wearing the armor. Once this special action is used, it can't be used again until the next dawn.",
          950,
          categories[1],
          callback
        );
      },
      function (callback) {
        itemCreate(
          'Plate Armor of Etherealness',
          "While you're wearing this armor, you can speak its command word as an action to gain the effect of the etherealness spell, which last for 10 minutes or until you remove the armor or use an action to speak the command word again. This property of the armor can't be used again until the next dawn.",
          950,
          categories[1],
          callback
        );
      },
      function (callback) {
        itemCreate(
          'Dwarven Plate',
          'While wearing this armor, you gain a +2 bonus to AC. In addition, if an effect moves you against your will along the ground, you can use your reaction to reduce the distance you are moved by up to 10 feet. Plate consists of shaped, interlocking metal plates to cover the entire body. A suit of plate includes gauntlets, heavy leather boots, a visored helmet, and thick layers of padding underneath the armor. Buckles and straps distribute the weight over the body.',
          599,
          categories[1],
          callback
        );
      },
      function (callback) {
        itemCreate(
          'Dragon Scale Mail',
          'Dragon scale mail is made of the scales of one kind of dragon. Sometimes dragons collect their cast-off scales and gift them to humanoids. Other times, hunters carefully skin and preserve the hide of a dead dragon. In either case, dragon scale mail is highly valued. While wearing this armor, you gain a +1 bonus to AC, you have advantage on saving throws against the Frightful Presence and breath weapons of dragons, and you have resistance to one damage type that is determined by the kind of a dragon that provided the scales.',
          830,
          categories[1],
          callback
        );
      },
      function (callback) {
        itemCreate(
          'Potion of Clairvoyance',
          'When you drink this potion, you gain the effect of the clairvoyance spell. An eyeball bobs in this yellowish liquid but vanishes when the potion is opened.',
          99,
          categories[2],
          callback
        );
      },
      function (callback) {
        itemCreate(
          'Potion of Animal Friendship',
          'When you drink this potion, you can cast the animal friendship spell (save DC 13) for 1 hour at will. Agitating this muddy liquid brings little bits into view: a fish scale, a hummingbird tongue, a cat claw, or a squirrel hair.',
          49,
          categories[2],
          callback
        );
      },
      function (callback) {
        itemCreate(
          'Potion of Flying',
          "When you drink this potion, you gain a flying speed equal to your walking speed for 1 hour and can hover. If you're in the air when the potion wears off, you fall unless you have some other means of staying aloft. This potion's clear liquid floats at the top of its container and has cloudy white impurities drifting in it.",
          199,
          categories[2],
          callback
        );
      },
      function (callback) {
        itemCreate(
          'Potion of Healing',
          "You regain hit points when you drink this potion. Whatever its potency, the potion's red liquid glimmers when agitated.",
          29,
          categories[2],
          callback
        );
      },
      function (callback) {
        itemCreate(
          'Potion of Speed',
          "When you drink this potion, you gain the effect of the haste spell for 1 minute (no concentration required). The potion's yellow fluid is streaked with black and swirls on its own.",
          139,
          categories[2],
          callback
        );
      },
      function (callback) {
        itemCreate(
          'Potion of Water Breathing',
          'You can breathe underwater for 1 hour after drinking this potion. Its cloudy green fluid smells of the sea and has a jellyfish-like bubble floating in it.',
          75,
          categories[2],
          callback
        );
      },
      function (callback) {
        itemCreate(
          'Potion of Poison',
          'This concoction looks, smells, and tastes like a potion of healing or other beneficial potion. However, it is actually poison masked by illusion magic. An identify spell reveals its true nature.',
          99,
          categories[2],
          callback
        );
      },
      function (callback) {
        itemCreate(
          'Ring of Evasion',
          'This ring has 3 charges, and it regains 1d3 expended charges daily at dawn. When you fail a Dexterity saving throw while wearing it, you can use your reaction to expend 1 of its charges to succeed on that saving throw instead.',
          219,
          categories[3],
          callback
        );
      },
      function (callback) {
        itemCreate(
          'Ring of Invisibility',
          'While wearing this ring, you can turn invisible as an action. Anything you are wearing or carrying is invisible with you. You remain invisible until the ring is removed, until you attack or cast a spell, or until you use a bonus action to become visible again.',
          899,
          categories[3],
          callback
        );
      },
      function (callback) {
        itemCreate(
          'Ring of Water Walking',
          'While wearing this ring, you can stand on and move across any liquid surface as if it were solid ground.',
          449,
          categories[3],
          callback
        );
      },
      function (callback) {
        itemCreate(
          'Ring of Jumping',
          'While wearing this ring, you can cast the jump spell from it as a bonus action at will, but can target only yourself when you do so.',
          99,
          categories[3],
          callback
        );
      },
      function (callback) {
        itemCreate(
          'Bag of Holding',
          'This bag has an interior space considerably larger than its outside dimensions, roughly 2 feet in diameter at the mouth and 4 feet deep. The bag can hold up to 500 pounds, not exceeding a volume of 64 cubic feet. The bag weighs 15 pounds, regardless of its contents. Retrieving an item from the bag requires an action. If the bag is overloaded, pierced, or torn, it ruptures and is destroyed, and its contents are scattered in the Astral Plane. If the bag is turned inside out, its contents spill forth, unharmed, but the bag must be put right before it can be used again. Breathing creatures inside the bag can survive up to a number of minutes equal to 10 divided by the number of creatures (minimum 1 minute), after which time they begin to suffocate.',
          399,
          categories[4],
          callback
        );
      },
      function (callback) {
        itemCreate(
          'Amulet of the Planes',
          'While wearing this amulet, you can use an action to name a location that you are familiar with on another plane of existence. Then make a DC 15 Intelligence check. On a successful check, you cast the plane shift spell. On a failure, you and each creature and object within 15 feet of you travel to a random destination. Roll a d100. On a 1–60, you travel to a random location on the plane you named. On a 61–100, you travel to a randomly determined plane of existence.',
          799,
          categories[4],
          callback
        );
      },
      function (callback) {
        itemCreate(
          'Elemental Gem',
          "This gem contains a mote of elemental energy. When you use an action to break the gem, an elemental is summoned as if you had cast the conjure elemental spell, and the gem's magic is lost. The type of gem determines the elemental summoned by the spell.",
          105,
          categories[4],
          callback
        );
      },
      function (callback) {
        itemCreate(
          'Helm of Brilliance',
          'While wearing this helm, you can use an action to cast the comprehend languages spell from it at will.',
          699,
          categories[4],
          callback
        );
      },
    ],
    // optional callback
    cb
  );
}

function createItemInstances(cb) {
  async.parallel(
    [
      function () {
        itemInstanceCreate(items[0], 1);
      },
      function () {
        itemInstanceCreate(items[1], 1);
      },
      function () {
        itemInstanceCreate(items[2], 1);
      },
      function () {
        itemInstanceCreate(items[3], 1);
      },
      function () {
        itemInstanceCreate(items[4], 25);
      },
      function () {
        itemInstanceCreate(items[5], 2);
      },
      function () {
        itemInstanceCreate(items[6], 6);
      },
      function () {
        itemInstanceCreate(items[7], 1);
      },
      function () {
        itemInstanceCreate(items[8], 1);
      },
      function () {
        itemInstanceCreate(items[9], 1);
      },
      function () {
        itemInstanceCreate(items[10], 2);
      },
      function () {
        itemInstanceCreate(items[11], 18);
      },
      function () {
        itemInstanceCreate(items[12], 14);
      },
      function () {
        itemInstanceCreate(items[13], 2);
      },
      function () {
        itemInstanceCreate(items[14], 99);
      },
      function () {
        itemInstanceCreate(items[15], 4);
      },
      function () {
        itemInstanceCreate(items[16], 2);
      },
      function () {
        itemInstanceCreate(items[17], 18);
      },
      function () {
        itemInstanceCreate(items[18], 4);
      },
      function () {
        itemInstanceCreate(items[19], 1);
      },
      function () {
        itemInstanceCreate(items[20], 1);
      },
      function () {
        itemInstanceCreate(items[21], 7);
      },
      function () {
        itemInstanceCreate(items[22], 8);
      },
      function () {
        itemInstanceCreate(items[23], 1);
      },
      function () {
        itemInstanceCreate(items[24], 25);
      },
      function () {
        itemInstanceCreate(items[25], 2);
      },
    ],
    // Optional callback
    cb
  );
}

async.series(
  [createCategories, createItems, createItemInstances],
  // Optional callback
  function (err, results) {
    if (err) {
      console.log('FINAL ERR: ' + err);
    } else {
      console.log('ITEMInstances: ' + iteminstances);
    }
    // All done, disconnect from database
    mongoose.connection.close();
  }
);
