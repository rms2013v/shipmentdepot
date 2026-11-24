/* Route Shipment Depot contact/demo forms to an email via FormSubmit.co */
(function () {
  var TO = "okarnaukhov@outlook.com";
  var ACTION = "https://formsubmit.co/" + TO;

  function esc(s) { return String(s == null ? "" : s); }

  function buildForm(ctx) {
    var form = document.createElement("form");
    form.setAttribute("action", ACTION);
    form.setAttribute("method", "POST");
    form.setAttribute("data-okn", "1");
    form.style.maxWidth = "640px";

    function hidden(n, v) {
      var i = document.createElement("input");
      i.type = "hidden"; i.name = n; i.value = v; form.appendChild(i);
    }
    hidden("_subject", (ctx.formName || "Website") + " — shipmentdepot.com");
    hidden("_captcha", "false");
    hidden("_template", "table");

    (ctx.formFields || []).forEach(function (f) {
      var label = f.title || f.label || f.type;
      var type = (f.type || "text").toLowerCase();
      var wrap = document.createElement("div");
      wrap.style.margin = "0 0 18px";

      var lab = document.createElement("label");
      lab.textContent = label + (f.required ? " *" : "");
      lab.style.cssText = "display:block;margin:0 0 6px;font-size:14px;";
      wrap.appendChild(lab);

      var field;
      if (type === "textarea") {
        field = document.createElement("textarea");
        field.rows = 5;
      } else {
        field = document.createElement("input");
        field.type = type === "email" ? "email" : (type === "phone" ? "tel" : "text");
      }
      field.name = label;
      if (f.required) field.required = true;
      field.style.cssText = "width:100%;padding:12px 14px;border:1px solid #c7ccd6;border-radius:6px;font:inherit;box-sizing:border-box;background:#fff;";
      wrap.appendChild(field);
      form.appendChild(wrap);
    });

    var btn = document.createElement("button");
    btn.type = "submit";
    btn.textContent = ctx.formSubmitButtonText || "Submit";
    btn.style.cssText = "display:inline-block;padding:13px 30px;border:0;border-radius:6px;background:#e4927a;color:#fff;font:inherit;font-weight:600;cursor:pointer;";
    form.appendChild(btn);
    return form;
  }

  function apply() {
    var scripts = document.querySelectorAll("script.sqs-form-block-context");
    scripts.forEach(function (sc) {
      var block = sc.closest(".sqs-block-content") || sc.parentNode;
      if (!block) return;
      if (block.querySelector('form[data-okn="1"]')) return;
      var ctx;
      try { ctx = JSON.parse(sc.textContent); } catch (e) { return; }
      block.innerHTML = "";
      block.appendChild(buildForm(ctx));
    });
  }

  function start() {
    apply();
    // Re-assert in case Squarespace's visitor.js renders its own form afterward.
    var n = 0, t = setInterval(function () { apply(); if (++n > 20) clearInterval(t); }, 200);
  }

  if (document.readyState === "loading")
    document.addEventListener("DOMContentLoaded", start);
  else start();
})();
