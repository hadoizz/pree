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
            <tr class="sp-table-item">
                <td>${data['id']}</td>
                <td class="text-center">${data['thumbnail'] ? `<img src="${imageBase}${data['thumbnail']}" class="img-circle elevation-2 sp-table-image">` : ``}</td>
                <td>${data['title']}</td>
                <td>${data['subtitle']}</td>
                <td>${data['created']}</td>                
                <td class="sp-table-item-center">

                    <a href="${baseUrl}/news/edit/${data['id']}" class="btn btn-table-action btn-sm">
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
    $.post(`${baseUrl}/NewsAPI/newsInPage/${page}`, params, function (data) {
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

const onClickDelete = (newsID) => {
    if (confirm("Are you sure?")) {
        $.get(`${baseUrl}/NewsAPI/delete/${newsID}`, function (data) {
            refreshPage(page);
        });
    }
}

const startPage = () => {
    $('#ul_table_pagination_tool').empty();
    $('#ul_table_pagination_tool').hide();
    let params = {
        keyword: keyword
    }
    $.post(`${baseUrl}/NewsAPI/totalPages`, params, function (data) {
        if (data.code == 400) {
            toastr.error('Error while getting total page. Code: 400');
            return;
        }
        totalPage = data.totalPage;
        $('#p_table_total_items').text(`Total: ${data.totalCount} news (${totalPage} pages)`);
        initPage();
        $('#ul_table_pagination_tool').show();
        refreshPage(page);
    });
}

$(function () {
    startPage();
    // $('#div_loading').hide();
    // $('#ul_table_pagination_tool').hide();
    // $.post(`${baseUrl}/StoreAPI/totalPages`, function (data) {
    //     if (data.code == 400) {
    //         toastr.error('Error while getting total page. Code: 400');
    //         return;
    //     }
    //     totalPage = data.totalPage;
    //     $('#p_table_total_items').text(`Total: ${data.totalCount} stores (${totalPage} pages)`);
    //     initPage();
    //     $('#ul_table_pagination_tool').show();
    //     refreshPage(page);
    // });
});