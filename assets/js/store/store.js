let sortField = "id";
let sortOrder = 1;
let keyword = '';

const initPage = () => {
    pageShow = Math.min(5, totalPage);
    $("#ul_table_pagination_tool").append(`<li class="page-item"><a class="page-link sp-page-color" href="#" onclick="onPrevClick()">«</a></li>`);
    for (let i = 0; i < pageShow; i++) {
        $("#ul_table_pagination_tool").append(`<li class="page-item page-numbers" data-page="${pageStart + i}"><a class="page-link sp-page-color page-number-item" data-hrefpage="${i}" href="#">${i + 1}</a></li>`);
    }
    $("#ul_table_pagination_tool").append(`<li class="page-item"><a class="page-link sp-page-color" href="#" onclick="onNextClick()">»</a></li>`);

    $('.page-number-item').click((e) => {
        onPageClick(parseInt(e.target.dataset.hrefpage));
    });
}

const loadPageItems = (datas) => {
    $('#table_content').empty();
    datas.forEach(function (data) {
        $('#table_content').append(`
            <tr class="sp-table-item ${data['active'] == 1 ? "" : "sp-table-disable-row"}">
                <td>${data['id']}</td>
                <td class="text-center">${data['logo'] ? `<img src="${imageBase}/${data['logo']}" class="img-circle elevation-2 sp-table-image">` : ``}</td>
                <td>${data['sname']}</td>
                <td>${data['city_name'] ? data['city_name'] : ''}</td>
                <td>${data['country_name'] ? data['country_name'] : ''}</td>                
                <td>${data['created']}</td>
                <td>${data['modified']}</td>
                <td class="sp-table-item-center">${data['recommend_id'] ? `<i class='sp-icon fa fa-thumbs-up'>` : `<i class='sp-icon sp-table-disable-row fa fa-thumbs-up'>`}</td>
                <td class="sp-table-item-center">${data['variant'] == "full" ? `<i class='sp-icon fa fa-file-text'>` : `<i class='sp-icon sp-table-disable-row fa fa-file-text'>`}</td>
                <td class="sp-table-item-center">${data['is_featured'] ? `<i class='sp-icon fa fa-bookmark'>` : `<i class='sp-icon sp-table-disable-row fa fa-bookmark'>`}</td>
                <td class="sp-table-item-center">
                    <button class="btn btn-table-action btn-sm" onclick="onClickRecommend(${data['id']})">
                        <i class="fa ${data['recommend_id'] ? "fa-thumbs-o-up" : "fa-thumbs-up"}"></i>
                    </button>

                    <a href="${baseUrl}/store/edit/${data['id']}" class="btn btn-table-action btn-sm">
                        <i class="fa fa-pencil"></i>
                    </a>

                    <button id="" class="btn btn-table-action btn-sm" onclick="onClickDelete(${data['id']})">
                        <i class="fa fa-trash"></i>
                    </button>
                </td>
            </tr>
        `);
    });
    $('#table_content').append();
}

const refreshPage = (page) => {
    let params = {
        order_field: sortField,
        direction: sortOrder,
        keyword: keyword
    }
    $('#div_loading').show();
    $.post(`${baseUrl}/StoreAPI/storesInPage/${page}`, params, function (data) {
        if (data.code != 200) {
            toastr.error(`Error while loading page. Code: ${data.code}`);
            return;
        }
        loadPageItems(data.datas);

        $('.page-item').removeClass("active");
        $('*[data-page="' + page + '"]').addClass("active");
        $('#div_loading').hide();
    });
};

const onClickRecommend = (storeID) => {
    $('#div_loading').show();
    $.post(`${baseUrl}/StoreAPI/recommend/${storeID}`, function (data) {
        if (data.code != 200) {
            toastr.error(`Error while loading page. Code: ${data.code}`);
            return;
        }
        toastr.success(data.message);
        refreshPage(page);
    });
}

const onClickDelete = (storeID) => {
    if (confirm("Are you sure?")) {
        $.get(`${baseUrl}/StoreAPI/delete/${storeID}`, function (data) {            
            refreshPage(page);
        });
    }
}

const search = (k) => {
    keyword = k;
    sortField = "name";
    page = 1;
    startPage();
}

const startPage = () => {
    $('#ul_table_pagination_tool').empty();
    $('#ul_table_pagination_tool').hide();
    let params = {
        keyword: keyword
    }
    $.post(`${baseUrl}/StoreAPI/totalPages`, params, function (data) {
        if (data.code == 400) {
            toastr.error('Error while getting total page. Code: 400');
            return;
        }
        totalPage = data.totalPage;
        $('#p_table_total_items').text(`Total: ${data.totalCount} stores (${totalPage} pages)`);
        initPage();
        $('#ul_table_pagination_tool').show();
        refreshPage(page);
    });
}

$(function () {
    startPage();
});