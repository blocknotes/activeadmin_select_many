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
  parent.find( '.selected span' ).text( ' [' + cnt + ']' );
}

$(document).ready( function() {
  $('.select_many.input select').on( 'dblclick', function( event ) {
    $.proxy( smActivate, $(this) )( event.target );
  });

  // --- select_many ----------------------------------------------------------
  var onLocalSelect = smDebounce( function() {
    var cnt = 0, search = $(this).val().toLowerCase();
    $(this).closest( '.select_many' ).find( '[data-select="src"] option' ).each( function() {
      var found = $(this).text().toLowerCase().indexOf( search ) >= 0;
      $(this).toggle( found );
      if( found ) cnt++;
    });
    $(this).parent().find( '.available span' ).text( ' [' + cnt + ']' );
  }, 250 );

  var onRemoteSelect = smDebounce( function( event ) {
    var search = $(this).val().trim();
    if( $(this).data( 'searching' ) != '1' && search && $(this).data( 'last-search' ) != search ) {
      $(this).data( 'searching', '1' );
      $(this).data( 'last-search', search );
      var _this = $(this);
      var data = {}
      var text_key = $(this).data('text');
      var value_key = $(this).data('value');
      var counter_limit = $(this).data('counter-limit') ? Number( $(this).data('counter-limit') ) : 0;
      data['q['+$(this).data('search')+']'] = search;
      $.ajax({
        context: _this,
        data: data,
        url: $(this).data( 'remote-collection' ),
        complete: function( req, status ) {
          $(this).data( 'searching', '' );
        },
        success: function( data, status, req ) {
          var select = $(this).closest( '.select_many' ).find( '[data-select="src"]' );
          select.empty();
          data.forEach( function( item ) {
            select.append( $('<option>', { value: item[value_key], text: item[text_key] }) );
          });
          $(this).parent().find( '.available span' ).text( ' [' + ( ( counter_limit > 0 && data.length >= counter_limit ) ? ( counter_limit + '+' ) : data.length ) + ']' );
        },
      });
    }
  }, 400 );

  $('.select_many.input .search-select').each( function() {
    var parent = $(this).parent();
    parent.find( '.available' ).append( '<span> [' + parent.find( '[data-select="src"] option' ).length + ']</span>' );
    parent.find( '.selected' ).append( '<span> [' + parent.find( '[data-select="dst"] option' ).length + ']</span>' );
    $(this).on( 'keydown', function( event ) {
      if( event.which == 13 || event.which == 40 ) {  // enter or arrow down
        event.preventDefault();
        $(this).closest( '.select_many' ).find( '[data-select="src"]' ).focus();
      }
      else $.proxy( $(this).data( 'remote-collection' ) ? onRemoteSelect : onLocalSelect, $(this) )( event );
    });

    // --- key bindings -------------------------------------------------------
    parent.find( '[data-select="src"]' ).on( 'keydown', function( event ) {
      if( event.which == 13 ) {  // enter
        event.preventDefault();
        var opts = $(this).find( ':selected' );
        if( opts.length > 0 ) {
          var next = $( opts[0] ).next();
          $.proxy( smActivate, $(this) )( opts[0] );
          if( next.length > 0 ) $(this).val( next.val() );
        }
      }
      else if( event.which == 9 || event.which == 39 ) {  // tab or right arrow
        event.preventDefault();
        parent.find( '[data-select="dst"]' ).focus();
      }
      else if( event.which == 38 ) {  // up arrow
        if( $(this).find('option')[0] == $(this).find(':selected')[0] ) {
          event.preventDefault();
          parent.find( '.search-select' ).focus();
        }
      }
    });
    parent.find( '[data-select="dst"]' ).on( 'keydown', function( event ) {
      if( event.which == 13 ) {  // enter
        event.preventDefault();
        var opts = $(this).find( ':selected' );
        if( opts.length > 0 ) {
          var next = $( opts[0] ).next();
          $.proxy( smActivate, $(this) )( opts[0] );
          if( next.length > 0 ) $(this).val( next.val() );
        }
      }
      else if( event.which == 37 ) {  // left arrow
        event.preventDefault();
        parent.find( '[data-select="src"]' ).focus();
      }
    });
  });

  // --- buttons --------------------------------------------------------------
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

  // --- select one -----------------------------------------------------------
  var onRemoteSelectOne = smDebounce( function( event ) {
    var search = $(this).val().trim();
    var select = $(this).next();
    if( select.data( 'searching' ) != '1' && search && select.data( 'last-search' ) != search ) {
      select.data( 'searching', '1' );
      select.data( 'last-search', search );
      var data = {}
      var search_key = $(this).data('search') ? $(this).data('search') : 'name_contains';
      var value_key = $(this).data('value') ? $(this).data('value') : 'id';
      var text_key = $(this).data('text') ? $(this).data('text') : 'name';
      var counter_limit = $(this).data('counter-limit') ? Number( $(this).data('counter-limit') ) : 0;
      data['q['+search_key+']'] = search;
      $.ajax({
        context: select,
        data: data,
        url: $(this).data( 'remote-collection' ),
        complete: function( req, status ) {
          $(this).data( 'searching', '' );
        },
        success: function( data, status, req ) {
          var first = false, sel = $(this);
          sel.empty();
          if( sel.data('include-blank') ) sel.append( $('<option>', { value: '', text: '' }) );
          data.forEach( function( item ) {
            sel.append( $('<option>', { value: item[value_key], text: item[text_key] }) );
            if( !first ) first = item[value_key];
          });
          sel.parent().find( '.status' ).text( '[' + ( ( counter_limit > 0 && data.length >= counter_limit ) ? ( counter_limit + '+' ) : data.length ) + ']' );
          if( first ) sel.val( first );
        },
      });
    }
  }, 500 );

  $('.select-one-inputs').each( function() {
    $(this).find( '.search-select' ).on( 'keydown', function( event ) {
      if( event.which == 38 ) {  // up arrow
        event.preventDefault();
        var select = $(this).closest( '.select-one-inputs' ).find( '[data-select="src"]' );
        var prev = select.find( ':selected' ).prev();
        if( prev.length ) select.val( prev.val() );
      }
      else if( event.which == 40 ) {  // down arrow
        event.preventDefault();
        var select = $(this).closest( '.select-one-inputs' ).find( '[data-select="src"]' );
        var next = select.find( ':selected' ).next();
        if( next.length ) select.val( next.val() );
      }
      else $.proxy( onRemoteSelectOne, $(this) )( event );
    });
    $(this).find( '[data-select="src"]' ).on( 'keydown', function( event ) {
      if( event.which == 37 ) {  // left arrow
        event.preventDefault();
        $(this).closest( '.select-one-inputs' ).find( '.search-select' ).focus();
      }
    });
  });
});
