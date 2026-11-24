/* Destinations. Photos are assigned in src/photos.js.
   `imagePrompt` is a ready-to-use prompt for a photoreal AI image generator.
   Facts, prices and rules researched November 2026 (see each guide's "checked" note). */
const DESTINATIONS = [
  /* ------------------------------------------------------------------ */
  {
    slug: 'salvador',
    name: 'Salvador',
    region: 'Bay of All Saints',
    featured: true,
    tagline: 'Brazil’s first capital, where Africa, Europe and the tropics meet',
    description: 'Salvador, Bahia travel guide for Americans: the Pelourinho, Elevador Lacerda, Bonfim church, Farol da Barra, Rio Vermelho, beaches, 2026 entry prices, where to stay, safety, day trips and how many days you need.',
    geo: { lat: -12.9777, lng: -38.5016 },
    map: { x: 528, y: 372, labelLeft: true },
    imagePrompt: 'Golden hour over Salvador Bahia, pastel colonial facades of Pelourinho on a cliff, Elevador Lacerda, Bay of All Saints with sailboats, cinematic wide angle, 35mm, ultra detailed, warm light',
    quick: { best: 'Sep–Mar (dry & sunny)', days: '3–5 days', airport: 'SSA – Salvador International', vibe: 'Culture, music, food, history' },
    intro: 'Salvador is the soul of Bahia. Founded in 1549 as Brazil’s first capital, it is the most African city in the Americas — you hear it in the drums, taste it in acarajé fried in palm oil, and see it in the baroque churches and candy-colored mansions of the Pelourinho, a UNESCO World Heritage Site since 1985. The city sits on a cliff above the Bay of All Saints, split into an Upper City and a Lower City, and most U.S. visitors start their Bahia trip here.',
    sections: [
      { h: 'Why visit Salvador', html: '<p>Few cities pack this much into one walk. In a single afternoon you can wander the cobbled squares of the Pelourinho, ride the 1873 Elevador Lacerda down to the waterfront, browse the Mercado Modelo and catch the boat to an island. Evenings belong to live samba-reggae, sunset at Farol da Barra and moqueca in Rio Vermelho. In Bahia there are drummers on the streets every day, and the performances are amazing — follow the sound.</p>' },
      { h: 'The Pelourinho and historic center', html: '<p>The Upper City’s historic heart is a maze of pastel façades, baroque churches and squares — the Terreiro de Jesus, Largo do Pelourinho and Largo do Cruzeiro de São Francisco. Allow at least half a day.</p><ul><li><strong>Catedral Basílica</strong> (Terreiro de Jesus): Jesuit-built in the 1600s, 13 altars; around R$10.</li><li><strong>Igreja do Rosário dos Pretos:</strong> the blue church built by Black brotherhoods; small contribution of about R$5.</li><li><strong>Casa do Carnaval da Bahia:</strong> a lively museum of Salvador’s Carnival; around R$20, free on Wednesdays.</li><li><strong>Fundação Casa de Jorge Amado:</strong> the beloved Bahian novelist’s foundation, on the Largo do Pelourinho.</li><li><strong>Igreja e Convento de São Francisco:</strong> famous for its gold-leaf interior, but <strong>closed since a ceiling collapse in February 2025</strong>, with reopening expected around 2029 — admire the façade.</li><li><strong>Balé Folclórico da Bahia:</strong> an outstanding Afro-Brazilian dance show in a small theater (around R$100, evenings several days a week — book ahead).</li></ul>' },
      { h: 'Elevador Lacerda and the Lower City', html: '<p>The art deco <strong>Elevador Lacerda</strong> (72 m) links the Upper City’s Praça Tomé de Souza with the Lower City in about 30 seconds. It reopened in February 2025 after renovation and now costs <strong>R$1 per ride</strong>. The upper platform is a free viewpoint — come before sunset. At the bottom are the <strong>Mercado Modelo</strong> craft market (free, about 9am–6pm Mon–Sat, shorter Sundays) and the Terminal Náutico for boats to the islands. Watch your belongings in this busy area.</p>' },
      { h: 'Bonfim, Ribeira and the bay', html: '<ul><li><strong>Igreja do Senhor do Bonfim:</strong> Salvador’s most beloved church (free). Tie a colorful <em>fita</em> to the railings, make three wishes, and wear one on your wrist until it falls off. The Lavagem do Bonfim procession takes place on the second Thursday of January.</li><li><strong>Ribeira:</strong> a laid-back waterfront neighborhood famous for its ice cream.</li><li><strong>Solar do Unhão / MAM-BA:</strong> a colonial estate turned modern art museum, free, with one of the best sunsets over the bay.</li><li><strong>Dique do Tororó:</strong> a lake with giant sculptures of Orixás rising from the water (free).</li></ul>' },
      { h: 'Barra, the lighthouse and the beaches', html: '<p>The <strong>Farol da Barra</strong>, at the tip of the peninsula, is one of the oldest lighthouses in the Americas; its fort houses the Museu Náutico (R$20). At sunset, locals gather on the walls and applaud as the sun drops into the bay. Next door, <strong>Porto da Barra</strong> is the city’s calmest, most sheltered beach. Further along the coast are Ondina, Rio Vermelho, Itapuã and Flamengo.</p>' },
      { h: 'Rio Vermelho: food and nightlife', html: '<p>Salvador’s bohemian neighborhood is where locals go out. Queue for acarajé at the stands of the Largo de Santana (around R$15–25), eat moqueca, and bar-hop on the lively streets. On February 2, the Festa de Iemanjá fills the beach with offerings to the sea goddess. See our <a href="/blog/what-to-eat-in-bahia/">Bahia food guide</a>.</p>' },
      { h: 'Day trips from Salvador', html: '<ul><li><strong>Ilha de Itaparica:</strong> passenger launch from the Terminal Náutico (about 40 minutes) or the car ferry from São Joaquim (about 1 hour).</li><li><strong>Bay schooner tours</strong> to Ilha dos Frades and Itaparica: around R$100–180 per person.</li><li><strong>Praia do Forte:</strong> about 1.5 hours north for sea turtles and natural pools. <a href="/destinations/praia-do-forte/">Guide →</a></li><li><strong>Morro de São Paulo:</strong> about 2.5 hours by catamaran — better as an overnight stay. <a href="/destinations/morro-de-sao-paulo/">Guide →</a></li></ul>' },
      { h: 'Where to stay in Salvador', html: '<p><strong>Barra</strong> is the easiest base for first-timers: walkable seafront, beaches, restaurants and quick rides to the historic center. <strong>Ondina</strong> is quieter, with big seafront hotels. <strong>Santo Antônio Além do Carmo</strong> and the <strong>Pelourinho</strong> put you inside the postcard — wonderful by day, best navigated by app ride at night. <strong>Rio Vermelho</strong> suits food lovers and night owls. See our <a href="/stays/best-boutique-hotels-salvador/">Salvador neighborhood guide</a>.</p>' },
      { h: 'Getting around', html: '<p>From the airport (SSA), an app ride or taxi to Barra takes about 25–40 minutes and costs roughly R$70–120. In the city, Uber and 99 are the easiest and safest way to get around; the metro links the airport area with the center but doesn’t reach Barra or the Pelourinho. Wear good shoes — the historic center is steep and cobbled.</p>' },
      { h: 'Staying safe in Salvador', html: '<p>Salvador is a big city with real petty-crime issues, but millions of visitors enjoy it every year with a few habits: keep your phone out of sight on the street, leave jewelry at home, use Uber or 99 after dark instead of walking between neighborhoods, stay on busy, lit streets in the Pelourinho at night, and always ask the price before accepting ribbons or photos. Read the full <a href="/blog/is-bahia-safe-for-american-tourists/">Bahia safety guide</a>.</p><p class="checked">Prices and opening details checked November 2026; confirm on site, as hours and fees change.</p>' },
    ],
    highlights: ['Pelourinho UNESCO center', 'Daily street drummers', 'Elevador Lacerda (R$1)', 'Bonfim ribbons', 'Farol da Barra sunset', 'Acarajé in Rio Vermelho', 'Carnival'],
    faqs: [
      { q: 'How many days do you need in Salvador?', a: 'Three to five days covers the Pelourinho, Barra, Rio Vermelho, the Bonfim church and a day trip on the bay. Add more if you want Praia do Forte or cultural nights like the Balé Folclórico.' },
      { q: 'Is the São Francisco church in Salvador open?', a: 'No. The Igreja e Convento de São Francisco has been closed since a ceiling collapse in February 2025, with reopening expected around 2029. You can still see its façade.' },
      { q: 'How much does the Elevador Lacerda cost?', a: 'R$1 per ride for visitors since its 2025 reopening. The upper platform is a free viewpoint.' },
      { q: 'Do you need to speak Portuguese in Salvador?', a: 'Basic Portuguese helps a lot; English is limited outside upscale hotels. Download Google Translate’s offline Portuguese pack and learn a few phrases like “obrigado/obrigada” (thank you) and “quanto custa?” (how much?).' },
    ],
  },
  /* ------------------------------------------------------------------ */
  {
    slug: 'morro-de-sao-paulo',
    name: 'Morro de São Paulo',
    region: 'Tinharé Island',
    featured: true,
    tagline: 'A car-free island of numbered beaches, natural pools and sunsets',
    description: 'Morro de São Paulo travel guide: how to get there from Salvador, the R$70 TUPA fee, every beach from Primeira to Quinta Praia, the island boat tour, natural pools, Gamboa, the zip line, nightlife, where to stay and prices.',
    geo: { lat: -13.3797, lng: -38.9132 },
    map: { x: 520, y: 402, labelLeft: true },
    imagePrompt: 'Morro de São Paulo Bahia, turquoise natural pools at low tide, coconut palms leaning over white sand, wooden fishing boats, aerial drone view, bright tropical light, ultra realistic',
    quick: { best: 'Sep–Mar; low tide for pools', days: '3–5 days', airport: 'SSA, then catamaran (~2.5 h) or 25-min flight', vibe: 'Beaches, nightlife, relaxed island life' },
    intro: 'Just south of Salvador, on the island of Tinharé, Morro de São Paulo is the Bahia beach escape Americans dream about: no cars, sandy lanes, wheelbarrow porters, a hilltop lighthouse and a string of beaches simply named First, Second, Third, Fourth and Fifth. Days revolve around the tides; nights around caipirinhas on the sand.',
    sections: [
      { h: 'Getting there and the island fee', html: '<p>Take the catamaran from Salvador’s Terminal Náutico (about 2.5 hours, around R$150–175), the calmer semi-terrestre route via Itaparica and Valença (about 3.5–4 hours), or a 25-minute flight. Every visitor pays the <strong>TUPA</strong> preservation fee of <strong>R$70 per person</strong> (since December 2025), at the pier or online in advance. Porters with wheelbarrows carry bags from the pier — agree on the price first. Full details in our <a href="/blog/salvador-to-morro-de-sao-paulo/">Salvador → Morro transport guide</a>.</p>' },
      { h: 'The beaches, one by one', html: '<ul><li><strong>Primeira Praia</strong> (about 5 minutes from the village): small and lively, with gentle waves for beginner surfers.</li><li><strong>Segunda Praia</strong> (about 10 minutes): the social heart — beach bars by day and luaus at night.</li><li><strong>Terceira Praia</strong> (about 15 minutes): calmer, family-friendly water and natural pools at low tide; many boat tours leave from here.</li><li><strong>Quarta Praia</strong> (about 25 minutes): long, wide and peaceful, with the best natural pools on very low tides.</li><li><strong>Quinta Praia / Praia do Encanto</strong> (about 50 minutes at low tide): nearly empty, and the best spot for kitesurfing (June–August).</li><li><strong>Gamboa:</strong> across the hill, a quiet village with cliffs of natural clay for mud baths and a lovely sunset.</li></ul>' },
      { h: 'The island boat tour (volta à ilha)', html: '<p>The classic day out: about 8 hours by speedboat around Tinharé, usually 9am to 5pm, for around <strong>R$350 per person</strong>. Stops include snorkeling in the <strong>Garapuá</strong> natural pools (about 45 minutes), <strong>Moreré</strong> on Boipeba (lunch stop — usually not included), the colonial town of <strong>Cairu</strong> with its 1600s Franciscan convent, and <strong>Praia Bela</strong> on Boipeba. The pools depend on low tide, so check the tide before booking. Children under 5 typically go free.</p>' },
      { h: 'Other things to do', html: '<ul><li><strong>Sunset at the Forte de Tapirandu</strong> (1630s fort, free) — arrive an hour early for a spot.</li><li><strong>Zip line</strong> from near the fort over Primeira Praia: about R$30–50, ages 7 and up.</li><li><strong>Climb to the lighthouse</strong> (free) for the view over the beaches.</li><li><strong>Garapuá by 4x4:</strong> about R$130 per person for 5 hours with stops at the pools.</li><li><strong>Snorkeling and diving:</strong> snorkel trips from about R$80–120; a beginner scuba dive at Garapuá around R$300.</li><li><strong>Sunset catamaran:</strong> about R$150–250 per person with drinks.</li><li><strong>Whale watching:</strong> July to October.</li><li><strong>Surf and SUP:</strong> board hire around R$30–50 a day, lessons R$80–150.</li></ul>' },
      { h: 'Nightlife', html: '<p>Segunda Praia is the party beach, with luaus nightly in high season and on weekends the rest of the year, plus bars with live music and sunset drinks around the village. Parties start late; weeknights are quieter outside summer.</p>' },
      { h: 'Where to stay', html: '<p>Stay in the <strong>village center</strong> for value and convenience (expect hills), <strong>Segunda Praia</strong> for nightlife, <strong>Terceira</strong> for calm water and tour departures, or <strong>Quarta</strong> for quiet, spacious beachfront pousadas. Book far ahead for December–February and Carnival. Our <a href="/stays/where-to-stay-morro-de-sao-paulo/">Morro area guide</a> compares them.</p>' },
      { h: 'Money and practical tips', html: '<ul><li>Bring some cash from Salvador — small kiosks, porters and boat vendors are often cash-only.</li><li>Pack light, in soft bags; everything is on foot over sand and hills.</li><li>Rain in May–July can cancel boat trips; plan buffer days.</li><li>Use SPF 50 and take a floating dry bag for beach days.</li><li>Leave Morro 6–8 hours before an international flight.</li></ul><p class="checked">Prices checked November 2026; confirm with operators before booking.</p>' },
    ],
    highlights: ['Car-free village', 'Natural pools at low tide', 'Island boat tour', 'Fort sunset', 'Segunda Praia nightlife', 'Boipeba day trip'],
    faqs: [
      { q: 'How do I get from Salvador to Morro de São Paulo?', a: 'Take the catamaran from Salvador’s Terminal Náutico (about 2.5 hours, around R$150–175), the semi-terrestre route via Itaparica and Valença (about 3.5–4 hours, calmer), or a small plane from Salvador airport (about 25 minutes).' },
      { q: 'How much is the Morro de São Paulo tourist fee?', a: 'The TUPA fee is R$70 per person since December 2025, paid at the pier or online in advance.' },
      { q: 'Which beach is best in Morro de São Paulo?', a: 'Segunda Praia is best for nightlife, Terceira Praia for families and boat tours, and Quarta Praia for long walks and the best natural pools at low tide.' },
      { q: 'How much is the island tour in Morro de São Paulo?', a: 'The full-day volta à ilha boat tour costs around R$350 per person, with stops at Garapuá, Moreré, Boipeba and Cairu. Lunch is usually extra.' },
    ],
  },
  /* ------------------------------------------------------------------ */
  {
    slug: 'chapada-diamantina',
    name: 'Chapada Diamantina',
    region: 'Interior highlands',
    featured: true,
    tagline: 'Table-top mountains, blue caves and Brazil’s wildest waterfalls',
    description: 'Chapada Diamantina guide: how to get there from Salvador, Lençóis vs Vale do Capão, Cachoeira da Fumaça, Morro do Pai Inácio, Poço Azul, Poço Encantado, Buracão, the Vale do Pati, 2026 fees, guides, seasons and safety.',
    geo: { lat: -12.5636, lng: -41.3897 },
    map: { x: 372, y: 340, labelLeft: true },
    imagePrompt: 'Chapada Diamantina Brazil, flat-topped sandstone mesas at sunrise, mist in the valley, tall waterfall, hiker on cliff edge, epic landscape photography, golden light',
    quick: { best: 'Apr–Sep dry season; Dec–Mar fullest falls', days: '4–7 days', airport: 'LEC (Lençóis, Thu & Sun) or 6–7 h by bus', vibe: 'Hiking, caves, swimming holes' },
    intro: 'About 410 km inland from Salvador, the Chapada Diamantina is Bahia’s great outdoors: a national park of sandstone mesas, crystal-clear swimming holes, blue-lit caves and the Cachoeira da Fumaça, a waterfall so tall its water turns to mist before it lands. The old diamond-mining town of Lençóis is the easiest base.',
    sections: [
      { h: 'Top experiences', html: '<ul><li><strong>Morro do Pai Inácio:</strong> a short, steep climb to the park’s most iconic sunset (R$20).</li><li><strong>Cachoeira da Fumaça:</strong> about 2 hours’ hike from Vale do Capão to lie on the rim and peer over a 340–380 m drop — or a 3-day trek to its base.</li><li><strong>Poço Azul &amp; Poço Encantado:</strong> flooded caves where, roughly April to September, sunbeams turn the water electric blue (around R$70 each).</li><li><strong>Vale do Pati:</strong> one of Brazil’s most beautiful multi-day treks, staying in local family homes.</li><li><strong>Cachoeira do Buracão:</strong> swim through a canyon to the foot of an 85 m waterfall (guide mandatory).</li><li><strong>Gruta da Lapa Doce &amp; Pratinha:</strong> a vast show cave and a river-and-cave swimming spot.</li></ul>' },
      { h: 'Where to stay', html: '<p><strong>Lençóis</strong> is the best-equipped base, with the airport, agencies, restaurants and card payments. <strong>Vale do Capão</strong> suits hikers and has a relaxed, alternative vibe (no phone signal in the valley). <strong>Mucugê</strong> is cool and charming and the southern gateway to the Pati, and <strong>Ibicoara</strong> is the base for Buracão.</p>' },
      { h: 'Fees and guides', html: '<p>The national park itself has no gates and no entry fee. Private attractions charge: Pai Inácio R$20, Poço Azul around R$70–100, Poço Encantado around R$70, Pratinha R$90–110, Lapa Doce around R$60–120, Cachoeira do Mosquito around R$60. Guides are mandatory at Buracão and Lapa Doce and strongly recommended elsewhere — trails are unsigned and there’s no signal. Agency day tours from Lençóis run roughly R$250–750 per person.</p>' },
      { h: 'Getting there', html: '<p>Rápido Federal buses run Salvador → Lençóis around 8am, 1pm and 11pm (about 6–7 hours, roughly R$140–280 by class). Azul flies to Lençóis typically on Thursdays and Sundays. Driving takes about 6 hours via the BR-324 and BR-242; drive in daylight. There’s no Uber or public transport to trailheads.</p>' },
      { h: 'When to go and safety', html: '<p>April to September is dry and best for hiking and the blue light; December to March brings fuller waterfalls, storms and flash-flood risk. If a river turns muddy or loud, leave the riverbed immediately. Nights drop to around 10°C in winter. Read our full <a href="/blog/chapada-diamantina-hiking-guide/">Chapada hiking guide</a> for itineraries, packing and safety.</p><p class="checked">Fees checked November 2026; confirm with local operators.</p>' },
    ],
    highlights: ['Morro do Pai Inácio', 'Cachoeira da Fumaça', 'Blue caves', 'Vale do Pati trek', 'Lençóis town', 'Swimming holes'],
    faqs: [
      { q: 'When is the best time to visit Chapada Diamantina?', a: 'April to September is drier and best for hiking and the blue light in Poço Encantado. December to March brings rain but the fullest waterfalls.' },
      { q: 'How far is Chapada Diamantina from Salvador?', a: 'Lençóis is about 410 km (255 miles) from Salvador — roughly 6–7 hours by bus or 6 hours by car. Azul also flies to Lençóis, typically twice a week.' },
      { q: 'Is Chapada Diamantina National Park free?', a: 'Yes, the park is free to enter, but private attractions such as Poço Azul and Pratinha charge fees, and guided tours cost extra.' },
    ],
  },
  /* ------------------------------------------------------------------ */
  {
    slug: 'itacare',
    name: 'Itacaré',
    region: 'Cacao Coast',
    featured: false,
    tagline: 'Surf beaches tucked into the Atlantic rainforest',
    description: 'Itacaré, Bahia guide: how to get there via Ilhéus, every beach from Concha to Jeribucaçu, the Prainha and four-beaches trails, surf lessons, waterfalls, cacao farms, nightlife and safety tips.',
    geo: { lat: -14.2784, lng: -38.9965 },
    map: { x: 538, y: 466, labelLeft: true },
    imagePrompt: 'Itacaré Bahia, jungle covered hills meeting a wild surf beach, surfer riding a wave, lush Atlantic rainforest, bright midday tropical light, aerial photography',
    quick: { best: 'Sep–Mar; surf all year', days: '3–5 days', airport: 'IOS – Ilhéus (about 1–1.5 h)', vibe: 'Surf, rainforest, yoga, adventure' },
    intro: 'Itacaré is where the Atlantic rainforest crashes straight into the surf. A laid-back town with a backpacker-meets-boutique vibe, it is surrounded by jungle-trail beaches, waterfalls and the cacao farms that made southern Bahia famous.',
    sections: [
      { h: 'Getting there', html: '<p>The nearest airport is <strong>Ilhéus (IOS)</strong>, about 70 km away — roughly 1–1.5 hours by transfer, taxi, rental car or regular Rota buses along the paved coast road. From Salvador, fly to Ilhéus in about an hour, or take the ferry to Itaparica and a bus south (about 5–6 hours).</p>' },
      { h: 'Best beaches', html: '<ul><li><strong>Concha:</strong> the town beach, calm water where the Rio de Contas meets the sea — good for families and paddleboarding.</li><li><strong>Resende, Tiririca, Costa and Ribeira:</strong> the urban beaches south of town. Tiririca is the famous surf beach (better for experienced surfers); Ribeira has gentler waves and is where the Prainha trail starts.</li><li><strong>Prainha:</strong> a small bay ringed by jungle and coconut palms, reached by a 40–60 minute trail from Ribeira — arguably the prettiest beach in the region. Only a simple kiosk; bring snacks.</li><li><strong>Engenhoca, Havaizinho, Camboinha and Itacarezinho:</strong> wild beaches off the coast road, linked by the “four beaches” trail (about an hour one way between Engenhoca and Itacarezinho). Engenhoca is the best for beginner surfers.</li><li><strong>Jeribucaçu:</strong> a wild beach where a river meets the sea, about 30 minutes’ walk from the road; best at low tide.</li></ul>' },
      { h: 'Surfing', html: '<p>Itacaré has waves year-round, biggest from May to September. Surf schools run lessons at Engenhoca and Ribeira for around R$80–150; board hire is around R$50 an hour. Beginners should avoid Tiririca on big days.</p>' },
      { h: 'Waterfalls, rivers and cacao', html: '<ul><li><strong>Cleandro waterfall:</strong> reached only by water, paddling through mangroves on the Rio de Contas (half day).</li><li><strong>Tijuípe waterfall:</strong> an 8 m roadside fall with a restaurant, about 30 minutes away (around R$20).</li><li><strong>Cacao farm tours:</strong> visit a cabruca farm where cacao grows under the rainforest canopy and taste bean-to-bar chocolate.</li><li><strong>Boat day to the Maraú Peninsula:</strong> around R$200–300.</li></ul>' },
      { h: 'Nightlife and practical tips', html: '<p>The pedestrian Rua Pedro Longo is lined with restaurants and bars, with live music, forró and pagode most nights. Hike trails in daylight and never alone, use a guide or offline maps (there’s no signal on most trail beaches), and don’t leave bags unattended on remote beaches.</p><p class="checked">Prices checked November 2026; confirm locally.</p>' },
    ],
    highlights: ['Surf lessons', 'Prainha jungle trail', 'Four-beaches trail', 'Cacao farm tour', 'Cleandro waterfall'],
    faqs: [
      { q: 'How do you get to Itacaré?', a: 'Fly to Ilhéus (IOS), about 70 km away, then take a transfer, taxi or Rota bus for about 1–1.5 hours. From Salvador, you can also take the ferry to Itaparica and a bus south.' },
      { q: 'Is Itacaré good for beginner surfers?', a: 'Yes. Engenhoca and Ribeira have mellow waves on smaller days, and many surf schools offer lessons for around R$80–150.' },
    ],
  },
  /* ------------------------------------------------------------------ */
  {
    slug: 'praia-do-forte',
    name: 'Praia do Forte',
    region: 'Coconut Coast',
    featured: false,
    tagline: 'Sea turtles, natural pools and easy luxury an hour from Salvador',
    description: 'Praia do Forte guide: Projeto TAMAR sea turtles (prices and hours), Papa-Gente natural pool, Castelo Garcia d’Ávila, whale watching, resorts and how to get there from Salvador airport.',
    geo: { lat: -12.5794, lng: -38.0006 },
    map: { x: 548, y: 338, labelLeft: true },
    imagePrompt: 'Praia do Forte Bahia, sea turtle swimming in clear turquoise water over reef, palm-fringed beach in background, split-level underwater photo, vibrant',
    quick: { best: 'All year; whales Jul–Oct', days: '2–4 days', airport: 'SSA (about 1 hour by road)', vibe: 'Families, resorts, wildlife' },
    intro: 'Praia do Forte is the easiest beach escape from Salvador’s airport: a charming pedestrian village of boutiques and restaurants, warm natural pools on the reef, and the headquarters of Projeto TAMAR, Brazil’s celebrated sea-turtle conservation program. It is ideal for families and first-time visitors.',
    sections: [
      { h: 'Projeto TAMAR', html: '<p>Brazil’s national sea-turtle program protects nesting beaches along the coast, and its Praia do Forte visitor center lets you see turtles up close, learn about the five species that nest in Brazil and watch feeding times in the afternoon. Tickets were around R$50 for adults in 2025 (with family passes); opening days and hours vary by season, so check tamar.org.br and buy online. From roughly September to March you may see nests and hatchlings on the beaches.</p>' },
      { h: 'Natural pools and beaches', html: '<p>At low tide the reef in front of the village forms warm, shallow pools full of fish — the most famous is <strong>Papa-Gente</strong>, reached on a short raft trip with local operators. Check the tide table and bring a mask. The long beaches north and south of the village are quieter and lined with palms.</p>' },
      { h: 'Castelo Garcia d’Ávila and nature', html: '<p>The ruins of a 16th-century fortified house, one of the oldest Portuguese buildings in Brazil, stand on a hill above the village. Nearby reserves offer walks through restinga forest, and humpback whales pass the coast from roughly July to October — boat trips leave from the village.</p>' },
      { h: 'The village and food', html: '<p>The pedestrian main street, Alameda do Sol, is lined with boutiques, ice-cream shops and restaurants serving moqueca, grilled fish and Bahian dishes. Evenings are relaxed and family-friendly, and the little fishermen’s church on the beach is lovely at sunset.</p>' },
      { h: 'Where to stay', html: '<p>Choose between big all-inclusive beach resorts just outside the village — popular with families — and smaller pousadas within walking distance of the main street. Book ahead for Christmas, New Year, Carnival and July.</p>' },
      { h: 'Getting there', html: '<p>Praia do Forte is about 60 km north of Salvador airport, around an hour by car, transfer or regional bus along the Estrada do Coco / Linha Verde coast road (about 1.5 hours from central Salvador). The village center is pedestrian-only.</p><p class="checked">Prices checked November 2026; confirm on official sites.</p>' },
    ],
    highlights: ['Sea turtles', 'Natural pools', 'Whale watching', 'Pedestrian village', 'Family resorts'],
    faqs: [
      { q: 'How far is Praia do Forte from Salvador airport?', a: 'About 60 km (40 miles), usually around an hour by car or transfer along the coast road.' },
      { q: 'How much is Projeto TAMAR in Praia do Forte?', a: 'Around R$50 for adults in 2025, with family passes available. Check tamar.org.br for current prices and opening days.' },
    ],
  },
  /* ------------------------------------------------------------------ */
  {
    slug: 'trancoso',
    name: 'Trancoso',
    region: 'Discovery Coast',
    featured: false,
    tagline: 'Bohemian chic on a clifftop square above endless beaches',
    description: 'Trancoso, Bahia guide: the Quadrado, Praia do Espelho, Caraíva, Arraial d’Ajuda, how to get there from Porto Seguro, when to go and practical tips.',
    geo: { lat: -16.5906, lng: -39.0963 },
    map: { x: 536, y: 636, labelLeft: true },
    imagePrompt: 'Trancoso Bahia Quadrado, small white colonial church on grassy square at dusk, colorful houses, fairy lights, then red sandstone cliffs and beach, editorial travel photography',
    quick: { best: 'Sep–Mar; New Year is peak', days: '3–5 days', airport: 'BPS – Porto Seguro (about 1 hour)', vibe: 'Boutique, design, romance' },
    intro: 'Trancoso is southern Bahia at its most stylish. Life centers on the Quadrado, a long grassy square of colorful fishermen’s houses turned boutiques and restaurants, with the little white church of São João Batista at its end and a cliff dropping to the beach below.',
    sections: [
      { h: 'The Quadrado', html: '<p>Cars can’t drive on the Quadrado, which makes it a magical place to wander, especially at dusk when lanterns light up the trees and restaurants set tables on the grass. Steps lead down the cliff to the beaches below.</p>' },
      { h: 'Praia do Espelho', html: '<p>One of Brazil’s most beautiful beaches, with reef pools at low tide and red-and-ochre cliffs. It’s about 40 minutes’ drive south of Trancoso, much of it on potholed dirt road; taxis charge roughly R$350–400 for a round trip for up to four. Expect a parking fee and steep steps cut into the cliff. Go at low tide.</p>' },
      { h: 'Caraíva', html: '<p>A car-free river village about an hour further south on dirt roads. You cross the river by canoe (a few reais) into sandy lanes, forró bars and a beach where the river meets the sea. Worth a day — or two.</p>' },
      { h: 'Beaches around Trancoso', html: '<ul><li><strong>Praia dos Nativos and Praia dos Coqueiros:</strong> the beaches right below the Quadrado, with beach clubs and barracas.</li><li><strong>Rio Verde:</strong> where a small river meets the sea, calm and good for families.</li><li><strong>Itapororoca:</strong> long and quiet, backed by cliffs and luxury hideaways.</li><li><strong>Praia do Espelho and Curuípe:</strong> reef pools and colored cliffs further south.</li></ul>' },
      { h: 'Arraial d’Ajuda', html: '<p>Between Porto Seguro and Trancoso, Arraial d’Ajuda is a livelier hilltop village with a pedestrian lane of bars and shops, beautiful beaches such as Pitinga and Mucugê, and a big water park. It’s a good-value alternative base.</p>' },
      { h: 'When to go and where to stay', html: '<p>September to March is the main season. Christmas and New Year are Trancoso’s peak — prices soar and you need to book many months ahead. March to June and August to November are calmer and better value. Stay around the Quadrado to walk to restaurants, or by the beaches for quiet.</p>' },
      { h: 'Getting there', html: '<p>Fly to Porto Seguro (BPS), then drive about an hour via the ferry to Arraial d’Ajuda and the coast road. Ask taxi drivers on the Quadrado about current dirt-road conditions before driving to Espelho or Caraíva; a higher-clearance car helps.</p><p class="checked">Details checked November 2026.</p>' },
    ],
    highlights: ['Quadrado square', 'Praia do Espelho', 'Caraíva', 'Boutique hotels'],
    faqs: [
      { q: 'How do you get to Trancoso?', a: 'Fly to Porto Seguro (BPS), then drive about an hour, crossing by ferry to Arraial d’Ajuda and continuing on the coast road.' },
      { q: 'How far is Praia do Espelho from Trancoso?', a: 'About 24–26 km, roughly 40 minutes by car, much of it on dirt road.' },
    ],
  },
  /* ------------------------------------------------------------------ */
  {
    slug: 'boipeba',
    name: 'Boipeba',
    region: 'Tinharé Archipelago',
    featured: false,
    tagline: 'Morro’s quieter sister — empty beaches and the Moreré pools',
    description: 'Boipeba island guide: Moreré natural pools, Cueira, Ponta dos Castelhanos, getting there from Morro de São Paulo or Salvador, and practical tips.',
    geo: { lat: -13.5738, lng: -38.9318 },
    map: { x: 520, y: 418 },
    imagePrompt: 'Boipeba island Brazil aerial drone shot, emerald natural pools, white sandbar, small wooden boat, coconut palm grove, crystal clear water',
    quick: { best: 'Sep–Mar; low tide', days: '2–3 days', airport: 'SSA, then boat via Valença or Morro', vibe: 'Remote, slow, barefoot' },
    intro: 'If Morro de São Paulo feels busy, hop south to Boipeba: a protected island of sand roads, coconut groves and some of the clearest natural pools in Bahia at Moreré. Most visitors arrive on Morro’s island tour; staying overnight lets you enjoy it after the day-trippers leave.',
    sections: [
      { h: 'Don’t miss', html: '<ul><li><strong>Moreré natural pools</strong> at low tide — snorkel with tropical fish, then eat seafood in the fishing village.</li><li><strong>Praia da Cueira</strong> for grilled lobster on the sand.</li><li><strong>Ponta dos Castelhanos</strong>, known for diving at a historic shipwreck site.</li><li><strong>Velha Boipeba</strong>, the main village, with its river beach and sunset over the mangroves.</li></ul>' },
      { h: 'The beaches', html: '<ul><li><strong>Boca da Barra:</strong> the river-mouth beach by Velha Boipeba, calm water and sunset over the mangroves.</li><li><strong>Tassimirim:</strong> a long, quiet stretch of palms a short walk south of the village.</li><li><strong>Cueira:</strong> wide sand, gentle surf and the famous grilled-lobster barracas.</li><li><strong>Moreré:</strong> a fishing village with the island’s best natural pools offshore at low tide.</li><li><strong>Bainema and Ponta dos Castelhanos:</strong> wild, nearly empty beaches at the island’s far end, best reached by boat or a long walk at low tide.</li></ul>' },
      { h: 'When to go and tides', html: '<p>September to March brings the sunniest weather; April to July is wetter and quieter. Everything on Boipeba revolves around the tide: beach walks between villages and the Moreré pools are only possible around low tide, so check the tide table before planning each day.</p>' },
      { h: 'Practical tips', html: '<ul><li>There are no cars — just sand roads, tractors, boats and your feet.</li><li>Bring enough cash: cards work at many pousadas, but small kiosks and boatmen often take cash only, and ATMs are unreliable.</li><li>Use repellent at dusk near the mangroves.</li><li>Pack light and in soft bags.</li></ul>' },
      { h: 'Getting there', html: '<p>There’s no regular direct boat from Morro to Boipeba; most people visit on the round-the-island tour from Morro (around R$350) or by private transfer. From the mainland, boats run from Valença and Torrinhas. Short local boats link Velha Boipeba with Moreré (around R$15 per person each way). A visitor fee for Boipeba (R$50) has been announced but is currently suspended.</p><p class="checked">Details checked November 2026.</p>' },
    ],
    highlights: ['Moreré pools', 'Cueira lobster', 'Shipwreck diving', 'Car-free island'],
    faqs: [{ q: 'Is Boipeba a day trip from Morro de São Paulo?', a: 'Yes — the full-day island boat tour from Morro stops at Boipeba and Moreré. Staying a night or two lets you enjoy the island after the day-trippers leave.' }],
  },
  /* ------------------------------------------------------------------ */
  {
    slug: 'marau-peninsula',
    name: 'Maraú Peninsula',
    region: 'Barra Grande',
    featured: false,
    tagline: 'Taipu de Fora’s reef pools and a lagoon-laced wilderness',
    description: 'Maraú Peninsula and Barra Grande guide: Taipu de Fora natural pools, Barra Grande’s sandbanks, Lagoa do Cassange, how to get there by boat from Camamu and practical tips.',
    geo: { lat: -13.8919, lng: -38.9467 },
    map: { x: 530, y: 440 },
    imagePrompt: 'Taipu de Fora natural reef pools Maraú Peninsula, aerial view low tide, coral reef patterns, turquoise and emerald water, people snorkeling',
    quick: { best: 'Sep–Mar; low tide days', days: '3–4 days', airport: 'IOS (Ilhéus) or SSA + boat from Camamu', vibe: 'Wild beaches, kitesurf, romance' },
    intro: 'Remote and gloriously undeveloped, the Maraú Peninsula is reached by boat across the Camamu Bay to the village of Barra Grande. Its star is Taipu de Fora, a vast reef that becomes a natural aquarium at low tide — right at the shoreline.',
    sections: [
      { h: 'Highlights', html: '<ul><li><strong>Taipu de Fora:</strong> reef pools that form right at the beach at low tide — no boat needed. Jardineira shuttles or quad bikes from Barra Grande cost around R$25 per person each way.</li><li><strong>Barra Grande’s sandbanks:</strong> about a kilometer offshore, walkable at very low tide or by boat (around R$75–100).</li><li><strong>Lagoa do Cassange:</strong> a freshwater lagoon steps from the ocean.</li><li><strong>Sunset from Ponta do Mutá</strong> at the tip of the peninsula.</li><li><strong>Boat trips</strong> to Moreré and Boipeba (around R$200–250).</li></ul>' },
      { h: 'More beaches on the peninsula', html: '<p>Beyond Taipu de Fora, the peninsula’s ocean side is a string of long, empty beaches: <strong>Taipu de Dentro</strong>, <strong>Algodões</strong> with its calm reef-protected water, <strong>Saquaíra</strong> and <strong>Três Coqueiros</strong>. The bay side faces the islands of the Camamu Bay, one of Brazil’s largest bays, with mangroves and fishing villages.</p>' },
      { h: 'Kitesurfing and activities', html: '<p>Steady winds make the peninsula a kitesurfing spot, especially from around June to September. You can also take boat trips around the Camamu Bay’s islands and waterfalls, paddle in the lagoon, or simply walk for hours on empty sand.</p>' },
      { h: 'When to go', html: '<p>September to March is sunniest. Plan pool days around low tide — the best Taipu de Fora conditions are on very low tides near full and new moons. December–January and Carnival are the busiest weeks in Barra Grande.</p>' },
      { h: 'Getting there', html: '<p>Most travelers reach <strong>Camamu</strong> by road (from Ilhéus or Salvador) and take a speedboat across the bay to Barra Grande — about 30–40 minutes, around R$50–75 per person. A long dirt road also runs from Itacaré. Bring cash; services on the peninsula are limited.</p><p class="checked">Details checked November 2026; check the tide table before pool days.</p>' },
    ],
    highlights: ['Taipu de Fora pools', 'Lagoa do Cassange', 'Kitesurfing', 'Barra Grande village'],
    faqs: [{ q: 'How do I get to Barra Grande?', a: 'Most travelers take a speedboat from Camamu (reachable by road from Salvador or Ilhéus), about 30–40 minutes across the bay for around R$50–75. There is also a dirt road from Itacaré.' }],
  },
  /* ------------------------------------------------------------------ */
  {
    slug: 'abrolhos',
    name: 'Abrolhos',
    region: 'Marine National Park',
    featured: false,
    tagline: 'Humpback whales and Brazil’s first marine park',
    description: 'Abrolhos Marine National Park guide: humpback whale season, boat trips from Caravelas, prices, diving rules, the park fee and the best time to go.',
    geo: { lat: -17.9667, lng: -38.7 },
    map: { x: 610, y: 728, labelLeft: true },
    imagePrompt: 'Humpback whale tail fluke rising out of ocean at golden hour, small islands with lighthouse in background, Abrolhos Brazil, wildlife photography telephoto',
    quick: { best: 'Jul–Nov for whales (peak Aug–Sep)', days: '1–2 days', airport: 'BPS, then road to Caravelas', vibe: 'Wildlife, diving, nature' },
    intro: 'Created in 1983, Abrolhos was Brazil’s first marine national park and is the most important breeding ground for humpback whales in the South Atlantic. Between July and November thousands of whales arrive from Antarctica to mate and give birth in its warm, shallow waters.',
    sections: [
      { h: 'Whale watching', html: '<p>Day boats leave from the municipal pier in <strong>Caravelas</strong>. Shared trips cost around <strong>R$300 per person</strong> (children under about 5 often free), with private charters available. The season runs July to November, with the most whales in August and September. Expect a long day — the archipelago is about 2–3 hours offshore each way — and take seasickness tablets.</p>' },
      { h: 'The archipelago', html: '<p>Abrolhos is a group of five small volcanic islands about 70 km off the coast, surrounded by the largest and richest coral reefs in the South Atlantic. Charles Darwin stopped here aboard the Beagle in 1832. Only Siriba island can be visited on foot, accompanied by park staff; the lighthouse island of Santa Bárbara is used by the Brazilian Navy. The islands are a nesting site for seabirds such as boobies and frigatebirds.</p>' },
      { h: 'Getting to Caravelas', html: '<p>Caravelas, the gateway town, is a few hours’ drive from Porto Seguro (BPS) airport. Most visitors spend a night or two in Caravelas or nearby Prado to fit in a full day at sea. Book whale trips in advance during August and September.</p>' },
      { h: 'Tips for the boat day', html: '<ul><li>Take seasickness medication before departure — the open-ocean crossing can be rough.</li><li>Bring sunscreen, a hat, a windbreaker, water and snacks.</li><li>A zoom lens or binoculars make a big difference for whales.</li><li>Keep your expectations flexible: sightings and island landings depend on weather and wind.</li></ul>' },
      { h: 'Diving and park rules', html: '<p>Diving is excellent year-round, with unique mushroom-shaped coral pillars called <em>chapeirões</em>. Rules are strict: diving only at set sites with a park-trained guide, no fishing, no touching or collecting wildlife, and no gloves or knives. Visitors pay a park fee (higher for foreign visitors) through authorized operators, and trips are canceled in strong winds.</p><p class="checked">Details checked November 2026; confirm with authorized operators in Caravelas.</p>' },
    ],
    highlights: ['Humpback whales', 'Reef diving', 'Remote islands'],
    faqs: [
      { q: 'When can you see whales in Bahia?', a: 'Humpback whales visit Bahia’s coast roughly July to November, peaking in August and September. The best sightings are around Abrolhos, with whale trips also from Praia do Forte, Itacaré and Morro de São Paulo.' },
      { q: 'How much is a whale-watching trip to Abrolhos?', a: 'Shared day trips from Caravelas cost around R$300 per person in 2026, plus the park fee. Private charters cost much more.' },
    ],
  },
];

