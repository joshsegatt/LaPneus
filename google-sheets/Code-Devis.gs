/**
 * ============================================================================
 * L.A PNEUS — GESTION DES DEVIS & INTERVENTIONS (GOOGLE SHEETS & EMAIL DIRECT)
 * ============================================================================
 * 
 * E-mail officiel entreprise : info.lapneus@gmail.com
 * Formulaire source : Demande de devis gratuit (Landing page index.html)
 * 
 * SYSTÈME 100% SÉPARÉ DU CLUB PRIVILÈGE (ABONNEMENTS).
 * Ce script enregistre chaque devis dans un tableur dédié et transmet
 * une alerte e-mail luxueuse et structurée à info.lapneus@gmail.com.
 * ============================================================================
 * 
 * GUIDE D'ACTIVATION RAPIDE (SUR VOTRE COMPTE GOOGLE) :
 * 1. Ouvrez Google Sheets (https://sheets.new)
 * 2. Nommez le document : "L.A PNEUS — Demandes de Devis"
 * 3. Renommez l'onglet en bas en : "Devis"
 * 4. Menu : "Extensions" -> "Apps Script"
 * 5. Collez ce code complet
 * 6. Choisissez "initialiserFeuilleDevis" et cliquez sur "Exécuter" (▶)
 * 7. Déployer -> Nouveau déploiement -> Type "Application Web" -> Accès "Tout le monde"
 * ============================================================================
 */

const COMPANY_EMAIL = 'info.lapneus@gmail.com';
const WHATSAPP_PHONE = '41767718687';

const DEVIS_HEADERS = [
  'Date / Heure',
  'Nº Devis',
  'Statut',
  'Nom & Prénom',
  'Téléphone',
  'Commune d\'Intervention',
  'Prestation Souhaitée',
  'Véhicule (Marque & Modèle)',
  'Créneau Souhaité',
  'Détails / Dimensions Pneus',
  'Notes & Suivi'
];

function initialiserFeuilleDevis() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  let sheet = ss.getSheetByName('Devis');
  if (!sheet) {
    sheet = ss.insertSheet('Devis');
  }

  // Formatage Luxury L.A Pneus
  sheet.getRange(1, 1, 1, DEVIS_HEADERS.length).setValues([DEVIS_HEADERS]);
  sheet.getRange(1, 1, 1, DEVIS_HEADERS.length)
    .setBackground('#131417')
    .setFontColor('#FACD1E')
    .setFontWeight('bold')
    .setFontFamily('Arial')
    .setFontSize(10);

  sheet.setFrozenRows(1);

  // Validation de Statut
  const rule = SpreadsheetApp.newDataValidation()
    .requireValueInList(['🟡 NOUVEAU', '📞 CONTACTÉ', '✅ CONFIRMÉ', '🏁 TERMINÉ', '❌ ANNULÉ'], true)
    .setAllowInvalid(false)
    .build();
  sheet.getRange('C2:C5000').setDataValidation(rule);

  // Largeurs de colonnes
  sheet.setColumnWidth(1, 140); // Date
  sheet.setColumnWidth(2, 120); // Nº Devis
  sheet.setColumnWidth(3, 130); // Statut
  sheet.setColumnWidth(4, 170); // Nom
  sheet.setColumnWidth(5, 130); // Téléphone
  sheet.setColumnWidth(6, 160); // Commune
  sheet.setColumnWidth(7, 190); // Prestation
  sheet.setColumnWidth(8, 180); // Véhicule
  sheet.setColumnWidth(9, 140); // Créneau
  sheet.setColumnWidth(10, 240); // Détails
  sheet.setColumnWidth(11, 180); // Notes
}

