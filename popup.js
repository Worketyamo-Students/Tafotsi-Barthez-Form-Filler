// Attacher un écouteur d'événement au formulaire lorsque la popup est ouverte
document.addEventListener("DOMContentLoaded", () => {
    const form = document.getElementById("dataForm");
    const status = document.getElementById("status");
  
    // Charger les données existantes dans le formulaire
    chrome.storage.local.get("formData", (data) => {
      if (data.formData) {
        // Pré-remplir les champs avec les données sauvegardées
        for (const [key, value] of Object.entries(data.formData)) {
          const input = document.querySelector(`[name="${key}"]`);
          if (input) input.value = value;
        }
      }
    });
  
    // Sauvegarder les données lorsque le formulaire est soumis
    form.addEventListener("submit", async (e) => {
      e.preventDefault(); // Empêcher le rechargement de la page
  
      const formData = new FormData(form); // Récupérer les données du formulaire
      const data = {};
  
      // Convertir FormData en objet JavaScript
      formData.forEach((value, key) => {
        data[key] = value;
      });
  
      // Sauvegarder les données dans le stockage local de Chrome
      await chrome.storage.local.set({ formData: data });
      status.textContent = "Données enregistrées avec succès !";
  
      // Réinitialiser le statut après 2 secondes
      setTimeout(() => {
        status.textContent = "";
      }, 2000);
    });
  });
  