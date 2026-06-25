(function () {
  const config = window.toolConfig;
  if (!config) return;

  const root = document.getElementById("toolRoot");
  const fmt = (value, digits = 2) => {
    if (!Number.isFinite(value)) return "-";
    return Number(value).toLocaleString("zh-CN", {
      maximumFractionDigits: digits,
      minimumFractionDigits: digits
    });
  };

  const helpers = {
    fmt,
    flowToM3s(value, unit) {
      if (unit === "m3h") return value / 3600;
      if (unit === "lh") return value / 3600000;
      if (unit === "ls") return value / 1000;
      return value;
    },
    area(diameterMm) {
      const d = diameterMm / 1000;
      return Math.PI * d * d / 4;
    },
    frictionFactor(re, roughnessMm, diameterMm) {
      if (!Number.isFinite(re) || re <= 0) return 0;
      if (re < 2300) return 64 / re;
      const rr = (roughnessMm / 1000) / (diameterMm / 1000);
      const term = rr / 3.7 + 5.74 / Math.pow(re, 0.9);
      return 0.25 / Math.pow(Math.log10(term), 2);
    },
    classifyRe(re) {
      if (re < 2300) return "层流";
      if (re < 4000) return "过渡流";
      return "湍流";
    },
    lmtd(dt1, dt2) {
      if (dt1 <= 0 || dt2 <= 0) return NaN;
      if (Math.abs(dt1 - dt2) < 1e-9) return dt1;
      return (dt1 - dt2) / Math.log(dt1 / dt2);
    },
    normalGasFlow(actualM3h, pKpaAbs, tempC) {
      return actualM3h * (pKpaAbs / 101.325) * (273.15 / (tempC + 273.15));
    }
  };

  function values() {
    const data = {};
    config.fields.forEach((field) => {
      const node = document.getElementById(field.id);
      data[field.id] = field.type === "select" ? node.value : Number(node.value) || 0;
    });
    return data;
  }

  function fieldHtml(field) {
    if (field.type === "select") {
      const options = field.options.map((item) =>
        `<option value="${item.value}" ${item.value === field.value ? "selected" : ""}>${item.label}</option>`
      ).join("");
      return `<label>${field.label}<select id="${field.id}">${options}</select></label>`;
    }
    const step = field.step || "0.01";
    const min = field.min !== undefined ? ` min="${field.min}"` : "";
    return `<label>${field.label}<input id="${field.id}" type="number" step="${step}" value="${field.value}"${min}></label>`;
  }

  function renderShell() {
    root.innerHTML = `
      <div class="tool-layout">
        <section class="panel">
          <h2 class="section-title">输入参数</h2>
          <div class="tool-form">${config.fields.map(fieldHtml).join("")}</div>
          <div class="tool-disclaimer note">${config.disclaimer || "本工具用于工程初算，正式设计请结合规范、物性数据和设备厂家资料复核。"}</div>
        </section>
        <section class="panel">
          <h2 class="section-title">计算结果</h2>
          <div id="resultGrid" class="result-grid"></div>
          <div id="formulaText" class="formula"></div>
          <div id="warningText" class="warning"></div>
          <div id="noteText" class="note" style="margin-top:14px"></div>
        </section>
      </div>
    `;
  }

  function renderResults() {
    const data = values();
    const output = config.calculate(data, helpers);
    document.getElementById("resultGrid").innerHTML = output.results.map((item) => `
      <div class="metric">
        <div class="metric-label">${item.label}</div>
        <div class="metric-value">${typeof item.value === "number" ? fmt(item.value, item.digits ?? 2) : item.value}<span class="metric-unit">${item.unit || ""}</span></div>
      </div>
    `).join("");
    document.getElementById("formulaText").textContent = output.formula || "";
    document.getElementById("warningText").textContent = (output.warnings && output.warnings.length) ? output.warnings.join(" ") : "当前输入未触发异常提示。";
    document.getElementById("noteText").innerHTML = output.notes && output.notes.length
      ? `<ul class="muted-list">${output.notes.map((note) => `<li>${note}</li>`).join("")}</ul>`
      : "";
  }

  renderShell();
  config.fields.forEach((field) => {
    document.getElementById(field.id).addEventListener("input", renderResults);
  });
  renderResults();
})();
