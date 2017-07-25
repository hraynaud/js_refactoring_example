var Airbo = window.Airbo || {};

Airbo.ImageSearcher = (function(){
  var self = this;
  var grid;
  var missingImage = $("#images").data("missing");
  var searchFormSel = ".search-form";
  var page = 0;
  var flickityObj;
  var imageProviderList;
  var imageProviders;
  var NO_RESULTS = '<p class="err msg"><i class="fa fa-frown-o"></i> Sorry, no images found for your search. Please try a different search.</p>';

  function doFlickity(){
    grid.flickity({
      lazyLoad: true,
      pageDots: false,
    });

    flickityObj = grid.data('flickity');

    grid.flickity('unbindDrag');

    grid.on( 'select.flickity', function( event, progress ) {
      if(flickityObj.selectedIndex == flickityObj.cells.length -1){
      }
    });
  }

  function processResults(data,status,xhr){
    var handler = this.provider;
    var html = handler.handle(data);

    Airbo.PubSub.publish("image-results-added");
    presentData(html);
    Airbo.PubSub.publish("media-request-done");
    Airbo.Utils.ping("Image Search", {searchText: this.search, hasResults: (html !==undefined)});
  }

  function presentData(html){
    var isflickity = grid.data('flickity') !== undefined;
    var hasResults;

    if(html===undefined){
      if(isflickity){
        grid.flickity('destroy');
      }
      grid.html(NO_RESULTS);
    }else{
      if(isflickity){
        grid.flickity('remove', grid.flickity('getCellElements'));
        grid.flickity('append', $(html));
      }else{
        grid.html($(html));
        doFlickity();
      }
    }

  }

  function executeSearch(){
    imageProviders.forEach(function(service){
      var form =$("#"+ service.name + ".search-form");
      var apiSearchField = 'input[name=' + form.data("search-field") +']';
      var searchText = $(".search-input").val();
      var ctx = { provider:  service, search: searchText }; // create context binding for the ajax success handler

      Airbo.PubSub.publish("inititiating-image-search");

      form.find(apiSearchField).val(searchText);

      $.ajax({
        url: form.attr("action"),
        type: form.attr("method"),
        data: form.serialize(),
        dataType: "json"
      })
      .done(processResults.bind(ctx))
      .fail(function(){
      });
    });
  }

  function initTriggerImageSearch(){
    $(".show-search").click(function(event){
      executeSearch();
    });

    $(".search-input").keypress(function(event){
      var keycode = (event.keyCode ? event.keyCode : event.which) ;

      if(keycode == '13'){
        executeSearch();
      }
    });
  }

  function initSearchFocus(){
    $(".search-input").focusin(function(event){
      $(this).parents(".search").addClass("focused");
    });

    $(".search-input").focusout(function(event){
      $(this).parents(".search").removeClass("focused");
    });
  }

   function initPreviewSelectedImage(){
    $("body").on("click","#images img", function(event){
      var img = $(this);
      var props = { url: $(this).data("preview"), source: 'image-search'};
      Airbo.PubSub.publish("image-selected", props);
    });
  }

  function loadImageProviders(){
    imageProviderList = $(".search-input").data('services');

    imageProviders = imageProviderList.map(function(service){
      return ImageSearchService.getProvider(service);
    });
  }

  function init(){
    Airbo.TileVisualPreviewMgr.init();
    grid = $("#images");
    searchForm = $(searchFormSel);
    initTriggerImageSearch();
    initPreviewSelectedImage();
    loadImageProviders();
    initSearchFocus();
  }

  return {
    init: init
  };

}());
