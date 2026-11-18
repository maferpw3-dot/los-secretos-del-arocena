/**
 * JavaScript Controller: Los Secretos del Arocena
 * Implements PRD Functional Requirements (FR-01 to FR-05)
 */

// Application State
const appState = {
  players: 5,
  mode: 'nocturno', // 'diurno' ($80) | 'nocturno' ($100)
  prices: {
    diurno: 80,
    nocturno: 100
  },
  museumWhatsAppNumber: '528717120233', // Museo Arocena Contact Desk
  // Supabase Configuration
  supabaseConfig: {
    url: window.SUPABASE_URL || '',
    anonKey: window.SUPABASE_ANON_KEY || ''
  }
};

let supabaseClient = null;

// Initialize Supabase if credentials are present
function initSupabase() {
  if (window.supabase && appState.supabaseConfig.url && appState.supabaseConfig.anonKey) {
    supabaseClient = window.supabase.createClient(appState.supabaseConfig.url, appState.supabaseConfig.anonKey);
    console.log('✅ Supabase conectado exitosamente');
  }
}

// Initialize on DOM load
document.addEventListener('DOMContentLoaded', () => {
  setupMinDate();
  updateCalculatorUI();
  updateShareLink();
  initSupabase();
});

// Setup minimum date picker to today/tomorrow
function setupMinDate() {
  const dateInput = document.getElementById('reservaFecha');
  if (dateInput) {
    const today = new Date();
    // Default to upcoming weekend or next day
    const yyyy = today.getFullYear();
    const mm = String(today.getMonth() + 1).padStart(2, '0');
    const dd = String(today.getDate()).padStart(2, '0');
    dateInput.min = `${yyyy}-${mm}-${dd}`;
    dateInput.value = `${yyyy}-${mm}-${dd}`;
  }
}

// Set Players Count (4, 5, 6)
function setPlayers(count) {
  appState.players = parseInt(count, 10);
  
  // Update Player Buttons UI
  const buttons = document.querySelectorAll('#playersSelectorGroup .player-btn');
  buttons.forEach(btn => {
    const p = parseInt(btn.getAttribute('data-players'), 10);
    if (p === appState.players) {
      btn.className = 'player-btn py-3 sm:py-4 rounded-xl border-2 border-gold-500 bg-gold-500/10 text-gold-400 font-bold text-sm sm:text-base transition-all flex flex-col items-center gap-1 shadow-md shadow-gold-500/10';
    } else {
      btn.className = 'player-btn py-3 sm:py-4 rounded-xl border border-slate-700 bg-museum-900 font-bold text-sm sm:text-base text-slate-200 hover:border-gold-500 transition-all flex flex-col items-center gap-1';
    }
  });

  // Sync with form dropdown
  const formPlayersSelect = document.getElementById('reservaJugadores');
  if (formPlayersSelect) {
    formPlayersSelect.value = String(appState.players);
  }

  updateCalculatorUI();
}

// Set Schedule Mode ('diurno' | 'nocturno')
function setMode(mode) {
  appState.mode = mode;

  // Update Mode Buttons UI in Calculator
  const buttons = document.querySelectorAll('#modeSelectorGroup .mode-btn');
  buttons.forEach(btn => {
    const m = btn.getAttribute('data-mode');
    if (m === appState.mode) {
      btn.className = 'mode-btn p-4 rounded-xl border-2 border-gold-500 bg-gold-500/10 text-left transition-all flex items-center justify-between shadow-md shadow-gold-500/10';
    } else {
      btn.className = 'mode-btn p-4 rounded-xl border border-slate-700 bg-museum-900 text-left hover:border-gold-500 transition-all flex items-center justify-between';
    }
  });

  // Sync form schedule selector
  const scheduleSelect = document.getElementById('reservaHorario');
  if (scheduleSelect) {
    if (mode === 'diurno') {
      scheduleSelect.value = 'Sábado 11:00 AM (Día - $80)';
    } else {
      scheduleSelect.value = 'Viernes 6:00 PM (Noche - $100)';
    }
  }

  updateCalculatorUI();
}

// Click from Bershka-style dual card
function selectModeAndCalculate(mode) {
  setMode(mode);
  const calcSection = document.getElementById('calculadora');
  if (calcSection) {
    calcSection.scrollIntoView({ behavior: 'smooth' });
  }
}

