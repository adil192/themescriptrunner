import GLib from "gi://GLib";
import Gio from "gi://Gio";
import { Extension } from "resource:///org/gnome/shell/extensions/extension.js";

export default class ThemeScriptRunnerExtension extends Extension {
  gsettings?: Gio.Settings;
  gnomeInterfaceSettings?: Gio.Settings;
  colorSchemeChangedId?: number;

  enable() {
    let gsettings = this.getSettings();
    this.gsettings = gsettings;

    let gnomeInterfaceSettings = new Gio.Settings({ schema_id: "org.gnome.desktop.interface" });
    this.gnomeInterfaceSettings = gnomeInterfaceSettings;

    this.colorSchemeChangedId = gnomeInterfaceSettings.connect("changed::color-scheme", () => {
      const scheme = gnomeInterfaceSettings.get_string("color-scheme");
      ThemeScriptRunnerExtension._onColorSchemeChanged(scheme, gsettings);
    });
  }

  disable() {
    if (this.colorSchemeChangedId)
      this.gnomeInterfaceSettings?.disconnect(this.colorSchemeChangedId);
    this.colorSchemeChangedId = undefined;
    this.gnomeInterfaceSettings = undefined;
    this.gsettings = undefined;
  }

  static _onColorSchemeChanged(
    /**
     * The preferred colour scheme for the user interface.
     * Valid values are "default", "prefer-light", "prefer-dark".
     */
    color_scheme: string,
    gsettings: Gio.Settings,
  ) {
    let command: string;
    switch (color_scheme) {
      case "default":
      case "prefer-light":
        command = gsettings.get_string("light-command");
        break;
      case "prefer-dark":
        command = gsettings.get_string("dark-command");
        break;
      default:
        console.error(
          `Unrecognized color-scheme "${color_scheme}". Expected "default", "prefer-light", or "prefer-dark".`,
        );
        return;
    }
    if (!command) {
      console.warn(`Empty command specified for "${color_scheme}", doing nothing.`);
      return;
    }

    // We don't need to call `GLib.spawn_close_pid` since it does nothing on Linux/UNIX
    let [success, _pid] = GLib.spawn_async(
      null,
      ["sh", "-c", command],
      null,
      GLib.SpawnFlags.SEARCH_PATH,
      null,
    );
    if (!success) {
      console.error(`Failed to spawn command "${command}"`);
    } else {
      console.log(`Command "${command}" spawned successfully.`);
    }
  }
}
