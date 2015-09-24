/**
 * This class is the main view for the application. It is specified in app.js as the
 * "autoCreateViewport" property. That setting automatically applies the "viewport"
 * plugin to promote that instance of this class to the body element.
 */

Ext.define('esapp.view.main.Main', {
    extend: 'Ext.container.Viewport',

    xtype: 'app-main',
    requires: [
        'esapp.view.main.MainModel',
        'esapp.view.main.MainController',

        'esapp.view.header.Header',
        'esapp.view.dashboard.Dashboard',
        'esapp.view.acquisition.Acquisition',
        'esapp.view.processing.Processing',
        'esapp.view.datamanagement.DataManagement',
        'esapp.view.analysis.analysisMain',
        'esapp.view.system.systemsettings',
        'esapp.view.help.help',

        'Ext.layout.container.Center',
        'Ext.form.field.ComboBox'
    ],
    controller: 'app-main',
    viewModel: {
        type: 'app-main'
    },
    autoRender : true,

    layout: {
        type: 'border'
    },
    ptype:'lazyitems',

    initComponent: function () {
        var me = this;

        me.items = [{
                region: 'north',
                id: 'headerlogos',
                xtype:'container',
                title:'',
                height: 63,
                items:[{
                    xtype : 'headerLogos'
                }],
                split: false,
                collapsible: false,
                collapsed: false
            //},{
            //    region: 'west',
            //    stateId: 'navigation-panel',
            //    id: 'versioninfo-west-panel', // see Ext.getCmp() below
            //    title: '<span class="panel-title-style">eStation 2.0</span>',
            //    split: false,
            //    width: 2,
            //    collapsible: false,
            //    collapsed: true,
            //    hideCollapseTool: true
            },{
                region: 'center',
                xtype: 'tabpanel',
                id: 'maintabpanel',
                layout: 'fit',
                deferredRender: false,
                layoutOnTabChange: true,
                activeTab: 'dashboardtab',     // first tab initially active

                defaults:{hideMode: 'offsets'}, // For performance resons to pre-render in the background.

                listeners: {
                    afterrender: function(tabpanel) {
                        var bar = tabpanel.tabBar;
                        bar.insert(tabpanel.tabBar.items.length, [{
                            xtype: 'component',
                            flex: 1
                        }, {
                            xtype: 'combo',
                            id:'languageCombo',
                            name:'languageCombo',
                            store: 'LanguagesStore',
                            displayField:'langdescription',
                            valueField: 'langcode',
                            emptyText:esapp.Utils.getTranslation('select'),  // 'Select...',
                            labelWidth: 50,
                            labelAlign: 'left',
                            publishes: ['langcode'],
                            typeAhead: true,
                            queryMode: 'local',
                            width:120,
                            listeners: {
                                select: function (languagecombo, record){
                                    //console.info(languagecombo.getValue());
                                    window.location = '?lang='+languagecombo.getValue();
                                }
                            }
                        }]);
                        //console.info('language: ' + esapp.globals['selectedLanguage']);
                        Ext.getCmp("languageCombo").setValue(esapp.globals['selectedLanguage']);
                    }
                },

                items: [{
                    title: esapp.Utils.getTranslation('dashboard'),  // 'Dashboard',
                    id:'dashboardtab',
                    xtype:'container',
                    autoScroll: true,
                    layout : 'center',
                    bodyCls:'dashboard-panel-body',
                    items: [{
                        xtype: 'dashboard-main'
                    }],
                    listeners: {
                       activate: function (dashboardtab) {
                           var headerlogos = Ext.ComponentQuery.query('container[id=headerlogos]')[0];
                           headerlogos.setHidden(false);
                           dashboardtab.up().down('container[id=acquisitionmaintab]').doLayout();
                           dashboardtab.up().down('container[id=datamanagementmaintab]').doLayout();
                           //dashboardtab.down('panel[id=dashboardpc2]').getController().checkStatusServices();
                       }
                    }
                }, {
                    title: esapp.Utils.getTranslation('acquisition'),  // 'Acquisition',
                    id:'acquisitionmaintab',
                    xtype:'container',
                    closable: false,
                    autoScroll: true,
                    layout: 'fit',
                    items: [{
                        // html: '<img alt="Mockup Acquisition" width="100%" height="100%" src="../resources/img/mockup_acquisition.png">'
                        xtype : 'acquisition-main',
                        id:'acquisitionmain'
                    }],
                    listeners: {
                       activate: function (acquisitiontab) {
                           var headerlogos = Ext.ComponentQuery.query('container[id=headerlogos]')[0];
                           headerlogos.setHidden(false);

                           var acquisitionmain = acquisitiontab.down('panel[name=acquisitionmain]');
                           acquisitionmain.getController().checkStatusServices();

                           //acquisitionmain.getView().getFeature('productcategories').expandAll();
                           acquisitionmain.getView().refresh();
                       }
                    }
                }, {
                    title: esapp.Utils.getTranslation('processing'),  // 'Processing',
                    id:'processingmaintab',
                    xtype:'container',
                    autoScroll: true,
                    layout: 'fit',
                    items: [{
                       xtype  : 'processing-main',
                       id:'processingmain'
                    }],
                    listeners: {
                       activate: function (processingtab) {
                           var headerlogos = Ext.ComponentQuery.query('container[id=headerlogos]')[0];
                           headerlogos.setHidden(false);
                           processingtab.down('panel[name=processingmain]').getController().checkStatusServices();
                       }
                    }
                }, {
                    title: esapp.Utils.getTranslation('datamanagement'),  // 'Data Management',
                    id:'datamanagementmaintab',
                    xtype:'container',
                    autoScroll: true,
                    layout: 'fit',
                    items: [{
                       xtype  : 'datamanagement-main',
                       id:'datamanagementmain'
                    }],
                    listeners: {
                       activate: function (datamanagementtab) {
                           var headerlogos = Ext.ComponentQuery.query('container[id=headerlogos]')[0];
                           headerlogos.setHidden(false);

                           var datamanagementmain = datamanagementtab.down('panel[name=datamanagementmain]');

                           //datamanagementmain.getView().getFeature('prodcat').expandAll();
                           datamanagementmain.getView().refresh();
                       }
                    }
                }, {
                    title: esapp.Utils.getTranslation('analysis'),  // 'Analysis',
                    id:'analysistab',
                    xtype:'container',
                    autoScroll: true,
                    layout : 'fit',
                    disabled: false,
                    hidden: false,
                    items: [{
                        xtype  : 'analysis-main',
                        id:'analysismain',
                        hidden: false
                    }],
                    listeners: {
                       activate: function (analysistab) {
                           var headerlogos = Ext.ComponentQuery.query('container[id=headerlogos]')[0];
                           headerlogos.setHidden(true);
                           //analysistab.down().render();
                           //analysistab.down().updateLayout();
                           //analysistab.down().show();
                           //analysistab.down().controller.newMapView();
                       }
                    }
                }, {
                    title: esapp.Utils.getTranslation('system'),  // 'System',
                    id:'systemtab',
                    xtype:'container',
                    autoScroll: true,
                    layout : 'center',
                    items: [{
                       xtype  : 'systemsettings',
                       id:'systemsettingsview'
                    }],
                    listeners: {
                       activate: function (systemtab) {
                            var headerlogos = Ext.ComponentQuery.query('container[id=headerlogos]')[0];
                            headerlogos.setHidden(false);

                            var systemsettingsstore  = Ext.data.StoreManager.lookup('SystemSettingsStore');
                            var formpanel = Ext.getCmp('systemsettingsview');
                            var systemsettingsrecord = systemsettingsstore.getModel().load(0, {
                                scope: formpanel,
                                loadmask: true,
                                failure: function(record, operation) {
                                    //console.info('failure');
                                },
                                success: function(record, operation) {
                                    if (operation.success){
                                        formpanel.loadRecord(systemsettingsrecord);
                                        formpanel.updateRecord();
                                    }
                                }
                            });
                       }
                    }
                }, {
                    title: esapp.Utils.getTranslation('help'),  // 'Help',
                    xtype: 'container',
                    autoScroll: true,
                    layout : 'center',
                    items: [{
                       xtype  : 'help',
                       id:'helpview'
                    }],
                    listeners: {
                        activate: function (helptab) {
                            var headerlogos = Ext.ComponentQuery.query('container[id=headerlogos]')[0];
                            headerlogos.setHidden(false);
                        }
                    }
                }]
            }];

        me.callParent();
    }
});