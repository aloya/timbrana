/**
 * Timbrana First Build invitation form client.
 *
 * Uses ONLY the public Supabase URL + anon key from config.js.
 * Never place SUPABASE_SERVICE_ROLE_KEY in this file or any other frontend asset.
 */

(function () {
  const MAX = {
    reason_for_interest: 1500,
    project_awareness_meaning: 1500,
  };

  const REQUIRED_SELECTS = [
    "role",
    "company_type",
    "project_delivery_style",
    "feedback_preference",
  ];

  const REQUIRED_TEXT = ["full_name", "email", "company_name"];
  const REQUIRED_AREAS = ["reason_for_interest", "project_awareness_meaning"];

  function $(id) {
    return document.getElementById(id);
  }

  function getConfig() {
    const cfg = window.TIMBRANA_INVITE_CONFIG;
    if (!cfg || !cfg.supabaseUrl || !cfg.supabaseAnonKey) {
      return null;
    }
    return cfg;
  }

  function functionUrl(cfg) {
    if (cfg.functionUrl) return cfg.functionUrl.replace(/\/$/, "");
    const base = cfg.supabaseUrl.replace(/\/$/, "");
    const name = cfg.functionName || "pilot-invitation-request";
    return `${base}/functions/v1/${name}`;
  }

  function setFieldError(name, message) {
    const field = document.querySelector(`[data-field="${name}"]`);
    const errorEl = $(`error-${name}`);
    if (field) field.classList.toggle("is-invalid", Boolean(message));
    if (errorEl) {
      errorEl.textContent = message || "";
      errorEl.hidden = !message;
    }
  }

  function clearErrors() {
    document.querySelectorAll("[data-field]").forEach((el) => {
      el.classList.remove("is-invalid");
    });
    document.querySelectorAll(".error").forEach((el) => {
      el.textContent = "";
      el.hidden = true;
    });
    const formError = $("formError");
    if (formError) {
      formError.textContent = "";
      formError.hidden = true;
    }
  }

  function showFormError(message) {
    const formError = $("formError");
    if (!formError) return;
    formError.textContent = message;
    formError.hidden = false;
  }

  function updateCharCount(textarea) {
    const name = textarea.name;
    const max = MAX[name];
    if (!max) return;
    const counter = $(`count-${name}`);
    if (!counter) return;
    const len = textarea.value.length;
    counter.textContent = `${len} / ${max}`;
    counter.classList.toggle("is-near", len > max * 0.9);
  }

  function validateEmail(value) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
  }

  function validate() {
    clearErrors();
    let firstInvalid = null;

    function mark(name, message, el) {
      setFieldError(name, message);
      if (!firstInvalid && el) firstInvalid = el;
      return false;
    }

    let ok = true;

    REQUIRED_SELECTS.forEach((name) => {
      const select = /** @type {HTMLSelectElement|null} */ ($(name));
      if (!select || !select.value) {
        ok = mark(name, "Please choose an option.", select) && ok;
      }
    });

    REQUIRED_TEXT.forEach((name) => {
      const input = /** @type {HTMLInputElement|null} */ ($(name));
      if (!input) return;
      const value = input.value.trim();
      if (!value) {
        ok = mark(name, "This field is required.", input) && ok;
        return;
      }
      if (name === "email" && !validateEmail(value)) {
        ok = mark(name, "Enter a valid email address.", input) && ok;
      }
    });

    REQUIRED_AREAS.forEach((name) => {
      const area = /** @type {HTMLTextAreaElement|null} */ ($(name));
      if (!area) return;
      const value = area.value.trim();
      if (!value) {
        ok = mark(name, "This field is required.", area) && ok;
        return;
      }
      if (value.length > MAX[name]) {
        ok = mark(name, `Please keep this under ${MAX[name]} characters.`, area) && ok;
      }
    });

    const ack = /** @type {HTMLInputElement|null} */ ($("program_acknowledged"));
    if (!ack || !ack.checked) {
      ok =
        mark(
          "program_acknowledged",
          "Please confirm you understand before submitting.",
          ack,
        ) && ok;
    }

    if (firstInvalid) {
      firstInvalid.scrollIntoView({ behavior: "smooth", block: "center" });
      if (typeof firstInvalid.focus === "function") {
        try {
          firstInvalid.focus({ preventScroll: true });
        } catch {
          firstInvalid.focus();
        }
      }
    }

    return ok;
  }

  function readPayload(form) {
    const data = new FormData(form);
    const get = (key) => {
      const v = data.get(key);
      return typeof v === "string" ? v.trim() : "";
    };

    const params = new URLSearchParams(window.location.search);

    return {
      role: get("role"),
      full_name: get("full_name"),
      email: get("email"),
      company_name: get("company_name"),
      company_type: get("company_type"),
      project_delivery_style: get("project_delivery_style"),
      active_project_range: get("active_project_range") || null,
      reason_for_interest: get("reason_for_interest"),
      project_awareness_meaning: get("project_awareness_meaning"),
      feedback_preference: get("feedback_preference"),
      program_acknowledged: data.get("program_acknowledged") === "on",
      company_website: get("company_website"),
      form_started_at: get("form_started_at"),
      source: "landing_page",
      landing_page_version: (getConfig() && getConfig().landingPageVersion) || "website-v1",
      referrer_url: document.referrer || null,
      utm_source: params.get("utm_source"),
      utm_medium: params.get("utm_medium"),
      utm_campaign: params.get("utm_campaign"),
    };
  }

  function showSuccess() {
    const form = $("inviteForm");
    const success = $("successState");
    const intro = $("formIntro");
    if (form) form.hidden = true;
    if (intro) intro.hidden = true;
    if (success) {
      success.classList.add("is-visible");
      success.focus();
    }
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  function setSubmitting(isSubmitting) {
    const btn = $("submitButton");
    if (!btn) return;
    btn.disabled = isSubmitting;
    btn.textContent = isSubmitting ? "Sending request…" : "Request invitation";
  }

  async function submitForm(form) {
    const cfg = getConfig();
    if (!cfg) {
      showFormError(
        "This form is not configured yet. Add your Supabase URL and anon key to config.js.",
      );
      return;
    }

    if (!validate()) return;

    setSubmitting(true);
    clearErrors();

    try {
      const payload = readPayload(form);
      const res = await fetch(functionUrl(cfg), {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${cfg.supabaseAnonKey}`,
          apikey: cfg.supabaseAnonKey,
        },
        body: JSON.stringify(payload),
      });

      let json = null;
      try {
        json = await res.json();
      } catch {
        json = null;
      }

      if (!res.ok || !json || json.ok !== true) {
        showFormError(
          (json && json.error) ||
            "Unable to submit your request right now. Please try again later.",
        );
        return;
      }

      showSuccess();
    } catch {
      showFormError(
        "Unable to submit your request right now. Please try again later.",
      );
    } finally {
      setSubmitting(false);
    }
  }

  function init() {
    const form = /** @type {HTMLFormElement|null} */ ($("inviteForm"));
    if (!form) return;

    const started = $("form_started_at");
    if (started && !started.value) {
      started.value = new Date().toISOString();
    }

    Object.keys(MAX).forEach((name) => {
      const area = $(name);
      if (!area) return;
      updateCharCount(area);
      area.addEventListener("input", () => updateCharCount(area));
    });

    form.addEventListener("submit", (event) => {
      event.preventDefault();
      void submitForm(form);
    });
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
