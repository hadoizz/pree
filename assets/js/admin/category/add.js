let parent = { id: 0, seo: "" };

const onClickCategory = (id, name, seo) => {
    parent = {
        id, name, seo
    }
    $('#parentCategory').text(name);
}

$(function () {
    $('#div_loading').hide();

    $('#categoryAddThumbnail').click(() => {
        $("input[id='categoryThumbnail']").click();
    });

    $('#categoryThumbnail').change((e) => {
        const [file] = e.target.files
        if (file) {
            $('#categoryAddThumbnail').attr('src', URL.createObjectURL(file));
        }
    })

    $("#btnCreate").click((e) => {
        if ($('#name').val() == "") {
            toastr.error(`Empty field`);
            return;
        }
        $('#div_loading').show();

        let params = new FormData($('#categoryThumbForm')[0]);
        params.append('name', $('#name').val());
        params.append('premium', $('#premium').is(':checked'));
        
        $.ajax({
            type: 'POST',
            cache: false,
            enctype: 'multipart/form-data',
            url: `${baseUrl}/API/createCategory`,
            data: params,
            processData: false,
            contentType: false
        }).done(function (data) {
            if (data.code == 400) {
                toastr.error(`Error while create category. Code: ${data.code}`);
                return;
            }            
            location.href = `${baseUrl}/Admin/category`;
        });
    });
});