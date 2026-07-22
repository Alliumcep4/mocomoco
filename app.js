import { initializeApp } from "https://www.gstatic.com/firebasejs/12.6.0/firebase-app.js";
import { getFirestore, doc, setDoc, onSnapshot } from "https://www.gstatic.com/firebasejs/12.6.0/firebase-firestore.js";
import { getAuth, onAuthStateChanged, signInWithPopup, GoogleAuthProvider, signOut } from "https://www.gstatic.com/firebasejs/12.6.0/firebase-auth.js";

/* ─── CONFIG FIREBASE ─── */
const firebaseConfig = {
  apiKey: "AIzaSyBG1xwk7n863tpk7FYUBhOTEs-4HO1ht64",
  authDomain: "mocomoco-39b6c.firebaseapp.com",
  projectId: "mocomoco-39b6c",
  storageBucket: "mocomoco-39b6c.appspot.com",
  messagingSenderId: "546259757508",
  appId: "1:546259757508:web:fd26534abafb1609475c91"
};

const app  = initializeApp(firebaseConfig);
const db   = getFirestore(app);
const auth = getAuth(app);
const provider = new GoogleAuthProvider();

/* ─── ICONOS SVG ─── */
const ICONS = {
  home:      `<svg viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="square" stroke-linejoin="miter"><path d="M1 8L8 2L15 8"/><path d="M4 8L4 14L7 14L7 10L9 10L9 14L12 14L12 8"/></svg>`,
  list:      `<svg viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="square"><rect x="2" y="2" width="12" height="12"/><line x1="5" y1="6" x2="11" y2="6"/><line x1="5" y1="9" x2="11" y2="9"/><line x1="5" y1="12" x2="9" y2="12"/></svg>`,
  info:      `<svg viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="square"><rect x="2" y="2" width="12" height="12" rx="1"/><line x1="8" y1="7" x2="8" y2="12"/><rect x="7.25" y="4" width="1.5" height="1.5" fill="currentColor" stroke="none"/></svg>`,
  heart:     `<svg viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M8 14C8 14 2 10.5 2 6.3C2 4.2 3.7 2.8 5.6 2.8C6.7 2.8 7.6 3.3 8 4.1C8.4 3.3 9.3 2.8 10.4 2.8C12.3 2.8 14 4.2 14 6.3C14 10.5 8 14 8 14Z"/></svg>`,
  clock:     `<svg viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="square"><circle cx="8" cy="8" r="6.3"/><line x1="8" y1="4.8" x2="8" y2="8" stroke-linecap="round"/><line x1="8" y1="8" x2="10.3" y2="9.3" stroke-linecap="round"/></svg>`,
  edit:      `<svg viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.4" stroke-linecap="round" stroke-linejoin="round"><path d="M11 2L14 5L5.5 13.5L2 14L2.5 10.5Z"/></svg>`,
  trash:     `<svg viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M3 4.5H13"/><path d="M6 4.5V2.8C6 2.3 6.3 2 6.8 2H9.2C9.7 2 10 2.3 10 2.8V4.5"/><path d="M4.5 4.5L5 13.2C5 13.6 5.4 14 5.8 14H10.2C10.6 14 11 13.6 11 13.2L11.5 4.5"/></svg>`,
  close:     `<svg viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><line x1="3" y1="3" x2="13" y2="13"/><line x1="13" y1="3" x2="3" y2="13"/></svg>`,
  plus:      `<svg viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M8 2v12M2 8h12"/></svg>`,
  milk:      `<svg viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="square" stroke-linejoin="miter"><polygon points="5,1 11,1 13,5 13,15 3,15 3,5"/><line x1="5" y1="9" x2="11" y2="9"/></svg>`,
  leaf:      `<svg viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="square" stroke-linejoin="miter"><path d="M2 14C5 10 9 6 13 3C13 8 10 13 2 14Z"/><line x1="2" y1="14" x2="9" y2="7"/></svg>`,
  cherry:    `<svg viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"><circle cx="5" cy="12" r="2.5"/><circle cx="11" cy="12" r="2.5"/><path d="M5 9.5C5 7 8 4 8 2"/><path d="M11 9.5C11 7 8 4 8 2"/></svg>`,
  drumstick: `<svg viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="square"><circle cx="11" cy="11" r="3.5"/><line x1="3" y1="3" x2="8.5" y2="8.5"/><circle cx="3" cy="3" r="2"/></svg>`,
  fish:      `<svg viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="square" stroke-linejoin="miter"><path d="M3 8L8 5L13 8L8 11Z"/><path d="M13 8L15 5L15 11Z"/><circle cx="7" cy="7.5" r="0.8" fill="currentColor" stroke="none"/></svg>`,
  noodles:   `<svg viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="square"><path d="M2 8C2 12 14 12 14 8Z"/><line x1="2" y1="8" x2="14" y2="8"/><line x1="5" y1="12" x2="11" y2="12"/><line x1="9" y1="2" x2="9" y2="7"/><line x1="7" y1="3" x2="7" y2="7"/></svg>`,
  bread:     `<svg viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="square" stroke-linejoin="miter"><path d="M2 9C2 6 4 4 8 4C12 4 14 6 14 9L14 14 2 14Z"/><line x1="2" y1="11" x2="14" y2="11"/></svg>`,
  cup:       `<svg viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="square" stroke-linejoin="miter"><polygon points="3,2 13,2 11,14 5,14"/><line x1="4" y1="8" x2="12" y2="8"/></svg>`,
  spray:     `<svg viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="square"><rect x="6" y="8" width="6" height="7"/><rect x="8" y="4" width="4" height="4"/><polyline points="8,6 5,6 5,8 6,8"/><line x1="13" y1="3" x2="15" y2="2"/><line x1="13" y1="5" x2="15" y2="5"/><line x1="13" y1="4" x2="15" y2="4"/></svg>`,
  star:      `<svg viewBox="0 0 16 16" fill="currentColor"><polygon points="8,1 10.2,6 15.5,6.5 11.5,10 13,15 8,12 3,15 4.5,10 0.5,6.5 5.8,6"/></svg>`,
  snowflake: `<svg viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="square"><line x1="8" y1="1" x2="8" y2="15"/><line x1="1" y1="8" x2="15" y2="8"/><line x1="3" y1="3" x2="13" y2="13"/><line x1="13" y1="3" x2="3" y2="13"/></svg>`,
  can:       `<svg viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="square" stroke-linejoin="miter"><rect x="3" y="5" width="10" height="9"/><line x1="3" y1="5" x2="13" y2="5"/><line x1="3" y1="4" x2="13" y2="4"/></svg>`,
  box:       `<svg viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="square" stroke-linejoin="miter"><polyline points="1,5 8,9 15,5"/><polygon points="1,5 8,1 15,5 15,13 8,15 1,13"/><line x1="8" y1="9" x2="8" y2="15"/></svg>`,
  drop:      `<svg viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M8 1.5C8 1.5 3 7.2 3 10.3C3 12.9 5.2 15 8 15C10.8 15 13 12.9 13 10.3C13 7.2 8 1.5 8 1.5Z"/></svg>`,
  fire:      `<svg viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M8 15C5 15 3 13 3 10.3C3 8.5 4 7 4.7 5.8C5 7 6 7.3 6 6.3C6 4.5 7.2 2.6 8.8 1.5C8.3 3.2 9.4 4 10.2 5C11.2 6.2 12 7.5 12 9.6C12 12.6 10.5 15 8 15Z"/></svg>`,
  cart:    `<svg viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="square" stroke-linejoin="miter"><polyline points="1,2 3,2 6,11 12,11"/><polyline points="3,4 13,4 12,11"/><rect x="5" y="13" width="2" height="2"/><rect x="10" y="13" width="2" height="2"/></svg>`,
  bolt:    `<svg viewBox="0 0 16 16" fill="currentColor"><polygon points="10,1 4,9 8,9 6,15 14,6 10,6"/></svg>`,
  moon:    `<svg viewBox="0 0 16 16" fill="currentColor"><path d="M9 2C6 2 3 4.7 3 8C3 11.3 5.7 14 9 14C11 14 12.8 13 14 11.5C13 11.9 12 12 11 12C8.2 12 6 9.8 6 7C6 5 7.1 3.2 9 2.3C9 2.2 9 2 9 2Z"/></svg>`,
  warning: `<svg viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="square" stroke-linejoin="miter"><polygon points="8,1 15,15 1,15"/><line x1="8" y1="7" x2="8" y2="11"/><rect x="7.25" y="12.5" width="1.5" height="1.5" fill="currentColor" stroke="none"/></svg>`,
  cake:    `<svg viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="square"><rect x="2" y="9" width="12" height="5"/><rect x="5" y="6" width="6" height="3"/><line x1="8" y1="6" x2="8" y2="3"/><line x1="6.5" y1="3.5" x2="9.5" y2="4.5"/><path d="M2 11.5C4 9.5 6 13 8 11.5C10 10 12 13 14 11.5" stroke-linecap="round"/></svg>`,
  check:   `<svg viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="square" stroke-linejoin="miter"><polyline points="2,8 6,13 14,3"/></svg>`,
};

