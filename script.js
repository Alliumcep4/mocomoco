/* ============================================================
   ==================== VARIABLES GLOBALES =====================
   ============================================================ */

let listas = JSON.parse(localStorage.getItem("listas")) || [
    { id: 1, titulo: "Mi primera lista", items: [] }
];

let listaActiva = parseInt(localStorage.getItem("listaActiva")) || 1;

let premium = false; // Cambia a true para listas ilimitadas


/* ============================================================
   ======================= GUARDAR DATOS =======================
   ============================================================ */

function guardarDatos() {
    localStorage.setItem("listas", JSON.stringify(listas));
    localStorage.setItem("listaActiva", listaActiva);
}


/* ============================================================
   ========================= INICIO ============================
   ============================================================ */

document.addEventListener("DOMContentLoaded", () => {
    setupNavegacion();
    setupSidebar();
    renderListaCards();
    renderHome();

    // Botón fijo de nueva lista
    const fixedBtn = document.getElementById("add-list-btn");
    if (fixedBtn) fixedBtn.onclick = () => crearLista();
});


/* ============================================================
   ================= NAVEGACIÓN ENTRE SECCIONES ================
   ============================================================ */

function setupNavegacion() {
    const links = document.querySelectorAll(".nav-links a");
    const secciones = document.querySelectorAll(".section");
    const nav = document.querySelector(".nav-links");
    const overlay = document.querySelector(".overlay");

    links.forEach(link => {
        link.addEventListener("click", e => {
            e.preventDefault();

            const objetivo = link.dataset.section;
            secciones.forEach(s => s.classList.remove("active"));
            document.getElementById(objetivo).classList.add("active");

            // Cerrar menú lateral
            nav.classList.remove("open");
            overlay.style.display = "none";
            document.body.classList.remove("menu-open");
        });
    });
}



/* ============================================================
   ==================== SECCIÓN: LISTAS ========================
   ============================================================ */

function renderListaCards() {
    const cont = document.getElementById("multi-lists-container");
    cont.innerHTML = "";

    listas.forEach(lista => {
        const card = document.createElement("div");
        card.className = "list-card";

        card.innerHTML = `
            <div class="list-card-title">${lista.titulo}</div>
            <div class="list-preview">
                ${
                    lista.items.length === 0
                        ? "<span>Vacía...</span>"
                        : lista.items.slice(0, 3).map(i => `<span>${i.texto}</span>`).join("")
                }
            </div>
            <button class="open-list-btn">Abrir</button>
            <button class="rename-btn">Cambiar nombre</button>
            <button class="delete-btn">×</button>
        `;

        const titleDiv = card.querySelector(".list-card-title");
        const renameBtn = card.querySelector(".rename-btn");

        renameBtn.addEventListener("click", () => {
            const input = document.createElement("input");
            input.type = "text";
            input.value = lista.titulo;

            input.style.width = "100%";
            input.style.fontSize = "12px";
            input.style.padding = "4px";
            input.style.borderRadius = "8px";
            input.style.border = "2px solid var(--color-input-border)";

            titleDiv.replaceWith(input);
            input.focus();

            const guardar = () => {
                lista.titulo = input.value.trim() || lista.titulo;
                guardarDatos();
                renderListaCards();
            };

            input.addEventListener("keydown", e => { if (e.key === "Enter") guardar(); });
            input.addEventListener("blur", guardar);
        });

        card.querySelector(".open-list-btn").addEventListener("click", () => {
            listaActiva = lista.id;
            guardarDatos();
            renderHome();
        });

        card.querySelector(".delete-btn").addEventListener("click", () => eliminarLista(lista.id));

        cont.appendChild(card);
    });

    // Límite si no es premium
    const fixedBtn = document.getElementById("add-list-btn");
    if (fixedBtn) fixedBtn.disabled = !premium && listas.length >= 3;
}

function crearLista() {
    if (!premium && listas.length >= 3) {
        alert("Máximo 3 listas. Suscríbete a Premium para más.");
        return;
    }

    const id = Date.now();
    const nueva = { id, titulo: `Lista ${listas.length + 1}`, items: [] };

    listas.push(nueva);
    listaActiva = id;
    guardarDatos();

    renderListaCards();
    renderHome();
}

