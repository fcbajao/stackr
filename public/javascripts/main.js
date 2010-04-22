$(document).ready(function() {
	// get the token value then remove the element for security reasons
	var token_holder = $('#stackr_token');
	var token_val = token_holder.val();
	token_holder.remove();
	
	var gameWrapper = $('#wrapper');
	var btnNewgame = $('#newgame');
	var linkTopStackrs = $('#linktop');
	
	gameWrapper.stackr({ token: token_val }); // well at this point it really does not matter which element you want to use this with
	
	btnNewgame.click(function() {
		gameWrapper.stackr('newgame');
		$(this).blur(); // we need to blur to remove focus from button and avoid conflict with spacebar
		return false;
	});
	
	linkTopStackrs.click(function() {
		gameWrapper.stackr('showTopStackrs');
		return false;
	});
}); 