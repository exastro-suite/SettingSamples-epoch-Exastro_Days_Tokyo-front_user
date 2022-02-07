/*
#   Copyright 2021 NEC Corporation
#
#   Licensed under the Apache License, Version 2.0 (the "License");
#   you may not use this file except in compliance with the License.
#   You may obtain a copy of the License at
#
#       http://www.apache.org/licenses/LICENSE-2.0
#
#   Unless required by applicable law or agreed to in writing, software
#   distributed under the License is distributed on an "AS IS" BASIS,
#   WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
#   See the License for the specific language governing permissions and
#   limitations under the License.
*/
// JavaScript Document
;

$(function(){

/* -------------------------------------------------- *\
  ヘッダー
\* -------------------------------------------------- */
const $header = $('#header');
$header.find('.userInfo').on('click', function(){
  const $window = $( window );
  $header.find('.userMenu').toggleClass('open');
  $window.on('mousedown.userMenu', function(e){
    if ( !$( e.target ).closest('.userMenu, .userInfo').length ) {
      $header.find('.userMenu').removeClass('open');
      $window.off('mousedown.userMenu');
    }
  });
});

$header.find('.userMenuButton').on('click', function(){
  const $b = $( this ),
        type = $b.attr('data-type');
  switch( type ) {
    case 'logout':

      $.ajax({
        type: 'GET',
        url: '/logout',
      })
      .done(function(xhr) {
        console.log('logout');
        window.location.reload();
      });
    break;
  }
});

});


function textEntities( text ) {
  const entities = [
    ['&', 'amp;'],
    ['\"', 'quot;'],
    ['\'', 'apos;'],
    ['<', 'lt;'],
    ['>', 'gt;'],
    ['\n', '<br>']
  ];
  if ( text !== undefined && text !== null && typeof text === 'string') {
    for ( var i = 0; i < entities.length; i++ ) {
      text = text.replace( new RegExp( entities[i][0], 'g'), '&' + entities[i][1] );
    }
  }
  return text;
}

/* -------------------------------------------------- *\
  モーダル
\* -------------------------------------------------- */
function modal(){
  const m = this;
  m.$body = $('body');
  m.$body.append('<div id="modalContainer" />');
  m.$container = $('#modalContainer');
}

modal.prototype = {
  'open': function( structure, data, functions ){
    const m = this;
    m.structure = structure;
    m.data = data;
    m.functions = functions;
    
    m.$body.addClass('modalOpen');
    
    const $modal = $( m.main() );
    m.$modal = $modal;
    m.$container.append( $modal );
    
    // select
    $modal.find('.modalInputSelect').on('change', function(){
      const $select = $( this ),
            key1 = $select.attr('data-key');
      if ( key1 ) {
        const value = $select.val(),
              $target = $modal.find('.modalInputSync[data-key1="' + key1 + '"]');
        if ( $target.length ) {
          $target.each(function(){
            const $sync = $( this ),
                  key2 = $sync.attr('data-key2');
            $sync.html( textEntities( m.data[key1][value][key2] ));
          });       
        }
      }
    });
    
    // コマンド
    $modal.find('.modalCloseButton, .modalMenuButton').on('click', function(){
      const $button = $( this ),
            type = $button.attr('data-type');

      var closing = true;
      if ( functions[type] ) {
        closing = functions[type](m);
      }

      if (closing) {
        $modal.remove();
        m.$body.removeClass('modalOpen');
      }
    });
    
    return $modal;  
  },
  'main': function(){
    const m = this;
    return ''
    + '<div class="modal">'
      + m.header()
      + m.body()
      + m.footer()
    + '</div>';
  },
  'header': function(){
    const m = this,
          title = ( m.structure.title )? m.structure.title: '';
    return ''
    + '<div class="modalHeader">'
      + '<div class="modalTitle">' + title + '</div>'
      + '<div class="modalClose"><button class="modalCloseButton" data-type="close"></button></div>'
    + '</div>';
  },
  'footer': function(){
    return ''
    + '<div class="modalFooter">'
      + '<ul class="modalMenuList">'
        + this.commands()
      + '</ul>'
    + '</div>';
  },
  'commands': function(){
    const m = this,
          l = [],
          length = m.structure.commands.length;
    for ( let i = 0; i < length; i++ ) {
      const key = Object.keys(m.structure.commands[i])[0];
      l.push('<li class="modalMenuItem"><button class="modalMenuButton" data-type="' + key + '">' + m.structure.commands[i][key] + '</button></li>');
    }
    return l.join('');
  },
  'body': function(){
    return ''
    + '<div class="modalBody">'
      + '<table class="modalContents">'
        + '<tbody class="modalContentsBody">'
          + this.contents()
        + '<tbody>'
      + '</table>'
    + '</div>';
  },
  'contents': function(){
    const m = this,
          l = [],
          length = m.structure.contents.length;
    for ( let i = 0; i < length; i++ ) {
      const title = textEntities( m.structure.contents[i].title );
      l.push(''
      + '<tr class="mcTR">'
        + '<th class="mcTH">' + title + '</th>'
        + '<td class="mcTD">' + m.td(i) + '</td>'
      + '</tr>'
      );
    }
    return l.join('');
  },
  'td': function( num ){
    const m = this,
          v = m.structure.contents[num];
    if ( m.structure.type === 'input') {
      const l = [];
      switch( v.type  ) {
        case 'select':
          if ( typeof v.option === 'string') {
            const options = m.data[ v.option ],
                  optionLength = options.length;
            for ( let i = 0; i < optionLength; i++ ) {
              l.push('<option value="' + i + '">' + options[i] + '</option>');
            }
            return '<select class="modalInputSelect" name="' + v.name + '">' + l.join('') + '</select>';
          } else {
            const key = v.option[1],
                  options = m.data[ v.option[0] ],
                  optionLength = options.length;
            for ( let i = 0; i < optionLength; i++ ) {
              l.push('<option value="' + i + '">' + options[i][key] + '</option>');
            }
            return '<select class="modalInputSelect" name="' + v.name + '" data-key="' + v.option[0] + '">' + l.join('') + '</select>';
          } 
        case 'sync':
          const key1 = v.option[0],
                key2 = v.option[1],
                initValue = textEntities( m.data[key1][0][key2] );
          return '<span class="modalInputSync" data-name="' + v.name + '" data-key1="' + key1 + '" data-key2="' + key2 + '">' + initValue + '</span>';
      }
    } else {
      const text = textEntities( m.data[ v.name ] );
      return text;
    }
  },
  'getValue': function(){
    const m = this,
          l = [];
    m.$modal.find('.modalInputSelect').each(function(){
      const $select = $( this ),
            name = $select.attr('name'),
            val = $select.find('option:selected').text(),
            set = {};
      set[name] = val;
      l.push( set );
    });
    return l;
  }
};
