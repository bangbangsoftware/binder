import { go } from "./index.js";
import { swapperPlugin } from "./plugins/swapperPlugin.js";
import { togglePlugin } from "./plugins/togglePlugin.js";
import { showHidePlugin } from "./plugins/showhidePlugin.js";
import { repeaterPlugin } from "./plugins/repeaterPlugin.js";

go([swapperPlugin, togglePlugin,showHidePlugin, repeaterPlugin]);
