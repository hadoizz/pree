$(function () {
    $("#searchBar").on("keypress", function (e) {
        if (e.which == 13) {
            search($('#searchBar').val());
        }
    });
});