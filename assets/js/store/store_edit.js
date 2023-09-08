let currentTab = "main";

let mainAddress;
let additionalAddress;
let countryArr = [];
let selectedAddressIndex = -1;
let features = [];
let brands = [];
let pendingBrands = [];

const getViewDatas = (tab) => {
    let datas = {};
    switch (tab) {
        case "main":
            datas['active'] = $(".sp-store-active.active").hasClass('sp-on') ? 1 : 0;
            datas['variant'] = $(".sp-store-variant.active").hasClass('sp-on') ? "full" : "simple";
            datas['featured'] = $(".sp-store-feature.active").hasClass('sp-on') ? 1 : 0;
            datas['en'] = getMainContentByLang('en');
            datas['it'] = getMainContentByLang('it');
            break;
        case "address":
            saveAddress();
            datas['location'] = $(".sp-v-physical").hasClass('active') ? "physical" : $(".sp-v-local").hasClass('active') ? "local" : "international";
            datas['main'] = mainAddress;
            datas['additional'] = additionalAddress;
            break;
        case "social":
            datas['fb'] = $("#storeFb").val();
            datas['twitter'] = $("#storeTw").val();
            datas['pin'] = $("#storePin").val();
            datas['insta'] = $("#storeInsta").val();
            datas['vimeo'] = $("#storeVimeo").val();
            datas['youtube'] = $("#storeYouTube").val();
            datas['snapchat'] = $("#storeSnapchat").val();
            datas['tumblr'] = $("#storeTumblr").val();
            break;
        case "instagram":
            datas['instagram'] = $("#storeInstaFeed").val();
            break;
        case "features":
            datas['features'] = features;
            break;
        case "brands":
            datas['brands'] = brands;
            break;
        case "other":
            datas['founded'] = $("#storeFoundYear").val();
            break;
    }
    return datas;
}

const saveContent = (tab, isToast = false) => {
    let params = new FormData($('#storeLogoForm')[0]);
    params.append('storeID', $('#storeID').val());
    params.append('view', tab);
    params.append('datas', JSON.stringify(getViewDatas(tab)));
    console.log(JSON.stringify(getViewDatas(tab)));
    $.ajax({
        type: 'POST',
        cache: false,
        enctype: 'multipart/form-data',
        url: `${baseUrl}/StoreAPI/saveStoreInfo`,
        data: params,
        processData: false,
        contentType: false
    }).done(function (data) {
        if (data.code == 400) {
            toastr.error(`${data.message ? data.message : "Error while save content"} Code: 400`);
            return;
        }
        if (isToast) {
            toastr.success("Store contents save successfully!");
            refreshContent(currentTab);
        }
        $('#div_loading').hide();
    });
}

const refreshContent = (tab) => {
    $('.sp-tab-section').hide();
    $(`#${tab}Section`).show();

    let params = {
        storeID: $('#storeID').val(),
        view: tab
    }

    $.post(`${baseUrl}/StoreAPI/storeInfo`, params, function (data) {
        if (data.code == 400) {
            toastr.error('Error while getting store Info. Code: 400');
            return;
        }
        switch (tab) {
            case "main":
                refreshMain(data);
                break;
            case "address":
                refreshAddress(data);
                break;
            case "social":
                refreshSocial(data);
                break;
            case "instagram":
                refreshInstagram(data);
                break;
            case "photos":
                refreshPhotos(data);
                break;
            case "brands":
                refreshBrands(data);
                break;
            case "features":
                refreshFeatures(data);
                break;
            case "other":
                refreshOther(data);
                break;
        }
        $('#div_loading').hide();
    });
}

