// Content model for the homepage. Mirrors the Sanity schemas in /studio/schemas.
// `fallbackContent` is used until NEXT_PUBLIC_SANITY_PROJECT_ID is set, and as a safety net if a query fails.

export type Img = { src: string; alt: string; width?: number; height?: number };

export type ArchiveCategory = 'karavi' | 'fishing' | 'louro' | 'drainage';
export type EventCategory = 'culture' | 'environment' | 'education';

export type SiteSettings = {
  phone: string;
  phoneDisplay: string;
  mobile: string;
  mobileDisplay: string;
  email: string;
  address: string;
  coords: string;
  hours: string | null;
  admission: string | null;
  virtualTourUrl: string;
  facebook: string;
  youtube: string;
};

export type Hero = { image: Img; video: string | null; caption: string; intro: string; credit: string | null };
export type Exhibit = { title: string; image: Img };
export type Hall = { kicker: string; title: string; text: string; image: Img };
export type EventItem = { title: string; category: EventCategory; date: string; image: Img; href: string };
export type Video = { title: string; meta: string; image: Img; youtubeId: string | null; href: string | null };
export type ArchivePhoto = { caption: string; year: string; category: ArchiveCategory; photographer: string | null; image: Img; height: number };

export type ManifestoSegment = { kind: 'text'; text: string } | { kind: 'image'; image: Img };

export type HomeContent = {
  settings: SiteSettings;
  hero: Hero;
  manifesto: ManifestoSegment[];
  exhibits: Exhibit[];
  halls: Hall[];
  events: EventItem[];
  videos: Video[];
  archive: ArchivePhoto[];
};

export const archiveCategoryLabel: Record<ArchiveCategory, string> = {
  karavi: 'Το Καράβι',
  fishing: 'Ψάρεμα',
  louro: 'Λούρα',
  drainage: 'Αποξήρανση',
};

export const eventCategoryLabel: Record<EventCategory, string> = {
  culture: 'Πολιτισμός',
  environment: 'Περιβάλλον',
  education: 'Εκπαίδευση',
};

const i = (name: string, alt: string): Img => ({ src: `/images/${name}.jpg`, alt });

const IMG = {
  lake: i('lake-sunset', 'Η λίμνη Κάρλα με λούρα και καλαμιές, ζωγραφιά από την έκθεση'),
  fisher: i('fisher-bw', 'Ψαράς με κοντάρι πάνω στο καράβι, ασπρόμαυρη φωτογραφία'),
  nets: i('boat-nets', 'Το καράβι της Κάρλας με τα δίχτυα του, στα καλάμια'),
  castle: i('fisher-castle-bw', 'Ψαράς πάνω σε πλατσίδα στη λίμνη'),
  ropes: i('boat-reeds', 'Σχοινιά και δίχτυα στην πλώρη του καραβιού'),
  hut: i('hut-detail', 'Λούρο, η καλαμένια καλύβα των ψαράδων'),
  sunset: i('sunset-sky', 'Βουνά και ηλιοβασίλεμα πάνω από τη λίμνη'),
  reeds: i('reeds-fore', 'Καλαμιές και το καράβι με το νούμερο 1'),
  hutWater: i('hut-water', 'Λούρο πάνω σε νησάκι μέσα στο νερό'),
  boatWater: i('boat-water', 'Η βάρκα με το νούμερο 1 στο νερό'),
  fisherCrop: i('fisher-crop', 'Ψαράς στη λίμνη, ασπρόμαυρη φωτογραφία'),
};

