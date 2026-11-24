/* ============================================================
   PHOTO LIBRARY — every image on the site comes from here.
   Free-to-use photos from Unsplash (unsplash.com/license), served from Unsplash's CDN.
   Format: KEY: [unsplash photo id, photographer @handle, alt text]
   To use your own photo: add  KEY: ['/photos/my-file.jpg', 'your-name', 'alt text']
   and drop the file in /public/photos/.
   ============================================================ */
const PHOTOS = {
  // Salvador
  S1: ['1591233055842-a984961b71af', 'seijigoto', 'Aerial view of Salvador’s seafront buildings and the Bay of All Saints'],
  S2: ['1766946441214-f46356c09fd1', 'ianfelix', 'Round sea fortress surrounded by boats in the blue water off Salvador'],
  S3: ['1606064934508-73f08e379a91', 'julian21', 'The Farol da Barra lighthouse on its fort above the sea in Salvador'],
  S4: ['1640884216864-b26b780ff102', 'celsoyh', 'Cobblestone street lined with colorful colonial buildings in Salvador’s Pelourinho'],
  S5: ['1660643065775-cf0fde5fe2ee', 'nobla', 'Colorful houses along the waterfront in Salvador'],
  S6: ['1589711769108-5aaf6de20ca6', 'william46', 'Ornate baroque church façade in Salvador’s historic center'],
  S7: ['1544456808-7530b2d112df', 'trintaycinco', 'View over the rooftops of Salvador during the day'],
  S8: ['1558358083-1c0cb9c9c08d', 'favasconcelos', 'Gilded baroque interior of a historic church in Salvador'],
  S9: ['1741635549870-e8a44f708b56', 'salem999', 'Boats moored in turquoise water beside colorful houses in Bahia'],
  S10: ['1787156154392-af6a3ee9b154', 'muso0397', 'Colorful Orixá statues floating on the Dique do Tororó lake in Salvador'],
  // Morro de São Paulo & Tinharé
  M1: ['1629228420074-c5a87b09ccb7', 'renatotrentin', 'Aerial view of a village on a green headland above a calm tropical bay in Bahia'],
  M2: ['1629295796431-53edea4a5d04', 'mfhroz', 'Boats gliding across emerald-green water seen from above, Bahia'],
  M3: ['1629295790679-c8f842324984', 'mfhroz', 'Aerial view of a long white sandbar curving between green water and forest'],
  M4: ['1718992194826-532463fd9711', 'george_davison', 'Aerial view of a lighthouse headland, beaches and turquoise ocean in Bahia'],
  M5: ['1594357931457-a0975a9bf60f', 'omerdv', 'Aerial view of a beach village with natural reef pools at low tide'],
  M6: ['1482807799514-81eafb6ea59b', 'naassomz1', 'Boats on the water under a purple and orange tropical sunset'],
  M7: ['1718992203003-b5d55694b507', 'george_davison', 'Aerial view of a jungle-covered island fringed by beaches and clear water'],
  M8: ['1718992230074-7908a0b21bbd', 'george_davison', 'Bird’s-eye view of a curving beach and shallow turquoise ocean'],
  // Chapada Diamantina
  C1: ['1591232635364-707e5827d09f', 'seijigoto', 'Green plateau and flat-topped mountains in Chapada Diamantina'],
  C2: ['1616379528184-8657a731f24f', 'felipediascreator', 'Electric-blue swimming hole surrounded by rocks and forest in Chapada Diamantina'],
  C3: ['1723033481526-5050488585cb', 'otaciliomaia', 'Hiker photographing the table-top mountains of Chapada Diamantina'],
  C4: ['1591232635323-5dad99cd96b8', 'seijigoto', 'Waterfall plunging through green forest in Chapada Diamantina'],
  C5: ['1621698834442-cca002c6fef1', 'jballa', 'Waterfalls pouring down a rocky cliff into a pool in Chapada Diamantina'],
  C6: ['1724710089387-c9aa4cf9c28b', 'luizabraun', 'Sweeping view of blue mesas and canyon cliffs in Chapada Diamantina'],
  C7: ['1728232875709-a471152b4413', 'salem999', 'Cave with a translucent blue pool in Chapada Diamantina'],
  // Itacaré & jungle coast
  I1: ['1733590733972-af566d10d1f8', 'matheus_oliveira', 'Sandy beach with coconut palms and a forested hill near Itacaré'],
  I3: ['1700264280566-6e67f4d36d91', 'gabrielnakamura', 'Jungle-covered headland above a beach and turquoise sea near Itacaré'],
  I5: ['1728591406062-9219f75e88e8', 'lucianooliveira', 'Surfer riding a wave on a Bahia beach'],
  I6: ['1749648495131-772de4f86426', 'viniciusmarcall', 'Aerial view of a palm-lined beach and green surf in Bahia'],
  J3: ['1610457379304-c1be61eba3d7', 'thlt_lcx', 'Lush rainforest trees beside a calm river'],
  J4: ['1561733631-f2481dfd7425', 'soebau', 'Coconut palms leaning over a quiet tropical beach in Bahia'],
  // Trancoso
  T1: ['1732066879788-b1c9637da7c8', 'limamauro23', 'Fishing boat floating on calm blue water off Trancoso'],
  T2: ['1732066811253-b34c81d58e45', 'limamauro23', 'View of a long beach and ocean from the clifftop at Trancoso'],
  T3: ['1660324815806-c0d68f2880e1', 'jballa', 'White colonial chapel with a cross in Trancoso'],
  T4: ['1602240812240-7a90562b85b5', 'caio_rodrigues', 'The white church on the grassy Quadrado square in Trancoso under a blue sky'],
  // Praia do Forte
  F1: ['1708111890355-016f3cb276ac', 'h3binho', 'Aerial view of a palm-fringed beach and clear water at Praia do Forte'],
  F2: ['1745681278433-4f45b29fb3c4', 'smiddyburbon', 'Quiet tropical beach under a dramatic cloudy sky'],
  F3: ['1779312142210-1e57a762d928', 'cnadalutti', 'Tropical beach with palm trees and turquoise ocean in Bahia'],
  F4: ['1709918815414-92add1dffaa9', 'h3binho', 'Boats anchored in shallow turquoise water seen from above'],
  // Boipeba
  B1: ['1674658100632-e553a6045e3e', 'victorataide', 'Aerial view of Boipeba island’s beach and tropical forest'],
  B2: ['1674658100343-a89ad143af45', 'victorataide', 'Wooden boat pulled up on a sandy beach on Boipeba'],
  B3: ['1662781018296-b4117ae3b2eb', 'henriquelcg', 'Boats and a swimmer in calm shallow water at Boipeba'],
  B4: ['1674658100275-155992097b8f', 'victorataide', 'Aerial view of a lone boat on dark green water off Boipeba'],
  // Underwater & wildlife
  U1: ['1763712571835-fc3ae24e8104', 'teguharisma', 'Snorkeler floating in clear turquoise ocean water'],
  U2: ['1708646952768-5968eb025e5f', 'juangut', 'Half-underwater view of rocks beneath crystal-clear water'],
  U3: ['1793477015721-c7d4819cca85', 'jeisen', 'Catamaran anchored over a reef in crystal-clear turquoise water'],
  U4: ['1437622368342-7a3d73a34c8f', 'wexor', 'Sea turtle swimming in deep blue water'],
  U5: ['1779887184038-df7ebd258412', 'miyatankun', 'Sea turtle gliding over a sandy seabed in clear blue water'],
  U6: ['1709483095301-2d1f3e95b1d4', 'sebastiengoldberg', 'Sea turtle swimming toward the surface in sunlit water'],
  U8: ['1759414428314-648758651cf0', 'katja_zlotnikova', 'Colorful coral reef teeming with small fish'],
  U9: ['1581903666589-d19db5b25ca3', 'davidclode', 'Striped butterflyfish close up on the reef'],
  U10: ['1786036183790-dcf292068603', 'alanemery', 'School of small fish swimming around a coral reef'],
  W1: ['1568430462989-44163eb1752f', 'toddcravens', 'Humpback whale breaching out of the blue ocean'],
  W2: ['1450045439515-ff27c2f2e6b1', 'shmabbss', 'Humpback whale tail rising above the deep blue ocean'],
  W3: ['1602264985195-52b338cb937b', 'mikedoherty', 'Humpback whale leaping from the sea'],
  // Food
  X1: ['1696071506684-98cc784a89df', 'tvieso', 'Clay pot of golden seafood stew on a restaurant table'],
  // Food, drink & street extras (Unsplash)
  E1: ['1725161377393-bab6d1fe2b7b', 'trintaycinco', 'A caipirinha raised against the sea on a Brazilian beach'],
  E2: ['1613478223460-f448a4de829d', 'mateusz_feliksik', 'Caipirinha with fresh limes and mint'],
  E3: ['1558030006-450675393462', 'emersonvieira', 'Sliced Brazilian grilled beef on a wooden board'],
  E4: ['1614119068601-483274e9dcb7', 'mattconnor', 'Steak searing over a charcoal grill'],
  E5: ['1783408355989-3ffdad30709c', 'e4xtream', 'Fresh coconut with a straw on the beach at sunset'],
  E6: ['1619088238956-6245b3c5e6a8', 'budkoolga', 'A fresh coconut held up against a turquoise sea'],
  E7: ['1784601376040-f906be868d50', 'haileytong', 'A colorful market stall piled with tropical fruit'],
  E8: ['1514944288352-fffac99f0bdf', 'kiyoshi_jpg', 'Grilled prawns on skewers'],
  E9: ['1762631882900-e3174bada2ed', 'joestudios', 'Shrimp cooked with tomatoes and herbs in a pan'],
  R1: ['1708397671739-9cf9a3e210eb', 'michaeldouglas', 'Cobblestone street in Salvador’s historic center'],
  R2: ['1708397586120-4a748e7f6594', 'michaeldouglas', 'Cobbled lane lined with colonial buildings in Salvador'],
  R3: ['1708397832199-f7917247db06', 'michaeldouglas', 'People walking past colorful colonial buildings in Salvador'],
  R5: ['1647181670582-544d7ff83b0a', 'stevasc', 'Colorful shopfronts along a sloping street in Salvador'],
  DR1: ['1710987584061-562ba3df7bb6', 'mahboba', 'Costumed performers at a street celebration in Brazil'],
  DR2: ['1518886849533-2a7b825fe852', 'pauloinfante', 'Close-up of a traditional drum'],
  // ---- Our own photos (Liis & Gleb), enhanced in tools/enhance-photo.js ----
  LG_boats: ['/photos/beach-boats-palms.jpg', 'Liis Peetermann', 'Colorful fishing boats resting under coconut palms on a Bahia beach'],
  LG_waves: ['/photos/turquoise-waves.jpg', 'Liis Peetermann', 'Turquoise waves rolling onto a quiet Bahia beach'],
  LG_green: ['/photos/green-water-beach.jpg', 'Liis Peetermann', 'Clear green water and soft golden sand'],
  LG_umbrella: ['/photos/beach-umbrella-view.jpg', 'Liis Peetermann', 'The view from under our rented beach umbrella'],
  LG_chairs: ['/photos/beach-umbrella-chairs.jpg', 'Liis Peetermann', 'Rented umbrella and plastic chairs, set up for a full beach day'],
  LG_woodboats: ['/photos/wooden-boats-sand.jpg', 'Liis Peetermann', 'Wooden fishing boats pulled up on the sand on a cloudy morning'],
  LG_fisher: ['/photos/fisherman-gear.jpg', 'Liis Peetermann', 'A local fisherman sorting his gear on the beach'],
  LG_rocks: ['/photos/low-tide-rocks.jpg', 'Liis Peetermann', 'Rocks and tide pools revealed at low tide'],
  LG_facade: ['/photos/colonial-facade.jpg', 'Liis Peetermann', 'A weathered colonial façade — worn, warm and full of soul'],
  LG_streetart: ['/photos/street-art-building.jpg', 'Liis Peetermann', 'Street art covering an old building'],
  LG_doce: ['/photos/market-doce-de-leite.jpg', 'Liis Peetermann', 'Doce de leite, cheeses and sweets piled high at a Brazilian market'],
  LG_stall: ['/photos/market-stall.jpg', 'Liis Peetermann', 'A packed traditional market stall'],
  LG_burger: ['/photos/burger-beer.jpg', 'Liis Peetermann', 'Burger, fries and an ice-cold beer at a beach bar'],
  LG_groceries: ['/photos/groceries-cart.jpg', 'Liis Peetermann', 'A shopping cart full of groceries for a week of cooking'],
  LG_crates: ['/photos/beer-crates-cart.jpg', 'Liis Peetermann', 'A cart stacked with crates of empty beer bottles outside a street bar'],
  LG_breakfast: ['/photos/breakfast-papaya.jpg', 'Liis Peetermann', 'Pousada breakfast with fresh papaya, coffee and juice'],
  LG_fishboat: ['/photos/fishing-boat-clear-water.jpg', 'Liis Peetermann', 'A fishing boat bobbing in clear water off a sunny beach'],
  LG_bluebeach: ['/photos/wide-blue-beach.jpg', 'Liis Peetermann', 'A wide, empty beach under a deep blue sky'],
  LG_lowtide: ['/photos/palm-beach-low-tide.jpg', 'Liis Peetermann', 'Low tide on a palm-backed beach'],
  LG_fruitstall: ['/photos/fruit-cocktail-stall.jpg', 'Liis Peetermann', 'A tropical fruit cocktail stall glowing at night'],
  LG_coast: ['/photos/green-coast-rocks.jpg', 'Liis Peetermann', 'Green coastline and a rocky shore under a moody sky'],
  LG_stew: ['/photos/seafood-stew-pot.jpg', 'Liis Peetermann', 'A clay pot of seafood stew'],
  LG_selfie: ['/photos/liis-gleb-selfie.jpg', 'Liis Peetermann', 'Liis and Gleb, the travelers behind TravelBahia'],
  LG_cheers: ['/photos/cheers-drinks.jpg', 'Liis Peetermann', 'Cheers with two cocktails'],
  LG_leaves: ['/photos/red-tropical-leaves.jpg', 'Liis Peetermann', 'Bright red tropical leaves in a pousada garden'],
  LG_jungle: ['/photos/jungle-window.jpg', 'Liis Peetermann', 'A window framing lush jungle green'],
  LG_street: ['/photos/village-street-dusk.jpg', 'Liis Peetermann', 'A quiet village street at dusk'],
  LG_beef: ['/photos/beef-salad-home-cooked.jpg', 'Liis Peetermann', 'Brazilian beef and a fresh salad we cooked ourselves'],
  LG_lane: ['/photos/sandy-lane-luggage.jpg', 'Liis Peetermann', 'Wheeling our bags down a sandy, car-free lane'],
  LG_tideout: ['/photos/tide-out-beach.jpg', 'Liis Peetermann', 'The tide pulled far out on a wide, quiet beach'],
  LG_driftwood: ['/photos/driftwood-beach.jpg', 'Liis Peetermann', 'A driftwood tree on a wild beach'],
  LG_room: ['/photos/pousada-room-view.jpg', 'Liis Peetermann', 'Our room opening onto a view of the sea and trees'],
  LG_caipview: ['/photos/caipirinha-view.jpg', 'Liis Peetermann', 'A caipirinha with a view over the jungle and the sea'],
  LG_produce: ['/photos/fresh-produce-prep.jpg', 'Liis Peetermann', 'Fresh produce chopped for dinner'],
  LG_caips: ['/photos/caipirinhas-pair.jpg', 'Liis Peetermann', 'Two caipirinhas in the late afternoon'],
  LG_mango: ['/photos/mango-fruit-plate.jpg', 'Liis Peetermann', 'A plate of ripe mango and tropical fruit'],
  LG_hills: ['/photos/hills-beach-low-tide.jpg', 'Liis Peetermann', 'Green hills meeting the beach at low tide'],
  LG_couple: ['/photos/liis-gleb-beach.jpg', 'Liis Peetermann', 'Liis and Gleb on the beach'],
  LG_shrimp: ['/photos/shrimp-pineapple.jpg', 'Liis Peetermann', 'Shrimp served in a hollowed-out pineapple'],
  LG_lunch: ['/photos/lunch-with-view.jpg', 'Liis Peetermann', 'Lunch on a terrace above the trees'],
  LG_cacao1: ['/photos/gleb-cacao-cup.jpg', 'Liis Peetermann', 'Gleb drinking from a cacao-pod cup in front of local art'],
  LG_cacao2: ['/photos/liis-cacao-cup.jpg', 'Liis Peetermann', 'Liis sipping from a cacao-pod cup'],
  LG_bags: ['/photos/craft-bags.jpg', 'Liis Peetermann', 'Handmade bags in a craft shop'],
  LG_cushions: ['/photos/hammocks-cushions.jpg', 'Liis Peetermann', 'Colorful hammocks and woven cushions'],
  LG_hammocks: ['/photos/hammocks-market.jpg', 'Liis Peetermann', 'Hammocks hanging in a craft market'],
  // ---- More of our photos ----
  LG_tree: ['/photos/giant-tree-square.jpg', 'Liis Peetermann', 'A giant old tree shading a city square'],
  LG_tables: ['/photos/umbrellas-tables-beach.jpg', 'Liis Peetermann', 'Beach umbrellas and tables set up on the sand'],
  LG_boats2: ['/photos/boats-cloudy-beach.jpg', 'Liis Peetermann', 'Colorful fishing boats on the beach under a cloudy sky'],
  LG_beachtree: ['/photos/beach-under-tree.jpg', 'Liis Peetermann', 'Shade under a beach tree, with boats resting on the sand'],
  LG_beachboat: ['/photos/beach-boat-shore.jpg', 'Liis Peetermann', 'A quiet stretch of beach with a boat at the water’s edge'],
  LG_beers: ['/photos/beers-night-table.jpg', 'Liis Peetermann', 'Ice-cold beers on a sidewalk table at night'],
  LG_foodtruck: ['/photos/food-truck-night.jpg', 'Liis Peetermann', 'A street food truck lit up at night'],
  LG_snack: ['/photos/street-snack.jpg', 'Liis Peetermann', 'A Brazilian street snack, eaten on the go'],
  LG_liistree: ['/photos/liis-big-tree-night.jpg', 'Liis Peetermann', 'Liis beneath a huge tree on an evening walk'],
  LG_cheese: ['/photos/market-cheese-sweets.jpg', 'Liis Peetermann', 'Cheeses and sweets at a market counter'],
  LG_fair: ['/photos/street-fair-palms.jpg', 'Liis Peetermann', 'A busy street fair under tall palm trees'],
  LG_fruittree: ['/photos/fruit-laden-tree.jpg', 'Liis Peetermann', 'A tropical tree heavy with fruit'],
  LG_kiosk: ['/photos/beach-kiosk-palms.jpg', 'Liis Peetermann', 'A beach kiosk under the palms'],
  LG_oldstreet: ['/photos/old-street-night.jpg', 'Liis Peetermann', 'Old façades along a quiet street at night'],
  LG_square: ['/photos/town-square-night.jpg', 'Liis Peetermann', 'A town square in the evening'],
  LG_bar: ['/photos/bar-table-drinks.jpg', 'Liis Peetermann', 'Drinks on the table at a local bar'],
  LG_lowtide2: ['/photos/low-tide-boats.jpg', 'Liis Peetermann', 'Boats waiting in the shallows at low tide'],
  LG_shopstreet: ['/photos/shop-street-night.jpg', 'Liis Peetermann', 'A street of small shops after dark'],
  LG_glebbar: ['/photos/gleb-street-bar.jpg', 'Liis Peetermann', 'Gleb at a sidewalk bar in the evening'],
  LG_townlights: ['/photos/beach-town-lights.jpg', 'Liis Peetermann', 'The lights of a beach town at night'],
  LG_hibiscus: ['/photos/hibiscus-flower.jpg', 'Liis Peetermann', 'A hibiscus flower in a tropical garden'],
  LG_dusk: ['/photos/jungle-beach-dusk.jpg', 'Liis Peetermann', 'Jungle meeting the beach as the light fades'],
  LG_meal: ['/photos/restaurant-meal.jpg', 'Liis Peetermann', 'A Brazilian restaurant meal to share'],
  LG_juice: ['/photos/juice-shop-night.jpg', 'Liis Peetermann', 'A juice and snack shop open late'],
  LG_boutique: ['/photos/clothing-boutique.jpg', 'Liis Peetermann', 'Colorful beachwear in a local boutique'],
  LG_bagshelves: ['/photos/bags-shelves.jpg', 'Liis Peetermann', 'Shelves of handmade bags'],
  LG_hangbags: ['/photos/hanging-bags.jpg', 'Liis Peetermann', 'Woven and embroidered bags hanging in a craft shop'],
  LG_pillows: ['/photos/printed-cushions.jpg', 'Liis Peetermann', 'Printed cushions in bold tropical patterns'],
  LG_ceramics: ['/photos/crafts-ceramics.jpg', 'Liis Peetermann', 'Handmade ceramics and crafts'],
  LG_textiles: ['/photos/textiles-shop.jpg', 'Liis Peetermann', 'Stacks of colorful textiles in a shop'],

};

