// Écoute les événements pour exécuter des scripts dans l'onglet actif
chrome.action.onClicked.addListener((tab) => {
    // Injecte le script pour remplir le formulaire dans la page active
    chrome.scripting.executeScript({
        target: { tabId: tab.id },
        func: fillForm,
    });
  });
  
  // Fonction injectée dans la page active pour remplir les champs du formulaire
  function fillForm() {
    // Récupère les données sauvegardées dans le stockage local
    chrome.storage.local.get("formData", (data) => {
        if (data.formData) {
            const formData = data.formData;
  
            // Parcourt chaque clé-valeur des données sauvegardées
            for (const [key, value] of Object.entries(formData)) {
                const input = document.querySelector(`[name="${key}"]`);
  
                // Remplir les champs texte et autres types standards
                if (input && input.type !== "file") {
                    input.value = value;
                }
  
                // Remplir les champs de fichiers avec des images encodées en Base64
                if (input && input.type === "file" && value.startsWith("data:image")) {
                    const byteString = atob(value.split(",")[1]); // Décodage Base64
                    const mimeString = value.split(",")[0].split(":")[1].split(";")[0];
                    const byteArray = new Uint8Array(byteString.length);
  
                    // Convertir les données en un tableau d'octets
                    for (let i = 0; i < byteString.length; i++) {
                        byteArray[i] = byteString.charCodeAt(i);
                    }
  
                    // Créer un objet Blob représentant le fichier
                    const blob = new Blob([byteArray], { type: mimeString });
                    const file = new File([blob], "uploaded_image.png", { type: mimeString });
  
                    // Simuler un upload avec DataTransfer
                    const dataTransfer = new DataTransfer();
                    dataTransfer.items.add(file);
                    input.files = dataTransfer.files;
                }
            }
        } else {
            console.error("Aucune donnée trouvée pour remplir le formulaire !");
        }
    });
  }
  