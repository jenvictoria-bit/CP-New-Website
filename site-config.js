/* =====================================================================
   CAREER PREP HIGH SCHOOL — SITE CONFIG
   ---------------------------------------------------------------------
   Edit this file to control:
     1) Which pages appear in the main menu (and their order)
     2) Which menu items are hidden on specific pages
     3) Which modules appear on each page
     4) The actual copy / images / phone numbers / addresses
   You do NOT need to touch index.html or styles.css to make changes
   to wording, links, or visibility.
   ===================================================================== */

window.siteConfig = {

  /* -----------------------------------------------------------------
     BRAND
     ----------------------------------------------------------------- */
  brand: {
    name: "Career Prep High School",
    logo: "Logoprimary.png",            // FULL-COLOR logo (green mountain + navy wordmark) — for light backgrounds
    logoLight: "logoprimary2.png",      // green mountain + WHITE wordmark — for dark backgrounds (nav, footer)
    logoFallback: "Asset 1@1x (1).png", // black-only fallback
    /* Per-location phone numbers live on the Locations page (resolved by the location finder).
       A single central number is planned for the future — when ready, set centralPhone here
       and any "Call a real person" CTA can be pointed at it instead of the Locations page. */
    centralPhone: null,
    /* The real HubSpot application form — opens in a new tab.
       Update this single field if the form ever moves and every
       "Apply Now" button across the site updates automatically. */
    applyUrl: "https://e7gf1.share.hsforms.com/2LvaC6IToQE-EZJW56VdqvA",
    /* Legacy: a plain mailto fallback. Left null now that the "Send a message"
       button uses the Formspree form below instead of opening a mail client. */
    contactEmail: null,
    contactEmailSubject: "Question about Career Prep High School",
    /* -----------------------------------------------------------------
       "HAVE A QUESTION? SEND A MESSAGE"  (Formspree)
       -----------------------------------------------------------------
       The floating button opens a real form that sends straight from the
       site via Formspree — no mail client needed. Each message is tagged
       with the campus the visitor is viewing + that campus's enrollment
       email so it reaches the right school.

       `endpoint` is the default Formspree form (the central inbox). To make
       a campus's messages deliver DIRECTLY to that campus, create a separate
       Formspree form for it and add its endpoint under `perSchool` keyed by
       slug; anything not listed falls back to `endpoint`. */
    formspree: {
      endpoint: "https://formspree.io/f/xlgknnva",
      perSchool: {
        // "skyway":      "https://formspree.io/f/xxxxxxxx",
        // "black-river": "https://formspree.io/f/xxxxxxxx",
      },
    },
    /* The message form ALSO creates a HubSpot contact (lead capture), so the
       sender lands in the CRM alongside quiz/Apply leads — not just an email.
       It reuses the SAME lead form as the First-Time popup, whose fields are:
         email, firstname, lastname, phone, date_of_birth, audience_type
       Set `leadFormId` to that form's GUID (the same one you put in
       firstTimePopup.hubspotFormId). Until it's set, the contact fields are
       logged to the console and the email still sends via Formspree. */
    hubspot: {
      portalId: "23862493",
      leadFormId: "c3f86f7a-42ce-4f22-8f0a-c4bcb9b05af3",   // same form as firstTimePopup
    },
  },

  /* -----------------------------------------------------------------
     MAIN MENU
     - `visible: false` removes an item from the menu globally
     - `hideOnPages: ['start']` hides it only on those pages
     - `cta: true` styles the item as a primary button
     ----------------------------------------------------------------- */
  menu: [
    /* "Why We're Different" is no longer a standalone top-level item — it now
       lives under Student Life. Kept here (hidden) so #why still routes. */
    { id: "why",          label: "Why We're Different", href: "#why",          visible: false, hideOnPages: [] },
    {
      /* Student Life opens to the Why We're Different page; the old Student Life
         landing page has been retired. */
      id: "student-life", label: "Student Life",        href: "#why",          visible: true,  hideOnPages: [],
      /* Submenu shows on hover (desktop) or expands inline (mobile). */
      submenu: [
        { id: "why",          label: "Why We're Different", href: "#why" },
        { id: "resources",    label: "Resources",           href: "#resources" },
        { id: "faq",          label: "FAQ",                 href: "#faq" },
        { id: "blog",         label: "Blog",                href: "https://careerprepschool.org/blog2026" },
        { id: "testimonials", label: "Testimonials",        href: "#testimonials", visible: false }, // hidden — waiting for content
        { id: "graduates",    label: "Graduates",           href: "#graduates",    visible: false }, // hidden — waiting for content
      ],
    },
    {
      id: "pathways",     label: "Career Pathways",     href: "#pathways",     visible: true,  hideOnPages: [],
      submenu: [
        { id: "pathways",      label: "Explore Our Pathways", href: "#pathways" },
        { id: "pathways-quiz", label: "Take the Quiz",        href: "#", action: "open-quiz" },
      ],
    },
    {
      id: "locations",    label: "Campuses",            href: "#locations",    visible: true,  hideOnPages: [],
      /* The Campuses submenu starts with "Locations" (the main page with finder + all
         campuses) and then auto-generates from locations.items, each with its city. */
      submenuFrom: "locations",
    },
    { id: "start",        label: "Start Today",         href: "#start",        visible: true,  hideOnPages: [], cta: true },
  ],

  /* -----------------------------------------------------------------
     MODULE VISIBILITY (per page)
     Set any module to `false` to hide it. Order in this object reflects
     the order on the page.
     ----------------------------------------------------------------- */
  modules: {
    home: {
      hero: true,
      valueProps: false,
      painPoints: true,           // "Career Prep exists for students who don't fit the system" + pain points
      impactStats: true,          // "Lives changed" + key stats — sits between pathways and mission strip
      sponsored: true,            // Sponsor / partner logo row (placeholders until real assets land)
      missionStrip: true,         // Circle graph (wraparound services) follows the pain points
      writtenTestimonials: true,  // Testimonials sit under the circle graph
      pathwaysPreview: true,
      howItWorks: true,
      faqPreview: true,
      ctaBand: true,
    },
    why: {
      heroPhoto: true,       // Why hero — navy band with a faded grad-photo collage backdrop
      mission: false,        // Hidden — no words above the comparison chart
      painPoints: true,      // Major pain points addressed (lined up before the chart)
      comparisonChart: true,
      promiseList: true,
    },
    pathways: {
      workforce: true,
      intro: true,
      grid: true,
      certNote: false,      // "Don't see your dream listed?" note removed
    },
    "student-life": {
      intro: true,
      offerings: true,
      testimonials: true,
      events: true,
    },
    locations: {
      map: true,             // Ohio campus map at the top
      intro: true,
      finder: true,
      grid: true,
    },
    /* Per-school page modules (toggle individually if a campus needs to hide a section) */
    "school-page": {
      stats: true,          // "Career Prep by the numbers" — enrolled + graduated
      sponsored: true,      // "Trusted by" partner logos
      director: true,
      unique: true,
      photos: true,
      gallery: true,        // Drive-powered photo gallery — sections from sub-folder names
      contact: true,
      painPoints: true,
      compare: true,
      wraparound: true,
      howItWorks: true,
      testimonials: true,
      pathways: true,
      calendar: true,
      ctaBand: true,
    },
    start: {
      intro: true,
      alwaysOpen: true,
      process: true,
      apply: true,
      interestNudge: true,
    },
    resources: {
      intro: true,
      faq: false,            // FAQ now has its own page (#faq)
      districtDocs: true,    // District-wide helpful links (state resources, etc.)
      schoolDocs: true,
    },
    testimonials: {
      intro: true,
      grid: true,
    },
    graduates: {
      intro: true,
      graduation: true,    // Graduation component piece (ceremony details, photos)
      beforeAfter: true,   // Before & After stories
      whereNow: true,      // Where Are They Now? alumni updates
    },
    faq: {
      intro: true,
      list: true,
    },
    "interest-form": {
      intro: true,
      form: true,
    },
  },

  /* -----------------------------------------------------------------
     TESTIMONIAL VIDEO (Home page · the FIRST thing visitors see)
     -----------------------------------------------------------------
     This is the opening module on the home page.
     To swap the placeholder for the real student testimonial video:
       1) Upload the video to YouTube or Vimeo (unlisted is fine)
       2) Copy the EMBED url (e.g. https://www.youtube.com/embed/XXXX)
       3) Paste it into `embedUrl` below
     To hide this module entirely, set `modules.home.videoHero` to false.
     ----------------------------------------------------------------- */
  videoHero: {
    eyebrow: "Hear it from our students",
    headline: "What does it look like when school finally fits your life?",
    body: "Real students. Real stories. No script.",
    /* YouTube embed — autoplay requires `mute=1`, and looping requires the
       `playlist` param to repeat the same video ID. Source video:
       https://youtu.be/uejp9ma39-8 */
    localUrl: null,
    embedUrl: "https://www.youtube.com/embed/uejp9ma39-8?autoplay=1&mute=1&loop=1&playlist=uejp9ma39-8&playsinline=1&rel=0&modestbranding=1",
    autoplay: true,
    placeholderTitle: "Student testimonial video — coming soon",
    placeholderSub: "We're filming this now. Once it's edited, drop the file into the project folder and point videoHero.localUrl at it, or paste a YouTube/Vimeo embed URL into videoHero.embedUrl.",
  },

  /* -----------------------------------------------------------------
     HERO (Home page)
     ----------------------------------------------------------------- */
  hero: {
    /* High-contrast pill above the rotating headline — bigger, bolder so it
       actually reads against the photo grid behind it. */
    eyebrow: "Ages 14–21 · 8 Ohio Campuses",
    headline: "What if school actually worked around your life?",
    /* The hero headline rotates through these phrases every few seconds.
       Add or remove items to change the rotation. Set to null/empty to disable. */
    headlineRotation: [
      "What if school actually worked around your life?",
      "What if school helped you land a real job?",
      "What if school had your back, no matter what?",
      "What if school was 100% free?",
      "What if school felt different?",
    ],
    /* Long body removed — it was blending into the photo grid. The promise
       below carries the same message in fewer words. */
    body: [],
    promise: "Your diploma. Real certifications. A real job. 100% free.",
    /* primaryCta inherits brand.applyUrl automatically — no need to keep two URLs in sync */
    primaryCta: { label: "Apply Now" },
    /* Secondary CTA opens the Career Quiz — a 6-question pathway finder.
       To restore the old "call a real person" behavior, change `action` to
       null and set `href: "#locations"`. */
    secondaryCta: { label: "Take the Career Quiz", href: "#", action: "open-quiz" },
    /* Caption under the testimonial video (right side of the hero) */
    videoCaption: "Hear it from our students — real stories, no script.",
  },

  /* -----------------------------------------------------------------
     VALUE PROPS (Home page · short bullets row)
     ----------------------------------------------------------------- */
  valueProps: [
    { label: "Diploma + Certs.", detail: "Earn an accredited diploma AND real industry certifications." },
    { label: "Job-ready.",       detail: "Career training that lands students in actual paying jobs." },
    { label: "100% free.",       detail: "Public charter school. $0 tuition. Free certifications. Always." },
    { label: "On your terms.",   detail: "Flexible, self-paced. School works around your life — not the other way around." },
  ],

  /* -----------------------------------------------------------------
     MISSION / WHY WE'RE DIFFERENT
     ----------------------------------------------------------------- */
  mission: {
    eyebrow: "Built for students who needed something different",
    headline: "What every student gets, no matter what",
    body: [
      "Not because they couldn't succeed.",
      "Because the system wasn't built for their life.",
      "We're part of the Fusion Ed network, and everything here — schedule, support, career training — is designed around one idea:",
    ],
    pullQuote: "You can build something real.",
    fusionMission: "Fusion Ed's mission: Empower others to achieve their full potential.",
  },

  /* -----------------------------------------------------------------
     CAREER QUIZ
     -----------------------------------------------------------------
     6 multiple-choice questions. Each answer's `weights` map adds points
     to one or more pathway slugs from `pathways.items`. The pathway with
     the highest total is the recommendation.

     To edit: change wording in `questions` or tweak weights. To swap the
     result CTA, change `results.cta.href` (defaults to #pathways).
     ----------------------------------------------------------------- */
  careerQuiz: {
    intro: {
      eyebrow: "Career Quiz",
      title: "Take a quiz now to discover what career fits you best.",
      sub: "Six quick questions, about 60 seconds. No wrong answers.",
      pitch: "Tell us a little about you, then take the quiz — we'll send your matched pathway straight to your inbox.",
      cta: "Start the quiz →",
    },
    questions: [
      {
        q: "When you picture your future workday, where are you?",
        answers: [
          { label: "In a clinic helping someone feel better",      weights: { healthcare: 3 } },
          { label: "On a job site building something real",         weights: { construction: 3 } },
          { label: "In a restaurant or hotel making someone's day", weights: { hospitality: 3 } },
          { label: "On a factory floor running modern machines",    weights: { "advanced-manufacturing": 3 } },
          { label: "Outside flying a drone for a real client",      weights: { "drone-pilot": 3 } },
          { label: "At a station doing nails for happy clients",    weights: { manicurist: 3 } },
          { label: "Running my own business",                       weights: { business: 3 } },
        ],
      },
      {
        q: "Which feels closer to how you like to work?",
        answers: [
          { label: "One-on-one with people who need me",     weights: { healthcare: 2, manicurist: 2 } },
          { label: "On a crew, hands-on, outside often",     weights: { construction: 2, "drone-pilot": 1 } },
          { label: "Fast-paced team during a rush",          weights: { hospitality: 2 } },
          { label: "Solo with focus and the right equipment", weights: { "advanced-manufacturing": 2, "drone-pilot": 2 } },
          { label: "Leading the room — calling the shots",   weights: { business: 2, hospitality: 1 } },
        ],
      },
      {
        q: "What kind of paycheck matters most to you right now?",
        answers: [
          { label: "Steady hourly wage with real benefits",        weights: { healthcare: 2, "advanced-manufacturing": 2 } },
          { label: "Higher pay for skilled trade work",            weights: { construction: 2, "drone-pilot": 1 } },
          { label: "Tips plus flexible hours",                     weights: { hospitality: 2, manicurist: 2 } },
          { label: "Building something I own over time",           weights: { business: 3 } },
        ],
      },
      {
        q: "When something breaks, what's your move?",
        answers: [
          { label: "Figure out what's wrong with it",     weights: { healthcare: 2, "advanced-manufacturing": 2 } },
          { label: "Roll up my sleeves and fix it",       weights: { construction: 2, "drone-pilot": 1 } },
          { label: "Find someone who can help",           weights: { hospitality: 2 } },
          { label: "Find a way to sell a replacement",    weights: { business: 2 } },
          { label: "Make it look good again",             weights: { manicurist: 2 } },
        ],
      },
      {
        q: "Which would you actually want to learn this year?",
        answers: [
          { label: "How to draw blood / check vitals",      weights: { healthcare: 3 } },
          { label: "How to read a blueprint",                weights: { construction: 3 } },
          { label: "How to run service during a dinner rush", weights: { hospitality: 3 } },
          { label: "How to operate a CNC or 3D printer",    weights: { "advanced-manufacturing": 3 } },
          { label: "How to pass the FAA Part 107 drone exam", weights: { "drone-pilot": 3 } },
          { label: "How to do gel manicures and pedicures", weights: { manicurist: 3 } },
          { label: "How to write a real business plan",     weights: { business: 3 } },
        ],
      },
      {
        q: "In 5 years, what do you want someone to say about you?",
        answers: [
          { label: '"They literally saved my life."',             weights: { healthcare: 3 } },
          { label: '"They built half the neighborhood."',         weights: { construction: 3 } },
          { label: '"They made my night."',                       weights: { hospitality: 3 } },
          { label: '"They run that place."',                      weights: { "advanced-manufacturing": 2, business: 2 } },
          { label: '"They captured the shot nobody else could."', weights: { "drone-pilot": 3 } },
          { label: '"They made me feel beautiful."',              weights: { manicurist: 3 } },
          { label: '"They took the risk and won."',               weights: { business: 3 } },
        ],
      },
    ],
    /* What the result screen says for each pathway. The `slug` lines up
       with pathways.items so we can pull the icon from there automatically. */
    results: {
      "healthcare":             { headline: "Healthcare looks like your path.",            body: "You're drawn to caring for people — and Ohio's biggest growth sector is ready for you. Earn Phlebotomy, STNA, Medical Assistant, or Patient Care Tech certifications while you finish your diploma." },
      "construction":           { headline: "Construction looks like your path.",          body: "You're a builder. Skilled trade work pays from day one — and you'll graduate with OSHA-10, NCCER Core, and forklift certifications already on your resume." },
      "hospitality":            { headline: "Hospitality & Tourism looks like your path.", body: "You thrive in the room. Earn the Rise Up national credential, learn front- and back-of-house ops, and walk into hotels, restaurants, and event venues with a real edge." },
      "advanced-manufacturing": { headline: "Advanced Manufacturing looks like your path.", body: "You like running modern machines. Career Prep's Fusion campus is the only one that offers this track — hands-on training for the factory floor of today." },
      "drone-pilot":            { headline: "Drone Pilot looks like your path.",            body: "You see the world from above. Train for the FAA Part 107 commercial drone license and the gigs that come with it (real estate, agriculture, film, inspection)." },
      "manicurist":             { headline: "Manicurist looks like your path.",             body: "You make people feel like themselves. Skyway's Manicurist pathway is the only one in our network — a real, licensed credential alongside your diploma." },
      "business":               { headline: "Business / Entrepreneurship looks like your path.", body: "You're a builder of a different kind — building income, ideas, businesses. Learn to write a real plan, run real numbers, and pitch with confidence." },
    },
    cta: {
      label: "Learn more about this pathway →",
      href: "#pathways",
      retake: "Take it again",
    },
    /* -----------------------------------------------------------------
       LEAD CAPTURE (shown after Q6, before the result screen)
       -----------------------------------------------------------------
       The quiz is a lead magnet: visitors complete 6 questions, then we
       ask for their info to "unlock" their pathway result. The submission
       is sent to HubSpot via the Forms API as a contact, with the chosen
       pathway slug captured in a custom property so Sales can route them.

       To wire this up in HubSpot:
         1) In HubSpot, create a Form with these fields:
              firstname, lastname, email, date_of_birth, pathway_interest
            (pathway_interest is a custom contact property — single-line text
             with one of these values: healthcare, construction, hospitality,
             advanced-manufacturing, drone-pilot, manicurist, business)
         2) Copy the Portal ID and Form GUID from HubSpot's embed code
         3) Paste the Form GUID into `hubspotFormId` below
       Until `hubspotFormId` is set, the form still works — the data is
       logged to the console so we can see what's coming through without
       it silently failing.
       ----------------------------------------------------------------- */
    leadCapture: {
      enabled: true,
      eyebrow: "First, the basics",
      title: "Tell us about yourself",
      sub: "We'll send your matched career pathway to your email after the quiz.",
      hubspotPortalId: "23862493",
      hubspotFormId: "b4e43db4-5236-48f2-923a-cea919b5811f",
      pathwayPropertyName: "pathway_interest",
      submitLabel: "Start the quiz →",
    },
    /* The closing screen — shown after the last question. The pathway is
       sent to HubSpot automatically (no field for them to fill out), and the
       matched result is shown here so they see what we'll be in touch about. */
    thankyou: {
      eyebrow: "All set",
      title: "Thank you! We'll be in touch regarding your results.",
      body: "Based on your answers, your matched career pathway is:",
      footnote: "Keep an eye on your inbox — we'll follow up with what's next.",
      retake: "Take it again",
    },
  },

  /* -----------------------------------------------------------------
     FIRST-TIME VISITOR POPUP
     -----------------------------------------------------------------
     Shown once per browser (localStorage-gated). Submits directly to the
     HubSpot Forms API — no backend needed. To wire it up:

       1) In HubSpot, create a Form with these fields:
            email, firstname, lastname, phone, date_of_birth, audience_type
          (audience_type is a custom contact property — values: "student" / "parent")
       2) Copy the form's Portal ID and Form GUID from the HubSpot embed code.
       3) Paste them below.

     If `hubspotFormId` is left null, the popup will collect data and log it
     to the console (handy while the HubSpot form is being created) so it
     never silently fails.
     ----------------------------------------------------------------- */
  firstTimePopup: {
    enabled: true,
    delayMs: 4000,                 // Wait a few seconds so the visitor sees the hero first
    storageKey: "cphs_ftv_seen",   // localStorage flag — if present, popup never shows again
    title: "First Time Here?",
    sub: "Tell us a little about you and we'll keep you in the loop. Takes 30 seconds.",
    /* HubSpot — using the same portal that already powers the Apply Now form (23862493).
       Drop the new Form GUID here once the form exists in HubSpot. Until then,
       submissions are captured locally and logged for inspection. */
    hubspotPortalId: "23862493",
    hubspotFormId: "c3f86f7a-42ce-4f22-8f0a-c4bcb9b05af3",   // live lead form
  },

  /* -----------------------------------------------------------------
     PAIN POINTS (Why We're Different · before the comparison chart)
     -----------------------------------------------------------------
     The major pain points Career Prep is built to address.
     Synthesized from the Career Prep AI Profile (student + parent personas).
     Edit, reorder, or hide items here — the renderer reflects this list 1:1.
     ----------------------------------------------------------------- */
  painPoints: {
    eyebrow: "Sound like you?",
    headline: "Career Prep exists for students who don't fit the traditional system.",
    body: "Pick the ones that feel familiar — we'll show you how we address each one.",
    /* Punchy version — each card has a short headline (jumps out) plus a
       single-line "promise" that we keep on hover so the grid stays compact.
       Keep `problem` text short (4–6 words max) for the card to look bold. */
    items: [
      { icon: "icons/shield.svg",      problem: "School never felt safe.",              promise: "Walk in. No labels. No surveillance. Just respect." },
      { icon: "icons/stopwatch.svg",   problem: "Behind on credits.",                   promise: "Self-paced. Start where you are. Move at your speed." },
      { icon: "icons/bus.svg",         problem: "Life keeps getting in the way.",       promise: "Flexible 4-hour sessions. We work around your job and your kids." },
      { icon: "icons/heart-pulse.svg", problem: "Nobody's supporting my mental health.", promise: "Free counseling + real help with food, housing, and care." },
      { icon: "icons/route.svg",       problem: "No real path after graduation.",       promise: "Career pathway + Life Blueprint = a plan you can use." },
      { icon: "icons/phone-off.svg",   problem: "Schools ghost when things go wrong.",  promise: "We call. We adjust. We don't drop you." },
    ],
  },

  /* -----------------------------------------------------------------
     IMPACT STATS  (Home page · "how many lives changed" + key numbers)
     -----------------------------------------------------------------
     A simple row of headline numbers that prove the work is real. Edit
     any value — the renderer reflects this list 1:1. To hide entirely,
     set `modules.home.impactStats` to false.
     ----------------------------------------------------------------- */
  impactStats: {
    eyebrow: "Our impact",
    headline: "Lives changed across Ohio.",
    sub: "",                              // dropped — let the numbers speak
    items: [
      { number: "8,458",  label: "Students enrolled" },
      { number: "1,840",  label: "Diplomas earned" },
      { number: "8",      label: "Ohio campuses" },
    ],
  },

  /* -----------------------------------------------------------------
     SPONSORED BY  (Home page · partner / sponsor logos)
     -----------------------------------------------------------------
     A row of partner logos that lend social proof to the site. Each item
     can be: a real logo (set `logoUrl` to the file in the project folder),
     or a placeholder (leave `logoUrl` null and we'll render a labeled tile
     so the slot is obvious to anyone working on the site).
     ----------------------------------------------------------------- */
  sponsored: {
    eyebrow: "Trusted by",
    headline: "",      // intentionally blank — eyebrow + logos only
    sub: "",
    /* Logos shown on the home page. Each item has an `id` so per-school pages
       can reference just the specific sponsor(s) that back that campus. */
    items: [
      { id: "ohio-dew",      name: "Ohio Department of Education and Workforce", logoUrl: "sponsors/ohio-doe-workforce.png" },
      { id: "ohio-council",  name: "Ohio Council of Community Schools",          logoUrl: "sponsors/ohio-council.svg" },
      { id: "erco",          name: "Educational Resource Consultants of Ohio (ERCO)", logoUrl: "sponsors/erco.webp" },
      { id: "st-aloysius",   name: "St. Aloysius",                               logoUrl: "sponsors/st-aloysius.png" },
    ],
    /* Per-school sponsors. Every school page shows Ohio DEW (the state
       recognition that applies to all) plus that campus's specific community
       sponsor. Nothing else — keeps the "Trusted by" row honest per location. */
    perSchool: {
      "black-river":         ["ohio-dew", "st-aloysius"],
      "capital-city":        ["ohio-dew", "st-aloysius"],
      "cascade":             ["ohio-dew", "ohio-council"],
      "cincinnati":          ["ohio-dew", "erco"],
      "gem-city":            ["ohio-dew", "st-aloysius"],
      "north-woods-fusion":  ["ohio-dew", "st-aloysius"],
      "north-woods-focus":   ["ohio-dew", "st-aloysius"],
      "skyway":              ["ohio-dew", "ohio-council"],
    },
  },

  comparison: {
    headline: "Traditional School vs Career Prep",
    columns: [
      { label: "Traditional school",     accent: false },
      { label: "Career Prep High School", accent: true  },
    ],
    rows: [
      { trait: "Schedule",              traditional: "Same start, same end, every day", cp: "Flexible schedule — pick what fits your life" },
      { trait: "Pace",                  traditional: "Move with the class",              cp: "Move at your pace" },
      { trait: "Cost",                  traditional: "Varies",                            cp: "$0 — public charter school" },
      { trait: "If you miss a day",     traditional: "You fall behind",                   cp: "We walk with you to overcome whatever's getting in the way — we're with you every step." },
      { trait: "Career training",       traditional: "Sometimes, eventually",             cp: "Built into the program. Real certs in healthcare, construction, manufacturing, and more." },
      { trait: "Mental health support", traditional: "If you ask",                        cp: "Free. Because life doesn't pause for school." },
      { trait: "Diploma",               traditional: "Standard high school diploma",       cp: "Accredited high school diploma — recognized by employers and colleges" },
    ],
  },

  promise: {
    headline: "No One Climbs Alone",
    sub: "Your diploma is the summit. We climb with you every step of the way.",
    items: [
      "When a student misses a day, someone calls — not to write them up, but because we want to know where they are.",
      "Every student gets a mentor who knows their name, their goals, and their story.",
      "If something is getting in the way — housing, transportation, food, mental health — we figure it out together.",
      "When something goes wrong, you'll hear about it from us, not the other way around.",
      "The only requirement is the decision to show up.",
    ],
  },

  /* -----------------------------------------------------------------
     STOCK PHOTOS  (placeholders — swap any URL for a real campus photo)
     -----------------------------------------------------------------
     Each photo has a `placeholder: true` flag so the site can show a small
     "Placeholder photo — swap for a real one" badge on top of the image.
     Remove that flag (or set false) once a real photo is in place.
     ----------------------------------------------------------------- */
  stockPhotos: {
    /* Using LoremFlickr — pulls a creative-commons photo that matches the keywords.
       Each URL is keyword-matched, so the photos actually fit the section.
       Replace any URL with a real campus photo when you have one. */
    whyHero: { url: "https://loremflickr.com/800/500/highschool,teen,students?lock=1011", alt: "High school students at Career Prep", placeholder: true },
    pathwayDefaults: {
      "healthcare":             { url: "medical program.jpg", alt: "Healthcare pathway",            placeholder: false },
      "construction":           { url: "construction.jpg",    alt: "Construction pathway",          placeholder: false },
      "hospitality":            { url: "hospitality.jpg",     alt: "Hospitality & Tourism pathway", placeholder: false },
      "advanced-manufacturing": { url: "manufacturing.jpg",   alt: "Advanced Manufacturing pathway", placeholder: false },
      "drone-pilot":            { url: "drone pilot.jpg",     alt: "Drone Pilot pathway",           placeholder: false },
      "manicurist":             { url: "manicure.jpg",        alt: "Manicurist pathway",            placeholder: false },
      "business":               { url: "business.jpg",        alt: "Business / Entrepreneurship pathway", placeholder: false },
    },
  },

  /* -----------------------------------------------------------------
     HOW IT WORKS  (4-step process shown on the home page)
     ----------------------------------------------------------------- */
  howItWorks: {
    eyebrow: "Here's how it works",
    headline: "We'll climb with you every step of the way.",
    sub: "Four steps from where you are to the summit. No bells. No bell schedule. Just a path that works around your life.",
    steps: [
      { num: "1", title: "Apply or Reach Out",          body: "Fill out an application — or drop in for a tour. Tours run year-round." },
      { num: "2", title: "Build Your Plan",             body: "Sit down with a Success Coach who maps out your goals, schedule, and pathway." },
      { num: "3", title: "Get Hands-On Career Training", body: "Free certifications. Real-world skills. Train for jobs employers actually want to fill." },
      { num: "4", title: "Graduate With Your Diploma",  body: "Work at your own pace. Walk across the stage with your accredited diploma — and a plan." },
    ],
    cta: { label: "Start your application →" }, // href falls back to brand.applyUrl
  },

  /* -----------------------------------------------------------------
     WRITTEN TESTIMONIALS  (home page · short student quotes)
     ----------------------------------------------------------------- */
  writtenTestimonials: {
    eyebrow: "From our students",
    headline: "Real students. Real change.",
    /* Mix of real quotes from across the network. As other campuses send testimonials,
       swap in their voices here so the home page truly reflects every school. */
    /* Pulled from the per-campus testimonials in schoolPage.perSchool — short,
       varied voices so visitors hear from real students across the network. */
    items: [
      { quote: "Black River has taught me stress management, time management, how to motivate myself, and most importantly that **I'm worth something**.", name: "Jordyn", campus: "Black River · Elyria" },
      { quote: "I came here after being expelled and out of school for nearly 6 months. I came in with 11 credits and **I'm graduating in 2 months**.", name: "John", campus: "Black River · Elyria" },
      { quote: "I love this school. I like how you can **work at your own pace** and the teachers actually want to see you be successful.", name: "Kaiden", campus: "Black River · Elyria" },
      { quote: "The teachers are **very helpful and very nice** — and they're understanding of most situations. Whenever I had questions they answered to the best of their ability.", name: "Kaliya", campus: "Black River · Elyria" },
      { quote: "I loved going to Black River. I found teachers that **actually care about me** and friends that I will have for a lifetime.", name: "Angellisa", campus: "Black River · Elyria" },
      { quote: "I got to learn so many new things, and it helped me find what type of career I like. The teachers make me feel **safe and protected**.", name: "Jade", campus: "Black River · Elyria" },
      { quote: "I was nervous at first, but now **I'm confident**. Black River helped me graduate through the Construction program.", name: "Da'Wayne", campus: "Black River · Elyria" },
      { quote: "Black River lets me work at my own pace. It teaches me how to live in the real world and **graduate early** with the knowledge I need to succeed.", name: "Samantha", campus: "Black River · Elyria" },
    ],
  },

  /* -----------------------------------------------------------------
     CAREER PATHWAYS
     ----------------------------------------------------------------- */
  pathways: {
    eyebrow: "Career Pathways",
    headline: "Real skills. Real certifications. Real paychecks.",
    body: "Every student picks a pathway aligned to what they're good at and where the jobs actually are. Available pathways vary by location.",
    items: [
      { slug: "healthcare",             icon: "icons/stethoscope.svg", title: "Healthcare",                  availability: "Available at all locations except Focus",            body: "Train for in-demand roles in Ohio's largest growth sector.",                                                certs: ["Phlebotomy", "STNA", "Medical Assistant", "Patient Care Tech"], passion: "caring for people and helping them heal." },
      { slug: "construction",           icon: "icons/hammer.svg", title: "Construction",                availability: "Available at all locations except Cincinnati and Focus", body: "Build a foundation for skilled trades that pay from day one.",                                                certs: ["Forklift Certification", "NCER Core Certification", "OSHA-10"], passion: "building real things with your hands." },
      { slug: "hospitality",            icon: "icons/hotel.svg", title: "Hospitality & Tourism",       availability: "Available at most locations",                        body: "Front-of-house, back-of-house, and management — plus a national industry credential.",                          certs: ["Rise Up Certification"], passion: "creating great experiences and making people's day." },
      { slug: "advanced-manufacturing", icon: "icons/factory.svg", title: "Advanced Manufacturing",      availability: "Only at Fusion",                                     body: "Hands-on training for the modern factory floor.",                                                                certs: ["Industry-recognized credentials"], passion: "running high-tech machines and building real products." },
      { slug: "drone-pilot",            icon: "icons/drone.svg", title: "Drone Pilot License",         availability: "Only at Fusion",                                     body: "Earn your FAA Part 107 and step into a fast-growing field.",                                                     certs: ["FAA Part 107"], passion: "flying, tech, and seeing the world from above." },
      { slug: "manicurist",             icon: "icons/manicure.svg", title: "Manicurist",                  availability: "Skyway only",                                        body: "Train for state licensure and start building your client list before you graduate.",                            certs: ["Path to State License"], passion: "beauty, art, and helping people feel confident." },
      { slug: "business",               icon: "icons/briefcase.svg", title: "Business / Entrepreneurship", availability: "Available at all locations",                       body: "Build a real business plan for your real idea — with mentors who've actually run one.",                          certs: ["Entrepreneurship credential"], passion: "your own ideas — and being your own boss." },
    ],
    note: "",
    /* Workforce Development Partners — logo row shown under the pathways. */
    workforce: {
      headline: "Workforce Development Partners",
      logos: [
        "workforce/w1.svg",
        "workforce/w2.svg",
        "workforce/w3.svg",
        "workforce/w4.svg",
        "workforce/w5.svg",
        "workforce/w6.svg",
        "workforce/w8.svg",
        "workforce/w9.svg",
      ],
    },
  },

  /* -----------------------------------------------------------------
     STUDENT LIFE
     ----------------------------------------------------------------- */
  studentLife: {
    eyebrow: "Student Life",
    headline: "Your life doesn't stop for school. School works around your life.",
    body: "Here's what you actually get when you walk in the door.",
    offerings: [
      { title: "Flexible schedule",        body: "Pick the schedule that works around your job and family." },
      { title: "Self-paced learning",      body: "Move at your speed, not someone else's." },
      { title: "Dedicated mentor",         body: "Someone who actually knows your name and your story." },
      { title: "Career training",          body: "Not just classes — real skills that lead to real paychecks." },
      { title: "Free mental health support", body: "Because life doesn't pause for school." },
      { title: "No cost",                  body: "Public charter school. $0 tuition." },
      { title: "Transportation help",      body: "No car? Let's figure out the bus route together." },
    ],
    testimonialsPlaceholder: "Student stories coming soon — we're collecting them now from grads and current students.",
    eventsPlaceholder: "School calendar coming soon. We can either embed a Google Calendar here or upload the school calendar PDF — either works.",
  },

  /* -----------------------------------------------------------------
     LOCATIONS
     ----------------------------------------------------------------- */
  locations: {
    eyebrow: "Career Prep High School",
    headline: "8 Locations, One Mission",
    body: "",
    /* Campuses listed alphabetically by name. (Five Rivers, Dayton — closed, removed.) */
    items: [
      { slug: "black-river",        name: "Black River",        city: "Elyria",     address: "2015 W River Road N, Elyria, OH 44035",       phone: "440-324-1755", email: "enrollment@blackrivercareerprep.org",     director: "Tara Colón",        hubspotOwnerId: "83001743", careerPrepSchoolValue: "Black River Career Prep, Elyria",   coords: { lat: 41.3853, lng: -82.1296 }, pathways: ["healthcare","construction","hospitality","business"], applyUrl: "https://e7gf1.share.hsforms.com/2rUIhzqKGRJOvwBKc5LmfmA" },
      { slug: "capital-city",       name: "Capital City",       city: "Columbus",   address: "2400 S Hamilton Road, Columbus, OH 43232",    phone: "614-863-9175", email: "enrollment@capitalcitycareerprep.org",  director: "Jerell Lewis",      hubspotOwnerId: "83001862", careerPrepSchoolValue: "Capital City Career Prep, Columbus", coords: { lat: 39.9381, lng: -82.8771 }, pathways: ["healthcare","construction","hospitality","business"], applyUrl: "https://e7gf1.share.hsforms.com/2Zs_YR0lQRPGD6GlycosYYw" },
      { slug: "cascade",            name: "Cascade",            city: "Akron",      address: "1458 Brittain Road, Akron, OH 44310",         phone: "330-633-5990", email: "enrollment@cascadecareerprep.org",       director: "Casey Quinn",       hubspotOwnerId: "83001925", careerPrepSchoolValue: "Cascade Career Prep, Akron",        coords: { lat: 41.1058, lng: -81.4923 }, pathways: ["healthcare","construction","hospitality","business"], applyUrl: "https://e7gf1.share.hsforms.com/2ipnAp2viSliUXQ8n4xXbEw" },
      { slug: "cincinnati",         name: "Cincinnati",         city: "Cincinnati", address: "1110 Main Street, Cincinnati, OH 45202",      phone: "513-475-0222", email: "enrollment@cincinnaticareerprep.org",      director: "Scott Calaway",     hubspotOwnerId: "83335837", careerPrepSchoolValue: "Career Prep Cincinnati",            coords: { lat: 39.1099, lng: -84.5106 }, pathways: ["healthcare","hospitality","business"], applyUrl: "https://e7gf1.share.hsforms.com/2Q2Q2Hgq_QRWF_8EpfS6IVQ" },
      { slug: "gem-city",           name: "Gem City",           city: "Dayton",     address: "1721 North Main Street, Dayton, OH 45405",    phone: "937-274-2841", email: "enrollment@gemcitycareerprep.org",     director: "Dr. Lanicka Masey", hubspotOwnerId: "83002357", careerPrepSchoolValue: "Gem City Career Prep, Dayton",      coords: { lat: 39.7851, lng: -84.1916 }, pathways: ["healthcare","construction","hospitality","business"], applyUrl: "https://e7gf1.share.hsforms.com/2C5iCD6vtTimsqw5cee46sA" },
      { slug: "north-woods-focus",  name: "North Woods Focus",  city: "Columbus",   address: "1900 E Dublin Granville, Columbus, OH 43229", phone: "614-891-9041", email: "nwfocusenrollment@northwoodscareerprep.org", director: "Bethany Howard",    hubspotOwnerId: "83002455", careerPrepSchoolValue: "North Woods - Focus, Columbus",     coords: { lat: 40.0998, lng: -82.9863 }, pathways: ["hospitality","business"], applyUrl: "https://e7gf1.share.hsforms.com/2r8U3_vYQTHCslYZV_sStmA" },
      { slug: "north-woods-fusion", name: "North Woods Fusion", city: "Columbus",   address: "5747 Cleveland Ave, Columbus, OH 43231",      phone: "614-891-9041", email: "nwfusionenrollment@northwoodscareerprep.org",    director: "Alton Woods",       hubspotOwnerId: "83002483", careerPrepSchoolValue: "North Woods - Fusion, Columbus",    coords: { lat: 40.0807, lng: -82.9476 }, pathways: ["healthcare","construction","hospitality","advanced-manufacturing","drone-pilot","business"], applyUrl: "https://e7gf1.share.hsforms.com/2vNzKgKaVR2ScjMvnf-vZlw" },
      { slug: "skyway",             name: "Skyway",             city: "Toledo",     address: "3912 Sunforest Ct, Toledo, OH 43623",         phone: "419-241-5504", email: "enrollment@skywaycareerprep.org", director: "Meighan Richardson", hubspotOwnerId: "83002517", careerPrepSchoolValue: "Skyway Career Prep, Toledo",        featured: true, coords: { lat: 41.7244, lng: -83.6603 }, pathways: ["healthcare","construction","hospitality","manicurist","business"], applyUrl: "https://e7gf1.share.hsforms.com/231H28MT1SpS_9o2fFTFy7Q" },
    ],
    /* Location finder — let visitors enter their address (or use device GPS)
       to see schools ranked by distance. Powered client-side using free
       OpenStreetMap geocoding — no API key needed. */
    finder: {
      eyebrow: "Find your school",
      title: "Find the Closest School",
      sub: "Enter your address or ZIP code, and we'll show you the nearest schools by driving distance.",
      placeholder: "Street address, city, or ZIP code",
      submitLabel: "Find nearest schools",
      useLocationLabel: "Use my current location",
      noResultsMessage: "We couldn't find that address. Try adding the city and state, or use your current location.",
      errorMessage: "Something went wrong while looking that up. Please try again.",
    },
    /* Ohio campus map. Replace `image.url` with a new file (or set to null and
       fill in `placeholderText` to show a placeholder block instead). */
    map: {
      image: {
        url: "ohio-map.jpg",
        alt: "Ohio campus locations map — all 8 Career Prep campuses pinned",
      },
      caption: "All 8 Career Prep campuses, mapped across Ohio.",
      placeholderText: "Embed a Google Maps multi-pin map here once we have it ready.",
    },
  },

  /* -----------------------------------------------------------------
     SCHOOL PAGE TEMPLATE (one page per location, auto-generated)
     -----------------------------------------------------------------
     Every location with a `slug` gets its own page at #<slug>.
     Each page uses this template; per-school overrides go in
     `perSchool` below, keyed by slug.
     ----------------------------------------------------------------- */
  schoolPage: {
    /* Shared HEADER (hero) photos (from the "School Page Collage" folder) used
       behind the hero on every school page EXCEPT the slugs in `exceptSlugs`
       (those keep their own). The Campus Photos section still uses each
       school's own `photos`. */
    sharedCampusPhotos: {
      images: [
        "school-collage/sc-1.jpg",
        "school-collage/sc-2.jpg",
        "school-collage/sc-3.jpg",
        "school-collage/sc-4.jpg",
        "school-collage/sc-5.jpg",
        "school-collage/sc-6.jpg",
        "school-collage/sc-7.jpg",
        "school-collage/sc-8.jpg",
      ],
      exceptSlugs: ["black-river"],
    },
    /* Default content shared by every school.
       Use {name} or {city} tokens — they get replaced with the school's name/city at render time,
       so every page reads as if it were written for that specific campus.
       Override any field per-school in `perSchool` below when real content lands. */
    defaults: {
      directorName: "[Director name — {name} campus]",
      directorPhotoUrl: null,                                                    // e.g. "skyway-director.jpg" — drop the image into the project folder
      directorMessage: "Welcome to {name} Career Prep High School in {city}. A personal note from our campus director will appear here soon — check back as we get the school year underway.",
      photos: [],                                                                 // ["{name}-1.jpg", "{name}-2.jpg", ...] — drop image files into the project folder
      photosPlaceholderText: "Photos of the {name} campus will appear here. Drop image files into the project folder and list them in the per-school config.",
      calendarEmbedHtml: null,                                                    // paste the Google Calendar <iframe> snippet here when ready
      calendarImageUrl: null,                                                     // e.g. "black-river-calendar.webp" — image of a printed calendar
      calendarPdfUrl: null,                                                       // e.g. "cascade-calendar.pdf" — PDF embed of the calendar
      calendarPlaceholderText: "The {name} school year calendar will be embedded here once it's published. We can use a Google Calendar embed or upload a PDF.",
      uniqueText: "What makes the {name} campus in {city} unique will be added here soon — the people, the small details, and what families love most about this school.",
      /* Optional per-school student testimonials. Each item: { quote, name }.
         When empty the testimonials section hides itself automatically. */
      testimonials: [],
      contactBlurb: "Reach out to the {name} campus during school hours and an enrollment specialist from our {city} team will pick up.",
    },
    /* Per-school overrides — only set fields that differ from the defaults above.
       Filled in with light placeholders for now so each page reads personalized.
       Replace any field with real content (or delete it to fall back to the default). */
    perSchool: {
      "skyway": {
        uniqueText: "Skyway is our flagship Toledo campus and the only Career Prep school offering the Manicurist pathway.",
        calendarImageUrl: "calendars/skyway-calendar.jpg",
        calendarPdfUrl: "https://careerprepschool.org/hubfs/Revised%20FY26%20Student%20Calendar%20Skyway.pdf",
        /* Skyway has no campus photos yet — its header uses the shared School
           Page Collage; the Campus Photos section stays hidden (see hideModules). */
        stats: [
          { number: "2,203", label: "Students enrolled", sub: "At Skyway since July 2017" },
          { number: "398",   label: "Graduates",         sub: "Diplomas earned at Skyway" },
        ],
        /* Hide the director message (+ photo placeholder) and the static
           Campus Photos section on the Skyway page only — content pending. */
        hideModules: ["director", "photos"],
      },
      "black-river": {
        stats: [
          { number: "1,349", label: "Students enrolled", sub: "At Black River since July 2017" },
          { number: "323",   label: "Graduates",         sub: "Diplomas earned at Black River" },
        ],
        directorName: "Tara Colón, School Director",
        directorPhotoUrl: "black-river-director.jpg",
        directorMessage: "Welcome to the Black River Family! My name is Tara Colón and I am the Director of Black River Career Prep High School. We are so incredibly excited to have you become a part of our Black River family. Black River Career Prep High School exists because we know that the traditional \"one-size fits all\" high school experience doesn't work for everyone. Black River exists for students who want something different — young people who are ready to take control of their future, whether that means jumping straight into a great career or getting a head start on college. We are here for the creators, the doers, and the students who just need a supportive space to find their own path. Whether you're here to sharpen your technical skills, get a head start on college, or simply find a learning environment that \"gets\" you, you've come to the right place. Our mission is to transform your high school experience into a journey that actually prepares you for the real world — and we're going to have a great time doing it together. The reason our staff shows up every morning is simple: we are passionate about you. We don't just care about your grades; we care about your life. You aren't just another name on a roster here; you are a future leader, a creator, and a vital part of our school family.",
        photos: [
          "black-river-1.jpg",
          "black-river-2.jpg",
          "black-river-3.jpg",
          "black-river-4.jpg",
          "black-river-5.jpg",
          "black-river-6.jpg",
          "black-river-7.jpg",
        ],
        uniqueText: "What makes Black River Career Prep High School truly special is our commitment to seeing you as an individual, not just a student. We know that a traditional high school setting isn't for everyone, which is why our caring staff is dedicated to providing a supportive environment where you can actually find your path. We offer hands-on Career-Technical Education classes like STNA, Phlebotomy, Construction, and Business, designed to give you a massive head start. By obtaining these professional certifications while still in school, you aren't just graduating with a diploma — you're graduating with a career. These credentials allow you to jump straight into high-demand jobs, earn a higher wage immediately, or provide a solid foundation for further college studies. At Black River, we don't just teach you; we equip you with the real-world tools and confidence needed to achieve success long after graduation.",
        testimonials: [
          { quote: "My experience at Black River started out as a joke. I was playing around and barely getting any work done. I was going through a hard time and I wasn't connecting with anyone besides some bad influences. At the start of my 12th grade year I was gonna do the same thing until I finally connected with staff and a lot of them have helped me with my real problems and school by just showing me that I'm worth it and I deserve it. Black River has taught me stress management, time management, how to motivate myself, and most importantly that **I'm worth something**.", name: "Jordyn" },
          { quote: "I love this school. I like how you can **work at your own pace** and the teachers here actually want to see you be successful.", name: "Kaiden" },
          { quote: "My experience at Black River was extremely good. The teachers are **very helpful and very nice**, and they are also understanding of most situations. There were no excuses, they just did it. Whenever I had questions they answered to the best of their ability.", name: "Kaliya" },
          { quote: "I came here after being expelled and out of school for nearly 6 months. I came in with 11 credits and **I am graduating in 2 months**. All the teachers gave me all the help I needed to successfully do my work. I thank all the teachers for guiding me to success.", name: "John" },
          { quote: "I loved going to Black River. It was such a good experience for me!! I have found teachers that **actually care about me** and friends that I will have for a lifetime!!", name: "Angellisa" },
          { quote: "At Black River Career Prep, I got to learn so many new things, and it helped me find what type of career/jobs I like and don't like. I love the fun activities we get to do. The teachers make me feel **safe and protected**.", name: "Jade" },
          { quote: "My school career at Black River began in August 2025. I was nervous at first, but now **I'm confident** in this school. Black River helped me to graduate through the Construction program. There might be a pathway that's perfect for you!", name: "Da'Wayne" },
          { quote: "Black River has helped me out by allowing me to get work done at my own pace. The teachers are also very kind and helpful. Black River teaches me how to live in the real world and prepares me for college. It allows me to **graduate early** and go to college with the knowledge I need to succeed.", name: "Samantha" },
        ],
        calendarImageUrl: "calendars/black-river-calendar.jpg",
        calendarPdfUrl: "https://careerprepschool.org/hubfs/Revised%20BRCP%20FY26%20Student%20Calendar.pdf",
      },
      "cascade": {
        stats: [
          { number: "732", label: "Students enrolled", sub: "At Cascade since July 2017" },
          { number: "199", label: "Graduates",         sub: "Diplomas earned at Cascade" },
        ],
        directorName: "Casey Quinn, School Director",
        directorPhotoUrl: "cascade-director.jpg",
        directorMessage: "Hi! My name is Casey Quinn, school director. Cascade is a place that meets you where you are and creates a visual blueprint to help you achieve your graduation goals. We care! Throughout the educational process, you will work with people who see you as more than just a number. Committed to a hybrid teaching style, our learners benefit from the authentic, driven, and innovative quality of education offered here at Cascade Career Prep High School. Join our family and prepare to become an essential participant of our community! We are located in Akron, OH, and are considered a hidden gem in the city. We work diligently to exhaust our resources for students who are looking for a trusted institution they can call home. We strive to fulfill the phrase \"Exposure Leads to Expansion\" to elevate students to success in high school and beyond. We look to be the final stop for students. We have an affinity to helping others by making life less stressful during their time at Cascade Career Prep HS. We love offering ample opportunities to steer and guide students toward graduating HS and beyond. As a community, we collaborate to break down complex barriers that hindered their chances at graduating from a traditional high school. We provide authentic enrichment and flexibility in schedule to make the best student experience possible.",
        photos: [
          "cascade-1.jpg",
          "cascade-2.jpg",
          "cascade-3.jpg",
          "cascade-4.jpg",
          "cascade-5.jpg",
          "cascade-6.jpg",
          "cascade-7.jpg",
          "cascade-8.jpg",
          "cascade-9.jpg",
          "cascade-10.jpg",
          "cascade-11.jpg",
        ],
        uniqueText: "Cascade is considered a hidden gem in Akron, OH. We offer Career Tech Education pathways in Construction, Business, and Healthcare — students prepare for careers by working with teachers who have real experience in their trade field. Guided by our belief that \"Exposure Leads to Expansion,\" we work diligently to exhaust every resource for students looking for a trusted institution they can call home, with the flexibility of schedule and authentic enrichment that makes the best student experience possible.",
        calendarImageUrl: "calendars/cascade-calendar.jpg",
        calendarPdfUrl: "https://careerprepschool.org/hubfs/Cascade%20Student%20Calendar.pdf",
      },
      "gem-city": {
        stats: [
          { number: "1,205", label: "Students enrolled", sub: "At Gem City since July 2017" },
          { number: "321",   label: "Graduates",         sub: "Diplomas earned at Gem City" },
        ],
        directorName: "Dr. Shepherd-Masey, School Director",
        directorPhotoUrl: "gem-city-director.jpg",
        directorMessage: "Hi, I'm Dr. Shepherd-Masey, the School Director here at Gem City Career Prep High School. Our school exists for young people who are ready for something more — more clarity, more growth, more purpose. Whether you're just starting out, trying to figure things out, or looking for a place where you can actually belong and be challenged at the same time, this space is for you. We're not just about classes or programs. We're about helping you build a life that makes sense to you — one where your strengths are developed, your voice matters, and you're surrounded by people who genuinely want to see you succeed. I do this work because I've seen what happens when people are given the right support at the right time. It changes everything. And I believe every student who walks through our doors deserves that kind of opportunity.",
        photos: [
          "gem-city-1.jpg",
          "gem-city-2.jpg",
          "gem-city-3.jpg",
          "gem-city-4.jpg",
          "gem-city-5.jpg",
          "gem-city-6.jpg",
          "gem-city-7.jpg",
          "gem-city-8.jpg",
          "gem-city-9.jpg",
          "gem-city-10.jpg",
        ],
        uniqueText: "Gem City Career Prep High School is committed to making a meaningful impact. Our inclusive environment serves both local students and those from surrounding areas. We provide support, promote social development, teach essential life skills, and deliver high-quality education. At Gem City, we prioritize a caring atmosphere where personal growth, character development, and academic achievement are integrated.",
        calendarImageUrl: "calendars/gem-city-calendar.jpg",
        calendarPdfUrl: "https://careerprepschool.org/hubfs/Revised%20CAS%20and%20GC%20FY26%20Student%20Calendar.pdf",
      },
      "capital-city": {
        stats: [
          { number: "1,099", label: "Students enrolled", sub: "At Capital City since July 2017" },
          { number: "253",   label: "Graduates",         sub: "Diplomas earned at Capital City" },
        ],
        directorName: "Jerell Lewis, School Director",
        directorPhotoUrl: "capital-city-director.jpg",
        directorMessage: "Hi, I'm Mr. Lewis, the director here at Capital City Career Prep High School. I want you to know from the start that this is a place where students are given real support, real opportunities, and a real chance to succeed. Our campus was created for students who may need a fresh start, a different path, or a school community that truly sees their strengths and potential. We're here for young people who want support, structure, encouragement, and preparation for life after high school. We do this work because we believe every student deserves a chance to succeed — no matter what challenges they've faced before walking through our doors. This campus is built on relationships, respect, and helping students discover what they're capable of both in the classroom and beyond it. When you come here, you're not just another student in the building. You're part of a community that wants to see you grow, graduate, and move confidently toward your future. We're excited to welcome you and your family to our campus.",
        photos: [
          "capital-city-1.jpg",
          "capital-city-2.jpg",
          "capital-city-3.jpg",
          "capital-city-4.jpg",
          "capital-city-5.jpg",
          "capital-city-6.jpg",
          "capital-city-7.jpg",
          "capital-city-8.jpg",
        ],
        uniqueText: "What makes Capital City Career Prep High School unique is the variety of career pathways and real-world opportunities available to our students. Our Healthcare Pathway gives students hands-on experience and industry preparation in areas such as Phlebotomy, Medical Assisting, State Tested Nursing Assistant (STNA), and Patient Care Technician. In our Construction Pathway, students can earn valuable industry credentials including NCCER CORE, OSHA 10, 3M, and Forklift certification. We also offer a Workforce Readiness Pathway built around the Rise Up Curriculum, helping students build professional, communication, and employability skills that prepare them for success after graduation. Beyond the classroom, we partner with Lincoln Tech, Columbus State, and other colleges and universities to help students explore college, career training, and workforce opportunities after high school.",
        calendarImageUrl: "calendars/capital-city-calendar.jpg",
        calendarPdfUrl: "https://careerprepschool.org/hubfs/FY26%20Calendar%20Final%205.5.25%20(2)%20(1)-3.pdf",
      },
      "north-woods-fusion": {
        /* The source data had a single "North Woods" row (236 grads / 1,026
           enrolled) — applied to both NW campuses. Split if you get a breakdown. */
        stats: [
          { number: "1,026", label: "Students enrolled", sub: "Across North Woods since July 2017" },
          { number: "236",   label: "Graduates",         sub: "Diplomas earned at North Woods" },
        ],
        calendarImageUrl: "calendars/north-woods-fusion-calendar.jpg",
        calendarPdfUrl: "https://careerprepschool.org/hubfs/FY26%20Student%20Calendar%20NW%20Fusion.pdf",
        directorName: "Alton Woods, School Director",
        directorPhotoUrl: "nw-fusion-director.jpg",
        directorMessage: "Welcome to North Woods Career Prep Fusion Campus! At North Woods, we believe every student deserves the opportunity to succeed in school and in life. As a dropout prevention and career-focused high school, we are committed to providing a supportive environment where students can recover credits, earn their diploma, and prepare for meaningful careers and future goals. Our students have access to a variety of Career and Technical Education (CTE) programs designed to provide real-world skills and hands-on learning experiences. These opportunities include Phlebotomy, Medical Assisting, STNA training, Construction, and Workforce Readiness programs that help students build confidence and prepare for employment after graduation. We are also proud of our Robotics Team, which gives students the chance to develop teamwork, problem solving, and technology skills through competition and innovation. North Woods is excited to serve students in our brand new building, designed specifically to support our growing student population and expanding career programs. Our modern learning spaces allow us to better prepare students for college, careers, and lifelong success. Thank you for visiting our website. We look forward to partnering with students and families as we help every learner reach their full potential.",
        photos: [
          "nw-fusion-1.jpg",
          "nw-fusion-2.jpg",
          "nw-fusion-3.jpg",
          "nw-fusion-4.jpg",
          "nw-fusion-5.jpg",
          "nw-fusion-6.jpg",
          "nw-fusion-7.jpg",
          "nw-fusion-8.jpg",
        ],
        uniqueText: "North Woods Career Prep Fusion is unique because we support students through individualized pathways to graduation and success. Each year, about one-third of our students graduate, including many who finish at least a year early through credit recovery and flexible scheduling. Students benefit from brand new Career and Technical Education (CTE) labs in healthcare, construction, and workforce development that provide hands-on, career-focused learning. We also serve a large international student population and evaluate foreign credits toward an Ohio diploma. Our diverse, supportive environment helps students from all backgrounds feel welcomed and prepared for future success.",
      },
      "north-woods-focus": {
        /* Same combined "North Woods" figures as Fusion (source had one row). */
        stats: [
          { number: "1,026", label: "Students enrolled", sub: "Across North Woods since July 2017" },
          { number: "236",   label: "Graduates",         sub: "Diplomas earned at North Woods" },
        ],
        calendarImageUrl: "calendars/north-woods-focus-calendar.jpg",
        calendarPdfUrl: "https://careerprepschool.org/hubfs/School%20Calendar%2025-26%20High%20School.xlsx%20-%20EventCalendar%20(1)-1.pdf",
        directorName: "Bethany Howard, Principal",
        directorPhotoUrl: "nw-focus-director.jpg",
        directorMessage: "Welcome to North Woods Career Prep High School Focus Campus! Dear Students, Families, and Community — as Principal of North Woods, it is my pleasure to warmly welcome you to the 2026–2027 school year. Our dedicated team is excited to partner with you as we help every student discover their passions, grow their talents, and prepare for a successful future. Our school is focused on career and college readiness — combining rigorous academics with hands-on career pathways and real-world learning experiences. Throughout the year, students will have opportunities to explore a variety of career options, earn industry-recognized certifications, and build the skills they need to achieve their personal goals after graduation. We believe in creating a supportive, inclusive environment where every student feels valued, challenged, and inspired. Together with our caring staff, engaged parents, and strong industry and community partnerships, we will make this school year full of meaningful learning and lasting memories. Please explore our website to stay up to date on school news, programs, and events. Don't hesitate to reach out if you have any questions or would like to connect — my door is always open! Here's to a fantastic school year ahead!",
        photos: [
          "nw-focus-1.jpg",
          "nw-focus-2.jpg",
          "nw-focus-3.jpg",
          "nw-focus-4.jpg",
          "nw-focus-5.jpg",
          "nw-focus-6.jpg",
          "nw-focus-7.jpg",
          "nw-focus-8.jpg",
        ],
        uniqueText: "North Woods Career Prep High School Focus Campus is uniquely designed to provide students with a supportive and personalized transition into high school while preparing them for future success. We strive to serve as a bridge for 8th grade students coming from Focus Learning Academy, helping them smoothly adjust to the academic and social expectations of high school in a familiar and welcoming environment. Located in a diverse area of Columbus, we are proud to serve the large Somali community by fostering strong relationships with families and creating a culture that values inclusion, respect, and student success. We are committed to preparing students for life after graduation by offering strong college readiness support, including guidance through the college planning and application process. In addition, we recognize that every student learns differently, which is why we provide individualized, one-on-one academic support to help students succeed in their coursework and reach their full potential.",
      },
      "cincinnati": {
        stats: [
          { number: "844", label: "Students enrolled", sub: "At Cincinnati since July 2017" },
          { number: "110", label: "Graduates",         sub: "Diplomas earned at Cincinnati" },
        ],
        calendarImageUrl: "calendars/cincinnati-calendar.jpg",
        calendarPdfUrl: "https://careerprepschool.org/hubfs/FY26%20%20Cincinnati%20Student%20Calendar%20Revised.pdf",
        directorName: "Scott Calaway, School Director",
        directorPhotoUrl: "cincinnati-director.jpg",
        photos: [
          "cincinnati-1.jpg",
          "cincinnati-2.jpg",
          "cincinnati-3.jpg",
          "cincinnati-4.jpg",
          "cincinnati-5.jpg",
          "cincinnati-6.jpg",
          "cincinnati-7.jpg",
          "cincinnati-8.jpg",
        ],
        uniqueText: "Career Prep High School of Cincinnati is unique in many ways. First, we are a brand new school in the heart of Cincinnati, in Over The Rhine. Our school is minutes away from many of the attractions in Cincinnati. The school offers bus passes so students can utilize Cincinnati Public Transit, which allows students from all over the city to attend. Our location also allows us to partner with local businesses for student incentives and job opportunities. Career Prep of Cincinnati is also a smaller school, which allows more personal attention from teachers and more ability for the school to offer assistance to students and their families. Career Prep High School of Cincinnati — a safe, secure place to learn.",
      },
    },
  },

  /* -----------------------------------------------------------------
     START TODAY
     ----------------------------------------------------------------- */
  start: {
    eyebrow: "",
    headline: "Start your journey today.",
    subheadline: "Your diploma. Your career. Your future. We'll walk every step with you.",
    body: "Two ways to begin. Apply if you're ready — it takes about 5–10 minutes to complete. If you need more time, press the green button toward the end of this page to tell us a little about yourself, and we'll be in touch.",
    /* Always-open banner shown above the steps */
    alwaysOpen: "Ages 14–21. Enrollment is always open.",
    process: [
      { step: "1", title: "Apply + submit documents",            body: "Fill out the application and send us your school records. We'll review everything within one business day." },
      { step: "2", title: "Speak with an Enrollment Specialist", body: "A real person will reach out to talk through your goals, your schedule, and what to expect — no script, no pressure." },
      { step: "3", title: "Start school + begin your path toward a dream career", body: "Walk through the door, meet your mentor, and start building toward the career you actually want." },
    ],
    /* Apply path now embeds the full HubSpot application form directly on this page.
       This is the new HubSpot Forms (v3) embed format.
       To swap forms: update portalId / formId / region. */
    apply: {
      eyebrow: "Ready to start",
      title: "Apply now",
      body: "Fill out the full application below. It takes about 5–10 minutes, and a real person will follow up within one business day.",
      embed: {
        portalId: "23862493",
        formId:   "2ef682e8-84e8-404f-8464-95b9e9576abc",
        region:   "na1",
      },
    },
    /* Quiet "not ready" link — intentionally less prominent than Apply.
       Routes to the dedicated Interest Form page. */
    interestNudge: {
      label: "Not ready to apply yet? Tell us a little about yourself →",
      href: "#interest-form",
    },
  },

  /* -----------------------------------------------------------------
     INTEREST FORM (its own page so the Apply form stays the star on Start Today)
     ----------------------------------------------------------------- */
  interestForm: {
    eyebrow: "Just exploring",
    headline: "Tell us a little about yourself.",
    body: "If you're still thinking it through, drop us a quick note and someone from our team will reach out — no pressure, no commitment.",
    embed: {
      portalId: "23862493",
      formId:   "6cd1f241-4d87-46a0-9b15-cff2b2c7ff56",
      region:   "na1",
    },
    fallbackUrl: "https://share.hsforms.com/1bNHyQU2HRqCbFc_yssf_Vge7gf1",
    secondaryCta: { label: "Ready to apply instead? →", href: "#start" },
  },

  /* -----------------------------------------------------------------
     TESTIMONIALS PAGE
     ----------------------------------------------------------------- */
  testimonials: {
    eyebrow: "Student stories",
    headline: "Real students. Real stories. No script.",
    body: "Hear directly from students about what made the difference for them. Videos coming soon — placeholders below until each is uploaded.",
    /* Each entry becomes a card. To publish a real video, paste the YouTube
       or Vimeo EMBED URL into `embedUrl`. Leave it null for a placeholder. */
    videos: [
      { id: 1, title: "Why I came back to school",      campus: "Skyway · Toledo",         embedUrl: null },
      { id: 2, title: "The mentor who saw me",          campus: "Black River · Elyria",    embedUrl: null },
      { id: 3, title: "From dropping out to graduation", campus: "Cascade · Akron",         embedUrl: null },
      { id: 4, title: "Earning my certifications",      campus: "North Woods Fusion · Columbus", embedUrl: null },
      { id: 5, title: "Balancing work and school",      campus: "Capital City · Columbus", embedUrl: null },
      { id: 6, title: "Finding my career path",         campus: "Cincinnati",              embedUrl: null },
    ],
    placeholderCaption: "Video coming soon — paste a YouTube or Vimeo embed URL into `testimonials.videos[i].embedUrl` in site-config.js.",
  },

  /* -----------------------------------------------------------------
     GRADUATES PAGE (sub-page of Student Life)
     -----------------------------------------------------------------
     Three sections:
       1) Graduation component piece  — ceremony details, dates, photos
       2) Before & After              — student journeys (where they started → where they finished)
       3) Where Are They Now?         — alumni updates / career placements
     All copy/photos here are placeholders until real content lands.
     ----------------------------------------------------------------- */
  graduates: {
    intro: {
      eyebrow: "Class of 2026",
      headline: "Our graduates earned this.",
      body: "Every diploma is a story. Here's a glimpse at the moment, the journey, and what came next.",
    },
    graduation: {
      eyebrow: "The big day",
      headline: "Graduation",
      body: "Career Prep graduations happen on each campus every spring. Walk the stage, ring the bell, take the photo — and step into what's next with a real plan in hand.",
      ceremonyDetails: [
        { label: "Next ceremony",   value: "[Date — confirm with district]" },
        { label: "Where",           value: "[Venue — confirm per campus]" },
        { label: "What to expect",  value: "Caps, gowns, family seating, a real ceremony — followed by a campus reception." },
        { label: "How to RSVP",     value: "Your campus director will send a family RSVP form 4 weeks out." },
      ],
      photos: [],   // ["graduation-1.jpg", ...] — drop image files into the project folder
      photosPlaceholderText: "Graduation photos will appear here. Drop image files into the project folder and list them in site-config.graduates.graduation.photos.",
    },
    beforeAfter: {
      eyebrow: "Before & after",
      headline: "Where they started. Where they finished.",
      body: "These are real student journeys. Names are first-name-only by request.",
      stories: [
        {
          name: "[Student first name]",
          campus: "[Campus]",
          before: "[Where they were when they walked in — credits behind, working full time, dealing with X, etc.]",
          after:  "[Where they finished — graduated on time, earned X certification, started at Y job/college, etc.]",
          photoUrl: null,    // e.g. "before-after-1.jpg"
          placeholder: true,
        },
        {
          name: "[Student first name]",
          campus: "[Campus]",
          before: "[Where they were when they walked in.]",
          after:  "[Where they finished.]",
          photoUrl: null,
          placeholder: true,
        },
        {
          name: "[Student first name]",
          campus: "[Campus]",
          before: "[Where they were when they walked in.]",
          after:  "[Where they finished.]",
          photoUrl: null,
          placeholder: true,
        },
      ],
    },
    whereNow: {
      eyebrow: "Where are they now?",
      headline: "Life after the diploma.",
      body: "Catching up with Career Prep alumni — careers, college, family, what they're proud of.",
      alumni: [
        {
          name: "[Alumni name]",
          gradYear: "[YYYY]",
          campus: "[Campus]",
          path: "[What they're doing now — job title + employer, college + major, military branch, business they started, etc.]",
          quote: "[Optional one-line quote from the alum about Career Prep's impact.]",
          photoUrl: null,
          placeholder: true,
        },
        {
          name: "[Alumni name]",
          gradYear: "[YYYY]",
          campus: "[Campus]",
          path: "[What they're doing now.]",
          quote: "[Optional one-line quote.]",
          photoUrl: null,
          placeholder: true,
        },
        {
          name: "[Alumni name]",
          gradYear: "[YYYY]",
          campus: "[Campus]",
          path: "[What they're doing now.]",
          quote: "[Optional one-line quote.]",
          photoUrl: null,
          placeholder: true,
        },
      ],
    },
  },

  /* -----------------------------------------------------------------
     FAQ PAGE (was a section on Resources; now its own page)
     ----------------------------------------------------------------- */
  faq: {
    eyebrow: "FAQ",
    headline: "Real questions. Straight answers.",
    body: "If your question isn't answered here, send us a note — we'll get you a real answer from a real person.",
    items: [
      { q: "Is this actually free?",                    a: "Yes. Career Prep is a public charter school. No tuition. No hidden fees." },
      { q: "What if I work or have responsibilities?",  a: "That's exactly why this school exists. We have flexible sessions that fit around your life." },
      { q: "What happens if I miss days?",              a: "We don't drop you. We call, figure out what's going on, and adjust." },
      { q: "Is the diploma real?",                      a: "Yes. It's an accredited high school diploma recognized by employers and colleges." },
      { q: "Is this a GED?",                            a: "No. If you graduate with us you earn a State of Ohio recognized DIPLOMA." },
      { q: "Am I too far behind?",                      a: "No. You start where you are and move at your pace. Students who were years behind have graduated here." },
      { q: "What if I have children?",                  a: "We help students who are parents balance school and family. It takes courage to do both — we're here to make it work." },
      { q: "What do I need to buy before starting?",    a: "Nothing. We provide what you need. Your only obligation is to show up. We take care of the rest." },
      { q: "Can I apply any time?",                     a: "Yes. We welcome enrollments year-round. Once your documents are in and you've met with school staff, we'll set a start date." },
      { q: "Is testing for career certifications free?", a: "Yes. Students never pay any fees or tuition. All education and career certifications are provided free of charge." },
      { q: "Are there sports?",                         a: "We don't have school teams, but Career Prep students stay eligible to play sports at their home district — football, wrestling, AAU basketball, and more." },
    ],
  },

  /* -----------------------------------------------------------------
     RESOURCES
     ----------------------------------------------------------------- */
  resources: {
    eyebrow: "Resources",
    headline: "Resources by School",
    body: "Frequently asked questions, and documents for each of our nine schools.",
    /* -----------------------------------------------------------------
       GOOGLE DRIVE API KEY (one-time setup)
       -----------------------------------------------------------------
       Lets the Resources page list each school's Drive folder INLINE
       (full filenames + a Download button) instead of redirecting to
       Drive. Folders must be shared "Anyone with the link — Viewer".

       To create the key (free, ~2 minutes):
         1. Go to https://console.cloud.google.com/
         2. Create a project (or pick an existing one).
         3. APIs & Services → Library → search "Google Drive API" → Enable.
         4. APIs & Services → Credentials → "Create credentials" → API key.
         5. Click the new key → "Edit API key":
              - API restrictions: Restrict key → check "Google Drive API"
              - Application restrictions: HTTP referrers → add your site's
                domain(s), e.g. https://careerprepschool.org/* and the
                Vercel preview domain. Local dev: add http://localhost/*
                and http://127.0.0.1/*.
         6. Copy the key, paste it below.
       The key is read-only and restricted to Drive metadata; safe to ship.
       Until this is set, the modal will say "one-time setup needed". */
    googleApiKey: "AIzaSyC2oFZ9lRMckqXBsXq2MA09Cq2MNaf_KaM",
    faq: [
      { q: "Is this actually free?",                    a: "Yes. Career Prep is a public charter school. No tuition. No hidden fees." },
      { q: "What if I work or have responsibilities?",  a: "That's exactly why this school exists. We have flexible sessions that fit around your life." },
      { q: "What happens if I miss days?",              a: "We don't drop you. We call, figure out what's going on, and adjust." },
      { q: "Is the diploma real?",                      a: "Yes. It's an accredited high school diploma recognized by employers and colleges." },
      { q: "Is this a GED?",                            a: "No. If you graduate with us you earn a State of Ohio recognized DIPLOMA." },
      { q: "Am I too far behind?",                      a: "No. You start where you are and move at your pace. Students who were years behind have graduated here." },
      { q: "What if I have children?",                  a: "We help students who are parents balance school and family. It takes courage to do both — we're here to make it work." },
      { q: "What do I need to buy before starting?",    a: "Nothing. We provide what you need. Your only obligation is to show up. We take care of the rest." },
      { q: "Can I apply any time?",                     a: "Yes. We welcome enrollments year-round. Once your documents are in and you've met with school staff, we'll set a start date." },
      { q: "Is testing for career certifications free?", a: "Yes. Students never pay any fees or tuition. All education and career certifications are provided free of charge." },
      { q: "Are there sports?",                         a: "We don't have school teams, but Career Prep students stay eligible to play sports at their home district — football, wrestling, AAU basketball, and more." },
    ],
    /* District-wide resources shown first, before per-school docs */
    districtDocs: {
      title: "District-wide resources",
      sub: "Helpful links and support lines that apply to every Career Prep school.",
      links: [
        { label: "Safer Ohio School Tip Line",     url: "https://ohioschoolsafetycenter.ohio.gov/pre-k-12-schools/safer-ohio-school-tip-line" },
        { label: "OhioMeansJobs",                   url: "https://ohiomeansjobs.ohio.gov/" },
        { label: "988 Suicide & Crisis Lifeline",   url: "https://988lifeline.org/" },
      ],
      note: "",
    },
    /* Each school card opens its own list of documents.
       The simplest, lowest-maintenance approach: one Google Drive
       folder per school. Drop files in the folder, share it as
       "Anyone with the link can view," and paste the folder URL
       into `driveFolder` below. The site will surface a button that
       opens that folder. (See note inside the Resources page.) */
    schoolDocs: {
      title: "Pick your campus",
      sub: "Choose a resource type, then select your school campus.",
      /* The 4 resource categories every school has. Toggle between them. */
      categories: [
        { id: "policies",          label: "Board & Policies" },
        { id: "parent-student",    label: "Student / Parent Info" },
        { id: "food-service",      label: "Food Service" },
        { id: "special-education", label: "Special Education" },
      ],
      defaultCategory: "policies",
      /* Each school has FOUR Drive folder URLs — one per category.
         Set to "#" until you have the real URL. Folders should be shared
         "Anyone with the link — Viewer". */
      schools: [
        { slug: "skyway",             name: "Skyway",             city: "Toledo",     folders: {
          "policies":          "https://drive.google.com/drive/folders/1fHpgsPV12JL3ECyEBGC6KgBi6_At4NYw",
          "parent-student":    "https://drive.google.com/drive/folders/1_ONKJr6Eg24tqmWJkskEAJrnznnftiU_",
          "food-service":      "https://drive.google.com/drive/folders/1UvrkdwD3U-ZyJf2nopKNhoZS149-irc8",
          "special-education": "https://drive.google.com/drive/folders/1oktPele1eEnV-e5IE0CFTvbQMJ1uV6e_"
        } },
        { slug: "black-river",        name: "Black River",        city: "Elyria",     folders: {
          "policies":          "https://drive.google.com/drive/folders/1227RqwDvgxQoiojk_W9hqrBcz2JUOIZm",
          "parent-student":    "https://drive.google.com/drive/folders/1GTAAj9ydFdAJp8v1dbdW1egSa9arUj7a",
          "food-service":      "https://drive.google.com/drive/folders/11vdC9kZx0Fbh9YycC6UWlxREFatPZMEB",
          "special-education": "https://drive.google.com/drive/folders/10wyPi6GcwOSAathNFu5zuZzKl9BkGih0"
        } },
        { slug: "cascade",            name: "Cascade",            city: "Akron",      folders: {
          "policies":          "https://drive.google.com/drive/folders/1T6J-ZwnyJqIHs4zY6ZWQjG5saCQhJnqK",
          "parent-student":    "https://drive.google.com/drive/folders/1FMa_fHK93r2driu15n-YqJMzaYt5aFv4",
          "food-service":      "https://drive.google.com/drive/folders/1j201sOxhrGzirgekWxy3AUuMkZ1xvCPe",
          "special-education": "https://drive.google.com/drive/folders/1AO6nOaJLsjvNcPIhYoJDxW8Kuwuo0TlN"
        } },
        // Five Rivers (Dayton) — closed, removed from all pages
        { slug: "gem-city",           name: "Gem City",           city: "Dayton",     folders: {
          "policies":          "https://drive.google.com/drive/folders/1uibRAwoPqcTJcXQmc6J1PdZTGSiFPWCb",
          "parent-student":    "https://drive.google.com/drive/folders/1yrZ1b-ubxCXFjzkwQm4BhT8uGOJmQ526",
          "food-service":      "https://drive.google.com/drive/folders/1Nh_o6b9OHwF4qLEYwf4J-Looasvu3ltw",
          "special-education": "https://drive.google.com/drive/folders/1y2AUsmDUoiwzMIB-W6Vx4Bweqv5jijgv"
        } },
        { slug: "capital-city",       name: "Capital City",       city: "Columbus",   folders: {
          "policies":          "https://drive.google.com/drive/folders/1me2bzHXVlQkO-ogXh29ObjFucPlzH1gL",
          "parent-student":    "https://drive.google.com/drive/folders/1akFqXPo4MTZUsqsbj6wxbvxfJJbb9ykk",
          "food-service":      "https://drive.google.com/drive/folders/1kgV8SG48TxIwIca1JNLWqPwULTBR8NQZ",
          "special-education": "https://drive.google.com/drive/folders/1c5fjExJ7vd7kB1DV47NonJNgA8l3pMUN"
        } },
        { slug: "north-woods-fusion", name: "North Woods Fusion", city: "Columbus",   folders: {
          "policies":          "https://drive.google.com/drive/folders/1HUhOmAtnhwA21jqEOAKzSPWG_Vwa_dkY",
          "parent-student":    "https://drive.google.com/drive/folders/1cv7GxaO9VtHDE-vVCUd2aL1jqsWO1mr5",
          "food-service":      "https://drive.google.com/drive/folders/1RoWdNitUPtsBiZb2IHj2lYREuI-UcNoO",
          "special-education": "https://drive.google.com/drive/folders/1rtFZGufuBsZ4INpybKpKP9T0Bk1oGy58"
        } },
        { slug: "north-woods-focus",  name: "North Woods Focus",  city: "Columbus",   folders: {
          "policies":          "https://drive.google.com/drive/folders/1YnRZiOLcA_n0iD4xklj1ZQkIEW_UWmHB",
          "parent-student":    "https://drive.google.com/drive/folders/1CusZG7cpTJ9maWNn_mvtq2wNwDgXV81J",
          "food-service":      "https://drive.google.com/drive/folders/1Nnyi11GMcFsXanEJM3Kc2e9u1PAhK-RI",
          "special-education": "https://drive.google.com/drive/folders/1wCgwdagSgmqAdRbmsHhdOJwY6s72QI0g"
        } },
        { slug: "cincinnati",         name: "Cincinnati",         city: "Cincinnati", folders: {
          "policies":          "https://drive.google.com/drive/folders/12bZBW0QG1vN9KKx2VuTgy-7VMG8HY3-b",
          "parent-student":    "https://drive.google.com/drive/folders/1x5aS_JK-5nQ9D0Ubu8UYf9Ox1hSuiPV6",
          "food-service":      "https://drive.google.com/drive/folders/1vz0D2MajFKDaWSE3ZIhVcO_kH5oszMMW",
          "special-education": "https://drive.google.com/drive/folders/1kqaf-jis680faaGjIch3u_mHkpNXgUC6"
        } },
      ],
      driveHowTo: "How to wire up the Drive folders: For each school, create FOUR Google Drive folders — one per category (Board & Policies, Student / Parent Info, Food Service, Special Education). Set sharing on each to 'Anyone with the link — Viewer'. Copy each folder's URL. Paste them into the matching slot in `schools[].folders` in site-config.js. Anything dropped into those folders shows up automatically.",
    },
  },

  /* -----------------------------------------------------------------
     SCHOOL GALLERY (per-campus photo gallery, pulled live from Drive)
     -----------------------------------------------------------------
     For each campus, paste the URL of a Google Drive folder that contains
     SUB-FOLDERS organized by topic (e.g., "Classrooms", "Healthcare",
     "Events", "Hallway"). The site:
       1) Lists those sub-folders
       2) For each one, renders a section titled with the sub-folder name
       3) Displays the images inside as a grid (no filenames shown)
       4) Click an image → opens a larger view in a lightbox (still on-site,
          never sending the visitor to Drive)

     Setup:
       1) In Drive, create one parent folder per campus (e.g., "Skyway Gallery").
       2) Inside, create sub-folders named however you want the gallery
          sections to read (e.g., "Healthcare Lab", "Classrooms").
       3) Drop the campus photos into the matching sub-folder.
       4) Share the PARENT folder as "Anyone with the link — Viewer".
          (Sub-folders inherit access from the parent.)
       5) Copy the parent folder's URL, paste it into the matching slug
          slot below. The site picks up everything else automatically.
     Set any slot to null to hide the gallery section for that campus. */
  schoolGallery: {
    enabled: true,
    /* Reuses the same Google API key as the Resources page docs. */
    apiKey: "AIzaSyC2oFZ9lRMckqXBsXq2MA09Cq2MNaf_KaM",
    /* Slug → parent gallery folder URL (must be shared "Anyone with the link").
       Source: shared parent "School Photos & Videos" (Shared Drive). */
    folders: {
      "skyway":             "https://drive.google.com/drive/folders/1EV7Z2hvOB5m2O6DQLKcKAUcDiv2W4mxi",
      "black-river":        "https://drive.google.com/drive/folders/1-S36WUyGFHu6g6Ih8MR4xyfeNXzrA3yg",
      "cascade":            "https://drive.google.com/drive/folders/12Xrkcrn-UIi7yEirc0ClzQ7BL3W-dALU",
      "gem-city":           "https://drive.google.com/drive/folders/15iwRiGHMu6PEJhfNVXeJbwyoA0yiV677",
      "capital-city":       "https://drive.google.com/drive/folders/1XTkopkDkDNjTrDPoDuzRBv6EhF7AxmWx",
      "north-woods-fusion": "https://drive.google.com/drive/folders/1Im1njBMU-fIIM0Y53TxItN0iFMA5q34N",
      "north-woods-focus":  "https://drive.google.com/drive/folders/1BdiyOvpTAWhgvolyWrZ0SFbCj5AUxAKY",
      "cincinnati":         "https://drive.google.com/drive/folders/1YfkyVoubY5grrQDX3q-G97eaGf2I7Dc6",
    },
    /* Default sub-section label if a folder happens to have no name (shouldn't happen). */
    fallbackSectionLabel: "Photos",
  },

  /* -----------------------------------------------------------------
     GRADUATE COLLAGE  (sliding ribbon of graduate photos shown on the home
     page above the "Real students. Real change." testimonials)
     ----------------------------------------------------------------- */
  graduateCollage: {
    images: [
      "graduates/grad-1.jpg",
      "graduates/grad-2.jpg",
      "graduates/grad-3.jpg",
      "graduates/grad-4.jpg",
      "graduates/grad-5.jpg",
      "graduates/grad-6.jpg",
      "graduates/grad-7.jpg",
      "graduates/grad-8.jpg",
    ],
  },

  /* -----------------------------------------------------------------
     HOME COLLAGE  (auto-sliding student photo ribbon, high on the home page)
     -----------------------------------------------------------------
     Paste the URL of the Google Drive "home page collage" folder (shared
     "Anyone with the link — Viewer"). The site pulls the photos from it and
     runs them as a continuous sliding ribbon near the top of the home page.
     Leave `folder` empty to hide the ribbon. Reuses the same API key as the
     galleries. `maxPhotos` caps how many load (kept modest for performance). */
  homeCollage: {
    enabled: true,
    /* Local student photos take priority. Source originals live in the
       "Homepage Collage" folder in the project; web-optimized copies are in
       cphsdeploy/collage/. To add more: drop them in "Homepage Collage",
       optimize into collage/, and add the path here. */
    images: [
      "collage/collage-1.jpg",
      "collage/collage-2.jpg",
      "collage/collage-3.jpg",
      "collage/collage-4.jpg",
      "collage/collage-5.jpg",
      "collage/collage-6.jpg",
      "collage/collage-7.jpg",
    ],
    /* Optional Google Drive fallback — only used when `images` is empty. */
    folder: "",          // e.g. "https://drive.google.com/drive/folders/XXXXXXXX"
    maxPhotos: 16,
    apiKey: "AIzaSyC2oFZ9lRMckqXBsXq2MA09Cq2MNaf_KaM",
  },

  /* -----------------------------------------------------------------
     FOOTER
     ----------------------------------------------------------------- */
  footer: {
    tagline: "If a student shows up, we will not give up on them.",
    /* Compact link list — only the three core actions. */
    quickLinks: [
      { label: "Locations",   href: "#locations" },
      { label: "Start Today", href: "#start" },
      { label: "Apply",       href: null /* uses brand.applyUrl */ },
    ],
    finePrint: "© 2026 Career Prep High School · Part of the Fusion Ed network · A public charter school approved by the Ohio Department of Education and Workforce.",
  },

};
