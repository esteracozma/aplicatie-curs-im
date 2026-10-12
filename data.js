/* Date pentru jocul „Pe urmele marilor navigatori”.
   Coordonatele sunt [longitudine, latitudine]; rutele sunt schematice. */
window.CAPTAINS = [
  {
    id: "columb",
    name: "Cristofor Columb",
    tag: "1492 · spre vest",
    goal: "Ajunge în Asia navigând spre vest.",
    color: "var(--c-columb)",
    start: { name: "Palos", at: [-6.9, 37.2], date: "3 august 1492",
      text: "Trei nave pornesc din Spania: Santa María, Pinta și Niña." },
    steps: [
      { name: "Insulele Canare", at: [-17.1, 28.1], via: [],
        date: "6 septembrie 1492", ord: 1,
        text: "Ultima oprire pentru provizii. De aici începe oceanul necunoscut.",
        kind: "ask", q: "Încotro pornește Columb ca să ajungă în Asia?",
        opts: [
          { t: "Spre vest", ok: true, n: "Voia să ajungă în Asia pe un drum nou, nu ocolind Africa." },
          { t: "Spre est" }, { t: "Spre sud" }
        ],
        page: "Plecăm spre vest, în ocean." },
      { name: "Oceanul Atlantic", at: [-45, 26], via: [[-30, 27]],
        date: "septembrie–octombrie 1492", ord: 2,
        text: "Trec săptămâni fără uscat. Echipajul se neliniștește și cere întoarcerea.",
        kind: "decide", q: "Ce decizi, căpitane?",
        opts: [
          { t: "Continui spre vest.", n: "Aceasta a fost alegerea lui Columb. A contat și norocul: nimeni nu știa cât de mare este oceanul." },
          { t: "Mă întorc în Spania.", n: "Era prudent, dar expediția ar fi eșuat. Columb a mers mai departe." },
          { t: "Cer sfatul celorlalți căpitani.", n: "Cooperarea ajută. Columb a păstrat conducerea; frații Pinzón conduceau Pinta și Niña." }
        ],
        page: "Săptămâni fără uscat." },
      { name: "Bahamas", at: [-74.5, 24.1], via: [[-60, 25]],
        date: "12 octombrie 1492", ord: 3,
        text: "Uscat! Columb crede că a ajuns lângă Indii.",
        kind: "ask", q: "Care a fost greșeala lui Columb?",
        opts: [
          { t: "A crezut că a ajuns în Asia (Indii)", ok: true, n: "De aceea locuitorii au fost numiți „indieni”. Pentru europeni era un continent necunoscut, dar oamenii trăiau acolo de multă vreme." },
          { t: "A crezut că a ajuns în Africa" }, { t: "A crezut că s-a întors acasă" }
        ],
        page: "Zărim uscatul." },
      { name: "Palos", at: [-6.9, 37.2], via: [[-58, 33], [-40, 39], [-25.7, 38.2]], dashed: true,
        date: "15 martie 1493", ord: 4,
        text: "Înapoi în Spania, cu vestea unui drum spre vest.",
        kind: "ask", q: "Câte nave au pornit din Palos?",
        opts: [
          { t: "Trei", ok: true, n: "Santa María, Pinta și Niña." },
          { t: "Cinci" }, { t: "Una" }
        ],
        page: "Ne întoarcem în Spania." }
    ]
  },
  {
    id: "gama",
    name: "Vasco da Gama",
    tag: "1497 · spre India",
    goal: "Ocolește Africa și ajunge în India.",
    color: "var(--c-gama)",
    start: { name: "Lisabona", at: [-9.1, 38.7], date: "8 iulie 1497",
      text: "Regele Manuel I trimite patru nave să găsească drumul pe mare spre India." },
    steps: [
      { name: "Capul Bunei Speranțe", at: [18.5, -34.4], via: [[-23.5, 15], [-14, -12], [0, -31]],
        date: "noiembrie 1497", ord: 1,
        text: "Flota ocolește sudul Africii. Bartolomeu Dias ajunsese aici în 1488.",
        kind: "ask", q: "Ce căutau portughezii?",
        opts: [
          { t: "O cale maritimă spre India", ok: true, n: "Mirodeniile din India ajungeau în Europa prin mulți intermediari. Portughezii voiau să le aducă direct pe mare." },
          { t: "Aur în sudul Africii" }, { t: "O țară nouă de locuit" }
        ],
        page: "Ocolim Africa." },
      { name: "Malindi", at: [40.1, -3.2], via: [[32, -27], [40.7, -15]],
        date: "aprilie 1498", ord: 2,
        text: "La Mombasa e tensiune. La Malindi ești primit prietenos.",
        kind: "decide", q: "Cum traversezi Oceanul Indian?",
        opts: [
          { t: "Caut un pilot local.", n: "Potrivit relatărilor, flota a primit ajutor la Malindi. Oceanul Indian era bine cunoscut de navigatorii locali, deci descoperirea nu a fost doar meritul europenilor." },
          { t: "Merg doar cu harta și busola.", n: "Era riscant: portughezii nu cunoșteau Oceanul Indian. Gama s-a sprijinit pe ajutor local." },
          { t: "Atac orașul ca să iau provizii.", n: "Gama a avut conflicte pe coastă, dar cu puține nave și oameni obosiți, o luptă lungă era periculoasă. Relațiile bune de la Malindi au contat." }
        ],
        page: "Ne pregătim să traversăm Oceanul Indian." },
      { name: "Calicut", at: [75.8, 11.25], via: [[60, 3]],
        date: "20 mai 1498", ord: 3,
        text: "Țintă atinsă! Prima călătorie pe mare din Europa până în India.",
        kind: "ask", q: "În ce an a ajuns Gama la Calicut?",
        opts: [
          { t: "1498", ok: true, n: "Flota s-a întors la Lisabona în septembrie 1499." },
          { t: "1492" }, { t: "1522" }
        ],
        page: "Ajungem în India." }
    ]
  },
  {
    id: "magellan",
    name: "Magellan și Elcano",
    tag: "1519 · înconjurul lumii",
    goal: "Pornește spre vest și ajunge la mirodenii.",
    color: "var(--c-magellan)",
    start: { name: "Sanlúcar", at: [-6.3, 36.8], date: "20 septembrie 1519",
      text: "Cinci nave și aproximativ 270 de oameni pornesc spre Insulele Mirodeniilor." },
    steps: [
      { name: "Strâmtoarea Magellan", at: [-70.8, -53.5],
        via: [[-16.3, 28.5], [-35, -8], [-43.2, -22.9], [-58, -40], [-67.7, -49.3]],
        date: "octombrie–noiembrie 1520", ord: 1,
        text: "Un drum îngust între două oceane. Din cinci nave, doar trei intră în strâmtoare.",
        kind: "ask", q: "Ce oceane leagă strâmtoarea?",
        opts: [
          { t: "Atlantic și Pacific", ok: true, n: "Strâmtoarea poartă astăzi numele lui Magellan." },
          { t: "Atlantic și Indian" }, { t: "Pacific și Indian" }
        ],
        page: "Trecem în Pacific." },
      { name: "Guam", at: [144.8, 13.4],
        wrap: { before: [[-100, -46], [-140, -30], [-180, -19]], after: [[180, -19], [165, -4]] },
        date: "6 martie 1521", ord: 2,
        text: "Luni întregi fără uscat, cu foame și boli pe nave.",
        kind: "ask", q: "Cum s-a dovedit Oceanul Pacific?",
        opts: [
          { t: "Mult mai mare decât se credea", ok: true, n: "Europenii nu își imaginau cât de mare este." },
          { t: "Mai mic decât se credea" }, { t: "Acoperit de gheață" }
        ],
        page: "Ajungem după luni în Pacific." },
      { name: "Filipine", at: [124, 10.3], via: [],
        date: "aprilie 1521", ord: 3,
        text: "Magellan este ucis într-o luptă. Au rămas trei nave și prea puțini oameni.",
        kind: "decide", q: "Ce decizi?",
        opts: [
          { t: "Ard o navă și mut oamenii pe celelalte două.", n: "Aceasta a fost soluția expediției: nava Concepción a fost arsă." },
          { t: "Mă întorc pe același drum.", n: "Nimeni nu cunoștea un drum sigur de întoarcere prin Pacific. Expediția a mers mai departe." },
          { t: "Împart oamenii pe trei nave.", n: "Echipajele ar fi fost prea mici pentru a manevra în siguranță." }
        ],
        page: "Magellan moare în luptă." },
      { name: "Insulele Moluce", at: [127.4, 0.8], via: [],
        date: "noiembrie 1521", ord: 4,
        text: "Destinația! Echipajul încarcă mirodenii.",
        kind: "ask", q: "Ce căutau în Moluce?",
        opts: [
          { t: "Mirodenii", ok: true, n: "Piperul și cuișoarele valorau foarte mult în Europa." },
          { t: "Aur" }, { t: "Lemn pentru nave" }
        ],
        page: "Încărcăm mirodenii." },
      { name: "Sanlúcar", at: [-6.3, 36.8],
        via: [[124.3, -9.5], [90, -22], [55, -32], [18.5, -34.4], [-5, -20], [-23.5, 15]],
        date: "6 septembrie 1522", ord: 5,
        text: "Doar nava Victoria revine, sub comanda lui Elcano.",
        kind: "ask", q: "Ce a dovedit această călătorie?",
        opts: [
          { t: "Că Pământul poate fi înconjurat pe mare", ok: true, n: "A fost prima circumnavigație, încheiată de Elcano după moartea lui Magellan." },
          { t: "Că Pământul este plat" }, { t: "Că Africa nu poate fi ocolită" }
        ],
        page: "Victoria revine în Spania." }
    ]
  }
];
