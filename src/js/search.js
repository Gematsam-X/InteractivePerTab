// Function to search for an element by name, symbol, or atomic number
function searchElement() {
  const searchValue = searchInput.value.toLowerCase().trim();
  if (!toggleSearchMode.checked) {
    if (searchValue === "") {
      alert(
        "Digita nel campo di ricerca il nome completo, il simbolo o il numero atomico dell'elemento che desideri cercare."
      );
      return;
    }

    const result = elementData.find((element) =>
      [element.symbol, element.elementName, element.number.toString()].some(
        (val) => val.toLowerCase() === searchValue
      )
    );

    if (result) {
      window.sessionStorage.removeItem("currentElement");
      window.location.href = `elements/html/${result.symbol.toLowerCase()}.html`;
    } else {
      alert(
        "Elemento non trovato. Assicurati di digitare il nome esatto dell'elemento, il suo numero atomico o il suo simbolo correttamente."
      );
    }
  }
}

const folderPath = "elements/html/";
const fileList = [
  "ac.html",
  "ag.html",
  "al.html",
  "am.html",
  "ar.html",
  "as.html",
  "at.html",
  "au.html",
  "b.html",
  "ba.html",
  "be.html",
  "bh.html",
  "bi.html",
  "bk.html",
  "br.html",
  "c.html",
  "ca.html",
  "cd.html",
  "ce.html",
  "cf.html",
  "cl.html",
  "cm.html",
  "cn.html",
  "co.html",
  "cr.html",
  "cs.html",
  "cu.html",
  "db.html",
  "ds.html",
  "dy.html",
  "er.html",
  "es.html",
  "eu.html",
  "f.html",
  "fe.html",
  "fl.html",
  "fm.html",
  "fr.html",
  "ga.html",
  "gd.html",
  "ge.html",
  "h.html",
  "he.html",
  "hf.html",
  "hg.html",
  "ho.html",
  "hs.html",
  "i.html",
  "in.html",
  "ir.html",
  "k.html",
  "kr.html",
  "la.html",
  "li.html",
  "lr.html",
  "lu.html",
  "lv.html",
  "mc.html",
  "md.html",
  "mg.html",
  "mn.html",
  "mo.html",
  "mt.html",
  "n.html",
  "na.html",
  "nb.html",
  "nd.html",
  "ne.html",
  "nh.html",
  "ni.html",
  "no.html",
  "np.html",
  "o.html",
  "og.html",
  "os.html",
  "p.html",
  "pa.html",
  "pb.html",
  "pd.html",
  "pm.html",
  "po.html",
  "pr.html",
  "pt.html",
  "pu.html",
  "ra.html",
  "rb.html",
  "re.html",
  "rf.html",
  "rg.html",
  "rh.html",
  "rn.html",
  "ru.html",
  "s.html",
  "sb.html",
  "sc.html",
  "se.html",
  "sg.html",
  "si.html",
  "sm.html",
  "sn.html",
  "sr.html",
  "ta.html",
  "tb.html",
  "tc.html",
  "te.html",
  "th.html",
  "ti.html",
  "tl.html",
  "tm.html",
  "ts.html",
  "u.html",
  "v.html",
  "w.html",
  "xe.html",
  "y.html",
  "yb.html",
  "zr.html",
  "zn.html",
];

const toggleSearchMode = document.getElementById("toggleSearchMode");
const searchInput = document.getElementById("search-input");
const searchButton = document.getElementById("search-button");
const resultsModal = document.getElementById("results-modal");
const resultsContent = document.getElementById("results-content");
const closeModalButton = document.getElementById("close-modal");

searchButton.addEventListener("click", async () => {
  if (toggleSearchMode.checked) {
    const searchTerm = searchInput.value.trim();
    if (!searchTerm) {
      alert("Inserisci una parola o una frase da cercare.");
      return;
    }

    const matches = await searchInHTMLFiles(searchTerm);
    resultsContent.innerHTML = matches.length
      ? `<h2>Occorrenze trovate:</h2>${matches.join("<br>")}`
      : `<h2>Nessuna occorrenza trovata per "${searchTerm}".</h2>`;
    resultsModal.style.display = "block";
  } else {
    searchElement();
  }
});

