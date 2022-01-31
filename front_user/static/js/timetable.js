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
function init( role ){

const loadClassName = 'loading';

/* -------------------------------------------------- *\
  タイムテーブル作成
\* -------------------------------------------------- */
// seminarsJSON は html_template 側で設定
const timeTable = new eventTimeTable( seminarsJSON, role ),
      $timeTable =  timeTable.init();
$('#main').html( $timeTable );

// 個別削除ボタン
$timeTable.find('.eventButton').on({
  'click': function( event ){
    event.stopPropagation();
    
    const $event = $( this ).closest('.event'),
          eventBlock = $event.attr('data-block'),
          eventTime = $event.attr('data-time');
    if ( confirm('削除します') ) {
      $event.remove();
    };
  }
});

// Adminメニュー
const $adminMenu = $('#adminMenu');
const registerModalData = {
  'type': 'input',
  'title': 'セミナー登録',
  'contents': [
    {'title': '講座名',           'name': 'seminar_name',      'type': 'select', 'option': ['mst_seminar', 'name']},
    {'title': '時間',             'name': 'seminar_id',        'type': 'select', 'option': 'mst_classes'},
    {'title': 'ブロック',          'name': 'block_name',       'type': 'select', 'option': 'mst_block'},
    {'title': '定員',              'name': 'capacity',         'type': 'sync',   'option': ['mst_seminar', 'capacity']},
    {'title': 'セミナー内容',       'name': 'seminar_overview', 'type': 'sync',   'option': ['mst_seminar', 'overview']},
    {'title': '登壇者',            'name': 'speaker_name',      'type': 'select', 'option': ['mst_speaker', 'name']},
    {'title': '登壇者プロフィール', 'name': 'speaker_profile',   'type': 'sync',   'option': ['mst_speaker', 'profile']},
  ],
  'commands': [
    {'close': '閉じる'},
    {'register': '登録する'},
  ]
};

$adminMenu.find('.adminMenuButton').on('click', function(){
  const $b = $( this ),
        type = $b.attr('data-type');
  switch( type ) {
    case 'register': {
      $b.add( $timeTable ).addClass( loadClassName );
  
      // リストの読み込み
      setTimeout( function(){
        $b.add( $timeTable ).removeClass( loadClassName );

        const newSeminarsData = {
          "mst_seminar": [
            { "name": "Java初級講習1Java初級講習1Java初級講習1Java初級講習1Java初級講習1Java初級講習1", "overview": "1長い\nマルチライン\nテキスト", "capacity": 201},
            { "name": "Java初級講習2", "overview": "2長い\nマルチライン\nテキスト", "capacity": 202},
            { "name": "Java初級講習3", "overview": "3長い\nマルチライン\nテキスト", "capacity": 203},
          ],
          "mst_block": ["A", "B", "C", "D", ],
          "mst_classes": ["9", "10", "11", "12", "13", "14", "15", "16", "17", ],
          "mst_speaker": [
            { "name": "サンプル太郎1", "profile": "1長い\nマルチライン\nテキスト"},
            { "name": "サンプル花子2", "profile": "2長い\nマルチライン\nテキスト"},
            { "name": "サンプル次郎3", "profile": "3長い\nマルチライン\nテキスト"},
          ],
        };
        const $modal = m.open( registerModalData, newSeminarsData, {
          'register': function(){
            // 登録処理
            const value = m.getValue();
            console.log(value);
            alert('登録しました。');
          }
        } );
      }, 300 );
    } break;
  }
});

/* -------------------------------------------------- *\
  イベント詳細
\* -------------------------------------------------- */
const eventModalData = {
  'type': 'view',
  'title': 'セミナー詳細',
  'contents': [
    {'title': '講座名','name': 'seminar_name'},
    {'title': '時間','name': 'seminar_id'},
    {'title': 'ブロック','name': 'block_name'},
    {'title': '定員','name': 'capacity'},
    {'title': 'セミナー内容','name': 'seminar_overview'},
    {'title': '登壇者','name': 'speaker_name'},
    {'title': '登壇者プロフィール','name': 'speaker_profile'},
  ],
  'commands': [
    {'close': '閉じる'},
    {'apply': '申し込む'},
  ]
};

const m = new modal();
$timeTable.find('.event').on('click', function(){
  const $event = $( this );
  $event.add( $timeTable ).addClass( loadClassName );
  
  // リストの読み込み
  setTimeout( function(){
    $event.add( $timeTable ).removeClass( loadClassName );
    
    const dummy = {
      "seminar_id": 11,
      "seminar_name": "Java 初級講習",
      "seminar_overview": "長い\nマルチライン\nテキスト\nセミナーの内容を記述する",
      "start_datetime": "2022-01-13T09:00:00.000Z",
      "block_id": 5,
      "block_name": "ブロックA",
      "capacity": 20,
      "speaker_id": 23,
      "speaker_name": "サンプル 太郎",
      "speaker_profile": "長い\nマルチライン\nテキスト\n登壇者のプロフィールを記述する",
    };
    const $modal = m.open( eventModalData, dummy, {
      'apply': function(){
        // 申し込む処理
        alert('申し込みました。');
      }
    } );
  }, 2000 );

});

} // init()

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
  タイムテーブル
