const onClickCategory = (id) => {
    location.href = `${baseUrl}/Admin/category${type}Edit/${id}`;
}

$(function () {
    $('#categoryTree').Treeview()
});