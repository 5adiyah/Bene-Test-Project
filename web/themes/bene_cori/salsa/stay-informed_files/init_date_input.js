/*
 * Initialize date all date inputs on page.
 * Expects inputs to be in either salsa_date_input
 * or salsa_date_time_input classes
 */
$(function(){
	$(".salsa_date_input").date_input();
	$(".salsa_date_time_input").date_input({show_time:true});
});
