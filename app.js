"use strict";

const DNA_CODE = {
  TTT: "F", TTC: "F", TTA: "L", TTG: "L",
  TCT: "S", TCC: "S", TCA: "S", TCG: "S",
  TAT: "Y", TAC: "Y", TAA: "*", TAG: "*",
  TGT: "C", TGC: "C", TGA: "*", TGG: "W",
  CTT: "L", CTC: "L", CTA: "L", CTG: "L",
  CCT: "P", CCC: "P", CCA: "P", CCG: "P",
  CAT: "H", CAC: "H", CAA: "Q", CAG: "Q",
  CGT: "R", CGC: "R", CGA: "R", CGG: "R",
  ATT: "I", ATC: "I", ATA: "I", ATG: "M",
  ACT: "T", ACC: "T", ACA: "T", ACG: "T",
  AAT: "N", AAC: "N", AAA: "K", AAG: "K",
  AGT: "S", AGC: "S", AGA: "R", AGG: "R",
  GTT: "V", GTC: "V", GTA: "V", GTG: "V",
  GCT: "A", GCC: "A", GCA: "A", GCG: "A",
  GAT: "D", GAC: "D", GAA: "E", GAG: "E",
  GGT: "G", GGC: "G", GGA: "G", GGG: "G"
};

const AA_NAMES = {
  A: "Ala", R: "Arg", N: "Asn", D: "Asp", C: "Cys",
  Q: "Gln", E: "Glu", G: "Gly", H: "His", I: "Ile",
  L: "Leu", K: "Lys", M: "Met", F: "Phe", P: "Pro",
  S: "Ser", T: "Thr", W: "Trp", Y: "Tyr", V: "Val",
  "*": "Stop"
};

const CODONS_BY_AA = Object.entries(DNA_CODE).reduce((acc, [codon, aa]) => {
  if (!acc[aa]) acc[aa] = [];
  acc[aa].push(codon);
  return acc;
}, {});

// Values are frequencies per 1000 codons for E. coli K-12, S. cerevisiae, and H. sapiens.
const CODON_USAGE = {
  GTT: { ecoli: 16.8, yeast: 22.1, human: 11.0 }, GTC: { ecoli: 11.7, yeast: 11.8, human: 14.5 },
  GTA: { ecoli: 11.5, yeast: 11.8, human: 7.1 }, GTG: { ecoli: 26.4, yeast: 10.8, human: 28.1 },
  GCT: { ecoli: 10.7, yeast: 21.2, human: 18.4 }, GCC: { ecoli: 31.6, yeast: 12.6, human: 27.7 },
  GCA: { ecoli: 21.1, yeast: 16.2, human: 15.8 }, GCG: { ecoli: 38.5, yeast: 6.2, human: 7.4 },
  CTT: { ecoli: 11.9, yeast: 12.3, human: 13.2 }, CTC: { ecoli: 10.5, yeast: 5.4, human: 19.6 },
  CTA: { ecoli: 5.3, yeast: 13.4, human: 7.2 }, CTG: { ecoli: 46.9, yeast: 10.5, human: 39.6 },
  TTA: { ecoli: 15.2, yeast: 26.2, human: 7.7 }, TTG: { ecoli: 11.9, yeast: 27.2, human: 12.9 },
  CCT: { ecoli: 8.4, yeast: 13.5, human: 17.5 }, CCC: { ecoli: 6.4, yeast: 6.8, human: 19.8 },
  CCA: { ecoli: 6.6, yeast: 18.3, human: 16.9 }, CCG: { ecoli: 26.7, yeast: 5.3, human: 6.9 },
  TCT: { ecoli: 5.7, yeast: 23.5, human: 15.2 }, TCC: { ecoli: 5.5, yeast: 14.2, human: 17.7 },
  TCA: { ecoli: 7.8, yeast: 18.7, human: 12.2 }, TCG: { ecoli: 8.0, yeast: 8.6, human: 4.4 },
  AGT: { ecoli: 7.2, yeast: 14.2, human: 12.1 }, AGC: { ecoli: 16.6, yeast: 9.8, human: 19.5 },
  TTT: { ecoli: 19.7, yeast: 26.1, human: 17.6 }, TTC: { ecoli: 15.0, yeast: 18.4, human: 20.3 },
  ATT: { ecoli: 30.5, yeast: 30.1, human: 16.0 }, ATC: { ecoli: 18.2, yeast: 17.2, human: 20.8 },
  ATA: { ecoli: 3.7, yeast: 17.8, human: 7.5 }, ATG: { ecoli: 24.8, yeast: 20.9, human: 22.0 },
  ACT: { ecoli: 8.0, yeast: 20.3, human: 13.1 }, ACC: { ecoli: 22.8, yeast: 12.7, human: 18.9 },
  ACA: { ecoli: 6.4, yeast: 17.8, human: 15.1 }, ACG: { ecoli: 11.5, yeast: 8.0, human: 6.1 },
  GAT: { ecoli: 37.9, yeast: 37.6, human: 21.8 }, GAC: { ecoli: 20.5, yeast: 20.2, human: 25.1 },
  GGT: { ecoli: 21.3, yeast: 23.9, human: 10.8 }, GGC: { ecoli: 33.4, yeast: 9.8, human: 22.2 },
  GGA: { ecoli: 9.2, yeast: 10.9, human: 16.5 }, GGG: { ecoli: 8.6, yeast: 6.0, human: 16.5 },
  GAA: { ecoli: 43.7, yeast: 45.6, human: 29.0 }, GAG: { ecoli: 18.4, yeast: 19.2, human: 39.6 },
  TAT: { ecoli: 16.8, yeast: 18.8, human: 12.2 }, TAC: { ecoli: 14.6, yeast: 14.8, human: 15.3 },
  TGT: { ecoli: 5.9, yeast: 8.1, human: 10.6 }, TGC: { ecoli: 8.0, yeast: 4.8, human: 12.6 },
  TGG: { ecoli: 10.7, yeast: 10.4, human: 13.2 }, AAT: { ecoli: 21.9, yeast: 35.7, human: 17.0 },
  AAC: { ecoli: 24.4, yeast: 24.8, human: 19.1 }, AAA: { ecoli: 33.2, yeast: 41.9, human: 24.4 },
  AAG: { ecoli: 12.1, yeast: 30.8, human: 31.9 }, CAT: { ecoli: 15.8, yeast: 13.6, human: 10.9 },
  CAC: { ecoli: 13.1, yeast: 7.8, human: 15.1 }, CAA: { ecoli: 12.1, yeast: 27.3, human: 12.3 },
  CAG: { ecoli: 27.7, yeast: 12.1, human: 34.2 }, AGA: { ecoli: 1.4, yeast: 21.3, human: 12.2 },
  AGG: { ecoli: 1.6, yeast: 9.2, human: 12.0 }, CGT: { ecoli: 21.1, yeast: 6.4, human: 4.5 },
  CGC: { ecoli: 26.0, yeast: 2.6, human: 10.4 }, CGA: { ecoli: 4.3, yeast: 3.0, human: 6.2 },
  CGG: { ecoli: 4.1, yeast: 1.7, human: 11.4 }, TAA: { ecoli: 1.8, yeast: 1.1, human: 1.0 },
  TGA: { ecoli: 1.0, yeast: 0.7, human: 1.6 }, TAG: { ecoli: 0.1, yeast: 0.5, human: 0.8 }
};