function icon(name, size = 16) {
  const svg = ICONS[name];
  if (!svg) return "";
  return svg.replace("<svg ", `<svg width="${size}" height="${size}" `);
}

/* ═══════════════════════════════════════════════════════
   CATEGORÍAS + DETECCIÓN
   ═══════════════════════════════════════════════════════ */

const CATEGORIAS = {
  lácteos: {
    icon: "milk", color: "var(--c-cat-lacteos)",
    palabras: [
      "leche","yogur","huevo","queso","mantequilla","nata","kéfir","queso fresco",
      "mozzarella","requesón","crema","natilla","pudding","flan",
      "leche condensada","leche evaporada","petit suisse","cuajada",
      "queso rallado","queso curado","queso semicurado","queso de cabra",
      "queso crema","leche desnatada","leche semidesnatada","leche entera",
      "leche sin lactosa","bechamel","margarina","mascarpone","burrata",
      "danone","central lechera asturiana","pascual","puleva","kaiku",
      "president","philadelphia","actimel","danonino","asturiana",
      "flora","tulipán","kraft","el caserío","arias","leyma","feiraco",
      "pastoret","yoplait","chamburcy","la lechera","colun","activia",
      "nestlé","gervais","royal","hacendado leche","emmi"
    ]
  },
  verduras: {
    icon: "leaf", color: "var(--c-cat-verduras)",
    palabras: [
      "tomate","cebolla","ajo","lechuga","zanahoria","patata","pimiento",
      "pepino","brócoli","espinaca","calabacín","berenjena","coliflor",
      "acelga","apio","maíz","judía","guisante","alcachofa","rábano",
      "puerro","remolacha","nabo","col","colirrábano","endivia","endibia",
      "escarola","rúcula","champiñón","seta","boniato","calabaza","aguacate",
      "espárrago","haba","canónigo","kale","repollo","calçot",
      "florette","bonduelle","verdifresh","eat lean"
    ]
  },
  fruta: {
    icon: "cherry", color: "var(--c-cat-fruta)",
    palabras: [
      "manzana","plátano","naranja","fresa","uva","melón","sandía","pera",
      "melocotón","kiwi","piña","cereza","ciruela","mango","limón",
      "mandarina","pomelo","granada","higo","frambuesa","mora","grosella",
      "albaricoque","níspero","nectarina","papaya","chirimoya","caqui",
      "coco","lima","maracuyá","dátil"
    ]
  },
  carne: {
    icon: "drumstick", color: "var(--c-cat-carne)",
    palabras: [
      "pollo","ternera","cerdo","jamón","chorizo","pavo","cordero",
      "carne picada","lomo","fiambre","salchichón","mortadela","bacon",
      "panceta","costilla","salchicha","pechuga","contramuslo","muslo",
      "alitas","solomillo","filete","chuleta","bistec","paletilla",
      "morcilla","butifarra","secreto","presa","entrecot","hamburguesa",
      "albóndiga","cinta de lomo","conejo",
      "el pozo","campofrío","argal","casa tarradellas","oscar mayer",
      "palacios","navidul","elpozo","incarlopsa","coren","revilla",
      "espuña","tarradellas","la selva"
    ]
  },
  pescado: {
    icon: "fish", color: "var(--c-cat-pescado)",
    palabras: [
      "merluza","salmón","atún","bacalao","gamba","mejillón","boquerón",
      "sepia","calamar","dorada","lubina","sardina","caballa","pulpo",
      "langostino","anchoa","rape","trucha","carpa","tilapia","pez espada",
      "marisco","camarón","langosta","almeja","navaja","percebe","chipirón",
      "surimi","bacaladilla","panga",
      "calvo","isabel","cuca","consorcio","rianxeira","pescanova",
      "frinsa","albo","la gaviota","ubago","massó"
    ]
  },
  pasta: {
    icon: "noodles", color: "var(--c-cat-pasta)",
    palabras: [
      "pasta","arroz","macarrón","espagueti","fideo","ramen","tallarín",
      "cous cous","quinoa","lasaña","ravioli","penne","gnocchi","orzo",
      "polenta","sémola","tortellini","canelón","fideuá","udon","soba",
      "barilla","gallo","pastas gallo","sos arroz","brillante","nomen",
      "panzani","buitoni"
    ]
  },
  panadería: {
    icon: "bread", color: "var(--c-cat-panaderia)",
    palabras: [
      "pan","baguette","croissant","tostada","bollería","bizcocho","muffin",
      "brioche","chapata","pita","tortilla de harina","magdalena","donut",
      "churro","ensaimada","palmera","napolitana","pan de molde","picos",
      "colines","pan rallado","pan integral","pan de centeno",
      "bimbo","panrico","dulcesol","martínez","bollycao","fontaneda",
      "la bella easo","panadul"
    ]
  },
  bebidas: {
    icon: "cup", color: "var(--c-cat-bebidas)",
    palabras: [
      "agua","zumo","refresco","cerveza","vino","cola","leche vegetal",
      "té","café","batido","soda","limonada","bebida","smoothie","horchata",
      "cava","sidra","whisky","ron","ginebra","vermut","champagne","vodka",
      "sangría","mosto","tónica","bebida isotónica","infusión","cacao soluble","champán",
      "coca-cola","coca cola","pepsi","fanta","sprite","nestea","schweppes",
      "kas","trina","don simón","granini","minute maid","zumosol",
      "garcía carrión","font vella","lanjarón","bezoya","aquarius",
      "cacaolat","colacao","nesquik","san miguel","mahou","estrella galicia",
      "estrella damm","cruzcampo","heineken","amstel","alhambra","voll-damm",
      "freixenet","codorníu","martini","red bull","monster","burn",
      "nescafé","lavazza","aquabona","solán de cabras","vichy catalán"
    ]
  },
  limpieza: {
    icon: "spray", color: "var(--c-cat-limpieza)",
    palabras: [
      "detergente","lejía","suavizante","friegaplatos","bayeta","papel",
      "servilleta","rollo","escoba","fregona","guante","bolsa basura",
      "limpiacristales","desinfectante","ambientador","esponja","jabón",
      "cepillo","trapo","estropajo","quitagrasas","lavavajillas",
      "papel higiénico","pañuelo",
      "fairy","ariel","skip","mistol","don limpio","wc net","vanish",
      "finish","cif","ajax","norit","wipp","sanytol","bref","domestos",
      "flash","kh7","suavitel","vernel","mimosín","dixan","nenuco",
      "dodot","tena","cottonelle","scottex","colhogar"
    ]
  },
  snacks: {
    icon: "star", color: "var(--c-cat-snacks)",
    palabras: [
      "patatas fritas","galleta","chocolate","palomitas","cereal","nachos",
      "fruto seco","almendra","cacahuete","pistacho","anacardo","nuez",
      "pipa","chicle","caramelo","chuche","gominola","turrón","bombón",
      "golosina","barrita","snack","tableta de chocolate","cortezas",
      "lay's","lays","pringles","doritos","ruffles","cheetos","oreo",
      "príncipe","chips ahoy","digestive","chiquilín","fontaneda galleta",
      "nutella","kinder","milka","lindt","ferrero rocher","m&m's","haribo",
      "chupa chups","trident","orbit","lacasitos","nocilla","filipinos",
      "tosta rica","marbú","cuétara","artiach","tuc","gullón","toblerone",
      "hershey's","twix","snickers","kitkat","mars","bounty"
    ]
  },
  congelados: {
    icon: "snowflake", color: "var(--c-cat-congelados)",
    palabras: [
      "pizza","helado","congelado","nugget","empanadilla","croqueta",
      "varitas de merluza","calamares congelados","alitas congeladas",
      "gulas","rebozado","polo","tarrina de helado","canelones congelados",
      "verdura congelada","guisantes congelados","patatas fritas congeladas",
      "frudesa","la cocinera","findus","miko","frigo","häagen-dazs",
      "magnum","carte d'or","gelatelli"
    ]
  },
  conservas: {
    icon: "can", color: "var(--c-cat-conservas)",
    palabras: [
      "lata","atún en lata","garbanzos","lentejas","tomate frito","alubias",
      "maíz en lata","fabada","cocido","sopa","caldo","escabeche",
      "champiñones en lata","aceituna","paté","conserva","tomate triturado",
      "legumbre cocida","mejillones en lata","berberechos",
      "ortiz","la catedral","hida","litoral","rosara","orlando"
    ]
  },
  otros: {
    icon: "box", color: "var(--c-cat-otros)",
    palabras: [
      "aceite","vinagre","sal","azúcar","harina","especias","salsa",
      "mayonesa","ketchup","mostaza","miel","levadura","edulcorante",
      "aceite de oliva","aceite de girasol","canela","pimentón","orégano"
    ]
  }
};

