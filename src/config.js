/* Site-wide settings. Edit these first. */
const CONFIG = {
  domain: 'https://travelbahia.com',
  name: 'TravelBahia',
  tagline: 'The American traveler’s guide to Bahia, Brazil',
  description: 'Independent travel guides to Bahia, Brazil for U.S. travelers: Salvador, Morro de São Paulo, Chapada Diamantina, Itacaré and more — with honest safety tips, itineraries and hand-picked pousadas.',
  locale: 'en_US',
  lang: 'en-US',
  // Replace with the real author once you share your story — E-E-A-T matters for Google and AI answers.
  author: {
    name: 'Liis & Gleb',
    url: '/about/',
    bio: 'We’re Liis and Gleb — travelers drawn to warm seas, wild jungle and places with soul. Bahia keeps pulling us back with its glass-clear water, rainforest rolling down to the sand, and a rhythm you feel in every street.',
  },
  social: { instagram: '', pinterest: '', youtube: '', tiktok: '' },
  // Set when ready: Google Search Console / Bing verification, analytics id
  verification: { google: '', bing: '' },
  // Analytics: fill in ONE of these, then run ./build.sh
  //   ga4: Google Analytics 4 measurement ID, e.g. 'G-ABC123XYZ' (free)
  //   plausibleDomain: 'travelbahia.com' if you use Plausible (paid, cookie-free)
  analytics: { ga4: 'G-3GJC96P347', plausibleDomain: '' },
  // Exchange rate used to show US$ next to every R$ price (update when it moves; source: Banco Central / market rate)
  usdRate: 5.93,
  usdRateDate: 'November 2026',
  // FTC-compliant affiliate disclosure (U.S. audience)
  affiliateDisclosure: 'Some links on this page are affiliate links. If you book through them we may earn a commission at no extra cost to you. We only recommend places we would stay ourselves.',
  nav: [
    ['Destinations', '/destinations/'],
    ['Journal', '/blog/'],
    ['Where to Stay', '/stays/'],
    ['Safety', '/blog/is-bahia-safe-for-american-tourists/'],
    ['About', '/about/'],
  ],
};
