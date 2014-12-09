$(function(){

$('.deleteThis').on('click', function(event){
	// alert("this is clicked");
    event.preventDefault();
    var deleteThis = $(this);

    $.ajax({
        url:'/list/' + deleteThis.data("id"),
        type:'DELETE',
        success:function(result){
            deleteThis.closest('div').fadeOut('slow',function() {
                $(this).remove();
            })
        }
    })
})
$('.watchButton').on('click', function(event){
	// alert("clicked this bitch")
	event.preventDefault();
	var addToList = $(this);
	// alert($(this).data('imdbcode'));
	$.post('/list', {imdbCode: $(this).data('imdbcode'), title: $(this).data('title'), year: $(this).data('year')}, function(data){
		// alert("is this thing on")
		addToList.closest('input').val("Listed, Jerk").addClass('listedJerk')
	})
})

});



