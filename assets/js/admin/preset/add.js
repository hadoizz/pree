let parent = { id: 0, seo: "" };

const onClickCategory = (id, name, seo) => {
    parent = {
        id, name, seo
    }
    $('#parentCategory').text(name);
}

$(function () {
    $('#div_loading').hide();

    $('#presetAddThumbnail').click(() => {
        $("input[id='presetThumbnail']").click();
    });

    $('#presetAddThumbnail1').click(() => {
        $("input[id='presetThumbnail1']").click();
    });

    $('#presetAddThumbnail2').click(() => {
        $("input[id='presetThumbnail2']").click();
    });

    $('#presetThumbnail').change((e) => {
        const [file] = e.target.files
        if (file) {
            $('#presetAddThumbnail').attr('src', URL.createObjectURL(file));
        }
    })

    $('#presetThumbnail1').change((e) => {
        const [file] = e.target.files
        if (file) {
            $('#presetAddThumbnail1').attr('src', URL.createObjectURL(file));
        }
    })

    $('#presetThumbnail2').change((e) => {
        const [file] = e.target.files
        if (file) {
            $('#presetAddThumbnail2').attr('src', imageBase + "/assets/images/check.png");
        }
    })

    $("#btnCreate").click((e) => {
        if ($('#name').val() == "") {
            toastr.error(`Empty field`);
            return;
        }
        $('#div_loading').show();

        let params = new FormData($('#presetThumbForm')[0]);
        params.append('name', $('#name').val());
        params.append('usage', $('#usage').val());
        params.append('category', $('#category').val());
        params.append('feature', $('#feature').is(':checked'));
        params.append('discover', $('#discover').is(':checked'));
        params.append('premium', $('#premium').is(':checked'));
        
        $.ajax({
            type: 'POST',
            cache: false,
            enctype: 'multipart/form-data',
            url: `${baseUrl}/API/createPreset`,
            data: params,
            processData: false,
            contentType: false
        }).done(function (data) {
            if (data.code == 400) {
                toastr.error(`Error while create preset. Code: ${data.code}`);
                return;
            }            
            location.href = `${baseUrl}/Admin/presets`;
        });
    });
});