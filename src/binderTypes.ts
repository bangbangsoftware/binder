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

export interface BinderTools {
  put: ToolPut;
  get: ToolGet;
  getValue: ToolGetValue;
  setValue: ToolSetValue;
}

export interface BinderProcessor {
  (element: Element);
}

export interface BinderPlugin {
  (tools: BinderTools): BinderProcessor;
}

export interface RegEntry {
  currentValue: string;
  elements: Array<Element>;
}