const ORDEN_SUPERMERCADO = ["fruta","verduras","panadería","lácteos","carne","pescado","congelados","pasta","conservas","bebidas","snacks","limpieza","otros"];

const CADENAS_IGNORADAS = new Set([
  "mercadona","carrefour","lidl","dia","alcampo","eroski","aldi",
  "consum","hipercor","ahorramas","condis","caprabo"
]);

function normalizarTexto(str) {
  return str
    .toString()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .trim();
}

function pluralizar(palabra) {
  if (/[aeiou]$/.test(palabra)) return palabra + "s";
  return palabra + "es";
}

const INDICE_CATEGORIAS = new Map();

(function construirIndice() {
  for (const [categoria, datos] of Object.entries(CATEGORIAS)) {
    for (const original of datos.palabras) {
      const norm = normalizarTexto(original);
      if (!INDICE_CATEGORIAS.has(norm)) INDICE_CATEGORIAS.set(norm, categoria);
      if (!norm.includes(" ")) {
        const plural = pluralizar(norm);
        if (!INDICE_CATEGORIAS.has(plural)) INDICE_CATEGORIAS.set(plural, categoria);
      }
    }
  }
})();

const FALLBACK_GENERICO = [
  { match: ["carne", "filete", "chuleta", "bistec", "costilla", "paletilla"], cat: "carne" },
  { match: ["pescado", "marisco", "camaron", "camarones", "langosta", "almeja"], cat: "pescado" },
  { match: ["verdura", "hortaliza", "legumbre"], cat: "verduras" },
  { match: ["fruta", "citrico"], cat: "fruta" },
  { match: ["bebida", "liquido"], cat: "bebidas" },
  { match: ["dulce", "postre", "chuche", "golosina"], cat: "snacks" },
  { match: ["limpieza", "higiene"], cat: "limpieza" }
];

function detectarCategoria(texto) {
  const norm = normalizarTexto(texto);
  const tokens = norm
    .split(/[^a-zñ0-9]+/)
    .filter(t => t.length > 0 && !CADENAS_IGNORADAS.has(t));

  if (tokens.length === 0) return "otros";

  const maxNgram = Math.min(3, tokens.length);
  for (let size = maxNgram; size >= 1; size--) {
    for (let i = 0; i + size <= tokens.length; i++) {
      const gram = tokens.slice(i, i + size).join(" ");
      const cat = INDICE_CATEGORIAS.get(gram);
      if (cat) return cat;
    }
  }

  for (const regla of FALLBACK_GENERICO) {
    if (tokens.some(t => regla.match.includes(t))) return regla.cat;
  }

  return "otros";
}

/* ─── PRECIOS APROXIMADOS (Mercadona/Spar) ─── */
const PRECIOS = {
  "leche": 1.20, "yogur": 2.50, "queso": 5.00, "mantequilla": 3.50, "nata": 2.00,
  "tomate": 1.50, "cebolla": 0.80, "ajo": 2.00, "lechuga": 1.20, "zanahoria": 1.00,
  "patata": 1.80, "pimiento": 2.50, "pepino": 1.00, "brócoli": 2.50, "espinaca": 2.80,
  "manzana": 2.50, "plátano": 1.80, "naranja": 2.00, "fresa": 4.50, "uva": 3.50,
  "pollo": 8.50, "ternera": 12.00, "cerdo": 10.00, "jamón": 15.00, "chorizo": 6.00,
  "merluza": 11.00, "salmón": 14.00, "atún": 4.50, "gamba": 18.00,
  "pasta": 1.20, "arroz": 2.50, "pan": 0.80, "croissant": 1.50,
  "agua": 0.50, "zumo": 2.50, "refresco": 1.80, "cerveza": 1.20, "vino": 5.00,
  "detergente": 3.50, "lejía": 1.50, "suavizante": 2.50, "papel": 2.00,
  "chocolate": 1.80, "galleta": 2.00, "palomitas": 2.50, "cereal": 3.50,
  "pizza": 4.50, "helado": 3.50, "nugget": 5.00, "empanadilla": 4.00,
  "lata": 2.50, "garbanzos": 1.80, "lentejas": 1.50, "tomate frito": 1.20,
  "huevo": 2.20
};

