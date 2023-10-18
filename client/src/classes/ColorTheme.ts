// Import objects
import { MyMap } from "src/objects/MyMap";

/*
  Color theory
  An app will has many color on it, some emphasized colors, some less emphasized colors... So
  I divide the color them into multiple pairs.

  - Primary and onPrimary: this is the second frequent apparent color in the app.
  `on` is that mean the color that darker when is placed on the original one.
  - Second and onSecond: like primary and onPrimary, but second and onSecond is less
  emphasized than primary.
  - Tertiary and onTertiary: is less emphasized than second and onSecond and the functional
  of this color is distinguish primary and second.

  - Outline and onOutline: this pair is slighty contrast with background and onBackground and the functional
  of pair is split the content of UI, highlight areas.
  - SubOutline and OnSubOutline: is lighter than outline pair.
  - Background and onBackground: yes and this is the most frequent apparent color in the app.
  The contrastive color of primary pair.
  - SubBackground and OnSubBackground: lighter than background pair.

  Furthermore, there are 4 pairs of color (optional):
  - success and onSuccess: a color that represent for successful action in notification or some where else,
  or can be use in agree...
  - error and onError: a color taht represent for failed action in notification or some where else,
  or can be use in disagree...
  - warning and onWarning: a color that represent for warning.
  - info and onInfo: a color that represent for information.

  Note: color doesn't contains alpha parameter.
*/

export interface ThemeType {
  primary: string;
  onPrimary: string;
  secondary: string;
  onSecondary: string;
  tertiary: string;
  onTertiary: string;
  outline: string;
  onOutline: string;
  subOutline: string;
  onSubOutline: string;
  background: string;
  onBackground: string;
  subBackground: string;
  onSubBackground: string;
  success?: string;
  onSuccess?: string;
  error?: string;
  onError?: string;
  waring?: string;
  onWarning?: string;
  info?: string;
  onInfo?: string;
}

export interface ColorThemeType {
  name: string;
  _theme: MyMap<keyof ThemeType, [string, string]>;
  _isInstalled: boolean;
}

/**
 * Create an instance from this class to manage the color theme in app.
 * 
 * This instance need to use the HTML Element to perform the task.
 * Default theme is installed in `variables.css` file.
 * 
 * First, you need to use `setTheme` method to add theme to css. The value
 * will be stored as css variables. This method receive: 
 * - An array of tuple, first element of tuple is the name of color and
 * the second is the value of it. For example:
 * ```
 * setTheme([
 *   ["primary", "242,12,92"],
 *   ["onPrimary", "123, 123, 123"]
 *   ["background", "FFF"],
 *   ["onBackground", "262626"]
 * ])
 * ```
 * - An array of string that are in format `key:value`. For example:
 * ```
 * setTheme([
 *   "primary: 242,12,92",
 *   "onPrimary: 123, 123, 123",
 *   "background:FFF",
 *   "onBackground:262626"
 * ])
 * ```
 * 
 * Note: HEX Theme is required. RGB is optional.
 */
export class ColorTheme {
  name!: string;

  private _rgbTheme!: MyMap<keyof Partial<ThemeType>, [string, string]>;
  private _hexTheme!: MyMap<keyof Partial<ThemeType>, [string, string]>;
  private _documentElement: HTMLElement;
  private _styleThemeElement!: HTMLElement;
  private _isInstalled = false;

  /**
   * Use to get `key` and `value` of color.
   */
  static ColorKeyValueRegExp = /(\w+):\s*(?:(\d+,\s*\d+,\s*\d+)|(\w{0,6})$)/;
  /**
   * Use to get or check value of RGB Color.
   */
  static RGBTypeColorValueRegExp = /(\d+,\s*\d+,\s*\d+)/;
  /**
   * Use to get or check value of HEX Color.
   * Not contains the `#`.
   */
  static HEXTypeColorValueRegExp = /^(\w{0,6})$/;
  static RequiredColors: Array<keyof ThemeType> = [
    // "primary", "onPrimary",
    "background", "onBackground"
  ];

  constructor(name: string) {
    this.name = name;

    // Init hex theme.
    this._hexTheme = new MyMap();

    // Init
    this._rgbTheme = new MyMap();

    this._documentElement = document.documentElement;
    this._styleThemeElement = document.getElementById("theme")!;
  }

