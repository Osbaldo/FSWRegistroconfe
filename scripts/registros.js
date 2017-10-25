$("#IframeId").load(function() {
    $(this).height( $(this).contents().find("body").height() );
});