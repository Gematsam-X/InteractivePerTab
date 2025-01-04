// Add an event to execute data extraction when the page is ready
window.addEventListener("load", function () {
  extractElementData().catch((error) => {
    console.error("Error during data extraction:", error);
  });
});

// Select all <td> elements
let elements = document.querySelectorAll("td[data-symbol]");

// Create an empty array for elements with non-empty classes
let filteredElements = [];

// Iterate over each <td> element
function checkElementsClass() {
  elements.forEach((element) => {
    // Check if the class is not empty and not "special", "legend", "no-border" or "specialLegend"
    if (
      element.classList.length > 0 &&
      !element.classList.contains("legend") &&
      !element.classList.contains("no-border") &&
      !element.classList.contains("group") &&
      !element.classList.contains("period") &&
      !element.classList.contains("specialLegend") &&
      !element.classList.contains("special")
    ) {
      filteredElements.push(element);
      // Add a click event for redirection
      element.addEventListener("click", function () {
        element.style.transform = "scale(1.2)"; // Enlarge the element on click
        // Extract the symbol from the data attribute
        const symbol = element.getAttribute("data-symbol");
        // Redirect to the element's page
        window.sessionStorage.removeItem("currentElement");
        window.setTimeout(() => {
          resetDefaultStyle();
        }, 500);
        if (symbol)
          window.location.href =
            "elements/html/" + symbol.toLowerCase() + ".html";
      });
      areIntTransElemsHighlighted = false; // Reset the highlighting state
    }
  });
}

// Global variable for data
let elementData = [];

// Function to extract chemical element data from the table, using Promise
async function extractElementData() {
  const rows = document.querySelectorAll(".periodic-table tr");
  const temporaryData = [];

  rows.forEach((row) => {
    const cells = row.querySelectorAll("td[data-symbol]");
    cells.forEach((cell) => {
      const number = parseInt(cell.getAttribute("data-atomic-number"));
      const symbol = cell.getAttribute("data-symbol");
      const elementName = cell.getAttribute("data-name");

      if (number && symbol && elementName) {
        temporaryData.push({
          number,
          symbol,
          elementName,
        });
      }
    });
  });

  if (temporaryData.length > 0) {
    elementData = temporaryData;
  } else {
    throw new Error("No data found");
  }
}

// Function to search for an element by name, symbol, or atomic number
function searchElement() {
  const searchInput = document
    .getElementById("search-input")
    .value.toLowerCase()
    .trim();

  // If the search field is empty, show an error message
  if (searchInput === "") {
    alert(
      "Digita nel campo di ricerca il nome completo, il simbolo o il numero atomico dell'elemento che desideri cercare."
    );
    return;
  }

  // Search for the corresponding element
  const result = elementData.find((element) =>
    [element.symbol, element.elementName, element.number.toString()].some(
      (val) => val.toLowerCase() === searchInput
    )
  );

  // If the element is found, redirect to its page
  if (result) {
    window.sessionStorage.removeItem("currentElement");
    window.location.href = `elements/html/${result.symbol.toLowerCase()}.html`;
  } else {
    // If the element is not found, show an error message
    alert(
      "Elemento non trovato. Assicurati di digitare il nome esatto dell'elemento, il suo numero atomico o il suo simbolo correttamente."
    );
  }
}

// Event for the search button
document
  .getElementById("search-button")
  .addEventListener("click", searchElement);

// Add a listener for the 'keypress' event on the input field
document
  .getElementById("search-input")
  .addEventListener("keypress", function (event) {
    if (event.key === "Enter") {
      searchElement(); // Execute the search function
    }
  });

// Define the categories
const metals = document.getElementById("metalsLegendContainer");
const transitionMetals = document.getElementById(
  "transitionMetalsLegendContainer"
);
const internalTransitionMetals = document.getElementById(
  "internalTransitionMetalsLegendContainer"
);
const postTransitionMetals = document.getElementById(
  "postTransitionMetalsLegendContainer"
);
const alkaliMetals = document.getElementById("alkaliMetalsLegendContainer");
const alkalineEarthMetals = document.getElementById(
  "alkalineEarthMetalsLegendContainer"
);
const halogens = document.getElementById("halogensLegendContainer");
const chalcogens = document.getElementById("chalcogensLegendContainer");
const pnictogens = document.getElementById("pnictogensLegendContainer");
const nonMetals = document.getElementById("nonMetalsLegendContainer");
const metalloids = document.getElementById("metalloidsLegendContainer");
const artificials = document.getElementById("artificialsLegendContainer");
const nobleGases = document.getElementById("nobleGasesLegendContainer");
const lanthanides = document.querySelectorAll(".lanthanides");
const actinides = document.querySelectorAll(".actinides");

