import './style.css'

const mobileMenuBtn = document.getElementById('mobileMenuBtn');
const mobileMenu = document.getElementById('mobileMenu');
const navLinks = document.querySelectorAll('.nav-links a, .mobile-menu a');
const contactForm = document.getElementById('contactForm');
const amountButtons = document.querySelectorAll('.amount-btn');
const amountInput = document.getElementById('amount');

mobileMenuBtn.addEventListener('click', () => {
  mobileMenu.classList.toggle('active');
  const spans = mobileMenuBtn.querySelectorAll('span');

  if (mobileMenu.classList.contains('active')) {
    spans[0].style.transform = 'rotate(45deg) translateY(8px)';
    spans[1].style.opacity = '0';
    spans[2].style.transform = 'rotate(-45deg) translateY(-8px)';
  } else {
    spans[0].style.transform = 'none';
    spans[1].style.opacity = '1';
    spans[2].style.transform = 'none';
  }
});

navLinks.forEach(link => {
  link.addEventListener('click', (e) => {
    e.preventDefault();
    const targetId = link.getAttribute('href');
    const targetSection = document.querySelector(targetId);

    if (targetSection) {
      const navbarHeight = document.querySelector('.navbar').offsetHeight;
      const targetPosition = targetSection.offsetTop - navbarHeight;

      window.scrollTo({
        top: targetPosition,
        behavior: 'smooth'
      });

      if (mobileMenu.classList.contains('active')) {
        mobileMenu.classList.remove('active');
        const spans = mobileMenuBtn.querySelectorAll('span');
        spans[0].style.transform = 'none';
        spans[1].style.opacity = '1';
        spans[2].style.transform = 'none';
      }
    }
  });
});

amountButtons.forEach(btn => {
  btn.addEventListener('click', () => {
    amountButtons.forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    amountInput.value = btn.dataset.amount;
  });
});

amountInput.addEventListener('input', () => {
  amountButtons.forEach(b => b.classList.remove('active'));
});

contactForm.addEventListener('submit', async (e) => {
  e.preventDefault();

  const submitBtn = contactForm.querySelector('.submit-btn');
  const originalText = submitBtn.textContent;

  submitBtn.disabled = true;
  submitBtn.textContent = 'جاري الإرسال...';

  const formData = {
    name: document.getElementById('name').value,
    email: document.getElementById('email').value,
    phone: document.getElementById('phone').value,
    amount: document.getElementById('amount').value,
    timestamp: new Date().toISOString()
  };

  try {
    const scriptUrl = import.meta.env.VITE_GOOGLE_SCRIPT_URL;

    if (!scriptUrl || scriptUrl === 'YOUR_GOOGLE_SCRIPT_WEB_APP_URL_HERE') {
      throw new Error('Google Script URL not configured');
    }

    const response = await fetch(scriptUrl, {
      method: 'POST',
      mode: 'no-cors',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(formData)
    });

    alert('شكراً لتواصلك معنا! سنتواصل معك قريباً.');
    contactForm.reset();

  } catch (error) {
    console.error('Error submitting form:', error);
    alert('حدث خطأ أثناء إرسال النموذج. يرجى المحاولة مرة أخرى.');
  } finally {
    submitBtn.disabled = false;
    submitBtn.textContent = originalText;
  }
});

let lastScroll = 0;
const navbar = document.querySelector('.navbar');

window.addEventListener('scroll', () => {
  const currentScroll = window.pageYOffset;

  if (currentScroll <= 0) {
    navbar.style.backgroundColor = 'rgba(17, 24, 39, 0.7)';
  } else {
    navbar.style.backgroundColor = 'rgba(17, 24, 39, 0.95)';
  }

  lastScroll = currentScroll;
});

const observerOptions = {
  threshold: 0.1,
  rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.style.opacity = '1';
      entry.target.style.transform = 'translateY(0)';
    }
  });
}, observerOptions);

const animatedElements = document.querySelectorAll('.about-card, .service-card, .contact-item, .contact-form');
animatedElements.forEach(el => {
  el.style.opacity = '0';
  el.style.transform = 'translateY(30px)';
  el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
  observer.observe(el);
});
