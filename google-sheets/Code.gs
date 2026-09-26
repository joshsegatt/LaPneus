/**
 * ============================================================================
 * L.A PNEUS — GESTION DES ABONNEMENTS CLUB PRIVILÈGE (GOOGLE SHEETS WEBHOOK)
 * ============================================================================
 * 
 * Compte Google Drive Propriétaire : josuesegatofilho@gmail.com
 * Réception TWINT : 076 771 86 87
 * 
 * Ce script reçoit automatiquement les demandes d'adhésion depuis le site
 * L.A Pneus, les enregistre en temps réel dans votre Google Sheet et envoie
 * une notification par e-mail immédiate à josuesegatofilho@gmail.com.
 * 
 * ============================================================================
 * GUIDE D'ACTIVATION EN 1 MINUTE (SUR josuesegatofilho@gmail.com) :
 * ============================================================================
 * 1. Connectez-vous à votre compte Google : josuesegatofilho@gmail.com
 * 2. Ouvrez Google Sheets (https://sheets.new)
 * 3. Nommez le document : "L.A PNEUS — Abonnements Club Privilège"
 * 4. Renommez l'onglet en bas en : "Abonnements"
 * 5. Menu : "Extensions" -> "Apps Script"
 * 6. Effacez le code existant et collez TOUT ce fichier
 * 7. Dans le menu déroulant en haut, choisissez "initialiserFeuille" et cliquez sur "Exécuter" (▶)
 * 8. Cliquez sur "Déployer" (bouton bleu en haut à droite) -> "Nouveau déploiement"
 *    - Type : "Application Web" (cliquez sur l'engrenage ⚙️)
 *    - Description : "Webhook L.A Pneus"
 *    - Exécuter en tant que : "Moi (josuesegatofilho@gmail.com)"
 *    - Qui a accès : "Tout le monde" (indispensable pour la réception web)
 * 9. Cliquez sur "Déployer" et copiez l'URL Webhook (finit par /exec)
 * 10. Collez l'URL dans `GOOGLE_SHEETS_WEBHOOK_URL` sur le site.
 */

// Configuration du compte propriétaire et des alertes
const OWNER_EMAIL = 'josuesegatofilho@gmail.com';
const TWINT_LINE = '076 771 86 87';

// Colonnes officielles de suivi opérationnel
const HEADERS = [
  'Date / Heure',
  'Nº Dossier',
  'Statut Cotisation',
  'Formule',
  'Prix Mensuel',
  'Nom & Prénom',
  'Téléphone',
  'E-mail',
  'Commune / Canton',
  'Véhicule (Marque & Modèle)',
  'Plaque Immatriculation',
  'Dimensions Pneus',
  'Ligne TWINT Réception',
  'Dernier Paiement Validé',
  'Notes & Suivi'
];

/**
 * Initialisation automatique des en-têtes et des listes déroulantes
 */
function initialiserFeuille() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  let sheet = ss.getSheetByName('Abonnements');
  if (!sheet) {
    sheet = ss.insertSheet('Abonnements');
  }

  // Formatage des en-têtes (Style L.A Pneus Luxury Dark & Gold)
  sheet.getRange(1, 1, 1, HEADERS.length).setValues([HEADERS]);
  sheet.getRange(1, 1, 1, HEADERS.length)
    .setBackground('#131417')
    .setFontColor('#FACD1E')
    .setFontWeight('bold')
    .setFontFamily('Arial')
    .setFontSize(10);
  
  sheet.setFrozenRows(1);

  // Validation de données pour la colonne Statut Cotisation (Col C)
  const rule = SpreadsheetApp.newDataValidation()
    .requireValueInList(['🟢 ACTIF', '🟡 EN ATTENTE', '🔴 IMPAYÉ', '⚪ RÉSILIÉ'], true)
    .setAllowInvalid(false)
    .build();
  sheet.getRange('C2:C5000').setDataValidation(rule);

  // Ajustement de la largeur des colonnes pour lecture mobile et desktop
  sheet.setColumnWidth(1, 140); // Date
  sheet.setColumnWidth(2, 130); // Dossier
  sheet.setColumnWidth(3, 140); // Statut
  sheet.setColumnWidth(4, 130); // Formule
  sheet.setColumnWidth(5, 110); // Prix
  sheet.setColumnWidth(6, 170); // Nom
  sheet.setColumnWidth(7, 130); // Téléphone
  sheet.setColumnWidth(8, 180); // Email
  sheet.setColumnWidth(9, 150); // Commune
  sheet.setColumnWidth(10, 180); // Véhicule
  sheet.setColumnWidth(11, 130); // Plaque
  sheet.setColumnWidth(12, 160); // Pneus
  sheet.setColumnWidth(13, 140); // TWINT
  sheet.setColumnWidth(14, 160); // Dernier Paiement
  sheet.setColumnWidth(15, 180); // Notes
}

