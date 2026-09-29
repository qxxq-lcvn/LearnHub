/* LearnHub — Cancer topic content, English (source of truth for structure, answers and icons).
 * Educational content only; not medical advice. Other languages mirror this shape (text only). */
window.LH = window.LH || {}; LH.i18n = LH.i18n || {}; LH.i18n.en = LH.i18n.en || {};
LH.i18n.en.lessons = LH.i18n.en.lessons || {};
Object.assign(LH.i18n.en.lessons, {

  /* ===================== MODULE C1: Understanding cancer ===================== */

  "c1l1": {
    "title": "What is cancer?",
    "summary": "Cancer starts when our own cells stop following the rules.",
    "minutes": 8,
    "blocks": [
      { "type": "stats", "items": [
        { "value": "~20 million", "label": "new cancer cases worldwide in 2022" },
        { "value": "9.7 million", "label": "deaths from cancer in 2022" },
        { "value": "1 in 5", "label": "people develop cancer during their lifetime" },
        { "value": "30–50%", "label": "of cancers could be prevented" }
      ], "source": "Sources: IARC GLOBOCAN 2022; World Health Organization." },
      { "type": "text", "body": [
        "Your body is made of about 30 trillion cells. Each cell follows instructions written in its **DNA**: when to grow, when to divide, when to stop, and when to die.",
        "**Cancer** begins when changes in a cell's DNA, called **mutations**, break these rules. The cell divides when it should not, ignores signals to stop, and does not die when it should. Its daughter cells inherit the same faults and collect more over time.",
        "A lump of abnormal cells is called a **tumour**. A **benign** tumour stays in one place and does not invade. A **malignant** tumour — a cancer — can invade nearby tissue and spread to other parts of the body."
      ] },
      { "type": "cards", "title": "What damages DNA?", "items": [
        { "icon": "fire", "title": "Tobacco", "text": "Tobacco smoke contains dozens of chemicals that damage DNA. Tobacco causes about a quarter of all cancer deaths." },
        { "icon": "sun", "title": "UV radiation", "text": "Strong sunlight and sunbeds cause skin cancers, including melanoma." },
        { "icon": "shield", "title": "Some infections", "text": "HPV can cause cervical cancer, hepatitis B and C can cause liver cancer, and H. pylori bacteria can cause stomach cancer." },
        { "icon": "drop", "title": "Alcohol and lifestyle", "text": "Alcohol, processed meat, obesity and too little exercise raise the risk of several cancers." },
        { "icon": "clock", "title": "Age and chance", "text": "Mutations build up with age, and some happen by chance each time a cell copies its DNA." },
        { "icon": "dna", "title": "Inherited genes", "text": "About 5–10% of cancers are linked to inherited mutations, such as in the BRCA1 and BRCA2 genes." }
      ] },
      { "type": "cards", "title": "The hallmarks of cancer", "items": [
        { "icon": "arrowRight", "title": "Keeps growing", "text": "Makes its own “grow” signals instead of waiting for the body's signals." },
        { "icon": "alert", "title": "Ignores stop signs", "text": "Switches off the genes that normally put the brakes on cell division." },
        { "icon": "shield", "title": "Refuses to die", "text": "Avoids apoptosis, the self-destruct programme that removes damaged cells." },
        { "icon": "cycle", "title": "Divides forever", "text": "Becomes “immortal” by protecting the ends of its chromosomes (telomeres)." },
        { "icon": "heart", "title": "Builds blood vessels", "text": "Makes new blood vessels grow toward it to get food and oxygen (angiogenesis)." },
        { "icon": "map", "title": "Invades and spreads", "text": "Breaks into nearby tissue and travels to distant organs." }
      ] },
      { "type": "fact", "text": "Scientists Douglas Hanahan and Robert Weinberg described these “hallmarks of cancer” in 2000, and updated the list in 2011 and 2022." },
      { "type": "quiz", "questions": [
        { "q": "What is cancer?", "o": ["An infection that spreads from person to person", "A disease in which the body's own cells grow and divide out of control", "A kind of injury"], "a": 1,
          "e": "Cancer starts from our own cells whose DNA has changed so they no longer follow the rules." },
        { "q": "What makes a tumour malignant?", "o": ["It is large", "It can invade nearby tissue and spread", "It is painful"], "a": 1,
          "e": "Benign tumours stay in place. Malignant tumours can invade and spread." },
        { "q": "Which of these is a major cause of DNA damage?", "o": ["Drinking water", "Tobacco smoke", "Sleeping"], "a": 1,
          "e": "Tobacco smoke is the single biggest avoidable cause of cancer." }
      ] },
      { "type": "links", "items": [
        { "label": "World Health Organization: Cancer fact sheet", "url": "https://www.who.int/news-room/fact-sheets/detail/cancer" },
        { "label": "US National Cancer Institute: What is cancer?", "url": "https://www.cancer.gov/about-cancer/understanding/what-is-cancer" }
      ] }
    ]
  },

  "c1l2": {
    "title": "Types of cancer",
    "summary": "There are more than 100 kinds of cancer. Each is named after where it starts.",
    "minutes": 7,
    "blocks": [
      { "type": "text", "body": [
        "Cancer is not one disease but more than 100. Doctors name each cancer after the organ and the type of cell where it started. Breast cancer that spreads to the bones is still breast cancer — doctors call it **metastatic breast cancer**."
      ] },
      { "type": "cards", "title": "The main types", "items": [
        { "icon": "layers", "title": "Carcinoma", "text": "The most common type. Starts in the cells that line organs and skin: lung, breast, colon, prostate, and most skin cancers." },
        { "icon": "hand", "title": "Sarcoma", "text": "Starts in bone, muscle, fat, cartilage or other connective tissue." },
        { "icon": "drop", "title": "Leukaemia", "text": "Cancer of blood-forming cells in the bone marrow. It usually does not form a solid tumour." },
        { "icon": "shield", "title": "Lymphoma", "text": "Starts in lymphocytes, immune cells found in the lymph nodes and lymph system." },
        { "icon": "cell", "title": "Myeloma", "text": "Cancer of plasma cells, the immune cells that make antibodies." },
        { "icon": "target", "title": "Brain and spinal cord tumours", "text": "Start in the cells of the central nervous system." },
        { "icon": "sun", "title": "Melanoma", "text": "Starts in melanocytes, the cells that give skin its colour." }
      ] },
      { "type": "stats", "title": "Most common cancers worldwide (2022)", "items": [
        { "value": "Lung", "label": "2.5 million new cases, and the leading cause of cancer death" },
        { "value": "Breast", "label": "2.3 million new cases" },
        { "value": "Colorectal", "label": "1.9 million new cases" },
        { "value": "Prostate", "label": "1.5 million new cases" }
      ], "source": "Source: IARC GLOBOCAN 2022." },
      { "type": "sort", "title": "Name that type", "prompt": "Sort each description into the right type of cancer.",
        "cats": ["Carcinoma", "Sarcoma", "Leukaemia", "Lymphoma"],
        "items": [
          { "text": "Breast cancer that starts in the lining of the milk ducts", "cat": 0 },
          { "text": "Lung cancer that starts in the lining of the airways", "cat": 0 },
          { "text": "Cancer of the thigh bone", "cat": 1 },
          { "text": "Cancer in muscle tissue", "cat": 1 },
          { "text": "Cancer of the blood-forming cells in the bone marrow", "cat": 2 },
          { "text": "Too many abnormal white blood cells in the blood", "cat": 2 },
          { "text": "Cancer of lymphocytes in the lymph nodes", "cat": 3 },
          { "text": "Hodgkin disease", "cat": 3 }
        ] },
      { "type": "fact", "text": "Children get different cancers from adults; the most common is leukaemia. In high-income countries more than 80% of children with cancer are cured, but in many low- and middle-income countries fewer than 30% are." },
      { "type": "quiz", "questions": [
        { "q": "Which is the most common type of cancer?", "o": ["Sarcoma", "Carcinoma", "Myeloma"], "a": 1,
          "e": "Carcinomas start in the lining of organs and skin, and make up most cancers." },
        { "q": "Breast cancer has spread to the lungs. What is it called?", "o": ["Lung cancer", "Metastatic breast cancer", "A new cancer"], "a": 1,
          "e": "A cancer is always named after where it started, even when it spreads." }
      ] }
    ]
  },

  "c1l3": {
    "title": "Stages of cancer",
    "summary": "The stage describes how big a cancer is and how far it has spread. It guides treatment.",
    "minutes": 8,
    "blocks": [
      { "type": "text", "body": [
        "When cancer is diagnosed, doctors work out its **stage**: how large it is and whether it has spread. The stage helps choose the best treatment and predict the outcome. Many cancers use the **TNM system**:",
        "- **T (Tumour):** the size of the main tumour and how deeply it has grown (T1–T4)",
        "- **N (Nodes):** whether cancer has reached nearby lymph nodes (N0–N3)",
        "- **M (Metastasis):** whether it has spread to distant organs (M0 or M1)",
        "The T, N and M results are combined into an overall stage from 0 to IV."
      ] },
      { "type": "cards", "title": "Stages 0 to IV", "items": [
        { "icon": "cell", "title": "Stage 0", "text": "Abnormal cells that have not invaded nearby tissue (“in situ”). Often curable." },
        { "icon": "target", "title": "Stage I", "text": "A small cancer that is still inside the organ where it started." },
        { "icon": "layers", "title": "Stage II", "text": "A larger cancer, or one that has grown more deeply. It may have reached a few nearby lymph nodes." },
        { "icon": "shuffle", "title": "Stage III", "text": "Usually larger and has spread into nearby tissues and lymph nodes." },
        { "icon": "map", "title": "Stage IV", "text": "The cancer has spread to distant organs. Also called metastatic cancer." }
      ] },
      { "type": "stats", "title": "Why finding cancer early matters", "items": [
        { "value": "99%", "label": "5-year survival for breast cancer found while still localised" },
        { "value": "~30%", "label": "5-year survival for breast cancer that has spread to distant organs" },
        { "value": "~90%", "label": "5-year survival for colorectal cancer found while still localised" },
        { "value": "<15%", "label": "5-year survival for colorectal cancer that has spread to distant organs" }
      ], "source": "Source: US SEER / American Cancer Society (relative survival). Figures differ between countries and depend on access to treatment." },
      { "type": "fact", "text": "Grade is different from stage. The grade describes how abnormal the cells look under a microscope: low-grade cells look more like normal cells and usually grow more slowly." },
      { "type": "sort", "title": "Match the stage", "prompt": "Sort each description into its stage group.",
        "cats": ["Stage 0–I", "Stage II–III", "Stage IV"],
        "items": [
          { "text": "Abnormal cells only in the lining, not invading", "cat": 0 },
          { "text": "A small tumour still inside the organ", "cat": 0 },
          { "text": "A larger tumour that has reached nearby lymph nodes", "cat": 1 },
          { "text": "Breast cancer with several affected lymph nodes in the armpit", "cat": 1 },
          { "text": "Colon cancer that has spread to the liver", "cat": 2 },
          { "text": "Lung cancer found in the bones and brain", "cat": 2 }
        ] },
      { "type": "quiz", "questions": [
        { "q": "In TNM staging, what does M stand for?", "o": ["Metastasis: spread to distant organs", "The mass of the tumour", "Medicine"], "a": 0,
          "e": "M0 means no distant spread; M1 means the cancer has spread to distant organs." },
        { "q": "Why does finding cancer early matter?", "o": ["Early cancers are always painful", "Cancers found early are usually easier to treat and cure", "Early cancers do not need treatment"], "a": 1,
          "e": "Survival is much higher when cancer is found before it spreads." }
      ] }
    ]
  },

  "c1l4": {
    "title": "How cancer spreads",
    "summary": "Metastasis — when cancer travels — causes most cancer deaths.",
    "minutes": 8,
    "blocks": [
      { "type": "text", "body": [
        "**Metastasis** is when cancer cells leave the original (**primary**) tumour and grow in another part of the body. Most cancer deaths are caused by metastasis, not by the first tumour.",
        "Cancer can spread in three main ways:",
        "- **Invasion:** growing directly into nearby tissues",
        "- **Through the lymph system:** to the lymph nodes, often the first place doctors check",
        "- **Through the blood:** to distant organs such as the lungs, liver, bones and brain"
      ] },
      { "type": "order", "title": "The journey of a metastasis", "prompt": "Put the steps of metastasis in order.", "items": [
        "A cell in the tumour gains new mutations",
        "It breaks away and invades the nearby tissue",
        "It squeezes into a blood or lymph vessel",
        "It survives the journey through the bloodstream",
        "It leaves the vessel in a distant organ",
        "It adapts to its new home and grows into a new tumour"
      ] },
      { "type": "fact", "text": "The journey is very hard: almost all cancer cells that enter the blood die. But a tumour can release huge numbers of cells, so a few may survive and start new tumours." },
      { "type": "cards", "title": "Where cancer often spreads", "items": [
        { "icon": "wave", "title": "Lungs", "text": "Blood from most of the body passes through the lungs, where travelling cells can get stuck." },
        { "icon": "drop", "title": "Liver", "text": "Blood from the gut flows straight to the liver, so bowel cancer often spreads there." },
        { "icon": "layers", "title": "Bones", "text": "Breast and prostate cancers often spread to the bones." },
        { "icon": "target", "title": "Brain", "text": "Lung cancer, breast cancer and melanoma can spread to the brain." },
        { "icon": "sprout", "title": "Seed and soil", "text": "In 1889 surgeon Stephen Paget suggested that cancer cells are like seeds that only grow in the right “soil”. This helps explain why each cancer spreads to particular organs." }
      ] },
      { "type": "lab", "title": "See it in the lab", "text": "In the Cancer Treatment Lab, watch what happens when a tumour grows too big and spreads to other organs." },
      { "type": "quiz", "questions": [
        { "q": "What causes most cancer deaths?", "o": ["The first tumour only", "Metastasis: spread to other organs", "Chemotherapy"], "a": 1,
          "e": "Cancer that has spread is much harder to remove or control." },
        { "q": "Why does bowel cancer often spread to the liver?", "o": ["Blood from the gut flows straight to the liver", "The liver is next to the brain", "Because of the food we eat"], "a": 0,
          "e": "Cells that escape from a bowel tumour are carried by the blood to the liver first." }
      ] }
    ]
  },

  "c1r": {
    "title": "Module 1 Reflection",
    "summary": "Think about what you learned about the biology of cancer.",
    "minutes": 5,
    "blocks": [
      { "type": "text", "body": [ "You learned what cancer is, its main types, how it is staged and how it spreads. Answer at least two questions." ] },
      { "type": "reflect", "prompts": [
        "What surprised you most about how cancer starts?",
        "Which cancer risk factors can people change in their daily lives?",
        "Why do you think early detection makes such a big difference?",
        "How would you explain metastasis to a friend in one sentence?"
      ] }
    ]
  },

  /* ===================== MODULE C2: Why cancer is hard to cure ===================== */

  "c2l1": {
    "title": "Our own cells gone rogue",
    "summary": "Why is it so hard to kill cancer without harming the patient?",
    "minutes": 8,
    "blocks": [
      { "type": "text", "body": [
        "Bacteria and viruses are foreign invaders, very different from our cells, so medicines can target them. Cancer cells are **our own cells**. They use the same machinery as healthy cells, so almost anything that kills them can also harm healthy tissue.",
        "This is the central challenge: a good cancer treatment must find the **differences** between cancer cells and normal cells, and use them."
      ] },
      { "type": "compare", "title": "Infection or cancer?", "cols": [
        { "icon": "shield", "color": "#5f8a3e", "title": "Bacterial infection", "items": ["Foreign cells, very different from ours", "Antibiotics hit targets that only bacteria have", "The immune system recognises them easily"] },
        { "icon": "cell", "color": "#b04a6a", "title": "Cancer", "items": ["Our own cells with some mutations", "Most drugs also affect healthy cells", "Can disguise itself from the immune system"] }
      ] },
      { "type": "cards", "title": "Why cancer is hard to cure", "items": [
        { "icon": "users", "title": "It looks like “self”", "text": "Cancer cells are so similar to healthy cells that it is hard to hit one without the other." },
        { "icon": "shuffle", "title": "It keeps changing", "text": "Each tumour is a mix of different cells that keep mutating." },
        { "icon": "shield", "title": "Resistance", "text": "Treatment kills sensitive cells and leaves resistant ones to regrow." },
        { "icon": "eye", "title": "It hides", "text": "Cancer cells switch off the signals that alert the immune system." },
        { "icon": "lock", "title": "It is hard to reach", "text": "Some tumours sit behind barriers, like the blood–brain barrier, or have a poor blood supply that drugs cannot get through." },
        { "icon": "clock", "title": "It is found late", "text": "Many cancers cause no symptoms until they have spread." }
      ] },
      { "type": "fact", "text": "A 1 cm tumour — about the smallest that many scans can see — already contains around 1 billion cells." },
      { "type": "quiz", "questions": [
        { "q": "Why is it hard to kill cancer cells without harming the patient?", "o": ["Cancer cells are made of metal", "Cancer cells are the patient's own cells and share most of their machinery", "Cancer cells are too small to see"], "a": 1,
          "e": "Because cancer cells are so similar to healthy cells, many treatments damage both." },
        { "q": "What must a good cancer treatment use?", "o": ["Differences between cancer cells and normal cells", "The patient's blood type", "The weather"], "a": 0,
          "e": "The more a treatment relies on a true difference, the fewer side effects it causes." }
      ] }
    ]
  },

  "c2l2": {
    "title": "Evolution and resistance",
    "summary": "A tumour is a population of different cells — and treatment can make it evolve.",
    "minutes": 9,
    "blocks": [
      { "type": "text", "body": [
        "A tumour is not a pile of identical cells. As it grows, its cells keep gaining new mutations, so one tumour contains many slightly different groups of cells. This is called **heterogeneity**.",
        "When a drug is given, it kills the cells it can — but if even a few cells happen to resist, they survive and regrow. The tumour comes back, now made mostly of resistant cells. This is **natural selection**, the same process that makes bacteria resistant to antibiotics.",
        "Doctors fight this by **combining** treatments that attack in different ways, by changing treatment over time, and by watching the tumour closely."
      ] },
      { "type": "order", "title": "How resistance happens", "prompt": "Put the steps in order.", "items": [
        "The tumour contains a few rare resistant cells",
        "A drug kills most of the sensitive cells",
        "The tumour shrinks and the patient feels better",
        "The resistant cells keep dividing",
        "The tumour grows back, and this time the drug does not work"
      ] },
      { "type": "lab", "title": "Try it: evolve resistance", "text": "In the Cancer Treatment Lab, give only chemotherapy and watch which colour of cells takes over. Then try combining treatments." },
      { "type": "fact", "text": "The same idea explains why doctors often combine several drugs to treat HIV, tuberculosis and many cancers: it is much harder for one cell to resist several drugs at once." },
      { "type": "scenario", "title": "Think like a doctor", "text": "A patient's tumour shrank a lot with a drug, but eight months later it grew back and the drug no longer works. What is the most likely explanation?",
        "choices": [
          { "good": false, "text": "The drug had expired", "result": "Unlikely. The tumour changed, not the drug." },
          { "good": true, "text": "A few cells that resisted the drug survived and grew into a new tumour", "result": "Yes. This is acquired resistance through natural selection. Doctors will test the new tumour and change the treatment." },
          { "good": false, "text": "The patient did something wrong", "result": "No. Resistance comes from the cancer's biology. It is not the patient's fault." }
        ] },
      { "type": "quiz", "questions": [
        { "q": "What is tumour heterogeneity?", "o": ["A tumour made of many slightly different groups of cells", "A very hard tumour", "A tumour in two organs"], "a": 0,
          "e": "Different cells in the same tumour can respond differently to treatment." },
        { "q": "Why do doctors often combine treatments?", "o": ["To make treatment last longer", "So that it is harder for any cell to resist all of them", "Because single drugs are not allowed"], "a": 1,
          "e": "A cell may resist one treatment, but rarely several that work in different ways." }
      ] }
    ]
  },

  "c2l3": {
    "title": "Hiding and late detection",
    "summary": "Cancer hides from the immune system and often gives no warning.",
    "minutes": 8,
    "blocks": [
      { "type": "text", "body": [
        "Your immune system destroys abnormal cells all the time. The cancers that grow are the ones that have learned to **escape** it. They can:",
        "- Hide the markers (**antigens**) that immune cells look for",
        "- Press the immune system's brakes, called **checkpoints** (such as PD-L1), to switch T cells off",
        "- Build a protective neighbourhood, the **tumour microenvironment**, that keeps out immune cells and drugs",
        "Some cancer cells can also “sleep” (**dormancy**) for years and wake up later. This is why cancer can return long after treatment."
      ] },
      { "type": "cards", "title": "Other barriers", "items": [
        { "icon": "shield", "title": "The blood–brain barrier", "text": "It protects the brain from toxins, but also blocks many cancer drugs." },
        { "icon": "drop", "title": "Poor blood supply", "text": "Drugs travel in the blood, so the centre of a large tumour may not receive enough." },
        { "icon": "clock", "title": "Silent growth", "text": "Cancers of the pancreas, ovary and lung often cause no symptoms until late." },
        { "icon": "globe", "title": "Unequal access", "text": "In many countries, scans, specialists and medicines are hard to reach or to afford." }
      ] },
      { "type": "sort", "title": "Why is it hard to cure?", "prompt": "Sort each reason.",
        "cats": ["Biology of cancer", "Access and timing"],
        "items": [
          { "text": "The cells keep mutating", "cat": 0 },
          { "text": "Cancer cells hide from immune cells", "cat": 0 },
          { "text": "The drug cannot pass into the brain", "cat": 0 },
          { "text": "No symptoms until the cancer has spread", "cat": 1 },
          { "text": "The nearest cancer centre is a day's travel away", "cat": 1 },
          { "text": "The treatment is too expensive for the family", "cat": 1 }
        ] },
      { "type": "fact", "text": "The discovery of immune checkpoints earned James Allison and Tasuku Honjo the 2018 Nobel Prize in Physiology or Medicine, and led to a new family of cancer medicines." },
      { "type": "quiz", "questions": [
        { "q": "What is an immune checkpoint?", "o": ["A place where doctors check patients", "A “brake” that stops T cells from attacking, which cancer can press", "A type of vaccine"], "a": 1,
          "e": "Checkpoints normally prevent the immune system from attacking healthy tissue. Cancer uses them to hide." },
        { "q": "Why can cancer come back years after treatment?", "o": ["Dormant cancer cells can wake up later", "People catch cancer from each other", "Treatment always creates new cancer"], "a": 0,
          "e": "A few sleeping cells can survive treatment and start growing again later." }
      ] }
    ]
  },

  "c2r": {
    "title": "Module 2 Reflection",
    "summary": "Think about why curing cancer is so difficult.",
    "minutes": 5,
    "blocks": [
      { "type": "text", "body": [ "You learned why cancer is hard to cure: it is made of our own cells, it evolves, it hides, and it is often found late. Answer at least two questions." ] },
      { "type": "reflect", "prompts": [
        "In your own words, why is cancer harder to treat than an infection?",
        "What did the lab or the lessons teach you about resistance?",
        "Which barrier to curing cancer do you think is most important to solve?",
        "Do people in your community face barriers to cancer care? Which ones?"
      ] }
    ]
  },

  /* ===================== MODULE C3: Treatments and solutions ===================== */

  "c3l1": {
    "title": "Surgery and radiation",
    "summary": "The oldest treatments are still among the most powerful, especially early.",
    "minutes": 7,
    "blocks": [
      { "type": "text", "body": [
        "**Surgery** removes the tumour together with some healthy tissue around it (the margin). For many solid cancers found early, surgery alone can cure. Surgeons often also remove nearby lymph nodes to check whether the cancer has spread.",
        "**Radiation therapy** uses high-energy beams, usually X-rays, to damage the DNA of cancer cells in one area. Modern machines shape the beam to spare healthy tissue. About half of all people with cancer receive radiation at some point."
      ] },
      { "type": "compare", "title": "Local or whole-body treatment?", "cols": [
        { "icon": "target", "color": "#b04a6a", "title": "Local treatments", "items": ["Surgery and radiation", "Treat one area very strongly", "Work best before cancer spreads", "Side effects mostly in the treated area"] },
        { "icon": "drop", "color": "#1f6f8b", "title": "Systemic treatments", "items": ["Chemotherapy, targeted drugs, immunotherapy, hormone therapy", "Travel through the blood to the whole body", "Needed when cancer may have spread", "Side effects can affect the whole body"] }
      ] },
      { "type": "fact", "text": "Treatments are often combined: for example, chemotherapy before surgery to shrink a tumour, or radiation after surgery to kill any cells left behind." },
      { "type": "quiz", "questions": [
        { "q": "When does surgery work best?", "o": ["Before the cancer has spread", "Only after the cancer has spread everywhere", "Never"], "a": 0,
          "e": "Surgery can remove a tumour completely when it is still in one place." },
        { "q": "Which is a systemic (whole-body) treatment?", "o": ["Surgery", "Radiation to one area", "Chemotherapy"], "a": 2,
          "e": "Chemotherapy travels in the blood and can reach cancer cells anywhere in the body." }
      ] }
    ]
  },

  "c3l2": {
    "title": "Chemotherapy vs cancer",
    "summary": "How chemotherapy attacks dividing cells — and why it causes side effects.",
    "minutes": 9,
    "blocks": [
      { "type": "text", "body": [
        "**Chemotherapy** uses drugs that kill cells as they divide, for example by damaging their DNA or by blocking the machinery that separates the chromosomes. Cancer cells divide often, so many of them are killed.",
        "But some healthy cells also divide quickly, and chemotherapy hurts them too. This causes the well-known side effects. Most healthy cells recover, which is why chemotherapy is given in **cycles**: a treatment, then a rest period for the body to recover."
      ] },
      { "type": "sort", "title": "Who does chemo hit hardest?", "prompt": "Sort each type of cell.",
        "cats": ["Divides fast: hit hard", "Divides slowly: mostly spared"],
        "items": [
          { "text": "Cancer cells", "cat": 0 },
          { "text": "Hair follicle cells", "cat": 0 },
          { "text": "Cells lining the gut", "cat": 0 },
          { "text": "Bone marrow (blood-making) cells", "cat": 0 },
          { "text": "Nerve cells in the brain", "cat": 1 },
          { "text": "Adult heart muscle cells", "cat": 1 }
        ] },
      { "type": "cards", "title": "Side effects, explained", "items": [
        { "icon": "leaf", "title": "Hair loss", "text": "Hair follicles divide fast. Hair usually grows back after treatment ends." },
        { "icon": "drop", "title": "Nausea and mouth sores", "text": "The lining of the gut and mouth is replaced every few days, so it is easily damaged." },
        { "icon": "shield", "title": "Infections", "text": "The bone marrow makes fewer white blood cells, so the body has less defence against germs." },
        { "icon": "clock", "title": "Tiredness", "text": "Fewer red blood cells (anaemia) and the strain of treatment cause fatigue." },
        { "icon": "cycle", "title": "Why cycles?", "text": "Rest periods let healthy cells recover, while each new cycle kills more cancer cells." }
      ] },
      { "type": "timeline", "title": "A short history of chemotherapy", "items": [
        { "time": "1940s", "title": "From weapons to medicine", "text": "Doctors noticed that mustard gas destroyed white blood cells, and tested related drugs (nitrogen mustards) on lymphoma." },
        { "time": "1948", "title": "First remissions in children", "text": "Sidney Farber used the drug aminopterin to bring children with leukaemia into temporary remission." },
        { "time": "1960s–70s", "title": "Combination chemotherapy", "text": "Combining several drugs cured many children with leukaemia and many people with Hodgkin lymphoma." },
        { "time": "Today", "title": "Part of a toolbox", "text": "Chemotherapy is often combined with surgery, radiation, targeted drugs and immunotherapy." }
      ] },
      { "type": "lab", "title": "Chemo vs cancer in the lab", "text": "Give chemotherapy in the lab and watch both the tumour and the patient's health. What happens if you give it every week?" },
      { "type": "scenario", "title": "A fever during chemo", "text": "A patient having chemotherapy develops a fever between cycles. What should they do?",
        "choices": [
          { "good": false, "text": "Wait and see if it goes away", "result": "Dangerous. Chemotherapy lowers white blood cells, so an infection can become serious very quickly." },
          { "good": true, "text": "Contact the cancer team or go to hospital straight away", "result": "Yes. A fever during chemotherapy can be a medical emergency and needs urgent care." },
          { "good": false, "text": "Stop all medicines without telling anyone", "result": "Never change treatment without the medical team." }
        ] },
      { "type": "quiz", "questions": [
        { "q": "Why does chemotherapy cause hair loss?", "o": ["It targets fast-dividing cells, and hair follicle cells divide quickly", "It poisons the scalp on purpose", "Hair is made of cancer cells"], "a": 0,
          "e": "Chemotherapy cannot tell a fast-dividing cancer cell from a fast-dividing hair cell." },
        { "q": "Why is chemotherapy given in cycles?", "o": ["To save money", "To give healthy cells time to recover between doses", "Because the drug only works on certain days"], "a": 1,
          "e": "Healthy tissues recover between cycles faster than cancer does." }
      ] }
    ]
  },

  "c3l3": {
    "title": "Targeted therapy and immunotherapy",
    "summary": "Smarter medicines that hit cancer's weak points or unleash the immune system.",
    "minutes": 9,
    "blocks": [
      { "type": "text", "body": [
        "**Targeted therapies** are drugs designed to block a specific molecule that a cancer depends on, often the product of a mutated gene. Doctors first test the tumour — for example for HER2 in breast cancer or EGFR in lung cancer — to see whether the target is present.",
        "The drug **imatinib**, approved in 2001, blocks a faulty protein called BCR-ABL. It turned chronic myeloid leukaemia from a deadly disease into a condition that many people live with for decades."
      ] },
      { "type": "compare", "title": "Chemotherapy or targeted therapy?", "cols": [
        { "icon": "flask", "color": "#7a4fa0", "title": "Chemotherapy", "items": ["Hits all fast-dividing cells", "Works on many types of cancer", "More side effects on healthy cells"] },
        { "icon": "target", "color": "#1f6f8b", "title": "Targeted therapy", "items": ["Hits cells that carry a specific target", "Only works if the tumour has that target", "Usually milder side effects, but resistance is common"] }
      ] },
      { "type": "text", "title": "Immunotherapy", "body": [
        "**Immunotherapy** helps the patient's own immune system fight cancer.",
        "- **Checkpoint inhibitors** (such as anti-PD-1 and anti-CTLA-4 antibodies) release the brakes that cancer puts on T cells. They can give long-lasting responses in melanoma, lung, kidney and other cancers.",
        "- **Antibodies** can mark cancer cells for destruction, or carry a drug straight to them.",
        "- **Cell therapies**, such as CAR T cells, are the subject of the next lesson.",
        "Immunotherapy does not work for everyone. An over-active immune system can also attack healthy organs, causing inflammation of the skin, gut, lungs or glands."
      ] },
      { "type": "sort", "title": "Chemo, targeted or immuno?", "prompt": "Sort each description.",
        "cats": ["Chemotherapy", "Targeted therapy", "Immunotherapy"],
        "items": [
          { "text": "Kills any rapidly dividing cell", "cat": 0 },
          { "text": "Often causes hair loss", "cat": 0 },
          { "text": "Blocks the HER2 protein on breast cancer cells", "cat": 1 },
          { "text": "Only given if a tumour test finds the mutation", "cat": 1 },
          { "text": "Releases the brakes on T cells", "cat": 2 },
          { "text": "Can make the immune system attack healthy organs", "cat": 2 }
        ] },
      { "type": "quiz", "questions": [
        { "q": "Before giving a targeted therapy, what do doctors usually do?", "o": ["Test the tumour to see if the target is present", "Nothing", "Always give chemotherapy first"], "a": 0,
          "e": "A targeted drug only helps if the tumour has its target." },
        { "q": "How do checkpoint inhibitors work?", "o": ["They poison dividing cells", "They release the brakes that stop T cells attacking cancer", "They cut out tumours"], "a": 1,
          "e": "They remove the “off switch” that cancer uses to calm T cells." }
      ] }
    ]
  },

  "c3l4": {
    "title": "CAR T cells",
    "summary": "Reprogramming a patient's own immune cells into living cancer hunters.",
    "minutes": 10,
    "blocks": [
      { "type": "text", "body": [
        "**T cells** are immune cells that can kill infected or abnormal cells, but cancer cells often escape them. **CAR T cell therapy** gives the patient's own T cells a new, artificial receptor — a **chimeric antigen receptor (CAR)** — that recognises a marker (antigen) on the cancer cells, such as **CD19** on B-cell leukaemia and lymphoma.",
        "It is a “living drug”: once infused, the CAR T cells multiply in the body and can keep patrolling for months or even years."
      ] },
      { "type": "order", "title": "How CAR T therapy works", "prompt": "Put the steps in order.", "items": [
        "Blood is collected and the patient's T cells are separated out",
        "In a laboratory, a harmless virus delivers the CAR gene into the T cells",
        "The CAR T cells are grown until there are hundreds of millions",
        "The patient receives mild chemotherapy to make room for the new cells",
        "The CAR T cells are infused back into the patient",
        "The CAR T cells find cancer cells with the target antigen and destroy them"
      ] },
      { "type": "stats", "items": [
        { "value": "2017", "label": "first CAR T therapy approved by the US FDA, for children and young adults with leukaemia" },
        { "value": "~80%", "label": "of young patients with hard-to-treat B-cell leukaemia went into remission in the key trial" },
        { "value": "6+", "label": "CAR T therapies approved in the US for leukaemia, lymphoma and myeloma" }
      ], "source": "Sources: US National Cancer Institute; Novartis ELIANA trial." },
      { "type": "cards", "title": "Challenges", "items": [
        { "icon": "fire", "title": "Cytokine release syndrome", "text": "As CAR T cells kill cancer, they release a flood of immune signals that can cause high fever and low blood pressure. It is treated in hospital." },
        { "icon": "alert", "title": "Nerve side effects", "text": "Some patients have confusion, trouble speaking or seizures. These are usually temporary." },
        { "icon": "eye", "title": "Antigen escape", "text": "Cancer cells that lose the target antigen can escape and cause a relapse." },
        { "icon": "shield", "title": "Solid tumours", "text": "CAR T works best on blood cancers. Solid tumours are harder to enter and have fewer safe targets — a major research area." },
        { "icon": "globe", "title": "Cost and access", "text": "Each treatment is made for one patient and can cost several hundred thousand US dollars. Scientists are developing cheaper “off-the-shelf” versions." }
      ] },
      { "type": "lab", "title": "Try CAR T in the lab", "text": "In the Cancer Treatment Lab, CAR T cells wipe out the cells that show the antigen. What happens to the cells that hide it?" },
      { "type": "quiz", "questions": [
        { "q": "What does CAR stand for?", "o": ["Cancer attack robot", "Chimeric antigen receptor", "Cell and radiation"], "a": 1,
          "e": "The CAR is an engineered receptor that lets T cells recognise a cancer antigen." },
        { "q": "Where do the T cells used in CAR T therapy usually come from?", "o": ["The patient's own blood", "A plant", "A virus"], "a": 0,
          "e": "Most CAR T therapies use the patient's own T cells, collected from the blood." },
        { "q": "Which side effect is typical of CAR T therapy?", "o": ["Cytokine release syndrome", "Broken bones", "Hair turning blue"], "a": 0,
          "e": "The strong immune reaction can cause fever and low blood pressure, and needs hospital care." }
      ] },
      { "type": "links", "items": [
        { "label": "US National Cancer Institute: CAR T cells", "url": "https://www.cancer.gov/about-cancer/treatment/research/car-t-cells" }
      ] }
    ]
  },

  "c3l5": {
    "title": "Other solutions and the future",
    "summary": "Hormones, transplants, new cell therapies, vaccines, precision medicine — and care that puts people first.",
    "minutes": 9,
    "blocks": [
      { "type": "cards", "title": "More tools against cancer", "items": [
        { "icon": "drop", "title": "Hormone therapy", "text": "Some breast and prostate cancers need hormones to grow. Blocking those hormones slows them down." },
        { "icon": "cell", "title": "Stem cell transplant", "text": "After very high-dose treatment for blood cancers, healthy blood-forming stem cells are given to rebuild the bone marrow." },
        { "icon": "target", "title": "Antibody–drug conjugates", "text": "An antibody carries a powerful drug straight to the cancer cells, like a guided missile." },
        { "icon": "shield", "title": "Tumour-infiltrating lymphocytes", "text": "T cells taken from the patient's own tumour are grown in large numbers and given back. Approved in the US for advanced melanoma in 2024." },
        { "icon": "syringe", "title": "mRNA cancer vaccines", "text": "Personalised vaccines teach the immune system to recognise the mutations in a patient's own tumour. Several are being tested in clinical trials." },
        { "icon": "dna", "title": "Precision medicine", "text": "Reading the tumour's DNA helps doctors choose the medicines most likely to work for that person." },
        { "icon": "heart", "title": "Palliative care", "text": "Care that relieves pain and other symptoms and supports patients and families at any stage of illness, not only at the end of life." }
      ] },
      { "type": "fact", "text": "Cancer research moves fast: most of the medicines in this lesson did not exist 30 years ago. Clinical trials are how new treatments are tested safely before doctors use them widely." },
      { "type": "quiz", "questions": [
        { "q": "How does hormone therapy help some breast and prostate cancers?", "o": ["It blocks the hormones these cancers need to grow", "It heats the tumour", "It replaces the blood"], "a": 0,
          "e": "Without the hormone signal, hormone-sensitive cancers grow much more slowly." },
        { "q": "What is palliative care?", "o": ["Care only in the last days of life", "Care that relieves symptoms and supports patients and families at any stage", "A type of surgery"], "a": 1,
          "e": "Palliative care improves quality of life alongside other treatments." }
      ] }
    ]
  },

  "c3l6": {
    "title": "Prevention and early detection",
    "summary": "Up to half of cancers could be prevented, and many more can be found early.",
    "minutes": 8,
    "blocks": [
      { "type": "text", "body": [
        "The World Health Organization estimates that **30–50% of cancers** could be prevented by avoiding risk factors and using proven prevention measures. Many others can be cured if they are found early."
      ] },
      { "type": "cards", "title": "Lower your risk", "items": [
        { "icon": "fire", "title": "No tobacco", "text": "Not smoking — or quitting at any age — is the single most effective way to lower cancer risk." },
        { "icon": "syringe", "title": "Vaccines", "text": "The HPV vaccine prevents most cervical cancers. The hepatitis B vaccine helps prevent liver cancer." },
        { "icon": "heart", "title": "Healthy weight and activity", "text": "Staying active, eating fruit, vegetables and whole grains, and limiting processed meat lower the risk of several cancers." },
        { "icon": "drop", "title": "Less alcohol", "text": "The less alcohol you drink, the lower the risk." },
        { "icon": "sun", "title": "Sun protection", "text": "Shade, clothing, hats and sunscreen protect against skin cancer." },
        { "icon": "leaf", "title": "Clean air", "text": "Reducing smoke from indoor cooking fires and outdoor air pollution lowers the risk of lung cancer." }
      ] },
      { "type": "cards", "title": "Find it early", "items": [
        { "icon": "cell", "title": "Cervical screening", "text": "HPV tests or Pap smears find changes before they become cancer." },
        { "icon": "heart", "title": "Breast screening", "text": "Mammograms can find small breast cancers before they can be felt." },
        { "icon": "target", "title": "Bowel screening", "text": "Stool tests and colonoscopy find cancers and the polyps that can turn into cancer." },
        { "icon": "alert", "title": "Know the warning signs", "text": "A new lump, a sore that does not heal, unusual bleeding, a cough that does not go away or unexplained weight loss should be checked by a health worker." }
      ] },
      { "type": "sort", "title": "Prevention or early detection?", "prompt": "Sort each action.",
        "cats": ["Prevention", "Early detection"],
        "items": [
          { "text": "Getting the HPV vaccine", "cat": 0 },
          { "text": "Quitting smoking", "cat": 0 },
          { "text": "Wearing a hat in strong sun", "cat": 0 },
          { "text": "Having a mammogram", "cat": 1 },
          { "text": "An HPV test for cervical screening", "cat": 1 },
          { "text": "Seeing a doctor about a lump that does not go away", "cat": 1 }
        ] },
      { "type": "fact", "text": "WHO aims to eliminate cervical cancer as a public health problem. Its 90-70-90 targets for 2030: 90% of girls vaccinated against HPV by age 15, 70% of women screened, and 90% of women with cervical disease treated." },
      { "type": "quiz", "questions": [
        { "q": "Which vaccine helps prevent cervical cancer?", "o": ["The HPV vaccine", "The flu vaccine", "The rabies vaccine"], "a": 0,
          "e": "HPV causes almost all cervical cancers, and the vaccine prevents infection." },
        { "q": "What is the single most effective way to lower cancer risk?", "o": ["Avoiding tobacco", "Drinking coffee", "Taking vitamins"], "a": 0,
          "e": "Tobacco is the biggest avoidable cause of cancer." }
      ] },
      { "type": "links", "items": [
        { "label": "WHO: Cervical Cancer Elimination Initiative", "url": "https://www.who.int/initiatives/cervical-cancer-elimination-initiative" }
      ] }
    ]
  },

  "c3r": {
    "title": "Module 3 Reflection",
    "summary": "Bring together what you learned about treating and preventing cancer.",
    "minutes": 5,
    "blocks": [
      { "type": "text", "body": [ "You explored surgery, radiation, chemotherapy, targeted drugs, immunotherapy, CAR T cells, new therapies and prevention. Answer at least two questions." ] },
      { "type": "reflect", "prompts": [
        "Which treatment surprised you most, and why?",
        "Explain in your own words how CAR T cells work.",
        "Which prevention steps could you or your family take?",
        "How could your community improve early detection of cancer?"
      ] }
    ]
  }
});

