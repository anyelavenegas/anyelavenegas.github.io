const nav = document.querySelector("#mainNav");
const navLinks = document.querySelectorAll(".nav-link");
const sections = document.querySelectorAll("main section[id], header[id]");
const whatsappForm = document.querySelector("#whatsappForm");
const formStatus = document.querySelector("#formStatus");
const currentYear = document.querySelector("#currentYear");
const navbarCollapse = document.querySelector("#navbarMenu");
const navbarToggler = document.querySelector(".navbar-toggler");
const backToTop = document.querySelector("#backToTop");

if (currentYear) {
    currentYear.textContent = new Date().getFullYear();
}

const updateNavbarState = () => {
    if (!nav) return;
    nav.classList.toggle("is-compact", window.scrollY > 24);
};

// The active menu link follows the section crossing a band near the top of the
// viewport. IntersectionObserver avoids reading layout (offsetTop) from script,
// which would force expensive recalculations while the page is loading.
const setActiveLink = (id) => {
    navLinks.forEach((link) => {
        link.classList.toggle("active", link.getAttribute("href") === `#${id}`);
    });
};

if (sections.length) {
    const sectionObserver = new IntersectionObserver(
        (entries) => {
            entries.forEach((entry) => {
                if (entry.isIntersecting) setActiveLink(entry.target.id);
            });
        },
        { rootMargin: "-140px 0px -55% 0px" }
    );
    sections.forEach((section) => sectionObserver.observe(section));
}

const updateBackToTop = () => {
    if (!backToTop) return;
    backToTop.classList.toggle("visible", window.scrollY > 400);
};

navLinks.forEach((link) => {
    link.addEventListener("click", () => {
        if (navbarCollapse?.classList.contains("show") && navbarToggler) {
            navbarToggler.click();
        }
    });
});

let scrollTicking = false;

const onScroll = () => {
    updateNavbarState();
    updateBackToTop();
    scrollTicking = false;
};

window.addEventListener("scroll", () => {
    if (!scrollTicking) {
        scrollTicking = true;
        requestAnimationFrame(onScroll);
    }
}, { passive: true });

requestAnimationFrame(onScroll);

if (backToTop) {
    backToTop.addEventListener("click", () => {
        window.scrollTo({ top: 0, behavior: "smooth" });
    });
}

// Scroll reveal via IntersectionObserver
const revealObserver = new IntersectionObserver(
    (entries) => {
        entries.forEach((entry) => {
            if (entry.isIntersecting) {
                entry.target.classList.add("revealed");
                revealObserver.unobserve(entry.target);
            }
        });
    },
    { threshold: 0.1, rootMargin: "0px 0px -40px 0px" }
);

document.querySelectorAll(".reveal").forEach((el) => revealObserver.observe(el));

// WhatsApp form
if (whatsappForm) {
    whatsappForm.addEventListener("submit", (event) => {
        event.preventDefault();

        const formData = new FormData(whatsappForm);
        const nombre = formData.get("nombre")?.toString().trim();
        const telefono = formData.get("telefono")?.toString().trim();
        const servicio = formData.get("servicio")?.toString().trim();
        const mensaje = formData.get("mensaje")?.toString().trim();
        const whatsappNumber = whatsappForm.dataset.whatsapp;

        if (!nombre || !telefono || !mensaje || !whatsappNumber) {
            if (formStatus) {
                formStatus.textContent = "Complete todos los campos requeridos.";
            }
            return;
        }

        const lines = [
            "Hola, deseo solicitar una consulta.",
            `Nombre: ${nombre}`,
            `Teléfono: ${telefono}`,
        ];

        if (servicio) lines.push(`Tipo de consulta: ${servicio}`);
        lines.push(`Detalle: ${mensaje}`);

        if (formStatus) {
            formStatus.textContent = "Abriendo WhatsApp con su mensaje preparado…";
        }

        window.open(
            `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(lines.join("\n"))}`,
            "_blank",
            "noopener"
        );
    });
}