const NN_PARAMS = {
  AA: [-7.9, -22.2], TT: [-7.9, -22.2],
  AT: [-7.2, -20.4],
  TA: [-7.2, -21.3],
  CA: [-8.5, -22.7], TG: [-8.5, -22.7],
  GT: [-8.4, -22.4], AC: [-8.4, -22.4],
  CT: [-7.8, -21.0], AG: [-7.8, -21.0],
  GA: [-8.2, -22.2], TC: [-8.2, -22.2],
  CG: [-10.6, -27.2],
  GC: [-9.8, -24.4],
  GG: [-8.0, -19.9], CC: [-8.0, -19.9]
};

const els = {
  form: document.getElementById("designerForm"),
  dnaInput: document.getElementById("dnaInput"),
  mutationInput: document.getElementById("mutationInput"),
  requireStart: document.getElementById("requireStart"),
  requireStop: document.getElementById("requireStop"),
  hostSelect: document.getElementById("hostSelect"),
  codonStrategy: document.getElementById("codonStrategy"),
  minLen: document.getElementById("minLen"),
  maxLen: document.getElementById("maxLen"),
  minFlank: document.getElementById("minFlank"),
  targetTm: document.getElementById("targetTm"),
  tmModel: document.getElementById("tmModel"),
  saltMm: document.getElementById("saltMm"),
  oligoNm: document.getElementById("oligoNm"),
  status: document.getElementById("overallStatus"),
  metricDna: document.getElementById("metricDna"),
  metricProtein: document.getElementById("metricProtein"),
  metricGc: document.getElementById("metricGc"),
  metricMutations: document.getElementById("metricMutations"),
  alertPanel: document.getElementById("alertPanel"),
  inputPreview: document.getElementById("inputPreview"),
  inputPreviewMeta: document.getElementById("inputPreviewMeta"),
  targetAaInput: document.getElementById("targetAaInput"),
  desiredAaInput: document.getElementById("desiredAaInput"),
  targetAaButton: document.getElementById("targetAaButton"),
  targetAaStatus: document.getElementById("targetAaStatus"),
  proteinOutput: document.getElementById("proteinOutput"),
  mutationChecks: document.getElementById("mutationChecks"),
  mutationCheckCount: document.getElementById("mutationCheckCount"),
  primerTableWrap: document.getElementById("primerTableWrap"),
  csvOutput: document.getElementById("csvOutput"),
  fastaOutput: document.getElementById("fastaOutput"),
  loadDemoButton: document.getElementById("loadDemoButton"),
  clearButton: document.getElementById("clearButton"),
  copyProteinButton: document.getElementById("copyProteinButton"),
  copyPrimersButton: document.getElementById("copyPrimersButton"),
  copyCsvButton: document.getElementById("copyCsvButton"),
  copyFastaButton: document.getElementById("copyFastaButton")
};

let currentState = null;
let targetAaPosition = null;

function sanitizeDna(raw) {
  const body = raw
    .split(/\r?\n/)
    .filter((line) => !line.trim().startsWith(">"))
    .join("")
    .toUpperCase()
    .replace(/[0-9\s]/g, "")
    .replace(/U/g, "T");
  return body;
}

function formatNumber(value, digits = 1) {
  return Number.isFinite(value) ? value.toFixed(digits) : "n/a";
}

function gcPercent(seq) {
  if (!seq.length) return 0;
  const gc = (seq.match(/[GC]/g) || []).length;
  return (gc / seq.length) * 100;
}

function translateDna(seq) {
  const codons = [];
  const aa = [];
  for (let i = 0; i < seq.length; i += 3) {
    const codon = seq.slice(i, i + 3);
    codons.push(codon);
    aa.push(DNA_CODE[codon] || "?");
  }
  return { codons, aa, protein: aa.join("") };
}