/* ------------------------------------------------------------------
   Accommodation price guide — nightly rate for a double room, usually with breakfast.
   Researched November 2026 from public listings (Booking.com, Kayak, TripAdvisor listing data,
   hotel guides) and Brazilian travel guides. Mid-range = well-rated pousadas/3–4★ hotels;
   high-end = boutique and luxury stays. Peak weeks run much higher.
   US$ equivalents are added automatically at build time.
   ------------------------------------------------------------------ */
const STAY_PRICES = {
  'salvador': {
    rows: [
      ['Barra & Ondina', 'R$350–600', 'R$700–1,500', 'Seafront hotels; easiest base'],
      ['Rio Vermelho', 'R$350–650', 'R$800–1,800', 'Design hotels near the nightlife'],
      ['Pelourinho & Santo Antônio', 'R$400–800', 'R$1,400–3,500', 'Boutique hotels in colonial mansions; Salvador’s most luxurious addresses are here'],
    ],
    note: 'Citywide, 4-star hotels average around R$700 and 5-star around R$2,100 a night. February (Carnival) is the most expensive month; April–June the cheapest.',
  },
  'morro-de-sao-paulo': {
    rows: [
      ['Village & Segunda Praia', 'R$250–500', 'R$800–1,200', 'Sea-view suites cost the most; expect music at night'],
      ['Terceira Praia', 'R$200–450', 'R$750–1,000', 'Family and boutique pousadas on the sand'],
      ['Quarta Praia', 'R$400–700', 'R$1,000–1,800', 'Eco-pousadas and suites with private terraces and hot tubs'],
    ],
    note: 'The island average is around R$400–460 a night for a double room. Christmas, New Year and Carnival can double prices; book months ahead.',
  },
  'boipeba': {
    rows: [
      ['Velha Boipeba', 'R$250–500', 'R$600–900', 'Village pousadas near the river beach'],
      ['Moreré', 'R$320–600', 'R$900–1,500', 'Bungalows and lodges close to the natural pools'],
    ],
    note: 'Average around R$430 a night. Choice is limited, so book early for summer.',
  },
  'marau-peninsula': {
    rows: [
      ['Barra Grande village', 'R$300–600', 'R$1,200–1,700', 'Walk to restaurants and the boat pier'],
      ['Taipu de Fora & ocean beaches', 'R$400–700', 'R$1,000–1,700', 'Quieter, near the reef pools; you’ll need buggy transfers'],
    ],
    note: 'Good pousadas usually include breakfast. Peak weeks run higher.',
  },
  'itacare': {
    rows: [
      ['Town & Pedro Longo', 'R$250–450', 'R$500–800', 'Walk to bars and the urban beaches'],
      ['Urban beaches (Concha to Ribeira)', 'R$400–550', 'R$600–1,200', 'Pousadas near the surf beaches'],
      ['Coast road resorts', 'R$500–900', 'R$2,000–4,000', 'Luxury eco-resorts in the rainforest'],
    ],
    note: 'In low season, pousadas rated above 8.5 often go for R$200–420.',
  },
  'praia-do-forte': {
    rows: [
      ['Village pousadas', 'R$350–600', 'R$700–800', 'Walk to the main street and TAMAR'],
      ['Beach resorts', 'R$900–1,400', 'R$1,400–2,500', 'Big resorts, often all-inclusive'],
    ],
    note: 'The average village pousada runs around R$340 a night. July and the Christmas holidays are busiest.',
  },
  'trancoso': {
    rows: [
      ['Quadrado', 'R$500–1,000', 'R$1,800–3,000+', 'Boutique pousadas and design hotels around the square'],
      ['Beaches below the village', 'R$450–900', 'R$1,500–3,000', 'Quieter, near Nativos and Coqueiros'],
      ['Caraíva', 'R$300–500', 'R$800–1,200', 'Rustic-chic pousadas in the car-free village'],
    ],
    note: 'April is the cheapest month (around R$370 on average); December averages around R$1,370, and New Year week costs far more.',
  },
  'chapada-diamantina': {
    rows: [
      ['Lençóis', 'R$250–400', 'R$450–900', 'Best-equipped base, walk to restaurants'],
      ['Vale do Capão', 'R$350–550', 'R$600–900', 'Chalets and eco-pousadas near the Fumaça trail'],
      ['Mucugê', 'R$170–350', 'R$400–600', 'Cooler, charming and quieter'],
      ['Vale do Pati homestays', 'about R$100 per person', '—', 'Simple family homes with dinner and breakfast'],
    ],
    note: 'Prices rise in July, around São João and on long weekends.',
  },
};

const STAY_TABLE = (p) => '<div class="phrase-table price-table" role="region" aria-label="Accommodation prices" tabindex="0"><table><thead><tr><th>Area</th><th>Mid-range / night</th><th>High-end / night</th></tr></thead><tbody>' +
  p.rows.map(([area, mid, high, note]) => `<tr><td><strong>${area}</strong><span class="area-note">${note}</span></td><td>${mid}</td><td>${high}</td></tr>`).join('') +
  `</tbody></table></div><p>${p.note} Prices are for a double room per night, usually with breakfast, based on public listings on Booking.com, Kayak and TripAdvisor and local travel guides (November 2026). Expect 1.5–3× higher rates over Christmas, New Year and Carnival.</p>`;

Object.entries(STAY_PRICES).forEach(([slug, p]) => {
  const d = DESTINATIONS.find((x) => x.slug === slug);
  if (!d) return;
  d.sections.splice(d.sections.length - 1, 0, { h: 'What accommodation costs', html: STAY_TABLE(p) });
});
