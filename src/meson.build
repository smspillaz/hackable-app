# Copyright 2018 Endless Mobile, Inc.

gnome.compile_resources('com.endlessm.HackableApp.src',
    'com.endlessm.HackableApp.src.gresource.xml',
    gresource_bundle: true, install: true, install_dir: pkgdatadir)

subst = configuration_data()
subst.set('GJS', gjs.path())
subst.set('PACKAGE_VERSION', meson.project_version())
subst.set('prefix', get_option('prefix'))
subst.set('libdir', get_option('libdir'))
subst.set('pkgdatadir', pkgdatadir)
configure_file(input: 'com.endlessm.HackableApp.in',
    output: 'com.endlessm.HackableApp',
    configuration: subst, install_dir: get_option('bindir'))
