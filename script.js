document.addEventListener('DOMContentLoaded', () => {
    const overlay = document.getElementById('overlay');
    const invitation = document.getElementById('invitation');
    const music1 = document.getElementById('music1');
    const music2 = document.getElementById('music2');

    // --- Overlay & Music Logic ---
    let musicStarted = false;
    let currentTrack = 1;

    // Music Controls
    const musicButtons = {
        toggle: document.getElementById('music-toggle'),
        next: document.getElementById('music-next'),
        volume: document.getElementById('volume-slider')
    };

    // Initialize Volume
    music1.volume = 0.5;
    music2.volume = 0.5;

    function startExperience() {
        if (musicStarted) return;
        musicStarted = true;

        // Visuals
        overlay.classList.add('hidden');
        invitation.classList.remove('hidden');
        setTimeout(() => {
            invitation.classList.add('visible');
        }, 500);

        // Audio
        playMusicFlow();
    }

    function playMusicFlow() {
        if (currentTrack === 1) {
            music1.play().catch(e => console.log("User interaction needed"));
            musicButtons.toggle.textContent = "⏸";
        } else {
            music2.play().catch(e => console.log("User interaction needed"));
            musicButtons.toggle.textContent = "⏸";
        }
    }

    // Audio Looping Logic & Controls
    music1.addEventListener('ended', () => {
        currentTrack = 2;
        music2.play();
    });
    music2.addEventListener('ended', () => {
        currentTrack = 1;
        music1.play();
    });

    musicButtons.toggle.addEventListener('click', () => {
        if (music1.paused && music2.paused) {
            if (currentTrack === 1) music1.play();
            else music2.play();
            musicButtons.toggle.textContent = "⏸";
        } else {
            music1.pause();
            music2.pause();
            musicButtons.toggle.textContent = "▶";
        }
    });

    musicButtons.next.addEventListener('click', () => {
        music1.pause();
        music1.currentTime = 0;
        music2.pause();
        music2.currentTime = 0;

        // Toggle track
        currentTrack = currentTrack === 1 ? 2 : 1;
        if (currentTrack === 1) music1.play();
        else music2.play();

        musicButtons.toggle.textContent = "⏸";
    });

    // Volume Control
    musicButtons.volume.addEventListener('input', (e) => {
        const vol = e.target.value;
        music1.volume = vol;
        music2.volume = vol;
    });

    overlay.addEventListener('click', startExperience);

    // --- Map Tabs ---
    const tabBtns = document.querySelectorAll('.tab-btn');
    const mapViews = document.querySelectorAll('.map-view');

    tabBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            // Remove active class from all
            tabBtns.forEach(b => b.classList.remove('active'));
            mapViews.forEach(v => v.classList.remove('active'));

            // Add active to clicked
            btn.classList.add('active');
            const targetId = btn.getAttribute('data-target');
            document.getElementById(targetId).classList.add('active');
        });
    });

    // --- Form Logic: Other Diet ---
    const dietRadios = document.getElementsByName('diet');
    const dietOtherInput = document.getElementById('diet-other');

    function checkDiet() {
        let isOther = false;
        for (const radio of dietRadios) {
            if (radio.checked && radio.value === 'Otro') {
                isOther = true;
            }
        }
        dietOtherInput.disabled = !isOther;
        if (isOther) dietOtherInput.focus();
    }

    // Attach listeners to all diet radios
    Array.from(dietRadios).forEach(radio => {
        radio.addEventListener('change', checkDiet);
    });

    // --- Form Logic: Transport ---
    const transportRadios = document.getElementsByName('transport');
    const transportDetails = document.getElementById('transport-details');

    function checkTransport() {
        let showDetails = false;
        for (const radio of transportRadios) {
            if (radio.checked && radio.value === 'Auto') {
                showDetails = true;
            }
        }

        if (showDetails) {
            transportDetails.classList.add('visible');
            // Add 'required' attributes to inputs inside
            setRequired(true);
        } else {
            transportDetails.classList.remove('visible');
            setRequired(false);
        }
    }

    function setRequired(isRequired) {
        const inputs = transportDetails.querySelectorAll('input, select');
        inputs.forEach(input => {
            if (isRequired) {
                input.setAttribute('required', 'true');
            } else {
                input.removeAttribute('required');
            }
        });
    }

    Array.from(transportRadios).forEach(radio => {
        radio.addEventListener('change', checkTransport);
    });

    // --- Modal Logic (Generic) ---
    // Helper to open modal
    function openModal(modalId) {
        const modal = document.getElementById(modalId);
        modal.style.display = 'flex';
        document.body.style.overflow = 'hidden'; // Prevent background scroll
        // Small delay to allow display:flex to apply before adding class for transition
        setTimeout(() => {
            modal.classList.add('show');
        }, 10);
    }

    // Helper to close modal
    function closeModalFunc(modalId) {
        const modal = document.getElementById(modalId);
        modal.classList.remove('show');
        document.body.style.overflow = ''; // Restore background scroll
        // Wait for animation to finish before hiding
        setTimeout(() => {
            modal.style.display = 'none';
        }, 300); // 300ms matches CSS transition
    }

    // Bases Modal
    const basesLink = document.getElementById('bases-link');
    const basesModal = document.getElementById('bases-modal');
    // Using querySelector to get the close btn inside the specific modal
    const closeBasesBtn = basesModal.querySelector('.close-modal');

    basesLink.addEventListener('click', (e) => {
        e.preventDefault();
        openModal('bases-modal');
    });

    closeBasesBtn.addEventListener('click', () => {
        closeModalFunc('bases-modal');
    });

    // Form Modal
    const openFormBtn = document.getElementById('open-form-btn');
    const formModal = document.getElementById('form-modal');
    const closeFormBtn = document.getElementById('close-form');

    if (openFormBtn) {
        openFormBtn.addEventListener('click', (e) => {
            e.preventDefault();
            openModal('form-modal');
        });
    }

    if (closeFormBtn) {
        closeFormBtn.addEventListener('click', () => {
            closeModalFunc('form-modal');
        });
    }

    // Close on click outside (Any modal)
    window.addEventListener('click', (e) => {
        if (e.target.classList.contains('modal')) {
            // Close the specific modal that was clicked
            closeModalFunc(e.target.id);
        }
    });

    // --- Form Submission ---
    const form = document.getElementById('rsvp-form');
    // Placeholder URL for Google Apps Script (User will need to update this)
    const GOOGLE_SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbx457L7qUNL6pl972AeEOft0sGRbLAQpnDluM3tpc5gwnpsCWb1UgGUiW3CV2WkFCHP/exec';

    form.addEventListener('submit', (e) => {
        e.preventDefault();

        const submitBtn = document.getElementById('submit-btn-real');
        const originalBtnText = submitBtn.textContent;

        // Collect Data
        const formData = new FormData(form);
        const data = {};
        formData.forEach((value, key) => data[key] = value);

        // Handle 'Other' diet text
        if (data.diet === 'Otro') {
            data.diet = `Otro: ${document.getElementById('diet-other').value}`;
        }

        console.log("Submitting:", data);

        // Disable button and show loader
        submitBtn.disabled = true;
        submitBtn.innerHTML = '<span class="spinner"></span>Enviando...';

        // Mock Submission (Success) - REPLACED WITH REAL LOGIC
        // Note: You must update GOOGLE_SCRIPT_URL with your deployment URL

        fetch(GOOGLE_SCRIPT_URL, {
            method: 'POST',
            body: JSON.stringify(data),
            mode: "no-cors", // Essential for Google Apps Script simple POSTs
            headers: {
                "Content-Type": "text/plain;charset=utf-8",
            },
        })
            .then(response => {
                // With no-cors, we can't check response.ok, so we assume success if no error.
                console.log("Request sent");
                showToast();
                closeModalFunc('form-modal'); // Close the form modal
                form.reset();
                checkDiet();
                checkTransport();
            })
            .catch(error => {
                console.error('Error:', error);
                alert("Hubo un error al enviar. Por favor intentalo de nuevo.");
            })
            .finally(() => {
                // Reset button state
                submitBtn.disabled = false;
                submitBtn.textContent = originalBtnText;
            });
    });

    function showToast() {
        const toast = document.getElementById('toast');
        toast.classList.remove('hidden');
        setTimeout(() => {
            toast.classList.add('hidden');
        }, 3000);
    }
});
