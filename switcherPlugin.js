let storage = window.localStorage;
let doc = document;

// Just for testing....
export function setStorage(s) {
  storage = s;
}

// Just for testing....
export function setDocument(d) {
  doc = d;
}

let binder;

export const switchPlugin = tools => {
  binder = tools;
  return element => {
    const groupName = element.getAttribute("swapper");
    if (!groupName) {
      return;
    }
    element.addEventListener("click", e => swap(element));
  };
};

const swap = element => {
  const groupName = element.getAttribute("swapper");
  const idSelected = storage.getItem("swap-" + groupName);
  if (!idSelected) {
    element.classList.add("swap-selected");
    storage.setItem("swap-" + groupName, element.id);
    return;
  }
  storage.removeItem("swap-" + groupName);
  const selected = document.getElementById(idSelected);
  selected.classList.remove("swap-selected");
  if (idSelected === element.id) {
    console.error("what are you doing swap with itself???!");
  }

  const selectKey = binder.getKey(selected);
  const key = binder.getKey(element);
  const swapValue = selected[selectKey] + "";
  const value = element[key];

  if (value === swapValue) {
    return;
  }
  element[key] = swapValue + "";
  selected[selectKey] = value;

  binder.put(element);
  binder.put(selected);
};
