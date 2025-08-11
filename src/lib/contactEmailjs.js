// Importar EmailJS
import emailjs from "@emailjs/browser";

// Configuración de EmailJS
const CONFIG = {
  serviceID: "service_vb0y0si",
  templateID: "template_lqbmf9g",
  autoReplyTemplateID: "template_eqbokyo",
  apiKey: "VMT6_BrM6ZsnKmyvN",
};
// Inicializar EmailJS
emailjs.init(CONFIG.apiKey);

document.addEventListener("DOMContentLoaded", function () {
  // ===============================================
  // OFUSCACIÓN DE EMAIL
  // ===============================================
  const emailReveal = document.getElementById("email-reveal");
  if (emailReveal) {
    // Email ofuscado con ROT13 - reemplaza con tu email en ROT13
    const obfuscatedEmail = "zngvnf@rwrzcyb.pbz"; // matias@ejemplo.com en ROT13

    function rot13(str) {
      return str.replace(/[A-Za-z]/g, function (char) {
        const start = char <= "Z" ? 65 : 97;
        return String.fromCharCode(
          ((char.charCodeAt(0) - start + 13) % 26) + start
        );
      });
    }

    emailReveal.addEventListener("click", function () {
      const realEmail = rot13(obfuscatedEmail);
      const link = document.createElement("a");
      link.href = `mailto:${realEmail}`;
      link.textContent = realEmail;
      link.className = "text-teal-600 hover:text-teal-700 transition-colors";
      this.replaceWith(link);
    });
  }

  // MANEJO DEL FORMULARIO CON DOBLE ENVÍO
  // ===============================================
  const form = document.getElementById("contact-form");
  const submitBtn = document.getElementById("submit-btn");
  const btnText = document.getElementById("btn-text");
  const statusDiv = document.getElementById("form-status");

  if (form) {
    form.addEventListener("submit", async function (e) {
      e.preventDefault();

      // Verificar honeypot (protección contra bots)
      const honeypotInput = form.querySelector('input[name="website"]');
      const honeypot = honeypotInput ? honeypotInput.value : "";
      if (honeypot) {
        console.log("Bot detectado, no se enviará el formulario");
        return;
      }

      // Validar que todos los campos requeridos estén llenos
      if (!form.checkValidity()) {
        form.reportValidity();
        return;
      }

      // Estado de carga
      submitBtn.disabled = true;
      if (btnText) {
        btnText.textContent = "Enviando...";
      }
      showStatus("Enviando mensaje...", "loading");

      try {
        // 1. PRIMER ENVÍO: Mensaje para TI (dueño del portfolio)
        console.log("📨 Enviando mensaje principal...");
        const mainEmailResult = await emailjs.sendForm(
          CONFIG.serviceID,
          CONFIG.templateID, // Template que recibe TU email
          form
        );
        console.log("✅ Email principal enviado:", mainEmailResult);

        // 2. SEGUNDO ENVÍO: Auto-respuesta para el usuario
        console.log("📧 Enviando auto-respuesta...");

        // Crear FormData con los datos del formulario + datos adicionales para auto-respuesta
        const formData = new FormData(form);
        const autoReplyData = {
          to_email: formData.get("user_email"), // Email del usuario (CRÍTICO)
          user_name: formData.get("user_name"),
          user_email: formData.get("user_email"),
          subject: formData.get("subject"),
          message: formData.get("message"),
          // Datos adicionales para el template de auto-respuesta
          reply_date: new Date().toLocaleDateString("es-ES"),
          owner_name: "Tu Nombre", // Cambia por tu nombre
        };

        const autoReplyResult = await emailjs.send(
          CONFIG.serviceID,
          CONFIG.autoReplyTemplateID, // Template de auto-respuesta
          autoReplyData
        );
        console.log("✅ Auto-respuesta enviada:", autoReplyResult);

        showStatus(
          "¡Mensaje enviado correctamente! Te responderé pronto.",
          "success"
        );
        form.reset();
      } catch (error) {
        console.error("❌ Error al enviar emails:", error);
        showStatus(
          "Error al enviar el mensaje. Por favor, inténtalo de nuevo o contacta directamente por email.",
          "error"
        );
      } finally {
        // Restaurar botón
        submitBtn.disabled = false;
        if (btnText) {
          btnText.textContent = "Enviar mensaje";
        }
      }
    });
  }

  // Función para mostrar mensajes de estado
  function showStatus(message, type) {
    const typeStyles = {
      success:
        "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-200 border border-green-200 dark:border-green-800",
      error:
        "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-200 border border-red-200 dark:border-red-800",
      loading:
        "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-200 border border-blue-200 dark:border-blue-800",
    };

    if (!statusDiv) return;

    statusDiv.className = `mb-4 p-4 rounded-lg flex items-center gap-2 ${typeStyles[type]}`;

    if (type === "loading") {
      statusDiv.innerHTML = `
        <div class="animate-spin rounded-full h-4 w-4 border-b-2 border-current"></div>
        ${message}
      `;
    } else {
      const icon = type === "success" ? "✅" : "❌";
      statusDiv.innerHTML = `${icon} ${message}`;
    }

    statusDiv.classList.remove("hidden");

    // Auto-ocultar después de 5 segundos (excepto loading)
    if (type !== "loading") {
      setTimeout(() => {
        statusDiv.classList.add("hidden");
      }, 5000);
    }
  }
});
