Ext.define('cats-milestone-by-release.utils.MilestonesTemplate', {
       extend: 'Ext.XTemplate',

       constructor: function(config) {
           config = config || {};

           var templateConfig = [
                   '<tpl for=".">',
                       '{[this.getPillHtml(values)]}',
                   '</tpl>',
                   {
                       getPillHtml: this.getPillHtml
                   },
                   config
               ];

           return this.callParent(templateConfig);
       },

       /**
        * @protected
        *
        * Get the HTML for one pill
        * @param  {Object} recordData plain javascript object that is the data for a record
        * @return {String}            HTML representing one pill
        */
       getPillHtml: function(tagData) {
           var colorAttr = tagData.DisplayColor ? ' style="color: ' + tagData.DisplayColor + ';"' : '';
           var iconHTML = this.iconCls ? '<span class="' + this.iconCls + '"' + colorAttr + '></span>' : '';
           var targetDate = tagData.TargetDate && Rally.util.DateTime.formatWithDefault(Rally.util.DateTime.fromIsoString(tagData.TargetDate)) || '';
           var name = tagData.Name;
           if (tagData.FormattedID){
             name = tagData.FormattedID + ': ' + tagData.Name;
           }
           //return '<span class="' + (this.cls ? this.cls : '') + '">' + iconHTML + tagData.Name + '<br/><b>' + targetDate + '</b></span>';
           return '<span class="' + (this.cls ? this.cls : '') + '">' + iconHTML + name + '<br/><b>' + targetDate + '</b></span>';
       },

       apply: function(recordData, parent) {
           var values = this._transformValues(recordData);
           return this.callParent([values, parent]);
       },

       // Transform the passed in data (a record) into the shape expected by the template (a list of e.g. tags)
       _transformValues: function(recordData) {
           var items = recordData[this.collectionName];
           if (items._tagsNameArray) {
               items = items._tagsNameArray ? items._tagsNameArray : items;
           } else if (!_.isArray(items)) {
               items = [];
           } else {
               items = _.map(items, function(obj) {

                   var targetDate = null;
                   if (obj.TargetDate){
                     targetDate = Rally.util.DateTime.fromIsoString(obj.TargetDate);
                   }
                   var name = obj.Name || obj.get('Name')
                   return {
                       _ref: obj._ref || obj.get('_ref'),
                       Name: obj.Name || obj.get('Name'),
                       TargetDate: targetDate,
                       DisplayColor: obj.DisplayColor,
                       FormattedID: obj.FormattedID
                   };

               });
           }
           items = Rally.util.Array.sortByAttribute(items, 'TargetDate');
           return items;
       }
   });
