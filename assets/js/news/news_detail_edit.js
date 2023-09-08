let currentTab = "eng";
let tags = [];

const refreshContent = (tab) => {
    $('.sp-tab-section').hide();
    $(`#${tab}Section`).show();

}

const getViewDatas = (tab) => {
    let datas = {
        tags: tags,
        author: $('#news_author').val(),
        en: {
            slug: $('#news_slug_en').val(),
            title: $('#news_title_en').val(),
            subtitle: $('#news_subtitle_en').val(),
            content: $('#news_content_eng').summernote('code')
        },
        it: {
            slug: $('#news_slug_it').val(),
            title: $('#news_title_it').val(),
            subtitle: $('#news_subtitle_it').val(),
            content: $('#news_content_ita').summernote('code')
        }
    };
    return datas;
}

const saveContent = (isToast = false) => {
    let params = new FormData($('#newsThumbForm')[0]);
    params.append('datas', JSON.stringify(getViewDatas()));
    params.append('newsID', $('#newsID').val());
    $.ajax({
        type: 'POST',
        cache: false,
        enctype: 'multipart/form-data',
        url: `${baseUrl}/NewsAPI/updateNews`,
        data: params,
        processData: false,
        contentType: false
    }).done(function (data) {
        if (data.code == 400) {
            toastr.error(`${data.message ? data.message : "Error while update news"} Code: 400`);
            return;
        }
        if (isToast) {
            toastr.success("News updated successfully!");
            location.href = "/admin/index.php/news/";
        }
        $('#div_loading').hide();
    });
}
const searchNewsTag = (keyword) => {
    $("#newsFoundTags").empty();
    $.get(`${baseUrl}/NewsAPI/searchTags/${keyword}`, function (data) {
        if (data.brands.length == 0 && data.stores.length == 0) {
            $('#newsFoundTags').hide();
        }
        else {            
            $('#newsFoundTags').show();
            data.brands.forEach((item) => {
                $("#newsFoundTags").append(`
                    <p data-type="brand" data-index="${item.brand_id}" data-name="${item.name}" class="sp-news-found-tag-item">${item.name}</p>
                `);
            })
            data.stores.forEach((item) => {
                $("#newsFoundTags").append(`
                    <p data-type="${item.store_type == 26 ? "store" : "showroom"}" data-name="${item.name}" data-index="${item.store_id}" class="sp-news-found-tag-item">${item.name}</p>
                `);
            })
        }
        refreshContent(currentTab);
    });
}

const loadNewsContent = (newsID) => {
    let params = {
        newsID: newsID
    }
    $.post(`${baseUrl}/NewsAPI/newsInfo`, params, function (data) {
        if (data.code == 400) {
            toastr.error(`${data.message ? data.message : "Error while loading info"} Code: 400`);
            return;
        }
        $('#news_slug_en').val(data.en.slug);
        $('#news_slug_it').val(data.it.slug);

        $('#news_title_en').val(data.en.title);
        $('#news_title_it').val(data.it.title);

        $('#news_subtitle_en').val(data.en.subtitle);
        $('#news_subtitle_it').val(data.it.subtitle);

        $("#news_content_eng").summernote("code", data.en.content);
        $("#news_content_ita").summernote("code", data.it.content);

        $('#newsAddThumbnail').attr('src', imageBase + data.info.thumbnail);

        $('#news_author').val(data.info.author);

        //init tags
        data.tags.map((tag) => {
            // if 
            tags.push({type: tag.type, name: tag.name, id: tag.id});
            $(`#newsTagContainer`).append(`
                <div class="sp-brand-tag-selected" data-key="${tag.type}-${tag.id}" data-type="${tag.type}" data-id="${tag.id}">
                    <label class="sp-address-item-text">${tag.name}</label>
                    <i data-id="${tag.id}" data-type="${tag.type}" class="sp-brand-item-close-icon fa fa-close"></i>
                </div>
            `);  
        })
    });
}

$(function () {
    refreshContent("eng");
    loadNewsContent($('#newsID').val());
    
    $("input[name='newsTab']").change((e) => {
        // $('#div_loading').show();
        //saveContent(currentTab);
        refreshContent(e.target.value);
        currentTab = e.target.value;
    });

    $('#div_loading').hide();
    $("#btnSave").click(() => {
        $('#div_loading').show();
        saveContent(true);
    })

    $('#newsAddThumbnail').click(() => {
        $("input[id='newsThumbnail']").click();
    });

    $('#newsThumbnail').change((e) => {
        const [file] = e.target.files
        if (file) {
            $('#newsAddThumbnail').attr('src', URL.createObjectURL(file));
        }
    })

    var tagTimer = undefined;
    $( "#news_tag" ).on( "keydown", function() {
        if ($('#news_tag').val().length > 2) {
            if (tagTimer != undefined)
            {
                window.clearTimeout(tagTimer);
            }
            tagTimer = window.setTimeout(function(){
                console.log('Keyword', $('#news_tag').val());
                searchNewsTag($('#news_tag').val());
            }, 250); 
        }
        else if ($('#news_tag').val() == '') {
            $('#newsFoundTags').hide();
        }
    } );
    
    $("#newsFoundTags").on("click", "p.sp-news-found-tag-item", function (e) {
        const index = e.target.dataset.index;
        const name =  e.target.dataset.name;
        const type = e.target.dataset.type;        

        const filteredTags = tags.filter((item) => {
            if (item.id == index && item.type == type) {
                return item;
            }
        });

        $('#newsFoundTags').hide();
        $('#news_tag').val('');
        if (!filteredTags) {
            return;
        }        
        tags.push({type, name, id: index});
        $(`#newsTagContainer`).append(`
        <div class="sp-brand-tag-selected" data-type="${type}" data-key="${type}-${index}" data-id="${index}">
            <label class="sp-address-item-text">${name}</label>
            <i data-id="${index}" data-type="${type}" class="sp-brand-item-close-icon fa fa-close"></i>
        </div>
        `);        
    });


    $("#newsTagContainer").on("click", "div>.sp-brand-item-close-icon", function (e) {
        e.preventDefault();
        if (confirm("Are you sure?")) {
            let id = $(this).data('id');
            let type = $(this).data('type');
            tags.forEach((tag, index) => {
                if (tag.type == type && tag.id == id) {
                    tags.splice(index, 1);
                    return;
                }
            })
            $(`.sp-brand-tag-selected[data-key="${type}-${id}"]`).remove();
        }
        e.stopPropagation();
    });


});