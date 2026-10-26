import { defineArrayMember, defineField, defineType } from 'sanity';

const image = (name: string, title: string) =>
  defineField({
    name,
    title,
    type: 'image',
    options: { hotspot: true },
    fields: [defineField({ name: 'alt', title: 'Εναλλακτικό κείμενο (για ανθρώπους με προβλήματα όρασης)', type: 'string', validation: (r) => r.required() })],
  });

const siteSettings = defineType({
  name: 'siteSettings',
  title: 'Ρυθμίσεις & επικοινωνία',
  type: 'document',
  fields: [
    defineField({ name: 'phone', title: 'Τηλέφωνο (για κλήση, π.χ. +302421058659)', type: 'string' }),
    defineField({ name: 'phoneDisplay', title: 'Τηλέφωνο (όπως εμφανίζεται)', type: 'string' }),
    defineField({ name: 'mobile', title: 'Κινητό (για κλήση)', type: 'string' }),
    defineField({ name: 'mobileDisplay', title: 'Κινητό (όπως εμφανίζεται)', type: 'string' }),
    defineField({ name: 'email', title: 'Email', type: 'string' }),
    defineField({ name: 'address', title: 'Διεύθυνση', type: 'string' }),
    defineField({ name: 'coords', title: 'Συντεταγμένες (κείμενο)', type: 'string' }),
    defineField({ name: 'hours', title: 'Ωράριο', type: 'string' }),
    defineField({ name: 'admission', title: 'Είσοδος / τιμές', type: 'string' }),
    defineField({ name: 'virtualTourUrl', title: 'Virtual tour (Orbix360)', type: 'url' }),
    defineField({ name: 'facebook', title: 'Facebook', type: 'url' }),
    defineField({ name: 'youtube', title: 'YouTube', type: 'url' }),
  ],
});

const exhibit = defineType({
  name: 'exhibit',
  title: 'Έκθεμα',
  type: 'document',
  fields: [defineField({ name: 'title', title: 'Τίτλος', type: 'string', validation: (r) => r.required() }), image('image', 'Εικόνα')],
});

const hall = defineType({
  name: 'hall',
  title: 'Αίθουσα',
  type: 'document',
  fields: [
    defineField({ name: 'kicker', title: 'Ετικέτα (π.χ. Κεντρική αίθουσα)', type: 'string' }),
    defineField({ name: 'title', title: 'Τίτλος', type: 'string', validation: (r) => r.required() }),
    defineField({ name: 'text', title: 'Περιγραφή', type: 'text', rows: 3 }),
    image('image', 'Εικόνα'),
  ],
});

const homePage = defineType({
  name: 'homePage',
  title: 'Αρχική σελίδα',
  type: 'document',
  groups: [{ name: 'hero', title: 'Hero', default: true }, { name: 'body', title: 'Ενότητες' }],
  fields: [
    { ...image('heroImage', 'Εικόνα hero (και poster του βίντεο)'), group: 'hero' },
    defineField({ name: 'heroVideo', title: 'Βίντεο hero (mp4, βουβό loop, ≤ 6 MB)', type: 'file', options: { accept: 'video/mp4' }, group: 'hero' }),
    defineField({ name: 'heroCaption', title: 'Ετικέτα πάνω από τον τίτλο', type: 'string', group: 'hero' }),
    defineField({ name: 'heroIntro', title: 'Σύντομο κείμενο', type: 'text', rows: 2, group: 'hero' }),
    defineField({ name: 'heroCredit', title: 'Δημιουργός βίντεο / φωτογραφίας', type: 'string', group: 'hero' }),
    defineField({
      name: 'manifesto',
      title: 'Μανιφέστο (κείμενο με μικρές εικόνες ανάμεσα)',
      type: 'array',
      group: 'body',
      of: [
        defineArrayMember({ name: 'manifestoText', title: 'Κείμενο', type: 'object', fields: [defineField({ name: 'text', type: 'string' })], preview: { select: { title: 'text' } } }),
        defineArrayMember({ name: 'manifestoImage', title: 'Εικόνα', type: 'object', fields: [image('image', 'Εικόνα')], preview: { select: { media: 'image' }, prepare: ({ media }) => ({ title: 'Εικόνα', media }) } }),
      ],
    }),
    defineField({ name: 'exhibits', title: 'Εκθέματα της «αίθουσας» (WebGL)', type: 'array', group: 'body', of: [defineArrayMember({ type: 'reference', to: [{ type: 'exhibit' }] })] }),
    defineField({ name: 'halls', title: 'Αίθουσες (coverflow)', type: 'array', group: 'body', of: [defineArrayMember({ type: 'reference', to: [{ type: 'hall' }] })] }),
  ],
  preview: { prepare: () => ({ title: 'Αρχική σελίδα' }) },
});

