import { go } from "./index.js";
import { swapperPlugin } from "./plugins/swapperPlugin.js";
import { swapPlugin } from "./plugins/swapPlugin.js";
import { togglePlugin } from "./plugins/togglePlugin.js";
import { showHidePlugin } from "./plugins/showhidePlugin.js";
import { repeaterPlugin } from "./plugins/repeaterPlugin.js";
import { ifPlugin } from "./plugins/ifPlugin.js";

go([swapperPlugin, swapPlugin, togglePlugin,showHidePlugin, repeaterPlugin, ifPlugin]);
