<div class="content-wrapper">
    <!-- Main content -->
    <section class="content">
        <div class="row sp-tab-section">
            <div class="col-md-12">
                <div class="form-group">
                    <label>Old Password</label>
                    <input type="password" id="pw_old" class="form-control" placeholder="Old Password">
                </div>

                <div class="form-group">
                    <label>New Password</label>
                    <input type="password" id="pw_new" class="form-control" placeholder="New Password">
                </div>

                <div class="form-group">
                    <label>Confirm Password</label>
                    <input type="password" id="pw_confirm" class="form-control" placeholder="Confirm Password">
                </div>
            </div>
            <button type="button" id="btnPasswordChange" style="margin-left: 10px"
                class="btn sp-btn-submit">Update</button>
        </div>
    </section>
</div>
<script>
    $(function () {
        $('#btnPasswordChange').click((e) => {
            if ($('#pw_old').val() == '' || $('#pw_new').val() == '' || $('#pw_confirm').val() == '') {
                toastr.error(`Please fill input`);
                return;
            }

            let params = {
                oldPw: $('#pw_old').val(),
                newPw: $('#pw_new').val(),
                rePw: $('#pw_confirm').val()
            }
            $.post(`${baseUrl}/API/actionChangePassword`, params, function (data) {
                if (data.code != 200) {
                    toastr.error(`${data.message ? data.message : "Error while change password "} Code: 400`);
                    return;
                }
                toastr.success("Password changed successfully!");
                $('#pw_old').val("");
                $('#pw_new').val("");
                $('#pw_confirm').val("");
            });
        });
    });
</script>