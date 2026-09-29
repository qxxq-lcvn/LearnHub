/* LearnHub course content — English (source of truth for structure, answers and icons).
 * Other languages mirror this shape and only need the text fields. */
window.LH = window.LH || {}; LH.i18n = LH.i18n || {}; LH.i18n.en = LH.i18n.en || {};
LH.i18n.en.lessons = {

  /* ===================== MODULE 1 ===================== */

  "m1l1": {
    "title": "Introduction to the SDGs and the Sendai Framework",
    "summary": "In 2015 the world agreed on shared goals for a safer, fairer future. See how they fit together.",
    "minutes": 8,
    "blocks": [
      { "type": "text", "body": [
        "In 2015, the countries of the world made three big agreements that still shape how we reduce disaster risk:",
        "- The **Sendai Framework for Disaster Risk Reduction 2015–2030** (March 2015)",
        "- The **2030 Agenda** and its **17 Sustainable Development Goals (SDGs)** (September 2015)",
        "- The **Paris Agreement** on climate change (December 2015)",
        "They share one message: a disaster can wipe out years of development in minutes. Reducing disaster risk is part of building a better future for everyone."
      ] },
      { "type": "cards", "title": "SDG targets linked to disaster risk", "items": [
        { "icon": "hand", "title": "SDG 1 · No Poverty", "text": "Target 1.5: build the resilience of poor and vulnerable people and reduce their exposure to disasters. Disasters push millions of people into poverty every year." },
        { "icon": "heart", "title": "SDG 3 · Good Health", "text": "Target 3.d: strengthen early warning and the management of health risks. Hospitals must keep working during emergencies." },
        { "icon": "school", "title": "SDG 4 · Quality Education", "text": "Target 4.a: safe and inclusive learning environments. Schools should be safe places, and disaster education saves lives." },
        { "icon": "home", "title": "SDG 11 · Sustainable Cities", "text": "Target 11.5: reduce deaths, the number of people affected and economic losses from disasters. Target 11.b: cities adopt plans in line with the Sendai Framework." },
        { "icon": "sun", "title": "SDG 13 · Climate Action", "text": "Target 13.1: strengthen resilience and the ability to adapt to climate-related hazards and natural disasters in all countries." }
      ] },
      { "type": "text", "title": "The Sendai Framework", "body": [
        "The Sendai Framework was adopted on **18 March 2015** at the Third UN World Conference on Disaster Risk Reduction in **Sendai, Japan**, only four years after the 2011 disaster struck the same region. It runs from 2015 to 2030 and follows the Hyogo Framework for Action (2005–2015).",
        "Its goal is to **substantially reduce disaster risk and losses** in lives, livelihoods and health, and in the economic, physical, social, cultural and environmental assets of people, businesses, communities and countries.",
        "It marks a big shift: from managing disasters after they happen, to **managing risk before** they happen."
      ] },
      { "type": "cards", "title": "The 4 priorities for action", "items": [
        { "icon": "eye", "title": "1. Understanding disaster risk", "text": "Know the hazards, who is exposed and who is vulnerable. Collect data, map risks and share the knowledge." },
        { "icon": "users", "title": "2. Strengthening risk governance", "text": "Clear laws, plans and responsibilities, with governments, communities and businesses working together." },
        { "icon": "shield", "title": "3. Investing in DRR for resilience", "text": "Spend on prevention: safer schools and hospitals, protected ecosystems, and social protection." },
        { "icon": "hand", "title": "4. Preparedness and “Build Back Better”", "text": "Be ready to respond with early warning and drills, and rebuild more safely after a disaster." }
      ] },
      { "type": "sort", "title": "The 7 global targets", "prompt": "By 2030, the Sendai Framework aims to **reduce** some things and **increase** others. Sort each target.",
        "cats": ["Substantially reduce", "Substantially increase"],
        "items": [
          { "text": "Deaths from disasters", "cat": 0 },
          { "text": "The number of people affected by disasters", "cat": 0 },
          { "text": "Economic losses from disasters", "cat": 0 },
          { "text": "Damage to critical infrastructure and services such as schools and hospitals", "cat": 0 },
          { "text": "Countries with national and local DRR strategies", "cat": 1 },
          { "text": "International cooperation with developing countries", "cat": 1 },
          { "text": "Access to multi-hazard early warning systems and risk information", "cat": 1 }
        ] },
      { "type": "fact", "text": "The Sendai Framework says governments have the main role in reducing disaster risk, but the responsibility is shared with local authorities, businesses, communities — and every one of us." },
      { "type": "quiz", "questions": [
        { "q": "When and where was the Sendai Framework adopted?", "o": ["2005 in Hyogo, Japan", "2015 in Sendai, Japan", "2011 in Tokyo, Japan"], "a": 1,
          "e": "It was adopted on 18 March 2015 at the Third UN World Conference on Disaster Risk Reduction in Sendai." },
        { "q": "Which SDG target calls for reducing deaths and losses from disasters?", "o": ["Target 11.5", "Target 2.1", "Target 16.1"], "a": 0,
          "e": "SDG Target 11.5 aims to reduce deaths, people affected and economic losses caused by disasters." }
      ] },
      { "type": "links", "items": [
        { "label": "UNDRR: What is the Sendai Framework?", "url": "https://www.undrr.org/implementing-sendai-framework/what-sendai-framework" },
        { "label": "United Nations: the 17 Sustainable Development Goals", "url": "https://sdgs.un.org/goals" }
      ] }
    ]
  },

  "m1l2": {
    "title": "The 2011 Great East Japan Earthquake and Tsunami",
    "summary": "On 11 March 2011, one of the largest earthquakes ever recorded struck Japan. What happened, and why does it still matter?",
    "minutes": 9,
    "blocks": [
      { "type": "stats", "items": [
        { "value": "M 9.0", "label": "the largest earthquake ever recorded in Japan" },
        { "value": "14:46", "label": "local time on Friday, 11 March 2011" },
        { "value": "~40 m", "label": "highest tsunami run-up (Miyako, Iwate)" },
        { "value": "15,900", "label": "people died, and about 2,500 are still missing" }
      ], "source": "Figures from Japanese government agencies (Japan Meteorological Agency, National Police Agency)." },
      { "type": "timeline", "title": "11 March 2011", "items": [
        { "time": "14:46", "title": "The earthquake strikes", "text": "The epicentre is off the Tōhoku coast, about 130 km east of Sendai. Strong shaking lasts for several minutes." },
        { "time": "14:49", "title": "Tsunami warning issued", "text": "The Japan Meteorological Agency issues a major tsunami warning about three minutes after the quake." },
        { "time": "~15:10–15:30", "title": "Huge waves reach the coast", "text": "Within 30–60 minutes, the tsunami hits the coasts of Iwate, Miyagi and Fukushima, overtopping many seawalls." },
        { "time": "Afternoon", "title": "Water flows far inland", "text": "The tsunami travels up rivers and across flat land. On the Sendai Plain it reaches about 5 km inland." },
        { "time": "Evening", "title": "A nuclear emergency", "text": "The tsunami knocks out cooling at the Fukushima Daiichi Nuclear Power Plant, leading to a serious nuclear accident and long-term evacuations." },
        { "time": "Following days", "title": "Life in evacuation", "text": "At the peak, about 470,000 people are living in evacuation shelters or away from home." }
      ] },
      { "type": "text", "title": "A compound disaster", "body": [
        "The 2011 disaster was not a single event. The earthquake caused a tsunami, the tsunami caused a nuclear accident, and together they cut power, water, transport and supply chains across Japan and beyond. Experts call this a **compound disaster**.",
        "Japan was one of the best-prepared countries in the world, with seawalls, warning systems and regular drills. Yet the tsunami was far larger than many hazard maps assumed. The biggest lesson: **never rely only on assumptions**. Prepare for the worst, and evacuate immediately."
      ] },
      { "type": "text", "title": "Science corner: what is a tsunami?", "body": [
        "A **tsunami** is a series of powerful ocean waves caused by the sudden movement of a huge volume of water. The word comes from Japanese: “tsu” (harbour) + “nami” (wave). Most tsunamis are caused by:",
        "- Large undersea earthquakes that lift or drop the sea floor",
        "- Underwater or coastal landslides",
        "- Volcanic eruptions",
        "Unlike wind waves, a tsunami moves the whole column of water from the sea floor to the surface. Its speed depends on depth: **v = √(g × d)**. In the deep ocean (4,000 m) it travels at about 700 km/h, as fast as a jet plane, but may be less than 1 m high. In shallow water it slows down, the waves bunch together and grow much taller."
      ] },
      { "type": "sim" },
      { "type": "fact", "title": "Tsunami stones", "text": "Along the Tōhoku coast, old stone markers left by ancestors warn about past tsunamis. In Aneyoshi, Miyako, a stone reads “Do not build your homes below this point.” The villagers had respected it, and in 2011 the tsunami stopped below their homes." },
      { "type": "quiz", "questions": [
        { "q": "What made 2011 a “compound disaster”?", "o": ["It happened on the same day as a typhoon", "An earthquake, a tsunami and a nuclear accident happened one after another", "It affected only one city"], "a": 1,
          "e": "One hazard triggered the next: earthquake, then tsunami, then a nuclear accident, with huge knock-on effects." },
        { "q": "Where does a tsunami travel fastest?", "o": ["In the deep open ocean", "In shallow water near the coast", "In rivers and harbours"], "a": 0,
          "e": "The deeper the water, the faster the tsunami: v = √(g × d). At 4,000 m deep it moves at about 700 km/h." },
        { "q": "What is the biggest lesson from 2011?", "o": ["Seawalls make evacuation unnecessary", "Wait to confirm the wave height before leaving", "Do not rely only on assumptions; evacuate immediately"], "a": 2,
          "e": "The tsunami was bigger than many plans assumed. People who evacuated quickly and went high survived." }
      ] }
    ]
  },

  "m1l3": {
    "title": "Goryo Hamaguchi and World Tsunami Awareness Day",
    "summary": "A story of fire, rice and quick thinking — and how it became a United Nations day.",
    "minutes": 7,
    "blocks": [
      { "type": "text", "body": [
        "In 1854 (on the 5th day of the 11th month in the old Japanese calendar), the **Ansei-Nankai earthquake** shook Hiro village, today Hirogawa in Wakayama Prefecture. **Hamaguchi Goryō**, a local leader and soy-sauce businessman, understood that a tsunami was coming.",
        "It was getting dark, and villagers could not see where to run. So he set fire to the precious sheaves of harvested rice (**inamura**) in his fields. The flames lit the way up the hill to the Hiro Hachiman Shrine and guided people to safety. More than 90% of the villagers survived."
      ] },
      { "type": "timeline", "title": "From quick thinking to lasting protection", "items": [
        { "time": "1854", "title": "The fire of the rice sheaves", "text": "Burning rice sheaves guide villagers to high ground during the Ansei-Nankai tsunami." },
        { "time": "1855–1858", "title": "The Hiromura Embankment", "text": "Hamaguchi pays for a seawall about 600 m long, 20 m wide and 5 m high. Building it also gives jobs to villagers who lost everything, so they stay and rebuild." },
        { "time": "1897", "title": "The story travels the world", "text": "Writer Lafcadio Hearn tells the story in English in “A Living God”." },
        { "time": "1937", "title": "“Inamura no Hi” in schools", "text": "A Japanese version, “Inamura no Hi” (The Fire of the Rice Sheaves), appears in school textbooks." },
        { "time": "1946", "title": "The embankment proves its worth", "text": "When the Shōwa Nankai tsunami strikes, the embankment protects much of the village." },
        { "time": "2015", "title": "A UN day is born", "text": "On 22 December 2015, the UN General Assembly (resolution 70/203) names 5 November World Tsunami Awareness Day, following a proposal by Japan." }
      ] },
      { "type": "cards", "title": "Lessons from Inamura no Hi", "items": [
        { "icon": "eye", "title": "Read the signs", "text": "Hamaguchi noticed the strong shaking and the strange behaviour of the sea, and understood what it meant." },
        { "icon": "fire", "title": "Lead the evacuation", "text": "He used what he had — his own harvest — to warn and guide others. Early action saves lives." },
        { "icon": "shield", "title": "Build back better", "text": "After the disaster he invested in a seawall and in people's livelihoods, reducing future risk." },
        { "icon": "book", "title": "Pass it on", "text": "Stories, textbooks and a UN day keep the memory alive for new generations." }
      ] },
      { "type": "order", "title": "Put the story in order", "prompt": "Tap the events of the story in the order they happened.", "items": [
        "The earthquake shakes Hiro village",
        "Hamaguchi sees the danger from the sea",
        "He sets fire to the rice sheaves",
        "Villagers follow the light up to the shrine on the hill",
        "He builds the Hiromura Embankment",
        "The embankment protects the village in 1946"
      ] },
      { "type": "text", "title": "World Tsunami Awareness Day — 5 November", "body": [
        "Every year on 5 November, the world remembers the story of Inamura no Hi and promotes tsunami awareness: early warning, education, drills and traditional knowledge.",
        "Since 2016, Japan has also hosted a **World Tsunami Awareness Day High School Students Summit**, where young people from many countries share ideas for reducing tsunami risk."
      ] },
      { "type": "quiz", "questions": [
        { "q": "Why did Hamaguchi set fire to the rice sheaves?", "o": ["To stop the tsunami", "To guide villagers to high ground in the dark", "To keep people warm"], "a": 1,
          "e": "The fire showed villagers the way up the hill to safety as night fell." },
        { "q": "Which date is World Tsunami Awareness Day?", "o": ["11 March", "26 December", "5 November"], "a": 2,
          "e": "5 November, the date of the Ansei-Nankai tsunami in the old Japanese calendar and of the Inamura no Hi story." }
      ] },
      { "type": "links", "items": [
        { "label": "United Nations: World Tsunami Awareness Day", "url": "https://www.un.org/en/observances/tsunami-awareness-day" }
      ] }
    ]
  },

  "m1l4": {
    "title": "Introduction to Disaster Risk Reduction (DRR)",
    "summary": "Hazards are natural, but disasters are not. Learn what turns a hazard into a disaster.",
    "minutes": 8,
    "blocks": [
      { "type": "text", "body": [
        "A **hazard** is something that can cause harm, such as an earthquake, a tsunami or a flood. A **disaster** happens when a hazard hits people and places that are exposed and vulnerable, and the community cannot cope with its own resources.",
        "An earthquake in an empty desert is a hazard, not a disaster. The same earthquake under a crowded city with weak buildings can be a catastrophe. That is why experts say: **hazards are natural, disasters are not.**",
        "**Disaster Risk Reduction (DRR)** means preventing new risk, reducing existing risk and managing the risk that remains, so that hazards cause as little harm as possible."
      ] },
      { "type": "cards", "title": "Key words", "items": [
        { "icon": "quake", "title": "Hazard", "text": "An event that may cause loss of life, injury, damage or disruption. Example: a tsunami." },
        { "icon": "pin", "title": "Exposure", "text": "People, homes, schools and infrastructure located in hazard-prone areas. Example: a village on a low coast." },
        { "icon": "alert", "title": "Vulnerability", "text": "Conditions that make people more likely to be harmed: poverty, weak buildings, lack of information, or needing help to evacuate." },
        { "icon": "shield", "title": "Capacity", "text": "Strengths and resources that help people prepare, respond and recover: knowledge, drills, early warning, strong communities." },
        { "icon": "sprout", "title": "Resilience", "text": "The ability to resist, absorb, adapt to and recover from a hazard in a timely and efficient way." }
      ] },
      { "type": "risk", "title": "Try it: the risk equation",
        "equation": "Risk = Hazard × Exposure × Vulnerability ÷ Capacity",
        "labels": { "hazard": "Hazard", "exposure": "Exposure", "vulnerability": "Vulnerability", "capacity": "Capacity" },
        "help": {
          "hazard": "How strong or frequent is the hazard?",
          "exposure": "How many people and assets are in harm's way?",
          "vulnerability": "How easily could they be harmed?",
          "capacity": "How well can they prepare, respond and recover?"
        },
        "levels": ["Low", "Moderate", "High", "Very high"],
        "note": "We usually cannot stop a hazard. But we can reduce exposure and vulnerability, and build capacity. That is what DRR does." },
      { "type": "sort", "title": "Hazard, exposure, vulnerability or capacity?", "prompt": "Sort each example into the right group.",
        "cats": ["Hazard", "Exposure", "Vulnerability", "Capacity"],
        "items": [
          { "text": "A magnitude 8 undersea earthquake", "cat": 0 },
          { "text": "Heavy monsoon rain", "cat": 0 },
          { "text": "Houses built on a low-lying beach", "cat": 1 },
          { "text": "A market next to a river", "cat": 1 },
          { "text": "An older person living alone who cannot walk far", "cat": 2 },
          { "text": "Families who do not understand the language of the warnings", "cat": 2 },
          { "text": "A school that practises tsunami drills twice a year", "cat": 3 },
          { "text": "A community siren and trained volunteers", "cat": 3 }
        ] },
      { "type": "fact", "text": "Prevention is almost always cheaper than recovery. Studies of DRR investments find that every dollar spent on reducing risk can save several dollars in future losses." },
      { "type": "quiz", "questions": [
        { "q": "Why do experts say “disasters are not natural”?", "o": ["Because hazards never happen in nature", "Because disasters happen when hazards meet exposed, vulnerable people who cannot cope", "Because people cause every earthquake"], "a": 1,
          "e": "Hazards are natural events. Whether they become disasters depends on exposure, vulnerability and capacity." },
        { "q": "Which of these INCREASES capacity?", "o": ["Building homes closer to the shore", "Holding regular evacuation drills", "Ignoring hazard maps"], "a": 1,
          "e": "Drills build knowledge and habits, so people can act quickly and safely." }
      ] }
    ]
  },

  "m1l5": {
    "title": "Understanding the DRR Cycle",
    "summary": "Before, during and after: managing disaster risk is a cycle that never stops.",
    "minutes": 7,
    "blocks": [
      { "type": "text", "body": [
        "Disaster risk management is often shown as a cycle. Each phase prepares for the next, and the lessons from each disaster feed back into prevention. The aim is to put more effort **before** disasters, so there is less damage to deal with after."
      ] },
      { "type": "cycle", "title": "The DRR cycle", "center": "DRR cycle", "phases": [
        { "color": "#2d5a3d", "icon": "shield", "name": "Prevention and mitigation", "when": "Before",
          "text": ["Reduce the risk itself, long before a hazard strikes.", "- Land-use planning: don't build in high-risk zones", "- Strong buildings, seawalls and coastal forests", "- Protecting ecosystems such as mangroves"] },
        { "color": "#b8891f", "icon": "backpack", "name": "Preparedness", "when": "Before",
          "text": ["Get ready to act quickly and safely.", "- Early warning systems", "- Evacuation plans, routes and drills", "- Go-bags and emergency supplies"] },
        { "color": "#c8643b", "icon": "alert", "name": "Response", "when": "During and right after",
          "text": ["Save lives and meet urgent needs.", "- Evacuate to safe places", "- Search and rescue, first aid", "- Shelter, water, food and information"] },
        { "color": "#1f6f8b", "icon": "home", "name": "Recovery", "when": "After",
          "text": ["Rebuild lives, homes and livelihoods — and build back better.", "- Repair homes and services", "- Restore jobs and schools", "- Learn the lessons and reduce future risk"] }
      ] },
      { "type": "sort", "title": "Which phase?", "prompt": "Sort each action into its phase of the DRR cycle.",
        "cats": ["Prevention", "Preparedness", "Response", "Recovery"],
        "items": [
          { "text": "Planting a coastal forest to slow waves", "cat": 0 },
          { "text": "A law that stops homes being built in a flood zone", "cat": 0 },
          { "text": "Packing a go-bag", "cat": 1 },
          { "text": "Holding a school evacuation drill", "cat": 1 },
          { "text": "Rescuing people trapped by floodwater", "cat": 2 },
          { "text": "Opening an evacuation shelter", "cat": 2 },
          { "text": "Rebuilding a school with stronger materials", "cat": 3 },
          { "text": "Helping farmers restart their fields", "cat": 3 }
        ] },
      { "type": "text", "title": "Response: after the waves", "body": [
        "A tsunami is a series of waves that can keep arriving for hours. The first wave is often **not** the largest.",
        "- Stay on high ground until officials announce it is safe to return",
        "- Listen to a battery radio or official channels for updates",
        "- Stay out of floodwater: it may hide debris, sharp objects, sewage and live electric wires",
        "- Check yourself and others for injuries, and give first aid if you can",
        "- Send text messages instead of calling, to keep phone lines free for emergencies"
      ] },
      { "type": "quiz", "questions": [
        { "q": "Installing an early warning siren belongs to which phase?", "o": ["Preparedness", "Recovery", "Response"], "a": 0,
          "e": "Warning systems are set up before a disaster so people can act in time." },
        { "q": "The first tsunami wave has passed. Which is true?", "o": ["More waves may come, and later ones can be bigger", "It is safe to go home right away", "The danger is over once the water looks calm"], "a": 0,
          "e": "A tsunami is a series of waves. Stay on high ground until the official all-clear." }
      ] }
    ]
  },

  "m1l6": {
    "title": "Understanding DRR Planning",
    "summary": "A good plan turns knowledge into action. Learn the steps to plan for your home, school or community.",
    "minutes": 8,
    "blocks": [
      { "type": "text", "body": [
        "A DRR plan answers simple questions: **What could happen? Who could be affected? What will we do before, during and after? Who is responsible for what?**",
        "Plans can be made for a household, a school, a community or a whole country. The best plans are made together with the people they protect, and are practised regularly."
      ] },
      { "type": "order", "title": "The planning steps", "prompt": "Put the DRR planning steps in the right order.", "items": [
        "Identify the hazards, using hazard maps and local knowledge",
        "Find out who and what is exposed and vulnerable",
        "List your capacities and resources",
        "Decide actions, roles and evacuation routes",
        "Share the plan and practise it with drills",
        "Review and update the plan regularly"
      ] },
      { "type": "compare", "title": "Plans at every level", "cols": [
        { "icon": "home", "color": "#5f8a3e", "title": "Household", "items": ["Meeting point and a contact person", "Go-bags and an emergency box", "Who helps whom"] },
        { "icon": "school", "color": "#1f6f8b", "title": "School", "items": ["Evacuation routes and safe places", "Drills with students", "How children are handed over to families"] },
        { "icon": "users", "color": "#c8643b", "title": "Community", "items": ["Hazard maps and a warning system", "Evacuation centres and support for vulnerable people", "Volunteer teams and regular drills"] }
      ] },
      { "type": "text", "title": "Get ready before it happens", "body": [
        "If you live, work or travel near the coast:",
        "- **Know your zone:** find out whether your home, school or workplace is in a tsunami hazard zone",
        "- **Know your route:** find the fastest walking route to high ground or inland, and practise it — at night too",
        "- **Pack a go-bag:** water, food, a torch, a radio, medicines, a first aid kit and copies of documents",
        "- **Make a family plan:** agree on a meeting place and a contact person who lives outside the area",
        "- **Stay informed:** sign up for local alerts and learn what the warning sirens sound like"
      ] },
      { "type": "fact", "text": "Drills matter: people who have practised an evacuation route leave faster and more calmly in a real emergency." },
      { "type": "quiz", "questions": [
        { "q": "What is the FIRST step of DRR planning?", "o": ["Buy supplies", "Identify the hazards", "Hold a drill"], "a": 1,
          "e": "You need to know what could happen before you can decide what to do about it." },
        { "q": "Which is the most useful thing to do BEFORE a tsunami?", "o": ["Buy a surfboard", "Learn and practise your evacuation route", "Keep all your important papers at the beach house"], "a": 1,
          "e": "Knowing where to go and how to get there can save precious minutes when it matters most." }
      ] },
      { "type": "planlink" }
    ]
  },

  "m1r": {
    "title": "Module 1 Reflection",
    "summary": "Pause and think about what you learned in Module 1.",
    "minutes": 5,
    "blocks": [
      { "type": "text", "body": [
        "You explored global agreements, the 2011 disaster, the story of Inamura no Hi, the key ideas of DRR, the DRR cycle and planning. Answer at least two questions below. There are no wrong answers."
      ] },
      { "type": "reflect", "prompts": [
        "Which idea from this module surprised you most, and why?",
        "What hazards affect the place where you live? Who in your community is most vulnerable?",
        "What does Hamaguchi Goryō's story teach you that you can use today?",
        "What is one action you will take this month to reduce disaster risk at home or at school?"
      ] }
    ]
  },

  /* ===================== MODULE 2 ===================== */

  "m2l1": {
    "title": "The Miracle of Kamaishi",
    "summary": "How years of disaster education helped almost 3,000 schoolchildren survive.",
    "minutes": 9,
    "blocks": [
      { "type": "stats", "items": [
        { "value": "~3,000", "label": "elementary and junior high school students in Kamaishi" },
        { "value": "99.8%", "label": "of them survived the tsunami" },
        { "value": "5", "label": "children died; none of them were at school when the earthquake struck" },
        { "value": "1,000+", "label": "people died in the city of Kamaishi" }
      ], "source": "Source: Japan for Sustainability; Kamaishi City." },
      { "type": "text", "body": [
        "Kamaishi, a city on the Sanriku coast of Iwate Prefecture, has been hit by many tsunamis. From 2004, its schools worked with **Professor Toshitaka Katada** (Gunma University) on tsunami education. Students studied past tsunamis, walked their evacuation routes, practised drills — and took the lessons home to their families.",
        "In 2011 the city lost more than 1,000 people, but almost every schoolchild survived. It was not luck but preparation. For this reason, many people prefer to speak of the “lessons of Kamaishi” rather than a miracle."
      ] },
      { "type": "cards", "title": "Katada's three principles of evacuation", "items": [
        { "icon": "map", "title": "1. Don't trust assumptions", "text": "Hazard maps show what experts expect, not what will happen. Your home may be outside the marked zone and still be flooded." },
        { "icon": "mountain", "title": "2. Do your very best", "text": "In any situation, do everything you can. If one place is not safe enough, move higher." },
        { "icon": "flag", "title": "3. Be the first to evacuate", "text": "Run first, even if others are not moving yet. When you evacuate, others follow — and you save them too." }
      ] },
      { "type": "timeline", "title": "11 March 2011: Kamaishi-Higashi Junior High and Unosumai Elementary", "items": [
        { "time": "14:46", "title": "The earthquake", "text": "Strong, long shaking. The power goes out, so the school's announcement system does not work." },
        { "time": "Minutes later", "title": "The junior high students run", "text": "Students shout “A tsunami is coming!” and run toward the designated evacuation site. Seeing them, the elementary school children and teachers next door follow." },
        { "time": "Next", "title": "Higher, then higher again", "text": "At the evacuation site, students notice a cliff collapsing and the sea looking strange. The group keeps moving to higher ground, older students holding the hands of younger children." },
        { "time": "Then", "title": "The tsunami arrives", "text": "The tsunami floods both schools and reaches the first evacuation site. The children, now on higher ground, are safe." }
      ] },
      { "type": "fact", "title": "Tsunami tendenko", "text": "In the Sanriku region, the saying “tsunami tendenko” means: when a tsunami comes, each person flees to safety at once, without waiting to gather others first. When everyone trusts that the others will also flee, more people survive." },
      { "type": "text", "title": "Evacuate: go high, go far", "body": [
        "When you notice a natural warning sign or receive an official warning, act immediately:",
        "- **Go high:** move to ground at least 30 m above sea level, if you can",
        "- **Go far:** or move as far inland as possible — 3 km or more",
        "- **Go on foot:** roads jam quickly; walking or cycling is often faster than driving",
        "- **Go up:** if you cannot escape, climb to the 3rd floor or higher of a strong reinforced-concrete building",
        "Never go to the shore to watch a tsunami. If you can see the wave, you are too close to escape it."
      ] },
      { "type": "scenario", "title": "Your turn", "text": "You are at school near the coast. A strong earthquake has just stopped. The designated evacuation site is a low hill 500 m away. Nobody around you is moving yet.",
        "choices": [
          { "good": false, "text": "Wait in the classroom for instructions", "result": "Waiting loses precious minutes. In Kamaishi, the students did not wait: they ran, and others followed." },
          { "good": true, "text": "Run to the evacuation site shouting “Tsunami! Go high!”, and keep going higher if it does not look safe", "result": "Yes! This follows all three principles: don't rely on assumptions, do your best, and be the first to evacuate." },
          { "good": false, "text": "Go down to the beach to check whether the sea is moving", "result": "Never go to the shore to check. If you can see the wave, it is too late to escape." }
        ] },
      { "type": "quiz", "questions": [
        { "q": "Which is one of Katada's three principles?", "o": ["Always wait for adults to decide", "Be the first to evacuate", "Trust the hazard map completely"], "a": 1,
          "e": "Being first to evacuate saves you, and encourages others to follow." },
        { "q": "You feel a strong earthquake near the coast and there are no hills nearby. Where is the best place to go?", "o": ["Your car, to drive along the coast road", "The ground floor of a wooden house", "The 3rd floor or higher of a strong reinforced-concrete building"], "a": 2,
          "e": "This is called “vertical evacuation”. Upper floors of a strong concrete building can keep you above the water." }
      ] },
      { "type": "links", "items": [
        { "label": "Japan for Sustainability: The “Miracle of Kamaishi”", "url": "https://www.japanfs.org/en/news/archives/news_id034287.html" }
      ] }
    ]
  },

  "m2l2": {
    "title": "Arahama Elementary School: Overview",
    "summary": "A school 700 m from the sea that became a refuge for 320 people.",
    "minutes": 6,
    "blocks": [
      { "type": "stats", "items": [
        { "value": "700 m", "label": "from the coastline" },
        { "value": "4", "label": "floors in the school building" },
        { "value": "320", "label": "students, teachers and residents sheltered inside" },
        { "value": "2F", "label": "the tsunami flooded the building up to the second floor" }
      ], "source": "Source: City of Sendai." },
      { "type": "text", "body": [
        "Arahama Elementary School stood in the Arahama district of Wakabayashi Ward, **Sendai City**, Miyagi Prefecture — a coastal community of homes and farms on the flat Sendai Plain. Before 2011, 91 children studied there.",
        "On 11 March 2011, students, teachers and local residents evacuated to the upper floors and roof of the four-storey school. The tsunami surged through the neighbourhood and flooded the building up to the second floor. All **320 people** inside were rescued by the next day, many of them by helicopter.",
        "The district was so badly damaged that the city made it a zone where new homes cannot be built. Since **April 2017**, the preserved building has been open to the public as the **Ruins of the Great East Japan Earthquake: Sendai Arahama Elementary School**."
      ] },
      { "type": "cards", "title": "Why the school became a refuge", "items": [
        { "icon": "school", "title": "A tall, strong building", "text": "The reinforced-concrete building had four floors, higher than the tsunami." },
        { "icon": "height", "title": "Vertical evacuation", "text": "People went straight up to the 4th floor and the roof instead of trying to escape across flat land." },
        { "icon": "users", "title": "A known safe place", "text": "The school was an evacuation site, so residents knew to go there." },
        { "icon": "hand", "title": "Rescue", "text": "Rescuers could see the people on the roof and brought them to safety." }
      ] },
      { "type": "fact", "text": "Nearby, the embankment of the Sendai-Tobu Road, raised 7–10 m above the fields, stopped much of the tsunami from going further inland, and many people climbed it to escape." },
      { "type": "quiz", "questions": [
        { "q": "How far was Arahama Elementary School from the sea?", "o": ["About 7 km", "About 700 m", "About 70 m"], "a": 1,
          "e": "The school was about 700 m from the coast, on flat land with no nearby hills." },
        { "q": "What kind of evacuation saved the 320 people?", "o": ["Vertical evacuation to the upper floors and roof", "Driving along the coast road", "Staying on the ground floor"], "a": 0,
          "e": "With no hill nearby, going up a strong, tall building was the safest option." }
      ] },
      { "type": "links", "items": [
        { "label": "City of Sendai: Arahama Elementary School ruins", "url": "https://sendai-resilience.jp/en/efforts/government/information/preservation.html" }
      ] }
    ]
  },

  "m2l3": {
    "title": "Virtual Tour: Arahama Elementary School — Part 1",
    "summary": "Follow the tsunami from the sea to the school roof.",
    "minutes": 8,
    "blocks": [
      { "type": "text", "body": [
        "In this tour you follow the path of the tsunami from the coast to the school. Tap each numbered point. The drawing is simplified and not to scale."
      ] },
      { "type": "tour", "scene": "arahamaA", "title": "From the sea to the school", "stops": [
        { "title": "The coast and the seawall", "text": ["The Pacific Ocean is about 700 m east of the school. A seawall and a coastal pine forest stood between the sea and the homes.", "On 11 March the tsunami poured over the seawall and swept through the forest."] },
        { "title": "The coastal pine forest", "text": ["Pine forests have protected this coast from wind and sand for centuries. In 2011 many trees were snapped or washed away, and floating logs became dangerous debris.", "Today the forest is being replanted."] },
        { "title": "The Arahama neighbourhood", "text": ["Between the sea and the school were homes, farms and fields. Almost everything was destroyed; only foundations remain today.", "The land is flat, so there was no hill to run to. Tall, strong buildings were the only “high ground”."] },
        { "title": "1st floor", "text": ["The ground-floor classrooms were completely flooded. Walls, windows and fittings were smashed by water and debris.", "In the preserved building you can still see the damage."] },
        { "title": "2nd floor: the high-water line", "text": ["The tsunami reached the second floor, carrying cars, parts of houses and trees into the building.", "Signs at the site show how high the water rose."] },
        { "title": "4th floor and the roof", "text": ["About 320 people waited here: students, teachers, parents and neighbours, on a cold March night.", "They watched their town being swept away, but they were above the water."] },
        { "title": "Rescue from the sky", "text": ["Helicopters lifted people from the roof. By the next day, everyone had been rescued.", "Lesson: when there is no high ground nearby, a tall, strong building can save lives. This is called vertical evacuation."] }
      ] },
      { "type": "quiz", "questions": [
        { "q": "Why was the school roof the safest place in Arahama?", "o": ["The roof had a special alarm", "The area was flat, and the tall building rose above the tsunami", "The tsunami never reached the school"], "a": 1,
          "e": "On flat land, height is found in tall, strong buildings." }
      ] }
    ]
  },

  "m2l4": {
    "title": "Virtual Tour: Arahama Elementary School — Part 2",
    "summary": "Inside the memorial: exhibitions, stories and the view from the roof today.",
    "minutes": 8,
    "blocks": [
      { "type": "tour", "scene": "arahamaB", "title": "The memorial and the view from the roof", "stops": [
        { "title": "“The 3.11 Memories of Arahama”", "text": ["An exhibition on the 4th floor tells what happened on 11 March, with photos taken at the school.", "It shows how people waited, helped each other and were rescued."] },
        { "title": "Films and testimonies", "text": ["Documentary films show the school and the district before and after the disaster, and the voices of people who were there."] },
        { "title": "“Preparing for Tomorrow”", "text": ["This exhibition asks visitors to think about their own preparation: where would you evacuate? What would you bring?", "It connects the memory of Arahama with actions for the future."] },
        { "title": "The sea and the seawall", "text": ["From the roof you can see the ocean and the rebuilt seawall. The sea looks calm today, which is exactly why remembering matters."] },
        { "title": "Where the homes were", "text": ["The open land below was once a busy neighbourhood. Now new homes are not allowed there.", "Former residents come back to visit, remember and share their stories."] },
        { "title": "The coastal forest", "text": ["Young pine trees are being planted to rebuild the coastal forest. Together with seawalls and raised roads, it forms “multiple lines of defence”."] },
        { "title": "A raised road as a second barrier", "text": ["After 2011, Sendai raised a road running parallel to the coast. Like the Sendai-Tobu Road embankment in 2011, it can slow the water and give people a place to escape."] }
      ] },
      { "type": "sort", "title": "Multiple lines of defence", "prompt": "Sendai now combines several kinds of protection. Sort each measure.",
        "cats": ["Structures", "Nature", "People and knowledge"],
        "items": [
          { "text": "Seawall", "cat": 0 },
          { "text": "Raised road", "cat": 0 },
          { "text": "Tsunami evacuation tower", "cat": 0 },
          { "text": "Coastal pine forest", "cat": 1 },
          { "text": "Sand dunes", "cat": 1 },
          { "text": "Evacuation drills", "cat": 2 },
          { "text": "Hazard maps", "cat": 2 },
          { "text": "Preserved ruins and storytelling", "cat": 2 }
        ] },
      { "type": "fact", "text": "Preserved disaster ruins such as Arahama Elementary School help future generations understand the danger — real places that tell the story better than any textbook." },
      { "type": "quiz", "questions": [
        { "q": "What is the main purpose of preserving Arahama Elementary School?", "o": ["To store school equipment", "To pass on the memory and lessons of the disaster to future generations", "To attract surfers"], "a": 1,
          "e": "The ruins are a place of memory and learning, so the lessons are not forgotten." }
      ] },
      { "type": "links", "items": [
        { "label": "City of Sendai: Arahama Elementary School ruins", "url": "https://sendai-resilience.jp/en/efforts/government/information/preservation.html" }
      ] }
    ]
  },

  "m2l5": {
    "title": "Virtual Tour: Okawa Elementary School — Part 1",
    "summary": "What happened in the 51 minutes between the earthquake and the tsunami.",
    "minutes": 9,
    "blocks": [
      { "type": "text", "body": [
        "This lesson is about a tragedy in which many children and teachers lost their lives. We study it with respect, so that no school ever faces the same fate."
      ] },
      { "type": "stats", "items": [
        { "value": "74", "label": "children died or are still missing (the school had 108 students)" },
        { "value": "10", "label": "teachers died" },
        { "value": "3.7 km", "label": "from the sea, near the Kitakami River" },
        { "value": "51 min", "label": "between the earthquake and the tsunami" }
      ], "source": "Source: Ishinomaki City; court records." },
      { "type": "tour", "scene": "okawaA", "title": "The school on 11 March 2011", "stops": [
        { "title": "The school", "text": ["Okawa Elementary School stood beside the Kitakami River in Ishinomaki City, Miyagi. It was 3.7 km from the sea and outside the flood zone on the official hazard map.", "It was even a designated evacuation site for the community, so many people believed they were safe there."] },
        { "title": "The schoolyard", "text": ["After the shaking stopped, children and teachers gathered in the schoolyard, as practised. Then they waited, for more than 40 minutes, while the adults discussed where to go.", "Radio warnings said a major tsunami was coming."] },
        { "title": "The route toward the bridge", "text": ["Finally the group began walking toward a raised spot near the Shin-Kitakami Ōhashi Bridge, about 200 m away. It was only 6–7 m high — lower than the tsunami.", "The tsunami came up the river and over the banks just as they set off."] },
        { "title": "The hill behind the school", "text": ["A hill stood just behind the school, only a short walk away. Children had climbed it before during classes.", "The courts later said the school should have prepared a plan to evacuate to higher ground like this."] },
        { "title": "The Kitakami River", "text": ["The tsunami travelled up the river much faster than people expected, then spilled over the banks. Rivers act like highways for tsunamis.", "Lesson: if you live near a river that flows into the sea, you are also in danger."] },
        { "title": "3.7 km from the sea", "text": ["Many people thought 3.7 km was far enough from the sea. At the school, the tsunami was about 8.6 m high.", "Lesson: distance alone does not make you safe. Height does."] }
      ] },
      { "type": "scenario", "title": "Think about it", "text": "You are a teacher. A huge earthquake has just stopped. The radio says a major tsunami is coming. The hazard map says your school is safe, but there is a hill two minutes away. The children are frightened.",
        "choices": [
          { "good": false, "text": "Stay in the schoolyard until the warning ends", "result": "Waiting is dangerous. At Okawa, precious minutes passed in the schoolyard." },
          { "good": true, "text": "Lead everyone up the hill right away, even if it turns out to be unnecessary", "result": "Yes. Evacuating “for nothing” is always better than being too late. This is the lesson the Okawa families ask everyone to remember." },
          { "good": false, "text": "Walk everyone toward the river bridge because the road is easier", "result": "Moving toward a river or low ground brings you closer to the tsunami." }
        ] },
      { "type": "quiz", "questions": [
        { "q": "Why is Okawa Elementary School a lesson about hazard maps?", "o": ["The school was inside the red zone", "The school was outside the predicted flood zone, but the tsunami still reached it", "The hazard map predicted the exact tsunami height"], "a": 1,
          "e": "Hazard maps are based on assumptions. Real tsunamis can be bigger." },
        { "q": "Rivers connected to the sea…", "o": ["are safe during a tsunami", "can carry a tsunami far inland", "stop tsunamis"], "a": 1,
          "e": "A tsunami can travel several kilometres up a river and flood land far from the coast." }
      ] }
    ]
  },

  "m2l6": {
    "title": "Virtual Tour: Okawa Elementary School — Part 2",
    "summary": "The memorial today, the court's message and the voices of the families.",
    "minutes": 8,
    "blocks": [
      { "type": "tour", "scene": "okawaB", "title": "The memorial site today", "stops": [
        { "title": "The clock", "text": ["The clocks at the school stopped at about 15:37, when the tsunami struck — 51 minutes after the earthquake.", "It reminds visitors how much time there was to escape."] },
        { "title": "The ruined building", "text": ["The curved school building has been kept as it was after the tsunami, with broken walls and a collapsed walkway.", "Visitors stay behind the fences for safety and walk around the site."] },
        { "title": "The outdoor stage", "text": ["Children once performed here. A mural painted by former students still decorates the stage — a sign of the lively school it once was."] },
        { "title": "The memorial monument", "text": ["A monument and a flower altar honour the children and teachers who died. Many visitors stop here to pray and reflect."] },
        { "title": "The Okawa Memorial Hall", "text": ["Opened in July 2021 together with the preserved site, the hall shows photos from before and after the disaster, and a model of the area."] },
        { "title": "The storytellers", "text": ["Bereaved families and survivors guide visitors and share their stories, so that no school ever repeats this tragedy.", "Their message: prepare in advance, and evacuate decisively."] }
      ] },
      { "type": "text", "title": "What the courts said", "body": [
        "The families of 23 children took the city and the prefecture to court. In 2018, the Sendai High Court ruled that the school and the local authorities had failed to prepare properly **before** the disaster — for example, by not setting a safe evacuation site and route in the school's plan. In October 2019, the Supreme Court confirmed the ruling.",
        "The message to every school: study your local risks and make realistic evacuation plans. Do not only rely on hazard maps."
      ] },
      { "type": "compare", "title": "Two schools, two outcomes", "cols": [
        { "icon": "school", "color": "#5f8a3e", "title": "Arahama", "items": ["700 m from the sea, on flat land", "A tall, four-storey concrete building", "People moved up quickly: vertical evacuation", "All 320 people survived"] },
        { "icon": "heart", "color": "#c8643b", "title": "Okawa", "items": ["3.7 km from the sea, beside a river", "Outside the hazard map's flood zone", "A long wait in the schoolyard, then a route toward low ground", "74 children and 10 teachers died"] }
      ] },
      { "type": "quiz", "questions": [
        { "q": "What did the 2019 Supreme Court decision mean for schools?", "o": ["Schools do not need evacuation plans", "Schools must prepare realistic evacuation plans in advance", "Only teachers are responsible for disasters"], "a": 1,
          "e": "The courts focused on preparation before the disaster, not only on decisions made on the day." },
        { "q": "What was the key difference between Arahama and Okawa?", "o": ["The weather that day", "How quickly people moved to a place higher than the tsunami", "The colour of the buildings"], "a": 1,
          "e": "At Arahama, people went up immediately. At Okawa, time was lost and the route led toward low ground." }
      ] },
      { "type": "links", "items": [
        { "label": "Ishinomaki City: Okawa Elementary School ruins", "url": "https://www.ishinomakiikou.net/en/okawa/" }
      ] }
    ]
  },

  "m2r": {
    "title": "Module 2 Reflection",
    "summary": "What can we learn from Kamaishi, Arahama and Okawa?",
    "minutes": 5,
    "blocks": [
      { "type": "text", "body": [
        "Japan's experience shows that preparation, quick decisions and clear plans make the difference between life and death. Answer at least two questions."
      ] },
      { "type": "reflect", "prompts": [
        "What did the children of Kamaishi do that you could also do?",
        "Compare Arahama and Okawa. Which decisions made the difference?",
        "If a big earthquake struck while you were at school, where would you go? How long would it take?",
        "How can we remember past disasters so that future generations are safer?"
      ] }
    ]
  },

  /* ===================== MODULE 3 ===================== */

  "m3l1": {
    "title": "Case 1: The 2004 Indian Ocean Tsunami",
    "summary": "The deadliest tsunami in recorded history — and how it changed early warning around the world.",
    "minutes": 9,
    "blocks": [
      { "type": "map", "map": "asiapacific", "title": "Tsunamis across the Asia-Pacific", "pins": [
        { "label": "Sumatra, Indonesia · 2004", "text": "A magnitude 9.1 earthquake. The tsunami struck 14 countries around the Indian Ocean." },
        { "label": "Samoa and Tonga · 2009", "text": "A magnitude 8.1 earthquake. The waves arrived within minutes." },
        { "label": "Sunda Strait, Indonesia · 2018", "text": "The collapse of the Anak Krakatau volcano. No earthquake, and no warning." },
        { "label": "Tōhoku, Japan · 2011", "text": "A magnitude 9.0 earthquake and tsunami (Module 2)." },
        { "label": "Mapanas, Philippines", "text": "A Pacific coast town facing the Philippine Trench (Lesson 7)." },
        { "label": "Hiro village, Japan · 1854", "text": "Where Hamaguchi Goryō lit the rice sheaves (Module 1)." }
      ] },
      { "type": "stats", "items": [
        { "value": "M 9.1", "label": "earthquake off northern Sumatra on 26 December 2004" },
        { "value": "~1,300 km", "label": "length of the fault that ruptured" },
        { "value": "14", "label": "countries affected" },
        { "value": "~228,000", "label": "people killed" }
      ] },
      { "type": "timeline", "title": "26 December 2004", "items": [
        { "time": "07:58", "title": "The earthquake", "text": "Off the west coast of northern Sumatra (local time). The shaking lasts for several minutes." },
        { "time": "~15–30 min", "title": "Aceh is hit", "text": "Waves more than 20 m high strike Banda Aceh and the west coast of Aceh." },
        { "time": "~1.5–2 hours", "title": "Thailand, Sri Lanka and India", "text": "Waves reach beaches in Thailand, then Sri Lanka and India. Most people have no idea a tsunami is coming." },
        { "time": "~7 hours", "title": "Africa", "text": "Waves reach Somalia and other East African coasts, thousands of kilometres away." }
      ] },
      { "type": "text", "title": "Why so many died", "body": [
        "In 2004 the Indian Ocean had **no tsunami warning system**. Scientists knew a huge earthquake had happened, but there was no system to warn coastal communities across the region, even hours before the waves arrived. Many people had never heard of a tsunami. When the sea drew back, some walked out to look at the exposed seabed.",
        "After the disaster, countries built the **Indian Ocean Tsunami Warning and Mitigation System**, coordinated by UNESCO's Intergovernmental Oceanographic Commission. It has been fully operational since 2011."
      ] },
      { "type": "cards", "title": "Stories of survival", "items": [
        { "icon": "school", "title": "Tilly Smith, Phuket", "text": "A 10-year-old British girl on holiday in Thailand remembered a geography lesson about tsunamis. When she saw the sea bubbling and pulling back, she warned her parents, and the beach was cleared. About 100 people were saved." },
        { "icon": "book", "title": "Smong, Simeulue Island", "text": "An oral tradition called “Smong” taught people to run to the hills when the sea retreats after an earthquake. Almost all of the island's residents survived, although it was very close to the epicentre." }
      ] },
      { "type": "text", "title": "Nature's warning signs", "body": [
        "Official warnings may not arrive in time. Learn to recognise nature's signals:",
        "- **Feel:** a strong earthquake that makes it hard to stand, or a long, rolling earthquake lasting 20 seconds or more",
        "- **See:** the sea suddenly draining away and exposing the sea floor, or an unusual rise of water",
        "- **Hear:** a loud roar from the ocean, like a train or a jet plane",
        "If you notice **any one** of these signs, do not wait for an official warning. Go to high ground or inland immediately."
      ] },
      { "type": "quiz", "questions": [
        { "q": "You are at the beach and the sea suddenly pulls back far, exposing the sea floor. What should you do?", "o": ["Walk out to collect shells and fish", "Wait for an official siren before doing anything", "Move to high ground or inland immediately"], "a": 2,
          "e": "A sudden retreat of the sea is a strong sign that a tsunami is coming. The wave can arrive within minutes." },
        { "q": "What did the Indian Ocean lack in 2004?", "o": ["Scientists", "A regional tsunami warning system", "Seismometers anywhere in the world"], "a": 1,
          "e": "The earthquake was detected, but there was no system to warn coastal communities around the Indian Ocean." }
      ] }
    ]
  },

  "m3l2": {
    "title": "Case 2: Samoa–Tonga Tsunami Overview",
    "summary": "When the tsunami arrives in minutes, people must be their own early warning.",
    "minutes": 7,
    "blocks": [
      { "type": "stats", "items": [
        { "value": "M 8.1", "label": "earthquake near the Tonga Trench on 29 September 2009" },
        { "value": "06:48", "label": "local time — early morning" },
        { "value": "~14 m", "label": "highest waves on the coast of Samoa" },
        { "value": "189", "label": "people killed: Samoa 149, American Samoa 31, Tonga 9" }
      ] },
      { "type": "text", "body": [
        "The earthquake struck close to the islands, so the first waves arrived within about **10–20 minutes** — too fast for official warnings to reach everyone. This is called a **near-field** (local) tsunami.",
        "On the south coast of Upolu, Samoa, whole villages were destroyed. Survival often depended on whether people treated the shaking as a warning and moved inland immediately. Some people lost their lives because they went to the shore to look, or went back for belongings."
      ] },
      { "type": "compare", "title": "Near-field or far-field?", "cols": [
        { "icon": "alert", "color": "#c8643b", "title": "Near-field tsunami", "items": ["The earthquake is close to the coast", "Waves arrive within minutes", "You will feel the earthquake", "Your warning: the shaking itself — evacuate at once"] },
        { "icon": "globe", "color": "#1f6f8b", "title": "Far-field tsunami", "items": ["The earthquake is far away, even across an ocean", "Waves arrive after hours", "You may feel nothing", "Official warnings give time to evacuate"] }
      ] },
      { "type": "fact", "text": "In January 2022, the eruption of the Hunga Tonga–Hunga Ha'apai volcano in Tonga sent tsunami waves across the Pacific, reaching as far as Japan and South America. Tsunamis are not only caused by earthquakes." },
      { "type": "scenario", "title": "Your turn", "text": "You are on a Pacific island beach at 7 a.m. The ground shakes strongly for about 30 seconds, then stops. Your phone shows no alert.",
        "choices": [
          { "good": false, "text": "Wait for an alert on your phone", "result": "In a near-field tsunami the waves may arrive before any alert. The shaking is your warning." },
          { "good": true, "text": "Go inland or uphill on foot right away, and tell others to come", "result": "Yes! Move immediately and bring others with you. Stay there until the official all-clear." },
          { "good": false, "text": "Go back to your room to pack your things", "result": "Every minute counts. Leave your belongings — your life is more important." }
        ] },
      { "type": "quiz", "questions": [
        { "q": "Why was there so little time for warnings in 2009?", "o": ["The earthquake was close, so the waves arrived within minutes", "The warning centre was closed", "It happened at night"], "a": 0,
          "e": "In a near-field tsunami, the time between the earthquake and the waves is very short." },
        { "q": "In a near-field tsunami, what is your warning?", "o": ["A message from friends", "The earthquake itself", "A TV report"], "a": 1,
          "e": "If you feel a strong or long earthquake at the coast, evacuate without waiting." }
      ] }
    ]
  },

  "m3l3": {
    "title": "Case 3: The 2018 Sunda Strait Tsunami",
    "summary": "A tsunami without an earthquake — and a gap in the warning system.",
    "minutes": 7,
    "blocks": [
      { "type": "stats", "items": [
        { "value": "22 Dec 2018", "label": "around 21:30, a Saturday night in the holiday season" },
        { "value": "0", "label": "earthquakes: the tsunami came from a volcano" },
        { "value": "426", "label": "people killed" },
        { "value": "14,000+", "label": "people injured" }
      ] },
      { "type": "text", "body": [
        "**Anak Krakatau** (“Child of Krakatoa”) is a volcano in the Sunda Strait, between the islands of Java and Sumatra in Indonesia. On the night of 22 December 2018, during an eruption, a large part of its southwestern side collapsed into the sea. The falling rock pushed the water and created a tsunami.",
        "The waves hit the coasts of Banten (Java) and Lampung (Sumatra) with almost no warning. Many people were at beaches and resorts for the holidays. At Tanjung Lesung, the waves struck a concert by the band Seventeen while the audience watched."
      ] },
      { "type": "text", "title": "Why was there no warning?", "body": [
        "Indonesia's tsunami warning system was designed to detect **earthquakes**. It looks for strong quakes and then predicts tsunamis. This tsunami had no earthquake, so the system did not detect it in time. In the dark, it was also hard to see the sea change.",
        "After the disaster, Indonesia added instruments to monitor **sea levels and volcanic activity**, so that tsunamis from volcanoes and landslides can also be detected."
      ] },
      { "type": "sort", "title": "What caused the tsunami?", "prompt": "Sort each tsunami by its cause.",
        "cats": ["Earthquake", "Volcano", "Landslide"],
        "items": [
          { "text": "2004 Indian Ocean", "cat": 0 },
          { "text": "2011 Tōhoku, Japan", "cat": 0 },
          { "text": "2009 Samoa–Tonga", "cat": 0 },
          { "text": "2018 Sunda Strait", "cat": 1 },
          { "text": "2022 Hunga Tonga", "cat": 1 },
          { "text": "1958 Lituya Bay, Alaska (a rockfall into a bay)", "cat": 2 }
        ] },
      { "type": "fact", "text": "In 1883, the giant eruption of Krakatoa created tsunamis that killed more than 36,000 people. Anak Krakatau rose from the sea in 1927, in the same place." },
      { "type": "quiz", "questions": [
        { "q": "What caused the 2018 Sunda Strait tsunami?", "o": ["A large earthquake", "The collapse of part of the Anak Krakatau volcano", "A storm surge"], "a": 1,
          "e": "Part of the volcano slid into the sea and displaced the water." },
        { "q": "Why was the tsunami not detected in time?", "o": ["The system only looked for tsunamis caused by earthquakes", "Nobody lived on the coast", "It happened in the afternoon"], "a": 0,
          "e": "Warning systems must watch for all tsunami sources, including volcanoes and landslides." }
      ] }
    ]
  },

  "m3l4": {
    "title": "Understanding Early Warning Systems",
    "summary": "A warning only works if it reaches people — and people know what to do.",
    "minutes": 9,
    "blocks": [
      { "type": "text", "body": [
        "An **early warning system** gives people time to act before a hazard strikes. The United Nations describes **four elements**. If any one of them is missing, the whole chain breaks."
      ] },
      { "type": "cards", "title": "The four elements of early warning", "items": [
        { "icon": "map", "title": "1. Risk knowledge", "text": "Know the hazards and who is at risk: hazard maps, history, local knowledge." },
        { "icon": "radio", "title": "2. Detection and forecasting", "text": "Seismometers, sea-level gauges and ocean buoys detect the hazard. Scientists forecast the danger." },
        { "icon": "flag", "title": "3. Warning communication", "text": "Warnings reach everyone in time, in a form they understand: sirens, phones, radio, loudspeakers, community leaders." },
        { "icon": "users", "title": "4. Preparedness to respond", "text": "People know what the warning means and what to do: routes, drills, plans." }
      ] },
      { "type": "order", "title": "From detection to action", "prompt": "Put the steps of a tsunami warning in order.", "items": [
        "A seismometer detects a strong undersea earthquake",
        "Sea-level gauges and ocean buoys confirm a tsunami wave",
        "The warning centre issues a tsunami warning",
        "Warnings go out by siren, phone, radio and loudspeaker",
        "People evacuate to high ground using practised routes"
      ] },
      { "type": "sort", "title": "Which element failed?", "prompt": "Each situation shows a broken link. Which element is missing?",
        "cats": ["Risk knowledge", "Detection", "Communication", "Preparedness"],
        "items": [
          { "text": "A town is built on land that nobody knew had flooded before", "cat": 0 },
          { "text": "2018 Sunda Strait: the sensors only looked for earthquakes", "cat": 1 },
          { "text": "A warning is issued, but a village has no phone signal and no siren", "cat": 2 },
          { "text": "Warnings are only in a language some residents do not speak", "cat": 2 },
          { "text": "The siren works, but visitors do not know what it means", "cat": 3 },
          { "text": "People have never practised evacuating", "cat": 3 }
        ] },
      { "type": "text", "title": "Early Warnings for All", "body": [
        "In 2022, the UN Secretary-General launched **Early Warnings for All**, which aims to protect every person on Earth with early warning systems by the end of 2027.",
        "Early warning must be **people-centred**. The “last mile” — reaching the most remote and vulnerable people — is the hardest and most important part. Remember too that **nature's warning signs** are part of the system: if you feel a strong earthquake at the coast, that is your warning."
      ] },
      { "type": "fact", "title": "DART buoys", "text": "Pressure sensors on the deep sea floor detect a tsunami passing overhead and send the data by satellite to warning centres within minutes." },
      { "type": "quiz", "questions": [
        { "q": "How many elements does a people-centred early warning system have?", "o": ["Two", "Four", "Ten"], "a": 1,
          "e": "Risk knowledge, detection and forecasting, warning communication, and preparedness to respond." },
        { "q": "Which is an example of the “warning communication” element?", "o": ["A seismometer", "Loudspeakers and phone alerts in local languages", "A hazard map"], "a": 1,
          "e": "Communication is about getting the warning to everyone, in a way they understand." }
      ] },
      { "type": "links", "items": [
        { "label": "WMO: Early Warnings for All", "url": "https://wmo.int/activities/early-warnings-all" }
      ] }
    ]
  },

  "m3l5": {
    "title": "A Changing Climate and DRR",
    "summary": "Climate change does not cause tsunamis — but it is changing many other risks.",
    "minutes": 8,
    "blocks": [
      { "type": "text", "body": [
        "Climate change is making many hazards more frequent or more intense: heavy rain and floods, heatwaves, droughts and stronger storms. Rising seas also let coastal flooding reach further inland.",
        "Tsunamis are caused by earthquakes, landslides and volcanoes, **not** by the climate. But higher seas mean that a future tsunami or storm surge can reach further inland.",
        "Because climate and disasters are so closely linked, experts connect **climate change adaptation (CCA)** with DRR. The Paris Agreement and the Sendai Framework were both agreed in 2015."
      ] },
      { "type": "stats", "items": [
        { "value": "~20 cm", "label": "global sea-level rise between 1901 and 2018" },
        { "value": "1.1 °C", "label": "global warming above pre-industrial levels (2011–2020)" }
      ], "source": "Source: IPCC Sixth Assessment Report (2021)." },
      { "type": "sort", "title": "Climate-related or not?", "prompt": "Which hazards are made worse by climate change?",
        "cats": ["Made worse by climate change", "Not caused by the climate"],
        "items": [
          { "text": "Heavier rain and flash floods", "cat": 0 },
          { "text": "Heatwaves", "cat": 0 },
          { "text": "Coastal flooding from higher seas", "cat": 0 },
          { "text": "More intense tropical storms", "cat": 0 },
          { "text": "Earthquakes", "cat": 1 },
          { "text": "Tsunamis from undersea earthquakes", "cat": 1 },
          { "text": "Volcanic eruptions", "cat": 1 }
        ] },
      { "type": "cards", "title": "Nature-based solutions", "items": [
        { "icon": "tree", "title": "Mangroves", "text": "Mangrove forests reduce the energy of waves and storm surges, and store carbon." },
        { "icon": "leaf", "title": "Coastal forests and dunes", "text": "Trees and sand dunes act as buffers and slow floodwater." },
        { "icon": "wave", "title": "Wetlands", "text": "Wetlands soak up floodwater like a sponge." },
        { "icon": "sprout", "title": "Green cities", "text": "Trees and parks cool cities during heatwaves and absorb heavy rain." }
      ] },
      { "type": "fact", "text": "Pacific island nations are among the most exposed to sea-level rise, even though they produce a tiny share of global emissions. Young Pacific Islanders have become strong voices for climate action." },
      { "type": "quiz", "questions": [
        { "q": "Does climate change cause tsunamis?", "o": ["Yes, warmer oceans create tsunamis", "No, but higher seas can let tsunamis and storm surges reach further inland", "Yes, stronger storms cause all tsunamis"], "a": 1,
          "e": "Tsunamis have geological causes. Sea-level rise increases how far flooding can reach." },
        { "q": "Which is a nature-based solution?", "o": ["Planting mangroves", "Cutting coastal forests", "Building on wetlands"], "a": 0,
          "e": "Healthy ecosystems protect communities and store carbon at the same time." }
      ] }
    ]
  },

  "m3l6": {
    "title": "The Role of Youth in DRR",
    "summary": "Young people are not only affected by disasters — they are agents of change.",
    "minutes": 7,
    "blocks": [
      { "type": "quote", "text": "Children and youth are agents of change and should be given the space and modalities to contribute to disaster risk reduction.", "by": "Sendai Framework, paragraph 36" },
      { "type": "text", "body": [
        "Young people are a large share of the population in the Asia-Pacific. They learn fast, use technology, are connected to friends and family, and have energy to act. In Kamaishi, it was students who led the evacuation. In Thailand, a 10-year-old's school lesson saved a beach."
      ] },
      { "type": "cards", "title": "What youth can do", "items": [
        { "icon": "book", "title": "Learn and share", "text": "Teach your family and friends what you learn, like Tilly Smith did." },
        { "icon": "map", "title": "Map risks", "text": "Walk your community and map hazards, safe places and evacuation routes." },
        { "icon": "flag", "title": "Lead drills", "text": "Help organise school and community evacuation drills." },
        { "icon": "radio", "title": "Speak up", "text": "Use social media, art and events to raise awareness, and join local DRR meetings." },
        { "icon": "hand", "title": "Volunteer", "text": "Help older people and neighbours prepare, and support recovery after disasters." },
        { "icon": "flask", "title": "Innovate", "text": "Create apps, games, videos and science projects that solve local problems." }
      ] },
      { "type": "scenario", "title": "Your turn", "text": "Your school is near the coast but has never held a tsunami drill. Your youth club wants to change this.",
        "choices": [
          { "good": false, "text": "Wait until a teacher decides to do it", "result": "It may never happen. Youth can start the conversation." },
          { "good": true, "text": "Meet the principal with a simple proposal: map the risk, suggest a drill date and offer student volunteers", "result": "Yes! A clear, constructive proposal with offers of help is hard to refuse." },
          { "good": false, "text": "Post angry messages online about the school", "result": "Anger rarely builds cooperation. Work with the school, not against it." }
        ] },
      { "type": "fact", "text": "Since 2016, Japan has hosted a World Tsunami Awareness Day High School Students Summit, bringing together students from many countries to share ideas for reducing disaster risk." },
      { "type": "quiz", "questions": [
        { "q": "What does the Sendai Framework call children and youth?", "o": ["Victims only", "Agents of change", "Observers"], "a": 1,
          "e": "The Sendai Framework asks that children and youth be given space to contribute to DRR." }
      ] }
    ]
  },

  "m3l7": {
    "title": "Youth-Led Actions in DRR: Mapanas, Philippines",
    "summary": "A coastal town on the Pacific, and what its young people can do to protect their community.",
    "minutes": 8,
    "blocks": [
      { "type": "stats", "items": [
        { "value": "13", "label": "barangays (villages) in Mapanas" },
        { "value": "~14,900", "label": "people (2024 census)" },
        { "value": "M 7.6", "label": "Samar earthquake of August 2012 that triggered tsunami warnings" }
      ] },
      { "type": "text", "body": [
        "**Mapanas** is a municipality on the Pacific coast of **Northern Samar**, in the Eastern Visayas region of the Philippines. The coast of Samar faces the **Philippine Trench**, a deep subduction zone that can produce large earthquakes and tsunamis. The region is also hit by typhoons almost every year.",
        "In August 2012, a magnitude 7.6 earthquake off Samar triggered a Pacific-wide tsunami warning, and people in coastal areas of the Eastern Visayas were urged to move to higher ground. The waves were small that time, but the event showed how quickly communities must be ready to act.",
        "PHIVOLCS, the Philippine Institute of Volcanology and Seismology, publishes tsunami hazard maps for Mapanas that show which areas could be flooded."
      ] },
      { "type": "text", "title": "Youth leading the way", "body": [
        "Across the Eastern Visayas, students have taken part in school tsunami drills supported by the Government of Japan and UNDP, which encourage students to take the lead in preparedness. In a coastal town like Mapanas, youth-led action can include:",
        "- Reading the PHIVOLCS hazard map with barangay officials and marking evacuation routes",
        "- Leading school and barangay drills, and timing how long evacuation takes",
        "- Making warning signs and evacuation maps in the local language",
        "- Listing, with barangay officials, older people and persons with disabilities who need help",
        "- Sharing typhoon and tsunami updates in community group chats, using only official sources"
      ] },
      { "type": "order", "title": "Plan a youth-led drill", "prompt": "Put the steps in order.", "items": [
        "Form a youth team and meet barangay and school leaders",
        "Study the hazard map and choose safe evacuation sites",
        "Mark the routes and make simple signs",
        "Announce the drill date, including to people who need help",
        "Run the drill and time it",
        "Discuss what went wrong and improve the plan"
      ] },
      { "type": "fact", "title": "Share your story", "text": "Are you part of a youth group in Mapanas or another coastal town? Local actions are the best lessons. Share yours with your teacher or community so others can learn from you." },
      { "type": "quiz", "questions": [
        { "q": "Why is Mapanas at risk from tsunamis?", "o": ["It is on the Pacific coast, facing the Philippine Trench", "It is far inland in the mountains", "It has no coastline"], "a": 0,
          "e": "Large earthquakes along the Philippine Trench could send tsunamis to the Samar coast within minutes." },
        { "q": "Which is a good youth-led action?", "o": ["Sharing unverified rumours about a tsunami", "Helping barangay officials map evacuation routes", "Waiting for others to prepare"], "a": 1,
          "e": "Working with local leaders and using official information makes youth action effective." }
      ] },
      { "type": "links", "items": [
        { "label": "HazardHunterPH (PHIVOLCS / GeoRiskPH hazard maps)", "url": "https://hazardhunter.georisk.gov.ph/" },
        { "label": "UNDP Regional Tsunami Project", "url": "https://www.undp.org/asia-pacific/projects/tsunami" }
      ] }
    ]
  },

  "m3r": {
    "title": "Module 3 Reflection",
    "summary": "Connect the lessons from across the Asia-Pacific to your own community.",
    "minutes": 5,
    "blocks": [
      { "type": "text", "body": [
        "You studied three tsunamis, the chain of early warning, climate change and the power of youth. Answer at least two questions."
      ] },
      { "type": "reflect", "prompts": [
        "Which case study (2004, 2009 or 2018) taught you the most, and why?",
        "Think about the four elements of early warning. Which one is weakest where you live?",
        "How is climate change affecting your community?",
        "What is one youth-led action you could start with your friends?"
      ] }
    ]
  },

  /* ===================== MODULE 4 ===================== */

  "m4l1": {
    "title": "Leave No One Behind: Elderly People",
    "summary": "Older people face the highest risk in many disasters. Here is how communities can protect them.",
    "minutes": 7,
    "blocks": [
      { "type": "stats", "items": [
        { "value": "~65%", "label": "of those who died in 2011 in Iwate, Miyagi and Fukushima were aged 60 or older" },
        { "value": "46%", "label": "were aged 70 or older" }
      ], "source": "Source: analyses of 2011 death records in the three prefectures." },
      { "type": "text", "body": [
        "Older people may move more slowly, have trouble hearing warnings, depend on medicines or equipment, or live alone. Some hesitate to leave home, or think “I survived tsunamis before.” After a disaster, cold, stress and interrupted medical care in shelters also cause many **disaster-related deaths**.",
        "Leaving no one behind — a core promise of the SDGs — means planning **with** older people, not just for them."
      ] },
      { "type": "cards", "title": "How to support older people", "items": [
        { "icon": "users", "title": "Know your neighbours", "text": "Make a list, with local officials, of older people who may need help — and who will help them." },
        { "icon": "hand", "title": "Buddy system", "text": "Pair each person with a neighbour or family member who will check on them and help them evacuate early." },
        { "icon": "heart", "title": "Plan for medicines", "text": "Keep a list of medicines and a few days' supply in the go-bag." },
        { "icon": "radio", "title": "Clear warnings", "text": "Use loud, clear, repeated messages, and visit homes in person if needed." },
        { "icon": "flag", "title": "Practise together", "text": "Include older people in drills, so that routes and timings are realistic." }
      ] },
      { "type": "fact", "text": "Japan now asks local governments to keep a list of people who need help to evacuate, and to make individual evacuation plans for them." },
      { "type": "scenario", "title": "Your turn", "text": "A tsunami warning sounds. Your 80-year-old neighbour lives alone and walks with a cane. The evacuation site is a 10-minute walk away for you.",
        "choices": [
          { "good": false, "text": "Leave without her; someone else will help", "result": "No one may come. Checking on neighbours is part of community safety, as long as you do not put yourself in danger." },
          { "good": true, "text": "Knock on her door, help her start moving right away, and ask others to help — as you agreed in advance", "result": "Yes. Agreeing ahead of time who helps whom, and leaving early, saves precious minutes." },
          { "good": false, "text": "Tell her to wait at home until rescuers come", "result": "Rescuers may not arrive in time. It is much safer to evacuate early." }
        ] },
      { "type": "quiz", "questions": [
        { "q": "Why were older people more likely to die in 2011?", "o": ["They did not care about safety", "They often needed more time or help to evacuate", "Tsunamis only affect older people"], "a": 1,
          "e": "Mobility, hearing, health and living alone can all slow evacuation. Planning ahead closes the gap." }
      ] }
    ]
  },

  "m4l2": {
    "title": "Leave No One Behind: Persons with Disabilities",
    "summary": "“Nothing about us without us”: include persons with disabilities in every step of DRR.",
    "minutes": 7,
    "blocks": [
      { "type": "stats", "items": [
        { "value": "2×", "label": "the death rate of persons with disabilities compared with the whole population in the 2011 disaster" },
        { "value": "1 in 6", "label": "people in the world live with a significant disability (WHO)" }
      ] },
      { "type": "text", "body": [
        "In 2011, the death rate among persons with disabilities in affected areas was about twice that of the general population. Barriers include warnings that people cannot hear or see, evacuation routes with stairs or rubble, shelters without accessible toilets, and a lack of information in sign language, Braille or easy-to-read formats.",
        "The **UN Convention on the Rights of Persons with Disabilities (Article 11)** and the Sendai Framework say persons with disabilities must be protected in disasters — and must take part in planning."
      ] },
      { "type": "sort", "title": "Who does this help most?", "prompt": "Sort each measure by who it helps most.",
        "cats": ["Deaf or hard of hearing", "Blind or low vision", "Wheelchair users", "Intellectual disabilities"],
        "items": [
          { "text": "Flashing lights and vibrating phone alerts", "cat": 0 },
          { "text": "Text messages and sign-language video updates", "cat": 0 },
          { "text": "Clear spoken announcements on the radio", "cat": 1 },
          { "text": "Tactile paving and a guide who knows the route", "cat": 1 },
          { "text": "Step-free evacuation routes and ramps", "cat": 2 },
          { "text": "An evacuation chair to carry someone downstairs", "cat": 2 },
          { "text": "Simple words and pictures showing what to do", "cat": 3 },
          { "text": "Practising the drill many times with a trusted person", "cat": 3 }
        ] },
      { "type": "cards", "title": "Inclusive DRR", "items": [
        { "icon": "users", "title": "Nothing about us without us", "text": "Invite persons with disabilities and their organisations to help write the plans." },
        { "icon": "radio", "title": "Many formats", "text": "Give every warning in several forms: sound, light, text, sign language and pictures." },
        { "icon": "home", "title": "Accessible shelters", "text": "Ramps, accessible toilets, quiet spaces, and room for assistive devices and service animals." },
        { "icon": "hand", "title": "Personal support plans", "text": "Each person agrees in advance who will help them, how, and with what equipment." }
      ] },
      { "type": "quiz", "questions": [
        { "q": "Why is a siren alone not enough?", "o": ["Sirens are too expensive", "Some people cannot hear it, so warnings need several formats", "Sirens only work at night"], "a": 1,
          "e": "Inclusive warnings use sound, light, text, sign language and pictures." },
        { "q": "“Nothing about us without us” means…", "o": ["Persons with disabilities should help plan DRR", "Only experts should make plans", "Persons with disabilities should stay at home"], "a": 0,
          "e": "The people most affected know best what barriers they face and how to remove them." }
      ] }
    ]
  },

  "m4l3": {
    "title": "Community-Based DRR (CBDRR)",
    "summary": "Neighbours are the first responders. CBDRR puts communities at the centre.",
    "minutes": 8,
    "blocks": [
      { "type": "stats", "items": [
        { "value": "~80%", "label": "of people rescued in the 1995 Kobe earthquake were saved by family and neighbours" }
      ], "source": "Source: JICA." },
      { "type": "text", "body": [
        "When disaster strikes, professional rescuers cannot be everywhere at once. The first help usually comes from family and neighbours. **Community-based DRR** means that communities themselves identify their risks, make plans and take action, with support from government and experts.",
        "Japan describes three kinds of help that work together:"
      ] },
      { "type": "cards", "title": "Self-help, mutual help, public help", "items": [
        { "icon": "shield", "title": "Self-help (jijo)", "text": "Protect yourself and your family: prepare supplies, know your routes, evacuate early." },
        { "icon": "users", "title": "Mutual help (kyojo)", "text": "Neighbours help each other: check on older people, rescue, share information, run shelters." },
        { "icon": "home", "title": "Public help (kojo)", "text": "Government and emergency services: warnings, rescue teams, shelters and reconstruction." }
      ] },
      { "type": "order", "title": "CBDRR step by step", "prompt": "Put the steps in order.", "items": [
        "Bring the community together: leaders, youth, women, older people and persons with disabilities",
        "Map hazards, safe places and households that need help",
        "Make a community action plan",
        "Form teams for warning, evacuation, first aid and shelters",
        "Practise with drills, then improve the plan"
      ] },
      { "type": "cards", "title": "Community mapping tools", "items": [
        { "icon": "map", "title": "Hazard map walk", "text": "Walk around the community and mark dangers, safe places and routes on a shared map." },
        { "icon": "clock", "title": "Historical timeline", "text": "Ask elders about past disasters: what happened, and what helped?" },
        { "icon": "calendar", "title": "Seasonal calendar", "text": "Show which months bring typhoons, floods or heat, and plan for them." }
      ] },
      { "type": "quiz", "questions": [
        { "q": "In the 1995 Kobe earthquake, who rescued most people from collapsed buildings?", "o": ["Family and neighbours", "The army", "International teams"], "a": 0,
          "e": "Around 80% of rescues were by family and neighbours. Strong communities save lives." },
        { "q": "Which is an example of “mutual help”?", "o": ["Packing your own go-bag", "Neighbours checking on an older person", "A government warning"], "a": 1,
          "e": "Mutual help is neighbours helping neighbours." }
      ] }
    ]
  },

  "m4l4": {
    "title": "Building Back Better",
    "summary": "Recovery is a chance to build safer, fairer and greener communities.",
    "minutes": 8,
    "blocks": [
      { "type": "text", "body": [
        "**Build Back Better** is part of Priority 4 of the Sendai Framework. It means using recovery and reconstruction to **reduce future risk**, not just to rebuild what was there before.",
        "It includes safer buildings and land use, stronger livelihoods, better social support, and the lessons of the disaster built into new plans."
      ] },
      { "type": "cards", "title": "Examples", "items": [
        { "icon": "shield", "title": "Hiro village, 1855", "text": "Hamaguchi Goryō built a seawall and created jobs for survivors at the same time." },
        { "icon": "home", "title": "Tōhoku, after 2011", "text": "Homes moved to higher ground, land was raised, and seawalls, raised roads and coastal forests were combined as multiple lines of defence." },
        { "icon": "users", "title": "Aceh, after 2004", "text": "More than 100,000 new houses were built, with communities involved in planning, together with evacuation buildings and warning systems." },
        { "icon": "mountain", "title": "Samoa, after 2009", "text": "Some villages chose to rebuild homes further inland and uphill." }
      ] },
      { "type": "scenario", "title": "A rebuilding decision", "text": "A tsunami destroyed a fishing village. The government offers funds to rebuild. Which plan is best?",
        "choices": [
          { "good": false, "text": "Rebuild the same houses in the same place, as fast as possible", "result": "Fast — but the same risk comes back." },
          { "good": true, "text": "Move homes to higher ground, keep boats and workplaces near the sea, plan evacuation routes, and decide together with residents", "result": "Yes! This reduces risk while protecting livelihoods, and the community owns the plan." },
          { "good": false, "text": "Move everyone to a faraway city without asking them", "result": "People may lose their jobs and their community. Recovery works best when residents take part." }
        ] },
      { "type": "sort", "title": "Building back better — or not?", "prompt": "Sort each recovery action.",
        "cats": ["Builds back better", "Rebuilds the old risk"],
        "items": [
          { "text": "Raising the ground before rebuilding homes", "cat": 0 },
          { "text": "Using stronger building codes", "cat": 0 },
          { "text": "Training residents to run evacuation drills", "cat": 0 },
          { "text": "Rebuilding a school in the same flood zone without changes", "cat": 1 },
          { "text": "Cutting down the coastal forest to use the wood", "cat": 1 },
          { "text": "Ignoring the needs of persons with disabilities in new housing", "cat": 1 }
        ] },
      { "type": "quiz", "questions": [
        { "q": "“Build Back Better” means…", "o": ["Rebuilding faster than before", "Using recovery to reduce future risk", "Only building bigger seawalls"], "a": 1,
          "e": "The goal is a safer, more resilient community than before the disaster." }
      ] }
    ]
  },

  "m4l5": {
    "title": "Emergency Box",
    "summary": "Supplies at home to live on your own for at least 3 days — ideally a week.",
    "minutes": 6,
    "blocks": [
      { "type": "text", "body": [
        "After a big disaster, shops may close and water, power and gas may stop for days. Help may take time to arrive. An **emergency box** (a home stockpile) lets your household **shelter at home** safely.",
        "Your **go-bag** is different: it is small and light, for when you must **evacuate** quickly. You need both."
      ] },
      { "type": "compare", "title": "Go-bag or emergency box?", "cols": [
        { "icon": "backpack", "color": "#c8643b", "title": "Go-bag", "items": ["For evacuating quickly", "Light enough to carry while walking fast", "Basics for the first few days", "One per person, near the door"] },
        { "icon": "box", "color": "#1f6f8b", "title": "Emergency box", "items": ["For staying at home after a disaster", "Bigger and heavier", "At least 3 days, ideally 7 days", "Stored at home for the whole household"] }
      ] },
      { "type": "cards", "title": "What to store", "items": [
        { "icon": "wave", "title": "Water", "text": "About 3 litres per person per day for drinking and cooking, plus extra for hygiene. Store at least 3 days' worth." },
        { "icon": "box", "title": "Food", "text": "Canned and dried food, rice and crackers: foods you normally eat that need little water or cooking." },
        { "icon": "sun", "title": "Light and power", "text": "Torches, spare batteries, a portable radio and a power bank. Choose LED lights instead of candles." },
        { "icon": "heart", "title": "Hygiene", "text": "Portable toilet bags, wet wipes, soap, sanitary products and masks." },
        { "icon": "fire", "title": "Cooking", "text": "A portable gas stove with spare cartridges. Use it only with good ventilation." },
        { "icon": "hand", "title": "Special needs", "text": "Medicines, baby formula and nappies, pet food and spare glasses." }
      ] },
      { "type": "fact", "title": "Rolling stock", "text": "Many Japanese families use “rolling stock”: keep a little more food than usual, eat the oldest first and replace it. Your supplies stay fresh and nothing is wasted." },
      { "type": "sort", "title": "Go-bag, emergency box or both?", "prompt": "Where does each item belong?",
        "cats": ["Go-bag", "Emergency box", "Both"],
        "items": [
          { "text": "A whistle", "cat": 0 },
          { "text": "Copies of ID documents in a waterproof bag", "cat": 0 },
          { "text": "A week of canned food for the family", "cat": 1 },
          { "text": "A portable gas stove", "cat": 1 },
          { "text": "20 litres of water", "cat": 1 },
          { "text": "A torch", "cat": 2 },
          { "text": "Personal medicines", "cat": 2 }
        ] },
      { "type": "quiz", "questions": [
        { "q": "About how much water should you store per person per day?", "o": ["About 0.5 litres", "About 3 litres", "About 20 litres"], "a": 1,
          "e": "About 3 litres per person per day covers drinking and basic cooking." }
      ] }
    ]
  },

  "m4l6": {
    "title": "Prepare Your Own Go-Bag",
    "summary": "Pack a light bag you can grab in seconds.",
    "minutes": 7,
    "blocks": [
      { "type": "text", "body": [
        "A **go-bag** (emergency grab bag) holds what you need for the first hours and days after evacuating. Keep it light enough to carry while walking fast or climbing a hill.",
        "- Keep it near the door or by your bed",
        "- One bag per person; children can carry a small one",
        "- Check it every six months: food, water, batteries, medicines, and clothes that still fit",
        "- Add a card with your family plan: meeting point and contact numbers"
      ] },
      { "type": "gobag", "eyebrow": "Emergency preparedness · Go-bag", "scenario": "A typhoon warning has been issued.",
        "intro": "You have a few minutes to grab what you need. Pack a go-bag that keeps one adult self-sufficient for the next 2 days. Choose carefully: water is heavy and slots are limited.",
        "items": [
          { "name": "Drinking water", "why": "Water is the top priority: about 3 litres per person per day. It is heavy and takes 2 slots, but you cannot go without it." },
          { "name": "Ready-to-eat food", "why": "Energy bars and ready-to-eat food keep you going without cooking." },
          { "name": "Medicines", "why": "Personal medicines can be hard to get after a disaster. Bring a few days' supply and a list." },
          { "name": "ID and papers", "why": "Copies of ID, insurance and contact numbers in a waterproof bag help you get aid and prove who you are." },
          { "name": "Torch", "why": "Power often fails in a typhoon. A torch lets you move safely at night." },
          { "name": "First aid kit", "why": "Treat cuts and small injuries while help is far away." },
          { "name": "Battery radio", "why": "A battery or hand-crank radio brings official warnings and news when phone networks fail." },
          { "name": "Raincoat", "why": "In a typhoon you need your hands free and your body dry. A raincoat does both." },
          { "name": "Power bank", "why": "Keeps your phone working for calls, messages and alerts." },
          { "name": "Cash", "why": "ATMs and card machines may not work without power." },
          { "name": "Mask", "why": "Protects against dust from damaged buildings and helps prevent illness in crowded shelters." },
          { "name": "Multi-tool", "why": "Useful for opening cans, cutting rope and small repairs." },
          { "name": "Sandals", "why": "Handy inside shelters, but evacuate in sturdy shoes: sandals do not protect your feet from debris." },
          { "name": "Plastic wrap", "why": "Very versatile: cover plates to save washing water, keep things dry, or hold a dressing in place." },
          { "name": "Heavy-duty plastic bag", "why": "Keeps clothes and papers dry, and works as a rain cover or rubbish bag." },
          { "name": "Emergency blanket", "why": "An aluminium emergency blanket is tiny and light, but keeps your body heat in." },
          { "name": "Foldable water bag", "why": "Folds flat and lets you collect water from distribution points." },
          { "name": "Sanitary pads", "why": "Hygiene products are often in short supply in shelters." },
          { "name": "Sewing kit and mirror", "why": "Light, but other items matter more in the first 2 days." },
          { "name": "Portable toilet bags", "why": "Toilets may not work after a disaster. Useful, but it takes 2 slots." },
          { "name": "Tissues", "why": "Light and useful for hygiene." },
          { "name": "Hardcover book", "why": "Heavy and takes 2 slots. A small comfort item is lighter." },
          { "name": "Umbrella", "why": "Useless in strong typhoon winds, and it keeps a hand busy. Choose a raincoat." },
          { "name": "Laptop", "why": "Heavy, fragile and takes 3 slots. Back up important files online instead." },
          { "name": "Perfume", "why": "Not needed for survival. Save the weight for essentials." },
          { "name": "Phone charger (no power bank)", "why": "Without electricity a wall charger is useless. A power bank is the right choice." }
        ] },
      { "type": "kit" },
      { "type": "scenario", "title": "The warning sounds", "text": "A tsunami warning sounds on your phone at night. What do you do?",
        "choices": [
          { "good": false, "text": "Search the house for things to pack", "result": "Precious minutes are lost. That is why the bag must be ready in advance." },
          { "good": true, "text": "Grab your go-bag and evacuate immediately", "result": "Yes! A ready go-bag means you can leave in seconds." },
          { "good": false, "text": "Take the TV and the computer", "result": "Heavy valuables slow you down. Your life matters more than things." }
        ] },
      { "type": "fact", "text": "Add something that comforts you: a family photo, a small toy for a child, or a book. Comfort helps people cope in shelters." },
      { "type": "quiz", "questions": [
        { "q": "Where should you keep your go-bag?", "o": ["In the attic under boxes", "Near the door, easy to grab", "At a friend's house far away"], "a": 1,
          "e": "You need to grab it in seconds on the way out." },
        { "q": "How often should you check your go-bag?", "o": ["Every 6 months", "Every 10 years", "Never"], "a": 0,
          "e": "Food, water, batteries and medicines expire, and children grow out of clothes." }
      ] },
      { "type": "planlink" }
    ]
  },

  "m4r": {
    "title": "Module 4 Reflection",
    "summary": "Turn what you learned into commitments for your family and community.",
    "minutes": 5,
    "blocks": [
      { "type": "text", "body": [
        "You learned how to leave no one behind, how communities reduce risk together, how to build back better, and how to prepare supplies. Answer at least two questions, then build your own DRR plan."
      ] },
      { "type": "reflect", "prompts": [
        "Who in your family or neighbourhood would need help to evacuate? How will you help them?",
        "What would your community need to do to become better prepared?",
        "What is in your go-bag and emergency box now? What is missing?",
        "Write one promise to yourself or your family about disaster preparedness."
      ] },
      { "type": "planlink" }
    ]
  }
};