const refreshBrands = (data) => {
    $('#brandContents').empty();
    $('#brandTagsSelected').empty();
    brands = [];
    for (let k = 0; k < data.selected.length; k++) {
        brands.push(parseInt(data.selected[k].checked));
    }
    let brandText = "";
    for (let i = 0; i < data.tags.length; i++) {
        brandText = brandText + data.tags[i].name + ",";
        $(`#brandTagsSelected`).append(`
        <div class="sp-brand-tag-selected" data-id="${data.tags[i].id}">
            <label class="sp-address-item-text">${data.tags[i].name}</label>
            <i data-id="${data.tags[i].id}" class="sp-brand-item-close-icon fa fa-close"></i>
        </div>
        `);
    }

    if (brandText.length > 0) {
        $('#inputBrandTags').val(brandText.slice(0, -1));
    }

    for (let i = 0; i < data.brands.length; i++) {
        let brandPrefix = data.brands[i].brand_name.charAt(0);
        if ($(`#store_brand_${brandPrefix.toLowerCase().charCodeAt(0)}`).length == 0) {
            $("#brandContents").append(`
                <div class="card card-outline sp-card-top-line">
                    <div class="card-header">
                        <h3 class="card-title">${brandPrefix}</h3>
                    </div>
                    <div class="card-body row" data-feature="${data.brands[i].brand_id}" id="store_brand_${brandPrefix.toLowerCase().charCodeAt(0)}">
                        
                    </div>
                </div>
            `);
        }
        let activeClass = '';
        if (brands.indexOf(parseInt(data.brands[i].brand_id)) > -1) {
            activeClass = "active";
        }
        $(`#store_brand_${brandPrefix.toLowerCase().charCodeAt(0)}`).append(`
            <div class="col-md-3">
                <div class="sp-brand-item ${activeClass}" data-id="${data.brands[i].brand_id}">
                    <p class="sp-brand-item-text">${data.brands[i].brand_name}</p>
                </div>
            </div>
        `);
    }
}

const refreshFeatures = (data) => {
    $('#featureContents').empty();
    features = [];
    for (let k = 0; k < data.selected.length; k++) {
        features.push(parseInt(data.selected[k].checked));
    }
    for (let i = 0; i < data.features.length; i++) {
        $("#featureContents").append(`
            <div class="card card-outline sp-card-top-line">
                <div class="card-header">
                    <h3 class="card-title">${data.features[i].featureName}</h3>
                </div>
                <div class="card-body row" data-feature="${data.features[i].featureId}" id="store_feature_${data.features[i].featureId}">
                    
                </div>
            </div>
        `);
        for (let j = 0; j < data.features[i].featureValues.length; j++) {
            let activeClass = '';
            if (features.indexOf(parseInt(data.features[i].featureValues[j].value_id)) > -1) {
                activeClass = "active";
            }
            $(`#store_feature_${data.features[i].featureId}`).append(`
                <div class="col-md-3">
                    <div class="sp-feature-item ${activeClass}" data-id="${data.features[i].featureValues[j].value_id}">
                        <p class="sp-feature-item-text">${data.features[i].featureValues[j].value_name}</p>
                    </div>
                </div>
            `);
        }
    }
}

const refreshOther = (data) => {
    $('#featureContents')
}

const refreshPhotos = (data) => {
    $('#storePhotos').empty();
    for (let i = 0; i < data.photos.length; i++) {
        $("#storePhotos").append(`
            <div class="sp-store-image-container" data-id="${data.photos[i].id}">
                <img src="${imageBase + data.photos[i].image_link}" class="sp-store-photo-img"/>
                <button onclick="onDeletePhoto(${data.photos[i].id})"
                    class="btn btn-table-action btn-sm sp-btn-overlay-delete">
                    <i class="fa fa-trash"></i>
                </button>
            </div>
        `);
    }
}

const onDeletePhoto = (id) => {
    if (confirm("Are you sure?")) {
        $('#div_loading').show();
        let params = {
            storeID: $('#storeID').val(),
            imgID: id
        }
        $.post(`${baseUrl}/StoreAPI/deleteStorePhoto`, params, function (data) {
            if (data.code == 400) {
                toastr.error(`${data.message ? data.message : "Error while delete photo"} Code: 400`);
                return;
            }
            $('#div_loading').hide();
            refreshContent(currentTab);
        });
        //location.href = "<?php echo base_url(); ?>index.php/employee/actionDelete/" + userID;
    }
}

const refreshInstagram = (data) => {
    $('#storeInstaFeed').val(data.instagram.instagram_feed);
}

const refreshSocial = (data) => {
    $('#storeFb').val(data.social.facebook_url);
    $('#storeTw').val(data.social.twitter_url);
    $('#storePin').val(data.social.pinterest_url);
    $('#storeInsta').val(data.social.instagram_url);
    $('#storeVimeo').val(data.social.vimeo_url);
    $('#storeYouTube').val(data.social.youtube_url);
    $('#storeSnapchat').val(data.social.snapchat_url);
    $('#storeTumblr').val(data.social.tumblr_url);
}

