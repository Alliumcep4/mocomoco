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
  // Navegación
  home:      `<svg viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="square" stroke-linejoin="miter"><path d="M1 8L8 2L15 8"/><path d="M4 8L4 14L7 14L7 10L9 10L9 14L12 14L12 8"/></svg>`,
  list:      `<svg viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="square"><rect x="2" y="2" width="12" height="12"/><line x1="5" y1="6" x2="11" y2="6"/><line x1="5" y1="9" x2="11" y2="9"/><line x1="5" y1="12" x2="9" y2="12"/></svg>`,
  info:      `<svg viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="square"><rect x="2" y="2" width="12" height="12" rx="1"/><line x1="8" y1="7" x2="8" y2="12"/><rect x="7.25" y="4" width="1.5" height="1.5" fill="currentColor" stroke="none"/></svg>`,

  // Categorías
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

  // Moods
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

/* ─── CATEGORÍAS ─── */
const CATEGORIAS = {
  lácteos:    { icon: "milk",      color: "var(--c-cat-lacteos)",    palabras: ["leche","yogur","queso","mantequilla","nata","kéfir","kefir","queso fresco","mozzarella","requesón"] },
  verduras:   { icon: "leaf",      color: "var(--c-cat-verduras)",   palabras: ["tomate","cebolla","ajo","lechuga","zanahoria","patata","pimiento","pepino","brócoli","brocoli","espinaca","calabacín","calabacin","berenjena","coliflor","acelga","apio","maíz","mais","judía","guisante","alcachofa","rábano","puerro"] },
  fruta:      { icon: "cherry",    color: "var(--c-cat-fruta)",      palabras: ["manzana","plátano","platano","naranja","fresa","uva","melón","melon","sandía","sandia","pera","melocotón","melocoton","kiwi","piña","pina","cereza","ciruela","mango","aguacate","limón","limon","mandarina","pomelo","granada"] },
  carne:      { icon: "drumstick", color: "var(--c-cat-carne)",      palabras: ["pollo","ternera","cerdo","jamón","jamon","chorizo","pavo","cordero","carne picada","lomo","fiambre","salchichón","salchicon","mortadela","bacon","panceta","costilla","salchicha"] },
  pescado:    { icon: "fish",      color: "var(--c-cat-pescado)",    palabras: ["merluza","salmón","salmon","atún","atun","bacalao","gamba","mejillón","mejillon","boquerón","boqueron","sepia","calamar","dorada","lubina","sardina","caballa","pulpo","langostino","anchoa","rape"] },
  pasta:      { icon: "noodles",   color: "var(--c-cat-pasta)",      palabras: ["pasta","arroz","macarrón","macarron","espagueti","fideo","ramen","tallarín","tallarin","cous cous","quinoa","lasaña","lasana","ravioli","penne","gnocchi","orzo"] },
  panadería:  { icon: "bread",     color: "var(--c-cat-panaderia)",  palabras: ["pan","baguette","croissant","tostada","bollería","bolleria","bizcocho","muffin","brioche","chapata","pita","tortilla de harina"] },
  bebidas:    { icon: "cup",       color: "var(--c-cat-bebidas)",    palabras: ["agua","zumo","refresco","cerveza","vino","cola","leche vegetal","té","te","café","cafe","batido","soda","limonada","kombucha","sidra","cava","whisky","ron","ginebra","vermut"] },
  limpieza:   { icon: "spray",     color: "var(--c-cat-limpieza)",   palabras: ["detergente","lejía","lejia","suavizante","friegaplatos","bayeta","papel","servilleta","rollo","escoba","fregona","guante","bolsa basura","limpiacristales","desinfectante","ambientador","esponja"] },
  snacks:     { icon: "star",      color: "var(--c-cat-snacks)",     palabras: ["patatas fritas","galleta","chocolate","palomitas","cereal","nachos","gusanito","fruto seco","almendra","cacahuete","pistache","pistacho","anacardo","nuez","pipa","chicle","caramelo","chuche","gominola"] },
  congelados: { icon: "snowflake", color: "var(--c-cat-congelados)", palabras: ["pizza","helado","congelado","nugget","empanadilla","croqueta congelada","varitas"] },
  conservas:  { icon: "can",       color: "var(--c-cat-conservas)",  palabras: ["lata","atún en lata","atun en lata","garbanzos","lentejas","tomate frito","alubias","maíz en lata","mais en lata","fabada","cocido","sopa","caldo","escabeche"] },
};

const ORDEN_SUPERMERCADO = ["fruta","verduras","panadería","lácteos","carne","pescado","congelados","pasta","conservas","bebidas","snacks","limpieza","otros"];

function detectarCategoria(texto) {
  const lower = texto.toLowerCase();
  for (const [cat, data] of Object.entries(CATEGORIAS)) {
    if (data.palabras.some(p => lower.includes(p))) return cat;
  }
  return "otros";
}

