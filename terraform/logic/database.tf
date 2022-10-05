resource "azurerm_mssql_server" "mssql_server" {
  name                         = "${local.naming_convention}-mssql-server"
  resource_group_name          = azurerm_resource_group.resource_group.name
  location                     = azurerm_resource_group.resource_group.location
  version                      = "12.0"
  administrator_login          = "4dministrat0r"
  administrator_login_password = "P4ssw0rd1234"
}
resource "azurerm_mssql_firewall_rule" "mssql_firewall_rule" {
  name             = "FirewallRule1"
  server_id        = azurerm_mssql_server.mssql_server.id
  start_ip_address = "0.0.0.0"
  end_ip_address   = "255.255.255.255"
}
resource "azurerm_mssql_database" "mssql_database" {
  name           = "${local.naming_convention}-mssql-db"
  server_id      = azurerm_mssql_server.mssql_server.id
  max_size_gb    = 250
  read_scale     = false
  zone_redundant = true
  storage_account_type = "ZRS"
  threat_detection_policy {
    state                      = "Enabled"
    storage_endpoint = azurerm_storage_account.storage_account.primary_blob_endpoint
    storage_account_access_key = azurerm_storage_account.storage_account.primary_access_key
  }

}