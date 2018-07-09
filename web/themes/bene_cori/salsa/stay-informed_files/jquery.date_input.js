/*
Date Input 1.2.0
Requires jQuery version: >= 1.2.6

Copyright (c) 2007-2008 Jonathan Leighton & Torchbox Ltd

Permission is hereby granted, free of charge, to any person
obtaining a copy of this software and associated documentation
files (the "Software"), to deal in the Software without
restriction, including without limitation the rights to use,
copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the
Software is furnished to do so, subject to the following
conditions:

The above copyright notice and this permission notice shall be
included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND,
EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES
OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND
NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT
HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY,
WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING
FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR
OTHER DEALINGS IN THE SOFTWARE.
*/

/*
 * Time picker functionality added by SalsaLabs
 */

DateInput = (function($) { 

function DateInput(el, opts) {
  if (typeof(opts) != "object") opts = {};
  $.extend(this, DateInput.DEFAULT_OPTS, opts);
  
  this.input = $(el);
  this.bindMethodsToObj("show", "hide", "hideIfClickOutside", "keydownHandler", "selectDate");
  
  this.build();
  this.selectDate();
  this.hide();
};
DateInput.DEFAULT_OPTS = {
  month_names: ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"],
  short_month_names: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"],
  short_day_names: ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"],
  start_of_week: 1,
  show_time:false
};
DateInput.prototype = {
  build: function() {
    var monthNav = $('<p class="month_nav">' +
      '<span class="button prev" title="[Page-Up]">&#171;</span>' +
      ' <span class="month_name"></span> ' +
      '<span class="button next" title="[Page-Down]">&#187;</span>' +
      '</p>');
    this.monthNameSpan = $(".month_name", monthNav);
    $(".prev", monthNav).click(this.bindToObj(function() { this.moveMonthBy(-1); }));
    $(".next", monthNav).click(this.bindToObj(function() { this.moveMonthBy(1); }));
    
    var yearNav = $('<p class="year_nav">' +
      '<span class="button prev" title="[Ctrl+Page-Up]">&#171;</span>' +
      ' <span class="year_name"></span> ' +
      '<span class="button next" title="[Ctrl+Page-Down]">&#187;</span>' +
      '</p>');
    this.yearNameSpan = $(".year_name", yearNav);
    $(".prev", yearNav).click(this.bindToObj(function() { this.moveMonthBy(-12); }));
    $(".next", yearNav).click(this.bindToObj(function() { this.moveMonthBy(12); }));

	var timeTable = this.drawTime();
    
    var nav = $('<div class="nav"></div>').append(monthNav, yearNav);
    
    var tableShell = '<table class="days"><thead><tr>';
    $(this.adjustDays(this.short_day_names)).each(function() {
      tableShell += "<th>" + this + "</th>";
    });
    tableShell += "</tr></thead><tbody></tbody></table>";

	var dateDiv = $('<div class="date_div"></div>').append(nav,tableShell);
    
    this.dateSelector = this.rootLayers = $('<div class="date_selector"></div>').append(dateDiv, timeTable).prependTo($("body"));
    
    if ($.browser.msie && $.browser.version < 7) {
      
      this.ieframe = $('<iframe class="date_selector_ieframe" frameborder="0" src="#"></iframe>').insertBefore(this.dateSelector);
      this.rootLayers = this.rootLayers.add(this.ieframe);
      
      $(".button", nav).mouseover(function() { $(this).addClass("hover") });
      $(".button", nav).mouseout(function() { $(this).removeClass("hover") });
    };
    
    this.tbody = $(".days tbody", this.dateSelector);
	this.timetable = $(".hours",this.dateSelector);	
    
    this.input.change(this.bindToObj(function() { this.selectDate(); }));
    this.selectDate();
  },

  drawTime: function() {
    var table = '<table class="hours"><tbody><tr><td class="am_pm" ampm="am">AM</td><td class="am_pm" ampm="pm">PM</td></tr>';
    for (var i=0; i<12; i++){
      table+='<tr><td class="hour" hour="'+(((i+1)<10)?'0':'')+(i+1)+'">'+(i+1)+'</td><td class="minute" minute="'+(((i*5)<10)?'0':'')+(i*5)+'">:'+(((i*5)<10)?'0':'')+(i*5)+'</td></tr>';
    }
    table+='</tbody></table>';
    return table;
  },

  selectMonth: function(date) {
    var newMonth = new Date(date.getFullYear(), date.getMonth(), 1);
    
    if (!this.currentMonth || !(this.currentMonth.getFullYear() == newMonth.getFullYear() &&
                                this.currentMonth.getMonth() == newMonth.getMonth())) {
      
      this.currentMonth = newMonth;
      
      var rangeStart = this.rangeStart(date), rangeEnd = this.rangeEnd(date);
      var numDays = this.daysBetween(rangeStart, rangeEnd);
      var dayCells = "";
      
      for (var i = 0; i <= numDays; i++) {
        var currentDay = new Date(rangeStart.getFullYear(), rangeStart.getMonth(), rangeStart.getDate() + i, 12, 00);
        
        if (this.isFirstDayOfWeek(currentDay)) dayCells += "<tr>";
        
        if (currentDay.getMonth() == date.getMonth()) {
          dayCells += '<td class="selectable_day" date="' + this.dateToString(currentDay,false) + '">' + currentDay.getDate() + '</td>';
        } else {
          dayCells += '<td class="unselected_month" date="' + this.dateToString(currentDay,false) + '">' + currentDay.getDate() + '</td>';
        };
        
        if (this.isLastDayOfWeek(currentDay)) dayCells += "</tr>";
      };
      this.tbody.empty().append(dayCells);
      
      this.monthNameSpan.empty().append(this.monthName(date));
      this.yearNameSpan.empty().append(this.currentMonth.getFullYear());
      
      $(".selectable_day", this.tbody).click(this.bindToObj(function(event) {
	  	this.selectedDate = this.changeDate(this.selectedDate,$(event.target).attr("date"));
        this.changeInput(this.dateToString(this.selectedDate));
      }));
      
      $("td[date=" + this.dateToString(new Date(),false) + "]", this.tbody).addClass("today");
      
      $("td.selectable_day", this.tbody).mouseover(function() { $(this).addClass("hover") });
      $("td.selectable_day", this.tbody).mouseout(function() { $(this).removeClass("hover") });
    };
    
    $('.selected', this.tbody).removeClass("selected");
    $('td[date=' + this.selectedDateString + ']', this.tbody).addClass("selected");
  },

  selectTime: function(date){
    if (this.show_time){
	  this.timetable.show();
      $('td.selected', this.timetable).removeClass("selected");
      var selectedHour = (date.getHours()>12)? Number(date.getHours())-12:date.getHours();
	  selectedHour = ((selectedHour<10)?"0":"") + selectedHour;
	  if (selectedHour == "00"){
	  	selectedHour = "12";
	  }
	  var selectedAMPM = (date.getHours()>=12)? "pm":"am";
	  var selectedMinute = ((date.getMinutes()<10)?"0":"") + date.getMinutes();
      $('td[hour=' + selectedHour + ']', this.timetable).addClass("selected");
	  $('td[minute=' + selectedMinute + ']', this.timetable).addClass("selected");
	  $('td[ampm=' + selectedAMPM + ']', this.timetable).addClass("selected");

      $(".hour", this.timetable).unbind("click");
	  $(".hour", this.timetable).click(this.bindToObj(function(event) {
        var hour = Number($(event.target).attr("hour"));
	    if (this.selectedDate.getHours()>=12){//pm
		  if (hour!=12){
		    hour+=12;
		  }
		} else if(hour == 12){//12:00 am
		  hour = 0;
		}
	    this.selectedDate.setHours(hour);
        this.changeInput(this.dateToString(this.selectedDate));
      }));

      $(".minute", this.timetable).unbind("click");
	  $(".minute", this.timetable).click(this.bindToObj(function(event) {
	    this.selectedDate.setMinutes(Number($(event.target).attr("minute")));
        this.changeInput(this.dateToString(this.selectedDate));
      }));

	  $(".am_pm", this.timetable).unbind("click");
	  $(".am_pm", this.timetable).click(this.bindToObj(function(event) {
	    var ampm = $(event.target).attr("ampm");
	    var hour = this.selectedDate.getHours();
	    if (hour>=12)
	    {
	  	  if (ampm == "am") hour-=12;
	    } else {
	  	  if (ampm == "pm") hour+=12;
	    }
	    this.selectedDate.setHours(hour);
        this.changeInput(this.dateToString(this.selectedDate));
      }));

	} else {
	  $(".hours",this.dateSelector).hide();
	}
  },
  
  selectDate: function(date) {
    if (typeof(date) == "undefined") {
      date = this.stringToDate(this.input.val());
    };
    if (!date) date = new Date();
    
    this.selectedDate = date;
    this.selectedDateString = this.dateToString(this.selectedDate,false);
    this.selectMonth(this.selectedDate);
	this.selectTime(this.selectedDate);
  },
  
  changeInput: function(dateString) {
    if (this.input.val()!=dateString){
      this.input.val(dateString).change();
	}
	if(!this.show_time)
		this.hide();
  },
  
  show: function() {
    this.rootLayers.css("display", "block");
    $([window, document.body]).click(this.hideIfClickOutside);
    this.input.unbind("focus", this.show);
    $(document.body).keydown(this.keydownHandler);
    this.setPosition();
  },
  
  hide: function() {
    this.rootLayers.css("display", "none");
    $([window, document.body]).unbind("click", this.hideIfClickOutside);
    this.input.focus(this.show);
    $(document.body).unbind("keydown", this.keydownHandler);
  },
  
  hideIfClickOutside: function(event) {
    if (event.target != this.input[0] && !this.insideSelector(event)) {
      this.hide();
    };
  },
  
  insideSelector: function(event) {
    var offset = this.dateSelector.position();
    offset.right = offset.left + this.dateSelector.outerWidth();
    offset.bottom = offset.top + this.dateSelector.outerHeight();
    
    return event.pageY < offset.bottom &&
           event.pageY > offset.top &&
           event.pageX < offset.right &&
           event.pageX > offset.left;
  },
  
  keydownHandler: function(event) {
    switch (event.keyCode)
    {
      case 9: 
      case 27: 
        this.hide();
        return;
      break;
      case 13: 
        this.changeInput(this.selectedDateString);
      break;
      case 33: 
        this.moveDateMonthBy(event.ctrlKey ? -12 : -1);
      break;
      case 34: 
        this.moveDateMonthBy(event.ctrlKey ? 12 : 1);
      break;
      case 38: 
        this.moveDateBy(-7);
      break;
      case 40: 
        this.moveDateBy(7);
      break;
      case 37: 
        this.moveDateBy(-1);
      break;
      case 39: 
        this.moveDateBy(1);
      break;
      default:
        return;
    }
    event.preventDefault();
  },
  
  stringToDate: function(string) {
    var matches;
    if (matches = string.match(/^(\d{4,4})-(\d{2,2})-(\d{2,2})$/)) {
      return new Date(matches[1], matches[2]-1, matches[3], 12, 0);
    } else if (matches = string.match(/^(\d{4,4})-(\d{2,2})-(\d{2,2}) (\d{2,2}):(\d{2,2})$/)) {
      return new Date(matches[1], matches[2]-1, matches[3], matches[4], matches[5]);
	  this.show_time=true;
    } else {
	  //alert("Could not parse date");
      return null;
    };
  },
  
  dateToString: function(date,appendTime) {
	var dateString = date.getFullYear() + "-" + ((date.getMonth()<9)?"0":"") + (Number(date.getMonth())+1) + "-" + ((date.getDate()<10)?"0":"") + date.getDate();
	if (this.show_time && appendTime!== false){
	  dateString += " " + ((date.getHours()<10)?"0":"") + date.getHours() + ":" + ((date.getMinutes()<10)?"0":"") + date.getMinutes();
	}
	return dateString;
  },

  changeDate: function(date, string) {
    if (matches = string.match(/^(\d{4,4})-(\d{2,2})-(\d{2,2})$/)) {
      return new Date(matches[1], matches[2]-1, matches[3], date.getHours(), date.getMinutes());
    } else {
      return date;
    };
  },
  
  setPosition: function() {
    var offset = this.input.offset();
    this.rootLayers.css({
      top: offset.top + this.input.outerHeight(),
      left: offset.left
    });
    
    if (this.ieframe) {
      this.ieframe.css({
        width: this.dateSelector.outerWidth(),
        height: this.dateSelector.outerHeight()
      });
    };
  },
  
  moveDateBy: function(amount) {
    var newDate = new Date(this.selectedDate.getFullYear(), this.selectedDate.getMonth(), this.selectedDate.getDate() + amount);
    this.selectDate(newDate);
  },
  
  moveDateMonthBy: function(amount) {
    var newDate = new Date(this.selectedDate.getFullYear(), this.selectedDate.getMonth() + amount, this.selectedDate.getDate());
    if (newDate.getMonth() == this.selectedDate.getMonth() + amount + 1) {
      
      newDate.setDate(0);
    };
    this.selectDate(newDate);
  },
  
  moveMonthBy: function(amount) {
    var newMonth = new Date(this.currentMonth.getFullYear(), this.currentMonth.getMonth() + amount, this.currentMonth.getDate());
    this.selectMonth(newMonth);
  },
  
  monthName: function(date) {
    return this.month_names[date.getMonth()];
  },
  
  bindToObj: function(fn) {
    var self = this;
    return function() { return fn.apply(self, arguments) };
  },
  
  bindMethodsToObj: function() {
    for (var i = 0; i < arguments.length; i++) {
      this[arguments[i]] = this.bindToObj(this[arguments[i]]);
    };
  },
  
  indexFor: function(array, value) {
    for (var i = 0; i < array.length; i++) {
      if (value == array[i]) return i;
    };
  },
  
  monthNum: function(month_name) {
    return this.indexFor(this.month_names, month_name);
  },
  
  shortMonthNum: function(month_name) {
    return this.indexFor(this.short_month_names, month_name);
  },
  
  shortDayNum: function(day_name) {
    return this.indexFor(this.short_day_names, day_name);
  },
  
  daysBetween: function(start, end) {
    start = Date.UTC(start.getFullYear(), start.getMonth(), start.getDate());
    end = Date.UTC(end.getFullYear(), end.getMonth(), end.getDate());
    return (end - start) / 86400000;
  },
  
  changeDayTo: function(dayOfWeek, date, direction) {
    var difference = direction * (Math.abs(date.getDay() - dayOfWeek - (direction * 7)) % 7);
    return new Date(date.getFullYear(), date.getMonth(), date.getDate() + difference);
  },
  
  rangeStart: function(date) {
    return this.changeDayTo(this.start_of_week, new Date(date.getFullYear(), date.getMonth()), -1);
  },
  
  rangeEnd: function(date) {
    return this.changeDayTo((this.start_of_week - 1) % 7, new Date(date.getFullYear(), date.getMonth() + 1, 0), 1);
  },
  
  isFirstDayOfWeek: function(date) {
    return date.getDay() == this.start_of_week;
  },
  
  isLastDayOfWeek: function(date) {
    return date.getDay() == (this.start_of_week - 1) % 7;
  },
  
  adjustDays: function(days) {
    var newDays = [];
    for (var i = 0; i < days.length; i++) {
      newDays[i] = days[(i + this.start_of_week) % 7];
    };
    return newDays;
  }
};

$.fn.date_input = function(opts) {
  return this.each(function() { new DateInput(this, opts); });
};
$.date_input = { initialize: function(opts) {
  $("input.date_input").date_input(opts);
} };

return DateInput;
})(jQuery); 
