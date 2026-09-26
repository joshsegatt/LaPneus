/**
 * L.A Pneus - Guide Technique & Normes Suisses OETV (Porsche Tequipment Craft)
 * Gestion des réservations directes ciblées et micro-interactions spatiales.
 */

(function() {
  'use strict';

  function initTechnicalShowcase() {
    // 1-Click Booking Action Links with auto-scroll and field prefill
    const bookingButtons = document.querySelectorAll('.part-booking-btn, .compact-action-link');
    bookingButtons.forEach(btn => {
      btn.addEventListener('click', function(e) {
        e.preventDefault();
        const service = this.getAttribute('data-service') || 'Contrôle technique des organes de sécurité';
        const msgField = document.getElementById('message');
        if (msgField) {
          msgField.value = `Demande d'intervention : ${service}. Véhicule basé dans le canton de Genève.`;
          msgField.focus();
        }
        const reservationSection = document.getElementById('reservation');
        if (reservationSection) {
          reservationSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      });
    });

    // Subtle 3D Perspective Tilt on Mouse Movement (Apple Hardware Craft)
    const items = document.querySelectorAll('.part-seamless-item, .part-card-compact');
    items.forEach(item => {
      item.addEventListener('mousemove', function(e) {
        const rect = this.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        const centerX = rect.width / 2;
        const centerY = rect.height / 2;
        const rotateX = ((y - centerY) / centerY) * -3;
        const rotateY = ((x - centerX) / centerX) * 3;
        const img = this.querySelector('.part-cutout-img');
        if (img) {
          img.style.transform = `perspective(600px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale(1.05)`;
        }
      });

      item.addEventListener('mouseleave', function() {
        const img = this.querySelector('.part-cutout-img');
        if (img) {
          img.style.transform = '';
        }
      });
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initTechnicalShowcase);
  } else {
    initTechnicalShowcase();
  }
})();
