export type NavItem = { num: string; title: string; desc: string; target: string; image: string; caption: string };

/** Sections of the homepage, in order. `target` is the section id. */
export const NAV: NavItem[] = [
  { num: '01', title: 'Το Καράβι', desc: 'Άυλη κληρονομιά', target: 'karavi', image: '/images/boat-nets.jpg', caption: 'Το καράβι με τα δίχτυα του' },
  { num: '02', title: 'Αίθουσες', desc: 'Οι έξι ενότητες', target: 'halls', image: '/images/hut-water.jpg', caption: 'Το λούρο, η καλύβα των ψαράδων' },
  { num: '03', title: 'Δράσεις', desc: 'Πολιτισμός · περιβάλλον · εκπαίδευση', target: 'events', image: '/images/reeds-fore.jpg', caption: 'Καλαμιές της όχθης' },
  { num: '04', title: 'Βίντεο', desc: 'ΕΡΤ3 · ERTflix · Astra', target: 'cinema', image: '/images/fisher-castle-bw.jpg', caption: 'ΕΡΤ3 · Το Καράβι της Κάρλας' },
  { num: '05', title: 'Αρχείο', desc: 'Φωτογραφίες ανά κατηγορία', target: 'archive', image: '/images/fisher-bw.jpg', caption: 'Από το φωτογραφικό αρχείο' },
  { num: '06', title: 'Επίσκεψη', desc: 'Κανάλια Μαγνησίας', target: 'visit', image: '/images/boat-reeds.jpg', caption: 'Ελάτε από κοντά' },
];