function detectarTags(texto) {
  const lower = texto.toLowerCase();
  const tags = [];
  const palabrasCongelado = ["congelado", "congelada", "helado", "ultra", "frozen", "ice"];
  const palabrasRefrigerado = ["refrigerado", "refrigerada", "fresco", "fresca", "frío", "frio"];
  const palabrasOferta = ["oferta", "descuento", "rebaja", "promo", "promoción"];
  const palabrasImprescindible = ["imprescindible", "esencial", "importante", "prioritario"];

  if (palabrasCongelado.some(p => lower.includes(p))) tags.push("congelado");
  if (palabrasRefrigerado.some(p => lower.includes(p))) tags.push("refrigerado");
  if (palabrasOferta.some(p => lower.includes(p))) tags.push("oferta");
  if (palabrasImprescindible.some(p => lower.includes(p))) tags.push("imprescindible");

  return tags;
}

function detectarPrecio(texto) {
  const lower = texto.toLowerCase();
  const cantidadMatch = texto.match(/x(\d+)/i);
  const cantidad = cantidadMatch ? parseInt(cantidadMatch[1]) : 1;

  for (const [producto, precio] of Object.entries(PRECIOS)) {
    if (lower.includes(producto)) {
      return precio * cantidad;
    }
  }

  const categoria = detectarCategoria(texto);
  const preciosDefecto = {
    verduras: 2.00, fruta: 2.50, carne: 10.00, pescado: 12.00,
    lácteos: 2.50, bebidas: 1.50, snacks: 2.00, congelados: 4.00, otros: 2.00
  };

  return (preciosDefecto[categoria] || 2.00) * cantidad;
}

function calcularTotalLista(lista) {
  if (!lista.items) return 0;
  return lista.items.reduce((total, item) => {
    return total + (item.precio || detectarPrecio(item.texto));
  }, 0);
}

/* ─── MASCOTA (eliminada) ─── */
function mascotaReaccionar(evento, extra = "") {
  // Mascota eliminada: no hace nada.
}

/* ─── CONFETTI ─── */
function lanzarConfetti() {
  const colores = ["#f6d9de","#dde9d3","#d3e0ea","#f8ddc0","#e6ddf1","#f3e2ad"];
  const pixeles = ["■","▪","●","◆","▲","◉"];

  for (let i = 0; i < 40; i++) {
    setTimeout(() => {
      const el = document.createElement("div");
      el.className = "confetti-piece";
      el.textContent = pixeles[Math.floor(Math.random() * pixeles.length)];
      el.style.left             = `${Math.random() * 100}vw`;
      el.style.color            = colores[Math.floor(Math.random() * colores.length)];
      el.style.fontSize         = `${8 + Math.random() * 14}px`;
      el.style.animationDuration = `${1.2 + Math.random() * 1.8}s`;
      el.style.animationDelay   = `${Math.random() * 0.5}s`;
      document.body.appendChild(el);
      setTimeout(() => el.remove(), 3500);
    }, i * 35);
  }
}

/* ─── PARSEAR INPUT ─── */
function parsearInput(texto) {
  return texto
    .split(/,|;|\n/)
    .map(s => s.trim())
    .filter(Boolean)
    .map(s => {
      const matchX   = s.match(/^(.+?)\s*[xX×]\s*(\d+)$/);
      const matchNum = s.match(/^(\d+)\s*[xX×]?\s*(.+)$/);
      if (matchX)   return { texto: matchX[1].trim(),  cantidad: parseInt(matchX[2]) };
      if (matchNum && parseInt(matchNum[1]) <= 99)
                    return { texto: matchNum[2].trim(), cantidad: parseInt(matchNum[1]) };
      return { texto: s, cantidad: 1 };
    });
}

/* ─── DATOS ─── */
let data = { listas: [], listaActiva: null };
let unsub = null;

const MOODS = [
  { icon: "cart",    label: "compra",  color: "#fde8e8" },
  { icon: "noodles", label: "ramen",   color: "#ffeaa7" },
  { icon: "check",   label: "sano",    color: "#d4edda" },
  { icon: "star",    label: "fiesta",  color: "#fce4d4" },
  { icon: "bolt",    label: "gym",     color: "#d4e6f1" },
  { icon: "moon",    label: "noche",   color: "#e8d4ed" },
  { icon: "warning", label: "crisis",  color: "#e8e8e8" },
  { icon: "cake",    label: "dulce",   color: "#f9d4ed" }
];

/* ─── ACCESO RÁPIDO (sidebar) ─── */
const ACCESO_RAPIDO = ["leche", "huevos", "pan", "papel higiénico"];

/* ─── GUARDAR ─── */
async function save() {
  if (auth.currentUser) {
    await setDoc(doc(db, "usuarios", auth.currentUser.uid), data);
  }
  renderAll();
}

/* ─── AUTH ─── */
onAuthStateChanged(auth, (user) => {
  const lBtn = document.getElementById("login-btn");
  const sBtn = document.getElementById("logout-btn");

  if (user) {
    lBtn.style.display = "none";
    sBtn.style.display = "flex";
    const nombreSpan = sBtn.querySelector("span");
    if (nombreSpan) {
      const nombre = user.displayName ? user.displayName.split(" ")[0] : "Moco";
      nombreSpan.textContent = `¡Holi, ${nombre}!`;
    }
    if (unsub) unsub();
    unsub = onSnapshot(doc(db, "usuarios", user.uid), (snap) => {
      if (snap.exists()) {
        data = snap.data();
        if (!data.listas) data.listas = [];
        if (!data.listaActiva && data.listas.length) data.listaActiva = data.listas[0].id;
      } else {
        const id = Date.now();
        data = { listas: [{ id, titulo: "Mi Lista", icon: "cart", items: [] }], listaActiva: id };
        save();
      }
      renderAll();
    });
    setTimeout(() => mascotaReaccionar("bienvenida"), 600);
  } else {
    lBtn.style.display = "flex";
    sBtn.style.display = "none";
    if (unsub) { unsub(); unsub = null; }
    const id = 1;
    data = { listas: [{ id, titulo: "Lista Temporal", icon: "cart", items: [] }], listaActiva: id };
    renderAll();
    setTimeout(() => mascotaReaccionar("invitado"), 600);
  }
});

/* ─── RENDER ─── */
function renderAll() {
  renderHome();
  renderListasGrid();
  renderSidebar();
}

