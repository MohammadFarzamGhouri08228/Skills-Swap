/*!
 * Documenter 1.6
 * http://rxa.li/documenter
 *
 * Copyright 2011, Xaver Birsak
 * http://revaxarts.com
 *
 */
 
$(document).ready(function() {
	$('#doc-nav li a').click(function(){
		$(this).toggleClass('open').parent().find('ul').slideToggle();
		return false;
	});
	$('#doc-nav li a').click(function(){
		jQuery('#doc-nav li a').removeClass('current');
		jQuery(this).addClass('current');
		var tg = jQuery(this).attr('href');
		var oft = jQuery('section'+tg).offset().top;
		$('body, html').animate({scrollTop:oft-40});
		return false;
	});
});