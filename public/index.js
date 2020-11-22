// Delete item when checkbox is clicked
$("checkbox").change(function(){
  this.form.submit();
});

// Add hover effects to buttons
$(".back-btn, .add-btn, .delete-btn, .create-list-btn").hover(function(){
  $(this).addClass("button-hover");
}, function(){
  $(this).removeClass("button-hover");
});

// Add focus and blur effects on textbox
$("input[type='text']").focus(function(){
  $(this).addClass("textbox-focus");
});

$("input[type='text']").blur(function(){
  $(this).removeClass("textbox-focus");
});