  /**
   * Use this static method to generate `key` and `value` from a str.
   * For examples:
   * - The clr is `background:FFF`, the result is `["background", "#FFF", "HEX"]`.
   * - The clr is `["background", "FFF"]`, the result is `["background", "#FFF", "HEX"]`.
   * - The clr is `onBackground:38, 38, 38`, the result is `["onBackground", "38, 38, 38", "RGB"]`.
   * - The clr is `["onBackground", "38, 38, 38"]`, the result is `["onBackground", "38, 38, 38", "RGB"]`.
   * @param clr 
   */
  static generateKeyAndColor(clr: string | [string, string]) {
    try {
      if(Array.isArray(clr)) {
        let [value, type] = ColorTheme.toColor(clr[1])!;
        return [clr[0], value, type];
      }
  
      let match = clr.match(ColorTheme.ColorKeyValueRegExp);

      if(!match) throw new Error("The color is not correct. Please, review the rule.");
  
      // If match[2], that mean the value of color is RGB value.
      let matchResult = match[2];
      
      // If match[3], that mean the value of color is HEX value.
      if(match[3]) {
        matchResult = match[3];
      }
      
      // Get value and type.
      let [value, type] = ColorTheme.toColor(matchResult)!;

      return [match[1], value, type];
    } catch (error: any) {
      console.error("ColorTheme Error: ", error.message);
      return [];
    }
  }

  /**
   * Use this static method to check value of RGB Color.
   * @param color 
   * @returns 
   */
  static isRGBColorValue(color: string) {
    return ColorTheme.RGBTypeColorValueRegExp.test(color);
  }

  /**
   * Use this static method to check value of HEX Color.
   * @param color 
   * @returns 
   */
  static isHEXColorValue(color: string) {
    return ColorTheme.HEXTypeColorValueRegExp.test(color);
  }

  /**
   * Use this static method to convert a color to css variable. The HEX type will
   * be considered as default, so css variable doesn't contains this type.
   * @param colorName 
   * @param colorValue 
   * @param colorType 
   * @returns 
   */
  static toCSSVariable(colorName: string, colorValue: string, colorType: string) {
    // 
    if(colorType === "HEX") return `--clr-${colorName}: ${colorValue}`;
    return `--clr-rgb-${colorName}: ${colorValue}`;
  }

  /**
   * Use this static method to get complete color from value.
   * Return [value, type]
   * @param value 
   */
  static toColor(value: string) {
    if(!value) throw new Error("Require value of color.");

    // If value is value of hex.
    if(ColorTheme.isHEXColorValue(value))
      return [`#${value}`, "HEX"];
    
    // If value is value of rgb.
    if(ColorTheme.isRGBColorValue(value))
      return [value, "RGB"];
  }

  /**
   * Use this method to check if theme is completely install.
   */
  check() {
    for(let requiredColor of ColorTheme.RequiredColors) {
      return Boolean(this._hexTheme.get(requiredColor))
    }
  }

  /**
   * __Important__
   * 
   * Use this method to set theme. Receive a value of string or tuple.
   * @param values 
   * @returns 
   */
  setTheme(values: string[] | [string, string][]) {
    try {
      console.log("Values: ", values);
      for(let value of values) {
        let [colorName, colorValue, colorType] = ColorTheme.generateKeyAndColor(value);
        console.log(colorName, colorValue, colorType);
        if(colorType === "RGB")
          this._rgbTheme.set(colorName as keyof ThemeType, [colorValue, colorType]);
        else
          this._hexTheme.set(colorName as keyof ThemeType, [colorValue, colorType]);
      }

      if(!this.check()) throw new Error("The values is not enough color to set theme. Double check and try again.");

      return true;
    } catch (error: any) {
      // If has error, clear all values.
      this._hexTheme.clear();
      console.error("ColorTheme Error: ", error.message);

      return false;
    }
  }

  /**
   * Use this method to add theme to css
   */
  install() {
    if(this._isInstalled) return true;
    let cssTheme = `[data-theme="${this.name}"] { \n`;

    // Add value (HEX).
    this._hexTheme.forEach(function(value, colorName) {
      cssTheme += ColorTheme.toCSSVariable(colorName, value[0], value[1]) + ";\n";
    });

    // Add value (RGB)
    this._rgbTheme.forEach(function(value, colorName) {
      cssTheme += ColorTheme.toCSSVariable(colorName, value[0], value[1]) + ";\n";
    });

    cssTheme += "}";

    // Add cssTheme to style#theme
    this._styleThemeElement!.innerHTML += cssTheme;

    return true;
  }

  /**
   * Use this method to tell HTML use this theme by set the `data-theme` to theme's `name`.
   * The default value of `data-theme` is `default`.
   */
  useTheme() {
    this._documentElement.setAttribute("data-theme", this.name);
  }

  
}

// Create dark theme for `default` here or some supported themes.
// DEFAULT DARK
const defaultDarkTheme = new ColorTheme("default-dark");

/*
  --clr-outline: #C5C5C5;
  --clr-rgb-outline: 197, 197, 197;
  --clr-subOutline: #F1F1F1;
  --clr-rgb-subOutline: 241, 241, 241;
*/

// setTheme
defaultDarkTheme.setTheme([
  "primary:5DC2E1",
  "primary:93, 194, 225",
  "background:262626",
  "background:38, 38, 38",
  "onBackground:FFFFFF",
  "onBackground:255, 255, 255",
  "outline:595959",
  "outline:89, 89, 89",
  "subOutline:6B6B6B",
  "subOutline:107, 107, 107"
]);

export {
  defaultDarkTheme
}