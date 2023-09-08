$(function () {
    $(".btnFav").click((e) => {
        e.preventDefault()
        let id = e.target.dataset.id;
        let params = {
            recipeID: id,
        }

        $.post(`${baseUrl}/APIRecipe/userFavRecipe`, params, function (data) {
            $('#div_loading').hide();
            if (data.code == 200) {
                if (data.value == 1) {//Added
                    toastr.success(`Thanks. Added to favorite recipe successfully.`);
                    $('#fav_' + $('#recipeId').val()).removeClass("fa-heart-o");
                    $('#fav_' + $('#recipeId').val()).addClass("fa-heart");
                }
                else {//Removed
                    toastr.success(`Thanks. Removed from favorite recipe successfully.`);
                    $('#fav_' + $('#recipeId').val()).removeClass("fa-heart");
                    $('#fav_' + $('#recipeId').val()).addClass("fa-heart-o");
                }
                setTimeout(() => {
                    location.reload();
                }, "1500");
                return;
            }
            else if (data.code == 400) {
                toastr.error(`Sorry, Invalid login`);
                return;
            }
            else if (data.code == 401) {
                toastr.error(`Sorry, Invalid recipe info`);
                return;
            }
        });
    });
});