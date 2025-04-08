// Main JavaScript for AutoCad Buddy

document.addEventListener('DOMContentLoaded', function() {
    // API URL - Change this to your actual API URL when deploying
    const API_URL = window.location.origin;
    
    // DOM Elements
    const loginBtn = document.getElementById('loginBtn');
    const authBox = document.getElementById('authBox');
    const tabBtns = document.querySelectorAll('.tab-btn');
    const tabContents = document.querySelectorAll('.tab-content');
    const registerBtn = document.getElementById('registerBtn');
    const loginSubmitBtn = document.getElementById('loginSubmitBtn');
    const pricingToggle = document.getElementById('pricingToggle');
    const pricingCards = document.querySelectorAll('.pricing-card');
    
    // Show/hide auth box when login button is clicked
    if (loginBtn) {
        loginBtn.addEventListener('click', function() {
            authBox.style.display = authBox.style.display === 'none' ? 'block' : 'none';
        });
    }
    
    // Tab switching functionality
    tabBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            const tabName = this.getAttribute('data-tab');
            
            // Update active tab button
            tabBtns.forEach(btn => btn.classList.remove('active'));
            this.classList.add('active');
            
            // Show corresponding tab content
            tabContents.forEach(content => content.classList.remove('active'));
            document.getElementById(tabName + 'Form').classList.add('active');
        });
    });
    
    // Registration functionality
    if (registerBtn) {
        registerBtn.addEventListener('click', function() {
            const name = document.getElementById('reg-name').value;
            const email = document.getElementById('reg-email').value;
            const password = document.getElementById('reg-password').value;
            
            if (!name || !email || !password) {
                alert('Please fill in all fields');
                return;
            }
            
            // Send registration request to API
            fetch(`${API_URL}/api/register`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    name: name,
                    email: email,
                    password: password
                })
            })
            .then(response => {
                if (!response.ok) {
                    throw new Error('Registration failed');
                }
                return response.json();
            })
            .then(data => {
                // Store token in localStorage
                localStorage.setItem('token', data.access_token);
                localStorage.setItem('user', JSON.stringify(data.user));
                
                // Redirect to dashboard or show success message
                alert('Registration successful! You are now logged in.');
                window.location.href = '/dashboard.html';
            })
            .catch(error => {
                console.error('Error:', error);
                alert('Registration failed. Please try again.');
            });
        });
    }
    
    // Login functionality
    if (loginSubmitBtn) {
        loginSubmitBtn.addEventListener('click', function() {
            const email = document.getElementById('login-email').value;
            const password = document.getElementById('login-password').value;
            
            if (!email || !password) {
                alert('Please fill in all fields');
                return;
            }
            
            // Send login request to API
            fetch(`${API_URL}/api/login`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    email: email,
                    password: password
                })
            })
            .then(response => {
                if (!response.ok) {
                    throw new Error('Login failed');
                }
                return response.json();
            })
            .then(data => {
                // Store token in localStorage
                localStorage.setItem('token', data.access_token);
                localStorage.setItem('user', JSON.stringify(data.user));
                
                // Redirect to dashboard or show success message
                alert('Login successful!');
                window.location.href = '/dashboard.html';
            })
            .catch(error => {
                console.error('Error:', error);
                alert('Login failed. Please check your credentials and try again.');
            });
        });
    }
    
    // Pricing toggle functionality
    if (pricingToggle) {
        // Monthly prices (default)
        const monthlyPrices = ['$0', '$29', '$99'];
        
        // Yearly prices (20% discount)
        const yearlyPrices = ['$0', '$278', '$950'];
        
        // Monthly equivalent for yearly prices
        const monthlyEquivalent = ['', 'Only $23.17/month', 'Only $79.17/month'];
        
        pricingToggle.addEventListener('change', function() {
            const isYearly = this.checked;
            
            // Update prices based on toggle state
            pricingCards.forEach((card, index) => {
                const priceElement = card.querySelector('.amount');
                const periodElement = card.querySelector('.period');
                const equivalentElement = card.querySelector('.monthly-equivalent');
                
                if (isYearly) {
                    priceElement.textContent = yearlyPrices[index];
                    periodElement.textContent = '/year';
                    equivalentElement.textContent = monthlyEquivalent[index];
                } else {
                    priceElement.textContent = monthlyPrices[index];
                    periodElement.textContent = '/month';
                    equivalentElement.textContent = '';
                }
            });
        });
    }
    
    // Check if user is already logged in
    const token = localStorage.getItem('token');
    if (token) {
        // Update UI for logged-in user
        if (loginBtn) {
            loginBtn.textContent = 'Dashboard';
            loginBtn.addEventListener('click', function() {
                window.location.href = '/dashboard.html';
            });
        }
    }
    
    // Contact form submission
    const contactForm = document.getElementById('contactForm');
    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            alert('Thank you for your message! We will get back to you soon.');
            contactForm.reset();
        });
    }
});