function renderHome() {
  const lista    = data.listas.find(l => l.id === data.listaActiva) || data.listas[0];
  const titleEl  = document.getElementById("active-title");
  const precioEl = document.getElementById("precio-total");
  const listaHTML = document.getElementById("lista-html");
  if (!titleEl || !listaHTML) return;

  if (!lista) {
    titleEl.innerHTML = escapeHTML("sin lista");
    listaHTML.innerHTML = "";
    listaHTML.appendChild(crearEstadoVacio());
    renderProgreso(null);
    if (precioEl) precioEl.textContent = "0,00€";
    return;
  }

  titleEl.innerHTML = `<span class="title-icon">${icon(lista.icon || "cart", 18)}</span>${escapeHTML(lista.titulo)}`;
  renderProgreso(lista);

  const total = calcularTotalLista(lista);
  if (precioEl) {
    precioEl.textContent = total.toFixed(2).replace(".", ",") + "€";
  }

  const grupos = {};
  (lista.items || []).forEach(item => {
    const cat = item.categoria || "otros";
    if (!grupos[cat]) grupos[cat] = [];
    grupos[cat].push(item);
  });

  if (Object.keys(grupos).length === 0) {
    listaHTML.innerHTML = "";
    listaHTML.appendChild(crearEstadoVacio());
    return;
  }

  listaHTML.innerHTML = "";

  const catsOrdenadas = Object.keys(grupos).sort((a, b) => {
    const ia = ORDEN_SUPERMERCADO.indexOf(a);
    const ib = ORDEN_SUPERMERCADO.indexOf(b);
    return (ia === -1 ? 99 : ia) - (ib === -1 ? 99 : ib);
  });

  catsOrdenadas.forEach(cat => {
    const catInfo = CATEGORIAS[cat] || { icon: "box", color: "var(--c-cat-otros)" };
    const header = document.createElement("div");
    header.className = "cat-header";
    header.id = `cat-section-${cat}`;
    header.style.background = catInfo.color;
    header.innerHTML = `${icon(catInfo.icon, 13)}<span>${cat}</span>`;
    listaHTML.appendChild(header);
    grupos[cat].forEach(item => listaHTML.appendChild(crearItemEl(item, lista)));
  });
}

function crearEstadoVacio() {
  const div = document.createElement("div");
  div.className = "empty-state";
  div.innerHTML = `
    <img src="img/jellyfish.png" class="empty-img floating" alt="">
    <p class="empty-title">${icon("star", 13)} la lista está vacía ${icon("star", 13)}</p>
    <p class="empty-sub">escribe algo arriba</p>
  `;
  return div;
}

function renderShoppingMode(lista) {
  const titleEl = document.getElementById("shopping-title");
  const statsEl = document.getElementById("shopping-stats");
  const listEl = document.getElementById("shopping-list");

  if (!titleEl || !statsEl || !listEl) return;

  titleEl.textContent = escapeHTML(lista.titulo || "Mi Lista");

  const total = (lista.items || []).length;
  const hechos = (lista.items || []).filter(i => i.check).length;
  const precioTotal = calcularTotalLista(lista);
  statsEl.innerHTML = `<div style="text-align: center;"><div style="font-size: 14px;">${hechos}/${total}</div></div>`;

  const footerCount = document.getElementById("shopping-footer-count");
  const footerTotal = document.getElementById("shopping-footer-total");
  if (footerCount) footerCount.innerHTML = `${icon("plus", 12)} ${total}`;
  if (footerTotal) footerTotal.textContent = precioTotal.toFixed(2).replace(".", ",") + "€";

  const grupos = {};
  (lista.items || []).forEach(item => {
    const cat = item.categoria || "otros";
    if (!grupos[cat]) grupos[cat] = [];
    grupos[cat].push(item);
  });

  listEl.innerHTML = "";

  const catsOrdenadas = Object.keys(grupos).sort((a, b) => {
    const ia = ORDEN_SUPERMERCADO.indexOf(a);
    const ib = ORDEN_SUPERMERCADO.indexOf(b);
    return (ia === -1 ? 99 : ia) - (ib === -1 ? 99 : ib);
  });

  catsOrdenadas.forEach(cat => {
    const catInfo = CATEGORIAS[cat] || { icon: "box", color: "var(--c-cat-otros)" };
    const header = document.createElement("div");
    header.className = "shopping-cat-header";
    header.style.background = catInfo.color;
    header.innerHTML = `${icon(catInfo.icon, 16)}<span>${cat}</span>`;
    listEl.appendChild(header);

    grupos[cat].forEach(item => {
      const precio = item.precio || detectarPrecio(item.texto);
      const itemEl = document.createElement("button");
      itemEl.className = `shopping-item ${item.check ? "checked" : ""}`;
      itemEl.innerHTML = `
        <span class="item-icon-badge" style="background:${catInfo.color};flex-shrink:0;margin-right:12px;">${icon(catInfo.icon, 16)}</span>
        <div class="shopping-item-text">${escapeHTML(item.texto)}</div>
        <div class="shopping-item-right">
          <span style="font-size: 11px; color: var(--c-text-muted);">${precio.toFixed(2).replace(".", ",")}€</span>
          <div class="shopping-item-check">${item.check ? icon("check", 15) : ""}</div>
        </div>
      `;
      itemEl.onclick = () => {
        item.check = !item.check;
        itemEl.classList.toggle("checked");
        save();
        renderShoppingMode(lista);
      };
      listEl.appendChild(itemEl);
    });
  });
}

function separarCantidad(texto) {
  const m = texto.match(/^(.*?)\s*[xX×]\s*(\d+)$/);
  if (m) return { base: m[1].trim(), cantidad: m[2] };
  return { base: texto, cantidad: null };
}

function crearItemEl(item, lista) {
  const div = document.createElement("div");
  const catInfo = CATEGORIAS[item.categoria] || { color: "var(--c-cat-otros)" };
  div.className = `list-item ${item.check ? "checked" : ""} pop-in`;
  div.style.borderLeftColor = catInfo.color;

  const TAG_ICONS = { congelado: "snowflake", refrigerado: "drop", oferta: "fire", imprescindible: "star" };
  const tagsHtml = (item.tags || []).map(tag => {
    return `<span class="item-tag" title="${tag}">${icon(TAG_ICONS[tag] || "box", 12)}</span>`;
  }).join("");

  const precio = item.precio || detectarPrecio(item.texto);
  const precioHtml = `<span class="item-precio" title="click para editar">${precio.toFixed(2).replace(".", ",")}€</span>`;

  const { base, cantidad } = separarCantidad(item.texto);
  const qtyHtml = cantidad ? `<span class="item-qty">x${cantidad}</span>` : "";

  div.innerHTML = `
    <div class="item-checkbox">${item.check ? icon("check", 15) : ""}</div>
    <span class="item-icon-badge" style="background:${catInfo.color || "var(--c-cat-otros)"}">${icon(CATEGORIAS[item.categoria]?.icon || "box", 16)}</span>
    <div class="item-content">
      <div class="item-text">${escapeHTML(base)}${qtyHtml}</div>
      <div class="item-tags">${tagsHtml}</div>
    </div>
    <div class="item-actions">
      ${precioHtml}
      <button class="edit-category-btn" title="cambiar categoría">${icon("edit", 13)}</button>
      <button class="delete-btn" title="eliminar">${icon("close", 12)}</button>
    </div>
  `;

  div.querySelector(".item-checkbox").onclick = () => {
    item.check = !item.check;
    div.classList.add("checking");
    setTimeout(() => div.classList.remove("checking"), 400);
    save();
    if (item.check) mascotaReaccionar("check");
    checkListaCompleta(lista);
  };

  div.querySelector(".item-precio").onclick = (e) => {
    e.stopPropagation();
    abrirModalEditarPrecio(item, lista);
  };

  div.querySelector(".edit-category-btn").onclick = (e) => {
    e.stopPropagation();
    abrirModalEditarCategoria(item, lista);
  };

  div.querySelector(".delete-btn").onclick = () => {
    div.classList.add("deleting");
    setTimeout(() => {
      const idx = lista.items.indexOf(item);
      if (idx !== -1) { lista.items.splice(idx, 1); save(); }
    }, 230);
  };

  return div;
}

