export interface ToolGet {
  (key:string): RegEntry;
}

export interface ToolPut {
  (element: Element);
}

export interface ToolGetKey {
  (element: Element);
}

export interface BinderTools {
  put: ToolPut;
  get: ToolGet;
  getKey: ToolGetKey;
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
