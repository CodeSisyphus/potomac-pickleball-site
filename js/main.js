/* ============================================
   POTOMAC PICKLEBALL CLUB — Main JavaScript
   ============================================ */

document.addEventListener('DOMContentLoaded', () => {

  // --- Mobile Navigation ---
  const navToggle = document.querySelector('.nav-toggle');
  const navLinks = document.querySelector('.nav-links');
  const navOverlay = document.querySelector('.nav-overlay');

  if (navToggle) {
    navToggle.addEventListener('click', () => {
      navToggle.classList.toggle('active');
      navLinks.classList.toggle('open');
      navOverlay.classList.toggle('active');
      document.body.style.overflow = navLinks.classList.contains('open') ? 'hidden' : '';
    });

    if (navOverlay) {
      navOverlay.addEventListener('click', () => {
        navToggle.classList.remove('active');
        navLinks.classList.remove('open');
        navOverlay.classList.remove('active');
        document.body.style.overflow = '';
      });
    }

    // Close mobile nav on link click
    navLinks.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => {
        navToggle.classList.remove('active');
        navLinks.classList.remove('open');
        navOverlay.classList.remove('active');
        document.body.style.overflow = '';
      });
    });
  }

  // --- Header scroll effect ---
  const header = document.querySelector('.header');
  if (header) {
    window.addEventListener('scroll', () => {
      header.classList.toggle('scrolled', window.scrollY > 50);
    });
  }

  // --- Active nav link ---
  const currentPage = window.location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.nav-links a').forEach(link => {
    const href = link.getAttribute('href');
    if (href === currentPage || (currentPage === '' && href === 'index.html')) {
      link.classList.add('active');
    }
  });

  // --- Scroll animations ---
  const animatedElements = document.querySelectorAll('.fade-in, .fade-in-left, .fade-in-right');

  if (animatedElements.length > 0) {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          observer.unobserve(entry.target);
        }
      });
    }, {
      threshold: 0.15,
      rootMargin: '0px 0px -40px 0px'
    });

    animatedElements.forEach(el => observer.observe(el));
  }

  // --- Contact form validation ---
  const contactForm = document.getElementById('contactForm');
  if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();
      let isValid = true;

      const fields = contactForm.querySelectorAll('[required]');
      fields.forEach(field => {
        const group = field.closest('.form-group');
        const value = field.value.trim();

        if (!value) {
          group.classList.add('error');
          group.querySelector('.error-msg').textContent = 'This field is required';
          isValid = false;
        } else if (field.type === 'email' && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
          group.classList.add('error');
          group.querySelector('.error-msg').textContent = 'Please enter a valid email';
          isValid = false;
        } else {
          group.classList.remove('error');
        }
      });

      if (isValid) {
        const btn = contactForm.querySelector('.btn');
        const originalText = btn.textContent;
        btn.textContent = 'Sending...';
        btn.disabled = true;

        fetch(contactForm.action, {
          method: 'POST',
          body: new FormData(contactForm),
          headers: { 'Accept': 'application/json' }
        }).then(response => {
          if (response.ok) {
            btn.textContent = 'Message Sent!';
            btn.style.background = '#1B5E20';
            btn.style.color = '#fff';
            contactForm.reset();
          } else {
            btn.textContent = 'Error — Try Again';
            btn.style.background = '#c62828';
            btn.style.color = '#fff';
          }
          setTimeout(() => {
            btn.textContent = originalText;
            btn.style.background = '';
            btn.style.color = '';
            btn.disabled = false;
          }, 3000);
        }).catch(() => {
          btn.textContent = 'Error — Try Again';
          btn.style.background = '#c62828';
          btn.style.color = '#fff';
          setTimeout(() => {
            btn.textContent = originalText;
            btn.style.background = '';
            btn.style.color = '';
            btn.disabled = false;
          }, 3000);
        });
      }
    });

    // Clear error on input
    contactForm.querySelectorAll('input, textarea').forEach(field => {
      field.addEventListener('input', () => {
        field.closest('.form-group').classList.remove('error');
      });
    });
  }

  // --- Lightbox (Community Gallery) ---
  const lightbox = document.querySelector('.lightbox');
  const lightboxImg = lightbox ? lightbox.querySelector('img') : null;
  const lightboxClose = lightbox ? lightbox.querySelector('.lightbox-close') : null;

  document.querySelectorAll('.gallery-item').forEach(item => {
    item.addEventListener('click', () => {
      const img = item.querySelector('img');
      if (img && lightbox && lightboxImg) {
        lightboxImg.src = img.src;
        lightboxImg.alt = img.alt;
        lightbox.classList.add('active');
        document.body.style.overflow = 'hidden';
      }
    });
  });

  if (lightbox) {
    const closeLightbox = () => {
      lightbox.classList.remove('active');
      document.body.style.overflow = '';
    };

    if (lightboxClose) lightboxClose.addEventListener('click', closeLightbox);
    lightbox.addEventListener('click', (e) => {
      if (e.target === lightbox) closeLightbox();
    });
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && lightbox.classList.contains('active')) closeLightbox();
    });
  }

  // --- Chat Widget ---
  const chatWidget = document.querySelector('.chat-widget');
  const chatToggle = document.querySelector('.chat-toggle');
  const chatInput = document.querySelector('.chat-input');
  const chatSend = document.querySelector('.chat-send');
  const chatMessages = document.querySelector('.chat-messages');

  if (chatToggle && chatWidget) {
    chatToggle.addEventListener('click', () => {
      chatWidget.classList.toggle('open');
      if (chatWidget.classList.contains('open') && chatInput) {
        setTimeout(() => chatInput.focus(), 300);
      }
    });
  }

  function getTimeString() {
    return new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  }

  function addMessage(text, sender) {
    if (!chatMessages) return;
    const msg = document.createElement('div');
    msg.className = 'chat-message ' + sender;
    msg.innerHTML = text + '<span class="msg-time">' + getTimeString() + '</span>';
    chatMessages.appendChild(msg);
    chatMessages.scrollTop = chatMessages.scrollHeight;
  }

  function getBotReply(userMsg) {
    const msg = userMsg.toLowerCase();
    if (msg.includes('membership') || msg.includes('join') || msg.includes('member')) {
      return 'Membership is completely free! You can sign up on our <a href="membership.html" style="color: var(--primary); font-weight:600;">Membership page</a>.';
    } else if (msg.includes('program') || msg.includes('clinic') || msg.includes('camp')) {
      return 'We offer 4 programs: Pickleball for All Ages, Community Wellness, International Exchanges, and Youth Camps. Check out our <a href="programs.html" style="color: var(--primary); font-weight:600;">Programs page</a> for details!';
    } else if (msg.includes('location') || msg.includes('where') || msg.includes('court') || msg.includes('play')) {
      return 'Our headquarters is in Potomac, Maryland. We also have partner locations in Taiwan and China. See our <a href="locations.html" style="color: var(--primary); font-weight:600;">Locations page</a>.';
    } else if (msg.includes('contact') || msg.includes('email') || msg.includes('reach')) {
      return 'You can reach us at <a href="mailto:Info@potomacpickleballclub.org" style="color: var(--primary); font-weight:600;">Info@potomacpickleballclub.org</a> or use our <a href="contact.html" style="color: var(--primary); font-weight:600;">Contact form</a>.';
    } else if (msg.includes('hello') || msg.includes('hi') || msg.includes('hey')) {
      return 'Hello! Welcome to Potomac Pickleball Club. How can I help you today? I can answer questions about membership, programs, locations, or how to get in touch.';
    } else if (msg.includes('hour') || msg.includes('schedule') || msg.includes('time') || msg.includes('open')) {
      return 'We have play sessions throughout the week at multiple locations. Please <a href="contact.html" style="color: var(--primary); font-weight:600;">contact us</a> for the current schedule.';
    } else if (msg.includes('thank')) {
      return "You're welcome! Feel free to ask anything else. See you on the courts!";
    } else {
      return "Thanks for your message! For detailed assistance, please <a href='contact.html' style='color: var(--primary); font-weight:600;'>contact us directly</a> or email us at Info@potomacpickleballclub.org. I can also help with questions about membership, programs, or locations.";
    }
  }

  function handleChatSend() {
    if (!chatInput) return;
    const text = chatInput.value.trim();
    if (!text) return;

    addMessage(text, 'user');
    chatInput.value = '';

    // Simulate typing delay
    setTimeout(() => {
      addMessage(getBotReply(text), 'bot');
    }, 600);
  }

  if (chatSend) {
    chatSend.addEventListener('click', handleChatSend);
  }

  if (chatInput) {
    chatInput.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') handleChatSend();
    });
  }

  // --- Quick Reply Buttons ---
  document.querySelectorAll('.chat-quick-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const question = btn.textContent.trim();
      addMessage(question, 'user');

      // Hide quick replies after first use
      const quickReplies = document.querySelector('.chat-quick-replies');
      if (quickReplies) quickReplies.style.display = 'none';

      setTimeout(() => {
        addMessage(getBotReply(question), 'bot');
      }, 600);
    });
  });

});
