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

            return true; // if true, modal close
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
    {'cancel': '申し込み解除'},
    {'over': '申し込み解除'},
  ]
};

const m = new modal();
$timeTable.find('.event').on('click', function(){
  const $event = $( this );
  $event.add( $timeTable ).addClass( loadClassName );

  let seminar_id = $event.attr('data-seminar-id');

  $.ajax({
    type: 'GET',
    url: '/seminar/' + seminar_id,
  })
  .done(function(xhr) {
    $event.add( $timeTable ).removeClass( loadClassName );

    let dispData = xhr.result;

    if (dispData['participated']) {
      eventModalData['commands'].pop('apply');
    } else {
      eventModalData['commands'].pop('cancel');
    }
    if (dispData['capacityOver']) {
      eventModalData['commands'].pop('apply');
    } 

    const $modal = m.open( eventModalData, dispData, {
      'apply': function(caller){
        seminar_id = caller.data['seminar_id'];
        $.ajax({
          type: 'POST',
          url: '/signup_seminar',
          contentType: 'application/json',
          data: JSON.stringify({'seminar_id': seminar_id}),
          async: false
        })
        .done(function(xhr) {
          window.location.reload();
          return true; // if true, modal close
        })
        .fail(function(xhr) {

          return false; // if true, modal close
        });
      },
      'cancel': function(caller){
        seminar_id = caller.data['seminar_id'];
        $.ajax({
          type: 'POST',
          url: '/cancel_seminar',
          contentType: 'application/json',
          data: JSON.stringify({'seminar_id': seminar_id}),
          async: false
        })
        .done((data, textStatus, jqXHR) => {
          window.location.reload();
          return true; // if true, modal close
        })
        .fail((jqXHR, textStatus, errorThrown) => {

          return false; // if true, modal close
        });
      },
      'over': function(caller){
        // 何もしない
        // ボタンdisabledにしたい
        return false; // if true, modal close
      }
    } );
  });

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
      const eventTime =  time + ':00 ～ ' + (Number(time)+1) + ':00',
            eventTitle = ( e.seminars[block][time][0] )? e.seminars[block][time][0]: '',
            eventAuthor = ( e.seminars[block][time][1] )? e.seminars[block][time][1]: '',
            seminarId = ( e.seminars[block][time][3] )? e.seminars[block][time][3]: '',
            eventStatus = ( e.seminars[block][time][2] && e.type !== 'admin')? e.seminars[block][time][2]: 0;
      return ''
      + '<dl class="event" data-seminar-id="' + seminarId + '" data-status="' + eventStatus + '" data-block="' + block + '" data-time="' + time + '">'
        + '<dt class="eventTime">' + eventTime + '</dt>'
        + (( e.type === 'admin')? '<dd class="eventDelete"><button class="eventButton" data-type="delete"></button></dd>': '')
        + '<dd class="eventTitle">' + textEntities( eventTitle ) + '</dd>'
        + '<dd class="eventAuthor">' + textEntities( eventAuthor ) + '</dd>'
      + '</dl>';
    } else {
      return '';
    }
  }
}
