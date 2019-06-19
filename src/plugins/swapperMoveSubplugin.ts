import { BinderTools } from "../binderTypes";

export interface DataMover {
  group: string,
  actionID: string,
  data: string,
  dataIDpostFix: string
}

const ids = new Array<String>();
let lastCaptian:Element|null;

const findLast = (tools: BinderTools, mover: DataMover) => {
  const swapids = ids.map(id => id + "-" + mover.dataIDpostFix);
  const found = swapids
    .map(id => document.getElementById(id))
    .filter(el => {
      if (el == null) {
        return false;
      }
      const value = tools.getValue(el);
      console.log("VALUE IS ------" + value + "======");
      return value != null && value.length > 0;
    });

  console.log("FOUND ", found);
  return found.length === 0 ? null : found[0];
};

const createCallback = (tools: BinderTools, mover: DataMover) => (element:Element) => {
  console.log(element.id + " ACTION clicked");
  if (lastCaptian == null) {
    lastCaptian = findLast(tools, mover);
  }
  const ribbonID = element.id + "-"+mover.dataIDpostFix;
  const ribbonElement = document.getElementById(ribbonID);
  if (ribbonElement == null){
    console.error("Swap move action - "+ribbonID + " does not exist in DOM?!");
    return;
  }
  console.log(ribbonID + ", element is ", ribbonElement);
  tools.setValue(ribbonElement, mover.data);
  tools.put(ribbonElement);
  if (lastCaptian != null) {
    tools.setValue(lastCaptian, "");
    tools.put(lastCaptian);
  }
  lastCaptian = ribbonElement;
};


export const moveAction = (tools: BinderTools, mover: DataMover, id:string) => {
  if (ids.indexOf(id) === -1){
    ids.push(id);
  } 
  const callback = createCallback(tools, mover);
  return {
    id: mover.actionID,
    callback
  };
};
