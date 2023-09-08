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
                            <h3 class="card-title">New Preset</h3>
                        </div>
                        <div class="card-body">
                            <form method="POST" enctype="multipart/form-data" id="presetThumbForm" style="text-align: center;display: flex;justify-content: center;">
                                    <input name="thumbnail" type="file" id="presetThumbnail" accept="image/png, image/jpeg"
                                    style="display: none;" />

                                    <input name="thumbnail1" type="file" id="presetThumbnail1" accept="image/png, image/jpeg"
                                    style="display: none;" />

                                    <input name="thumbnail2" type="file" id="presetThumbnail2" accept=".dng"
                                    style="display: none;" />

                                    <div style="width: 30%">
                                        <p>After</p>
                                        <img id="presetAddThumbnail" style="width: 200px;height:200px;" src="<?php echo base_url(); ?>assets/images/addimg.png"
                                    class="sp-news-thumbnail" />
                                    </div>

                                    <div style="width: 30%">
                                    <p>Before</p>
                                        <img id="presetAddThumbnail1" style="width: 200px;height:200px;"  src="<?php echo base_url(); ?>assets/images/addimg.png"
                                    class="sp-news-thumbnail" />
                                    </div>

                                    <div style="width: 30%">
                                    <p>Dng</p>
                                    <img id="presetAddThumbnail2" style="width: 200px;height:200px;"  class="sp-news-thumbnail" />
                                    </div>
                            </form>
                            <div class="row">                                
                                <div class="col-md-12">
                                    <div class="form-group">
                                        <label for="exampleInputEmail1">Name</label>
                                        <input type="text" class="form-control" autocomplete="off" placeholder="Name"
                                            id="name" name="name" required>
                                    </div>
                                </div>

                                <div class="col-md-12">
                                    <div class="form-group">
                                        <label for="exampleInputEmail1">Usage</label>
                                        <textarea class="form-control" id="usage" name="usage"></textarea>
                                    </div>
                                </div>

                                <div class="col-md-12">
                                    <div class="form-group">
                                        <label for="exampleInputEmail1">Category</label>
                                        <select class="form-control" name="category" id="category">
                                            <option value="0">None</option>
                                            <?php
                                                foreach($categorys as $ca) {
                                                    ?>
                                                    <option value="<?php echo $ca->id;?>"><?php echo $ca->name;?></option>
                                                    <?php
                                                }
                                            ?>
                                        </select>
                                    </div>
                                </div>

                                <div class="col-md-3">
                                    <input type="checkbox" id="premium" style="margin-right:4px"> Premium</input>
                                </div>

                                <div class="col-md-3">
                                    <input type="checkbox" id="feature" style="margin-right:4px"> Featured</input>
                                </div>
                                <div class="col-md-3">
                                    <input type="checkbox" id="discover" style="margin-right:4px"> Discover</input>
                                </div>
                            </div>
                        </div>
                        <div class="card-footer clearfix">
                            <button data-type="country" id="btnCreate" class="btn sp-btn-submit">Create</button>
                        </div>
                    </div>
                </div>
            </div>
        </div><!-- /.container-fluid -->
    </section>
    <!-- /.content -->
</div>

<script src="<?php echo base_url(); ?>assets/js/admin/preset/add.js"></script>