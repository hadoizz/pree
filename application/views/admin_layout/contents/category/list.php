<div class="content-wrapper">
  <!-- Main content -->
  <section class="content">
    <div class="container-fluid">
      <div class="row">
        <div class="col-md-12">
          <div class="card mt-4 sp-table-height">
            <div class="card-header">
              <h3 class="card-title">Category</h3>
              <div class="card-tools">
                <a href="<?php echo base_url(); ?>index.php/Admin/categoryAdd" class="btn btn-tool sidebar-icon"
                  title="Add Category">
                  <i class="fa fa-plus"></i>
                </a>
              </div>
            </div>
            <!-- /.card-header -->
            <div class="card-body">
              <table class="table table-bordered">
                <thead>
                  <tr>
                    <th style="width: 10px">ID</th>
                    <th>Image</th>
                    <th>Name</th>
                    <th class="sp-table-item-center" style="width: 150px">Actions</th>
                  </tr>
                </thead>
                <tbody id="table_content">
                  <?php
                  foreach ($datas as $data) {
                    ?>
                    <tr class="sp-table-item">
                      <td>
                        <?php echo $data->id; ?>
                      </td>
                      <td class="text-center">
                        <?php echo '<img src="' . base_url() . $data->image . '" class="img-circle elevation-2 sp-table-image">'; ?>
                      </td>
                      <td>
                        <?php echo $data->name; ?>
                      </td>
                      <td class="sp-table-item-center">
                        <a href="<?php echo base_url() . "Admin/categoryEdit/" . $data->id; ?>"
                          class="btn btn-table-action btn-sm">
                          <i class="fa fa-pencil"></i>
                        </a>

                        <button id="" class="btn btn-table-action btn-sm"
                          onclick="onClickDelete(<?php echo $data->id; ?>)">
                          <i class="fa fa-trash"></i>
                        </button>
                      </td>
                    </tr>
                    <?php
                  }
                  ?>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div><!-- /.container-fluid -->
  </section>
  <!-- /.content -->
</div>

<script>
  function onClickDelete(id) {
    if (confirm("Are you sure?")) {
      location.href = "<?php echo base_url(); ?>index.php/Admin/deleteCategory/" + id;
    }
  }
</script>