output "reserved_ip" {
  description = "IP fixo de entrada. Use como DROPLET_HOST."
  value       = digitalocean_reserved_ip.app.ip_address
}

output "droplet_ipv4" {
  description = "IP de saída do droplet. Libere este no Network Access do Atlas."
  value       = digitalocean_droplet.app.ipv4_address
}

output "site_address" {
  description = "Hostname HTTPS sem domínio próprio."
  value       = "${replace(digitalocean_reserved_ip.app.ip_address, ".", "-")}.sslip.io"
}

output "mongodb_uri" {
  description = "Use como secret MONGODB_URI. Ver com: terraform output -raw mongodb_uri"
  value = format(
    "mongodb+srv://%s:%s@%s/%s?retryWrites=true&w=majority",
    mongodbatlas_database_user.app.username,
    random_password.db.result,
    trimprefix(mongodbatlas_advanced_cluster.app.connection_strings.standard_srv, "mongodb+srv://"),
    var.atlas_database_name,
  )
  sensitive = true
}

output "ssh" {
  value = "ssh -i ~/.ssh/notasegura_deploy deploy@${digitalocean_reserved_ip.app.ip_address}"
}
