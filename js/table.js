$(document).ready(function() {
    $(".toggle-btn").click(function() {
      $(this).text(function(i, text){
        return text === "+" ? "-" : "+";
      });
      $(this).closest("tr").nextUntil(".macro-strategy").toggleClass("hide");
    });
  });

$(document).ready(function() {
    $(".toggle-btns").click(function() {
      $(this).text(function(i, text){
        return text === "+" ? "-" : "+";
      });
      $(this).closest("tr").nextUntil(".sub-strategy-table").toggleClass("hidea");
    });
  });