function eliminarLista(id) {
    if (listas.length === 1) {
        alert("No puedes eliminar la única lista.");
        return;
    }

    listas = listas.filter(l => l.id !== id);
    if (listaActiva === id) listaActiva = listas[0].id;

    guardarDatos();
    renderListaCards();
    renderHome();
}



/* ============================================================
   ========================= HOME ==============================
   ============================================================ */

function renderHome() {
    const lista = listas.find(l => l.id === listaActiva);
    if (!lista) return;

    const homeTitle = document.querySelector(".list-title");
    if (homeTitle) homeTitle.textContent = lista.titulo;

    const cont = document.getElementById("lista");
    cont.innerHTML = "";

    lista.items.forEach((item, index) => {
        const div = document.createElement("div");
        div.className = `list-item ${item.check ? "checked" : ""}`;

        div.innerHTML = `
            <div class="item-checkbox"></div>
            <div class="item-text">${item.texto}</div>
            <button class="delete-btn">×</button>
        `;

        div.querySelector(".item-checkbox").addEventListener("click", () => {
            item.check = !item.check;
            guardarDatos();
            renderHome();
        });

        div.querySelector(".delete-btn").addEventListener("click", () => {
            lista.items.splice(index, 1);
            guardarDatos();
            renderHome();
        });

        cont.appendChild(div);
    });

    setupHomeInput(lista);
    setupReset(lista);
}

function setupHomeInput(lista) {
    const input = document.getElementById("item");
    const btn = document.getElementById("add");

    btn.onclick = () => añadirItem(lista);
    input.onkeydown = e => { if (e.key === "Enter") añadirItem(lista); };
}

function añadirItem(lista) {
    const input = document.getElementById("item");
    const texto = input.value.trim();
    if (texto === "") return;

    lista.items.push({ texto, check: false });
    input.value = "";
    guardarDatos();
    renderHome();
}

function setupReset(lista) {
    const resetBtn = document.getElementById("reset-btn");
    resetBtn.onclick = () => {
        if (confirm("¿Deseas borrar todos los items de la lista actual?")) {
            lista.items = [];
            guardarDatos();
            renderHome();
        }
    };
}



/* ============================================================
   ==================== SIDEBAR / HAMBURGUESA ==================
   ============================================================ */

function setupSidebar() {
    const hamb = document.getElementById("hamburger");
    const nav = document.querySelector(".nav-links");
    const overlay = document.getElementById("overlay");
    const mobileBreakpoint = 480;

    // Evitar cierre al hacer clic dentro
    nav.addEventListener("click", e => e.stopPropagation());

    // Abrir/cerrar menú
    hamb.addEventListener("click", e => {
        e.stopPropagation();

        const isOpen = nav.classList.toggle("open");
        overlay.style.display = isOpen && window.innerWidth <= mobileBreakpoint ? "block" : "none";
        document.body.classList.toggle("menu-open", isOpen);
    });

    // Cerrar al click fuera
    document.addEventListener("click", e => {
        if (nav.classList.contains("open") && !nav.contains(e.target) && e.target !== hamb) {
            nav.classList.remove("open");
            overlay.style.display = "none";
            document.body.classList.remove("menu-open");
        }
    });

    // Cerrar tocando el overlay
    overlay.addEventListener("click", () => {
        nav.classList.remove("open");
        overlay.style.display = "none";
        document.body.classList.remove("menu-open");
    });

    // Reset al redimensionar
    window.addEventListener("resize", () => {
        if (window.innerWidth > mobileBreakpoint) {
            nav.classList.remove("open");
            overlay.style.display = "none";
            document.body.classList.remove("menu-open");
        }
    });

    // 🔥 IMPORTANTE: forzar estado inicial limpio SIEMPRE
    nav.classList.remove("open");
    overlay.style.display = "none";
    document.body.classList.remove("menu-open");
}