// Calculate and refresh total figures
function updateCalculatorUI() {
  const price = appState.prices[appState.mode];
  const total = appState.players * price;

  // Update Calculator section
  const totalEl = document.getElementById('calcTotal');
  const formulaEl = document.getElementById('calcFormula');
  if (totalEl) totalEl.textContent = `$${total} MXN`;
  if (formulaEl) formulaEl.textContent = `(${appState.players} jugadores × $${price})`;

  // Update Form Summary box
  const formSummaryEl = document.getElementById('formSummary');
  const formTotalDisplayEl = document.getElementById('formTotalDisplay');
  const modeLabel = appState.mode === 'diurno' ? 'Turno Diurno ($80/p)' : 'Turno Nocturno ($100/p)';

  if (formSummaryEl) {
    formSummaryEl.textContent = `${appState.players} Integrantes • ${modeLabel}`;
  }
  if (formTotalDisplayEl) {
    formTotalDisplayEl.textContent = `$${total} MXN`;
  }
}

// Sync when user changes dropdown in Form directly
function syncScheduleWithForm() {
  const scheduleSelect = document.getElementById('reservaHorario');
  if (scheduleSelect) {
    const val = scheduleSelect.value;
    if (val.includes('Día')) {
      appState.mode = 'diurno';
    } else {
      appState.mode = 'nocturno';
    }
    // Update mode buttons UI
    const buttons = document.querySelectorAll('#modeSelectorGroup .mode-btn');
    buttons.forEach(btn => {
      const m = btn.getAttribute('data-mode');
      if (m === appState.mode) {
        btn.className = 'mode-btn p-4 rounded-xl border-2 border-gold-500 bg-gold-500/10 text-left transition-all flex items-center justify-between shadow-md shadow-gold-500/10';
      } else {
        btn.className = 'mode-btn p-4 rounded-xl border border-slate-700 bg-museum-900 text-left hover:border-gold-500 transition-all flex items-center justify-between';
      }
    });
    updateCalculatorUI();
  }
}

function syncPlayersWithForm() {
  const select = document.getElementById('reservaJugadores');
  if (select) {
    setPlayers(parseInt(select.value, 10));
  }
}

// Apply from Calculator to Form button
function applyToBookingForm() {
  const formSection = document.getElementById('reserva');
  if (formSection) {
    formSection.scrollIntoView({ behavior: 'smooth' });
    const capitanInput = document.getElementById('capitanNombre');
    if (capitanInput) capitanInput.focus();
  }
}

// Handle Form Submission -> Supabase Save + WhatsApp Link Generation (FR-03)
async function handleBookingSubmit(e) {
  e.preventDefault();

  const capitan = document.getElementById('capitanNombre').value.trim();
  const telefono = document.getElementById('capitanTelefono').value.trim();
  const fecha = document.getElementById('reservaFecha').value;
  const horario = document.getElementById('reservaHorario').value;
  const jugadores = appState.players;
  const modalidad = appState.mode;
  const precioUnitario = appState.prices[appState.mode];
  const total = jugadores * precioUnitario;

  // 1. Save to Supabase database if configured
  if (supabaseClient) {
    try {
      const { data, error } = await supabaseClient
        .from('reservas')
        .insert([
          {
            capitan: capitan,
            telefono: telefono,
            fecha: fecha,
            horario: horario,
            modalidad: modalidad,
            jugadores: jugadores,
            total: total,
            estado: 'pendiente_taquilla',
            created_at: new Date().toISOString()
          }
        ]);
      if (error) {
        console.warn('Advertencia al guardar en Supabase:', error.message);
      } else {
        console.log('✅ Reserva registrada en base de datos Supabase');
      }
    } catch (err) {
      console.error('Error al conectar con Supabase:', err);
    }
  }

  // 2. Build WhatsApp confirmation message
  const mensaje = 
`🏛️ *RESERVA: LOS SECRETOS DEL AROCENA*
¡Hola! Me gustaría apartar lugar para nuestro equipo:

👤 *Capitán:* ${capitan}
📱 *Teléfono:* ${telefono}
📅 *Fecha:* ${fecha}
⏰ *Horario:* ${horario}
👥 *Integrantes:* ${jugadores} personas
💰 *Total estimado:* $${total} MXN (Pago en taquilla)

¿Tienen disponibilidad en este horario para confirmar el apartado? ¡Muchas gracias!`;

  const waUrl = `https://wa.me/${appState.museumWhatsAppNumber}?text=${encodeURIComponent(mensaje)}`;
  
  // Open WhatsApp in new tab
  window.open(waUrl, '_blank');
}