/* ---------- which photo goes where ---------- */
const PHOTO_ASSIGN = {
  home: { hero: 'M2', storyBg: 'LG_boats', ourLens: ['LG_couple', 'LG_bluebeach', 'LG_shrimp', 'LG_facade', 'LG_fruitstall', 'LG_waves', 'LG_fisher', 'LG_caipview', 'LG_hammocks', 'LG_lowtide'] },
  underwater: ['U1', 'U4', 'U8', 'C2', 'U5', 'W2', 'U3', 'U9'],
  destinations: {
    'salvador': { photo: 'S3', card: 'S4', gallery: ['S4', 'LG_facade', 'S8', 'S6', 'LG_boats', 'LG_streetart', 'S2', 'S5', 'LG_fisher', 'S7', 'LG_waves', 'S10', 'S9', 'DR2', 'LG_green'] },
    'morro-de-sao-paulo': { photo: 'M4', card: 'M7', gallery: ['M7', 'LG_lane', 'M8', 'LG_jungle', 'M5', 'LG_tideout', 'U3', 'LG_hills', 'LG_driftwood', 'LG_lowtide2', 'LG_dusk', 'LG_townlights', 'LG_bluebeach'] },
    'chapada-diamantina': { photo: 'C6', card: 'C2', gallery: ['C2', 'C5', 'C7', 'C3', 'C4', 'C1'] },
    'itacare': { photo: 'I3', card: 'I5', gallery: ['I5', 'I1', 'J3', 'I6', 'J4'] },
    'praia-do-forte': { photo: 'F3', card: 'U5', gallery: ['U5', 'F1', 'U6', 'F4', 'F2'] },
    'trancoso': { photo: 'T2', card: 'T4', gallery: ['T4', 'T1', 'T3'] },
    'boipeba': { photo: 'B1', card: 'B1', gallery: ['B3', 'B2', 'B4'] },
    'marau-peninsula': { photo: 'U3', card: 'M3', gallery: ['M3', 'U8', 'U10'] },
    'abrolhos': { photo: 'W1', card: 'W2', gallery: ['W2', 'W3', 'U10'] },
  },
  articles: {
    'beach-day-in-bahia-like-a-local': { photo: 'LG_bluebeach', inline: [], gallery: ['LG_chairs', 'LG_tables', 'LG_woodboats', 'LG_boats2', 'LG_beachtree', 'LG_beachboat', 'LG_kiosk', 'LG_rocks', 'LG_green'] },
    'brazil-by-bus-leito': { photo: 'LG_lane', inline: ['LG_street', 'LG_coast'] },
    'markets-bargaining-prices-brazil': { photo: 'LG_hammocks', inline: [], gallery: ['LG_fair', 'LG_cheese', 'LG_cushions', 'LG_hangbags', 'LG_bagshelves', 'LG_pillows', 'LG_ceramics', 'LG_textiles', 'LG_boutique'] },
    'is-bahia-safe-for-american-tourists': { photo: 'S1', inline: [], gallery: ['LG_street', 'LG_tree', 'LG_oldstreet', 'LG_square', 'LG_shopstreet', 'LG_liistree'] },
    'salvador-to-morro-de-sao-paulo': { photo: 'F4', inline: ['M4', 'LG_lane'] },
    'brazil-visa-for-us-citizens': { photo: 'S10', inline: ['S8'] },
    'best-time-to-visit-bahia': { photo: 'LG_waves', inline: ['W2', 'LG_tideout'] },
    'natural-pools-bahia': { photo: 'U1', inline: [], gallery: ['U6', 'U2', 'U9', 'U10', 'B3', 'M3'] },
    'chapada-diamantina-hiking-guide': { photo: 'C5', inline: ['C2', 'C7', 'C6'] },
    'what-to-eat-in-bahia': { photo: 'LG_shrimp', inline: [], gallery: ['E1', 'E4', 'E8', 'E7', 'LG_stew', 'LG_meal', 'LG_burger', 'LG_snack', 'LG_foodtruck', 'LG_juice', 'LG_breakfast', 'LG_beers', 'LG_bar', 'LG_cheers', 'LG_caips'] },
    'bahia-10-day-itinerary': { photo: 'M8', inline: ['LG_facade', 'M7', 'C6'] },
  },
  stays: {
    'where-to-stay-morro-de-sao-paulo': { photo: 'M1', hotelPhotos: ['LG_jungle', 'LG_breakfast', 'LG_leaves'] },
    'best-boutique-hotels-salvador': { photo: 'LG_boats', hotelPhotos: ['LG_facade'] },
  },
  about: { hero: 'M7', couple: 'LG_couple', portrait: 'LG_selfie', gallery: ['LG_cacao2', 'LG_cacao1', 'LG_caipview', 'LG_shrimp', 'LG_fishboat', 'LG_fruitstall', 'LG_lunch', 'LG_leaves', 'LG_glebbar', 'LG_hibiscus', 'LG_fruittree', 'LG_liistree'] },
};

