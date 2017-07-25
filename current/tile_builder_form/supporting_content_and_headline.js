
Airbo.TileSuportingContentTextManager = (function(){

  var contentEditor
    , contentInput
    , contentEditorSelector = '#supporting_content_editor'
    , contentInputSelector = '#tile_supporting_content'
  ;

  function contentEditorMaxlength() {
    return contentEditor.next().attr('maxlength');
  };

  function updateContentInput() {
    contentInput.val(contentEditor.html());
  }

  function initializeEditor() {
    var pasteNoFormattingIE;
    addCharacterCounterFor('#tile_headline');
    addCharacterCounterFor(contentEditorSelector);
  };

  function initjQueryObjects(){
    contentEditor = $(contentEditorSelector);
    contentInput = $(contentInputSelector);
  }

  function initHeadline(){
    autosize($('#tile_headline'));
  }


  function init(){

    if (Airbo.Utils.supportsFeatureByPresenceOfSelector(contentEditorSelector) ) {
      initjQueryObjects();
      initializeEditor();
      initHeadline();
      return this;
    }
  }

  return {
    init: init
  }


}());
