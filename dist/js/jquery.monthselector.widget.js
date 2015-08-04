/**
 *
 * jquery.monthselector.widget.js
 *
 * author : piwi
 *
 * created: 14.07.2015
 * changed: 14.07.2015
 *
 * purpose:
 *
 */

$.widget("ui.monthSelectorWidget", {
    version: "1.0.0",
    options: {
            onChange: function() {},
            backward: 24,
            forward: 24,
            disabled: false,
            id_button_left: 'ms_bl_id',
            id_button_right: 'ms_br_id',
            id_button_middle: 'ms_bm_id',
            id_month_container: 'ms_month_container',
            id_tbl_row_container: 'inner_ms_container'
            },
    elemContainer: "ms_elem_container",
    elemId: "",
    firstValue: "",
    lastValue: "",
    currLast: 0,
    currFirst: 0,
    leftIsDisabled: false,
    rightIsDisabled: false,
    dateObj: new Date(),
    monthSelectArray : [],
    monthSelectValues: [],
    elemToAddTo:"",
    selected: undefined,
    selectedMonthStr: "",
    monthArr: ["Jan", "Feb", "Mär", "Apr", "Mai", "Jun","Jul", "Aug", "Sep", "Okt", "Nov", "Dez"],

    disable: function() {
        this.elemId = this.element.attr("id");
        $('#' + this.options.id_button_left+this.elemId).prop("disabled", true).addClass("ui-state-disabled");
        $('#' + this.options.id_button_middle+this.elemId).prop("disabled", true).addClass("ui-state-disabled");
        $('#' + this.options.id_button_right+this.elemId).prop("disabled", true).addClass("ui-state-disabled");
    },

    enable: function() {
        this.elemId = this.element.attr("id");
        $('#' + this.options.id_button_left+this.elemId).prop("disabled", false).removeClass("ui-state-disabled");
        $('#' + this.options.id_button_middle+this.elemId).prop("disabled", false).removeClass("ui-state-disabled");
        $('#' + this.options.id_button_right+this.elemId).prop("disabled", false).removeClass("ui-state-disabled");
    },

    _create: function() {
        this.element.hide();
        this.monthSelectArray  = [];
        this.monthSelectValues = [];
        this.elemId = this.element.attr("id");
        if(this.options.selected == undefined || this.options.selected == "") {
            this.options.selected = this.dateObj.getFullYear() +"-"+
                                    ((parseInt(this.dateObj.getMonth())+1)<10 ? "0" : "") + (parseInt(this.dateObj.getMonth())+1);
        }
        if(this.monthSelectArray.length == 0) { this._fillMonthArray(); }
    },

    _destroy: function() {
    },

    _init: function() {
        this.elemToAddTo = this.element.parent();
        this._addMonthContainer(this.element);
        var $elemContainer = $("<div />").attr("id", this.elemContainer+this.elemId)
                    .addClass("ms_container");
        this.elemToAddTo.append($elemContainer);
        var $leftDiv   = $("<div />")
                    .addClass("ui-state-default ui-corner-all ms_button_left")
                    .attr("id", this.options.id_button_left+this.elemId);
        var $imgLeft   = $("<img />")
                     .attr("src", "images/16x16/arrow_left.png");
        var $middleDiv = $("<div />")
                    .addClass("ms_button_middle ui-state-default ui-corner-all")
                    .attr("id", this.options.id_button_middle+this.elemId);
        var $rightDiv  = $("<div />")
                    .addClass("ms_button_right ui-state-default ui-corner-all")
                    .attr("id", this.options.id_button_right+this.elemId);
        var $imgRight  = $("<img />")
                    .attr("src", "images/16x16/arrow_right.png");
        $leftDiv.append($imgLeft);
        $rightDiv.append($imgRight);
        var $tbl = $("<div />").addClass("ms_tbl_container");
        var $row = $("<div />").addClass("ms_tbl_row_container")
                    .attr("id", this.options.id_tbl_row_container+this.elemId);
        $tbl.append($row);
        $row.append($leftDiv, $middleDiv, $rightDiv);
        $elemContainer.append($tbl);
        $('#' + this.options.id_button_middle+this.elemId)
                    .css("text-align", "center")
                    .html(this.selectedMonthStr);
        $('#'+this.elemId).val(this.options.selected);
        var triggeredElem = this.options.id_button_middle+this.elemId;
        var monthContainerId = this.options.id_month_container+this.elemId;
        $('#' + this.options.id_button_middle+this.elemId).bind("click", function() {
            var destination = $('#'+triggeredElem).offset();
            $('#'+monthContainerId).css({top: destination.top, left: (destination.left-20)}).show();
            $('#'+monthContainerId).focus();
        });
        $('#' + monthContainerId).focusout(function() {
            $('#'+monthContainerId).hide();
        });
        this._adddEventHandlerForLeftButton(this.element);
        this._adddEventHandlerForRightButton(this.element);
        if(this.options.disabled) { this.disable(); }
    },

    _setOption: function(key, value) {
        this.options[key] = value;
    },

    _fillMonthArray: function() {
        /**
         * the default range is up to three years -> exact 49 entries
         * 12 month per year * 2 years to the past and
         * 12 month per year * 2 years to the future and
         * the current month
         */
        var tokens = this.options.selected.split("-");
        var currMonth = tokens[1];
        var currYear  = tokens[0];
        this.monthSelectArray.push(this.monthArr[currMonth-1] + ", " + currYear);
        this.monthSelectValues.push(currYear+"-"+((currMonth < 10 && currMonth.length < 2) ? "0" : "") + currMonth);
        for(var i = 0; i < this.options.backward; i++) {
            currMonth--;
            if(currMonth < 1) {
                currMonth = 12;
                currYear--;
            }
            this.monthSelectArray.unshift(this.monthArr[currMonth-1] + ", " + currYear);
            this.monthSelectValues.unshift(currYear+"-"+((currMonth < 10) ? "0" : "") + currMonth);
        }
        this.firstValue=currYear+"-"+(((currMonth) < 10 && currMonth.length < 2) ? "0" : "") + (currMonth);
        var currMonth = tokens[1];
        var currYear  = tokens[0];
        for(var z = 0; z < this.options.forward; z++) {
            currMonth++;
            if(currMonth > 12) {
                currMonth = 1;
                currYear++;
            }
            this.monthSelectArray.push(this.monthArr[currMonth-1] + ", " + currYear);
            this.monthSelectValues.push(currYear+"-"+((currMonth < 10) ? "0" : "") + currMonth);
        }
        this.lastValue=currYear+"-"+(((currMonth) < 10 && currMonth.length < 2) ? "0" : "") + (currMonth);
    },

    _addMonthContainer: function(elem) {
        var monthContainerId = this.options.id_month_container+this.elemId;
        if($('#'+monthContainerId).length) { $('#'+monthContainerId).empty(); }
        var intMonthArray = this.monthArr;
        var middleBtId = this.options.id_button_middle+this.elemId;
        var $monthContainer = $("<select />").addClass('month_list form-control')
                    .attr("id", monthContainerId)
                    .attr("size", 10)
                    .hide();
        $('body').append($monthContainer);
        this._on($('#'+monthContainerId), {
            click: function(event) {
                var selected = $('#' + monthContainerId + " option:selected").val();
                $('#' + monthContainerId).hide();
                var tokens = selected.split("-");
                $('#' + middleBtId).html(intMonthArray[(tokens[1]-1)] + ", " + tokens[0]);
                this.checkButtons(tokens, elem);
            }
        });
        $monthContainer.empty();
        for(var j=0; j < this.monthSelectArray.length; j++) {
            var $innerDiv   = $("<option />")
                    .addClass("month_entry ui-state-default")
                    .html(this.monthSelectArray[j])
                    .val(this.monthSelectValues[j]);
            if(this.options.selected == this.monthSelectValues[j]) {
                $innerDiv.attr("selected", "selected");
                this.selectedMonthStr = this.monthSelectArray[j];
            }
            $('#'+this.options.id_month_container+this.elemId).append($innerDiv);
        }
    },

    checkButtons: function(tokens, elem) {
        var elementId = this.options.id_button_middle+this.elemId;
        var leftElementId = this.options.id_button_left+this.elemId;
        var rightElementId = this.options.id_button_right+this.elemId;
        $('#' + elementId).html(this.monthArr[tokens[1]-1] + ", " + tokens[0]);
        var currValue = tokens[0] + "-" + (parseInt(tokens[1])<10?"0":"") + parseInt(tokens[1]);
        $(elem).val(currValue);
        // check if first value was reached
        if(this.firstValue == currValue) {
            $('#' + leftElementId).addClass("ui-state-disabled");
            this.leftIsDisabled = true;
        } else {
            $('#' + leftElementId).removeClass("ui-state-disabled");
            this.leftIsDisabled = false;
        }
        // check if last value was reached
        if(this.lastValue == currValue) {
            $('#' + rightElementId).addClass("ui-state-disabled");
            this.rightIsDisabled = true;
        } else {
            $('#' + rightElementId).removeClass("ui-state-disabled");
            this.rightIsDisabled = false;
        }
        if(this.options.onChange != undefined && typeof this.options.onChange == "function") {
            this.options.onChange.call();
        }
    },

    _adddEventHandlerForLeftButton: function(elem) {

        var triggeredElem = elem;
        /**
         * now bind to the left button a click
         */
        var idButtonLeft = this.options.id_button_left+this.elemId;
        var elementId = this.elemId;
        this._on($('#'+idButtonLeft), {
            click: function(event) {
                if(this.leftIsDisabled) {return;}
                var currentValue = $('#'+elementId).val();
                var tokens = currentValue.split("-");
                tokens[1]--;
                if(tokens[1] < 1) { tokens[1] = 12; tokens[0]--; }
                this.checkButtons(tokens, triggeredElem);
                this.currLast++;
                this.currFirst--;
            }
        });
    },

    _adddEventHandlerForRightButton: function(elem) {
        var triggeredElem = elem;
        /**
         * now bind to the right button a click
         */
        var idButtonRight = this.options.id_button_right+this.elemId;
        var elementId = this.elemId;
        this._on($('#'+idButtonRight), {
            click: function(event) {
                if(this.rightIsDisabled) {return;}
                var currentValue = $('#'+elementId).val();
                var tokens = currentValue.split("-");
                tokens[1]++;
                if(tokens[1] > 12) { tokens[1] = 1; tokens[0]++; }
                this.checkButtons(tokens, triggeredElem);
                this.currLast--;
                this.currFirst++;
            }
        });
    }

});
