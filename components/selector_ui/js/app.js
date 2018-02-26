require.config({
   paths: {
      jquery: 'lib/jquery',
      handlebars: 'lib/handlebars',
      backbone: 'lib/backbone',
      underscore: 'lib/underscore',
      lockr: 'lib/lockr',
      selectormodel: 'models/SelectorModel'
   }
});

require(['views/SelectorView'], function(SelectorView){
   jQuery.ajax({
      url: 'http://localhost:5465/api/system/config'
   }).done(function( configData ) {

      new SelectorView({
         'component_name':'Skills',
         'display-title' : 'Skills to Contribute',
         'tag-color':'#AA193A',
         'url' : 'http://localhost:5465/api/project/taxonomy/skills-for-ui'
      });
      new SelectorView({
         'component_name':'Interests',
         'display-title' : 'Civic Interests',
         'tag-color':'#3DA1D2',
         'url' : 'http://localhost:5465/api/project/taxonomy/interests-for-ui',
         'el' : '#container2'
      });
      new SelectorView({
         'component_name':'Learnings',
         'display-title' : 'Skills to Learn',
         'tag-color':'#123D51',
         'url' : 'http://localhost:5465/api/project/taxonomy/skills-for-ui',
         'el' : '#container3'
      });

   });
});