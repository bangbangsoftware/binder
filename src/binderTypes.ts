export interface ToolGet {
  (key:string): RegEntry;
}

export interface ToolPut {
  (element: Element);
}

export interface ToolGetValue {
  (element: Element):string| null;
}

export interface ToolSetValue {
  (element: Element, value: String);
}

export interface ToolSetName {
  (name: String, value: String);
}

export interface ClickListener {
  (element: Element, fn: Function, modes?:Array<string>);
}

export interface StateListener {
  (fieldID: string, fn: Function);
}

export interface Checker {
  (element: HTMLElement)
}

export interface IDFixer {
  (element: HTMLElement, name: string): HTMLElement
}

export interface BinderTools {
  put: ToolPut;
  get: ToolGet;
  getValue: ToolGetValue;
  setValue: ToolSetValue;
  setByName: ToolSetName;
  clickListener: ClickListener;
  stateListener: StateListener; 
  fixID: IDFixer;
}

export interface BinderPlugin {
  (tools: BinderTools): BinderPluginLogic;
}

export interface BinderPluginLogic {
  attributes: Array<string>, 
  process: BinderPluginProcessor
}

export interface BinderPluginProcessor {
  (element: Element, name: string): boolean;
}

export interface RegEntry {
  currentValue: string;
  elements: Array<Element>;
}