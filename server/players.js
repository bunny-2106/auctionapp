// Complete player database — 200 international cricket players
// base price is in ₹ Crores

const PLAYERS = [
  // ── INDIA ────────────────────────────────────────────────────────────────
  { name: "Virat Kohli",         role: "Batsman",      country: "India",        base: 20, initials: "VK",  speciality: "Chase master, Test & T20 legend" },
  { name: "Rohit Sharma",        role: "Batsman",      country: "India",        base: 18, initials: "RS",  speciality: "Six-hitting opener, IPL great" },
  { name: "Shubman Gill",        role: "Batsman",      country: "India",        base: 14, initials: "SG",  speciality: "Young star, elegant strokeplay" },
  { name: "KL Rahul",            role: "Batsman",      country: "India",        base: 14, initials: "KLR", speciality: "Versatile top-order bat" },
  { name: "Suryakumar Yadav",    role: "Batsman",      country: "India",        base: 14, initials: "SKY", speciality: "360-degree player, world no.1 T20" },
  { name: "Shreyas Iyer",        role: "Batsman",      country: "India",        base: 12, initials: "SI",  speciality: "Solid middle-order, good against pace" },
  { name: "Yashasvi Jaiswal",    role: "Batsman",      country: "India",        base: 12, initials: "YJ",  speciality: "Explosive young opener, record-setter" },
  { name: "Tilak Varma",         role: "Batsman",      country: "India",        base: 10, initials: "TV",  speciality: "Young finisher, T20 prodigy" },
  { name: "Ruturaj Gaikwad",     role: "Batsman",      country: "India",        base: 11, initials: "RG",  speciality: "CSK captain, consistent IPL performer" },
  { name: "Sanju Samson",        role: "Batsman",      country: "India",        base: 11, initials: "SS2", speciality: "Elegant stroke-maker, capable keeper" },

  { name: "Jasprit Bumrah",      role: "Bowler",       country: "India",        base: 18, initials: "JB",  speciality: "World's best pacer, death overs" },
  { name: "Ravichandran Ashwin", role: "Bowler",       country: "India",        base: 16, initials: "RA",  speciality: "700+ Test wickets, master spinner" },
  { name: "Mohammed Siraj",      role: "Bowler",       country: "India",        base: 12, initials: "MSi", speciality: "World Test Championship hero" },
  { name: "Yuzvendra Chahal",    role: "Bowler",       country: "India",        base: 10, initials: "YC",  speciality: "India's premier T20 spinner" },
  { name: "Arshdeep Singh",      role: "Bowler",       country: "India",        base: 10, initials: "ASi", speciality: "Powerplay & death overs specialist" },
  { name: "Kuldeep Yadav",       role: "Bowler",       country: "India",        base: 11, initials: "KY",  speciality: "Wrist-spin wizard, ODI/Test wicket-taker" },
  { name: "Prasidh Krishna",     role: "Bowler",       country: "India",        base: 9,  initials: "PK",  speciality: "Tall pacer, awkward bounce" },
  { name: "Umesh Yadav",         role: "Bowler",       country: "India",        base: 8,  initials: "UY",  speciality: "Experienced IPL pacer" },
  { name: "Shardul Thakur",      role: "Bowler",       country: "India",        base: 9,  initials: "ST",  speciality: "Wicket-taker with handy lower-order bat" },
  { name: "T Natarajan",         role: "Bowler",       country: "India",        base: 8,  initials: "TN",  speciality: "Yorker specialist, left-arm pace" },

  { name: "Hardik Pandya",       role: "All-rounder",  country: "India",        base: 16, initials: "HP",  speciality: "Explosive bat + express pace" },
  { name: "Ravindra Jadeja",     role: "All-rounder",  country: "India",        base: 16, initials: "RJ",  speciality: "Best fielder, reliable bat & bowl" },
  { name: "Axar Patel",          role: "All-rounder",  country: "India",        base: 11, initials: "AP",  speciality: "Left-arm spin + handy lower-order bat" },
  { name: "Washington Sundar",   role: "All-rounder",  country: "India",        base: 9,  initials: "WS",  speciality: "Offbreak + useful top-order bat" },
  { name: "Shivam Dube",         role: "All-rounder",  country: "India",        base: 9,  initials: "SD",  speciality: "Left-hand slogger, medium pace" },

  { name: "MS Dhoni",            role: "Wicketkeeper", country: "India",        base: 16, initials: "MSD", speciality: "Greatest finisher & captain ever" },
  { name: "Rishabh Pant",        role: "Wicketkeeper", country: "India",        base: 15, initials: "RP",  speciality: "Match-winner, aggressive keeper-bat" },
  { name: "Ishan Kishan",        role: "Wicketkeeper", country: "India",        base: 12, initials: "IK",  speciality: "Explosive opener, handy keeper" },
  { name: "Dinesh Karthik",      role: "Wicketkeeper", country: "India",        base: 9,  initials: "DK",  speciality: "Death-overs finisher, experienced keeper" },
  { name: "KS Bharat",           role: "Wicketkeeper", country: "India",        base: 7,  initials: "KSB", speciality: "Reliable test-level keeper-bat" },

  // ── AUSTRALIA ────────────────────────────────────────────────────────────
  { name: "David Warner",        role: "Batsman",      country: "Australia",    base: 13, initials: "DW",  speciality: "Destructive opener, IPL legend" },
  { name: "Steve Smith",         role: "Batsman",      country: "Australia",    base: 14, initials: "SS",  speciality: "World-class Test no.4" },
  { name: "Travis Head",         role: "Batsman",      country: "Australia",    base: 13, initials: "TH",  speciality: "WC 2023 final hero, power opener" },
  { name: "Marnus Labuschagne",  role: "Batsman",      country: "Australia",    base: 12, initials: "ML",  speciality: "World's no.1 ranked Test batter" },
  { name: "Usman Khawaja",       role: "Batsman",      country: "Australia",    base: 10, initials: "UK",  speciality: "Solid test opener, elegant left-hander" },
  { name: "Matthew Short",       role: "Batsman",      country: "Australia",    base: 8,  initials: "MSh", speciality: "Big-hitting white-ball opener" },

  { name: "Pat Cummins",         role: "Bowler",       country: "Australia",    base: 18, initials: "PC",  speciality: "World's best Test pacer, captain" },
  { name: "Mitchell Starc",      role: "Bowler",       country: "Australia",    base: 15, initials: "MSt", speciality: "Swing king, WC specialist" },
  { name: "Adam Zampa",          role: "Bowler",       country: "Australia",    base: 10, initials: "AZ",  speciality: "Aussie's go-to white-ball spinner" },
  { name: "Josh Hazlewood",      role: "Bowler",       country: "Australia",    base: 13, initials: "JH",  speciality: "Accuracy + seam, Test thoroughbred" },
  { name: "Nathan Lyon",         role: "Bowler",       country: "Australia",    base: 11, initials: "NL",  speciality: "Australia's GOAT off-spinner" },
  { name: "Spencer Johnson",     role: "Bowler",       country: "Australia",    base: 9,  initials: "SJ",  speciality: "Left-arm fast, death-overs specialist" },

  { name: "Glenn Maxwell",       role: "All-rounder",  country: "Australia",    base: 13, initials: "GM",  speciality: "Explosive bat, part-time offbreak" },
  { name: "Cameron Green",       role: "All-rounder",  country: "Australia",    base: 11, initials: "CG",  speciality: "Tall fast-bowling all-rounder" },
  { name: "Marcus Stoinis",      role: "All-rounder",  country: "Australia",    base: 11, initials: "MSo", speciality: "Powerful hitter + medium pace" },

  { name: "Matthew Wade",        role: "Wicketkeeper", country: "Australia",    base: 9,  initials: "MW",  speciality: "Aggressive keeper-bat, finishing specialist" },
  { name: "Alex Carey",          role: "Wicketkeeper", country: "Australia",    base: 9,  initials: "AC",  speciality: "Reliable Test keeper, handy bat" },

  // ── ENGLAND ──────────────────────────────────────────────────────────────
  { name: "Jos Buttler",         role: "Wicketkeeper", country: "England",      base: 15, initials: "JBu", speciality: "World's best T20 bat, explosive keeper" },
  { name: "Ben Stokes",          role: "All-rounder",  country: "England",      base: 17, initials: "BS",  speciality: "World's best all-rounder, Test titan" },
  { name: "Jofra Archer",        role: "Bowler",       country: "England",      base: 16, initials: "JA",  speciality: "Pace and bounce, T20 match-winner" },
  { name: "Mark Wood",           role: "Bowler",       country: "England",      base: 13, initials: "MWo", speciality: "Express pace, 150+ kmph regularly" },
  { name: "Joe Root",            role: "Batsman",      country: "England",      base: 14, initials: "JR",  speciality: "World's no.1 Test batter, prolific run-scorer" },
  { name: "Jonny Bairstow",      role: "Wicketkeeper", country: "England",      base: 11, initials: "JBa", speciality: "Explosive keeper-bat across formats" },
  { name: "Harry Brook",         role: "Batsman",      country: "England",      base: 13, initials: "HB",  speciality: "Explosive young talent, Bazball hero" },
  { name: "Liam Livingstone",    role: "All-rounder",  country: "England",      base: 11, initials: "LL",  speciality: "Power-hitter + legspin, T20 match-winner" },
  { name: "Sam Curran",          role: "All-rounder",  country: "England",      base: 12, initials: "SC",  speciality: "WC 2022 Player of the Tournament" },
  { name: "Adil Rashid",         role: "Bowler",       country: "England",      base: 10, initials: "AR",  speciality: "England's premier legspin bowler" },
  { name: "Reece Topley",        role: "Bowler",       country: "England",      base: 9,  initials: "RT",  speciality: "Tall left-arm swing bowler" },
  { name: "Phil Salt",           role: "Batsman",      country: "England",      base: 11, initials: "PS",  speciality: "Explosive T20 opener" },

  // ── PAKISTAN ─────────────────────────────────────────────────────────────
  { name: "Babar Azam",          role: "Batsman",      country: "Pakistan",     base: 16, initials: "BA",  speciality: "World-class across all formats" },
  { name: "Shaheen Afridi",      role: "Bowler",       country: "Pakistan",     base: 14, initials: "SAf", speciality: "Swing & pace, WC 2021 hero" },
  { name: "Mohammad Rizwan",     role: "Wicketkeeper", country: "Pakistan",     base: 13, initials: "MR",  speciality: "Prolific T20 opener, dependable keeper" },
  { name: "Naseem Shah",         role: "Bowler",       country: "Pakistan",     base: 12, initials: "NS",  speciality: "Raw pace, bounce, future star" },
  { name: "Shadab Khan",         role: "All-rounder",  country: "Pakistan",     base: 11, initials: "SK",  speciality: "Legspin + punchy lower-order bat" },
  { name: "Fakhar Zaman",        role: "Batsman",      country: "Pakistan",     base: 10, initials: "FZ",  speciality: "Aggressive left-hand opener" },
  { name: "Mohammad Hasnain",    role: "Bowler",       country: "Pakistan",     base: 9,  initials: "MH",  speciality: "Express right-arm pace, bouncer specialist" },
  { name: "Haris Rauf",          role: "Bowler",       country: "Pakistan",     base: 10, initials: "HR",  speciality: "High pace, excellent death bowler" },
  { name: "Iftikhar Ahmed",      role: "All-rounder",  country: "Pakistan",     base: 8,  initials: "IA",  speciality: "Middle-order hitter + offbreak" },
  { name: "Agha Salman",         role: "All-rounder",  country: "Pakistan",     base: 8,  initials: "AgS", speciality: "Reliable bat + medium-pace all-rounder" },

  // ── NEW ZEALAND ──────────────────────────────────────────────────────────
  { name: "Kane Williamson",     role: "Batsman",      country: "New Zealand",  base: 14, initials: "KW",  speciality: "Calm, technically brilliant captain-bat" },
  { name: "Trent Boult",         role: "Bowler",       country: "New Zealand",  base: 13, initials: "TB",  speciality: "Swing master, powerplay specialist" },
  { name: "Devon Conway",        role: "Batsman",      country: "New Zealand",  base: 11, initials: "DC",  speciality: "Compact left-hand opener, keeps too" },
  { name: "Daryl Mitchell",      role: "All-rounder",  country: "New Zealand",  base: 10, initials: "DM",  speciality: "Explosive middle-order + medium pace" },
  { name: "Tim Southee",         role: "Bowler",       country: "New Zealand",  base: 11, initials: "TS",  speciality: "Swing, seam, 400+ Test wickets" },
  { name: "Matt Henry",          role: "Bowler",       country: "New Zealand",  base: 9,  initials: "MH2", speciality: "Consistent seam bowler" },
  { name: "Glenn Phillips",      role: "All-rounder",  country: "New Zealand",  base: 10, initials: "GP",  speciality: "Explosive T20 bat + legspin" },
  { name: "Rachin Ravindra",     role: "All-rounder",  country: "New Zealand",  base: 11, initials: "RR",  speciality: "WC 2023 standout, left-hand bat + slow left-arm" },
  { name: "Tom Latham",          role: "Wicketkeeper", country: "New Zealand",  base: 9,  initials: "TL",  speciality: "Solid Test opener-keeper" },

  // ── WEST INDIES ──────────────────────────────────────────────────────────
  { name: "Nicholas Pooran",     role: "Wicketkeeper", country: "West Indies",  base: 11, initials: "NP",  speciality: "Explosive finisher, clean hitter" },
  { name: "Andre Russell",       role: "All-rounder",  country: "West Indies",  base: 13, initials: "ARu", speciality: "Most destructive hitter + express pacer" },
  { name: "Sunil Narine",        role: "All-rounder",  country: "West Indies",  base: 12, initials: "SN",  speciality: "Mystery spinner + pinch-hitting opener" },
  { name: "Shimron Hetmyer",     role: "Batsman",      country: "West Indies",  base: 10, initials: "SHe", speciality: "Left-hand finisher, fearless T20 hitter" },
  { name: "Evin Lewis",          role: "Batsman",      country: "West Indies",  base: 9,  initials: "EL",  speciality: "Destructive left-hand T20 opener" },
  { name: "Alzarri Joseph",      role: "Bowler",       country: "West Indies",  base: 11, initials: "AJ",  speciality: "Right-arm pace, IPL record-breaker" },
  { name: "Jason Holder",        role: "All-rounder",  country: "West Indies",  base: 10, initials: "JHo", speciality: "Tall seamer + dependable middle-order bat" },
  { name: "Romario Shepherd",    role: "All-rounder",  country: "West Indies",  base: 9,  initials: "RSh", speciality: "Explosive lower-order bat + pace" },
  { name: "Gudakesh Motie",      role: "Bowler",       country: "West Indies",  base: 8,  initials: "GMo", speciality: "Left-arm spin, WC 2024 performer" },

  // ── AFGHANISTAN ──────────────────────────────────────────────────────────
  { name: "Rashid Khan",         role: "Bowler",       country: "Afghanistan",  base: 15, initials: "RK",  speciality: "Best T20 spinner in the world" },
  { name: "Mohammad Nabi",       role: "All-rounder",  country: "Afghanistan",  base: 10, initials: "MN",  speciality: "Steady offbreak + reliable lower-order bat" },
  { name: "Ibrahim Zadran",      role: "Batsman",      country: "Afghanistan",  base: 9,  initials: "IZ",  speciality: "Top-order opener, WC 2024 standout" },
  { name: "Rahmanullah Gurbaz",  role: "Wicketkeeper", country: "Afghanistan",  base: 10, initials: "RGu", speciality: "Explosive opening keeper-bat" },
  { name: "Azmatullah Omarzai",  role: "All-rounder",  country: "Afghanistan",  base: 9,  initials: "AO",  speciality: "Batting all-rounder + medium pace" },
  { name: "Naveen ul Haq",       role: "Bowler",       country: "Afghanistan",  base: 9,  initials: "NuH", speciality: "Accurate pacer, variations expert" },
  { name: "Mujeeb Ur Rahman",    role: "Bowler",       country: "Afghanistan",  base: 10, initials: "MuR", speciality: "Mystery spinner, powerplay specialist" },

  // ── SOUTH AFRICA ─────────────────────────────────────────────────────────
  { name: "Quinton de Kock",     role: "Wicketkeeper", country: "South Africa", base: 13, initials: "QdK", speciality: "Attacking opener, agile keeper" },
  { name: "Kagiso Rabada",       role: "Bowler",       country: "South Africa", base: 15, initials: "KR",  speciality: "SA's spearhead, wicket-taking machine" },
  { name: "Aiden Markram",       role: "Batsman",      country: "South Africa", base: 11, initials: "AMa", speciality: "Stylish top-order bat" },
  { name: "David Miller",        role: "Batsman",      country: "South Africa", base: 11, initials: "DMi", speciality: "Killer Miller — lethal T20 finisher" },
  { name: "Heinrich Klaasen",    role: "Wicketkeeper", country: "South Africa", base: 12, initials: "HK",  speciality: "Dominant T20 finisher, WC 2024 star" },
  { name: "Marco Jansen",        role: "All-rounder",  country: "South Africa", base: 11, initials: "MJa", speciality: "Tall left-arm pacer + useful bat" },
  { name: "Anrich Nortje",       role: "Bowler",       country: "South Africa", base: 12, initials: "AN",  speciality: "150+ kmph pace, bounce specialist" },
  { name: "Keshav Maharaj",      role: "Bowler",       country: "South Africa", base: 9,  initials: "KMa", speciality: "SA's main spinner, solid Test performer" },
  { name: "Tabraiz Shamsi",      role: "Bowler",       country: "South Africa", base: 9,  initials: "TSh", speciality: "Left-arm wrist-spin, T20 specialist" },

  // ── SRI LANKA ────────────────────────────────────────────────────────────
  { name: "Kusal Mendis",        role: "Wicketkeeper", country: "Sri Lanka",    base: 10, initials: "KMe", speciality: "Aggressive opener-keeper" },
  { name: "Pathum Nissanka",     role: "Batsman",      country: "Sri Lanka",    base: 9,  initials: "PN",  speciality: "Solid opener, consistent run-scorer" },
  { name: "Charith Asalanka",    role: "Batsman",      country: "Sri Lanka",    base: 9,  initials: "CA",  speciality: "Middle-order anchor, T20 specialist" },
  { name: "Wanindu Hasaranga",   role: "All-rounder",  country: "Sri Lanka",    base: 12, initials: "WH",  speciality: "Googly-spinning all-rounder, IPL star" },
  { name: "Maheesh Theekshana",  role: "Bowler",       country: "Sri Lanka",    base: 10, initials: "MT",  speciality: "Mystery spinner, powerplay threat" },
  { name: "Dushmantha Chameera", role: "Bowler",       country: "Sri Lanka",    base: 9,  initials: "DCh", speciality: "Express right-arm pace" },
  { name: "Matheesha Pathirana", role: "Bowler",       country: "Sri Lanka",    base: 10, initials: "MPa", speciality: "Yorker specialist, death overs expert" },
  { name: "Dasun Shanaka",       role: "All-rounder",  country: "Sri Lanka",    base: 8,  initials: "DS",  speciality: "Lower-order hitter + medium pace" },

  // ── BANGLADESH ───────────────────────────────────────────────────────────
  { name: "Shakib Al Hasan",     role: "All-rounder",  country: "Bangladesh",   base: 12, initials: "SAH", speciality: "World's greatest spin all-rounder" },
  { name: "Mustafizur Rahman",   role: "Bowler",       country: "Bangladesh",   base: 10, initials: "MuRa",speciality: "Cutter & slower-ball specialist" },
  { name: "Litton Das",          role: "Wicketkeeper", country: "Bangladesh",   base: 9,  initials: "LD",  speciality: "Elegant keeper-bat, aggressive opener" },
  { name: "Mehidy Hasan Miraz",  role: "All-rounder",  country: "Bangladesh",   base: 9,  initials: "MHM", speciality: "Offbreak + lower-order contributions" },
  { name: "Tanzim Hasan Sakib",  role: "Bowler",       country: "Bangladesh",   base: 8,  initials: "THS", speciality: "Right-arm pace, emerging talent" },

  // ── ZIMBABWE ─────────────────────────────────────────────────────────────
  { name: "Sikandar Raza",       role: "All-rounder",  country: "Zimbabwe",     base: 9,  initials: "SR",  speciality: "Consistent offbreak + handy bat" },
  { name: "Sean Williams",       role: "All-rounder",  country: "Zimbabwe",     base: 8,  initials: "SW",  speciality: "Left-arm spin + useful middle-order" },

  // ── IRELAND ──────────────────────────────────────────────────────────────
  { name: "Paul Stirling",       role: "All-rounder",  country: "Ireland",      base: 8,  initials: "PSt", speciality: "Explosive opener + offbreak" },
  { name: "Mark Adair",          role: "All-rounder",  country: "Ireland",      base: 7,  initials: "MAd", speciality: "Pace all-rounder, consistent performer" },
  { name: "Lorcan Tucker",       role: "Wicketkeeper", country: "Ireland",      base: 7,  initials: "LT",  speciality: "Reliable keeper-bat" },

  // ── SCOTLAND ─────────────────────────────────────────────────────────────
  { name: "Richie Berrington",   role: "All-rounder",  country: "Scotland",     base: 7,  initials: "RB",  speciality: "Scotland's captain, solid all-rounder" },
  { name: "Michael Leask",       role: "All-rounder",  country: "Scotland",     base: 6,  initials: "MLe", speciality: "Hard-hitting lower-order bat + offbreak" },

  // ── NETHERLANDS ──────────────────────────────────────────────────────────
  { name: "Bas de Leede",        role: "All-rounder",  country: "Netherlands",  base: 8,  initials: "BdL", speciality: "Medium-pace + useful bat, WC 2024 performer" },
  { name: "Scott Edwards",       role: "Wicketkeeper", country: "Netherlands",  base: 7,  initials: "SEd", speciality: "Netherlands captain, capable keeper-bat" },

  // ── NAMIBIA ──────────────────────────────────────────────────────────────
  { name: "David Wiese",         role: "All-rounder",  country: "Namibia",      base: 8,  initials: "DWi", speciality: "Reliable all-rounder, WC veteran" },
  { name: "Gerhard Erasmus",     role: "Batsman",      country: "Namibia",      base: 7,  initials: "GEr", speciality: "Namibia captain, composed batsman" },

  // ── CANADA ───────────────────────────────────────────────────────────────
  { name: "Navneet Dhaliwal",    role: "Batsman",      country: "Canada",       base: 7,  initials: "ND",  speciality: "Explosive opener, WC 2024 standout" },
  { name: "Aaron Johnson",       role: "All-rounder",  country: "Canada",       base: 6,  initials: "AJo", speciality: "Solid lower-order bat + pace" },

  // ── OMAN ─────────────────────────────────────────────────────────────────
  { name: "Aqib Ilyas",          role: "All-rounder",  country: "Oman",         base: 7,  initials: "AqI", speciality: "Attacking batsman + legspin" },
  { name: "Bilal Khan",          role: "Bowler",       country: "Oman",         base: 6,  initials: "BiK", speciality: "Experienced seam bowler" },

  // ── UGANDA ───────────────────────────────────────────────────────────────
  { name: "Brian Masaba",        role: "All-rounder",  country: "Uganda",       base: 6,  initials: "BMa", speciality: "Fast-bowling all-rounder, Uganda captain" },
  { name: "Riazat Ali Shah",     role: "Batsman",      country: "Uganda",       base: 6,  initials: "RAS", speciality: "Uganda's key batter" },

  // ── USA ──────────────────────────────────────────────────────────────────
  { name: "Monank Patel",        role: "Wicketkeeper", country: "USA",          base: 7,  initials: "MPt", speciality: "USA captain, solid keeper-bat" },
  { name: "Aaron Jones",         role: "Batsman",      country: "USA",          base: 9,  initials: "AJn", speciality: "WC 2024 hero, explosive T20 hitter" },
  { name: "Steven Taylor",       role: "Batsman",      country: "USA",          base: 8,  initials: "STa", speciality: "USA opener, hard-hitting bat" },
  { name: "Saurabh Netravalkar", role: "Bowler",       country: "USA",          base: 9,  initials: "SNe", speciality: "Left-arm pace, WC 2024 giant-killer" },
  { name: "Ali Khan",            role: "Bowler",       country: "USA",          base: 8,  initials: "AKh", speciality: "Right-arm fast, IPL-experienced" },
  { name: "Corey Anderson",      role: "All-rounder",  country: "USA",          base: 8,  initials: "CoA", speciality: "Ex-NZ, hard-hitting bat + pace" },
  { name: "Harmeet Singh",       role: "Bowler",       country: "USA",          base: 7,  initials: "HaS", speciality: "Left-arm spin specialist" },

  // ── ADDITIONAL INDIA (DOMESTIC STARS) ────────────────────────────────────
  { name: "Deepak Hooda",        role: "All-rounder",  country: "India",        base: 9,  initials: "DH",  speciality: "Powerful mid-order + offbreak" },
  { name: "Rinku Singh",         role: "Batsman",      country: "India",        base: 10, initials: "RkS", speciality: "Fearless finisher, IPL 5-sixes fame" },
  { name: "Avesh Khan",          role: "Bowler",       country: "India",        base: 9,  initials: "AvK", speciality: "Tall right-arm pacer, good variations" },
  { name: "Ravi Bishnoi",        role: "Bowler",       country: "India",        base: 9,  initials: "RvB", speciality: "Legspin + googly, T20 specialist" },
  { name: "Mayank Yadav",        role: "Bowler",       country: "India",        base: 10, initials: "MYa", speciality: "150kmph+ pace, IPL sensation" },
  { name: "Abhishek Sharma",     role: "All-rounder",  country: "India",        base: 10, initials: "AbS", speciality: "Power-hitting opener + left-arm spin" },
  { name: "Nitish Kumar Reddy",  role: "All-rounder",  country: "India",        base: 9,  initials: "NKR", speciality: "Emerging batting all-rounder" },
  { name: "Harshit Rana",        role: "Bowler",       country: "India",        base: 8,  initials: "HaR", speciality: "Tall right-arm pacer, Test debutant" },
  { name: "Varun Chakravarthy",  role: "Bowler",       country: "India",        base: 10, initials: "VCh", speciality: "Mystery spinner, T20 World Cup squad" },
  { name: "Shivam Mavi",         role: "Bowler",       country: "India",        base: 8,  initials: "ShM", speciality: "Right-arm pacer, IPL regular" },

  // ── ADDITIONAL AUSTRALIA ──────────────────────────────────────────────────
  { name: "Tim David",           role: "Batsman",      country: "Australia",    base: 11, initials: "TDa", speciality: "Massive T20 hitter, Singapore-Aus star" },
  { name: "Josh Inglis",         role: "Wicketkeeper", country: "Australia",    base: 9,  initials: "JIn", speciality: "Explosive keeper-bat, T20 regular" },
  { name: "Aaron Hardie",        role: "All-rounder",  country: "Australia",    base: 8,  initials: "AHa", speciality: "Hard-hitting bat + medium pace" },
  { name: "Sean Abbott",         role: "Bowler",       country: "Australia",    base: 8,  initials: "SeA", speciality: "Death-overs specialist right-arm pacer" },

  // ── ADDITIONAL ENGLAND ─────────────────────────────────────────────────
  { name: "Dawid Malan",         role: "Batsman",      country: "England",      base: 9,  initials: "DaM", speciality: "World-ranked T20 batter, technically sound" },
  { name: "Chris Woakes",        role: "All-rounder",  country: "England",      base: 10, initials: "ChW", speciality: "Swing + reliable lower-order bat" },
  { name: "Tom Hartley",         role: "Bowler",       country: "England",      base: 8,  initials: "ToH", speciality: "Left-arm spin, Test debut vs India" },
  { name: "Gus Atkinson",        role: "Bowler",       country: "England",      base: 10, initials: "GuA", speciality: "Right-arm seam, rapid Test debut" },
  { name: "Brydon Carse",        role: "Bowler",       country: "England",      base: 8,  initials: "BrC", speciality: "Express right-arm pacer" },
  { name: "Ben Duckett",         role: "Batsman",      country: "England",      base: 10, initials: "BDu", speciality: "Left-hand Bazball opener, aggressive bat" },

  // ── ADDITIONAL PAKISTAN ───────────────────────────────────────────────────
  { name: "Shahid Afridi",       role: "All-rounder",  country: "Pakistan",     base: 9,  initials: "ShAf", speciality: "Legend — hardest hitter, legspin great" },
  { name: "Mohammad Hafeez",     role: "All-rounder",  country: "Pakistan",     base: 8,  initials: "MHaf", speciality: "Professor — consistent offbreak + reliable bat" },
  { name: "Imad Wasim",          role: "All-rounder",  country: "Pakistan",     base: 9,  initials: "ImW", speciality: "Left-arm spin + solid lower-order bat" },
  { name: "Zaman Khan",          role: "Bowler",       country: "Pakistan",     base: 9,  initials: "ZaK", speciality: "Swing pacer, WC 2024 standout" },
  { name: "Usman Khan",          role: "Bowler",       country: "Pakistan",     base: 8,  initials: "UsK", speciality: "Right-arm express pace" },

  // ── ADDITIONAL SOUTH AFRICA ───────────────────────────────────────────────
  { name: "Rassie van der Dussen",role:"Batsman",      country: "South Africa", base: 10, initials: "RvdD",speciality: "Solid middle-order bat across formats" },
  { name: "Tristan Stubbs",      role: "Batsman",      country: "South Africa", base: 9,  initials: "TrS", speciality: "Young power-hitter, WC 2024 star" },
  { name: "Ryan Rickelton",      role: "Batsman",      country: "South Africa", base: 8,  initials: "RyR", speciality: "Emerging left-hand bat" },
  { name: "Gerald Coetzee",      role: "Bowler",       country: "South Africa", base: 9,  initials: "GCo", speciality: "Express right-arm pace, WC 2024 hero" },
  { name: "Lungi Ngidi",         role: "Bowler",       country: "South Africa", base: 10, initials: "LNg", speciality: "Right-arm pacer, IPL regular" },

  // ── ADDITIONAL WEST INDIES ───────────────────────────────────────────────
  { name: "Chris Gayle",         role: "Batsman",      country: "West Indies",  base: 10, initials: "CG",  speciality: "Universe Boss — greatest T20 opener ever" },
  { name: "Kieron Pollard",      role: "All-rounder",  country: "West Indies",  base: 10, initials: "KP",  speciality: "Muscle-bound finisher + medium-pace" },
  { name: "Roston Chase",        role: "All-rounder",  country: "West Indies",  base: 8,  initials: "RCh", speciality: "Offbreak + reliable middle-order bat" },
  { name: "Kyle Mayers",         role: "All-rounder",  country: "West Indies",  base: 10, initials: "KMy", speciality: "Explosive opener + medium pace" },
  { name: "Akeal Hosein",        role: "Bowler",       country: "West Indies",  base: 8,  initials: "AkH", speciality: "Left-arm spin, T20 specialist" },

  // ── ADDITIONAL NEW ZEALAND ────────────────────────────────────────────────
  { name: "Michael Bracewell",   role: "All-rounder",  country: "New Zealand",  base: 9,  initials: "MBr", speciality: "Offbreak + top-order bat" },
  { name: "Will Young",          role: "Batsman",      country: "New Zealand",  base: 8,  initials: "WYo", speciality: "Solid top-order right-hander" },
  { name: "Mark Chapman",        role: "Batsman",      country: "New Zealand",  base: 8,  initials: "MCh", speciality: "Left-hand middle-order bat" },
  { name: "Ben Sears",           role: "Bowler",       country: "New Zealand",  base: 8,  initials: "BeS", speciality: "Right-arm pace, T20 specialist" },
  { name: "Lockie Ferguson",     role: "Bowler",       country: "New Zealand",  base: 11, initials: "LFe", speciality: "Raw pace, 145+ kmph, IPL star" },
  { name: "Ish Sodhi",           role: "Bowler",       country: "New Zealand",  base: 8,  initials: "IsSo",speciality: "Legspin, T20 wicket-taker" },

  // ── ADDITIONAL SRI LANKA ─────────────────────────────────────────────────
  { name: "Dhananjaya de Silva", role: "All-rounder",  country: "Sri Lanka",    base: 9,  initials: "DdS", speciality: "Offbreak all-rounder, Test middle-order" },
  { name: "Angelo Mathews",      role: "All-rounder",  country: "Sri Lanka",    base: 9,  initials: "AMt", speciality: "Veteran batting all-rounder, reliable" },
  { name: "Kusal Perera",        role: "Wicketkeeper", country: "Sri Lanka",    base: 8,  initials: "KPe", speciality: "Explosive left-hand keeper-bat" },
  { name: "Asitha Fernando",     role: "Bowler",       country: "Sri Lanka",    base: 8,  initials: "AsF", speciality: "Right-arm swing pacer" },

  // ── ADDITIONAL BANGLADESH ────────────────────────────────────────────────
  { name: "Taskin Ahmed",        role: "Bowler",       country: "Bangladesh",   base: 9,  initials: "TAh", speciality: "Right-arm pace, Bangladesh's main threat" },
  { name: "Najmul Hossain Shanto",role:"Batsman",      country: "Bangladesh",   base: 9,  initials: "NHSh",speciality: "Left-hand opener, Bangladesh captain" },
  { name: "Towhid Hridoy",       role: "Batsman",      country: "Bangladesh",   base: 8,  initials: "ToHr",speciality: "Middle-order bat, T20 specialist" },
  { name: "Rishad Hossain",      role: "Bowler",       country: "Bangladesh",   base: 8,  initials: "RiHo",speciality: "Legspin, emerging T20 threat" },

  // ── ADDITIONAL AFGHANISTAN ───────────────────────────────────────────────
  { name: "Hazratullah Zazai",   role: "Batsman",      country: "Afghanistan",  base: 8,  initials: "HZa", speciality: "Explosive left-hand opener" },
  { name: "Gulbadin Naib",       role: "All-rounder",  country: "Afghanistan",  base: 8,  initials: "GNa", speciality: "Pace all-rounder, lower-order hitter" },
  { name: "Noor Ahmad",          role: "Bowler",       country: "Afghanistan",  base: 9,  initials: "NoA", speciality: "Left-arm wrist-spin, T20 sensation" },
  { name: "Fazalhaq Farooqi",    role: "Bowler",       country: "Afghanistan",  base: 9,  initials: "FaF", speciality: "Left-arm pace, swing specialist" },

  // ── IPL LEGENDS / ICONIC ─────────────────────────────────────────────────
  { name: "AB de Villiers",      role: "Batsman",      country: "South Africa", base: 18, initials: "ABd", speciality: "Greatest T20 bat ever, 360-degree legend" },
  { name: "Chris Lynn",          role: "Batsman",      country: "Australia",    base: 9,  initials: "CLy", speciality: "Massive T20 hitter, IPL classic" },
  { name: "Dwayne Bravo",        role: "All-rounder",  country: "West Indies",  base: 9,  initials: "DBr", speciality: "Death-overs master, entertainment icon" },
  { name: "Lasith Malinga",      role: "Bowler",       country: "Sri Lanka",    base: 12, initials: "LMa", speciality: "Slingy pace, greatest T20 bowler ever" },
  { name: "Dale Steyn",          role: "Bowler",       country: "South Africa", base: 13, initials: "DSt", speciality: "Greatest Test bowler of his era" },
  { name: "Muttiah Muralitharan",role: "Bowler",       country: "Sri Lanka",    base: 13, initials: "MuM", speciality: "800 Test wickets — the greatest spinner" },
  { name: "Jacques Kallis",      role: "All-rounder",  country: "South Africa", base: 14, initials: "JKa", speciality: "Greatest cricket all-rounder of all time" },
  { name: "Kumar Sangakkara",    role: "Wicketkeeper", country: "Sri Lanka",    base: 13, initials: "KSa", speciality: "Most elegant keeper-bat, 14000 Test runs" },
  { name: "Mahela Jayawardene",  role: "Batsman",      country: "Sri Lanka",    base: 12, initials: "MJa2",speciality: "Sri Lanka's greatest, 11000+ Test runs" },
  { name: "Brendon McCullum",    role: "Wicketkeeper", country: "New Zealand",  base: 11, initials: "BMc", speciality: "Most destructive WK-bat, T20 pioneer" },
  { name: "Yuvraj Singh",        role: "All-rounder",  country: "India",        base: 13, initials: "YS",  speciality: "WC 2011 hero, 6 sixes in an over legend" },
  { name: "Harbhajan Singh",     role: "Bowler",       country: "India",        base: 10, initials: "HBh", speciality: "Turbanator — off-spin legend" },
  { name: "Zaheer Khan",         role: "Bowler",       country: "India",        base: 10, initials: "ZKh", speciality: "India's greatest left-arm pace bowler" },
  { name: "VVS Laxman",          role: "Batsman",      country: "India",        base: 10, initials: "VVS", speciality: "Very Very Special — Test artistry legend" },
  { name: "Rahul Dravid",        role: "Batsman",      country: "India",        base: 12, initials: "RDr", speciality: "The Wall — technically perfect Test great" },
  { name: "Sourav Ganguly",      role: "Batsman",      country: "India",        base: 11, initials: "SoG", speciality: "Dada — transformed Indian cricket legacy" },
  { name: "Anil Kumble",         role: "Bowler",       country: "India",        base: 11, initials: "AKu", speciality: "619 Test wickets, India's greatest spinner" },
  { name: "MS Dhoni (2011)",     role: "Wicketkeeper", country: "India",        base: 17, initials: "M7",  speciality: "The helicopter shot, WC 2011 winning six" },
];

module.exports = PLAYERS;