Ext.define('esapp.view.help.helpController', {
    extend: 'Ext.app.ViewController',
    alias: 'controller.help-help',

    onDocumentClick: function(dv, record, item, idx, e, eOpts) {
//        console.info('clicked to open doc');
        window.open(record.get('url'), '_helpdoc');
    }
    
});
