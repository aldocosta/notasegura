variable "name" {
  description = "Prefixo dos recursos."
  type        = string
  default     = "notasegura"
}

variable "region" {
  description = "Região do droplet. NYC fica perto do Atlas em US_EAST_2."
  type        = string
  default     = "nyc3"
}

variable "droplet_size" {
  description = "Slug do tamanho do droplet."
  type        = string
  default     = "s-1vcpu-2gb"
}

variable "ssh_public_key_path" {
  description = "Chave pública usada pelo usuário deploy (e pelo GitHub Actions)."
  type        = string
  default     = "~/.ssh/notasegura_deploy.pub"
}

variable "ssh_allowed_cidrs" {
  description = "Origens liberadas na porta 22. Runners do GitHub não têm IP fixo."
  type        = list(string)
  default     = ["0.0.0.0/0", "::/0"]
}

variable "swap_size_bytes" {
  description = "Tamanho do swapfile."
  type        = number
  default     = 2147483648
}

variable "atlas_client_id" {
  description = "Client ID do Service Account do Atlas."
  type        = string
  sensitive   = true
}

variable "atlas_client_secret" {
  description = "Client secret do Service Account do Atlas."
  type        = string
  sensitive   = true
}

variable "atlas_org_id" {
  description = "ID da organização no Atlas."
  type        = string
}

variable "atlas_region" {
  description = "Região AWS do cluster M0. US_EAST_1 fica perto de NYC."
  type        = string
  default     = "US_EAST_1"
}

variable "atlas_database_name" {
  description = "Banco usado pelo backend."
  type        = string
  default     = "safenote"
}
