export type NavItem = { num: string; title: string; desc: string; href: string; image: string; caption: string };

/** Site pages, in menu order. */
export const NAV: NavItem[] = [
  { num: '01', title: 'Το Μουσείο', desc: 'Στο παλιό σινεμά των Καναλίων', href: '/mouseio', image: '/images/archive/a11.webp', caption: 'Ο παλιός κινηματογράφος των Καναλίων' },
  { num: '02', title: 'Το Καράβι', desc: 'Άυλη κληρονομιά · σε 3D', href: '/karavi', image: '/images/karavi-exhibit.webp', caption: 'Το καράβι στην κεντρική αίθουσα' },
  { num: '03', title: 'Η ζωή στην Κάρλα', desc: 'Βοιβηίς · Κάρλα · Βάλτος', href: '/zoi', image: '/images/lake-sunset.jpg', caption: 'Η λίμνη και τα λούρα' },
  { num: '04', title: 'Δράσεις', desc: 'Πολιτισμός · περιβάλλον · εκπαίδευση', href: '/draseis', image: '/images/archive/a07.webp', caption: 'Ομιλία στην αίθουσα του μουσείου' },
  { num: '05', title: 'Αρχείο', desc: 'Φωτογραφίες ανά κατηγορία', href: '/archive', image: '/images/archive/a06.webp', caption: 'Από το φωτογραφικό αρχείο' },
  { num: '06', title: 'Σύνδεσμοι', desc: 'Ρεπορτάζ · κανάλια', href: '/syndesmoi', image: '/images/fisher-bw.jpg', caption: 'Η λίμνη σήμερα' },
];