// Modal: Invita a tu equipo (FR-04)
function openInviteModal() {
  const modal = document.getElementById('inviteModal');
  if (modal) {
    modal.classList.remove('hidden');
    modal.classList.add('flex');
    updateShareLink();
  }
}

function closeInviteModal() {
  const modal = document.getElementById('inviteModal');
  if (modal) {
    modal.classList.add('hidden');
    modal.classList.remove('flex');
  }
}

function updateShareLink() {
  const shareBtn = document.getElementById('shareWhatsAppBtn');
  if (shareBtn) {
    const inviteMessage = 
`🔍 *¡Oigan! ¿Jalamos a un Escape Room en el Museo Arocena?* 🏛️
Se llama "Los Secretos del Arocena": tenemos 60 minutos para descifrar acertijos entre las obras de arte y escapar.
• Equipos: 4 a 6 personas
• Costo: Solo $80 a $100 MXN por persona
¡Revisen los horarios y díganme quién se apunta para apartar el equipo!`;

    shareBtn.href = `https://wa.me/?text=${encodeURIComponent(inviteMessage)}`;
  }
}

function copyInviteLink() {
  const inviteText = `🔍 ¿Jalamos a un Escape Room en el Museo Arocena (Torreón)? 60 minutos para descifrar enigmas en equipo de 4 a 6 personas. Solo $80-$100 MXN por persona. ¡Revisa la misión y dime si te sumas!`;
  
  navigator.clipboard.writeText(inviteText).then(() => {
    const copyBtnText = document.getElementById('copyLinkText');
    if (copyBtnText) {
      const originalText = copyBtnText.textContent;
      copyBtnText.textContent = '¡Mensaje Copiado!';
      setTimeout(() => {
        copyBtnText.textContent = originalText;
      }, 2500);
    }
  }).catch(() => {
    alert('Texto de invitación listo para compartir con tus amigos.');
  });
}

// Modal: Paquetes Corporativos y Escolares (FR-05)
function openCorporateModal() {
  const modal = document.getElementById('corporateModal');
  if (modal) {
    modal.classList.remove('hidden');
    modal.classList.add('flex');
  }
}

function closeCorporateModal() {
  const modal = document.getElementById('corporateModal');
  if (modal) {
    modal.classList.add('hidden');
    modal.classList.remove('flex');
  }
}

function handleCorporateSubmit(e) {
  e.preventDefault();
  const empresa = document.getElementById('corpEmpresa').value.trim();
  const contacto = document.getElementById('corpContacto').value.trim();
  const telefono = document.getElementById('corpTelefono').value.trim();
  const participantes = document.getElementById('corpParticipantes').value.trim();

  const mensaje = 
`🏢 *SOLICITUD DE EVENTO GRUPAL / TEAM BUILDING*
Museo Arocena - Los Secretos del Arocena

• *Institución / Empresa:* ${empresa}
• *Contacto:* ${contacto}
• *Teléfono:* ${telefono}
• *Participantes aproximados:* ${participantes || 'Por definir'}

Nos gustaría recibir una cotización y fechas disponibles para un rally o visita privada.`;

  const waUrl = `https://wa.me/${appState.museumWhatsAppNumber}?text=${encodeURIComponent(mensaje)}`;
  closeCorporateModal();
  window.open(waUrl, '_blank');
}

// FAQ Accordion Toggle
function toggleFaq(button) {
  const card = button.closest('.faq-card');
  const content = card.querySelector('.faq-content');
  const icon = button.querySelector('i');

  if (content.classList.contains('hidden')) {
    content.classList.remove('hidden');
    icon.classList.add('rotate-180');
  } else {
    content.classList.add('hidden');
    icon.classList.remove('rotate-180');
  }
}

// Close modals when clicking outside
window.addEventListener('click', (e) => {
  const inviteModal = document.getElementById('inviteModal');
  const corpModal = document.getElementById('corporateModal');
  if (e.target === inviteModal) closeInviteModal();
  if (e.target === corpModal) closeCorporateModal();
});
