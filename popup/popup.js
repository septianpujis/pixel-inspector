$(function () {
  $("#switch").change(function () {
    if ($(`#switch`).prop(`checked`)) {
      console.log(`hit from popup`);
      //toogle dom
    }
  });
});
