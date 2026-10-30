resource "mongodbatlas_project" "app" {
  name   = var.name
  org_id = var.atlas_org_id
}

resource "mongodbatlas_advanced_cluster" "app" {
  project_id   = mongodbatlas_project.app.id
  name         = var.name
  cluster_type = "REPLICASET"

  replication_specs = [{
    region_configs = [{
      provider_name         = "TENANT"
      backing_provider_name = "AWS"
      region_name           = var.atlas_region
      priority              = 7
      electable_specs = {
        instance_size = "M0"
      }
    }]
  }]
}

resource "random_password" "db" {
  length  = 32
  special = false
}

resource "mongodbatlas_database_user" "app" {
  project_id         = mongodbatlas_project.app.id
  auth_database_name = "admin"
  username           = "${var.name}-app"
  password           = random_password.db.result

  roles {
    role_name     = "readWrite"
    database_name = var.atlas_database_name
  }

  scopes {
    name = mongodbatlas_advanced_cluster.app.name
    type = "CLUSTER"
  }
}

resource "mongodbatlas_project_ip_access_list" "droplet" {
  project_id = mongodbatlas_project.app.id
  ip_address = digitalocean_droplet.app.ipv4_address
  comment    = "Saida do droplet ${var.name}"
}