let activeCategory = null; // Tracks the active category

/**  Function to add or remove the "faded" class based on the condition
 * @param {NodeList} elements - List of elements to apply the class to
 * @param {Function} condition - Condition to apply the class
 */
function toggleFaded(elements, condition) {
  elements.forEach((element) => {
    if (condition(element)) {
      element.classList.remove("faded");
    } else {
      element.classList.add("faded");
    }
  });
}

function resetDefaultStyle() {
  // Remove the .faded class from all elements
  document.querySelectorAll("td").forEach((element) => {
    element.style.removeProperty("transform");
    element.style.removeProperty("opacity");
    element.classList.remove("faded");
  });

  // Clear the sessionStorage
  window.sessionStorage.removeItem("currentElement");
}

let clickListenerAdded = false; // Indicates if the listener has been added

/**
 * Function to apply transparency to elements based on the category
 * @param {string} targetClass - Class which will be highlighted
 */

// Main function to apply transparency to elements based on the category
function adjustTransparency(targetClass) {
  const elements = document.querySelectorAll("td");

  // If the category is already active (about to be deactivated)
  if (activeCategory === targetClass) {
    // Remove the event listener, as we are deactivating
    if (clickListenerAdded) {
      document.removeEventListener("click", handleOutsideClick);
      clickListenerAdded = false;
    }

    // Reset the "faded" class on elements
    resetDefaultStyle();
    areIntTransElemsHighlighted = false;
    activeCategory = null; // Reset the active category
  } else {
    // Apply the "faded" effect to the selected category
    toggleFaded(elements, (element) => element.classList.contains(targetClass));
    activeCategory = targetClass; // Set the new active category

    // Add a listener for clicking outside the periodic table
    if (!clickListenerAdded) {
      document.addEventListener("click", handleOutsideClick);
      clickListenerAdded = true; // Indicates that the listener has been added
    }
  }
}

// Function to handle clicking outside the table and restore default styles
function handleOutsideClick(event) {
  const elements = document.querySelectorAll("td");
  const clickedElement = event.target;

  // Check if the click is inside the highlighted elements
  const isInsideHighlighted = [...elements].some(
    (element) =>
      element.contains(clickedElement) && !element.classList.contains("faded")
  );

  // If you click outside, restore the default style
  if (!isInsideHighlighted) {
    areIntTransElemsHighlighted = false; // Reset the highlighting state
    resetDefaultStyle();
    activeCategory = null; // Reset the active category
  }
}
let activeCategoryRange = null; // Variable to track the active category

let areIntTransElemsHighlighted = false; // Indicates if internal transition elements are highlighted

/** Function to highlight a specific category and manage the toggle
 * @param {string} category - The category to highlight
 * @param {string} series - The class that the highlighted elements should contain
 */
function highlightCategoryRange(category, series) {
  if (areIntTransElemsHighlighted) {
    return;
  } else {
    shouldResetDefaultStyle = false; // Non eseguire resetDefaultStyle quando questa funzione è chiamata
    const allElements = document.querySelectorAll("td");

    if (activeCategoryRange === category) {
      // If the category is already active, remove 'faded' from all elements
      allElements.forEach((element) => {
        element.classList.remove("faded");
      });
      activeCategoryRange = null; // Cancel the active category
      document.removeEventListener("click", handleOutsideClick); // Remove the event listener
      shouldResetDefaultStyle = true; // Reset the state after checking
      return; // End the function, no more highlighting
    }

    // Add a 'faded' class to all elements
    allElements.forEach((element) => {
      element.classList.add("faded");
    });

    // Then remove 'faded' from those that belong to the specified category
    const selectedElements = document.querySelectorAll(`.${series}`);
    selectedElements.forEach((element) => {
      element.classList.remove("faded"); // Remove 'faded' for the selected series
    });

    activeCategoryRange = category; // Set the category as active
    document.addEventListener("click", handleOutsideClick); // Add the event listener
    shouldResetDefaultStyle = true; // Reset the state after checking
  }
}