/* ─── MASCOTA ─── */
const MASCOTA = {
  imgs: {
    feliz:    "img/macaron.png",
    soño:     "img/jellyfish.png",
    neutro:   "img/flan.png",
    energico: "img/soda.png",
    broche:   "img/broche.png",
  },
  frases: {
    add:         ["apuntado", "buena elección", "en la lista", "eso huele bien", "comprando en serio", "al carro", "anotado"],
    addRamen:    ["otra vez ramen?", "ramen gang", "así que ramen...", "cuántas veces esta semana?"],
    addChocolate:["sabía que ibas a poner eso", "chocolate... clásico", "sin juicios..."],
    check:       ["tachado", "uno menos", "eficiencia", "eso es", "sigue así"],
    completa:    ["lista completada", "misión cumplida", "todo comprado", "la nevera te lo agradece"],
    vacia:       ["lista vacía... de momento", "escribe algo arriba", "qué vamos a comer hoy?", "vacío total"],
    bienvenida:  ["hola, a comprar", "de vuelta", "lista lista para listar", "qué compramos?"],
    invitado:    ["modo invitado", "inicia sesión para guardar"],
  }
};

let mascotaTimer = null;

function mascotaReaccionar(evento, extra = "") {
  const bubble = document.getElementById("mascota-bubble");
  const img    = document.getElementById("mascota-img");
  if (!bubble || !img) return;

  let frases   = MASCOTA.frases[evento] || MASCOTA.frases.add;
  let nuevaImg = MASCOTA.imgs.neutro;

  if (evento === "add") {
    const low = extra.toLowerCase();
    if (low.includes("ramen") || low.includes("fideos") || low.includes("tallarín")) {
      frases   = MASCOTA.frases.addRamen;
      nuevaImg = MASCOTA.imgs.energico;
    } else if (low.includes("chocolate") || low.includes("galleta") || low.includes("chuch")) {
      frases   = MASCOTA.frases.addChocolate;
      nuevaImg = MASCOTA.imgs.soño;
    }
  } else if (evento === "completa")                     { nuevaImg = MASCOTA.imgs.feliz; }
    else if (evento === "bienvenida" || evento === "invitado") { nuevaImg = MASCOTA.imgs.broche; }

  const frase = frases[Math.floor(Math.random() * frases.length)];
  bubble.textContent = frase;
  img.src = nuevaImg;

  bubble.classList.remove("visible");
  void bubble.offsetWidth;
  bubble.classList.add("visible");

  img.classList.remove("wiggling");
  void img.offsetWidth;
  img.classList.add("wiggling");

  clearTimeout(mascotaTimer);
  mascotaTimer = setTimeout(() => bubble.classList.remove("visible"), 3000);
}

/* ─── CONFETTI ─── */
function lanzarConfetti() {
  const colores = ["#ffb3b3","#b3ffb3","#b3d4ff","#ffffb3","#ffb3ff","#ffd6a5"];
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
  { icon: "cake",    label: "dulce",   color: "#f9d4ed" },
];

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
    sBtn.style.display = "block";
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
    lBtn.style.display = "block";
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
}

function renderHome() {
  const lista    = data.listas.find(l => l.id === data.listaActiva) || data.listas[0];
  const titleEl  = document.getElementById("active-title");
  const listaHTML = document.getElementById("lista-html");
  if (!titleEl || !listaHTML) return;

  if (!lista) {
    titleEl.innerHTML = escapeHTML("sin lista");
    listaHTML.innerHTML = "";
    listaHTML.appendChild(crearEstadoVacio());
    renderProgreso(null);
    return;
  }

  // Título con icono SVG
  titleEl.innerHTML = `<span class="title-icon">${icon(lista.icon || "cart", 18)}</span>${escapeHTML(lista.titulo)}`;
  renderProgreso(lista);

  // Agrupar por categoría
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
    <p class="empty-title">la lista está vacía</p>
    <p class="empty-sub">escribe algo arriba</p>
  `;
  return div;
}

function crearItemEl(item, lista) {
  const div = document.createElement("div");
  div.className = `list-item ${item.check ? "checked" : ""} pop-in`;
  div.innerHTML = `
    <div class="item-checkbox">${item.check ? icon("check", 13) : ""}</div>
    <div class="item-text">${escapeHTML(item.texto)}</div>
    <button class="delete-btn" title="eliminar">×</button>
  `;

  div.querySelector(".item-checkbox").onclick = () => {
    item.check = !item.check;
    div.classList.add("checking");
    setTimeout(() => div.classList.remove("checking"), 400);
    save();
    if (item.check) mascotaReaccionar("check");
    checkListaCompleta(lista);
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
      <span class="lista-icon">${icon(l.icon || "cart", 28)}</span>
      <span class="lista-nombre">${escapeHTML(l.titulo)}</span>
      <span class="lista-count">${hechos}/${total}</span>
    `;
    btn.onclick = () => { data.listaActiva = l.id; save(); navegar("home"); };
    grid.appendChild(btn);
  });
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

/* ─── NAVEGACIÓN ─── */
function navegar(seccion) {
  document.querySelectorAll(".section").forEach(s => s.classList.remove("active"));
  const target = document.getElementById(seccion);
  if (target) target.classList.add("active");
  document.querySelectorAll("[data-section]").forEach(a => {
    a.classList.toggle("active-nav", a.dataset.section === seccion);
  });
  document.getElementById("nav-links")?.classList.remove("open");
  document.getElementById("overlay").style.display = "none";
}

document.querySelectorAll("[data-section]").forEach(a => {
  a.addEventListener("click", e => { e.preventDefault(); navegar(a.dataset.section); });
});

const hamb    = document.getElementById("hamburger");
const nav     = document.getElementById("nav-links");
const overlay = document.getElementById("overlay");
hamb.onclick    = () => { nav.classList.toggle("open"); overlay.style.display = "block"; };
overlay.onclick = () => { nav.classList.remove("open"); overlay.style.display = "none"; };

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
