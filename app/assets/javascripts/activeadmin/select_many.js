function debounce( func, wait, immediate ) {
  var timeout;
  return function() {
    var context = this, args = arguments;
    var later = function() {
      timeout = null;
      if (!immediate) func.apply(context, args);
    };
    var callNow = immediate && !timeout;
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
    if (callNow) func.apply(context, args);
  };
};

$(document).ready( function() {
  $('.select_many.input select').on( 'dblclick', function( event ) {
    if( event.target.tagName.toLowerCase() == 'option' ) {
      var parent = $(this).closest( '.select_many' );
      var opt = $(event.target);
      var dst = parent.find( $(this).data( 'select' ) == 'src' ? '[data-select="dst"]' : '[data-select="src"]' );
      dst.append( $('<option>', { value: opt.val(), text: opt.text() }) );
      opt.remove();
      // Update values list
      var values = parent.find( '.values' );
      values.empty();
      parent.find( '[data-select="dst"] option' ).each( function() {
        values.append( $('<input>', { type: 'hidden', name: values.data( 'name' ), value: $(this).val() }) );
      });
    }
  });

  var onLocalSelect = debounce( function() {
    var search = $(this).val().toLowerCase();
    $(this).closest( '.select_many' ).find( '[data-select="src"] option' ).each( function() {
      $(this).toggle( $(this).text().toLowerCase().indexOf( search ) >= 0 );
    });
  }, 250 );
  var onRemoteSelect = debounce( function() {
    var search = $(this).val().trim();
    if( search != '' && $(this).data( 'searching' ) != '1' ) {
      $(this).data( 'searching', '1' );
      var _this = $(this);
      var data = {}
      var text_key = $(this).data('text');
      var value_key = $(this).data('value');
      data['q['+$(this).data('search')+']'] = search;
      $.ajax({
        context: _this,
        data: data,
        url: $(this).data( 'remote' ),
        complete: function( req, status ) {
          $(this).data( 'searching', '' );
        },
        success: function( data, status, req ) {
          // TODO: limit... 100 ?
          var select = $(this).closest( '.select_many' ).find( '[data-select="src"]' );
          select.empty();
          data.forEach( function( item ) {
            select.append( $('<option>', { value: item[value_key], text: item[text_key] }) );
          });
        },
      });
    }
  }, 400 );

  // $('.select_many.input .search-select').on( 'keyup', onKeyup );

  $('.select_many.input .search-select').each( function() {
    $(this).on( 'keyup', $(this).data( 'remote' ) ? onRemoteSelect : onLocalSelect );
  });
});
