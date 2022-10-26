resource "azurerm_mssql_server" "mssql_server" {
  name                = "distri-aja-sql-server-two"
  location            = azurerm_resource_group.resource_group.location
  resource_group_name = azurerm_resource_group.resource_group.name
  version                      = "12.0"
  administrator_login          = "distribuidos"
  administrator_login_password = "AlejandraJhoanAndres212021"

}

resource "azurerm_mssql_firewall_rule" "mssql_firewall_rule" {
  name             = "FirewallRule"
  server_id        = azurerm_mssql_server.mssql_server.id
  start_ip_address = "0.0.0.0"
  end_ip_address   = "255.255.255.255"
}

resource "azurerm_mssql_database" "azurerm_mssql_database" {
 name           = "${local.naming_convention}-mssql-db"
  server_id      = azurerm_mssql_server.mssql_server.id
  max_size_gb    = 250
  read_scale     = false
  zone_redundant = true
  storage_account_type = "ZRS"

}