const activity = defineType({
  name: 'activity',
  title: 'Δράση',
  type: 'document',
  fields: [
    defineField({ name: 'title', title: 'Τίτλος', type: 'string', validation: (r) => r.required() }),
    defineField({ name: 'slug', title: 'Slug', type: 'slug', options: { source: 'title' } }),
    defineField({ name: 'category', title: 'Κατηγορία', type: 'string', options: { list: [{ title: 'Πολιτισμός', value: 'culture' }, { title: 'Περιβάλλον', value: 'environment' }, { title: 'Εκπαίδευση', value: 'education' }], layout: 'radio' }, validation: (r) => r.required() }),
    defineField({ name: 'date', title: 'Ημερομηνία', type: 'date' }),
    image('image', 'Εξώφυλλο'),
    defineField({ name: 'body', title: 'Κείμενο', type: 'array', of: [{ type: 'block' }, { type: 'image', options: { hotspot: true } }] }),
    defineField({ name: 'media', title: 'Σχετικά βίντεο / άρθρα', type: 'array', of: [defineArrayMember({ type: 'reference', to: [{ type: 'mediaItem' }] })] }),
  ],
  orderings: [{ title: 'Νεότερες', name: 'dateDesc', by: [{ field: 'date', direction: 'desc' }] }],
});

const mediaItem = defineType({
  name: 'mediaItem',
  title: 'Βίντεο / ΜΜΕ',
  type: 'document',
  fields: [
    defineField({ name: 'title', title: 'Τίτλος', type: 'string', validation: (r) => r.required() }),
    defineField({ name: 'type', title: 'Είδος', type: 'string', options: { list: [{ title: 'Βίντεο', value: 'video' }, { title: 'Τηλεοπτική εκπομπή', value: 'tv' }, { title: 'Άρθρο', value: 'article' }, { title: 'Έντυπο', value: 'publication' }] } }),
    defineField({ name: 'outlet', title: 'Μέσο (π.χ. ΕΡΤ3)', type: 'string' }),
    defineField({ name: 'date', title: 'Ημερομηνία', type: 'date' }),
    defineField({ name: 'youtubeId', title: 'YouTube ID (μόνο το id)', type: 'string' }),
    defineField({ name: 'url', title: 'Σύνδεσμος πηγής', type: 'url' }),
    image('image', 'Μικρογραφία'),
  ],
});

const archiveCategory = defineType({
  name: 'archiveCategory',
  title: 'Κατηγορία αρχείου',
  type: 'document',
  fields: [
    defineField({ name: 'title', title: 'Τίτλος', type: 'string' }),
    defineField({ name: 'key', title: 'Κλειδί', type: 'string', options: { list: ['karavi', 'fishing', 'louro', 'drainage', 'museum'] } }),
  ],
});

const archivePhoto = defineType({
  name: 'archivePhoto',
  title: 'Φωτογραφία αρχείου',
  type: 'document',
  fields: [
    image('image', 'Φωτογραφία'),
    defineField({ name: 'caption', title: 'Λεζάντα', type: 'string', validation: (r) => r.required() }),
    defineField({ name: 'year', title: 'Έτος ή δεκαετία', type: 'string' }),
    defineField({ name: 'category', title: 'Κατηγορία', type: 'reference', to: [{ type: 'archiveCategory' }] }),
    defineField({ name: 'photographer', title: 'Φωτογράφος', type: 'string' }),
    defineField({ name: 'donor', title: 'Δωρητής', type: 'string' }),
    defineField({ name: 'wide', title: 'Πανοραμική', type: 'boolean' }),
    defineField({ name: 'orderRank', title: 'Σειρά', type: 'number' }),
  ],
  preview: { select: { title: 'caption', subtitle: 'year', media: 'image' } },
});

export const schemaTypes = [siteSettings, homePage, exhibit, hall, activity, mediaItem, archiveCategory, archivePhoto];