function validateSequence(seq, opts) {
  const errors = [];
  const warnings = [];
  if (!seq.length) {
    errors.push("No DNA sequence entered.");
    return { errors, warnings };
  }
  const invalid = [...new Set(seq.replace(/[ATGC]/g, "").split(""))].filter(Boolean);
  if (invalid.length) errors.push(`Invalid DNA bases: ${invalid.join(", ")}.`);
  if (seq.length % 3 !== 0) errors.push(`Length is ${seq.length} nt, not a multiple of 3.`);
  if (!errors.length) {
    const { aa, protein } = translateDna(seq);
    if (opts.requireStart && seq.slice(0, 3) !== "ATG") {
      errors.push("The first codon is not ATG.");
    }
    const terminalStop = aa[aa.length - 1] === "*";
    if (opts.requireStop && !terminalStop) {
      errors.push("The last codon is not a stop codon.");
    }
    const internalStops = aa
      .map((residue, index) => ({ residue, index }))
      .filter((entry) => entry.residue === "*" && entry.index !== aa.length - 1);
    if (internalStops.length) {
      errors.push(`Internal stop codon at amino acid position ${internalStops[0].index + 1}.`);
    }
    if (!opts.requireStop && terminalStop) {
      warnings.push("Terminal stop codon is present but not required.");
    }
    if (!protein.replace(/\*$/, "").length) {
      errors.push("No translated amino-acid residues before the terminal stop.");
    }
  }
  return { errors, warnings };
}

function parseMutations(raw) {
  const tokens = raw
    .replace(/p\./gi, "")
    .replace(/[;,]+/g, " ")
    .split(/\s+/)
    .map((token) => token.trim())
    .filter(Boolean);
  return tokens.map((token) => {
    const match = token.match(/^([A-Z*])(\d+)([A-Z*])$/i);
    if (!match) {
      return { raw: token, valid: false, error: "Use one-letter notation, e.g. A82F." };
    }
    const wt = match[1].toUpperCase();
    const pos = Number.parseInt(match[2], 10);
    const mut = match[3].toUpperCase();
    if (!AA_NAMES[wt] || !AA_NAMES[mut] || wt === "*" || mut === "*") {
      return { raw: token, valid: false, error: "Use standard amino-acid one-letter codes; stop mutations are not designed." };
    }
    if (wt === mut) {
      return { raw: token, valid: false, error: "Wild-type and mutant residues are identical." };
    }
    return { raw: `${wt}${pos}${mut}`, valid: true, wt, pos, mut };
  });
}

function reverseComplement(seq) {
  const comp = { A: "T", T: "A", G: "C", C: "G" };
  return seq.split("").reverse().map((base) => comp[base] || base).join("");
}

function hamming(a, b) {
  let count = 0;
  for (let i = 0; i < Math.min(a.length, b.length); i += 1) {
    if (a[i] !== b[i]) count += 1;
  }
  return count + Math.abs(a.length - b.length);
}

function usageFor(codon, host) {
  return CODON_USAGE[codon]?.[host] ?? 0;
}

function usageRank(codon, aa, host) {
  const sorted = [...(CODONS_BY_AA[aa] || [])].sort((a, b) => usageFor(b, host) - usageFor(a, host));
  return sorted.indexOf(codon) + 1;
}

function calcTmBasic(seq) {
  const a = (seq.match(/A/g) || []).length;
  const t = (seq.match(/T/g) || []).length;
  const g = (seq.match(/G/g) || []).length;
  const c = (seq.match(/C/g) || []).length;
  if (seq.length < 14) return 2 * (a + t) + 4 * (g + c);
  return 64.9 + (41 * (g + c - 16.4)) / seq.length;
}

function calcTmNearestNeighbor(seq, saltMm, oligoNm) {
  if (seq.length < 2) return Number.NaN;
  let dh = 0.2;
  let ds = -5.7;
  for (let i = 0; i < seq.length - 1; i += 1) {
    const pair = seq.slice(i, i + 2);
    const params = NN_PARAMS[pair];
    if (!params) return calcTmBasic(seq);
    dh += params[0];
    ds += params[1];
  }
  const first = seq[0];
  const last = seq[seq.length - 1];
  if (first === "A" || first === "T") {
    dh += 2.2;
    ds += 6.9;
  }
  if (last === "A" || last === "T") {
    dh += 2.2;
    ds += 6.9;
  }
  const saltM = Math.max(saltMm, 1) / 1000;
  const oligoM = Math.max(oligoNm, 1) * 1e-9;
  const r = 1.987;
  return (dh * 1000) / (ds + r * Math.log(oligoM / 4)) - 273.15 + 16.6 * Math.log10(saltM);
}

function calcTmQuikChange(seq, mismatchCount) {
  const mismatchPct = seq.length ? (mismatchCount / seq.length) * 100 : 0;
  return 81.5 + 0.41 * gcPercent(seq) - 675 / seq.length - mismatchPct;
}

function primerTm(seq, mismatchCount, settings) {
  if (settings.tmModel === "qc") return calcTmQuikChange(seq, mismatchCount);
  if (settings.tmModel === "basic") return calcTmBasic(seq);
  return calcTmNearestNeighbor(seq, settings.saltMm, settings.oligoNm);
}

function clampSettings() {
  return {
    requireStart: els.requireStart.checked,
    requireStop: els.requireStop.checked,
    host: els.hostSelect.value
  };
}

function makeMutatedSequence(seq, codonStart, newCodon) {
  return seq.slice(0, codonStart) + newCodon + seq.slice(codonStart + 3);
}

