import togglePlugin from "./togglePlugin";
describe("togglePlugin.test", () => {
    const binder = { getValue: () => "value", put: () => { } };
    let plugin;
    test("Plugin can be set up", () => {
        plugin = togglePlugin(binder);
    });
});
//# sourceMappingURL=togglePlugin.test.js.map