/* ---------- photos placed right after a specific section (by its heading) ----------
   One key = full-width photo, two keys = side-by-side pair. */
const SECTION_PHOTOS = {
  // articles
  'beach-day-in-bahia-like-a-local': {
    'How Bahians do the beach': ['LG_waves'],
    'Umbrellas, chairs and barracas: what to pay': ['LG_umbrella'],
    'What to eat and drink on the sand': ['E5'],
    'Floating bars and beach entertainment': ['LG_kiosk'],
    'Tides change everything': ['LG_lowtide'],
    'Sea safety: currents, waves and flags': ['LG_coast'],
    'Keep your belongings safe': ['U1'],
  },
  'brazil-by-bus-leito': {
    'Why take the bus in Brazil': ['LG_coast'],
    'Key routes from Salvador': ['C6'],
    'Stops along the way': ['LG_street'],
    'Safety on the road': ['LG_lane'],
  },
  'markets-bargaining-prices-brazil': {
    'Street fairs and markets': ['LG_fair'],
    'How bargaining works': ['LG_bags'],
    'What to buy': ['LG_pillows'],
    'What things cost': ['LG_stall'],
    'A note on how streets look': ['LG_facade'],
  },
  'is-bahia-safe-for-american-tourists': {
    'Salvador: neighborhood by neighborhood': ['R3'],
    'The Pelourinho, day and night': ['S4'],
    'Getting around': ['R1'],
    'Beach and ocean safety': ['LG_umbrella'],
    'Carnival safety': ['DR1'],
    'Worn streets are not the same as unsafe': ['LG_street'],
  },
  'salvador-to-morro-de-sao-paulo': {
    'Option 1: Catamaran (direct)': ['M2'],
    'Option 2: Semi-terrestre (boat + road + speedboat)': ['F4'],
    'Option 3: Fly': ['M4'],
    'Arriving: the TUPA fee and porters': ['LG_lane'],
  },
  'brazil-visa-for-us-citizens': { 'Who needs it': ['S8'] },
  'best-time-to-visit-bahia': {
    'Bahia’s seasons at a glance': ['LG_bluebeach'],
    'Festivals worth planning around': ['DR1'],
    'Whale season': ['W2'],
    'Chapada Diamantina’s seasons': ['C6'],
    'Tides matter more than you think': ['M5'],
  },
  'natural-pools-bahia': {
    '1. Taipu de Fora, Maraú Peninsula': ['U3'],
    '2. Moreré, Boipeba': ['B3'],
    '4. Terceira and Quarta Praia, Morro de São Paulo': ['M5'],
    '5. Papa-Gente, Praia do Forte': ['U5'],
    '7. Praia do Espelho, near Trancoso': ['U8'],
    'Snorkeling etiquette and safety': ['U4'],
  },
  'chapada-diamantina-hiking-guide': {
    'Getting there': ['C1'],
    'Morro do Pai Inácio': ['C6'],
    'Cachoeira da Fumaça': ['C3'],
    'Poço Azul and Poço Encantado': ['C7'],
    'Caves, rivers and swimming holes': ['C2'],
    'Cachoeira do Buracão': ['C5'],
    'The Vale do Pati trek': ['C4'],
  },
  'what-to-eat-in-bahia': {
    'Why we cooked so much': ['E3'],
    'Fried cheese on the beach': ['E6'],
    'Acarajé and moqueca': ['X1'],
    'More Bahian dishes to order': ['E9'],
    'Beer is everywhere — and for good reason': ['LG_crates'],
    'Caipirinha, Pitu and Catuaba: our verdict': ['E2'],
    'Non-alcoholic favorites': ['LG_juice'],
  },
  'bahia-10-day-itinerary': {
    'Day 1: Arrive in Salvador': ['S1'],
    'Day 2: The historic center': ['R2'],
    'Day 3: Bonfim, Ribeira and the Dique': ['S10'],
    'Day 4: Salvador → Morro de São Paulo': ['M2'],
    'Days 5–7: Morro, Boipeba and the pools': ['M7'],
    'Days 8–10, Option A: Chapada Diamantina': ['C6'],
    'Days 8–10, Option B: Itacaré': ['I5'],
  },
  // destinations
  'salvador': {
    'Why visit Salvador': ['R5'],
    'The Pelourinho and historic center': ['R2'],
    'Elevador Lacerda and the Lower City': ['S2'],
    'Bonfim, Ribeira and the bay': ['S10'],
    'Barra, the lighthouse and the beaches': ['LG_boats'],
    'Rio Vermelho: food and nightlife': ['DR1'],
    'Day trips from Salvador': ['S9'],
    'Staying safe in Salvador': ['R1'],
  },
  'morro-de-sao-paulo': {
    'Getting there and the island fee': ['LG_lane'],
    'The beaches, one by one': ['M8'],
    'The island boat tour (volta à ilha)': ['U3'],
    'Other things to do': ['LG_caipview'],
  },
  'chapada-diamantina': { 'Top experiences': ['C2'], 'Getting there': ['C1'] },
  'itacare': { 'Best beaches': ['I1'], 'Surfing': ['I5'], 'Waterfalls, rivers and cacao': ['J3'] },
  'praia-do-forte': { 'Projeto TAMAR': ['U5'], 'Natural pools and beaches': ['F1'] },
  'trancoso': { 'The Quadrado': ['T4'], 'Praia do Espelho': ['T2'] },
  'boipeba': { 'Don’t miss': ['B3'] },
  'marau-peninsula': { 'Highlights': ['M3'] },
  'abrolhos': { 'Whale watching': ['W3'], 'Diving and park rules': ['U10'] },
};