/* Cancer final exam question pool: 20 questions are drawn at random for each attempt. */
LH.i18n.en.examCancer = {
  "questions": [
    { "q": "What is cancer?", "o": ["An infection that spreads from person to person", "A disease in which the body's own cells grow and divide out of control", "A kind of injury"], "a": 1, "e": "Cancer starts from our own cells whose DNA has changed." },
    { "q": "What makes a tumour malignant?", "o": ["It is large", "It can invade nearby tissue and spread", "It is painful"], "a": 1, "e": "Benign tumours stay in place; malignant ones invade and spread." },
    { "q": "Which of these is a major cause of DNA damage and cancer?", "o": ["Drinking water", "Tobacco smoke", "Sleeping"], "a": 1, "e": "Tobacco causes about a quarter of cancer deaths." },
    { "q": "About how many people develop cancer during their lifetime?", "o": ["1 in 100", "1 in 5", "Everyone"], "a": 1, "e": "About 1 in 5 people worldwide develop cancer during their lifetime." },
    { "q": "Which is the most common type of cancer?", "o": ["Sarcoma", "Carcinoma", "Myeloma"], "a": 1, "e": "Carcinomas start in the lining of organs and skin." },
    { "q": "Leukaemia is a cancer of…", "o": ["bone", "blood-forming cells in the bone marrow", "the skin"], "a": 1, "e": "Leukaemia usually does not form a solid tumour." },
    { "q": "Breast cancer has spread to the lungs. What is it called?", "o": ["Lung cancer", "Metastatic breast cancer", "A new cancer"], "a": 1, "e": "Cancers are named after where they started." },
    { "q": "In TNM staging, what does M stand for?", "o": ["Metastasis: spread to distant organs", "The mass of the tumour", "Medicine"], "a": 0, "e": "M1 means the cancer has spread to distant organs." },
    { "q": "What does stage IV usually mean?", "o": ["Abnormal cells that have not invaded", "The cancer has spread to distant organs", "The smallest possible tumour"], "a": 1, "e": "Stage IV is metastatic cancer." },
    { "q": "Why does finding cancer early matter?", "o": ["Early cancers are always painful", "Cancers found early are usually easier to treat and cure", "Early cancers do not need treatment"], "a": 1, "e": "Survival is much higher before cancer spreads." },
    { "q": "What causes most cancer deaths?", "o": ["The first tumour only", "Metastasis: spread to other organs", "Chemotherapy"], "a": 1, "e": "Spread cancer is much harder to remove or control." },
    { "q": "Why does bowel cancer often spread to the liver?", "o": ["Blood from the gut flows straight to the liver", "The liver is next to the brain", "Because of the food we eat"], "a": 0, "e": "Escaping cells reach the liver first." },
    { "q": "Why is it hard to kill cancer cells without harming the patient?", "o": ["Cancer cells are made of metal", "They are the patient's own cells and share most of their machinery", "They are too small to see"], "a": 1, "e": "Treatments that hurt cancer cells often hurt healthy cells too." },
    { "q": "What is tumour heterogeneity?", "o": ["A tumour made of many slightly different groups of cells", "A very hard tumour", "A tumour in two organs"], "a": 0, "e": "Different cells can respond differently to treatment." },
    { "q": "Why do doctors often combine treatments?", "o": ["To make treatment last longer", "So that it is harder for any cell to resist all of them", "Because single drugs are not allowed"], "a": 1, "e": "A cell rarely resists several different treatments at once." },
    { "q": "A tumour shrank with a drug, then grew back and no longer responds. What is the most likely reason?", "o": ["The drug had expired", "Resistant cells survived and regrew", "The patient did something wrong"], "a": 1, "e": "This is acquired resistance through natural selection." },
    { "q": "What is an immune checkpoint?", "o": ["A place where doctors check patients", "A “brake” that stops T cells attacking, which cancer can press", "A type of vaccine"], "a": 1, "e": "Cancer uses checkpoints to switch T cells off." },
    { "q": "Why can cancer come back years after treatment?", "o": ["Dormant cancer cells can wake up later", "People catch cancer from each other", "Treatment always creates new cancer"], "a": 0, "e": "A few sleeping cells can survive treatment." },
    { "q": "When does surgery work best?", "o": ["Before the cancer has spread", "Only after it has spread everywhere", "Never"], "a": 0, "e": "Surgery can remove a tumour that is still in one place." },
    { "q": "Which is a systemic (whole-body) treatment?", "o": ["Surgery", "Radiation to one area", "Chemotherapy"], "a": 2, "e": "Chemotherapy travels in the blood." },
    { "q": "Why does chemotherapy cause hair loss?", "o": ["It targets fast-dividing cells, and hair follicle cells divide quickly", "It poisons the scalp on purpose", "Hair is made of cancer cells"], "a": 0, "e": "Chemo cannot tell fast-dividing cancer cells from fast-dividing healthy cells." },
    { "q": "Why is chemotherapy given in cycles?", "o": ["To save money", "To give healthy cells time to recover between doses", "Because the drug only works on certain days"], "a": 1, "e": "Healthy tissues recover between cycles." },
    { "q": "A patient on chemotherapy develops a fever. What should they do?", "o": ["Wait and see", "Contact the cancer team or go to hospital straight away", "Stop all medicines without telling anyone"], "a": 1, "e": "Fever during chemotherapy can be an emergency because the body has fewer white blood cells." },
    { "q": "Before giving a targeted therapy, what do doctors usually do?", "o": ["Test the tumour to see if the target is present", "Nothing", "Always give chemotherapy first"], "a": 0, "e": "A targeted drug only helps if the target is there." },
    { "q": "The drug imatinib changed the outlook for which cancer?", "o": ["Chronic myeloid leukaemia", "Skin cancer", "Brain tumours"], "a": 0, "e": "It blocks the faulty BCR-ABL protein." },
    { "q": "How do checkpoint inhibitors work?", "o": ["They poison dividing cells", "They release the brakes that stop T cells attacking cancer", "They cut out tumours"], "a": 1, "e": "They remove cancer's “off switch” for T cells." },
    { "q": "What does CAR stand for in CAR T therapy?", "o": ["Cancer attack robot", "Chimeric antigen receptor", "Cell and radiation"], "a": 1, "e": "The CAR lets T cells recognise a cancer antigen." },
    { "q": "Where do the T cells used in CAR T therapy usually come from?", "o": ["The patient's own blood", "A plant", "A virus"], "a": 0, "e": "They are collected from the patient, engineered, and given back." },
    { "q": "Which side effect is typical of CAR T therapy?", "o": ["Cytokine release syndrome", "Broken bones", "Hair turning blue"], "a": 0, "e": "A strong immune reaction can cause fever and low blood pressure." },
    { "q": "CAR T therapy currently works best against…", "o": ["blood cancers such as leukaemia and lymphoma", "all solid tumours equally", "skin cancer only"], "a": 0, "e": "Solid tumours are harder for CAR T cells to enter." },
    { "q": "How does hormone therapy help some breast and prostate cancers?", "o": ["It blocks the hormones these cancers need to grow", "It heats the tumour", "It replaces the blood"], "a": 0, "e": "Hormone-sensitive cancers grow much more slowly without the hormone." },
    { "q": "What is palliative care?", "o": ["Care only in the last days of life", "Care that relieves symptoms and supports patients and families at any stage", "A type of surgery"], "a": 1, "e": "It improves quality of life alongside other treatments." },
    { "q": "Which vaccine helps prevent cervical cancer?", "o": ["The HPV vaccine", "The flu vaccine", "The rabies vaccine"], "a": 0, "e": "HPV causes almost all cervical cancers." },
    { "q": "What is the single most effective way to lower cancer risk?", "o": ["Avoiding tobacco", "Drinking coffee", "Taking vitamins"], "a": 0, "e": "Tobacco is the biggest avoidable cause of cancer." }
  ]
};
