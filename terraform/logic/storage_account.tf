resource "azurerm_storage_account" "storageaccount" {
  name                     = "storageaccountparcialdev"
  resource_group_name      = azurerm_resource_group.resource_group.name
  location                 = azurerm_resource_group.resource_group.location
  account_tier             = "Standard"
  account_replication_type = "LRS"
}

resource "azurerm_storage_container" "storagecontainerdocuments" {
  name                  = "storagecontainerdocuments"
  storage_account_name  = "storageaccount"
  container_access_type = "private"
}

resource "azurerm_storage_container" "storagecontainermedia" {
  name                  = "storagecontainermedia"
  storage_account_name  = "storageaccount"
  container_access_type = "private"
}
