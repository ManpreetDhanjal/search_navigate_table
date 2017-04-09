/* documentation
 * active - this class tells if the textbox for filter should be displayed or no
 * textboxFilter - this class helps in fetching onkeyup operation on filter textbox
 * 
 * if table is navigable : 	set display of original table to none
 * 							clone first n rows of the table and display
 * 							keep count of number of page and numof rows to display
 * 							if searchable also then search on the original table and display accordingly
*/

var totalPage = 1;
var currPage = 0;
var noOfRow = 1;

(function($){

	// get the rows eligible to be displayed
	$.fn.getRowsForNavigation = function(){
		if($(this).is('.searchable')){
			$rows = $(this).find('tr:gt(1)'); // exclude filter 
		}else{
			$rows = $(this).find('tr:gt(0)');
		}
		
		$rows = $rows.not('[class*="hide_"]');
		return $rows;
	};
	
	// display only the required rows
	$.fn.createNavigationPage = function(){
		
		var $rows = $(this).getRowsForNavigation(); // pass parameter ?
		
		var totalRow = $rows.length;

		if(totalRow < noOfRow){
			totalPage = 1;
		}else{
			totalPage = Math.floor(totalRow/noOfRow);
		}
		var min = currPage * noOfRow;
		var max = (currPage + 1) * noOfRow;
		
		$rows.hide().slice(min, max).show();
	};
	
	// create navigation text
	$.fn.getNavigationText = function(){
		var navigationHtml = '<div><p><label id="navigationText">Showing page '+(currPage+1)+' of '+totalPage+'</label>';
		navigationHtml = navigationHtml + '<input type="button" id="navigation_back" value="Back"/><input type="button" id="navigation_next" value="Next"/></p><div>';
		$(this).after(navigationHtml);
	};
	
	// update navigation text
	$.fn.updateNavigationText = function(){
		var navigationHtml = 'Showing page '+(currPage+1)+' of '+totalPage;
		$('#navigationText').html(navigationHtml);
		
	}
}(jQuery));


$(document).ready(function(){

if($('table').is('.searchable')){
		
		var filterRow = "<tr>";
		var filterArray = [];
		var count = 0;
		$(this).find('th').each(function(){
			filterRow = filterRow + "<td><input type='text' value=''";
			var id = "filterTextBox_"+count;
			count = count + 1;
			filterRow = filterRow + " id='" + id + "'";
			filterArray.push(id);
			if($(this).is('.searchable')){
				filterRow = filterRow + " class='textboxFilter'";
			}
			filterRow = filterRow + " /></td>";
		});
		filterRow = filterRow + "</tr>";
		$(this).find('tr:first').after(filterRow);
}

$('.textboxFilter').keyup(function(){
	var id = $(this).attr('id');
	var count = $(this).attr('id').split('_')[1];
	var regex = new RegExp($(this).val().trim(), 'i');
	var hideClass = 'hide_'+id;
	var text ='';
	$(this).closest('table').find('tr:gt(1)').each(function(){
		$(this).find('td:eq('+count+')').each(function(){
			text = $(this).text();
			if(regex.test(text)){
				$(this).parent().removeClass(hideClass);
				$(this).parent().css('display', 'block');
			}else{
				$(this).parent().addClass(hideClass);
			}
		});
	});
	
	$('tr[class*=hide_').css('display', 'none');
	
	if($('table').is('.navigable')){

		$('table').createNavigationPage();
		$('table').updateNavigationText();
	}
	
	$()
});

if($('table').is('.navigable')){
	
	var $table = $('table');
	
	noOfRow = 2;
	
	$table.createNavigationPage();
	
	$table.getNavigationText();
}

$('#navigation_back').click(function(){
	if(currPage > 0){
		var $rows = $('table').getRowsForNavigation(); // for class of table
		var max = currPage * noOfRow;
		var min = (currPage - 1) * noOfRow;
		currPage = currPage - 1;
		$rows.hide().slice(min, max).show();
		$('table').updateNavigationText();
	}
});

$('#navigation_next').click(function(){
	if(currPage < totalPage - 1){
		var $rows = $('table').getRowsForNavigation();
		var nextPage = currPage + 1;
		var min = nextPage * noOfRow;
		var max = (nextPage + 1) * noOfRow;
		currPage = nextPage;
		$rows.hide().slice(min,max).show();
		$('table').updateNavigationText();
	}
});


});

