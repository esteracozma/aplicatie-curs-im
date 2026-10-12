/* Date istorice pentru aplicația „Pe urmele marilor navigatori”.
   Coordonatele sunt [longitudine, latitudine]; rutele sunt schematice. */
window.ROUTES = [
  {
    id: "columb",
    name: "Cristofor Columb",
    short: "Columb",
    years: "1492–1493",
    color: "var(--c-columb)",
    dash: "0",
    summary: "Pornește spre vest, în numele regilor Spaniei, ca să ajungă în Asia, și ajunge în insulele din Marea Caraibilor.",
    legs: [
      { pts: [[-6.9, 37.2], [-17.1, 28.1], [-45, 26], [-74.5, 24.1]] },
      { pts: [[-74.5, 24.1], [-58, 33], [-40, 39], [-25.7, 38.2], [-6.9, 37.2]], dashed: true }
    ],
    stops: [
      { name: "Palos de la Frontera (Spania)", at: [-6.9, 37.2], date: "3 august 1492 (plecare) · 15 martie 1493 (întoarcere)",
        text: "Din acest port pornesc trei nave: Santa María, Pinta și Niña. Expediția este sprijinită de regii Spaniei, iar Columb vrea să ajungă în Asia navigând spre vest.",
        fact: "Linia punctată de pe hartă arată drumul de întoarcere, încheiat în martie 1493." },
      { name: "Insulele Canare", at: [-17.1, 28.1], date: "6 septembrie 1492",
        text: "Ultima oprire pentru provizii. Pe 6 septembrie flota pornește spre vest, în apele pe care europenii nu le străbătuseră.",
        fact: "De aici până la prima zărire a uscatului au trecut aproape cinci săptămâni de navigație fără oprire." },
      { name: "Guanahani, în arhipelagul Bahamas", at: [-74.5, 24.1], date: "12 octombrie 1492",
        text: "Echipajul zărește uscatul. Columb crede că a ajuns lângă Indii și îi numește „indieni” pe locuitori, o greșeală rămasă în limbă.",
        fact: "Pentru europeni era un continent necunoscut, dar pentru oamenii care trăiau acolo era casa lor." }
    ]
  },
  {
    id: "gama",
    name: "Vasco da Gama",
    short: "Vasco da Gama",
    years: "1497–1499",
    color: "var(--c-gama)",
    dash: "0",
    summary: "Ocolește Africa și ajunge la Calicut, în India: prima cale maritimă directă din Europa spre India.",
    legs: [
      { pts: [[-9.1, 38.7], [-23.5, 15], [-14, -12], [0, -31], [18.5, -34.4], [32, -27], [40.7, -15], [39.9, -3.6], [60, 3], [75.8, 11.25]] }
    ],
    stops: [
      { name: "Lisabona (Portugalia)", at: [-9.1, 38.7], date: "8 iulie 1497",
        text: "Regele Manuel I trimite patru nave să găsească drumul pe mare spre India, de unde se aduceau mirodeniile. Bartolomeu Dias ocolise Capul Bunei Speranțe încă din 1488.",
        fact: "Mirodeniile (piper, scorțișoară, cuișoare) valorau foarte mult în Europa." },
      { name: "Insulele Capului Verde", at: [-23.5, 15], date: "vara anului 1497",
        text: "Corăbiile se aprovizionează cu apă și hrană înainte de marea traversare a Atlanticului de Sud.",
        fact: "Flota a făcut un ocol larg prin ocean, ca să evite vânturile contrare de lângă coasta Africii." },
      { name: "Capul Bunei Speranțe", at: [18.5, -34.4], date: "noiembrie 1497",
        text: "Flota ocolește extremitatea sudică a Africii, după aproape patru luni de la plecare. Marinarii îi spuneau „Capul Furtunilor”, din cauza vremii aspre.",
        fact: "Numele de „Capul Bunei Speranțe” exprimă speranța că drumul spre India este deschis." },
      { name: "Mombasa și Malindi (Africa de Est)", at: [40.0, -3.6], date: "aprilie 1498",
        text: "La Mombasa, relațiile cu localnicii sunt tensionate. La Malindi, flota este primită prietenos și întâlnește negustori din India.",
        fact: "Oceanul Indian era deja străbătut de negustori arabi, indieni și africani." },
      { name: "Calicut (India)", at: [75.8, 11.25], date: "20 mai 1498",
        text: "Flota ajunge la destinație și negociază cu conducătorul orașului. Comerțul cu mirodenii nu decurge cum sperase Gama. Expediția se întoarce la Lisabona în septembrie 1499.",
        fact: "Din acel moment, Portugalia putea aduce mirodenii direct pe mare, fără intermediari." }
    ]
  },
  {
    id: "magellan",
    name: "Magellan și Elcano",
    short: "Magellan–Elcano",
    years: "1519–1522",
    color: "var(--c-magellan)",
    dash: "0",
    summary: "Prima călătorie în jurul lumii: pornește sub comanda lui Magellan și se încheie sub comanda lui Elcano.",
    legs: [
      { pts: [[-6.3, 36.8], [-16.3, 28.5], [-35, -8], [-43.2, -22.9], [-58, -40], [-67.7, -49.3], [-70.8, -53.5], [-100, -46], [-140, -30], [-180, -19]] },
      { pts: [[180, -19], [165, -4], [144.8, 13.4], [124, 10.3], [127.4, 0.8], [124.3, -9.5], [90, -22], [55, -32], [18.5, -34.4], [-5, -20], [-23.5, 15], [-6.3, 36.8]] }
    ],
    stops: [
      { name: "Sanlúcar de Barrameda (Spania)", at: [-6.3, 36.8], date: "20 septembrie 1519 (plecare) · 6 septembrie 1522 (întoarcere)",
        text: "Pornesc cinci nave (Trinidad, San Antonio, Concepción, Victoria, Santiago), cu aproximativ 270 de oameni. Scopul: ajungerea la Insulele Moluce, „Insulele Mirodeniilor”, pe la vest.",
        fact: "Doar nava Victoria revine în port, în 1522, sub comanda lui Juan Sebastián Elcano." },
      { name: "Coasta Braziliei", at: [-43.2, -22.9], date: "decembrie 1519",
        text: "Flota coboară de-a lungul coastei Americii de Sud, în căutarea unui pasaj spre o altă mare.",
        fact: "Pentru a găsi pasajul, era nevoie să se exploreze mai multe golfuri și estuare." },
      { name: "Port San Julián (Patagonia)", at: [-67.7, -49.3], date: "iarna 1520",
        text: "Echipajul își petrece iarna aici. Unii căpitani se revoltă împotriva lui Magellan, care înăbușă răscoala.",
        fact: "Foamea, frigul și neîncrederea au făcut din această călătorie una dintre cele mai grele din epocă." },
      { name: "Strâmtoarea Magellan", at: [-70.8, -53.5], date: "octombrie–noiembrie 1520",
        text: "Flota găsește pasajul dintre Atlantic și Pacific. Din cinci nave, doar trei intră în strâmtoare: una se pierde, iar alta dezertează.",
        fact: "Strâmtoarea poartă astăzi numele lui Magellan." },
      { name: "Guam (Oceanul Pacific)", at: [144.8, 13.4], date: "6 martie 1521",
        text: "După o traversare a Pacificului de luni de zile, în care echipajul suferă de foame și boli, flota ajunge la Guam.",
        fact: "Pacificul este mult mai mare decât se credea la acea vreme." },
      { name: "Mactan (Filipine)", at: [124, 10.3], date: "aprilie 1521",
        text: "Magellan este ucis într-o luptă cu localnicii. Comanda expediției trece la alți ofițeri, iar mai târziu la Elcano.",
        fact: "Magellan nu a încheiat înconjurul lumii, pe care îl începuse." },
      { name: "Insulele Moluce", at: [127.4, 0.8], date: "noiembrie 1521",
        text: "În sfârșit, flota ajunge la destinația dorită și încarcă mirodenii. Rămân două nave: Trinidad și Victoria.",
        fact: "Victoria pornește spre vest, spre Spania, pe ruta portughezilor, ocolind Africa." },
      { name: "Capul Bunei Speranțe", at: [18.5, -34.4], date: "mai 1522",
        text: "Victoria ocolește Africa, cu un echipaj foarte slăbit, ca să evite navele portugheze din apropiere.",
        fact: "Corabia era atât de uzată, încât pompele trebuiau folosite fără oprire." },
      { name: "Insulele Capului Verde", at: [-23.5, 15], date: "iulie 1522",
        text: "Pentru provizii, echipajul coboară pe uscat, dar portughezii captează o parte dintre oameni.",
        fact: "Victoria pornește mai departe cu un echipaj și mai mic." }
    ]
  }
];