const refreshAddress = (data) => {
    selectedAddressIndex = -1;
    $("#store-address-group").empty();
    countryArr = data.countries;
    if (data.main.length > 0) {
        mainAddress = data.main[0];
        $("input[name='storeAddressType']").removeAttr("checked");
        $(".sp-store-active").removeClass('active');
        $(`.sp-store-location.sp-v-${mainAddress.store_location}`).addClass('active');
        $(`input[name='storeAddressType'][value='${mainAddress.store_location}']`).attr("checked", true);
        addAddressMenu('Main', 0, true);
    }
    additionalAddress = data.additional;
    for (let i = 0; i < additionalAddress.length; i++) {
        addAddressMenu('Address' + (i + 1), i + 1);
    }
    $('#storeAddressTitle').text("Main Address");
    selectedAddressIndex = 0;
    refreshStoreAddress(mainAddress);
}

const refreshStoreAddress = (address) => {
    $('#store_address_country').empty();
    $("#store_address_country").append(`
        <option selected value='0'>None</option>
    `);
    for (let i = 0; i < countryArr.length; i++) {
        if (countryArr[i].country_id == address?.country_id) {
            $("#store_address_country").append(`
                <option selected value='${countryArr[i].country_id}'>${countryArr[i].name}</option>
            `);
        }
        else {
            $("#store_address_country").append(`
                <option value='${countryArr[i].country_id}'>${countryArr[i].name}</option>
            `);
        }
    }

    $('#storeStreet').val(address?.street || "");
    $('#storePostcode').val(address?.post_code || "");
    $('#storeWebsite').val(address?.website || "");
    $('#storeEmail').val(address?.email || "");
    $('#storePhone').val(address?.phone || "");

    $('#storeOpenMon').val(address?.monday || "");
    $('#storeOpenTue').val(address?.tuesday || "");
    $('#storeOpenWed').val(address?.wednesday || "");
    $('#storeOpenThu').val(address?.thursday || "");
    $('#storeOpenFri').val(address?.friday || "");
    $('#storeOpenSat').val(address?.saturday || "");
    $('#storeOpenSun').val(address?.sunday || "");
    $('#storeShortNotify').val(address?.mon_fri || "");

    $('#store_address_id').val(address?.id || "");

    refreshCity(address?.country_id || 0, address?.city_id);
}

const refreshCity = (countryId, selected = 0) => {
    $('#store_address_city').empty();
    $("#store_address_city").append(`
        <option selected value='0'>None</option>
    `);
    if (countryId == 0) return [];
    let params = {
        country: countryId
    };
    $.post(`${baseUrl}/StoreAPI/cityFromCountry`, params, function (data) {
        if (data.code == 400) {
            toastr.error(`${data.message ? data.message : "Error while save content"} Code: 400`);
            return;
        }
        for (let i = 0; i < data.city.length; i++) {
            if (data.city[i].city_id == selected) {
                $("#store_address_city").append(`
                    <option selected value='${data.city[i].city_id}'>${data.city[i].name}</option>
                `);
            }
            else {
                $("#store_address_city").append(`
                    <option value='${data.city[i].city_id}'>${data.city[i].name}</option>
                `);
            }
        }
    });
}

const addAddressMenu = (name, index, isActive = false) => {
    $("#store-address-group").append(`
        <div data-index="${index}" class="sp-address-list-item ${isActive ? 'active' : ''}">
            <label data-index="${index}" class="sp-address-item-text">${name}</label>
            ${index == 0 ? "" : `<i data-id="${additionalAddress[index - 1] ? additionalAddress[index - 1].id : ""}" class="sp-address-item-icon fa fa-close"></i>`
        }
        </div>
    `);
}
const refreshMain = (data) => {
    $('#storeLink').text(data.storeLink);
    $('#storeLink').attr('href', data.storeLink);

    $("input[name='storeActive']").removeAttr("checked");
    $(".sp-store-active").removeClass('active');
    if (data.info.active == "1") {
        $(".sp-store-active.sp-on").addClass('active');
        $("input[name='storeActive'][value='1']").attr("checked", true);
    }
    else {
        $(".sp-store-active.sp-off").addClass('active');
        $("input[name='storeActive'][value='0']").attr("checked", true);
    }

    $("input[name='storeVariant']").removeAttr("checked");
    $(".sp-store-variant").removeClass('active');
    if (data.info.variant == "full") {
        $(".sp-store-variant.sp-on").addClass('active');
        $("input[name='storeVariant'][value='full']").attr("checked", true);
    }
    else {
        $(".sp-store-variant.sp-off").addClass('active');
        $("input[name='storeVariant'][value='simple']").attr("checked", true);
    }

    if (data.info.logo) {
        $('#store_logo').attr('src', imageBase + data.info.logo);
    }

    refreshVariant(data.info.variant);


    $("input[name='storeFeature']").removeAttr("checked");
    $(".sp-store-feature").removeClass('active');
    if (data.info.is_featured == "1") {
        $(".sp-store-feature.sp-on").addClass('active');
        $("input[name='storeFeature'][value='1']").attr("checked", true);
    }
    else {
        $(".sp-store-feature.sp-off").addClass('active');
        $("input[name='storeFeature'][value='0']").attr("checked", true);
    }

    refreshMainContentByLang('en', data.en);
    refreshMainContentByLang('it', data.it);
}