function doPost(e) {
  try {
    const ss = SpreadsheetApp.getActiveSpreadsheet();
    let sheet = ss.getSheetByName('Devis');
    if (!sheet) {
      initialiserFeuilleDevis();
      sheet = ss.getSheetByName('Devis');
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
    const dossierId = data['Nº Dossier'] || data.dossierId || ('DEV-' + Utilities.formatDate(new Date(), 'Europe/Zurich', 'yyyyMMdd-HHmm'));
    const nom = data['Client'] || data.nom || '';
    const tel = data['Téléphone'] || data.telephone || '';
    const commune = data['Commune'] || data.commune || '';
    const prestation = data['Prestation'] || data.prestation || 'Changement de pneus';
    const vehicule = data['Véhicule'] || data.vehicule || 'Non précisé';
    const creneau = data['Créneau Souhaité'] || data.creneau || 'Dès que possible';
    const details = data['Détails / Dimensions'] || data.message || 'Aucune précision';
    const statut = '🟡 NOUVEAU';

    // Insérer dans la feuille
    sheet.appendRow([
      timestamp,
      dossierId,
      statut,
      nom,
      tel,
      commune,
      prestation,
      vehicule,
      creneau,
      details,
      'Reçu via site internet'
    ]);

    // Coloration du statut
    const lastRow = sheet.getLastRow();
    sheet.getRange(lastRow, 3).setBackground('#FFF3CD').setFontColor('#856404').setFontWeight('bold');

    // Téléphone nettoyé pour WhatsApp
    const telClean = tel.replace(/[\s\-\.]/g, '').replace('+', '');

    // Envoi de l'e-mail ultra-organisé à info.lapneus@gmail.com
    const emailSubject = `🚨 [NOUVEAU DEVIS L.A PNEUS] ${nom} — ${commune} (${prestation})`;
    const emailBody = `
      <div style="font-family: -apple-system, BlinkMacSystemFont, Arial, sans-serif; background-color: #f4f5f7; padding: 24px; color: #1f2328;">
        <div style="max-width: 620px; margin: 0 auto; background: #ffffff; border-radius: 14px; overflow: hidden; border: 1px solid #d0d7de; box-shadow: 0 4px 16px rgba(0,0,0,0.06);">
          
          <!-- HEADER LUXURY L.A PNEUS -->
          <div style="background-color: #131417; color: #FACD1E; padding: 20px 24px; border-bottom: 2px solid #FACD1E;">
            <div style="font-size: 11px; letter-spacing: 0.1em; text-transform: uppercase; color: #8c9099; margin-bottom: 4px;">Atelier Mobile Genève & Vaud</div>
            <div style="font-size: 20px; font-weight: 800; color: #FACD1E;">🇨🇭 L.A PNEUS — Nouvelle Demande de Devis</div>
          </div>

          <div style="padding: 24px;">
            <p style="font-size: 15px; margin: 0 0 18px; color: #333;">
              Une nouvelle demande d'intervention a été reçue en temps réel depuis le site :
            </p>

            <!-- TABLEAU DES DONNÉES DU DEVIS -->
            <table style="width: 100%; border-collapse: collapse; font-size: 14px; margin-bottom: 24px; background: #fafbfc; border-radius: 8px; overflow: hidden; border: 1px solid #e1e4e8;">
              <tr>
                <td style="padding: 10px 14px; color: #656d76; width: 38%; border-bottom: 1px solid #e1e4e8;"><strong>Nº Dossier</strong></td>
                <td style="padding: 10px 14px; font-weight: bold; color: #0969da; border-bottom: 1px solid #e1e4e8;">${dossierId}</td>
              </tr>
              <tr>
                <td style="padding: 10px 14px; color: #656d76; border-bottom: 1px solid #e1e4e8;"><strong>Nom & Prénom</strong></td>
                <td style="padding: 10px 14px; font-weight: bold; color: #1f2328; border-bottom: 1px solid #e1e4e8;">${nom}</td>
              </tr>
              <tr>
                <td style="padding: 10px 14px; color: #656d76; border-bottom: 1px solid #e1e4e8;"><strong>Téléphone</strong></td>
                <td style="padding: 10px 14px; border-bottom: 1px solid #e1e4e8;">
                  <a href="tel:${tel}" style="color: #0969da; font-weight: 800; font-size: 15px; text-decoration: none;">📞 ${tel}</a>
                </td>
              </tr>
              <tr>
                <td style="padding: 10px 14px; color: #656d76; border-bottom: 1px solid #e1e4e8;"><strong>Commune d'Intervention</strong></td>
                <td style="padding: 10px 14px; font-weight: bold; color: #1f2328; border-bottom: 1px solid #e1e4e8;">📍 ${commune}</td>
              </tr>
              <tr>
                <td style="padding: 10px 14px; color: #656d76; border-bottom: 1px solid #e1e4e8;"><strong>Prestation Souhaitée</strong></td>
                <td style="padding: 10px 14px; font-weight: bold; color: #1a7f37; border-bottom: 1px solid #e1e4e8;">🔧 ${prestation}</td>
              </tr>
              <tr>
                <td style="padding: 10px 14px; color: #656d76; border-bottom: 1px solid #e1e4e8;"><strong>Véhicule</strong></td>
                <td style="padding: 10px 14px; color: #1f2328; border-bottom: 1px solid #e1e4e8;">🚗 ${vehicule}</td>
              </tr>
              <tr>
                <td style="padding: 10px 14px; color: #656d76; border-bottom: 1px solid #e1e4e8;"><strong>Créneau Souhaité</strong></td>
                <td style="padding: 10px 14px; color: #1f2328; border-bottom: 1px solid #e1e4e8;">⏰ ${creneau}</td>
              </tr>
              <tr>
                <td style="padding: 10px 14px; color: #656d76;"><strong>Dimensions / Précisions</strong></td>
                <td style="padding: 10px 14px; color: #1f2328;">${details}</td>
              </tr>
            </table>

            <!-- BOUTONS D'ACTION DIRECTS -->
            <div style="display: flex; gap: 10px; margin-bottom: 20px;">
              <a href="tel:${tel}" style="background-color: #0969da; color: #ffffff; padding: 12px 20px; border-radius: 8px; text-decoration: none; font-weight: bold; font-size: 14px; display: inline-block;">
                📞 Appeler le client (${tel})
              </a>
              <a href="https://wa.me/${telClean}?text=${encodeURIComponent('Bonjour ' + nom + ', L.A Pneus au sujet de votre demande de devis (' + dossierId + ') :')}" style="background-color: #25D366; color: #ffffff; padding: 12px 20px; border-radius: 8px; text-decoration: none; font-weight: bold; font-size: 14px; display: inline-block;">
                💬 Répondre sur WhatsApp
              </a>
            </div>

            <div style="background-color: #fff8c5; border-left: 4px solid #d4a72c; padding: 12px 16px; border-radius: 4px; font-size: 13px; color: #634f19;">
              <strong>Délai d'engagement :</strong> Rappeler ou confirmer le tarif fixe au client sous 30 minutes.
            </div>
          </div>

          <!-- FOOTER -->
          <div style="background-color: #f6f8fa; padding: 14px 24px; font-size: 12px; color: #656d76; text-align: center; border-top: 1px solid #d0d7de;">
            L.A PNEUS • Genève & Vaud • E-mail officiel : info.lapneus@gmail.com
          </div>
        </div>
      </div>
    `;

    MailApp.sendEmail({
      to: COMPANY_EMAIL,
      subject: emailSubject,
      htmlBody: emailBody
    });

    return ContentService
      .createTextOutput(JSON.stringify({ status: 'success', dossierId: dossierId }))
      .setMimeType(ContentService.MimeType.JSON);

  } catch (error) {
    return ContentService
      .createTextOutput(JSON.stringify({ status: 'error', message: error.toString() }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}

function doGet(e) {
  return ContentService
    .createTextOutput('Webhook Devis L.A PNEUS opérationnel pour info.lapneus@gmail.com')
    .setMimeType(ContentService.MimeType.TEXT);
}
