try {
  // Écoute les commandes définies dans le manifest.json (par exemple : raccourcis clavier)
  chrome.commands.onCommand.addListener((command) => {
    if (command === "fill_form") {
      chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
        const activeTab = tabs[0];
        if (activeTab) {
          chrome.scripting.executeScript({
            target: { tabId: activeTab.id },
            files: ["content.js"],
          });
        }
      });
    }
  });

  // Déclencher l'injection du script lorsque l'utilisateur clique sur l'icône de l'extension
  chrome.action.onClicked.addListener((tab) => {
    if (tab.id) {
      chrome.scripting.executeScript({
        target: { tabId: tab.id },
        files: ["content.js"],
      });
    };

    // chrome.tabs.create({
    //   url: chrome.runtime.getURL("popup.html"),
    // });

    chrome.runtime.openOptionsPage();
  });

  // Gestion des erreurs globales pour un débogage plus facile
  chrome.runtime.onInstalled.addListener(() => {
    console.log("L'extension a été installée avec succès.");
  });
} catch (error) {
  console.error("Erreur détectée :", error.message);
}