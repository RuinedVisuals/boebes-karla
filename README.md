# Μουσείο Λιμναίου Πολιτισμού Κάρλας — website

Νέο site του [boebes-karla.gr](https://boebes-karla.gr): Next.js 15 (App Router) · TypeScript · SCSS modules · GSAP + ScrollTrigger · Lenis · raw WebGL · Sanity. Deploy στο Vercel.

Σχεδιαστική ιδέα: **«Κατάλογος Νο 1»**. Το site είναι στημένο σαν κατάλογος έκθεσης, με κάθε έκθεμα, αίθουσα, δράση και βίντεο αριθμημένο, όπως το «1» στην πλώρη του Καραβιού της Κάρλας.

## Ξεκίνημα

```bash
npm install
npm run dev        # http://localhost:3000
npm run build && npm start
```

Χωρίς ρυθμίσεις, το site τρέχει με τα τοπικά δεδομένα του `src/lib/content.ts`. Για Sanity, αντιγράψτε το `.env.example` σε `.env.local` και συμπληρώστε το `NEXT_PUBLIC_SANITY_PROJECT_ID`.

## Δομή

```
src/
  app/
    layout.tsx            γραμματοσειρές (self-hosted, ελληνικά + λατινικά), metadata
    page.tsx              η αρχική: συνθέτει τις ενότητες
    globals.scss          reset, CSS variables, a11y (μέγεθος γραμμάτων, αντίθεση, χωρίς κίνηση)
    api/revalidate/       webhook του Sanity → ανανέωση περιεχομένου
  styles/                 _tokens.scss · _mixins.scss · _wave.scss (το κύμα των μεταβάσεων)
  components/
    providers/Experience  Lenis + GSAP ticker, page transitions, μενού, ρυθμίσεις προσβασιμότητας
    layout/               Nav · Menu (WebGL) · Cover (κουρτίνα μετάβασης) · Cursor · Footer
    sections/             Hero · Manifesto · No1 · Hall · Halls · Events · Cinema · Archive · Visit
    ui/                   Button · Icon · SplitChars · Lightbox · VideoModal
  webgl/                  gl.ts (μικρό toolkit) · hall.ts (κοίλη αίθουσα) · menuStage.ts
  lib/                    content.ts (τύποι + τοπικά δεδομένα) · nav.ts · gsap.ts · useDragInertia.ts · sanity/
studio/                   Sanity Studio (ξεχωριστό package): schemas για όλο το περιεχόμενο
public/images/            προσωρινές εικόνες από τα posters της έκθεσης
```

Κάθε component έχει δικό του `*.module.scss`, που φορτώνει τα `tokens` και τα `mixins` (`@use 'tokens' as *;`).

## Ενότητες αρχικής

| Ενότητα | Τι κάνει | Τεχνική |
|---|---|---|
| Hero | Εικόνα ή βουβό βίντεο σε όλη την οθόνη, τίτλος που αποκαλύπτεται γράμμα-γράμμα | ScrollTrigger parallax, κουμπί παύσης για το βίντεο |
| Manifesto | Οι λέξεις φωτίζονται με το scroll, με εικόνες μέσα στο κείμενο | ScrollTrigger scrub + stagger |
| Νο 1 | Bento για το Καράβι (άυλη κληρονομιά) | CSS grid |
| Η αίθουσα | Κοίλη αίθουσα εκθεμάτων: σύρσιμο, αδράνεια, λύγισμα με την ταχύτητα | WebGL, χωρίς βιβλιοθήκη |
| Αίθουσες | 3D coverflow των αιθουσών του μουσείου | CSS 3D + `useDragInertia` |
| Δράσεις | Αριθμημένη λίστα με φίλτρα και εικόνα που ακολουθεί τον κέρσορα | `gsap.quickTo` |
| Βίντεο | Καρφωμένη ενότητα: τα βίντεο περνούν οριζόντια με το scroll | ScrollTrigger pin + scrub |
| Αρχείο | Ατελείωτος «φωτεινός πίνακας» με φίλτρα, lightbox | GSAP ticker |
| Επίσκεψη | Τηλέφωνο, ώρες, οδηγίες, virtual tour | — |

Μενού σε πλήρη οθόνη: ανοίγει και κλείνει με το κύμα και αλλάζει εικόνα σε WebGL στο hover. Κάθε εσωτερικό link παίζει την κινηματογραφική μετάβαση (κύμα → τίτλος → κύμα).

## Προσβασιμότητα

- `prefers-reduced-motion` **και** διακόπτης «Χωρίς κίνηση» στο μενού: χωρίς Lenis, χωρίς WebGL κίνηση, χωρίς custom cursor, χωρίς μεταβάσεις.
- Μέγεθος γραμμάτων A / A+ / A++ και υψηλή αντίθεση, αποθηκευμένα τοπικά.
- Κάθε overlay (μενού, lightbox, βίντεο) κλείνει με Esc και επιστρέφει το focus εκεί που ήταν. Skip link, `aria-live` στους μετρητές.
- Το custom cursor εμφανίζεται μόνο με ποντίκι (`pointer: fine`).
- Όταν δεν υπάρχει WebGL, η αίθουσα γίνεται λωρίδα εικόνων και το μενού δείχνει απλή εικόνα.

## Sanity

```bash
cd studio && npm install && SANITY_STUDIO_PROJECT_ID=xxxx npm run dev
```

Τύποι περιεχομένου: `siteSettings`, `homePage` (hero, βίντεο, μανιφέστο, εκθέματα, αίθουσες), `exhibit`, `hall`, `activity`, `mediaItem`, `archiveCategory`, `archivePhoto`. Ό,τι λείπει από το Sanity συμπληρώνεται από τα τοπικά δεδομένα, ώστε η σελίδα να μη μένει ποτέ άδεια.

Webhook: `POST https://<site>/api/revalidate?secret=<SANITY_REVALIDATE_SECRET>`.

## Εκκρεμότητες περιεχομένου

- Πραγματικές φωτογραφίες στη θέση των αποσπασμάτων από τα posters, λεζάντες για τις 14 φωτογραφίες του αρχείου, και βίντεο για το hero (mp4, βουβό loop).
- YouTube IDs για τα βίντεο ΜΜΕ.
- Ωράριο και τιμές εισόδου.
- Επιβεβαίωση των τηλεφώνων: τα `tel:` links του παλιού site δεν ταιριάζουν με τα νούμερα που εμφανίζονται.
- Εσωτερικές σελίδες (`/karavi`, `/draseis/[slug]`, `/archeio`, `/periigisi`) και αγγλική έκδοση.
