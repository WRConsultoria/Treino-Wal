document.addEventListener("DOMContentLoaded", function () {
  console.log("✅ Script.js carregado e DOM content loaded.");

  const LAST_RESET_KEY = "last_checkin_reset_date";

  // ===============================
  // Alternância de Conteúdo (botões principais)
  // ===============================
  function setupContentToggle() {
    const toggleButtons = document.querySelectorAll(".btn-toggle-content");

    if (toggleButtons.length === 0) {
      console.warn('⚠️ Nenhum botão com a classe "btn-toggle-content" encontrado.');
    } else {
      console.log(`Encontrados ${toggleButtons.length} botões de alternância.`);
    }

    toggleButtons.forEach((button) => {
      button.addEventListener("click", function () {
        const targetId = this.dataset.target;
        const targetContent = document.getElementById(targetId);

        if (targetContent) {
          // Fecha qualquer outro conteúdo aberto
          document
            .querySelectorAll(".hidden-content.show-content")
            .forEach((openContent) => {
              if (openContent.id !== targetId) {
                openContent.classList.remove("show-content");
              }
            });

          // Alterna a visibilidade da área de conteúdo alvo
          targetContent.classList.toggle("show-content");
          console.log(`🔄 Conteúdo '${targetId}' visibilidade alternada.`);
        } else {
          console.error(
            `❌ Área de conteúdo com ID '${targetId}' não encontrada. Verifique o HTML.`
          );
        }
      });
    });
  }

  // ===============================
  // Alternância de Vídeos dos Exercícios
  // ===============================
  function setupVideoToggle() {
    const exerciseButtons = document.querySelectorAll(".exercise-name");

    if (exerciseButtons.length === 0) {
      console.warn("⚠️ Nenhum botão de exercício encontrado.");
    }

    exerciseButtons.forEach((button) => {
      button.addEventListener("click", function () {
        const video = this.nextElementSibling;

        if (video && video.classList.contains("exercise-video")) {
          video.classList.toggle("show");
          console.log(
            `🎥 Vídeo de '${this.textContent.trim()}' ${video.classList.contains("show") ? "aberto" : "fechado"
            }.`
          );
        } else {
          console.error("❌ Estrutura HTML incorreta para o botão de exercício.");
        }
      });
    });
  }

  // ===============================
  // Reset de Check-ins
  // ===============================
  function resetCheckins() {
    document.querySelectorAll(".checkin").forEach((checkbox) => {
      checkbox.checked = false;
    });

    // Limpa apenas os itens de check-in do localStorage
    for (let i = localStorage.length - 1; i >= 0; i--) {
      const key = localStorage.key(i);
      if (key.startsWith("checkin_")) {
        localStorage.removeItem(key);
      }
    }
    console.log("✅ Todos os check-ins foram resetados!");

    // Salva a data do último reset
    localStorage.setItem(
      LAST_RESET_KEY,
      new Date().toISOString().split("T")[0]
    );
  }

  // ===============================
  // Checagem de reset automático
  // ===============================
  function checkAndReset() {
    const now = new Date();
    const dayOfWeek = now.getDay(); // Domingo é 0
    const hour = now.getHours(); // Hora atual
    const lastResetDate = localStorage.getItem(LAST_RESET_KEY);
    const today = now.toISOString().split("T")[0];

    if (dayOfWeek === 0 && hour === 22 && lastResetDate !== today) {
      resetCheckins();
    }
  }

  // ===============================
  // Carregar e salvar estado dos check-ins
  // ===============================
  function setupCheckinLogic() {
    document.querySelectorAll("table").forEach((table, tIndex) => {
      table.querySelectorAll(".checkin").forEach((checkbox, iIndex) => {
        const key = `checkin_${tIndex}_${iIndex}`;
        checkbox.checked = localStorage.getItem(key) === "true";
        checkbox.addEventListener("change", function () {
          localStorage.setItem(key, this.checked);
        });
      });
    });
    console.log("📌 Lógica de check-in configurada e estados carregados.");
  }

  // ===============================
  // Dashboards e Upload de Arquivos
  // ===============================
  function setupDashboards() {
    // --- Gráfico de Exames (Exemplo: Colesterol) ---
    const ctxExames = document.getElementById('examesChart');
    if (ctxExames) {
      new Chart(ctxExames, {
        type: 'line',
        data: {
          labels: ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun'],
          datasets: [{
            label: 'Colesterol Total',
            data: [200, 190, 185, 180, 175, 170],
            borderColor: 'rgba(75, 192, 192, 1)',
            tension: 0.1
          },
          {
            label: 'Glicose',
            data: [95, 92, 90, 88, 85, 82],
            borderColor: 'rgba(255, 99, 132, 1)',
            tension: 0.1
          }]
        },
        options: {
          responsive: true,
          plugins: {
            legend: {
              position: 'top',
            },
            title: {
              display: true,
              text: 'Evolução de Exames'
            }
          }
        }
      });
    }

    // --- Gráfico de Bioimpedância ---
    const ctxBio = document.getElementById('bioimpedanciaChart');
    if (ctxBio) {
      new Chart(ctxBio, {
        type: 'bar',
        data: {
          labels: ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun'],
          datasets: [{
            label: '% Gordura Corporal',
            data: [25, 24, 23, 22, 21, 20],
            backgroundColor: 'rgba(54, 162, 235, 0.5)',
            borderColor: 'rgba(54, 162, 235, 1)',
            borderWidth: 1
          },
          {
            label: 'Massa Muscular (kg)',
            data: [60, 61, 62, 63, 64, 65],
            backgroundColor: 'rgba(153, 102, 255, 0.5)',
            borderColor: 'rgba(153, 102, 255, 1)',
            borderWidth: 1
          }]
        },
        options: {
          responsive: true,
          plugins: {
            legend: {
              position: 'top',
            },
            title: {
              display: true,
              text: 'Evolução Bioimpedância'
            }
          }
        }
      });
    }

    // --- Upload de Arquivos (Exames) ---
    const fileInput = document.getElementById('examFileInput');
    const fileList = document.getElementById('examFileList');

    if (fileInput && fileList) {
      fileInput.addEventListener('change', function (e) {
        handleFileUpload(e.target.files, fileList);
      });
    }

    // --- Upload de Arquivos (Bioimpedância) ---
    const bioFileInput = document.getElementById('bioFileInput');
    const bioFileList = document.getElementById('bioFileList');

    if (bioFileInput && bioFileList) {
      bioFileInput.addEventListener('change', function (e) {
        handleFileUpload(e.target.files, bioFileList);
      });
    }

    // Função auxiliar para lidar com upload de arquivos
    function handleFileUpload(files, listElement) {
      const fileArray = Array.from(files);

      fileArray.forEach(file => {
        const fileItem = document.createElement('div');
        fileItem.className = 'file-item';

        let icon = '📄'; // Default icon
        const ext = file.name.split('.').pop().toLowerCase();

        if (['jpg', 'jpeg', 'png', 'gif'].includes(ext)) icon = '🖼️';
        else if (ext === 'pdf') icon = '📕';
        else if (['doc', 'docx'].includes(ext)) icon = '📝';

        fileItem.innerHTML = `
          <span class="file-icon">${icon}</span>
          <span class="file-name">${file.name}</span>
        `;

        listElement.appendChild(fileItem);
      });
    }
  }

  // --- Execução das Funções ---
  setupContentToggle();
  setupVideoToggle();
  setupCheckinLogic();
  checkAndReset();
  setupDashboards();

  // --- PWA Service Worker Registration ---
  if ("serviceWorker" in navigator) {
    navigator.serviceWorker
      .register("./sw.js")
      .then((registration) => {
        console.log("Service Worker registered with scope:", registration.scope);
      })
      .catch((error) => {
        console.error("Service Worker registration failed:", error);
      });
  }

  // ===============================
  // Modal de Ampliação de Imagens
  // ===============================
  window.abrirModal = function (imagemSrc) {
    const modal = document.getElementById("modalImagem");
    const modalImg = document.getElementById("modalImg");
    if (modal && modalImg) {
      modalImg.src = imagemSrc;
      modal.classList.add("ativo");
      document.body.style.overflow = "hidden";
    }
  };

  window.fecharModal = function (event) {
    const modal = document.getElementById("modalImagem");
    if (event && event.target !== modal) return;
    if (modal) {
      modal.classList.remove("ativo");
      document.body.style.overflow = "auto";
    }
  };

  // Fechar modal ao clicar na imagem
  const modal = document.getElementById("modalImagem");
  if (modal) {
    modal.addEventListener("click", function (event) {
      if (event.target === this) {
        fecharModal();
      }
    });
  }

  // Fechar modal ao pressionar ESC
  document.addEventListener("keydown", function (event) {
    if (event.key === "Escape") {
      fecharModal();
    }
  });
  
  // ========== PWA Install Prompt (beforeinstallprompt) ==========
  let deferredPrompt = null;
  const btnInstall = document.getElementById('btnInstall');

  window.addEventListener('beforeinstallprompt', (e) => {
    // Prevent the mini-info bar from appearing on mobile
    e.preventDefault();
    deferredPrompt = e;
    if (btnInstall) {
      btnInstall.style.display = 'inline-block';
    }
  });

  if (btnInstall) {
    btnInstall.addEventListener('click', async () => {
      if (!deferredPrompt) return;
      deferredPrompt.prompt();
      const { outcome } = await deferredPrompt.userChoice;
      console.log('User choice on install prompt:', outcome);
      deferredPrompt = null;
      btnInstall.style.display = 'none';
    });
  }
});
