Ext.define('esapp.model.UserMapTemplate', {
    extend : 'esapp.model.Base',

    fields: [
        {name: 'workspaceid', mapping: 'workspaceid'},
        {name: 'userid', mapping: 'userid'},
        {name: 'map_tpl_id', mapping: 'map_tpl_id'},
        {name: 'parent_tpl_id', mapping: 'parent_tpl_id'},
        {name: 'templatename', type: 'string', mapping: 'map_tpl_name'},
        {name: 'istemplate', mapping: 'istemplate'},
        {name: 'mapviewposition', mapping: 'mapviewposition'},
        {name: 'mapviewsize', mapping: 'mapviewsize'},
        {name: 'productcode', mapping: 'productcode'},
        {name: 'subproductcode', mapping: 'subproductcode'},
        {name: 'productversion', mapping: 'productversion'},
        {name: 'mapsetcode', mapping: 'mapsetcode'},
        {name: 'productdate', mapping: 'productdate'},
        {name: 'legendid', mapping: 'legendid'},
        {name: 'legendlayout', mapping: 'legendlayout'},
        {name: 'legendobjposition', mapping: 'legendobjposition'},
        {name: 'showlegend',  type: 'boolean', mapping: 'showlegend'},
        {name: 'titleobjposition', mapping: 'titleobjposition'},
        {name: 'titleobjcontent', mapping: 'titleobjcontent'},
        {name: 'disclaimerobjposition', mapping: 'disclaimerobjposition'},
        {name: 'disclaimerobjcontent', type: 'string', mapping: 'disclaimerobjcontent'},
        {name: 'logosobjposition', mapping: 'logosobjposition'},
        {name: 'logosobjcontent', mapping: 'logosobjcontent'},
        {name: 'showobjects',  type: 'boolean', mapping: 'showobjects'},
        {name: 'showtoolbar',  type: 'boolean', mapping: 'showtoolbar'},
        {name: 'showgraticule',  type: 'boolean', mapping: 'showgraticule'},
        {name: 'scalelineobjposition', mapping: 'scalelineobjposition'},
        {name: 'vectorlayers', mapping: 'vectorlayers'},
        {name: 'outmask',  type: 'boolean', mapping: 'outmask'},
        {name: 'outmaskfeature', mapping: 'outmaskfeature'},
        {name: 'auto_open', type: 'boolean', mapping: 'auto_open'},
        {name: 'zoomextent', mapping: 'zoomextent'},
        {name: 'mapsize', mapping: 'mapsize'},
        {name: 'mapcenter', mapping: 'mapcenter'}
    ]
});
