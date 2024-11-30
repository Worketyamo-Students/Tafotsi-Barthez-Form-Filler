// Fonction principale pour remplir automatiquement le formulaire
function autofillForm(data) {
    for (const [key, value] of Object.entries(data)) {
      // Trouver l'élément correspondant dans le formulaire
      const field = document.querySelector(`[name="${key}"]`);
      if (field) {
        // Gérer différents types de champs
        if (field.type === "file") {
          console.warn(`Le champ ${key} nécessite un téléchargement manuel.`);
        } else if (field.type === "checkbox" || field.type === "radio") {
          field.checked = value === "on";
        } else {
          field.value = value;
        }
      }
    }
  }
  
  // Charger les données depuis le stockage local et remplir le formulaire
  chrome.storage.local.get("formData", ({ formData }) => {
    if (formData) {
      autofillForm(formData);
    } else {
      console.warn("Aucune donnée disponible pour remplir le formulaire.");
    }
  });
  
  // Optionnel : Ajouter un écouteur pour détecter les modifications dynamiques du formulaire
  const observer = new MutationObserver(() => {
    chrome.storage.local.get("formData", ({ formData }) => {
      if (formData) autofillForm(formData);
    });
  });
  
  // Observer les changements dans le DOM pour les formulaires dynamiques
  observer.observe(document.body, { childList: true, subtree: true });
  