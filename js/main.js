const nav = document.querySelector("#mainNav");
const navLinks = document.querySelectorAll(".nav-link");
const sections = document.querySelectorAll("main section[id], header[id]");
const whatsappForm = document.querySelector("#whatsappForm");
const formStatus = document.querySelector("#formStatus");
const currentYear = document.querySelector("#currentYear");
const navbarCollapse = document.querySelector("#navbarMenu");
const navbarToggler = document.querySelector(".navbar-toggler");

if (currentYear) {
    currentYear.textContent = new Date().getFullYear();
}

const updateNavbarState = () => {
    if (!nav) {
        return;
    }

    nav.classList.toggle("is-compact", window.scrollY > 24);
};

const updateActiveLink = () => {
    const offset = window.scrollY + 140;

    sections.forEach((section) => {
        const top = section.offsetTop;
        const bottom = top + section.offsetHeight;

        if (offset >= top && offset < bottom) {
            navLinks.forEach((link) => {
                const isActive = link.getAttribute("href") === `#${section.id}`;
                link.classList.toggle("active", isActive);
            });
        }
    });
};

navLinks.forEach((link) => {
    link.addEventListener("click", () => {
        if (navbarCollapse && navbarCollapse.classList.contains("show") && navbarToggler) {
            navbarToggler.click();
        }
    });
});

window.addEventListener("scroll", () => {
    updateNavbarState();
    updateActiveLink();
});

updateNavbarState();
updateActiveLink();

if (whatsappForm) {
    whatsappForm.addEventListener("submit", (event) => {
        event.preventDefault();

        const formData = new FormData(whatsappForm);
        const nombre = formData.get("nombre")?.toString().trim();
        const telefono = formData.get("telefono")?.toString().trim();
        const mensaje = formData.get("mensaje")?.toString().trim();
        const whatsappNumber = whatsappForm.dataset.whatsapp;

        if (!nombre || !telefono || !mensaje || !whatsappNumber) {
            if (formStatus) {
                formStatus.textContent = "Complete todos los campos y verifique el numero de WhatsApp configurado.";
            }
            return;
        }

        const text = [
            "Hola, deseo solicitar una consulta.",
            `Nombre: ${nombre}`,
            `Telefono: ${telefono}`,
            `Detalle: ${mensaje}`
        ].join("\n");

        if (formStatus) {
            formStatus.textContent = "Abriendo WhatsApp con su mensaje preparado...";
        }

        window.open(`https://wa.me/${whatsappNumber}?text=${encodeURIComponent(text)}`, "_blank", "noopener");
    });
}