/**
 * Réception POST depuis le formulaire d'adhésion du site
 */
function doPost(e) {
  try {
    const ss = SpreadsheetApp.getActiveSpreadsheet();
    let sheet = ss.getSheetByName('Abonnements');
    if (!sheet) {
      initialiserFeuille();
      sheet = ss.getSheetByName('Abonnements');
    }

    let data;
    if (e.postData && e.postData.contents) {
      try {
        data = JSON.parse(e.postData.contents);
      } catch (err) {
        data = e.parameter;
      }
    } else {
      data = e.parameter || {};
    }

    const timestamp = Utilities.formatDate(new Date(), 'Europe/Zurich', 'dd.MM.yyyy HH:mm');
    const dossierId = data.dossierId || ('LAP-' + Utilities.formatDate(new Date(), 'Europe/Zurich', 'yyyyMMdd-HHmm'));
    const statut = '🟡 EN ATTENTE'; // Passe à 🟢 ACTIF dès confirmation du premier TWINT
    const formule = data.formule || 'Member Gold';
    const prix = data.prix || '19 CHF / mois';
    const nom = data.nom || '';
    const tel = data.telephone || '';
    const email = data.email || '';
    const commune = data.commune || '';
    const vehicule = data.vehicule || '';
    const plaque = (data.plaque || '').toUpperCase();
    const pneus = data.pneus || '';
    const twintLigne = TWINT_LINE;
    const dernierPaiement = 'En attente 1er TWINT';
    const notes = data.notes || 'Inscription web en temps réel';

    // Insérer la nouvelle ligne
    sheet.appendRow([
      timestamp,
      dossierId,
      statut,
      formule,
      prix,
      nom,
      tel,
      email,
      commune,
      vehicule,
      plaque,
      pneus,
      twintLigne,
      dernierPaiement,
      notes
    ]);

    // Coloration visuelle de l'état "EN ATTENTE"
    const lastRow = sheet.getLastRow();
    sheet.getRange(lastRow, 3).setBackground('#FFF3CD').setFontColor('#856404').setFontWeight('bold');

    // Envoi d'une alerte email immédiate à segatt22@gmail.com
    try {
      const emailSubject = `🔔 [L.A PNEUS] Nouvelle Adhésion ${formule} : ${nom} (${plaque})`;
      const emailBody = `
        <div style="font-family: Arial, sans-serif; background-color: #f7f7f8; padding: 20px; color: #222;">
          <div style="max-width: 600px; margin: 0 auto; background: #ffffff; border-radius: 12px; overflow: hidden; border: 1px solid #e1e4e8;">
            <div style="background-color: #131417; color: #FACD1E; padding: 18px 24px; font-size: 18px; font-weight: bold;">
              🇨🇭 L.A PNEUS — Demande d'Adhésion Club Privilège
            </div>
            <div style="padding: 24px;">
              <p style="font-size: 15px; margin-top: 0;">Une nouvelle adhésion a été enregistrée en temps réel sur votre Google Sheet :</p>
              
              <table style="width: 100%; border-collapse: collapse; font-size: 14px; margin-bottom: 20px;">
                <tr><td style="padding: 8px 0; color: #666; border-bottom: 1px solid #eee;"><strong>Nº Dossier :</strong></td><td style="padding: 8px 0; font-weight: bold; border-bottom: 1px solid #eee;">${dossierId}</td></tr>
                <tr><td style="padding: 8px 0; color: #666; border-bottom: 1px solid #eee;"><strong>Formule :</strong></td><td style="padding: 8px 0; font-weight: bold; color: #000; border-bottom: 1px solid #eee;">${formule} (${prix})</td></tr>
                <tr><td style="padding: 8px 0; color: #666; border-bottom: 1px solid #eee;"><strong>Client :</strong></td><td style="padding: 8px 0; font-weight: bold; border-bottom: 1px solid #eee;">${nom}</td></tr>
                <tr><td style="padding: 8px 0; color: #666; border-bottom: 1px solid #eee;"><strong>Téléphone :</strong></td><td style="padding: 8px 0; border-bottom: 1px solid #eee;"><a href="tel:${tel}" style="color: #0066cc; font-weight: bold;">${tel}</a></td></tr>
                <tr><td style="padding: 8px 0; color: #666; border-bottom: 1px solid #eee;"><strong>E-mail :</strong></td><td style="padding: 8px 0; border-bottom: 1px solid #eee;">${email || '-'}</td></tr>
                <tr><td style="padding: 8px 0; color: #666; border-bottom: 1px solid #eee;"><strong>Commune :</strong></td><td style="padding: 8px 0; border-bottom: 1px solid #eee;">${commune}</td></tr>
                <tr><td style="padding: 8px 0; color: #666; border-bottom: 1px solid #eee;"><strong>Véhicule :</strong></td><td style="padding: 8px 0; border-bottom: 1px solid #eee;">${vehicule}</td></tr>
                <tr><td style="padding: 8px 0; color: #666; border-bottom: 1px solid #eee;"><strong>Plaque :</strong></td><td style="padding: 8px 0; font-weight: bold; color: #b8860b; border-bottom: 1px solid #eee;">${plaque}</td></tr>
                <tr><td style="padding: 8px 0; color: #666; border-bottom: 1px solid #eee;"><strong>Pneus :</strong></td><td style="padding: 8px 0; border-bottom: 1px solid #eee;">${pneus || 'À préciser'}</td></tr>
                <tr><td style="padding: 8px 0; color: #666;"><strong>Ligne TWINT :</strong></td><td style="padding: 8px 0; font-weight: bold; color: #008744;">${TWINT_LINE}</td></tr>
              </table>

              <div style="background-color: #fff9e6; border-left: 4px solid #FACD1E; padding: 12px 16px; border-radius: 4px; font-size: 13px; line-height: 1.5;">
                <strong>Action requise :</strong> Dès confirmation du paiement TWINT sur le 076 771 86 87, ouvrez votre Google Sheet sur votre smartphone et passez le statut en <strong>🟢 ACTIF</strong>.
              </div>
            </div>
            <div style="background-color: #f1f3f5; padding: 12px 24px; font-size: 12px; color: #888; text-align: center;">
              Système de Gestion Club Privilège • segatt22@gmail.com
            </div>
          </div>
        </div>
      `;

      MailApp.sendEmail({
        to: OWNER_EMAIL,
        subject: emailSubject,
        htmlBody: emailBody
      });
    } catch (mailErr) {
      console.warn("Notification mail non transmise:", mailErr);
    }

    return ContentService
      .createTextOutput(JSON.stringify({ status: 'success', dossierId: dossierId }))
      .setMimeType(ContentService.MimeType.JSON);

  } catch (error) {
    return ContentService
      .createTextOutput(JSON.stringify({ status: 'error', message: error.toString() }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}

/**
 * Réponse GET de test
 */
function doGet(e) {
  return ContentService
    .createTextOutput('L.A PNEUS Webhook Google Sheets opérationnel pour segatt22@gmail.com.')
    .setMimeType(ContentService.MimeType.TEXT);
}