/** Function to remove the 'faded' class from a specific group of elements
 * @param {string} categoryClass - The class of the elements to remove the transparency from
 */
function removeFadedFromCategory(categoryClass) {
  const categoryElements = document.querySelectorAll(categoryClass);
  categoryElements.forEach((element) => {
    element.classList.remove("faded"); // Remove the 'faded' class from the group of elements
  });
}

// Events for Lanthanides
lanthanides.forEach((lanthanide) => {
  lanthanide.addEventListener("click", function () {
    highlightCategoryRange("57-71", "lanthanid"); // Highlight Lanthanides
    removeFadedFromCategory(".lanthanides, .lanthanid"); // Remove 'faded' from Lanthanides
  });
});

// Events for Actinides
actinides.forEach((actinide) => {
  actinide.addEventListener("click", function () {
    highlightCategoryRange("89-103", "actinid"); // Highlight Actinides
    removeFadedFromCategory(".actinides, .actinid"); // Remove 'faded' from Actinides
  });
});

// Add events for each category to control transparency
metals.addEventListener("click", () => {
  adjustTransparency("metal");
  removeFadedFromCategory(".lanthanides, .actinides");
});
internalTransitionMetals.addEventListener("click", () => {
  areIntTransElemsHighlighted = !areIntTransElemsHighlighted;
  adjustTransparency("internalTransitionMetal");
});
transitionMetals.addEventListener("click", () =>
  adjustTransparency("transitionMetal")
);
postTransitionMetals.addEventListener("click", () =>
  adjustTransparency("postTransitionMetal")
);
alkalineEarthMetals.addEventListener("click", () =>
  adjustTransparency("alkalineEarthMetal")
);
alkaliMetals.addEventListener("click", () => adjustTransparency("alkaliMetal"));
chalcogens.addEventListener("click", () => adjustTransparency("chalcogen"));
pnictogens.addEventListener("click", () => adjustTransparency("pnictogen"));
halogens.addEventListener("click", () => adjustTransparency("halogen"));
nonMetals.addEventListener("click", () => adjustTransparency("non-metal"));
metalloids.addEventListener("click", () => adjustTransparency("metalloid"));
artificials.addEventListener("click", () => adjustTransparency("artificial"));
nobleGases.addEventListener("click", () => adjustTransparency("noble-gas"));

// Functions for the "Mostra nella tavola periodica" button

// Manage the selection of the current element in the periodic table
const currentElementSymbol = window.sessionStorage.getItem("currentElement");

if (currentElementSymbol) {
  const allElements = document.querySelectorAll("td");

  allElements.forEach((element) => {
    const symbol = element.getAttribute("data-symbol") || null;

    // Highlight only the current element
    if (symbol) {
      if (symbol.toLowerCase() === currentElementSymbol.toLowerCase()) {
        element.classList.remove("faded");
        element.style.transform = "scale(1.2)";
      } else {
        element.classList.add("faded");
      }
    } else {
      element.classList.add("faded");
    }
  });

  // Add the event listener for the click
  document.addEventListener("click", (event) => {
    const clickedElement = event.target;
    const isInsideHighlighted = [...allElements].some(
      (element) =>
        element.contains(clickedElement) && !element.classList.contains("faded")
    );

    // If you click outside the periodic table, restore the default style
    if (!isInsideHighlighted) {
      resetDefaultStyle();
    }
  });
}

// Group-period view
let shouldResetDefaultStyle = true; // Variabile di stato globale
let isGroupPeriodViewActive = null;

