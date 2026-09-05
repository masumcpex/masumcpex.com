/* ==========================================================================
   data.js
   এখানে সাইটের সব কনটেন্ট (বই, জার্নাল, আর্টিকেল, প্রজেক্ট) থাকবে।
   ========================================================================== */

const SITE_DATA = {

  /* ---------------- হিরো সেকশন ---------------- */
  hero: {
    photo: "https://masumcpex.github.io/masumcpex/masum.webp",
    name: "Masum Billah",
    role: "Writer • Learner • Builder",
    tagline: "Learning never stops. Build something meaningful every day.",
    ctaText: "আমার বইসমূহ দেখুন",
    ctaLink: "#library"
  },

  /* ---------------- About সেকশন ---------------- */
  about: {
    title: "আমি মাসুম",
    photo: "https://masumcpex.github.io/masumcpex/masum.png",
    paragraphs: [
      "আমি মাসুম। বই লিখতে ভালোবাসি, অনুভূতি ও জীবনের ছোট ছোট শিক্ষা ছড়িয়ে দিতে পছন্দ করি — একই সাথে স্মার্ট ওয়েব টুলস তৈরি করি।",
      "লেখালেখি আমার কাছে অনুভূতি প্রকাশের একটি অন্যতম মাধ্যম। পাশাপাশি প্রোডাক্টিভ কোডিং সলিউশন তৈরি করে জীবনকে সহজ করতে আমি পছন্দ করি।"
    ],
    stats: [
      { number: "৬টি", label: "সংরক্ষিত ই-বুক" },
      { number: "১টি", label: "কাজের ঘণ্টা ট্র্যাকার" },
      { number: "১০০%", label: "স্মার্ট ডিজাইন" }
    ]
  },

  /* ---------------- Library ---------------- */
  books: [
    {
      id: "book1",
      cover: "https://masumcpex.github.io/masumcpex/book1.webp",
      title: "যার জন্যে কাঁদি সে কাঁদার যোগ্য নয়",
      category: "অনুপ্রেরণা ও জীবন",
      description: "হৃদয়ের গল্প ও আত্মোপলব্ধির সাবলীল সমন্বয়।",
      readingTime: "31 মিনিট",
      pdfUrl: "https://drive.google.com/file/d/1ciB-tX7PDKU8ytY1Ja22iqE5_gydopoE/view?usp=drivesdk",
      readMoreUrl: "https://drive.google.com/file/d/1ciB-tX7PDKU8ytY1Ja22iqE5_gydopoE/view?usp=drivesdk",
      downloadUrl: "https://drive.google.com/uc?export=download&id=1ciB-tX7PDKU8ytY1Ja22iqE5_gydopoE",
      locked: false
    },
    {
      id: "book2",
      cover: "https://masumcpex.github.io/masumcpex/eka.jpg",
      title: "একাকিত্বের নোটবুক",
      category: "ভাবনা ও ডায়েরি",
      description: "নিঃসঙ্গতার প্রহরে ডায়েরির পাতায় আঁকা কিছু অনুভূতি।",
      readingTime: "29 মিনিট",
      pdfUrl: "https://drive.google.com/file/d/10q4PqYsGaV97mrpzry8J0h4mw94kcdlF/view?usp=drivesdk",
      readMoreUrl: "https://drive.google.com/file/d/10q4PqYsGaV97mrpzry8J0h4mw94kcdlF/view?usp=drivesdk",
      downloadUrl: "https://drive.google.com/uc?export=download&id=10q4PqYsGaV97mrpzry8J0h4mw94kcdlF",
      locked: false
    },
    {
      id: "book3",
      cover: "https://masumcpex.github.io/masumcpex/book3.webp",
      title: "ইংলিশ শেখার সহজ রোডম্যাপ",
      category: "শিক্ষা ও ক্যারিয়ার",
      description: "সহজ গাইডলাইনে ইংরেজি শেখার সম্পূর্ণ পথ রেখা।",
      readingTime: "40 মিনিট",
      pdfUrl: "https://drive.google.com/file/d/1R3BcEq1E3dPNwdVMxgIpnYkqWNMHRncv/view?usp=drivesdk",
      readMoreUrl: "https://drive.google.com/file/d/1R3BcEq1E3dPNwdVMxgIpnYkqWNMHRncv/view?usp=drivesdk",
      downloadUrl: "https://drive.google.com/uc?export=download&id=1R3BcEq1E3dPNwdVMxgIpnYkqWNMHRncv",
      locked: false
    },
    {
      id: "book4",
      cover: "https://masumcpex.github.io/masumcpex/enhlishsmart.webp",
      title: "Smart Spoken English",
      category: "ভাষা ও স্কিল",
      description: "স্মার্টলি ও অনর্গল ইংরেজি বলার প্র্যাক্টিক্যাল বই।",
      readingTime: "32 মিনিট",
      pdfUrl: "https://drive.google.com/file/d/1jCStUE4-T6l50Y1jKDI0_tAzqX-f8JZE/view?usp=drivesdk",
      readMoreUrl: "https://drive.google.com/file/d/1jCStUE4-T6l50Y1jKDI0_tAzqX-f8JZE/view?usp=drivesdk",
      downloadUrl: "https://drive.google.com/uc?export=download&id=1jCStUE4-T6l50Y1jKDI0_tAzqX-f8JZE",
      locked: false
    },
    {
      id: "book5",
      cover: "https://masumcpex.github.io/masumcpex/bookb.png",
      title: "Easy English Mastery",
      category: "ভাষা ও স্কিল",
      description: "সহজ নিয়মে ইংরেজি গ্রামার ও স্পোকেন আয়ত্ত করার গাইড।",
      readingTime: "38 মিনিট",
      pdfUrl: "https://drive.google.com/file/d/1BydwswVhKcKPrW7EPScfCyUEs6LXakN-/view?usp=drivesdk",
      readMoreUrl: "https://drive.google.com/file/d/1BydwswVhKcKPrW7EPScfCyUEs6LXakN-/view?usp=drivesdk",
      downloadUrl: "https://drive.google.com/uc?export=download&id=1BydwswVhKcKPrW7EPScfCyUEs6LXakN-",
      locked: false
    },
    {
      id: "book6",
      cover: "https://masumcpex.github.io/masumcpex/cpex.webp",
      title: "চলার পথে আমার গল্প",
      category: "ব্যক্তিগত / সংগ্রহ",
      description: "এই বইটি সবার জন্য উন্মুক্ত নয়। এটি একটি বিশেষ ব্যক্তিগত সংস্করণ।",
      readingTime: "—",
      pdfUrl: "#",
      readMoreUrl: "#",
      downloadUrl: "#",
      locked: true
    }
  ],

  /* ---------------- Journal ---------------- */
  journalCategories: ["সব", "ব্যক্তিগত গল্প", "অনুভূতি", "Daily Notes", "শেখার জার্নাল", "Life Lessons", "ভ্রমণ", "জীবন ও মানসিকতা"],

  journal: [
    {
      id: "j1",
      title: "আজকের একটি সাধারণ বিকেল",
      category: "Daily Notes",
      date: "2025-03-24",
      image: "",
      excerpt: "কিছু বিকেল থাকে যা বিশেষ কিছু না করেই মনে থেকে যায়...",
      content: "কিছু বিকেল থাকে যা বিশেষ কিছু না করেই মনে থেকে যায়। আজকের বিকেলটাও তেমন — চা, জানালার পাশে বসে থাকা, আর কিছু এলোমেলো চিন্তা।"
    },
    {
      id: "j2",
      title: "জীবন বদলানোর ৫টি ছোট কিন্তু শক্তিশালী অভ্যাস",
      category: "শেখার জার্নাল",
      date: "2025-04-23",
      readingTime: "6 মিনিট",
      image: "",
      excerpt: "জীবন বড় কোনো পরিবর্তনে নয়, বরং প্রতিদিনের ছোট ছোট অভ্যাসের মাধ্যমে বদলায়। এমন ৫টি অভ্যাস, যা গভীর ও ইতিবাচক প্রভাব ফেলবে...",
      content: `
        <div style="display:flex; flex-wrap:wrap; gap:8px; align-items:center; margin-bottom:18px;">
          <span style="font-family:'Inter',sans-serif; font-size:.7rem; letter-spacing:.08em; font-weight:700; color:#1B2A45; background:#C79A3B; padding:5px 12px; border-radius:999px; text-transform:uppercase;">শেখার জার্নাল</span>
          <span style="font-family:'Inter',sans-serif; font-size:.78rem; color:#7A6F5D;">⏱ 6 মিনিট পঠন</span>
          <span style="font-family:'Inter',sans-serif; font-size:.78rem; color:#7A6F5D;">• সর্বশেষ আপডেট: 23 April, 2025</span>
        </div>

        <p style="background:#FBF7EC; padding:16px 18px; border-left:4px solid #C79A3B; font-family:'Noto Serif Bengali',serif; font-style:italic; font-size:1.05rem; margin:0 0 22px;">"জীবন বড় কোনো পরিবর্তনে নয়, বরং প্রতিদিনের ছোট ছোট অভ্যাসের মাধ্যমে বদলায়।"</p>

        <h3 style="color:#0E6E5C; margin-top:10px;">ভূমিকা</h3>
        <p>আমরা অনেকেই ভাবি জীবন বদলাতে হলে হয়তো রাতারাতি অলৌকিক কিছু করে ফেলতে হবে — ভোর ৫টায় উঠে দৌড়াতে হবে কিংবা হাজার পৃষ্ঠার বই পড়ে শেষ করতে হবে। কিন্তু বাস্তব সত্য হলো, জীবন বড় কোনো পরিবর্তনে নয়, বরং প্রতিদিনের ছোট ছোট অভ্যাসের মাধ্যমে বদলায়। আজকে আমরা এমন ৫টি ছোট অভ্যাস নিয়ে কথা বলব, যা আপনার জীবনে এক গভীর ও ইতিবাচক প্রভাব ফেলবে।</p>

        <h3 style="color:#0E6E5C; margin-top:25px;">কেন ছোট অভ্যাস বড় পরিবর্তন আনে</h3>
        <p>বড় লক্ষ্য অনেক সময় ভয় ধরিয়ে দেয়, আর তাই শুরু করার আগেই হাল ছেড়ে দিই। কিন্তু ছোট অভ্যাস প্রতিদিন সহজে করা যায়, আর সেই ধারাবাহিকতাই দীর্ঘমেয়াদে বিশাল ফলাফল এনে দেয়।</p>

        <h3 style="color:#0E6E5C; margin-top:25px;">১. সোশ্যাল মিডিয়া ফিডকে বানিয়ে ফেলুন 'লার্নিং ফিড'</h3>
        <p>আমরা প্রতিদিন একটা বড় সময় সোশ্যাল মিডিয়ায় স্ক্রোল করে পার করি। কেমন হতো যদি এই সময়টাই আপনার শেখার মাধ্যম হয়ে উঠত?</p>
        <div style="background:#ECE2C9; border-radius:10px; padding:16px 18px; margin:16px 0;">
          <p style="margin:0 0 8px;"><strong>✅ করণীয়:</strong> এমন সব পেজ, চ্যানেল বা আইডি ফলো করুন যা আপনাকে নতুন কিছু শেখায় বা অনুপ্রাণিত করে।</p>
          <p style="margin:0;"><strong>🚫 বর্জনীয়:</strong> যেসব অ্যাকাউন্ট আপনার মানসিক শান্তি নষ্ট করে বা নেতিবাচকতা ছড়ায়, সেগুলোকে এখনই আনফলো করে দিন।</p>
        </div>

        <h3 style="color:#0E6E5C; margin-top:25px;">২. প্রতিদিন অন্তত কয়েক পৃষ্ঠা বই বা অডিও বুক শুনুন</h3>
        <p>নিয়মিত বই পড়ার অভ্যাস মানুষের মনোযোগ, চিন্তাশক্তি এবং ধৈর্য বহুগুণ বাড়িয়ে দেয়। যদি কোনো কারণে বই পড়ার সময় বা অভ্যাস না পান, তবে অডিও বুক আপনার জন্য দারুণ বিকল্প হতে পারে।</p>
        <p style="background:#FBF7EC; padding:14px 18px; border-radius:8px; margin:16px 0;"><strong>পরামর্শ:</strong> যাতায়াতের সময়, হাঁটার ফাঁকে কিংবা রাতে ঘুমানোর আগে প্রতিদিন অন্তত ১৫ মিনিট অডিও বুক বা পডকাস্ট শোনার অভ্যাস করতে পারেন। প্রতিদিনের এই ছোট্ট ১৫ মিনিটই বছরের শেষে আপনাকে অন্তত ৫ থেকে ১০টি নতুন বইয়ের মূল্যবান জ্ঞান উপহার দেবে।</p>

        <h3 style="color:#0E6E5C; margin-top:25px;">৩. কনজিউম কমিয়ে ক্রিয়েট করা বাড়িয়ে দিন</h3>
        <p>অনেকেই সারাদিন শুধু ভিডিও দেখেন বা তথ্য সংগ্রহ করেন, কিন্তু বাস্তবে কোনো অ্যাকশন নেন না। কেবল তথ্য গিললে হবে না, সেটাকে কাজে লাগাতে হবে — একটা পোস্ট লিখুন, ছোট ভিডিও বানান, বা যা শিখলেন তা অন্য কাউকে শিখিয়ে দিন।</p>
        <p style="background:#1B2A45; color:#F3ECDA; padding:18px; border-radius:8px; font-family:'Noto Serif Bengali',serif; text-align:center; margin:18px 0;">"শেখা তখনই সম্পূর্ণ হয়, যখন তা অন্যের সাথে ভাগ করা হয়।"</p>

        <h3 style="color:#0E6E5C; margin-top:25px;">৪. নিজের তুলনা অন্যের সঙ্গে নয়, গতকালকের নিজের সঙ্গে করুন</h3>
        <p>অন্যের জীবনের সাফল্যের সঙ্গে নিজের জীবনের তুলনা করলে কেবল হতাশাই বাড়বে। আপনার একমাত্র প্রতিযোগিতা হওয়া উচিত আপনার নিজের সাথে।</p>
        <div style="display:flex; gap:10px; margin:16px 0; flex-wrap:wrap;">
          <div style="flex:1; min-width:140px; background:#FBF7EC; border-radius:10px; padding:14px 16px;">
            <div style="font-family:'Inter',sans-serif; font-size:.72rem; letter-spacing:.06em; color:#7A6F5D; font-weight:700; text-transform:uppercase; margin-bottom:6px;">গতকাল</div>
            <div style="font-size:.92rem;">যা পারিনি, যেখানে আটকে ছিলাম</div>
          </div>
          <div style="flex:1; min-width:140px; background:#ECE2C9; border-radius:10px; padding:14px 16px;">
            <div style="font-family:'Inter',sans-serif; font-size:.72rem; letter-spacing:.06em; color:#0E6E5C; font-weight:700; text-transform:uppercase; margin-bottom:6px;">আজ</div>
            <div style="font-size:.92rem;">একটু বেশি ধৈর্য, একটু বেশি অগ্রগতি</div>
          </div>
        </div>

        <h3 style="color:#0E6E5C; margin-top:25px;">৫. ছোট ছোট অর্জনগুলোকে উদযাপন করতে শিখুন</h3>
        <p>আমরা সবসময় বড় সাফল্যের অপেক্ষায় থাকি এবং দৈনন্দিন ছোট ছোট অর্জনগুলোকে হেলাফেলা করি। কিন্তু বড় সাফল্য আসলে এই ছোট ছোট জয়েরই সমষ্টি।</p>
        <div style="background:#ECE2C9; border-left:4px solid #0E6E5C; border-radius:8px; padding:14px 18px; margin:16px 0;">🎉 আজকের দিনের লক্ষ্য পূরণ হলে নিজের প্রশংসা করুন — ছোট অর্জনের স্বীকৃতিই আত্মবিশ্বাস আর মনোবল বাড়ায়।</div>

        <h3 style="color:#0E6E5C; margin-top:30px;">✅ আজ থেকেই শুরু করুন</h3>
        <div style="background:#FBF7EC; border-radius:10px; padding:16px 20px; margin:14px 0;">
          <div style="padding:6px 0;">☐ Social Media পরিষ্কার</div>
          <div style="padding:6px 0;">☐ 10 মিনিট পড়া</div>
          <div style="padding:6px 0;">☐ কিছু Create করা</div>
          <div style="padding:6px 0;">☐ নিজেকে গতকালের সাথে Compare করা</div>
          <div style="padding:6px 0;">☐ ছোট অর্জন Celebrate করা</div>
        </div>

        <h3 style="color:#0E6E5C; margin-top:30px;">প্রায়শই জিজ্ঞাসিত প্রশ্ন (FAQ)</h3>
        <details style="background:#FBF7EC; border-radius:8px; padding:10px 16px; margin-bottom:8px;"><summary style="cursor:pointer; font-weight:700; color:#1B2A45;">প্রতিদিন কতক্ষণ বই পড়া উচিত?</summary><p style="margin-top:8px;">জোর করে বেশি পড়ার দরকার নেই, দিনে মাত্র ২-৩ পৃষ্ঠা দিয়ে শুরু করুন।</p></details>
        <details style="background:#FBF7EC; border-radius:8px; padding:10px 16px; margin-bottom:8px;"><summary style="cursor:pointer; font-weight:700; color:#1B2A45;">Audiobook কি বইয়ের বিকল্প?</summary><p style="margin-top:8px;">হ্যাঁ, সময় না পেলে অডিও বুক দারুণ বিকল্প — যাতায়াতের সময় বা ঘুমানোর আগে শোনা যায়।</p></details>
        <details style="background:#FBF7EC; border-radius:8px; padding:10px 16px; margin-bottom:8px;"><summary style="cursor:pointer; font-weight:700; color:#1B2A45;">Create বলতে কী বোঝায়?</summary><p style="margin-top:8px;">শুধু তথ্য গ্রহণ না করে, শেখা জিনিসটা নিজের ভাষায় প্রকাশ করা — নোট, পোস্ট বা কাউকে শিখিয়ে বলা।</p></details>
        <details style="background:#FBF7EC; border-radius:8px; padding:10px 16px; margin-bottom:8px;"><summary style="cursor:pointer; font-weight:700; color:#1B2A45;">একদিন মিস করলে কী করব?</summary><p style="margin-top:8px;">নিজেকে দোষ না দিয়ে পরের দিন থেকেই আবার শুরু করুন। ধারাবাহিকতা মানে নিখুঁত হওয়া না।</p></details>
        <details style="background:#FBF7EC; border-radius:8px; padding:10px 16px; margin-bottom:8px;"><summary style="cursor:pointer; font-weight:700; color:#1B2A45;">Social Media কীভাবে Learning Tool হবে?</summary><p style="margin-top:8px;">শিক্ষামূলক ও অনুপ্রেরণাদায়ক পেজ/চ্যানেল ফলো করে, নেতিবাচক অ্যাকাউন্ট আনফলো করে।</p></details>
        <details style="background:#FBF7EC; border-radius:8px; padding:10px 16px; margin-bottom:8px;"><summary style="cursor:pointer; font-weight:700; color:#1B2A45;">ছোট অভ্যাস সত্যিই জীবন বদলায়?</summary><p style="margin-top:8px;">হ্যাঁ — বড় পরিবর্তন আসলে অনেক ছোট, ধারাবাহিক পদক্ষেপের যোগফল।</p></details>
        <details style="background:#FBF7EC; border-radius:8px; padding:10px 16px; margin-bottom:8px;"><summary style="cursor:pointer; font-weight:700; color:#1B2A45;">এই অভ্যাসগুলো ছাত্র ও চাকরিজীবীদের জন্য উপকারী?</summary><p style="margin-top:8px;">হ্যাঁ, দুই ক্ষেত্রেই সমানভাবে কার্যকর — বয়স বা পেশা নির্বিশেষে প্রযোজ্য।</p></details>
        <details style="background:#FBF7EC; border-radius:8px; padding:10px 16px; margin-bottom:14px;"><summary style="cursor:pointer; font-weight:700; color:#1B2A45;">কীভাবে ধারাবাহিকতা বজায় রাখব?</summary><p style="margin-top:8px;">প্রতিদিন রাতে নিজের ছোট অগ্রগতি লিখে রাখুন — এটাই ধারাবাহিকতার সবচেয়ে সহজ উপায়।</p></details>

        <h3 style="color:#0E6E5C; margin-top:25px;">আজকের শিক্ষা</h3>
        <p style="background:#ECE2C9; padding:14px 18px; border-left:4px solid #C79A3B; border-radius:8px; margin:14px 0;">একসময় আমি ভাবতাম জীবন বদলাতে হলে অনেক বড় কিছু করতে হবে। কিন্তু সত্যিটা হলো, জীবন বদলায় ছোট ছোট অভ্যাসে — আর পরিবর্তনের শুরুটা হোক আজ থেকেই।</p>

        <div style="background:linear-gradient(155deg,#1B2A45,#23375B); color:#fff; border-radius:14px; padding:18px 20px; margin:20px 0;">
          <div style="font-family:'Noto Serif Bengali',serif; color:#C79A3B; font-weight:700; margin-bottom:10px;">🔑 মূল শিক্ষা</div>
          <div style="padding:4px 0;">• ছোট অভ্যাস বড় পরিবর্তন আনে</div>
          <div style="padding:4px 0;">• শেখার জন্য প্রতিদিন সময় দিন</div>
          <div style="padding:4px 0;">• Create করা শুরু করুন</div>
          <div style="padding:4px 0;">• নিজের সাথে প্রতিযোগিতা করুন</div>
          <div style="padding:4px 0;">• ছোট অর্জন উদযাপন করুন</div>
        </div>

        <p style="text-align:center; font-family:'Noto Serif Bengali',serif; font-style:italic; color:#1B2A45; font-size:1.05rem; margin:22px 0;">"জীবন একদিনে বদলায় না। কিন্তু প্রতিদিনের ছোট অভ্যাস একদিন পুরো জীবন বদলে দেয়।"</p>

        <div style="text-align:center; margin-top:20px; font-weight:bold; color:#7A6F5D; border-top:1px solid #ECE2C9; padding-top:15px;">লিখেছেন: মাসুম</div>
      `
    },
    {
      id: "j3",
      title: "জীবনের একটি ছোট শিক্ষা",
      category: "Life Lessons",
      date: "2025-05-26",
      image: "",
      excerpt: "সবকিছু পরিকল্পনা মতো হয় না — আর সেটাই মেনে নেওয়া শেখা দরকার...",
      content: "সবকিছু পরিকল্পনা মতো হয় না — আর সেটাই মেনে নেওয়া শেখা দরকার।"
    },
    {
      id: "j4",
      title: "Attention Economy: কেন ইনফ্লুয়েন্সারদের যুগে আমরা নিজেদের জীবনকে ব্যর্থ মনে করি?",
      category: "জীবন ও মানসিকতা",
      date: "2025-06-29",
      readingTime: "২২ মিনিট",
      image: "",
      excerpt: "মনোযোগই আজকের বিশ্বের সবচেয়ে দামি পণ্য। ইনফ্লুয়েন্সার কালচার, অ্যালগরিদম আর সোশ্যাল কম্পারিজন কীভাবে আমাদের নিজেদের ব্যর্থ মনে করাচ্ছে — একটি গভীর বিশ্লেষণ।",
      url: "article-attention-economy.html",
      content: ""
    },
    {
      id: "j5",
      title: "অসমাপ্ত অনুভূতির ডায়েরি",
      category: "Daily Notes",
      date: "2025-11-28",
      readingTime: "৯ মিনিট",
      image: "",
      excerpt: "ভালোবাসা, বন্ধুত্ব, কষ্ট, বিশ্বাস আর জীবনের ছোট ছোট উপলব্ধির একগুচ্ছ ভাঙা টুকরো — কিছু মুহূর্তের ডায়েরি, যা হয়তো আপনারও চেনা লাগবে।",
      url: "journal-unfinished-feelings.html",
      content: ""
    },
    {
      id: "j6",
      title: "Social Media Honey Trap: অনলাইন যৌন প্রতারণা ও ব্ল্যাকমেইলের নেপথ্য কাহিনি",
      category: "জীবন ও মানসিকতা",
      date: "2025-01-22",
      readingTime: "13 মিনিট",
      image: "",
      excerpt: "Facebook, IMO, Bigo Live-এ ছড়িয়ে থাকা ভুয়া প্রোফাইল, হানি ট্র্যাপ কৌশল, ব্ল্যাকমেইল আর প্রবাসীদের টার্গেট করার পদ্ধতি নিয়ে একটি অনুসন্ধানী প্রতিবেদন — সাথে নিরাপত্তা টিপস।",
      url: "article-honeytrap-scam.html",
      content: ""
    },
    {
      id: "j7",
      title: `<svg class="title-icon" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path d="M12 20.2s-7.2-4.4-9.6-8.7C.7 7.9 2.3 4.3 5.9 4.3c2 0 3.6 1.2 4.6 2.9 1-1.7 2.6-2.9 4.6-2.9 3.6 0 5.2 3.6 3.5 7.2-2.4 4.3-9.6 8.7-9.6 8.7z"/><path d="M13 5.5l-2.2 4 2.4 3-2.2 4"/></svg> আমার ব্যর্থ ভালোবাসার গল্প`,
      category: "ব্যক্তিগত গল্প",
      date: "2023-03-17",
      readingTime: "8-10 মিনিট",
      image: "",
      excerpt: "একটি নীরব ভালোবাসা, কিছু অপূর্ণ অপেক্ষা, আর নিজের ভেতরে লুকিয়ে রাখা অনুভূতির গল্প।",
      url: "journal-first-love-story.html",
      content: ""
    },
    {
      id: "j8",
      title: "যদি কোনোদিন মনে পড়ে...",
      category: "অনুভূতি",
      date: "2025-05-20",
      readingTime: "2 মিনিট",
      image: "",
      excerpt: "ভাগ করে নেওয়া কিছু মুহূর্ত, কিছু নীরব স্মৃতি — যা মাঝে মাঝে এখনো দরজায় কড়া নাড়ে।",
      url: "memory.html",
      content: ""
    },
    {
      id: "j9",
      title: "আজকের অনুভূতি",
      category: "অনুভূতি",
      date: "2025-05-28",
      readingTime: "2 মিনিট",
      image: "",
      excerpt: "যখন তোমাকে দেখি, তার চেয়েও বেশি দেখি — যখন তোমাকে দেখি না।",
      url: "",
      content: "যখন তোমাকে দেখি,\nতার চেয়েও বেশি দেখি—\nযখন তোমাকে দেখি না।\n\nশুকনো ফুলের মালা জানে,\nকেউ একদিন এসেছিল।\nচড়ুই পাখিরা জানে,\nআমি এখনও প্রতীক্ষায় বসে আছি।\nএলাচের দানা জানে,\nকোনো একদিন ঠোঁট আবার গন্ধময় হবে।\n\nতুমি ব্যস্ত,\nতুমি একা,\nতুমি অন্তরালে।\nতবুও ভালোবাসা\nসন্ন্যাসীর মন্ত্রের মতো\nনীরবে আমাকে ডাকে।\n\nতুমি যেখানেই থাকো,\nআমিও অপেক্ষার ঠিক সেখানেই আছি।"
    },
    {
      id: "j10",
      title: "তুমি চলে গেছ, কিন্তু আমি রবকে পেয়েছি | থাকো দূরে",
      category: "Daily Notes",
      date: "2024-11-14",
      readingTime: "৫ মিনিট",
      image: "",
      excerpt: "একটি হৃদয়ভাঙা মন থেকে রবের পথে ফিরে আসার গল্প।",
      url: "",
      content: `
        <div class="lyric-section lyric-section--soft">
          <p>কিছু মানুষ চলে যায়…
কিন্তু তাদের রেখে যাওয়া স্মৃতিগুলো
সহজে চলে যায় না।</p>
          <p>কিছু ক্ষত শুকিয়ে যায়…
কিন্তু দাগ থেকে যায় হৃদয়ে।</p>
          <p>তবুও একদিন
মানুষ নিজের রবের কাছে ফিরে আসে…</p>
          <p>আর তখন সে বলে—</p>
          <p>থাকো দূরে…</p>
        </div>

        <div class="lyric-section lyric-section--chorus">
          <p>তুমি চলে গেছ,
ক্ষত দিয়ে গেছ,
হৃদয় ভেঙে চুরমার করেছ—</p>
          <p>এখন আর মনে পড়ো না,
থাকো দূরে।</p>
          <p>শতবার হৃদয় ভেঙেছ তুমি,
আবার কেন কষ্ট দাও?</p>
          <p>পুরোনো ক্ষত আর জাগিয়ো না—
থাকো দূরে।</p>
        </div>

        <div class="lyric-section">
          <p>ভালোবাসার সেই দিনগুলোতে
তোমার সব আবদার মেনে নিয়েছিলাম।</p>
          <p>তোমাকে মানানোর জন্য
চোখের জল ফেলেছিলাম,
হাত জোড় করেছিলাম,</p>
          <p>এমনকি তোমার পায়ের কাছেও
নিজেকে নত করেছিলাম।</p>
          <p>ভাবতাম—
ভালোবাসা বুঝি এমনই হয়,
নিজেকে হারিয়ে
অন্য কাউকে পাওয়ার নামই বুঝি ভালোবাসা।</p>
          <p>কিন্তু সময় আমাকে শিখিয়েছে—
যে ভালোবাসা মানুষকে
নিজের রব থেকে দূরে সরিয়ে দেয়,
সে ভালোবাসা নয়,
সে এক পরীক্ষা।</p>
        </div>

        <div class="lyric-section">
          <p>তুমি চলে গেছ,
মুখ ফিরিয়ে নিয়েছ।</p>
          <p>আর আমি?</p>
          <p>আমি ধীরে ধীরে
নিজের কাছে ফিরে এসেছি।</p>
          <p>যে হৃদয় তোমার জন্য কেঁদেছিল,
আজ সেই হৃদয়
তার রবের জন্য কাঁদতে শিখেছে।</p>
        </div>

        <div class="lyric-section lyric-section--chorus">
          <p>তুমি চলে গেছ,
ক্ষত দিয়ে গেছ,
হৃদয় ভেঙে চুরমার করেছ—</p>
          <p>এখন আর মনে পড়ো না,
থাকো দূরে।</p>
          <p>শতবার হৃদয় ভেঙেছ তুমি,
আবার কেন কষ্ট দাও?</p>
          <p>এই হৃদয় এবার জেগে উঠেছে—
থাকো দূরে।</p>
        </div>

        <div class="lyric-section">
          <p>তুমি কি জানো,
বিচ্ছেদের সেই রাতগুলো
আমরা কীভাবে কাটিয়েছি?</p>
          <p>তোমার স্মৃতির ভারে
কত রাত
আমাদের চোখে ঘুম আসেনি।</p>
          <p>তুমি কি জানো,
তোমাকে ছাড়া
কীভাবে ঈদ কেটেছে?</p>
          <p>চারপাশে ছিল
উৎসবের আলো,
আর হৃদয়ের ভেতর
ছিল নিঃশব্দ অন্ধকার।</p>
          <p>কেউ দেখেনি
চোখের আড়ালে লুকিয়ে থাকা কান্না।</p>
          <p>কেউ জানেনি
একটা ভাঙা হৃদয়
কতটা নীরবে ভেঙে পড়ে।</p>
        </div>

        <div class="lyric-section lyric-section--bridge">
          <p>কিন্তু সেই রাতগুলোও
একদিন শেষ হয়েছে।</p>
          <p>যে কষ্ট মনে হয়েছিল
কখনো শেষ হবে না—</p>
          <p>সেটাও পেরিয়ে এসেছি।</p>
          <p>তাই পুরোনো দরজা
আর খুলে দিও না।</p>
          <p>পুরোনো স্বপ্ন
আর দেখিয়ো না।</p>
          <p>আবার নতুন করে
কাঁদিয়ো না—</p>
          <p>থাকো দূরে।</p>
        </div>

        <div class="lyric-section lyric-section--chorus">
          <p>থাকো দূরে…
হ্যাঁ, এবার থাকো দূরে।</p>
          <p>যে হৃদয় একবার ভেঙেছ,
তাকে আর ভেঙো না।</p>
          <p>যে চোখ একদিন কেঁদেছে,
সেই চোখে আর
মিথ্যা স্বপ্ন এঁকো না।</p>
          <p>আমরা বদলে গেছি—
থাকো দূরে।</p>
        </div>

        <div class="lyric-section">
          <p>এই পৃথিবীর এখন
আর কোনো মজনুর প্রয়োজন নেই।</p>
          <p>প্রয়োজন এমন মানুষের,
যারা সত্যকে ভালোবাসে,
যারা দ্বীনের পথে দাঁড়ায়,
যারা উম্মাহর জন্য
নিজেকে উৎসর্গ করে।</p>
          <p>এই জাতির প্রয়োজন
জ্ঞানী ও নিবেদিত খাদেমদের।</p>
          <p>কাশ্মীরের বিধ্বস্ত বাগানগুলো
আজও যেন অপেক্ষা করে
সাহসী মানুষের পদচিহ্নের।</p>
          <p>আমার নিজের দেশেও
প্রয়োজন ন্যায়ের কণ্ঠ,
প্রয়োজন ফারুকের মতো
ন্যায়পরায়ণ নেতৃত্ব।</p>
          <p>সময়ের এই রক্তাক্ত দৃশ্য থেকে
চোখ ফিরিয়ে রেখো না।</p>
          <p>খালিদের অনুসারীদের
আবার মজনুর পথে
নিয়ে যেয়ো না।</p>
        </div>

        <div class="lyric-section lyric-section--bridge">
          <p>আমরা প্রেমের গল্প থেকে
এখন শিক্ষা নিয়েছি।</p>
          <p>আমরা বুঝেছি—</p>
          <p>মানুষের ভালোবাসা
ক্ষণস্থায়ী হতে পারে,</p>
          <p>কিন্তু আল্লাহর রহমত
কখনো শেষ হয় না।</p>
          <p>মানুষ মুখ ফিরিয়ে নিতে পারে,</p>
          <p>কিন্তু রবের দরজা
কখনো বন্ধ হয় না।</p>
        </div>

        <div class="lyric-section">
          <p>দুনিয়ার ক্ষণস্থায়ী সৌন্দর্যের
মায়াজালে জড়িয়ে পড়া
আমরা ছেড়ে দিয়েছি।</p>
          <p>হৃদয়ের রাজ্যে
যেসব মূর্তি, মোহ
আর মিথ্যা উপাস্য
জায়গা করে নিয়েছিল—</p>
          <p>সব ভেঙে দিয়েছি।</p>
          <p>এখন কুরআনকে
বুকে ধারণ করেছি।</p>
          <p>নিজেদের পথ
বদলে নিয়েছি।</p>
          <p>দুনিয়ার মোহ থেকে মুখ ফিরিয়ে
হৃদয়ের সম্পর্ক
এখন আমাদের রবের সঙ্গে।</p>
        </div>

        <div class="lyric-section">
          <p>তাই এই সৌন্দর্যের জাদু
আর আমাদের ওপর চালিয়ো না।</p>
          <p>যে পথ হৃদয়কে অন্ধ করে,
সে পথে আর ডেকো না।</p>
          <p>যে মোহ রবকে ভুলিয়ে দেয়,
সে মোহ আর চাই না।</p>
          <p>থাকো দূরে…</p>
        </div>

        <div class="lyric-section lyric-section--chorus">
          <p>তুমি চলে গেছ,
ক্ষত দিয়ে গেছ,
হৃদয় ভেঙে চুরমার করেছ—</p>
          <p>এখন আর মনে পড়ো না,
থাকো দূরে।</p>
          <p>শতবার হৃদয় ভেঙেছ তুমি,
আবার কেন কষ্ট দাও?</p>
          <p>এই হৃদয় এবার
তার রবকে খুঁজে পেয়েছে—
থাকো দূরে।</p>
        </div>

        <div class="lyric-section">
          <p>ভালোবাসার নামে
হাজার হাজার প্রতারণার শিকার হয়েছি।</p>
          <p>কাঁটা তো কাঁটাই,
কিন্তু কখনো কখনো
ফুল থেকেও ক্ষত পেয়েছি।</p>
          <p>পরের অত্যাচারে জর্জরিত হয়েছি,
আবার আপনজনের আঘাতেও
নিঃশব্দে ভেঙে পড়েছি।</p>
          <p>ক্ষত-বিক্ষত এই হৃদয়
আজ অনেক কিছু বুঝে গেছে।</p>
          <p>যে পথে একদিন
নিজেদের হারিয়েছিলাম,
সেই পথে আর ফিরব না।</p>
          <p>মাসুমকে আর
প্রেম আর বিশ্বস্ততার গল্প শুনিও না।</p>
          <p>কারণ এবার—</p>
          <p>হৃদয়টা মানুষের জন্য নয়,
হৃদয়টা তার রবের জন্য।</p>
        </div>

        <div class="lyric-section lyric-section--bridge">
          <p>যদি আবার ফিরে আসো—</p>
          <p>আমাকে আর আগের মতো পাবে না।</p>
          <p>যে মানুষ তোমার জন্য
রাত জেগে কেঁদেছিল,</p>
          <p>সে মানুষ আজ
সিজদায় শান্তি খুঁজে পায়।</p>
          <p>যে হৃদয় তোমার কাছে
ভালোবাসা চেয়েছিল,</p>
          <p>সে হৃদয় আজ
তার রবের কাছে
রহমত চায়।</p>
          <p>তাই ফিরে এসো না…</p>
          <p>পুরোনো গল্প নিয়ে এসো না…</p>
          <p>আমাকে আবার
সেই অন্ধকারে ডেকো না।</p>
        </div>

        <div class="lyric-section lyric-section--chorus">
          <p>তুমি চলে গেছ,
ক্ষত দিয়ে গেছ,
হৃদয় ভেঙে চুরমার করেছ—</p>
          <p>এখন আর মনে পড়ো না,
থাকো দূরে।</p>
          <p>শতবার হৃদয় ভেঙেছ তুমি,
আবার কেন কষ্ট দাও?</p>
          <p>আমরা সেই রাত পেরিয়ে এসেছি—
থাকো দূরে।</p>
          <p>দুনিয়ার মোহ পেরিয়ে এসেছি—
থাকো দূরে।</p>
          <p>রবের পথে ফিরে এসেছি—
থাকো দূরে।</p>
          <p>পুরোনো প্রেমের গল্প নিয়ে
আর ফিরে এসো না—</p>
          <p>থাকো দূরে…
থাকো দূরে…
থাকো দূরে…</p>
        </div>

        <div class="lyric-section lyric-section--soft">
          <p>কিছু মানুষকে ভুলে যাওয়া যায় না…</p>
          <p>তাদের শুধু
আল্লাহর কাছে সোপর্দ করে দিতে হয়।</p>
          <p>যা হারিয়েছি—
হয়তো তা আমার জন্য ছিল না।</p>
          <p>আর যা আমার রব রেখেছেন—
তা আমার কাছ থেকে
কেউ কেড়ে নিতে পারবে না।</p>
          <p>তাই আজ আর কোনো অভিযোগ নেই…</p>
          <p>কোনো অপেক্ষা নেই…</p>
          <p>শুধু একটাই কথা—</p>
          <p>থাকো দূরে।</p>
          <p>আর আমার হৃদয়কে
তার রবের কাছেই থাকতে দাও।</p>
        </div>
      `
    },
    {
      id: "j11",
      title: "মুখে দাবি করি ভালোবাসার, কিন্তু হৃদয়ে নেই তার প্রমাণ | ভালোবাসার সত্যতা",
      category: "Daily Notes",
      date: "2025-01-22",
      readingTime: "৩ মিনিট",
      image: "",
      excerpt: "মুখের দাবি আর হৃদয়ের সত্যতার মধ্যে যে ফারাক, রবের প্রতি ভালোবাসাকে নিজের কাছেই প্রশ্ন করার একটি উপলব্ধি।",
      url: "",
      content: `
        <div class="lyric-section lyric-section--soft">
          <p>মানুষ বলে, সত্যিকারের ভালোবাসা
হৃদয়ের ভেতর লুকিয়ে রাখা যায় না।</p>
          <p>কখনো তা চোখের ভাষায় প্রকাশ পায়,
কখনো আচরণে, কখনো ত্যাগে।</p>
        </div>

        <div class="lyric-section">
          <p>তাহলে হে আমার রব—
আপনার প্রতি যে ভালোবাসার দাবি করি,
সেই ভালোবাসার প্রমাণ কোথায়?</p>
          <p>যদি আপনাকেই ভালোবাসি,
তবে কেন আমার চোখে তার ছাপ নেই?</p>
        </div>

        <div class="lyric-section">
          <p>কেন আপনার স্মরণে হৃদয় কেঁপে ওঠে না?
কেন আপনার জন্য রাতগুলো
অশ্রুতে ভিজে যায় না?</p>
          <p>আপনার সন্তুষ্টির জন্য
কেন নিজের ইচ্ছাগুলো ত্যাগ করতে কষ্ট হয়?
কেন আপনার পথে চলতে গেলে
দুনিয়ার মোহ আমাকে বারবার টেনে ধরে?</p>
        </div>

        <div class="lyric-section lyric-section--bridge">
          <p>তবুও আমরা কত সহজেই বলি—
"আমরা তো আল্লাহকে ভালোবাসি।"</p>
          <p>কী আশ্চর্য!
ভালোবাসার দাবি আছে,
কিন্তু ভালোবাসার ত্যাগ কোথায়?</p>
          <p>আমরা মুখে ভালোবাসার কথা বলি,
কিন্তু জীবন দিয়ে তার সাক্ষ্য দিতে
কতটুকুই বা প্রস্তুত?</p>
        </div>

        <div class="lyric-section">
          <p>একদিন যখন নিজের দাবির সামনে
নিজেকেই দাঁড় করাতে হলো,
তখন বুকের ভেতরটা কেঁপে উঠল।</p>
          <p>চোখের কোণে জমে থাকা অশ্রু
নীরবে বলে দিল—
ভালোবাসা শুধু মুখের কথা নয়।</p>
        </div>

        <div class="lyric-section lyric-section--chorus">
          <p>ভালোবাসা হলো আত্মসমর্পণ।
ভালোবাসা হলো ত্যাগ।</p>
          <p>ভালোবাসা হলো রবের জন্য
নিজেকে বদলে ফেলা।</p>
        </div>

        <div class="lyric-section">
          <p>তখন বুঝলাম—
মানুষের ভালোবাসার সত্যতা
কথায় নয়, কাজে প্রকাশ পায়।</p>
          <p>আর রবের প্রতি ভালোবাসার সত্যতা
প্রকাশ পায় তখনই,
যখন তাঁর সন্তুষ্টিকে
নিজের ইচ্ছার ওপরে স্থান দিতে পারি।</p>
        </div>

        <div class="lyric-section lyric-section--soft">
          <p>হে আল্লাহ,
আমাদের ভালোবাসার দাবি নয়—
আমাদের ভালোবাসাকে সত্য করে দিন।</p>
        </div>
      `
    },
    {
      id: "j12",
      title: "পুরোনো প্রেমের সুর তুলে আর ডেকো না, সাহস নিয়ে দাঁড়াই | দূরে থাকো",
      category: "Daily Notes",
      date: "2025-03-09",
      readingTime: "৪ মিনিট",
      image: "",
      excerpt: "ভাঙা হৃদয়ের নীরবতা পেরিয়ে সাহস আর আত্মমর্যাদা নিয়ে সামনে এগিয়ে যাওয়ার একটি গল্প।",
      url: "",
      content: `
        <div class="lyric-section lyric-section--soft">
          <p>ফিরে এসো না
প্রেমের পুরোনো সুর তুলে
আবার হৃদয় ছুঁয়ো না,</p>
          <p>ভাঙা স্বপ্নের দরজা খুলে
আমাকে আর ডেকো না।</p>
        </div>

        <div class="lyric-section">
          <p>যে পথ একদিন কাঁদিয়েছে,
সে পথে ফিরতে চাই না,
মায়ার কোনো মধুর কথায়
আবার নিজেকে হারাতে চাই না।</p>
          <p>এখন আর প্রেমের গল্প নয়,
এখন প্রয়োজন জেগে থাকা।
চারদিকে যখন ঝড়ের হাওয়া,
তখন চাই সাহস নিয়ে দাঁড়ানো।</p>
        </div>

        <div class="lyric-section lyric-section--chorus">
          <p>তোমার কথার মায়াবী আলো
এখন আর টানে না,
চোখের তারার উপমা দিয়ে
পুরোনো আগুন জ্বালিও না।</p>
          <p>মিথ্যে আশার ফুল ফুটিয়ে
আমার পথ ভরিয়ে দিও না,
যে হৃদয় অনেক কেঁদেছে আগে
তাকে আবার কাঁদিয়ো না।</p>
        </div>

        <div class="lyric-section lyric-section--bridge">
          <p>আমরা খুঁজছি এমন মানুষ,
যাদের বুকে সাহস আছে,
যারা বিপদের সামনে দাঁড়িয়ে
সত্যের পক্ষে কথা বলে।</p>
          <p>রূপকথার সেই প্রেম নয়,
এখন চাই দৃঢ়তা;
নিভে যাওয়া প্রদীপ নয়,
জ্বলে উঠুক আত্মমর্যাদা।</p>
          <p>চারপাশ জুড়ে অস্থিরতা,
ভয়ের ছায়া ঘনিয়ে আসে,
আগামী দিনের কী অপেক্ষা—
কেউ জানে না, কেউ বলতে পারে না।</p>
        </div>

        <div class="lyric-section">
          <p>তাই ভাঙা হৃদয়ে
আর নতুন বোঝা চাপিও না,
ভালোবাসার নামে এসে
আমার শান্তিটুকু কেড়ে নিও না।</p>
          <p>একদিন তুমি ছিলে
আমার হৃদয়ের সবচেয়ে কাছে,
আজ সেই হৃদয় শিখেছে—
সব সম্পর্ক ধরে রাখতে হয় না।</p>
        </div>

        <div class="lyric-section lyric-section--chorus">
          <p>তাই ফিরে এসে
পুরোনো স্বপ্ন দেখিয়ো না,
নির্জন হৃদয়ের উঠোনে
আবার মায়ার ফুল ফুটিয়ো না।</p>
          <p>যা চলে গেছে, চলে যাক—
আমরা সামনে এগিয়ে যাব।
অশ্রু নয়, সাহস নিয়ে
নতুন দিনের পথ ধরব।</p>
        </div>

        <div class="lyric-section lyric-section--soft">
          <p>প্রেমের সেই পুরোনো সুরে
আর আমাকে ডেকো না,
ভাঙা হৃদয়ের নীরবতাকে
আবার অশান্ত করো না।</p>
          <p>দূরে থাকো—
এবার সত্যিই দূরে থাকো।</p>
        </div>
      `
    },
    {
      id: "j13",
      title: `<svg class="title-icon" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path d="M20.5 14.5A8.5 8.5 0 1 1 9.5 3.3a7 7 0 0 0 11 11.2z"/></svg> আমার প্রিয়, তুমি কোথায়?`,
      category: "Daily Notes",
      date: "2025-04-17",
      readingTime: "৩ মিনিট",
      image: "",
      excerpt: "রাতের পর রাত স্মৃতিতে কেটে যাওয়া এক ব্যাকুল হৃদয়ের গজল, যেখানে প্রার্থনাও প্রিয়জনের নামেই বাঁধা।",
      url: "",
      content: `
        <div class="lyric-section lyric-section--soft">
          <p>আমার প্রিয়, তুমি কোথায়?
তোমাকেই তো মনে করি,
ফিরে এসো আবার—
আজও তোমার পথ চেয়ে থাকি।</p>
        </div>

        <div class="lyric-section">
          <p>তোমার স্মৃতিতে
আমাদের অবস্থা আজ এমন হয়েছে—
তুমি ছাড়া ঝরে পড়া
এই অশ্রুগুলোও যেন
শুধু তোমার নামই লিখে যায়।</p>
          <p>আমার এই নিষ্পাপ হৃদয়
আজও তোমার জন্য ব্যাকুল,
কখনো অস্থির, কখনো অশান্ত।</p>
        </div>

        <div class="lyric-section lyric-section--chorus">
          <p>যখনই এই হৃদয়ের পাতায়
তোমার নাম লিখি,
মনে হয়—
সেই নামের ভেতরেই
লুকিয়ে আছে আমার সমস্ত অনুভূতি।</p>
          <p>চোখ দুটো অশ্রুসিক্ত হয়ে যায়,
আকাশটাও যেন থমকে দাঁড়ায়।</p>
        </div>

        <div class="lyric-section">
          <p>যখনই ভালোবাসার বই খুলে
পুরোনো পাতাগুলো পড়ি,
প্রতিটি অক্ষরের মাঝে
তোমাকেই খুঁজে পাই।</p>
        </div>

        <div class="lyric-section lyric-section--bridge">
          <p>জুলেখার মতো
এমন ব্যাকুলতা যদি আমারও থাকত,
আর আমি যদি ইউসুফের মতো
সৌন্দর্যের অধিকারী হতাম!</p>
          <p>তবুও তোমাকে পাওয়ার আশায়
আমি আমার রবের কাছেই
তোমাকেই প্রার্থনা করি।</p>
        </div>

        <div class="lyric-section lyric-section--soft">
          <p>আমি আজ ভীষণ অসহায়,
ব্যথায় জর্জরিত—
একবার শুধু আমার খবর নিও।</p>
          <p>প্রতিটি রাত
তোমার স্মৃতিতে কেটে যায়,
আর প্রতিটি রাতে
তোমাকে নিয়ে একটি করে গজল লিখে
নীরবে কেঁদে যাই।</p>
        </div>
      `
    },
    {
      id: "j14",
      title: "অশ্রু ঝরার পর বুঝেছি",
      category: "Daily Notes",
      date: "2025-06-02",
      readingTime: "৪ মিনিট",
      image: "",
      excerpt: "চোখের জল, ভাঙা বিশ্বাস আর নীরবে বয়ে যাওয়া ব্যথা থেকে ভালোবাসার আসল অর্থ খুঁজে পাওয়ার একটি উপলব্ধি।",
      url: "",
      content: `
        <div class="lyric-section lyric-section--soft">
          <p>চোখ থেকে অশ্রু ঝরার পর বুঝেছি,
প্রেম যখন হৃদয়ে ব্যথা জাগায়—
তখনই বুঝেছি ভালোবাসার আসল অর্থ।</p>
          <p>আমার কষ্টটা বোঝার জন্য
কেউ যেন প্রস্তুত নয়,
সবাই যেন নিজের স্বার্থের পূজারি—
আপন বলে ডাকার মতো
সত্যিকারের মানুষ কোথায়?</p>
          <p>এই দুনিয়ায় কে আপন,
আর কে-ই বা পর—
তা বুঝতে পারিনি আগে।
যেদিন বিপদের সময়
কাউকে পাশে থাকার জন্য ডাকলাম,
সেদিনই সব বুঝে গেলাম।</p>
        </div>

        <div class="lyric-section">
          <p>ভালোবাসার পাতায়
আমি ঢেলে দিয়েছি হৃদয়ের রক্ত,
মনের গভীরে জমে থাকা অনুভূতিগুলোকে
শব্দের মালায় গেঁথেছি।</p>
          <p>দীর্ঘদিনের ভালোবাসাকে
কীভাবে বিসর্জন দিতে হয়—
তা সেদিন বুঝলাম,
যেদিন নিজের হাতে
ভালোবাসার চিঠিটাই পুড়িয়ে ফেললাম।</p>
        </div>

        <div class="lyric-section">
          <p>হয়তো হৃদয়ের সব ব্যথা
লুকিয়ে রাখাই ভালো ছিল,
হয়তো মনের গোপন কথাগুলো
কাউকে না বলাই ভালো ছিল।</p>
          <p>কারণ হৃদয়ের যন্ত্রণা
শব্দে প্রকাশ করা কত কঠিন!</p>
          <p>যেদিন নিজের দুঃখের কথা
কারও কাছে খুলে বললাম,
সেদিনই বুঝলাম—
কিছু ব্যথা নীরবে বয়ে যাওয়াই সহজ।</p>
        </div>

        <div class="lyric-section">
          <p>মানুষ কত অকারণেই
ভালোবাসার পথে হারিয়ে থাকে,
কত মানুষ আবার
অকারণে নিজের জীবনটাকেও
বাজি রেখে দেয়।</p>
          <p>কিন্তু প্রেমের সব স্বপ্নের
সবসময় কোনো বাস্তব পরিণতি থাকে না।</p>
          <p>নিজের চোখে যখন
ভালোবাসার একটি স্বপ্ন সাজালাম,
তারপর সেই স্বপ্নের অর্থ খুঁজতে গিয়ে—
তখনই বুঝলাম
স্বপ্ন আর বাস্তবতা কত আলাদা।</p>
        </div>

        <div class="lyric-section lyric-section--bridge">
          <p>ভালোবাসার পথকে
কখনো সহজ ভেবো না।</p>
          <p>এই প্রেমের পথ
রাজাদের হাতেও ভিক্ষার পাত্র তুলে দিতে পারে,
ক্ষমতাবান মানুষকেও
অসহায় করে দিতে পারে।</p>
          <p>ভালোবাসার পথ কখনোই সহজ নয়।</p>
          <p>এই পথের কঠিন সত্যগুলো
একজন পথিক এসে আমাকে বলেছিল—
আর তখনই বুঝলাম,
ভালোবাসার পথ আসলে কেমন।</p>
        </div>

        <div class="lyric-section lyric-section--chorus">
          <p>চোখ থেকে অশ্রু ঝরার পর বুঝেছি,
প্রেম যখন হৃদয়ে ব্যথা জাগায়—
তখনই বুঝেছি।</p>
          <p>ভালোবাসার সত্যিকারের ব্যথা
নিজের হৃদয়ে অনুভব করার পরই
তার অর্থ বোঝা যায়।</p>
        </div>
      `
    },
    {
      id: "j15",
      title: `<svg class="title-icon" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path d="M4 20c0-9 7-16 16-16 0 9-7 16-16 16zM4 20c3-4 7-7 12-9"/></svg> খুঁজেও যখন আপনজন মেলে না`,
      category: "Daily Notes",
      date: "2025-08-19",
      readingTime: "৫ মিনিট",
      image: "",
      excerpt: "খুঁজেছি, দিয়েছি, সহ্য করেছি, অপেক্ষা করেছি—তবু মনের মতো মানুষ, ভালোবাসা আর বিশ্বাস না পাওয়ার এক নীরব উপলব্ধি।",
      url: "",
      content: `
        <div class="lyric-section lyric-section--soft">
          <p>খুঁজেও যখন দুঃখ ভাগ করে নেওয়ার মতো কাউকে পেলাম না—
তখন আর কী-ই বা করার থাকে?
ভালোবাসা দিয়েও যখন ভালোবাসা ফিরে পেলাম না—
তখন আর কী-ই বা করার থাকে?</p>
        </div>

        <div class="lyric-section">
          <p>অহংকার আর আত্মমর্যাদার দ্বন্দ্বে
দুই পক্ষের মাঝে কত দূরত্ব তৈরি হয়,
তাদের মাঝখানে ভালোবাসার কোনো সেতু না থাকলে—
তখন আর কী-ই বা করার থাকে?</p>
          <p>ভেবেছিলাম একজন সম্মানিত বন্ধুকে পাব,
কিন্তু ভাগ্যে জুটল যেন এক খেলোয়াড়ের মতো মানুষ।
যে বন্ধুত্বে মর্যাদা আর সম্মান খুঁজেছিলাম,
সেই আপন মানুষটিকে যখন পেলাম না—
তখন আর কী-ই বা করার থাকে?</p>
        </div>

        <div class="lyric-section">
          <p>শত সংঘাত সহ্য করেও
আমরা নিজের দেশ ছেড়ে যাইনি।
তবু যখন আপনজনদের কাছ থেকেই
ভালোবাসা পেলাম না—
তখন আর কী-ই বা করার থাকে?</p>
          <p>অত্যাচারের তরবারির ছায়ার নিচেও
আমরা নিজেদের স্বাধীন ভাবতে শিখেছি।
কিন্তু নতুন বসন্তের সেই আনন্দ,
সেই কাঙ্ক্ষিত উৎসব যখন পেলাম না—
তখন আর কী-ই বা করার থাকে?</p>
        </div>

        <div class="lyric-section">
          <p>সূর্য কিংবা চাঁদের আলো
কখনো আমাদের চাওয়া ছিল না,
এমনকি ধার করা জোনাকির আলোও
যখন ভাগ্যে জুটল না—
তখন আর কী-ই বা করার থাকে?</p>
          <p>হাজার চেষ্টা করেও
যখন তারা আমাদের কথা স্বীকার করল না,
সম্পর্কগুলোকে আগলে রাখার মতো
বিশ্বস্ত মানুষ যখন পেলাম না—
তখন আর কী-ই বা করার থাকে?</p>
          <p>আনন্দের সন্ধানে বেরিয়েছিলাম,
শহর থেকে শহরে ঘুরেছি।
হাজার চেষ্টা করেও
যখন সেই আনন্দের দেখা পেলাম না—
তখন আর কী-ই বা করার থাকে?</p>
        </div>

        <div class="lyric-section lyric-section--bridge">
          <p>সাবার কোনো খবর পাওয়ার জন্য
লক্ষবার চেষ্টা করেছি,
তবুও যখন সেই কাঙ্ক্ষিত সঙ্গীকে
খুঁজে পেলাম না—
তখন আর কী-ই বা করার থাকে?</p>
          <p>ইরশাদ হয়তো
লক্ষবার নিজের জীবন নিঃশেষ করে চেষ্টা করেছে,
কিন্তু যখন গালিবের মতো
অটুট বিশ্বাস অর্জন করতে পারল না—
তখন আর কী-ই বা করার থাকে?</p>
        </div>

        <div class="lyric-section lyric-section--soft">
          <p>খুঁজেছি, দিয়েছি, সহ্য করেছি, অপেক্ষা করেছি—
তবু যখন মনের মতো মানুষ, ভালোবাসা আর বিশ্বাস পেলাম না,
তখন হয়তো মেনে নেওয়া ছাড়া
আর কিছুই করার থাকে না।</p>
        </div>
      `
    },
    {
      id: "j16",
      title: `<svg class="title-icon" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path d="M20.5 14.5A8.5 8.5 0 1 1 9.5 3.3a7 7 0 0 0 11 11.2z"/></svg> তুমি যদি একদিন দূরে চলে যাও`,
      category: "Daily Notes",
      date: "2025-10-05",
      readingTime: "২ মিনিট",
      image: "",
      excerpt: "বিশ্বাস, বিষণ্ণতা আর সময়ের সঙ্গে বদলে যাওয়া মানুষ নিয়ে ছোট্ট একটি উপলব্ধি।",
      url: "",
      content: `
        <div class="lyric-section lyric-section--soft">
          <p>তুমিও যদি একদিন
আমার কাছ থেকে দূরে চলে যাও,
তবুও তোমার স্মৃতিগুলো
হয়তো থেকে যাবে হৃদয়ের গভীরে।</p>
        </div>

        <div class="lyric-section">
          <p>হে প্রিয়া রাহিমা,
যেদিন তোমার মদের আসর খুলবে,
সেদিন আমি আবার ফিরে আসব—
পুরোনো সেই পেয়ালায়
আমার বিষণ্ণতা ডুবিয়ে দিতে।</p>
        </div>

        <div class="lyric-section lyric-section--bridge">
          <p>যে মানুষটিকে আজ
এতটা বিশ্বস্ত মনে হচ্ছে,
হে প্রিয় রাহিমা, মনে রেখো—
একদিন না একদিন
সেই মানুষটিও হয়তো
অবিশ্বস্ত হয়ে যাবে।</p>
        </div>

        <div class="lyric-section lyric-section--soft">
          <p>মানুষ বদলে যায়,
সময় বদলে যায়—
কিন্তু কিছু স্মৃতি
হৃদয়ের ভেতর থেকে যায়।</p>
        </div>
      `
    },
    {
      id: "j17",
      title: `<svg class="title-icon" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path d="M12 20.2s-7.2-4.4-9.6-8.7C.7 7.9 2.3 4.3 5.9 4.3c2 0 3.6 1.2 4.6 2.9 1-1.7 2.6-2.9 4.6-2.9 3.6 0 5.2 3.6 3.5 7.2-2.4 4.3-9.6 8.7-9.6 8.7z"/></svg> ফিরে এসো`,
      category: "Daily Notes",
      date: "2025-12-06",
      readingTime: "৪ মিনিট",
      image: "",
      excerpt: "নীরব হৃদয়ের এক দীর্ঘ অপেক্ষা, আর ফিরে আসার জন্য একটি নিঃশব্দ আহ্বান।",
      url: "",
      content: `
        <div class="lyric-section lyric-section--soft">
          <p>কোথায় আছো তুমি?
একবার ফিরে এসো—
এই হৃদয় আজও
তোমার অপেক্ষায় আছে।</p>
        </div>

        <div class="lyric-section">
          <p>দুনিয়ার হাজার কোলাহলে
যখন মনটা ভয় পেয়ে যায়,
তখন অজান্তেই হৃদয়
তোমাকেই খুঁজে বেড়ায়।</p>
          <p>তোমার নীরব দূরত্ব
কখনো কখনো অসহ্য হয়ে ওঠে।
একবার ভেবে দেখো—
ভালোবাসা কি শুধু কাছে থাকা,
নাকি দূর থেকেও
একজনের কষ্ট বুঝে নেওয়া?</p>
          <p>কী অপরাধ ছিল আমার?
তোমাকে আপন ভেবেছিলাম,
তোমাকে ভালোবেসেছিলাম—
এইটুকুই কি ছিল আমার ভুল?</p>
        </div>

        <div class="lyric-section lyric-section--chorus">
          <p>আজ চারপাশটা কেমন নিঃসঙ্গ,
ঋতুর রংও যেন মলিন।
যেদিকেই তাকাই,
তোমার স্মৃতিই চোখে পড়ে।</p>
          <p>আমার হৃদয় যেন
বিচ্ছেদের এক গভীর স্রোতে ভেসে যাচ্ছে,
চোখের কোণে জমে থাকা অশ্রু
সেই কথাই বলে যায়।</p>
          <p>তুমি জানো—
এই অস্থির হৃদয়ের
কত পুরোনো ক্ষত রয়েছে।</p>
          <p>তোমার একটুখানি উপস্থিতি
হয়তো সেই ক্ষতগুলোতে
শান্তির পরশ হয়ে আসতে পারে।</p>
          <p>তাই একবার ফিরে এসো।</p>
        </div>

        <div class="lyric-section lyric-section--bridge">
          <p>রাত যত গভীর হয়,
নীরবতাও তত ভারী হয়ে নামে।
একাকী ঘরে জ্বলতে থাকা
ছোট্ট প্রদীপের আলোও
আজ যেন ক্লান্ত।</p>
          <p>তুমি অভিমান করে চলে যাওয়ার পর
হৃদয়ে এমন এক শূন্যতা তৈরি হয়েছে,
মনে হয় ভাগ্যও যেন
আমার প্রতি অভিমান করেছে।</p>
          <p>তবু আশাটা পুরোপুরি মরেনি।</p>
        </div>

        <div class="lyric-section">
          <p>বাতাসে আজ
ফুলের নতুন সুবাস,
আকাশে যেন নতুন কোনো বার্তা।</p>
          <p>মনে হচ্ছে—
হয়তো অপেক্ষার দিনগুলো শেষ হতে চলেছে,
হয়তো আবারও
ফিরে আসার কোনো ঋতু এসেছে।</p>
          <p>তাই যদি সত্যিই কোথাও
আমার কথা তোমার মনে পড়ে—</p>
        </div>

        <div class="lyric-section lyric-section--soft">
        </div>
      `
    },
    {
      id: "j18",
      title: `<svg class="title-icon" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path d="M12 20.2s-7.2-4.4-9.6-8.7C.7 7.9 2.3 4.3 5.9 4.3c2 0 3.6 1.2 4.6 2.9 1-1.7 2.6-2.9 4.6-2.9 3.6 0 5.2 3.6 3.5 7.2-2.4 4.3-9.6 8.7-9.6 8.7z"/></svg> ভালোবাসার স্বীকারোক্তি`,
      category: "Daily Notes",
      date: "2025-02-14",
      readingTime: "৫ মিনিট",
      image: "",
      excerpt: "হৃদয় আর প্রাণের সমস্ত অনুভূতি দিয়ে একটি খোলা স্বীকারোক্তি — ভালোবাসি, শুধু তোমাকেই।",
      url: "",
      content: `
        <div class="lyric-section">
          <p>এই কথাটি আজ স্বীকার করি—
তোমাকে ভালোবাসি,
হৃদয় আর প্রাণের সমস্ত অনুভূতি দিয়ে
শুধু তোমাকেই চাই।</p>
          <p>যদি একদিন তোমার
কাছাকাছি থাকার সৌভাগ্য পাই,
তবে আমাদের ছোট্ট পৃথিবীটা
আনন্দে ভরে উঠবে,
আর মুহূর্তেই যেন
সব দুঃখ-কষ্ট দূরে সরে যাবে।</p>
        </div>

        <div class="lyric-section lyric-section--chorus">
          <p>আজ তাই স্বীকার করি—
তোমাকে ভালোবাসি,
হৃদয়-প্রাণ দিয়ে ভালোবাসি।</p>
        </div>

        <div class="lyric-section">
          <p>আমার প্রার্থনা শুধু এটুকুই—
আল্লাহ যেন তোমাকে
সবসময় নিরাপদে রাখেন।</p>
          <p>এই পৃথিবীর প্রতিটি পথে
তোমার জন্য সাফল্য অপেক্ষা করুক,
তোমার প্রতিটি পদক্ষেপে
সুখ এসে ছুঁয়ে যাক।</p>
          <p>তোমার জীবনের পথে
সদা আনন্দের ফুল ফুটুক।</p>
        </div>

        <div class="lyric-section lyric-section--chorus">
          <p>আজ তাই স্বীকার করি—
তোমাকে ভালোবাসি,
হৃদয়-প্রাণ দিয়ে ভালোবাসি।</p>
        </div>

        <div class="lyric-section">
          <p>রবের কাছে যা চেয়েছিলাম,
হয়তো তারই উত্তর তুমি।
তোমাকে ছাড়া
এই মনও অস্থির হয়ে থাকে,
তোমার অনুপস্থিতিতে
সবকিছু কেমন অসম্পূর্ণ লাগে।</p>
          <p>আমাদের ভালোবাসার এই বিশ্বাসটুকু
তুমি যেন কখনো ভেঙে দিও না,
এই সম্পর্কের মর্যাদা
হৃদয়ে ধরে রেখো।</p>
        </div>

        <div class="lyric-section lyric-section--chorus">
          <p>আজ তাই স্বীকার করি—
তোমাকে ভালোবাসি,
হৃদয়-প্রাণ দিয়ে ভালোবাসি।</p>
        </div>

        <div class="lyric-section lyric-section--bridge">
          <p>একদিন শুনেছিলাম
এক দীর্ঘ দুঃখের কাহিনি,
যেখানে প্রতিটি পাতায়
বিচ্ছেদের রাতের গল্প লেখা ছিল।</p>
          <p>সেই গল্প শুনতে শুনতে
অজান্তেই চোখ দুটো ভিজে উঠেছিল,
মনে হয়েছিল—
কিছু ভালোবাসার গল্প
অশ্রু ছাড়া শেষ হয় না।</p>
        </div>

        <div class="lyric-section lyric-section--chorus">
          <p>আজ তাই স্বীকার করি—
তোমাকে ভালোবাসি,
হৃদয়-প্রাণ দিয়ে ভালোবাসি।</p>
        </div>

        <div class="lyric-section">
          <p>তোমাকে ভালোবাসি—
এই কথাটি বারবার বলে যাব।</p>
          <p>তোমার জন্য যদি
কিছু দুঃখ-কষ্টও আসে,
তবুও সেগুলো সহ্য করে নেব।</p>
          <p>শুধু একটি অনুরোধ—
অবহেলার আড়ালে
আমাকে কষ্ট দিও না।</p>
          <p>ভালোবাসার মানুষকে
নীরব অবহেলায় ভেঙে দিও না।</p>
        </div>

        <div class="lyric-section lyric-section--soft">
          <p>এই স্বীকারোক্তি আজও একই—
তোমাকে ভালোবাসি,
হৃদয়-প্রাণের সমস্তটুকু দিয়ে ভালোবাসি।</p>
        </div>

        <div class="story-socials">
          <p>আমার সাথে যুক্ত থাকুন</p>
          <a href="https://www.facebook.com/share/1HM1rZJg3a/" target="_blank" rel="noopener">Facebook</a>
          <a href="https://www.instagram.com/masum.171" target="_blank" rel="noopener">Instagram</a>
          <a href="https://www.tiktok.com/@masum__171" target="_blank" rel="noopener">TikTok</a>
          <a href="https://t.me/masum171" target="_blank" rel="noopener">Telegram</a>
          <a href="https://masum171.blogspot.com/" target="_blank" rel="noopener">Blogger</a>
        </div>
      `
    },
    {
      id: "j19",
      title: `<svg class="title-icon" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path d="M12 2.5l2.7 6.3 6.8.6-5.2 4.5 1.6 6.6L12 16.9l-5.9 3.6 1.6-6.6-5.2-4.5 6.8-.6z"/></svg> আমি হারিয়ে যাব পৃথিবীর চোখে`,
      category: "Daily Notes",
      date: "2024-08-30",
      readingTime: "৫ মিনিট",
      image: "",
      excerpt: "দুনিয়ার চোখে হারিয়ে যাওয়া, কিন্তু রবের কাছে কখনো না হারানোর এক নীরব প্রতিজ্ঞা।",
      url: "",
      content: `
        <div class="lyric-section lyric-section--soft">
          <p>যদি খুঁজতে চাও আমাকে,
হয়তো কোনো চিহ্ন পাবে না—
ছড়িয়ে থাকা স্মৃতিগুলো
এক করে আমায় গড়তে পারবে না।</p>
        </div>

        <div class="lyric-section">
          <p>যদি আমার দেহ মিশে যায়
ধূলি আর রক্তের স্রোতে,
কেউ হয়তো কাফন দেবে না,
কেউ দাঁড়াবে না জানাজার পংক্তিতে।</p>
          <p>কবরের মাটিও হয়তো
আমার নামে কথা বলবে না—
তবু আমার রব জানবেন,
আমি কোথায় হারিয়ে গেলাম।</p>
        </div>

        <div class="lyric-section lyric-section--chorus">
          <p>খুঁজে পাবে না আমাকে,
পৃথিবীর কোনো পথে;
আমি রেখে যাব শুধু
আমার রবের কাছে যাওয়ার স্মৃতি।</p>
        </div>

        <div class="lyric-section lyric-section--bridge">
          <p>কিয়ামতের সেই প্রভাতে
যখন আমার রব ডাকবেন,
নিঃশেষ দেহটাকে আবার
তাঁর হুকুমে পূর্ণ করবেন।</p>
          <p>জিজ্ঞেস করবেন—
"কেন এমন হলো তোমার পরিণতি?"
সেদিন হয়তো মাথা নত হবে,
কিন্তু মুখে কোনো উত্তর থাকবে না;
আমার নীরবতাই বলে দেবে
আমার পথের সব কাহিনি।</p>
        </div>

        <div class="lyric-section">
          <p>তারপর আমার রব যদি বলেন,
"ওঠো, হে আমার বান্দা—
তোমার ত্যাগ আমি কবুল করেছি।"
তবে সিজদায় ঝুঁকে থাকা কপাল
আনন্দে আবার উঠবে।</p>
          <p>রহমতের দরজা খুলে যাবে,
সঙ্গী হবে প্রিয়জনেরা,
আর জান্নাতের পথে
ভয় কিংবা মৃত্যুর কোনো স্থান থাকবে না।</p>
          <p>যে মৃত্যু মানুষকে শেষ করে,
রবের পথে সে মৃত্যু শেষ নয়;
কখনো কখনো একটি বিদায়ই
অনন্ত জীবনের শুরু হয়।</p>
        </div>

        <div class="lyric-section">
          <p>জান্নাতের বাগানে পৌঁছে
যদি আমার রব জিজ্ঞেস করেন,
"আজ তোমার কী চাওয়া?"
আমি বলব—
"আমার জন্য যা উত্তম,
সেটিই দাও, হে আমার রব।"</p>
          <p>তবু যদি হৃদয় ফিরে চায়
সেই ত্যাগের দিনগুলোর কাছে,
তবে বলব—
"আমাকে আবার পাঠিয়ে দাও
সেই পথে, যেখানে তোমার সন্তুষ্টি;
কারণ তোমার জন্য বিসর্জনের যে স্বাদ,
দুনিয়ার কোনো সুখে
তার তুলনা খুঁজে পাইনি।"</p>
        </div>

        <div class="lyric-section lyric-section--soft">
          <p>আমি হারিয়ে যাব পৃথিবীর চোখে,
কিন্তু আমার রবের কাছে হারাব না কখনো।</p>
        </div>

        <div class="story-socials">
          <p>আমার সাথে যুক্ত থাকুন</p>
          <a href="https://www.facebook.com/share/1HM1rZJg3a/" target="_blank" rel="noopener">Facebook</a>
          <a href="https://www.instagram.com/masum.171" target="_blank" rel="noopener">Instagram</a>
          <a href="https://www.tiktok.com/@masum__171" target="_blank" rel="noopener">TikTok</a>
          <a href="https://t.me/masum171" target="_blank" rel="noopener">Telegram</a>
          <a href="https://masum171.blogspot.com/" target="_blank" rel="noopener">Blogger</a>
        </div>
      `
    }
  ],
  articleCategories: ["সব", "বাংলাদেশের শিক্ষাব্যবস্থা", "ইংরেজি শেখা", "AI", "Programming", "Construction", "Productivity", "স্কিল ডেভেলপমেন্ট", "জীবন ও মানসিকতা", "সাইবার নিরাপত্তা", "Leadership", "ব্যবসা ও জীবন", "ইসলামিক শিক্ষা", "মানবাধিকার"],

  articles: [
    {
      id: "a16",
      title: "ডিজিটাল যুগের ক্রীতদাস প্রথা: কুয়েতের গৃহকর্মী ও কাফালা সিস্টেমের ভেতরের গল্প",
      category: "মানবাধিকার",
      date: "2026-08-22",
      readingTime: "14 মিনিট",
      image: "",
      excerpt: "অ্যাপ আর সোশ্যাল মিডিয়ায় গৃহকর্মী কেনাবেচা, কাফালা সিস্টেম আর আধুনিক দাসত্বের নথিভুক্ত বাস্তবতা নিয়ে একটি মানবাধিকার-কেন্দ্রিক অনুসন্ধানী প্রতিবেদন।",
      url: "kafala.html",
      content: ""
    },
    {
      id: "a15",
      title: "দুবাইয়ের ঝলমলে জীবনের আড়ালে: ইনস্টাগ্রাম, অর্থ আর শোষণের অন্ধকার গল্প",
      category: "জীবন ও মানসিকতা",
      date: "2023-04-22",
      readingTime: "13 মিনিট",
      image: "",
      excerpt: "ইনস্টাগ্রামের ঝলমলে জীবন, দুবাইয়ের বিলাসিতা আর তার আড়ালে থাকা অর্থনৈতিক ও সামাজিক বাস্তবতা—কোথায় সত্য, কোথায় ভাইরাল গল্প?",
      url: "dubai.html",
      content: ""
    },
    {
      id: "a14",
      title: "BlackRock ও Vanguard: আধুনিক বিশ্ব অর্থনীতির অদৃশ্য শক্তি",
      category: "ব্যবসা ও জীবন",
      date: "2025-11-04",
      readingTime: "10 মিনিট",
      image: "https://masumcpex.github.io/masumcpex/masum.webp",
      excerpt: "22 ট্রিলিয়ন ডলারের সম্পদ পরিচালনা করা দুটি প্রতিষ্ঠান আসলে কী — আর কী নয়। AUM, ETF, Aladdin ও কর্পোরেট ভোটিং পাওয়ার নিয়ে তথ্যভিত্তিক বিশ্লেষণ।",
      url: "invest.html",
      content: ""
    },
    {
      id: "a1",
      title: "বাংলাদেশের শিক্ষাব্যবস্থা: মূল সমস্যা কোথায়? সমাধান কী হতে পারে?",
      category: "বাংলাদেশের শিক্ষাব্যবস্থা",
      date: "2025-03-27",
      readingTime: "17 মিনিট",
      image: "education-banner.webp",
      excerpt: "শিক্ষা একটি দেশের উন্নয়নের ভিত্তি। ভালো ফলাফল ও জিপিএর প্রতিযোগিতার বাইরে বাস্তব জীবনের জন্য কতটা প্রস্তুত হচ্ছে শিক্ষার্থীরা—সেটিই এখন সবচেয়ে বড় আলোচনার বিষয়।",
      url: "education-system-bangladesh.html",
      content: `
        <p><strong>ভূমিকা:</strong> শিক্ষা একটি দেশের উন্নয়নের ভিত্তি। একটি ভালো শিক্ষাব্যবস্থা শুধু পরীক্ষায় ভালো ফল করার জন্য নয়, বরং দক্ষ, সৃজনশীল, নৈতিক ও সমস্যা সমাধানে সক্ষম মানুষ তৈরির জন্য কাজ করে।</p>
        <h3 style="color: #2c5282; margin-top: 25px;">১. মুখস্থবিদ্যার উপর অতিরিক্ত নির্ভরতা</h3>
        <p>আমাদের শিক্ষাব্যবস্থার অন্যতম বড় সমস্যা হলো মুখস্থনির্ভর শিক্ষা। এর ফলে অনেক শিক্ষার্থী ভালো ফল করলেও বাস্তব জীবনের চ্যালেঞ্জ মোকাবিলার দক্ষতা অর্জন করতে পারে না।</p>
        <p style="background: #e2e8f0; padding: 12px; border-left: 4px solid #046a38; font-weight: bold; margin: 20px 0;">আজকের পৃথিবীতে সবচেয়ে মূল্যবান সম্পদ শুধু ডিগ্রি নয়—দক্ষতা।</p>
        <div style="text-align: center; margin-top: 40px; font-weight: bold; color: #718096; border-top: 1px solid #e2e8f0; padding-top: 15px; font-size: 1.1rem;">প্রতিবেদন তৈরি ও প্রকাশনায়: masumcpex</div>
      `
    },
    {
      id: "a10",
      title: "📚 বাংলাদেশের মাদ্রাসা শিক্ষা: ইতিহাস, বর্তমান সংকট ও আধুনিকায়নের ভাবধারা",
      category: "বাংলাদেশের শিক্ষাব্যবস্থা",
      date: "2025-03-29",
      readingTime: "12–15 মিনিট",
      image: "education-banner.jpg.png",
      excerpt: "বাংলাদেশের মাদ্রাসা শিক্ষার ইতিহাস, বর্তমান বাস্তবতা, কাঠামোগত সীমাবদ্ধতা এবং আধুনিকায়নের সম্ভাবনা নিয়ে একটি গবেষণাধর্মী বিশ্লেষণ।",
      url: "bangladesh-madrasa-education.html",
      content: ""
    },
    {
      id: "a2",
      title: "AI যুগে প্রোগ্রামিং শেখার সঠিক পথ",
      category: "Programming",
      date: "2025-04-18",
      readingTime: "16 মিনিট",
      image: "",
      excerpt: "AI কোড লিখে দিচ্ছে ঠিকই — কিন্তু যে বোঝে না কী লেখা হচ্ছে, সে-ই সবচেয়ে বেশি ঝুঁকিতে থাকে। সম্পূর্ণ রোডম্যাপ ও প্রয়োজনীয় স্কিলসহ।",
      url: "article-ai-programming.html",
      content: "<p>AI যুগে প্রোগ্রামিং শেখার জন্য বেসিক লজিক ও প্রম্পট ইঞ্জিনিয়ারিং জানা জরুরি।</p>"
    },
    {
      id: "a3",
      title: "99% মানুষের চেয়ে এগিয়ে যেতে চাইলে যে 6টি অভ্যাস আজ থেকেই শুরু করা উচিত",
      category: "Productivity",
      date: "2025-05-29",
      readingTime: "12 মিনিট",
      image: "",
      excerpt: "প্রতিভা গুরুত্বপূর্ণ, কিন্তু ধারাবাহিকতা তার চেয়েও বেশি গুরুত্বপূর্ণ। ছয়টি বাস্তবসম্মত অভ্যাস, যা আপনার জীবনে সত্যিকারের পার্থক্য তৈরি করতে পারে।",
      url: "article-daily-habits.html",
      content: ""
    },
    {
      id: "a4",
      title: "স্কুল-কলেজে পড়ার সময় যে ১০টি স্কিল শেখা উচিত",
      category: "স্কিল ডেভেলপমেন্ট",
      date: "2025-09-19",
      readingTime: "14 মিনিট",
      image: "",
      excerpt: "ভালো রেজাল্ট আপনাকে একটি চাকরির দরজা পর্যন্ত নিয়ে যেতে পারে, কিন্তু দক্ষতাই আপনাকে জীবনে অনেক দূর এগিয়ে নিয়ে যায় — কমিউনিকেশন থেকে শুরু করে সেলফ ডিসিপ্লিন পর্যন্ত ১০টি জরুরি স্কিল।",
      url: "article-10-skills.html",
      content: "<p>স্কুল-কলেজ জীবনে যে ১০টি স্কিল রপ্ত করা উচিত তার সম্পূর্ণ গাইড।</p>"
    },
    {
      id: "a5",
      title: "র‍্যাট রেস: যে দৌড়ের কোনো ফিনিশ লাইন নেই",
      category: "জীবন ও মানসিকতা",
      date: "2025-09-23",
      readingTime: "10 মিনিট",
      image: "",
      excerpt: "সফল হয়েও আমরা কেন সুখী নই? একটি লক্ষ্য পূরণ হলেই কেন সামনে চলে আসে আরেকটি — আর কীভাবে থামা যায় এই না-শেষ-হওয়া দৌড়ে।",
      url: "article-rat-race.html",
      content: ""
    },
    {
      id: "a6",
      title: "Attention Economy: কেন ইনফ্লুয়েন্সারদের যুগে আমরা নিজেদের জীবনকে ব্যর্থ মনে করি?",
      category: "জীবন ও মানসিকতা",
      date: "2025-07-28",
      readingTime: "22 মিনিট",
      image: "",
      excerpt: "মনোযোগই আজকের বিশ্বের সবচেয়ে দামি পণ্য। ইনফ্লুয়েন্সার কালচার, অ্যালগরিদম, Dunning-Kruger Effect আর সোশ্যাল কম্পারিজনের গভীর বিশ্লেষণ — গবেষণা ও সোর্স-সহ।",
      url: "article-attention-economy.html",
      content: ""
    },
    {
      id: "a7",
      title: "অসমাপ্ত অনুভূতির ডায়েরি",
      category: "জীবন ও মানসিকতা",
      date: "2025-11-02",
      readingTime: "9 মিনিট",
      image: "",
      excerpt: "ভালোবাসা, বন্ধুত্ব, কষ্ট, বিশ্বাস আর জীবনের ছোট ছোট উপলব্ধির একগুচ্ছ ভাঙা টুকরো — কিছু মুহূর্তের ডায়েরি, যা হয়তো আপনারও চেনা লাগবে।",
      url: "journal-unfinished-feelings.html",
      content: ""
    },
    {
      id: "a8",
      title: "Social Media Honey Trap: অনলাইন যৌন প্রতারণা ও ব্ল্যাকমেইলের নেপথ্য কাহিনি",
      category: "সাইবার নিরাপত্তা",
      date: "2024-01-03",
      readingTime: "13 মিনিট",
      image: "",
      excerpt: "Facebook, IMO, Bigo Live-এ ছড়িয়ে থাকা ভুয়া প্রোফাইল, হানি ট্র্যাপ কৌশল, ব্ল্যাকমেইল আর প্রবাসীদের টার্গেট করার পদ্ধতি নিয়ে একটি অনুসন্ধানী প্রতিবেদন — সাথে নিরাপত্তা টিপস ও যাচাইযোগ্য সোর্স।",
      url: "article-honeytrap-scam.html",
      content: ""
    },
    {
      id: "a9",
      title: "বিশ্বমঞ্চে ভারতীয়দের সিইও জয়জয়কার: নেপথ্যের কারণ ও আমাদের শিক্ষাভাবনা",
      category: "Leadership",
      date: "2025-07-06",
      readingTime: "12 মিনিট",
      image: "",
      excerpt: "সুন্দর পিচাই, সত্য নাদেলা, অরবিন্দ কৃষ্ণা থেকে শান্তনু নারায়েন — কেন বিশ্বের শীর্ষ কোম্পানিগুলোর CEO পদে ভারতীয়দের এই জয়জয়কার, আর বাংলাদেশ কী শিখতে পারে তা থেকে।",
      url: "article-indian-ceos.html",
      content: ""
    },
    {
      id: "a11",
      title: "বর্তমান বিশ্বে মুসলিম সমাজ ও আমাদের আত্মোপলব্ধি",
      category: "জীবন ও মানসিকতা",
      date: "2024-08-26",
      readingTime: "14 মিনিট",
      image: "",
      excerpt: "বিশ্বজুড়ে মুসলিম সমাজের শিক্ষা, পেশা ও মানসিকতার একটি বিশ্লেষণাত্মক পর্যালোচনা — প্রবাসজীবন, জ্ঞানচর্চা এবং বাংলাদেশের অর্থনৈতিক বাস্তবতার আলোকে।",
      url: "muslim-somaj-atmoupolobdhi.html",
      content: ""
    },
    {
      id: "a12",
      title: "বিশ্বাস, মূল্য ও ব্যক্তিগত উন্নয়নের 16টি বাস্তব শিক্ষা",
      category: "ব্যবসা ও জীবন",
      date: "2025-07-29",
      readingTime: "11 মিনিট",
      image: "",
      excerpt: "শান্তি নিজের থেকে শুরু হয়, বিক্রির আগে বিক্রি হয় বিশ্বাস — ব্যবসা, ব্র্যান্ডিং আর জীবনের কিছু বাস্তব উপলব্ধি।",
      url: "business-life-lessons.html",
      content: ""
    },
    {
      id: "a13",
      title: "পবিত্রতা রক্ষা ও বিবাহ: চরিত্র সংরক্ষণে ইসলামের নির্দেশনা",
      category: "ইসলামিক শিক্ষা",
      date: "2025-01-01",
      readingTime: "10 মিনিট",
      image: "",
      excerpt: "আত্মসংযম, বিবাহের গুরুত্ব ও শালীনতা নিয়ে কুরআন ও সহিহ হাদিসের আলোকে একটি প্রামাণ্য আলোচনা।",
      url: "purity-marriage-islam.html",
      content: ""
    }
  ],

  /* ---------------- Projects ---------------- */
  projects: [
    {
      id: "p0",
      title: "WorkTrack",
      icon: "",
      description: "টিমের দৈনিক হাজিরা ও কাজের ঘণ্টা লিখে রাখার ডিজিটাল খাতা — সদস্য যোগ/বাদ দেওয়া, সামারি ও রেজিস্টারসহ।",
      status: "লাইভ",
      url: "worktrack.html"
    },
    {
      id: "p1",
      title: "Masum Notes",
      icon: "",
      description: "ব্যক্তিগত নোট রাখার এবং সাজিয়ে রাখার একটি ছোট্ট টুল।",
      status: "চলছে",
      url: "#"
    },
    {
      id: "p3",
      title: "Mystery Game",
      icon: "",
      description: "CICADA 3301 ধাঁচের জটিল ধাঁধা ও বুদ্ধিমত্তার খেলা।",
      status: "লাইভ",
      url: "https://docs.google.com/forms/d/e/1FAIpQLSeUXTUT5i4McPtrl27yQj3L3BYl_wGWjVKEDpnMpLnD8Sn3YQ/viewform"
    },
    {
      id: "p4",
      title: "English Learning",
      icon: "",
      description: "স্মার্ট স্পোকেন ইংলিশ শেখার একটি ইন্টারঅ্যাক্টিভ প্ল্যাটফর্ম।",
      status: "লাইভ",
      url: "english-learning.html"
    },
    {
      id: "p5",
      title: "ভবিষ্যতের অ্যাপ",
      icon: "",
      description: "নতুন আইডিয়া নিয়ে কাজ চলছে — শীঘ্রই আসছে।",
      status: "শীঘ্রই",
      url: "#"
    }
  ],

  /* ---------------- Mystery সেকশন ---------------- */
  mystery: {
    title: "⚠️ CICADA 3301 MYSTERY PUZZLE ⚠️",
    notice: "[SYSTEM NOTICE]: একটি অত্যন্ত জটিল ধাঁধা এবং বুদ্ধিমত্তার খেলা আপনার জন্য অপেক্ষা করছে। আপনি কি চ্যালেঞ্জটি নিতে প্রস্তুত?",
    qrImage: "",
    buttonText: "মিশনে প্রবেশ করুন",
    buttonUrl: "https://docs.google.com/forms/d/e/1FAIpQLSeUXTUT5i4McPtrl27yQj3L3BYl_wGWjVKEDpnMpLnD8Sn3YQ/viewform"
  },

  /* ---------------- Contact সেকশন ---------------- */
  contact: {
    phone: "01133192963",
    emails: ["admin@masumcpex.com", "masumcpex@yahoo.com"],
    socials: [
      { name: "Facebook", url: "https://www.facebook.com/share/1HM1rZJg3a/" },
      { name: "Instagram", url: "https://www.instagram.com/masum.171" },
      { name: "TikTok", url: "https://www.tiktok.com/@masum__171" },
      { name: "Telegram", url: "https://t.me/masum171" },
      { name: "Medium", url: "https://medium.com/@masumcpex" },
      { name: "Tumblr", url: "https://www.tumblr.com/masum171" },
      { name: "Blogger", url: "https://masum171.blogspot.com/" },
      { name: "Gmail", url: "mailto:masumcpex@gmail.com" }
    ]
  }
};