async function searchInHTMLFiles(searchTerm) {
  const matches = [];
  const searchTermEscaped = searchTerm.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  const searchTermRegex = new RegExp(
    `[\\s\\n'(),."]${searchTermEscaped}[\\s\\n'(),."]`,
    "i"
  );

  if (/[<>]/.test(searchTerm)) {
    alert("Inserisci un termine di ricerca valido.");
    return;
  }

  if (!searchTerm) {
    alert("Inserisci una parola o una frase da cercare.");
    return;
  }

  resultsContent.innerHTML =
    '<img src="./assets/gif/loading.gif" alt="Caricamento risultati...">';
  resultsModal.style.display = "block";

  for (const file of fileList) {
    let response;
    try {
      response = await fetch(`${folderPath}${file}`);
      if (!response.ok) throw new Error(`Impossibile leggere ${file}`);
    } catch (error) {
      console.error(
        `Errore durante il fetch del file ${file}: ${error.message}`
      );
      continue;
    }

    const htmlContent = await response.text();
    const sanitizedContent = htmlContent
      .replace(/<script[^>]*>[\s\S]*?<\/script>/gi, "")
      .replace(/<style[^>]*>[\s\S]*?<\/style>/gi, "")
      .replace(/<button[^>]*>[\s\S]*?<\/button>/gi, "");

    const parser = new DOMParser();
    const doc = parser.parseFromString(sanitizedContent, "text/html");
    const textContent = doc.body.textContent || "";

    const lines = textContent
      .split("\n")
      .map((line) => line.trim())
      .filter((line) => line);

    for (let i = 0; i < lines.length; i++) {
      if (searchTermRegex.test(lines[i])) {
        const context = [
          lines[i - 2] || "",
          lines[i - 1] || "",
          `>> <mark>${lines[i]}</mark> <<`,
          lines[i + 1] || "",
          lines[i + 2] || "",
        ].join("\n");
        let sanitizedFile =
          file.replace(".html", "").charAt(0).toUpperCase() +
          file.replace(".html", "").slice(1);
        document.querySelectorAll("td").forEach((td) => {
          if (td.getAttribute("data-symbol") === sanitizedFile) {
            sanitizedFile = td.getAttribute("data-name");
          }
        });
        matches.push(
          `<pre><strong><a href="../src/elements/html/${file}">${sanitizedFile}</a>:</strong>\n${context}</pre>`
        );
      }
    }
  }

  resultsContent.innerHTML = matches.length
    ? `<h2>Occorrenze trovate:</h2>${matches.join("<br>")}`
    : `<h2>Nessuna occorrenza trovata per "${searchTerm}".</h2>`;
  return matches;
}

closeModalButton.addEventListener("click", () => {
  resultsModal.style.display = "none";
});

window.addEventListener("click", (event) => {
  if (event.target === resultsModal) {
    resultsModal.style.display = "none";
  }
});

function addEventListenerToSwitch() {
  searchInput.placeholder = toggleSearchMode.checked
    ? "Cerca una parola o una frase negli approfondimenti..."
    : "Cerca per nome, simbolo o numero atomico...";

  toggleSearchMode.addEventListener("change", () => {
    searchInput.placeholder = toggleSearchMode.checked
      ? "Cerca una parola o una frase negli approfondimenti..."
      : "Cerca per nome, simbolo o numero atomico...";
  });

  searchInput.addEventListener("keypress", async function (event) {
    if (event.key === "Enter") {
      searchInput.blur();
      if (toggleSearchMode.checked)
        await searchInHTMLFiles(searchInput.value.trim());
      else searchElement();
    }
  });
}

document.addEventListener("DOMContentLoaded", addEventListenerToSwitch);

if (toggleSearchMode) {
  toggleSearchMode.addEventListener("change", () => {
    localStorage.setItem("searchMode", toggleSearchMode.checked);
  });

  const savedSearchMode = localStorage.getItem("searchMode");
  if (savedSearchMode !== null) {
    toggleSearchMode.checked = savedSearchMode === "true";
    searchInput.placeholder = toggleSearchMode.checked
      ? "Cerca una parola o una frase negli approfondimenti..."
      : "Cerca per nome, simbolo o numero atomico...";
  }
}
