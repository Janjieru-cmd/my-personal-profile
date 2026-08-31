const themeButton = document.getElementById("themebutton");

function setTheme(isDark) {
    document.body.classList.toggle("dark-mode", isDark);
    themeButton.textContent = isDark ? "Light Mode" : "Dark Mode";
    themeButton.setAttribute("aria-pressed", String(isDark));
    localStorage.setItem("darkMode", isDark ? "on" : "off");
}

// Restore the user's last choice on page load
setTheme(localStorage.getItem("darkMode") === "on");

themeButton.addEventListener("click", function () {
    setTheme(!document.body.classList.contains("dark-mode"));
});

// ---------- Active nav link on scroll ----------
const sections = document.querySelectorAll("main section[id]");
const navLinks = document.querySelectorAll(".nav-links a");

const sectionObserver = new IntersectionObserver(
    (entries) => {
        entries.forEach((entry) => {
            if (entry.isIntersecting) {
                const id = entry.target.getAttribute("id");
                navLinks.forEach((link) => {
                    link.classList.toggle("active", link.getAttribute("href") === `#${id}`);
                });
            }
        });
    },
    { rootMargin: "-45% 0px -50% 0px" }
);

sections.forEach((section) => sectionObserver.observe(section));

// ---------- Back to top button ----------
const backToTop = document.createElement("button");
backToTop.id = "back-to-top";
backToTop.type = "button";
backToTop.setAttribute("aria-label", "Back to top");
backToTop.textContent = "↑";
document.body.appendChild(backToTop);

window.addEventListener("scroll", () => {
    backToTop.classList.toggle("visible", window.scrollY > 500);
});

backToTop.addEventListener("click", () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
});

// ---------- Footer year ----------
const footerYear = document.querySelector("#footer-year");
if (footerYear) {
    footerYear.textContent = new Date().getFullYear();
}

// ---------- Profile photo tap-to-toggle (for touch devices) ----------
// On touch screens there's no real "hover" state to leave, so :hover
// alone gets stuck after a tap. This adds a click/tap toggle on top of it.
const imageContainer = document.querySelector(".image-container");
if (imageContainer) {
    imageContainer.addEventListener("click", () => {
        imageContainer.classList.toggle("swapped");
    });
}