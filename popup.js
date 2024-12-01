// Exécute ce script une fois que le contenu de la popup est chargé
document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("dataForm"); // Récupère le formulaire
  const status = document.getElementById("status"); // Élément pour afficher les statuts

  // Charger les données sauvegardées et pré-remplir le formulaire
  chrome.storage.local.get("formData", (data) => {
      if (data.formData) {
          for (const [key, value] of Object.entries(data.formData)) {
              const input = document.querySelector(`[name="${key}"]`);
              // Remplit les champs sauf les champs de type "file"
              if (input && input.type !== "file") input.value = value;
          }
      }
  });

  // Sauvegarder les données du formulaire lorsque l'utilisateur clique sur "Sauvegarder"
  form.addEventListener("submit", async (e) => {
      e.preventDefault(); // Empêche le rechargement de la popup

      const formData = new FormData(form); // Récupère les données du formulaire
      const data = {}; // Objet pour stocker les données à sauvegarder
      const promises = []; // Liste des promesses pour convertir les fichiers

      // Parcourt chaque champ du formulaire
      formData.forEach((value, key) => {
          // Si le champ est un fichier, le convertir en Base64
          if (value instanceof File && value.size > 0) {
              const reader = new FileReader();
              promises.push(
                  new Promise((resolve) => {
                      reader.onload = (e) => {
                          data[key] = e.target.result; // Sauvegarde en Base64
                          resolve();
                      };
                      reader.readAsDataURL(value); // Lit le fichier en Base64
                  })
              );
          } else {
              data[key] = value; // Sauvegarde les champs standards
          }
      });

      // Attendre que toutes les images soient converties avant de sauvegarder
      await Promise.all(promises);

      // Sauvegarder les données dans chrome.storage.local
      chrome.storage.local.set({ formData: data }, () => {
          status.textContent = "Données enregistrées avec succès !"; // Affiche un message de succès
          setTimeout(() => (status.textContent = ""), 2000); // Réinitialise le message
      });
  });

  // Remplir automatiquement le formulaire de la page active lorsque l'utilisateur clique sur "Remplir"
  document.getElementById("fill-form").addEventListener("click", () => {
      chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
          const activeTabId = tabs[0].id;
          if (activeTabId) {
              chrome.scripting.executeScript({
                  target: { tabId: activeTabId },
                  func: fillForm,
              });
          }
      });
  });
});
