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

// ---------- Contact info (kept out of the raw HTML to slow down scrapers) ----------
// Built from parts at runtime rather than sitting as plain text in the source.
const emailParts = ["amitjhanzielle", "gmail.com"];
const emailEl = document.querySelector("#contact-email");
if (emailEl) {
    const email = `${emailParts[0]}@${emailParts[1]}`;
    emailEl.textContent = email;
    const link = document.createElement("a");
    link.href = `mailto:${email}`;
    link.textContent = email;
    emailEl.textContent = "";
    emailEl.appendChild(link);
}

const phoneParts = ["+63", "961", "572", "0802"];
const phoneEl = document.querySelector("#contact-phone");
if (phoneEl) {
    phoneEl.textContent = phoneParts.join(" ");
}

// ---------- Footer year ----------
const footerYear = document.querySelector("#footer-year");
if (footerYear) {
    footerYear.textContent = new Date().getFullYear();
}

// ---------- Tech Stack: messy on load, arranges on scroll ----------
const skillsSection = document.querySelector("#skills");
if (skillsSection) {
    const skillCards = skillsSection.querySelectorAll(".skill-card");

    skillCards.forEach((card, i) => {
        card.style.setProperty("--mdelay", (i % 14) * 0.09 + "s");
    });

    function randomOffset() {
        return {
            mx: (Math.random() * 120 - 60).toFixed(0) + "px",
            my: (Math.random() * 80 - 40).toFixed(0) + "px",
            mr: (Math.random() * 50 - 25).toFixed(0) + "deg",
        };
    }

    function applyOffset(card) {
        const { mx, my, mr } = randomOffset();
        card.style.setProperty("--mx", mx);
        card.style.setProperty("--my", my);
        card.style.setProperty("--mr", mr);
    }

    // Give every card an initial messy position before anything scrolls
    skillCards.forEach(applyOffset);

    function startFloating() {
        skillCards.forEach((card) => {
            if (card._floatInterval) return;
            applyOffset(card);
            card._floatInterval = setInterval(() => applyOffset(card), 1300 + Math.random() * 900);
        });
    }

    function stopFloating() {
        skillCards.forEach((card) => {
            clearInterval(card._floatInterval);
            card._floatInterval = null;
        });
    }

    const skillsObserver = new IntersectionObserver(
        (entries) => {
            entries.forEach((entry) => {
                skillsSection.classList.toggle("arranged", entry.isIntersecting);
                if (entry.isIntersecting) {
                    stopFloating();
                } else {
                    startFloating();
                }
            });
        },
        { threshold: 0.4 }
    );

    skillsObserver.observe(skillsSection);

    // Touch devices have no :hover state, so give skill cards a tap toggle
    const hasHoverForSkills = window.matchMedia("(hover: hover) and (pointer: fine)").matches;
    if (!hasHoverForSkills) {
        skillCards.forEach((card) => {
            card.addEventListener("click", () => {
                card.classList.toggle("tapped");
            });
        });
    }
}
const imageContainer = document.querySelector(".image-container");
if (imageContainer) {
    let glitchEndTimeout;

    function triggerGlitch(showBack) {
        imageContainer.classList.add("glitching");
        // Swap the actual image partway through the glitch burst so the
        // switch itself gets masked by the jitter/scanline noise.
        setTimeout(() => {
            imageContainer.classList.toggle("swapped", showBack);
        }, 220);

        clearTimeout(glitchEndTimeout);
        glitchEndTimeout = setTimeout(() => {
            imageContainer.classList.remove("glitching");
        }, 500);
    }

    const hasHover = window.matchMedia("(hover: hover) and (pointer: fine)").matches;

    if (hasHover) {
        imageContainer.addEventListener("mouseenter", () => triggerGlitch(true));
        imageContainer.addEventListener("mouseleave", () => triggerGlitch(false));
    } else {
        imageContainer.addEventListener("click", () => {
            triggerGlitch(!imageContainer.classList.contains("swapped"));
        });
    }

    // Keyboard users tabbing to the photo get the same effect
    imageContainer.addEventListener("focus", () => triggerGlitch(true));
    imageContainer.addEventListener("blur", () => triggerGlitch(false));
}