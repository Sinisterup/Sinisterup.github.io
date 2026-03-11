// --- SEMANTIC NAVIGATION LOGIC ---
const navLinks = document.querySelectorAll('.nav-link');
const pages = document.querySelectorAll('.page-module');

navLinks.forEach(link => {
    link.addEventListener('click', (e) => {
        e.preventDefault(); // Prevents the default anchor jump down the page
        
        // Remove active class from all pages
        pages.forEach(page => page.classList.remove('active'));
        
        // Find the target page ID from the clicked link and add the active class
        const targetId = link.getAttribute('data-target');
        const targetPage = document.getElementById(targetId);
        if (targetPage) {
            targetPage.classList.add('active');
        }
    });
});

// --- ENHANCED DARK MODE LOGIC ---
const themeToggleBtn = document.getElementById('theme-toggle');
const body = document.body;

// 1. Check local storage OR the user's system preference
const savedTheme = localStorage.getItem('theme');
const systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;

// If they explicitly saved 'dark' previously, OR if they haven't saved anything but their device is in dark mode
if (savedTheme === 'dark' || (!savedTheme && systemPrefersDark)) {
    body.classList.add('dark-mode');
    themeToggleBtn.innerText = 'Light Mode';
} else {
    themeToggleBtn.innerText = 'Dark Mode';
}

// 2. Listen for clicks on the toggle button
themeToggleBtn.addEventListener('click', () => {
    // Toggle the dark mode class on the body
    body.classList.toggle('dark-mode');
    
    // Check the current state
    const isDark = body.classList.contains('dark-mode');
    
    // Save the new preference to their browser and update the button text
    localStorage.setItem('theme', isDark ? 'dark' : 'light');
    themeToggleBtn.innerText = isDark ? '☀️ Light Mode' : '🌙 Dark Mode';
});