const PH = (() => {
  const isLocal = (src) => src.startsWith('/');
  const url = (key, w = 1600, h) => {
    const p = PHOTOS[key];
    if (!p) throw new Error('Unknown photo key ' + key);
    if (isLocal(p[0])) return p[0];
    return `https://images.unsplash.com/photo-${p[0]}?auto=format&fit=crop&w=${w}${h ? `&h=${h}` : ''}&q=78`;
  };
  const srcset = (key) => isLocal(PHOTOS[key][0]) ? `${PHOTOS[key][0].replace('/photos/', '/photos/sm/')} 1000w, ${PHOTOS[key][0]} 1800w` : [640, 1080, 1600, 2400].map((w) => `${url(key, w)} ${w}w`).join(', ');
  const alt = (key) => PHOTOS[key][2];
  const credit = (key) => {
    const [id, handle] = PHOTOS[key];
    return isLocal(id) ? `Photo: ${handle}` : `Photo: <a href="https://unsplash.com/@${handle}?utm_source=travelbahia&amp;utm_medium=referral" rel="noopener" target="_blank">@${handle}</a> / <a href="https://unsplash.com/?utm_source=travelbahia&amp;utm_medium=referral" rel="noopener" target="_blank">Unsplash</a>`;
  };
  // attach assignments to content objects
  const H = PHOTO_ASSIGN;
  DESTINATIONS.forEach((d) => Object.assign(d, H.destinations[d.slug]));
  DESTINATIONS.concat(ARTICLES).forEach((x) => { x.sectionPhotos = SECTION_PHOTOS[x.slug] || {}; });
  ARTICLES.forEach((a) => Object.assign(a, H.articles[a.slug]));
  STAYS.forEach((s) => Object.assign(s, H.stays[s.slug]));
  return { url, srcset, alt, credit };
})();
