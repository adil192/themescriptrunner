import GLib from "gi://GLib";
import Gio from "gi://Gio";
import Meta from "gi://Meta";
import Shell from "gi://Shell";
import * as Main from "resource:///org/gnome/shell/ui/main.js";
import { Extension } from "resource:///org/gnome/shell/extensions/extension.js";

export default class MyExtension extends Extension {
  gsettings?: Gio.Settings;
  lightCommand?: string;
  darkCommand?: string;

  enable() {
    this.gsettings = this.getSettings();
    this.lightCommand = this.gsettings.get_string("light-command");
    this.darkCommand = this.gsettings.get_string("dark-command");
  }

  disable() {
    this.gsettings = undefined;
  }
}
