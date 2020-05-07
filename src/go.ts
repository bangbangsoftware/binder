import { go } from "./index.js";
import { swapperPlugin } from "./plugins/swapperPlugin.js";
import { togglePlugin } from "./plugins/togglePlugin.js";
import { showHidePlugin } from "./plugins/showhidePlugin.js";
import { tablePlugin } from "./plugins/tablePlugin.js";
import { ifPlugin } from "./plugins/ifPlugin.js";

go([swapperPlugin, tablePlugin, togglePlugin, showHidePlugin, ifPlugin]);
