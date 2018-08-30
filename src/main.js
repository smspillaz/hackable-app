/* global pkg, _ */
// src/main.js
//
// Copyright (c) 2018 Endless Mobile Inc.
//
// This file is the file first run by the entrypoint to the
// hackable-app package.
//
pkg.initGettext();
pkg.initFormat();
pkg.require({
    Gdk: '3.0',
    GdkPixbuf: '2.0',
    Gtk: '3.0',
    Gio: '2.0',
    GLib: '2.0',
    GObject: '2.0',
    Hackable: '0'
});

const {Gdk, GObject, Gio, GLib, Gtk, Hackable} = imports.gi;

const DATA_RESOURCE_PATH = 'resource:///com/endlessm/HackableApp';

function systemdDbusEncode(string) {
    return string.replace(/([^A-Za-z0-9])/g, m => `_${m.charCodeAt(0).toString(16)}`);
}

function computeWMRole(busName, objectPath) {
    return `EosHackableApplication-${systemdDbusEncode(busName)}-${systemdDbusEncode(objectPath)}`;
}

const HackableAppMainWindow = GObject.registerClass({
    Template: `${DATA_RESOURCE_PATH}/hackable-app-main-window.ui`,
    Children: [
        'hack-button'
    ],
    Properties: {
        'skeleton': GObject.ParamSpec.object('skeleton',
                                             'Hackable Skeleton',
                                             'The GDBusInterfaceSkeleton for the Hackable interface',
                                             GObject.ParamFlags.READWRITE,
                                             Hackable.HackableSkeleton)
    },
}, class HackableAppMainWindow extends Gtk.ApplicationWindow {
    _init(params) {
        super._init(params);

        this.skeleton = createHackableSkeletonOnPath(this.application.get_dbus_connection(),
                                                     GLib.build_filenamev([this.application.get_dbus_object_path(),
                                                                           'window',
                                                                           String(this.get_id())]))
        this.hack_button.connect('clicked', () => {
            log('Hack the planet!');
        });
        this.set_role(computeWMRole(this.application.get_dbus_connection().unique_name,
                                    this.skeleton.get_object_path()));
    }
});

function load_style_sheet(resourcePath) {
    const provider = new Gtk.CssProvider();
    provider.load_from_resource(resourcePath);
    Gtk.StyleContext.add_provider_for_screen(Gdk.Screen.get_default(),
        provider,
        Gtk.STYLE_PROVIDER_PRIORITY_APPLICATION);
}

function createHackableSkeletonOnPath(connection, path) {
    let skeleton = new Hackable.HackableSkeleton({});
    skeleton.export(connection, path);
    return skeleton;
}

const HackableAppApplication = GObject.registerClass(class extends Gtk.Application {
    _init() {
        super._init({
            application_id: pkg.name
        });
        GLib.set_application_name(_('Hackable Application'));

        this._window = null;
    }

    vfunc_startup() {
        super.vfunc_startup();

        const settings = Gtk.Settings.get_default();
        settings.gtk_application_prefer_dark_theme = true;

        load_style_sheet('/com/endlessm/HackableApp/application.css');
    }

    vfunc_activate() {
        if (!this._window)
            this._window = new HackableAppMainWindow({
                application: this
            });

        this._window.present();
    }
});


function main(argv) { // eslint-disable-line no-unused-vars
    return (new HackableAppApplication()).run(argv);
}
