function smDebounce( func, wait, immediate ) {
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

function smUpdateValues( parent ) {
  var values = parent.find( '.values' );
  values.empty();
  parent.find( '[data-select="dst"] option' ).each( function() {
    values.append( $('<input>', { type: 'hidden', name: values.data( 'name' ), value: $(this).val() }) );
  });
}

$(document).ready( function() {
  $('.select_many.input select').on( 'dblclick', function( event ) {
    if( event.target.tagName.toLowerCase() == 'option' ) {
      var parent = $(this).closest( '.select_many' );
      var opt = $(event.target);
      var dst = parent.find( $(this).data( 'select' ) == 'src' ? '[data-select="dst"]' : '[data-select="src"]' );
      dst.append( $('<option>', { value: opt.val(), text: opt.text() }) );
      opt.remove();
      smUpdateValues( parent );
    }
  });

  var onLocalSelect = smDebounce( function() {
    var search = $(this).val().toLowerCase();
    $(this).closest( '.select_many' ).find( '[data-select="src"] option' ).each( function() {
      $(this).toggle( $(this).text().toLowerCase().indexOf( search ) >= 0 );
    });
  }, 250 );
  var onRemoteSelect = smDebounce( function() {
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

  $('.select_many.input .search-select').each( function() {
    $(this).on( 'keyup', $(this).data( 'remote' ) ? onRemoteSelect : onLocalSelect );
  });
  $('.select_many.sortable .move_up').on( 'click', function() {
    var select = $(this).parent().next();
    var current = select.find( 'option:selected' )[0];
    if( current ) {
      $(current).prev().before( current );
      smUpdateValues( $(this).closest( '.select_many' ) );
    }
  });
  $('.select_many.sortable .move_down').on( 'click', function() {
    var select = $(this).parent().next();
    var current = select.find( 'option:selected' )[0];
    if( current ) {
      $(current).next().after( current );
      smUpdateValues( $(this).closest( '.select_many' ) );
    }
  });

  // // WORK IN PROGRESS
  // var onRemoteSelectOne = smDebounce( function( event ) {
  //   if( $(this).data( 'searching' ) != '1' ) {
  //     $(this).data( 'searching', '1' );
  //     var _this = $(this);
  //     var data = {}
  //     var search_key = $(this).data('search') ? $(this).data('search') : 'name_contains';
  //     var value_key = $(this).data('value') ? $(this).data('value') : 'id';
  //     var text_key = $(this).data('text') ? $(this).data('text') : 'name';
  //     data['q['+search_key+']'] = event.key;
  //     $.ajax({
  //       context: _this,
  //       data: data,
  //       url: $(this).data( 'remote' ),
  //       complete: function( req, status ) {
  //         $(this).data( 'searching', '' );
  //       },
  //       success: function( data, status, req ) {
  //         var select = $(this);
  //         select.empty();
  //         data.forEach( function( item ) {
  //           select.append( $('<option>', { value: item[value_key], text: item[text_key] }) );
  //         });
  //       },
  //     });
  //   }
  // }, 400 );
  // $('.select_one.input select').on( 'keyup', onRemoteSelectOne );
});
