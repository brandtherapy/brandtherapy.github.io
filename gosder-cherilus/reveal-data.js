window.REVEAL_DATA = {
  slug: "gosder",
  client: "Gosder Cherilus",
  firstName: "Gosder",
  localOnly: false,
  responseEndpoint: "https://bt-api.florianp.com/api/reveal-response",
  likenessNotice: {
    title: "A note on likeness.",
    body: "Exact facial likeness is not the decision being made at this stage. These portraits are close creative representations used to evaluate the visual world, styling, and outfit. Final production will use a more accurate likeness.",
    button: "Got it"
  },
  strategy: [
    {
      label: "Product",
      title: "An inspiring example of resilience, devotion, and balance",
      body: "The product is your lived example. People see disciplined achievement and wholehearted enjoyment practiced in the same life, not preached as motivational theory."
    },
    {
      label: "People",
      title: "Driven people looking for a tribe where ambition and enjoyment belong together",
      body: "You are for doers whose chosen ambition creates pressure and responsibility. They want capable peers and permission to enjoy the life they are building without feeling guilty.",
      nested: { label: "Persona", value: "The Doer" }
    },
    {
      label: "Purpose",
      title: "To create the conditions for more people to achieve and live fully",
      body: "Your achievement is not the destination. The larger work is opening rooms, sharing the code, and creating the access, support, opportunity, and belonging that help others move forward."
    },
    {
      label: "Promise",
      title: "Strive and savor",
      body: "Work with devotion. Enjoy without guilt. Achievement and pleasure are not opposing modes. Each gives the other meaning.",
      nested: { label: "Brand DNA", value: "Strive and savor" }
    },
    {
      label: "Personality",
      title: "A stoic Renaissance man with an Epicurean appetite for life",
      body: "Calm under pressure and serious about standards, but curious about culture, craft, people, pleasure, faith, and the full range of a life well lived."
    }
  ],
  archetype: "Hero. Sage. Explorer.",
  personalityWords: [
    "Humble", "Selfless", "Determined", "Resilient", "Serious", "Generous",
    "Mature", "Stoic", "Curious", "Cultured", "Warm up close", "Mysterious"
  ],
  spectrum: {
    title: "Gosder leads the story.",
    body: "Primitiv, Bastion, foundation work, mentorship, football, and future ventures remain distinct. They become evidence of one man and one way of living rather than competing identities."
  },
  sliders: {
    title: "Quiet strength. Full life.",
    lines: [
      ["Calm", "not passive"],
      ["Masculine", "without machismo"],
      ["Luxurious", "without display"],
      ["Literal", "with mystery"],
      ["Organic", "with discipline"],
      ["Quiet", "with warmth"]
    ]
  },
  synthesis: {
    title: "The through-line is not endurance alone.",
    body: "It is what the strength makes possible: strive with devotion, savor life without guilt, and open the way for others."
  },
  directions: [
    {
      id: "the-standard",
      name: "The Standard",
      premise: "Lead by example, then leave the path open behind you.",
      emotionalRead: "Quiet strength, hard-earned wisdom, and leadership by example.",
      signature: "The Line. A disciplined dark band carries one restrained First Light break.",
      outfit: "Bare shaved head, heavyweight black T-shirt, deep olive overshirt, tapered black trousers, restrained gold cross, and sport watch.",
      risk: "It must never become grind culture, athlete worship, motivational sports advertising, or cold masculine theater.",
      compare: "More athletic, grounded, and disciplined. It puts resilience, mentorship, and the lived example first.",
      introImage: "images/gosder-the-standard-intro-v12.png?v=20260714-0945",
      introAlt: "Gosder in The Standard olive and black wardrobe",
      introPosition: "center 26%",
      introPositionMobile: "center 24%",
      image: "images/gosder-the-standard-v13.png?v=20260714-0945",
      bg: "#171917",
      accent: "#D8A45C"
    },
    {
      id: "life-in-full",
      name: "Life in Full",
      premise: "Refinement that stays grounded in the life he actually lives.",
      emotionalRead: "Worldly, masculine, relaxed, and fully alive.",
      signature: "The Turn. A precise ink line makes one confident turn into bordeaux.",
      outfit: "Black fitted cap and bare-head looks, indigo French workwear jacket, heavyweight chalk T-shirt, relaxed black technical trousers, black-and-cream high-top sneakers, restrained gold cross.",
      risk: "It must never become country-club wealth, Paris cosplay, fashion luxury, or beige lifestyle advertising.",
      compare: "More urban, colorful, cultivated, and social. It shows enjoyment as culture and connection, not status.",
      introImage: "images/gosder-life-in-full-intro-v7.png?v=20260714-0945",
      introAlt: "Gosder in the Life in Full urban evening world",
      introPosition: "center 32%",
      introPositionMobile: "center 28%",
      image: "images/gosder-life-in-full-v7.png?v=20260714-0945",
      bg: "#182337",
      accent: "#7B2331"
    }
  ],
  choices: [
    { id: "the-standard", label: "Direction 1: The Standard" },
    { id: "life-in-full", label: "Direction 2: Life in Full" },
    { id: "revise", label: "Revise the foundation" }
  ]
};
