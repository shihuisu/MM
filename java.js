(() => {
  const body = document.body;
  const cover = document.getElementById('cover');
  const reader = document.getElementById('reader');
  const stage = document.getElementById('chapterStage');
  const enterButton = document.getElementById('enterButton');
  const restartButton = document.getElementById('restartButton');
  const prevButton = document.getElementById('prevButton');
  const nextButton = document.getElementById('nextButton');
  const chapterLabel = document.getElementById('chapterLabel');
  const progressFill = document.getElementById('progressFill');
  const soundToggle = document.getElementById('soundToggle');
  const bgm = document.getElementById('bgm');
  const chapters = [...document.querySelectorAll('.page[data-chapter]')];
  let activeIndex = 0;
  let touchStartX = 0;
  let touchStartY = 0;

  const setSound = async (enabled) => {
    bgm.volume = 0.28;
    if (enabled) {
      try {
        await bgm.play();
        soundToggle.textContent = 'Sound on';
        soundToggle.setAttribute('aria-pressed', 'true');
      } catch (_) {
        soundToggle.textContent = 'Sound off';
        soundToggle.setAttribute('aria-pressed', 'false');
      }
      return;
    }
    bgm.pause();
    soundToggle.textContent = 'Sound off';
    soundToggle.setAttribute('aria-pressed', 'false');
  };

  const showChapter = (nextIndex, direction = 1) => {
    if (nextIndex < 0 || nextIndex >= chapters.length || nextIndex === activeIndex) return;
    const outgoing = chapters[activeIndex];
    const incoming = chapters[nextIndex];
    outgoing.classList.remove('is-active');
    outgoing.classList.add(direction > 0 ? 'exit-left' : 'exit-right');
    incoming.hidden = false;
    incoming.scrollTop = 0;
    incoming.classList.add(direction > 0 ? 'enter-right' : 'enter-left');

    window.requestAnimationFrame(() => {
      incoming.classList.remove('enter-right', 'enter-left');
      incoming.classList.add('is-active');
    });

    window.setTimeout(() => {
      outgoing.hidden = true;
      outgoing.classList.remove('exit-left', 'exit-right');
    }, 430);

    activeIndex = nextIndex;
    chapterLabel.textContent = `${String(activeIndex + 1).padStart(2, '0')} / ${String(chapters.length).padStart(2, '0')}`;
    progressFill.style.width = `${((activeIndex + 1) / chapters.length) * 100}%`;
    prevButton.disabled = activeIndex === 0;
    nextButton.disabled = activeIndex === chapters.length - 1;
    nextButton.querySelector('span').textContent = activeIndex === chapters.length - 2 ? 'Final page' : 'Next';
  };

  const enterStory = () => {
    body.classList.remove('is-gated');
    body.classList.add('story-entered');
    cover.setAttribute('aria-hidden', 'true');
    reader.setAttribute('aria-hidden', 'false');
    reader.focus({ preventScroll: true });
    setSound(true);
  };

  const restartStory = () => {
    if (activeIndex !== 0) showChapter(0, -1);
    setSound(false);
    body.classList.add('is-gated');
    body.classList.remove('story-entered');
    cover.setAttribute('aria-hidden', 'false');
    reader.setAttribute('aria-hidden', 'true');
    enterButton.focus({ preventScroll: true });
  };

  enterButton.addEventListener('click', enterStory);
  restartButton.addEventListener('click', restartStory);
  prevButton.addEventListener('click', () => showChapter(activeIndex - 1, -1));
  nextButton.addEventListener('click', () => showChapter(activeIndex + 1, 1));
  soundToggle.addEventListener('click', () => setSound(bgm.paused));

  stage.addEventListener('touchstart', (event) => {
    touchStartX = event.changedTouches[0].clientX;
    touchStartY = event.changedTouches[0].clientY;
  }, { passive: true });
  stage.addEventListener('touchend', (event) => {
    const dx = event.changedTouches[0].clientX - touchStartX;
    const dy = event.changedTouches[0].clientY - touchStartY;
    if (Math.abs(dx) < 70 || Math.abs(dx) < Math.abs(dy)) return;
    showChapter(activeIndex + (dx < 0 ? 1 : -1), dx < 0 ? 1 : -1);
  }, { passive: true });

  document.addEventListener('keydown', (event) => {
    if (!body.classList.contains('story-entered')) return;
    const modalOpen = document.querySelector('.is-open, .show');
    if (modalOpen && event.key !== 'Escape') return;
    if (event.key === 'ArrowRight' || event.key === 'PageDown') showChapter(activeIndex + 1, 1);
    if (event.key === 'ArrowLeft' || event.key === 'PageUp') showChapter(activeIndex - 1, -1);
  });

  const thoughtModal = document.getElementById('thoughtModal');
  const thoughtBtn = document.getElementById('thoughtBtn');
  const thoughtClose = document.getElementById('modalClose');
  const toggleThought = (open) => {
    thoughtModal.classList.toggle('is-open', open);
    thoughtModal.setAttribute('aria-hidden', String(!open));
    body.classList.toggle('modal-open', open);
    if (open) thoughtClose.focus({ preventScroll: true });
    else thoughtBtn.focus({ preventScroll: true });
  };
  thoughtBtn.addEventListener('click', () => toggleThought(true));
  thoughtClose.addEventListener('click', () => toggleThought(false));
  thoughtModal.addEventListener('click', (event) => {
    if (event.target === thoughtModal) toggleThought(false);
  });

  const answerPop = document.getElementById('answerPop');
  const answerText = document.getElementById('answerText');
  const answerClose = answerPop.querySelector('.close-pop');
  const closeAnswer = () => {
    answerPop.classList.remove('show');
    answerPop.setAttribute('aria-hidden', 'true');
    body.classList.remove('modal-open');
  };
  document.querySelectorAll('.pill').forEach((button) => {
    button.addEventListener('click', () => {
      answerText.textContent = button.dataset.answer || '';
      answerPop.classList.add('show');
      answerPop.setAttribute('aria-hidden', 'false');
      body.classList.add('modal-open');
      answerClose.focus({ preventScroll: true });
    });
  });
  answerClose.addEventListener('click', closeAnswer);
  answerPop.addEventListener('click', (event) => {
    if (event.target === answerPop) closeAnswer();
  });

  const p7Modal = document.getElementById('p7-modal');
  const p7Open = document.querySelector('.p7-upgrade-btn');
  const p7Close = document.getElementById('p7Close');
  const p7Later = document.getElementById('p7Later');
  const p7Proceed = document.getElementById('p7Proceed');
  const toggleP7 = (open) => {
    p7Modal.classList.toggle('is-open', open);
    p7Modal.setAttribute('aria-hidden', String(!open));
    body.classList.toggle('modal-open', open);
    if (open) p7Close.focus({ preventScroll: true });
    else p7Open.focus({ preventScroll: true });
  };
  p7Open.addEventListener('click', () => toggleP7(true));
  p7Close.addEventListener('click', () => toggleP7(false));
  p7Later.addEventListener('click', () => toggleP7(false));
  p7Proceed.addEventListener('click', () => {
    p7Proceed.textContent = 'Connection refused';
    p7Proceed.disabled = true;
    window.setTimeout(() => toggleP7(false), 900);
  });
  p7Modal.addEventListener('click', (event) => {
    if (event.target === p7Modal) toggleP7(false);
  });

  document.addEventListener('keydown', (event) => {
    if (event.key !== 'Escape') return;
    if (thoughtModal.classList.contains('is-open')) toggleThought(false);
    if (answerPop.classList.contains('show')) closeAnswer();
    if (p7Modal.classList.contains('is-open')) toggleP7(false);
  });

  progressFill.style.width = `${100 / chapters.length}%`;
  prevButton.disabled = true;
})();

