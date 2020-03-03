import { bagItAndTagIt, tools} from "./dist/index.js";
import { swapperPlugin } from './dist/plugins/swapperPlugin.js'
import { repeaterPlugin, addFunction, addRow } from './dist/plugins/repeaterPlugin.js';

console.log("LOOP TESTER");


const setupData = () => {
    const flight1 = {from:"Maythorne",to:"Mars",depart:"Tomorrow at 8pm", arrive:"100 years in the future", length:"A long time"}

    const flights = [];
    console.time("data setup");
    for(let c = 0; c < 100;c++){
        flights.push(flight1);
    }
    console.timeEnd("data setup");
    return flights;
}

const setupHeader = () =>{
    const headers = ["No.","From","To","Departs", "Arrive", "Length"];
    return headers;
}

addFunction("headers",setupHeader);
addFunction("flights",setupData);
console.log(new Date()," started");
console.time("diti");
bagItAndTagIt([swapperPlugin, repeaterPlugin], "loops");
console.timeEnd("diti");
console.log(new Date()," ended");
const but = document.getElementById("flights-from-99");
tools.clickListener(but, () =>{
    const newRow= [{from:"Maythorne",to:"Mars",depart:"Tomorasdfasdfasdf", arrive:"100 years in the future", length:"A long time"}];
    addRow("flights",newRow);
})