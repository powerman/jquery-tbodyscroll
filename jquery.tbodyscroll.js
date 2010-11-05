/**
 * tbodyScroll jQuery plugin
 * 
 * @version 0.2.0
 * @author Alex Efros <powerman-asdf@yandex.ru>, http://powerman.name/, 2010
 * @license Public Domain
 * 
 * Add vertical scrollbar to <tbody> element and keep <thead> and <tfoot>
 * contents above/below table while scrolling body.
 * 
 * Tested on:
 * - Opera 10.63/Linux
 * - Opera 10.63/Windows
 * - Firefox 3.6.12/Linux
 * - Firefox 3.6.12/Windows
 * - Safari 5.0.2/Mac
 * - Chromium 7.0.517.41/Linux
 * - IE 8/Windows
 * 
 * Usage:
 * 
 * $('table').tbodyScroll({
 *      thead_height:   '30px',
 *      tbody_height:   '80px',
 *      tfoot_height:   '20px',
 *      head_bgcolor:   'transparent',
 *      foot_bgcolor:   'transparent'
 * });
 * 
 * 
 * Required user CSS:
 * 
 * 1. User must define SAME width for <th> and <td> in each column,
 *    because <thead> and <tfoot> will be "disconnected" from <tbody> and
 *    won't keep same width automatically anymore.
 * 2. Some changes in user CSS may be needed because <table> will be
 *    wrapped by <div style="float:left">.
 * 
 * 
 * Required user markup (either <thead> or <tfoot> is optional):
 * 
 *  <style>
 *      th.some,  td.some  { width: ...; }
 *      th.other, td.other { width: ...; }
 *      ...
 *  </style>
 *  <table>
 *  <thead>
 *      <tr><th class="some">...</th>
 *          <th class="other">...</th>
 *          ...
 *      </tr>
 *  </thead>
 *  <tbody>
 *      <tr><td class="some">...</td>
 *          <td class="other">...</td>
 *          ...
 *      </tr>
 *      ...
 *  </tbody>
 *  <tfoot>
 *      <tr><th class="some">...</th>
 *          <th class="other">...</th>
 *          ...
 *      </tr>
 *  </tfoot>
 *  </table>
 * 
 * 
 * Generated markup:
 * 
 *  <div class="tbodyScroll-outer">
 *      <div class="tbodyScroll-head-bg"></div>
 *      <div class="tbodyScroll-foot-bg"></div>
 *      <div class="tbodyScroll-inner">
 *          {table}
 *      </div>
 *  </div>
 */

/**
 * Add vertical scrollbar to <tbody>.
 * 
 * @param {Object}  options
 * @param {String}  [options.thead_height]  Height for <thead>, will be forced on 'thead th'
 * @param {String}  options.tbody_height    Height for <tbody>
 * @param {String}  [options.tfoot_height]  Height for <tfoot>, will be forced on 'tfoot th'
 * @param {String}  [options.head_bgcolor]  Header background-color (include scrollbar width)
 * @param {String}  [options.foot_bgcolor]  Footer background-color (include scrollbar width)
 * 
 * @returns {Object} jQuery object representing the element
 */
(function($) {
    $.fn.tbodyScroll = function( options ) {

        return this.each(function() {

            var $this   = $(this),
                inner   = $this.wrap('<div class="tbodyScroll-inner">').parent(),
                outer   = inner.wrap('<div class="tbodyScroll-outer">').parent(),
                thead_th= $this.find('thead th'),
                tfoot_th= $this.find('tfoot th');

            var settings = {
                thead_height: 0,
                tfoot_height: 0,
                head_bgcolor: thead_th.css('background-color'),
                foot_bgcolor: tfoot_th.css('background-color')
            };
            if( options )
                $.extend( settings, options );

            outer.prepend('<div class="tbodyScroll-head-bg">');
            outer.prepend('<div class="tbodyScroll-foot-bg">');

            thead_th.height( settings.thead_height );
            tfoot_th.height( settings.tfoot_height );
            thead_th.css({ 'padding-top': 0, 'padding-bottom': 0 });
            tfoot_th.css({ 'padding-top': 0, 'padding-bottom': 0 });
            if ($.browser.msie) // http://bugs.jquery.com/ticket/7417
                var horiz_spc = $this.find('thead')[0].currentStyle.borderSpacing.split(' ')[0];
            else
                var horiz_spc = $this.find('thead').css('border-spacing').split(' ')[0];
            $this.find('thead').css({ 'border-spacing': horiz_spc+' 0px' });
            $this.find('tfoot').css({ 'border-spacing': horiz_spc+' 0px' });

            outer.css({
                'position':         'relative',
                'float':            'left',
                'padding-top':      settings.thead_height,
                'padding-bottom':   settings.tfoot_height,
                'padding-left':     0,
                'padding-right':    0
            });
            inner.css({
                'overflow-y':       'scroll',
                'overflow-x':       'hidden',
                'height':           settings.tbody_height
            });
            $this.find('thead').css({
                'position':         'absolute',
                'top':              0,
                'left':             0
            });
            $this.find('tfoot').css({
                'position':         'absolute',
                'bottom':           0,
                'left':             0
            });
            outer.find('.tbodyScroll-head-bg').css({
                'position':         'absolute',
                'top':              0,
                'left':             0,
                'right':            0,
                'height':           settings.thead_height,
                'background-color': settings.head_bgcolor
            });
            outer.find('.tbodyScroll-foot-bg').css({
                'position':         'absolute',
                'bottom':           0,
                'left':             0,
                'right':            0,
                'height':           settings.tfoot_height,
                'background-color': settings.foot_bgcolor
            });
            
            if ($.browser.webkit) // https://bugs.webkit.org/show_bug.cgi?id=48975
                setTimeout(function(){$("<style></style>").appendTo("head").remove();}, 0);
            if ($.browser.msie) // IE add scrollbar inside block [IE8]
                inner.css({ 'padding-right': 16 });

        });

    };
})( jQuery );