function toggleGroupPeriodView(number, type) {
  shouldResetDefaultStyle = false; // Non eseguire resetDefaultStyle quando questa funzione è chiamata
  const elements = document.querySelectorAll("td");
  if (isGroupPeriodViewActive) {

  elements.forEach((obj) => {
    const hasDataAttributes = Array.from(obj.attributes).some((attr) =>
      attr.name.startsWith("data-")
    );
    if (
      !obj.classList.contains("legend") &&
      !obj.classList.contains("group") &&
      !obj.classList.contains("period")
    ) {
      if (
        hasDataAttributes &&
        obj.getAttribute(`data-${type}`) === number.toString()
      ) {
        obj.classList.remove("faded");
      } else {
        obj.classList.add("faded");
      }
    } else {
      obj.classList.add("faded");
    }
    if (
      obj.classList.contains(`${type}`) &&
      obj.innerHTML === number.toString()
    ) {
      obj.classList.remove("faded");
    }
    if (
      number === 6 &&
      type === "period" &&
      obj.classList.contains("lanthanides")
    ) {
      obj.classList.remove("faded");
    } else if (
      number === 7 &&
      type === "period" &&
      obj.classList.contains("actinides")
    ) {
      obj.classList.remove("faded");
    }
  });

  // Add a listener for clicking outside the periodic table
  if (!clickListenerAdded) {
    document.addEventListener("click", handleOutsideClick);
    document.querySelectorAll(`.${type}`).forEach((cell) => {
      cell.classList.remove("active");
    });
    clickListenerAdded = true; // Indicates that the listener has been added
  }
  } else {
    document.addEventListener("click", handleOutsideClick);
    document.querySelectorAll(`.${type}`).forEach((cell) => {
      cell.classList.remove("active");
    });
    clickListenerAdded = true; // Indicates
  }
}

function addEventListenerToGroupPeriod(type) {
  document.querySelectorAll(`.${type}`).forEach((cell) => {
    let number = parseInt(cell.innerHTML); // Ottieni il valore della prima riga
    cell.addEventListener("click", () => {
      toggleGroupPeriodView(number, type); // Passa il valore al momento del click
    });
  });
}

addEventListenerToGroupPeriod("group");
addEventListenerToGroupPeriod("period");

//* ADVANCED VIEW

// State of the advanced view (enabled/disabled)
let isAdvancedView =
  JSON.parse(localStorage.getItem("isAdvancedView")) || false;
// Main DOM elements
const advancedViewButton = getCategoryCell("advancedView"); // Button for advanced view
const metalsLegendContainerCell = getCategoryCell("metalsLegendContainer"); // Main container for legends

// Selection of containers for specific metal categories
const specificCategoriesLegendsContainers = [
  getCategoryCell("transitionMetalsLegendContainer"),
  getCategoryCell("alkalineEarthMetalsLegendContainer"),
  getCategoryCell("alkaliMetalsLegendContainer"),
  getCategoryCell("postTransitionMetalsLegendContainer"),
  getCategoryCell("internalTransitionMetalsLegendContainer"),
  getCategoryCell("halogensLegendContainer"),
  getCategoryCell("chalcogensLegendContainer"),
  getCategoryCell("pnictogensLegendContainer"),
];

// Select all elements that need to be hidden when advanced view is activated
let removableElements = document.querySelectorAll(".removable");

// --- UTILITY FUNCTIONS ---

/**
 * Returns the DOM element with a given id
 * @param {string} category ID of the element to select
 * @returns {HTMLElement|null} Found element or null
 */
function getCategoryCell(category) {
  return document.querySelector(`#${category}`);
}

/**
 ** Main function to enable/disable advanced view
 * @param {boolean} removeSpecificClass Indicates whether to remove specific classes
 */