function abrirModalEditarPrecio(item, lista) {
  const overlay = document.createElement("div");
  overlay.className = "modal-overlay";

  const precioActual = item.precio || detectarPrecio(item.texto);

  overlay.innerHTML = `
    <div class="modal-box">
      <h3>Precio: ${escapeHTML(item.texto)}</h3>
      <input type="number" id="modal-precio" placeholder="0.00" step="0.01" min="0" value="${precioActual.toFixed(2)}" style="font-size: 20px; text-align: center;">
      <div class="modal-actions">
        <button class="btn-cancel" id="modal-cancel">cancelar</button>
        <button class="send-btn" id="modal-ok">Guardar</button>
      </div>
    </div>
  `;

  document.body.appendChild(overlay);
  const input = overlay.querySelector("#modal-precio");
  setTimeout(() => input.focus(), 50);

  const cerrar = () => overlay.remove();
  overlay.querySelector("#modal-cancel").onclick = cerrar;
  overlay.onclick = (e) => { if (e.target === overlay) cerrar(); };

  overlay.querySelector("#modal-ok").onclick = () => {
    const nuevoPrecio = parseFloat(input.value);
    if (!isNaN(nuevoPrecio)) {
      item.precio = nuevoPrecio;
      save();
      renderHome();
    }
    cerrar();
  };

  input.addEventListener("keydown", e => {
    if (e.key === "Enter") overlay.querySelector("#modal-ok").click();
  });
}

function abrirModalEditarCategoria(item, lista) {
  const overlay = document.createElement("div");
  overlay.className = "modal-overlay";
  overlay.id = "modal-categoria";

  const catBtns = Object.entries(CATEGORIAS).map(([cat, info]) => `
    <button class="cat-btn ${item.categoria === cat ? "selected" : ""}" data-cat="${cat}">
      ${icon(info.icon, 16)}<span>${cat}</span>
    </button>
  `).join("");

  const TAG_ICONS = { congelado: "snowflake", refrigerado: "drop", oferta: "fire", imprescindible: "star" };
  const tagOptions = [
    { id: "congelado", label: "Congelado" },
    { id: "refrigerado", label: "Refrigerado" },
    { id: "oferta", label: "Oferta" },
    { id: "imprescindible", label: "Imprescindible" }
  ];

  const tagBtns = tagOptions.map(t => `
    <button class="tag-option-btn ${(item.tags || []).includes(t.id) ? "selected" : ""}" data-tag="${t.id}">
      ${icon(TAG_ICONS[t.id], 13)} ${t.label}
    </button>
  `).join("");

  overlay.innerHTML = `
    <div class="modal-box">
      <h3>Categoría: ${escapeHTML(item.texto)}</h3>
      <div class="cat-picker" id="cat-picker">${catBtns}</div>

      <h4 style="font-family: var(--font-pixel); font-size: 12px; margin: 14px 0 8px; color: var(--c-text-muted);">Etiquetas especiales</h4>
      <div class="tags-picker" id="tags-picker" style="display: flex; flex-wrap: wrap; gap: 6px; margin-bottom: 16px;">
        ${tagBtns}
      </div>

      <div class="modal-actions">
        <button class="btn-cancel" id="modal-cancel">cancelar</button>
        <button class="send-btn" id="modal-ok">Guardar</button>
      </div>
    </div>
  `;

  document.body.appendChild(overlay);

  const selectedTags = new Set(item.tags || []);

  overlay.querySelectorAll(".cat-btn").forEach(btn => {
    btn.onclick = () => {
      overlay.querySelectorAll(".cat-btn").forEach(b => b.classList.remove("selected"));
      btn.classList.add("selected");
    };
  });

  overlay.querySelectorAll(".tag-option-btn").forEach(btn => {
    btn.onclick = () => {
      btn.classList.toggle("selected");
      const tag = btn.dataset.tag;
      if (selectedTags.has(tag)) {
        selectedTags.delete(tag);
      } else {
        selectedTags.add(tag);
      }
    };
  });

  const cerrar = () => overlay.remove();
  overlay.querySelector("#modal-cancel").onclick = cerrar;
  overlay.onclick = (e) => { if (e.target === overlay) cerrar(); };

  overlay.querySelector("#modal-ok").onclick = () => {
    const selected = overlay.querySelector(".cat-btn.selected");
    if (selected) {
      item.categoria = selected.dataset.cat;
      item.tags = Array.from(selectedTags);
      save();
    }
    cerrar();
  };
}

function checkListaCompleta(lista) {
  const total  = (lista.items || []).length;
  const hechos = (lista.items || []).filter(i => i.check).length;
  if (total > 0 && hechos === total) {
    setTimeout(() => { lanzarConfetti(); mascotaReaccionar("completa"); }, 200);
  }
}

/* ─── PROGRESO ─── */
function renderProgreso(lista) {
  const bar   = document.getElementById("progreso-bar");
  const texto = document.getElementById("progreso-texto");
  if (!bar || !texto) return;

  if (!lista || !lista.items || lista.items.length === 0) {
    bar.style.width = "0%";
    bar.classList.remove("completo");
    texto.textContent = "";
    return;
  }

  const total  = lista.items.length;
  const hechos = lista.items.filter(i => i.check).length;
  const pct    = Math.round((hechos / total) * 100);

  bar.style.width   = pct + "%";
  texto.textContent = pct === 100 ? "completo" : `${hechos}/${total}`;
  bar.classList.toggle("completo", pct === 100);
}

/* ─── SIDEBAR: categorías, acceso rápido y listas ─── */
function renderSidebar() {
  renderSidebarCategorias();
  renderSidebarFavoritos();
  renderSidebarRecientes();
}

function renderSidebarCategorias() {
  const cont = document.getElementById("sidebar-categorias");
  if (!cont) return;
  const lista = data.listas.find(l => l.id === data.listaActiva) || data.listas[0];
  cont.innerHTML = "";
  if (!lista || !lista.items || lista.items.length === 0) return;

  const conteo = {};
  lista.items.forEach(item => {
    const cat = item.categoria || "otros";
    conteo[cat] = (conteo[cat] || 0) + 1;
  });

  const catsOrdenadas = Object.keys(conteo).sort((a, b) => {
    const ia = ORDEN_SUPERMERCADO.indexOf(a);
    const ib = ORDEN_SUPERMERCADO.indexOf(b);
    return (ia === -1 ? 99 : ia) - (ib === -1 ? 99 : ib);
  });

  const todasBtn = document.createElement("button");
  todasBtn.type = "button";
  todasBtn.className = "side-cat-item";
  todasBtn.style.background = "var(--c-cat-todas)";
  todasBtn.innerHTML = `${icon("star", 14)}<span class="side-cat-item__name">Todas</span><span class="side-cat-item__count">${lista.items.length}</span>`;
  todasBtn.onclick = () => {
    document.getElementById("lista-html")?.scrollIntoView({ behavior: "smooth", block: "start" });
  };
  cont.appendChild(todasBtn);

  catsOrdenadas.forEach(cat => {
    const catInfo = CATEGORIAS[cat] || { icon: "box", color: "var(--c-cat-otros)" };
    const btn = document.createElement("button");
    btn.type = "button";
    btn.className = "side-cat-item";
    btn.style.background = catInfo.color;
    btn.innerHTML = `${icon(catInfo.icon, 14)}<span class="side-cat-item__name">${cat}</span><span class="side-cat-item__count">${conteo[cat]}</span>`;
    btn.onclick = () => {
      document.getElementById(`cat-section-${cat}`)?.scrollIntoView({ behavior: "smooth", block: "start" });
    };
    cont.appendChild(btn);
  });
}

