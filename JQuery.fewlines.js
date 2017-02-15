
/* Jquery Ellipsis funtion*/
(function ($) {
    'use strict';

    var namespace = 'fewlines',
        span = '<span style="white-space: nowrap;">',
        defaults = {
            lines: '2',
            responsive: false,
            closeMark: 'close',
            openMark: '...',
            newLine: false,
            showOnMouseOver: false,
            noAction: false
        };

    /**
     * Ellipsis()
     * --------------------------------------------------------------------------
     * @param {Node} el
     * @param {Object} opts
     */
    function Ellipsis(el, opts) {
        var base = this,
            currLine = 0,
            lines = [],
            setStartEllipAt,
            startEllipAt,
            currOffset,
            contHeight,
            words,
            hidLines,
            visLines;

        base.$cont = $(el);
        base.opts = $.extend({}, defaults, opts);

        /**
         * create() happens once when
         * instance is created
         */
        function create() {
            // remove <a> tag from content if added at first time.
            base.$cont.find("a").remove();
            base.text = base.$cont.text();

            // base.opts.ellipLineClass = base.opts.ellipClass + '-line';
            //base.$el = $('<span class="' + base.opts.ellipClass + '" />');
            base.$el = $('<span/>').css(base.$cont.css(['font-size', 'font-weight', 'font-family']));
            base.$el.text(base.text);
            base.$cont.empty().append(base.$el);

            init();
        }

        /**
         * init()
         */
        function init() {

            // if they only want one line just add
            // the class and do nothing else
            // constHeight will be 0 if element is hidden.  
            contHeight = base.$cont.height();

            // if they only want to ellipsis the overflow
            // then do nothing if there is no overflow      
            if (base.opts.lines < 1 && base.$el.prop('scrollHeight') <= contHeight) {
                return;
            }

            if (!setStartEllipAt) {
                return;
            }

            // create an array of words from our string
            words = $.trim(base.text).split(/\s+/);

            // set font style to span tag to get exact line to append ellipsis.
            span = '<span style="' + $(span).css(base.$cont.css(['font-size', 'font-weight'])).attr('style') + '">';

            // wrap each word in a span and temporarily append to the DOM
            base.$el.html(span + words.join('</span> ' + span) + '</span>');

            // loop through words to determine which word the
            // ellipsis container should start from (need to
            // re-query spans from DOM so we can get their offset)
            base.$el.find('span').each(setStartEllipAt);

            // startEllipAt could be 0 so make sure we're
            // checking undefined instead of falsey
            if (startEllipAt != null) {
                updateText(startEllipAt);
            }
        }

        /**
         * updateText() updates the text in the DOM
         * with a span around the line that needs
         * to be truncated
         *
         * @param {Number} i
         */
        function updateText(nth) {
            // add a span that wraps from nth
            // word to the end of the string
            visLines = words.slice(0, nth).join(' ');
            hidLines = ' ' + words.slice(nth).join(' ');

            base.$hidePart = $('<span>').hide().text(hidLines);
            base.$openMark = $("<span>" + base.opts.openMark + "</span>");

            // enable/disable content display on move over on ellipsis.

            if (!base.opts.noAction) {

                if (base.opts.showOnMouseOver) {

                    base.$openMark = $("<a href='#'>" + base.opts.openMark + "</a>");

                    // add mouseover event to ellipsis
                    base.$openMark.bind('mouseover', function (event) {
                        event.preventDefault();
                        return show();
                    });

                    // add mouseleave event to parent element. It hides the overflowed text.
                    base.$cont.bind("mouseleave", function () {
                        return close();
                    });
                } else {


                    base.$openMark = $("<a href='#'>" + base.opts.openMark + "</a>");

                    // add mouseover event to ellipsis
                    base.$openMark.bind('click', function (event) {
                        event.preventDefault();
                        return show();
                    });


                    base.$closeMark = $("<a href='#'>" + base.opts.closeMark + "</a>").hide();
                    base.$closeMark.bind('click', function (event) {
                        event.preventDefault();
                        return close();
                    });
                }
            }
            // add ellipsis in new line.
            if (base.opts.newLine) {
                base.openMark.css({
                    'display': 'block'
                });
            }

            // append visible content, ellipsis and hidden content to parent element.
            base.$cont.text(visLines)
                      .append(base.$openMark)
                      .append(base.$hidePart);

            if (!base.opts.showOnMouseOver && !base.opts.noAction) {
                base.$cont.append(base.$closeMark);
            }
            //.append(closeMark);

            var d = $("<div>x</div>").css({
                'position': 'absolute',
                'left': 0,
                'top': "-3000px",
                "visibility": "hidden"
            }).width(base.$el.width()).css($(base.$el).css(['font-size', 'font-weight', 'font-family'])).appendTo('body');

            var totlines = parseInt(base.$cont.height() / d.height());
            if (totlines > base.opts.lines) {
                updateText(nth - 1);
            }

            d.remove();
        }

        function show() {
            base.$openMark.hide();
            base.$hidePart.show();
            if (!base.opts.showOnMouseOver) {
                base.$closeMark.css("display", "block");
            }
            return true;
        }

        function close() {
            base.$openMark.show();
            base.$hidePart.hide();
            if (!base.opts.showOnMouseOver) {
                base.$closeMark.hide();
            }
            return true;
        }

        function showOnMouseOver() {

        }



        // only define the method if it's required
        if (typeof base.opts.lines === 'number' && base.opts.lines > 0) {

            /**
             * setStartEllipByLine() sets the start
             * position to the first word in the line
             * that was passed to opts. This forces
             * the ellipsis on a specific line
             * regardless of overflow
             *
             * @param {Number} i
             * @param {Node} word
             */
            var setStartEllipByLine = function (i, word) {
                var $word = $(word),
                    top = $word.position().top;

                // if top isn't currOfset
                // then we're on a new line
                if (top !== currOffset) {
                    currOffset = top;
                    currLine += 1;
                }

                // if the word's currLine is equal
                // to the line limit passed via options
                // then start ellip from this
                // word and stop looping
                if (currLine > base.opts.lines) {
                    startEllipAt = i;
                    return false;
                }
            };

            setStartEllipAt = setStartEllipByLine;
        }

        // only bind to window resize if required
        if (base.opts.responsive) {

            /**
             * resize() resets necessary vars
             * and content and then re-initialises
             * the Ellipsis script
             */
            var resize = function () {
                lines = [];
                currLine = 0;
                currOffset = null;
                startEllipAt = null;
                base.$el.html(base.text);
                base.$cont.empty().append(base.$el);

                //clearTimeout(resizeTimer);
                //resizeTimer = setTimeout(init, 100);
                init();
            }

            $(window).on('resize.' + namespace, resize);
        }

        //start here
        create();
    }

    jQuery.fn.fewlines = function (opts) {
        return this.each(function () {
            try {
                $(this).data(namespace, (new Ellipsis(this, opts)));
            } catch (err) {
                if (window.console) {
                    console.error(namespace + ': ' + err);
                }
            }
        });
    };

})(jQuery);