/* Axa timpului (sarcina 2) */
window.EVENTS = [
  { year: 1488, text: "Bartolomeu Dias ocolește pentru prima dată Capul Bunei Speranțe." },
  { year: 1492, text: "Columb zărește uscatul în arhipelagul Bahamas." },
  { year: 1498, text: "Vasco da Gama ajunge la Calicut, în India." },
  { year: 1519, text: "Flota lui Magellan pornește din Spania spre vest." },
  { year: 1521, text: "Magellan este ucis în Filipine." },
  { year: 1522, text: "Nava Victoria revine în Spania, încheind primul înconjur al lumii." }
];

/* Jurnalul de bord (sarcina 3) */
window.JOURNAL = {
  bank: ["astrolab", "cale ferată", "cale maritimă", "caravele", "circumnavigație", "porumb", "vapoare"],
  parts: [
    "Jurnal de bord, ziua 1. Regele ne-a trimis să găsim o ",
    { answer: "cale maritimă" },
    " spre India, ca să aducem mirodenii fără să mai plătim intermediarii. Navele noastre sunt ",
    { answer: "caravele" },
    ", corăbii ușoare, cu pânze triunghiulare. Ne orientăm cu ajutorul unui ",
    { answer: "astrolab" },
    " și al busolei. Dacă vom naviga tot timpul spre vest și vom reveni în punctul de plecare, vom fi făcut o ",
    { answer: "circumnavigație" },
    " a Pământului. Noile pământuri vor aduce în Europa produse necunoscute, precum ",
    { answer: "porumb" },
    ", cartoful sau tomatele."
  ]
};

