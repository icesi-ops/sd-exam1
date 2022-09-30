resource "azurerm_mssql_server" "mssql_server" {
  name                         = "${local.naming_convention}-mssql-server"
  resource_group_name          = azurerm_resource_group.resource_group.name
  location                     = azurerm_resource_group.resource_group.location
  version                      = "12.0"
  administrator_login          = "4dministrat0r"
  administrator_login_password = "P@ssw0rd1234"
}

resource "azurerm_mssql_database" "mssql_database" {
  name           = "${local.naming_convention}-mssql-db"
  server_id      = azurerm_mssql_server.mssql_server.id
  #collation      = "SQL_Latin1_General_CP1_CI_AS"
  #license_type   = "LicenseIncluded"
  max_size_gb    = 250
  read_scale     = false
  #sku_name       = "BC_Gen5_2"
  zone_redundant = true
  storage_account_type = "ZRS"
  threat_detection_policy { //enable Microsoft Defender for SQL 
    state                      = "Enabled"
    storage_endpoint = azurerm_storage_account.storageaccount.primary_blob_endpoint
    storage_account_access_key = azurerm_storage_account.storageaccount.primary_access_key
  }
  #max_size_gb    = 2
  #read_scale     = true
  #sku_name       = "S0"
  #zone_redundant = true

}