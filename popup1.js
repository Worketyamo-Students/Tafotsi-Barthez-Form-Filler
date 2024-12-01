// popup1.js

document.addEventListener("DOMContentLoaded", () => {
    const saveDataButton = document.getElementById("saveData");
    const fillFormButton = document.getElementById("fillForm");
    const status = document.getElementById("status");
  
    // Fonction pour ouvrir un nouvel onglet avec popup.html
    saveDataButton.addEventListener("click", () => {
      chrome.tabs.create({
        url: chrome.runtime.getURL("popup.html"),  // Ouvre popup.html dans un nouvel onglet
      });
    });
  
    // Fonction pour remplir le formulaire sur la page cible
    fillFormButton.addEventListener("click", () => {
      // Exécuter le script content.js pour remplir automatiquement les champs du formulaire
      chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
        const activeTab = tabs[0];
        if (activeTab) {
          chrome.scripting.executeScript({
            target: { tabId: activeTab.id },
            function: fillForm,
          });
        }
      });
  
      // Afficher un message de confirmation
      status.textContent = "Formulaire rempli avec succès!";
      setTimeout(() => {
        status.textContent = "";  // Effacer le message après 2 secondes
      }, 2000);
    });
  });
  
  // Fonction de remplissage des champs du formulaire sur la page cible
  function fillForm() {
    chrome.storage.local.get("formData", (data) => {
      if (data.formData) {
        // Remplir les champs avec les données stockées dans localStorage
        for (const [key, value] of Object.entries(data.formData)) {
          const input = document.querySelector(`[name="${key}"]`);
          if (input) {
            if (input.type === "file") {
              // Si le champ est de type "file", charger l'image depuis base64
              const imageElement = input;
              imageElement.src = value;  // Ajouter la base64 de l'image à l'élément source
            } else {
              input.value = value;
            }
          }
        }
      }
    });
  }
  