/* Dilemele din sarcina 4 */
window.DILEMMAS = [
  {
    who: "Columb, septembrie–octombrie 1492",
    q: "Navigați spre vest de peste o lună și nu se vede uscat. Marinarii sunt tot mai neliniștiți, iar unii cer întoarcerea. Ce decizi?",
    options: [
      { t: "Continui spre vest și încerc să îi liniștesc pe oameni.",
        n: "Aceasta a fost alegerea lui Columb. Pe 12 octombrie 1492 a fost zărit uscatul, în Bahamas. Succesul a depins și de noroc, pentru că nimeni nu știa cât de mare este oceanul." },
      { t: "Mă întorc imediat în Spania.",
        n: "Era o alegere prudentă, dar expediția ar fi eșuat fără să ajungă nicăieri. Columb a decis altfel: a mers mai departe." },
      { t: "Cer părerea căpitanilor celorlalte nave, apoi decid.",
        n: "Consultarea echipajului întărește cooperarea. Columb a păstrat conducerea și a continuat. Un ajutor important au fost frații Pinzón, căpitanii navelor Pinta și Niña." }
    ]
  },
  {
    who: "Vasco da Gama, aprilie 1498",
    q: "Ai ajuns pe coasta Africii de Est. Pentru a traversa Oceanul Indian ai nevoie de cineva care cunoaște drumul spre India. La Mombasa relațiile sunt tensionate, iar la Malindi ești primit prietenos. Ce faci?",
    options: [
      { t: "Caut un pilot local la Malindi.",
        n: "Potrivit relatărilor, flota a primit la Malindi ajutor pentru traversare. Fără cunoașterea locală, drumul ar fi fost mult mai riscant: descoperirea nu a fost doar meritul europenilor." },
      { t: "Traversez oceanul doar cu harta și busola mea.",
        n: "Era riscant, pentru că Oceanul Indian era bine cunoscut de navigatorii din zonă, nu de portughezi. Gama a ales să se sprijine pe ajutor local." },
      { t: "Atac orașul ca să iau provizii cu forța.",
        n: "Gama a avut conflicte cu unele orașe de pe coastă, dar cu puține nave și oameni obosiți, o luptă prelungită ar fi fost periculoasă. Relațiile bune de la Malindi au contat mult." }
    ]
  },
  {
    who: "Echipajul lui Magellan, 1521",
    q: "După moartea lui Magellan în Filipine au rămas trei nave și prea puțini oameni pentru toate. Ce decizi?",
    options: [
      { t: "Ard o navă și mut oamenii pe celelalte două.",
        n: "Aceasta a fost soluția expediției: nava Concepción a fost arsă, iar flota a continuat cu Trinidad și Victoria spre Insulele Moluce." },
      { t: "Abandonez expediția și mă întorc pe același drum.",
        n: "Nimeni din echipaj nu cunoștea un drum sigur de întoarcere prin Pacific. Expediția a mers mai departe, spre Moluce." },
      { t: "Împart oamenii pe trei nave, chiar dacă sunt prea puțini.",
        n: "Navele ar fi rămas cu echipaje prea mici pentru a fi manevrate în siguranță. De aceea s-a renunțat la una dintre ele." }
    ]
  }
];

/* Strofa-mnemonic (creație originală) */
window.RHYME = [
  "Columb spre vest pe mare a pornit,",
  "În ’92 un Nou Pământ a găsit.",
  "Vasco da Gama Africa a ocolit,",
  "La Calicut, în ’98, a poposit.",
  "Magellan spre vest a plecat,",
  "Elcano înconjurul l-a terminat."
];
