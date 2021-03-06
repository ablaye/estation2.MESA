
Ext.define("esapp.view.acquisition.product.editProduct",{
    "extend": "Ext.window.Window",
    "controller": "acquisition-product-editproduct",
    "viewModel": {
        "type": "acquisition-product-editproduct"
    },
    xtype: "editproduct",

    requires: [
        'esapp.view.acquisition.product.editProductModel',
        'esapp.view.acquisition.product.editProductController',
        'esapp.view.acquisition.product.InternetSourceAdmin',
        'esapp.view.acquisition.product.EumetcastSourceAdmin',
        'esapp.view.acquisition.product.editIngestion',

        'Ext.form.FieldSet',
        'Ext.form.field.Number',
        'Ext.Action'
    ],

    session:true,

    title: '',
    header: {
        titlePosition: 0,
        titleAlign: 'center'
    },

    constrainHeader: true,
    //constrain: true,
    modal: true,
    closable: true,
    closeAction: 'destroy', // 'hide',
    resizable: true,
    autoScroll: true,
    maximizable: false,
    height: Ext.getBody().getViewSize().height < 625 ? Ext.getBody().getViewSize().height-10 : 800,  // 600,
    maxHeight: 800,

    border: true,
    frame: true,
    fieldDefaults: {
        labelWidth: 120,
        labelAlign: 'left'
    },
    bodyPadding: '10 15 5 15',
    viewConfig: {forceFit:true},
    layout: 'vbox',

    params: {},


    initComponent: function () {
        var me = this;

        if (me.params.edit){
            me.setTitle('<span class="panel-title-style">' + esapp.Utils.getTranslation('editproduct') + '</span>');
        }
        else {
            me.setTitle('<span class="panel-title-style">' + esapp.Utils.getTranslation('newproduct') + '</span>');
        }

        var deleteDataSourceAction = Ext.create('Ext.Action', {
            text: esapp.Utils.getTranslation('unassign'),    // 'Unassign',
            iconCls: 'fa fa-chain-broken fa-2x',
            style: { color: 'red' },
            scale: 'medium',
            disabled: true,
            handler: 'deleteDataSource'
        });

        var addDataSourceAction = Ext.create('Ext.Action', {
            text: esapp.Utils.getTranslation('add'),    // 'Add',
            iconCls: 'fa fa-plus-circle fa-2x',
            style: { color: 'green' },
            scale: 'medium',
            disabled: false,
            handler: 'addDataSource'
        });


        var deleteIngestionAction = Ext.create('Ext.Action', {
            text: esapp.Utils.getTranslation('delete'),    // 'Delete',
            iconCls: 'fa fa-trash-o fa-2x',
            style: { color: 'red' },
            scale: 'medium',
            disabled: true,
            handler: 'deleteIngestion'
        });

        var addIngestionAction = Ext.create('Ext.Action', {
            text: esapp.Utils.getTranslation('add'),    // 'Add',
            iconCls: 'fa fa-plus-circle fa-2x',
            style: { color: 'green' },
            scale: 'medium',
            disabled: false,
            handler: 'addIngestion'
        });


        me.items = [{
            //margin:'0 15 5 0',
            items: [{
                xtype: 'fieldset',
                title: '<div class="grid-header-style">'+esapp.Utils.getTranslation('productinfo')+'</div>',   // '<b>Product info</b>',
                collapsible:false,
                width:630,
                //height:500,
                padding:'10 5 10 10',
                //layout: 'fit',
                defaults: {
                    //autoWidth: true,
                    labelWidth: 120
                },
                items:[{
                    id: 'category',
                    name: 'category',
                    //bind: '{product.category_id}',
                    xtype: 'combobox',
                    fieldLabel: esapp.Utils.getTranslation('category'),    // 'Category',
                    width:150+120,
                    allowBlank: false,
                    //store: 'categories',
                    store: {
                        type: 'categories'
                    },
                    valueField: 'category_id',
                    displayField: 'descriptive_name',
                    typeAhead: false,
                    queryMode: 'local',
                    emptyText: esapp.Utils.getTranslation('selectacategory')    // 'Select a category...'
                },{
                    id: 'productcode',
                    name: 'productcode',
                    //bind: '{product.productcode}',
                    xtype: 'textfield',
                    fieldLabel: esapp.Utils.getTranslation('productcode'),    // 'Product code',
                    width:150+120,
                    allowBlank: false
                },{
                    id: 'version',
                    name: 'version',
                    //bind: '{product.version}',
                    xtype: 'textfield',
                    fieldLabel: esapp.Utils.getTranslation('version'),    // 'Version',
                    width:150+120,
                    allowBlank: false
                },{
                    id: 'provider',
                    name: 'provider',
                    //bind: '{product.provider}',
                    xtype: 'textfield',
                    fieldLabel: esapp.Utils.getTranslation('provider'),    // 'Provider',
                    width:530,
                    allowBlank: true
                },{
                    id: 'product_name',
                    name: 'product_name',
                    //bind: '{product.prod_descriptive_name}',
                    xtype: 'textfield',
                    fieldLabel: esapp.Utils.getTranslation('product_name'),    // 'Product name',
                    width:530,
                    allowBlank: true
                }, {
                    id: 'productdescription',
                    name: 'productdescription',
                    //bind: '{product.description}',
                    xtype: 'textareafield',
                    fieldLabel: esapp.Utils.getTranslation('productdescription'),    // 'Product description',
                    labelAlign: 'top',
                    width: 590,
                    allowBlank: true,
                    grow: true
                },{
                    xtype: 'button',
                    text: esapp.Utils.getTranslation('save'),    // 'Save',
                    //scope:me,
                    iconCls: 'fa fa-save fa-2x',    // 'icon-disk',
                    style: { color: 'lightblue' },
                    scale: 'medium',
                    disabled: false,
                    handler: 'saveProductInfo'
                }]
            }]
        },{
            items: [{
                xtype: 'fieldset',
                title: '<div class="grid-header-style">'+esapp.Utils.getTranslation('datasources')+'</div>',   // '<b>Data sources</b>',
                id: 'datasourcesfieldset',
                hidden: true,
                collapsible: false,
                padding: '10 10 10 10',
                width: 630,

                items:[{
                    xtype: 'grid',
                    reference: 'productDataSourcesGrid',
                    //store: 'productdatasources',
                    bind:{
                        store:'{productdatasources}'
                    },
                    //session: true,
                    stateful: false,

                    dockedItems: [{
                        xtype: 'toolbar',
                        dock: 'bottom',
                        items: [
                            '->', addDataSourceAction, deleteDataSourceAction
                        ]
                    }],

                    viewConfig: {
                        stripeRows: false,
                        enableTextSelection: true,
                        draggable: false,
                        markDirty: false,
                        resizable: true,
                        disableSelection: false,
                        trackOver: true
                    },

                    selModel: {
                        allowDeselect: true
                        ,listeners: {
                            selectionchange: function (sm, selections) {
                                if (selections.length) {
                                    deleteDataSourceAction.enable();
                                } else {
                                    deleteDataSourceAction.disable();
                                }
                            }
                        }
                    },

                    collapsible: false,
                    enableColumnMove: false,
                    enableColumnResize: false,
                    multiColumnSort: false,
                    columnLines: false,
                    rowLines: true,
                    frame: true,
                    border: false,

                    columns: [{
                        xtype: 'actioncolumn',
                        hidden: false,
                        width: 50,
                        align: 'center',
                        sortable: false,
                        menuDisabled: true,
                        items: [{
                            icon: 'resources/img/icons/edit.png',
                            tooltip: esapp.Utils.getTranslation('editdatasource'),    // 'Edit Data Source',
                            handler: 'editDataSource'
                        }]
                    }, {
                        header: esapp.Utils.getTranslation('type'),    // 'Type',
                        dataIndex: 'type',
                        //bind: '{productdatasources.type}',
                        width: 110,
                        sortable: false,
                        hideable: false,
                        variableRowHeight: true,
                        menuDisabled: true
                    }, {
                        header: esapp.Utils.getTranslation('id'),    // 'ID',
                        dataIndex: 'data_source_id',
                        //bind: '{productdatasources.data_source_id}',
                        width: 265,
                        sortable: false,
                        hideable: false,
                        variableRowHeight: true,
                        menuDisabled: true
                    }, {
                        xtype: 'actioncolumn',
                        header: esapp.Utils.getTranslation('storenative'),    // 'Active',
                        hideable: false,
                        hidden: false,
                        menuDisabled: true,
                        width: 100,
                        align: 'center',
                        shrinkWrap: 0,
                        items: [{
                            // scope: me,
                            disabled: false,
                            getClass: function(v, meta, rec) {
                                if (rec.get('store_original_data')) {
                                    return 'activated';
                                } else {
                                    return 'deactivated';
                                }
                            },
                            getTip: function(v, meta, rec) {
                                if (rec.get('store_original_data')) {
                                    return esapp.Utils.getTranslation('tipdeactivatestoreoriginalget');     // 'Deactivate store original data for this Get';
                                } else {
                                    return esapp.Utils.getTranslation('tipactivatestoreoriginalget');     // 'Activate store original data for this Get';
                                }
                            },
                            handler: function(grid, rowIndex, colIndex) {
                                var rec = grid.getStore().getAt(rowIndex),
                                    action = (rec.get('store_original_data') ? 'deactivated' : 'activated');
                                // Ext.toast({ html: action + ' ' + rec.get('productcode'), title: 'Action', width: 300, align: 't' });
                                rec.get('store_original_data') ? rec.set('store_original_data', false) : rec.set('store_original_data', true);
                                grid.up().up().changesmade = true;
                            }
                        }]
                    }, {
                        xtype: 'actioncolumn',
                        header: esapp.Utils.getTranslation('active'),    // 'Active',
                        hideable: false,
                        hidden: false,
                        menuDisabled: true,
                        width: 65,
                        align: 'center',
                        shrinkWrap: 0,
                        items: [{
                            getClass: function (v, meta, rec) {
                                if (rec.get('activated')) {
                                    return 'activated';
                                } else {
                                    return 'deactivated';
                                }
                            },
                            getTip: function (v, meta, rec) {
                                if (rec.get('activated')) {
                                    return esapp.Utils.getTranslation('deactivatedatasource');    // 'Deactivate Data Source';
                                } else {
                                    return esapp.Utils.getTranslation('activatedatasource');    // 'Activate Data Source';
                                }
                            },
                            isDisabled: function (view, rowIndex, colIndex, item, record) {
                                // Returns true if 'editable' is false (, null, or undefined)
                                return false;    // !record.get('editable');
                            },
                            handler: function (grid, rowIndex, colIndex) {
                                var rec = grid.getStore().getAt(rowIndex),
                                    action = (rec.get('activated') ? 'deactivated' : 'activated');
                                // Ext.toast({ html: action + ' ' + rec.get('productcode'), title: 'Action', width: 300, align: 't' });
                                rec.get('activated') ? rec.set('activated', false) : rec.set('activated', true);
                                grid.up().up().changesmade = true;
                            }
                        }]
                    }]
                }]

            }]
        },{
            items: [{
                xtype: 'fieldset',
                title: '<div class="grid-header-style">'+esapp.Utils.getTranslation('ingestions')+'</div>',   // '<b>Ingestions</b>',
                id: 'ingestionsfieldset',
                hidden: true,
                collapsible:false,
                padding:'10 10 10 10',
                width: 630,

                items:[{
                    xtype: 'grid',
                    reference: 'productIngestionsGrid',
                    //store: 'productingestions',
                    bind:{
                        store:'{productingestions}'
                    },
                    //session: true,
                    stateful: false,

                    dockedItems: [{
                        xtype: 'toolbar',
                        dock: 'bottom',
                        items: [
                            '->', addIngestionAction, deleteIngestionAction
                        ]
                    }],

                    viewConfig: {
                        stripeRows: false,
                        enableTextSelection: true,
                        draggable: false,
                        markDirty: false,
                        resizable: true,
                        disableSelection: false,
                        trackOver: true
                    },

                    selModel: {
                        allowDeselect: true
                        ,listeners: {
                            selectionchange: function (sm, selections) {
                                if (selections.length) {
                                    deleteIngestionAction.enable();
                                } else {
                                    deleteIngestionAction.disable();
                                }
                            }
                        }
                    },

                    collapsible: false,
                    enableColumnMove: false,
                    enableColumnResize: false,
                    multiColumnSort: false,
                    columnLines: false,
                    rowLines: true,
                    frame: true,
                    border: false,

                    columns: [{
                        xtype: 'actioncolumn',
                        hidden: false,
                        width: 50,
                        align: 'center',
                        sortable: false,
                        menuDisabled: true,
                        items: [{
                            icon: 'resources/img/icons/edit.png',
                            tooltip: esapp.Utils.getTranslation('editingestion'),    // 'Edit Ingestion',
                            handler: 'editIngestion'
                        }]
                    }, {
                        header: esapp.Utils.getTranslation('mapset'),
                        dataIndex: 'mapsetcode',
                        width: 250,
                        sortable: false,
                        hideable: false,
                        variableRowHeight: true,
                        menuDisabled: true
                    }, {
                        header: esapp.Utils.getTranslation('subproduct'),
                        dataIndex: 'subproductcode',
                        width: 230,
                        sortable: false,
                        hideable: false,
                        variableRowHeight: true,
                        menuDisabled: true
                    }, {
                        xtype: 'actioncolumn',
                        header: esapp.Utils.getTranslation('active'),    // 'Active',
                        hideable: false,
                        hidden: false,
                        menuDisabled: true,
                        width: 65,
                        align: 'center',
                        shrinkWrap: 0,
                        items: [{
                            disabled: false,
                            getClass: function(v, meta, rec) {
                                if (rec.get('activated')) {
                                    return 'activated';
                                } else {
                                    return 'deactivated';
                                }
                            },
                            getTip: function(v, meta, rec) {
                                if (rec.get('activated')) {
                                    return esapp.Utils.getTranslation('deactivateingestion');   // 'Deactivate Ingestion';
                                } else {
                                    return esapp.Utils.getTranslation('activateingestion');   // 'Activate Ingestion';
                                }
                            },
                            handler: function(grid, rowIndex, colIndex) {
                                var rec = grid.getStore().getAt(rowIndex),
                                    action = (rec.get('activated') ? 'deactivated' : 'activated');
                                //Ext.toast({ html: action + ' ' + rec.get('productcode') + ' ' + rec.get('mapsetcode') + ' ' + rec.get('subproductcode'), title: 'Action', width: 300, align: 't' });
                                rec.get('activated') ? rec.set('activated', false) : rec.set('activated', true);
                                grid.up().up().changesmade = true;
                            }
                        }]
                    }]
                }]

            }]
        }];

        me.callParent();

        me.controller.setup();

    }
});