function scorePrimer(primerSeq, left, right, mismatchCount, settings) {
  const gc = gcPercent(primerSeq);
  const tm = primerTm(primerSeq, mismatchCount, settings);
  const center = Math.abs((left + 1.5) - primerSeq.length / 2);
  const gcRangePenalty = gc < 40 ? (40 - gc) * 0.45 : gc > 60 ? (gc - 60) * 0.45 : 0;
  return Math.abs(tm - settings.targetTm) * 1.6
    + Math.abs(gc - 50) * 0.12
    + gcRangePenalty
    + center * 0.55
    + Math.abs(left - right) * 0.18
    + Math.abs(primerSeq.length - Math.round((settings.minLen + settings.maxLen) / 2)) * 0.08;
}

function designPrimerForCodon(seq, mutation, codon, settings) {
  const codonStart = (mutation.pos - 1) * 3;
  const originalCodon = seq.slice(codonStart, codonStart + 3);
  const mismatchCount = hamming(originalCodon, codon);
  const mutatedSeq = makeMutatedSequence(seq, codonStart, codon);
  let best = null;
  const maxFlank = Math.min(settings.maxLen - 3, 36);
  for (let left = settings.minFlank; left <= maxFlank; left += 1) {
    for (let right = settings.minFlank; right <= maxFlank; right += 1) {
      const start = codonStart - left;
      const end = codonStart + 3 + right;
      const len = end - start;
      if (start < 0 || end > seq.length || len < settings.minLen || len > settings.maxLen) continue;
      const primerSeq = mutatedSeq.slice(start, end);
      const score = scorePrimer(primerSeq, left, right, mismatchCount, settings);
      if (!best || score < best.primerScore) {
        const reverse = reverseComplement(primerSeq);
        const tm = primerTm(primerSeq, mismatchCount, settings);
        best = {
          mutation: mutation.raw,
          wtAa: mutation.wt,
          mutAa: mutation.mut,
          position: mutation.pos,
          originalCodon,
          mutantCodon: codon,
          dnaChanges: mismatchCount,
          templateStart: start + 1,
          templateEnd: end,
          left,
          right,
          forward: primerSeq,
          reverse,
          forwardHighlightStart: left,
          reverseHighlightStart: primerSeq.length - left - 3,
          gc: gcPercent(primerSeq),
          tm,
          tmBasic: calcTmBasic(primerSeq),
          tmNn: calcTmNearestNeighbor(primerSeq, settings.saltMm, settings.oligoNm),
          tmQc: calcTmQuikChange(primerSeq, mismatchCount),
          primerScore: score,
          usage: usageFor(codon, settings.host),
          usageRank: usageRank(codon, mutation.mut, settings.host),
          synonymCount: CODONS_BY_AA[mutation.mut]?.length || 1
        };
      }
    }
  }
  return best;
}

function choosePrimerDesign(seq, mutation, protein, settings) {
  const checks = [];
  if (!mutation.valid) {
    return { ok: false, mutation, error: mutation.error };
  }
  const proteinNoStop = protein.replace(/\*$/, "");
  if (mutation.pos < 1 || mutation.pos > proteinNoStop.length) {
    return { ok: false, mutation, error: `Position ${mutation.pos} is outside the translated protein length (${proteinNoStop.length} aa).` };
  }
  const actual = proteinNoStop[mutation.pos - 1];
  if (actual !== mutation.wt) {
    return { ok: false, mutation, error: `Position ${mutation.pos} is ${actual}, not ${mutation.wt}.` };
  }
  const codons = CODONS_BY_AA[mutation.mut] || [];
  const codonStart = (mutation.pos - 1) * 3;
  const originalCodon = seq.slice(codonStart, codonStart + 3);
  const candidates = codons
    .map((codon) => designPrimerForCodon(seq, mutation, codon, settings))
    .filter(Boolean);
  if (!candidates.length) {
    return { ok: false, mutation, error: "No primer met the length and flank constraints; reduce minimum flank or length." };
  }
  const maxUsage = Math.max(...codons.map((codon) => usageFor(codon, settings.host)), 1);
  const scored = candidates.map((candidate) => {
    const usagePenalty = (1 - candidate.usage / maxUsage) * 22;
    const changePenalty = hamming(originalCodon, candidate.mutantCodon) * 4;
    let score = candidate.primerScore + usagePenalty + changePenalty;
    if (settings.strategy === "preferred") {
      score = candidate.primerScore * 0.45 + usagePenalty * 2.3 + changePenalty * 0.25;
    }
    if (settings.strategy === "minimal") {
      score = candidate.primerScore * 0.6 + usagePenalty * 0.7 + changePenalty * 3.2;
    }
    return { ...candidate, score };
  }).sort((a, b) => a.score - b.score);
  const selected = scored[0];
  if (selected.gc < 40 || selected.gc > 60) checks.push("GC outside 40-60%.");
  if (Math.abs(selected.tm - settings.targetTm) > 8) checks.push("Tm is more than 8 deg C from target.");
  if (selected.left < settings.minFlank || selected.right < settings.minFlank) checks.push("Flank below requested minimum.");
  return { ok: true, mutation, design: selected, warnings: checks };
}

function highlightPrimer(seq, start, len = 3) {
  return escapeHtml(seq.slice(0, start))
    + "<mark>"
    + escapeHtml(seq.slice(start, start + len))
    + "</mark>"
    + escapeHtml(seq.slice(start + len));
}

