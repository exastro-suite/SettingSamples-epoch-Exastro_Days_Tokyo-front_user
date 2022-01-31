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
