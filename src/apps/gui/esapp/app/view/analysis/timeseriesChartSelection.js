Ext.define("esapp.view.analysis.timeseriesChartSelection",{
    extend: "Ext.panel.Panel",      // "Ext.window.Window",
 
    requires: [
        "esapp.view.analysis.timeseriesChartSelectionController",
        "esapp.view.analysis.timeseriesChartSelectionModel",

        "esapp.view.analysis.timeseriesProductSelection"
    ],
    
    controller: "analysis-timeserieschartselection",
    viewModel: {
        type: "analysis-timeserieschartselection"
    },

    xtype: 'timeserieschartselection',

    title: esapp.Utils.getTranslation('TIME_SERIES_GRAPHS'),  // 'TIME SERIES GRAPHS',

    header: {
        titlePosition: 1,
        titleAlign: 'center'
    },
    constrainHeader: true,
    constrain: true,
    autoShow : false,
    hidden: true,
    closable: true,
    closeAction: 'hide', // 'hide',
    maximizable: false,
    collapsible: true,
    collapsed: false,
    resizable: false,
    autoScroll: false,
    floating: true,
    floatable: true,
    alwaysOnTop: false,

    width:525,
    minWidth:525,
    //autoHeight: true,
    height: Ext.getBody().getViewSize().height-65,

    alignTarget: Ext.getCmp('backgroundmap'),
    defaultAlign: 'tr-tr',
    // glyph : 'xf080@FontAwesome',
    margin: '0 0 0 0',
    frame: true,
    border: true,
    layout: {
        type: 'fit'
    },


    initComponent: function () {
        var me = this;

        //Ext.util.Observable.capture(me, function (e) { console.log('timeserieschartselection - ' + e);});

        me.listeners = {
            align: function(){
                if (!me.hidden){
                    var task = new Ext.util.DelayedTask(function() {
                        //console.info('align');
                        //console.info(Ext.getCmp('analysismain').lookupReference('backgroundmap'));
                        me.show();
                        me.expand();
                        me.alignTo(Ext.getCmp('analysismain').lookupReference('backgroundmap'), 'tr-tr');
                        me.updateLayout();
                    });
                    task.delay(0);
                }
            }
            ,activate: function() {
                //console.info('activate tsselectionwin');
                me.fireEvent('align');
            }
        };

        me.title = esapp.Utils.getTranslation('TIME_SERIES_GRAPHS');  // 'TIME SERIES GRAPHS',

        me.items = [{
            xtype: 'fieldset',
            id: 'fieldset_selectedregion',
            title: '<b style="font-size:16px; color:#0065A2; line-height: 18px;">' + esapp.Utils.getTranslation('selectedregion') + '</b>',
            hidden: false,
            autoHeight: false,   // 65,
            height: 60,
            maxHeight: 60,
            border: 2,
            padding: '5 5 5 15',
            margin: '15 0 15 0',
            style: {
                borderColor: '#157FCC',
                borderStyle: 'solid'
            },
            items: [{
                xtype: 'displayfield',
                id: 'selectedregionname',
                reference: 'selectedregionname',
                fieldLabel: '',
                labelAlign: 'left',
                fieldCls: 'ts_selectedfeature_name_font',
                style: {
                    color: 'green'
                    //"font-weight": 'bold',
                    //"font-size": 24
                },
                value: ''
            }]
        }, {
            xtype: 'tabpanel',
            id: 'graphs_tabpanel_'+me.id,
            //width: 440,
            //minWidth: 440,
            //maxWidth : 500,
            //minTabWidth: 210,
            hideCollapseTool: true,
            header: false,
            autoScroll:false,
            frame: false,
            border: false,
            margin: '15 0 0 0',
            layout: {
                type: 'fit'
            },
            items: [{
                title: esapp.Utils.getTranslation('PROFILE'),  // 'DEFAULT X/Y GRAPH',
                id: 'ts_xy_graph_tab_' + me.id,
                margin: 2,
                //minHeight: 800,
                autoHeight: true,
                autoScroll: true,
                layout: {
                    type: 'vbox'
                    , align: 'stretch'
                },
                defaults: {
                    margin: '0 0 0 0'
                },
                tbar: {
                    padding: '0 0 0 0',
                    items: [{
                        xtype: 'button',
                        text: esapp.Utils.getTranslation('gettimeseries'),    // 'Get timeseries',
                        id: 'gettimeseries_btn_xy',
                        reference: 'gettimeseries_btn_xy',
                        iconCls: 'chart-curve_medium',
                        scale: 'medium',
                        disabled: false,
                        //width: 150,
                        autoWidth: true,
                        margin: '0 0 5 0',
                        charttype: 'xy',
                        handler: 'generateTimeseriesChart'
                    }]
                },
                items: [{
                    xtype: 'timeseriesproductselection',
                    charttype: 'xy',
                    cumulative: false,
                    multiplevariables: true,
                    fromto: true,
                    year: false,
                    compareyears: true,
                    multipleyears: false
                }]
            },{

                title: esapp.Utils.getTranslation('CUMULATIVE'),  // 'CUMULATIVE',
                id: 'ts_cumulative_graph_tab_' + me.id,
                margin: 2,
                //minHeight: 800,
                autoHeight: true,
                autoScroll: true,
                layout: {
                    type: 'vbox'
                    , align: 'stretch'
                },
                defaults: {
                    margin: '0 0 0 0'
                },
                tbar: {
                    padding: '0 0 0 0',
                    items: [{
                        xtype: 'button',
                        text: esapp.Utils.getTranslation('gettimeseries'),    // 'Get timeseries',
                        id: 'gettimeseries_btn_cum',
                        reference: 'gettimeseries_btn_cum',
                        iconCls: 'chart-curve_medium',
                        scale: 'medium',
                        disabled: false,
                        //width: 150,
                        autoWidth: true,
                        margin: '0 0 5 0',
                        charttype: 'cumulative',
                        handler: 'generateTimeseriesChart'
                    }]
                },
                items: [{
                    xtype: 'timeseriesproductselection',
                    charttype: 'cumulative',
                    cumulative: true,
                    multiplevariables: true,
                    fromto: true,
                    year: true,
                    compareyears: false,
                    multipleyears: false
                }]
            },{
                title: esapp.Utils.getTranslation('RANKING_ZSCORE'),  // 'RANKING / Z-SCORE',
                id: 'ts_ranking_graph_tab_'+me.id,
                margin:3,
                //minHeight: 800,
                autoHeight: true,
                autoScroll:true,
                layout: {
                    type: 'vbox'
                    ,align: 'stretch'
                },
                defaults: {
                    margin: '5 0 15 0'
                },
                tbar: {
                    padding: '0 0 0 0',
                    items: [{
                        xtype: 'button',
                        text: esapp.Utils.getTranslation('gettimeseries'),    // 'Get timeseries',
                        id: 'gettimeseries_btn_ranking',
                        reference: 'gettimeseries_btn_ranking',
                        iconCls: 'chart-curve_medium',
                        scale: 'medium',
                        disabled: false,
                        autoWidth: true,
                        margin: '0 0 5 0',
                        charttype: 'ranking',
                        handler: 'generateTimeseriesChart'
                    }]
                },
                items: [{
                    xtype: 'timeseriesproductselection',
                    charttype: 'ranking',
                    cumulative: false,
                    ranking: true,
                    multiplevariables: false,
                    fromto: false,
                    year: false,
                    compareyears: false,
                    multipleyears: true
                }]
            },{
                title: esapp.Utils.getTranslation('MATRIX'),  // 'MATRIX',
                id: 'ts_matrix_graph_tab_'+me.id,
                margin:3,
                //minHeight: 800,
                autoHeight: true,
                autoScroll:true,
                layout: {
                    type: 'vbox'
                    ,align: 'stretch'
                },
                defaults: {
                    margin: '5 0 15 0'
                },
                tbar: {
                    padding: '0 0 0 0',
                    items: [{
                        xtype: 'button',
                        text: esapp.Utils.getTranslation('gettimeseries'),    // 'Get timeseries',
                        id: 'gettimeseries_btn_matrix',
                        reference: 'gettimeseries_btn_matrix',
                        iconCls: 'chart-curve_medium',
                        scale: 'medium',
                        disabled: false,
                        autoWidth: true,
                        margin: '0 0 5 0',
                        charttype: 'matrix',
                        handler: 'generateTimeseriesChart'
                    }]
                },
                items: [{
                    xtype: 'timeseriesproductselection',
                    charttype: 'matrix',
                    cumulative: false,
                    matrix: true,
                    multiplevariables: false,
                    fromto: false,
                    year: false,
                    compareyears: false,
                    multipleyears: true
                }]
            },{
                title: 'Debug info',
                id: 'debug_info_tab_'+me.id,
                hidden: true,
                items: [{
                    xtype: 'displayfield',
                    id: 'regionname',
                    reference: 'regionname',
                    fieldLabel: 'Region name',
                    labelAlign : 'top',
                    value: '<span style="color:green;">value</span>'
                }, {
                    xtype: 'displayfield',
                    id: 'admin0name',
                    reference: 'admin0name',
                    fieldLabel: 'Admin level 0 country name',
                    labelAlign : 'top',
                    value: '<span style="color:green;">value</span>'
                }, {
                    xtype: 'displayfield',
                    id: 'admin1name',
                    reference: 'admin1name',
                    fieldLabel: 'Admin level 1 region name',
                    labelAlign : 'top',
                    value: '<span style="color:green;">value</span>'
                }, {
                    xtype: 'displayfield',
                    id: 'admin2name',
                    reference: 'admin2name',
                    fieldLabel: 'Admin level 2 region name',
                    labelAlign : 'top',
                    value: '<span style="color:green;">value</span>'
                }, {
                    title: 'WKT of Polygon',
                    xtype: 'displayfield',
                    id: 'wkt_polygon',
                    reference: 'wkt_polygon',
                    fieldLabel: 'WKT of Polygon',
                    labelAlign : 'top',
                    value: ''
                }]
            }]
        }];

        me.callParent();
    }
});
