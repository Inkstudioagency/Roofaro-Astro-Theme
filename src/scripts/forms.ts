/**
 * Form handling for every `.w-form` on the site (contact form, 401 password demo).
 *
 * The original forms post to a hosted form backend that doesn't exist on a static Astro site.
 * This script intercepts the submit before webflow.js sees it (capture phase on window) and:
 *   - POSTs the form data as JSON to PUBLIC_FORM_ENDPOINT (Formspree, Web3Forms, Basin, your own API…)
 *   - shows the original `.w-form-done` / `.w-form-fail` states exactly like the template does
 *   - swaps the submit label to its `data-wait` text while sending
 * With no endpoint configured the theme runs in demo mode and shows the success state.
 */
const endpoint: string = import.meta.env.PUBLIC_FORM_ENDPOINT ?? '';

function toggle(el: Element | null | undefined, show: boolean) {
  if (el instanceof HTMLElement) el.style.display = show ? 'block' : 'none';
}

async function send(form: HTMLFormElement): Promise<boolean> {
  if (!endpoint) return true;
  const data = Object.fromEntries(new FormData(form).entries());
  delete data._gotcha;
  try {
    const res = await fetch(endpoint, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
      body: JSON.stringify({ form: form.dataset.name ?? form.name, ...data }),
    });
    return res.ok;
  } catch {
    return false;
  }
}

window.addEventListener(
  'submit',
  async (event) => {
    const form = event.target;
    if (!(form instanceof HTMLFormElement)) return;
    const wrapper = form.closest('.w-form');
    if (!wrapper) return;

    event.preventDefault();
    event.stopImmediatePropagation();

    // Password page demo: static hosting can't validate a password, so show the error state.
    if (form.classList.contains('w-password-page')) {
      toggle(form.querySelector('.w-form-fail'), true);
      return;
    }

    // Honeypot: bots fill hidden fields, humans don't.
    const trap = form.querySelector<HTMLInputElement>('input[name="_gotcha"]');
    const done = wrapper.querySelector(':scope > .w-form-done');
    const fail = wrapper.querySelector(':scope > .w-form-fail');
    const submit = form.querySelector<HTMLInputElement>('input[type="submit"]');
    const label = submit?.value ?? '';

    if (submit?.dataset.wait) submit.value = submit.dataset.wait;
    toggle(fail, false);

    const ok = trap?.value ? true : await send(form);

    if (submit) submit.value = label;
    if (ok) {
      form.reset();
      toggle(form, false);
      toggle(done, true);
    } else {
      toggle(fail, true);
    }
  },
  true,
);
