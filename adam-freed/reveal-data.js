window.REVEAL_DATA = {
  slug: "adam-freed",
  client: "Adam Freed",
  firstName: "Adam",
  version: "2026-07-14-strategy-and-comparison-fix",
  localOnly: location.protocol === "file:" || ["127.0.0.1", "localhost"].includes(location.hostname),
  responseEndpoint: "https://bt-api.florianp.com/api/reveal-response",
  likenessNotice: {
    title: "A note on likeness.",
    body: "Adam's approved face and clothing are the references for these worlds. Clothing appears only on Adam in context, never as a detached wardrobe display. The generated portraits are close creative representations. The decision here is the visual world, not a new likeness approval. Final production will use the approved canon at full fidelity.",
    button: "Got it"
  },
  frameworkDefinitions: {
    archetype: "The timeless roles your brand naturally embodies.",
    founderSpectrum: "How closely your personal identity and business brand should overlap.",
    brandSliders: "The creative tensions that calibrate how your brand should feel."
  },
  strategy: [
    {
      label: "Product",
      title: "Independent cannabis data and operations advisory",
      body: "You help founders and C-suite leaders replace siloed spreadsheets with harmonized, seed-to-sale systems. The product is your independent judgment and your willingness to report the real finding."
    },
    {
      label: "People",
      title: "Founders and C-suite of small to mid-size cannabis businesses",
      body: "You are for operators who already know something is wrong with the numbers and are ready to fix it for real.",
      nested: { label: "Persona", value: "Founder or C-suite leader of a small-to-mid cannabis business" }
    },
    {
      label: "Purpose",
      title: "To build a cannabis industry that earns trust through data integrity",
      body: "The information gap is not just an operations problem. It is why the industry struggles to earn trust with regulators, investors, and consumers."
    },
    {
      label: "Promise",
      title: "Data Integrity",
      body: "Alignment before reporting. Visibility before story. Integrity before action. You do not dress up bad data or bend a finding toward a preferred conclusion.",
      nested: { label: "Brand DNA", value: "Data Integrity" }
    },
    {
      label: "Personality",
      title: "Sage-led authority with a friendly Ruler edge",
      body: "Thoughtful, knowledgeable, honest, calm, authoritative, and down-to-earth. You ground the conversation in facts, context, and lived experience without losing the human in the room."
    }
  ],
  archetype: "Sage primary. Ruler and Friend balancing.",
  personalityWords: [
    "Thoughtful", "Knowledgeable", "Honest", "Calm", "Authoritative",
    "Down-to-earth", "Witty", "Dependable", "Insightful", "Trustworthy"
  ],
  spectrum: {
    title: "Adam is the brand.",
    body: "The advisory work is inseparable from your earned perspective inside cannabis. The credibility is not borrowed from a platform, a vendor, or a framework."
  },
  sliders: {
    title: "Make the truth visible. Keep it human.",
    lines: [
      ["Transparent", "nothing obscured"],
      ["Rational", "not cold"],
      ["Literal", "no visual spin"],
      ["Talkative", "not noisy"],
      ["Earthy", "not lifestyle"],
      ["Luxurious", "never flashy"]
    ]
  },
  synthesis: {
    title: "Adam closes this information gap by treating data as a shared source of truth, not a marketing tool.",
    body: "Legal cannabis markets were supposed to make operations clearer, safer, and more accountable. Many operators are still trapped in half-matching reports and dashboards that do not agree."
  },
  directions: [
    {
      id: "clear-across-business",
      name: "Direction 1",
      premise: "The numbers should agree.",
      emotionalRead: "Bright, connected, and actively inside the whole business.",
      signature: "The Throughline. One translucent alignment line connects the shared report, product label, inventory tray, and glass partition.",
      outfit: "Adam appears in the approved navy quarter-zip, dark flat cap, and glasses only when shown in context.",
      risk: "It must never become blue SaaS, a trendy dispensary campaign, a wellness shop, or generic green cannabis branding.",
      compare: "The daylight route. It combines the best of the previous two boards into one connected seed-to-sale operating company.",
      introImage: "images/adam-freed-direction-1-intro.png?v=stylescape-crop-20260714b",
      introAlt: "Direction 1 stylescape crop showing Adam in conversation with an operator",
      introPosition: "center",
      introPositionMobile: "center",
      image: "images/adam-freed-direction-1-stylescape.png?v=approved-20260713",
      heroPosition: "48% center",
      bg: "#1D303C",
      accent: "#E87561"
    },
    {
      id: "on-speaking-terms",
      name: "Direction 2",
      premise: "Get the systems talking.",
      emotionalRead: "Bright, approachable, connected, and technically fluent without taking itself too seriously.",
      signature: "The Connection Cable. One cobalt braided cable physically links evidence, conversations, and applications.",
      outfit: "Adam appears in the approved navy quarter-zip, dark flat cap, and glasses only when shown in context.",
      risk: "It must never become childish cable art, generic SaaS, code, dashboard theater, empty offices, or tech-bro whimsy.",
      compare: "The more graphic and playful route. Technical confidence comes from connection and dry wit, not darkness.",
      introImage: "images/adam-freed-direction-2-intro.png?v=stylescape-crop-20260714b",
      introAlt: "Direction 2 stylescape crop showing Adam in conversation with the Connection Cable",
      introPosition: "center",
      introPositionMobile: "center",
      image: "images/adam-freed-direction-2-stylescape.png?v=approved-20260713",
      heroPosition: "50% center",
      bg: "#173A72",
      accent: "#4E8DFF"
    }
  ],
  choices: [
    { id: "clear-across-business", label: "Direction 1" },
    { id: "on-speaking-terms", label: "Direction 2" },
    { id: "revise", label: "Revise completely" }
  ]
};