function renderSidebarFavoritos() {
  const cont = document.getElementById("sidebar-favoritos");
  if (!cont) return;
  cont.innerHTML = "";

  ACCESO_RAPIDO.forEach(texto => {
    const cat = detectarCategoria(texto);
    const catInfo = CATEGORIAS[cat] || { icon: "box", color: "var(--c-cat-otros)" };
    const row = document.createElement("div");
    row.className = "side-fav-item";
    row.innerHTML = `<span class="side-fav-item__icon" style="background:${catInfo.color}">${icon(catInfo.icon, 13)}</span><span class="side-fav-item__name">${texto}</span><button type="button" class="side-fav-item__add" title="Añadir a la lista">${icon("plus", 12)}</button>`;
    row.querySelector(".side-fav-item__add").onclick = () => añadirItemRapido(texto);
    cont.appendChild(row);
  });
}

function formatearFecha(id) {
  if (!id || id < 1e12) return "";
  const d = new Date(id);
  const dd = String(d.getDate()).padStart(2, "0");
  const mm = String(d.getMonth() + 1).padStart(2, "0");
  return `${dd}/${mm}/${d.getFullYear()}`;
}

function renderSidebarRecientes() {
  const cont = document.getElementById("sidebar-recientes");
  if (!cont) return;
  cont.innerHTML = "";

  const listasOrdenadas = [...(data.listas || [])].sort((a, b) => b.id - a.id);

  listasOrdenadas.forEach(l => {
    const fecha = formatearFecha(l.id);
    const btn = document.createElement("button");
    btn.type = "button";
    btn.className = `side-recent-item ${l.id === data.listaActiva ? "activa" : ""}`;
    btn.innerHTML = `<span class="side-recent-item__name">${escapeHTML(l.titulo)}</span><span class="side-recent-item__count">${fecha}</span>`;
    btn.onclick = () => { data.listaActiva = l.id; save(); };
    cont.appendChild(btn);
  });
}

function añadirItemRapido(texto) {
  const lista = data.listas.find(l => l.id === data.listaActiva) || data.listas[0];
  if (!lista) return;
  if (!lista.items) lista.items = [];
  lista.items.push({
    id: Date.now() + Math.random(),
    texto,
    check: false,
    categoria: detectarCategoria(texto),
    tags: detectarTags(texto),
    orden: lista.items.length
  });
  save();
  mascotaReaccionar("add", texto);
}

/* ─── GRID LISTAS ─── */
function renderListasGrid() {
  const grid = document.getElementById("grid-listas");
  if (!grid) return;
  grid.innerHTML = "";
  (data.listas || []).forEach(l => {
    const total  = (l.items || []).length;
    const hechos = (l.items || []).filter(i => i.check).length;
    const btn = document.createElement("div");
    btn.className = `lista-card ${l.id === data.listaActiva ? "activa" : ""}`;
    btn.innerHTML = `
      <div class="lista-content">
        <span class="lista-icon">${icon(l.icon || "cart", 28)}</span>
        <div class="lista-info">
          <span class="lista-nombre">${escapeHTML(l.titulo)}</span>
          <span class="lista-count">${hechos}/${total}</span>
        </div>
      </div>
      <div class="lista-actions">
        <button class="lista-edit-btn" title="editar nombre">${icon("edit", 13)}</button>
        <button class="lista-delete-btn" title="eliminar lista">${icon("trash", 13)}</button>
      </div>
    `;

    btn.querySelector(".lista-content").onclick = () => {
      data.listaActiva = l.id;
      save();
      navegar("home");
    };

    btn.querySelector(".lista-edit-btn").onclick = (e) => {
      e.stopPropagation();
      abrirModalEditarLista(l);
    };

    btn.querySelector(".lista-delete-btn").onclick = (e) => {
      e.stopPropagation();
      if (confirm(`¿Borrar la lista "${l.titulo}"?`)) {
        const idx = data.listas.indexOf(l);
        if (idx !== -1) {
          data.listas.splice(idx, 1);
          if (data.listaActiva === l.id && data.listas.length) {
            data.listaActiva = data.listas[0].id;
          }
          save();
        }
      }
    };

    grid.appendChild(btn);
  });
}

function abrirModalEditarLista(lista) {
  const overlay = document.createElement("div");
  overlay.className = "modal-overlay";

  overlay.innerHTML = `
    <div class="modal-box">
      <h3>Editar lista</h3>
      <input type="text" id="modal-nombre" placeholder="nombre de la lista..." maxlength="30" value="${escapeHTML(lista.titulo)}">
      <div class="modal-actions">
        <button class="btn-cancel" id="modal-cancel">cancelar</button>
        <button class="send-btn" id="modal-ok">Guardar</button>
      </div>
    </div>
  `;

  document.body.appendChild(overlay);
  const input = overlay.querySelector("#modal-nombre");
  setTimeout(() => input.focus(), 50);

  const cerrar = () => overlay.remove();
  overlay.querySelector("#modal-cancel").onclick = cerrar;
  overlay.onclick = (e) => { if (e.target === overlay) cerrar(); };

  overlay.querySelector("#modal-ok").onclick = () => {
    const nuevoNombre = input.value.trim();
    if (nuevoNombre) {
      lista.titulo = nuevoNombre;
      save();
    }
    cerrar();
  };

  input.addEventListener("keydown", e => {
    if (e.key === "Enter") {
      overlay.querySelector("#modal-ok").click();
    }
  });
}

