# Copyright 2018 Endless Mobile, Inc.

gnome.compile_resources('com.endlessm.HackableApp.data',
    'com.endlessm.HackableApp.data.gresource.xml',
    gresource_bundle: true, install: true, install_dir: pkgdatadir)

install_data('com.endlessm.HackableApp.desktop',
    install_dir: join_paths(get_option('datadir'), 'applications'))

subst = configuration_data()
subst.set('bindir', join_paths(get_option('prefix'), get_option('bindir')))
configure_file(input: 'com.endlessm.HackableApp.service.in',
    output: 'com.endlessm.HackableApp.service',
    configuration: subst,
    install_dir: join_paths(get_option('datadir'), 'dbus-1', 'services'))