const refreshMainContentByLang = (lang, data) => {
    $(`#${lang}_store_name`).val(data.name);
    $(`#${lang}_store_short_description`).text(data.short_description);
    $(`#${lang}_store_full_description`).text(data.description);
    $(`#${lang}_store_interview`).text(data.interview);
    $(`#${lang}_store_special_news`).text(data.special_news);
}

const getMainContentByLang = (lang) => {
    return {
        name: $(`#${lang}_store_name`).val(),
        short_description: $(`#${lang}_store_short_description`).val(),
        description: $(`#${lang}_store_full_description`).val(),
        interview: $(`#${lang}_store_interview`).val(),
        special_news: $(`#${lang}_store_special_news`).val(),
    }
}

const refreshVariant = (value) => {
    if (value == "full") {
        $('.sp-full-variant-group').show();
    }
    else {
        $('.sp-full-variant-group').hide();
    }
}

const saveAddress = () => {
    if (selectedAddressIndex == -1) return;
    let location = $(".sp-v-physical").hasClass('active') ? "physical" : $(".sp-v-local").hasClass('active') ? "local" : "international";
    let address = {
        id: $('#store_address_id').val(),
        street: $('#storeStreet').val(),
        post_code: $('#storePostcode').val(),
        phone: $('#storePhone').val(),
        email: $('#storeEmail').val(),
        website: $('#storeWebsite').val(),
        store_location: location,
        is_default: 0,
        monday: $('#storeOpenMon').val(),
        tuesday: $('#storeOpenTue').val(),
        wednesday: $('#storeOpenWed').val(),
        thursday: $('#storeOpenThu').val(),
        friday: $('#storeOpenFri').val(),
        saturday: $('#storeOpenSat').val(),
        sunday: $('#storeOpenSun').val(),
        mon_fri: $('#storeShortNotify').val(),
        country_id: $('#store_address_country').val(),
        city_id: $('#store_address_city').val(),

    }
    if (selectedAddressIndex == 0) {
        address.is_default = 1;
        mainAddress = address;
    }
    else {
        additionalAddress[selectedAddressIndex - 1] = address;
    }
}

const checkPendingBrands = () => {
    const pending = pendingBrands.filter((item) => item.checked == 0)
    $('#saveBrandForm').hide();
    if (!pending || pending.length == 0) {
        $('#saveBrandForm').show();
        return;
    }    
}