function abrirModalResumen(lista) {
  const overlay = document.createElement("div");
  overlay.className = "modal-overlay";

  const grupos = {};
  (lista.items || []).forEach(item => {
    const cat = item.categoria || "otros";
    if (!grupos[cat]) grupos[cat] = 0;
    grupos[cat] += item.precio || detectarPrecio(item.texto);
  });

  const catsOrdenadas = Object.keys(grupos).sort((a, b) => {
    const ia = ORDEN_SUPERMERCADO.indexOf(a);
    const ib = ORDEN_SUPERMERCADO.indexOf(b);
    return (ia === -1 ? 99 : ia) - (ib === -1 ? 99 : ib);
  });

  const filas = catsOrdenadas.map(cat => {
    const catInfo = CATEGORIAS[cat] || { icon: "box", color: "var(--c-cat-otros)" };
    return `<div style="display:flex;align-items:center;gap:8px;padding:8px 10px;border-radius:var(--r-md);background:${catInfo.color};margin-bottom:6px;font-family:var(--font-pixel);font-size:12px;color:var(--c-text);">
      ${icon(catInfo.icon, 14)}
      <span style="flex:1;text-transform:capitalize;">${cat}</span>
      <span>${grupos[cat].toFixed(2).replace(".", ",")}€</span>
    </div>`;
  }).join("");

  const totalGeneral = calcularTotalLista(lista);

  overlay.innerHTML = `
    <div class="modal-box">
      <h3>Resumen: ${escapeHTML(lista.titulo)}</h3>
      <div>${filas || `<p style="text-align:center;color:var(--c-text-muted);font-family:var(--font-hand);">sin productos todavía</p>`}</div>
      <div style="display:flex;justify-content:space-between;align-items:center;padding:12px 4px 4px;font-family:var(--font-pixel);font-size:14px;border-top:1.5px solid var(--c-border);margin-top:6px;">
        <span>Total</span>
        <span style="color:var(--c-primary);font-weight:bold;">${totalGeneral.toFixed(2).replace(".", ",")}€</span>
      </div>
      <div class="modal-actions" style="margin-top:16px;">
        <button class="send-btn" id="modal-cerrar-resumen" style="flex:1;">Cerrar</button>
      </div>
    </div>
  `;

  document.body.appendChild(overlay);
  const cerrar = () => overlay.remove();
  overlay.querySelector("#modal-cerrar-resumen").onclick = cerrar;
  overlay.onclick = (e) => { if (e.target === overlay) cerrar(); };
}

/* ─── MODAL NUEVA LISTA ─── */
let moodSeleccionado = MOODS[0];

function abrirModalNuevaLista() {
  if (!auth.currentUser) { mascotaReaccionar("invitado"); return; }

  const overlay = document.createElement("div");
  overlay.className = "modal-overlay";
  overlay.id = "modal-nueva";

  const moodBtns = MOODS.map((m, i) => `
    <button class="mood-btn ${i === 0 ? "selected" : ""}" data-i="${i}" title="${m.label}">
      ${icon(m.icon, 22)}
      <span class="mood-label">${m.label}</span>
    </button>
  `).join("");

  overlay.innerHTML = `
    <div class="modal-box">
      <h3>Nueva lista</h3>
      <input type="text" id="modal-titulo" placeholder="nombre de la lista..." maxlength="30">
      <div class="mood-picker" id="mood-picker">${moodBtns}</div>
      <div class="modal-actions">
        <button class="btn-cancel" id="modal-cancel">cancelar</button>
        <button class="send-btn" id="modal-ok">Crear</button>
      </div>
    </div>
  `;

  document.body.appendChild(overlay);
  moodSeleccionado = MOODS[0];
  setTimeout(() => overlay.querySelector("#modal-titulo").focus(), 50);

  overlay.querySelectorAll(".mood-btn").forEach(btn => {
    btn.onclick = () => {
      overlay.querySelectorAll(".mood-btn").forEach(b => b.classList.remove("selected"));
      btn.classList.add("selected");
      moodSeleccionado = MOODS[parseInt(btn.dataset.i)];
    };
  });

  const cerrar = () => overlay.remove();
  overlay.querySelector("#modal-cancel").onclick = cerrar;
  overlay.onclick = (e) => { if (e.target === overlay) cerrar(); };
  overlay.querySelector("#modal-ok").onclick = crearLista;
  overlay.querySelector("#modal-titulo").addEventListener("keydown", e => {
    if (e.key === "Enter") crearLista();
  });

  function crearLista() {
    const titulo = overlay.querySelector("#modal-titulo").value.trim();
    if (!titulo) return;
    const nueva = { id: Date.now(), titulo, icon: moodSeleccionado.icon, items: [] };
    data.listas.push(nueva);
    data.listaActiva = nueva.id;
    save();
    cerrar();
    mascotaReaccionar("bienvenida");
  }
}

/* ─── EVENTOS ─── */
document.getElementById("btn-add").onclick = agregarItems;
document.getElementById("input-item").addEventListener("keydown", e => {
  if (e.key === "Enter") agregarItems();
});

document.getElementById("btn-shopping-mode").onclick = abrirModoCompra;
document.getElementById("sidebar-nueva-lista")?.addEventListener("click", abrirModalNuevaLista);

document.getElementById("btn-rename-list")?.addEventListener("click", () => {
  const lista = data.listas.find(l => l.id === data.listaActiva) || data.listas[0];
  if (lista) abrirModalEditarLista(lista);
});

document.getElementById("btn-ver-resumen")?.addEventListener("click", () => {
  const lista = data.listas.find(l => l.id === data.listaActiva) || data.listas[0];
  if (lista) abrirModalResumen(lista);
});

function abrirModoCompra() {
  const lista = data.listas.find(l => l.id === data.listaActiva) || data.listas[0];
  if (!lista || !lista.items || lista.items.length === 0) {
    mascotaReaccionar("vacia");
    return;
  }
  renderShoppingMode(lista);
  navegar("shopping-mode");
}

function agregarItems() {
  const input = document.getElementById("input-item");
  const lista = data.listas.find(l => l.id === data.listaActiva) || data.listas[0];
  if (!input.value.trim() || !lista) return;

  const parsed = parsearInput(input.value);
  const primerTexto = parsed[0]?.texto || "";

  parsed.forEach(({ texto, cantidad }) => {
    const textoFinal = cantidad > 1 ? `${texto} x${cantidad}` : texto;
    if (!lista.items) lista.items = [];
    lista.items.push({
      id: Date.now() + Math.random(),
      texto: textoFinal,
      check: false,
      categoria: detectarCategoria(textoFinal),
      tags: detectarTags(textoFinal),
      orden: lista.items.length
    });
  });

  input.value = "";
  save();
  mascotaReaccionar("add", primerTexto);
}

document.getElementById("login-btn").onclick  = () => signInWithPopup(auth, provider);
document.getElementById("logout-btn").onclick = () => signOut(auth).then(() => location.reload());
document.getElementById("btn-nueva-lista").onclick = abrirModalNuevaLista;
document.getElementById("btn-exit-shopping").onclick = () => { navegar("home"); };

/* ─── NAVEGACIÓN ─── */
function navegar(seccion) {
  document.querySelectorAll(".section").forEach(s => s.classList.remove("active"));
  const target = document.getElementById(seccion);
  if (target) target.classList.add("active");
  document.querySelectorAll("[data-section]").forEach(a => {
    a.classList.toggle("active-nav", a.dataset.section === seccion);
  });
  document.getElementById("nav-links")?.classList.remove("open");
  const _ov = document.getElementById("overlay"); if (_ov) _ov.style.display = "none";
  document.body.classList.remove("modal-open");
}

document.querySelectorAll("[data-section]").forEach(a => {
  a.addEventListener("click", e => { e.preventDefault(); navegar(a.dataset.section); });
});

// Menú hamburguesa eliminado — la navegación móvil se hace desde la UI normal

document.getElementById("mascota-img")?.addEventListener("click", () => {
  const lista = data.listas.find(l => l.id === data.listaActiva) || data.listas[0];
  mascotaReaccionar(lista?.items?.length === 0 ? "vacia" : "check");
});

/* ─── UTIL ─── */
function escapeHTML(str) {
  return String(str)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}