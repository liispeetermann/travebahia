/* "Where to Stay" guides — the affiliate section.
   Each hotel card with `placeholder: true` renders as a visible "partner slot" and keeps the whole
   page set to noindex until every placeholder is replaced with a real, personally vetted property.
   Affiliate links automatically get rel="sponsored nofollow noopener" and an FTC disclosure. */
const STAYS = [
  {
    slug: 'where-to-stay-morro-de-sao-paulo',
    title: 'Where to Stay in Morro de São Paulo: Which Beach Is Right for You',
    description: 'Where to stay in Morro de São Paulo, Bahia: village center vs Segunda, Terceira and Quarta Praia — which area suits couples, families, nightlife and luxury, plus booking tips.',
    destination: 'morro-de-sao-paulo',
    date: '2026-11-22', updated: '2026-11-24', readMins: 6,
    tldr: 'From refined boutique pousadas to charming guesthouses tucked into the jungle, Morro has a stay for every style. Choose Segunda Praia if you want nightlife on your doorstep, Terceira Praia for the best balance of calm water, restaurants and boat-tour access, and Quarta Praia for quiet, spacious beachfront pousadas. The village center is cheapest but involves steep walks.',
    areas: [
      { name: 'Village center', for: 'Budget & convenience', html: 'Steps from the pier, shops and restaurants. Expect hills and some noise.' },
      { name: 'Segunda Praia', for: 'Nightlife & social travelers', html: 'Beach bars, music and the island’s party scene right outside the door.' },
      { name: 'Terceira Praia', for: 'Couples & families', html: 'Calm, swimmable water, natural pools at low tide and tour departures.' },
      { name: 'Quarta Praia', for: 'Luxury & tranquility', html: 'Long, uncrowded beach with some of the most upscale beachfront pousadas.' },
    ],
    hotels: [], // add partner properties here once agreed (see README)
    faqs: [
      { q: 'What is the best area to stay in Morro de São Paulo?', a: 'Terceira Praia is the best all-round area for most visitors, with calm water, restaurants and easy access to boat tours. Choose Segunda for nightlife and Quarta for quiet luxury.' },
      { q: 'Do I need to book pousadas in advance?', a: 'Yes for December–February, Carnival and Brazilian holidays, when the best beachfront pousadas sell out months ahead.' },
    ],
  },
  {
    slug: 'best-boutique-hotels-salvador',
    title: 'Where to Stay in Salvador: The Best Neighborhoods for Visitors',
    description: 'Where to stay in Salvador, Bahia: Barra vs Pelourinho vs Santo Antônio vs Rio Vermelho — which neighborhood suits first-timers, couples, history lovers and foodies.',
    destination: 'salvador',
    date: '2026-11-21', updated: '2026-11-24', readMins: 6,
    tldr: 'First-timers should stay in Barra for its walkable seafront and easy rides everywhere. Choose Santo Antônio Além do Carmo or the Pelourinho for atmospheric boutique hotels in restored colonial mansions, and Rio Vermelho for food and nightlife.',
    areas: [
      { name: 'Barra', for: 'First-timers', html: 'Seafront promenade, beaches, lighthouse and plenty of restaurants.' },
      { name: 'Santo Antônio Além do Carmo', for: 'Romance & design', html: 'Quiet cobbled streets and boutique pousadas with bay views, minutes from the Pelourinho.' },
      { name: 'Pelourinho', for: 'History lovers', html: 'Sleep inside the UNESCO center. Lively by day; use rides at night.' },
      { name: 'Rio Vermelho', for: 'Foodies & night owls', html: 'Bohemian bars, acarajé stands and live music.' },
    ],
    hotels: [], // add partner properties here once agreed (see README)
    faqs: [
      { q: 'What is the safest area to stay in Salvador?', a: 'Barra and Ondina are generally considered the easiest and safest bases for visitors, with busy seafronts and good restaurants. Use ride-hailing at night wherever you stay.' },
    ],
  },
];
