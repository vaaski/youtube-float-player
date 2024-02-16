export class DynamicCSS {
  private element: HTMLStyleElement = document.createElement("style")
  private styles: Record<string, string> = {}

  constructor(private selector: string, public important = true) {
    document.head.append(this.element)
  }

  private processUpdate = () => {
    const important = this.important ? " !important" : ""
    const css = Object.entries(this.styles)
      .map(([key, value]) => `${key}: ${value}${important};`)
      .join("\n")

    this.element.textContent = `${this.selector} { ${css} }`
  }

  public update = (styles: typeof DynamicCSS.prototype.styles) => {
    this.styles = { ...this.styles, ...styles }
    this.processUpdate()
  }
}
