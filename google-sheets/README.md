# 📊 Guide Google Drive / Sheets — Club Privilège L.A PNEUS

> **Compte Google Propriétaire configuré :** `josuesegatofilho@gmail.com`  
> **Ligne TWINT Partenaire :** `076 771 86 87`

Ce guide vous explique comment activer la synchronisation en temps réel de votre tableau de bord des abonnements sur votre compte **Google Drive (`josuesegatofilho@gmail.com`)** en moins de 2 minutes.

---

## 🎯 Avantages du Système

1. **Temps Réel Total** : Chaque client qui valide son formulaire sur le site apparaît instantanément dans votre feuille de calcul.
2. **Notification E-mail Directe** : `josuesegatofilho@gmail.com` reçoit un e-mail immédiat avec le nom, le numéro de téléphone cliquable, le véhicule et la plaque pour chaque nouvelle inscription.
3. **Zéro Frais de Passerelle** : 100% de la marge est préservée grâce au règlement direct par TWINT.
4. **Accessible sur Smartphone** : Vous et votre partenaire ouvrez l'application Google Sheets dans le van et vérifiez en 2 secondes si une plaque est **🟢 ACTIF** ou **🔴 IMPAYÉ**.

---

## ⚙️ Activation en 4 Étapes Rapides

### Étape 1 : Créer la Feuille Google Sheets
1. Assurez-vous d'être connecté sur votre compte : **`josuesegatofilho@gmail.com`**.
2. Rendez-vous sur : [sheets.new](https://sheets.new).
3. Nommez le document en haut : **`L.A PNEUS — Abonnements Club Privilège`**.
4. Renommez l'onglet en bas en : **`Abonnements`**.

### Étape 2 : Ajouter le Script Webhook
1. Dans le menu de votre Google Sheet, cliquez sur : **Extensions** ➔ **Apps Script**.
2. Effacez le code existant dans la fenêtre.
3. Copiez et collez l'intégralité du code du fichier : [`google-sheets/Code.gs`](./Code.gs).
4. Cliquez sur l'icône **Enregistrer** (la disquette 💾).

### Étape 3 : Initialiser les Colonnes (1 seul clic)
1. En haut de l'éditeur Apps Script, sélectionnez la fonction **`initialiserFeuille`** dans le menu déroulant à côté de "Déboguer".
2. Cliquez sur **Exécuter** (Bouton ▶).
3. Google va vous demander une autorisation :
   - Cliquez sur *Vérifier les autorisations* ➔ Choisissez votre compte `josuesegatofilho@gmail.com`.
   - Cliquez sur *Paramètres avancés* ➔ *Accéder à L.A Pneus Webhook (non sécurisé)* ➔ *Autoriser*.
4. *Résultat instantané* : Votre feuille Google Sheets est maintenant entièrement formatée avec le design noir et or de L.A Pneus et les menus déroulants de statut (`🟢 ACTIF`, `🟡 EN ATTENTE`, `🔴 IMPAYÉ`, `⚪ RÉSILIÉ`) !

### Étape 4 : Déployer le Webhook
1. En haut à droite, cliquez sur le bouton bleu **Déployer** ➔ **Nouveau déploiement**.
2. Cliquez sur l'engrenage ⚙️ à gauche et choisissez **Application Web**.
3. Remplissez comme suit :
   - **Description** : `Webhook L.A Pneus segatt22`
   - **Exécuter en tant que** : `Moi (segatt22@gmail.com)`
   - **Qui a accès** : `Tout le monde` *(indispensable pour que le site web puisse transmettre les données)*
4. Cliquez sur **Déployer**.
5. **Copiez l'URL de l'application Web** (elle se termine par `/exec`).
6. Collez cette URL dans le fichier `preview/tarifs.html` à la ligne `GOOGLE_SHEETS_WEBHOOK_URL = 'VOTRE_URL';`.

---

## 📱 Utilisation Quotidienne dans le Van

1. **Partage avec votre Partenaire** :
   - Dans Google Sheets, cliquez sur le bouton vert **Partager** en haut à droite.
   - Ajoutez l'adresse e-mail de votre partenaire avec les droits "Éditeur".
2. **Sur vos Téléphones (iOS / Android)** :
   - Installez l'application **Google Sheets**.
   - Ouvrez la feuille `L.A PNEUS — Abonnements Club Privilège`.
3. **Lors d'une Intervention** :
   - Vous tapez la plaque ou le nom du client dans la recherche de l'appli.
   - S'il est **🟢 ACTIF** : Déplacement offert et remises immédiates selon son plan.
   - S'il est **🔴 IMPAYÉ** : Vous lui signalez avec courtoisie qu'une mensualité est en attente et vous la réglez sur place via TWINT au `076 771 86 87` !
