resource "azurerm_storage_account" "storage_account" {
  name                     = "bucketmidterm1parcial"
  resource_group_name      = azurerm_resource_group.resource_group.name
  location                 = azurerm_resource_group.resource_group.location
  account_tier             = "Standard"
  account_replication_type = "LRS"
}

resource "azurerm_storage_container" "storage_container_documents" {
  name                  = "documents"
  storage_account_name  = azurerm_storage_account.storage_account.name
  container_access_type = "private"
}

resource "azurerm_storage_container" "storage_container_media" {
  name                  = "media"
  storage_account_name  = azurerm_storage_account.storage_account.name
  container_access_type = "private"
}