export const fallbackContent: HomeContent = {
  settings: {
    phone: '+302421058659',
    phoneDisplay: '24210 58659',
    mobile: '+306977334733',
    mobileDisplay: '697 733 4733',
    email: 'kemevo@yahoo.gr',
    address: 'Κανάλια Μαγνησίας, 385 00',
    coords: '39.5009°N · 22.8852°E',
    hours: null,
    admission: null,
    virtualTourUrl: 'https://orbix360.com/4gInIqrn0',
    facebook: 'https://www.facebook.com/mouseiokarlas1',
    youtube: 'https://www.youtube.com/@user-nq9mf5md5s',
  },
  hero: {
    image: { src: '/images/museum-poster.jpg', alt: 'Η λίμνη Κάρλα με πουλιά και νησίδες, πρώτο πλάνο της ταινίας του μουσείου' },
    // Drop the museum film in /public/videos/museum.mp4 (from boebes-karla.gr/wp-content/uploads/2022/06/museum.mp4).
    video: '/videos/museum.mp4',
    caption: 'Μέσα στο μουσείο · Κανάλια Μαγνησίας',
    credit: 'Βίντεο: Δημήτρης Βουρβούλιας',
    intro: 'Μια λίμνη χάθηκε το 1962. Ό,τι κράτησε, οι βάρκες, τα λούρα, οι φωνές των ψαράδων, το φυλάμε εδώ.',
  },
  manifesto: [
    { kind: 'text', text: 'Ένα μουσείο' },
    { kind: 'image', image: IMG.nets },
    { kind: 'text', text: 'για μια λίμνη που χάθηκε το 1962' },
    { kind: 'image', image: IMG.fisher },
    { kind: 'text', text: 'και για τους ανθρώπους της, που ζούσαν εννιά μήνες τον χρόνο στο νερό.' },
    { kind: 'image', image: IMG.hutWater },
    { kind: 'text', text: 'Φυλάμε τα καράβια, τα κατίκια, τις φωτογραφίες και τις φωνές τους.' },
  ],
  exhibits: [
    { title: 'Το Καράβι', image: IMG.nets },
    { title: 'Ο ψαράς', image: IMG.fisher },
    { title: 'Το λούρο', image: IMG.hutWater },
    { title: 'Η Βοιβηίς', image: IMG.sunset },
    { title: 'Η πλατσίδα', image: IMG.castle },
    { title: 'Δίχτυα', image: IMG.ropes },
    { title: 'Η βάρκα «1»', image: IMG.boatWater },
    { title: 'Οι καλαμιές', image: IMG.reeds },
    { title: 'Αρχείο', image: IMG.fisherCrop },
    { title: 'Κατίκια', image: IMG.hut },
    { title: 'Η λίμνη', image: IMG.lake },
    { title: 'Στο νερό', image: IMG.castle },
  ],
  halls: [
    { kicker: 'Ισόγειο', title: 'Η ζωή στα λούρα', text: 'Αντίγραφο καλύβας, ομοιώματα ψαράδων και οι τρόποι ψαρέματος μέσα σε νερό.', image: IMG.hutWater },
    { kicker: 'Κεντρική αίθουσα', title: 'Το Καράβι', text: 'Η πλατσίδα με τα εργαλεία της, φτιαγμένη στο χέρι με τις μεθόδους του καραβομαραγκού.', image: IMG.nets },
    { kicker: 'Φυσική ιστορία', title: 'Τα πουλιά', text: '143 είδη καταγράφηκαν στη λίμνη: πελεκάνοι, ερωδιοί, φλαμίνγκο, ίβιδες.', image: IMG.reeds },
    { kicker: 'Φωτογραφίες', title: 'Λέτσιος · Τλούπας', text: 'Οι φωτογράφοι που κράτησαν τη λίμνη πριν την αποξήρανση, μαζί με τη Βούλα Παπαϊωάννου.', image: IMG.fisher },
    { kicker: 'Ιστορία & μυθολογία', title: 'Η αποξήρανση', text: 'Χάρτες, άδειες αλιείας, εφημερίδες και οι δύο μακέτες: η λίμνη πριν και μετά.', image: IMG.lake },
    { kicker: 'Παιδικό εργαστήρι', title: 'Μικροί ψαράδες', text: 'Ιστορίες, παιχνίδια και κατασκευές για τη ζωή στη λίμνη.', image: IMG.hut },
  ],
  events: [
    { title: 'Ημερίδα: Το Καράβι της Λίμνης Κάρλας', category: 'culture', date: '13.12.2026', image: IMG.nets, href: '#' },
    { title: 'Το Καράβι της Κάρλας στην ΕΡΤ3', category: 'culture', date: '02.12.2025', image: IMG.castle, href: '#' },
    { title: 'Διαγωνισμός φωτογραφίας άγριας ζωής «Αγλαΐα Τσεκούρα»', category: 'environment', date: '25.05.2022', image: IMG.reeds, href: '#' },
    { title: 'Πρόγραμμα καλοκαιριού στο μουσείο', category: 'education', date: '07.08.2022', image: IMG.hutWater, href: '#' },
    { title: 'Κάρλα — Ιστορίες της λίμνης', category: 'environment', date: '19.03.2022', image: IMG.sunset, href: '#' },
    { title: 'Εκπαιδευτικές δράσεις για σχολεία', category: 'education', date: '26.01.2022', image: IMG.hut, href: '#' },
    { title: 'Βιβλιοπαρουσίαση «Η Λιμνονεραϊδούλα και οι φίλοι της»', category: 'education', date: '06.09.2021', image: IMG.boatWater, href: '#' },
  ],
  videos: [
    { title: 'Το Καράβι της Κάρλας, άυλη πολιτιστική κληρονομιά', meta: 'ΕΡΤ3 · 12.2025', image: IMG.castle, youtubeId: null, href: 'https://www.ertnews.gr/ert3/to-karavi-tis-karlas-ayli-politistiki-klironomia/' },
    { title: 'Κώδικας Μυστηρίων: ο Ήταυρος της λίμνης', meta: 'Astra · 06.2022', image: IMG.ropes, youtubeId: null, href: null },
    { title: 'Από πέτρα και χρόνο: στη λίμνη Κάρλα', meta: 'ERTflix', image: IMG.sunset, youtubeId: null, href: null },
    { title: 'Μια μέρα στα λούρα', meta: 'Εκπαίδευση · 01.2022', image: IMG.hutWater, youtubeId: null, href: null },
    { title: 'Ζω — Αποδράσεις: αφιέρωμα στην Κάρλα', meta: 'Έντυπο · 05.2022', image: IMG.reeds, youtubeId: null, href: null },
  ],
  archive: [
    { caption: 'Ψαράς με κοντάρι', year: '1958', category: 'fishing', photographer: null, image: IMG.fisher, height: 300 },
    { caption: 'Το καράβι στα καλάμια', year: '2021', category: 'karavi', photographer: 'ΚΕ.ΜΕ.ΒΟ.', image: IMG.nets, height: 220 },
    { caption: 'Λούρο στο νερό', year: '1950s', category: 'louro', photographer: null, image: IMG.hutWater, height: 260 },
    { caption: 'Πλατσίδα', year: '1960', category: 'karavi', photographer: null, image: IMG.castle, height: 180 },
    { caption: 'Καλαμιές', year: '2022', category: 'drainage', photographer: null, image: IMG.reeds, height: 320 },
    { caption: 'Στο νερό', year: '1955', category: 'fishing', photographer: null, image: IMG.fisherCrop, height: 340 },
    { caption: 'Η βάρκα «1»', year: '1962', category: 'karavi', photographer: null, image: IMG.boatWater, height: 200 },
    { caption: 'Κατίκια', year: '1950s', category: 'louro', photographer: null, image: IMG.hut, height: 240 },
    { caption: 'Δίχτυα', year: '2021', category: 'fishing', photographer: null, image: IMG.ropes, height: 330 },
    { caption: 'Η λίμνη', year: '1940s', category: 'drainage', photographer: null, image: IMG.lake, height: 210 },
    { caption: 'Βοιβηίς', year: '1950s', category: 'drainage', photographer: null, image: IMG.sunset, height: 190 },
    { caption: 'Η επιστροφή', year: '1959', category: 'fishing', photographer: null, image: IMG.fisher, height: 260 },
  ],
};
