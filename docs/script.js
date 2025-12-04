document.addEventListener("DOMContentLoaded", () => {
  const sidebar = document.getElementById("sidebar");
  const menuBtn = document.getElementById("menuBtn");
  const closeSidebarBtn = document.getElementById("closeSidebar");
  const overlay = document.getElementById("overlay");

  function openSidebar() {
    sidebar.classList.add("active");
    overlay.classList.add("active");
    document.body.style.overflow = "hidden"; // Prevent scrolling when sidebar is open
  }

  function closeSidebar() {
    if (window.innerWidth > 768) {
      // Desktop: Collapse sidebar
      document
        .querySelector(".app-container")
        .classList.add("sidebar-collapsed");
    } else {
      // Mobile: Hide sidebar
      sidebar.classList.remove("active");
      overlay.classList.remove("active");
      document.body.style.overflow = "";
    }
  }

  if (menuBtn) {
    menuBtn.addEventListener("click", openSidebar);
  }

  if (closeSidebarBtn) {
    closeSidebarBtn.addEventListener("click", closeSidebar);
  }

  if (overlay) {
    overlay.addEventListener("click", closeSidebar);
  }

  // Close sidebar when pressing Escape key
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") {
      if (window.innerWidth <= 768 && sidebar.classList.contains("active")) {
        closeSidebar();
      } else if (
        window.innerWidth > 768 &&
        !document
          .querySelector(".app-container")
          .classList.contains("sidebar-collapsed")
      ) {
        closeSidebar();
      }
    }
  });

  // Desktop Sidebar Toggle
  const desktopSidebarToggle = document.getElementById("desktopSidebarToggle");
  const appContainer = document.querySelector(".app-container");

  if (desktopSidebarToggle) {
    desktopSidebarToggle.addEventListener("click", () => {
      // Since button is only visible when collapsed, clicking it means OPEN
      appContainer.classList.remove("sidebar-collapsed");
    });
  }

  // Discord Copy to Clipboard
  const discordCard = document.getElementById("discordCard");
  const discordUsername = document.getElementById("discordUsername");
  const copyHint = document.querySelector(".copy-hint");

  if (discordCard && discordUsername) {
    discordCard.addEventListener("mouseenter", () => {
      if (copyHint) copyHint.style.display = "block";
    });

    discordCard.addEventListener("mouseleave", () => {
      if (copyHint) {
        copyHint.style.display = "none";
        copyHint.textContent = "Click to copy"; // Reset text
      }
    });

    discordCard.addEventListener("click", () => {
      const textToCopy = discordUsername.textContent;
      navigator.clipboard
        .writeText(textToCopy)
        .then(() => {
          if (copyHint) copyHint.textContent = "Copied!";
        })
        .catch((err) => {
          console.error("Failed to copy text: ", err);
        });
    });
  }

  // Secret Vault Password Logic
  const secretVaultCard = document.getElementById("secretVaultCard");
  const secretVaultSidebarLink = document.getElementById(
    "secretVaultSidebarLink"
  );

  // Inject Modal HTML
  if (!document.getElementById("passwordModal")) {
    const modalHTML = `
            <div id="passwordModal" class="modal">
                <div class="modal-content">
                    <h2 class="modal-title">Secret Vault</h2>
                    <p style="color: var(--text-secondary); margin-bottom: 1.5rem;">Enter password to unlock</p>
                    <input type="password" id="vaultPassword" class="modal-input" placeholder="Password">
                    <p id="passwordError" class="error-msg">Incorrect password</p>
                    <div class="modal-buttons">
                        <button id="cancelBtn" class="modal-btn btn-cancel">Cancel</button>
                        <button id="unlockBtn" class="modal-btn btn-unlock">Unlock</button>
                    </div>
                </div>
            </div>
        `;
    document.body.insertAdjacentHTML("beforeend", modalHTML);
  }

  const modal = document.getElementById("passwordModal");
  const passwordInput = document.getElementById("vaultPassword");
  const unlockBtn = document.getElementById("unlockBtn");
  const cancelBtn = document.getElementById("cancelBtn");
  const errorMsg = document.getElementById("passwordError");

  const openModal = (e) => {
    e.preventDefault();
    modal.classList.add("active");
    passwordInput.value = "";
    errorMsg.style.display = "none";
    passwordInput.focus();
  };

  const closeModal = () => {
    modal.classList.remove("active");
  };

  const checkPassword = () => {
    if (passwordInput.value === "SupremeMuhit is goated") {
      window.location.href = "vault.html";
    } else {
      errorMsg.style.display = "block";
    }
  };

  if (secretVaultCard) secretVaultCard.addEventListener("click", openModal);
  if (secretVaultSidebarLink)
    secretVaultSidebarLink.addEventListener("click", openModal);

  if (unlockBtn) unlockBtn.addEventListener("click", checkPassword);
  if (cancelBtn) cancelBtn.addEventListener("click", closeModal);

  // Close on click outside
  if (modal) {
    modal.addEventListener("click", (e) => {
      if (e.target === modal) closeModal();
    });
  }

  // Handle Enter key
  if (passwordInput) {
    passwordInput.addEventListener("keypress", (e) => {
      if (e.key === "Enter") checkPassword();
    });
  }

  // Vault Page Security (Double Password)
  const vaultContent = document.getElementById("vaultContent");
  if (vaultContent) {
    // We are on the vault page
    // Reuse the modal structure but with specific logic
    if (!document.getElementById("passwordModal")) {
      const modalHTML = `
            <div id="passwordModal" class="modal">
                <div class="modal-content">
                    <h2 class="modal-title">Security Check</h2>
                    <p style="color: var(--text-secondary); margin-bottom: 1.5rem;">Enter the second password to access the vault.</p>
                    <input type="password" id="vaultPassword" class="modal-input" placeholder="Password">
                    <p id="passwordError" class="error-msg">Incorrect password</p>
                    <div class="modal-buttons">
                        <button id="cancelBtn" class="modal-btn btn-cancel">Exit</button>
                        <button id="unlockBtn" class="modal-btn btn-unlock">Unlock</button>
                    </div>
                </div>
            </div>
        `;
      document.body.insertAdjacentHTML("beforeend", modalHTML);
    }

    const modal = document.getElementById("passwordModal");
    const passwordInput = document.getElementById("vaultPassword");
    const unlockBtn = document.getElementById("unlockBtn");
    const cancelBtn = document.getElementById("cancelBtn");
    const errorMsg = document.getElementById("passwordError");

    // Open modal immediately
    modal.classList.add("active");
    if (passwordInput) passwordInput.focus();

    const checkSecondPassword = () => {
      if (passwordInput.value === "SupremeMuhit is really goated") {
        modal.classList.remove("active");
        vaultContent.style.display = "block";
      } else {
        errorMsg.style.display = "block";
      }
    };

    const exitVault = () => {
      window.location.href = "index.html";
    };

    if (unlockBtn) unlockBtn.onclick = checkSecondPassword; // Override existing listeners
    if (cancelBtn) cancelBtn.onclick = exitVault;

    // Prevent closing by clicking outside or escape for this specific security check
    if (modal) {
      modal.onclick = (e) => {
        if (e.target === modal) {
          // Do nothing or shake modal
        }
      };
    }

    if (passwordInput) {
      passwordInput.onkeypress = (e) => {
        if (e.key === "Enter") checkSecondPassword();
      };
    }
  }
  // Theme Toggle Logic
  const themeToggle = document.getElementById("themeToggle");
  const sunIcon = document.querySelector(".sun-icon");
  const moonIcon = document.querySelector(".moon-icon");
  const body = document.body;

  // Check for saved theme preference or system preference
  const savedTheme = localStorage.getItem("theme");

  // Function to set theme
  const setTheme = (theme) => {
    if (theme === "light") {
      body.classList.add("light-mode");
      if (sunIcon) sunIcon.style.display = "none";
      if (moonIcon) moonIcon.style.display = "block";
      localStorage.setItem("theme", "light");
    } else {
      body.classList.remove("light-mode");
      if (sunIcon) sunIcon.style.display = "block";
      if (moonIcon) moonIcon.style.display = "none";
      localStorage.setItem("theme", "dark");
    }
  };

  // Initialize theme
  if (savedTheme) {
    setTheme(savedTheme);
  } else {
    // Default to dark
    setTheme("dark");
  }

  if (themeToggle) {
    themeToggle.addEventListener("click", () => {
      const isLight = body.classList.contains("light-mode");
      setTheme(isLight ? "dark" : "light");
    });
  }
});
