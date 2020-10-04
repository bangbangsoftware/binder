const go = (e) => {
    console.log("TABLE: Message received ", e);
    const name = e.data[0];
    const template = replaceParentToken(e.data[1], name);
    let html = "";
    const data = {};
    const mapList = e.data[2];
    const post = !e.data[3];
    mapList.map((fields, index) => {
        let rowTemplate = template + "";
        const key = "$index";
        const token = name + "-" + key + "-" + index;
        addData(rowTemplate, token, index, key, data);
        rowTemplate = replaceToken(rowTemplate, key, token, index);
        rowTemplate = rowToClick(rowTemplate, index);
        Object.keys(fields).map((fieldName) => {
            const key = name + "-" + fieldName + "-";
            const token = key + index;
            addData(rowTemplate, token, fields[fieldName], fieldName, data);
            rowTemplate = replaceToken(rowTemplate, fieldName, token, index);
            return key;
        });
        html = html + rowTemplate;
    });
    const results = { html, data };
    if (post) {
        postMessage(results);
    }
    else {
        return results;
    }
};
const rowToClick = (template, row) => {
    const finder = "click=";
    const replacer = "row=" + row + " " + finder;
    if (template.indexOf(replacer) > -1) {
        return template;
    }
    return template.replace(/click=/g, replacer);
};
const addData = (template, token, value, key, results) => {
    const finder = 'place="' + key + '"';
    if (template.indexOf(finder) === -1) {
        return;
    }
    results[token] = value;
};
const replaceToken = (template, key, token, row) => {
    const finder = 'place="' + key + '"';
    const replacer = 'id="' + token + '" name="' + token + '" row=' + row;
    const results = template.replace(finder, replacer);
    return results;
};
const replaceParentToken = (template, name) => {
    const finder = 'repeater="' + name + '"';
    const replacer = 'repeater="' + name + '" id="repeater-' + name + '" ';
    return template.replace(finder, replacer);
};
onmessage = go;
if (module !== undefined) {
    try {
        module.exports = go;
    }
    catch (error) {
        console.log("No module");
    }
}
//# sourceMappingURL=tablePluginWorker.js.map