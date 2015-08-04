/**
 *
 * jquery.monthselector.js
 *
 * author : piwi
 *
 * created: 11.07.2015
 * changed: 11.07.2015
 *
 * purpose:
 *
 */

;(function($) {
    $.fn.extend({
        monthSelector: function(options,arg) {
            if (options && typeof(options) == 'object') {
                options = $.extend( {}, $.ms.defaults, options );
            } else {
                options = $.extend( {}, $.ms.defaults);
            }
            // this creates a plugin for each element in
            // the selector or runs the function once per
            // selector.  To have it do so for just the
            // first element (once), return false after
            // creating the plugin to stop the each iteration
            return this.each(function() {
                if(!$.data(this, "plugin_ms")) {
                    $.data(this, "plugin_ms", new $.ms(this, options, arg ));
                }
            });
        }
    });

    $.ms = function(elem, options, arg) {
        /**
         * set the target-element to be hidden
         * we override the display
         */
        $.ms.settings = options;
        console.log($.ms.settings);
        console.log(options);
        $.ms.elemId = $(elem).attr("id");
        console.log("adding to: " + $.ms.elemId);
        $(elem).hide();
        _fillMonthArray();
        var currMonthStr = $.ms.dateObj.getFullYear() +"-"+ ((parseInt($.ms.dateObj.getMonth())+1)<10 ? "0" : "") + (parseInt($.ms.dateObj.getMonth())+1);
        if($.ms.settings.selected != undefined) {
            var currMonthStr = $.ms.settings.selected;
        }
        $(elem).val(currMonthStr);
        var $elemContainer = $("<div />").attr("id", $.ms.elemContainer+$.ms.elemId)
                             .addClass("ms_container");
        $(elem).parent().append($elemContainer);
        $(elem).addClass("month_list_input").css("text-align", "center");
        var $monthContainer = $("<select />").addClass('month_list form-control')
                              .attr("id", $.ms.settings.id_month_container+$.ms.elemId)
                              .attr("size", 10)
                              .hide();
        $('body').append($monthContainer);
        $monthContainer.bind("click", function() {
            var selected = $('#' + $.ms.settings.id_month_container+$.ms.elemId + " option:selected").val();
            $('#' + $.ms.settings.id_month_container+$.ms.elemId).hide();
            var tokens = selected.split("-");
            $('#' + $.ms.settings.id_button_middle+$.ms.elemId).html($.ms.monthArr[(tokens[1]-1)] + ", " + tokens[0]);
            _checkButtons(tokens, elem);
        });
        for(var j=0; j < $.ms.monthSelectArray.length; j++) {
            var $innerDiv   = $("<option />")
                              .addClass("month_entry ui-state-default")
                              .html($.ms.monthSelectArray[j])
                              .val($.ms.monthSelectValues[j]);
            if(currMonthStr == $.ms.monthSelectValues[j]) {
                $innerDiv.attr("selected", "selected");
            }
            $('#'+$.ms.settings.id_month_container+$.ms.elemId).append($innerDiv);
        }
        var $leftDiv   = $("<div />")
                         .addClass("ui-state-default ui-corner-all ms_button_left")
                         .attr("id", $.ms.settings.id_button_left+$.ms.elemId);
        var $imgLeft   = $("<img />")
                          .attr("src", "images/16x16/arrow_left.png");
        var $middleDiv = $("<div />")
                         .addClass("ms_button_middle ui-state-default ui-corner-all")
                         .attr("id", $.ms.settings.id_button_middle+$.ms.elemId);
        var $rightDiv  = $("<div />")
                         .addClass("ms_button_right ui-state-default ui-corner-all")
                         .attr("id", $.ms.settings.id_button_right+$.ms.elemId);
        var $imgRight  = $("<img />")
                         .attr("src", "images/16x16/arrow_right.png");
        $leftDiv.append($imgLeft);
        $rightDiv.append($imgRight);
        var $tbl = $("<div />").addClass("ms_tbl_container");
        var $row = $("<div />").addClass("ms_tbl_row_container")
                   .attr("id", $.ms.settings.id_tbl_row_container+$.ms.elemId);
        $tbl.append($row);
        $elemContainer.append($tbl);
        $('#'+$.ms.settings.id_tbl_row_container+$.ms.elemId).append($leftDiv, $middleDiv, $rightDiv);
        /**
         * bind the main-middle as button on click
         * to show the select-box for the entries to select
         */
        var triggeredElem = $.ms.settings.id_button_middle+$.ms.elemId;
        $('#' + $.ms.settings.id_button_middle+$.ms.elemId).bind("click", {triggeredElement: triggeredElem}, function(event) {
            var destination = $('#'+event.data.triggeredElement).offset();
            $('#'+$.ms.settings.id_month_container+$.ms.elemId).css({top: destination.top, left: destination.left}).show();
            $('#'+$.ms.settings.id_month_container+$.ms.elemId).focus();
        });
        $(document).not('#' + $.ms.settings.id_month_container+$.ms.elemId).click(function() {
            $('#' + $.ms.settings.id_month_container+$.ms.elemId).hide();
        });
        /**
         * if no focus anymore - try to hide the select
         */
        $('#' + $.ms.settings.id_month_container+$.ms.elemId).focusout(function() {
            $('#'+$.ms.settings.id_month_container+$.ms.elemId).hide();
        });
        _adddEventHandlerForLeftButton(elem);
        _adddEventHandlerForRightButton(elem);
        $('#' + $.ms.settings.id_button_middle+$.ms.elemId)
                .css("text-align", "center")
                .html($.ms.monthArr[$.ms.dateObj.getMonth()] + ", " + $.ms.dateObj.getFullYear());
    };

    $.ms.defaults = {
            onChange: function() {},
            backward: 24,
            forward: 24,
            id_button_left: 'ms_bl_id',
            id_button_right: 'ms_br_id',
            id_button_middle: 'ms_bm_id',
            id_month_container: 'ms_month_container',
            id_tbl_row_container: 'inner_ms_container'
            };

    $.ms.elemContainer = "ms_elem_container";
    $.ms.elemId = "";
    $.ms.firstValue = "";
    $.ms.lastValue = "";
    $.ms.currLast = 0;
    $.ms.currFirst = 0;
    $.ms.leftIsDisabled = false;
    $.ms.rightIsDisabled = false;
    $.ms.dateObj = new Date();
    $.ms.monthSelectArray  = [];
    $.ms.monthSelectValues = [];
    $.ms.settings = [];
    $.ms.monthArr = ["Jan", "Feb", "Mär", "Apr", "Mai", "Jun","Jul", "Aug", "Sep", "Okt", "Nov", "Dez"];

    _checkButtons = function(tokens, elem) {
        $('#' + $.ms.settings.id_button_middle+$.ms.elemId).html($.ms.monthArr[tokens[1]-1] + ", " + tokens[0]);
        var currValue = tokens[0] + "-" + (parseInt(tokens[1])<10?"0":"") + parseInt(tokens[1]);
        $(elem).val(currValue);
        // check if first value was reached
        if($.ms.firstValue == currValue) {
            $('#' + $.ms.settings.id_button_left+$.ms.elemId).addClass("ui-state-disabled");
            $.ms.leftIsDisabled = true;
        } else {
            $('#' + $.ms.settings.id_button_left+$.ms.elemId).removeClass("ui-state-disabled");
            $.ms.leftIsDisabled = false;
        }
        // check if last value was reached
        if($.ms.lastValue == currValue) {
            $('#' + $.ms.settings.id_button_right+$.ms.elemId).addClass("ui-state-disabled");
            $.ms.rightIsDisabled = true;
        } else {
            $('#' + $.ms.settings.id_button_right+$.ms.elemId).removeClass("ui-state-disabled");
            $.ms.rightIsDisabled = false;
        }
        if($.ms.settings.onChange != undefined && typeof $.ms.settings.onChange == "function") {
            $.ms.settings.onChange.call();
        }
    }

    _fillMonthArray = function() {
        /**
         * the default range is up to three years -> exact 49 entries
         * 12 month per year * 2 years to the past and
         * 12 month per year * 2 years to the future and
         * the current month
         */
        var currMonth = $.ms.dateObj.getMonth();
        var currYear  = $.ms.dateObj.getFullYear();
        $.ms.monthSelectArray.push($.ms.monthArr[currMonth-1] + ", " + currYear);
        $.ms.monthSelectValues.push(currYear+"-"+((currMonth < 10) ? "0" : "") + currMonth);
        for(var i = 0; i < $.ms.settings.backward; i++) {
            currMonth--;
            if(currMonth < 1) {
                currMonth = 12;
                currYear--;
            }
            $.ms.monthSelectArray.unshift($.ms.monthArr[currMonth-1] + ", " + currYear);
            $.ms.monthSelectValues.unshift(currYear+"-"+((currMonth < 10) ? "0" : "") + currMonth);
        }
        $.ms.firstValue=currYear+"-"+(((currMonth) < 10) ? "0" : "") + (currMonth);
        currMonth = $.ms.dateObj.getMonth();
        currYear  = $.ms.dateObj.getFullYear();
        for(var z = 0; z < $.ms.settings.forward; z++) {
            currMonth++;
            if(currMonth > 12) {
                currMonth = 1;
                currYear++;
            }
            $.ms.monthSelectArray.push($.ms.monthArr[currMonth-1] + ", " + currYear);
            $.ms.monthSelectValues.push(currYear+"-"+((currMonth < 10) ? "0" : "") + currMonth);
        }
        $.ms.lastValue=currYear+"-"+(((currMonth) < 10) ? "0" : "") + (currMonth);
    }

    _adddEventHandlerForLeftButton = function(elem) {
        /**
         * now bind to the left button a click
         */
        $('#' + $.ms.settings.id_button_left+$.ms.elemId).bind("click", function() {
            if($.ms.leftIsDisabled) {return;}
            var currentValue = $(elem).val();
            var tokens = currentValue.split("-");
            tokens[1]--;
            if(tokens[1] < 1) { tokens[1] = 12; tokens[0]--; }
            _checkButtons(tokens, elem);
            $.ms.currLast++;
            $.ms.currFirst--;
        });
    }

    _adddEventHandlerForRightButton = function(elem) {
        /**
         * now bind to the right button a click
         */
        $('#' + $.ms.settings.id_button_right+$.ms.elemId).bind("click", function() {
            if($.ms.rightIsDisabled) {return;}
            var currentValue = $(elem).val();
            var tokens = currentValue.split("-");
            tokens[1]++;
            if(tokens[1] > 12) { tokens[1] = 1; tokens[0]++; }
            _checkButtons(tokens, elem);
            $.ms.currLast--;
            $.ms.currFirst++;
        });
    }

}(jQuery));
