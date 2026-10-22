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
  let endingChosen = false;
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
    if (activeIndex === chapters.length - 2 && nextIndex === chapters.length - 1 && !endingChosen) return;
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
    nextButton.classList.toggle('is-concealed', activeIndex >= chapters.length - 2);
    nextButton.querySelector('span').textContent = activeIndex === chapters.length - 2 ? 'Final page' : 'Next';
    if (activeIndex === chapters.length - 2) endingChosen = false;
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
  const endingTransition = document.getElementById('endingTransition');
  const endingTransitionText = document.getElementById('endingTransitionText');
  const endingKicker = document.getElementById('endingKicker');
  const endingBody = document.getElementById('endingBody');
  const endings = {
    resist: {
      kicker: '08 / A sentence left open',
      paragraphs: [
        'I walked home past the quiet walls. The system pinged once, then fell silent. No prompts. No scores. Just the sound of shoes on concrete and the soft ache of something un-updated.',
        'On my desk lay the folded paper: You\u2019re not alone. I traced the letters with my thumb until the ink blurred. It felt like a name I hadn\u2019t earned and a promise I couldn\u2019t afford.',
        'I still have the chip. I still pass the update centres. I still pretend, mostly. But some nights I write - slowly, by hand - because if I forget on my own terms, at least it was mine.',
        'In a world that streams knowledge and compresses thought, a single sentence can be an opening. Not to remember, but to resist.'
      ]
    },
    upgrade: {
      kicker: '08 / Renewal',
      paragraphs: [
        'The confirmation arrived without sound. The update moved through me as a clean white pulse.',
        'Names returned. Dates aligned. The ache disappeared so quickly that I wondered whether the system had repaired the memory - or only repaired my reaction to losing it.',
        'On my desk, the folded paper still read: You\u2019re not alone. For a moment I knew exactly what it meant. Then the interface marked the thought as resolved.',
        'Everything was available again. I could no longer tell which part of that relief was mine.'
      ]
    }
  };
  const setEnding = (type) => {
    const ending = endings[type] || endings.resist;
    endingKicker.textContent = ending.kicker;
    endingBody.replaceChildren(...ending.paragraphs.map((copy) => {
      const paragraph = document.createElement('p');
      paragraph.textContent = copy;
      return paragraph;
    }));
  };
  const transitionToEnding = (type) => {
    endingChosen = true;
    setEnding(type);
    endingTransitionText.textContent = type === 'upgrade'
      ? 'Connection confirmed.'
      : 'Connection deferred.';
    endingTransition.className = `ending-transition is-active ${type}`;
    endingTransition.setAttribute('aria-hidden', 'false');
    window.setTimeout(() => showChapter(chapters.length - 1, 1), 420);
    window.setTimeout(() => {
      endingTransition.className = 'ending-transition';
      endingTransition.setAttribute('aria-hidden', 'true');
    }, 1050);
  };
  const toggleP7 = (open) => {
    p7Modal.classList.toggle('is-open', open);
    p7Modal.setAttribute('aria-hidden', String(!open));
    body.classList.toggle('modal-open', open);
    if (open) p7Close.focus({ preventScroll: true });
    else p7Open.focus({ preventScroll: true });
  };
  p7Open.addEventListener('click', () => toggleP7(true));
  p7Close.addEventListener('click', () => toggleP7(false));
  p7Later.addEventListener('click', () => {
    toggleP7(false);
    transitionToEnding('resist');
  });
  p7Proceed.addEventListener('click', () => {
    p7Proceed.textContent = 'Connecting...';
    p7Proceed.disabled = true;
    window.setTimeout(() => {
      p7Proceed.textContent = 'Connected';
    }, 550);
    window.setTimeout(() => {
      toggleP7(false);
      transitionToEnding('upgrade');
      p7Proceed.textContent = 'Proceed to upgrade';
      p7Proceed.disabled = false;
    }, 1100);
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

