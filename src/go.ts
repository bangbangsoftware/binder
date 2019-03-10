import { go } from "./index.js";
import { swapperPlugin } from "./plugins/swapperPlugin.js";
import { togglePlugin } from "./plugins/togglePlugin.js";

go([swapperPlugin, togglePlugin]);
