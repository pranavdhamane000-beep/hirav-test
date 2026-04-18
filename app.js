document.addEventListener('DOMContentLoaded', () => {
    
    // --- Tab Switching Logic ---
    const navItems = document.querySelectorAll('.nav-item');
    const tabPanes = document.querySelectorAll('.tab-pane');
    
    // Also handle dashboard icon buttons in topbar
    const topbarIcons = document.querySelectorAll('.icon-btn[data-target]');

    window.switchTab = function(targetId) {
        // Remove active class from all nav items and tabs
        navItems.forEach(nav => nav.classList.remove('active'));
        const dynamicPanes = document.querySelectorAll('.tab-pane');
        dynamicPanes.forEach(tab => tab.classList.remove('active'));

        // Add active class to corresponding tab
        const targetTab = document.getElementById(targetId);
        if (targetTab) {
            targetTab.classList.add('active');
        }

        // Add active class to corresponding nav item in sidebar (if exists)
        const correspondingNav = document.querySelector(`.nav-item[data-target="${targetId}"]`);
        if (correspondingNav) {
            correspondingNav.classList.add('active');
        }
    }

    // Attach click events to Sidebar Navigation
    navItems.forEach(item => {
        item.addEventListener('click', (e) => {
            e.preventDefault();
            const targetId = item.getAttribute('data-target');
            window.switchTab(targetId);
        });
    });

    // Attach click events to Topbar Icons (like Rewards)
    topbarIcons.forEach(icon => {
        icon.addEventListener('click', (e) => {
            e.preventDefault();
            const targetId = icon.getAttribute('data-target');
            window.switchTab(targetId);
        });
    });

    // --- Modal Logic ---
    const createModal = document.getElementById('create-modal');
    const btnUniversalCreate = document.getElementById('btn-universal-create');
    const inlineCreateTrigger = document.getElementById('inline-create-trigger');

    function openModal() {
        const modal = document.getElementById('create-modal');
        if(modal) modal.classList.add('active');
        window.resetModalView(); // Ensure it opens to the main menu
    }

    // Open from topbar button
    if (btnUniversalCreate) {
        btnUniversalCreate.addEventListener('click', openModal);
    }

    // Open from inline composer on Home Feed
    if (inlineCreateTrigger) {
        const input = inlineCreateTrigger.querySelector('input');
        if(input) input.addEventListener('click', openModal);
    }

    // Close when clicking outside of modal content
    createModal.addEventListener('click', (e) => {
        if (e.target === createModal) {
            window.closeModal();
        }
    });

});

// Global functions for inline HTML event handlers
window.switchCreateView = function(viewId) {
    // Hide all views inside modal-body
    const views = document.querySelectorAll('.create-form-view, #create-view-menu');
    views.forEach(view => {
        if(view) view.style.display = 'none';
    });
    
    // Show the targeted view
    const target = document.getElementById('create-view-' + viewId);
    if(target) {
        target.style.display = (viewId === 'menu') ? 'grid' : 'block';
    }
    
    // Update header title based on view
    const titleObj = document.getElementById('modal-title');
    if(!titleObj) return;

    if (viewId === 'menu') titleObj.innerText = 'What would you like to create?';
    else if (viewId === 'update') titleObj.innerText = 'Post an Update';
    else if (viewId === 'event') titleObj.innerText = 'Create an Event';
    else if (viewId === 'job') titleObj.innerText = 'Post a Job';
    else if (viewId === 'offer') titleObj.innerText = 'Offer a Service';
    else if (viewId === 'request') titleObj.innerText = 'Request a Service';
    else if (viewId === 'funding') titleObj.innerText = 'Ask for Funding / Partnership';
};

window.resetModalView = function() {
    window.switchCreateView('menu');
};

window.closeModal = function() {
    window.resetModalView();
    const modals = document.querySelectorAll('.modal-overlay.active');
    modals.forEach(m => m.classList.remove('active'));
};

// Profile Dropdown Logic
window.togglePfpDropdown = function() {
    const dropdown = document.getElementById('pfp-dropdown');
    if(dropdown) {
        dropdown.style.display = (dropdown.style.display === 'none' || dropdown.style.display === '') ? 'block' : 'none';
    }
};

// Close dropdown when clicking outside
document.addEventListener('click', function(e) {
    const dropdown = document.getElementById('pfp-dropdown');
    const trigger = document.getElementById('pfp-trigger');
    
    if (dropdown && trigger) {
        if (!trigger.contains(e.target) && !dropdown.contains(e.target)) {
            dropdown.style.display = 'none';
        }
    }
});

// --- Authentication Flow Logic ---
window.switchAuthView = function(viewId) {
    const views = document.querySelectorAll('.auth-form-container');
    views.forEach(v => {
        v.style.display = 'none';
        v.classList.remove('active');
    });
    
    const target = document.getElementById('auth-view-' + viewId);
    if(target) {
        target.style.display = 'flex';
        // tiny delay for animation feel if needed
        setTimeout(() => target.classList.add('active'), 10);
    }
};

window.populateProfileData = function() {
    const fName = document.getElementById('auth-fname') ? document.getElementById('auth-fname').value.trim() : '';
    const lName = document.getElementById('auth-lname') ? document.getElementById('auth-lname').value.trim() : '';
    const job = document.getElementById('auth-job') ? document.getElementById('auth-job').value.trim() : '';
    const loc = document.getElementById('auth-loc') ? document.getElementById('auth-loc').value.trim() : '';
    const edu = document.getElementById('auth-edu') ? document.getElementById('auth-edu').value.trim() : '';

    if (fName || lName) {
        let fullName = fName + (fName && lName ? ' ' : '') + lName;
        if(document.getElementById('prof-fullname')) document.getElementById('prof-fullname').innerText = fullName;
    }
    if (job && document.getElementById('prof-job')) {
        document.getElementById('prof-job').innerText = job;
    }
    if (loc && document.getElementById('prof-loc')) {
        document.getElementById('prof-loc').innerText = loc;
    }
    if (edu && document.getElementById('prof-edu-display')) {
        const eduDisplay = document.getElementById('prof-edu-display');
        eduDisplay.innerText = edu;
        eduDisplay.style.display = 'block';
    }
};

window.enterApplication = function() {
    // Persist state from Onboarding to Profile Tab
    window.populateProfileData();

    // Hide Auth Portal
    document.getElementById('auth-portal').style.display = 'none';
    
    // Show Main App
    const appContainer = document.querySelector('.app-container');
    appContainer.style.display = 'flex';
    appContainer.style.animation = 'fadeIn 0.8s ease-in-out';
};