function toggleStatus(removeSpecificClass) {
  localStorage.setItem("isAdvancedView", JSON.stringify(isAdvancedView));
  // Change the button text based on the current state
  advancedViewButton.innerText = isAdvancedView
    ? "Disattiva visualizzazione avanzata"
    : "Attiva visualizzazione avanzata";

  if (isAdvancedView) {
    // **Enable advanced view**
    metalsLegendContainerCell.classList.add("hidden"); // Hide the generic metals container
    specificCategoriesLegendsContainers.forEach((category) =>
      category.classList.remove("hidden")
    ); // Show containers for specific categories

    // Add specific classes to lanthanides and actinides
    document
      .querySelectorAll(".lanthanid, .actinid, .lanthanides, .actinides")
      .forEach((obj) => {
        obj.classList.add("internalTransitionMetal");
      });

    filteredElements.forEach((obj) => {
      const atomicNumber = parseInt(obj.getAttribute("data-atomic-number"));

      if (!isNaN(atomicNumber)) {
        if (
          (atomicNumber >= 21 && atomicNumber <= 30) ||
          (atomicNumber >= 39 && atomicNumber <= 48) ||
          (atomicNumber >= 72 && atomicNumber <= 80) ||
          (atomicNumber >= 104 && atomicNumber <= 112)
        ) {
          obj.classList.add("transitionMetal");
        }
        if ([3, 11, 19, 37, 55, 87].includes(atomicNumber)) {
          obj.classList.add("alkaliMetal");
        }
        if ([4, 12, 20, 38, 56, 88].includes(atomicNumber)) {
          obj.classList.add("alkalineEarthMetal");
        }
        if (
          [13, 31, 49, 50].includes(atomicNumber) ||
          (atomicNumber >= 81 && atomicNumber <= 83) ||
          (atomicNumber >= 113 && atomicNumber <= 116)
        ) {
          obj.classList.add("postTransitionMetal");
        }
        if ([9, 17, 35, 53, 85, 117].includes(atomicNumber)) {
          obj.classList.add("halogen");
        }
        if ([8, 16, 34, 52, 84, 116].includes(atomicNumber)) {
          obj.classList.add("chalcogen");
        }
        if ([7, 15, 33, 51, 83, 115].includes(atomicNumber)) {
          obj.classList.add("pnictogen");
        }
      }
    });

    // Hide "removable" elements
    removableElements.forEach((element) => element.classList.add("hidden"));
  } else {
    //  Disable advanced view
    metalsLegendContainerCell.classList.remove("hidden"); // Show the main container

    // Hide containers for specific categories
    specificCategoriesLegendsContainers.forEach((category) =>
      category.classList.add("hidden")
    );

    // Remove specific classes from lanthanides and actinides
    if (removeSpecificClass) {
      document.querySelectorAll(".internalTransitionMetal").forEach((obj) => {
        if (!obj.classList.contains("artificial"))
          obj.classList.remove("internalTransitionMetal");
        if (obj.id === "internalTransitionMetalsLegendContainer")
          obj.classList.add("internalTransitionMetal");

        if (
          obj.classList.contains("lanthanides") ||
          obj.classList.contains("actinides")
        ) {
          obj.classList.remove("no-click");
        }
      });

      document.querySelectorAll(".transitionMetal").forEach((obj) => {
        if (obj.id != "transitionMetalsLegendContainer")
          obj.classList.remove("transitionMetal");
      });

      document.querySelectorAll(".postTransitionMetal").forEach((obj) => {
        if (obj.id != "postTransitionMetalsLegendContainer")
          obj.classList.remove("postTransitionMetal");
      });

      document.querySelectorAll(".alkaliMetal").forEach((obj) => {
        if (obj.id != "alkaliMetalsLegendContainer")
          obj.classList.remove("alkaliMetal");
      });
      document.querySelectorAll(".alkalineEarthMetal").forEach((obj) => {
        if (obj.id != "alkalineEarthMetalsLegendContainer")
          obj.classList.remove("alkalineEarthMetal");
      });

      document.querySelectorAll(".halogen").forEach((obj) => {
        if (obj.id != "halogensLegendContainer")
          obj.classList.remove("halogen");
      });

      document.querySelectorAll(".chalcogen").forEach((obj) => {
        if (obj.id != "chalcogensLegendContainer")
          obj.classList.remove("chalcogen");
      });

      document.querySelectorAll(".pnictogen").forEach((obj) => {
        if (obj.id != "pnictogensLegendContainer")
          obj.classList.remove("pnictogen");
      });
    }

    // Show hidden elements again
    removableElements.forEach((element) => element.classList.remove("hidden"));
  }

  // Toggle the global state variable
  isAdvancedView = !isAdvancedView;
}

// --- EVENT LISTENERS ---

/**
 * Main event listener on DOM load:
 * 1. Extracts data and checks classes.
 * 2. Sets the default view.
 */
document.addEventListener("DOMContentLoaded", () => {
  extractElementData(); // Extracts data
  checkElementsClass(); // Checks classes on elements
  toggleStatus(false); // Initial view setup
});

// Handle the button to enable/disable advanced view
advancedViewButton.addEventListener("click", () => toggleStatus(true));
