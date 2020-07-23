import { bagItAndTagIt, tools} from "./dist/binder.js";
import { swapperPlugin } from './dist/plugins/swapperPlugin.js'
import { repeaterPlugin, addSetup, addRow, addSort } from './dist/plugins/repeaterPlugin.js';

console.log("LOOP TESTER");


const setupData = () => {
    const flight1 = {from:"Maythorne",to:"Mars",depart:"After ", arrive:"100 years in the future", length:"A long time"}

    const flights = [];
    console.time("data setup");
    for(let c = 0; c < 100;c++){
        const newFlight = JSON.parse(JSON.stringify(flight1));
        newFlight.depart = newFlight.depart+" "+c+" minutes";
        flights.push(newFlight);
    }
    console.timeEnd("data setup");
    return flights;
}

const setupHeader = () =>{
    const headers = ["No.","From","To","Departs", "Arrive", "Length"];
    return headers;
}

addSetup("headers",setupHeader);
addSetup("flights",setupData);
console.log(new Date()," started");
console.time("diti");
bagItAndTagIt(this,[swapperPlugin, repeaterPlugin], "loops");
console.timeEnd("diti");
console.log(new Date()," ended");
const but = document.getElementById("flights-from-99");
tools.clickListener(but, () =>{
    const newRow= [{from:"Maythorne",to:"Mars",depart:"Tomorasdfasdfasdf", arrive:"100 years in the future", length:"A long time"}];
    addRow("flights",newRow);
})

const sort = document.getElementById("flights-from-98");
let direction = 1;
tools.clickListener(sort, () =>{
    direction = direction * -1;
    addSort("flights",(rowA, rowB)=>{
        if (rowA.depart > rowB.depart){
            return direction;
        }
        if (rowA.depart < rowB.depart){
            return -direction;
        }
        return 0;
    });
})
