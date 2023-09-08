<div class="content-wrapper">
    <section class="content">
        <div class="container-fluid">
            <div class="row">
                <div class="col-md-12">
                    <div class="card mt-4">
                        <div id="div_loading" class="overlay-wrapper">
                            <div class="overlay sp-overlay-bg">
                                <img src="<?php echo base_url(); ?>assets/images/spinner.svg">
                            </div>
                        </div>
                        <div class="card-header">
                            <h3 class="card-title">Edit Category</h3>
                        </div>
                        <div class="card-body">
                            <form method="POST" enctype="multipart/form-data" id="categoryThumbForm">
                                <input name="thumbnail" type="file" id="categoryThumbnail"
                                    accept="image/png, image/jpeg" style="display: none;" />
                                <img id="categoryAddThumbnail" src="<?php echo base_url() . $info->image; ?>"
                                    class="sp-news-thumbnail" />
                            </form>
                            <div class="row">
                                <div class="col-md-12">
                                    <div class="form-group">
                                        <label for="exampleInputEmail1">Name</label>
                                        <input type="hidden" id="catId" value="<?php echo $info->id;?>"/>
                                        <input type="text" class="form-control" autocomplete="off" placeholder="Name"
                                            id="name" name="name" value="<?php echo $info->name; ?>" required>
                                    </div>
                                </div>

                                <div class="col-md-3">
                                    <input type="checkbox" id="premium" style="margin-right:4px" <?php echo $info->is_free == 1 ? "checked": "";?>> Premium</input>
                                </div>
                            </div>
                        </div>
                        <div class="card-footer clearfix">
                            <button data-type="country" id="btnCreate" class="btn sp-btn-submit">Update</button>
                        </div>
                    </div>
                </div>
            </div>
        </div><!-- /.container-fluid -->
    </section>
    <!-- /.content -->
</div>

<script src="<?php echo base_url(); ?>assets/js/admin/category/edit.js"></script>