/* Final exam question pool: 20 questions are drawn at random for each attempt. */
LH.i18n.en.exam = {
  "questions": [
    { "q": "When and where was the Sendai Framework adopted?", "o": ["2005 in Hyogo, Japan", "2015 in Sendai, Japan", "2011 in Tokyo, Japan"], "a": 1, "e": "18 March 2015, at the Third UN World Conference on DRR in Sendai." },
    { "q": "How many priorities for action does the Sendai Framework have?", "o": ["2", "4", "7"], "a": 1, "e": "Four priorities; it also has seven global targets." },
    { "q": "Which SDG target calls for reducing deaths and losses from disasters?", "o": ["Target 11.5", "Target 2.1", "Target 16.1"], "a": 0, "e": "SDG 11.5 is about reducing disaster deaths, people affected and economic losses." },
    { "q": "When did the Great East Japan Earthquake occur?", "o": ["11 March 2011", "26 December 2004", "5 November 1854"], "a": 0, "e": "At 14:46 on 11 March 2011." },
    { "q": "What made 2011 a “compound disaster”?", "o": ["It happened during a typhoon", "An earthquake, a tsunami and a nuclear accident happened one after another", "It affected only one city"], "a": 1, "e": "One hazard triggered the next, with huge knock-on effects." },
    { "q": "Why did Hamaguchi Goryō set fire to the rice sheaves?", "o": ["To stop the tsunami", "To guide villagers to high ground in the dark", "To keep people warm"], "a": 1, "e": "The fire lit the way to the hilltop shrine." },
    { "q": "Which date is World Tsunami Awareness Day?", "o": ["11 March", "26 December", "5 November"], "a": 2, "e": "5 November, the date of the Inamura no Hi story." },
    { "q": "Why do experts say “disasters are not natural”?", "o": ["Hazards never happen in nature", "Disasters happen when hazards meet exposed, vulnerable people who cannot cope", "People cause every earthquake"], "a": 1, "e": "Exposure, vulnerability and capacity decide whether a hazard becomes a disaster." },
    { "q": "Which of these REDUCES disaster risk?", "o": ["More exposure", "More vulnerability", "More capacity"], "a": 2, "e": "Risk = Hazard × Exposure × Vulnerability ÷ Capacity." },
    { "q": "Rebuilding a school with stronger materials after a flood belongs to which phase of the DRR cycle?", "o": ["Recovery", "Response", "Preparedness"], "a": 0, "e": "Recovery is the time to build back better." },
    { "q": "What is the FIRST step of DRR planning?", "o": ["Buy supplies", "Identify the hazards", "Hold a drill"], "a": 1, "e": "You must know what could happen before deciding what to do." },
    { "q": "Which is one of Professor Katada's three principles?", "o": ["Always wait for adults to decide", "Be the first to evacuate", "Trust the hazard map completely"], "a": 1, "e": "The others: don't trust assumptions, and do your very best." },
    { "q": "About what percentage of Kamaishi's schoolchildren survived in 2011?", "o": ["50%", "80%", "99.8%"], "a": 2, "e": "Almost all of about 3,000 students survived, thanks to years of education." },
    { "q": "What kind of evacuation saved the 320 people at Arahama Elementary School?", "o": ["Vertical evacuation to the upper floors and roof", "Driving along the coast", "Staying on the ground floor"], "a": 0, "e": "With no hill nearby, they went up the tall, strong school building." },
    { "q": "Why is Okawa Elementary School a lesson about hazard maps?", "o": ["It was inside the red zone", "It was outside the predicted flood zone, but the tsunami still reached it", "The map predicted the exact wave height"], "a": 1, "e": "Hazard maps are based on assumptions; real tsunamis can be bigger." },
    { "q": "Rivers connected to the sea…", "o": ["are safe during a tsunami", "can carry a tsunami far inland", "stop tsunamis"], "a": 1, "e": "At Okawa, the tsunami travelled up the Kitakami River." },
    { "q": "What did the Indian Ocean lack in 2004?", "o": ["Scientists", "A regional tsunami warning system", "Seismometers anywhere in the world"], "a": 1, "e": "The Indian Ocean warning system was built after 2004." },
    { "q": "How did Tilly Smith save people in 2004?", "o": ["She used a radio", "She recognised the signs from a school lesson and warned others", "She was a lifeguard"], "a": 1, "e": "Education saved about 100 people on her beach in Thailand." },
    { "q": "In a near-field tsunami, like Samoa in 2009, what is your warning?", "o": ["A message from friends", "The earthquake itself", "A TV report"], "a": 1, "e": "The waves can arrive within minutes. The shaking is your signal to go." },
    { "q": "What caused the 2018 Sunda Strait tsunami?", "o": ["A large earthquake", "The collapse of part of the Anak Krakatau volcano", "A storm surge"], "a": 1, "e": "With no earthquake, the warning system did not detect it." },
    { "q": "How many elements does a people-centred early warning system have?", "o": ["Two", "Four", "Ten"], "a": 1, "e": "Risk knowledge, detection, communication and preparedness." },
    { "q": "Which is an example of the “warning communication” element?", "o": ["A seismometer", "Loudspeakers and phone alerts in local languages", "A hazard map"], "a": 1, "e": "Communication means reaching everyone in a form they understand." },
    { "q": "Does climate change cause tsunamis?", "o": ["Yes, warmer oceans create tsunamis", "No, but higher seas can let tsunamis and storm surges reach further inland", "Yes, storms cause all tsunamis"], "a": 1, "e": "Tsunamis have geological causes." },
    { "q": "What does the Sendai Framework call children and youth?", "o": ["Victims only", "Agents of change", "Observers"], "a": 1, "e": "Youth should be given space to contribute to DRR." },
    { "q": "Why were older people more likely to die in 2011?", "o": ["They did not care about safety", "They often needed more time or help to evacuate", "Tsunamis only affect older people"], "a": 1, "e": "Planning with older people and helping them leave early saves lives." },
    { "q": "Why is a siren alone not enough?", "o": ["Sirens are too expensive", "Some people cannot hear it, so warnings need several formats", "Sirens only work at night"], "a": 1, "e": "Inclusive warnings use sound, light, text, sign language and pictures." },
    { "q": "In the 1995 Kobe earthquake, who rescued most people from collapsed buildings?", "o": ["Family and neighbours", "The army", "International teams"], "a": 0, "e": "About 80% of rescues were by family and neighbours." },
    { "q": "“Build Back Better” means…", "o": ["Rebuilding faster than before", "Using recovery to reduce future risk", "Only building bigger seawalls"], "a": 1, "e": "Recovery should leave communities safer than before." },
    { "q": "About how much water should you store per person per day?", "o": ["About 0.5 litres", "About 3 litres", "About 20 litres"], "a": 1, "e": "About 3 litres per person per day, for at least 3 days." },
    { "q": "Where should you keep your go-bag?", "o": ["In the attic under boxes", "Near the door, easy to grab", "At a friend's house far away"], "a": 1, "e": "You need to grab it in seconds." },
    { "q": "Roughly how fast can a tsunami travel in water 4,000 m deep?", "o": ["About 60 km/h", "About 700 km/h", "About 5,000 km/h"], "a": 1, "e": "√(9.81 × 4000) ≈ 198 m/s ≈ 713 km/h." },
    { "q": "How long should you stay on high ground after a tsunami?", "o": ["Until officials announce the all-clear — often many hours", "Ten minutes after the first wave", "Until the first wave arrives"], "a": 0, "e": "Waves can keep coming for hours, and later ones may be bigger." }
  ]
};