function escapeHtml(value) {
  return String(value)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

function statusClass(type) {
  if (type === "idle") return "";
  return type === "ok" ? "ok" : type === "warn" ? "warn" : "error";
}

function setStatus(text, type) {
  els.status.textContent = text;
  els.status.className = `status-pill ${statusClass(type)}`.trim();
}

function renderAlerts(errors, warnings, okMessage) {
  const items = [];
  errors.forEach((message) => items.push(`<div class="alert error">${escapeHtml(message)}</div>`));
  warnings.forEach((message) => items.push(`<div class="alert warn">${escapeHtml(message)}</div>`));
  if (!errors.length && okMessage) items.push(`<div class="alert ok">${escapeHtml(okMessage)}</div>`);
  els.alertPanel.innerHTML = items.join("");
}

function wrapSequence(seq) {
  return seq.match(/.{1,60}/g)?.join("\n") || "";
}

function renderProtein(protein, analysis) {
  if (analysis?.ok) {
    const mutated = protein.split("");
    mutated[analysis.position - 1] = analysis.desiredAa;
    const mutationLabel = `${analysis.wtAa}${analysis.position}${analysis.desiredAa}`;
    els.proteinOutput.textContent = [
      `After mutation (${mutationLabel})`,
      wrapSequence(mutated.join("")),
      "",
      "Wild type",
      wrapSequence(protein)
    ].join("\n");
    return;
  }
  els.proteinOutput.textContent = wrapSequence(protein) || "No protein sequence.";
}

function renderMutationChecks(results) {
  if (!results.length) {
    els.mutationCheckCount.textContent = "";
    els.mutationChecks.innerHTML = `<div class="empty-state">No mutations entered.</div>`;
    return;
  }
  els.mutationCheckCount.textContent = `${results.filter((r) => r.ok).length} valid of ${results.length}`;
  els.mutationChecks.innerHTML = results.map((result) => {
    if (!result.ok) {
      return `<div class="check-item error"><strong>${escapeHtml(result.mutation.raw)}</strong><span>${escapeHtml(result.error)}</span></div>`;
    }
    const d = result.design;
    const details = [
      `${AA_NAMES[d.wtAa]}${d.position}${AA_NAMES[d.mutAa]}`,
      `${d.originalCodon} to ${d.mutantCodon}`,
      `host usage ${formatNumber(d.usage, 1)}/1000`,
      `rank ${d.usageRank}/${d.synonymCount}`
    ].join(" | ");
    const warn = result.warnings.length ? ` <span class="pill warn">${escapeHtml(result.warnings.join(" "))}</span>` : ` <span class="pill ok">ready</span>`;
    return `<div class="check-item ok"><strong>${escapeHtml(d.mutation)}</strong><span>${escapeHtml(details)}${warn}</span></div>`;
  }).join("");
}

function renderMutationSummary(analysis) {
  if (!analysis || analysis.empty) {
    els.mutationCheckCount.textContent = "";
    els.mutationChecks.innerHTML = `<div class="empty-state">Enter a target AA number and desired amino-acid symbol.</div>`;
    return;
  }
  if (!analysis.ok) {
    els.mutationCheckCount.textContent = "Needs input";
    els.mutationChecks.innerHTML = `<div class="check-item error"><strong>Target</strong><span>${escapeHtml(analysis.error)}</span></div>`;
    return;
  }
  els.mutationCheckCount.textContent = `${analysis.codons.length} codons`;
  const details = [
    `AA ${analysis.position}`,
    `${analysis.wtAa} (${AA_NAMES[analysis.wtAa]})`,
    `codon ${analysis.originalCodon}`,
    `to ${analysis.desiredAa} (${AA_NAMES[analysis.desiredAa]})`
  ].join(" | ");
  const same = analysis.sameAa ? ` <span class="pill warn">same amino acid</span>` : ` <span class="pill ok">ready</span>`;
  els.mutationChecks.innerHTML = `<div class="check-item ok"><strong>${escapeHtml(analysis.wtAa + analysis.position + analysis.desiredAa)}</strong><span>${escapeHtml(details)}${same}</span></div>`;
}

function renderAlignment(codons, aa, codonsPerRow) {
  if (!codons.length) {
    els.alignmentView.innerHTML = `<div class="empty-state">No alignment to show.</div>`;
    updateAlignmentScrollControls();
    return;
  }
  const blocks = [];
  for (let offset = 0; offset < codons.length; offset += codonsPerRow) {
    const codonChunk = codons.slice(offset, offset + codonsPerRow);
    const aaChunk = aa.slice(offset, offset + codonsPerRow);
    const aaNums = codonChunk.map((_, index) => {
      const aaIndex = offset + index + 1;
      return aaChunk[index] === "*" ? "stop" : aaIndex;
    });
    const ntNums = codonChunk.map((_, index) => {
      const start = (offset + index) * 3 + 1;
      return `${start}-${start + 2}`;
    });
    blocks.push(`
      <table class="alignment-block" aria-label="Alignment ${offset + 1}">
        <tbody>
          <tr><th>AA #</th>${aaNums.map((value) => `<td>${escapeHtml(value)}</td>`).join("")}</tr>
          <tr><th>DNA</th>${codonChunk.map((codon) => `<td>${escapeHtml(codon)}</td>`).join("")}</tr>
          <tr class="aa-row"><th>Protein</th>${aaChunk.map((residue) => `<td class="${residue === "*" ? "stop-cell" : ""}">${escapeHtml(residue)}</td>`).join("")}</tr>
          <tr><th>nt #</th>${ntNums.map((value) => `<td>${escapeHtml(value)}</td>`).join("")}</tr>
        </tbody>
      </table>
    `);
  }
  els.alignmentView.innerHTML = blocks.join("");
  els.alignmentScroller.scrollLeft = 0;
  window.setTimeout(updateAlignmentScrollControls, 0);
}

function alignmentScrollStep() {
  return Math.max(240, Math.floor(els.alignmentScroller.clientWidth * 0.72));
}

function updateAlignmentScrollControls() {
  const maxScroll = Math.max(0, els.alignmentScroller.scrollWidth - els.alignmentScroller.clientWidth);
  const current = Math.round(els.alignmentScroller.scrollLeft);
  const canScroll = maxScroll > 2;
  els.alignmentScrollLeft.disabled = !canScroll || current <= 2;
  els.alignmentScrollRight.disabled = !canScroll || current >= maxScroll - 2;
  if (!canScroll) {
    els.alignmentScrollStatus.textContent = "Fits view";
    return;
  }
  const pct = Math.round((current / maxScroll) * 100);
  if (pct <= 2) {
    els.alignmentScrollStatus.textContent = "Left edge";
  } else if (pct >= 98) {
    els.alignmentScrollStatus.textContent = "Right edge";
  } else {
    els.alignmentScrollStatus.textContent = `${pct}% across`;
  }
}

function scrollAlignment(direction) {
  els.alignmentScroller.scrollBy({
    left: direction * alignmentScrollStep(),
    behavior: "smooth"
  });
}

function renderInputPreview(seq) {
  if (!seq.length) {
    els.inputPreviewMeta.textContent = "0 codons";
    setTargetStatus("", "");
    els.inputPreview.innerHTML = `<div class="empty-mini">Sequence preview appears here.</div>`;
    return;
  }
  const invalid = [...new Set(seq.replace(/[ATGC]/g, "").split(""))].filter(Boolean);
  if (invalid.length) {
    els.inputPreviewMeta.textContent = "check bases";
    setTargetStatus("", "");
    els.inputPreview.innerHTML = `<div class="empty-mini">Invalid DNA bases: ${escapeHtml(invalid.join(", "))}</div>`;
    return;
  }
  const codons = [];
  const residues = [];
  for (let i = 0; i < seq.length; i += 3) {
    const codon = seq.slice(i, i + 3);
    codons.push(codon);
    residues.push(codon.length === 3 ? DNA_CODE[codon] || "?" : "");
  }
  const completeCodons = Math.floor(seq.length / 3);
  const partialText = seq.length % 3 ? " + partial" : "";
  els.inputPreviewMeta.textContent = `${completeCodons} codon${completeCodons === 1 ? "" : "s"}${partialText}`;
  const targetInRange = Number.isInteger(targetAaPosition) && targetAaPosition >= 1 && targetAaPosition <= completeCodons;
  if (Number.isInteger(targetAaPosition)) {
    setTargetStatus(
      targetInRange ? `AA ${targetAaPosition} highlighted` : `AA ${targetAaPosition} out of range`,
      targetInRange ? "ok" : "error"
    );
  } else {
    setTargetStatus("", "");
  }
  const perRow = 5;
  const blocks = [];
  for (let offset = 0; offset < codons.length; offset += perRow) {
    const codonChunk = codons.slice(offset, offset + perRow);
    const aaChunk = residues.slice(offset, offset + perRow);
    const ntNums = codonChunk.map((codon, index) => {
      const start = (offset + index) * 3 + 1;
      return `${start}-${start + codon.length - 1}`;
    });
    const aaNums = codonChunk.map((codon, index) => {
      if (codon.length < 3) return ".";
      return aaChunk[index] === "*" ? "stop" : offset + index + 1;
    });
    const blockHasTarget = targetInRange && targetAaPosition > offset && targetAaPosition <= offset + codonChunk.length;
    blocks.push(`
      <div class="input-preview-block" style="--cols: ${codonChunk.length}" ${blockHasTarget ? 'id="targetAaPreviewBlock"' : ""}>
        <div class="preview-line">
          <span class="preview-label">DNA nt #</span>
          ${ntNums.map((num, index) => `<span class="preview-cell preview-num ${offset + index + 1 === targetAaPosition ? "target-highlight" : ""}">${escapeHtml(num)}</span>`).join("")}
        </div>
        <div class="preview-line">
          <span class="preview-label">DNA seq</span>
          ${codonChunk.map((codon, index) => `<span class="preview-cell ${offset + index + 1 === targetAaPosition ? "target-highlight" : ""}">${escapeHtml(codon)}</span>`).join("")}
        </div>
        <div class="preview-line">
          <span class="preview-label">AA #</span>
          ${aaNums.map((num, index) => `<span class="preview-cell preview-num ${offset + index + 1 === targetAaPosition ? "target-highlight" : ""}">${escapeHtml(num)}</span>`).join("")}
        </div>
        <div class="preview-line">
          <span class="preview-label">AA seq</span>
          ${aaChunk.map((residue, index) => `<span class="preview-cell preview-aa ${residue === "*" ? "preview-stop" : ""} ${offset + index + 1 === targetAaPosition ? "target-highlight" : ""}">${escapeHtml(residue || ".")}</span>`).join("")}
        </div>
      </div>
    `);
  }
  els.inputPreview.innerHTML = blocks.join("");
  scrollTargetAaIntoView();
}

function setTargetStatus(text, type) {
  els.targetAaStatus.textContent = text;
  els.targetAaStatus.className = `target-status ${type}`.trim();
}

function updateTargetAaFromInput() {
  readTargetAaInput();
  analyze();
}

function scrollTargetAaIntoView() {
  if (!Number.isInteger(targetAaPosition) || typeof document.querySelector !== "function") return;
  const targetBlock = document.querySelector("#targetAaPreviewBlock");
  if (!targetBlock) return;
  targetBlock.scrollIntoView({ block: "center", inline: "nearest" });
}

function renderPrimerTable(analysis) {
  if (!analysis || analysis.empty) {
    els.primerTableWrap.innerHTML = `<div class="empty-state">Enter a target AA number and desired amino-acid symbol.</div>`;
    return;
  }
  if (!analysis.ok) {
    els.primerTableWrap.innerHTML = `<div class="empty-state">${escapeHtml(analysis.error)}</div>`;
    return;
  }
  const rows = analysis.codons.map((entry) => `
    <tr>
      <td><code>${escapeHtml(entry.codon)}</code></td>
      <td>${escapeHtml(analysis.desiredAa)} (${escapeHtml(AA_NAMES[analysis.desiredAa])})</td>
      <td><strong>${formatNumber(entry.relativeUsage, 1)}%</strong><br><span class="subtle">${formatNumber(entry.usage, 1)}/1000</span></td>
      <td>${entry.rank}/${analysis.codons.length}</td>
      <td>${entry.dnaChanges}</td>
      <td><code>${escapeHtml(analysis.originalCodon)}</code> to <strong>${escapeHtml(entry.codon)}</strong></td>
    </tr>
  `).join("");
  els.primerTableWrap.innerHTML = `
    <table class="primer-table">
      <thead>
        <tr>
          <th>Codon</th>
          <th>Desired AA</th>
          <th>Relative usage</th>
          <th>Rank</th>
          <th>DNA changes</th>
          <th>Codon change</th>
        </tr>
      </thead>
      <tbody>${rows}</tbody>
    </table>
  `;
}

function codonUsageToCsv(analysis) {
  const rows = [["target_aa_position", "wild_type_aa", "wild_type_codon", "desired_aa", "codon", "relative_usage_percent", "host_usage_per_1000", "usage_rank", "dna_changes"]];
  if (analysis?.ok) {
    analysis.codons.forEach((entry) => {
      rows.push([
        analysis.position,
        analysis.wtAa,
        analysis.originalCodon,
        analysis.desiredAa,
        entry.codon,
        formatNumber(entry.relativeUsage, 1),
        formatNumber(entry.usage, 1),
        `${entry.rank}/${analysis.codons.length}`,
        entry.dnaChanges
      ]);
    });
  }
  return rows.map((row) => row.map((value) => `"${String(value).replace(/"/g, '""')}"`).join(",")).join("\n");
}

function codonUsageToFasta(analysis) {
  if (!analysis?.ok) return "";
  const records = [];
  analysis.codons.forEach((entry) => {
    const mutatedSeq = makeMutatedSequence(analysis.seq, (analysis.position - 1) * 3, entry.codon);
    records.push(`>AA${analysis.position}_${analysis.wtAa}_to_${analysis.desiredAa}_${entry.codon}_relative_${formatNumber(entry.relativeUsage, 1)}pct`);
    records.push(mutatedSeq);
  });
  return records.join("\n");
}

function renderExports(analysis) {
  els.csvOutput.value = codonUsageToCsv(analysis);
  els.fastaOutput.value = codonUsageToFasta(analysis);
}

function readDesiredAa() {
  const value = (els.desiredAaInput.value || "").trim().toUpperCase();
  els.desiredAaInput.value = value;
  if (!value) return { empty: true };
  if (value.length !== 1 || !AA_NAMES[value] || value === "*") {
    return { error: "Desired AA must be one standard one-letter amino-acid symbol." };
  }
  return { aa: value };
}

function readTargetAaInput() {
  const value = Number.parseInt(els.targetAaInput.value, 10);
  targetAaPosition = Number.isFinite(value) && value > 0 ? value : null;
  return targetAaPosition;
}

function buildCodonUsageAnalysis(seq, translated, settings) {
  const desired = readDesiredAa();
  const position = readTargetAaInput();
  if (!position && desired.empty) return { empty: true };
  if (!position) return { ok: false, error: "Enter a target AA number." };
  if (desired.empty) return { ok: false, error: "Enter a desired amino-acid symbol." };
  if (desired.error) return { ok: false, error: desired.error };

  const proteinNoStop = translated.protein.replace(/\*$/, "");
  if (position < 1 || position > proteinNoStop.length) {
    return { ok: false, error: `Target AA ${position} is outside the translated protein length (${proteinNoStop.length} aa).` };
  }

  const wtAa = proteinNoStop[position - 1];
  const originalCodon = translated.codons[position - 1];
  const desiredAa = desired.aa;
  const synonymousCodons = [...(CODONS_BY_AA[desiredAa] || [])]
    .sort((a, b) => usageFor(b, settings.host) - usageFor(a, settings.host));
  const totalUsage = synonymousCodons.reduce((sum, codon) => sum + usageFor(codon, settings.host), 0);
  const codons = synonymousCodons.map((codon, index) => ({
    codon,
    usage: usageFor(codon, settings.host),
    relativeUsage: totalUsage ? (usageFor(codon, settings.host) / totalUsage) * 100 : 0,
    rank: index + 1,
    dnaChanges: hamming(originalCodon, codon)
  }));

  return {
    ok: true,
    seq,
    position,
    wtAa,
    desiredAa,
    originalCodon,
    codons,
    sameAa: wtAa === desiredAa
  };
}

function analyze() {
  const settings = clampSettings();
  const seq = sanitizeDna(els.dnaInput.value);
  readTargetAaInput();

  els.metricDna.textContent = `${seq.length} nt`;
  els.metricGc.textContent = `${formatNumber(gcPercent(seq), 1)}%`;
  els.metricMutations.textContent = targetAaPosition ? `AA ${targetAaPosition}` : "none";
  renderInputPreview(seq);

  if (!seq) {
    currentState = null;
    setStatus("Waiting for sequence", "idle");
    renderAlerts([], []);
    els.metricProtein.textContent = "0 aa";
    els.proteinOutput.textContent = "Paste a coding DNA sequence to begin.";
    els.mutationChecks.innerHTML = `<div class="empty-state">Enter a target AA number and desired amino-acid symbol.</div>`;
    els.mutationCheckCount.textContent = "";
    els.primerTableWrap.innerHTML = `<div class="empty-state">No codon usage table yet.</div>`;
    els.csvOutput.value = "";
    els.fastaOutput.value = "";
    return;
  }

  const validation = validateSequence(seq, settings);

  if (validation.errors.length) {
    currentState = null;
    setStatus("Needs sequence fix", "error");
    renderAlerts(validation.errors, validation.warnings);
    els.metricProtein.textContent = "0 aa";
    els.proteinOutput.textContent = "Sequence validation failed.";
    els.mutationChecks.innerHTML = `<div class="empty-state">Fix the DNA sequence first.</div>`;
    els.mutationCheckCount.textContent = "";
    els.primerTableWrap.innerHTML = `<div class="empty-state">No codon usage table yet.</div>`;
    els.csvOutput.value = "";
    els.fastaOutput.value = "";
    return;
  }

  const translated = translateDna(seq);
  const proteinNoTerminalStop = translated.protein.replace(/\*$/, "");
  const analysis = buildCodonUsageAnalysis(seq, translated, settings);
  currentState = { seq, translated, analysis, settings };

  els.metricProtein.textContent = `${proteinNoTerminalStop.length} aa`;
  if (analysis.ok) {
    setStatus("Codon usage ready", "ok");
  } else if (analysis.empty) {
    setStatus("ORF translated", "ok");
  } else {
    setStatus("Target check needed", "warn");
  }
  const analysisWarnings = analysis.ok && analysis.sameAa ? [`Desired AA matches the current residue (${analysis.wtAa}).`] : [];
  renderAlerts(
    [],
    [...validation.warnings, ...analysisWarnings],
    analysis.ok ? `${analysis.codons.length} codon option${analysis.codons.length === 1 ? "" : "s"} listed for ${analysis.desiredAa}.` : "ORF is valid."
  );
  renderProtein(translated.protein, analysis);
  renderMutationSummary(analysis);
  renderPrimerTable(analysis);
  renderExports(analysis);
}

function markCopied(button) {
  const original = button.textContent;
  button.textContent = "Copied";
  window.setTimeout(() => {
    button.textContent = original;
  }, 1200);
}

function fallbackCopy(text) {
  const area = document.createElement("textarea");
  area.value = text;
  document.body.appendChild(area);
  area.select();
  document.execCommand("copy");
  document.body.removeChild(area);
}

function copyText(text, button) {
  if (!text) return;
  if (navigator.clipboard?.writeText) {
    navigator.clipboard.writeText(text).then(() => {
      markCopied(button);
    }).catch(() => {
      fallbackCopy(text);
      markCopied(button);
    });
    return;
  }
  fallbackCopy(text);
  markCopied(button);
}

function loadDemo() {
  const demoProtein = "MALWMRLLPLLALLALWGPDPAAAFVNQHLCGSHLVEALYLVCGERGFFYTPKTRREAEDLQVGQVELGGGPGAGSLQPLALEGSLQKRGIVEQCCTSICSLYQLENYCN";
  const demoDna = demoProtein.split("").map((aa) => {
    const preferred = [...(CODONS_BY_AA[aa] || [])].sort((a, b) => usageFor(b, "ecoli") - usageFor(a, "ecoli"))[0];
    return preferred || "NNN";
  }).join("") + "TAA";
  els.dnaInput.value = `>demo_orf\n${demoDna}`;
  els.targetAaInput.value = "24";
  els.desiredAaInput.value = "F";
  targetAaPosition = 24;
  analyze();
}

els.form.addEventListener("submit", (event) => {
  event.preventDefault();
  analyze();
});

els.dnaInput.addEventListener("input", () => {
  renderInputPreview(sanitizeDna(els.dnaInput.value));
});

els.targetAaButton.addEventListener("click", updateTargetAaFromInput);
els.targetAaInput.addEventListener("change", updateTargetAaFromInput);
els.targetAaInput.addEventListener("keydown", (event) => {
  if (event.key === "Enter") {
    event.preventDefault();
    updateTargetAaFromInput();
  }
});
els.desiredAaInput.addEventListener("change", analyze);
els.desiredAaInput.addEventListener("keydown", (event) => {
  if (event.key === "Enter") {
    event.preventDefault();
    analyze();
  }
});
els.hostSelect.addEventListener("change", analyze);

document.querySelectorAll(".tab-button").forEach((button) => {
  button.addEventListener("click", () => {
    document.querySelectorAll(".tab-button").forEach((tab) => tab.classList.remove("active"));
    document.querySelectorAll(".tab-panel").forEach((panel) => panel.classList.remove("active"));
    button.classList.add("active");
    document.getElementById(button.dataset.tab).classList.add("active");
  });
});

els.loadDemoButton.addEventListener("click", loadDemo);
els.clearButton.addEventListener("click", () => {
  els.dnaInput.value = "";
  if (els.mutationInput) els.mutationInput.value = "";
  els.targetAaInput.value = "";
  els.desiredAaInput.value = "";
  targetAaPosition = null;
  analyze();
});
els.copyProteinButton.addEventListener("click", () => copyText(els.proteinOutput.textContent, els.copyProteinButton));
els.copyCsvButton.addEventListener("click", () => copyText(els.csvOutput.value, els.copyCsvButton));
els.copyFastaButton.addEventListener("click", () => copyText(els.fastaOutput.value, els.copyFastaButton));
els.copyPrimersButton.addEventListener("click", () => {
  const text = currentState ? codonUsageToCsv(currentState.analysis) : "";
  copyText(text, els.copyPrimersButton);
});

analyze();
