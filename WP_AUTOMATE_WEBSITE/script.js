// Basic interactions for the landing page

document.addEventListener('DOMContentLoaded', () => {

    // FAQ Accordion
    const faqItems = document.querySelectorAll('.faq-item');

    faqItems.forEach(item => {
        const question = item.querySelector('.faq-question');

        question.addEventListener('click', () => {
            // Close other items
            faqItems.forEach(otherItem => {
                if (otherItem !== item) {
                    otherItem.classList.remove('active');
                }
            });

            // Toggle current
            item.classList.toggle('active');
        });
    });

    // Smooth scroll for internal links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth'
                });
            }
        });
    });

    // Intersection Observer for scroll animations
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, { threshold: 0.1 });

    // Animate features on scroll
    const features = document.querySelectorAll('.feature-card');
    features.forEach((feature, index) => {
        feature.style.opacity = '0';
        feature.style.transform = 'translateY(30px)';
        feature.style.transition = `all 0.5s ease ${index * 0.1}s`;
        observer.observe(feature);
    });

    // Countdown Timer
    function startCountdown() {
        // Set end date to 7 days from now (or use a fixed date)
        const endDate = new Date();
        endDate.setDate(endDate.getDate() + 7);
        endDate.setHours(23, 59, 59, 999);

        function updateCountdown() {
            const now = new Date().getTime();
            const distance = endDate.getTime() - now;

            if (distance < 0) {
                // Reset to another 7 days if expired
                endDate.setDate(endDate.getDate() + 7);
                return;
            }

            const days = Math.floor(distance / (1000 * 60 * 60 * 24));
            const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
            const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
            const seconds = Math.floor((distance % (1000 * 60)) / 1000);

            const daysEl = document.getElementById('days');
            const hoursEl = document.getElementById('hours');
            const minutesEl = document.getElementById('minutes');
            const secondsEl = document.getElementById('seconds');

            if (daysEl) daysEl.textContent = String(days).padStart(2, '0');
            if (hoursEl) hoursEl.textContent = String(hours).padStart(2, '0');
            if (minutesEl) minutesEl.textContent = String(minutes).padStart(2, '0');
            if (secondsEl) secondsEl.textContent = String(seconds).padStart(2, '0');
        }

        updateCountdown();
        setInterval(updateCountdown, 1000);
    }

    startCountdown();

    // Copies Left (scarcity - random decrease simulation)
    function updateCopiesLeft() {
        const copiesEl = document.getElementById('copies-left');
        if (copiesEl) {
            // Get stored value or start fresh
            let copies = localStorage.getItem('wp-copies-left');
            if (!copies || parseInt(copies) < 10) {
                copies = Math.floor(Math.random() * 20) + 35; // 35-55
            }
            copiesEl.textContent = copies;
            localStorage.setItem('wp-copies-left', copies);

            // Randomly decrease every few minutes
            setInterval(() => {
                let currentCopies = parseInt(localStorage.getItem('wp-copies-left'));
                if (currentCopies > 15) {
                    currentCopies -= 1;
                    localStorage.setItem('wp-copies-left', currentCopies);
                    copiesEl.textContent = currentCopies;
                }
            }, 180000); // Every 3 minutes
        }
    }

    updateCopiesLeft();

});

