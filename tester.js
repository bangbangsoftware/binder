import { reg, put } from "./index.js";

console.log("TESTER");

reg(["one", "two", "three", "four", "five"]);

const b = document.getElementById("one");
b.addEventListener("click", () => {
  b.innerText = document.getElementById("five").innerText;
  put(b);
});