$(function () {
    refreshContent("main");
    $("input[name='editTab']").change((e) => {
        $('#div_loading').show();
        saveContent(currentTab);
        refreshContent(e.target.value);
        currentTab = e.target.value;
    });

    $("input[name='storeVariant']").change((e) => {
        refreshVariant(e.target.value);
    });

    $("#btnSave").click(() => {
        $('#div_loading').show();
        saveContent(currentTab, true);
    })

    $('#store_logo').click(() => {
        $("input[id='filePicker']").click();
    })
    $('#filePicker').change((e) => {
        const [file] = e.target.files
        if (file) {
            $('#store_logo').attr('src', URL.createObjectURL(file));
        }
    })
    $('#storeNewAddress').click(() => {
        additionalAddress.push(null)
        addAddressMenu('Address' + (additionalAddress.length), additionalAddress.length);
        // refreshStoreAddress(additionalAddress[additionalAddress.length - 1]);
    });

    $('#store_address_country').change((e) => {
        let countryId = $('#store_address_country').val();
        refreshCity(countryId);
    });

    $("input[name='storeAddressType']").change((e) => {
        if (e.target.value == "physical") {
            $('.sp-address-inter-group').show();
            $('.sp-address-online-group').show();
        }
        else if (e.target.value == "local") {
            $('.sp-address-inter-group').show();
            $('.sp-address-online-group').hide();
        }
        else if (e.target.value == "international") {
            $('.sp-address-inter-group').hide();
        }
    });

    $("#store-address-group").on("click", "div.sp-address-list-item", function (e) {
        saveAddress();
        const index = e.target.dataset.index;
        selectedAddressIndex = index;
        $('.sp-address-list-item').removeClass('active');
        $(`.sp-address-list-item[data-index="${index}"]`).addClass('active');
        if (index == 0) {
            $('#storeAddressTitle').text("Main Address");
            refreshStoreAddress(mainAddress);
        }
        else {
            $('#storeAddressTitle').text("Additional Address" + index);
            refreshStoreAddress(additionalAddress[index - 1]);
        }
    });

    $("#store-address-group").on("click", "div>.sp-address-item-icon", function (e) {
        if (confirm("Are you sure?")) {
            let addressID = $(this).data('id');
            if (addressID) {
                $('#div_loading').show();
                let params = {
                    storeID: $('#storeID').val(),
                    addressID: addressID
                }
                $.post(`${baseUrl}/StoreAPI/deleteStoreAddress`, params, function (data) {
                    $('#div_loading').hide();
                    refreshContent(currentTab);
                });
            }
            else {
                refreshContent(currentTab);
            }
        }        
    });

    $("#brandTagsSelected").on("click", "div>.sp-brand-item-close-icon", function (e) {
        e.preventDefault();
        if (confirm("Are you sure?")) {
            let brandID = $(this).data('id');
            console.log(brandID);
            if (brandID) {
                $('#div_loading').show();
                let params = {
                    id: brandID
                }
                $.post(`${baseUrl}/StoreAPI/deleteBrandTag`, params, function (data) {
                    $('#div_loading').hide();
                    refreshContent(currentTab);
                });
            }
            else {
                refreshContent(currentTab);
            }
        }
        e.stopPropagation();
    });

    $("#featureContents").on("click", "div.sp-feature-item", function (e) {
        const index = $(this).data('id');
        if ($(this).hasClass('active')) {
            $(this).removeClass('active');
            features.splice(features.indexOf(index), 1);
        } else {
            $(this).addClass('active');
            features.push(index);
        }
    });

    $("#brandContents").on("click", "div.sp-brand-item", function (e) {
        const index = $(this).data('id');
        if ($(this).hasClass('active')) {
            $(this).removeClass('active');
            brands.splice(brands.indexOf(index), 1);
        } else {
            $(this).addClass('active');
            brands.push(index);
        }
    });


    $('#storeAddNewPhoto').click(() => {
        $("input[id='photoPicker']").click();
    })


    $('#photoPicker').change((e) => {
        const [file] = e.target.files
        if (file) {
            let params = new FormData($('#storePhotoForm')[0]);
            params.append('storeID', $('#storeID').val());
            $.ajax({
                type: 'POST',
                cache: false,
                enctype: 'multipart/form-data',
                url: `${baseUrl}/StoreAPI/uploadStorePhoto`,
                data: params,
                processData: false,
                contentType: false,
                success: function (data) {
                    if (data.code == 400) {
                        toastr.error(`${data.message ? data.message : "Error while upload photo"} Code: 400`);
                        return;
                    }
                    toastr.success("Photo uploaded successfully!");
                    // $('#photoPicker').val(null);
                    $('#div_loading').hide();
                    refreshContent(currentTab);
                },
                error: function (error) {
                    console.log(error);
                    toastr.error(`Error while upload photo"} Code: 400`);
                    return;
                }
            });
        }
    })

    let orgRow = [];
    let selectedRow = [];
    $("#storePhotos").sortable({
        delay: 100,
        start: function () {
            orgRow = [];
            $('.sp-store-image-container').each(function (e) {
                if ($(this) && $(this).data('id'))
                    orgRow.push($(this).data('id'));
            });
        },
        stop: function () {
            selectedRow = [];
            $('.sp-store-image-container').each(function (e) {
                selectedRow.push($(this).data('id'));
            });
            let params = {
                new: JSON.stringify(selectedRow)
            }
            $.post(`${baseUrl}/StoreAPI/replaceStoreImageOrder`, params, function (data) {
                refreshContent(currentTab);
            });
        }
    })

    $('#btnBrandTagValidate').click(() => {
        $('#brandValidateForm').hide();
        if ($('#inputBrandTags').val() == "") return;
        $('#div_modal_loading').show();
        let params = {
            storeID: $('#storeID').val(),
            brands_comma_separated: $('#inputBrandTags').val()
        }
        $.post(`${baseUrl}/StoreAPI/validateBrands`, params, function (data) {
            $('#div_modal_loading').hide();
            if (data.code == 400) {
                toastr.error(`${data.message ? data.message : "Error while save content"} Code: 400`);
                return;
            }            
            if (data.brands.length > 0) {
                $('#brandValidateForm').empty();
                $('#brandValidateForm').show();
                data.brands.forEach((brand) => {
                    pendingBrands.push({name: brand, checked: 0});
                    $('#brandValidateForm').append(
                        `<div class="input-group sp-validate-form">
                            <p class="form-control sp-validate-text" style="background: #463940;border-color: #463940;"
                                id="pending-${brand}">${brand}</p>
                            <span class="input-group-append">
                                <button type="button" data-name="${brand}" class="btn btn-info sp-reject-btn" id="btnBrandTagReject">Reject</button>
                                <button type="button" data-name="${brand}" class="btn btn-info sp-accept-btn" id="btnBrandTagAccept">Accept</button>
                            </span>
                        </div>`
                    );
                })                
                // $('#brandValidateForm').css('display', 'flex');
                // $('#invalidBrands').text(data.brands.join());
            }
            else {
                $('#inputBrandTags').val("");
                refreshContent(currentTab);
            }
        });
    })

    $('#brandTagsSelected').click(() => {
        $('#div_modal_loading').hide();
        $('#modalBrands').modal('show');
        pendingBrands = [];
        $('#saveBrandForm').hide();
        return true;
    });

    $('#btnBrandTagSave').click(() => {
        $('#brandValidateForm').hide();
        if ($('#inputBrandTags').val() == "") return;
        $('#div_modal_loading').show();
        let rejectedBrands = [];
        pendingBrands.map((item) => {
            if (item.checked == 1) {
                rejectedBrands.push(item.name);
            }
        })
        let params = {
            storeID: $('#storeID').val(),
            brands_comma_separated: $('#inputBrandTags').val(),
            brands_rejected: rejectedBrands.join()
        }
        $.post(`${baseUrl}/StoreAPI/saveBrands`, params, function (data) {
            $('#div_modal_loading').hide();
            if (data.code == 400) {
                toastr.error(`${data.message ? data.message : "Error while save brand"} Code: 400`);
                return;
            }
            $('#inputBrandTags').val("");
            $('#modalBrands').modal('hide');
            refreshContent(currentTab);
        });
    })

    $('#btnBrandTagAccept').click(() => {
        $('#brandValidateForm').hide();
        if ($('#inputBrandTags').val() == "") return;
        $('#div_modal_loading').show();
        let params = {
            storeID: $('#storeID').val(),
            brands_comma_separated: $('#inputBrandTags').val()
        }
        $.post(`${baseUrl}/StoreAPI/acceptBrands`, params, function (data) {
            $('#div_modal_loading').hide();
            if (data.code == 400) {
                toastr.error(`${data.message ? data.message : "Error while save brand"} Code: 400`);
                return;
            }
            $('#inputBrandTags').val("");
            $('#modalBrands').modal('hide');
            refreshContent(currentTab);
        });
    })

    $("#brandValidateForm").on("click", "button.sp-reject-btn", function (e) {
        const brand = e.target.dataset.name;
        $(`#pending-${brand}`).css('background', '#641025');
        pendingBrands = pendingBrands.map((item) => {
            if (item.name == brand) {
                item.checked = 1;
            }
            return item;
        });
        checkPendingBrands();
    });

    $("#brandValidateForm").on("click", "button.sp-accept-btn", function (e) {
        const brand = e.target.dataset.name;
        $(`#pending-${brand}`).css('background', '#2cab53');
        pendingBrands = pendingBrands.map((item) => {
            if (item.name == brand) {
                item.checked = 2;
            }
            return item;
        });
        checkPendingBrands();
    });

});