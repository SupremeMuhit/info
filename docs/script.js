document.addEventListener("DOMContentLoaded", () => {
  const sidebar = document.getElementById("sidebar");
  const menuBtn = document.getElementById("menuBtn");
  const closeSidebarBtn = document.getElementById("closeSidebar");
  const overlay = document.getElementById("overlay");

  function updateToggleIcons(isCollapsed) {
    const iconMenu = document.querySelector('.icon-menu');
    const iconArrowRight = document.querySelector('.icon-arrow-right');
    const iconArrowLeft = document.querySelector('.icon-arrow-left');
    const toggleBtn = document.getElementById('sidebarToggle');
    
    if (!toggleBtn) return;

    // Reset all first
    if(iconMenu) iconMenu.style.display = 'none';
    if(iconArrowRight) iconArrowRight.style.display = 'none';
    if(iconArrowLeft) iconArrowLeft.style.display = 'none';

    if (window.innerWidth > 768) {
      // Desktop Logic
      if (isCollapsed) {
        // Collapsed state: Show Menu by default, Arrow Right on hover
        if(iconMenu) iconMenu.style.display = 'block';
        
        toggleBtn.onmouseenter = () => {
          if(iconMenu) iconMenu.style.display = 'none';
          if(iconArrowRight) iconArrowRight.style.display = 'block';
        };
        
        toggleBtn.onmouseleave = () => {
          if(iconArrowRight) iconArrowRight.style.display = 'none';
          if(iconMenu) iconMenu.style.display = 'block';
        };
      } else {
        // Expanded state: Show Arrow Left always
        if(iconArrowLeft) iconArrowLeft.style.display = 'block';
        
        // Clear hover effects for expanded state
        toggleBtn.onmouseenter = null;
        toggleBtn.onmouseleave = null;
      }
    } else {
      // Mobile Logic
      const isActive = sidebar.classList.contains('active');
      if (isActive) {
        if(iconArrowLeft) iconArrowLeft.style.display = 'block';
      } else {
        if(iconMenu) iconMenu.style.display = 'block';
      }
      toggleBtn.onmouseenter = null;
      toggleBtn.onmouseleave = null;
    }
  }

  function toggleSidebar() {
    if (window.innerWidth > 768) {
      // Desktop: Toggle collapse state
      const container = document.querySelector('.app-container');
      container.classList.toggle('sidebar-collapsed');
      
      const isCollapsed = container.classList.contains('sidebar-collapsed');
      // Save state
      localStorage.setItem('sidebarCollapsed', isCollapsed);
      updateToggleIcons(isCollapsed);
    } else {
      // Mobile: Toggle active state
      sidebar.classList.toggle('active');
      overlay.classList.toggle('active');
      
      const isActive = sidebar.classList.contains('active');
      if (isActive) {
        document.body.style.overflow = 'hidden';
      } else {
        document.body.style.overflow = '';
      }
      updateToggleIcons(false); 
    }
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

  // Initialize
  const container = document.querySelector('.app-container');
  
  if (window.innerWidth > 768) {
    // Check saved state or default to collapsed
    const savedCollapsed = localStorage.getItem('sidebarCollapsed');
    // Default to true (collapsed) if not set, or if set to 'true'
    const shouldBeCollapsed = savedCollapsed === null ? true : savedCollapsed === 'true';
    
    if (shouldBeCollapsed) {
      container.classList.add('sidebar-collapsed');
    } else {
      container.classList.remove('sidebar-collapsed');
    }
    updateToggleIcons(shouldBeCollapsed);
  } else {
    // Mobile: Remove sidebar-collapsed class
    container.classList.remove('sidebar-collapsed');
    updateToggleIcons(false);
  }

  const sidebarToggle = document.getElementById('sidebarToggle');
  if (sidebarToggle) {
    sidebarToggle.addEventListener('click', toggleSidebar);
  }

  if (menuBtn) {
    menuBtn.addEventListener('click', toggleSidebar);
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
  
  // Language Toggle Logic with Custom Modal
  const langToggle = document.getElementById("langToggle");
  const langOptions = document.querySelectorAll(".lang-option");

  // Inject Language Modal HTML
  if (!document.getElementById("languageModal")) {
    const langModalHTML = `
      <div id="languageModal" class="modal">
        <div class="modal-content">
          <h2 class="modal-title">YOU FOOL🫵</h2>
          <p style="color: var(--text-secondary); margin-bottom: 1.5rem;">Those who don't know English have no rights to see this Supreme site!</p>
          <div class="modal-buttons">
            <button id="langOkBtn" class="modal-btn btn-unlock">OK</button>
          </div>
        </div>
      </div>
    `;
    document.body.insertAdjacentHTML("beforeend", langModalHTML);
  }

  const langModal = document.getElementById("languageModal");
  const langOkBtn = document.getElementById("langOkBtn");

  if (langOptions.length > 0) {
    langOptions.forEach(option => {
      option.addEventListener("click", () => {
        const lang = option.getAttribute("data-lang");
        
        if (lang === "bn") {
          // Show modal for BN
          langModal.classList.add("active");
        } else {
          // Switch to EN (already selected, do nothing or add visual feedback)
          langOptions.forEach(opt => opt.classList.remove("lang-option-active"));
          option.classList.add("lang-option-active");
        }
      });
    });
  }

  if (langOkBtn) {
    langOkBtn.addEventListener("click", () => {
      langModal.classList.remove("active");
    });
  }

  // Close on click outside
  if (langModal) {
    langModal.addEventListener("click", (e) => {
      if (e.target === langModal) {
        langModal.classList.remove("active");
      }
    });
  }

  // Get Started and About Me Popups
  const getStartedBtn = document.getElementById("getStartedBtn");
  const aboutMeBtn = document.getElementById("aboutMeBtn");

  // Inject Get Started Modal HTML
  if (!document.getElementById("getStartedModal")) {
    const getStartedModalHTML = `
      <div id="getStartedModal" class="modal">
        <div class="modal-content image-modal-content">
          <button id="closeGetStartedBtn" class="close-modal-btn">✖</button>
          <img src="https://github.com/SupremeMuhit/site/blob/main/assets/get_started.webp?raw=true" alt="Get Started">
        </div>
      </div>
    `;
    document.body.insertAdjacentHTML("beforeend", getStartedModalHTML);
  }

  const getStartedModal = document.getElementById("getStartedModal");
  const closeGetStartedBtn = document.getElementById("closeGetStartedBtn");
  const getStartedAudio = new Audio("https://github.com/SupremeMuhit/site/raw/refs/heads/main/assets/get_started.mp3");

  if (getStartedBtn) {
    getStartedBtn.addEventListener("click", (e) => {
      e.preventDefault();
      getStartedModal.classList.add("active");
      getStartedAudio.play();
    });
  }

  if (closeGetStartedBtn) {
    closeGetStartedBtn.addEventListener("click", () => {
      getStartedModal.classList.remove("active");
      getStartedAudio.pause();
      getStartedAudio.currentTime = 0;
    });
  }

  // Close on click outside
  if (getStartedModal) {
    getStartedModal.addEventListener("click", (e) => {
      if (e.target === getStartedModal) {
        getStartedModal.classList.remove("active");
        getStartedAudio.pause();
        getStartedAudio.currentTime = 0;
      }
    });
  }

  // About Me Modal
  if (!document.getElementById("aboutMeModal")) {
    const aboutMeModalHTML = `
      <div id="aboutMeModal" class="modal">
        <div class="modal-content">
          <h2 class="modal-title">About Me</h2>
          <p style="color: var(--text-secondary); margin-bottom: 1rem; line-height: 1.6;">
            I am not a developer, not a content creator even I do not know to make websites, I am just a random person.
            And this site is random, have random things.
          </p>
          <p style="color: var(--text-secondary); margin-bottom: 1.5rem; line-height: 1.6;">
            <strong style="color: var(--text-primary); font-weight: 700;">This site is a shit, it is made of shit, you are seeing a shit, and you are a shit</strong>
          </p>
          <div class="modal-buttons">
            <button id="aboutMeOkBtn" class="modal-btn btn-unlock">OK</button>
          </div>
        </div>
      </div>
    `;
    document.body.insertAdjacentHTML("beforeend", aboutMeModalHTML);
  }

  const aboutMeModal = document.getElementById("aboutMeModal");
  const aboutMeOkBtn = document.getElementById("aboutMeOkBtn");

  if (aboutMeBtn) {
    aboutMeBtn.addEventListener("click", (e) => {
      e.preventDefault();
      aboutMeModal.classList.add("active");
    });
  }

  if (aboutMeOkBtn) {
    aboutMeOkBtn.addEventListener("click", () => {
      aboutMeModal.classList.remove("active");
    });
  }

  // Close on click outside
  if (aboutMeModal) {
    aboutMeModal.addEventListener("click", (e) => {
      if (e.target === aboutMeModal) {
        aboutMeModal.classList.remove("active");
      }
    });
  }
});