\* -------------------------------------------------- */
function eventTimeTable( list, type ){
  const e = this;
  e.seminars = list.seminars;
  e.classes = list.mst_classes;
  e.block = list.mst_block;
  e.type = ( type )? type: 'common';
}
eventTimeTable.prototype = {
  'init': function(){
    const e = this;
    const $timeTable = $(''
    + '<article id="timetable" data-type="' + e.type + '">'
      + (( e.type === 'admin')? e.adminMenu(): '')
      + e.time()
      + e.section()
    + '</article');
    
    // :active
    $timeTable.find('.event').on('mousedown', function(){
      const $event = $( this );
      $event.addClass('active');
      $( window ).on('mouseup.event', function(){
        $( window ).off('mouseup.event');
        $event.removeClass('active');
      });
    });
    $timeTable.find('.eventButton').on({
      'mousedown': function( event ){
        event.stopPropagation();
      }
    });
    
    return $timeTable;
  },
  'adminMenu': function(){
    return '<nav id="adminMenu">'
    + '<ul class="adminMenuList">'
      + '<li class="adminMenuItem"><button class="adminMenuButton" data-type="register"><span>登録</span></button></li>'
    + '</ul>'
    + '</nav>';
  },
  'time': function(){
    return '<section id="time">' + this.timeBlockList() + '</section>';
  },
  'timeBlockList': function(){
    return '<ol class="timeBlockList">' + this.timeBlockItem() + '</ol>'
  },
  'timeBlockItem': function(){
    const e = this,
          l = [],
          length = e.classes.length;
    for ( let i = 0; i < length; i++ ) {
      l.push('<li class="timeBlockItem">' + e.classes[i] + ':00</li>')
    }
    return l.join('');
  },
  'section': function(){
    const e = this,
          l = [],
          length = e.block.length;
    for ( let i = 0; i < length; i++ ) {
      l.push(''
      + '<section id="' + e.block[i] + '" class="block">'
        + '<h2 class="blockTitle"><span>Block</span> ' + e.block[i] + '</h2>'
        + '<ol class="blockList">'
          + e.blockList( e.block[i] )
        + '</ol>'
      + '</section>');
    }
    return l.join('');
  },
  'blockList': function( block ){
    const e = this,
          l = [],
          length = e.classes.length;
    for ( let i = 0; i < length; i++ ) {
      l.push('<li class="blockItem">' + e.event( block, e.classes[i] ) + '</li>');
    }
    return l.join('');
  },
  'event': function( block, time ){
    const e = this;
    if ( e.seminars[block] && e.seminars[block][time] ) {
      const eventTime =  time + ':00 ～ ' + (Number(time)+1),
            eventTitle = ( e.seminars[block][time][0] )? e.seminars[block][time][0]: '',
            eventAuthor = ( e.seminars[block][time][1] )? e.seminars[block][time][1]: '',
            eventStatus = ( e.seminars[block][time][2] && e.type !== 'admin')? e.seminars[block][time][2]: 0;
      return ''
      + '<dl class="event" data-status="' + eventStatus + '" data-block="' + block + '" data-time="' + time + '">'
        + '<dt class="eventTime">' + eventTime + ':00</dt>'
        + (( e.type === 'admin')? '<dd class="eventDelete"><button class="eventButton" data-type="delete"></button></dd>': '')
        + '<dd class="eventTitle">' + textEntities( eventTitle ) + '</dd>'
        + '<dd class="eventAuthor">' + textEntities( eventAuthor ) + '</dd>'
      + '</dl>';
    } else {
      return '';
    }
  }
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
      
      if ( functions[type] ) {
         functions[type]();
      }
      $modal.remove();
      m.$body.removeClass('modalOpen');
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

$(function(){ init(); });
