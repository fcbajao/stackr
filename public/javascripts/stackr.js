$.widget('ui.stackr', {
	_grid: null, // grid div container
	_bar: null, // the div bar that goes from left to right
	_lines: null, // the container that shows the value of lines made
	_cwidth: null, // cell width
	_linesCount: 0, // number of lines made
	_barLeftPosition: 0, // current left absolute position of bar
	
	_defaultBarLength: 4, // default number of blocks in the bar
	_currentBarLength: 4, // current number of blocks in the bar
	
	_prevIndex: null, // represents index of array where bar was placed
	_currIndex: null, // represents current index of array as the bar is moving
	_currentIndexLimit: null, // current limit of index until bar movement shifts direction to left
	
	_linesLimit: 15, // the number of rows
	_levelLinesCtr: 0, // the number of lines made before it reaches the last row
	_blocksPerLine: 10, // number of blocks per row
	
	_rowLines: null, // array collection of all row elements
	
	_currentRow: null, // current row element container that the bar is moving inside of
	
	_activeBar: null, // current moving bar
	_prevBar: null, // previous bar
	
	_currentDirection: null, // current direction of bar (left or right)
	
	_timer: null, // setInterval timer
	
	_startSpeed: 800, // initial speed of moving bar in ms
	_currentSpeed: null, // current speed in ms
	
	_gameIsActive: false, // indicates if game is running or not
	
	_username: '', // username
	
	_token: '', // token from server
	
	_init: function() {
		var me = this;
		this._grid = $(this.options.grid);
		this._bar = $(this.options.bar);
		this._lines = $(this.options.lines);
		this._cwidth = this.options.cellWidth;
		this._rowLines = $('#grid div');
		this._token = this.options.token;
		
		// bind spacebar listener
		$(document).keypress(function(e) {
			if ( me._gameIsActive )
				me._cbKeypress(e);
		});
	},
	
	_reset: function() {
		this._linesCount = 0;
		this._barLeftPosition = 0;
		this._currentBarLength = this._defaultBarLength;
		this._prevIndex = null;
		this._currIndex = 0;
		this._levelLinesCtr = 0;
		this._currentRow = this._rowLines[this._rowLines.length - 1]; // default start row is at the bottom
		this._currentSpeed = this._startSpeed;
		this._currentDirection = 'right';
		this._gameIsActive = false;
		this._prevBar = this._bar;
		
		// clear timer
		(this._timer != null) && clearInterval(this._timer);
		this._timer = null;
		
		// reset lines made display
		this._lines.text(0);
		
		// clear out the grid
		this._grid.find('.bar').remove();
	},
	
	_logscore: function() {
		var username = this._username;
		var lines = this._linesCount;
		var me = this;
		
		// let's hash the score with the token, this will be used by the server to validate the lines_made clear value
		var hash_val = $.md5(this._token + lines);
		
		$.ajax({
			url: '/scores/',
			type: 'POST',
			dataType: 'json',
			data: {
				username: username,
				lines_made: lines,
				hash: hash_val
			},
			success: function(data, status, xhr) {
				if ( 'OK' == data.stat ) {
					me._showFormOk();
				} else {
					me._showFormFail(data.msg);
				}
			}
		});
	},
	
	_cbKeypress: function(e) {
		if ( e.which == 32 ) {
			// space bar pressed
			this._stopBar();
			this._checkBar();
		}
	},
	
	_start: function() {
		this._gameIsActive = true;
		this._startRow();
		this._trigger('_start');
	},
	
	_startRow: function() {
		// clone the previous bar element then place it on the current row
		this._activeBar = this._prevBar.clone();
		this._activeBar.appendTo(this._currentRow).css('left', 0).show();
		this._currentIndexLimit = (this._blocksPerLine - 1) - (this._currentBarLength - 1);
		this._currIndex = 0;
		this._moveBar();
	},
	
	_moveBar: function() {
		var me = this;
		// start the timer
		this._timer = setInterval(function() {
			if ( me._currIndex == 0 ) {
				// lets move right
				me._currIndex++;
				me._currentDirection = 'right';
			} else if ( me._currIndex < me._currentIndexLimit ) {
				if ( me._currentDirection == 'right' ) {
					// lets still move right, we're not at the limit yet
					me._currIndex++;
				} else {
					// lets still move left, we're not at the left most block yet
					me._currIndex--;
				}
			} else {
				// we have reached the right most limit, let's move left
				me._currIndex--;
				me._currentDirection = 'left';
			}
			var leftpos = me._currIndex * me._cwidth;
			me._activeBar.css('left', leftpos + 'px');
		}, this._currentSpeed);
	},
	
	_stopBar: function() {
		clearInterval(this._timer);
		this._timer = null;
	},
	
	_checkBar: function() {
		var gameover = false;
		var blocksToRemove = 0;
		var newIndex = this._currIndex;
		
		if ( null != this._prevIndex ) {
			var leftpos = 0;
			// there's already a bar below this row, so let's check if this was stacked right
			if ( this._currIndex < this._prevIndex ) {
				// this ended up something like this
				// xxxx
				//   xxxx
				blocksToRemove = this._prevIndex - this._currIndex;
				newIndex = this._prevIndex;
				leftpos = this._prevIndex * this._cwidth;
			} else if ( this._currIndex > this._prevIndex ) {
				// this ended up something like this
				//  xxxx
				// xxxx
				blocksToRemove = this._currIndex - this._prevIndex;
				leftpos = this._currIndex * this._cwidth;
			} else {
				// this ended up just on the right stack
				leftpos = this._currIndex * this._cwidth;
			}
			
			this._currentBarLength = this._currentBarLength - blocksToRemove;
			if ( this._currentBarLength > 0 ) {
				// we will trim the bar
				var indexguide = this._currentBarLength - 1;
				this._activeBar.find('em:gt('+indexguide+')').remove();
				
				this._activeBar.css('left', leftpos + 'px');
			} else {
				// GAME OVER
				this._gameOver();
				gameover = true;
			}
		}
		
		if ( !gameover ) {
			this._prevBar = this._activeBar;
			this._prevIndex = newIndex;
			this._linesCount++;
			this._levelLinesCtr++;
			this._lines.text(this._linesCount); // update lines made
			
			if ( this._levelLinesCtr == this._linesLimit ) {
				this._prevIndex = null; // reset since we're clearing the grid
				this._currentRow = this._rowLines[this._rowLines.length - 1]; // let's move back to the bottom
				this._levelLinesCtr = 0;
				// clear out the grid
				this._grid.find('.bar').remove();
			} else {
				this._currentRow = this._rowLines[this._rowLines.length - (this._levelLinesCtr + 1)]; // let's move to the upper row
			}
			
			if ( this._currentSpeed > 20 ) this._currentSpeed -= 20; // increase speed, we deduct 20 ms from the interval
			this._startRow();
		}
	},
	
	_gameOver: function() {
		this._gameIsActive = false;
		this._showForm();
	},
	
	_showForm: function() {
		var me = this;
		var formMarkup = '<div id="stackr_form"><p>You have survived '+this._linesCount+' lines!</p><p>Enter your name.</p><p class="error"></p>' +
		'<input type="text" id="stackr_username" maxlength="30" name="stackr_username" value="'+this._username+'" />' +
		'<button id="stackr_submit_username">Submit</button></div>';
		$(formMarkup).appendTo('body').dialog({
			title: 'Game Over',
			modal: true,
			draggable: false,
			resizable: false,
			open: function(event, ui) {
				var thisform = $(this);
				var submitFunc = function() {
					var username = $.trim($('#stackr_username').val());
					if ( username != '' ) {
						me._username = username;
						$('#stackr_form').html('<p>Submitting score...</p>');
						me._logscore();
					} else {
						thisform.find('p.error').text('Please enter a value.');
					}
				};
				
				$('#stackr_username').keypress(function(e) {
					if ( e.which == 13 ) {
						submitFunc();
					}
				});
				$('#stackr_submit_username').click(submitFunc);
				$('#stackr_username').focus();
			},
			close: function() {
				$(this).dialog('destroy').remove();
			}
		});
	},
	
	_showFormOk: function() {
		var elem = $('#stackr_form');
		if ( elem.length > 0 ) {
			elem.html('<p>Your score has been submitted. Look at the Top Stackrs and see if you made it. Thanks for playing!</p>');
		}
	},
	
	_showFormFail: function(msg) {
		var elem = $('#stackr_form');
		if ( elem.length > 0 ) {
			elem.html('<p>'+msg+'</p>');
		}
	},
	
	_showTopStackrsBoard: function(data) {
		var len = 0;
		var rank = 0;
		var header = '';
		var html = '<div id="topstackrs">';
		for ( var key in data ) {
			var rdata = data[key];
			
			switch (key) {
				case 'all':
				header = 'All-Time';
				break;
				case 'month':
				header = 'This Month';
				break;
				case 'week':
				header = 'This Week';
				break;
				default:
				header = 'Today';
				break;
			}
		
			html += '<div class="topstackrs"><h1>'+header+'</h1><table><thead><tr><th width="25px"></th><th>name</th><th>lines</th></tr></thead><tbody>';		
			len = rdata.length;
			rank = 0;
			for ( var i = 0; i < len; i++ ) {
				rank = i + 1;
				html += '<tr><td>'+rank+'</td><td>'+rdata[i].score.username+'</td><td>'+rdata[i].score.lines_made+'</td></tr>';
			}
			html += '</tbody></table></div>';
		}
		
		html += '</div>';
		
		$(html).appendTo('body').dialog({
			title: 'Top Stackrs',
			modal: true,
			draggable: false,
			resizable: false,
			width: 800,
			close: function() {
				$(this).dialog('destroy').remove();
			}
		});
	},
	
	showTopStackrs: function() {
		var me = this;
		$.ajax({
			url: '/scores/',
			type: 'GET',
			success: function(data, status, xhr) {
				me._showTopStackrsBoard(data);
			}
		});
	},
	
	newgame: function() {
		this._reset();
		this._start();
	},
	
	options: {
		grid: '#grid', // css selector for grid element
		bar: '#bar', // css selector for bar element
		lines: '#lines', // css selector for lines made element
		cellWidth: 28, // width of each cell in px. this will be used for the proper spacing of movements by the bar
		token: '' // token value generated by the server
	}
});