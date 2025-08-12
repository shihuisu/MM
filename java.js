
function scrollToContent() {
  document.getElementById("page1").scrollIntoView({ behavior: "smooth" });
}
function scrollToPage2() {
  document.getElementById("page2").scrollIntoView({ behavior: "smooth" });
}
function scrollToPage3() {
  document.getElementById("page3").scrollIntoView({ behavior: "smooth" });
}


function revealTextOnScroll() {
  const elements = document.querySelectorAll('.fade-in-text');
  const windowHeight = window.innerHeight;

  elements.forEach(el => {
    const top = el.getBoundingClientRect().top;
    if (top < windowHeight - 100) {
      el.classList.add('visible');
    }
  });
}
window.addEventListener('scroll', revealTextOnScroll);
window.addEventListener('load', revealTextOnScroll);


const fadeIns = document.querySelectorAll('.fade-in-text');
const observer = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
    }
  });
}, { threshold: 0.1 });
fadeIns.forEach(el => observer.observe(el));


function openThought(){
  const modal = document.getElementById('thoughtModal');
  if(modal){ modal.classList.add('is-open'); modal.setAttribute('aria-hidden','false'); }
}
function closeThought(){
  const modal = document.getElementById('thoughtModal');
  if(modal){ modal.classList.remove('is-open'); modal.setAttribute('aria-hidden','true'); }
}

document.addEventListener('DOMContentLoaded', () => {
  const openBtn  = document.getElementById('thoughtBtn');
  const modal    = document.getElementById('thoughtModal');
  const closeBtn = document.getElementById('modalClose');

  if(openBtn){ openBtn.addEventListener('click', openThought); }
  if(closeBtn){ closeBtn.addEventListener('click', closeThought); }


  if(modal){
    modal.addEventListener('click', (e) => { if(e.target === modal) closeThought(); });
  }

  document.addEventListener('keydown', (e) => {
    if(e.key === 'Escape' && modal && modal.classList.contains('is-open')) closeThought();
  });
});

(function initPage6FadeIn(){
  const els = document.querySelectorAll('#page6 .fade-in-text');
  if (!('IntersectionObserver' in window)) {
   
    els.forEach(el => el.classList.add('visible'));
    return;
  }
  const io = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        e.target.classList.add('visible');
        io.unobserve(e.target);
      }
    });
  }, { threshold: 0.2 });
  els.forEach(el => io.observe(el));
})();


(function initPromptDeck(){
  const pop = document.getElementById('answerPop');
  const text = document.getElementById('answerText');
  const closeBtn = pop ? pop.querySelector('.close-pop') : null;

  
  document.addEventListener('click', (e) => {
    const btn = e.target.closest('.pill');
    if (!btn) return;
    const answer = btn.getAttribute('data-answer') || '';
    if (text) text.textContent = answer;
    if (pop) pop.classList.add('show');
  });

  
  if (closeBtn) {
    closeBtn.addEventListener('click', () => pop.classList.remove('show'));
  }

  if (pop) {
    pop.addEventListener('click', (e) => {
      if (e.target === pop) pop.classList.remove('show');
    });
  }
})();


function openP7(){
  var modal = document.getElementById('p7-modal');
  if(modal){ modal.classList.add('is-open'); document.body.style.overflow = 'hidden'; }
}
function closeP7(){
  var modal = document.getElementById('p7-modal');
  if(modal){ modal.classList.remove('is-open'); document.body.style.overflow = ''; }
}


document.addEventListener('click', function(e){
  var modal = document.getElementById('p7-modal');
  if(!modal) return;
  if(e.target === modal){ closeP7(); }
});

document.addEventListener('keydown', function(e){
  if(e.key === 'Escape'){ closeP7(); }
});

