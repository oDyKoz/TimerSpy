export let colorPicker;
export const defaultColor = "#000";

window.addEventListener("load", startup, false);

export function startup() {
  colorPicker = document.querySelector("#placeColor");
  colorPicker.value = defaultColor;
  colorPicker.addEventListener("input", updateFirst, false);
  colorPicker.addEventListener("change", updateAll, false);
  colorPicker.select();
}

