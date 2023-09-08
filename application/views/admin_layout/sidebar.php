<aside class="main-sidebar sidebar-dark-primary elevation-4">
    
  <div class="sidebar">
    <!-- Sidebar user (optional) -->
    <div class="user-panel mt-3 pb-3 mb-3 d-flex">
      <div class="image">
        <img src="<?php echo base_url(); ?>/assets/images/avatar.png" class="img-circle elevation-2" alt="User Image">
      </div>
      <div class="info">
        <a href="#" class="d-block">
          Admin
        </a>
      </div>
    </div>

    <!-- Sidebar Menu -->
    <nav class="mt-2">
      <ul class="nav nav-pills nav-sidebar flex-column nav-child-indent nav-legacy" data-widget="treeview" role="menu"
        data-accordion="false">

        <li class="nav-item">
          <a href="<?php echo base_url(); ?>index.php/Admin/category/"
            class="nav-link <?php echo $this->utils->startsWith($page, "category") ? "active" : "" ?>">
            <i class="sidebar-icon nav-icon fa fa-tags"></i>
            <p>
              Category
            </p>
          </a>
        </li>

        <li class="nav-item">
          <a href="<?php echo base_url(); ?>index.php/Admin/presets/"
            class="nav-link <?php echo $this->utils->startsWith($page, "preset") ? "active" : "" ?>">
            <i class="sidebar-icon nav-icon fa fa-image"></i>
            <p>
              Preset
            </p>
          </a>
        </li>
      </ul>
    </nav>
    <!-- /.sidebar-menu -->
  </div>
  <!-- /.sidebar -->
</aside>