function smActivate( target ) {
  if( target.tagName.toLowerCase() == 'option' ) {
    var parent = $(this).closest( '.select_many' );
    var opt = $(target);
    var dst = parent.find( $(this).data( 'select' ) == 'src' ? '[data-select="dst"]' : '[data-select="src"]' );
    dst.append( $('<option>', { value: opt.val(), text: opt.text() }) );
    opt.remove();
    smUpdateValues( parent );
  }
}

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
  var cnt = 0, values = parent.find( '.values' );
  values.empty();
  parent.find( '[data-select="dst"] option' ).each( function() {
    values.append( $('<input>', { type: 'hidden', name: values.data( 'name' ), value: $(this).val() }) );
    cnt++;
  });
  if( cnt == 0 ) values.append( $('<input>', { type: 'hidden', name: values.data( 'name' ) }) );
}

$(document).ready( function() {
  $('.select_many.input select').on( 'dblclick', function( event ) {
    $.proxy( smActivate, $(this) )( event.target );
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
        url: $(this).data( 'remote-collection' ),
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
    $(this).on( 'keyup', $(this).data( 'remote-collection' ) ? onRemoteSelect : onLocalSelect );
  });
  $('.select_many .add').on( 'click', function() {
    var select = $(this).parent().prev();
    var current = select.find( 'option:selected' )[0];
    if( current ) $.proxy( smActivate, select )( current );
  });
  $('.select_many .remove').on( 'click', function() {
    var select = $(this).parent().next();
    var current = select.find( 'option:selected' )[0];
    if( current ) $.proxy( smActivate, select )( current );
  });
  $('.select_many [sortable] .move_up').on( 'click', function() {
    var select = $(this).parent().next();
    var current = select.find( 'option:selected' )[0];
    if( current ) {
      $(current).prev().before( current );
      smUpdateValues( $(this).closest( '.select_many' ) );
    }
  });
  $('.select_many [sortable] .move_down').on( 'click', function() {
    var select = $(this).parent().next();
    var current = select.find( 'option:selected' )[0];
    if( current ) {
      $(current).next().after( current );
      smUpdateValues( $(this).closest( '.select_many' ) );
    }
  });

  var onRemoteSelectOne = smDebounce( function( event ) {
    var select = $(this).next();
    if( select.data( 'searching' ) != '1' ) {
      select.data( 'searching', '1' );
      var data = {}
      var search_key = $(this).data('search') ? $(this).data('search') : 'name_contains';
      var value_key = $(this).data('value') ? $(this).data('value') : 'id';
      var text_key = $(this).data('text') ? $(this).data('text') : 'name';
      var counter_limit = $(this).data('counter-limit') ? Number( $(this).data('counter-limit') ) : 0;
      data['q['+search_key+']'] = $(this).val();
      $.ajax({
        context: select,
        data: data,
        url: $(this).data( 'remote-collection' ),
        complete: function( req, status ) {
          $(this).data( 'searching', '' );
        },
        success: function( data, status, req ) {
          var sel = $(this);
          sel.empty();
          data.forEach( function( item ) {
            sel.append( $('<option>', { value: item[value_key], text: item[text_key] }) );
          });
          sel.parent().find( '.status' ).text( '[' + data.length + ( counter_limit > 0 && data.length >= counter_limit ? '+' : '' ) + ']' );
        },
      });
    }
  }, 500 );
  $('.select-one-inputs > .search-select').on( 'keyup', onRemoteSelectOne );
});
