// Menu toggle
const menuButton = document.querySelector(".menu-button");
const menu = document.querySelector("#primary-nav");

menuButton.addEventListener("click", () => {
  menu.classList.toggle("hide");
});

function handleResize() {
  if (window.innerWidth > 1000) {
    menu.classList.remove("hide");
  } else {
    menu.classList.add("hide");
  }
}

handleResize();
window.addEventListener("resize", handleResize);

// Image viewer (modal)
function viewerTemplate(src, alt) {
  return `
    <img src="${src}" alt="${alt}">
    <button class="close-viewer" aria-label="Close viewer">X</button>
  `;
}

const modal = document.createElement("dialog");
modal.className = "viewer";
document.body.appendChild(modal);

const gallery = document.querySelector(".gallery");

gallery.addEventListener("click", (event) => {
  const img = event.target.closest("img");
  if (!img) return;

  const smallSrc = img.getAttribute("src") || "";
  const alt = img.getAttribute("alt") || "Image";

  let largeSrc = smallSrc;
  if (smallSrc.includes("-sm.")) {
    const ext = smallSrc.slice(smallSrc.lastIndexOf(".")); 
    const base = smallSrc.split("-")[0];
    largeSrc = `${base}-full${ext}`;
  }

  modal.innerHTML = viewerTemplate(largeSrc, alt);
  modal.showModal();

  modal.querySelector(".close-viewer")
       .addEventListener("click", () => modal.close());

  modal.addEventListener("click", (e) => {
    if (e.target === modal) modal.close();
  }, { once: true });
});
