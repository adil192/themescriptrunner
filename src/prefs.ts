import Gtk from "gi://Gtk";
import Adw from "gi://Adw";
import Gio from "gi://Gio";
import {
  ExtensionPreferences,
  gettext as _,
} from "resource:///org/gnome/Shell/Extensions/js/extensions/prefs.js";

export default class GnomeRectanglePreferences extends ExtensionPreferences {
  _settings?: Gio.Settings;

  fillPreferencesWindow(window: Adw.PreferencesWindow): Promise<void> {
    this._settings = this.getSettings();

    const page = new Adw.PreferencesPage({
      title: _("General"),
      iconName: "dialog-information-symbolic",
    });
    window.add(page);

    const lightGroup = new Adw.PreferencesGroup({
      title: _("Light mode"),
      description: _("When entering light mode..."),
    });
    page.add(lightGroup);
    const lightCommand = new Adw.EntryRow({
      title: _("Command to run"),
      cssClasses: ["command-entry-row"],
      inputPurpose: Gtk.InputPurpose.TERMINAL,
    });
    lightGroup.add(lightCommand);

    const darkGroup = new Adw.PreferencesGroup({
      title: _("Dark mode"),
      description: _("When entering dark mode..."),
    });
    page.add(darkGroup);
    const darkCommand = new Adw.EntryRow({
      title: _("Command to run"),
      cssClasses: ["command-entry-row"],
      inputPurpose: Gtk.InputPurpose.TERMINAL,
    });
    darkGroup.add(darkCommand);

    this._settings.bind("light-command", lightCommand, "text", Gio.SettingsBindFlags.DEFAULT);
    this._settings.bind("dark-command", darkCommand, "text", Gio.SettingsBindFlags.DEFAULT);

    return Promise.resolve();
  }
}
